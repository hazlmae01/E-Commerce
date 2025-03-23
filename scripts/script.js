
// to start the document in jQuery
$(document).ready(()=> {
    // external api link
    const apiUrl = "https://api.api-ninjas.com/v1/advice";
    // ajax request to retrieve all advice information 
    $.ajax({
        url: apiUrl,
        // HTTP METHOD
        type: 'GET',
        dataType: 'json',
        // response type returning as json
        contentType:"application/json" ,
        // my API-KEY in order to access the API server
        headers : {
            'X-API-KEY': '4u9uOQ4bPRsfLWiReHVY2A==LhjWjqQZiGtOzkd7'
        },
        // if the request was a success meaning that the request went through
        success: (response) => {
            console.log(response);
        }, 
        // otherwise we call the `error` callback and add two parameters status and error type for debugging purposes.
        error: (status, error)=> {
            console.log(`Error ${error} at Status ${status}`);
        }
    });
});

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
