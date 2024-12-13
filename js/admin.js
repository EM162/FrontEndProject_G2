document.addEventListener("DOMContentLoaded", async () => {
    const dbKey = "users";

    // Initialize users array in localStorage if it doesn't exist
    if (!localStorage.getItem(dbKey)) {
        localStorage.setItem(dbKey, JSON.stringify({ users: [], customerServiceMessages: [] }));
        console.log("Users database initialized.");
    } else {
        console.log("Users database already exists in localStorage.");
    }

    // Utility Functions
    const getData = () => JSON.parse(localStorage.getItem(dbKey));
    const saveData = (data) => localStorage.setItem(dbKey, JSON.stringify(data));

    // Utility Functions for Validation
    const validateName = (name) => /^[a-zA-Z\s]{2,}$/.test(name);
    const validateBirthDate = (birthDate) => birthDate !== ""; // Ensure not empty
    const validateGender = (gender) => gender !== ""; // Ensure not empty
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\d{11}$/.test(phone); // Must be exactly 11 digits
    const validatePassword = (password) =>
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/.test(password); // At least 6 characters with letters, numbers, and special chars

    // Show Validation Error
    const showValidationError = (input, message) => {
        input.classList.add("is-invalid");
        const errorElement = input.nextElementSibling || document.createElement("div");
        errorElement.className = "invalid-feedback";
        errorElement.textContent = message;
        if (!input.nextElementSibling) input.parentNode.appendChild(errorElement);
    };

    // Clear Validation Error
    const clearValidationError = (input) => {
        input.classList.remove("is-invalid");
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains("invalid-feedback")) {
            errorElement.remove();
        }
    };

    // Clear All Validation Errors
    const clearAllValidationErrors = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => clearValidationError(input));
        });
    };

    // Fetch and Display Sellers
    const fetchSellers = () => {
        const db = getData();
        return db.users.filter(user => user.role === "seller");
    };

    const displaySellers = () => {
        const sellerTable = document.querySelector("#sellers tbody");
        const sellers = fetchSellers();
        sellerTable.innerHTML = sellers.map((seller, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${seller.name || "N/A"}</td>
                <td>${seller.BirthDate || "N/A"}</td>
                <td>${seller.Gender || "N/A"}</td>
                <td>${seller.email || "N/A"}</td>
                <td>${seller.Phone || "N/A"}</td>
                <td>${seller.password || "N/A"}</td>
                <td>
                    <img src="src/images/trash.png" class="buttonDelete" data-id="${seller.id}">
                    <img src="src/images/edit.png" class="buttonEdit" data-id="${seller.id}">
                </td>
            </tr>
        `).join("");
    };

    document.querySelector("#sellers").addEventListener("click", (event) => {
        if (event.target.classList.contains("buttonDelete")) {
            const sellerId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            db.users = db.users.filter(user => user.id !== sellerId);
            saveData(db);
            displaySellers();
            updateSellerCount();
        } else if (event.target.classList.contains("buttonEdit")) {
            const sellerId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            const seller = db.users.find((user) => user.id === sellerId);

            if (seller) {
                document.getElementById("editSellerId").value = sellerId;
                document.getElementById("sellerName").value = seller.name || "";
                document.getElementById("sellerEmail").value = seller.email || "";
                document.getElementById("sellerPassword").value = seller.password || "";
                document.getElementById("sellerBirthDate").value = seller.BirthDate || "";
                document.getElementById("sellerGender").value = seller.Gender || "";
                document.getElementById("sellerPhone").value = seller.Phone || "";

                const addSellerModal = new bootstrap.Modal(document.getElementById("addSellerModal"));
                addSellerModal.show();
            }
        }
    });

    // Fetch and Display Users
    const fetchUsers = () => {
        const db = getData();
        return db.users.filter(user => user.role === "customer");
    };

    const displayUsers = () => {
        const userTable = document.querySelector("#users tbody");
        const users = fetchUsers();
        userTable.innerHTML = users.map((user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${user.name || "N/A"}</td>
                <td>${user.BirthDate || "N/A"}</td>
                <td>${user.Gender || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.Phone || "N/A"}</td>
                <td>${user.password || "N/A"}</td>
                <td>
                    <img src="src/images/trash.png" class="buttonDelete" data-id="${user.id}">
                    <img src="src/images/reset-password.png" class="buttonReset" data-id="${user.id}">
                    <img src="src/images/edit.png" class="buttonEdit" data-id="${user.id}">
                </td>
            </tr>
        `).join("");
    };

    document.querySelector("#users").addEventListener("click", (event) => {
        if (event.target.classList.contains("buttonDelete")) {
            const userId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            db.users = db.users.filter(user => user.id !== userId);
            saveData(db);
            displayUsers();
            updateUserCount();
        } else if (event.target.classList.contains("buttonEdit")) {
            const userId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            const user = db.users.find((user) => user.id === userId);

            if (user) {
                document.getElementById("editUserId").value = userId;
                document.getElementById("userName").value = user.name || "";
                document.getElementById("userEmail").value = user.email || "";
                document.getElementById("userPassword").value = user.password || "";
                document.getElementById("userBirthDate").value = user.BirthDate || "";
                document.getElementById("userGender").value = user.Gender || "";
                document.getElementById("userPhone").value = user.Phone || "";

                const addUserModal = new bootstrap.Modal(document.getElementById("addUserModal"));
                addUserModal.show();
            }
        }
    });

    // Fetch and Display Messages
    const customerServiceTable = document.querySelector("#support tbody");
    const fetchMessages = () => getData().customerServiceMessages || [];

    const displayMessages = () => {
        const messages = fetchMessages();
        customerServiceTable.innerHTML = messages.length
            ? messages.map((msg, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${msg.name || "N/A"}</td>
                    <td>${msg.message || "N/A"}</td>
                    <td>${msg.status || "Pending"}</td>
                    <td>
                        <button class="btn btn-light btn-sm buttonRespond" data-id="${msg.id}" ${msg.status === "Resolved" ? "disabled" : ""}>Respond</button>
                        <button class="btn btn-success btn-sm buttonResolve" data-id="${msg.id}" ${msg.status === "Resolved" ? "disabled" : ""}>Mark as Resolved</button>
                    </td>
                </tr>
            `).join("")
            : `<tr><td colspan="5" class="text-center">No messages to display</td></tr>`;
    };

    customerServiceTable.addEventListener("click", (event) => {
        const messageId = Number(event.target.getAttribute("data-id"));
        const db = getData();

        if (event.target.classList.contains("buttonRespond")) {
            const message = db.customerServiceMessages.find(msg => msg.id === messageId);
            if (message?.status === "Resolved") {
                alert("This message has already been resolved.");
                return;
            }
            window.location.href = `messages.html?messageId=${messageId}`;
        }

        if (event.target.classList.contains("buttonResolve")) {
            const message = db.customerServiceMessages.find(msg => msg.id === messageId);
            if (message) {
                message.status = "Resolved";
                saveData(db);
                displayMessages();
            }
        }
    });

    // Handle Edit Button Click for Users and Sellers
    document.querySelector("#users").addEventListener("click", (event) => {
        if (event.target.classList.contains("buttonEdit")) {
            const userId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            const user = db.users.find((user) => user.id === userId);

            if (user) {
                document.getElementById("editUserId").value = userId;
                document.getElementById("userName").value = user.name || "";
                document.getElementById("userEmail").value = user.email || "";
                document.getElementById("userPassword").value = user.password || "";
                document.getElementById("userBirthDate").value = user.BirthDate || "";
                document.getElementById("userGender").value = user.Gender || "";
                document.getElementById("userPhone").value = user.Phone || "";

                const addUserModal = new bootstrap.Modal(document.getElementById("addUserModal"));
                addUserModal.show();
            }
        }
    });

    document.querySelector("#sellers").addEventListener("click", (event) => {
        if (event.target.classList.contains("buttonEdit")) {
            const sellerId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            const seller = db.users.find((user) => user.id === sellerId);

            if (seller) {
                document.getElementById("editSellerId").value = sellerId;
                document.getElementById("sellerName").value = seller.name || "";
                document.getElementById("sellerEmail").value = seller.email || "";
                document.getElementById("sellerPassword").value = seller.password || "";
                document.getElementById("sellerBirthDate").value = seller.BirthDate || "";
                document.getElementById("sellerGender").value = seller.Gender || "";
                document.getElementById("sellerPhone").value = seller.Phone || "";

                const addSellerModal = new bootstrap.Modal(document.getElementById("addSellerModal"));
                addSellerModal.show();
            }
        }
    });

    // Check for Duplicate Email or Phone
    const isDuplicateEmail = (email, userId = null) => {
        const db = getData();
        return db.users.some(user => user.email === email && user.id !== Number(userId));
    };

    const isDuplicatePhone = (phone, userId = null) => {
        const db = getData();
        return db.users.some(user => user.Phone === phone && user.id !== Number(userId));
    };

    // Add New User Form Submission
    document.getElementById("addUserForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const userId = document.getElementById("editUserId").value;
        const userName = document.getElementById("userName").value.trim();
        const userEmail = document.getElementById("userEmail").value.trim();
        const userPassword = document.getElementById("userPassword").value.trim();
        const userBirthDate = document.getElementById("userBirthDate").value.trim();
        const userGender = document.getElementById("userGender").value.trim();
        const userPhone = document.getElementById("userPhone").value.trim();

        // Validation
        let isValid = true;

        if (!validateName(userName)) {
            showValidationError(document.getElementById("userName"), "Name must contain only letters and at least 2 characters.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("userName"));
        }

        if (!validateEmail(userEmail)) {
            showValidationError(document.getElementById("userEmail"), "Please enter a valid email address.");
            isValid = false;
        } else if (isDuplicateEmail(userEmail, userId)) {
            showValidationError(document.getElementById("userEmail"), "This email is already registered.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("userEmail"));
        }

        if (!validatePassword(userPassword)) {
            showValidationError(document.getElementById("userPassword"), "Password must be at least 6 characters with letters, numbers, and special chars.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("userPassword"));
        }

        if (!validatePhone(userPhone)) {
            showValidationError(document.getElementById("userPhone"), "Phone must be exactly 11 digits.");
            isValid = false;
        } else if (isDuplicatePhone(userPhone, userId)) {
            showValidationError(document.getElementById("userPhone"), "This phone number is already registered.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("userPhone"));
        }

        if (isValid) {
            const db = getData();
            const user = {
                id: userId ? Number(userId) : Date.now(),
                name: userName,
                email: userEmail,
                password: userPassword,
                BirthDate: userBirthDate,
                Gender: userGender,
                Phone: userPhone,
                role: "customer"
            };

            if (userId) {
                // Update existing user
                db.users = db.users.map(u => u.id === Number(userId) ? user : u);
            } else {
                // Add new user
                db.users.push(user);
            }

            saveData(db);
            displayUsers();
            updateUserCount();

            // Close modal and reset form
            const addUserModal = bootstrap.Modal.getInstance(document.getElementById("addUserModal"));
            addUserModal.hide();
            document.getElementById("addUserForm").reset();
            document.getElementById("editUserId").value = "";
        }
    });

    // Handle Reset Button Click
    document.querySelector("#users").addEventListener("click", (event) => {
        if (event.target.classList.contains("buttonReset")) {
            const userId = Number(event.target.getAttribute("data-id"));

            // Set the user ID in the hidden input
            document.getElementById("resetUserId").value = userId;

            // Clear the password field
            const newPasswordInput = document.getElementById("newPassword");
            newPasswordInput.value = ""; // Clear the input field
            clearValidationError(newPasswordInput); // Clear any previous validation errors

            // Show the modal
            const resetPasswordModal = new bootstrap.Modal(document.getElementById("resetPasswordModal"));
            resetPasswordModal.show();
        }
    });

    // Handle Password Reset Form Submission
    document.getElementById("resetPasswordForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const newPasswordInput = document.getElementById("newPassword");
        const userId = Number(document.getElementById("resetUserId").value);

        // Validate the new password
        const newPassword = newPasswordInput.value.trim();
        if (!validatePassword(newPassword)) {
            showValidationError(newPasswordInput, "Password must be at least 6 characters and include letters, numbers, and special characters.");
            return;
        } else {
            clearValidationError(newPasswordInput);
        }

        // Update the password in the database
        const db = getData();
        const user = db.users.find((user) => user.id === userId);
        if (user) {
            user.password = newPassword;
            saveData(db);

            // Refresh the table
            displayUsers();

            // Close the modal
            const resetPasswordModal = bootstrap.Modal.getInstance(document.getElementById("resetPasswordModal"));
            resetPasswordModal.hide();

            // alert("Password updated successfully!");
        }
    });

    // Clear the Add User Modal Fields
    document.getElementById("adduser").addEventListener("click", () => {
        document.getElementById("addUserForm").reset(); // Reset the form
        document.getElementById("editUserId").value = ""; // Clear hidden edit ID field
        clearAllValidationErrors(); // Clear validation errors if any
    });

    // Add New Seller Form Submission
    document.getElementById("addSellerForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const sellerId = document.getElementById("editSellerId").value;
        const sellerName = document.getElementById("sellerName").value.trim();
        const sellerEmail = document.getElementById("sellerEmail").value.trim();
        const sellerPassword = document.getElementById("sellerPassword").value.trim();
        const sellerBirthDate = document.getElementById("sellerBirthDate").value.trim();
        const sellerGender = document.getElementById("sellerGender").value.trim();
        const sellerPhone = document.getElementById("sellerPhone").value.trim();

        // Validation
        let isValid = true;

        if (!validateName(sellerName)) {
            showValidationError(document.getElementById("sellerName"), "Name must contain only letters and at least 2 characters.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("sellerName"));
        }

        if (!validateBirthDate(sellerBirthDate)) {
            showValidationError(document.getElementById("sellerBirthDate"), "Birth Date cannot be empty.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("sellerBirthDate"));
        }

        if (!validateGender(sellerGender)) {
            showValidationError(document.getElementById("sellerGender"), "Gender cannot be empty.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("sellerGender"));
        }

        if (!validateEmail(sellerEmail)) {
            showValidationError(document.getElementById("sellerEmail"), "Please enter a valid email address.");
            isValid = false;
        } else {
            if (isDuplicateEmail(sellerEmail, sellerId)) {
                showValidationError(document.getElementById("sellerEmail"), "This email is already in use.");
                isValid = false;
            } else {
                clearValidationError(document.getElementById("sellerEmail"));
            }
        }

        if (!validatePhone(sellerPhone)) {
            showValidationError(document.getElementById("sellerPhone"), "Phone must be 11 digits and contain only numbers.");
            isValid = false;
        } else {
            if (isDuplicatePhone(sellerPhone, sellerId)) {
                showValidationError(document.getElementById("sellerPhone"), "This phone number is already in use.");
                isValid = false;
            } else {
                clearValidationError(document.getElementById("sellerPhone"));
            }
        }

        if (!validatePassword(sellerPassword)) {
            showValidationError(document.getElementById("sellerPassword"), "Password must be at least 6 characters and include letters, numbers, and special characters.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("sellerPassword"));
        }

        if (!isValid) return;

        const db = getData();
        const seller = {
            id: sellerId ? Number(sellerId) : Date.now(),
            name: sellerName,
            email: sellerEmail,
            password: sellerPassword,
            BirthDate: sellerBirthDate,
            Gender: sellerGender,
            Phone: sellerPhone,
            role: "seller"
        };

        if (sellerId) {
            // Update existing seller
            db.users = db.users.map(u => u.id === Number(sellerId) ? seller : u);
        } else {
            // Add new seller
            db.users.push(seller);
        }

        saveData(db);
        displaySellers();
        updateSellerCount();

        const addSellerModal = bootstrap.Modal.getInstance(document.getElementById("addSellerModal"));
        addSellerModal.hide();
        document.getElementById("addSellerForm").reset();
        document.getElementById("editSellerId").value = "";
    });

    // Clear the Add Seller Modal Fields
    document.getElementById("addseller").addEventListener("click", () => {
        document.getElementById("addSellerForm").reset(); // Reset the form
        document.getElementById("editSellerId").value = ""; // Clear hidden edit ID field
        clearAllValidationErrors(); // Clear validation errors if any
    });

    // Update Total Users Count
    const updateUserCount = () => {
        const totalUsers = fetchUsers().length; // Fetch users and get the count
        document.getElementById("totalUsers").textContent = totalUsers;
    };

    // Update Total Sellers Count
    const updateSellerCount = () => {
        const totalSellers = fetchSellers().length; // Fetch sellers and get the count
        document.getElementById("totalSellers").textContent = totalSellers;
    };

    // Initialize Page
    displaySellers();
    displayUsers();
    displayMessages();
    updateUserCount();
    updateSellerCount();
});