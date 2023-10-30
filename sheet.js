require("dotenv").config();
const { GoogleSpreadsheet } = require("google-spreadsheet");
// const creds = require("./credentials.json");

module.exports = class Sheet {
  constructor() {
    this.doc = new GoogleSpreadsheet(
      "1pyLQpwUaNi_RkSZLj590Ct771js8ywjcbZeNvitSfOI"
    );
  }

  async load() {
    // await this.doc.useServiceAccountAuth(creds);
    await this.doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
    await this.doc.loadInfo();
  }

  async getRowsBySheetsTitle(title) {
    const sheet = this.doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    return rows;
  }

  async addRows(i, rows) {
    const sheet = this.doc.sheetsByIndex[i];
    await sheet.addRows(rows);
  }
};
