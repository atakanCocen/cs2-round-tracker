const registerForm = document.getElementById('registerForm');
var username = null;
var password = null;
var email = null;

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
                alert('Success');
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});


function validateRegistration(data) {
    
    let isValid = false;
    if ((data.username != null && data.username.length != 0) && data.password != null && data.password.length != 0 && data.email.length > 8 && data.email.includes("@")){
        isValid = true;
    }

    return isValid;
}