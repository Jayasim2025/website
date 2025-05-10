const express = require("express")
const { createProxyMiddleware } = require("http-proxy-middleware")
const cors = require("cors")

const app = express()

// Enable CORS for all routes
app.use(cors())

// Proxy middleware
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://ec2-54-169-176-135.ap-southeast-1.compute.amazonaws.com:8080",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // Remove /api prefix
    },
  }),
)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
})
