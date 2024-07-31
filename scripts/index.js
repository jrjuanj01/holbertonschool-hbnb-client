/* Homepage JavaScript file */

document.addEventListener('DOMContentLoaded', () => {
  const login_button = document.getElementById("login-button");
  const authToken = document.cookie.includes("token=");

  if (authToken) {
    login_button.style.display = "none";
    fetchPlaces(authToken);
  } else {
    login_button.style.display = "block";
  };

  async function fetchPlaces(token) {
    try {
      const response = await fetch('http://127.0.0.1:5000/places', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const places = await response.json();
        displayPlaces(places);
        // populateCountryFilter(places);
      } else {
        console.error('Failed to load places:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
      const placeElement = document.createElement('div');
      placeElement.classList.add('place');
      placeElement.dataset.country = place.country;
      placeElement.innerHTML =
        `<h2>${place.name}</h2>
         <p>${place.description}</p>
         <p><strong>Location:</strong> ${place.location}</p>`;
      placesList.appendChild(placeElement);
    });
  }
});
