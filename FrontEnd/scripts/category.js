async function fetchProductsByCategory(categoryId) {
  try {
    const res = await fetch(`/api/categories/${categoryId}/products`);
    if (!res.ok) throw new Error("Failed to fetch products for category");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}


async function fetchCategoryName(categoryId) {
  try {
    const res = await fetch(`/api/categories/${categoryId}`);
    if (!res.ok) throw new Error("Failed to fetch category name");
    const category = await res.json();
    return category.name;
  } catch (err) {
    console.error(err);
    return "Category";
  }
}
async function addToCart(productId) {
  try {
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // Include cookies/session
      body: JSON.stringify({ product_id: productId, quantity: 1 })
    });

    // 🔒 Handle unauthenticated user
    if (response.status === 401 || response.redirected) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }

    // ✅ Now safe to parse JSON
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }

    alert(data.message || "Added to cart!");
  } catch (err) {
    console.error("Add to cart error:", err);
    alert(err.message || "Add to cart failed");
  }
}


function createProductCard(product) {
  const price = typeof product.price === "number" ? product.price : parseFloat(product.price);
  const displayPrice = !isNaN(price) ? price.toFixed(2) : "0.00";
  const imageUrl = product.image_url ? product.image_url : '/assets/default-product.jpg';

  // Determine stock display
  let stockDisplay = "";
  let addToCartButton = `<a href="#" class="btn btn-sm btn-outline-primary w-100 add-to-cart-btn" data-id="${product.product_id}">Add to Cart</a>`;
  if (product.stock_quantity === 0) {
    stockDisplay = `<p class="text-danger fw-bold">Out of Stock</p>`;
    addToCartButton = `<button class="btn btn-sm btn-outline-secondary w-100" disabled>Add to Cart</button>`;
  } else {
    stockDisplay = `<p class="text-success">In Stock: ${product.stock_quantity}</p>`;
  }

  return `
    <div class="col-md-3 mb-4">
      <div class="card h-100 shadow-sm">
        <img src="${imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">
            <a href="/product?id=${product.product_id}" class="text-decoration-none">${product.name}</a>
          </h5>
          <p class="card-text small">${product.description || ''}</p>
          ${stockDisplay}
          <div class="mt-auto">
            <p class="fw-bold">$${displayPrice}</p>
            ${addToCartButton}
          </div>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    e.preventDefault();
    const productId = e.target.getAttribute("data-id");
    addToCart(productId);
  }
});

async function renderCategoryPage() {
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get("categoryId");
  const container = document.getElementById("categories-container");

  if (!container || !categoryId) {
    console.error("Missing container or categoryId");
    return;
  }

  const categoryName = await fetchCategoryName(categoryId);
  const products = await fetchProductsByCategory(categoryId);

  container.innerHTML = `
    <section class="mb-5">
      <h2 class="mb-3">${categoryName}</h2>
      <div class="row">
        ${products.length > 0
      ? products.map(createProductCard).join("")
      : `<p>No products found in this category.</p>`
    }
      </div>
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", renderCategoryPage);
