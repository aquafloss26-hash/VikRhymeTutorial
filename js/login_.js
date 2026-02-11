document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();

    fetch('api/login.php', {
        method: 'POST',
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        })
    })
    .then(res => res.text())
    .then(res => {
        if (res === 'success') {
            window.location.href = 'checkout.html';
        } else {
            alert('Invalid login');
        }
    });
});
