// ---------------------------- //
// ---------  CANVAS  --------- //
// ---------------------------- //

// Création de l'objet canvas
var canvas = document.getElementById("signature");
var information = document.getElementById("information");
var Canvas = {
    // INITIALISATION DU CANVAS
    initCanvas: function (canvas) {
        context = canvas.getContext("2d"); // On récupère le context du canvas avec la méthode "getContext"
        context.fillText("Signez ici", 10, 20); // la méthode "fillText();" trace la chaîne de caractères
        paint = false;
    },
    // FONCTIONS POUR LA SIGNATURE A LA SOURIS
    startDraw: function () {
        context.beginPath(); // On indique au context que l'on s'apprête à effectuer un nouveau tracé.
        context.moveTo(cursorX, cursorY); /* La méthode "moveTo" déplace le point de départ de chaque ligne */
    },
    draw: function () {
        context.lineTo(cursorX, cursorY); // La méthode 'lineTo" trace une ligne en partant de la position actuelle, jusqu'aux coordonnées x, y indiquées.
        context.strokeStyle = "black"; // J'ai assigné à "context.strokeStyle" la valeur noir
        context.lineWidth = 3; // L'attribut "lineWidth" change l'épaisseur des lignes.
        context.stroke(); // La méthode "context.stroke() crée juste les traits des lignes.
    },
    stopDraw: function () {
        paint = false;
    },
    erase: function () {
        context.clearRect(0,0, 350 , 200);
    },
    // FONCTIONS POUR LA SIGNATURE SUR ECRANS TACTILES
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
        e.preventDefault(); // annule Le comportement par défaut en appelant la méthode "preventDefault" sur l'objet Event.
        var touches = e.changedTouches;
        for (var i=0; i<touches.length; i++) {
            this.ongoingTouches.push(touches[i]);
            var color = "black";
            context.fillStyle = color;
            context.fillRect(touches[i].pageX-2-canvas.offsetLeft,  e.touches[i].pageY-information.offsetTop-canvas.offsetTop, 4, 4);
        console.log( e.touches[i].pageY-information.offsetTop-canvas.offsetTop);
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

        context.lineTo(touches[i].pageX-canvas.offsetLeft, e.touches[i].pageY-information.offsetTop-canvas.offsetTop);

        context.stroke();
        context.beginPath();
        context.beginPath();
        context.moveTo(touches[i].pageX-2-canvas.offsetLeft, e.touches[i].pageY-information.offsetTop-canvas.offsetTop);

            this.ongoingTouches.splice(idx, 1, touches[i]);
            console.log(touches[i].pageX-2-canvas.offsetLeft);
            console.log(e.touches[i].pageY-information.offsetTop-canvas.offsetTop);
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
            context.moveTo(touches[i].pageX-2-canvas.offsetLeft, touches[i].pageY-information.offsetTop-canvas.offsetTop);
            context.lineTo(touches[i].pageX-canvas.offsetLeft, touches[i].pageY-information.offsetTop-canvas.offsetTop);
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
//
// CREATION DE LA ZONE SIGNATURE AVEC L'OBJET CANVAS
var espaceSignature = Object.create(Canvas);
espaceSignature.initCanvas(canvas);
/* La méthode "addEventListener" lui ajoute un gestionnaire pour un événement particulier. Cette méthode prend deux paramètres : le type de l'événement et la fonction qui gère l'événement. Cette fonction sera appelée à chaque fois que l'événement se déclenchera sur l'élément. */
canvas.addEventListener("mousedown", function (e) { /* L'évènement mousedown est déclenché lorsque le dispositif de pointage de la souris est actif */
    paint = true;
    cursorX = (e.offsetX);
    cursorY = (e.offsetY);
    console.log(cursorY);
    console.log(cursorX);
    espaceSignature.startDraw();
});
canvas.addEventListener("mousemove", function (e) { /* L'événement mousemove se déclenche quand la souris se déplace alors qu'elle est au dessus d'un élément. */
    if (paint === true) {
        cursorX = (e.offsetX);
        cursorY = (e.offsetY);
        espaceSignature.draw();
    }
});
canvas.addEventListener("mouseup", function () { /* L'événement mouseup est déclenché quand un dispositif de pointage est relâché au dessus d'un élément.  */
    espaceSignature.stopDraw();
    buttonConfirme.style.display = "flex";
    buttonErase.style.display = "flex";
});

// METHODE: GERE LES EVENEMENTS TACTILE
canvas.addEventListener("touchstart", function(e) { /* L'événement Touchstart est déclenché lorsqu'un ou plusieurs points de contact sont placés sur la surface */
    e.preventDefault();
    espaceSignature.handleStart(e);
});
canvas.addEventListener("touchend", function(e) { /* L'événement touchend est déclenché quand un point de contact est retiré de la surface. */
    e.preventDefault();
    espaceSignature.handleEnd(e);
    buttonConfirme.style.display = "flex";
    buttonErase.style.display = "flex";
    buttonConfirme.scrollIntoView({behavior: "smooth"});
});
canvas.addEventListener("touchcancel", function(e) { /* L'événement touchcancel est déclenché lorsqu'un ou plusieurs points de contact ont été perturbés de manière spécifique à la mise en œuvre (par exemple, trop de points de contact sont créés) */
    e.preventDefault();
    espaceSignature.handleCancel(e);
});
canvas.addEventListener("touchleave", function(e) {
    e.preventDefault();
    espaceSignature.handleEnd(e);
});
canvas.addEventListener("touchmove", function(e) { /* L'événement touchmove est déclenché lorsqu'un ou plusieurs points de contact sont déplacés le long de la surface tactile. */
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
    newReservation.initReservation("20:00", sessionStorage.getItem("nomStation"));
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
