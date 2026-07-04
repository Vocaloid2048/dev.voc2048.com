/**
 * 自訂 HTTPS Server — 同時監聯 HTTP (重定向) 與 HTTPS。
 * Custom HTTPS server — listens on both HTTP (redirect) and HTTPS.
 *
 * 用於 Docker 部署，支援 SSL 憑證。
 * Used for Docker deployment with SSL certificate support.
 */
const { createServer: createHttpsServer } = require("https");
const { createServer: createHttpServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT_HTTP = parseInt(process.env.PORT || "3000", 10);
const PORT_HTTPS = 8443;

const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "./cert/fullchain.pem";
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || "./cert/privkey.pem";

app.prepare().then(() => {
  // 檢查 SSL 憑證是否存在
  const hasCert = fs.existsSync(SSL_CERT_PATH) && fs.existsSync(SSL_KEY_PATH);

  if (hasCert && !dev) {
    // HTTPS 模式
    const httpsOptions = {
      cert: fs.readFileSync(SSL_CERT_PATH),
      key: fs.readFileSync(SSL_KEY_PATH),
    };

    createHttpsServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(PORT_HTTPS, () => {
      console.log(`🚀 HTTPS Server running on https://localhost:${PORT_HTTPS}`);
    });

    // HTTP → HTTPS 重定向
    createHttpServer((req, res) => {
      const host = req.headers.host || `localhost:${PORT_HTTP}`;
      const httpsHost = host.replace(`:${PORT_HTTP}`, `:${PORT_HTTPS}`);
      res.writeHead(301, {
        Location: `https://${httpsHost}${req.url}`,
      });
      res.end();
    }).listen(PORT_HTTP, () => {
      console.log(`↩️  HTTP redirect server running on http://localhost:${PORT_HTTP} → https`);
    });
  } else {
    // 純 HTTP 模式 (開發或無憑證)
    createHttpServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(PORT_HTTP, () => {
      console.log(`🚀 HTTP Server running on http://localhost:${PORT_HTTP}`);
      if (!hasCert && !dev) {
        console.warn("⚠️  SSL 憑證未找到，以 HTTP 模式運行。請配置 ./cert/ 目錄。");
      }
    });
  }
});
