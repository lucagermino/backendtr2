import { Server } from 'socket.io';
import http from 'http';
import app from './app.js';
import setupProductSocket from './sockets/productSocket.js';

const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

setupProductSocket(io);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
