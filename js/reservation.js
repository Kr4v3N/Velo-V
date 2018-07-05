// ---------------------------- //
// ------  RESERVATION  ------- //
// ---------------------------- //

// Création d'un objet réservation
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