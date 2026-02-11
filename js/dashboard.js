const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("welcome").textContent =
  `Welcome, ${user.name} (${user.email})`;

// Load cart
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartList = document.getElementById("cartList");

cart.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.name} x ${item.quantity}`;
  cartList.appendChild(li);
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});
