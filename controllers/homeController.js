const connection = require("../helpers/db");

exports.banners = async (req, res) => {
  try {
    const queryGetBanner = `SELECT * FROM banners`;
    const dataBanner = await connection.query(queryGetBanner);

    if (!dataBanner || dataBanner.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data banner tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: dataBanner,
    });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      data: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

exports.services = async (req, res) => {
  try {
    const queryGetServices = `SELECT * FROM services`;
    const dataServices = await connection.query(queryGetServices);

    if (!dataServices || dataServices.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data banner tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: dataServices,
    });
  } catch (err) {
    res.status(500).json({
      status: "FAILED",
      data: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};
