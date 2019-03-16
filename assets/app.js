$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAiHqyWMMGkJWR8GE2WVG4VIQbbHHnrbY8",
        authDomain: "train-scheduler-c439a.firebaseapp.com",
        databaseURL: "https://train-scheduler-c439a.firebaseio.com",
        projectId: "train-scheduler-c439a",
        storageBucket: "train-scheduler-c439a.appspot.com",
        messagingSenderId: "765893807410"
    };

    firebase.initializeApp(config);

    let database = firebase.database();

    $("#submit").click(function (event) {
        event.preventDefault();

        let name = $("#name").val();
        let destination = $("#destination").val();
        let firstTrainTime = $("#first-time").val();
        let frequency = $("#freq").val();

        let trainObj = {
            name,
            destination,
            firstTrainTime,
            frequency,
        }
        database.ref().push(trainObj);
    })

    database.ref().on("value", function (snapshot) {

        let trains = snapshot.val();
        for (const key in trains) {
            let {name, destination, firstTrainTime, frequency} = trains[key];
            let tableRow = $("<tr>");
            let tdName = $("<td>").text(name);
            let tdDestination = $("<td>").text(destination);
            let tdFrequency = $("<td>").text(frequency);

            let firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
            let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            let remainder = diffTime % frequency;

            let minutesAway = frequency - remainder;
            let nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
            let tdNextArrival = $("<td>").text(nextArrival);
            let tdMinutesAway = $("<td>").text(minutesAway);

            tableRow.append(tdName, tdDestination, tdFrequency, tdNextArrival, tdMinutesAway);

            $("#train-list").append(tableRow);
        }
    });
});