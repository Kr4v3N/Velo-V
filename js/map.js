// OBJET: VelovMap
var VelovMap = {
  veloDispo: 0,
  placeDispo: 0,

  // INITIALISE LA MAP
  initVelov: function (Lat, Lng, api) {
    // Affiche la map
    var iconBase = "https://fafachena.com/images/";
    var map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(Lat, Lng),
      zoom: 13,
      streetViewControl: false
    });

    // RECUPERATION DES DONNEES JSON DE L'API
    ajaxGet(api, function (reponse) {
      var stations = JSON.parse(reponse);
      // Créé un tableau de markers
      var markers = [];

      // SI RESERVATION EN COURS, L'AFFICHE DANS LE FOOTER
      if (sessionStorage.station != null) {
        $(document).ready(function () {
          $(".footer-text").text("Votre vélo à la station " + sessionStorage.station + " est réservé pour :");
          $("#footer *:not(.timer)").fadeIn("Slow");
          var timeInterval = setInterval(VelovMap.compteur, 1000);

          // EVENT: Annuler la réservation
          $(".annuler").on("click", function () {
            VelovMap.annulerReservation();
          });
        });
      }

      // POUR CHAQUE STATION
      stations.forEach(function (station) {

        // AFFICHE LE MARQUEUR SUR LA MAP
        var marker = new google.maps.Marker({
          position: station.position,
          title: station.name,
          map: map,
          icon: iconBase + "station-opened.png"
        });

        // Initialise l'animation du marqueur sur null
        marker.setAnimation(null);

        // EVENT: CLICK SUR LE MARQUEUR
        marker.addListener("click", function () {

          // Mise à jour des infos stations
          VelovMap.majInfos(station.name, station.available_bikes, station.available_bike_stands);

          // SI LE MARQUEUR EST DEJA ANIME, L'ARRETE ET CACHE LES INFOS
          if (marker.getAnimation() !== null) {
            // Arrête l'animation
            marker.setAnimation(null);
            // Cache tout les éléments visibles dans infos-station sauf le titre
            $(".infos-station *:visible:not(h2)").fadeOut("slow", function (){
              // Affiche un message "Sélectionnez une station"
              $(".nom-station").text("Sélectionnez une station").fadeIn("slow");
            });
          }
          // SINON ARRETE L'ANIMATION DES AUTRES MARQUEURS, ANIME LE MARQUEUR ET AFFICHE LES INFOS
          else {
            markers.forEach(function (marker) {
               marker.setAnimation(null);
            });
            // Anime le marker
            marker.setAnimation(google.maps.Animation.BOUNCE);
            // Affiche les infos de la station et le cadre réservation
            VelovMap.afficherInfos(station.name, station.address);
          }

          // Scroll vers infos-station quand on clique sur le marker
          VelovMap.scrollTo($("#formulaire"));

          // EVENT: Valider la réservation
          $(".valider").on("click", function() {
            // Validation de la réservation
            VelovMap.validerReservation(station.name);
            // Mise à jour des infos
            VelovMap.majInfos(station.name, station.available_bikes, station.available_bike_stands);
            // Affiche le nombre de vélos et de places actualisés
            $(".velo-dispo").text("Il y a " + (VelovMap.veloDispo) + " vélo(s) disponible(s)").fadeIn("slow");
            $(".place-libre").text("Il y a " + (VelovMap.placeDispo) + " places libres").fadeIn("slow");
            // Effacer la signature
            VelovMap.effacerSignature();
          });

          // EVENT: Effacer la signature
          $(".effacer").on("click", function () {
            VelovMap.effacerSignature();
          });

          // EVENT: Annuler la réservation
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

        // Remplit le tableau de markers
        markers.push(marker);
      });

      // REGROUPE LES MARKERS PAR LOT SUR LA MAP
      var markerCluster = new MarkerClusterer (map, markers, {
        imagePath: "images/m"
      });
    });
  },



  // METHODE: AFFICHAGE DES INFOS STATIONS ET DU CADRE RESERVATION
  // -------------------------------------------------------------
  afficherInfos: function (nomStation, adresseStation) {
    // Cache tous les éléments visible dans infos-station sauf le titre
    $(".infos-station *:visible:not(h2)").fadeOut("slow", function () {
      // Remplit les détails de la station
      $(".nom-station").text(nomStation);
      $(".adresse-station").text(adresseStation);
      $(".place-libre").text("Il y a " + VelovMap.placeDispo + " places libres");
      $(".velo-dispo").text("Il y a " + VelovMap.veloDispo + " vélo(s) disponible(s)");

      // SI IL Y A DES VELOS DISPO ET SI UN VELO N'EST PAS DEJA RESERVE DANS CETTE STATION
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
      } // SINON N'AFFICHE PAS LE BOUTON "RESERVER"
      else {
        $(".infos-station *:not(.reserver)").fadeIn("slow");
      }
    });
  },



  // METHODE: VALIDATION DE LA RESERVATION
  // -------------------------------------
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

    //Cache le bouton et le panneau de réservation.
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



  // METHODE: EFFACER LA SIGNATURE
  // -----------------------------
  effacerSignature: function () {
    // Efface la signature
    ctx.clearRect(0,0,250,125);
    // Désactive le bouton "valider" et change la couleur
    $(".valider").prop("disabled", true);
    $(".valider").css("background-color", "grey");
  },



  // METHODE: ANNULATION DE LA RESERVATION
  // -------------------------------------
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



  // METHODE: MISE A JOUR DES INFOS STATION
  // --------------------------------------
  majInfos: function (station, velo, place) {
    // SI NOM STATION EGALE NOM STATION RESERVATION
    if (station == sessionStorage.station) {
      // Mise à jour du nombre de vélos et de places dispos
      VelovMap.veloDispo = (velo - 1);
      VelovMap.placeDispo = (place + 1);
    } // SINON AFFICHE NOMBRE DE VELOS ET PLACES DISPO DE L'API
    else {
      VelovMap.veloDispo = velo;
      VelovMap.placeDispo = place;
    }
  },



  // METHODE: COMPTEUR DE LA RESERVATION
  // -----------------------------------
  compteur: function () {
    // t = temps restant jusqu'à la deadline en ms
    var t = Date.parse(sessionStorage.date) - Date.parse(new Date());
    // Conversion de t en secondes et minutes
    var secondes = Math.floor((t/1000) % 60);
    var minutes = Math.floor((t/1000/60) % 60);
    // Affichage du compteur
    $(".minutes").text(minutes + " min");
    $(".secondes").text(("0" + secondes + " s").slice(-4));

    // ANNULE LA RESERVATION A LA FIN DU COMPTE A REBOURS
    if (t <= 0) {
      VelovMap.annulerReservation();
      // Affiche un message "Réservation terminée"
      $(".infos-station *:visible:not(h2)").fadeOut("slow", function (){
        $(".nom-station").text("Réservation terminée").fadeIn("slow");
      });
    }
  },



  // METHODE: SCROLL VERS UNE TARGET
  // -------------------------------
  scrollTo: function (target) {
    $("html, body").stop().animate({ scrollTop: target.offset().top }, "slow");
  }
};


function initMap() {
  VelovMap.initVelov(45.75, 4.85, "https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=5d3fd5045875a418e2b763d4b40e94a7333096ca");
}
