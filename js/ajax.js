// --------------------------- //
// ----------  AJAX  --------- //
// -------------------------- //


function ajaxGet(url,callback) {
    // Création d'une requête HTTP
    var req = new XMLHttpRequest();/* L'objet "XMLHttpRequest()"" envoi une requête HTTP à l'adresse spécifiée, une réponse est alors attendue en retour de la part du serveur ; une fois la réponse obtenue, la requête s'arrête et peut éventuellement être relancée. */

    /* Requête HTTP GET asynchrone */
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


