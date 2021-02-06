"use strict";
var gPlaces = [];
var gMap
var gOptions = {
  center: { lat: 29.5577, lng: 34.9519 },
  zoom: 13,
};
const KEY_PLACES = "users places";

function initMap() {
  gMap = new google.maps.Map(document.getElementById("map"), gOptions);
  const marker = new google.maps.Marker({
    position: gOptions.center,
    map: gMap,
  });

  getCurrentPositionTable(gOptions);

  //Get current location
  var infoWindow = new google.maps.InfoWindow();
  const locationButton = document.querySelector(".place-keeper");
  // locationButton.classList.add("custom-map-control-button");
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          gOptions.center.lat = pos.lat;
          gOptions.center.lng = pos.lng;
          getCurrentPositionTable(gOptions);
          // infoWindow.setPosition(pos);
          // infoWindow.setContent("Location found.");
          // infoWindow.open(gMap);
          const marker = new google.maps.Marker({
            position: gOptions.center,
            map: gMap,
          })
          gMap.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, gMap.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, gMap.getCenter());
    }
  });


  // Configure the click listener.
  gMap.addListener("click", (mapsMouseEvent) => {
    var locationString = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });

    locationString.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    var locationName = prompt("What's the name of this place?");
    var position = JSON.parse(locationString.content);
    var location = {
      id: makeId(),
      name: locationName,
      lng: position.lng,
      lat: position.lat,
    };
    console.log(location);
    gPlaces = loadFromStorage(KEY_PLACES);
    if (!gPlaces) {
      gPlaces = [];
      gPlaces.push(location);
    } else {
      gPlaces.push(location);
    }
    saveToStorage(KEY_PLACES, gPlaces);
    renderLocationTable(gPlaces);
  });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(gMap);
}

function getCurrentPositionTable(options) {
  document.getElementById("latitude").innerHTML = options.center.lat;
  document.getElementById("longitude").innerHTML = options.center.lng;
  document.getElementById("accuracy").innerHTML = "Not Set";
  var positionTimeStamp = Date.now();
  var date = new Date(positionTimeStamp);
  document.getElementById("timestamp").innerHTML =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

function renderLocationTable(places) {
  places = loadFromStorage(KEY_PLACES);
  console.log('hiiiii');
  var strHtml = `<tr><th>Places Name</th><th>Lang</th><th>Lat</th><th>Action</th></tr>`;
  places.forEach(function (place) {
    strHtml += `<tr><td class="place-name" onclick="panToLocation('${place.id}')">${place.name}</td><td>${place.lng}</td><td>${place.lat}</td><td class="delete" onclick="deletePlace('${place.name}')">Delete</td></tr>`;
  });
  var elTable = document.querySelector(".marked-places");
  elTable.innerHTML = strHtml;
}

function panToLocation (id) {
  gPlaces = loadFromStorage(KEY_PLACES);
  var placeObj = gPlaces.find(function (place) {
    return place.id === id;
  });
  gOptions.center.lat = placeObj.lat
  gOptions.center.lng = placeObj.lng
  gMap = new google.maps.Map(document.getElementById("map"), gOptions);
  const marker = new google.maps.Marker({
    position: gOptions.center,
    map: gMap,
  });
}

function deletePlace(nameOfPlace) {
  gPlaces = loadFromStorage(KEY_PLACES);
  var idx = gPlaces.findIndex(function (place) {
    return place.name === nameOfPlace;
  });
  gPlaces.splice(idx, 1);
  saveToStorage(KEY_PLACES, gPlaces);
  renderLocationTable(gPlaces)
}

function makeId(length = 3) {
  var txt = "";
  var possible =
    "0123456789";

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}