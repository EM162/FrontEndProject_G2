// Categories and Books Data
let categories = {};

// Function to fetch books from JSON
async function fetchBooks() {
    try {
        const response = await fetch('src/js/books.json');
        categories = await response.json();
        localStorage.setItem('categories', JSON.stringify(categories));
        return categories;
    } catch (error) {
        console.error('Error fetching books:', error);
        return {};
    }
}

// Modify existing functions to use fetched books
function getAllBooks() {
    const allBooks = [];
    for (const category in categories) {
        allBooks.push(...categories[category]);
    }
    return allBooks;
}

function getBooksByCategory(categoryName) {
    return categories[categoryName] || [];
}

// Global variables for pagination
const BOOKS_PER_PAGE = 12;
let currentPage = 1;

//function to search books
function searchBooks() {
    const searchTerm = document.getElementById('book-search').value.toLowerCase();
    const books = getAllBooks();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
    displayBooks(filteredBooks);
}

// Function to display books
function displayBooks(books) {
    const resultsContent = document.getElementById('results-content');
    const resultsRange = document.getElementById('results-range');
    const totalResults = document.getElementById('total-results');
    const pagination = document.querySelector('nav[aria-label="Page navigation example"]');

    // Update results count
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = Math.min(startIndex + BOOKS_PER_PAGE, books.length);
    resultsRange.textContent = `${startIndex + 1}-${endIndex}`;
    totalResults.textContent = books.length;

    // Show/hide pagination based on category
    const currentCategory = document.querySelector('.categories a.active').textContent.trim().toLowerCase();
    if (currentCategory === 'all books') {
        pagination.style.display = 'block';
    } else {
        pagination.style.display = 'none';
        currentPage = 1; // Reset to first page when selecting category
    }

    // Clear previous content
    resultsContent.innerHTML = '';

    // Create bookgrid container
    const bookgrid = document.createElement('div');
    bookgrid.className = 'bookgrid';

    // Get books for current page
    const booksToShow = books.slice(startIndex, endIndex);

    // Display books
    booksToShow.forEach(book => {
        const bookCard = `
            <div class="book">
                <img src="${book.image}" alt="${book.title}" onclick="goToBookDetails(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                <h3 onclick="goToBookDetails(${JSON.stringify(book).replace(/"/g, '&quot;')})" style="cursor: pointer">${book.title}</h3>
                <p class="price">$${book.price}</p>
                <p class="status">${book.status}</p>
                <div class="icons">
                    ${book.status === 'In Stock' ? `<a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i></a>` : ''}
                    <a href="#" class="cart-icon" onclick="event.preventDefault(); goToBookDetails(${JSON.stringify(book).replace(/"/g, '&quot;')})"><i class="fas fa-eye"></i></a>
                </div>
                ${book.status === 'In Stock' ? `<button class="add-to-cart" data-id="${book.id}"><i class="fas fa-shopping-cart"></i>Add to Cart</button>` : ''}
            </div>
        `;
        bookgrid.innerHTML += bookCard;
    });

    // Add bookgrid to results content
    resultsContent.appendChild(bookgrid);

    // Update pagination
    updatePagination(books.length);
}

// Function to update pagination
function updatePagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);
    const pagination = document.querySelector('.pagination');
    
    if (pagination) {
        pagination.innerHTML = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
            </li>
            ${generatePageNumbers(totalPages)}
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
            </li>
        `;
    }
}

// Function to generate page numbers
function generatePageNumbers(totalPages) {
    let pages = '';
    for (let i = 1; i <= totalPages; i++) {
        pages += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    return pages;
}

// Function to change page
function changePage(newPage) {
    const books = getAllBooks();
    const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayBooks(books);
    }
}

// Function to sort books
function sortResults(sortType) {
    // Get the current active category
    const currentCategory = document.querySelector('.categories a.active').textContent.trim().toLowerCase();
    
    // Determine books to sort based on current category
    let books = currentCategory === 'all books' 
        ? getAllBooks() 
        : getBooksByCategory(currentCategory);
    
    switch(sortType) {
        case 'name-asc':
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            books.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'price-asc':
            books.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            books.sort((a, b) => b.price - a.price);
            break;
        default:
            // Default sorting by ID
            books.sort((a, b) => a.id - b.id);
    }

    displayBooks(books);
}

// Function to update price display
function updatePriceDisplay() {
    const minPrice = document.getElementById('price-min').value;
    const maxPrice = document.getElementById('price-max').value;
    document.getElementById('price-min-display').textContent = minPrice;
    document.getElementById('price-max-display').textContent = maxPrice;
}

// Function to filter books by price range
function filterByPrice() {
    const minPrice = parseFloat(document.getElementById('price-min').value);
    const maxPrice = parseFloat(document.getElementById('price-max').value);
    const books = getAllBooks();
    
    const filteredBooks = books.filter(book => {
        const price = parseFloat(book.price);
        return price >= minPrice && price <= maxPrice;
    });
    
    displayBooks(filteredBooks);
}

// Function to filter by product status
function filterProductStatus() {
    const status = document.getElementById('status').value;
    const books = getAllBooks();
    
    let filteredBooks;
    if (status === 'all') {
        filteredBooks = books;
    } else {
        const statusText = status === 'in' ? 'In Stock' : 'out of Stock';
        filteredBooks = books.filter(book => book.status === statusText);
    }
    
    displayBooks(filteredBooks);
}

// Function to navigate to book details page
function goToBookDetails(book) {
    try {
        console.log('Selected book:', book); // Debug log
        // Store the selected book data in localStorage
        localStorage.setItem('selectedBook', JSON.stringify(book));
        // Navigate to eachcategory.html
        window.location.href = 'eachcategory.html';
    } catch (error) {
        console.error('Error in goToBookDetails:', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch books before displaying
    await fetchBooks();
    
    // Display all books initially
    const allBooks = getAllBooks();
    displayBooks(allBooks);
    updatePagination(allBooks.length);

    // Set up price filter button
    const filterButton = document.getElementById('filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', filterByPrice);
    }

    // Initialize price display
    updatePriceDisplay();

    // Category click handlers
    const categoryLinks = document.querySelectorAll('.categories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Get category name from text content
            const category = link.textContent.trim().toLowerCase();
            
            // Get and display books
            let books;
            if (category === 'all books') {
                books = getAllBooks();
            } else {
                books = getBooksByCategory(category);
            }
            displayBooks(books);
        });
    });

    // Sort select handler
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortResults(e.target.value);
        });
    }
});