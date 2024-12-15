document.addEventListener("DOMContentLoaded", async () => {
<<<<<<< HEAD
    const params = new URLSearchParams(window.location.search);
    const dashboardId = params.get("dashboardId");

    if (!dashboardId) {
        document.body.innerHTML = `<h1>Access Denied</h1><p>No valid dashboard ID found.</p>`;
        return;
    }

    // Fetch sellerDashboard from localStorage
    const getSellerDashboard = () => JSON.parse(localStorage.getItem("sellerDashboard")) || [];
    const sellerDashboard = getSellerDashboard();
=======

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
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654

    // Find the seller with the given dashboardId
    const seller = sellerDashboard.find((entry) => entry.dashboardId === dashboardId);

    if (!seller) {
        document.body.innerHTML = `<h1>Access Denied</h1><p>Invalid dashboard ID.</p>`;
        return;
    }

    // Fetch books from localStorage
    const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
    const saveBooks = (books) => localStorage.setItem("books", JSON.stringify(books));

<<<<<<< HEAD
    // Filter books for the specific seller
    const getSellerBooks = () => getBooks().filter((book) => book.sellerId === dashboardId);
=======
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
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654

    // Display seller's books in the table
    const displayProducts = () => {
        const sellerBooks = getSellerBooks();
        const productTable = document.querySelector("#products tbody");

        if (sellerBooks.length === 0) {
            productTable.innerHTML = `<tr><td colspan="9" class="text-center">No products found.</td></tr>`;
            return;
        }

        productTable.innerHTML = sellerBooks
            .map(
                (book, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.price}</td>
                <td>${book.category}</td>
                <td>${book.pages}</td>
                <td>${book.description}</td>
                <td>${book.stock}</td>
                <td>
                    <img src="src/images/edit.png" class="buttonEdit" data-id="${book.id}" alt="Edit">
                    <img src="src/images/trash.png" class="buttonDelete" data-id="${book.id}" alt="Delete">
                </td>
            </tr>`
            )
            .join("");
    };

    // Handle Add/Edit/Delete functionality for books
    document.querySelector("#products").addEventListener("click", (event) => {
        const books = getBooks();

        // Delete Book
        if (event.target.classList.contains("buttonDelete")) {
            const productId = Number(event.target.getAttribute("data-id"));
<<<<<<< HEAD
            const updatedBooks = books.filter((book) => book.id !== productId);
=======
            const books = getBooks();
            const updatedBooks = books.filter(product => product.id !== productId);
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654
            saveBooks(updatedBooks);
            displayProducts();
        }

        // Edit Book
        if (event.target.classList.contains("buttonEdit")) {
            const productId = Number(event.target.getAttribute("data-id"));
<<<<<<< HEAD
            const book = books.find((book) => book.id === productId);
=======
            const books = getBooks();
            const product = books.find(product => product.id === productId);
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654

            if (book) {
                document.getElementById("productName").value = book.title || "";
                document.getElementById("Author").value = book.author || "";
                document.getElementById("productPrice").value = book.price || "";
                document.getElementById("productCategory").value = book.category || "";
                document.getElementById("productPages").value = book.pages || "";
                document.getElementById("productDescription").value = book.description || "";
                document.getElementById("productStock").value = book.stock || "";
                document.getElementById("editProductId").value = productId || "";

                const addProductModal = new bootstrap.Modal(document.getElementById("addProductModal"));
                addProductModal.show();
            }
        }
    });

<<<<<<< HEAD
    // Handle Add New Book Form Submission
=======
    // Add New Product Form Submission
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654
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
        if (!productName || !productAuthor || !productPrice || !productCategory || !productPages || !productDescription || !productStock) {
            alert("All fields are required!");
            return;
        }

<<<<<<< HEAD
        const books = getBooks();
        if (productId) {
            // Edit existing product
            const book = books.find((book) => book.id === Number(productId));
            if (book) {
                book.title = productName;
                book.author = productAuthor;
                book.price = productPrice;
                book.category = productCategory;
                book.pages = productPages;
                book.description = productDescription;
                book.stock = productStock;
            }
        } else {
            // Add new product
=======
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
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654
            books.push({
                id: Date.now(),
                title: productName,
                author: productAuthor,
                price: productPrice,
                category: productCategory,
                pages: productPages,
                description: productDescription,
                stock: productStock,
                sellerId: dashboardId, // Assign the seller's dashboardId
            });
        }

        saveBooks(books);
        displayProducts();

        const addProductModal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
        addProductModal.hide();

        // Reset the form
        document.getElementById("addProductForm").reset();
    });

<<<<<<< HEAD
    // Initialize Page
=======
    // Clear the Add Product Modal Fields
    document.getElementById("addProductBtn").addEventListener("click", () => {
        document.getElementById("addProductForm").reset(); // Reset the form
        document.getElementById("editProductId").value = ""; // Clear hidden edit ID field
    });

    // Initialize the page
>>>>>>> b842d6f861ae6aa05536ad6d2f3f829f4e62b654
    displayProducts();
});
