import dotenv from "dotenv"
import { connectDB } from './srcbackend/db/index.js'

dotenv.config();
import { app } from './app.js'
import path from "path"

console.log("MONGODB_URI:", process.env.MONGODB_URI); // should print your URI
console.log("DB_NAME:", process.env.DB_NAME);
console.log("Resolved .env path:", path.resolve('./.env'));


connectDB()
.then(()=>{

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })

})
.catch(()=>{
  console.log("mongodb connection failed!!!",error)
})














//test commint



