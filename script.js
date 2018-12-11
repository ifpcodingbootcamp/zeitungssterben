var map = L.map('mapid').setView([50.6256442,7.7083538], 6);

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

getJson('./data/20181.geojson', function (datenjahr2018) {
    drawIcons (datenjahr2018);  
});


function drawStaatsgrenzen(staatsgrenzen) {
    var myStyle = {
        "color":"hotpink",
        "weight": 3,
        "opacity": 0.5
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

function drawIcons(datenjahr2018) {
    L.geoJson(datenjahr2018).addTo(map)
};


/*L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);*/


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

  