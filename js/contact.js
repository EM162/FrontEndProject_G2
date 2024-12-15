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
      return input.nextElementSibling &&
        input.nextElementSibling.classList.contains(className)
        ? input.nextElementSibling
        : null;
    };
  
    const getBookstoreDB = () => {
      return JSON.parse(localStorage.getItem("users")) || {};
    };
  
    const saveBookstoreDB = (data) => {
      localStorage.setItem("users", JSON.stringify(data));
    };
  
    // Save Button Event Listener
    saveButton.addEventListener("click", (event) => {
<<<<<<< HEAD
      event.preventDefault();
      if (!currentUser) {
        Toastify({
          text: "Please login first to send a message.",
          duration: 3000,
          gravity: "top",
          position: "right",
=======
        event.preventDefault();
    if (!currentUser) {
      Toastify({
        text: "Please login first to send a message.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#dc3545",
        },
      }).showToast();

      return;
    }
        // Validate Fields
        let isValid = true;
    isValid &= validateLettersOnly(
      nameInput,
      "Name must contain only letters and at least 2 characters."
    );
        isValid &= validateEmail(emailInput, "Please enter a valid email address.");
        isValid &= validateNotEmpty(messageInput, "Message cannot be empty.");

        // If all fields are valid, save to the database
        if (isValid) {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        Toastify({
          text: "Please sign in to send a message",
          duration: 3000,
          gravity: "top",
          position: "center",
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654
          style: {
            background: "#dc3545",
          },
        }).showToast();
<<<<<<< HEAD
  
        return;
      }
      // Validate Fields
      let isValid = true;
      isValid &= validateLettersOnly(
        nameInput,
        "Name must contain only letters and at least 2 characters."
      );
      isValid &= validateEmail(emailInput, "Please enter a valid email address.");
      isValid &= validateNotEmpty(messageInput, "Message cannot be empty.");
  
      // If all fields are valid, save to the database
      if (isValid) {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          Toastify({
            text: "Please sign in to send a message",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
              background: "#dc3545",
            },
          }).showToast();
          return;
=======
        return;
      }

            const newMessage = {
                id: Date.now(), // Unique ID for each message
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                status: "Open", // Default status
                response: null,
        timestamp: new Date().toISOString(),
            };

      // Get all users
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Find the current user in the users array
      const userIndex = users.findIndex(
        (user) => user.email === currentUser.email
      );
      if (userIndex === -1) {
        Toastify({
          text: "Error saving message. Please try again.",
          duration: 3000,
          gravity: "top",
          position: "center",
          style: {
            background: "#dc3545",
          },
        }).showToast();
        return;
      }

      // Initialize customerServiceMessages array if it doesn't exist
      if (!users[userIndex].customerServiceMessages) {
        users[userIndex].customerServiceMessages = [];
            }

      // Add the new message
      users[userIndex].customerServiceMessages.push(newMessage);
      // Save back to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
      Toastify({
        text: "Your message has been sent successfully!",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
          background: "#28a745",
        },
      }).showToast();
            // Show success message

            // Optionally reset the form
            form.reset();
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654
        }
  
        const newMessage = {
          id: Date.now(), // Unique ID for each message
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim(),
          status: "Open", // Default status
          response: null,
          timestamp: new Date().toISOString(),
        };
  
        // Get all users
        const users = JSON.parse(localStorage.getItem("users")) || [];
  
        // Find the current user in the users array
        const userIndex = users.findIndex(
          (user) => user.email === currentUser.email
        );
        if (userIndex === -1) {
          Toastify({
            text: "Error saving message. Please try again.",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
              background: "#dc3545",
            },
          }).showToast();
          return;
        }
  
        // Initialize customerServiceMessages array if it doesn't exist
        if (!users[userIndex].customerServiceMessages) {
          users[userIndex].customerServiceMessages = [];
        }
  
        // Add the new message
        users[userIndex].customerServiceMessages.push(newMessage);
        // Save back to localStorage
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
        Toastify({
          text: "Your message has been sent successfully!",
          duration: 3000,
          gravity: "top",
          position: "center",
          style: {
            background: "#28a745",
          },
        }).showToast();
        // Show success message
  
        // Optionally reset the form
        form.reset();
      }
    });
  });
  