//Karte im div-container mit der ID map initialisieren
var map = L.map('map', 
    {minZoom: 6,
    maxZoom: 9,
    scrollWheelZoom: false,
    zoomSnap: 0 
}).setView([50.6256442,7.7083538], 6);

//Hintergrund-Layer hinzufügen
//Auswahl z.B. via https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: ' &copy; ifp-Coding-Bootcamp 2018 | Map-Tiles von <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Kartendaten &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);

//Karte auf DE zentrieren (https://gist.github.com/graydon/11198540)
map.fitBounds([
    [47.3024876979, 5.98865807458],
    [54.983104153, 15.0169958839]
]);

//Geojson mit Deutschland-Grenzen laden
getJson('./Deutschland.geojson', function (staatsgrenzen) {
    hideRest (staatsgrenzen);
    drawStaatsgrenzen (staatsgrenzen);
});

//Geojson mit Datensatz laden
getJson('./data/data.json', function (datenjahre) {
    var datenLayer = drawIcons (datenjahre["2018"]); 
    
    //Slider in JS-Variable speichern
    var slider = document.getElementById("myRange");
    var output = document.getElementById("labeldisplay");

    //Funktion, die bei Slider-Bewegung ausgeführt wird
    slider.oninput = function() {
        //Layer-Inhalt löschen
        datenLayer.clearLayers ();
        switch (true) {
            case this.value === "1":
                updateMap("1998");
                break;
            case this.value === "2":
                updateMap("2008");
                break;
            case this.value === "3":
                updateMap("2018");
                break;
        } 
      };

    //Karte aktualisieren
    function updateMap(year){
        var geojsonLayer = getGeojsonLayer(datenjahre[year]);
        datenLayer.addLayer(geojsonLayer);
        output.innerHTML = year;
    }
});

//Erzeugt geojson-Layer aus GeoJSON eines Datenjahres --> nötig für MarkerCluster-Layer
function getGeojsonLayer(currentDatenjahr){
    var geojsonLayer = L.geoJSON(currentDatenjahr, {
        pointToLayer: function (feature, latlng) {
            //Erzeugt für jeden Punkt (=feature) in currentDatenjahr ein benutzerdefinierten Icon an Position latlng
            var icon = new L.DivIcon({html: '<div class="icon"></div>', className: "our-icon-default", iconSize: new L.Point(5, 5)});
            return L.marker(latlng, {icon: icon});
        },        
        onEachFeature: function (feature, layer) {
            //Erzeugt für jeden Punkt (=feature) ein Popup
            var props="<h3>"+feature.properties["Titel/Gesamtbelegung"]+"</h3>";
            props += "<span class='city'>"+upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(feature.properties.Ort))+"</span>";
            props += "<br><strong>Druckauflage:</strong> "+feature.properties["Druckauflage"];
            props += "<br><strong>Abonnements:</strong> "+feature.properties.Abonnements;
            //Verknüpft Popup fest mit dem Punkt
            layer.bindPopup(props);
        }
    });

    //Rückgabe des erzeugten Layers, damit er oben weiterverwendet (in Cluster-Layer gesteckt, gelöscht,...) werden kann
    return geojsonLayer;
}

//Fügt der Karte einen GeoJSON-Polygon-Layer hinzu
function drawStaatsgrenzen(staatsgrenzen) {
    var myStyle = {
        "color":"hotpink",
        "weight": 3,
        "opacity": 0.5,
    };
    L.geoJSON(staatsgrenzen, {style: myStyle}).addTo(map);
}
 
//Verbirgt alles außerhalb des Geojsons in relevantBoundaries unter weißer Farbe
function hideRest(relevantBoundaries) {
    var secondStyle = {
        "color": "white",
        "fillOpacity": 0.9
    };
    L.geoJson(relevantBoundaries, {
        invert: true,
        style: secondStyle
    }).addTo(map);
}

//Erzeugt eine markerClusterGroup und fügt sie der Karte hinzu
function drawIcons(datenjahr) {
    var markers = L.markerClusterGroup({
            maxClusterRadius: 2,
            iconCreateFunction: function (cluster) {
                var childCount = cluster.getChildCount();
        
                var c = ' our-icon-';
                if (childCount < 3) {
                    c += 'small';
                } else if (childCount < 5) {
                    c += 'medium';
                } else {
                    c += 'large';
                }
                //Erzeugt einen benutzerdefinierten Icon mit Klasse 'our-icon-*' anhand Anzahl der Marker im Cluster
                //Zeigt Anzahl der "Kinder" in der Mitte des Markers (=childCound im div) 
                return new L.DivIcon({html: '<div class="icon">'+childCount + '</div>', className: c, iconSize: new L.Point(20, 20)});
            }
    });

    var layer = getGeojsonLayer(datenjahr);
    markers.addLayer(layer);
    map.addLayer(markers);
    return markers;
}

//Helfer-Funktion
//https://stackoverflow.com/questions/40195766/lowercase-all-letters-in-a-string-except-the-first-letter-and-capitalize-first-l
function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Helfer-Funktion
function lowerCaseAllWordsExceptFirstLetters(string) {
    return string.replace(/\w\S*/g, function (word) {
        return word.charAt(0) + word.slice(1).toLowerCase();
    });
}

//Helfer-Funktion zum Laden von JSON-Dateien
//https://stackoverflow.com/questions/30274411/retrieving-json-data-read-with-ajax-and-callback-function
function getJson(path, callback) {
    var httpRequest = new XMLHttpRequest();
  
    httpRequest.overrideMimeType('application/json');
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          if (callback) callback(JSON.parse(httpRequest.responseText));
        }
      }
    };
  
    httpRequest.open('GET', path);
    httpRequest.send();
  }

  