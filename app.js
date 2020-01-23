// Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// Cart
let cart = [];

// Getting the products from json
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            // Products array
            products = products.map(item => {
                const {
                    title,
                    price
                } = item.fields;
                const {
                    id
                } = item.sys;
                const image = item.fields.image.fields.file.url;
                return {
                    title,
                    price,
                    id,
                    image
                }
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// Display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            // Adding stuff to the variable
            result += `<!--Single Product-->
                        <article class = "product" >
                            <div class = "img-container" >
                            <img src = ${product.image} alt="product" class="product-img" >
                            <button class = "bag-btn" data-id = ${product.id} >
                            <i class="fas fa-shopping-cart"> </i>add to bag
                            </button> 
                            </div> <h3> ${product.title} </h3>
                                   <h4> ${product.price} </h4>
                            </article>
                        <!--End Of Single Product-->`;
        });
        productsDOM.innerHTML = result;
    }
}

// Local storage
class Storage {
    static saveProducts(products) {
        // This will make products array a string
        localStorage.setItem("product", JSON.stringify(products));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Instances
    const ui = new UI();
    const products = new Products();

    // Get all products
    products.getProducts().then(products => {
        // Displaying the products
        ui.displayProducts(products)
        // Save the products in the local storage
        Storage.saveProducts(products);
    });

});