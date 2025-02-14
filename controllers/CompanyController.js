import Company from "../models/CompanyModel.js";


export const getCompany = async(req, res) => {
    try {
      const company = await Company.findOne({
        limit: 1,
    });
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const createCompany = async(req, res) => {
   try {
    await Company.create({
       nama: req.body.nama,
       alamat: req.body.alamat,
       longitude: req.body.longitude,
       latitude: req.body.latitude,
       radius: req.body.radius,
       jam_buka: req.body.jam_buka,
       jam_tutup: req.body.jam_tutup,
       status: req.body.status
    })
    res.status(200).json({msg: "data perusahaan telah di buat"})
   } catch (error) {
    res.status(500).json(error.message)
   }
}
export const updateCompany = async(req, res) => {
    const company = await Company.findOne({
      limit: 1,
  });
  try {
    await Company.update({
      nama: req.body.nama,
      alamat: req.body.alamat,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      radius: req.body.radius,
      jam_buka: req.body.jam_buka,
      jam_tutup: req.body.jam_tutup,
      status: req.body.status
    },{
        where: {
            id: company.id
        }
    });
    res.status(200).json({msg: "data perusahaan telah di update"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}