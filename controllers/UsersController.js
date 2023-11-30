import User from "../models/UsersModel.js";
import bcryptjs from "bcryptjs";


export const getUsers = async(req, res) => {
    try {
            const response = await User.findAll({
            attributes: ['id','uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const getUsersById = async(req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
              where: {
                uuid: req.params.uuid
              }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const createUsers = async(req, res) => {
    const {name, email, password } = req.body;
    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);
    try {
        await User.create({
            name: name, 
            email: email,
            password: hashPassword,
            role: 'admin'
        });
        res.status(201).json({msg: "register berhasil"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
export const updateUsers = async(req, res) => {
    const user = await User.findOne({
          where: {
            uuid: req.params.uuid
          }
    });
    if(!user) return res.status(404).json({msg: "user tidak ditemukan"});
    const {name, email, password, confPassword, role} = req.body;
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password
    }else{
        const salt = await bcryptjs.genSalt();
        hashPassword = await bcryptjs.hash(password, salt);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password dan ConfirmPassword Tidak Cocok"});
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where: {
               id: user.id
            }
        });
        res.status(200).json({msg: "Users Updated"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updatePassUser = async(req, res) => {
        const user = await User.findOne({
          where: {
            id: req.userId
          }
    });

    if(!user) return res.status(404).json({msg: "user tidak ditemukan"});
    const { password, confPassword,} = req.body;
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.pas
    }else{
        const salt = await bcryptjs.genSalt();
        hashPassword = await bcryptjs.hash(password, salt);
    }
    if(password !== confPassword) return res.status(400).json({msg: "Password dan ConfirmPassword Tidak Cocok"});
    try {
        if(req.role === 'user')
       { 
        await User.update({
            name: user.name,
            email: user.email,
            password: hashPassword,
            role: 'user'
        },{
            where: {
               id: user.id
            }
        });
    }else{
        res.status(400).json({msg:"ini untuk user mengubah password"});
    }
        res.status(200).json({msg: "Users Updated"})
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    // Atur validitas token (misalnya, 1 jam)
    const resetTokenExpires = Date.now() + 3600000;

    await User.update({ resetToken, resetTokenExpires }, { where: { email } });

    // Kirim email dengan resetToken (Implementasikan logika nodemailer atau layanan email lainnya di sini)

    res.status(200).json({ msg: "Email reset password telah dikirim" });
};

export const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
        where: {
            resetToken,
            resetTokenExpires: {
                [Op.gt]: Date.now() // Op.gt adalah operator 'greater than'
            }
        }
    });

    if (!user) {
        return res.status(400).json({ msg: "Token tidak valid atau telah kadaluwarsa" });
    }

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    await User.update({ password: hashedPassword, resetToken: null, resetTokenExpires: null }, {
        where: { id: user.id }
    });

    res.status(200).json({ msg: "Password telah diperbarui" });
};


export const deleteUsers = async(req, res) => {
    const user = await User.findOne({
        where: {
          uuid: req.params.uuid
        }
  });
  if(!user) return res.status(404).json({msg: "user tidak ditemukan"});
  try {
      await User.destroy({
          where: {
             id: user.id
          }
      });
      res.status(200).json({msg: "Users deleted"})
  } catch (error) {
      res.status(400).json({msg: error.message});
  }
}