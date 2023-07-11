import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Definindo a interface para o documento do usuário
interface IUsers extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  encryptPassword(password: string): Promise<string>;
}

// Definindo o esquema do usuário
const UsersSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UsersSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  } catch (error: any) {
    throw new Error(error);
  }
};

UsersSchema.methods.encryptPassword = async function (password: string): Promise<string> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Criando o modelo do usuário
const UsersModel = mongoose.model<IUsers>('Users', UsersSchema);

export default UsersModel;