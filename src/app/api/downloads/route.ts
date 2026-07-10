import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import pregeneratedDownloads from '@/lib/pregenerated-downloads.json'

const execAsync = promisify(exec)

async function resolveLnkShortcut(lnkPath: string): Promise<string | null> {
  if (process.platform !== 'win32') {
    return null
  }
  try {
    const escapedPath = lnkPath.replace(/'/g, "''")
    const command = `powershell -NoProfile -Command "$s = New-Object -ComObject WScript.Shell; $l = $s.CreateShortcut('${escapedPath}'); Write-Output $l.TargetPath"`
    const { stdout } = await execAsync(command)
    return stdout.trim()
  } catch (err) {
    console.error('Error resolving .lnk file:', err)
    return null
  }
}

async function resolveUrlShortcut(urlPath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(urlPath, 'utf8')
    const match = content.match(/^URL=(.*)/mi)
    return match ? match[1].trim() : null
  } catch (err) {
    console.error('Error resolving .url file:', err)
    return null
  }
}

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(pregeneratedDownloads)
  }
  try {
    const filesDirPath = path.join(process.cwd(), 'public', 'files')
    const linksDirPath = path.join(process.cwd(), 'public', 'links')

    // 1. Process files from public/files
    let fileList: any[] = []
    try {
      await fs.access(filesDirPath)
      const files = await fs.readdir(filesDirPath)
      fileList = await Promise.all(
        files.map(async (filename) => {
          const filePath = path.join(filesDirPath, filename)
          const stats = await fs.stat(filePath)
          const ext = path.extname(filename).toLowerCase().replace('.', '')
          
          return {
            name: filename,
            path: `/files/${filename}`,
            size: stats.size,
            ext,
            lastModified: stats.mtime.toISOString(),
          }
        })
      )
    } catch {
      console.warn('public/files directory not accessible')
    }

    // Sort files by name (Supremo first or alphabetical)
    fileList.sort((a, b) => {
      if (a.name.toLowerCase().includes('supremo')) return -1
      if (b.name.toLowerCase().includes('supremo')) return 1
      return a.name.localeCompare(b.name)
    })

    // 2. Process links from public/links
    let linkList: any[] = []
    try {
      await fs.access(linksDirPath)
      const links = await fs.readdir(linksDirPath)
      
      // Load optional metadata
      let metadata: Record<string, any> = {}
      try {
        const metadataPath = path.join(linksDirPath, 'metadata.json')
        const metadataContent = await fs.readFile(metadataPath, 'utf8')
        metadata = JSON.parse(metadataContent)
      } catch {
        // No metadata or invalid JSON, ignore
      }

      const linkFiles = links.filter(filename => filename !== 'metadata.json')

      linkList = await Promise.all(
        linkFiles.map(async (filename) => {
          const filePath = path.join(linksDirPath, filename)
          const stats = await fs.stat(filePath)
          const shortcutExt = path.extname(filename).toLowerCase().replace('.', '')
          
          let targetPath: string | null = null
          if (shortcutExt === 'url') {
            targetPath = await resolveUrlShortcut(filePath)
          } else if (shortcutExt === 'lnk') {
            targetPath = await resolveLnkShortcut(filePath)
          }

          const isExternal = !!(targetPath && (targetPath.startsWith('http://') || targetPath.startsWith('https://')))
          let downloadPath = targetPath || ''
          
          if (!isExternal && shortcutExt === 'lnk') {
            downloadPath = `/api/downloads/download-link?name=${encodeURIComponent(filename)}`
          }

          // Get target file size and actual extension if it's local
          let size = 0
          let ext = shortcutExt
          if (targetPath && !isExternal) {
            try {
              const targetStats = await fs.stat(targetPath)
              size = targetStats.size
              ext = path.extname(targetPath).toLowerCase().replace('.', '')
            } catch {
              // Target file not found locally or inaccessible
            }
          }

          // Get metadata details
          const fileMeta = metadata[filename] || {}
          
          const cleanName = filename
            .replace(/\.[^/.]+$/, '') // remove ext
            .replace(/[_-]/g, ' ') // replace hyphens and underscores
          const defaultTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1)

          return {
            name: filename,
            titleIT: fileMeta.titleIT || defaultTitle,
            titleEN: fileMeta.titleEN || defaultTitle,
            descriptionIT: fileMeta.descriptionIT || `Collegamento per ${defaultTitle}.`,
            descriptionEN: fileMeta.descriptionEN || `Link for ${defaultTitle}.`,
            category: fileMeta.category || 'altro',
            badgeIT: fileMeta.badgeIT || (isExternal ? 'Esterno' : 'Link'),
            badgeEN: fileMeta.badgeEN || (isExternal ? 'External' : 'Link'),
            path: downloadPath,
            size,
            ext,
            isExternal,
            lastModified: stats.mtime.toISOString(),
          }
        })
      )
    } catch (err) {
      console.warn('public/links directory not accessible or error processing links:', err)
    }

    return NextResponse.json({
      files: fileList,
      links: linkList
    })
  } catch (error) {
    console.error('Error listing download files:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

