let api = "https://dummyjson.com/recipes";
let recipes = [];

let message = document.getElementById("message");
let recipesDiv = document.getElementById("recipes");
let detailsDiv = document.getElementById("details");


// Get recipes from the API
async function loadRecipes() {

    message.innerText = "Loading recipes...";

    try {

        let response = await fetch(api + "?limit=6");

        console.log("GET status:", response.status);

        if (!response.ok) {
            throw new Error("Could not load recipes. Please try again.");
        }

        let data = await response.json();

        recipes = data.recipes;

        showRecipes();

        message.innerText = "Recipes loaded successfully!";

    } catch (error) {

        message.innerText = error.message;
        message.className = "error";

    }

}


// Display recipe cards
function showRecipes() {

    recipesDiv.innerHTML = "";

    recipes.forEach(function(recipe) {

        let card = document.createElement("div");

        card.className = "recipe-card";

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">

            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>Cuisine: ${recipe.cuisine}</p>
                <p>Preparation time: ${recipe.prepTimeMinutes} minutes</p>
                <button>View Ingredients</button>
            </div>
        `;

        card.querySelector("button").onclick = function() {
            showIngredients(recipe);
        };

        recipesDiv.appendChild(card);

    });

}


// Show ingredients when a button is clicked
function showIngredients(recipe) {

    detailsDiv.innerHTML = `
        <h2>${recipe.name}</h2>
        <h3>Ingredients</h3>
        <ul></ul>
    `;

    let list = detailsDiv.querySelector("ul");

    recipe.ingredients.forEach(function(ingredient) {

        let item = document.createElement("li");

        item.innerText = ingredient;

        list.appendChild(item);

    });

}


// Load recipes when the page opens
loadRecipes();
