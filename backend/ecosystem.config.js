  module.exports = {
    apps : [{
      name   : "backend",
      script : "./dist/server.js",
      env_production: {
        NODE_ENV: "production"
      }
    }]
  }
  