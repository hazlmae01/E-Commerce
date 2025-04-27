

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