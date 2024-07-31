/* This script is in responsible for login without browser refresh
   Note: this only works in a server  */
document.addEventListener('DOMContentLoaded', () => {
   const loginForm = document.getElementById('login-form');
   if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
         event.preventDefault();

         const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;

         try {
            const response = await fetch('http://127.0.0.1:5000/login', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ email, password })
            })
            if (response.ok) {
               const data = await response.json();
               document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
               window.location.href = 'index.html';
            } else {
               // Display an error message
               document.getElementById('errorMessage').textContent = 'Login failed: ' + (response.statusText || 'Unknown error');
            };

         } catch (error) {
            console.error('Error:', error);
            document.getElementById('errorMessage').textContent = 'Login failed: Network error';
         }
      });
   }
});
