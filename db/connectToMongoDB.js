import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true,  useUnifiedTopology: true });
		console.log(`connected to Mongodb Database ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;