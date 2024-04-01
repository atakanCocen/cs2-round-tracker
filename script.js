var mapSelection = '';
var mapOptions = document.getElementsByClassName('mapSelection');
for (i = 0; i < mapOptions.length; i++) {
    mapOptions[i].addEventListener("click", function(event) {
        console.log(event.target);
        mapSelection = event.target.getAttribute('data-mapselection');
        
        console.log(mapSelection);
        showSelectionContainer(mapSelection);
    });
}

function showSelectionContainer(map){
    console.log(map);
    let selectionContainer = document.getElementById(`${map}-selectionContainer`);
    let sideSelectionContainer = document.getElementById(`${map}-sideSelectionContainer`);
    let roundContainer = document.getElementById(`${map}-roundContainer`);

    console.log(roundContainer);
    selectionContainer.style.display = 'block';
    sideSelectionContainer.style.display = 'block';
    roundContainer.style.display = 'block';

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
            res.json()
        })
        .then(data => console.log('Success:', data))
        .catch((error) => {
            console.error('Error:', error);
        });
    });
}

var lossBtns = document.getElementsByClassName('lossBtn');
for (let i = 0; i < lossBtns.length; i++){
    lossBtns[i].addEventListener("click", (event) => {
        fetch('/loss?' + new URLSearchParams(
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
