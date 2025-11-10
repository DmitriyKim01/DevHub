import crypto from 'crypto';

export function generateCode(min: number, max: number) {
  return String(crypto.randomInt(min, max));
}

export function hashCode(code: string) {
  return crypto.createHash('sha256').update(code).digest('base64url');
}

export function compareHashCode(inputCode: string, storedHash: string) {
  const inputHash = hashCode(inputCode);
  const a = Buffer.from(inputHash);
  const b = Buffer.from(storedHash);

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function buildVerificationEmail(opts: {
  code: string;
  appName?: string;
  expiresMinutes?: number;
  supportEmail?: string;
}) {
  const app = opts.appName ?? 'Your App';
  const exp = opts.expiresMinutes ?? 15;
  const support = opts.supportEmail ?? 'support@example.com';
  const subject = `${app} verification code: ${opts.code}`;

  const text = `${app}
Your verification code: ${opts.code}

This code expires in ${exp} minutes.
If you didn’t request this, ignore this email or contact ${support}.`;

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${subject}</title>
    <style>
      @media (prefers-color-scheme: dark) {
        .bg { background:#0b0f17 !important; }
        .card { background:#111827 !important; border-color:#1f2937 !important; }
        .text { color:#e5e7eb !important; }
        .muted { color:#9ca3af !important; }
        .btn { background:#2563eb !important; color:#ffffff !important; }
        .code { background:#0b1220 !important; color:#e5e7eb !important; }
      }
    </style>
  </head>
  <body class="bg" style="margin:0;padding:0;background:#f3f4f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
            <tr>
              <td class="card" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px 24px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="text" style="font-family:ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111827;">
                      <h1 style="margin:0 0 8px;font-weight:700;font-size:20px;line-height:28px;">Verify your email</h1>
                      <p class="muted" style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:22px;">
                        Use the code below to verify your email for <strong>${app}</strong>.
                      </p>

                      <div class="code" style="text-align:center;margin:16px 0 8px;padding:16px;border-radius:10px;background:#f9fafb;border:1px dashed #e5e7eb;">
                        <div style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                                    font-size:28px;line-height:36px;letter-spacing:6px;font-weight:700;">
                          ${opts.code}
                        </div>
                      </div>

                      <p class="muted" style="margin:0 0 8px;color:#6b7280;font-size:13px;">
                        Expires in ${exp} minutes.
                      </p>

                      <p class="muted" style="margin:16px 0 0;color:#6b7280;font-size:12px;">
                        Didn’t request this? Ignore this email or contact <a href="mailto:${support}" style="color:#2563eb;text-decoration:none;">${support}</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:12px 8px;">
                <p class="muted" style="margin:0;color:#9ca3af;font-family:ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial;font-size:12px;">
                  © ${new Date().getFullYear()} ${app}
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

  return { subject, text, html };
}
