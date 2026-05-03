import { createReadStream, statSync } from 'fs'
import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Hosted installer (recommended for serverless — Vercel, etc.): public HTTPS URL that
 * returns the `.exe`. Set in prod (e.g. Supabase Storage, S3, R2, GitHub Releases asset).
 *
 * Self-hosted VM/Docker only: filesystem path readable by Node.
 *
 * Prefer URL over path — path is absent on most cloud deploys.
 */
export async function GET() {
  const remoteUrl = process.env.SAST_WINDOWS_INSTALLER_URL?.trim()
  if (remoteUrl && /^https?:\/\//i.test(remoteUrl)) {
    return NextResponse.redirect(remoteUrl, 307)
  }

  const filePath = process.env.SAST_WINDOWS_INSTALLER_PATH?.trim()
  if (!filePath) {
    return NextResponse.json(
      {
        error:
          'Windows installer file is not available on this server. Set SAST_WINDOWS_INSTALLER_URL (HTTPS URL to the .exe in your dashboard host) or SAST_WINDOWS_INSTALLER_PATH on a VPS/dedicated host.',
      },
      { status: 503 },
    )
  }

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
      {
        error: `Windows installer not found at SAST_WINDOWS_INSTALLER_PATH: ${filePath}`,
      },
      { status: 404 },
    )
  }
}
