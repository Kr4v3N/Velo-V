
// Il te faut faire une requête, Ajax par exemple, pour récupérer les données et les exploiter au retour de la requête après transformation en objet
// Exécute un appel AjAX GET
// Prend en paramètres l'URL cible et la fonction callback appelé en cas de succès
function ajaxGet(url,callback) {
	// Création d'une requête HTTP
	var req = new XMLHttpRequest();
	// Requête HTTP GET asynchrone
	req.open("GET", url);
	//Gestion de l'évènement indiquant la fin de la requete
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
	req.send(null);
}
// Exécute un appel AJAX POST
// Prend en paramètres l'URL cible, la donnée à envoyer et la fonction callback appelée en cas de succès
// Le paramètre isJSON permet d'indiquer si l'envoi concerne des données JSON
function ajaxPost(url, data, callback, isJson) {
  var req = new XMLHttpRequest();
  req.open("POST", url);
  req.addEventListener("load", function () {
    if (req.status >= 200 && req.status < 400) {
      // Appelle la fonction callback en lui passant la réponse de la requête
      callback(req.responseText);
    } else {
      console.error(req.status + " " + req.statusText + " " + url);
    }
  });
  req.addEventListener("error", function () {
    console.error("Erreur réseau avec l'URL " + url);
  });
  if (isJson) {
    // Définit le contenu de la requête comme étant du JSON
    req.setRequestHeader("Content-Type", "application/json");
    // Transforme la donnée du format JSON vers le format text avant l'envoi
    data = JSON.stringify(data);
  }
  req.send(data);
}
