import Company from "../models/CompanyModel.js";

export const limitCompany = async(req, res, next) => {
    try {
        const count = await Company.count();
        if (count === 0) {
          // Izinkan pembuatan record pertama
          next();
        } else {
          // Tolak permintaan jika sudah ada satu record
          return res.status(400).json({ message: 'Hanya satu record yang diizinkan.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
      }
}