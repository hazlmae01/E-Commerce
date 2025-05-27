document.getElementById('checkout-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const fullName = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const cardNumber = document.getElementById('cardnumber').value.trim();
  const expDate = document.getElementById('expdate').value;
  const cvv = document.getElementById('cvv').value.trim();
  const message = document.getElementById('message');

  message.textContent = "";
  message.style.color = "red";

  if (!fullName || !email || !address || !cardNumber || !expDate || !cvv) {
    message.textContent = "All fields are required.";
    return;
  }

  if (!validateEmail(email)) {
    message.textContent = "Invalid email address.";
    return;
  }

  if (!/^\d{16}$/.test(cardNumber)) {
    message.textContent = "Card number must be 16 digits.";
    return;
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    message.textContent = "CVV must be 3 or 4 digits.";
    return;
  }

  if (!validateFutureDate(expDate)) {
    message.textContent = "Expiry date must be in the future.";
    return;
  }

  message.style.color = "green";
  message.textContent = "Processing your order...";

  setTimeout(() => {
    message.textContent = "✅ Order placed successfully!";
    this.reset();
  }, 1500);
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateFutureDate(inputDate) {
  const [year, month] = inputDate.split('-').map(Number);
  const today = new Date();
  const selectedDate = new Date(year, month - 1);

  return selectedDate >= new Date(today.getFullYear(), today.getMonth());
}
