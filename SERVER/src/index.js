const express =require('express')//
const app = express()//
const port =3000
const path = require('path');
const route = require('./routes');
const cors = require("cors");
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
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use(methodOverride('_method'));

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
const db = require('./config/db');


db.connect();

route(app);
app.use(cors());
// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));
