var canvas = document.getElementById("canvas");// permet d'accéder à un élément HTML est d'utiliser l'identifiant de l'élément.
var ctx= canvas.getContext("2d");// On récupère le context du canvas avec la méthode "getContext"

var SignIn = {
  paint: false,

  // Initialisation du canvas.
  initCanvas: function () {
    // Taille et couleur du trait de la signature
    ctx.strokeStyle = "#212121";
    ctx.lineWidth = 2;

    SignIn.mouseEvent();
    SignIn.touchEvent();
    SignIn.painting();
  },

  // Méthode pour l'événement souris.

  mouseEvent: function () {

    // Evénement: Bouton de la souris enfoncé
    $("#canvas").mousedown(function (e) {
      SignIn.paint = true;
      ctx.beginPath();/* Avec "beginPath" on indique au context que l'on s'apprête à effectuer un nouveau tracé.*/
      ctx.moveTo(e.offsetX, e.offsetY);/* La méthode "moveTo" déplace le point de départ de chaque ligne */

    });

    // Evénement: Déplacement de la souris
    $("#canvas").mousemove(function (e) {
      // Si le bouton est enfoncé, dessine
      if (SignIn.paint === true) {
        SignIn.painting(e.offsetX, e.offsetY);/* La propriété "offsetX" renvoie la coordonnée x du pointeur de la souris, par rapport à l'élément-cible, la même chose pour "offsetY" */
        // Active le bouton "valider" et change la couleur
        $(".valider").prop("disabled", false);/* La méthode "prop" est utilisé pour récupérer la valeur des propriétés.*/
        $(".valider").css("background-color", "green");/* La méthode "css" est utilisé pour définir une propriété CSS spécifiée.*/
      }
    });

    // Evénement: Bouton de la souris relâché
    $("#canvas").mouseup(function (e) {
      SignIn.paint = false;
    });
  },



  // Méthode qui gère les événement tactile sur les mobiles
  touchEvent: function () {
    // Evénement: touché
    $("#canvas").on("touchstart", function (e) {
      var touchX = e.touches[0].pageX - e.touches[0].target.offsetLeft;/* La propriété "pageX" retourne les coordonnées horizontale du pointeur de la souris lors d'un événement de la souris a été déclenchée. */
      var touchY = e.touches[0].pageY - e.touches[0].target.offsetTop;/* La propriété "offsetTop" revient en position haute par rapport à la partie supérieure de l'élément offsetParent */

      SignIn.paint = true;
      ctx.beginPath();
      ctx.moveTo(touchX, touchY);
      // Empêche le scrolling de l'écran
      e.preventDefault();/* // Annule Le comportement par défaut en appelant la méthode "preventDefault" sur l'objet Event. */
    });

    // Evénement: Déplacement du touché
    $("#canvas").on("touchmove", function (e) {
      var touchX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
      var touchY = e.touches[0].pageY - e.touches[0].target.offsetTop;

      if (SignIn.paint === true) {
        SignIn.painting(touchX, touchY);
        // Active le bouton "valider" et change la couleur
        $(".valider").prop("disabled", false);
        $(".valider").css("background-color", "#BF360C");
      }
      // Empêche le scrolling de l'écran
      e.preventDefault();
    });

    // Evénement: fin du touché
    $("#canvas").on("touchend", function (e) {
      SignIn.paint = false;
    });
  },



  // Méthode qui permet de signer.

  painting: function (x,y) {
    ctx.lineTo(x,y);
    ctx.stroke();
  }
};

SignIn.initCanvas();

