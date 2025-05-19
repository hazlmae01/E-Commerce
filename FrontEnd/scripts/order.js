document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.getElementById("product-check");
  const quantitySelect = document.getElementById("quantity-select");
  const totalPriceEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  const productName = document.querySelector(".details h2").innerText;
  const unitPrice = parseInt(document.querySelector(".unit-price").dataset.price);

  function updateTotal() {
    const quantity = parseInt(quantitySelect.value);
    const isChecked = checkbox.checked;

    if (isChecked) {
      const total = unitPrice * quantity;
      totalPriceEl.textContent = `₱${total.toLocaleString()}`;
      checkoutBtn.disabled = false;
    } else {
      totalPriceEl.textContent = "₱0";
      checkoutBtn.disabled = true;
    }
  }

  checkbox.addEventListener("change", updateTotal);
  quantitySelect.addEventListener("change", updateTotal);

  checkoutBtn.addEventListener("click", function () {
    if (!checkbox.checked) return;

    const quantity = parseInt(quantitySelect.value);
    const total = unitPrice * quantity;

    const orderDetails = {
      name: productName,
      price: unitPrice,
      quantity: quantity,
      total: total
    };

    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    window.location.href = "checkoutform.html";
  });

  updateTotal();
});
