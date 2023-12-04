import Employee from "../models/EmployeesModel.js";
import path from "path";
import User from "../models/UsersModel.js";
import bcryptjs from "bcryptjs";
import fs from "fs";
import Presence from "../models/PresenceModel.js";
import Information from "../models/InformationModel.js";

export const getEmployee = async (req, res) => {
  try {
    let responseAll;
    let employee;
    let response;
    if (req.role === "admin") {
      response = await Employee.findAll({
        include: [
          {
            model: User,
            attributes: ["name", "email", "role"],
          },
        ],
      });
    } else {
      employee = await Employee.findOne({
        include: [
          {
            model: User,
            attributes: ["id", "uuid", "name", "email", "role"],
          },
        ],
        where: {
          userId: req.userId
        },
      });
  
      if (!employee) {
        return res.status(404).json({ error: "Pegawai tidak ditemukan" });
      }
  
      const presence = await Presence.findAll({
        where: {
          userId: employee.userId,
        },
      });
  
      const informationSick = await Information.findAll({
        where: {
          userId: employee.userId,
          keterangan: "Sakit",
        },
      });
  
      const informationPermission = await Information.findAll({
        where: {
          userId: employee.userId,
          keterangan: "Izin",
        },
      });
       responseAll = {
        id: employee.id,
        uuid: employee.uuid,
        name: employee.user.name,
        email: employee.user.email,
        role: employee.user.role,
        nip: employee.nip,
        nama: employee.nama,
        kota: employee.kota,
        tgl_lahir: employee.tgl_lahir,
        jenis_kelamin: employee.jenis_kelamin,
        agama: employee.agama,
        alamat: employee.alamat,
        no_hp: employee.no_hp,
        jabatan: employee.jabatan,
        image: employee.image,
        url: employee.url,
        presence: presence,
        informationSick: informationSick,
        informationPermission: informationPermission,
      };
    }
    res.status(200).json(response || [responseAll]);
  } catch (error) {
    console.log(error);
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      include: [
        {
          model: User,
          attributes: ["id", "uuid", "name", "email", "role"],
        },
      ],
      where: {
        uuid: req.params.uuid,
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Pegawai tidak ditemukan" });
    }

    const presence = await Presence.findAll({
      where: {
        userId: employee.userId,
      },
    });

    const informationSick = await Information.findAll({
      where: {
        userId: employee.userId,
        keterangan: "Sakit",
      },
    });

    const informationPermission = await Information.findAll({
      where: {
        userId: employee.userId,
        keterangan: "Izin",
      },
    });

    const responseAll = {
      id: employee.id,
      uuid: employee.uuid,
      name: employee.user.name,
      email: employee.user.email,
      role: employee.user.role,
      nip: employee.nip,
      nama: employee.nama,
      kota: employee.kota,
      tgl_lahir: employee.tgl_lahir,
      jenis_kelamin: employee.jenis_kelamin,
      agama: employee.agama,
      alamat: employee.alamat,
      no_hp: employee.no_hp,
      jabatan: employee.jabatan,
      image: employee.image,
      url: employee.url,
      presence: presence,
      informationSick: informationSick,
      informationPermission: informationPermission,
    };

    res.json(responseAll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kesalahan Internal Server", details: error.message });
  }
};

export const saveEmployeeAndUser = async (req, res) => {
  //data akun karyawan
  const { username, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan ConfirmPassword Tidak Cocok" });
  const salt = await bcryptjs.genSalt();
  const hashPassword = await bcryptjs.hash(password, salt);
  // data karyawan
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });
  const nip = req.body.nip;
  const nama = req.body.nama;
  const kota = req.body.kota;
  const tmp = req.body.tgl_lahir;
  const jk = req.body.jenis_kelamin;
  const agama = req.body.agama;
  const alamat = req.body.alamat;
  const hp = req.body.no_hp;
  const jabatan = req.body.jabatan;

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext.toLocaleLowerCase()))
    return res.status(422).json({ msg: "Invalid Image" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5MB" });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
  });
  try {
    const user = await User.create({
      name: username,
      email: email,
      password: hashPassword,
      role: "user",
    });
    await Employee.create({
      nip: nip,
      nama: nama,
      kota: kota,
      tgl_lahir: tmp,
      jenis_kelamin: jk,
      agama: agama,
      alamat: alamat,
      no_hp: hp,
      jabatan: jabatan,
      image: fileName,
      url: url,
      userId: user.id,
    });
    res.status(201).json({ msg: "register dan create data karyawan berhasil" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  if (!employee) return res.status(404).json({ msg: "Data tidak ditemukan" });

  let fileName = "";

  if (req.files === null) {
    fileName = employee.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;

    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Gambar tidak valid" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Gambar harus kurang dari 5MB" });

      const filepath = `./public/images/${employee.image}`;

      // Tambahkan pengecekan apakah file ada sebelum mencoba menghapus
      if (fs.existsSync(filepath)) {
          try {
              fs.unlinkSync(filepath);
              console.log(`File ${filepath} berhasil dihapus`);
          } catch (err) {
              console.error(`Gagal menghapus file ${filepath}: ${err}`);
          }
      } else {
          console.warn(`File ${filepath} tidak ditemukan`);
      }

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const nip = req.body.nip;
  const nama = req.body.nama;
  const kota = req.body.kota;
  const tmp = req.body.tmp_tgl_lahir;
  const jk = req.body.jenis_kelamin;
  const agama = req.body.agama;
  const alamat = req.body.alamat;
  const hp = req.body.no_hp;
  const jabatan = req.body.jabatan;

  try {
    await Employee.update(
      {
        nip: nip,
        nama: nama,
        kota: kota,
        tgl_lahir: tmp,
        jenis_kelamin: jk,
        agama: agama,
        alamat: alamat,
        no_hp: hp,
        jabatan: jabatan,
        image: fileName,
        url: `${req.protocol}://${req.get("host")}/images/${fileName}`,
      },
      {
        where: {
          id: employee.id,
        },
      }
    );
    res.status(200).json({ msg: "Employee Updated successfully" });
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });
  if (!employee) return res.status(404).json({ msg: "No data Found" });
  try {
    const filepath = `./public/images/${employee.image}`;

    // Tambahkan pengecekan apakah file ada sebelum mencoba menghapus
    if (fs.existsSync(filepath)) {
        try {
            fs.unlinkSync(filepath);
            console.log(`File ${filepath} berhasil dihapus`);
        } catch (err) {
            console.error(`Gagal menghapus file ${filepath}: ${err}`);
        }
    } else {
        console.warn(`File ${filepath} tidak ditemukan`);
    }
    await Employee.destroy({
      where: {
        id: employee.id,
      },
    });
    res.status(200).json({ msg: "Employee Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
