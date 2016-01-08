module.exports = {
    http: {
        port: 3000
    },
    mongo: {
        dsn: '127.0.0.1:27017/your_db'
    },
    morgan: {
        format: 'dev'
    },
    logging: {
        dev: {
            transport: 'File',
            filename: 'logs/dev.log',
            level: 'debug',
            maxsize: 10*1024*1024,
            json: true
        },
        prod: {
            transport: 'File',
            filename: 'logs/prod.log',
            level: 'warning',
            maxsize: 10*1024*1024,
            maxFiles: 10,
            json: true
        },
        console: {
            transport: 'Console',
            json: true,
            colorize: true,
            prettyPrint: true,
            timestamp: true
        }
    }
};
