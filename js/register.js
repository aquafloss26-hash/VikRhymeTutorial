document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  const exists = users.find(u => u.email === email);
  if (exists) {
    document.getElementById("msg").textContent = "Email already registered!";
    return;
  }

  // Save user
  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("msg").textContent = "Account created! You can now login.";
});
