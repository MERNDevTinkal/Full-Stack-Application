import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ? : number
}

const connection : ConnectionObject = {}

 async function dbConnect () : Promise <void> {
    if (connection.isConnected) {
        console.log("Already connected to MongoDB database");
        return;
    }
    try {
      const db =  await mongoose.connect(process.env.MONGODB_URL as string || "" ,)
     // console.log(db);
      //console.log("db connection ",db.connections);
      connection.isConnected = db.connections[0].readyState;
      console.log("Database connected successfully");

    } catch (error) {
        console.error("Error connecting to MongoDB database:" , error);
        process.exit(1);
    }
 }

 export default dbConnect;