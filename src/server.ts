import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

import cors from 'cors'; // import cors package
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import { scrapeResponse } from './newsAPI';

//// ----------------socketio------------------
import { createServer } from 'http';
const server = createServer(app);
import { Server } from 'socket.io';
// import { getSentiment } from './services/getSentiment.js';
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3002',
  },
});

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on('scrape', async () => {
    console.log('socket');
    const response = await scrapeResponse();
    console.log(response);
    socket.emit('newsData', response);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello, Express!');
// });
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
