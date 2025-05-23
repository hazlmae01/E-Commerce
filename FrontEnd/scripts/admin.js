const addProductBtn = document.getElementById("addProductBtn");
const viewProductsBtn = document.getElementById("viewProductsBtn");
const viewSoldBtn = document.getElementById("viewSoldBtn");

Section = document.getElementById("addProductSection");
const viewProductsSection = document.getElementById("viewProductsSection");
const viewSoldSection = document.getElementById("viewSoldSection");

function setActive(button) {
    [addProductBtn, viewProductsBtn, viewSoldBtn].forEach((btn) =>
        btn.classList.remove("active")
    );
    button.classList.add("active");
}

function showSection(section) {
    [addProductSection, viewProductsSection, viewSoldSection].forEach((sec) => {
        sec.classList.add("hidden");
    });
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


const addProductForm = document.getElementById("addProductForm");

addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById("productName").value.trim(),
        description: document.getElementById("productDescription").value.trim(),
        price: parseFloat(document.getElementById("productPrice").value),
        stock_quantity: parseInt(document.getElementById("productStock").value, 10),
        category_id: 1, 
    };

    try {
        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        });
        const result = await res.json();

        if (res.ok) {
            alert("Product added successfully!");
            addProductForm.reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        alert("Network error.");
    }
});

async function loadProducts() {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) {
    console.error("Table body element with id 'productsTableBody' not found!");
    return;
  }
  tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    if (Array.isArray(products) && products.length > 0) {
      tbody.innerHTML = products
        .map(
          (p) => `
        <tr>
          <td>${p.product_id}</td>
          <td>${p.name}</td>
          <td>${p.description}</td>
          <td>$${Number(p.price).toFixed(2)}</td>
          <td>${p.stock_quantity}</td>
          <td>${p.category_id || "N/A"}</td>
        </tr>`
        )
        .join("");
    } else {
      tbody.innerHTML = '<tr><td colspan="6">No products found.</td></tr>';
    }
  } catch (e) {
    console.error("Failed to load products:", e);
    tbody.innerHTML = `<tr><td colspan="6">Failed to load products: ${e.message}</td></tr>`;
  }
}

showSection(addProductSection);
