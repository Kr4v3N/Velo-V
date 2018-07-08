var canvas= document.getElementById("canvas");
var ctx= canvas.getContext("2d");

var SignIn = {
  dessin: false,

  // INITIALISE CANVAS
  initCanvas: function () {
    // Taille et couleur du trait de la signature
    ctx.strokeStyle = "#212121";
    ctx.lineWidth = 2;

    SignIn.sourisEvent();
    SignIn.touchEvent();
    SignIn.dessiner();
  },



  // METHODE: EVENEMENT SOURIS
  // -------------------------
  sourisEvent: function () {

    // EVENT: Bouton de la souris enfoncé
    $("#canvas").on("mousedown", function (e) {
      SignIn.dessin = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);

    });

    // EVENT: Déplacement de la souris
    $("#canvas").on("mousemove", function (e) {
      // Si le bouton est enfoncé, dessine
      if (SignIn.dessin === true) {
        SignIn.dessiner(e.offsetX, e.offsetY);
        // Active le bouton "valider" et change la couleur
        $(".valider").prop("disabled", false);
        $(".valider").css("background-color", "green");
      }
    });

    // EVENT: Bouton de la souris relâché
    $("#canvas").on("mouseup", function (e) {
      SignIn.dessin = false;
    });
  },



  // METHODE: GERE LES EVENEMENTS TACTILE SUR MOBILE
  // -----------------------------------------------
  touchEvent: function () {
    // EVENT: touché
    $("#canvas").on("touchstart", function (e) {
      var touchX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
      var touchY = e.touches[0].pageY - e.touches[0].target.offsetTop;

      SignIn.dessin = true;
      ctx.beginPath();
      ctx.moveTo(touchX, touchY);
      // Empêche le scrolling de l'écran
      e.preventDefault();
    });

    // EVENT: Déplacement du touché
    $("#canvas").on("touchmove", function (e) {
      var touchX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
      var touchY = e.touches[0].pageY - e.touches[0].target.offsetTop;

      if (SignIn.dessin === true) {
        SignIn.dessiner(touchX, touchY);
        // Active le bouton "valider" et change la couleur
        $(".valider").prop("disabled", false);
        $(".valider").css("background-color", "#BF360C");
      }
      // Empêche le scrolling de l'écran
      e.preventDefault();
    });

    // EVENT: fin du touché
    $("#canvas").on("touchend", function (e) {
      SignIn.dessin = false;
    });
  },



  // METHODE: DESSINER
  // -----------------
  dessiner: function (x,y) {
    ctx.lineTo(x,y);
    ctx.stroke();
  }
};

SignIn.initCanvas();

