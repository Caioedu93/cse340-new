const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, hashedPassword){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
    } catch (error) {
      return error.message
    }
  }

/* ***************************
 * Get account by email
 * ************************** */
async function getAccountByEmail(account_email) {
  try {
      const result = await pool.query("SELECT * FROM account WHERE account_email = $1", [account_email]);
      return result.rows[0];
  } catch (error) {
      console.error("getAccountByEmail error: ", error);
      return null;
  }
}


module.exports = {registerAccount, getAccountByEmail};