const express = require("express");
const Handlebars = require("handlebars");
const fs = require("fs");

// 1. import mysql
const mysql = require("mysql");

const app = express();

// 2. membuat koneksi
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  database: "contact",
  user: "root",
  password: "((root))",
});

// 3. melakukan koneksi
db.connect(function (err) {
  if (err == null) {
    console.log("db connection success");
  } else {
    console.log("db connection failed ", err);
  }
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const contacts = [
  { name: "zaka", email: "aka@mail.com" },
  { name: "alif", email: "alif@mail.com" },
  { name: "agus", email: "agus@mail.com" },
];

app.get("/", function (req, res) {
  // ambil html string (gak berubah)
  const html = fs.readFileSync("./public/html/index.html").toString();

  // buat template (gak berubah)
  const template = Handlebars.compile(html);

  // ambil data dari database
  db.query("SELECT * FROM users", function (err, result) {
    if (err) {
      console.log("query error ", err);
      throw err;
    } else {
      // masukkan data ke template
      const resultHtml = template({ contacts: result });

      // tampilkan ke browser
      res.send(resultHtml);
    }
  });
});

app.get("/create", function (req, res) {
  res.sendFile(__dirname + "/public/html/create.html");
});

app.post("/process-create", function (req, res) {
  // ambil data dari form
  const name = req.body.name;
  const email = req.body.email;

  // tambahkan ke contact (butuh diubah!!!!!!)
  contacts.push({ name: name, email: email });

  db.query(
    `INSERT INTO users SET name="${name}", email="${email}"`,
    // "INSERT INTO users SET name=" + name + ", email=" + email,
    function (err, result) {
      if (err) {
        console.log("query error ", err);
        throw err;
      } else {
        // pindahkan user ke /
        res.redirect("/");
      }
    }
  );
});

app.get("/process-delete", function (req, res) {
  // ambil id
  const id = Number(req.query.id);

  // hapus db berdasarkan id
  db.query(`DELETE FROM users WHERE id=${id}`, function (err, result) {
    if (err) {
      console.log("query error ", err);
      throw err;
    } else {
      // pindahkan user ke /
      res.redirect("/");
    }
  });
});

app.get("/edit", function (req, res) {
  const index = Number(req.query.index);
  const editedContact = contacts[index];

  const html = fs.readFileSync("./public/html/edit.html").toString();
  const template = Handlebars.compile(html);
  const result = template({ contact: editedContact, index: index });
  res.send(result);
});

app.post("/process-edit", function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const index = Number(req.query.index);

  contacts[index] = { name: name, email: email };

  res.redirect("/");
});

app.listen(3000);
