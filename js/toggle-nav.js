// --------------------------------------------------//
// ------  ACTIVATION DE L'ANIMATION HAMBURGER ------//
// --------------------------------------------------//


// J'utilise la méthode click pour gerer l'évenement de type click.

 $(document).ready(function(){ // Attente du chargement complet du DOM
    $(".m-nav-toggle").click(function(){
        $(".m-nav-toggle").toggleClass("opened"); // Animation des barres de l'hamburger.
        $(".m-right").toggleClass("opened"); // Animation de la navbar.
    })
 });

// La méthode "toggleClass()"" va nous permettre d’inverser l’état de visibilité d’une classe, c’est à dire de l’afficher s'il est caché ou de le cacher si il est affiché.


