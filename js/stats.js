const mapSelection = document.getElementById('mapSelection');

const chartContainer = document.getElementById('chartContainer');

const ctRound1Container = document.getElementById('ctRound1Container');
const tRound1Container = document.getElementById('tRound1Container');
const ctRound2Container = document.getElementById('ctRound2Container');
const tRound2Container = document.getElementById('tRound2Container');
const ctRound2AfterRound1WinContainer = document.getElementById('ctRound2AfterRound1WinContainer');
const ctRound2AfterRound1Loss = document.getElementById('ctRound2AfterRound1LossContainer');
const tRound2AfterRound1WinContainer = document.getElementById('tRound2AfterRound1WinContainer');
const tRound2AfterRound1LossContainer = document.getElementById('tRound2AfterRound1LossContainer');
const gameContainer = document.getElementById('gameContainer');

const ctRound1Canvas = document.getElementById('ctRound1');
const ctRound2Canvas = document.getElementById('ctRound2');
const tRound1Canvas = document.getElementById('tRound1');
const tRound2Canvas = document.getElementById('tRound2');
const gameResultsCanvas = document.getElementById('gameResults');
const ctRound2AfterRound1WinCanvas = document.getElementById('ctRound2AfterRound1Win');
const ctRound2AfterRound1LossCanvas = document.getElementById('ctRound2AfterRound1Loss');
const tRound2AfterRound1WinCanvas = document.getElementById('tRound2AfterRound1Win');
const tRound2AfterRound1LossCanvas = document.getElementById('tRound2AfterRound1Loss');

var ctRound1Chart = Chart.getChart('ctRound1');
var ctRound2Chart = Chart.getChart('ctRound2');
var tRound1Chart = Chart.getChart('tRound1');
var tRound2Chart = Chart.getChart('tRound2');
var gameChart = Chart.getChart('gameResults');
var ctRound2AfterRound1WinChart = Chart.getChart('ctRound2AfterRound1Win');
var ctRound2AfterRound1LossChart = Chart.getChart('ctRound2AfterRound1Loss');
var tRound2AfterRound1WinChart = Chart.getChart('tRound2AfterRound1Win');
var tRound2AfterRound1LossChart = Chart.getChart('tRound2AfterRound1Loss');

getData();

mapSelection.addEventListener("change", event => {
    event.preventDefault();
    getData()
});

function getData() {
    fetch('/get-stats?' + new URLSearchParams({map: mapSelection.value}), {method: 'GET'})
    .then(res => {
        res.json()
        .then(data => {
            console.log(data);
            if (data === undefined || data.length == 0){
                hideGraphs();
            }
            else {
                if (mapSelection.value == 'All'){
                
                    setAggregateGraphs(data);
                }
                else {
                    setIndividualGraphs(data);
                }
            }

            
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function hideGraphs() {
    hideGraph('game');
    hideGraph('ctRound1');
    hideGraph('ctRound2');
    hideGraph('tRound1');
    hideGraph('tRound2'); 
    hideGraph('ctRound2AfterRound1Win');
    hideGraph('ctRound2AfterRound1Loss');
    hideGraph('tRound2AfterRound1Win'); 
    hideGraph('tRound2AfterRound1Loss'); 
}

function hideGraph(name){
    switch(name){
        case 'game':
            gameChart.destroy();
            gameContainer.hidden = true;
            break;
        case 'ctRound1':
            ctRound1Chart.destroy();
            ctRound1Container.hidden = true;
            break;
        case 'tRound1':
            tRound1Chart.destroy();
            tRound1Container.hidden = true;
            break;
        case 'ctRound2':
            ctRound2Chart.destroy();
            ctRound2Container.hidden = true;
            break;
        case 'tRound2':
            tRound2Chart.destroy();
            tRound2Container.hidden = true;
            break;
        case 'ctRound2AfterRound1Win':
            ctRound2AfterRound1WinChart.destroy();
            ctRound2AfterRound1WinContainer.hidden = true;
            break;
        case 'ctRound2AfterRound1Loss':
            ctRound2AfterRound1LossChart.destroy();
            ctRound2AfterRound1LossContainer.hidden = true;
            break;
        case 'tRound2AfterRound1Win':
            tRound2AfterRound1WinChart.destroy();
            tRound2AfterRound1WinContainer.hidden = true;
            break;
        case 'tRound2AfterRound1Loss':
            tRound2AfterRound1LossChart.destroy();
            tRound2AfterRound1LossContainer.hidden = true;
            break;

    }
}

function initializeGraphs() {
    if (ctRound1Chart != undefined) {
        ctRound1Chart.destroy();
    }
    
    if (ctRound2Chart != undefined) {
        ctRound2Chart.destroy();
    }
    
    if (tRound1Chart != undefined) {
        tRound1Chart.destroy();
    }

    if (tRound2Chart != undefined) {
        tRound2Chart.destroy();
    }

    if (gameChart != undefined) {
        gameChart.destroy();
    }

    if (ctRound2AfterRound1WinChart != undefined) {
        ctRound2AfterRound1WinChart.destroy();
    }

    if (ctRound2AfterRound1LossChart != undefined) {
        ctRound2AfterRound1LossChart.destroy();
    }

    if (tRound2AfterRound1WinChart != undefined) {
        tRound2AfterRound1WinChart.destroy();
    }

    if (tRound2AfterRound1LossChart != undefined) {
        tRound2AfterRound1LossChart.destroy();
    }
}

function fillAggregateGraph(canvas, data, labels) {
    const radarGraphOptions = {
        scales: {
            r: {
                min: 0,
                max: 1,
                ticks: {
                    display: false
                }
            }
        }
    };

    return new Chart(canvas, {
        type: 'radar',
        options: radarGraphOptions,
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Wins',
                    data: data,
                    fill: true,
                    borderWidth: 1
                }
            ]
        }
    });
}


function fillAndDisplayGraph(container, canvas, data, isAggregate, labels){
    container.hidden = data[0] + data[1] == 0;
    
    return isAggregate ? fillAggregateGraph(canvas, data, labels) :  fillIndividualGraph(canvas, data);
}

function fillIndividualGraph(canvas, data){
    return new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Win', 'Loss'],
            datasets: [{
                data: data,
                borderWidth: 1
            }]
        }
    });
}

function setAggregateGraphs(data) {
    initializeGraphs();

    let labels = [];
    let ctRound1WinPerc = [];
    let ctRound2WinPerc = [];
    let ctRound2AfterRound1WinPerc = [];
    let ctRound2AfterRound1LossPerc = [];
    let tRound1WinPerc = [];
    let tRound2WinPerc = [];
    let tRound2AfterRound1WinPerc = [];
    let tRound2AfterRound1LossPerc = [];
    let gameWinPerc = [];

    for (let i = 0; i < data.length; i++){
        labels.push(`de_${data[i]._id}`);

        ctRound1WinPerc.push(data[i].ctRound1Win / (data[i].ctRound1Win + data[i].ctRound1Loss));
        ctRound2WinPerc.push(data[i].ctRound2Win / (data[i].ctRound2Win + data[i].ctRound2Loss));
        ctRound2AfterRound1WinPerc.push(data[i].ctRound2WinAfterRound1Win / (data[i].ctRound2WinAfterRound1Win + data[i].ctRound2LossAfterRound1Win));
        ctRound2AfterRound1LossPerc.push(data[i].ctRound2WinAfterRound1Loss / (data[i].ctRound2WinAfterRound1Loss + data[i].ctRound2LossAfterRound1Loss));
        tRound1WinPerc.push(data[i].tRound1Win / (data[i].tRound1Win + data[i].tRound1Loss));
        tRound2WinPerc.push(data[i].tRound2Win / (data[i].tRound2Win + data[i].tRound2Loss));
        tRound2AfterRound1WinPerc.push(data[i].tRound2WinAfterRound1Win / (data[i].tRound2WinAfterRound1Win + data[i].tRound2LossAfterRound1Win));
        tRound2AfterRound1LossPerc.push(data[i].tRound2WinAfterRound1Loss / (data[i].tRound2WinAfterRound1Loss + data[i].tRound2LossAfterRound1Loss));
        gameWinPerc.push(data[i].gamesWon / (data[i].gamesWon + data[i].gamesLost));
    }

    ctRound1Chart = fillAggregateGraph(ctRound1Canvas, ctRound1WinPerc, labels);
    ctRound2Chart = fillAggregateGraph(ctRound2Canvas, ctRound2WinPerc, labels);
    tRound1Chart = fillAggregateGraph(tRound1Canvas, tRound1WinPerc, labels);
    tRound2Chart = fillAggregateGraph(tRound2Canvas, tRound2WinPerc, labels);
    gameChart = fillAggregateGraph(gameResultsCanvas, gameWinPerc, labels);
    ctRound2AfterRound1WinChart = fillAggregateGraph(ctRound2AfterRound1WinCanvas, ctRound2AfterRound1WinPerc, labels);
    ctRound2AfterRound1LossChart = fillAggregateGraph(ctRound2AfterRound1LossCanvas, ctRound2AfterRound1LossPerc, labels);
    tRound2AfterRound1WinChart = fillAggregateGraph(tRound2AfterRound1WinCanvas, tRound2AfterRound1WinPerc, labels);
    tRound2AfterRound1LossChart = fillAggregateGraph(tRound2AfterRound1LossCanvas, tRound2AfterRound1LossPerc, labels);
}

function setIndividualGraphs(data) {
    initializeGraphs();

    ctRound1Chart = fillAndDisplayGraph(ctRound1Container, ctRound1Canvas, [data[0].ctRound1Win, data[0].ctRound1Loss], false);
    ctRound2Chart = fillAndDisplayGraph(ctRound2Container, ctRound2Canvas, [data[0].ctRound2Win, data[0].ctRound2Loss], false);
    ctRound2AfterRound1WinChart = fillAndDisplayGraph(ctRound2AfterRound1WinContainer, ctRound2AfterRound1WinCanvas, [data[0].ctRound2WinAfterRound1Win, data[0].ctRound2LossAfterRound1Win], false);
    ctRound2AfterRound1LossChart = fillAndDisplayGraph(ctRound2AfterRound1LossContainer, ctRound2AfterRound1LossCanvas, [data[0].ctRound2WinAfterRound1Loss, data[0].ctRound2LossAfterRound1Loss], false);
    tRound1Chart = fillAndDisplayGraph(tRound1Container, tRound1Canvas, [data[0].tRound1Win, data[0].tRound1Loss], false);
    tRound2Chart = fillAndDisplayGraph(tRound2Container, tRound2Canvas, [data[0].tRound2Win, data[0].tRound2Loss], false);
    tRound2AfterRound1WinChart = fillAndDisplayGraph(tRound2AfterRound1WinContainer, tRound2AfterRound1WinCanvas, [data[0].tRound2WinAfterRound1Win, data[0].tRound2LossAfterRound1Win], false);
    tRound2AfterRound1LossChart = fillAndDisplayGraph(tRound2AfterRound1LossContainer, tRound2AfterRound1LossCanvas, [data[0].tRound2WinAfterRound1Loss, data[0].tRound2LossAfterRound1Loss], false);
    gameChart = fillAndDisplayGraph(gameContainer, gameResultsCanvas, [data[0].gamesWon, data[0].gamesLost], false);
}