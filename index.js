
// container (time-display)
const displayHeader = document.querySelector("#time-display");
// Buttons 
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const splitButton = document.querySelector("#split");
splitButton.disabled=true;
const resetButton = document.querySelector("#reset");
resetButton.disabled=true;
// Button containers
const startButtonContainer = document.querySelector("#start-row");
const pauseButtonContainer = document.querySelector("#pause-row");
// Action-log
const actionLogContainer = $("#action-log");

// Global time counter variable in miliseconds
let c = 0;

// Global time variable
let time = new Object();

/*  addPreix:
    adds "0" prefix for balancing the string 
    params : 
        value  :  value to which prefix is to be added
        isMili :  boolean stating if the value is the milisecond component of the time  
*/
const addPrefix = function(value,isMili)
{
    if(isMili)
    {
        if(value<100)
            return "0"+value;  
    }
    else{
        if(value<10)
            return "0"+value;
    }
    return value;
}

// getTimeObject:
/*
    params : ms(counter in milisecond)
     returns time{} with keys
                hours,
                minutes,
                seconds,
                milisec
 }
 */

const getTimeObject = function(ms){
    let time = new Object;
    time.milisec = addPrefix(ms%1000,true);
    time.seconds = addPrefix(Math.floor((ms/1000)%60),false);
    time.minutes = addPrefix(Math.floor((ms/60000)%60),false);
    time.hours = addPrefix(Math.floor(ms/ 3.6e+7),false);
    return time;
}


// getTimeString
/*
    params : time{}
    returns timeString{}
        hh_mm_ss
        milisec
 */
const getTimeString = function(time){
    let hhMMss = `${time.hours}:${time.minutes}:${time.seconds}`;
    let milisec = `.${time.milisec}`;
    let timeString = {
        hh_mm_ss:hhMMss,
        milisec:milisec
    };
    return timeString;
}

// update :
// updates the global timer counter and time object;

const update = function (){
    c+=10;
    time = getTimeObject(c);
}

// Reset
const reset = function(intervalId){
    return function(){
 
      
    window.location.reload();
    }
}
// 
let actionLogIndex=1; // Log Counter
// createLog
// Creates a new log 
/* params : previous (last split) in miliseconds
            current  (current split) in miliseconds

    returns DOM element of the structure
    <div class="row">
        <div class="col"></div>
         <div class="col"></div>
        <div class="col">/div>
    </div>
*/
const createLog = function(previous,current){
    // Create a new row element
let newRow = $('<div class="row"></div>');
console.log(current-previous)
    // Create the three columns and append them to the new row element

    // Log Counter
let col1 = $('<div class="col">' +'#'+actionLogIndex++ + '</div>');
    //Split Interval 
let col2 = $('<div class="col">'+'+'+
                getTimeString(getTimeObject(current-previous)).hh_mm_ss+getTimeString(getTimeObject(current-previous)).milisec
            +'</div>');
    // Split event
let col3 = $('<div class="col">' + getTimeString(time).hh_mm_ss+getTimeString(time).milisec + '</div>');


newRow.append(col1);
newRow.append(col2);
newRow.append(col3);

return newRow;

}

let prev = 0;//Stores the last split counter variable
// Split
const split = function(){
  // creates a new Log and appends it to the DOM  
  actionLogContainer.append(createLog(prev,c).clone());
  prev=c;//Updates the last split counter variable to current split
}

// Pause
const pause = function(intervalId){
    return function(){
        startButtonContainer.style.display='block';
        pauseButtonContainer.style.display='none';
        clearInterval(intervalId);
    }

}

// Start
const start =  function (event)
{
    
   let intervalId = setInterval(()=>{
        update();
        addPrefix();
        displayHeader.innerHTML = `<h1 id="HH_MM_SS" class='col-8 col-sm-7'>${getTimeString(time).hh_mm_ss}</h1>
                                   <h1 id="milisec"  class="col">${getTimeString(time).milisec}</h1>`;
            
    },10);
    // <h1 id="HH_MM_SS" class="col">00:00:00.</h1>
    // <h1 id="milisec" class="col">000</h1>
    update();
    addPrefix();
    displayHeader.innerHTML = `<h1 id="HH_MM_SS" class='col-8 col-sm-7'>${getTimeString(time).hh_mm_ss}</h1>
                               <h1 id="milisec"  class="col">${getTimeString(time).milisec}</h1>`;
    startButtonContainer.style.display='none';
    pauseButtonContainer.style.display='block';
    splitButton.disabled=false;
    resetButton.disabled=false;
    pauseButton.addEventListener('click',pause(intervalId));
    splitButton.addEventListener('click',split);
    resetButton.addEventListener('click',reset(intervalId));
}
startButton.addEventListener('click',start);