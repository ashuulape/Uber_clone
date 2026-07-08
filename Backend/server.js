require('dotenv').config();
const app = require('./src/app.js');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./src/Database/db.js');
const { initializeSocket } = require('./src/socket.js');

dotenv.config();

connectDB();

const startServer = (port) => {
  const server = http.createServer(app);
  initializeSocket(server);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = Number(port) + 1;
      console.warn(`Port ${port} is busy, trying ${fallbackPort}...`);
      startServer(fallbackPort);
      return;
    }

    console.error(error);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer(Number(process.env.PORT) || 3000);
