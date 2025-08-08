module.exports = {
    apps: [
        {
            name: "odp-location-api",
            script: "dist/server.js",
            instances: "max",       // pakai semua core CPU
            exec_mode: "cluster",   // cluster mode
            watch: false,
            env: {
                NODE_ENV: "development", // default
            },
            env_production: {
                NODE_ENV: "production",  // untuk --env production
            },
        },
    ],
};
