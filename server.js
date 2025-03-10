import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/dbConnect.js";
import schoolRoutes from "./routes/schoolRoutes.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

//test

app.use("/",()=>{
  res.status(200).json({message: "hello from backend"})
})

// here is api 
app.use("/api/v1/school", schoolRoutes);

// connecting mysql db
const startServer = async () =>{
  try {
    const db = await connectDB();
    
    if (!db) {
      console.error("database connection failed");
      process.exit(1);
    }

    app.locals.db = db; // storing DBonnection globally will help to use in controllers
  

    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });

  } catch (error) {
    console.error("error while starting server:", error);
    process.exit(1);
  }
}

startServer();