require('dotenv').config();
const Gateway = require('./Gateway');

//default port numbers
const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT, 10) || 1234;
const CHAT_PORT  = parseInt(process.env.CHAT_PORT,  10) || 3001;
const AUTO_PORT  = parseInt(process.env.AUTO_PORT,  10) || 5002;
const GATEWAY_PORT  = parseInt(process.env.GATEWAY_PORT,  10) || 8081;

const gateway = new Gateway(
    FRONTEND_PORT, 
    CHAT_PORT,
    AUTO_PORT, 
    GATEWAY_PORT
);

gateway
    .start()
    .then(() => {
        console.log(`→ Gateway running:            http://localhost:${GATEWAY_PORT}`);
        console.log(`  • Frontend proxied from:    http://localhost:${FRONTEND_PORT}`);
        console.log(`  • Chat API proxied from:    http://localhost:${CHAT_PORT}`);
        console.log(`  • Automation API proxied from: http://localhost:${AUTO_PORT}`);
    })
    .catch(err => {
        console.error("Error starting gateway:", err);
        process.exit(1);
    });