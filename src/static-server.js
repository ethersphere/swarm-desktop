const handler = require('serve-handler')
const http = require('http')

function serveDirectory(directory, port) {
    const server = http.createServer((request, response) => {
        return handler(request, response, { public: `static/${directory}`, directoryListing: false })
    })
    server.listen(port, () => {
        console.log(`Running at http://127.0.0.1:${port}`)
    })
}

function main() {
    serveDirectory('dashboard', 5000)
    serveDirectory('installer', 5002)
}

module.exports = {
    runStaticServer: main
}
