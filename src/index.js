const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { logger, loggerStream } = require('./utils/logger');
const router = require('./routes');
const authenticate = require('./middlewares/auth');

const port = process.env.PORT;
const app = express();

async function main() {
  app.use(express.json());
  app.use(cors());
  app.use(morgan('tiny', { stream: loggerStream }));
  app.use(router);

  app.get('/private', authenticate(), (req, res) => {
    return res.json(req.user);
  });

  app.listen(port, () => {
    logger.info(`Servidor rodando na porta: ${port}`);
  });
}

main();