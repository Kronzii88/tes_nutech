const sanitize = require("../helpers/sanitize");
const helper = require("../helpers/helper");
const connection = require("../helpers/db");

const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const moment = require("moment");
moment.locale("id");
require("dotenv").config();

const {
  JWT_SIGNATURE_KEY = "this is wrong jwt",
  SECRET_KEY = "this is wrong scret key",
} = process.env;

function createToken(payload) {
  return jwt.sign(payload, JWT_SIGNATURE_KEY, {
    expiresIn: "30d",
  });
}

exports.register = async (req, res) => {
  try {
    const body = {
      email: sanitize.escapeHtmlPlus(req.body.email) ?? "",
      first_name: sanitize.escapeHtmlPlus(req.body.first_name) ?? "",
      last_name: sanitize.escapeHtmlPlus(req.body.last_name) ?? "",
      password: sanitize.escapeHtmlPlus(req.body.password) ?? "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return res.status(400).json({
          status: 102,
          message: `Field ${key} must be filled`,
          data: null,
        });
      }
    }

    if (!helper.validEmail(body.email)) {
      return res.status(400).json({
        status: 102,
        message: "email tidak sesuai",
        data: null,
      });
    }

    if (body.password.length < 8) {
      return res.status(400).json({
        status: 102,
        message: "password tidak sesuai tidak sesuai",
        data: null,
      });
    }

    // cehck user
    const queryCheckUser = `SELECT u.email FROM users u WHERE u.email = '${body.email}'`;
    const checkUser = await connection.query(queryCheckUser);

    if (checkUser.length > 0) {
      return res.status(400).json({
        status: 102,
        message: "email sudah terdaftar silahkan login",
        data: null,
      });
    }

    // insert data
    const insertUser = `INSERT INTO users (email,first_name,last_name,password) 
    values("${body.email}", "${body.first_name}", "${body.last_name}", AES_ENCRYPT('${body.password}', '${SECRET_KEY}'))`;

    const dataUser = await connection.query(insertUser);

    if (!dataUser) {
      return res.status(400).json({
        status: 102,
        message: "gagal insert",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Registrasi berhasil silahkan login",
        data: null,
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

exports.login = async (req, res) => {
  try {
    const body = {
      email: sanitize.escapeHtmlPlus(req.body.email) ?? "",
      password: sanitize.escapeHtmlPlus(req.body.password) ?? "",
    };

    if (!helper.validEmail(body.email)) {
      return res.status(400).json({
        status: 102,
        message: "Paramter email tidak sesuai format",
        data: null,
      });
    }

    const queryGetUser = `SELECT u.id , u.email
                          FROM users u
                          WHERE u.email = '${body.email}'
                          AND u.password = AES_ENCRYPT('${body.password}', '${SECRET_KEY}')`;

    const dataUser = await connection.query(queryGetUser);
    if (!dataUser || dataUser < 1) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null,
      });
    }

    const token = createToken({
      id: dataUser[0].id,
      email: dataUser[0].email,
    });

    const queryUpdate = `UPDATE users
    SET token = '${token}', update_at = '${moment().format(
      "YYYY-MM-DD HH:mm:ss"
    )}'
    WHERE id = ${dataUser[0].id}`;

    const dataUpdate = await connection.query(queryUpdate);
    if (!dataUpdate) {
      return res.status(400).json({
        status: 102,
        message: "Gagal Update",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Login Sukses",
        data: {
          token: token,
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
