// Helper to get query param from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadProduct() {
  const id = getQueryParam("id");
  const container = document.getElementById("product-details");

  if (!id) {
    container.innerHTML = '<p class="text-danger text-center">No product ID specified.</p>';
    return;
  }

  try {
    const res = await fetch(`/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");

    const products = await res.json();
    const product = products.find(p => p.product_id == id);

    if (!product) {
      container.innerHTML = '<p class="text-danger text-center">Product not found.</p>';
      return;
    }

    // Show product details with quantity input
    container.innerHTML = `
      <div class="col-md-6">
        <img src="${product.image_url || 'https://via.placeholder.com/450'}" class="img-fluid rounded" alt="${product.name}" />
      </div>
      <div class="col-md-6">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <h4 class="text-success">$${Number(product.price).toFixed(2)}</h4>
        <p>Category ID: ${product.category_id || "N/A"}</p>
        <p>
          Stock: 
          <span class="${product.stock_quantity > 0 ? "text-success" : "text-danger fw-bold"}">
            ${product.stock_quantity > 0 ? product.stock_quantity : "Out of Stock"}
          </span>
        </p>
        <div class="mb-3">
          <label for="quantityInput" class="form-label">Quantity:</label>
          <input type="number" id="quantityInput" class="form-control" value="1" min="1" max="${product.stock_quantity}" ${product.stock_quantity === 0 ? "disabled" : ""} />
        </div>
        <button id="addToCartBtn" class="btn btn-primary" ${product.stock_quantity === 0 ? "disabled" : ""}>Add to Cart</button>
      </div>
    `;

    if (product.stock_quantity > 0) {
      const addToCartBtn = document.getElementById("addToCartBtn");
      const quantityInput = document.getElementById("quantityInput");

      addToCartBtn.addEventListener("click", async () => {
        let quantity = parseInt(quantityInput.value);
        if (isNaN(quantity) || quantity < 1) quantity = 1;
        if (quantity > product.stock_quantity) quantity = product.stock_quantity;

        addToCartBtn.disabled = true;
        addToCartBtn.innerText = "Adding...";

        try {
          const res = await fetch("/api/cart/add", {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: product.product_id, quantity }),
          });

          const result = await res.json();

          if (!res.ok) {
            alert(result.message || "Failed to add to cart.",);
          } else {
            addToCartBtn.innerText = "Added!";
            setTimeout(() => {
              addToCartBtn.disabled = false;
              addToCartBtn.innerText = "Add to Cart";
            }, 2000);
          }
        } catch (err) {
          alert(err);
          console.error("Add to cart error:", err);
          addToCartBtn.disabled = false;
          addToCartBtn.innerText = "Add to Cart";
        }
      });
    }
  } catch (err) {
    container.innerHTML = `<p class="text-danger text-center">Error loading product details.</p>`;
    console.error("Product load error:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadProduct);
