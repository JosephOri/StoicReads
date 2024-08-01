module.exports = {
    apps: [
      {
        name: "frontend",
        script: "npm",
        args: "run start",
        cwd: "./",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };