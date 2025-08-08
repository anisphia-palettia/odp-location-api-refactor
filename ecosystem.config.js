module.exports = {
    apps: [
        {
            name: "odp-location-api",
            script: "dist/server.js",
            instances: "max",
            exec_mode: "cluster",
            watch: false,
            env: {
                NODE_ENV: "production",
            },
            error_file: "./logs/err.log",
            out_file: "./logs/out.log",
            merge_logs: true,
            max_memory_restart: "512M"
        }
    ]
};
