document.addEventListener("DOMContentLoaded", async () => {
  // Get users array from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Utility Functions
  const saveUsers = () => localStorage.setItem("users", JSON.stringify(users));

  // Fetch and Display Sellers
  const fetchSellers = () => {
    users = JSON.parse(localStorage.getItem("users")) || [];
    // console.log(users);

    return users.filter((user) => user.role === "seller");
  };

  const displaySellers = () => {
    const sellerTable = document.querySelector("#sellers tbody");
    const sellers = fetchSellers();
    sellerTable.innerHTML = sellers
      .map(
        (seller, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${seller.firstName} ${seller.lastName || ""}</td>
                <td>${seller.birthday || "N/A"}</td>
                <td>${seller.gender || "N/A"}</td>
                <td>${seller.email || "N/A"}</td>
                <td>${seller.phone || "N/A"}</td>
                <td>${seller.password || "N/A"}</td>
                <td>
                    <img src="src/images/trash.png" class="buttonDelete" data-id="${
                      seller.email
                    }">
                    <img src="src/images/edit.png" class="buttonEdit" data-id="${
                      seller.email
                    }">
                </td>
            </tr>
        `
      )
      .join("");

    // Update seller count
    document.getElementById("totalSellers").textContent = sellers.length;
  };

  // Delete and Edit Seller Event Listeners
  document.querySelector("#sellers").addEventListener("click", (event) => {
    if (event.target.classList.contains("buttonDelete")) {
      const sellerEmail = event.target.getAttribute("data-id");
      users = users.filter((user) => user.email !== sellerEmail);
      saveUsers();
      displaySellers();
    } else if (event.target.classList.contains("buttonEdit")) {
      const sellerEmail = event.target.getAttribute("data-id");
      const seller = users.find((user) => user.email === sellerEmail);

      if (seller) {
        document.getElementById("editSellerId").value = sellerEmail;
        document.getElementById("sellerName").value =
          seller.firstName + " " + (seller.lastName || "");
        document.getElementById("sellerEmail").value = seller.email;
        document.getElementById("sellerPassword").value = seller.password;
        document.getElementById("sellerBirthDate").value = seller.birthday;
        document.getElementById("sellerGender").value = seller.gender;
        document.getElementById("sellerPhone").value = seller.phone;

        const addSellerModal = new bootstrap.Modal(
          document.getElementById("addSellerModal")
        );
        addSellerModal.show();
      }
    }
  });

  // Add New Seller Form Submission
  document
    .getElementById("addSellerForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const sellerEmail = document.getElementById("editSellerId").value;
      const fullName = document.getElementById("sellerName").value.trim();
      const [firstName, ...lastNameParts] = fullName.split(" ");
      const lastName = lastNameParts.join(" ");
      const email = document.getElementById("sellerEmail").value.trim();
      const password = document.getElementById("sellerPassword").value.trim();
      const birthday = document.getElementById("sellerBirthDate").value.trim();
      const gender = document.getElementById("sellerGender").value.trim();
      const phone = document.getElementById("sellerPhone").value.trim();

      // Validation
      let isValid = true;

      const nameValidation = validateName(fullName);
      if (!nameValidation.isValid) {
        showValidationError(
          document.getElementById("sellerName"),
          nameValidation.message
        );
        isValid = false;
      } else {
        clearValidationError(document.getElementById("sellerName"));
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        showValidationError(
          document.getElementById("sellerEmail"),
          emailValidation.message
        );
        isValid = false;
      } else if (!sellerEmail && users.some((u) => u.email === email)) {
        showValidationError(
          document.getElementById("sellerEmail"),
          "This email is already registered"
        );
        isValid = false;
      } else {
        clearValidationError(document.getElementById("sellerEmail"));
      }

      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.isValid) {
        showValidationError(
          document.getElementById("sellerPhone"),
          phoneValidation.message
        );
        isValid = false;
      } else if (!sellerEmail && users.some((u) => u.phone === phone)) {
        showValidationError(
          document.getElementById("sellerPhone"),
          "This phone number is already registered"
        );
        isValid = false;
      } else {
        clearValidationError(document.getElementById("sellerPhone"));
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        showValidationError(
          document.getElementById("sellerPassword"),
          passwordValidation.message
        );
        isValid = false;
      } else {
        clearValidationError(document.getElementById("sellerPassword"));
      }

      if (!isValid) return;

      const newSeller = {
        firstName,
        lastName,
        email,
        password,
        birthday,
        gender,
        phone,
        role: "seller",
        cart: [],
        history: [],
        bill: [],
        customerServiceMessages: [],
      };

      if (sellerEmail) {
        // Update existing seller
        users = users.map((u) => (u.email === sellerEmail ? newSeller : u));
      } else {
        // Add new seller
        users.push(newSeller);
      }

      saveUsers();
      displaySellers();

      const addSellerModal = bootstrap.Modal.getInstance(
        document.getElementById("addSellerModal")
      );
      addSellerModal.hide();
      document.getElementById("addSellerForm").reset();
      document.getElementById("editSellerId").value = "";

      // Show success message
      Toastify({
        text: sellerEmail
          ? "Seller updated successfully"
          : "New seller added successfully",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: {
          background: "#198754",
        },
      }).showToast();
    });

  // Fetch and Display Users
  const fetchUsers = () => {
    users = JSON.parse(localStorage.getItem("users")) || [];
    return users.filter((user) => user.role === "customer");
  };

  const displayUsers = () => {
    const userTable = document.querySelector("#users tbody");
    const customers = fetchUsers();
    userTable.innerHTML = customers
      .map(
        (user, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${user.firstName} ${user.lastName || ""}</td>
                <td>${user.birthday || "N/A"}</td>
                <td>${user.gender || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.phone || "N/A"}</td>
                <td>${user.password || "N/A"}</td>
                <td>
                    <img src="src/images/trash.png" class="buttonDelete" data-id="${
                      user.email
                    }">
                    <img src="src/images/edit.png" class="buttonEdit" data-id="${
                      user.email
                    }">
                </td>
            </tr>
        `
      )
      .join("");

    // Update user count
    document.getElementById("totalUsers").textContent = customers.length;
  };

  // Delete and Edit User Event Listeners
  document.querySelector("#users").addEventListener("click", (event) => {
    if (event.target.classList.contains("buttonDelete")) {
      const userEmail = event.target.getAttribute("data-id");
      users = users.filter((user) => user.email !== userEmail);
      saveUsers();
      displayUsers();
    } else if (event.target.classList.contains("buttonEdit")) {
      const userEmail = event.target.getAttribute("data-id");
      const user = users.find((user) => user.email === userEmail);

      if (user) {
        document.getElementById("editUserId").value = userEmail;
        document.getElementById("userName").value =
          user.firstName + " " + (user.lastName || "");
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userPassword").value = user.password;
        document.getElementById("userBirthDate").value = user.birthday;
        document.getElementById("userGender").value = user.gender;
        document.getElementById("userPhone").value = user.phone;

        const addUserModal = new bootstrap.Modal(
          document.getElementById("addUserModal")
        );
        addUserModal.show();
      }
    }
  });

  // Add New User Form Submission
  document.getElementById("addUserForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const userEmail = document.getElementById("editUserId").value;
    const fullName = document.getElementById("userName").value.trim();
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");
    const email = document.getElementById("userEmail").value.trim();
    const password = document.getElementById("userPassword").value.trim();
    const birthday = document.getElementById("userBirthDate").value.trim();
    const gender = document.getElementById("userGender").value.trim();
    const phone = document.getElementById("userPhone").value.trim();

    // Validation
    let isValid = true;

    const nameValidation = validateName(fullName);
    if (!nameValidation.isValid) {
      showValidationError(
        document.getElementById("userName"),
        nameValidation.message
      );
      isValid = false;
    } else {
      clearValidationError(document.getElementById("userName"));
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      showValidationError(
        document.getElementById("userEmail"),
        emailValidation.message
      );
      isValid = false;
    } else if (!userEmail && users.some((u) => u.email === email)) {
      showValidationError(
        document.getElementById("userEmail"),
        "This email is already registered"
      );
      isValid = false;
    } else {
      clearValidationError(document.getElementById("userEmail"));
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      showValidationError(
        document.getElementById("userPhone"),
        phoneValidation.message
      );
      isValid = false;
    } else if (!userEmail && users.some((u) => u.phone === phone)) {
      showValidationError(
        document.getElementById("userPhone"),
        "This phone number is already registered"
      );
      isValid = false;
    } else {
      clearValidationError(document.getElementById("userPhone"));
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showValidationError(
        document.getElementById("userPassword"),
        passwordValidation.message
      );
      isValid = false;
    } else {
      clearValidationError(document.getElementById("userPassword"));
    }

    if (isValid) {
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        birthday,
        gender,
        phone,
        role: "customer",
        cart: [],
        history: [],
        bill: [],
        customerServiceMessages: [],
      };

      if (userEmail) {
        // Update existing user
        const index = users.findIndex((u) => u.email === userEmail);
        if (index !== -1) {
          users[index] = { ...users[index], ...newUser };
        }
      } else {
        // Add new user
        users.push(newUser);
      }

      saveUsers();
      displayUsers();

      // Close modal and reset form
      const addUserModal = bootstrap.Modal.getInstance(
        document.getElementById("addUserModal")
      );
      addUserModal.hide();
      document.getElementById("addUserForm").reset();
      document.getElementById("editUserId").value = "";
    }
  });

  // Utility Functions
  const getData = () => JSON.parse(localStorage.getItem("users"));
  const saveData = (data) =>
    localStorage.setItem("users", JSON.stringify(data));

  // Utility Functions for Validation
  const validateName = (name) => {
    if (!name) return { isValid: false, message: "Name is required" };
    if (!/^[a-zA-Z\s]{2,}$/.test(name))
      return {
        isValid: false,
        message:
          "Name must contain only letters and be at least 2 characters long",
      };
    return { isValid: true, message: "" };
  };

  const validateBirthDate = (birthDate) => {
    if (!birthDate)
      return { isValid: false, message: "Birth date is required" };
    const date = new Date(birthDate);
    const today = new Date();
    if (date > today)
      return { isValid: false, message: "Birth date cannot be in the future" };
    if (date.getFullYear() < 1900)
      return { isValid: false, message: "Invalid birth date" };
    return { isValid: true, message: "" };
  };

  const validateGender = (gender) => {
    if (!gender) return { isValid: false, message: "Gender is required" };
    if (!["Male", "Female"].includes(gender))
      return { isValid: false, message: "Invalid gender selection" };
    return { isValid: true, message: "" };
  };

  const validateEmail = (email) => {
    if (!email) return { isValid: false, message: "Email is required" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return { isValid: false, message: "Please enter a valid email address" };
    return { isValid: true, message: "" };
  };

  const validatePhone = (phone) => {
    if (!phone) return { isValid: false, message: "Phone number is required" };
    if (!/^\d{11}$/.test(phone))
      return { isValid: false, message: "Phone must be exactly 11 digits" };
    return { isValid: true, message: "" };
  };

  const validatePassword = (password) => {
    if (!password) return { isValid: false, message: "Password is required" };
    if (password.length < 6)
      return {
        isValid: false,
        message: "Password must be at least 6 characters long",
      };
    if (!/(?=.*[a-zA-Z])/.test(password))
      return {
        isValid: false,
        message: "Password must contain at least one letter",
      };
    if (!/(?=.*\d)/.test(password))
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    if (!/(?=.*[!@#$%^&*])/.test(password))
      return {
        isValid: false,
        message:
          "Password must contain at least one special character (!@#$%^&*)",
      };
    return { isValid: true, message: "" };
  };

  // Show Validation Error
  const showValidationError = (input, message) => {
    input.classList.add("is-invalid");
    const errorElement =
      input.nextElementSibling || document.createElement("div");
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
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      const inputs = form.querySelectorAll(".form-control");
      inputs.forEach((input) => clearValidationError(input));
    });
  };

  // Initialize users array in localStorage if it doesn't exist
  if (!localStorage.getItem("users")) {
    localStorage.setItem(
      "users",
      JSON.stringify({
        users: [],
      })
    );
    console.log("Users database initialized.");
  } else {
    const db = getData();
    console.log("Users database already exists in localStorage.");
  }

  // Fetch and Display Messages
  const customerServiceTable = document.querySelector("#support tbody");

  const test = getData().map((user) =>
    user?.customerServiceMessages ? user?.customerServiceMessages : [] || []
  );

  // Flatten the array and remove empty values
  const fetchMessages = test.flat().filter(Boolean);

  console.log(fetchMessages);
  //   <button class="btn btn-light btn-sm buttonRespond" data-id="${
  //               msg.id
  //             }" ${
  //   msg.status === "Resolved" ? "disabled" : ""
  // }>Respond</button>
  const displayMessages = () => {
    const messages = fetchMessages || [];
    customerServiceTable.innerHTML = messages.length
      ? messages
          .map(
            (msg, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${msg.name || "N/A"}</td>
                    <td>${msg.message || "N/A"}</td>
                    <td>${msg.status || "Pending"}</td>
                    <td>
            
                        <button class="btn btn-success btn-sm buttonResolve" data-id="${
                          msg.id
                        }" ${
              msg.status === "Resolved" ? "disabled" : ""
            }>Mark as Resolved</button>
                    </td>
                </tr>
            `
          )
          .join("")
      : `<tr><td colspan="5" class="text-center">No messages to display</td></tr>`;
  };

  customerServiceTable.addEventListener("click", (event) => {
    const messageId = Number(event.target.getAttribute("data-id"));

    const customerServiceMessages = getData()
      .flatMap((user) => user?.customerServiceMessages || [])
      .filter(Boolean);

    if (event.target.classList.contains("buttonRespond")) {
      const message = customerServiceMessages.find(
        (msg) => msg.id === messageId
      );
      console.log(message);
      if (message?.status === "Resolved") {
        alert("This message has already been resolved.");
        return;
      }
      //   window.location.href = `messages.html?messageId=${messageId}`;
    }

    if (event.target.classList.contains("buttonResolve")) {
      const message = customerServiceMessages.find(
        (msg) => msg.id === messageId
      );

      if (message) {
        const db = getData();
        const updatedDb = db.map((user) => {
          if (user.customerServiceMessages) {
            user.customerServiceMessages = user.customerServiceMessages.map(
              (msg) => {
                if (msg.id === messageId) {
                  msg.status = "Resolved";
                }
                return msg;
              }
            );
          }
          return user;
        });
        saveData(updatedDb);
        // Refresh the messages data
        const test = getData().map((user) =>
          user?.customerServiceMessages
            ? user?.customerServiceMessages
            : [] || []
        );
        fetchMessages.length = 0;
        fetchMessages.push(...test.flat().filter(Boolean));
        displayMessages();
      }
    }
  });

  // Handle Edit Button Click for Users and Sellers
  document.querySelector("#users").addEventListener("click", (event) => {
    if (event.target.classList.contains("buttonEdit")) {
      const userId = Number(event.target.getAttribute("data-id"));
      const db = getData();
      const user = db.users.find((user) => user.email === userId);

      if (user) {
        document.getElementById("editUserId").value = userId;
        document.getElementById("userName").value =
          user.firstName + " " + (user.lastName || "");
        document.getElementById("userEmail").value = user.email;
        document.getElementById("userPassword").value = user.password;
        document.getElementById("userBirthDate").value = user.birthday;
        document.getElementById("userGender").value = user.gender;
        document.getElementById("userPhone").value = user.phone;

        const addUserModal = new bootstrap.Modal(
          document.getElementById("addUserModal")
        );
        addUserModal.show();
      }
    }
  });
  document.querySelector("#sellers").addEventListener("click", (event) => {
    if (event.target.classList.contains("buttonEdit")) {
      const sellerId = Number(event.target.getAttribute("data-id"));
      const db = getData();
      const seller = db.users.find((seller) => seller.email === sellerId);

      if (seller) {
        document.getElementById("editSellerId").value = sellerId;
        document.getElementById("sellerName").value =
          seller.firstName + " " + (seller.lastName || "");
        document.getElementById("sellerEmail").value = seller.email;
        document.getElementById("sellerPassword").value = seller.password;
        document.getElementById("sellerBirthDate").value = seller.birthday;
        document.getElementById("sellerGender").value = seller.gender;
        document.getElementById("sellerPhone").value = seller.phone;

        const addSellerModal = new bootstrap.Modal(
          document.getElementById("addSellerModal")
        );
        addSellerModal.show();
      }
    }
  });

  // Check for Duplicate Email or Phone
  const isDuplicateEmail = (email, userId = null) => {
    const db = getData();
    return db.users.some(
      (user) => user.email === email && user.email !== userId
    );
  };

  const isDuplicatePhone = (phone, userId = null) => {
    const db = getData();
    return db.users.some(
      (user) => user.phone === phone && user.email !== userId
    );
  };

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
      const resetPasswordModal = new bootstrap.Modal(
        document.getElementById("resetPasswordModal")
      );
      resetPasswordModal.show();
    }
  });

  // Handle Password Reset Form Submission
  document
    .getElementById("resetPasswordForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const newPasswordInput = document.getElementById("newPassword");
      const userId = Number(document.getElementById("resetUserId").value);

      // Validate the new password
      const newPassword = newPasswordInput.value.trim();
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        showValidationError(newPasswordInput, passwordValidation.message);
        return;
      } else {
        clearValidationError(newPasswordInput);
      }

      // Update the password in the database
      const db = getData();
      const user = db.users.find((user) => user.email === userId);
      if (user) {
        user.password = newPassword;
        saveData(db);

        // Refresh the table
        displayUsers();

        // Close the modal
        const resetPasswordModal = bootstrap.Modal.getInstance(
          document.getElementById("resetPasswordModal")
        );
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

  // Update Total Users Count
  const updateUserCount = () => {
    const totalUsers = fetchUsers().length; // Fetch users and get the count
    document.getElementById("totalUsers").textContent = totalUsers;
  };

  // Update Total Sellers Count
  const updateSellerCount = () => {
    const sellers = fetchSellers();
    document.getElementById("totalSellers").textContent = sellers.length;
  };


//---------------------------------------------------------------------------------------------------------------------------------------------------------

if (!localStorage.getItem("sellerDashboard")) {
  localStorage.setItem("sellerDashboard", JSON.stringify([]));
}
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify([]));
}

  // Fetch sellerDashboard from localStorage
const getSellerDashboard = () => JSON.parse(localStorage.getItem("sellerDashboard")) || [];

// Save sellerDashboard back to localStorage
const saveSellerDashboard = (dashboardArray) => {
    localStorage.setItem("sellerDashboard", JSON.stringify(dashboardArray));
};

// Add or Update Seller Dashboard Credentials
const addOrUpdateSellerDashboard = (sellerEmail, dashboardId, dashboardPassword) => {
  let sellerDashboard = getSellerDashboard();
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if the email exists in the users array as a seller
  const validSeller = users.some((user) => user.email === sellerEmail && user.role === "seller");

  if (!validSeller) {
      // If the email is not found as a seller, show an alert and return
      alert("Sorry, you are not a valid seller.");
      return;
  }

  // Check if the seller already exists in sellerDashboard
  const existingIndex = sellerDashboard.findIndex((s) => s.email === sellerEmail);

  if (existingIndex > -1) {
      // Update existing credentials
      sellerDashboard[existingIndex].dashboardId = dashboardId;
      sellerDashboard[existingIndex].dashboardPassword = dashboardPassword;
  } else {
      // Add new credentials
      sellerDashboard.push({
          email: sellerEmail,
          dashboardId,
          dashboardPassword,
      });
  }

  // Save the updated sellerDashboard array to localStorage
  saveSellerDashboard(sellerDashboard);
};



const displaySellersWithCredentials = () => {
  const sellerDashboardTableBody = document.querySelector("#sellerDashboardTableBody");
  const sellerDashboard = getSellerDashboard();
  const sellers = fetchSellers();

  // Filter sellers who have dashboard credentials
  const sellersWithCredentials = sellers.filter((seller) =>
      sellerDashboard.some((entry) => entry.email === seller.email)
  );

  sellerDashboardTableBody.innerHTML = sellersWithCredentials
      .map((seller, index) => {
          const dashboardEntry = sellerDashboard.find((s) => s.email === seller.email) || {};
          return `
              <tr>
                  <td>${index + 1}</td>
                  <td>${dashboardEntry.email || ""}</td>
                  <td>${dashboardEntry.dashboardId || "Not Assigned"}</td>
                  <td>${dashboardEntry.dashboardPassword || "Not Assigned"}</td>
                  <td>
                      <img src="src/images/trash.png" class="buttonDelete" data-id="${seller.email}">
                      <img src="src/images/edit.png" class="buttonEdit" data-id="${seller.email}">
                      <button class="btn btn-secondary btn-sm ms-3 buttonDashboard" data-id="${seller.email}">Dashboard</button>
                  </td>
              </tr>`;
      })
      .join("");
};



document.getElementById("addNewRowForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("newSellerEmail").value.trim();
  const dashboardId = document.getElementById("newDashboardId").value.trim();
  const dashboardPassword = document.getElementById("newDashboardPassword").value.trim();

  // Validate Inputs
  if (!email || !dashboardId || !dashboardPassword) {
      alert("All fields are required!");
      return;
  }

  // Add new seller dashboard data to localStorage
  addOrUpdateSellerDashboard(email, dashboardId, dashboardPassword);

  // Refresh the table
  displaySellersWithCredentials();

  // Close the modal
  const addNewRowModal = bootstrap.Modal.getInstance(document.getElementById("addNewRowModal"));
  addNewRowModal.hide();

  // Reset the form
  document.getElementById("addNewRowForm").reset();
});



document.querySelector("#sellerDashboardTableBody").addEventListener("click", (event) => {
  if (event.target.classList.contains("buttonDelete")) {
      const sellerEmail = event.target.getAttribute("data-id");

      // Confirm deletion
      const confirmDelete = confirm("Are you sure you want to delete this seller's dashboard credentials?");
      if (!confirmDelete) return;

      // Remove the seller's credentials from sellerDashboard
      let sellerDashboard = getSellerDashboard();
      sellerDashboard = sellerDashboard.filter((entry) => entry.email !== sellerEmail);
      saveSellerDashboard(sellerDashboard);

      // Remove the row from the table
      const row = event.target.closest("tr");
      if (row) {
          row.remove();
      }
  }
});





document.querySelector("#sellerDashboardTableBody").addEventListener("click", (event) => {
  if (event.target.classList.contains("buttonEdit")) {
      const sellerEmail = event.target.getAttribute("data-id");

      // Fetch the seller's dashboard data
      const sellerDashboard = getSellerDashboard();
      const entry = sellerDashboard.find((entry) => entry.email === sellerEmail);

      if (entry) {
          // Pre-fill the modal form with the current values
          document.getElementById("editSellerEmail").value = entry.email;
          document.getElementById("editDashboardId").value = entry.dashboardId;
          document.getElementById("editDashboardPassword").value = entry.dashboardPassword;

          // Show the modal
          const editModal = new bootstrap.Modal(document.getElementById("editSellerModal"));
          editModal.show();
      }
  }
});

document.getElementById("editSellerForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const sellerEmail = document.getElementById("editSellerEmail").value.trim();
  const dashboardId = document.getElementById("editDashboardId").value.trim();
  const dashboardPassword = document.getElementById("editDashboardPassword").value.trim();

  // Validate inputs
  if (!sellerEmail || !dashboardId || !dashboardPassword) {
      alert("All fields are required!");
      return;
  }

  // Update the seller's dashboard data
  let sellerDashboard = getSellerDashboard();
  sellerDashboard = sellerDashboard.map((entry) => {
      if (entry.email === sellerEmail) {
          return {
              email: sellerEmail,
              dashboardId,
              dashboardPassword,
          };
      }
      return entry;
  });
  saveSellerDashboard(sellerDashboard);

  // Refresh the table
  displaySellersWithCredentials();

  // Close the modal
  const editModal = bootstrap.Modal.getInstance(document.getElementById("editSellerModal"));
  editModal.hide();
});



// document.querySelector("#sellerDashboardTableBody").addEventListener("click", (event) => {
//   if (event.target.classList.contains("buttonDashboard")) {
//       const sellerEmail = event.target.getAttribute("data-id");

//       // Get the seller's credentials
//       const sellerDashboard = getSellerDashboard();
//       const dashboardEntry = sellerDashboard.find((entry) => entry.email === sellerEmail);

//       if (dashboardEntry && dashboardEntry.dashboardId && dashboardEntry.dashboardPassword) {
//           // Simulate opening the seller's dashboard
//           alert(`Opening dashboard for:\n
//                  Seller Email: ${sellerEmail}\n
//                  Dashboard ID: ${dashboardEntry.dashboardId}\n
//                  Dashboard Password: ${dashboardEntry.dashboardPassword}`);

//           // Redirect to the seller's dashboard page (example URL, replace with actual)
//           window.location.href = `/sellerDashboard.html?dashboardId=${dashboardEntry.dashboardId}`;
//       } else {
//           alert("This seller does not have valid dashboard credentials.");
//       }
//   }
// });
// import { getSellerDashboard } from "../../project/sellerDashboard.html";

document.querySelector("#sellerDashboardTableBody").addEventListener("click", (event) => {
  if (event.target.classList.contains("buttonDashboard")) {
      const sellerEmail = event.target.getAttribute("data-id");

      // Fetch sellerDashboard from localStorage
      const getSellerDashboard = () => JSON.parse(localStorage.getItem("sellerDashboard")) || [];
      const sellerDashboard = getSellerDashboard();

      // Find the dashboard ID for the clicked seller
      const seller = sellerDashboard.find((entry) => entry.email === sellerEmail);

      // window.location.href = `sellerDashboard.html?dashboardId=${seller.dashboardId}`;
      window.location.href = `sellerDashboard.html?dashboardId=${seller.dashboardId}`;
      if (seller && seller.dashboardId) {
          window.location.href = `/sellerDashboard.html?dashboardId=${seller.dashboardId}`;
      } else {
          alert("This seller does not have a valid dashboard ID.");
      }
  }
});




  // Initialize Page
  displaySellers();
  displayUsers();
  displayMessages();
  updateUserCount();
  updateSellerCount();
  displaySellersWithCredentials();

});
