const nodemailer = require('nodemailer');
const { logger } = require('../logger');
const fs = require('fs');
const path = require('path');
const { templatesPath } = require('../../config/mail');

const mailtrapTransport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// const gmailTransport = nodemailer.createTransport({
//   host: 'smtp.mailtrap.io',
//   port: 2525,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS,
//   },
// });

const MailService = {
  transport: mailtrapTransport,

  async sendMail(to, subject, html) {
    try {
      const config = {
        from: process.env.MAILTRAP_FROM,
        to,
        subject,
        html,
      };
      console.log(config);
      const info = await this.transport.sendMail(config);

      return info;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  template(name, config) {
    try {
      const layout = fs.readFileSync(
        path.join(templatesPath, 'layout.html'),
        'utf8'
      );
      const templateFile = fs.readFileSync(
        path.join(templatesPath, `${name}.html`),
        'utf8'
      );

      const content = templateFile.replace(/\{\{(.*?)\}\}/g, (_, key) => {
        return config[key.trim()];
      });

      const html = layout.replace(/\{\{(.*?content.*?)\}\}/i, content);

      return html;
    } catch (error) {
      logger.error(error);
      throw new Error('Template não foi encontrado!');
    }
  },
};

module.exports = MailService;