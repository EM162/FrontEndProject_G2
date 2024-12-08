// cart functionality
window.onload = function() {
    const tbody = document.querySelector('tbody');
    
    // Event delegation for all cart interactions
    tbody.addEventListener('click', function(e) {
            
        // Handle minus button
        if (e.target.classList.contains('btn-minus')) {
            const input = e.target.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                updateRowAndTotal(e.target.closest('tr'));
            }
        }
        
        // Handle plus button
        if (e.target.classList.contains('btn-plus')) {
            const input = e.target.parentElement.querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;
            updateRowAndTotal(e.target.closest('tr'));
        }
        
        // Handle remove button
        if (e.target.classList.contains('times')) {
            const row = e.target.closest('tr');
            row.remove();
            updateCartTotal();
            checkEmptyCart();
        }
    });

    // Update row total and cart total
    function updateRowAndTotal(row) {
        const price = parseFloat(row.querySelector('td:nth-child(2) .cartprice').textContent.replace('$', ''));
        const quantity = parseInt(row.querySelector('.quantity-input').value);
        const totalCell = row.querySelector('td:nth-child(4) .cartprice');
        
        const total = price * quantity;
        totalCell.textContent = '$' + total.toFixed(2);
        
        updateCartTotal();
    }

    // Update cart total
    function updateCartTotal() {
        let total = 0;
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            if (!row.querySelector('td[colspan="5"]')) {
                const totalCell = row.querySelector('td:nth-child(4) .cartprice');
                if (totalCell) {
                    total += parseFloat(totalCell.textContent.replace('$', ''));
                }
            }
        });

        // Update total displays
        const totalElements = document.querySelectorAll('.list-group-item .cartprice');
        totalElements.forEach(element => {
            if (element.closest('.list-group-item').textContent.includes('Total amount')) {
                element.innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
            } else if (element.closest('.list-group-item').textContent.includes('Total Bill')) {
                element.textContent = `$${total.toFixed(2)}`;
            }
        });
    }

    // Check if cart is empty
    function checkEmptyCart() {
        if (tbody.children.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Your cart is empty</td>
                </tr>`;
        }
    }

    // Save cart to storage
    function saveCartToStorage() {
        const cartItems = Array.from(document.querySelectorAll('tbody tr'))
            .filter(row => !row.querySelector('td[colspan="5"]'))
            .map(row => ({
                name: row.querySelector('.d-flex span').textContent,
                price: parseFloat(row.querySelector('td:nth-child(2) .cartprice').textContent.replace('$', '')),
                quantity: parseInt(row.querySelector('.quantity-input').value),
                image: row.querySelector('.product-image').src
            }));

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Initialize cart total on page load
    updateCartTotal();
};

// Function to update cart (called from HTML)
function updateCart() {
    const cartItems = Array.from(document.querySelectorAll('tbody tr'))
        .filter(row => !row.querySelector('td[colspan="5"]'))
        .map(row => ({
            name: row.querySelector('.d-flex span').textContent,
            price: parseFloat(row.querySelector('td:nth-child(2) .cartprice').textContent.replace('$', '')),
            quantity: parseInt(row.querySelector('.quantity-input').value),
            image: row.querySelector('.product-image').src
        }));

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('Cart updated successfully!');
}