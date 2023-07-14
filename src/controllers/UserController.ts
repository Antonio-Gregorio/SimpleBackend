import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/User';
import { DecodedToken } from '../interfaces/interfaces';
import { generateToken, validateToken } from '../utils/jwt';
import { uuid } from 'uuidv4';

// Função para registrar um novo usuário
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    // Verifica se o email já está sendo utilizado
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Cria um novo usuário
    const newUser = new UserModel({ name, email, password });
    await newUser.save();

    // Gera o token JWT
    const token = generateToken(newUser._id, newUser.name, newUser.email, newUser.avatar ?? null);

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar o usuário' });
  }
}

// Função para fazer login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe no banco de dados
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verifica se a senha está correta
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    user.refreshToken = uuid();
    user.save();

    // Gera o token JWT
    const token = generateToken(user._id, user.name, user.email, user.avatar ?? null);

    res.status(200).json({ token, refreshToken: user.refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
}

// Função para redefinir a senha
export async function forgotPassword(req: Request, res: Response) {
  // Implemente a lógica de redefinição de senha aqui
}

// Função para atualizar o token JWT
export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Envie o refreshToken' });
    }

    const user = await UserModel.findOne({ refreshToken: refreshToken });
    if (!user) {
      return res.status(401).json({ message: 'Refresh token inválido' });
    }

    user.refreshToken = uuid();
    user.save();

    // Gera um novo token JWT
    const newToken = generateToken(user._id, user.name, user.email, user.avatar ?? null);

    res.status(200).json({ token: newToken, refreshToken: user.refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o token JWT' });
  }
}
