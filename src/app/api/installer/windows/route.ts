import { createReadStream, statSync } from 'fs'
import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const DEFAULT_INSTALLER_PATH =
  '/home/ubuntu/sast/SAST.ai-Setup-0.0.72.exe'

export async function GET() {
  const filePath =
    process.env.SAST_WINDOWS_INSTALLER_PATH ?? DEFAULT_INSTALLER_PATH

  try {
    const stat = statSync(filePath)
    const nodeStream = createReadStream(filePath)
    const webStream = Readable.toWeb(nodeStream)

    return new NextResponse(webStream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': String(stat.size),
        'Content-Disposition':
          'attachment; filename="SAST.ai-Setup-0.0.72.exe"',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Windows installer file is not available on this server.' },
      { status: 404 },
    )
  }
}
