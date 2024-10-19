const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log("Error connecting to MongoDB", err.message));

//  Definición del schema para los contactos
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name must be at least 3 characters"],
  },
  number: {
    type: String,
    // Validación customizada
    validate: {
      validator: (v) => {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`, // Usar props.value para obtener el valor
    },
    required: [true, "Please enter a valid phone number"], // Mensaje de error si el campo es requerido
  },
});

// Modificando el Schema
contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Convertimos el object _id en un string y retornarlo como el campo id
    returnedObject.id = returnedObject._id.toString();
    // Eliminar los campos que no necesitamos al hacer select a la Base de Datos
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// Exportación y definición del schema
module.exports = mongoose.model("Contact", contactSchema);
