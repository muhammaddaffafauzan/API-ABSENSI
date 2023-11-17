import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import FileUpload from "express-fileupload";
import session from "express-session";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";
import EmployeesRoute from "./routes/EmployeesRoute.js"
import AuthRoute from "./routes/AuthRoute.js";
import InformationRoute from "./routes/InformationRoute.js";
import PresenceRoute from "./routes/PresenceRoute.js";
import PositionRoute from "./routes/PositionRoute.js";
import CompanyRoute  from "./routes/CompanyRoute.js";
import db from "./config/Database.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

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

// Konfigurasi sesi di server
app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: 'auto',
  },
}));

// Tambahkan ini pada konfigurasi CORS di server
app.use(cors({
  origin: 'http://localhost:5173', // Ganti dengan domain Vue.js Anda
  credentials: true,
}));

app.use(cookieParser());
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

// store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server Up And Running...')
});