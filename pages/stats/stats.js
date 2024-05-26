const mapSelection = document.getElementById('mapSelection');

const ctx1 = document.getElementById('firstRound');
const ctx2 = document.getElementById('secondRound');
const ctx3 = document.getElementById('thirdRound');
const ctx4 = document.getElementById('fourthRound');

getData();

mapSelection.addEventListener("change", event => {
    getData()
});

function getData() {
    fetch('/get-stats?' + new URLSearchParams({map: mapSelection.value }), {method: 'GET'})
    .then(res => {
        res.json()
        .then(data => {
            setIndividualGraphs(data);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getDataPoint(key){
    
}

function setAggregateGraphs(data) {
    let ctRound1Wins = [];

    for (let i = 0; i < data.length; i++){
        
    }
}

function setIndividualGraphs(data) {
    let ctRound1Wins = 0;
    let ctRound1Losses = 0;
    let ctRound2Wins = 0;
    let ctRound2Losses = 0;
    let tRound1Wins = 0;
    let tRound1Losses = 0;
    let tRound2Wins = 0;
    let tRound2Losses = 0;


    for (let i = 0; i < data.length; i++){
        console.log(data[i]);

        if (data[i].firstHalfSideCT) {
            ctRound1Wins += data[i].round1  ? 1 : 0;
            ctRound1Losses += data[i].round1 ? 0 : 1;
            ctRound2Wins += data[i].round2 ? 1 : 0;
            ctRound2Losses += data[i].round2 ? 0 : 1;
            tRound1Wins += data[i].secondround1 ? 1 : 0;
            tRound1Losses += data[i].secondround1 ? 0 : 1;
            tRound2Wins += data[i].secondround2 ? 1 : 0;
            tRound2Losses += data[i].secondround2 ? 0 : 1;
        }
        else {
            ctRound1Wins += data[i].secondround1  ? 1 : 0;
            ctRound1Losses += data[i].secondround1 ? 0 : 1;
            ctRound2Wins += data[i].secondround2 ? 1 : 0;
            ctRound2Losses += data[i].secondround2 ? 0 : 1;
            tRound1Wins += data[i].round1 ? 1 : 0;
            tRound1Losses += data[i].round1 ? 0 : 1;
            tRound2Wins += data[i].round2 ? 1 : 0;
            tRound2Losses += data[i].round2 ? 0 : 1;
        }
        
        
    }

    let ctFirstRoundChart = Chart.getChart('firstRound');
    if (ctFirstRoundChart != undefined) {
        ctFirstRoundChart.destroy();
    }

    let ctSecondRoundChart = Chart.getChart('secondRound');
    if (ctSecondRoundChart != undefined) {
        ctSecondRoundChart.destroy();
    }

    let tFirstRoundChart = Chart.getChart('thirdRound');
    if (tFirstRoundChart != undefined) {
        tFirstRoundChart.destroy();
    }

    let tSecondoundChart = Chart.getChart('fourthRound');
    if (tSecondoundChart != undefined) {
        tSecondoundChart.destroy();
    }


    ctFirstRoundChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Win', 'Loss'],
            datasets: [{
                data: [ctRound1Wins, ctRound1Losses],
                borderWidth: 1
            }]
        }
    });
    
    ctSecondRoundChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Win', 'Loss'],
            datasets: [{
                data: [ctRound2Wins, ctRound2Losses],
                borderWidth: 1
            }]
        }
    });
    
    tFirstRoundChart = new Chart(ctx3, {
        type: 'doughnut',
        data: {
            labels: ['Win', 'Loss'],
            datasets: [{
                data: [tRound1Wins, tRound1Losses],
                borderWidth: 1
            }]
        }
    });
    
    tSecondoundChart = new Chart(ctx4, {
        type: 'doughnut',
        data: {
            labels: ['Win', 'Loss'],
            datasets: [{
                data: [tRound2Wins, tRound2Losses],
                borderWidth: 1
            }]
        }
    });
}