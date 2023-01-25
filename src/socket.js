const { Server } = require('socket.io');
const { logger } = require('./utils/logger');
const UsersServices = require('./modules/users/usersServices');
const MessagesService = require('./modules/messages/messagesServices');

function createSocketServer(server) {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    logger.info('Nova conexão!', { id: socket.id });

    const userState = new Map();

    socket.on('join-room', async (data, callback) => {
      logger.info(`Usuário ${data.user} entrando em: ${data.roomCode}`);
      const userRoom = userState.get('room');

      if (userRoom) {
        if (userRoom.code === data.roomCode)
          return callback({ room: userRoom });

        socket.leave(userRoom.code);
      }

      try {
        const room = await UsersServices.findUserRoom(
          data.user.id,
          data.roomCode
        );

        if (!room) {
          logger.error('Sala não encontrada');
          return callback({ error: 404 });
        }

        socket.join(room.code);
        socket.to(room.code).emit('user-joined', data.user);
        userState.set('room', room);

        return callback({ room });
      } catch (error) {
        return callback({ error: error.message });
      }
    });

    socket.on('send-message', async (data, callback) => {
      const room = await UsersServices.findUserRoom(
        data.user.id,
        data.roomCode
      );

      const message = await MessagesService.create({
        content: data.message,
        roomId: room.id,
        userId: data.user.id,
      });

      logger.info(`Mensagem enviada para ${room.name}: ${data.message}`);
      socket
        .to(room.code)
        .emit('receive-message', { message, user: data.user });

      return callback({ message });
    });

    socket.on('leave-room', (data) => {
      socket.leave(data.roomCode);
      socket.to(data.roomCode).emit('user-left', data.user);
    });

    socket.on('disconnect', () => {
      logger.info('Usuário desconectou!', { id: socket.id });
    });
  });
}

module.exports = createSocketServer;