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

app.delete("/api/contacts/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/contacts", (req, res) => {
  const body = req.body;

  if (!body.name) {
    res.status(400).json({ error: "Name cannot be empty" });
    return;
  }

  if (!body.number) {
    res.status(400).json({ error: "Number cannot be empty" });
    return;
  }

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

app.put("/api/contacts/:id", (req, res, next) => {
  const body = req.body;

  const contact = {
    number: body.number,
  };
  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformed id" });
  }

  if (err.name === "") {
    return res.status(400).send({ error: "Name cannot be empty" });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
