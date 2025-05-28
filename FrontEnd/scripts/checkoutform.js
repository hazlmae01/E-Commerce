document.addEventListener("DOMContentLoaded", async () => {
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const addressSelect = document.getElementById("addressSelect");
  const newAddressSection = document.getElementById("newAddressSection");
  const addNewAddressBtn = document.getElementById("addNewAddressBtn");
  const cartContainer = document.getElementById("cartItemsContainer");
  const contact_number = document.getElementById("contactNumber");
  let selectedCartItems = [];

  async function loadUserProfile() {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      fullnameInput.value = data.name || "";
      emailInput.value = data.email || "";
      contact_number.value = data.contact_number || "";
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  }

  async function loadAddresses() {
    try {
      const res = await fetch("/api/user/addresses");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const addresses = await res.json();

      addressSelect.innerHTML = `<option value="">-- Select an address --</option>`;

      if (!addresses || addresses.length === 0) {
        newAddressSection.style.display = "block";
        addressSelect.style.display = "none";
      } else {
        addresses.forEach(addr => {
          const option = document.createElement("option");
          option.value = JSON.stringify(addr);
          option.textContent = `${addr.address_line1}, ${addr.city}, ${addr.state}`;
          addressSelect.appendChild(option);
        });
        newAddressSection.style.display = "none";
        addressSelect.style.display = "block";
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
  }

  async function loadCartItems() {
    try {
      const params = new URLSearchParams(window.location.search);
      const itemIdsParam = params.get("items");
      console.log("itemIds from URL:", itemIdsParam); // Add this
      if (!itemIdsParam) {
        cartContainer.innerHTML = "<p>No items selected for checkout.</p>";
        return;
      }

      const selectedIds = itemIdsParam.split(",").map(id => id.trim());
      const res = await fetch("/api/cart", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();

      const allItems = data.cartItems || data;

      selectedCartItems = allItems.filter(item =>
        selectedIds.includes(String(item.cartItem_id || item.id))
      );

      cartContainer.innerHTML = "";

      if (selectedCartItems.length === 0) {
        cartContainer.innerHTML = "<p>Selected items not found in cart.</p>";
        return;
      }

      selectedCartItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.dataset.id = item.cartItem_id || item.id;
        div.dataset.price = item.price;
        div.dataset.qty = item.quantity;

        div.innerHTML = `
          <div class="left d-flex align-items-center">
            <img src="${item.image_url || '/FrontEnd/assets/placeholder.png'}" alt="Product" style="width:80px; height:80px; object-fit:cover;" />
            <div class="cart-item-details ms-3">
              <div class="cart-item-title fw-bold">${item.name}</div>
              <div class="cart-item-price">₱${item.price}</div>
              <div class="cart-item-qty">Quantity: ${item.quantity}</div>
              <div class="cart-item-price">Subtotal: ₱${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </div>
        `;

        cartContainer.appendChild(div);
      });
    } catch (err) {
      console.error("Error loading cart items:", err);
      cartContainer.innerHTML = "<p>Failed to load cart items.</p>";
    }
  }

  addNewAddressBtn.addEventListener("click", () => {
    const isVisible = newAddressSection.style.display === "block";
    newAddressSection.style.display = isVisible ? "none" : "block";
    addressSelect.style.display = isVisible ? "block" : "none";
  });

  document.getElementById("checkout-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!fullnameInput.value.trim()) {
      alert("Please enter your full name.");
      fullnameInput.focus();
      return;
    }

    if (!emailInput.value.trim()) {
      alert("Please enter your email address.");
      emailInput.focus();
      return;
    }

    let shippingAddress = null;

    if (newAddressSection.style.display === "block") {
      shippingAddress = {
        address_line1: document.getElementById("newAddressLine1").value.trim(),
        address_line2: document.getElementById("newAddressLine2").value.trim(),
        city: document.getElementById("newCity").value.trim(),
        state: document.getElementById("newState").value.trim(),
        zip: document.getElementById("newZip").value.trim(),
        country: document.getElementById("newCountry").value.trim(),
      };

      const requiredFields = ["address_line1", "city", "state", "zip", "country"];
      for (const field of requiredFields) {
        if (!shippingAddress[field]) {
          alert("Please fill in all required address fields.");
          return;
        }
      }

      try {
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(shippingAddress),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          alert(result.message || "Failed to save address");
          return;
        }

        await loadAddresses();
        newAddressSection.style.display = "none";
        addressSelect.style.display = "block";
      } catch (err) {
        console.error("Error saving address:", err);
        alert("Error saving address.");
        return;
      }
    } else {
      const selectedOption = addressSelect.value;
      if (!selectedOption) {
        alert("Please select or add a shipping address.");
        return;
      }
      shippingAddress = JSON.parse(selectedOption);
    }

    if (selectedCartItems.length === 0) {
      alert("No cart items found for checkout.");
      return;
    }

    const orderData = {
      fullname: fullnameInput.value.trim(),
      email: emailInput.value.trim(),
      contactNumber: contact_number.value.trim(),  // add this line
      shippingAddress,
      items: selectedCartItems.map(item => ({
        cartItem_id: item.cartItem_id || item.id,
        subtotal: item.price * item.quantity,
        quantity: item.quantity,
      })),
    };

    try {
      const orderRes = await fetch("/api/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderRes.json();

      if (orderRes.ok && orderResult.success) {
        alert("Order placed successfully!");
        window.location.href = "/thankyou";
      } else {
        alert(orderResult.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order.");
    }
  });

  await loadUserProfile();
  await loadAddresses();
  await loadCartItems();
});
