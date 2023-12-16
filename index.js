import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import multer from "multer";
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Ubah ke "public/images" atau direktori yang diinginkan
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// (async()=>{
//     await db.sync();
// })()

app.use(cors({
  origin: 'https://absensi-online-mu.vercel.app',
  credentials: true,
}));

app.use(express.json());  
app.use(upload.single('file'));
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