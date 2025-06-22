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
  const html = fs.readFileSync("./public/html/index.html").toString();
  const template = Handlebars.compile(html);
  const result = template({ contacts: contacts });
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

app.listen(3000);
