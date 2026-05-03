import { createReadStream, statSync } from 'fs'
import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'

import { WINDOWS_INSTALLER_URL } from '@/lib/windows-installer-url'

export const runtime = 'nodejs'

/** Default on self-hosted VM (e.g. Ubuntu on EC2) when `SAST_WINDOWS_INSTALLER_PATH` is unset */
const DEFAULT_INSTALLER_PATH =
  '/home/ubuntu/sast/SAST.ai-Setup-0.0.72.exe'

/**
 * - `SAST_WINDOWS_INSTALLER_URL` — optional HTTPS URL; redirects (useful on serverless/Vercel).
 * - Else streams from disk: `SAST_WINDOWS_INSTALLER_PATH` or the default ubuntu path below.
 */
export async function GET() {
  const remoteUrl = process.env.SAST_WINDOWS_INSTALLER_URL?.trim()
  if (remoteUrl && /^https?:\/\//i.test(remoteUrl)) {
    return NextResponse.redirect(remoteUrl, 307)
  }

  const filePath =
    process.env.SAST_WINDOWS_INSTALLER_PATH?.trim() ?? DEFAULT_INSTALLER_PATH

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
    return NextResponse.redirect(WINDOWS_INSTALLER_URL, 307)
  }
}
