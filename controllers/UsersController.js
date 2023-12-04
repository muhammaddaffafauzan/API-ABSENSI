import User from "../models/UsersModel.js";
import bcryptjs from "bcryptjs";
// import { v4 as uuidv4 } from "uuid";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["id", "uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getUsersById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.uuid,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createUsers = async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcryptjs.genSalt();
  const hashPassword = await bcryptjs.hash(password, salt);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "admin",
    });
    res.status(201).json({ msg: "register berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
// error update
export const updateUsers = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ["id", "uuid", "name", "email", "role"],
      where: {
        uuid: req.params.uuid,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const { name, email, password, confPassword, role } = req.body;
    let updateFields = {};

    if (name) {
      updateFields.name = name;
    }

    if (email) {
      updateFields.email = email;
    }

    if (password && password !== confPassword) {
      return res.status(400).json({ msg: "Password dan ConfirmPassword tidak cocok" });
    }

    if (password) {
      const salt = await bcryptjs.genSalt();
      updateFields.password = await bcryptjs.hash(password, salt);
    }

    if (role) {
      updateFields.role = role;
    }

    await User.update(updateFields, {
      where: {
        id: user.id,
      },
    });

    res.status(200).json({ msg: "User berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
export const updatePassUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const { password, confPassword } = req.body;
    let hashPassword;

    if (password === "" || password === null) {
      hashPassword = user.password;
    } else {
      const salt = await bcryptjs.genSalt();
      hashPassword = await bcryptjs.hash(password, salt);
    }

    if (password !== confPassword) {
      return res.status(400).json({ msg: "Password dan ConfirmPassword tidak cocok" });
    }

    if (req.role === "user") {
      await User.update(
        {
          password: hashPassword,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.status(200).json({ msg: "Password user berhasil diperbarui" });
    } else {
      res.status(400).json({ msg: "Operasi ini hanya untuk user mengubah password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// export const resetPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     // Generate tautan unik untuk reset password
//     const resetLink = uuidv4();

//     await User.update(
//       { resetPasswordToken: resetLink },
//       {
//         where: {
//           id: user.id,
//         },
//       }
//     );

//     // Kirim email reset password (gunakan fungsi yang sesuai)
//     // contoh: sendResetPasswordEmail(user.email, resetLink);

//     res.status(200).json({ msg: "Reset password link sent to your email" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

// export const changePasswordWithoutToken = async (req, res) => {
//   const { resetLink, newPassword } = req.body;

//   try {
//     const user = await User.findOne({
//       where: {
//         resetPasswordToken: resetLink,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ msg: "Invalid reset link" });
//     }

//     const salt = await bcryptjs.genSalt();
//     const hashPassword = await bcryptjs.hash(newPassword, salt);

//     await User.update(
//       {
//         password: hashPassword,
//         resetPasswordToken: null,
//       },
//       {
//         where: {
//           id: user.id,
//         },
//       }
//     );

//     res.status(200).json({ msg: "Password updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

export const deleteUsers = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });
  if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "Users deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
