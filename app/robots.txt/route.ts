import { NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET() {
  return new NextResponse(
    ['User-agent: *', 'Allow: /', 'Sitemap: https://cvletterai.com/sitemap.xml'].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain'
      }
    }
  );
}
