require('dotenv').config();

module.exports = {
    app_path: process.env.APP_PROJECT_PATH,
    port: process.env.PORT,
    protocol: process.env.PROTOCOL,
    
    db: {
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALLECT
    },
    sslCertificates: {
        privkey: process.env.PRIVKEY,
        fullchain: process.env.FULLCHAIN
    }
}