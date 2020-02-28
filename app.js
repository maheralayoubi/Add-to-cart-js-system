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
                            <i class="fas fa-shopping-cart"> </i>add to cart
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
        // Get product from products and add amount
        let cartItem = {
          ...Storage.getProduct(id),
          amount: 1
        };
        // Add product to the cart
        cart = [...cart, cartItem];
        // Save cart in local storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // add or display cart item
        this.addCartItem(cartItem);
        // show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div>`;
    cartContent.appendChild(div);
  }
  showCart() {
    // Adding class name to show the cart
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    // Remove class name to hide the cart
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    // Pointing "this" with () => to access within the class.
    clearCartBtn.addEventListener('click', () => {
      this.clearCart();
    });
    // Cart Functionality
    cartContent.addEventListener('click', event => {
      if (event.target.classList.contains('remove-item')) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains('fa-chevron-up')) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains('fa-chevron-down')) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    })
  }
  clearCart() {
    let cartItems = cart.map(item => item.id);
    // Loop through the arry and remove the item with the particular id
    cartItems.forEach(id => this.removeItem(id));
    // While the cart has iteme keep removing them
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id)
    // Update the cart with the resent value
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shoppingcart"></i>add to cart`;
  }
  getSingleButton(id) {
    // get me the button that used at the same item with same id
    return buttonsDOM.find(button => button.dataset.id === id);
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
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    // If there an item in local storage in the cart array then we return that arry if not, return []
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Instances
  const ui = new UI();
  const products = new Products();

  // Setup app
  ui.setupAPP();

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
      ui.cartLogic();
    });
});