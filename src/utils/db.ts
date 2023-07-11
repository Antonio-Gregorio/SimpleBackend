import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbURI: string|undefined = process.env.MONGODB_SERVER;
    const server_name = process.env.NAME_SERVER;

    if (typeof dbURI == "string") {   
        await mongoose.connect(dbURI, {
            autoCreate: true,
        });
    }
    console.log(`[${server_name}] MongoDB conectado!`)
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1); // Encerra o processo em caso de falha na conexão
  }
};

export default connectDB;