require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/Contact");

// Middlewares
app.use(express.static("dist"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body ",
  ),
);

app.get("/api/contacts", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.get("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).send("Contact Not Found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).end();
    });
});

app.get("/info", (req, res) => {
  const totalContacts = contacts.length;
  const DATE = new Date();
  res.send(`Phonebook has info for ${totalContacts} people <br/> ${DATE}`);
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/contacts", (req, res) => {
  const body = req.body;
  // let contactExist = "";

  if (!body.name) {
    res.status(400).json({ error: "Name cannot be empty" });
    return;
  }

  if (!body.number) {
    res.status(400).json({ error: "Number cannot be empty" });
    return;
  }

  // Contact.find({ name: body.name }).then((contact) => {
  //   contactExist = contact.name;
  // });
  //
  // if (contactExist) {
  //   res.status(400).json({ error: "Name already exists" });
  //   return;
  // }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).end();
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
