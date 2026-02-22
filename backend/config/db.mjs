import mongoose from "mongoose"

const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("Database successfully connected");
    }catch(error){
        console.log(error)
    }
}

export default connectDb;