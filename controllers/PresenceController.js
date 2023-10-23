import Presence from "../models/PresenceModel.js"
import User from "../models/UsersModel.js";
import path from "path"

export const getPresence = async(req, res) =>{
    try {
        let response;
        if(req.role === 'admin')
        {
            response = await Presence.findAll({
            include: [{
                
            model: User,
            attributes: ['name']
            }]
        });
    }else{
        response = await Presence.findAll({
            where: {
                userId: req.userId
            },
            include: [{
            model: User,
            attributes: ['name']
            }]
        });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getAllPresenceByUserId = async(req, res) =>{
    try {
        const response = await Presence.findAll({
            include: [{
            model: User,
            attributes: ['name']
            }],
              where: {
                userId: req.params.userId
              }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const savePresence = async(req, res) =>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const tgl = req.body.tgl_absen;
    const masuk = req.body.masuk;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if(!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({msg: "Invalid Image"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5MB"});
    
 
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
    });
    try {
        let response;
        if(req.role === 'user')
            {
           response = await Presence.create({
            where: {
                userId : req.userId
            },
            userId: req.userId, tgl_absen: tgl, masuk: masuk, image: fileName, url: url
            });
         }else{
            res.status(400).json({msg:"hanya user yang bisa mengirim keterangan"});
         }
       
        res.status(201).json({msg: "Anda sekarang masuk"});
    } catch (error) {
        console.log(error)
    }
}
export const outPresence = async(req, res) => {
    const userId = req.userId; // Mengambil userId dari parameter URL
    const tgl_absen = req.body.tgl_absen; // Mengambil tgl_absen dari body request
  
    try {
      // Mengambil semua record Presence berdasarkan userId
      const presenceRecords = await Presence.findAll({
        where: { userId },
      });
  
      // Mengambil satu record Presence berdasarkan tgl_absen
      const presenceRecordToUpdate = await Presence.findOne({
        where: { userId, tgl_absen },
      });
  
      if (!presenceRecordToUpdate) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
      }
  
      // Melakukan update pada data yang telah ditemukan
      // Misalnya, mengupdate jam_masuk dan jam_pulang
      presenceRecordToUpdate.pulang = req.body.pulang;
  
      // Menyimpan perubahan ke dalam database
      await presenceRecordToUpdate.save();
  
      res.status(200).json({msg: "anda telah pulang"});
    } catch (error) {
      console.error('Gagal mengambil atau mengupdate data Presence:', error);
      res.status(500).json({ error: 'Gagal mengambil atau mengupdate data Presence' });
    }
  }

export const deletePresence = (req, res) =>{

}