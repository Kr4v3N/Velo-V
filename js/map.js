// --------------------------- //
// ------  CARTE VELOV  ----- //
// -------------------------- //

// Création de l'objet VelovMap
var VelovMap = {
  veloDispo: 0,
  placeDispo: 0,

  // J'initialise ma carte Google maps
  initVelov: function (Lat, Lng, api) {
    // Affiche la map
      var map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(Lat, Lng),// les coordonnées du "center" sont fournies au travers d'un nouvel objet : "google.maps.LatLng"
      zoom: 13, // Je zoom au niveau 13
      streetViewControl: false // Je retire le bonhommme jaune de la carte
    });
    var iconBase = "https://fafachena.com/images/"; // J'indique l'emplacement des marqueurs et clusterers.


    // Récupération des donnés sous format json de L'API.
    ajaxGet(api, function (reponse) {
      var stations = JSON.parse(reponse); /* "parse()", prend en paramètre la chaîne de caractères à analyser et retourne le résultat sous forme d'objet JSON */
      // Je créé un tableau de marqueurs
      var markers = [];

      // Si réservation en cours, affiche dans le footer
      if (sessionStorage.station != null) {
        $(document).ready(function () {
          $(".footer-text").text("Votre vélo à la station " + sessionStorage.station + " est réservé pour :");
          $("#footer *:not(.timer)").fadeIn("Slow");
          var timeInterval = setInterval(VelovMap.compteur, 1000);

          // Evénement qui annule la réservation
          $(".annuler").click(function () {
            VelovMap.annulerReservation();
          });
        });
      }

      // Les marqueurs pour chaque station
      stations.forEach(function (station) { /*"forEach()" appele une fois pour chaque élément présent dans le tableau.*/

        // J'affiche le marqeur sur la carte
        var marker = new google.maps.Marker({
          position: station.position,
          title: station.name,
          map: map,
          icon: iconBase + "station-opened.png"
        });

        // J'initialise l'animation du marqueur sur null
        marker.setAnimation(null);

        // L'événement click sur le marqueur
        marker.addListener("click", function () {

          // Mise à jour des infos stations
          VelovMap.majInfos(station.name, station.available_bikes, station.available_bike_stands);

          // Si le marqueur est déja animé alors j'arrête et cache les information
          if (marker.getAnimation() !== null) {
            // Arrête l'animation
            marker.setAnimation(null);
            // Cache tout les éléments visibles dans infos-station sauf le titre
            $(".infos-station *:visible:not(h2)").fadeOut("slow", function (){
              // Affiche un message "Sélectionnez une station"
              $(".nom-station").text("Sélectionnez une station").fadeIn("slow");
            });
          }
          // Sinon arrête l'animation des autres marqueurs, anime le marqueur et affiche les information.
          else {
            markers.forEach(function (marker) {
               marker.setAnimation(null);
            });
            // Anime le marqueur
            marker.setAnimation(google.maps.Animation.BOUNCE);
            // Affiche les infos de la station et le cadre réservation
            VelovMap.afficherInfos(station.name, station.address);
          }

          // Scroll vers infos-station quand on clique sur le marqueur
          VelovMap.scrollTo($("#formulaire"));

          // Evénément: valider la réservation
          $(".valider").on("click", function() {
            // Validation de la réservation
            VelovMap.validerReservation(station.name);
            // Mise à jour des informations
            VelovMap.majInfos(station.name, station.available_bikes, station.available_bike_stands);
            // Affiche le nombre de vélos et de places actualisés
            $(".velo-dispo").text("Il y a " + (VelovMap.veloDispo) + " vélo(s) disponible(s)").fadeIn("slow");
            $(".place-libre").text("Il y a " + (VelovMap.placeDispo) + " places libres").fadeIn("slow");
            // Effacer la signature
            VelovMap.effacerSignature();
          });

          // Evénement qui efface la signature
          $(".effacer").on("click", function () {
            VelovMap.effacerSignature();
          });

          // Evénément qui annuler la réservation
          $(".annuler").on("click", function () {
            // Annule la réservation
            VelovMap.annulerReservation();
            // Mise à jour des infos
            VelovMap.majInfos(station.name, station.available_bikes, station.available_bike_stands);
            // Affiche les infos
            VelovMap.afficherInfos(station.name, station.adress);
          });

          // Cache le panneau "réservation" quand on clique sur un marker
          $(".reservation").fadeOut("slow");
        });

        // Remplit le tableau de marqueurs
        markers.push(marker);
      });

      // Regroupe les marqueurs par lot sur la carte
      var markerCluster = new MarkerClusterer (map, markers, {
        imagePath: "images/m"
      });
    });
  },



  // Méthode qui affiche des informations des stations et du cadre réservation.
  afficherInfos: function (nomStation, adresseStation) {
    // Cache tous les éléments visible dans infos-station sauf le titre
    $(".infos-station *:visible:not(h2)").fadeOut("slow", function () {
      // Remplit les détails de la station
      $(".nom-station").text(nomStation);
      $(".adresse-station").text(adresseStation);
      $(".place-libre").text("Il y a " + VelovMap.placeDispo + " places libres");
      $(".velo-dispo").text("Il y a " + VelovMap.veloDispo + " vélo(s) disponible(s)");

      // S'il y a des vélos disponibles et si un vélo n'est pas deja reservé dans cette station.
      if ((VelovMap.veloDispo > 0) && (nomStation != sessionStorage.station)) {
        // Affiche toutes les infos + bouton "réserver"
        $(".infos-station *").fadeIn("slow");

        // Affiche le cadre reservation quand on clique sur "réserver"
        $(".reserver").on("click", function () {
          // Scroll vers le panneau réservation
          VelovMap.scrollTo($("#reservation"));
          $(".reservation").fadeIn("slow");
          $(".reservation hr").fadeIn("slow");
        });
      } // Sinon n'affiche pas le bouton "réserver"
      else {
        $(".infos-station *:not(.reserver)").fadeIn("slow");
      }
    });
  },


  // Méthode sur la validation de la réservation.
  validerReservation: function (station) {
    // Efface la station en mémoire
    sessionStorage.clear();
    // Enregistre le nom de la station de la réservation
    sessionStorage.setItem("station", station);

    // Initialise la date de fin de réservation
    var dateReservation = Date.parse(new Date());
    var deadline = new Date(dateReservation + 20*60*1000);
    // Enregistre date de fin de la réservation
    sessionStorage.setItem("date", deadline);

    // Scroll vers footer quand on valide la réservation
    VelovMap.scrollTo($("#footer"));

    // Cache le bouton et le panneau de réservation.
    $(".reserver").fadeOut("slow");
    $(".reservation").fadeOut("slow");

    // Affiche la réservation et le timer
    $("#footer *:not(h3, .annuler, .timer)").fadeOut("slow", function () {
      $(".footer-text").text("Votre vélo à la station " + sessionStorage.station + " est réservé pour :");
      $("#footer *").fadeIn("slow");
    });

    // Lance le compte à rebours de la réservation
    var timeInterval = setInterval(VelovMap.compteur, 1000);
  },


  // Méthode qui efface la signature.
  // -----------------------------
  effacerSignature: function () {
    // Efface la signature
    ctx.clearRect(0,0,250,125);
    // Désactive le bouton "valider" et change la couleur
    $(".valider").prop("disabled", true);
    $(".valider").css("background-color", "grey");
  },


  // Méthode qui procéde à l'annulation de la réservation.
  annulerReservation: function () {
    // Efface la reservation enregistrée
    clearInterval(VelovMap.timeInterval);
    sessionStorage.clear();

    // Affiche un message "Aucune réservation"
    $("#footer *:not(h3)").fadeOut("slow", function () {
      $(".footer-text").text("Aucune réservation en cours");
      $(".minutes").text("");
      $(".secondes").text("");
      $("#footer *:not(.annuler, .timer)").fadeIn("slow");
    });
  },


  // Méthode qui permet la mise à jour des informations des stations
  majInfos: function (station, velo, place) {
    // Si nom station est égal à nom stations réservation.
    if (station == sessionStorage.station) {
      // Mise à jour du nombre de vélos et de places dispos
      VelovMap.veloDispo = (velo - 1);
      VelovMap.placeDispo = (place + 1);
    } // Sinon affiche nombre de vélos et places disponibles de l'API.
    else {
      VelovMap.veloDispo = velo;
      VelovMap.placeDispo = place;
    }
  },


  // Méthode pour le compteur de la réservation.
  compteur: function () {
    // t = temps restant jusqu'à la deadline en ms
    var t = Date.parse(sessionStorage.date) - Date.parse(new Date());
    // Conversion de t en secondes et minutes
    var secondes = Math.floor((t/1000) % 60);
    var minutes = Math.floor((t/1000/60) % 60);
    // Affichage du compteur
    $(".minutes").text(minutes + " min");
    $(".secondes").text(("0" + secondes + " s").slice(-4));

    // Annulation de la réservation à la fin du compte à rebours.
    if (t <= 0) {
      VelovMap.annulerReservation();
      // Affiche un message "Réservation terminée"
      $(".infos-station *:visible:not(h2)").fadeOut("slow", function (){
        $(".nom-station").text("Réservation terminée").fadeIn("slow");
      });
    }
  },


  // Méthode pour scroller vers une cible.
  // -------------------------------
  scrollTo: function (target) {
    $("html, body").stop().animate({ scrollTop: target.offset().top }, "slow");
  }
};


function initMap() {
  VelovMap.initVelov(45.75, 4.85, "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=5d3fd5045875a418e2b763d4b40e94a7333096ca");
}
