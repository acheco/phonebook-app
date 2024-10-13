const mongoose = require("mongoose");
const { mongo } = require("mongoose");

if (process.argv.length < 2) {
  console.log("Need to provide password, contact name and number");
  process.exit(1);
}
const password = process.argv[2];

const db = "phonebookApp";
const url = `mongodb+srv://admin:${password}@cluster0.489ei.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("strictQuery", false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: { type: String },
  number: { type: String },
});

const Contact = new mongoose.model("Contact", contactSchema);

const name = process.argv[3];
const number = process.argv[4];

const contact = new Contact({
  name: name,
  number: number,
});

if (process.argv.length === 5) {
  contact.save().then(() => {
    console.log(`Added ${name}, number ${number} to the phonebook!`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Contact.find({}).then((contacts) => {
    contacts.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
}
