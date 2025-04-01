'use strict'

const $ = document.querySelector.bind(document);


// login link action
$('#loginLink').addEventListener('click',openLoginScreen);

// register link action
$('#registerLink').addEventListener('click',openRegisterScreen);

// logout link action
$('#logoutLink').addEventListener('click',openLoginScreen);

// Sign In button action
$('#loginBtn').addEventListener('click', async () => {
    const username = $('#loginUsername').value;
    const password = $('#loginPassword').value;

    if (!username || !password) {
        showError('Username and password are required.');
        return;
    }

    try {
        const response = await fetch(`/users/${username}`);
        const doc = await response.json();

        if (doc.error) {
            showError(doc.error);
            return;
        }

        if (doc.password !== password) {
            showError('Username and password do not match.');
            return;
        }

        openHomeScreen(doc);
    } catch (err) {
        showError('ERROR: ' + err);
    }
});

// Register button action
$('#registerBtn').addEventListener('click', async () => {
    if (!$('#registerUsername').value ||
        !$('#registerPassword').value ||
        !$('#registerName').value ||
        !$('#registerEmail').value) {
        showError('All fields are required.');
        return;
    }

    const data = {
        username: $('#registerUsername').value,
        password: $('#registerPassword').value,
        name: $('#registerName').value,
        email: $('#registerEmail').value
    };

    try {
        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const doc = await response.json();

        if (doc.error) {
            showError(doc.error);
            return;
        }

        openHomeScreen(doc);
    } catch (err) {
        showError('ERROR: ' + err);
    }
});

// Update button action
$('#updateBtn').addEventListener('click', async () => {
    // Check to make sure no fields are blank
    if (!$('#updateName').value || !$('#updateEmail').value) {
        showError('Fields cannot be blank.');
        return;
    }

    // Grab all user info from input fields
    const data = {
        name: $('#updateName').value,
        email: $('#updateEmail').value
    };

    try {
        const username = $('#username').innerText;

        const response = await fetch(`/users/${username}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const doc = await response.json();

        if (doc.error) {
            showError(doc.error);
            return;
        }

        if (doc.ok) {
            alert('Your name and email have been updated.');
        }
    } catch (err) {
        showError('ERROR: ' + err);
    }
});

// Delete button action
$('#deleteBtn').addEventListener('click', async () => {
    // Confirm that the user wants to delete
    if (!confirm("Are you sure you want to delete your profile?"))
        return;

    try {
        const username = $('#username').innerText;

        const response = await fetch(`/users/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const doc = await response.json();

        if (doc.error) {
            showError(doc.error);
            return;
        }

        openLoginScreen();
    } catch (err) {
        showError('ERROR: ' + err);
    }
});

function showListOfUsers(){

    // TODO:
    //   GET /users
    //     decode response from json to an array called docs
    //     for every doc in docs, call showUserInList(doc)
    //       you can do this by using a for-loop or, better yet, a forEach function:
    //         docs.forEach(showUserInList)
    //   use .catch(err=>showError('Could not get user list: '+err)}) to show any potential errors

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