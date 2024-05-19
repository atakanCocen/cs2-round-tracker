var mapSelection = null;
var mapOptions = document.getElementsByClassName('mapSelection');
var sideSelections = document.getElementsByClassName('sideSelection');
var displayState = false;
// create a list
const arrayOfMaps = ["anubis", "mirage", "ancient", "dust2", "inferno", "nuke", "vertigo"]

for (mapOption of mapOptions) {
    // add an if check if it's the right event type. If it is, set the map selection, otherwise don't do anything.
    // if map selection == null
    mapOption.addEventListener("click", function(event) {
        //event.preventDefault();
        let isContainer = event.target.getAttribute('data-mapselection') !== null;
        let tempMapVariable = event.target.getAttribute('data-mapselection');
        // testVariable gets set and then mapSelection wont change anymore.
        if (isContainer) {
            mapSelection = tempMapVariable;
        }
        
        for (element of arrayOfMaps) {
            let selectionContainer = document.getElementById(`${element}-selectionContainer`);
            let roundContainer = document.getElementById(`${element}-roundContainer`);
            // second part- each click first argument is true, but if it's also the image container you're clicking, and if it's already displayed.
            if (mapSelection !== element || (mapSelection == element && isContainer && selectionContainer.style.display == 'block')) {
                selectionContainer.style.display = 'none';
                roundContainer.style.display = 'none';
            }
            else {
                (showSelectionContainer(mapSelection));
            }
        }
        
        // add this current map to the list

        // call function without any inputs that 
        // loops through the list or retrieves list value 
        // then uses that variable to just call the style.display.none
    });
}

for (sideSelection of sideSelections){
    sideSelection.addEventListener("click", function(event) {

        let oppositeHalfSideSelection = null;
        if (event.target.id.includes('StartingSideT')){
            oppositeHalfSideSelection = document.getElementById(`${mapSelection}-matchSecondSideCT`);
        }
        else if (event.target.id.includes('StartingSideCT')) { 
            oppositeHalfSideSelection = document.getElementById(`${mapSelection}-matchSecondSideT`);
        }
        else if (event.target.id.includes('SecondSideT')) { 
            oppositeHalfSideSelection = document.getElementById(`${mapSelection}-matchStartingSideCT`);
        }
        else if (event.target.id.includes('SecondSideCT')) { 
            oppositeHalfSideSelection = document.getElementById(`${mapSelection}-matchStartingSideT`);
        }

        oppositeHalfSideSelection.checked = true;
    });
}
// else same block of code + before it selectionContainer.style.display = 'hidden';


function showSelectionContainer(map){
    let selectionContainer = document.getElementById(`${map}-selectionContainer`);
    let roundContainer = document.getElementById(`${map}-roundContainer`);
    
    selectionContainer.style.display = 'block';
    roundContainer.style.display = 'block';

}

function hidePreviousSelection(map){

}

var roundSubmitForms = document.getElementsByClassName('rounds-submit-form');
for (roundSubmitForm of roundSubmitForms){
    roundSubmitForm.addEventListener("submit", logSubmit);
}

function resetFormValues(){
    for (roundSubmitForm of roundSubmitForms){
        roundSubmitForm.reset();
    }
}

function hideAllSelections(){
    for (map of arrayOfMaps){
        let selectionContainer = document.getElementById(`${map}-selectionContainer`);
        selectionContainer.style.display = 'none';
    }
}

function formValidiationAintIt() {
    let matchStartingSideValue = document.forms["rounds-submit-form"]["matchStartingSide"].value;
    let matchStartingFirstRoundValue = document.forms["rounds-submit-form"]["round1"].value;
    let matchStartingSecondRoundValue = document.forms["rounds-submit-form"]["round2"].value;
    let matchSecondFirstRoundValue = document.forms["rounds-submit-form"]["secondround1"].value;
    let matchSecondSecondRoundValue = document.forms["rounds-submit-form"]["secondround2"].value;

    if (matchStartingSideValue == "") {
        alert("Match Starting Side must be filled out.");
        return false;
    }
    else if (matchStartingFirstRoundValue == "") {
        alert("Starting Half First Round Result must be filled out.");
        return false;
    }
    else if (matchStartingSecondRoundValue == "") {
        alert("Starting Half Second Round Result must be filled out.");
        return false;
    }
    else if (matchSecondFirstRoundValue == "") {
        alert("Second Half First Round Result must be filled out.");
        return false;
    }
    else if (matchSecondSecondRoundValue == "") {
        alert("Second Half Second Round Result must be filled out.");
        return false;
    }
    return true;
  }

function logSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const finalData = Object.fromEntries(data)
    if (formValidiationAintIt()) {
        fetch('/rounds-submit?' + new URLSearchParams({map: mapSelection}),
        {
            method: 'POST',
            body: JSON.stringify(finalData),
            headers: {
                "Content-Type": "application/json"
        },

    })
    .then(res => {
        res.json()
        .then(data => {
            alert('Success');
            resetFormValues();
            hideAllSelections();
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    }
    else {
        console.log("NUTINNNNNN!!!!!");
    }
  }

