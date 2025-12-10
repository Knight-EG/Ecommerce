const body = document.body;
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");
const navbarSwitch = document.querySelector("nav");
const headerSwitch = document.querySelector("header");

//LocalStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.classList.add(savedTheme);
  if (savedTheme === "dark") {
  } else {
  }
} else {
  body.classList.add("light");
}

themeToggle.addEventListener("click", function () {
  if (body.classList.contains("light")) {
    body.classList.replace("light", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
    navbarSwitch.classList.replace("navbar-light", "navbar-dark");
    headerSwitch.classList.replace("bg-light", "bg-dark");
    localStorage.setItem("theme", "dark");
  } else if (body.classList.contains("dark")) {
    body.classList.replace("dark", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    navbarSwitch.classList.replace("navbar-dark", "navbar-light");
    headerSwitch.classList.replace("bg-dark", "bg-light");
    localStorage.setItem("theme", "light");
  }
});

// Products API
let products = [];
const productsContainer = document.querySelector("#products-container");
async function getProductsApi() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=2000");
    const data = await response.json();
    products = data.products;
    displayProducts(products);
    
  } catch (error) {
    console.log("Error:", error);
  }
}
getProductsApi();

/////////////////////////////////////////////////////////////
const displayProducts = function (productsList) {
  productsContainer.innerHTML = "";
  if (productsList.length === 0) {
    productsContainer.innerHTML = " <div> No Data </div>";
    return;
  }
  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "col";
    productCard.innerHTML = `
     <div class="card h-100 shadow-sm border-0 product-card">
        <div class="card-img-wrapper">
          <img src="${product.thumbnail}" class="card-img-top product-img" />
        </div>
        <div class="card-body">
          <h5 class="card-title fw-bold">${product.title}</h5>
          <p class="text-muted small">${product.description}</p>
          <p class="text-primary fw-bold">$${product.price}</p>
          <div class="rating mb-2">
            ${ratingStars(product.rating)}
          </div>

          <span class="badge rounded-pill text-bg-secondary">${
            product.category
          }</span>

        </div>
        <div class="card-footer bg-transparent border-0 text-center">


          <button class="btn btn-primary w-100" 
          
           onclick="addToCart(${product.id})">Add to Cart</button>

            </button>
        </div>
        
    <button class="favorite-btn">
        <i class="bi bi-heart"></i>
    </button>
      </div>
            `;

    productsContainer.appendChild(productCard);
  });
};
// const filterList = function (list) {
//   categoryFilter = document.querySelector("#categoryFilter");
//   categoryFilter.innerHTML = "";
//   list.forEach((category) => {
//     const filterOption = document.createElement("option");
//     filterOption.value = category;
//     categoryFilter.appendChild(filterOption);
//   });
// };
async function loadCategories() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=2000");
    const data = await res.json();

    // استخراج كل الـ categories بدون تكرار
    const categories = [...new Set(data.products.map(p => p.category))];

    // ترتيب أبجدي
    categories.sort();

    // جلب الـ SELECT من الصفحة
    const categorySelect = document.getElementById("categoryFilter");

    // بناء الـ options وإضافتها
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });

  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

loadCategories();

// Filter
const categoryFilter = document.querySelector("#categoryFilter");
const sortFilter = document.querySelector("#sortFilter");
const searchInput = document.querySelector("#searchInput");

const savedFilter = localStorage.getItem("currentFilter");
if (savedFilter) {
  categoryFilter.value = savedFilter;
}

const savedSort = localStorage.getItem("currentSort");
if (savedSort) {
  sortFilter.value = savedSort;
}

function productsFilter() {
  let filteredProducts = products;
  // Fuction Start Here
  //Search Filter
  const searchValue = searchInput.value.toLowerCase().trim();
  filteredProducts = filteredProducts.filter((product) =>
    product.title.toLowerCase().includes(searchValue)
  );
  //Category Filter
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("currentFilter", selectedCategory);
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === selectedCategory
    );
  }
  // Sort Filter
  const selectedSortFilter = sortFilter.value;
  localStorage.setItem("currentSort", selectedSortFilter);
  if (selectedSortFilter === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSortFilter === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSortFilter === "rating-desc") {
    filteredProducts.sort((a, b) => a.rating - b.rating);
  }
  displayProducts(filteredProducts);
}

// Events
searchInput.addEventListener("input", productsFilter);
categoryFilter.addEventListener("change", productsFilter);
sortFilter.addEventListener("change", productsFilter);
// Function run
productsFilter();

// Modal Control
const welcomeModal = document.querySelector("#welcomeModal");
const startExploring = document.querySelector("#startExploring");
const closeModal = document.querySelector("#closeModal");

window.addEventListener("load", function () {
  this.setTimeout(() => welcomeModal.classList.add("active"), 2000);
});
startExploring.addEventListener("click", () => {
  welcomeModal.classList.remove("active");
});

closeModal.addEventListener("click", () => {
  welcomeModal.classList.remove("active");
});

// Stars Function
function ratingStars(rate) {
  let stars = "";
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate % 1 !== 0;
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  return stars;
}
//Add to Cart

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const addToCart = (id) => {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    Swal.fire({
      title: "المنتج موجود بالفعل",
      text: `${product.title} موجود بالفعل داخل السلة`,
      icon: "info",
      confirmButtonText: "اغلاق",
    });
    return;
  }

  cart.push({
    ...product,
    quantity: 1,
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  Swal.fire({
    title: "تم إضافة المنتج!",
    text: `${product.title} تمت إضافته إلى السلة بنجاح`,
    icon: "success",
    confirmButtonText: "اغلاق",
  });
};

const updateCartCount = () => {
  const countElement = document.getElementById("cart-count");
  countElement.textContent = cart.length;
};

updateCartCount();
