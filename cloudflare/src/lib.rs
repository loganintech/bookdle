use worker::*;

#[event(fetch)]
async fn fetch(mut req: Request, _env: Env, _ctx: Context) -> Result<Response> {
    let url = req.url()?;
    let path = url.path();

    // Redirect root path to GitHub profile
    if path == "/" || path == "" {
        return Response::redirect(Url::parse("https://github.com/loganintech")?);
    }

    // Only handle /bookdle path; anything else returns 404
    if !path.starts_with("/bookdle") {
        return Response::error("Not handled by worker", 404);
    }

    // Normalize: /bookdle -> /bookdle/
    if path == "/bookdle" {
        return Response::redirect(url.join("/bookdle/")?);
    }

    // Proxy to GitHub Pages
    let mut upstream_url = url.clone();
    upstream_url.set_host(Some("loganintech.github.io"))?;

    let mut headers = req.headers().clone();
    headers.set("host", "loganintech.github.io")?;

    let mut init = RequestInit::new();
    init.with_method(req.method()).with_headers(headers);

    if let Some(body) = req.body() {
        init.with_body(Some(body));
    }

    let upstream_req = Request::new_with_init(&upstream_url.to_string(), &init)?;
    let mut resp = Fetch::Request(upstream_req).send().await?;

    // SPA fallback: if 404 and not already index.html, try it
    if resp.status_code() == 404 && !path.ends_with("/index.html") {
        let fallback_url = Url::parse("https://loganintech.github.io/bookdle/index.html")?;
        resp = Fetch::Url(fallback_url).send().await?;
    }

    Ok(resp)
}