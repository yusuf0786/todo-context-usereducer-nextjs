export function GET() {
    const isProd = process.env.NODE_ENV === 'production';

    const content = `
User-agent: *
${isProd ? 'Disallow:' : 'Disallow: /'}

Sitemap: https://best-todos-app.vercel.app/sitemap.xml
`;

  return new Response(content.trim(), {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
