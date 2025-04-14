const express = require('express');       // load express module
const nedb = require("nedb-promises");    // load nedb module
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const app = express();                    // init app
const db = nedb.create('users.jsonl');    // init db

app.use(express.static('public'));        // enable static routing to "./public" folder

//TODO:
// automatically decode all requests from JSON and encode all responses into JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//TODO:
// create route to get all user records (GET /users)
//   use db.find to get the records, then send them
//   use .catch(error=>res.send({error})) to catch and send errors
app.get("/users", (req, res) => {
    db.find({})
        // .then(users => res.send(users))
        .then(users => res.send(users))
        .catch(err => res.send({ err }))
})

//TODO:
// create route to get user record (GET /users/:username)
//   use db.findOne to get user record
//     if record is found, send it
//     otherwise, send {error:'Username not found.'}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.get('/users/:username', async (req, res) => {
    const user = req.params.username;
    console.log(user)
    const userdata = await db.findOne({ username: user })
    console.log(userdata)
    if (userdata) {
        res.send(userdata)
    } else {
        res.status(404).send({ error: "username was not found" })
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
app.post('/users', async (req, res) => {
    try {
        const { username, password, email, name } = req.body;

        if (!username || !password || !email || !name) {
            res.status(400).json({ error: "Missing fields." });
            return;
        }
        const userRecord = await db.findOne({ username });
        console.log(userRecord);
        if (userRecord) {
            res.status(400).json({ error: "User already exists, try logging in." });
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const authenticationToken = crypto.randomBytes(32).toString('hex');

        const newUser = {
            username,
            password: hashedPassword,
            email,
            name,
            authenticationToken
        };

        const insertedUser = await db.insertOne(newUser);
        console.log(insertedUser);

        delete insertedUser.password;
        res.status(201).send(insertedUser);
    } catch (err) {
        console.error("Error message: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post('/users/auth', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.send({ error: 'Missing username or password.' });
            return;
        }

        const user = await db.findOne({ username });
        if (!user) {
            res.send({ error: 'Invalid username or password.' });
            return;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            res.send({ error: 'Invalid username or password.' });
            return;
        }

        const authenticationToken = crypto.randomBytes(32).toString('hex');
        await db.updateOne({ username }, { $set: { authenticationToken } });

        delete user.password;
        user.authenticationToken = authenticationToken;
        res.send(user);
    } catch (error) {
        res.send({ error: error.message });
    }
});

//TODO:
// create route to update user doc (PATCH /users/:username)
//   use updateOne to update document in database
//     updateOne resolves to 0 if no records were updated, or 1 if record was updated
//     if 0 records were updated, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.patch('/users/:username/:authenticationToken', async (req, res) => {
    try {
        const { username, authenticationToken } = req.params;
        const { name, email } = req.body;

        if (!name && !email) {
            res.send({ error: 'No fields to update.' });
            return;
        }

        const user = await db.findOne({ username, authenticationToken });
        if (!user) {
            res.send({ error: 'Invalid authentication token.' });
            return;
        }

        const result = await db.updateOne(
            { username },
            { $set: { ...(name && { name }), ...(email && { email }) } }
        );

        if (result === 0) {
            res.send({ error: 'Something went wrong.' });
        } else {
            res.send({ ok: true });
        }
    } catch (error) {
        res.send({ error: error.message });
    }
});


//TODO:
// create route to delete user doc (DELETE /users/:username)
//   use deleteOne to update document in database
//     deleteOne resolves to 0 if no records were deleted, or 1 if record was deleted
//     if 0 records were deleted, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors
app.delete('/users/:username/:authenticationToken', async (req, res) => {
    try {
        const { username, authenticationToken } = req.params;

        const user = await db.findOne({ username, authenticationToken });
        if (!user) {
            res.send({ error: 'Invalid authentication token.' });
            return;
        }
        const result = await db.deleteOne({ username });
        if (result === 0) {
            res.send({ error: 'Something went wrong.' });
        } else {
            res.send({ message: 'Account successfully deleted. Sorry to see you go.' });
        }
    } catch (error) {
        res.send({ error: error.message });
    }
});

app.post('/users/logout', async (req, res) => {
    try {
        const { username, authenticationToken } = req.body;

        // Verify the authentication token
        const user = await db.findOne({ username, authenticationToken });
        if (!user) {
            res.send({ error: 'Invalid authentication token.' });
            return;
        }

        // Remove the authentication token
        await db.updateOne({ username }, { $unset: { authenticationToken: "" } });
        res.send({ message: 'Successfully logged out.' });
    } catch (error) {
        res.send({ error: error.message });
    }
});

// default route
app.all('*', (req, res) => { res.status(404).send('Invalid URL.') });

// start server
app.listen(3000, () => console.log("Server started on http://localhost:3000"));
