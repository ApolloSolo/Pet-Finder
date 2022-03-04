const apiKey = "TTEBA50tsWr7Y8WUwa1zWLN6wVqPx15I3mwNvgJ3P5xoAd95dT";
const secret = "tnhGSJWW8DI2rD4ANKB6LF3sVJWbi2U1HlaFRZLB";
let accessToken;

const myLocation = document.querySelector("#my-location");
const zipForm = document.querySelector("#zip-form");

const cities = []
let cityGeoJSON = [];

const fetchAccessToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", apiKey);
  params.append("client_secret", secret);
  const petfinderRes = await fetch(
    "https://api.petfinder.com/v2/oauth2/token",
    {
      method: "POST",
      body: params,
    }
  );
  const data = await petfinderRes.json();
  accessToken = data.access_token
};

if(!accessToken){
  fetchAccessToken();
}

const fetchPets = (location) => { 
    fetch(`https://api.petfinder.com/v2/animals?location=${location}`, {
      headers: {
          Authorization: `Bearer ${accessToken}`
      }
  }).then((res) => {
      if(res){
          res.json().then((data) => {
              for(let i = 0; i < data.animals.length; i++){
                let city = data.animals[i].contact.address.city;
                cities.push(city);
              }
              
              toGeoJSON();
              
          })
      }
  })
}

// Find user location and query API
function getLocation() {
  letsAnimate = false;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const lat = position.coords.latitude.toString();
  const long = position.coords.longitude.toString();
  // Runs query to API when "Near Me" is clicked
  fetchPets(lat+","+long);
}

function handleError(err) {
  console.warn(`Error(${err.code}): ${err.message}`);
}

const myLocationHandler = function(){
  getLocation();
  //fetchPets(...myLocation);
}

const zipFormHandler = function(e){
  e.preventDefault();
  const zipCode = document.querySelector("#zip").value;
  fetchPets(zipCode);

}

myLocation.addEventListener('click', myLocationHandler);

zipForm.addEventListener('submit', zipFormHandler);

/******** MAP **********/

async function cityToGeoData(city) {
    const respons = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city},US&appid=c20b708b2952fc5492619c70affe0677`
    );
    if (respons) {
      const lat = respons.data[0].lat;
      const lon = respons.data[0].lon;
      const geoData = [lon, lat];
      return geoData;
    } else {
      alert("Error with geo location");
    }
  };

async function toGeoJSON() {
    for(let i = 0; i < cities.length; i++){
        let data = await cityToGeoData(cities[i]);
        
        cityGeoJSON.push(data);
        //console.log(data);

        if(i === cities.length - 1){
          buildMap();
        }
    }
    //console.log(cityGeoJSON);
}

function buildMap(){
  mapboxgl.accessToken = 'pk.eyJ1IjoiYXBwc29sbyIsImEiOiJjbDA5dmptYWowaGcwM2lwOTY0dGxlOWp3In0.kulAfdlLVedrwX0Yh0qruQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-80.9, 35.2], // starting position [lng, lat]
    zoom: 6 // starting zoom
});

// Create a default Marker and add it to the map.

  for(let i = 0; i < cityGeoJSON.length; i++){
    let marker1 = new mapboxgl.Marker({ color: 'rgb(20, 200, 225)' })
    .setLngLat(cityGeoJSON[i])
    .addTo(map);
  }
}