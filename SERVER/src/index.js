const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors'); // Moved this line here

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const route = require('./routes');
const User = require('./app/models/user');
const { Product, Type, Subtype, Color } = require('./app/models/product');
const config = require('./config/config');

// Http Request Logger
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: config.sessionSecret }));

app.use(async (req, res, next) => {
  if (req.session && req.session.user_id) {
    res.locals.userDataSession = await User.findById(req.session.user_id).lean();
  } else {
    res.locals.userDataSession = null;
  }
  next();
});

// API CORS setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const db = require('./config/db');
db.connect();

route(app);
app.options('*', (req, res) => {
  res.status(204).end();
});
