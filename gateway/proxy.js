require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

// launch automation server
const autoServer = spawn('python', [path.resolve(__dirname, '../automation_server.py')], {stdio: 'inherit'});
autoServer.on('close', (code) => console.log(`[🚀 automation_server] exited with code ${code}`));

// start gateway proxy
const Gateway = require('./Gateway');

//default port numbers
const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT, 10) || 1234;
const BACKEND_PORT  = parseInt(process.env.BACKEND_PORT,  10) || 3001;
const GATEWAY_PORT  = parseInt(process.env.GATEWAY_PORT,  10) || 8081;

const gateway = new Gateway(FRONTEND_PORT, BACKEND_PORT, GATEWAY_PORT);

gateway
    .start()
    .then(() => {
        console.log(`→ Gateway running: http://localhost:${GATEWAY_PORT}`);
        console.log(`  • Frontend proxied from http://localhost:${FRONTEND_PORT}`);
        console.log(`  • API proxied from    http://localhost:${BACKEND_PORT}`);
    })
    .catch(err => {
        console.error("Error starting gateway:", err);
        process.exit(1);
    });