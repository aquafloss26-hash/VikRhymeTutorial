fetch('api/orders.php')
    .then(res => res.json())
    .then(orders => {
        const table = document.getElementById('ordersTable');

        if (orders.length === 0) {
            table.innerHTML = '<tr><td colspan="4">No orders yet</td></tr>';
            return;
        }

        orders.forEach(o => {
            table.innerHTML += `
                <tr>
                    <td>${o.id}</td>
                    <td>${new Date(o.created_at).toLocaleString()}</td>
                    <td>${o.status}</td>
                    <td>₱${o.total}</td>
                </tr>
            `;
        });
    });
