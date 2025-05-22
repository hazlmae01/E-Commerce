document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const error = document.getElementById("error");    // Make sure you have this element in your HTML
    const success = document.getElementById("success"); // Make sure you have this element in your HTML

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const loginData = {
            username,
            password
        };

        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerText = data.error;
            } else {
                error.style.display = "none";
                success.style.display = "block";
                success.innerText = data.success;

                if (data.role === "admin") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/homePage";
                }
            }
        });
    });
});
