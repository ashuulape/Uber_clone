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
    console.log('Socket connected:',socket);

    socket.on('join', async (data) => {
      console.log('join event received', data);

      const { userId, userType } = data;

      

      if (userType === 'user') {
        await userModel.findByIdAndUpdate(userId, {
          socketId: socket.id,
        });
      } else if (userType === 'captain') {
        await captainModel.findByIdAndUpdate(userId, {
          socketId: socket.id,
        });
      }
    });

    socket.on('update-location-captain', async (data) => {
      const {userId ,location}=data
      console.log(location)
        await captainModel.findByIdAndUpdate(userId,{location})


    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
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
