import { getRepository } from 'typeorm';

import { sign } from 'jsonwebtoken';

import { compare } from 'bcryptjs';

import User from '../model/User';

import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User,
  token: string,
}

class AuthenticaUserService {
  public async execute({ email, password}: Request): Promise<Response> {

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: {email} });

    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    // user.password - Senha criptografada
    // password - Senha não criptografada

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Inconrrect email/password combination.');
    }

    // se passou até aqui, o usuário está autenticado


    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,

    });

    return {
      user,
      token,
    }

  }
}

export default AuthenticaUserService;
