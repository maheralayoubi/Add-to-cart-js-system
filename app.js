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

// Buttons
let buttonsDOM = [];

// Getting the products from json
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      // Products array
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          title,
          price,
          id,
          image
        };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// Display products
class UI {
  displayProducts(products) {
    let result = "";
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
  getBagButtons() {
    // [...] will make the node list into an array
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      // If the item id matches the id in the button do something
      let inCart = cart.find(item => item.id === id);
      // If the item is in the cart
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      // If the item is not in the cart
      button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // Get product from products
        let cartItem = Storage.getProduct(id);
        // Add product to the cart
        // Save cart in local storage
        // set cart values
        // add or display cart item
        // show the cart
      });
    });
  }
}

// Local storage
class Storage {
  static saveProducts(products) {
    // This will make products array a string
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    // Get the product if the id is matching the id passed
    return products.find(product => product.id === id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Instances
  const ui = new UI();
  const products = new Products();

  // Get all products
  products
    .getProducts()
    .then(products => {
      // Displaying the products
      ui.displayProducts(products);
      // Save the products in the local storage
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
