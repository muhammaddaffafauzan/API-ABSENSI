import Employee from "../models/EmployeesModel.js";
import path from "path";
import User from "../models/UsersModel.js";
import bcryptjs from "bcryptjs";
import fs from "fs";

export const getEmployee = async(req, res)=>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Employee.findAll({
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'role']
                }]
            });
        }else{
            response = await Employee.findAll({
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'role']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error)
    }
}

export const getEmployeeById = async(req, res)=>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Employee.findOne({
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'role']
                }],
                where:{
                    uuid : req.params.uuid
                }
            });
        }else{
            response = await Employee.findOne({
                where: {
                    uuid: req.params.uuid,
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email', 'role']
                }]
            });
        }
        res.json(response);
    } catch (error) {
        console.log(error)
    }
}

export const saveEmployeeAndUser = async(req, res)=>{
    //data akun karyawan
    const {username, email, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan ConfirmPassword Tidak Cocok"});
    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(password, salt);
    // data karyawan
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const nip = req.body.nip;
    const nama = req.body.nama;
    const kota =  req.body.kota;
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
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if(!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({msg: "Invalid Image"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5MB"});
    
 
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
    });
    try {
      const user =  await User.create({
            name: username,
            email: email,
            password: hashPassword,
            role: 'user'
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
                     userId: user.id
        });
        res.status(201).json({msg: "register dan create data karyawan berhasil"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateEmployee = async(req, res)=>{
    const employee = await Employee.findOne({
        where:{
            uuid: req.params.uuid
        }
    });
    if(!employee) return res.status(404).json({msg: "No data Found"});
    let fileName = "";
    if(req.files === null){
        fileName = employee.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', 'jpeg'];
        
        if(!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({msg: "Invalid Image"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5MB"});
        

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const nip = req.body.nip;
    const nama = req.body.nama;
    const kota =  req.body.kota;
    const tmp = req.body.tmp_tgl_lahir;
    const jk = req.body.jenis_kelamin;
    const agama = req.body.agama;
    const alamat = req.body.alamat;
    const hp = req.body.no_hp;
    const jabatan = req.body.jabatan;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        const filepath = `./public/images/${employee.image}`;
        fs.unlinkSync(filepath);    
        await Employee.update({
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
                    url: url
                    },{
            where:{
                uuid: employee.uuid
            }
        });
        res.status(200).json({msg: "Employee Updated successfully"});
    } catch (error) {
        res.status(401).json({msg: error.message});
    }
}

export const deleteEmployee = async(req, res)=>{
        const employee = await Employee.findOne({   
            where:{
                uuid : req.params.uuid
            }
        });
        if(!employee) return res.status(404).json({msg: "No data Found"});
        try {
            const filepath = `./public/images/${employee.image}`;
            fs.unlinkSync(filepath);
            await Employee.destroy({
                where:{
                    id : employee.id
                }
            });
            res.status(200).json({msg: "Employee Deleted Successfully"})
        } catch (error) {
            console.log(error)
        }
   
}