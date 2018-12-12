var map = L.map('mapid', 
    {minZoom: 1,
    maxZoom: 9}).setView([50.6256442,7.7083538], 6);


L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
            var geojsonLayer = L.geoJSON(datenjahre["1998"], {
                onEachFeature: function (feature, layer) {
                var props="<h3>"+feature.properties.Ort+"</h3>";
                layer.bindPopup(props);
                }
            });
            datenLayer.addLayer(geojsonLayer);
                output.innerHTML = "1998";
                break;
            case this.value === "2":
                var geojsonLayer = L.geoJSON(datenjahre["2008"], {
                    onEachFeature: function (feature, layer) {
                    var props="<h3>"+feature.properties.Ort+"</h3>";
                    layer.bindPopup(props);
                    }
                });
                datenLayer.addLayer(geojsonLayer);
                
                output.innerHTML = "2008";
                break;
                case this.value === "3":
                var geojsonLayer = L.geoJSON(datenjahre["2018"], {
                onEachFeature: function (feature, layer) {
                var props="<h3>"+feature.properties.Ort+"</h3>";
                layer.bindPopup(props);
                }
                });
                datenLayer.addLayer(geojsonLayer);
                output.innerHTML = "2018";
                break;
        } 
      } 
});


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
            maxClusterRadius: 2
    });

    var layer = L.geoJSON(datenjahr, {
        onEachFeature: function (feature, layer) {
        var props="<h3>"+feature.properties.Ort+"</h3>";
          layer.bindPopup(props);
        }
    });
    markers.addLayer(layer);
    map.addLayer(markers);
    return markers;
};



/*spiderfyShapePositions: function(count, centerPt) {
    var distanceFromCenter = 35,
        markerDistance = 45,
        lineLength = markerDistance * (count - 1),
        lineStart = centerPt.y - lineLength / 2,
        res = [],
        i;

    res.length = count;

    for (i = count - 1; i >= 0; i--) {
        res[i] = new Point(centerPt.x + distanceFromCenter, lineStart + markerDistance * i);
    }

    return res;
}*/


function getPopup (layer){
  
    var html="";
    html="<h3>"+props+"</h3>";
    return html;
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

  