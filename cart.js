//Cart Page
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

///////////////////////////////////////////////////////
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContain = document.getElementById("cart-items");
const cartTotal = document.getElementById("summaryy-total");

const updateCartCount = () => {
  const countElement = document.getElementById("cart-count");

  countElement.textContent = cart.length;
};

function cartSteps() {
  cartContain.innerHTML = "";

  if (cart.length === 0) {
    cartContain.innerHTML = `
      <tr><td colspan="4" class="text-center py-4">Cart is empty.</td></tr>
    `;
    cartTotal.textContent = "$ 0.00";
    updateCartCount();
    return;
  }

  cart.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <img src="${item.thumbnail}"
               style="width:70px; height:70px; object-fit:cover; border-radius:6px; margin-right:12px;">
          <div>
            <h6 class="mb-1">${item.title}</h6>
            <small class="text-muted">${item.category}</small>
          </div>
        </div>
      </td>

      <td class="fw-bold">$${item.price}</td>

      <td>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-secondary" onclick="decrease(${index})">
            <i class="fas fa-minus"></i>
          </button>

          <input type="text" class="form-control text-center mx-2"
                 style="width:60px" value="${item.quantity || 1}" disabled />

          <button class="btn btn-sm btn-outline-secondary" onclick="increase(${index})">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </td>

      <td>
        <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    cartContain.appendChild(tr);
  });

  updateSummary();
  updateCartCount();
}

function updateSummary() {
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity;
  }
  cartTotal.textContent = `Total $${total.toFixed(2)}`;
}

function decrease(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart[index].quantity = 1;
  }
  saveCart();
}

function increase(index) {
  cart[index].quantity = cart[index].quantity + 1;
  saveCart();
}

function removeItem(index) {
  const product = cart[index];
  Swal.fire({
    title: "هل تريد حذف المنتج؟",
    text: `${product.title} سيتم حذفه من السلة!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم",
    cancelButtonText: "لا",
  }).then((result) => {
    if (result.isConfirmed) {
      cart.splice(index, 1);
      saveCart();
      Swal.fire({
        title: "تم الحذف!",
        text: `${product.title} تم حذفه من السلة`,
        icon: "success",
        confirmButtonText: "تمام",
      });
    }
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartSteps();
}

cartSteps();
const checkoutBtn = document.querySelector(".btn-success");
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    Swal.fire({
      title: "السلة فارغة",
      text: "لا يوجد منتجات لإتمام الطلب",
      icon: "info",
      confirmButtonText: "تمام",
    });
    return;
  }

  Swal.fire({
    title: "تم إتمام الطلب!",
    text: "تمام، تم إتمام الطلب بنجاح",
    icon: "success",
    confirmButtonText: "تمام",
  }).then(() => {
    cart = [];
    saveCart();
  });
});

const emptyCart = document.getElementById("empty-cart-btn");
emptyCart.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, empty it!",
    cancelButtonText: "No, cancel!",
  }).then((result) => {
    if (result.isConfirmed) {
      cart = [];
      saveCart();
      document.getElementById("cart-count").textContent = "0";
      Swal.fire({
        title: "Deleted!",
        text: "Your cart has been emptied.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});
