document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  // Fake login (for now)
  localStorage.setItem("user", JSON.stringify({
    email: email,
    name: "Jesfine Customer"
  }));

  window.location.href = "dashboard.html";
});
