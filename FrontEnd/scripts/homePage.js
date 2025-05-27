document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");

  fetch("/api/products")
    .then(res => res.json())
    .then(products => {
      container.innerHTML = "";

      if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = "<p>No products available.</p>";
        return;
      }

      products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";

        const imageUrl = product.image_url ? product.image_url : 'https://via.placeholder.com/150';

        // Determine stock display
        let stockDisplay = "";
        let addToCartButton = `<a href="#" class="btn btn-sm btn-outline-primary w-100 add-to-cart-btn" data-id="${product.product_id}">Add to Cart</a>`;
        if (product.stock_quantity === 0) {
          stockDisplay = `<p class="text-danger fw-bold">Out of Stock</p>`;
          // Disable Add to Cart button if no stock
          addToCartButton = `<button class="btn btn-sm btn-outline-secondary w-100" disabled>Add to Cart</button>`;
        } else {
          stockDisplay = `<p class="text-success">In Stock: ${product.stock_quantity}</p>`;
        }

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">
                <a href="/product?id=${product.product_id}" class="text-decoration-none">${product.name}</a>
              </h5>
              <p class="card-text small">${product.description}</p>
              ${stockDisplay}
              <div class="mt-auto">
                <p class="fw-bold">$${Number(product.price).toFixed(2)}</p>
                ${addToCartButton}
              </div>
            </div>
          </div>
        `;

        container.appendChild(col);
      });

      // Add event listeners for all Add to Cart buttons
      const addToCartButtons = container.querySelectorAll(".add-to-cart-btn");
      addToCartButtons.forEach(button => {
        button.addEventListener("click", async (e) => {
          e.preventDefault();
          const productId = button.getAttribute("data-id");
          button.disabled = true;
          button.textContent = "Adding...";
          try {
            const res = await fetch("/api/cart/add", {
              credentials: "include",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id: productId, quantity: 1 }),
            });
            if (!res.ok) throw new Error("Failed to add to cart");
            alert("Added to cart!");
          } catch (err) {
            alert("Error adding to cart");
            console.error(err);
          } finally {
            button.disabled = false;
            button.textContent = "Add to Cart";
          }
        });
      });
    })
    .catch(err => {
      container.innerHTML = "<p class='text-danger'>Failed to load products.</p>";
      console.error("Error fetching products:", err);
    });
});
