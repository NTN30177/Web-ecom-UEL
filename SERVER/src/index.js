const express =require('express')
const app = express()
const port =3000
const path = require('path');
const route = require('./routes');
const cors = require("cors");
const methodOverride = require('method-override')


 
//Http Request Logger
const morgan =require("morgan")

///API
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
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