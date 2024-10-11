import mongoose from "mongoose";

// connect to database
export async function connectDB() {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${process.env.DATABASE_NAME}`
    );

    console.log(
      `database connection: ${response.connection.host}:${response.connection.port}`
    );
  } catch (error) {
    console.error("failed to connect Database :", error);
  }
}
