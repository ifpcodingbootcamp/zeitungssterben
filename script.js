var map = L.map('mapid', 
    {minZoom: 6,
    maxZoom: 9}).setView([50.6256442,7.7083538], 6);


L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: ' &copy; ifp-Coding-Bootcamp 2018 | Map-Tiles von <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Kartendaten &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
}).addTo(map);

map.fitBounds([
    [47.3024876979, 5.98865807458],
    [54.983104153, 15.0169958839]
]);

getJson('./Deutschland.geojson', function (staatsgrenzen) {
    hideRest (staatsgrenzen);
    drawStaatsgrenzen (staatsgrenzen);
});

getJson('./data/data.json', function (datenjahre) {
    var datenLayer = drawIcons (datenjahre["2018"]); 
    
    var slider = document.getElementById("myRange");
    var output = document.getElementById("labeldisplay");
    slider.oninput = function() {
        datenLayer.clearLayers ();
        var currentYear; 
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
      } 

    
    function updateMap(year){
        var geojsonLayer = getGeojsonLayer(datenjahre[year]);
        datenLayer.addLayer(geojsonLayer);
        output.innerHTML = year;
    }
});

function getGeojsonLayer(currentDatenjahr){
    var geojsonLayer = L.geoJSON(currentDatenjahr, {
        pointToLayer: function (feature, latlng) {
            var icon = new L.DivIcon({html: '<div class="icon"></div>', className: "our-icon-default", iconSize: new L.Point(5, 5)});
            return L.marker(latlng, {icon: icon});
        },        
        onEachFeature: function (feature, layer) {
            console.log(feature.properties);
            var props="<h3>"+feature.properties["Titel/Gesamtbelegung"]+"</h3>";
            props += "<span class='city'>"+upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(feature.properties.Ort))+"</span>";
            props += "<br><strong>Druckauflage:</strong> "+feature.properties["Druckauflage"];
            props += "<br><strong>Abonnements:</strong> "+feature.properties.Abonnements;
          layer.bindPopup(props);
        }
    });
    return geojsonLayer;
}


function drawStaatsgrenzen(staatsgrenzen) {
    var myStyle = {
        "color":"hotpink",
        "weight": 3,
        "opacity": 0.5,
    };
    L.geoJSON(staatsgrenzen, {style: myStyle}).addTo(map);
};
 
function hideRest(relevantBoundaries) {
    var secondStyle = {
        "color": "white",
        "fillOpacity": 0.9
    }
    L.geoJson(relevantBoundaries, {
        invert: true,
        style: secondStyle
    }).addTo(map);
};

function drawIcons(datenjahr) {
    var markers = L.markerClusterGroup({
            maxClusterRadius: 2,
            iconCreateFunction: function (cluster) {
                var childCount = cluster.getChildCount();
        
                var c = ' our-icon-';
                if (childCount < 3) {
                    c += 'small';
                } else if (childCount < 8) {
                    c += 'medium';
                } else {
                    c += 'large';
                }
        
                return new L.DivIcon({html: '<div class="icon">'+childCount + '</div>', className: c, iconSize: new L.Point(20, 20)});
            }
    });

    var layer = getGeojsonLayer(datenjahr);
    markers.addLayer(layer);
    map.addLayer(markers);
    return markers;
};

function getPopup (layer){
  
    var html="";
    html="<h3>"+props+"</h3>";
    return html;
}

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseAllWordsExceptFirstLetters(string) {
    return string.replace(/\w\S*/g, function (word) {
        return word.charAt(0) + word.slice(1).toLowerCase();
    });
}


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

  