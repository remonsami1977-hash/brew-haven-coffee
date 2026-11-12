/* =========================================================
   Brew Haven Coffee - script.js
   1. Product data           6. Cart drawer
   2. Helpers & storage      7. Checkout
   3. Theme switcher         8. Contact form validation
   4. Product rendering      9. Scroll helpers & back to top
   5. Menu filters/search   10. Start the app
   ========================================================= */

/* ---------- 1. PRODUCT DATA ---------- */
// Every product lives here. Adding a new item is as simple as adding an object.
const PRODUCTS = [
  {
    id: "espresso",
    name: "Espresso",
    category: "hot",
    categoryLabel: "Hot Coffee",
    price: 3.0,
    description: "A bold, velvety shot pulled from our signature dark roast.",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80",
    alt: "Freshly pulled espresso in a dark cup"
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "hot",
    categoryLabel: "Hot Coffee",
    price: 4.0,
    description: "Equal parts espresso, steamed milk and a thick cloud of foam.",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
    alt: "Cappuccino with latte art on a white saucer"
  },
  {
    id: "latte",
    name: "Latte",
    category: "hot",
    categoryLabel: "Hot Coffee",
    price: 4.5,
    description: "Smooth espresso mellowed with silky steamed milk.",
    image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=600&q=80",
    alt: "Latte with a rosetta pattern surrounded by coffee beans"
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "hot",
    categoryLabel: "Hot Coffee",
    price: 5.0,
    description: "Espresso meets rich dark chocolate and creamy milk.",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80",
    alt: "Chocolate mocha being poured into a cup"
  },
  {
    id: "iced-coffee",
    name: "Iced Coffee",
    category: "cold",
    categoryLabel: "Cold Coffee",
    price: 4.0,
    description: "Slow-brewed coffee poured over ice, crisp and refreshing.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    alt: "Iced coffee with cream swirling in a tall glass"
  },
  {
    id: "caramel-frappuccino",
    name: "Caramel Frappuccino",
    category: "cold",
    categoryLabel: "Cold Coffee",
    price: 5.5,
    description: "Blended ice, caramel swirls and a generous whipped cream top.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    alt: "Blended frappuccino topped with whipped cream"
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Cake",
    category: "dessert",
    categoryLabel: "Dessert",
    price: 4.5,
    description: "Molten chocolate layers with a silky ganache finish.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
    alt: "Chocolate layer cake with ganache drip"
  },
  {
    id: "croissant",
    name: "Croissant",
    category: "dessert",
    categoryLabel: "Dessert",
    price: 3.0,
    description: "Flaky, buttery and baked fresh every single morning.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    alt: "Butter croissant dusted with powdered sugar"
  }
];

/* ---------- 2. HELPERS & STORAGE ---------- */
const CART_KEY = "brewhaven-cart";
const THEME_KEY = "brewhaven-theme";

// Grab the elements we work with (the script runs after the HTML is loaded)
const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");
const noResultsText = document.getElementById("noResultsText");
const filtersBar = document.getElementById("filters");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartToggle = document.getElementById("cartToggle");
const cartCloseBtn = document.getElementById("cartClose");
const cartList = document.getElementById("cartList");
const cartEmpty = document.getElementById("cartEmpty");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartBrowseBtn = document.getElementById("cartBrowseBtn");
const cartDoneBtn = document.getElementById("cartDoneBtn");
const cartConfirm = document.getElementById("cartConfirm");
const orderNumberEl = document.getElementById("orderNumber");
const orderTotalEl = document.getElementById("orderTotal");

const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const siteHeader = document.getElementById("siteHeader");
const backToTopBtn = document.getElementById("backToTop");
const orderNowBtn = document.getElementById("orderNowBtn");
const toast = document.getElementById("toast");

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formSuccess = document.getElementById("formSuccess");

// Small storage helpers so a blocked localStorage never breaks the page
function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage might be unavailable (private mode) - the site still works.
  }
}

const formatPrice = (amount) => "$" + amount.toFixed(2);
const getProduct = (id) => PRODUCTS.find((product) => product.id === id);
const getCartTotal = () =>
  cart.reduce((total, item) => total + getProduct(item.id).price * item.qty, 0);
const getCartCount = () => cart.reduce((count, item) => count + item.qty, 0);

// State
let cart = readStorage(CART_KEY, []);
let activeCategory = "all";
let searchTerm = "";
let toastTimer = null;
let successTimer = null;

// Make sure saved cart data is always valid before using it
if (!Array.isArray(cart)) {
  cart = [];
}
cart = cart
  .filter((item) => item && getProduct(item.id) && Number(item.qty) > 0)
  .map((item) => ({ id: item.id, qty: Math.min(Math.floor(Number(item.qty)), 99) }));

/* ---------- 3. THEME SWITCHER ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
  themeToggle.setAttribute("title", isDark ? "Light mode" : "Dark mode");
}

// Apply the saved theme straight away to avoid a bright flash
applyTheme(readStorage(THEME_KEY, "light") === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  writeStorage(THEME_KEY, nextTheme);
  showToast(nextTheme === "dark" ? "Dark mode on" : "Light mode on");
});

/* ---------- 4. PRODUCT RENDERING ---------- */
function productCardHTML(product) {
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.alt}" width="600" height="400" loading="lazy" />
        <span class="product-tag">${product.categoryLabel}</span>
      </div>
      <div class="product-body">
        <div class="product-title-row">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <p class="product-desc">${product.description}</p>
        <button type="button" class="btn-add" data-add="${product.id}"
                aria-label="Add ${product.name} to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add to Cart
        </button>
      </div>
    </article>`;
}

// Filter by category AND search text, then draw the cards
function renderProducts() {
  const term = searchTerm.trim().toLowerCase();

  const visibleProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = term === "" || product.name.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = visibleProducts.map(productCardHTML).join("");

  // Friendly message when nothing matches
  const nothingFound = visibleProducts.length === 0;
  noResults.hidden = !nothingFound;
  if (nothingFound) {
    noResultsText.textContent =
      term === ""
        ? "Try another category to see more of our menu."
        : `We could not find anything for "${searchTerm.trim()}". Try another name.`;
  }
}

// Add to cart buttons are handled with one listener (event delegation)
productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(button.dataset.add);
});

/* ---------- 5. MENU FILTERS & SEARCH ---------- */
filtersBar.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  activeCategory = button.dataset.category;

  filterButtons.forEach((filterButton) => {
    const isActive = filterButton === button;
    filterButton.classList.toggle("is-active", isActive);
    filterButton.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  clearSearchBtn.hidden = searchTerm.length === 0;
  renderProducts();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  clearSearchBtn.hidden = true;
  renderProducts();
  searchInput.focus();
});

/* ---------- 6. CART DRAWER ---------- */
function saveCart() {
  writeStorage(CART_KEY, cart);
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  renderCart();
  bumpCartBadge();
  showToast(`${product.name} added to your cart`);
}

function changeQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.qty += change;

  // Never allow less than one item (use the remove button instead)
  if (item.qty < 1) {
    item.qty = 1;
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  const product = getProduct(productId);
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  if (product) {
    showToast(`${product.name} removed from your cart`);
  }
}

function cartItemHTML(item) {
  const product = getProduct(item.id);
  const lineTotal = product.price * item.qty;

  return `
    <li class="cart-item">
      <img class="cart-item-img" src="${product.image}" alt="" width="62" height="62" />
      <div class="cart-item-info">
        <p class="cart-item-name">${product.name}</p>
        <p class="cart-item-price">${formatPrice(product.price)} each</p>
        <div class="qty-controls" role="group" aria-label="Quantity for ${product.name}">
          <button type="button" class="qty-btn" data-action="decrease" data-id="${product.id}"
                  aria-label="Decrease quantity of ${product.name}"
                  ${item.qty <= 1 ? "disabled" : ""}>&minus;</button>
          <span class="qty-value">${item.qty}</span>
          <button type="button" class="qty-btn" data-action="increase" data-id="${product.id}"
                  aria-label="Increase quantity of ${product.name}">+</button>
        </div>
      </div>
      <div class="cart-item-end">
        <span class="cart-item-total">${formatPrice(lineTotal)}</span>
        <button type="button" class="remove-btn" data-action="remove" data-id="${product.id}"
                aria-label="Remove ${product.name} from cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </li>`;
}

// Redraw the cart list, badge, total and empty state
function renderCart() {
  cartList.innerHTML = cart.map(cartItemHTML).join("");
  cartEmpty.hidden = cart.length > 0;

  const count = getCartCount();
  cartCountEl.textContent = count;
  cartCountEl.classList.toggle("is-visible", count > 0);

  cartTotalEl.textContent = formatPrice(getCartTotal());

  // An empty cart cannot be checked out
  checkoutBtn.disabled = cart.length === 0;
}

// Cart button clicks (increase, decrease, remove)
cartList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const productId = button.dataset.id;

  if (button.dataset.action === "increase") {
    changeQuantity(productId, 1);
  } else if (button.dataset.action === "decrease") {
    changeQuantity(productId, -1);
  } else if (button.dataset.action === "remove") {
    removeFromCart(productId);
  }
});

function openCart() {
  closeMobileNav();
  cartDrawer.classList.add("is-open");
  cartOverlay.classList.add("is-visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  cartCloseBtn.focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartOverlay.classList.remove("is-visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  cartToggle.focus();

  // Reset the confirmation view once the panel has slid away
  window.setTimeout(() => {
    cartDrawer.classList.remove("is-confirmed");
    cartConfirm.hidden = true;
  }, 400);
}

cartToggle.addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
cartDoneBtn.addEventListener("click", closeCart);

cartBrowseBtn.addEventListener("click", () => {
  closeCart();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ---------- 7. CHECKOUT ---------- */
checkoutBtn.addEventListener("click", () => {
  // Second safety check: never checkout an empty cart
  if (cart.length === 0) {
    showToast("Your cart is empty - add a coffee first!");
    return;
  }

  const total = getCartTotal();
  const orderNumber = "#BH-" + Math.floor(100000 + Math.random() * 900000);

  // Fill in the confirmation message
  orderNumberEl.textContent = orderNumber;
  orderTotalEl.textContent = formatPrice(total);

  // Empty the cart
  cart = [];
  saveCart();
  renderCart();
  cartCountEl.classList.remove("is-visible");

  // Show the confirmation instead of the cart list
  cartConfirm.hidden = false;
  cartDrawer.classList.add("is-confirmed");
  showToast("Order placed - thank you for choosing Brew Haven!");

  cartDoneBtn.focus();
});

/* ---------- 8. CONTACT FORM VALIDATION ---------- */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function setFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  input.classList.toggle("is-invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  return message === "";
}

function validateContactForm() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  const nameValid = setFieldError(
    nameInput,
    document.getElementById("nameError"),
    name.length < 2 ? "Please enter your name (at least 2 characters)." : ""
  );

  const emailValid = setFieldError(
    emailInput,
    document.getElementById("emailError"),
    EMAIL_PATTERN.test(email) ? "" : "Please enter a valid email address."
  );

  const messageValid = setFieldError(
    messageInput,
    document.getElementById("messageError"),
    message.length < 10 ? "Please write a message of at least 10 characters." : ""
  );

  return nameValid && emailValid && messageValid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formSuccess.hidden = true;
  window.clearTimeout(successTimer);

  if (!validateContactForm()) {
    // Focus the first invalid field so the user knows where to start
    const firstInvalid = contactForm.querySelector(".is-invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const firstName = nameInput.value.trim().split(" ")[0];
  formSuccess.textContent = `Thank you, ${firstName}! Your message has been sent - we will reply within one business day.`;
  formSuccess.hidden = false;

  contactForm.reset();
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.classList.remove("is-invalid");
    input.setAttribute("aria-invalid", "false");
  });

  // Hide the success message again after a while
  successTimer = window.setTimeout(() => {
    formSuccess.hidden = true;
  }, 8000);
});

// Clear a field error as soon as the user starts typing again
[nameInput, emailInput, messageInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("is-invalid");
    input.setAttribute("aria-invalid", "false");
    const errorElement = document.getElementById(input.id + "Error");
    if (errorElement) errorElement.textContent = "";
  });
});

/* ---------- 9. MOBILE NAV, SCROLL HELPERS, TOAST ---------- */
function closeMobileNav() {
  mainNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the mobile menu after choosing a link
navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

// "Order Now" opens the cart when it has items, otherwise guides to the menu
orderNowBtn.addEventListener("click", () => {
  if (cart.length > 0) {
    openCart();
  } else {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Pick your favourite below and add it to the cart");
  }
});

// Header shadow, active nav link and back-to-top visibility
const pageSections = Array.from(document.querySelectorAll("main section[id]"));

function handleScroll() {
  const scrolled = window.scrollY;

  siteHeader.classList.toggle("is-scrolled", scrolled > 10);
  backToTopBtn.classList.toggle("is-visible", scrolled > 420);

  let currentSection = "home";
  pageSections.forEach((section) => {
    if (scrolled >= section.offsetTop - 150) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      link.getAttribute("href") === "#" + currentSection
    );
  });
}

window.addEventListener("scroll", handleScroll, { passive: true });

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Escape closes the cart first, then the mobile menu
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (cartDrawer.classList.contains("is-open")) {
    closeCart();
  } else if (mainNav.classList.contains("is-open")) {
    closeMobileNav();
  }
});

// Small message that pops up at the bottom of the screen
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
}

// Little bounce on the cart badge after adding an item
function bumpCartBadge() {
  cartCountEl.classList.remove("is-bumping");
  // Restart the CSS animation
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add("is-bumping");
}

/* ---------- 10. START THE APP ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
handleScroll();
