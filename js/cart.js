document.addEventListener("DOMContentLoaded", () => {
  if (!currentUser) {
    Toastify({
      text: "Please login first to access cart",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "#dc3545",
      },
    }).showToast();

    setTimeout(() => {
      window.location.href = "../sign-in.html";
    }, 3000);
    return;
  }

  function updateCartCount() {
    filterdUser.cart = cart;
    if (currentUser) {
      const updatedUsers = users.map((user) =>
        user.email === filterdUser.email ? filterdUser : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(filterdUser));
    }
  }
  function updateCartTable() {
    const cartTable = document.querySelector("#cart-table");
    cartTable.innerHTML = "";
    console.log(cart);
    cart.forEach((item) => {
      const row = document.createElement("tr");
      row.dataset.id = item.id;
      row.innerHTML = `
                <td>${item.title}</td>
                <td>$${item.price}</td>
                <td>
                    <div style="display: flex;">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity">+</button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
      cartTable.appendChild(row);
    });


    updateCartTotals();  
  }

  function updateCartTotals() {
    const shippingCost = 5.0; 
    const totalBill = cart
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
    const totalAmount = (parseFloat(totalBill) + shippingCost).toFixed(2);

    document.querySelector(".cart-total-bill").textContent = `$${totalBill}`;
    document.querySelector(
      ".cart-shipping"
    ).textContent = `$${shippingCost.toFixed(2)}`;
    document.querySelector(
      ".cart-total-amount"
    ).textContent = `$${totalAmount}`;
  }

  function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1; 
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartTable();  
    updateCartCount();   
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("increase-quantity")) {
      const cartItem = target.closest("tr");
      const id = parseInt(cartItem.dataset.id);
      const item = cart.find((item) => item.id === id);
      if (item) {
        item.quantity += 1;
        updateCartTable(); 
        updateCartCount();
      }
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("decrease-quantity")) {
      const cartItem = target.closest("tr");
      const id = parseInt(cartItem.dataset.id);
      const item = cart.find((item) => item.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCartTable();  
        updateCartCount();   
      }
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("remove-item")) {
      const cartItem = target.closest("tr");
      const id = parseInt(cartItem.dataset.id);
      console.log(id);
      cart = cart.filter((item) => item.id !== id);

      updateCartTable();  
      updateCartCount();
    }
  });

  updateCartTable();
  updateCartCount();

 

  const checkout = document.getElementById("checkout");
  checkout.addEventListener("click", () => {
    const filterdUser = users.find(
      (user) => user?.email === currentUser?.email
    );
    filterdUser.history.push(...cart);
    filterdUser.cart = [];
    if (currentUser) {
      const updatedUsers = users.map((user) =>
        user.email === currentUser.email ? filterdUser : user
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(filterdUser));
    }
    Toastify({
      text: "Order placed successfully!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50",
    }).showToast();

    cart = [];
    updateCartTable();
  });
});
