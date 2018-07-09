// --------------------------- //
// ----------  AJAX  --------- //
// -------------------------- //

//AJAX est l'acronyme d'Asynchronous JavaScript and XML, ce qui, transcrit en français, signifie « JavaScript et XML asynchrones ».
/* */
// Requête Ajax, pour récupérer les données et les exploiter au retour de la requête après transformation en objet
// Exécute un appel AjAX GET
// Prend en paramètres l'URL cible et la fonction callback appelé en cas de succès
// Le principe d'AJAX c'est d'appeler une page est de récuperer quelque chose en retour


/* L'attribut "url" doit retourner l'URL absolue qui résulte de la résolution de la valeur qui a été transmise au constructeur.*/
/* Je spécifie la fonction de callback afin de savoir quand la requête s'est terminée car c'est une requête asynchrone */
function ajaxGet(url,callback) {
    // Création d'une requête HTTP
    var req = new XMLHttpRequest();/* L'objet "XMLHttpRequest()"" envoi une requête HTTP à l'adresse spécifiée, une réponse est alors attendue en retour de la part du serveur ; une fois la réponse obtenue, la requête s'arrête et peut éventuellement être relancée. */

    /* La préparation de la requête se fait par le biais de la méthode "open()" qui prend en parametre 3 arguments: "GET", "url" et un booléen qui est par default "true" pour une requête asynchrone.*/
    /* Requête HTTP GET asynchrone: une requête de mode asynchrone sera exécutée en parallèle et ne bloquera pas l'exécution du script.*/
    req.open("GET", url, true);/*Le premier argument contient la méthode d'envoi des données ""GET" */
    // Le deuxième argument est l'"URL" à laquelle je souhaite soumettre la requête.

    //Gestion de l'évènement indiquant la fin de la requête
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) { //Le serveur a réussi à traiter la demande
            // Appelle la fonction callback en lui passant la réponse de la requete
            callback(req.responseText);
        } else {
            // Affichage des informations sur l'échec du traitement de la requete
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


