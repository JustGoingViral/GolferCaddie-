
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Proxy API requests to FastAPI backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // Keep /api prefix
  },
  onError: (err, req, res) => {
    console.log('Proxy Error:', err.message);
    res.status(500).json({ error: 'Backend service unavailable' });
  }
}));

// Serve static files from dist
app.use(express.static(path.join(__dirname, '../dist/public')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API proxy: http://0.0.0.0:${PORT}/api -> http://localhost:8000/api`);
});
