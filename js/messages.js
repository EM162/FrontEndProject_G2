document.addEventListener("DOMContentLoaded", () => {
    const messageDetailsContainer = document.getElementById("messageDetails");
    const responseForm = document.getElementById("responseForm");
    const responseInput = document.getElementById("response");

    // Utility Functions
    const getBookstoreDB = () => JSON.parse(localStorage.getItem("bookstoreDB")) || {};
    const saveBookstoreDB = (data) => localStorage.setItem("bookstoreDB", JSON.stringify(data));

    // Fetch message ID from URL
    const params = new URLSearchParams(window.location.search);
    const messageId = params.get("messageId");

    // Fetch messages from localStorage
    // const messages = JSON.parse(localStorage.getItem("customerServiceMessages")) || [];
    // const message = messages.find((msg) => msg.id == messageId);

    // Fetch messages from the bookstoreDB
    const db = getBookstoreDB();
    const messages = db.customerServiceMessages || [];
    const message = messages.find((msg) => msg.id == messageId);

    // Display message details
    if (message) {
        messageDetailsContainer.innerHTML = `
            <br>
            <p><strong>Name:</strong> ${message.name}</p><br>
            <p><strong>Email:</strong> ${message.email}</p><br>
            <p><strong>Message:</strong> ${message.message}</p><br>
            <p><strong>Status:</strong> ${message.status}</p><br>
        `;
        responseInput.value = message.response || "";
    } else {
        messageDetailsContainer.innerHTML = `<p class="text-danger">Message not found!</p>`;
        responseForm.style.display = "none";
    }

    // Handle response form submission
    responseForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const response = responseInput.value.trim();

        // Validation: Ensure response is not empty
        if (!response) {
            responseInput.classList.add("is-invalid");
            const errorElement = document.querySelector("#response + .invalid-feedback");
            if (!errorElement) {
                const error = document.createElement("div");
                error.className = "invalid-feedback";
                error.textContent = "Response cannot be empty.";
                responseInput.parentNode.appendChild(error);
            }
            return; // Stop form submission
        }

        // Clear any previous error if input is valid
        responseInput.classList.remove("is-invalid");
        const errorElement = document.querySelector("#response + .invalid-feedback");
        if (errorElement) {
            errorElement.remove();
        }

        // Save the response and update the message
        message.response = response;
        message.status = "Responded"; // Update the status

        // Save the updated database back to localStorage
        db.customerServiceMessages = messages; // Update messages in the database
        saveBookstoreDB(db);

        alert("Response sent successfully!");
        window.location.href = "AdminPanel.html"; // Redirect to admin page
    });
});

