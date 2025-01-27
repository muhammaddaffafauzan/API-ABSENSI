import Employee from "../models/EmployeesModel.js";
import User from "../models/UsersModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Fungsi untuk menghasilkan token akses dan refresh token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Waktu kadaluwarsa refresh token dapat disesuaikan
  );

  return { accessToken, refreshToken };
};

export const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const match = await bcryptjs.compare(req.body.password, user.password);

    if (!match) return res.status(400).json({ msg: "Password salah" });

    // Jika otentikasi berhasil, buat token akses dan refresh token
    const { accessToken, refreshToken } = generateTokens(user);
    const role = user.role;
    // Simpan refresh token di database
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Terjadi kesalahan server" });
  }
};

export const Me = async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    const user = await User.findOne({
      attributes: ["id", "uuid", "name", "email", "role"],
      where: {
        id: decodedToken.userId,
      },
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    let employee;
    if (req.role == "user") {
      employee = await Employee.findAll({
        where: {
          userId: user.id,
        },
      });
    }

    const responseData = {
      user,
      employee,
    };

    res.status(200).json([responseData]);
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Token tidak valid" });
  }
};
