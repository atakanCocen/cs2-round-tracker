const mapSelection = document.getElementById('mapSelection');

mapSelection.addEventListener("change", event => {
    fetch('/get-stats?' + new URLSearchParams({map: mapSelection.value}), {method: 'GET'})
    .then(res => {
        res.json()
        .then(data => {
            setGraphs(data);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function setGraphs(data) {
    console.log(data);

    //const newChart = new Chart(document.getElementById('firstRoundWins'), 
    //{
    //    type: 'pie',
    //    data: {
    //        labels: ['Won', 'Lost'],
    //        data: [2, 5]
    //    }
    //})
}