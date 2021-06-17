import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../model/User';
import {createConnection} from "typeorm";


interface Request {
  name: string,
  password: string,
  email: string,

}



class CreateUserService {
  public async execute({name, password, email}: Request): Promise<User> {
    const connection = await createConnection();
    const usersRepository = connection.getRepository(User);


    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new Error ('Email addres already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
