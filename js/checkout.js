document.getElementById('checkoutForm').addEventListener('submit', e => {
    e.preventDefault();

    fetch('api/place-order.php', {
        method: 'POST',
        body: JSON.stringify({
            name: checkoutName.value,
            mobile: checkoutMobile.value,
            address: checkoutAddress.value,
            total: 0 // later connect to cart total
        })
    })
    .then(res => res.text())
    .then(res => {
        const msg = document.getElementById('checkoutMessage');
        if (res === 'success') {
            msg.textContent = 'Order placed successfully!';
            msg.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'orders.html';
            }, 1200);
        } else {
            msg.textContent = 'Order failed.';
            msg.style.color = 'red';
        }
    });
});
