const sanitize = require("../helpers/sanitize");
const connection = require("../helpers/db");
const { uploadSingle } = require("../helpers/wasabi");

const mysql = require("mysql2");
const moment = require("moment");
moment.locale("id");

const fs = require("fs");
const path = require("path");

exports.getUserProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const email = req.user.email;

    const queryGetUser = `SELECT u.id , u.email, u.first_name , u.last_name , u.profil_image , u.balance 
                            FROM users u
                            WHERE u.email = '${email}'
                            AND u.id = '${id}'
                            LIMIT 1`;
    const dataUser = await connection.query(queryGetUser);

    if (!dataUser || dataUser.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data user tidak ditemukan",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Sukses",
        data: dataUser[0],
      });
    }
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

exports.editUserProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const body = {
      first_name: sanitize.escapeHtmlPlus(req.body.first_name) ?? "",
      last_name: sanitize.escapeHtmlPlus(req.body.last_name) ?? "",
    };

    const queryGetUser = `SELECT u.id, u.first_name, u.last_name, u.profil_image, u.email
                            FROM users u
                            WHERE u.id = '${id}'
                            LIMIT 1`;
    const dataUser = await connection.query(queryGetUser);

    if (!dataUser || dataUser.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data user tidak ditemukan",
        data: null,
      });
    }

    const bodyUpdate = {
      first_name: body.first_name ?? dataUser[0].first_name,
      last_name: body.last_name ?? dataUser[0].last_name,
    };

    const queryUpdate = mysql.format("UPDATE users SET ? WHERE id = ?", [
      bodyUpdate,
      dataUser[0].id,
    ]);

    dataUpdate = await connection.query(queryUpdate);

    if (!dataUpdate) {
      return res.status(400).json({
        status: 102,
        message: "Gagal Update",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Update Pofile berhasil",
        data: {
          email: dataUser[0].email,
          first_name: bodyUpdate.first_name,
          last_name: bodyUpdate.last_name,
          profile_image: dataUser[0].profile_image ?? "",
        },
      });
    }
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

exports.editUserImage = async (req, res) => {
  try {
    id = req.user.id;
    const file = req.file;
    const fileContent = fs.readFileSync(file.path);

    const queryGetUser = `SELECT u.id, u.first_name, u.last_name, u.profil_image, u.email
                            FROM users u
                            WHERE u.id = '${id}'
                            LIMIT 1`;
    const dataUser = await connection.query(queryGetUser);

    if (!dataUser || dataUser.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data user tidak ditemukan",
        data: null,
      });
    }

    const filename = `${file.originalname}-${moment().format("MMSSsss")}`;

    const dataImage = await uploadSingle(filename, fileContent, file.mimetype);

    console.log("aaaa", dataImage);

    if (!dataImage || dataImage == "Failed") {
      return res.status(400).json({
        status: 102,
        message: "failed upload image",
        data: null,
      });
    }

    const bodyUpdate = {
      profil_image: dataImage ?? dataUser[0].profil_image,
    };

    const queryUpdate = mysql.format("UPDATE users SET ? WHERE id = ?", [
      bodyUpdate,
      dataUser[0].id,
    ]);

    dataUpdate = connection.query(queryUpdate);

    if (!dataUpdate) {
      return res.status(400).json({
        status: 102,
        message: "Gagal Update",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Update Profile Image berhasil",
        data: {
          email: dataUser[0].email,
          first_name: dataUser[0].first_name,
          last_name: dataUser[0].last_name,
          profile_image: dataImage,
        },
      });
    }
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
