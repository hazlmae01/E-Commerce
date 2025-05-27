const form = document.querySelector("#addProductForm");
const name = document.querySelector("#productName");
const description = document.querySelector("#productDescription");
const price = document.querySelector("#productPrice");
const stock = document.querySelector("#productStock");
const category = document.querySelector("#productCategory");
const image = document.querySelector("#productImage");
const success = document.querySelector("#successMessage");
const error = document.querySelector("#errorMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", name.value);
  formData.append("description", description.value);
  formData.append("price", price.value);
  formData.append("stock_quantity", stock.value);
  formData.append("category_id", category.value);

  if (image.files[0]) {
    formData.append("image", image.files[0]);
  }

  fetch("/api/products", {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Server did not return JSON: " + text);
      }
      return res.json();
    })
    .then((data) => {
      if (data.status === "error") {
        success.style.display = "none";
        error.style.display = "block";
        error.innerText = data.error;
      } else {
        error.style.display = "none";
        success.style.display = "block";
        success.innerText = data.success;
        form.reset();
      }
    })
    .catch((err) => {
      error.style.display = "block";
      error.innerText = "Error: " + err.message;
    });
});
