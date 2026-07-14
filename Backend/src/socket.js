const { Server } = require('socket.io');
const userModel = require('./models/user.model.js');
const captainModel=require('./models/captain.model.js')

let io = null;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: [ 'GET', 'POST' ]
    },
  });

  io.on('connection', (socket) => {
   

    socket.on('join', async (data) => {
      try {
        const { userId, userType } = data;
        if (!userId) return;

        if (userType === 'user') {
          await userModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        } else if (userType === 'captain') {
          await captainModel.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
        }
      } catch (error) {
        // Suppress or handle error safely
      }
    });

    socket.on('update-location-captain', async (data) => {
      try {
        const {userId, location} = data;
        if (!userId) return;
        await captainModel.findByIdAndUpdate(userId, {location});
      } catch (error) {}
    });

    socket.on('update-location-user', async (data) => {
      try {
        const {userId, location} = data;
        if (!userId) return;
        await userModel.findByIdAndUpdate(userId, {location});
      } catch (error) {}
    });

    socket.on('disconnect', () => {});
  });

  return io;
};

const sendMessageToSocketId = (socketId, eventName, payload) => {
  if (!io) return false;
  if (!socketId) return false;

  io.to(socketId).emit(eventName, payload);
  return true;
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
