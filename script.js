
"use strict";

/* =========================================
   JAEYUN SHOP — HALLOWEEN EDITION
   네 index.html 구조에 맞춘 전체 스크립트
   ========================================= */

const CHAT_URL = "https://open.kakao.com/o/여기에링크입력";
const CART_KEY = "jaeyunShopCartV2";
const NOTICE_KEY = "jaeyunShopNoticeHiddenUntil";

/* 1. 상품 데이터 */

const products = [
        {
    id: "clan1000",
    name: "15렙 클랜 제작",
    category: "clan",
    categoryName: "15렙 클랜 제작",
    description: "15렙 클랜 제작 입니다.(1레벨 부터 15렙 기준가격) 자세한건 문의주세요",
    price: 450000,
    image: "15렙.png"
  },
      {
    id: "clan1000",
    name: "클랜 미네랄 1000만",
    category: "clan",
    categoryName: "클랜 미네랄",
    description: "클랜 미네랄 1000만 입니다.",
    price: 40000,
    image: "천만대청.png"
  },
      {
    id: "clan500",
    name: "클랜 미네랄 500만",
    category: "clan",
    categoryName: "클랜 미네랄",
    description: "클랜 미네랄 500만 입니다",
    price: 20000,
    image: "오백.png"
  },
    {
    id: "exp50",
    name: "경험치 1~99레벨",
    category: "exp",
    categoryName: "경험치",
    description: "1레벨 부터 99렙까지 육성 해드립니다.",
    price: 120000,
    image: "으하핳하.png"
  },
  {
    id: "reboot60",
    name: "리부트 1~60레벨",
    category: "reboot",
    categoryName: "리부트",
    description: "원하시는 직업 레벨을 60렙까지 올려드립니다.",
    price: 15000,
    image: "리부트레벨1.png"
  },
  {
    id: "reboot80",
    name: "리부트 60~80레벨",
    category: "reboot",
    categoryName: "리부트",
    description: "원하시는 직업 60레벨을 80렙 까지 올려드립니다.",
    price: 60000,
    image: "리부트 60레벨 80레벨.png"
  },
  {
    id: "exp50",
    name: "경험치 1~50레벨",
    category: "exp",
    categoryName: "경험치",
    description: "50레벨 육성 서비스 입니다.",
    price: 4000,
    image: "경험치50.png"
  },
  {
    id: "exp100",
    name: "경험치 100만",
    category: "exp",
    categoryName: "경험치",
    description: "100만 경험치 획득 서비스입니다.",
    price: 25000,
    image: "슈우웃.png"
  },
  {
    id: "mineral100",
    name: "미네랄 100만",
    category: "mineral",
    categoryName: "미네랄",
    description: "미네랄 100만 단위",
    price: 10000,
    image: "100만.png"
  },
  {
    id: "mineral500",
    name: "미네랄 500만",
    category: "mineral",
    categoryName: "미네랄",
    description: "미네랄 500만 단위",
    price: 50000,
    image: "500만.png"
  },
  {
    id: "mineral1000",
    name: "미네랄 1000만",
    category: "mineral",
    categoryName: "미네랄",
    description: "미네랄 1000만 단위",
    price: 90000,
    image: "1000만.png"
  },
  {
    id: "clan100",
    name: "클랜 미네랄 100만",
    category: "clan",
    categoryName: "클랜 미네랄",
    description: "클랜 미네랄 100만 입니다",
    price: 4000,
    image: "500만클미.png"
  }
];

/* 2. 공통 도구 */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

const money = (amount) =>
  Number(amount).toLocaleString("ko-KR") + "원";

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

/* 3. 장바구니 불러오기 */

function loadCart() {
  try {
    const saved = safeStorageGet(CART_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) =>
        products.some((product) => product.id === item.id)
      )
      .map((item) => ({
        id: item.id,
        quantity: Math.max(
          1,
          Math.floor(Number(item.quantity) || 1)
        )
      }));
  } catch {
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  const saved = safeStorageSet(CART_KEY, JSON.stringify(cart));

  renderCart();
  updateCartCount();

  if (!saved) {
    showToast("브라우저 저장이 제한되어 있을 수 있어요.");
  }
}

function cartDetails() {
  return cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;

      return {
        ...product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    })
    .filter(Boolean);
}

function cartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return cartDetails().reduce(
    (sum, item) => sum + item.subtotal,
    0
  );
}

/* 4. 상품 카드 만들기 */

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.productId = product.id;
  card.dataset.category = product.category;

  const imageArea = document.createElement("div");
  imageArea.className = "product-image";

  const fallback = document.createElement("div");
  fallback.className = "product-image-fallback";

  const icon = document.createElement("strong");
  icon.textContent = "🎃";

  const logo = document.createElement("span");
  logo.textContent = "JAEYUN SHOP";

  fallback.append(icon, logo);

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name + " 이미지";
  img.loading = "lazy";

  img.addEventListener("load", () => {
    imageArea.classList.add("has-image");
  });

  img.addEventListener("error", () => {
    imageArea.classList.remove("has-image");
    img.style.display = "none";
  });

  imageArea.append(fallback, img);

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent = product.categoryName;

  const name = document.createElement("h3");
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const price = document.createElement("div");
  price.className = "product-price";

  price.append(document.createTextNode(
    Number(product.price).toLocaleString("ko-KR")
  ));

  const won = document.createElement("small");
  won.textContent = "원";
  price.append(won);

  const buttons = document.createElement("div");
  buttons.className = "product-buttons";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "add-cart-btn";
  addButton.textContent = "+ 장바구니 담기";

  addButton.addEventListener("click", () => {
    addToCart(product.id);
  });

  buttons.append(addButton);
  info.append(category, name, description, price, buttons);
  card.append(imageArea, info);

  return card;
}

/* 5. 상품 목록 및 검색 */

let activeCategory = "reboot";
let searchKeyword = "";

function getFilteredProducts() {
  const keyword = searchKeyword.trim().toLowerCase();

  return products.filter((product) => {
    const categoryMatches =
      activeCategory === "all" ||
      product.category === activeCategory;

    const text = [
      product.name,
      product.categoryName,
      product.description
    ].join(" ").toLowerCase();

    return categoryMatches && text.includes(keyword);
  });
}

function renderProductList() {
  const list = $("#productList");
  if (!list) return;

  list.replaceChildren();

  const filtered = getFilteredProducts();

  filtered.forEach((product) => {
    list.append(createProductCard(product));
  });

  const empty = $("#emptyState");
  if (empty) empty.hidden = filtered.length > 0;
}

function renderHomeProducts() {
  const list = $("#homeProducts");
  if (!list) return;

  list.replaceChildren();

  products.slice(0, 4).forEach((product) => {
    list.append(createProductCard(product));
  });
}

function selectCategory(category) {
  activeCategory = category || "all";

  $$(".filter-chip").forEach((button) => {
    button.classList.toggle(
      "selected",
      (button.dataset.filter || "all") === activeCategory
    );
  });

  renderProductList();
}

function setupSearchAndFilters() {
  $$(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectCategory(button.dataset.filter || "all");
    });
  });

  const search = $("#priceSearchInput");

  if (search) {
    search.addEventListener("input", () => {
      searchKeyword = search.value;
      renderProductList();
    });
  }

  $("#clearSearch")?.addEventListener("click", () => {
    if (search) search.value = "";

    searchKeyword = "";
    renderProductList();
    search?.focus();
  });

  $$(".category-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectCategory(button.dataset.category || "all");
      showPage("price");
    });
  });
}

/* 6. 페이지 이동 */

const pageMap = {
  home: "homePage",
  price: "pricePage",
  cart: "cartPage",
  order: "orderPage"
};

function showPage(pageName) {
  const targetId = pageMap[pageName];
  if (!targetId) return;

  Object.entries(pageMap).forEach(([name, id]) => {
    const page = document.getElementById(id);
    if (page) page.classList.toggle("active", name === pageName);
  });

  $$(".nav-item").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );
  });

  if (pageName === "cart") renderCart();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupNavigation() {
  $$("[data-page]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const pageName = button.dataset.page;
      if (!pageMap[pageName]) return;

      event.preventDefault();
      showPage(pageName);
    });
  });

  $("#cartOpen")?.addEventListener("click", () => {
    showPage("cart");
  });
}

/* 7. 장바구니 추가, 삭제, 비우기 */

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  showToast(product.name + " 상품을 담았어요.");
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  showToast("상품을 삭제했어요.");
}

function updateCartCount() {
  const count = cartQuantity();

  const headerCount = $("#cartCount");
  if (headerCount) headerCount.textContent = count;

  const navCount = $("#navCartCount");
  if (navCount) {
    navCount.textContent = count;
    navCount.hidden = count === 0;
  }

  const summaryCount = $("#summaryCount");
  if (summaryCount) {
    summaryCount.textContent = count + "개";
  }
}

function renderCart() {
  const list = $("#cartItems");
  if (!list) return;

  list.replaceChildren();

  const details = cartDetails();

  details.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const icon = document.createElement("div");
    icon.className = "cart-item-icon";
    icon.textContent = "🎃";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const quantity = document.createElement("small");
    quantity.textContent =
      money(item.price) + " × " + item.quantity + "개";

    info.append(name, quantity);

    const right = document.createElement("div");
    right.className = "cart-item-right";

    const subtotal = document.createElement("strong");
    subtotal.textContent = money(item.subtotal);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.textContent = "삭제";

    remove.addEventListener("click", () => {
      removeFromCart(item.id);
    });

    right.append(subtotal, remove);
    row.append(icon, info, right);
    list.append(row);
  });

  const empty = $("#cartEmpty");
  if (empty) empty.hidden = details.length > 0;

  const summary = $("#cartSummary");
  if (summary) summary.hidden = details.length === 0;

  const total = $("#cartTotalPrice");
  if (total) total.textContent = money(cartTotal());

  updateCartCount();
}

function setupCartControls() {
  $("#clearCart")?.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("장바구니가 이미 비어 있어요.");
      return;
    }

    cart = [];
    saveCart();
    showToast("장바구니를 비웠어요.");
  });
}

/* 8. 주문 양식 복사 */

function buildOrderForm() {
  const details = cartDetails();

  if (details.length === 0) {
    return [
      "[재윤샵 주문 양식]",
      "",
      "닉네임:",
      "주문 상품:",
      "요청 사항:"
    ].join("\n");
  }

  const lines = details.map((item, index) =>
    `${index + 1}. ${item.name} × ${item.quantity}개 - ${money(item.subtotal)}`
  );

  return [
    "[재윤샵 주문 양식]",
    "",
    ...lines,
    "",
    "총 예상 금액: " + money(cartTotal()),
    "",
    "닉네임:",
    "요청 사항:",
    "",
    "※ 주문 내용을 확인한 후 상담을 진행해 주세요."
  ].join("\n");
}

async function copyOrderForm() {
  if (cart.length === 0) {
    showToast("먼저 장바구니에 상품을 담아 주세요.");
    showPage("price");
    return;
  }

  const text = buildOrderForm();

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";

      document.body.append(textarea);
      textarea.select();

      const success = document.execCommand("copy");
      textarea.remove();

      if (!success) throw new Error("복사 실패");
    }

    showToast("주문 양식을 복사했어요!");
  } catch {
    showToast("복사에 실패했어요. 브라우저 권한을 확인해 주세요.");
  }
}

function setupOrderButtons() {
  $("#copyCartOrder")?.addEventListener("click", (event) => {
    event.preventDefault();
    copyOrderForm();
  });
}

/* 9. 공지 모달 */

function setupNotice() {
  const modal = $("#noticeModal");
  if (!modal) return;

  const until = Number(safeStorageGet(NOTICE_KEY) || 0);
  modal.hidden = Date.now() < until;

  $$("[data-close='noticeModal']").forEach((button) => {
    button.addEventListener("click", () => {
      modal.hidden = true;
    });
  });

  $("#hideNotice24")?.addEventListener("click", () => {
    safeStorageSet(
      NOTICE_KEY,
      String(Date.now() + 24 * 60 * 60 * 1000)
    );

    modal.hidden = true;
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.hidden = true;
    }
  });
}

/* 10. 오픈채팅 링크 검사
   실제 링크는 index.html의 href에서 관리한다. */

function setupChatLinks() {
  $$('a[href*="open.kakao.com"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.href.includes("여기에링크입력")) {
        event.preventDefault();
        showToast("HTML에서 실제 오픈채팅 링크를 입력해 주세요.");
      }
    });
  });
}

/* 11. 시작 */

function initShop() {
  renderProductList();
  renderHomeProducts();
  renderCart();

  setupSearchAndFilters();
  setupNavigation();
  setupCartControls();
  setupOrderButtons();
  setupNotice();
  setupChatLinks();

  console.log("JAEYUN SHOP: 모든 기능 초기화 완료");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShop);
} else {
  initShop();
}
