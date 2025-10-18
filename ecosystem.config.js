module.exports = {
    apps: [{
        name: 'timeless-tours',
        script: 'npm',
        args: 'start',
        cwd: '/var/www/timeless-tours',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
        NODE_ENV: 'production',
        PORT: 3000
        },
        error_file: '/var/log/pm2/timeless-tours-error.log',
        out_file: '/var/log/pm2/timeless-tours-out.log',
        log_file: '/var/log/pm2/timeless-tours.log',
        time: true
    }]
};