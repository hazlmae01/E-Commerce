document.getElementById('addressForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    console.log("Submitted Address:", data);
    alert("Address submitted successfully!");
  });

  function cancelForm() {
  if (confirm("Are you sure you want to cancel?")) {
    document.getElementById('addressForm').reset();
    document.querySelectorAll('.label-btn').forEach(btn => btn.classList.remove('active'));
    window.location.href = 'order.html';
  }
}


  const labelButtons = document.querySelectorAll('.label-btn');
  const labelInput = document.getElementById('labelInput');

  labelButtons.forEach(button => {
    button.addEventListener('click', () => {
      labelButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      labelInput.value = button.dataset.value;
    });
  });