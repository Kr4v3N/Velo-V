// CREATION DE L'OBJET CANVAS

var Canvas = {
    // INITIALISATION DU CANVAS
    initCanvas: function (canvas) {
        context = canvas.getContext("2d");
        context.fillText("Signez ici", 20, 20);
        painting = true;
    },
    // FONCTIONS CONCERNANT LA SIGNATURE A LA SOURIS
    startDraw: function () {
        context.beginPath();
        context.moveTo(cursorX, cursorY);
    },
    draw: function () {
        context.lineTo(cursorX, cursorY);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.stroke();
    },
    stopDraw: function () {
        painting = false;
    },
    erase: function () {
        context.clearRect(0,0, 350 , 200);
    },
    // FONCTIONS CONCERNANT LA SIGNATURE AU TOUCHÉ
    ongoingTouches: [], // tableau qui regroupe les touch
    ongoingTouchIndexById: function (idToFind) {
        for (var i=0; i<this.ongoingTouches.length; i++) {
            var id = this.ongoingTouches[i].identifier;
            if (id == idToFind) {
                return i;
            }
        }
        return -1;    // not found
    },
    handleStart: function(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        for (var i=0; i<touches.length; i++) {
            this.ongoingTouches.push(touches[i]);
            var color = "black";
            context.fillStyle = color;
            context.fillRect(touches[i].pageX-2-canvas.offsetLeft, touches[i].pageY-2-canvas.offsetTop, 4, 4);
        }
    },
    handleMove:function(e) {
        e.preventDefault();
        var touches = e.changedTouches;
        context.lineWidth = 4;
        for (var i=0; i<touches.length; i++) {
            var color = "black";
            var idx = this.ongoingTouchIndexById(touches[i].identifier);
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(this.ongoingTouches[idx].pageX-canvas.offsetLeft, this.ongoingTouches[idx].pageY-canvas.offsetTop);
            context.lineTo(touches[i].pageX-canvas.offsetLeft, touches[i].pageY-canvas.offsetTop);
            context.closePath();
            context.stroke();
            this.ongoingTouches.splice(idx, 1, touches[i]);
      }
    },
    handleEnd: function (e) {
        e.preventDefault();
        var touches = e.changedTouches;
        context.lineWidth = 4;
        for (var i=0; i<touches.length; i++) {
            var color = "black";
            var idx = this.ongoingTouchIndexById(touches[i].identifier);
            context.fillStyle = color;
            context.beginPath();
            context.moveTo(this.ongoingTouches[i].pageX-canvas.offsetLeft, this.ongoingTouches[i].pageY-canvas.offsetTop);
            context.lineTo(touches[i].pageX-canvas.offsetLeft, touches[i].pageY-canvas.offsetTop);
            this.ongoingTouches.splice(i, 1);
        }
    },
    handleCancel:function (e) {
        var touches = e.changedTouches;
        for (var i=0; i<touches.length; i++) {
            this.ongoingTouches.splice(i, 1);
        }
    }
};

// ----------------------------------- //
// -------------  CANVAS ------------ //
// --------------------------------- //

// CREATION DE L'ESPACE SIGNATURE AVEC L'OBJET CANVAS

var espaceSignature = Object.create(Canvas);
espaceSignature.initCanvas(canvas);

canvas.addEventListener("mousedown", function (e) {
    painting = true;
    cursorX = (e.pageX - this.offsetLeft) ;
    cursorY = (e.pageY - this.offsetTop);
    espaceSignature.startDraw();
});
canvas.addEventListener("mousemove", function (e) {
    if (painting === true) {
        cursorX = (e.pageX - this.offsetLeft);
        cursorY = (e.pageY - this.offsetTop);
        espaceSignature.draw();
    }
});
canvas.addEventListener("mouseup", function () {
    espaceSignature.stopDraw();
    buttonConfirme.style.display = "flex";
    buttonErase.style.display = "flex";
});
canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();
    espaceSignature.handleStart(e);
});
canvas.addEventListener("touchend", function(e) {
    e.preventDefault();
    espaceSignature.handleEnd(e);
    buttonConfirme.style.display = "flex";
    buttonErase.style.display = "flex";
    buttonConfirme.scrollIntoView({behavior: "smooth"});
});
canvas.addEventListener("touchcancel", function(e) {
    e.preventDefault();
    espaceSignature.handleCancel(e);
});
canvas.addEventListener("touchleave", function(e) {
    e.preventDefault();
    espaceSignature.handleEnd(e);
});
canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    espaceSignature.handleMove(e);
});
// BOUTON QUI EFFACE LA SIGNATURE
buttonErase.addEventListener("click", function () {
    espaceSignature.erase();
    buttonConfirme.style.display = "none";
    buttonErase.style.display = "none";
});


// --------------------------------------- //
// ------------ RESA STATION ------------ //
// ------------------------------------- //

// PRE CONFIRMATION RESERVATION AVANT SIGNATURE
buttonReserve.addEventListener("click", function () {
     // Si reservation active
    if (typeof sessionStorage!='undefined') {
        if('time' in sessionStorage) {
            newReservation.stopReservation(); // annulaion reservation en cours
        } else {
            buttonReserve.style.display = "none"; // Disparition bouton confirmation
            }
    } else {
        alert ("sessionStorage n'est pas supporté");
    }
    sessionStorage.setItem("nomStation", stationTitle.textContent.split(" : ")[1]); //Stockage nom de la station
    canvas.style.display = "flex"; //Espace signature apparait
    canvas.scrollIntoView({behavior: "smooth"}); // Déplacement de l'ecran sur l'espace signature
});
// BOUTON VALIDATION DE LA RESERVATION
buttonConfirme.addEventListener("click", function () {
    // CREATION D'UNE NOUVELLE RESERVATION
    newReservation = Object.create(Reservation);
    newReservation.initReservation("01:00", sessionStorage.getItem("nomStation"));
    rebours.textContent = newReservation.time; // Affichage du temps initial
    espaceSignature.erase(); // Effacement signature
});
// BOUTON ANNULATION DE LA RESERVATION EN COURS
bouttonCancel.addEventListener("click", function() {
    newReservation.stopReservation();
    reservation.scrollIntoView({behavior: "smooth"});
});
// AU RAFFRAICHISSEMENT DE LA PAGE SI RESERVATION ACTIVE
if(typeof sessionStorage!='undefined') {
    if ('time' in sessionStorage) {
        newReservation = Object.create(Reservation);
        newReservation.initReservation(sessionStorage.getItem("time"), sessionStorage.getItem("nomStation"));
    }
} else {
    alert ("sessionStorage n'est pas supporté");
};


