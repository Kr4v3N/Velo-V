// ---------------------------------------------------//
// ------  ACTIVATION DE L'ANIMATION HAMBURGER  ------//
// --------------------------------------------------//

/* Le jQuery nous fournit également une méthode nous permettant de modifier l’état d'affectation d’un attribut class à un ou plusieurs éléments HTML, c’est-à-dire de l’ajouter si il n’est pas présent ou de le supprimer s'il l’est.*/

// Je place l'integralité de mon code jQuery à l'intérieur du gestionnaire d'évenement "ready" pour eviter tout problème d'execution du code à cause d'un chargement incomplet de la page.
// $ appel à la librairie jQuery
// $("selecteur css") puis avec le symbole "." j'applique une méthode à l'élément html.
// $("selecteur css").methode()
// J'utilise la méthode click pour gerer l'évenement de type click.
// Je passe dans la parenthèse de "function" un argument nommé "e" qui est l'équivalent de l'évènement "event".

 $(document).ready(function(){ // Attente du chargement complet du DOM
    $(".m-nav-toggle").click(function(e){
        $(".m-nav-toggle").toggleClass("opened"); // Animation des barres de l'hamburger.
        $(".m-right").toggleClass("opened"); // Animation de la navbar.
    })
 });

// La méthode "toggleClass()"" va nous permettre d’inverser l’état de visibilité d’une classe, c’est à dire de l’afficher si il est caché ou de le cacher si il est affiché.


