document.addEventListener("DOMContentLoaded", function () {
    let cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach(item => {
        let quantityContainer = item.querySelector(".cart-item-quantity");

        // Create the delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn", "btn-danger", "ms-3"); // Bootstrap styling

        // Remove the cart item when clicked
        deleteBtn.addEventListener("click", function () {
            item.remove();
        });

        // Append delete button next to quantity selector
        quantityContainer.appendChild(deleteBtn);
    });
});