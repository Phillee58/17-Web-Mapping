// Create API endpoints
var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log (API_quakes)
var API_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log (API_plates)

function markerSize(magnitude) {
    return magnitude * 5;
};

// Create the Earthquakes layer
var earthquakes = new L.LayerGroup();

// Loop and create circles
d3.json(API_quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.4,
                color: 'grey'
            }
        },
        // Create the popup
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

// Create the Tectonic layer
var plates = new L.LayerGroup();

// Loop and create lines
d3.json(API_plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'firebrick'
            }
        },
    }).addTo(plates);
})

// Add colors to reflect the degree of earthquake maginitude
function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'tomato'
    } else if (magnitude > 3) {
        return 'Yellow'
    } else if (magnitude > 2) {
        return 'GoldenRod'
    } else if (magnitude > 1) {
        return 'darkseagreen'
    } else {
        return 'green'
    }
};

// Create the layer map view options
function createMap() {
    // High Contrast Option
    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: API_KEY
    });
    // Street Option
    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });
    // Dark Option
    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });
    // Satellite Option
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    // Call the layer options
    var baseLayers = {
        "High Contrast": highContrastMap,
        "Street": streetMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": plates,
    };

    // Call the initial backgroup map and load default layers
    var mymap = L.map('mymap', {
        center: [40, -100],
        zoom: 5,
        layers: [streetMap, earthquakes, plates]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);

    // Create the legend in the bottom right
    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function (mapLegend) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h4 style='margin:5px'>Magnitude</h4>"
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1)+ '"></i> ' 
                + magnitude[i] + (magnitude[i + 1] ? '&ndash;' 
                + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
}





























// // Create the legend in the lower right

// var legend = L.control({ position: "bottomright" });
// legend.onAdd = function(mapLegend) {
//   var div = L.DomUtil.create("div", "info legend");
    
//   var limits = geojson.options.limits;
//   var colors = geojson.options.colors;
//   var labels = [];

//   div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"
//     "<div class=\"labels\">" +
//       "<div class=\"min\">" + limits[0] + "</div>" +
//       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";

//   div.innerHTML = legendInfo;

//   limits.forEach(function(limit, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   });
//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// };

// // Adding legend to the map
//     legend.addTo(myMap);
// }