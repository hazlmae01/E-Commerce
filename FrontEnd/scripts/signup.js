const form = document.querySelector('form');
const error = document.getElementById('error');
const success = document.getElementById('success');

const roleMap = {
  user: 2,
  admin: 1,
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const roleName = document.getElementById('role').value.trim();

  if (!username || !email || !password || !roleName) {
    alert('Please fill in all fields.');
    return;
  }

  const role_id = roleMap[roleName];
  if (!role_id) {
    alert('Invalid role selected.');
    return;
  }

  const registerData = {
    username,
    email,
    password,
    role_id, 
  };

  fetch("/api/signup", {
    method: "POST",
    body: JSON.stringify(registerData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "error") {
        success.style.display = "none";
        error.style.display = "block";
        error.innerText = data.error;
      } else {
        error.style.display = "none";
        success.style.display = "block";
        success.innerText = data.success;

        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    })
    .catch((err) => {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    });
});
