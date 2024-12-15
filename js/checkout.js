document.addEventListener("DOMContentLoaded", () => {
    const orderSummaryContainer = document.querySelector(".order-summary");
    const form = document.querySelector("form");
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const countryInput = document.getElementById("Country");
    const townInput = document.getElementById("Town");
    const phoneInput = document.getElementById("Phone");
    const emailInput = document.getElementById("email");
    const notesInput = document.getElementById("notes");
    const saveButton = document.querySelector(".Save");

    // Retrieve cart data and total price from localStorage
    const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
    const totalBooksPrice = parseFloat(localStorage.getItem("totalBooksPrice")) || 0;

    // Display cart data in the order summary section
    const displayCartData = () => {
        if (cartData.length > 0) {
            let productRows = cartData.map(item => `
                <div class="d-flex justify-content-between">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${item.total.toFixed(2)}</span>
                </div>
                <hr>`).join("");

            const orderSummaryHTML = `
                <div class="d-flex justify-content-between">
                    <span><b>Product</b></span>
                    <span><b>Subtotal</b></span>
                </div>
                <hr>
                ${productRows}
                
                <div class="d-flex justify-content-between total-section">
                    <span>Total</span>
                    <span id="totalAmount">$${totalBooksPrice.toFixed(2)}</span>
                </div>
            `;
            orderSummaryContainer.innerHTML = orderSummaryHTML;

            // Add event listeners to shipping options
            document.querySelectorAll('input[name="shipping"]').forEach(radio => {
                radio.addEventListener("change", updateTotalWithShipping);
            });

            updateTotalWithShipping(); // Update total on page load
        } else {
            orderSummaryContainer.innerHTML = `
                <div class="alert alert-warning">Your cart is empty. Please add books to your cart before checking out.</div>
            `;
        }
    };

    // Update total price with selected shipping cost
    const updateTotalWithShipping = () => {
        const shippingCost = parseFloat(document.querySelector('input[name="shipping"]:checked').value);
        const totalWithShipping = totalBooksPrice + shippingCost;
        document.getElementById("totalAmount").textContent = `$${totalWithShipping.toFixed(2)}`;
    };

    // Validation functions
    const validateLettersOnly = (input, errorMessage) => {
        const regex = /^[a-zA-Z\s]{2,}$/;
        if (!regex.test(input.value.trim())) {
            input.classList.add("is-invalid");
            input.nextElementSibling.textContent = errorMessage;
            return false;
        } else {
            input.classList.remove("is-invalid");
            input.nextElementSibling.textContent = "";
            return true;
        }
    };

    const validatePhone = (input, errorMessage) => {
        const regex = /^\d{11}$/;
        if (!regex.test(input.value.trim())) {
            input.classList.add("is-invalid");
            input.nextElementSibling.textContent = errorMessage;
            return false;
        } else {
            input.classList.remove("is-invalid");
            input.nextElementSibling.textContent = "";
            return true;
        }
    };

    const validateNotEmpty = (input, errorMessage) => {
        if (!input.value.trim()) {
            input.classList.add("is-invalid");
            input.nextElementSibling.textContent = errorMessage;
            return false;
        } else {
            input.classList.remove("is-invalid");
            input.nextElementSibling.textContent = "";
            return true;
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateRadioSelection = (radioGroup, errorMessage) => {
        const container = radioGroup[0]?.closest(".form-check-group");
        if (!radioGroup.some(radio => radio.checked)) {
            if (container) container.classList.add("is-invalid");
            alert(errorMessage);
            return false;
        }
        if (container) container.classList.remove("is-invalid");
        return true;
    };

    // Display saved billing details
    const displayBillingDetails = (details) => {
        let billingDetailsContainer = document.querySelector(".billing-details-container");
        if (billingDetailsContainer) billingDetailsContainer.remove(); // Clear existing details

        billingDetailsContainer = document.createElement("div");
        billingDetailsContainer.classList.add("billing-details-container", "mt-5");
        billingDetailsContainer.innerHTML = `
            <h3>Saved Billing Information</h3>
            <ul class="list-group">
                <li class="list-group-item"><strong>First Name:</strong> ${details.firstName}</li>
                <li class="list-group-item"><strong>Last Name:</strong> ${details.lastName}</li>
                <li class="list-group-item"><strong>Country:</strong> ${details.country}</li>
                <li class="list-group-item"><strong>Town:</strong> ${details.town}</li>
                <li class="list-group-item"><strong>Phone:</strong> ${details.phone}</li>
                <li class="list-group-item"><strong>Email:</strong> ${details.email}</li>
                <li class="list-group-item"><strong>Shipping Method:</strong> ${details.shippingMethod}</li>
                <li class="list-group-item"><strong>Payment Method:</strong> ${details.paymentMethod}</li>
                <li class="list-group-item"><strong>Notes:</strong> ${details.notes || "None"}</li>
            </ul>
        `;
        document.body.appendChild(billingDetailsContainer);
    };

    // Save billing details on form submission
    saveButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission

        // Validate inputs
        let isValid = true;
        isValid &= validateLettersOnly(firstNameInput, "First Name must contain only letters and be at least 2 characters long.");
        isValid &= validateLettersOnly(lastNameInput, "Last Name must contain only letters and be at least 2 characters long.");
        isValid &= validateLettersOnly(countryInput, "Country must contain only letters and be at least 2 characters long.");
        isValid &= validateLettersOnly(townInput, "Town must contain only letters and be at least 2 characters long.");
        isValid &= validatePhone(phoneInput, "Phone number must contain exactly 11 digits.");
        if (!validateNotEmpty(emailInput, "Email Address is required") || !validateEmail(emailInput.value)) {
            emailInput.classList.add("is-invalid");
            emailInput.nextElementSibling.textContent = "Enter a valid email address.";
            isValid = false;
        }

        // const shippingRadios = Array.from(document.querySelectorAll('input[name="shipping"]'));
        const paymentRadios = Array.from(document.querySelectorAll('input[name="payment"]'));
        // isValid &= validateRadioSelection(shippingRadios, "Please select a shipping method.");
        isValid &= validateRadioSelection(paymentRadios, "Please select a payment method.");

        if (isValid) {
            // Collect billing details
            const billingDetails = {
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                country: countryInput.value.trim(),
                town: townInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                notes: notesInput.value.trim(),
                // shippingMethod: document.querySelector('input[name="shipping"]:checked').id,
                paymentMethod: document.querySelector('input[name="payment"]:checked').id,
            };

            // Save billing details to localStorage
            localStorage.setItem("billingDetails", JSON.stringify(billingDetails));

            // Show success message
            alert("Billing details saved successfully!");

            // Display billing details
            displayBillingDetails(billingDetails);

            // Optionally reset the form
            form.reset();
        }
    });

    // Initialize display
    displayCartData();
});
