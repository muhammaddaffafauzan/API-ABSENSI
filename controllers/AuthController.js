import Employee from "../models/EmployeesModel.js";
import Information from "../models/InformationModel.js";
import Presence from "../models/PresenceModel.js";
import User from "../models/UsersModel.js";
import bcryptjs from "bcryptjs";

export const Login = async (req, res) =>{
    const user = await User.findOne({
        where: {
          email: req.body.email
        }
  });
  if(!user) return res.status(404).json({msg: "user tidak ditemukan"});
  const match = await bcryptjs.compare(req.body.password, user.password);
  if(!match) return res.status(400).json({msg: "password salah"});
  req.session.userId = user.uuid;
  const uuid = user.id;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({uuid, name, email, role});
}

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke Akun Anda" });
  }

  const user = await User.findOne({
    attributes: ["id", "uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });

  const employee = await Employee.findAll({
    where:{
      userId: user.id
    }
  });

  const presence = await Presence.findAll({
    where:{
      userId: user.id
    }
  });

  const informationSick = await Information.findAll({
    where: {
      userId: user.id,
      keterangan: "Sakit",
    },
  });

  const informationPermission = await Information.findAll({
    where: {
      userId: user.id,
      keterangan: "Izin",
    },
  });

  // Menggabungkan semua informasi ke dalam satu objek
  const responseData = {
    user,
    employee,
    presence,
    information: {
      sick: informationSick,
      permission: informationPermission,
    },
  };

  res.status(200).json([responseData]); // Mengirim sebagai satu data array
};


export const logout = (req, res) => {
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda telah Logout"})
    });
}