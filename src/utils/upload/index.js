const multer = require('multer');
const { publicPath } = require('../../config/upload');
const createCode = require('../createCode');

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, callback) {
      const code = createCode()
        .withLetters()
        .withNumbers()
        .withUpperLetters()
        .create(10);
      const original = file.originalname
        .toLowerCase()
        .replace(/\s/g, '-')
        .trim();
      callback(null, `${code}-${original}`);
    }, // Trocar/Criar o nome do arquivo
    destination(req, file, callback) {
      callback(null, publicPath);
    }, // Onde vai ser salvo o arquivo
  }),
});

module.exports = upload;