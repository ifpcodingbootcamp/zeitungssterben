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
    console.log(datenjahre);
    var datenLayer = drawIcons (datenjahre["2018"]); 
    
    var slider = document.getElementById("myRange");
    slider.oninput = function() {
        datenLayer.clearLayers ();
        console.log(this.value);
        var currentYear; 
        switch (true) {
            case this.value === "1":
            datenLayer.addData(datenjahre["1998"]);
                break;
            case this.value === "2":
            datenLayer.addData(datenjahre["2008"]);
                break;
            case this.value === "3":
            datenLayer.addData(datenjahre["2018"]);
                break;
        } 
        console.log(currentYear);
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
  var layer = L.geoJSON(datenjahr, {
        onEachFeature: function (feature, layer) {
        var props="<h3>"+feature.properties.Ort+"</h3>";
          layer.bindPopup(props);
        }
    });
    layer.addTo(map);
    return layer;
};

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

  