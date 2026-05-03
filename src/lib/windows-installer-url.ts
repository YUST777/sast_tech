/**
 * Canonical HTTPS URL for the Windows installer on your VPS nginx.
 *
 * Prefer `NEXT_PUBLIC_WINDOWS_INSTALLER_URL` in Vercel until Cloudflare sends
 * `download.sast.tech` to this server (DNS A → origin IP).
 */
export const WINDOWS_INSTALLER_URL =
    process.env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL ??
    process.env.WINDOWS_INSTALLER_PUBLIC_URL ??
    "https://download.sast.tech/installer.exe"
