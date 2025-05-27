const addProductBtn = document.getElementById("addProductBtn");
const viewProductsBtn = document.getElementById("viewProductsBtn");
const viewSoldBtn = document.getElementById("viewSoldBtn");

const addProductSection = document.getElementById("addProductSection");
const viewProductsSection = document.getElementById("viewProductsSection");
const viewSoldSection = document.getElementById("viewSoldSection");

function setActive(button) {
  [addProductBtn, viewProductsBtn, viewSoldBtn].forEach((btn) =>
    btn.classList.remove("active")
  );
  button.classList.add("active");
}

function showSection(section) {
  [addProductSection, viewProductsSection, viewSoldSection].forEach((sec) =>
    sec.classList.add("hidden")
  );
  section.classList.remove("hidden");
}

addProductBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setActive(addProductBtn);
  showSection(addProductSection);
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

// Product form with image
const addProductForm = document.getElementById("addProductForm");

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addProductForm); // Includes image file automatically

  try {
    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    if (res.ok) {
      alert("Product added successfully!");
      addProductForm.reset();
    } else {
      alert("Error: " + result.error);
    }
  } catch (err) {
    console.error("Add product error:", err);
    alert("Network or server error.");
  }
});

// Load products and make editable
async function loadProducts() {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) {
    console.error("Table body with ID 'productsTableBody' not found.");
    return;
  }

  tbody.innerHTML = '<tr><td colspan="8">Loading...</td></tr>';

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    if (Array.isArray(products) && products.length > 0) {
      tbody.innerHTML = products
        .map((p) => `
          <tr>
            <td>${p.product_id}</td>
            <td><input type="text" class="form-control form-control-sm" data-field="name" data-id="${p.product_id}" value="${p.name}"></td>
            <td><input type="text" class="form-control form-control-sm" data-field="description" data-id="${p.product_id}" value="${p.description}"></td>
            <td><input type="number" class="form-control form-control-sm" data-field="price" data-id="${p.product_id}" value="${p.price}"></td>
            <td>
              <input type="number" class="form-control form-control-sm ${p.stock_quantity === 0 ? 'border-danger text-danger' : ''}" data-field="stock_quantity" data-id="${p.product_id}" value="${p.stock_quantity}">
              ${p.stock_quantity === 0 ? '<small class="text-danger d-block">Out of Stock</small>' : ''}
            </td>
            <td><input type="number" class="form-control form-control-sm" data-field="category_id" data-id="${p.product_id}" value="${p.category_id || ''}"></td>
            <td>
              ${p.image_url ? `<img src="${p.image_url}" style="max-width:80px; max-height:80px;" alt="${p.name}">` : "No image"}
            </td>
            <td>
              <button class="btn btn-sm btn-primary save-btn" data-id="${p.product_id}">Save</button>
            </td>
          </tr>
        `)
        .join("");

      attachSaveHandlers();
    } else {
      tbody.innerHTML = '<tr><td colspan="8">No products found.</td></tr>';
    }
  } catch (e) {
    console.error("Failed to load products:", e);
    tbody.innerHTML = `<tr><td colspan="8">Failed to load products: ${e.message}</td></tr>`;
  }
}

// Save edited products
function attachSaveHandlers() {
  document.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const fields = ["name", "description", "price", "stock_quantity", "category_id"];
      const updatedProduct = {};

      fields.forEach((field) => {
        const input = document.querySelector(`input[data-field="${field}"][data-id="${id}"]`);
        if (field === "price" || field === "stock_quantity" || field === "category_id") {
          let value = Number(input.value);
          if (field === "stock_quantity" && value < 0) value = 0; // enforce min 0
          updatedProduct[field] = value;
        } else {
          updatedProduct[field] = input.value;
        }
      });

      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        });

        const result = await res.json();
        if (res.ok) {
          alert("Product updated successfully.");
          // Refresh the products list to update UI for stock 0 etc.
          loadProducts();
        } else {
          alert("Error: " + result.error);
        }
      } catch (err) {
        console.error("Update failed:", err);
        alert("Network or server error.");
      }
    });
  });
}

showSection(addProductSection); // Default view
