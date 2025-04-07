const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module

const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

app.use(express.static('public'));        // enable static routing to "./public" folder

//TODO:
// automatically decode all requests from JSON and encode all responses into JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//TODO:
// create route to get all user records (GET /users)
//   use db.find to get the records, then send them
//   use .catch(error=>res.send({error})) to catch and send errors
app.get("/users", (req, res)=>{
    db.find({})
    // .then(users => res.send(users))
    .then(users => res.send(users))
    .catch(err=> res.send({err}))
})

//TODO:
// create route to get user record (GET /users/:username)
//   use db.findOne to get user record
//     if record is found, send it
//     otherwise, send {error:'Username not found.'}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.get('/users/:username', async (req,res)=>{
    const user = req.params.username;
    console.log(user)
    const userdata = await db.findOne({username: user})
    console.log(userdata)
    if(userdata){
        res.send(userdata)
    }else{
        res.status(404).send({error: "username was not found"})
    }
})

//TODO:
// create route to register user (POST /users)
//   ensure all fields (username, password, email, name) are specified; if not, send {error:'Missing fields.'}
//   use findOne to check if username already exists in db
//     if username exists, send {error:'Username already exists.'}
//     otherwise,
//       use insertOne to add document to database
//       if all goes well, send returned document
//   use .catch(error=>res.send({error})) to catch and send other errors
app.post('/users', async (req, res)=>{
    try{
        const user = req.body;
        const userRecord = await db.find(user)
        console.log(userRecord)
        if(userRecord.length > 0){
            res.status(400).json({error: "user already exsits, Try Login"})
        }else{
            newUser = await db.insertOne(user)
            console.log(newUser)
            res.send(newUser)
        }
        
    } catch (err){
       console.error("err message ", err) 
    }

})

//TODO:
// create route to update user doc (PATCH /users/:username)
//   use updateOne to update document in database
//     updateOne resolves to 0 if no records were updated, or 1 if record was updated
//     if 0 records were updated, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.patch('/users/:username', async(req, res)=>{
    const user = req.params.username
    console.log(req.body)
    const update = await db.update({username: user}, {$set: req.body})
    console.log(update)
    if(update){
        res.send({message: "Your name and email have been update"})
    }else{
        res.status(404).send({error: "Something went worng"})
    }
})


//TODO:
// create route to delete user doc (DELETE /users/:username)
//   use deleteOne to update document in database
//     deleteOne resolves to 0 if no records were deleted, or 1 if record was deleted
//     if 0 records were deleted, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.delete("/users/:username", async (req, res)=>{
    const user = req.params.username;
    console.log(user)
    const deleteData = await db.remove({username: user})
    console.log(deleteData)
    if(deleteData){
        res.send({message: "Acount sucessfull deleted sorry to see you go"})
    }else{
        res.status(404).send({error:"Something went wrong"})
    }
})

// default route
app.all('*',(req,res)=>{res.status(404).send('Invalid URL.')});

// start server
app.listen(3000,()=>console.log("Server started on http://localhost:3000"));
