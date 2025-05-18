const urlParams = new URLSearchParams(window.location.search);
const route = urlParams.get('route');

let message = '';
if (route === 'addProduct') {
    message = "You need to be an admin to add products. Please log in as an admin.";
} else {
    window.location.href = "/";
}

document.getElementById('message').innerText = message;
