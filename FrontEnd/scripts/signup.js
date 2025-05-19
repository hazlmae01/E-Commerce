

document.getElementById('signupBtn').addEventListener("click", () => {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!username || !email || !password){
        alert('Please fill in all fields.');
        return;
    }

    localStorage.setItem('signupUsername', username);
    localStorage.setItem('signupEmail', email);
    localStorage.setItem('signupPassword', password);

    alert('Signup sucessful! Now go to the login page');
    window.location.href = '/FrontEnd/views/LoginPage.html';
});

form.addEventListener("submit", () => {
    const register = {
        email: email.value,
        username: username.value,
        password: password.value,
        role : role.value
    }
    fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(register),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json())
        .then(data =>{
            if(data.status == "error") {
                success.style.display = "none"
                error.style.display = "block"
                error.innerText = data.error
            }else{
                error.style.display = "none"
                success.style.display = "block"
                success.innerText = data.success
            }
        })
})
