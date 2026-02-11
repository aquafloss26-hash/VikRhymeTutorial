document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    document.getElementById("msg").textContent = "Invalid email or password";
    return;
  }

  // Save logged-in user
  localStorage.setItem("user", JSON.stringify(user));

  window.location.href = "dashboard.html";
});
