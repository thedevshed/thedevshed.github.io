// Global variables
var intervalTimer;
var round1;
var round2;
var round3;
var round4;
var round5;

var minTime = 2000;
var maxTime = 5000;
var popupDelay = 2000;
var storageKey = "reaktData";


$(document).ready(function() {
  for (var i = 1; i < 100; i++) {
    $('#ageSelector').append('<option>' + i + '</option>');
  }
});

var myApp = new Framework7({
    modalTitle: 'Reaktion',
    material: true,
    materialRipple: true
    // ... other parameters
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true, 
     domCache: true
});

$$('.confirm-ok').on('click', function () {
    myApp.confirm('Tap the red button when you see it appear. Click OK to begin, or cancel to quit.', 'Reaktion Time', function () {
        // myApp.alert('You clicked Ok button');
        mainView.router.load({pageName: 'Reaktion'});
      
    });
});

$$(document).on('pageReinit', '.page[data-page="index"]', function (e) {
  // Do something here when page with data-page="about" attribute loaded and initialized
  stopTimer();
  $$('#timer').text("000"); 
  clearTimeout(round1);
  clearTimeout(round2);
  clearTimeout(round3);
  clearTimeout(round4);
  clearTimeout(round5);
  $$(".reaktButton").hide();
});

$$('.popup-summary').on('close', function(){
  $("#summaryValues").children().remove();
  $$("#yourId").text('');
  mainView.router.load({pageName: 'index'});
});

myApp.onPageReinit('Leaderboard', function(e){
  addLeaderboard();
});

myApp.onPageInit('Leaderboard', function(e){
  addLeaderboard();
});

$$(document).on('pageAfterBack', '.page[data-page="Leaderboard"]', function (e) {
  $("#leaderValues").children().remove();
});

$$(document).on('pageAfterAnimation', '.page[data-page="Reaktion"]', function (e) {
  // Do something here when page with data-page="about" attribute loaded and initialized
  // alert("page is loaded!!! random button id is: " + randomButton());
  var time1;
  var time2;
  var time3;
  var time4;
  var time5;
  $$(".reaktButton").hide();
  var width = ($('.col-33').width()) / 1.5;
  $('.reaktButton').css({
    height: width + 'px'
  });
  
  round1 = setTimeout(function() {
    var buttonId = randomButton();
    startTimer();
    $$(buttonId).show().once('click',function(e){
      stopTimer();
      time1 = parseInt($$('#timer').text());
      $$(buttonId).hide();
      
      round2 = setTimeout(function() {
        var buttonId = randomButton();
        startTimer();
        $$(buttonId).show().once('click',function(e){
          stopTimer();
          time2 = parseInt($$('#timer').text());
          $$(buttonId).hide();
          
          round3 = setTimeout(function() {
            var buttonId = randomButton();
            startTimer();
            $$(buttonId).show().once('click',function(e){
              stopTimer();
              time3 = parseInt($$('#timer').text());
              $$(buttonId).hide();
              
              round4 = setTimeout(function() {
                var buttonId = randomButton();
                startTimer();
                $$(buttonId).show().once('click',function(e){
                  stopTimer();
                  time4 = parseInt($$('#timer').text());
                  $$(buttonId).hide();
                  
                  round5 = setTimeout(function() {
                    var buttonId = randomButton();
                    startTimer();
                    $$(buttonId).show().once('click',function(e){
                      stopTimer();
                      time5 = parseInt($$('#timer').text());
                      $$(buttonId).hide();
                     
                      var avg = (time1 + time2 + time3 + time4 + time5) / 5;
                      var timeArray = [time1, time2, time3, time3, time4, time5];
                      var min = Math.min.apply(Math, timeArray);
                      var max = Math.max.apply(Math, timeArray);
                      
                      var myObject = new DbEntry();
                      myObject.time = (new Date()).toTimeString();
                      myObject.age = $$("#ageSelector").val();
                      myObject.gender = $$("#genderSelector").val();
                      myObject.time1 = time1;
                      myObject.time2 = time2;
                      myObject.time3 = time3;
                      myObject.time4 = time4;
                      myObject.time5 = time5;
                      myObject.timeavg = avg;
                      myObject.timemin = min;
                      myObject.timemax = max;
                      
                      addToStorage(storageKey, JSON.stringify(myObject));
                    
                      $("#yourId").append("Your ID is: " + myObject.id);
                      $("#summaryTable > tbody:last-child").append("<tr><td>Time 1</td><td>" + time1 + "</td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td>Time 2</td><td>" + time2 + "</td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td>Time 3</td><td>" + time3 + "</td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td>Time 4</td><td>" + time4 + "</td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td>Time 5</td><td>" + time5 + "</td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td></td><td></td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td>Avg time</td><td>" + avg + "</td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td>Min time</td><td>" + min + "</td></tr>");
                      $("#summaryTable > tbody:last-child").append("<tr><td>Max time</td><td>" + max + "</td></tr>");
                      
                      setTimeout(function() {
                        myApp.popup('.popup-summary');
                      },popupDelay);
                    });
                  },randomNumber(minTime, maxTime));
                });
              },randomNumber(minTime, maxTime));
            });
          },randomNumber(minTime, maxTime));
        });
      },randomNumber(minTime, maxTime));
    });
  },randomNumber(minTime, maxTime));
  
});    

$$("#export").on('click', function(){
  var existingData = getLeaderboardSummary(storageKey);
  var dataArray = [];
  for (var i = 0; i < existingData.length; i++){
    dataArray.push(JSON.parse(existingData[i]));
  }
  dataArray.sortBy("id");
  var csv = convertJSONtoCSV(dataArray);
  
  var csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += csv;
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute('download', "my_data.csv");
  window.open(encodedUri);
});

// reakt functions
// This function genrates a random button id for 1 of 9 buttons
function randomButton() {
  return "#" + (Math.floor(Math.random() * 9) + 1); 
}

// Start timer
function startTimer() {
  var start = new Date().getTime();
  intervalTimer = window.setInterval(function() {
    var time = new Date().getTime() - start;
    $$('#timer').text(time); 
  }, 1);
}

function stopTimer() {
  if (intervalTimer) {
    window.clearInterval(intervalTimer);
  }
}

function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min); 
}


function DbEntry(mTime, mAge, mGender, mTime1, mTime2, mTime3, mTime4, mTime5, mTimeAvg, mTimeMin, mTimeMax) {
  
  this.id = getId();
  this.time = mTime;
  this.age = mAge;
  this.gender = mGender;
  this.time1 = mTime1;
  this.time2 = mTime2;
  this.time3 = mTime3;
  this.time4 = mTime4;
  this.time5 = mTime5;
  this.timeavg = mTimeAvg;
  this.timemin = mTimeMin;
  this.timemax = mTimeMax;
}

function getId(){
  var id = localStorage.getItem("pk_id");
  id++;
  localStorage.setItem("pk_id", id);
  return id;
}

function addToStorage(key, value){
  if (localStorage.getItem(key) != null) {
    var array = [];
    var existingData = JSON.parse(localStorage.getItem(key));
    console.log("current data: " + existingData);
    for (var i = 0; i < existingData.length; i++) {
      array.push(existingData[i]);
    }
    array.push(value);
    localStorage.setItem(key, JSON.stringify(array));
  }
  else{
    var array = [];
    array.push(value);
    localStorage.setItem(key, JSON.stringify(array));
  }
}

Array.prototype.sortBy = function(p){
  return this.slice(0).sort(function(a, b){
    return(a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
};

function addLeaderboard(){
  var leaderData = getLeaderboardSummary(storageKey);
  var dataArray = [];
  for (var i = 0; i < leaderData.length; i++) {
    dataArray.push(JSON.parse(leaderData[i]));
  }
  dataArray = dataArray.sortBy("timeavg");
  for (var i = 0; i < dataArray.length; i++) {
    $("#leaderTable > tbody:last-child").append("<tr><td>" + 
                                            dataArray[i].id + "</td><td>" +
                                            dataArray[i].age + "</td><td>" +
                                            dataArray[i].gender + "</td><td>" +
                                            dataArray[i].timemax + "</td><td>" +
                                            dataArray[i].timemin + "</td><td><b>" +
                                            dataArray[i].timeavg + "</b></td>"
                                            );
  }
} 

function getLeaderboardSummary(key){
  if (localStorage.getItem(key) != null) {
    console.log("Returning: " + JSON.parse(localStorage.getItem(key)));
    return JSON.parse(localStorage.getItem(key));
    
  }
  else{
    return null;
  }
}



function convertJSONtoCSV(json){
  var csv = '';
  
  // Generate csv header
  var row = '';
  for (var index in json[0]){
    row += '"' + index + '",';
    row.slice(0, row.length - 1);
  }
  csv += row + '\r\n';
  
  //Generate csv data rows
  for (var i = 0; i < json.length; i++){
    var row = '';
    for (var index in json[i]){
      row += '"' + json[i][index] + '",';
      row.slice(0, row.length - 1);
    }
   csv += row + '\r\n';  
  }
  if (csv == ''){
    return;
  }
  return csv;
}