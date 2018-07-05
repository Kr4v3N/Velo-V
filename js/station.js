// CREATION DE L'OBJET STATION QUI RECUPERE ET AFFICHE LES INFOS D'UNE STATION VELOV

var Station = {
	// Fonction d'initialisation d'une station
	initStation: function(station) {
		this.name = station.name.split("- ")[1];
		this.address = station.address;
		if (station.status === "OPEN") {
			this.status = "ouverte";
		} else if (station.status === "CLOSED") {
			this.status = "fermée";
		}
		this.availableStand = station.available_bike_stands;
		this.availableBike = station.available_bikes;
		// Si reservation en cours, alors un vélo en moins dans la station
		if (typeof sessionStorage!='undefined') {
			if ('time' in sessionStorage) {
				if (sessionStorage.getItem("nomStation") === this.name) {
					this.availableBike = station.available_bikes - 1;
				}
		    }
		} else {
			alert ("sessionStorage n'est pas supporté");
		};
	},
	//FONCTION QUI AFFICHE LES INFOS D'UNE STATION
	decrireStation: function() {
		// FAIRE ICI LES TEST SUR LES DISPO VELO
		if (this.status === "fermée") {
			buttonReserve.style.display = "none";
			availableBike.style.display = "none";
			availableStand.style.display = "none";
			statusStation.style.color = "red";
		} else if (this.availableBike === 0) {
			buttonReserve.style.display = "none";
			availableBike.style.display = "inline";
			availableBike.style.color = "red";
			availableStand.style.display = "inline";
			statusStation.style.color = "green";
		} else {
			buttonReserve.style.display = "flex";
			availableBike.style.display = "inline";
			availableStand.style.display = "inline";
			statusStation.style.color = "green";
			availableBike.style.color = "green";
		}
		canvas.style.display = "none";
		buttonConfirme.style.display = "none";
    	buttonErase.style.display = "none";
		stationTitle.textContent = "STATION : " + this.name;
		addressStation.textContent = this.address;
		statusStation.textContent = "Cette Station est actuellement : " + this.status;
		availableBike.textContent = "Nombre de vélos disponibles : " + this.availableBike;
		availableStand.textContent = "Emplacements Vides : " + this.availableStand ;
	}
};