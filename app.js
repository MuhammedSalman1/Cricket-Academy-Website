const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const app = express();

const main = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/contactcricket');
  const contactSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    address: String,
    desc: String
  });
  global.contactModel = mongoose.model('contact', contactSchema); // Define contactModel globally
}

const port = 8000;

app.use('/static', express.static('static'));
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  const params = {};
  res.status(200).render('home.pug', params);
});

app.get("/contact", (req, res) => {
  const params = {};
  res.status(200).render('contact.pug', params);
});

app.post("/contact", (req, res) => {
  var mydata = new contactModel(req.body);
  mydata.save().then(() => {
    res.send("This item has been saved to the database");
  }).catch(() => {
    res.status(400).send("Item was not sent to the database");
  });
});

// Call main to define contactModel
main().then(() => {
  // Start the server after connecting to the database
  app.listen(port, () => {
    console.log(`The application successfully started on port ${port}`);
  });
}).catch((err) => {
  console.error("Error connecting to the database:", err);
});
