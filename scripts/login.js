/* This script is in responsible for login without browser refresh
   Note: this ponly works in a server  */
document.getElementById('login-form').addEventListener('submit', function (event) {
   event.preventDefault();

   const username = document.getElementById('username').value;
   const password = document.getElementById('password').value;

   fetch('http://127.0.0.1:5500/login.html', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
   })
      .then(response => response.json())
      .then(data => {
         if (data.token) {
            // Store the JWT token in a cookie
            document.cookie = `token=${data.token}; path=/`;

            // Redirect to the main page
            window.location.href = '/index';
         } else {
            // Display an error message
            document.getElementById('errorMessage').textContent = 'Login failed: ' + (data.message || 'Unknown error');
         }
      })
      .catch(error => {
         console.error('Error:', error);
         document.getElementById('errorMessage').textContent = 'Login failed: Network error';
      });
});
