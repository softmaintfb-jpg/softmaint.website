import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

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
    console.error('Error resolving .lnk file in download endpoint:', err)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 })
    }

    const linksDir = path.join(process.cwd(), 'public', 'links')
    const lnkPath = path.resolve(linksDir, name)

    const relative = path.relative(linksDir, lnkPath)
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    try {
      await fsPromises.access(lnkPath)
    } catch {
      return NextResponse.json({ error: 'Shortcut not found' }, { status: 404 })
    }

    const targetPath = await resolveLnkShortcut(lnkPath)
    if (!targetPath) {
      return NextResponse.json({ error: 'Could not resolve shortcut target' }, { status: 404 })
    }
    try {
      const stats = await fsPromises.stat(targetPath)
      if (stats.isDirectory()) {
        return NextResponse.json({ error: 'Target is a directory' }, { status: 400 })
      }

      const filename = path.basename(targetPath)

      const fileStream = new ReadableStream({
        start(controller) {
          const nodeStream = fs.createReadStream(targetPath)
          nodeStream.on('data', (chunk) => controller.enqueue(chunk))
          nodeStream.on('end', () => controller.close())
          nodeStream.on('error', (err) => controller.error(err))
        }
      })

      return new NextResponse(fileStream, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          'Content-Length': stats.size.toString(),
        }
      })

    } catch (err) {
      console.error(`Error accessing target file: ${targetPath}`, err)
      return NextResponse.json({ error: 'Target file not found or inaccessible' }, { status: 404 })
    }

  } catch (error) {
    console.error('Error in download-link API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
