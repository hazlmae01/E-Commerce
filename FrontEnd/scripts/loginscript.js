// JavaScript for login page validation and interaction
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.querySelector("button[type='button']");

    loginButton.addEventListener("click", (event) => {
        event.preventDefault(); // Stop any default link behavior
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === "" || password === "") {
            alert("Please fill in both username and password.");
            return;
        }

        if (validateLogin(username, password)) {
            window.location.href = "Tesla.html";
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });

    function validateLogin(username, password) {
        // Example credentials (replace with real authentication in production)
        const demoUsername = "admin";
        const demoPassword = "password123";

        return username === demoUsername && password === demoPassword;
    }
});
