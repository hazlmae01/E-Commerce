// Get navigation buttons
const createCategoryBtn = document.getElementById("createCategoryBtn");
const addProductBtn = document.getElementById("addProductBtn");
const viewProductsBtn = document.getElementById("viewProductsBtn");
const viewSoldBtn = document.getElementById("viewSoldBtn");

// Get sections
const createCategorySection = document.getElementById("createCategorySection");
const addProductSection = document.getElementById("addProductSection");
const viewProductsSection = document.getElementById("viewProductsSection");
const viewSoldSection = document.getElementById("viewSoldSection");

// Utility: Set active nav link
function setActive(button) {
  [createCategoryBtn, addProductBtn, viewProductsBtn, viewSoldBtn].forEach((btn) =>
    btn.classList.remove("active")
  );
  button.classList.add("active");
}

// Utility: Show one section, hide others
function showSection(section) {
  [createCategorySection, addProductSection, viewProductsSection, viewSoldSection].forEach((sec) =>
    sec.classList.add("hidden")
  );
  section.classList.remove("hidden");
}

// Navigation event listeners
createCategoryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActive(createCategoryBtn);
  showSection(createCategorySection);
});

addProductBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActive(addProductBtn);
  showSection(addProductSection);
  loadCategoriesIntoProductForm();
});

viewProductsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActive(viewProductsBtn);
  showSection(viewProductsSection);
  loadProducts();
});

viewSoldBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActive(viewSoldBtn);
  showSection(viewSoldSection);
  loadSoldProducts();
});

// === CATEGORY FORM ===

const createCategoryForm = document.getElementById("createCategoryForm");
const categorySuccessMessage = document.getElementById("categorySuccessMessage");
const categoryErrorMessage = document.getElementById("categoryErrorMessage");

createCategoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  categorySuccessMessage.style.display = "none";
  categoryErrorMessage.style.display = "none";

  const name = createCategoryForm.name.value.trim();
  const description = createCategoryForm.description.value.trim();

  if (!name) {
    categoryErrorMessage.textContent = "Category name is required.";
    categoryErrorMessage.style.display = "block";
    return;
  }

  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const result = await res.json();

    if (res.ok) {
      categorySuccessMessage.textContent = "Category added successfully!";
      categorySuccessMessage.style.display = "block";
      createCategoryForm.reset();
    } else {
      categoryErrorMessage.textContent = result.error || "Failed to add category.";
      categoryErrorMessage.style.display = "block";
    }
  } catch (err) {
    categoryErrorMessage.textContent = "Network or server error.";
    categoryErrorMessage.style.display = "block";
    console.error(err);
  }
});

// === PRODUCT FORM (Add Product Section) ===

const addProductForm = document.getElementById("addProductForm");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

// Load categories for product form dropdown
async function loadCategoriesIntoProductForm() {
  const select = document.getElementById("productCategory");
  select.innerHTML = '<option value="">Loading categories...</option>';

  try {
    const res = await fetch("/api/categories");
    const categories = await res.json();

    if (Array.isArray(categories) && categories.length > 0) {
      select.innerHTML = categories
        .map(
          (cat) =>
            `<option value="${cat.category_id}">${cat.name}</option>`
        )
        .join("");
    } else {
      select.innerHTML = '<option value="">No categories found</option>';
    }
  } catch (err) {
    select.innerHTML = '<option value="">Failed to load categories</option>';
    console.error("Error loading categories:", err);
  }
}

addProductForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;

  const payload = {
    name: form.productName.value,
    description: form.productDescription.value,
    price: form.productPrice.value,
    stock_quantity: form.productStock.value,
    category_id: form.productCategory.value,
  };

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Product added!");
      form.reset();
      loadProducts();
    } else {
      alert(result.error || "Something went wrong");
    }
  } catch (err) {
    console.error("Submit error:", err);
  }
});

// === PRODUCTS TABLE EDITABLE ===

// Store original product data for cancel
let originalProductData = {};

// Helper function (outside main functions)
async function getCategoriesOptionsHTML(selectedCategory) {
  try {
    const res = await fetch("/api/categories");
    const categories = await res.json();

    if (Array.isArray(categories) && categories.length > 0) {
      return categories
        .map(cat => 
          `<option value="${cat.category_id}" ${cat.name === selectedCategory ? "selected" : ""}>${cat.name}</option>`
        )
        .join("");
    }
    return `<option value="">No categories found</option>`;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return `<option value="">Error loading categories</option>`;
  }
}

// Load products and render table
async function loadProducts() {
  const tbody = document.getElementById("productsTableBody");
  tbody.innerHTML = "<tr><td colspan='8'>Loading...</td></tr>";

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    if (Array.isArray(products) && products.length > 0) {
      tbody.innerHTML = products
        .map((prod) => {
          return `
            <tr data-product-id="${prod.product_id}">
              <td class="pid">${prod.product_id}</td>
              <td class="name">${prod.name}</td>
              <td class="description">${prod.description}</td>
              <td class="price">$${prod.price}</td>
              <td class="stock">${prod.stock_quantity}</td>
              <td class="category">${prod.category_name || "N/A"}</td>
              <td class="image"><img src="${prod.image_url}" alt="${prod.name}" style="width: 50px; height: auto;" /></td>
              <td class="actions">
                <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
              </td>
            </tr>
          `;
        })
        .join("");
      addTableEventListeners();
    } else {
      tbody.innerHTML = "<tr><td colspan='8'>No products found.</td></tr>";
    }
  } catch (err) {
    tbody.innerHTML = "<tr><td colspan='8'>Failed to load products.</td></tr>";
    console.error(err);
  }
}

// Attach listeners for Edit, Save, Cancel, Delete buttons
function addTableEventListeners() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", handleEditClick);
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", handleDeleteClick);
  });
}

// Handle edit button click
async function handleEditClick(event) {
  const tr = event.target.closest("tr");
  const productId = tr.dataset.productId;

  if (event.target.textContent === "Edit") {
    // Save original data for cancel
    originalProductData[productId] = {
      name: tr.querySelector(".name").textContent,
      description: tr.querySelector(".description").textContent,
      price: tr.querySelector(".price").textContent.replace("$", ""),
      stock_quantity: tr.querySelector(".stock").textContent,
      category: tr.querySelector(".category").textContent,
    };

    // Replace cells with inputs
    tr.querySelector(".name").innerHTML = `<input type="text" value="${originalProductData[productId].name}">`;
    tr.querySelector(".description").innerHTML = `<input type="text" value="${originalProductData[productId].description}">`;
    tr.querySelector(".price").innerHTML = `<input type="number" step="0.01" min="0" value="${originalProductData[productId].price}">`;
    tr.querySelector(".stock").innerHTML = `<input type="number" min="0" value="${originalProductData[productId].stock_quantity}">`;

    // Category dropdown - async populate options
    const optionsHTML = await getCategoriesOptionsHTML(originalProductData[productId].category);
    tr.querySelector(".category").innerHTML = `<select>${optionsHTML}</select>`;

    // Change buttons to Save and Cancel
    tr.querySelector(".actions").innerHTML = `
      <button class="btn btn-sm btn-success save-btn">Save</button>
      <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
    `;

    // Add listeners for Save and Cancel
    tr.querySelector(".save-btn").addEventListener("click", () => handleSaveClick(tr, productId));
    tr.querySelector(".cancel-btn").addEventListener("click", () => handleCancelClick(tr, productId));
  }
}

// Handle cancel edit
function handleCancelClick(tr, productId) {
  // Restore original values
  tr.querySelector(".name").textContent = originalProductData[productId].name;
  tr.querySelector(".description").textContent = originalProductData[productId].description;
  tr.querySelector(".price").textContent = `$${originalProductData[productId].price}`;
  tr.querySelector(".stock").textContent = originalProductData[productId].stock_quantity;
  tr.querySelector(".category").textContent = originalProductData[productId].category;

  // Restore action buttons
  tr.querySelector(".actions").innerHTML = `
    <button class="btn btn-sm btn-primary edit-btn">Edit</button>
    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
  `;

  addTableEventListeners();
}

// Handle save edited product
async function handleSaveClick(tr, productId) {
  // Get input values
  const nameInput = tr.querySelector(".name input");
  const descInput = tr.querySelector(".description input");
  const priceInput = tr.querySelector(".price input");
  const stockInput = tr.querySelector(".stock input");
  const categorySelect = tr.querySelector(".category select");

  const updatedProduct = {
    name: nameInput.value.trim(),
    description: descInput.value.trim(),
    price: parseFloat(priceInput.value),
    stock_quantity: parseInt(stockInput.value, 10),
    category_id: categorySelect.value,
  };

  // Basic validation
  if (!updatedProduct.name) {
    alert("Product name cannot be empty.");
    return;
  }
  if (isNaN(updatedProduct.price) || updatedProduct.price < 0) {
    alert("Price must be a valid non-negative number.");
    return;
  }
  if (isNaN(updatedProduct.stock_quantity) || updatedProduct.stock_quantity < 0) {
    alert("Stock quantity must be a valid non-negative integer.");
    return;
  }
  if (!updatedProduct.category_id) {
    alert("Please select a category.");
    return;
  }

  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    const result = await res.json();

    if (res.ok) {
      alert("Product updated successfully!");
      loadProducts();
    } else {
      alert(result.error || "Failed to update product.");
    }
  } catch (err) {
    alert("Network or server error.");
    console.error(err);
  }
}

// Handle delete product
async function handleDeleteClick(event) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const tr = event.target.closest("tr");
  const productId = tr.dataset.productId;

  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Product deleted.");
      loadProducts();
    } else {
      const result = await res.json();
      alert(result.error || "Failed to delete product.");
    }
  } catch (err) {
    alert("Network or server error.");
    console.error(err);
  }
}

// === SOLD PRODUCTS (View Sold Section) ===

async function loadSoldProducts() {
  const tbody = document.getElementById("soldProductsTableBody");
  tbody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

  try {
    const res = await fetch("/api/sold-products");
    const soldProducts = await res.json();

    if (Array.isArray(soldProducts) && soldProducts.length > 0) {
      tbody.innerHTML = soldProducts
        .map((prod) => {
          return `
            <tr>
              <td>${prod.product_id}</td>
              <td>${prod.name}</td>
              <td>${prod.price}</td>
              <td>${prod.quantity_sold}</td>
              <td>${prod.sale_date}</td>
            </tr>
          `;
        })
        .join("");
    } else {
      tbody.innerHTML = "<tr><td colspan='6'>No sold products found.</td></tr>";
    }
  } catch (err) {
    tbody.innerHTML = "<tr><td colspan='6'>Failed to load sold products.</td></tr>";
    console.error(err);
  }
}

// On page load, default view to create category
setActive(createCategoryBtn);
showSection(createCategorySection);
