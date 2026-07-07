import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || "development"}`});


const loadEnv = (key:string) => {
   const value = process.env[key];
   if (value === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
   }
   return value;
}

const Config={
PORT: loadEnv("PORT"),
}
