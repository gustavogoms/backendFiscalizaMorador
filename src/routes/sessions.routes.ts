import { Router } from 'express';

import AuthenticaUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {

  const { email, password } = request.body;

  const authenticateUser = new AuthenticaUserService();

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  })

  try{
    return response.json({user, token});

  } catch(err) {
    return response.status(400).json({ error: err.message});
  }
});

export default sessionsRouter;
