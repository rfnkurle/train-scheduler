// 1. Link to Firebase
var config = {
    apiKey: "AIzaSyBPWnyoZX7O83UFpXEydwcLGNZNo2AsQeo",
    authDomain: "circus-animal.firebaseapp.com",
    databaseURL: "https://circus-animal.firebaseio.com",
    projectId: "circus-animal",
    storageBucket: "circus-animal.appspot.com",
    messagingSenderId: "734174046604"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
console.log("this is working");


    
// 2. Button for adding Trains
$("#addTrainBtn").on("click", function(event){
    event.preventDefault();


    

    // Grabs user input and assign to variables
    var trainName = $("#trainNameInput").val().trim();
    var lineName = $("#lineInput").val().trim();
    var firstTrainTime = $("#trainTimeInput").val().trim();
    var frequencyInput = $("#frequencyInput").val().trim();
     
    
    // Creates local "temporary" object for holding train data
    // Will push this to firebase
    database.ref().push({
        trainName:  trainName,
        lineName: lineName,
        firstTrainTime: firstTrainTime,
        frequencyInput: frequencyInput,
    })
// clears inputs after submit button is pushed
    $("input").val("");

});
// calculates next arrival time in military time and minutes until next train arrives
database.ref().on("child_added", function(snapshot){
    var newTrain = snapshot.val();
    var time = snapshot.val().firstTrainTime;
    var tFrequency =snapshot.val().frequencyInput;

    var firstTimeConverted = moment(time, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted),"minutes")
    var tRemainder = diffTime % tFrequency
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes")
    var trainTable = moment(nextTrain).format("hh:mm")
    
    // console.log(tMinutesTillTrain)
    // console.log(trainTable)
    // dynamically populates html with train name, desitination, arrival time and minutes until next arrival time
    $("#table-info").append("<tr class='well'><td class='trainDisplay'>" + newTrain.trainName +
    "</td><td class='destinationDisplay'>" + newTrain.lineName +
    "</td><td class='frequencyDisplay'>" + newTrain.frequencyInput +
    "</td><td class='nextArrivalDisplay'>" + trainTable +
    "</td><td class='minutesAwayDisplay'>" + tMinutesTillTrain +
    "</td></tr>"
)
    
}, function(errorObject) {
console.log("errors handled: " + errorObject.code);
});

