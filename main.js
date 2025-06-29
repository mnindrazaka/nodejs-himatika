const express = require("express");
const Handlebars = require("handlebars");
const fs = require("fs");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const contacts = [
  { name: "zaka", email: "aka@mail.com" },
  { name: "alif", email: "alif@mail.com" },
  { name: "agus", email: "agus@mail.com" },
];

app.get("/", function (req, res) {
  // ambil html string
  const html = fs.readFileSync("./public/html/index.html").toString();

  // buat template
  const template = Handlebars.compile(html);

  // masukkan data ke template
  const result = template({ contacts: contacts });

  // kirim hasilnya
  res.send(result);
});

app.get("/create", function (req, res) {
  res.sendFile(__dirname + "/public/html/create.html");
});

app.post("/process-create", function (req, res) {
  // ambil data dari form
  const name = req.body.name;
  const email = req.body.email;

  // tambahkan ke contact
  contacts.push({ name: name, email: email });

  // pindahkan user ke /
  res.redirect("/");
});

app.get("/process-delete", function (req, res) {
  const index = Number(req.query.index);

  contacts.splice(index, 1);

  res.redirect("/");
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
