// ----------------------------------------------- //
// ------  FONCTIONALITE DE L'OBJET SLIDER  ------ //
// ---------------------------------------------- //
//
$(document).ready(function(){

    var slider = {
      index : 1,
      autoPlay : null,
      // la méthode qui initialise le slider.
      initSlideshow: function() {
        this.displaySlideshow(); /* L'opérateur "this" fait référence à l'objet en cours dans notre cas c'est la variable slider.*/
        this.clickButton();
        this.eventKeyboard();
        // J'initialise le slider automatique.
        slider.autoPlay = setInterval(function() { /* La méthode "setInterval()" déclenche une opération à intervalles réguliers */
        slider.index ++; // J'incrémente l'image suivante
        slider.displaySlideshow(slider.index);
        }, 5000);
      },
      // La méthode d'affichage du slider
      displaySlideshow: function(n) {
          // index = 1 s'il dépasse le nombre d'éléments du slider
          if (n > $('.step').length) { // Test conditionnel
            this.index = 1;
          }
          // index = dernier élément du slider s'il dépasse le premier élément
          if (n < 1) {
            this.index = $('.step').length; /* La propriété "length" définit le nombre d'arguments attendus par la fonction */
          }
          // N'affiche aucun élément du slider
          $('.step').hide();
          $('.step').eq(slider.index -1).fadeIn(1100);
      },
      // Méthode qui change de slide
      switchSlideshow: function(d) {
          // Arrête le slider auto
          clearInterval(this.autoPlay);
          // Affiche le slide suivant
          if (d === 39) { // Est égal à 39 (en valeur et en type)
            this.displaySlideshow(this.index += 1);
          }
          // Affiche le slide précédent
          if (d === 37) { // 37 correspond à "ArrowLeft"
            this.displaySlideshow(this.index -= 1);
          }
      },
      // Gestion du slider avec les flèches du DOM
      clickButton: function () {
          // Evénement du clique sur la flèche droit
          $('#right').click( function() {
            var direction = 39;// Keycode
            slider.switchSlideshow(direction);
          });
          // Evénement du clique sur la flèche gauche
          $('#left').click( function() {
            var direction = 37;// Keycode
            slider.switchSlideshow(direction);
          });
      },
      //La méthode keydown() va nous permettre de gérer l’évènement « on presse une touche du clavier ».
      // La méthode pour contrôler le slider avec le clavier
      eventKeyboard: function() {
          $('body').keydown( function(e) {
            var direction = e.keyCode; // Keycode
            slider.switchSlideshow(direction);
          });
      }
    };

    slider.initSlideshow();
});