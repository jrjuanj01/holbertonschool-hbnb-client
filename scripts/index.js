/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

document.addEventListener('DOMContentLoaded', () => {
  const login_button = document.getElementById("login-button");
  const authToken = document.cookie.includes("token=");

  if (authToken) {
    login_button.style.display = "none";
  } else {
    login_button.style.display = "block";
  } 
});
