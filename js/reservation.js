
var nameStationReserved = document.getElementById("station-reserve");
var buttonReserve = document.getElementById("bouton-confirme");
var buttonConfirme = document.getElementById("bouton-valider");
var buttonErase = document.getElementById("bouton-efface");
var timer = document.getElementById("timer");
var bouttonCancel = document.getElementById("bouton-annuler");
// var canvas = document.getElementById("signIn");

//CREATION D'UN OBJET RESERVATION
var Reservation = {
    // initialisation de la réservation avec un temps donné et le nom de la station
    initReservation: function(time, station) {
        this.time = time;
        this.station = station;
        newTimer = Object.create(Timer);
        newTimer.initTimer(this.time);
        timerId = setInterval(newTimer.onTimer, 1000);
        nameStationReserved.textContent = this.station;
        // modifications affichages bouton et canvas
        buttonReserve.textContent = "Nouvelle réservation";
        bouttonCancel.style.display = "flex";
        timer.style.display = "flex";
        buttonConfirme.style.display = "none";
        buttonErase.style.display = "none";
        canvas.style.display = "none";
    },
    // annulation de la réservation en cours
    stopReservation: function() {
        newTimer.resetTimer(timerId);
        // modifications affichages bouton et canvas
        buttonReserve.style.display = "none";
        buttonReserve.textContent = "Confirmer";
        bouttonCancel.style.display = "none";
        timer.style.display = "none";
    }
};