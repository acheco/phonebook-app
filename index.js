require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/Contact");
const assert = require("node:assert");

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

  if (body.name === undefined || body.name === null || body.name === "") {
    res.status(400).json({ error: "Name cannot be empty" });
    return;
  }

  if (body.number === undefined || body.number === null || body.number === "") {
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
      // Usar el validador customizado de mongoose
      if (err.name === "ValidationError") {
        const errMessage = Object.values(err.errors).map((e) => e.message);
        res.status(400).json({ error: errMessage });
      } else {
        res.status(500).json({ error: "Server error" }).end();
      }
    });
});

app.put("/api/contacts/:id", (req, res, next) => {
  const { number } = req.body;

  if (!number) {
    res.status(400).json({ error: "Number cannot be empty" });
    return;
  }

  Contact.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => next(err));
});

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformed id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
