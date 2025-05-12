const express = require('express');
const httpProxy = require('http-proxy');

class Gateway {
    /**
     * @param {number} frontendPort - The port for the frontend dev server.
     * @param {number} backendPort - The port for the backend server.
     * @param {number} gatewayPort - The port for the gateway server.
     */
    constructor(frontendPort, backendPort, gatewayPort) {
        this.frontendPort = frontendPort;
        this.backendPort = backendPort;
        this.gatewayPort = gatewayPort;

        this.app = express();
        this.proxy = httpProxy.createProxyServer({});
        this.server = null;

        this.setupMiddleware();
    }

    setupMiddleware() {
        // 1) Proxy all /api/* to the backend
        this.app.use('/api', (req, res) => {
            console.log(`[GATEWAY ${this.gatewayPort}] → backend ${req.method} ${req.originalUrl}`);
            this.proxy.web(req, res, {
                target: `http://localhost:${this.backendPort}`
            }, err => {
                console.error(`[GATEWAY ${this.gatewayPort} ERROR] proxy to backend failed:`, err);
                res.status(502).send('Bad Gateway (backend)');
            });
        });

        // 2) Proxy everything else to the frontend
        this.app.use('/', (req, res) => {
            console.log(`[GATEWAY ${this.gatewayPort}] → frontend ${req.method} ${req.originalUrl}`);
            this.proxy.web(req, res, {
                target: `http://localhost:${this.frontendPort}`
            }, err => {
                console.error(`[GATEWAY ${this.gatewayPort} ERROR] proxy to frontend failed:`, err);
                res.status(502).send('Bad Gateway (frontend)');
            });
        });
    }

    start(){
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.gatewayPort, '0.0.0.0' , (err) => {
                if (err) {
                    console.error("[GATEWAY] Error starting gateway server:", err);
                    return reject(err);
                }
                console.log(`[GATEWAY] Gateway server started on port ${this.gatewayPort}`);
                resolve();
            });
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            if (!this.server) return resolve();
            console.log("[GATEWAY] Stopping gateway server...");
            this.server.close(err => {
                if (err) {
                    console.error("[GATEWAY] Error stopping gateway server:", err);
                    return reject(err);
                }
                console.log("[GATEWAY] Gateway server stopped");
                resolve();
            });
        });
    }
}        

module.exports = Gateway;