document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".toggle");
  const showcase = document.querySelector(".showcase");
  const cartIcon = document.querySelector(".cartIcon");
  const cart = document.querySelector(".cart");

  // Initially hide the cart
  cart.classList.add("hidden");

  // Toggle the showcase and menu icon
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
  });

  // Toggle the cart visibility when the cart icon is clicked
  cartIcon.addEventListener("click", () => {
    cart.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const addButtons = document.querySelectorAll(".plus");
  const removeButtons = document.querySelectorAll(".minus");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalDisplay = document.getElementById("cartTotal");
  const addressInput = document.querySelector(".addressInput");
  const placeOrderBtn = document.querySelector(".placeOrderBtn");
  const noteInput = document.querySelector(".note");
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

  addButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quantityDisplay = this.previousElementSibling;
      let quantity = parseInt(quantityDisplay.textContent);
      quantity++;
      quantityDisplay.textContent = quantity;
      const itemName = this.parentNode.querySelector("h4").innerText.trim();
      addToCart(itemName);
      updateCartUI();
    });
  });

  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const quantityDisplay = this.nextElementSibling;
      let quantity = parseInt(quantityDisplay.textContent);
      if (quantity > 0) {
        quantity--;
        quantityDisplay.textContent = quantity;
        const itemName = this.parentNode.querySelector("h4").innerText.trim();
        removeFromCart(itemName);
        updateCartUI();
      }
    });
  });

  placeOrderBtn.addEventListener("click", function () {
    const address = addressInput.value.trim();
    const additionalNotes = noteInput.value.trim();
    if (address !== "") {
      console.log("Placing order...");
      const orderDetails = getOrderDetails();
      const whatsappLink = getWhatsAppLink(
        orderDetails,
        address,
        additionalNotes
      );
      window.open(whatsappLink, "_blank");
      clearCartAndLocalStorage();
      console.log("Order placed successfully.");
    } else {
      alert("Please enter your address before placing the order.");
    }
  });

  function addToCart(itemName) {
    if (cartItems[itemName]) {
      cartItems[itemName]++;
    } else {
      cartItems[itemName] = 1;
    }
    saveCartToLocalStorage();
  }

  function removeFromCart(itemName) {
    if (cartItems[itemName] && cartItems[itemName] > 0) {
      cartItems[itemName]--;
      if (cartItems[itemName] === 0) {
        delete cartItems[itemName];
      }
    }
    saveCartToLocalStorage();
  }

  function updateCartUI() {
    cartItemsContainer.innerHTML = "";
    let totalItems = 0;
    for (const itemName in cartItems) {
      const quantity = cartItems[itemName];
      totalItems += quantity;
      const cartItem = document.createElement("div");
      cartItem.textContent = itemName + " x " + quantity;
      cartItemsContainer.appendChild(cartItem);
    }
    cartTotalDisplay.textContent = totalItems;
  }

  function saveCartToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  function clearCartAndLocalStorage() {
    cartItems = {};
    localStorage.removeItem("cartItems");
    updateCartUI();
    resetDisplayNumbers();
  }

  function resetDisplayNumbers() {
    const quantityDisplays = document.querySelectorAll(".number");
    quantityDisplays.forEach((display) => {
      display.textContent = "0";
    });
  }

  function getOrderDetails() {
    return cartItems;
  }

  function formatWhatsAppMessage(orderDetails, address, additionalNotes) {
    let message = "New Order Alert!\n\n";
    message += "Address: " + address + "\n\n";
    if (additionalNotes.trim() !== "") {
      message += "Additional Note: " + additionalNotes + "\n\n";
    }
    message += "Order Details:\n";
    for (const itemName in orderDetails) {
      message += itemName + ": " + orderDetails[itemName] + "\n";
    }
    return message;
  }

  function getWhatsAppLink(orderDetails, address, additionalNotes) {
    const chefNumber = "2348072145374";
    const message = formatWhatsAppMessage(
      orderDetails,
      address,
      additionalNotes
    );
    const encodedMessage = encodeURIComponent(message);
    return "https://wa.me/" + chefNumber + "?text=" + encodedMessage;
  }
});
