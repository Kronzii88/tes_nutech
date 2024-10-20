const sanitize = require("../helpers/sanitize");
const connection = require("../helpers/db");

const mysql = require("mysql2");
const moment = require("moment");
moment.locale("id");

exports.getBalance = async (req, res) => {
  try {
    const id = req.user.id;

    const queryGetBalance = `SELECT u.balance FROM users u WHERE u.id = '${id}'`;
    const dataBalance = await connection.query(queryGetBalance);

    if (!dataBalance || dataBalance.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data balance tidak ditemukan",
        data: null,
      });
    }

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: {
        balance: dataBalance[0].balance,
      },
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

exports.topUpBalance = async (req, res) => {
  try {
    const id = req.user.id;
    const balance = sanitize.escapeHtmlPlus(req.body.top_up_amount) ?? 0;

    if (isNaN(balance) || balance < 1) {
      return res.status(400).json({
        status: 102,
        message:
          "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
        data: null,
      });
    }

    const queryGetBalance = `SELECT u.balance FROM users u WHERE u.id = '${id}'`;
    const dataBalance = await connection.query(queryGetBalance);

    if (!dataBalance || dataBalance.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data balance tidak ditemukan",
        data: null,
      });
    }

    const queryGetTransaction = `SELECT t.invoice_number FROM transactions t ORDER BY t.id DESC LIMIT 1`;
    const dataTransaction = await connection.query(queryGetTransaction);

    if (!dataTransaction) {
      return res.status(404).json({
        status: 102,
        message: "query transaksi error",
        data: null,
      });
    }
    // top up user balance
    let query = [];

    const dataUpdate = {
      balance: dataBalance[0].balance + balance,
    };

    const queryUpdateBalance = mysql.format("UPDATE users SET ? WHERE id = ?", [
      dataUpdate,
      id,
    ]);
    query.push(queryUpdateBalance);

    // insert transaction
    const latestInvoice = dataTransaction[0]?.invoice_number ?? "";

    const today = moment().format("DDMMYYYY");

    let newCounter;
    if (latestInvoice) {
      const latestDate = latestInvoice.substring(3, 11);
      const latestCounter = parseInt(latestInvoice.split("-")[1], 10);

      if (latestDate === today) {
        newCounter = latestCounter + 1;
      } else {
        newCounter = 1;
      }
    } else {
      newCounter = 1;
    }
    const formattedCounter = newCounter.toString().padStart(3, "0");
    const newInvoiceNumber = `INV${today}-${formattedCounter}`;

    const dataInsertTransaction = {
      id_user: id,
      invoice_number: newInvoiceNumber,
      amount: balance,
      insert_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      description: "Top Up balance",
    };
    const queryInsertTransaction = mysql.format(
      "INSERT INTO transactions SET ?",
      dataInsertTransaction
    );
    query.push(queryInsertTransaction);

    const data = await connection.query_transaksional(query);

    if (data == "Error") {
      return res.status(400).json({
        status: 102,
        message: "gagal insert db",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: {
          balance: balance,
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

exports.createTransaction = async (req, res) => {
  try {
    const id = req.user.id;
    const code = sanitize.escapeHtmlPlus(req.body.service_code) ?? "";

    if (!code) {
      return res.status(400).json({
        status: 102,
        message: "harus mencantumkan kode transaksi",
        data: null,
      });
    }

    const queryGetBalance = `SELECT u.balance FROM users u WHERE u.id = '${id}'`;
    const dataBalance = await connection.query(queryGetBalance);

    if (!dataBalance || dataBalance.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data balance tidak ditemukan",
        data: null,
      });
    }

    const queryGetService = `SELECT s.service_code, s.service_name, s.service_tarif 
                            FROM services s WHERE s.service_code = '${code}' LIMIT 1`;

    const dataService = await connection.query(queryGetService);

    if (!dataService || dataService.length < 1) {
      return res.status(400).json({
        status: 102,
        message: "Service ataus Layanan tidak ditemukan",
        data: null,
      });
    }

    if (dataBalance[0].balance < dataService[0].service_tarif) {
      return res.status(400).json({
        status: 102,
        message: "Saldo anda kurang",
        data: null,
      });
    }

    const queryGetTransaction = `SELECT t.invoice_number FROM transactions t ORDER BY t.id DESC LIMIT 1`;
    const dataTransaction = await connection.query(queryGetTransaction);

    if (!dataTransaction) {
      return res.status(404).json({
        status: 102,
        message: "query transaksi error",
        data: null,
      });
    }

    let query = [];
    // update data user balance
    const dataUpdate = {
      balance: dataBalance[0].balance - dataService[0].service_tarif,
    };

    const queryUpdateBalance = mysql.format("UPDATE users SET ? WHERE id = ?", [
      dataUpdate,
      id,
    ]);
    query.push(queryUpdateBalance);

    // insert transaction
    const latestInvoice = dataTransaction[0]?.invoice_number ?? "";

    const today = moment().format("DDMMYYYY");

    let newCounter;
    if (latestInvoice) {
      const latestDate = latestInvoice.substring(3, 11);
      const latestCounter = parseInt(latestInvoice.split("-")[1], 10);

      if (latestDate === today) {
        newCounter = latestCounter + 1;
      } else {
        newCounter = 1;
      }
    } else {
      newCounter = 1;
    }
    const formattedCounter = newCounter.toString().padStart(3, "0");
    const newInvoiceNumber = `INV${today}-${formattedCounter}`;

    const dataInsertTransaction = {
      id_user: id,
      invoice_number: newInvoiceNumber,
      description: dataService[0].service_name,
      amount: dataService[0].service_tarif,
      flag: 2,
      insert_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    const queryInsertTransaction = mysql.format(
      "INSERT INTO transactions SET ?",
      dataInsertTransaction
    );
    query.push(queryInsertTransaction);

    const data = await connection.query_transaksional(query);

    if (data == "Error") {
      return res.status(400).json({
        status: 102,
        message: "gagal insert db",
        data: null,
      });
    } else {
      return res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: {
          invoice_number: newInvoiceNumber,
          service_code: code,
          service_name: dataService[0].service_name,
          transaction_type: "PAYMENT",
          total_amount: dataService[0].service_tarif,
          created_on: dataInsertTransaction.insert_at,
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

exports.historyTransaction = async (req, res) => {
  try {
    const id = req.user.id;
    const offset = sanitize.escapeHtmlPlus(req.query.offset) ?? 0;
    const limit = sanitize.escapeHtmlPlus(req.query.limit) ?? "";

    if (isNaN(offset) || isNaN(limit)) {
      return res.status(400).json({
        status: 102,
        message: "Offset atau limit harus angka",
        data: null,
      });
    }

    let limitation;
    if (offset && limit) {
      limitation = `LIMIT ${offset}, ${limit}`;
    } else {
      limitation = `OFFSET ${offset}`;
    }

    const queryGetTransaction = `SELECT t.invoice_number, t.flag, t.description, t.amount, t.insert_at 
                                FROM transactions t 
                                WHERE t.id_user = '${id}' 
                                ORDER BY t.insert_at DESC 
                                ${limitation}`;

    const dataTransaction = await connection.query(queryGetTransaction);

    if (!dataTransaction || dataTransaction.length < 1) {
      return res.status(404).json({
        status: 102,
        message: "data transaksi tidak ditemukan",
        data: null,
      });
    }

    const dataResponse = dataTransaction.map((val) => {
      let type;
      if (val.flag == 1) {
        type = "TOPUP";
      } else {
        type = "PAYMENT";
      }
      return {
        invoice_number: val.invoice_number,
        transaction_type: type,
        description: val.description,
        total_amount: val.amount,
        created_on: val.insert_at,
      };
    });

    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: offset,
        limit: limit ?? "",
        record: dataResponse,
      },
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
