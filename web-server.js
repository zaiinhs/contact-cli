const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 2000;
const {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
} = require("./utils/contact");

const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// Praktek ejs
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

// Application level middleware
// app.use((req, res, next) => {
//   console.log("time: ", Date.now());
//   next(); // ini berfungsi ketika middleware nya selesai dijalankan maka akan melanjutkan membaca kode dibawah, jika ini dihapus maka akan error atau loading terus
// });

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "zainal abidin",
      email: "zain@gmail.com",
    },
    {
      nama: "zainal",
      email: "zainal@gmail.com",
    },
    {
      nama: "abidin",
      email: "abidin@gmail.com",
    },
  ];

  res.render("index", {
    nama: "Zainal Abidin",
    title: "Halaman Home",
    mahasiswa,
    layout: "layouts/main-layout",
  });
  //   res.sendFile("./index.html", { root: __dirname });
});

app.get("/about", (req, res) => {
  //   res.send("hello about");
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  //   console.log(contacts);
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    contacts,
    msg: req.flash("msg"),
  });
});

// tambah data
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "form tambah data kontak",
    layout: "layouts/main-layout",
  });
});

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplicate = checkDuplicate(value);
      if (duplicate) {
        throw new Error("nama sudah ditambahkan!");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No hp tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "form tambah data kontak",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      // kirimkan flash message
      req.flash("msg", "Data contact berhasil ditambahkan");
      res.redirect("/contact");
    }
    //   res.send(req.body);
  }
);

// proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  // jika contact tidak ada
  if (!contact) {
    res.status(404);
    res.send("<h4>404</h4>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Data contact berhasil dihapus!");
    res.redirect("/contact");
  }
});

// Buat route edit /ubah data
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("edit-contact", {
    title: "form ubah data kontak",
    layout: "layouts/main-layout",
    contact,
  });
});

// proses ubah data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const duplicate = checkDuplicate(value);
      if (value !== req.body.oldNama && duplicate) {
        throw new Error("nama sudah ditambahkan!");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No hp tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("edit-contact", {
        title: "form ubah data kontak",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body);
      // // kirimkan flash message
      req.flash("msg", "Data contact berhasil diubah");
      res.redirect("/contact");
    }
    //   res.send(req.body);
  }
);

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman detail Contact",
    contact,
  });
});

app.use("/", (req, res) => {
  res.send("Errorrr");
});

app.listen(port, () => {
  console.log("port listening at " + port);
});

// const http = require("http");
// const port = 3000;
// const fs = require("fs");

// const render = (path, res) => {
//   fs.readFile(path, (err, data) => {
//     if (err) {
//       res.writeHead(404);
//       res.write("error notfound");
//     } else {
//       res.write(data);
//     }
//     res.end();
//   });
// };

// http
//   .createServer((req, res) => {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//     });

//     const url = req.url;

//     // switch (url) {
//     //   case "/about":
//     //     render("./about.html", res);
//     //     break;
//     //   case "/contact":
//     //     render("./contact.html", res);
//     //     break;
//     //   default:
//     //     render("./index.html", res);
//     //     break;
//     // }

//     if (url === "/about") {
//       render("./about.html", res);
//     } else if (url === "/contact") {
//       render("./contact.html", res);
//     } else {
//       render("./index.html", res);
//     }
//   })

//   .listen(port, () => {
//     console.log("server is listening port");
//   });
