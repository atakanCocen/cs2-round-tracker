var mapSelection = null;
var mapOptions = document.getElementsByClassName('mapSelection');
var displayState = false;
// create a list
const arrayOfMaps = ["anubis", "mirage", "ancient", "dust2", "overpass", "inferno", "nuke", "vertigo"]

for (i = 0; i < mapOptions.length; i++) {

// add an if check if it's the right event type. If it is, set the map selection, otherwise don't do anything.
// if map selection == null
    console.log(mapSelection)
    mapOptions[i].addEventListener("click", function(event) {
        //event.preventDefault();
        let tempMapVariable = event.target.getAttribute('data-mapselection');
        // testVariable gets set and then mapSelection wont change anymore.
        if (tempMapVariable !== null) {
            mapSelection = tempMapVariable;
        }
        console.log(tempMapVariable)
        console.log(event.target);
        console.log("mapSelection =" + mapSelection);
        
        for (element of arrayOfMaps) {
            if (mapSelection !== element) {
                console.log("element =" + element)
                let selectionContainer = document.getElementById(`${element}-selectionContainer`);
                let sideSelectionContainer = document.getElementById(`${element}-sideSelectionContainer`);
                let roundContainer = document.getElementById(`${element}-roundContainer`);
                selectionContainer.style.display = 'none';
                sideSelectionContainer.style.display = 'none';
                roundContainer.style.display = 'none';
            }
        }
        showSelectionContainer(mapSelection);
        
        console.log(mapSelection);
        
        // add this current map to the list

        // call function without any inputs that 
        // loops through the list or retrieves list value 
        // then uses that variable to just call the style.display.none
    });
}
// else same block of code + before it selectionContainer.style.display = 'hidden';


function showSelectionContainer(map){
    // console.log(map);
    let selectionContainer = document.getElementById(`${map}-selectionContainer`);
    let sideSelectionContainer = document.getElementById(`${map}-sideSelectionContainer`);
    let roundContainer = document.getElementById(`${map}-roundContainer`);
    
    console.log(roundContainer);
    selectionContainer.style.display = 'block';
    sideSelectionContainer.style.display = 'block';
    roundContainer.style.display = 'block';

}

function hidePreviousSelection(map){

}

// create an if else maybe to check if it's T or CT side selected and then change the text of the other section.

document.addEventListener("DOMContentLoaded", function() {
    // Get references to the radio buttons
    var firstHalfOption1 = document.querySelector('input[name="matchStartingSide"][value="T"]');
    var firstHalfOption2 = document.querySelector('input[name="matchStartingSide"][value="CT"]');
    var secondHalfOption1 = document.querySelector('input[name="matchSecondSide"][value="T"]');
    var secondHalfOption2 = document.querySelector('input[name="matchSecondSide"][value="CT"]');

    // Add event listener to the radio buttons
    firstHalfOption1.addEventListener('change', function() {
        if (firstHalfOption1.checked) {
            secondHalfOption2.checked = true;
        } 
        else {
            secondHalfOption1.checked = true;
        }
    });
    firstHalfOption2.addEventListener('change', function() {
        if (firstHalfOption2.checked) {
            secondHalfOption1.checked = true;
        } 
        else {
            secondHalfOption2.checked = true;
        }
    });
});

var roundSubmitForms = document.getElementsByClassName('rounds-submit-form');
for (let i = 0; i < roundSubmitForms.length; i++){
    roundSubmitForms[i].addEventListener("submit", logSubmit);
}

function logSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const finalData = Object.fromEntries(data)
    console.log([...data.entries()]);
    console.log(event);
    // var firstHalfSide = data.entries().matchStartingSide.value;
    // var secondHalfSide = form.matchSecondSide.value;
    // var round1 = form.round1.value;
    // var round2 = form.round2.value;
    // var secondround1 = form.secondround1.value;
    // var secondround2 = form.secondround2.value;
    fetch('/rounds-submit?' + new URLSearchParams({map: mapSelection}),
        {
            method: 'POST',
            body: JSON.stringify(finalData),
            headers: {
                "Content-Type": "application/json"
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
  }

