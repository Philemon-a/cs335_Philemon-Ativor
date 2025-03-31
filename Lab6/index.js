
const express = require('express'); // load express module
const nedb = require("nedb-promises"); // load nedb module

const app = express(); // init app
const db = nedb.create('myfile.json'); // init db

app.use(express.static('public')); // enable static routing

app.use(express.json())

// add your http routes here
// . . . . .
// Insert
app.post('/Insert', (req, res) => {
        const doc = req.body; // Validate JSON
        db.insertOne(doc)
            .then((doc) => res.send({_id:doc._id}))
            .catch((err) => res.send({err:"Could not insert document. ", err}));
   
});

// Search
app.get('/data/:id', (req, res) => {
        const doc = req.body;
        db.insertOne(doc)
            .then((docs) => {
                res.send(doc)
            })
            .catch((err) => res.send({error: "Could not find document. ", err}));
});

app.get('/data', (req, res)=>{
    db.find({})
    .then(docs=>res.send(docs))
    .catch(err=>res.send({err}))
})

app.patch('/data/:id', (req, res)=>{
    db.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    ).then(result => res.send({result}))
    .catch(err=>res.send({err}))
})



// default route
app.all('*',(req,res)=>{res.status(404).send('Invalid URL.')});
// start server
app.listen( 3000, ()=>console.log('server started: http://localhost:3000') );
