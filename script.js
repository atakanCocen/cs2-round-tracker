var mapSelection = '';
var mapOptions = document.getElementsByClassName('mapSelection');
for (i = 0; i < mapOptions.length; i++) {
    mapOptions[i].addEventListener("click", function(event) {
        mapSelection = event.target.getAttribute('data-mapselection');
    });
}

var winBtns = document.getElementsByClassName('winBtn');
for (let i = 0; i < winBtns.length; i++){
    winBtns[i].addEventListener("click", (event) => {
        fetch('/win?' + new URLSearchParams(
            {
                map: mapSelection
            }), 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/javascript',
            },
    
        })
        .then(res => {
            console.log('Response: ' + res);
            res.json()
        })
        .then(data => console.log('Success:', data))
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

//document.getElementById('incrementBtn').addEventListener('click', () => {
//    fetch('/increment?' + new URLSearchParams(
//        {
//            map: mapSelection
//        }), 
//        {
//            method: 'POST',
//            headers: {
//                'Content-Type': 'text/javascript',
//        },
//
//    })
//    .then(response => response.json())
//    .then(data => console.log('Success:', data))
//    .catch((error) => {
//        console.error('Error:', error);
//    });
//});
