export default {
    async fetch(req, env, ctx) {
        const incoming = new URL(req.url);

        // Only handle /bookdle path; anything else passes through untouched
        if (!incoming.pathname.startsWith('/bookdle')) {
            return new Response('Not handled by worker', { status: 404 });
        }

        // Normalize: /bookdle -> /bookdle/
        if (incoming.pathname === '/bookdle') {
            return Response.redirect(`${incoming.origin}/bookdle/`, 301);
        }

        // Build upstream URL to GitHub Pages
        const upstream = new URL(req.url);
        upstream.protocol = 'https:';                                // GitHub Pages is HTTPS
        upstream.hostname = 'loganintech.github.io';                 // <-- change this
        // Strip the /bookdle prefix but keep trailing path + query
        upstream.pathname = incoming.pathname.replace(/^\/bookdle/, '/bookdle');

        // Forward request with original method/headers/body but set Host for GH Pages
        const init = new Request(upstream.toString(), req);
        const resp = await fetch(init, {
            headers: { ...Object.fromEntries(req.headers), host: 'loganintech.github.io' }
        });

        // Optional SPA fallback: if 404, try /bookdle/index.html
        if (resp.status === 404 && !incoming.pathname.endsWith('/index.html')) {
            const fallback = new URL('/bookdle/index.html', upstream);
            return fetch(new Request(fallback.toString(), req));
        }

        // Pass-through (keeps ETags, caching headers, etc.)
        return resp;
    }
}
