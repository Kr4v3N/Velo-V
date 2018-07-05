// RECUPERATION DES ELEMENT DU DOM NECESSAIRES

 // var nameStationReserved = document.getElementById("station-reserve");
 // var bouttonCancel = document.getElementById("bouton-annuler");


// ---------------------------- //
// ----------- CARTE ----------- //
// ---------------------------- //
//
// CREATION DE LA CARTE VELOV AVEC L'OBJET CARTE
var mapVelov = Object.create(Carte);  //mapVelov.initCarte est appelée dans index.html

// APPEL DE L'API JCDECAUX POUR MISE EN PLACE DES MARKERS DES STATIONS
ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=5d3fd5045875a418e2b763d4b40e94a7333096ca", function(reponse) {
	allStation = JSON.parse(reponse);
    allStation.forEach( function(station) {
    	// Mise en place de tous les markers sur la carte
    	mapVelov.initMarker(station);
	});
	//Regroupement des markers
    mapVelov.initClustering();
});
