const handler = require('serve-handler')
const http = require('http')

function main() {
    const port = 5000
    const server = http.createServer((request, response) => {
        return handler(request, response, { public: 'static', directoryListing: false })
    })
    server.listen(port, () => {
        console.log(`Running at http://127.0.0.1:${port}`)
    })
}

module.exports = {
    runStaticServer: main
}
