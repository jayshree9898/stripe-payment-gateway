const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
require('./helpers/global');

const db = require('./config/db.config');
const config = require('./config/config');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const userRouter = require('./routes/user.route')
app.use('/api/v1', userRouter);

const paymentRoute = require('./routes/payment.route')
app.use('/api/v1', paymentRoute);

let server;
if (config.protocol == "https") {
    const https = require('https');
    const options = {
        key: fs.readFileSync(config.sslCertificates.privkey),
        cert: fs.readFileSync(config.sslCertificates.fullchain)
    }
    server = https.createServer(options, app);
} else {
    const http = require('http');
    server = http.createServer(app);
}

server.listen(config.port, () => {
    console.log(`server running on port ${config.port}`);
})