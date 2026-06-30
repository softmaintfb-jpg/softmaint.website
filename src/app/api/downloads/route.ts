import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'public', 'files')
    
    // Check if directory exists
    try {
      await fs.access(dirPath)
    } catch {
      return NextResponse.json([])
    }

    const files = await fs.readdir(dirPath)
    const fileList = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(dirPath, filename)
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

    // Sort by name (Supremo first or alphabetical)
    fileList.sort((a, b) => {
      // Put Supremo first if it exists, otherwise alphabetical
      if (a.name.toLowerCase().includes('supremo')) return -1
      if (b.name.toLowerCase().includes('supremo')) return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(fileList)
  } catch (error) {
    console.error('Error listing download files:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
