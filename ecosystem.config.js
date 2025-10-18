module.exports = {
    apps: [{
        name: 'timelesstoursnginx',
        script: 'npm',
        args: 'start',
        cwd: '/var/www/timelesstoursnginx',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
        NODE_ENV: 'production',
        PORT: 3000
        },
        error_file: '/var/log/pm2/timelesstoursnginx-error.log',
        out_file: '/var/log/pm2/timelesstoursnginx-out.log',
        log_file: '/var/log/pm2/timelesstoursnginx.log',
        time: true
    }]
};