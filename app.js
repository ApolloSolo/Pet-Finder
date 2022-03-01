const apiKey = "TTEBA50tsWr7Y8WUwa1zWLN6wVqPx15I3mwNvgJ3P5xoAd95dT";
const secret = "tnhGSJWW8DI2rD4ANKB6LF3sVJWbi2U1HlaFRZLB";
let accessToken;

const myLocation = document.querySelector("#my-location");
const zipForm = document.querySelector("#zip-form");

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
  console.log(accessToken);
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
              console.log(data);
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