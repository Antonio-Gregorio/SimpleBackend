import { Request, Response } from 'express';
import UsersModel from '../models/Users';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar a senha
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida.' });
    }

    // Autenticação bem-sucedida
    return res.status(200).json({ message: 'Login bem-sucedido.' });
  } catch (error) {
    console.error('Erro durante o login:', error);
    return res.status(500).json({ message: 'Erro durante o login.' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    console.log(req.body);
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Envie os campos name, email e password via POST' });
    }
    
    // Verificar se o usuário já existe
    const existingUser = await UsersModel.findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Usuário já existe.' });
    }

    // Criar o novo usuário
    const newUser = new UsersModel({ name, email, password });

    newUser.password = await newUser.encryptPassword(password);  
    await newUser.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    console.error('Erro durante o registro:', error);
    return res.status(500).json({ message: 'Erro durante o registro.' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Verificar se o usuário existe
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Lógica para recuperar a senha
    // ...

    return res.status(200).json({ message: 'Email de recuperação de senha enviado.' });
  } catch (error) {
    console.error('Erro durante a recuperação de senha:', error);
    return res.status(500).json({ message: 'Erro durante a recuperação de senha.' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Lógica para atualização de token
    // ...

    return res.status(200).json({ message: 'Token atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro durante a atualização de token:', error);
    return res.status(500).json({ message: 'Erro durante a atualização de token.' });
  }
};