// --------------------------- //
// ----------  AJAX  --------- //
// -------------------------- //

//AJAX est l'acronyme d'Asynchronous JavaScript and XML, ce qui, transcrit en français, signifie « JavaScript et XML asynchrones ».
/* C'est un ensemble de technologies destinées à réaliser de rapides mises à jour du contenu d'une page Web, sans qu'elles nécessitent le moindre rechargement visible par l'utilisateur de la page Web.*/
// Requête Ajax, pour récupérer les données et les exploiter au retour de la requête après transformation en objet
// Exécute un appel AjAX GET
// Prend en paramètres l'URL cible et la fonction callback appelé en cas de succès
// Le principe d'AJAX c'est d'appeler une page est de récuperer quelque chose en retour


/* L'attribut "url" doit retourner l'URL absolue qui résulte de la résolution de la valeur qui a été transmise au constructeur.*/
/* Je spécifie la fonction de callback afin de savoir quand la requête s'est terminée car c'est une requête asynchrone */
function ajaxGet(url,callback) {
    // Création d'une requête HTTP
    var req = new XMLHttpRequest();/* L'objet "XMLHttpRequest()"" envoi une requête HTTP à l'adresse spécifiée, une réponse est alors attendue en retour de la part du serveur ; une fois la réponse obtenue, la requête s'arrête et peut éventuellement être relancée. */

    // La préparation de la requête se fait par le biais de la méthode "open()" qui prend en parametre 3 arguments: "GET", "url" et un booléen qui est par default "true" pour une requête asynchrone.
    // Requête HTTP GET asynchrone: une requête de mode asynchrone sera exécutée en parallèle et ne bloquera pas l'exécution du script.
    // Requête HTTP GET asynchrone
    req.open("GET", url, true);// Le premier argument contient la méthode d'envoi des données ""GET"
    // Le deuxième argument est l'"URL" à laquelle je souhaite soumettre la requête.


    //Gestion de l'évènement indiquant la fin de la requête
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) { //Le serveur a réussi à traiter la demande
            // Appelle la fonction callback en lui passant la réponse de la requete
            callback(req.responseText);
        } else {
            // Affichage des inforamtions sur l'échec du traitement de la requete
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        // La requete n'a pas réussi à atteindre le serveur
        console.error("Erreur réseau avec l'URL " + url);
    });
    // Envoi de la requête
    req.send(null); // Envoyer la requête avec la méthode "send()".
}

// Récuperations des éléments du DOM
var $LeftArrow = $('#left');
var $RightArrow = $('#right');
var $Step = $('.step');
var $Keyboard = $('body');
// L'objet document représente la page Web.
// La méthode getElementById : permet d'accéder à un élément HTML est d'utiliser l'identifiant de l'élément.
var carteVelov = document.getElementById("map"); // On récupère l'objet map dans la variable carteVelov avec la méthode "getElementById".
var stationTitle = document.getElementById("station-titre");
var statusStation = document.getElementById("station-ouverture");
var addressStation = document.getElementById("station-adresse");
var availableBike = document.getElementById("station-velo-dispo");
var availableStand = document.getElementById("station-emplacement-dispo")
var buttonConfirme = document.getElementById("bouton-valider");
var buttonErase = document.getElementById("bouton-efface");
var buttonReserve = document.getElementById("bouton-confirme");
var canvas = document.getElementById("signature");
var bouttonCancel = document.getElementById("bouton-annuler");
var nameStationReserved = document.getElementById("station-reserve");
var timer = document.getElementById("timer");
var rebours = document.getElementById("rebours");
var reservation = document.getElementById("reservation");

// -----------------------------//
// ----------- CARTE -----------//
// ----------------------------//

// Création de la carte avec l'objet carte, "mapVelov.initCarte" est appelée dans index.html
var mapVelov = Object.create(Carte);


// ---------------------------- //
// ------  API JCDECAUX  ------ //
// ---------------------------- //

// Appel de L'API JCDecaux pour implementer les markers des stations.
ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=5d3fd5045875a418e2b763d4b40e94a7333096ca", function(reponse) {
	allStation = JSON.parse(reponse);// "parse()", prend en paramètre la chaîne de caractères à analyser et retourne le résultat sous forme d'objet JSON
    allStation.forEach( function(station) { /*"forEach()" appele une fois pour chaque élément présent dans le tableau.*/

    	// Mise en place de tous les markers sur la carte
    	mapVelov.initMarker(station);
	});
	//Regroupement des markers
    mapVelov.initClustering();
});


