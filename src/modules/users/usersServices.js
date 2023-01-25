const {
  UserStatus,
  ConfirmCodeStatus,
  ResetPasswordTokenStatus,
} = require('@prisma/client');
const AuthService = require('../../utils/auth');
const createCode = require('../../utils/createCode');
const prisma = require('../../utils/database');
const MailService = require('../../utils/mail');

const UsersServices = {
  async findAll() {
    const users = await prisma.user.findMany();
    return users;
  },

  async findOne(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  },

  async create(data) {
    const existsUser = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existsUser && existsUser.status === UserStatus.ACTIVE)
      throw new Error('Já existe usuário com este e-mail!');

    const user =
      existsUser ||
      (await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      }));

    return user;
  },

  async update(id, data) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: data.avatar,
      },
    });

    return user;
  },

  async delete(id) {
    const user = await prisma.user.delete({
      where: { id },
    });

    return user;
  },

  async findByEmail(email) {
    return await prisma.user.findFirst({ where: { email } });
  },

  async findByToken(token) {
    const payload = AuthService.verifyToken(token);
    if (!payload || !payload.id) throw new Error('Token inválido!');
    const user = await UsersServices.findOne(payload.id);
    return user;
  },

  async findUserRoom(id, roomCode) {
    const userRoom = await prisma.userRoom.findFirst({
      where: { userId: id, room: { code: roomCode } },
      include: { room: true },
    });

    return userRoom?.room;
  },

  async login(data) {
    const user = await UsersServices.findByEmail(data.email);

    if (!user) throw new Error('E-mail não encontrado!');
    if (user.status !== UserStatus.ACTIVE) throw new Error('Usuário inválido');
    if (user.password !== data.password) throw new Error('Senha incorreta!');

    const token = AuthService.createToken({ id: user.id });
    return { user, token };
  },

  async register(data) {
    const user = await UsersServices.create(data);

    await prisma.confirmCode.updateMany({
      where: { userId: user.id },
      data: { status: ConfirmCodeStatus.EXPIRED },
    });

    const code = createCode().withLetters().withNumbers().create(8);
    await prisma.confirmCode.create({ data: { code, userId: user.id } });

    return { user, code };
  },

  async confirmRegister(email, code) {
    const user = await UsersServices.findByEmail(email);
    if (!user) throw new Error('Usuário não encontrado!');

    const confirmCode = await prisma.confirmCode.findFirst({
      where: {
        userId: user.id,
        code,
        // status: ConfirmCodeStatus.PENDING,
      },
    });

    if (!confirmCode) throw new Error('Código não encontrado!');
    if (confirmCode.status !== ConfirmCodeStatus.PENDING)
      throw new Error('Código expirado!');

    await prisma.confirmCode.update({
      where: { id: confirmCode.id },
      data: { status: ConfirmCodeStatus.USED },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatus.ACTIVE },
    });
    return user;
  },

  async sendConfirmRegisterMail(data) {
    const html = MailService.template('register', {
      name: data.name,
      code: data.code,
    });
    MailService.sendMail(data.email, 'Confirmação do Registro!', html);
  },

  async forgetPassword(email) {
    const user = await UsersServices.findByEmail(email);

    if (!user) throw new Error('Usuário não encontrado!');

    const token = createCode()
      .withNumbers()
      .withLetters()
      .withUpperLetters()
      .create(24);

    await prisma.resetPasswordToken.updateMany({
      where: { userId: user.id },
      data: { status: ResetPasswordTokenStatus.EXPIRED },
    });
    await prisma.resetPasswordToken.create({
      data: { userId: user.id, token },
    });

    return { user, token };
  },

  async sendResetPasswordMail(data) {
    const html = MailService.template('forget-password', {
      name: data.name,
      token: data.token,
    });

    await MailService.sendMail(data.email, `Reset da senha ${data.name}`, html);
  },

  async resetPassword(data) {
    const token = await prisma.resetPasswordToken.findFirst({
      where: { token: data.token, status: ResetPasswordTokenStatus.PENDING },
      include: { user: true },
    });

    if (!token) throw new Error('Token inválido!');

    await prisma.resetPasswordToken.update({
      where: { id: token.id },
      data: { status: ResetPasswordTokenStatus.USED },
    });
    await prisma.user.update({
      where: { id: token.userId },
      data: { password: data.password },
    });

    return token.user;
  },

  async updatePassword(id, { oldPassword, newPassword }) {
    const user = await UsersServices.findOne(id);

    if (!user) throw new Error('Usuário não encontrado!');
    if (user.password !== oldPassword)
      throw new Error('Senha antiga incorreta!');

    await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });

    return user;
  },

  async joinRoom(id, roomCode) {
    const room = await prisma.room.findFirst({ where: { code: roomCode } });
    if (!room) throw new Error('Sala não encontrada!');

    const joinedRoom = await prisma.userRoom.create({
      data: {
        userId: id,
        roomId: room.id,
      },
    });

    return joinedRoom;
  },
};

module.exports = UsersServices;