
let api = "https://dummyjson.com/products";
let products = [];

let message = document.getElementById("message");
let productDiv = document.getElementById("products");

function loadProducts() {

    message.innerHTML = "Loading products...";

    fetch(api + "?limit=6")

    .then(function(response) {

        console.log("GET status:", response.status);

        if (!response.ok) {
            throw new Error("Could not load products");
        }

        return response.json();
    })

    .then(function(data) {

        products = data.products;

        console.log("First product brand:", products[0].brand);

        showProducts();

        message.innerText = "Products loaded successfully!";
    })

    .catch(function(error) {

        message.innerText = error.message;

    });

}


// Display products on the page
function showProducts() {

    productDiv.innerHTML = "";

    products.forEach(function(product) {

        let card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.thumbnail}" alt="Product image">

            <h3>${product.title}</h3>

            <p>Brand: ${product.brand || "Not available"}</p>

            <p>Price: $${product.price}</p>
        `;

        productDiv.appendChild(card);

    });

}


// Load products when page opens
loadProducts();
