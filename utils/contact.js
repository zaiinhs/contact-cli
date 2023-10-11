const fs = require("fs");
const load = require("nodemon/lib/config/load");

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

const findContact = (nama) => {
  const contacts = loadContact();

  const contact = contacts.find(
    (item) => item.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

// menimpa file contacts.json dengan data baru
const saveContact = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// menambahkan data contact baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);

  saveContact(contacts);
};

// cek nama duplicate
const checkDuplicate = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

// hapus contact
const deleteContact = (nama) => {
  const contact = loadContact();
  const filteredContact = contact.filter((contact) => contact.nama !== nama);
  console.log(filteredContact);
  saveContact(filteredContact);
};

const updateContact = (contactBaru) => {
  const contact = loadContact();

  // hilangkan contact lama yg nama nya sama dengan oldNama
  const filteredContact = contact.filter(
    (contact) => contact.nama !== contactBaru.oldNama
  );
  delete contactBaru.oldNama;
  filteredContact.push(contactBaru);
  saveContact(filteredContact);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
};
