document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");

  fetch("/api/products")
    .then(res => res.json())
    .then(products => {
      container.innerHTML = "";

      products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-4";

        col.innerHTML = `
          <div class="card">
            <img src="${product.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <a href="#" class="btn btn-primary">Add to Cart</a>
            </div>
          </div>
        `;

        container.appendChild(col);
      });
    })
    .catch(err => {
      container.innerHTML = "<p class='text-danger'>Failed to load products.</p>";
      console.error(err);
    });
});
