/* Place JavaScript file */

document.addEventListener('DOMContentLoaded', () => {
    const login_button = document.getElementById("login-button");
    const authToken = document.cookie.includes("token=");
    const placeId = fetchPlaceId();
    console.log(placeId);

    if (authToken) {
        login_button.style.display = "none";
        fetchPlace(authToken);
    } else {
        login_button.style.display = "block";
    };

    function fetchPlaceId() {
        const query = window.location.search;
        const param = new URLSearchParams(query);
        return param.get('id');
    }

    async function fetchPlace(token) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const place = await response.json();
                displayPlace(place);
            } else {
                console.error('Failed to load place:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error)
        };
    };

    function displayPlace(place) {
        const placeDetails = document.getElementById('place-details')
        const placeElement = document.createElement('div');
        placeElement.innerHTML = `
        <h1>${place.id}</h1>
            <div class="container">
                <img src='' alt="Image" class="place-image-large">
            </div>
            <div class="place-info">
                <p><b>Host:</b> ${place.host_name}</p>
                <p><b>Price pre night:</b> $${place.price_per_night}</p>
                <p><b>Location:</b> ${place.city_name},<${place.country_name},${place.county_code}</p>
                <p><b>Description:</b> ${place.description}</p>
                <p><b>Amenities:</b> ${place.amenities}</p>
            </div>
        `;
        placeDetails.appendChild(placeElement);
    };
});
