let orderList = [];
let totalPrice = 0;

function addToOrder(item, price) {
    const existingItem = orderList.find(order => order.item === item);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += price;
    } else {
        orderList.push({ item, price, quantity: 1, totalPrice: price });
    }
    totalPrice += price;
    displayOrder();
}

function removeFromOrder(item, price) {
    const existingItem = orderList.find(order => order.item === item);
    if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        existingItem.totalPrice -= price;
        totalPrice -= price;
    } else if (existingItem) {
        totalPrice -= existingItem.totalPrice; // Fix: Reduce total price properly
        orderList = orderList.filter(order => order.item !== item);
    }
    displayOrder();
}

function cancelOrder(item) {
    const existingItem = orderList.find(order => order.item === item);
    if (existingItem) {
        totalPrice -= existingItem.totalPrice;
        orderList = orderList.filter(order => order.item !== item);
    }
    displayOrder();
}

function displayOrder() {
    const orderListElement = document.getElementById('order-list');
    orderListElement.innerHTML = '';
    orderList.forEach(order => {
        const li = document.createElement('li');
        li.textContent = `${order.item} x ${order.quantity} (₹${order.price} per plate) - ₹${order.totalPrice}`;

        const actionButtons = document.createElement('div');
        actionButtons.innerHTML = `
            <button onclick="removeFromOrder('${order.item}', ${order.price})">Less</button>
            <button onclick="cancelOrder('${order.item}')">Cancel</button>
        `;
        li.appendChild(actionButtons);
        orderListElement.appendChild(li);
    });

    document.getElementById('total-price').textContent = `₹${totalPrice}`;
}

function showPaymentFields(paymentType) {
    document.getElementById('payment-fields').style.display = 'block';
    document.getElementById('debit-card-fields').style.display = paymentType === 'debit-card' ? 'block' : 'none';
    document.getElementById('credit-card-fields').style.display = paymentType === 'credit-card' ? 'block' : 'none';
    document.getElementById('upi-fields').style.display = paymentType === 'upi' ? 'block' : 'none';
}

function validateCardNumber(cardNumber) {
    return /^\d{12,16}$/.test(cardNumber);
}

function submitOrder() {
    const tableNumber = document.getElementById('table-number').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    if (!tableNumber) {
        alert('Please enter a table number.');
        return;
    }

    if (!paymentMethod) {
        alert('Please select a payment method.');
        return;
    }

    let isValid = true;
    if (paymentMethod.value === 'debit-card') {
        const debitCardNumber = document.getElementById('debit-card-number').value;
        if (!validateCardNumber(debitCardNumber)) {
            alert('Invalid Debit Card Number. Please enter a 12 to 16 digit number.');
            isValid = false;
        }
    } else if (paymentMethod.value === 'credit-card') {
        const creditCardNumber = document.getElementById('credit-card-number').value;
        if (!validateCardNumber(creditCardNumber)) {
            alert('Invalid Credit Card Number. Please enter a 12 to 16 digit number.');
            isValid = false;
        }
    } else if (paymentMethod.value === 'upi') {
        const upiId = document.getElementById('upi-id').value;
        if (upiId.length > 50) {
            alert('Invalid UPI ID. Please enter a valid UPI ID.');
            isValid = false;
        }
    }

    if (!isValid) return;

    if (orderList.length === 0) {
        alert('Your order is empty. Please add items to your order.');
        return;
    }

    alert(`Order Submitted!\nTable No: ${tableNumber}\nTotal: ₹${totalPrice}\nPayment Successful!`);

    // Reset the order
    orderList = [];
    totalPrice = 0;
    displayOrder();
    document.getElementById('table-number').value = '';
    document.getElementById('payment-fields').style.display = 'none';
    document.querySelectorAll('input[name="payment"]').forEach(input => input.checked = false);
    document.getElementById('total-price').textContent = `₹${totalPrice}`;
}
