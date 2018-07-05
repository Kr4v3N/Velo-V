/* J'ai appelé jQuery avec le document du DOM en paramètre, en lui demandant d’exécuter la méthode ready() qui permet d’exécuter une fonction, passée en paramètre, lorsque ce document est chargé et prêt ! */

$(document).ready(function(){

    /* Je crée un objet "slider" avec 2 propriétés, index qui a la valeur 1 et autoPlay qui a la valeur null et 5 méthodes. */
    var slider = {
      index : 1,
      autoPlay : null,
      // Méthode: initialise le slider
      initSlideshow: function() {
        this.displaySlideshow(); /* L'opérateur "this" fait référence à l'objet en cours */
        this.clickButton();
        this.eventKeyboard();
        // Initialisation du slider automatique
        slider.autoPlay = setInterval(function() { /* La méthode "setInterval()"" déclenche une opération à intervalles réguliers */
        slider.index ++; // Incrementation du slide suivant
        slider.displaySlideshow(slider.index);
        }, 6000);
      },
      // Méthode: affichage du slider
      displaySlideshow: function(n) {
          // index = 1 s'il dépasse le nombre d'éléments du slider
          if (n > $Step.length) { // Test conditionnel
            this.index = 1;
          }
          // index = dernier élément du slider s'il dépasse le premier élément
          if (n < 1) {
            this.index = $Step.length; /* La propriété "length" définit le nombre d'arguments attendus par la fonction */
          }
          // N'affiche aucun élément du slider
          $Step.hide();
          /* Affiche l'élément du slider voulu grâce au filtre "eq" qui permet de cibler n'importe quel élément dans une collection d'élément. Cette méthode va prendre en argument l’index relatif à l’élément que l’on souhaite sélectionner dans notre liste d’éléments */
          $Step.eq(slider.index -1).fadeIn(1100, 'linear');
      },
      // Méthode: changer de slide
      switchSlideshow: function(d) {
          // Arrête le slider auto
          clearInterval(this.autoPlay);
          // Affiche le slide suivant
          if (d === 39) { // Est égal à 39 (en valeur et en type)
            this.displaySlideshow(this.index += 1);
          }
          // Affiche le slide précédent
          if (d === 37) { // jQuery Keycode
            this.displaySlideshow(this.index -= 1);
          }
      },
      // Gestion du slider avec les flèches
      clickButton: function () {
          // Evénément du clique sur la flèche droit
          $RightArrow.click( function() {
            direction = 39;// jQuery Keycode
            slider.switchSlideshow(direction);
          });
          // Evenement du clique sur la flèche gauche
          $LeftArrow.click( function() {
            direction = 37;// jQuery Keycode
            slider.switchSlideshow(direction);
          });
      },
      //La méthode keydown() va nous permettre de gérer l’évènement « on presse une touche du clavier ».
      // Méthode: contrôle du slider avec le clavier
      eventKeyboard: function() {
          $Keyboard.keydown( function(e) {
            direction = e.keyCode; // jQuery Keycode
            slider.switchSlideshow(direction);
          });
      }
    };

    slider.initSlideshow();
});