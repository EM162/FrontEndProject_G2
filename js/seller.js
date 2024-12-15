document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);
    const dashboardId = params.get("dashboardId");

    if (!dashboardId) {
        document.body.innerHTML = `<h1>Access Denied</h1><p>No valid dashboard ID found.</p>`;
        return;
    }

    // Fetch sellerDashboard from localStorage
    const getSellerDashboard = () => JSON.parse(localStorage.getItem("sellerDashboard")) || [];
    const sellerDashboard = getSellerDashboard();

    // Find the seller with the given dashboardId
    const seller = sellerDashboard.find((entry) => entry.dashboardId === dashboardId);

    if (!seller) {
        document.body.innerHTML = `<h1>Access Denied</h1><p>Invalid dashboard ID.</p>`;
        return;
    }

    // Display seller's dashboard information
    document.body.innerHTML = `
        <h1>Welcome to ${seller.email}'s Dashboard</h1>
        <p>Dashboard ID: ${seller.dashboardId}</p>
        <p>Additional seller-specific content goes here...</p>
    `;


    const booksKey = "books";

    // Initialize books array by fetching from books.json if not exists in localStorage
    if (!localStorage.getItem(booksKey)) {
        try {
            const response = await fetch("src/books.json"); // Fetch from books.json
            if (!response.ok) throw new Error("Failed to fetch the JSON file.");
            const books = await response.json();
            localStorage.setItem(booksKey, JSON.stringify(books));
            console.log("Books initialized from JSON file.");
        } catch (error) {
            console.error("Error loading JSON file:", error);
            // Initialize with an empty array if fetch fails
            localStorage.setItem(booksKey, JSON.stringify([]));
        }
    }

    // Utility Functions
    // Fetch books from localStorage
    const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
    // Filter books for the specific seller
    const sellerBooks = getBooks().filter((book) => book.sellerId === dashboardId);
    // const getBooks = () => JSON.parse(localStorage.getItem(booksKey));
    const saveBooks = (books) => localStorage.setItem(booksKey, JSON.stringify(books));

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

//      // Render the seller's dashboard
//      const dashboardContent = `
//      <h1>Welcome to ${seller.email}'s Dashboard</h1>
//      <p>Dashboard ID: ${seller.dashboardId}</p>
//      <h2>Seller Products</h2>
//      <table class="table">
//          <thead>
//              <tr>
//                  <th>#</th>
//                  <th>Title</th>
//                  <th>Author</th>
//                  <th>Price</th>
//                  <th>Category</th>
//                  <th>Pages</th>
//                  <th>Description</th>
//                  <th>Stock</th>
//              </tr>
//          </thead>
//          <tbody>
//              ${sellerBooks
//                  .map(
//                      (book, index) => `
//                  <tr>
//                      <td>${index + 1}</td>
//                      <td>${book.title}</td>
//                      <td>${book.author}</td>
//                      <td>${book.price}</td>
//                      <td>${book.category}</td>
//                      <td>${book.pages}</td>
//                      <td>${book.description}</td>
//                      <td>${book.stock}</td>
//                  </tr>`
//                  )
//                  .join("")}
//          </tbody>
//      </table>
//  `;

//  document.body.innerHTML = dashboardContent;

    // Fetch Products
      const fetchProducts = () => getBooks() || [];

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
            const books = getBooks();
            const updatedBooks = books.filter(product => product.id !== productId);
            saveBooks(updatedBooks);
            displayProducts();
        }
    });

    // Edit Product
    document.querySelector("#products").addEventListener("click", (event) =>{
        if (event.target.classList.contains("buttonEdit")) {
            const productId = Number(event.target.getAttribute("data-id"));
            const books = getBooks();
            const product = books.find(product => product.id === productId);

            if (product) {
                document.getElementById("productName").value = product.title || "";
                document.getElementById("Author").value = product.author || "";
                document.getElementById("productPrice").value = product.price || "";
                document.getElementById("productCategory").value = product.category || "";
                document.getElementById("productPages").value = product.pages || "";
                document.getElementById("productDescription").value = product.description || "";
                document.getElementById("productStock").value = product.stock || "";
                document.getElementById("editProductId").value = productId || "";

                const addProductModal = new bootstrap.Modal(document.getElementById("addProductModal"));
                addProductModal.show();
            }
        }
    });

    // Add New Product Form Submission
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

        const books = getBooks();
        if (productId) {
            const product = books.find(product => product.id === Number(productId));
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
            books.push({
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

        saveBooks(books);
        displayProducts();

        const addProductModal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
        addProductModal.hide();

    });

    // Clear the Add Product Modal Fields
    document.getElementById("addProductBtn").addEventListener("click", () => {
        document.getElementById("addProductForm").reset(); // Reset the form
        document.getElementById("editProductId").value = ""; // Clear hidden edit ID field
    });

    // Initialize the page
    displayProducts();
});
