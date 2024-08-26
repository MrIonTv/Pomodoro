const hourTxt = document.querySelector(".hour");
const minTxt = document.querySelector(".min");
const secTxt = document.querySelector(".sec");

const pauseIcon = document.querySelector("#pause-ic");
const continueIcon = document.querySelector("#continue-ic");
const pauseTxt = document.querySelector("#pause-txt");
const pauseBtton = document.querySelector("#pause-btton")
const pauseCont = document.querySelector("#pause-container");

const concentrateField = document.querySelector("#conc-time");
const restField = document.querySelector("#rest-time");
const sessionsField = document.querySelector("#sessions-number");

const incrementConBtton = document.querySelector("#increment-con");
const incrementRestBtton = document.querySelector("#increment-rest");
const incrementSesBtton = document.querySelector("#increment-ses");
const decrementConBtton = document.querySelector("#decrement-con");
const decrementRestBtton = document.querySelector("#decrement-rest");
const decrementSesBtton = document.querySelector("#decrement-ses");

const resetBtton = document.querySelector("#reset-btton");

const restAud = document.getElementById('pause-sound');
const endAud = document.getElementById('end-sound');

let timerInterval;
let timer = 0;
let changeTimer = 0;

let firstTime = true;
let inRest = false;
let waitFor = 0;

function activeTimer() {
    timerInterval = setInterval(() => {
        refreshTimer();

        if (--timer < 0) {
            resetTimer();
            endAud.play();
        }
        waitFor = inRest ? (parseInt(restField.innerText, 10) * 60) : (parseInt(concentrateField.innerText, 10) * 60);
        
        if (waitFor === changeTimer) {
            inRest = !inRest;
            changeTimer = 0;
            if (inRest) {
                switchTheme('rest-theme');
            } else {
                switchTheme('working-theme');
                let value = parseInt(sessionsField.innerText, 10);
                value--;
                    value = value < 10 ? "0" + value : value;
                    sessionsField.innerText = value;
            }
            restAud.play();
        }
        changeTimer++;

    }, 1000);
}

function refreshTimer() {
    let hours = Math.floor(timer / 3600);
    let mins = Math.floor((timer % 3600) / 60);
    let secs = timer % 60;

    hours = hours < 10 ? "0" + hours : hours;
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    hourTxt.innerText  = hours;
    minTxt.innerText = mins;
    secTxt.innerText = secs;
}

function pause() {
    // Activar el reloj
    if (firstTime) {
        incrementConBtton.classList.add('hidden');
        decrementConBtton.classList.add('hidden');
        incrementRestBtton.classList.add('hidden');
        decrementRestBtton.classList.add('hidden');
        timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
        resetBtton.classList.remove('hidden');
        firstTime = false;
    }
    // Pausar 
    if (continueIcon.classList.contains('hidden')) {
        clearInterval(timerInterval);
        pauseIcon.classList.add('hidden');
        continueIcon.classList.remove('hidden');
        pauseTxt.innerText = "Continue"

    } else {
        activeTimer();
        pauseIcon.classList.remove('hidden');
        continueIcon.classList.add('hidden');
        pauseTxt.innerText = "Pause"
    }
    // Cambiar tema segun estado
    if (!inRest) {
        document.body.className === 'normal-theme' ?
            switchTheme('working-theme') : switchTheme('normal-theme');
    } else {
        document.body.className === 'rest-theme' ?
            switchTheme('normal-theme') : switchTheme('rest-theme');
    }
}

function resetTimer() {
    sessionsField.innerText = "01";
    incrementConBtton.classList.remove('hidden');
    decrementConBtton.classList.remove('hidden');
    incrementRestBtton.classList.remove('hidden');
    decrementRestBtton.classList.remove('hidden');
    pause();
    pauseTxt.innerText = "Start"
    firstTime = true;
    switchTheme('normal-theme');
    resetBtton.classList.add('hidden');
    timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
    refreshTimer();
}

function switchTheme(theme) {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
}

function upWork() {
    if (firstTime) {
        let value = parseInt(concentrateField.innerText, 10);
        value += 10;
        if (value < 100) {
            concentrateField.innerText = value;
            timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
            refreshTimer();
        }
    }
}

function downWork() {
    if (firstTime) {
        let value = parseInt(concentrateField.innerText, 10);
        value -=10;
        if (0 < value ) {
            concentrateField.innerText = value;
            timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
            refreshTimer();
        }
    }

}

function upRest() {
    if (firstTime) {
        let value = parseInt(restField.innerText, 10);
        value += 5;
        if (value < 35) {
            restField.innerText = value;
            timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
            refreshTimer();
        }
    }
}

function downRest() {
    if (firstTime) {
        let value = parseInt(restField.innerText, 10);
        value -= 5;
        if (0 < value) {
            value = value < 10 ? "0" + value : value;
            restField.innerText = value;
            timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
            refreshTimer();
        }
    }

}

function upSesion() {
    let value = parseInt(sessionsField.innerText, 10);
    value++;
    if (value < 100) {
        value = value < 10 ? "0" + value : value;
        sessionsField.innerText = value;
    
        if (!firstTime) {
            timer += (parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * 60;
        } else {
            timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
        }
    }
    refreshTimer();
}

function downSesion() {
    let value = parseInt(sessionsField.innerText, 10);
    value--;
    if (0 < value) {
        value = value < 10 ? "0" + value : value;
        sessionsField.innerText = value;
        
        if (!firstTime) {
            timer -= (parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * 60;
        } else {
            timer = ((parseInt(concentrateField.innerText, 10) + (parseInt(restField.innerText, 10))) * parseInt(sessionsField.innerText, 10) * 60);
        }
    }
    refreshTimer();
}

pauseBtton.addEventListener('click', pause);
incrementConBtton.addEventListener('click', upWork);
incrementRestBtton.addEventListener('click', upRest);
incrementSesBtton.addEventListener('click', upSesion);
decrementConBtton.addEventListener('click', downWork);
decrementRestBtton.addEventListener('click', downRest);
decrementSesBtton.addEventListener('click', downSesion);
resetBtton.addEventListener('click', resetTimer);