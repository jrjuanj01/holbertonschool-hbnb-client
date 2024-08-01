/* Homepage JavaScript file */

document.addEventListener('DOMContentLoaded', () => {
  const countryFilter = document.getElementById('country-filter');
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
        populateCountryFilter(places);
        displayPlaces(places);
        countryFilter.addEventListener('change', () => {
          const country = countryFilter.value;
          const filtered = filterPlaces(places, country);
          displayPlaces(filtered);
        });
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
        `<div class='place-card'>
            <img class='place.image', src="place.image", alt='Place Image'>
            <h2>${place.id}</h2>
            <p><strong>Host:</strong> ${place.host_name}</p>
            <p><strong>Price per Night:</strong> ${place.price_per_night}</p>
            <p><strong>Location:</strong> ${place.city_name}, ${place.country_code}</p>
            <button class="datails-button" onclick="location.href='place.html?id=${place.id}'">View Details</button>
         </div>`;
      placesList.appendChild(placeElement);
    });
  }

  function populateCountryFilter(places) {
    const countries = [... new Set(places.map(place => place.country_name))];

    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countryFilter.appendChild(option);
    });
  }

  document.getElementById('country-filter').addEventListener('change', (event) => {
    const selectedCountry = event.target.value;
    const places = document.querySelectorAll('.place');

    places.forEach(place => {
      if (selectedCountry === 'all' || place.dataset.country === selectedCountry) {
        place.style.display = 'block';
      } else {
        place.style.display = 'none';
      }
    });
  });

  function filterPlaces(places, country) {
    if (countryFilter.value == "all") {return places};
    return places.filter(place => place.country_name === country);
  }
});
