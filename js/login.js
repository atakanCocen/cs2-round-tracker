const loginForm = document.getElementById('loginForm');
var username = null;
var password = null;

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


function validateLogin(data) {
    
    let isValid = false;
    if ((data.username != null && data.username.length != 0) && data.password != null && data.password.length != 0){
        isValid = true;
    }

    return isValid;
}