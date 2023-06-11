const express = require ('express');
const bodyParser  = require('body-parser');

const app = require('./app');
// const app = express();
const port = process.env.port || 3000;

app.use(express.static(__dirname+'/public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    //res.render('index',{error:'err',msg:'err'});
    res.send('Welcome');
})

const server = app.listen(port,()=>{
    console.log(`express server running at ${port}`);
});

// localhsot:3000/register =
//appModule //localhost:3000/auth/register =>
// auth  

