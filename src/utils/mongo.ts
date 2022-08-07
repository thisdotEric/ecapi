import mongoose from 'mongoose';

export const connect = async (): Promise<void> => {
  const mongo_server = `${process.env.MONGO_DB}`;

  await mongoose.connect(mongo_server);
};
