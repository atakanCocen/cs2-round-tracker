var mapSelection = '';
var mapOptions = document.getElementsByClassName('mapSelection');
for (i = 0; i < mapOptions.length; i++) {
    mapOptions[i].addEventListener("click", function(event) {
        mapSelection = event.target.getAttribute('data-mapselection');
    });
}

var winBtns = document.getElementsByClassName('winBtn');
winBtns.foreach(w => {
    w.addEventListener("click", (event) => {

    });
});

document.getElementById('incrementBtn').addEventListener('click', () => {
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
