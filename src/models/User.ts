import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Definindo a interface para o documento do usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  status: boolean;
  avatar: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Definindo o esquema do usuário
const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  status: { type: Boolean, default: true },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

// Adicionando hooks para hash da senha antes de salvar e atualizar o documento
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Método para comparar a senha fornecida com a senha armazenada no banco de dados
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Criando o modelo do usuário
const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;