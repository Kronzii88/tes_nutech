const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { JWT_SIGNATURE_KEY = "inisalahsecretnyaliatenv" } = process.env;
const connection = require("../helpers/db");

exports.authUser = async function (req, res, next) {
  try {
    const token = req.headers["token"];
    const payload = jwt.verify(token, JWT_SIGNATURE_KEY);

    // cek token
    const queryCek = `SELECT id, email
    FROM users 
    WHERE id = ${payload.id} AND token = '${token}'`;

    const dataToken = await connection.query(queryCek);
    if (dataToken.length < 1) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({
      metadata: {
        status: 401,
        message: err.message,
      },
      response: {
        name: "UNAUTHORIZED",
      },
    });
  }
};
