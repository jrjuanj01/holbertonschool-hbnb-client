function fetchPlaceId() {
    const query = window.location.search;
    const param = new URLSearchParams(query);
    const placeId = param.get('id');
    return placeId;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return null;
}
/* Place JavaScript file */

document.addEventListener('DOMContentLoaded', () => {
    const login_button = document.getElementById("login-button");
    const add_review_section = document.getElementById("add-review");
    const authToken = getCookie('token');
    const placeId = fetchPlaceId();
    console.log(placeId);

    if (authToken) {
        login_button.style.display = "none";
        add_review_section.style.display = "block";
    } else {
        login_button.style.display = "block";
        add_review_section.style.display = "none";
    };

    fetchPlace(authToken);

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
            console.error('Error:', error);
        };
    }

    function displayPlace(place) {
        const placeDetails = document.getElementById('place-info');
        const placeElement = document.createElement('div');
        const placeAmenities = place.amenities.join(", ");
        placeElement.innerHTML = `
        <h1>${place.id}</h1>
            <br>
            <img src='images/${place.id}.webp' class="place-image-large">
            <div class="place-info">
                <p><b>Host:</b> ${place.host_name}</p>
                <p><b>Price per night:</b> $${place.price_per_night}</p>
                <p><b>Location:</b> ${place.city_name}, ${place.country_name}</p>
                <p><b>Description:</b> ${place.description}</p>
                <p><b>Amenities:</b> ${placeAmenities}</p>
            </div>
        `;
        placeDetails.appendChild(placeElement);
        const placeReviews = document.getElementById('reviews');
        const reviews = place.reviews;
        reviews.forEach((review) => {
            const reviewCard = document.createElement("div");
            reviewCard.innerHTML = `
            <div class = 'review-card'>
                <p><b>${review.user_name}</b></p>
                <p><b>Rating:</b> ${getStarRating(review.rating)}</p>
                <p>${review.comment}</p>
            </div>
            `;
            placeReviews.appendChild(reviewCard);
        });
    }
    function getStarRating(rating) {
        const fullStar = '★';
        const emptyStar = '☆';
        const starCount = 5;
        let stars = '';

        for (let i = 0; i < starCount; i++) {
            if (i < rating) {
                stars += fullStar;
            } else {
                stars += emptyStar;
            }
        }
        return stars;
    }

    // The Add-Review section //

    // Form fetcher for the review //
    const reviewForm = document.querySelector(".add-review-form");

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // PREVENT DEFAULT FORM SUBMISSION

            const review = document.getElementById('review-text').value;
            const rating = document.getElementById('rating').value;
            submitReview(authToken, placeId, rating, review);
        });
    }

    // Review submission function //
    async function submitReview(token, placeId, rating, reviewText) {
        console.log('Submitting review with token:', token);
        console.log('Place ID:', placeId);
        console.log('Rating:', rating);
        console.log('Review text:', reviewText);
        try {
            const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating: rating, review: reviewText })
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(`Failed to submit review: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error fetching places:', error);
            alert('An error occurred while submitting the review. Please try again.');
        }
    }
});
