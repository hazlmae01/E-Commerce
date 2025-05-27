async function fetchCategories() {
  try {
    const response = await fetch("/api/categories"); // your backend categories API
    if (!response.ok) throw new Error("Failed to fetch categories");
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

function createCategoryCard(category) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="${category.image_url || '/assets/default-category.png'}" class="card-img-top" alt="${category.name}">
        <div class="card-body">
          <h5 class="card-title">${category.name}</h5>
          <p class="card-text">${category.description || ''}</p>
          <a href="/category?categoryId=${category.category_id}" class="btn btn-secondary">View Products</a>
        </div>
      </div>
    </div>
  `;
}

async function renderCategories() {
  const container = document.getElementById("categories-container");
  if (!container) return;

  const categories = await fetchCategories();

  if (categories.length === 0) {
    container.innerHTML = "<p>No categories available.</p>";
    return;
  }

  container.innerHTML = categories.map(createCategoryCard).join("");
}

document.addEventListener("DOMContentLoaded", renderCategories);
