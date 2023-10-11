const fs = require("fs");

// membuat folder data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file .json
const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContact = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

const saveContact = (nama, email) => {
  const contact = { nama, email };

  // const file = fs.readFileSync("data/contacts.json", "utf-8");
  // const contacts = JSON.parse(file);
  const contacts = loadContact();

  // Cek duplicate
  const duplicate = contacts.find((contact) => contact.nama === nama);

  if (duplicate) {
    console.log("Nama yg dimasukkan sudah terdaftar");
    return false;
  }

  console.log("Berhasil ditambahkan");

  contacts.push(contact);
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

const listContact = () => {
  const contacts = loadContact();

  contacts.forEach((contact, i) => {
    console.log(`${i + 1} - ${contact.nama} - ${contact.email}`);
  });
};

const detailContact = (nama) => {
  const contacts = loadContact();

  const contact = contacts.find(
    (item) => item.nama.toLowerCase() === nama.toLowerCase()
  );

  if (!contact) {
    console.log("kosong");
    return false;
  }

  console.log(contact.nama);
  console.log(contact.email);
};

const deleteContact = (nama) => {
  const contacts = loadContact();

  const newContact = contacts.filter(
    (item) => item.nama.toLowerCase() !== nama.toLowerCase()
  );

  if (contacts.length === newContact.length) {
    console.log("Data tidak ditemukan");
  }

  fs.writeFileSync("data/contacts.json", JSON.stringify(newContact));
  // console.log("data berhasil dihapus");
};

module.exports = { saveContact, listContact, detailContact, deleteContact };
