document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const saveButton = document.querySelector(".Save");

    // Validation Functions
    const validateLettersOnly = (input, errorMessage) => {
        const regex = /^[a-zA-Z\s]{2,}$/;
        const errorElement = getNextSibling(input, "error-message");
        if (!regex.test(input.value.trim())) {
            showError(input, errorElement, errorMessage);
            return false;
        }
        clearError(input, errorElement);
        return true;
    };

    const validateEmail = (input, errorMessage) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = getNextSibling(input, "error-message");
        if (!regex.test(input.value.trim())) {
            showError(input, errorElement, errorMessage);
            return false;
        }
        clearError(input, errorElement);
        return true;
    };

    const validateNotEmpty = (input, errorMessage) => {
        const errorElement = getNextSibling(input, "error-message");
        if (!input.value.trim()) {
            showError(input, errorElement, errorMessage);
            return false;
        }
        clearError(input, errorElement);
        return true;
    };

    // Helper Functions
    const showError = (input, errorElement, message) => {
        input.classList.add("is-invalid");
        if (errorElement) errorElement.textContent = message;
    };

    const clearError = (input, errorElement) => {
        input.classList.remove("is-invalid");
        if (errorElement) errorElement.textContent = "";
    };

    const getNextSibling = (input, className) => {
        return input.nextElementSibling && input.nextElementSibling.classList.contains(className)
            ? input.nextElementSibling
            : null;
    };

    const getBookstoreDB = () => {
        return JSON.parse(localStorage.getItem("bookstoreDB")) || {};
    };

    const saveBookstoreDB = (data) => {
        localStorage.setItem("bookstoreDB", JSON.stringify(data));
    };

    // Save Button Event Listener
    saveButton.addEventListener("click", (event) => {
        event.preventDefault();

        // Validate Fields
        let isValid = true;
        isValid &= validateLettersOnly(nameInput, "Name must contain only letters and at least 2 characters.");
        isValid &= validateEmail(emailInput, "Please enter a valid email address.");
        isValid &= validateNotEmpty(messageInput, "Message cannot be empty.");

        // If all fields are valid, save to the database
        if (isValid) {
            const newMessage = {
                id: Date.now(), // Unique ID for each message
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                status: "Open", // Default status
                response: null,
            };

            // Retrieve the current database
            const db = getBookstoreDB();

            // Ensure customerServiceMessages array exists
            if (!db.customerServiceMessages) {
                db.customerServiceMessages = [];
            }

            // Add the new message to the array
            db.customerServiceMessages.push(newMessage);

            // Save the updated database back to localStorage
            saveBookstoreDB(db);

            // Show success message
            alert("Your message has been sent successfully!");

            // Optionally reset the form
            form.reset();
        }
    });
});
