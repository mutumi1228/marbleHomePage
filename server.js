const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url);
    if (filePath.endsWith('/')) {
        filePath = path.join(filePath, 'index.html');
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.glb': 'model/gltf-binary',
        '.gltf': 'model/gltf+json',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('404 - File Not Found: ' + filePath);
            } else {
                res.writeHead(500);
                res.end('Error: ' + err);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
