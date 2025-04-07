'use strict'

const $ = document.querySelector.bind(document);


// login link action
$('#loginLink').addEventListener('click',openLoginScreen);

// register link action
$('#registerLink').addEventListener('click',openRegisterScreen);

// logout link action
$('#logoutLink').addEventListener('click',openLoginScreen);

// Sign In button action
$('#loginBtn').addEventListener('click',()=>{
    // check to make sure username/password aren't blank
    if(!$('#loginUsername').value || !$('#loginPassword').value)
        return;
    // TODO: 
    //   GET /users/{username}, where {username} is $('#loginUsername').value
    //     decode response from json to object called doc
    //     if doc.error, call showError(doc.error)
    //     otherwise, if doc.password is NOT the same as $('#loginPassword').value,
    //       call showError('Username and password do not match.')
    //     otherwise, call openHomeScreen(doc)
    //   use .catch(err=>showError('ERROR: '+err)}) to show any other errors
    const username =  $('#loginUsername').value;
    const userpassword =  $('#loginPassword').value
    fetch(`/users/${username}`)
    .then(async (res)=>{
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.error)
        }
        return data
    })
    .then((data)=>{
        if(data.password === userpassword){
            openHomeScreen(data)
        }else{
            showError("Password didn't match please try again")
        }
    })
    .catch(err => showError(err.message))
});

// Register button action
$('#registerBtn').addEventListener('click',()=>{
    // check to make sure no fields aren't blank
    if(!$('#registerUsername').value ||
            !$('#registerPassword').value ||
            !$('#registerName').value ||
            !$('#registerEmail').value){
        showError('All fields are required.');
        return;
    }
    // grab all user info from input fields, and POST it to /users
    var data = {
        username: $('#registerUsername').value,
        password: $('#registerPassword').value,
        name: $('#registerName').value,
        email: $('#registerEmail').value
    };
    // TODO: 
    //   POST /users
    //     convert data (defined above) to json, and send via POST to /users
    //     decode response from json to object called doc
    //     if doc.error, showError(doc.error)
    //     otherwise, openHomeScreen(doc)
    //   use .catch(err=>showError('ERROR: '+err)}) to show any other errors
    const doc = JSON.stringify(data);
    fetch('/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: doc
    })
    .then(async (res) => {
        const data = await res.json();
        console.log(data);
        if(!res.ok){
            throw new Error(data.error);
        }
        return data
    }) 
    .then(data => {
        console.log(data);
        console.log(`Data: ${data}`);
        openHomeScreen(data);
    })
    .catch(err => {
        console.error(`Error: ${err.message}`)
        showError(err.message);
        });
    });

// Update button action
$('#updateBtn').addEventListener('click',()=>{
    // check to make sure no fields aren't blank
    if(!$('#updateName').value || !$('#updateEmail').value){
        showError('Fields cannot be blank.');
        return;
    }
    // grab all user info from input fields
    var data = {
        name: $('#updateName').value,
        email: $('#updateEmail').value
    };
    // TODO: 
    //   PATCH /users/{username}, where {username} is $('#username').innerText
    //     convert data (defined above) to json, and send via PATCH to /users/{username}
    //     decode response from json to object called doc
    //     if doc.error, showError(doc.error)
    //     otherwise, if doc.ok,
    //       alert("Your name and email have been updated.");
    //   use .catch(err=>showError('ERROR: '+err)}) to show any other errors
    const username =  $('#username').innerText;
    fetch(`users/${username}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(async (res)=>{
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.error)
        }
        return data
    })
    .then((data)=> alert(data.message))
    .catch(err => showError(err.message))
});

// Delete button action
$('#deleteBtn').addEventListener('click',()=>{
    // confirm that the user wants to delete
    if(!confirm("Are you sure you want to delete your profile?"))
        return;
    // TODO: 
    //   DELETE /users/{username}, where {username} is $('#username').innerText
    //     decode response from json to object called doc
    //     if doc.error, showError(doc.error)
    //     otherwise, openLoginScreen()
    //   use .catch(err=>showError('ERROR: '+err)}) to show any other errors
    const username =  $('#username').innerText;
    console.log(username)
    fetch(`/users/${username}`,{
        method: "Delete",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async(res)=>{
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.error)
        }
        return data
    })
    .then(()=> openLoginScreen())
    .catch(err => showError(err.message))
});

function showListOfUsers(){
    // TODO:
    //   GET /users
    //     decode response from json to an array called docs
    //     for every doc in docs, call showUserInList(doc)
    //       you can do this by using a for-loop or, better yet, a forEach function:
    //         docs.forEach(showUserInList)
    //   use .catch(err=>showError('Could not get user list: '+err)}) to show any potential errors
    fetch("/users")
    .then(res=> res.json())
    .then(data => {
        data.forEach(element => {
            showUserInList(element)
        });
    })
    .catch(err => showError(err))
}

function showUserInList(doc){
    // add doc.username to #userlist
    var item = document.createElement('li');
    $('#userlist').appendChild(item);
    item.innerText = doc.username;
}

function showError(err){
    // show error in dedicated error div
    $('#error').innerText=err;
}

function resetInputs(){
    // clear all input values
    var inputs = document.getElementsByTagName("input");
    for(var input of inputs){
        input.value='';
    }
}

function openHomeScreen(doc){
    // hide other screens, clear inputs, clear error
    $('#loginScreen').classList.add('hidden');
    $('#registerScreen').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal home screen
    $('#homeScreen').classList.remove('hidden');
    // display name, username
    $('#name').innerText = doc.name;
    $('#username').innerText = doc.username;
    // display updatable user info in input fields
    $('#updateName').value = doc.name;
    $('#updateEmail').value = doc.email;
    // clear prior userlist
    $('#userlist').innerHTML = '';
    // show new list of users
    showListOfUsers();
}

function openLoginScreen(){
    // hide other screens, clear inputs, clear error
    $('#registerScreen').classList.add('hidden');
    $('#homeScreen').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal login screen
    $('#loginScreen').classList.remove('hidden');
}

function openRegisterScreen(){
    // hide other screens, clear inputs, clear error
    $('#loginScreen').classList.add('hidden');
    $('#homeScreen').classList.add('hidden');
    resetInputs();
    showError('');
    // reveal register screen
    $('#registerScreen').classList.remove('hidden');
}

