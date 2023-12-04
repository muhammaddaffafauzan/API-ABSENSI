import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import FileUpload from "express-fileupload";
import dotenv from "dotenv";
import EmployeesRoute from "./routes/EmployeesRoute.js"
import AuthRoute from "./routes/AuthRoute.js";
import InformationRoute from "./routes/InformationRoute.js";
import PresenceRoute from "./routes/PresenceRoute.js";
import PositionRoute from "./routes/PositionRoute.js";
import CompanyRoute  from "./routes/CompanyRoute.js";
import db from "./config/Database.js";

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log('Database Connected...');
  // isi table yang ingin di singkronkan di bawah:
} catch (error) {
  console.log(error);
}

// (async()=>{
//     await db.sync();
// })()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());  
app.use(FileUpload())
app.use(express.static("public"));
app.use(UserRoute);
app.use(EmployeesRoute);
app.use(InformationRoute);
app.use(PresenceRoute);
app.use(PositionRoute);
app.use(CompanyRoute);
app.use(AuthRoute);
app.use(cors());

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server Up And Running...')
});