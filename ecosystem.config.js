module.exports = {
  apps: [
    {
      name: "telonero-frontend",
      cwd: "C:\\info\\telonero\\front",
      script: "node_modules\\next\\dist\\bin\\next",
      args: "start -p 3000",
      interpreter: "node",
      env: { NODE_ENV: "production", PORT: "3000" }
    }
  ]
}