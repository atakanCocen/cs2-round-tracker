const loginSelections = document.getElementsByClassName('loginSelection');
const registerSelections = document.getElementsByClassName('registerSelection');

const selectionContainer = document.getElementById('selectionContainer');
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
var username = null;
var password = null;
var email = null;

for (let i = 0; i < loginSelections.length; i++){
    loginSelections[i].addEventListener("click", (event) => {
        event.preventDefault();
    
        selectionContainer.style = 'display: none;';
        loginContainer.style = 'display: block;';
        registerContainer.style = 'display: none;';
    });
}

for (let i = 0; i < registerSelections.length; i++){
    registerSelections[i].addEventListener("click", (event) => {
        event.preventDefault();
    
        selectionContainer.style = 'display: none;';
        loginContainer.style = 'display: none;';
        registerContainer.style = 'display: block;';
    });
}


loginForm.addEventListener("submit", (event) =>  {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));
    if (validateLogin(data)) {
        fetch('/login',
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => {
            res.json()
            .then(data => {
                if (data.success){
                    alert('Success');
                    window.location.href = '/';
                }
                
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});

registerForm.addEventListener("submit", (event) =>  {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));
    if (validateRegistration(data)) {
        fetch('/register',
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(res => {
            res.json()
            .then(data => {
                if (data.success) {
                    alert('User successfuly created');
                    window.location.href = '/';
                }
                
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});


function validateLogin(data) {
    
    let isValid = false;
    if ((data.username != null && data.username.length != 0) && data.password != null && data.password.length != 0){
        isValid = true;
    }

    return isValid;
}


function validateRegistration(data) {
    
    let isValid = false;
    if ((data.username != null && data.username.length != 0) && data.password != null && data.password.length != 0 && data.email.length > 8 && data.email.includes("@")){
        isValid = true;
    }

    return isValid;
}