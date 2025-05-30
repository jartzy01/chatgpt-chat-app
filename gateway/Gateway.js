/**
 * gateway/Gateway.js
 */

const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');

class Gateway {
    constructor(frontendPort, chatPort, autoPort, gatewayPort) {
        this.frontendPort = frontendPort;
        this.chatPort = chatPort; // port 3001
        this.autoPort = autoPort; // port 5001
        this.gatewayPort = gatewayPort; // port 8081

        this.app = express();
        this.proxy = httpProxy.createProxyServer({});
        this.setupMiddleware();
    }

    setupMiddleware() {
        this.app.use(cors()); 
        
        // 1) Automation API → Flask bridge
        this.app.use('/api/interpret-and-execute', (req, res) => {
            req.url = req.originalUrl.replace(/^\/api/, '');
            this.proxy.web(req, res, {
                target: `http://localhost:${this.autoPort}`,
                changeOrigin: true
            }, err => {
                console.error('Automation proxy error', err);
                res.status(502).send('Bad Gateway (automation)');
            });
        });
         // 2) Chat API → Node/Express
        this.app.use('/api/chat', (req, res) => {
            req.url = req.originalUrl.replace(/^\/api/, '');
            this.proxy.web(req, res, {
                target: `http://localhost:${this.chatPort}`,
                changeOrigin: true
            }, err => {
                console.error('Chat proxy error', err);
                res.status(502).send('Bad Gateway (chat)');
            });
        });
        // 3) Front-end dev server catch-all
        this.app.use('/', (req, res) => {
            this.proxy.web(req, res, {
                target: `http://localhost:${this.frontendPort}`,
                changeOrigin: true
            }, err => {
                console.error('Frontend proxy error', err);
                res.status(502).send('Bad Gateway (frontend)');
            });
        });
    }

    start(){
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.gatewayPort, () => {
                console.log(`Gateway running on port ${this.gatewayPort}`);
                resolve();
            });
        });
    }

    stop() {
        if (this.server) this.server.close();
    }
}        

module.exports = Gateway;