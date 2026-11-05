// Local CONNECT forwarder for Chromium.
//
// Chromium cannot authenticate to the egress proxy on its own (it waits for a
// 407 that never comes / ignores userinfo in --proxy-server). This forwarder
// accepts unauthenticated CONNECTs from localhost only and re-issues them to
// the egress proxy with a preemptive Proxy-Authorization header, exactly like
// curl does. Credentials are read from env at runtime and never logged or
// written anywhere.
const http = require('http');
const net = require('net');

const upstream = new URL(process.env.HTTPS_PROXY || process.env.https_proxy);
const auth = Buffer.from(
  `${decodeURIComponent(upstream.username)}:${decodeURIComponent(upstream.password)}`
).toString('base64');
const upstreamHost = upstream.hostname;
const upstreamPort = Number(upstream.port || 3128);

const server = http.createServer();
server.on('connect', (req, clientSocket, head) => {
  const proxySocket = net.connect(upstreamPort, upstreamHost, () => {
    proxySocket.write(
      `CONNECT ${req.url} HTTP/1.1\r\nHost: ${req.url}\r\nProxy-Authorization: Basic ${auth}\r\nProxy-Connection: keep-alive\r\n\r\n`
    );
  });
  let established = false;
  let buf = Buffer.alloc(0);
  const onProxyData = (chunk) => {
    if (established) return;
    buf = Buffer.concat([buf, chunk]);
    const idx = buf.indexOf('\r\n\r\n');
    if (idx === -1) return;
    const headStr = buf.slice(0, idx).toString();
    if (/^HTTP\/1\.[01] 200/.test(headStr)) {
      established = true;
      const rest = buf.slice(idx + 4);
      // Stop manual forwarding BEFORE piping, or every byte is written twice.
      proxySocket.removeListener('data', onProxyData);
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      // Bytes after the 200 headers are the origin server's first data
      // (e.g. TLS ServerHello) — they go to the CLIENT, not back upstream.
      if (rest.length) clientSocket.write(rest);
      if (head && head.length) proxySocket.write(head);
      proxySocket.pipe(clientSocket);
      clientSocket.pipe(proxySocket);
    } else {
      clientSocket.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
      proxySocket.destroy();
    }
  };
  proxySocket.on('data', onProxyData);
  proxySocket.on('error', () => clientSocket.destroy());
  clientSocket.on('error', () => proxySocket.destroy());
});
server.on('clientError', (err, socket) => socket.destroy());
server.listen(18080, '127.0.0.1', () => {
  console.log('forwarder listening on 127.0.0.1:18080');
});
