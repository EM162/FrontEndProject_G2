document.addEventListener("DOMContentLoaded", async () => {
    const dbKey = "bookstoreDB";

    // Initialize database if not exists
    if (!localStorage.getItem(dbKey)) {
        try {
            const response = await fetch("src/bookstoreDB.json");
            if (!response.ok) throw new Error("Failed to fetch the JSON file.");
            const data = await response.json();
            if (!data.orders) {
                data.orders = [];
            }
            localStorage.setItem(dbKey, JSON.stringify(data));
            console.log("Database initialized from JSON file.");
        } catch (error) {
            console.error("Error loading JSON file:", error);
            // Initialize with empty data if fetch fails
            localStorage.setItem(dbKey, JSON.stringify({ products: [], orders: [] }));
        }
    } else {
        // Ensure orders array exists in existing data
        const data = JSON.parse(localStorage.getItem(dbKey));
        if (!data.orders) {
            data.orders = [];
            localStorage.setItem(dbKey, JSON.stringify(data));
        }
    }

    // Utility Functions
    const getData = () => JSON.parse(localStorage.getItem(dbKey));
    const saveData = (data) => localStorage.setItem(dbKey, JSON.stringify(data));

    // Utility Functions for Validation
    const validateProductName = (value) => value.length >= 2;
    const validateProductAuthor = (value) => value.length >= 2;
    const validateProductPrice = (value) => !isNaN(value) && parseFloat(value) > 0;
    const validateProductCategory = (value) => ["business", "marketing", "design", "programming"].includes(value.toLowerCase());
    const validateProductPages = (value) => !isNaN(value) && parseInt(value, 10) >= 20;
    const validateProductDescription = (value) => value.length >= 20;
    const validateProductStock = (value) => !isNaN(value) && parseInt(value, 10) > 20;

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

    // Fetch Products
    const fetchProducts = () => getData().products || [];

    // Display Products
    const displayProducts = () => {
        const productTable = document.querySelector("#products tbody");
        const products = fetchProducts();
        productTable.innerHTML = products.map((product, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${product.title}</td>
                <td>${product.author}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>${product.pages}</td>
                <td>${product.description}</td>
                <td>${product.stock}</td>
                <td>
                    <img src="src/images/edit.png" class="buttonEdit" data-id="${product.id}" alt="Edit">
                    <img src="src/images/trash.png" class="buttonDelete" data-id="${product.id}" alt="Delete">
                </td>
            </tr>
        `).join("");
    };

    document.querySelector("#products").addEventListener("click", (event) => {
        if (event.target.classList.contains("buttonDelete")) {
            const productId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            db.products = db.products.filter(product => product.id !== productId);
            saveData(db);
            displayProducts();
        }
    });

    // Edit Product
    document.querySelector("#products").addEventListener("click", (event) =>{
        if (event.target.classList.contains("buttonEdit")) {
            const productId = Number(event.target.getAttribute("data-id"));
            const db = getData();
            const product = db.products.find(product => product.id === productId);

            if (product) {
                document.getElementById("productName").value = product.title || "";
                document.getElementById("Author").value = product.author || "";
                document.getElementById("productPrice").value = product.price || "";
                document.getElementById("productCategory").value = product.category || "";
                document.getElementById("productPages").value = product.pages || "";
                document.getElementById("productDescription").value = product.description || "";
                document.getElementById("productStock").value = product.stock || "";
                document.getElementById("editProductId").value = productId || "";

                document.getElementById("editProductId").value = productId;

                const addProductModal = new bootstrap.Modal(document.getElementById("addProductModal"));
                addProductModal.show();
            }
        }
    });

    // Add New User Form Submission
    document.getElementById("addProductForm").addEventListener("submit", (event) => {
        event.preventDefault();

        const productId = document.getElementById("editProductId").value;
        const productName = document.getElementById("productName").value.trim();
        const productAuthor = document.getElementById("Author").value.trim();
        const productPrice = document.getElementById("productPrice").value.trim();
        const productCategory = document.getElementById("productCategory").value.trim();
        const productPages = document.getElementById("productPages").value.trim();
        const productDescription = document.getElementById("productDescription").value.trim();
        const productStock = document.getElementById("productStock").value.trim();

        // Validation
        let isValid = true;

        if (!validateProductName(productName)) {
            showValidationError(document.getElementById("productName"), "Name must contain only letters and at least 2 characters.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("productName"));
        }

        if (!validateProductAuthor(productAuthor)) {
            showValidationError(document.getElementById("Author"), "Author Name must contain only letters and at least 2 characters");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("Author"));
        }

        if (!validateProductPrice(productPrice)) {
            showValidationError(document.getElementById("productPrice"), "Price must be a positive number");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("productPrice"));
        }

        if (!validateProductCategory(productCategory)) {
            showValidationError(document.getElementById("productCategory"), "Please select a valid category.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("productCategory"));
        }

        if (!validateProductPages(productPages)) {
            showValidationError(document.getElementById("productPages"), "Pages must be a number and at least 20");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("productPages"));
        }

        if (!validateProductDescription(productDescription)) {
            showValidationError(document.getElementById("productDescription"), "Description must be at least 20 characters.");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("productDescription"));
        }

        if (!validateProductStock(productStock)) {
            showValidationError(document.getElementById("productStock"), "Stock must be a number greater than 20");
            isValid = false;
        } else {
            clearValidationError(document.getElementById("productStock"));
        }

        if (!isValid) return;

        const db = getData();
        if (productId) {
            const product = db.products.find(product => product.id === Number(productId));
            if(product) {
                product.title = productName;
                product.author = productAuthor;
                product.price = productPrice;
                product.category = productCategory;
                product.pages = productPages;
                product.description = productDescription;
                product.stock = productStock;
            }
        } else {
            // Initialize products array if it doesn't exist
            if (!db.products) {
                db.products = [];
            }
            db.products.push({
                id: Date.now(),
                title : productName,
                author : productAuthor,
                price : productPrice,
                category : productCategory,
                pages : productPages,
                description : productDescription,
                stock : productStock,
            });
        }

        saveData(db);
        displayProducts();

        const addProductModal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
        addProductModal.hide();

    });

    // Clear the Add User Modal Fields
    document.getElementById("addProductBtn").addEventListener("click", () => {
        document.getElementById("addProductForm").reset(); // Reset the form
        document.getElementById("editProductId").value = ""; // Clear hidden edit ID field
        //clearAllValidationErrors(); // Clear validation errors if any
    });

    //----------------------------------------------------------------------------------------------------------------

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

//---------------------------------------------------------------------------------------------------------------

    // Handle Mark as Shipped functionality
    function initializeShippingButtons() {
        const markAsShippedButtons = document.querySelectorAll('.mark-as-shipped');
        markAsShippedButtons.forEach(button => {
            const id = button.dataset.id;
            const statusElement = document.getElementById(`status-${id}`);
            const db = getData();

            // Check existing status
            if (db.orders) {
                const order = db.orders.find(order => order.id === Number(id));
                if (order && order.status === 'Shipped') {
                    if (statusElement) {
                        statusElement.textContent = 'Shipped';
                    }
                    button.classList.replace('btn-success', 'btn-secondary');
                    button.textContent = 'Shipped';
                    button.disabled = true;
                }
            }

            // Add click handler
            button.addEventListener('click', function() {
                const db = getData();
                if (!db.orders) {
                    db.orders = [];
                }

                let order = db.orders.find(order => order.id === Number(id));
                if (!order) {
                    order = {
                        id: Number(id),
                        status: 'Pending'
                    };
                    db.orders.push(order);
                }

                order.status = 'Shipped';
                saveData(db);

                if (statusElement) {
                    statusElement.textContent = 'Shipped';
                }

                this.classList.replace('btn-success', 'btn-secondary');
                this.textContent = 'Shipped';
                this.disabled = true;
            });
        });
    }

    // Initialize the page
    displayProducts();
    initializeShippingButtons();
});
