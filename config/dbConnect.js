import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();

const connectDB = async ()=>{
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true,
        });
         
        console.log("Database connected successfully.");
        //creating db if not exist
        await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
        console.log("db is ready");
        
        await db.changeUser({database:process.env.DB_NAME})
 
        const schema = fs.readFileSync("schema.sql", "utf8")
        await db.query(schema);
        console.log("schema applied");
        
       return db;        
    } catch (error) {
        console.error("error while connecting db", error);
        process.exit(1);
    }
}

export default connectDB;