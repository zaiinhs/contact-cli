const yargs = require("yargs");
const contacts = require("./contacts");

// console.log(yargs.argv);

yargs.command({
  command: "add",
  describe: "tambahkan nama anda",
  builder: {
    nama: {
      describe: "Nama lengkap",
      demandOption: true,
      type: "string",
    },
    email: {
      describe: "Email",
      demandOption: false,
      type: "string",
    },
  },
  handler(argv) {
    contacts.saveContact(argv.nama, argv.email);
  },
});

// cari nama dari nama
yargs.command({
  command: "detail",
  describe: "Menampilkan detail data sebuah contact",
  builder: {
    nama: {
      describe: "Nama lengkap",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    contacts.detailContact(argv.nama);
  },
});

// delete
yargs.command({
  command: "delete",
  describe: "delete data sebuah contact berdasarkan nama",
  builder: {
    nama: {
      describe: "Nama lengkap",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    contacts.deleteContact(argv.nama);
  },
});

// Menampilkan data
yargs.command({
  command: "list",
  describe: "Tampilkan data",
  handler() {
    contacts.listContact();
  },
});

yargs.parse();

// // const express = require("express");
// // const app = express();

// // app.get("/", function (req, res) {
// //   res.json({
// //     name: "Zainal Abidin",
// //   });
// // });
// // app.get("/about", function (req, res) {
// //   res.send("this is about");
// // });
// // app.get("/contact", function (req, res) {
// //   res.send("this is contact");
// // });
// // app.use("/", (req, res) => {
// //   res.send("<h1>error</h1>");
// // });

// // app.listen(3000);
