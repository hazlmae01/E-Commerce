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

function createProductCard(product) {
  // Ensure price is a number; if not, fallback to 0
  const price = typeof product.price === "number" ? product.price : parseFloat(product.price);
  const displayPrice = !isNaN(price) ? price.toFixed(2) : "0.00";

  return `
    <div class="col-md-3 mb-4">
      <div class="card h-100">
        <img src="${product.image_url || '/assets/default-product.png'}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text flex-grow-1">${product.description || ''}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-danger fw-bold">$${displayPrice}</span>
            <a href="/product?id=${product.product_id}" class="btn btn-sm btn-primary">Details</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

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
        ${
          products.length > 0
            ? products.map(createProductCard).join("")
            : `<p>No products found in this category.</p>`
        }
      </div>
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", renderCategoryPage);
