document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();

    fetch("/api/logout", {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            alert(data.success);
            window.location.href = "/";
        } else {
            alert("Logout failed.");
        }
    })
    .catch(err => {
        console.error("Logout error:", err);
        alert("Something went wrong.");
    });
});
