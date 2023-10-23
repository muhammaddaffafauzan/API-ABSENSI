import User from "../models/UsersModel.js";
import Information from "../models/InformationModel.js";
import path from "path";


export const getInformation = async(req, res) =>{
    try {
        let response;
        if(req.role === 'admin')
        {
            response = await Information.findAll({
            include: [{
            model: User,
            attributes: ['name']
            }]
        });
    }else{
        response = await Information.findAll({
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

export const getInformationById = async(req, res) =>{
    try {
        const response = await Information.findOne({
            include: [{
            model: User,
            attributes: ['name', 'role']
            }],
              where: {
                id: req.params.id
              }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const sendInformation = async(req, res) =>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const tgl = req.body.tgl_keterangan
    const ket = req.body.keterangan;
    const als = req.body.alasan;

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
                response = await Information.create({
            userId: req.userId, keterangan: ket, alasan: als, tgl_keterangan: tgl, image: fileName, url: url
            });
         }else{
            res.status(400).json({msg:"hanya user yang bisa mengirim keterangan"});
         }
       
        res.status(201).json({msg: "Information send Successfully"});
    } catch (error) {
        console.log(error)
    }
}

export const deleteInformation = async(req, res) =>{
    const info = await Information.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!info) return res.status(404).json({msg: "No data Found"});
    try {
        let response;
        if(req.role === 'admin')
       {
        response = await Information.destroy({
            where:{
                id : info.id
            }
        });
    }else{
        res.status(400).json({msg:"hanya admin yang bisa menghapus keterangan"}); 
    }
        res.status(200).json({msg: "Information Deleted Successfully"})
    } catch (error) {
        console.log(error)
    }

}