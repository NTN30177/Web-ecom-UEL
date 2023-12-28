const express =require('express')//
const app = express()//
const port =3000
const path = require('path');
const cors = require("cors");
app.use(cors());


const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));





const route = require('./routes');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const session = require('express-session');//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
const User = require('./app/models/user');
const { Product, Type, Subtype, Color } = require('./app/models/product');

const config = require('./config/config');

 
//Http Request Logger
const morgan =require("morgan")

app.use(session({ secret: config.sessionSecret }));

app.use(async (req, res, next) => {
    // Check if req.session exists and has the user_id property
    if (req.session && req.session.user_id) {
        // Lấy thông tin user từ session và gán vào biến userDataSession
        res.locals.userDataSession = await User.findById(
            req.session.user_id
        ).lean();
    } else {
        // Handle the case when user is not authenticated
        res.locals.userDataSession = null; // or any other default value
    }

    next();
});

///API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});



app.use(methodOverride('_method'));

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
const db = require('./config/db');


db.connect();

route(app);
app.options('*', (req, res) => {
    res.status(204).end();
});

app.use(express.static(path.join(__dirname, 'public')));
