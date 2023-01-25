const dotenv = require('dotenv');
dotenv.config();
const { io } = require('socket.io-client');
const { logger } = require('./src/utils/logger');
const axios = require('axios');
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

async function main() {
  const base = 'http://localhost:4000';
  const socket = io(base);
  const [, , id] = process.argv;

  const { data: user } = await axios.get(`${base}/users/${id}`);
  const { data: room } = await axios.get(`${base}/rooms/1`);

  logger.warn(`Usuário ${user.name} está "logado".`);

  socket.emit('join-room', { user, roomCode: room.code }, (response) =>
    console.log(response)
  );

  socket.on('user-joined', (user) => {
    logger.info(`Usuário ${user.name} entrou!`);
  });

  socket.on('receive-message', (data) => {
    logger.info(`${data.user.name}: ${data.message.content}`);
  });

  let lastNumber = 0;
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      return process.exit();
    }
    if (key.name === 'e') {
      socket.emit(
        'send-message',
        {
          user,
          roomCode: room.code,
          message: `Número ${lastNumber}`,
        },
        ({ message }) => logger.warn(`Enviada: ${message.content}`)
      );
      lastNumber++;
      return;
    }
  });
}

main();