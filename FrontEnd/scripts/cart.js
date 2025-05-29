document.addEventListener("DOMContentLoaded", () => {
  loadCartItems();
});

function loadCartItems() {
  fetch("/api/cart")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    })
    .then(data => {
      const container = document.getElementById("cart-items-container");
      const subtotalEl = document.getElementById("cart-subtotal");
      const headerEl = document.getElementById("cart-header");

      const cartItems = data.cartItems || [];
      headerEl.textContent = `ALL ITEMS (${cartItems.length})`;

      if (cartItems.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        subtotalEl.textContent = "₱0";
        return;
      }

      container.innerHTML = "";

      cartItems.forEach(item => {
        const itemHTML = `
          <div class="cart-item" data-id="${item.cartItem_id}" data-price="${item.price}" data-qty="${item.quantity}">
            <div class="left d-flex align-items-center">
              <input type="checkbox" class="form-check-input me-2 cart-checkbox" />
              <img src="${item.image_url || '/FrontEnd/assets/placeholder.png'}" alt="Product" style="width: 80px; height: 80px; object-fit: cover;" />
              <div class="cart-item-details ms-3">
                <div class="cart-item-title fw-bold">${item.name}</div>
                <div class="cart-item-price">₱${item.price}</div>
              </div>
            </div>
            <div class="cart-item-controls">
              <button class="qty-btn minus">−</button>
              <span class="item-qty">${item.quantity}</span>
              <button class="qty-btn plus">+</button>
              <button class="delete-btn btn btn-danger btn-sm ms-2">Delete</button>
            </div>
          </div>
        `;
            
        container.innerHTML += itemHTML;
      });

      attachCartEvents();  // Also attaches checkbox listeners
      updateSubtotal();    // Start with subtotal of checked items (initially none)
    })
    .catch(err => {
      console.error("Error fetching cart data:", err);
    });
}

function attachCartEvents() {
  // Delete cart item
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.closest(".cart-item").dataset.id;
      fetch(`/api/cart/${itemId}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(() => loadCartItems());
    });
  });

  // Update quantity
  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemEl = btn.closest(".cart-item");
      const cartItemId = itemEl.dataset.id;
      const qtyEl = itemEl.querySelector(".item-qty");
      let quantity = parseInt(qtyEl.textContent);

      if (btn.classList.contains("minus") && quantity > 1) {
        quantity -= 1;
      } else if (btn.classList.contains("plus")) {
        quantity += 1;
      } else {
        return;
      }

      fetch(`/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      })
        .then(res => res.json())
        .then(() => loadCartItems())
        .catch(err => console.error("Update quantity error:", err));
    });
  });

  // Checkbox listener for subtotal calculation
  document.querySelectorAll(".cart-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", updateSubtotal);
  });
}

function updateSubtotal() {
  const checkboxes = document.querySelectorAll(".cart-checkbox");
  let subtotal = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const item = checkbox.closest(".cart-item");
      const price = parseFloat(item.dataset.price);
      const quantity = parseInt(item.dataset.qty);
      subtotal += price * quantity;
    }
  });

  document.getElementById("cart-subtotal").textContent = `₱${subtotal.toFixed(2)}`;
}
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const selectedIds = [];

  document.querySelectorAll(".cart-checkbox:checked").forEach(checkbox => {
    const itemEl = checkbox.closest(".cart-item");
    selectedIds.push(itemEl.dataset.id);
  });

  if (selectedIds.length === 0) {
    alert("Please select at least one item to checkout.");
    return;
  }

  // Redirect with selected items in URL
  const params = new URLSearchParams();
  params.set("items", selectedIds.join(","));
  window.location.href = `/checkout?${params.toString()}`;
});


