const express = require('express');
const {google} = require('googleapis');

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1EK75E2-pMJQQRykgZM2dsYBmDG-R8JCjGkZPFKNVDxY";

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });

  res.render('index', {data: getRows.data.values})
  // res.send(getRows.data.values)
});

app.post('/', async (req, res) => {
  const {nama, alamat} = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1EK75E2-pMJQQRykgZM2dsYBmDG-R8JCjGkZPFKNVDxY";

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[nama, alamat]],
    },
  });

  res.redirect('/')
})


const port = 3000;
app.listen(port, () => {console.log(`server running on localhost:${port}`)})