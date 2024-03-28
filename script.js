
document.getElementById('incrementBtn').addEventListener('click', () => {
    fetch('/increment', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/javascript',
        },
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => {
        console.error('Error:', error);
    });
});
