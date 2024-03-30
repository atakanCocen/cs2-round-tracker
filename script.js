var mapSelection = '';
var mapOptions = document.getElementsByClassName('mapSelection');
for (i = 0; i < mapOptions.length; i++) {
    console.log(mapOptions);
    mapOptions[i].addEventListener("click", function(event) {
        mapSelection = event.target.id;
    });
}

document.getElementById('incrementBtn').addEventListener('click', () => {
    console.log('Map Selection: ' + mapSelection);
    fetch('/increment?' + new URLSearchParams(
        {
            map: mapSelection
        }), 
        {
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
