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

    // Fetch books from localStorage
    const getBooks = () => JSON.parse(localStorage.getItem("books")) || [];
    const saveBooks = (books) => localStorage.setItem("books", JSON.stringify(books));

    // Filter books for the specific seller
    const getSellerBooks = () => getBooks().filter((book) => book.sellerId === dashboardId);

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
            const updatedBooks = books.filter((book) => book.id !== productId);
            saveBooks(updatedBooks);
            displayProducts();
        }

        // Edit Book
        if (event.target.classList.contains("buttonEdit")) {
            const productId = Number(event.target.getAttribute("data-id"));
            const book = books.find((book) => book.id === productId);

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

    // Handle Add New Book Form Submission
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

    // Initialize Page
    displayProducts();
});
