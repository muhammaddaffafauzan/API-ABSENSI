import Position from "../models/PositionModel.js";


export const getPosition = async(req, res) => {
    try {
        const response = await Position.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const getPositionByid = async(req, res) => {
    try {
        const response = await Position.findOne({
              where: {
                uuid: req.params.id
              }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
export const createPosition = async(req, res) => {
   try {
    await Position.create({
       jabatan: req.body.jabatan
    })
    res.status(200).json({msg: "data jabatan telah di buat"})
   } catch (error) {
    res.status(500).json(error.message)
   }
}
export const updatePosition = async(req, res) => {
    const position = await Position.findOne({
        where: {
          id: req.params.id
        }
  });
  try {
    await Position.update({
        jabatan: req.body.jabatan
    },{
        where: {
            id: position.id
        }
    });
    res.status(200).json({msg: "data jabatan updated"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}
export const deletePosition = async(req, res) => {
    const position = await Position.findOne({
        where: {
          id: req.params.id
        }
  });
  try {
    await Position.destroy({
        where: {
            id: position.id
        }
    });
    res.status(200).json({msg: "data jabatan delete"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}