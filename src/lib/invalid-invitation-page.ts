/** Guard before the framework attempts to decode route parameters. */
export function hasMalformedPathname(pathname: string): boolean {
  const segment = pathname.split("/").filter(Boolean).at(-1);
  if (!segment) return false;
  try {
    decodeURIComponent(segment);
    return false;
  } catch {
    return true;
  }
}

export function renderInvalidInvitationPage(): string {
  return `<!doctype html><html lang="en"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invitation not found</title><link rel="icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/apple-icon-180x180.png"><link rel="manifest" href="/manifest.json">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Jost:wght@400&display=swap">
    <style>body{margin:0;min-height:100svh;display:grid;place-items:center;background:oklch(.968 .014 84);color:oklch(.286 .049 42);font-family:Jost,sans-serif}main{text-align:center;padding:1.5rem}h1{font:400 2.25rem 'Cormorant Garamond',serif}p{font-size:.875rem;color:oklch(.552 .079 47)}a{display:inline-block;margin-top:1.5rem;border:1px solid oklch(.702 .086 78);padding:.75rem 1.25rem;color:inherit;text-decoration:none;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase}</style>
    </head><body><main><h1>Invitation not found</h1><p>This invitation link is invalid.</p><a href="/">Go home</a></main></body></html>`;
}
