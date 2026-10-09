const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
let port = Number(process.env.PORT) || 5173;
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end("Bad Request");
    return;
  }

  let filePath = path.resolve(root, `.${pathname}`);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    response.writeHead(404);
    response.end("Not Found");
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on("error", () => {
    if (!response.headersSent) {
      response.writeHead(404);
    }
    response.end("Not Found");
  });
  stream.on("open", () => {
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    if (request.method === "HEAD") {
      response.end();
      stream.destroy();
    } else {
      stream.pipe(response);
    }
  });
});

server.on("error", (error) => {
  if (!server.listening && error.code === "EADDRINUSE" && port < 65535) {
    const previousPort = port;
    port += 1;
    console.warn(`Port ${previousPort} is already in use; trying ${port}.`);
    server.listen(port, "127.0.0.1");
    return;
  }

  console.error(`Development server failed: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Development server running at http://127.0.0.1:${port}`);
});
