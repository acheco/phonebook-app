const express = require('express');
const app = express();
const {v4: uuidv4} = require('uuid');
const morgan = require('morgan');
const cors = require('cors');

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());


morgan.token('body', req => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '));

let contacts = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

app.get('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) {
        res.status(404).json({'message': 'Contact Not Found'});
        return;
    }
    res.json(contact);
});

app.get('/info', (req, res) => {
    const totalContacts = contacts.length;
    const DATE = new Date();
    res.send(`Phonebook has info for ${totalContacts} people <br/> ${DATE}`);

});

app.delete('/api/contacts/:id', (req, res) => {
    const id = Number(req.params.id);
    contacts = contacts.filter(contact => contact.id !== id);

    res.status(204).end();
});

app.post('/api/contacts', (req, res) => {
    const body = req.body;
    const contactExist = contacts.find(contact => contact.name === body.name);

    if (!body.name) {
        res.status(400).json({'error': 'Name cannot be empty'});
        return;
    }

    if (!body.number) {
        res.status(400).json({'error': 'Number cannot be empty'});
        return;
    }

    if (contactExist) {
        res.status(400).json({'error': 'Name already exists'});
        return;
    }

    const contact = {
        id: uuidv4(),
        name: body.name,
        number: body.number,
    }

    res.json(contacts.concat(contact));

});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})