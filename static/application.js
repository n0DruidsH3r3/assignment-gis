var mapLayerGroup = L.layerGroup();
var markers = [];
var friesIcon = L.icon({
    iconUrl: "https://img.icons8.com/color/50/000000/mcdonalds-french-fries.png",
    iconSize: [30, 30]
});

var mcIcon = L.icon({
    iconUrl: "https://cdn.worldvectorlogo.com/logos/mcdonald-s-15.svg",
    iconSize: [30, 30]
});



function ClearMarkers() {
    for (var j = 0; j < markers.length; j++) {
        markers[j].remove();
    } 
}

function HoustonMcDonalds() {
    var request = new XMLHttpRequest();
    
    var mapLegend = document.getElementById("state-coloring-legend");
    var s = document.getElementById("state-selector");
    var params = "?state=" + s.value;
    mapLegend.style.opacity = 0;
    
    request.open('GET', '/houstonparts' + params, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var geoJSON = JSON.parse(request.response);
            var district = true;
            ClearMarkers();
            mapLayerGroup.clearLayers();
            for (var geojson of geoJSON) {
                if (district) {
                    var newMapLayer = L.mapbox.featureLayer(geojson);
                    mapLayerGroup.addLayer(newMapLayer);
                    mapLayerGroup.addTo(map);
                    district = !district;
                    continue;
                }
                var el = document.createElement('div');
                el.className = 'marker';
                coords = [geojson["geometry"]["coordinates"][1], geojson["geometry"]["coordinates"][0]];
                var marker = L.marker(coords, {icon: friesIcon})
                    .addTo(map);
                markers.push(marker);
            }
        } else {
            console.log(request.status);
        }
    };
    request.onerror = function(err) {
        alert(err);
    };
    
    request.send();
}

function StatisticsPerState() {
    var request = new XMLHttpRequest();
    request.open('GET', '/statisticsperstate', true);
    var mapLegend = document.getElementById("state-coloring-legend");
    mapLegend.style.opacity = 0;

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var geoJSON = JSON.parse(request.response);
            geoJSON['type'] = 'FeatureCollection';
            var newMapLayer = L.mapbox.featureLayer(geoJSON);
            ClearMarkers();
            mapLayerGroup.clearLayers();
            for (var geojson of geoJSON) {
                var el = document.createElement('div');
                el.className = 'marker';
                if (!geojson["geometry"]) {
                    continue;
                }
                var statisticsString =  geojson["properties"]["description"];
                var numberOfMcDonalds = "";
                var obesity = "";
                var foundDelimeter = false;
                for (var k = 0, n = statisticsString.length; k < n; k++) {
                    if (statisticsString[k] === "#") {
                        foundDelimeter = true;
                        continue;
                    }

                    if (foundDelimeter) {
                        obesity += statisticsString[k];
                    } else {
                        numberOfMcDonalds += statisticsString[k];
                    }
                }
                var popupContent = "<h3>" + geojson["properties"]["title"] +"</h3>";
                popupContent += "<div>Number of McDonalds: " + numberOfMcDonalds + "</div>";
                popupContent += "<div> Obesity: " + obesity + "%</div>";
                coords = [geojson["geometry"]["coordinates"][1], geojson["geometry"]["coordinates"][0]];
                var marker = L.marker(coords, {icon: friesIcon})
                    .bindPopup(popupContent)
                    .openPopup()
                    .addTo(map);
                markers.push(marker);
            }
        } else {
            console.log(request.status);
        }
    };
    request.onerror = function(err) {
        alert(err);
    };
    
    request.send();
}

function ObesityColoring() {
    var request = new XMLHttpRequest();
    request.open('GET', '/obesitycoloring', true);
    var mapLegend = document.getElementById("state-coloring-legend");
    mapLegend.style.opacity = 1;

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var geJSON = JSON.parse(request.response);
            geJSON['type'] = 'FeatureCollection';
            var newMapLayer = L.mapbox.featureLayer(geJSON);
            ClearMarkers();
            mapLayerGroup.clearLayers();
            mapLayerGroup.addLayer(newMapLayer);
            mapLayerGroup.addTo(map);
        } else {
            console.log(request.status);
        }
    };
    request.onerror = function(err) {
        alert(err);
    };
    
    request.send();
}