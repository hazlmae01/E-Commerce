const form = document.querySelector("#addProductForm");
const name = document.querySelector("#productName");
const description = document.querySelector("#productDescription");
const price = document.querySelector("#productPrice");
const stock = document.querySelector("#productStock");
const category = document.querySelector("#productCategory");
const success = document.querySelector("#successMessage");
const error = document.querySelector("#errorMessage");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const product = {
        name: name.value,
        description: description.value,
        price: parseFloat(price.value),
        stock_quantity: parseInt(stock.value),
        category_id: parseInt(category.value)
    };

    fetch("/api/products", {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
            "Content-type": "application/json"
        }
    }).then(res => res.json())
      .then(data => {
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
    });
});
