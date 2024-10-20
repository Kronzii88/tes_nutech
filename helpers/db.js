const mysql = require("mysql2/promise");
const config = require("../configs/configDB_main");
const response = require("./responseHelper.js");
// const logger = require("./logger");

let poolMain = mysql.createPool(config.db);

async function query(sql, res = undefined) {
  // var connection = await mysql.createConnection(config.db);
  const connection = await poolMain.getConnection();

  try {
    var [result] = await connection.query(sql);
    // connection.end();
    // connection.release();
    return Promise.resolve(result);
  } catch (err) {
    console.error(`Terjadi Error Pada: ${err.message}`, err);
    connection.rollback();
    console.info("Rollback berhasi");
    // logger.error(err);
    if (res != undefined) {
      return response.jsonServerError(
        "Terjadi kesalahan database pada server",
        res,
        "",
        "",
        ""
      );
    }
    return;
  } finally {
    connection.release();
  }
}

async function query_transaksional(list_sql, res = undefined) {
  var connection = await mysql.createConnection(config.db);

  //connection = util.promisify(connection.query)
  await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
  await connection.beginTransaction();

  let result = [];
  try {
    for (sql of list_sql) {
      result.push(connection.query(sql));
    }

    await Promise.all(result);
    await connection.commit();
  } catch (err) {
    console.error(`Terjadi Error Pada: ${err.message}`, err);
    Promise.reject(err);
    await connection.rollback();
    console.info("Rollback berhasil");
    await connection.end();
    return "Error";
  }

  await Promise.resolve(1);
  await connection.end();
  return result;
}

module.exports = {
  query,
  query_transaksional,
};
