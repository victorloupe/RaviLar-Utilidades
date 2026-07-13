// ==========================================================================
// SUPABASE CLIENT CONFIGURATION
// ==========================================================================
const supabaseUrl = "https://wbgdyheswfzgxaxvhugv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2R5aGVzd2Z6Z3hheHZodWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mzk1OTIsImV4cCI6MjA5OTUxNTU5Mn0.kvPoOJIoqHPpUfA3PFBPFuQ0yDALS1LOChd2bYCGoMs";

const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// Default categories for Database Seed/Reset
const DEFAULT_CATEGORIES = [
    { name: "Cozinha", slug: "cozinha", image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=400" },
    { name: "Organização", slug: "organizacao", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400" },
    { name: "Mesa Posta", slug: "mesa-posta", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400" },
    { name: "Decoração", slug: "decoracao", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400" }
];

// Default banners for Database Seed/Reset
const DEFAULT_BANNERS = [
    { image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800", title: "Design Premium", subtitle: "Qualidade selecionada" },
    { image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800", title: "Praticidade", subtitle: "Organizadores inteligentes" },
    { image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", title: "Mesa Posta", subtitle: "Requinte nas refeições" }
];

// ==========================================================================
// ADMIN PANEL STATE
// ==========================================================================
let adminProducts = [];
let adminCategories = [];
let adminBanners = [];
let adminReviews = [];

let isEditMode = false;
let editProductId = null;

let isCategoryEditMode = false;
let editCategoryId = null;

let isBannerEditMode = false;
let editBannerId = null;

let isReviewEditMode = false;
let editReviewId = null;

let searchQuery = "";
let uploadedMediaUrls = []; // Holds arrays of uploaded URLs for active product form

// Catalog list pagination state
let adminCurrentPage = 1;
const ADMIN_PRODUCTS_PER_PAGE = 10;

// DOM Elements - Products
const form = document.getElementById("admin-product-form");
const tableBody = document.getElementById("admin-table-body");
const tableSearch = document.getElementById("admin-table-search");
const formTitle = document.getElementById("form-title");
const formSubmitBtn = document.getElementById("form-submit-btn");
const formCancelBtn = document.getElementById("form-cancel-btn");
const toast = document.getElementById("admin-toast");
const toastMsg = document.getElementById("toast-message");
const toastIcon = document.getElementById("toast-icon");
const tablePagination = document.getElementById("admin-table-pagination");

// DOM Elements - Tabs Navigation
const tabButtons = document.querySelectorAll(".admin-tab-btn");
const tabContents = document.querySelectorAll(".admin-tab-content");

// Stats Elements
const statTotal = document.getElementById("stat-total-products");
const statCozinha = document.getElementById("stat-cozinha");
const statOrganizacao = document.getElementById("stat-organizacao");
const statMesaPosta = document.getElementById("stat-mesa-posta");
const statDecoracao = document.getElementById("stat-decoracao");

// Drag & Drop Product Media Elements
const mediaDropZone = document.getElementById("media-drop-zone");
const mediaFileInput = document.getElementById("media-file-input");
const uploadProgressBar = document.getElementById("upload-progress-bar");
const uploadProgressFill = document.getElementById("upload-progress-fill");
const uploadProgressText = document.getElementById("upload-progress-text");
const mediaPreviewContainer = document.getElementById("media-preview-container");
const productImagesTextarea = document.getElementById("admin-product-image");

// Category Management Elements
const categoryForm = document.getElementById("admin-category-form");
const categoriesList = document.getElementById("admin-categories-list");
const categorySelect = document.getElementById("admin-product-category");
const categoryDropZone = document.getElementById("category-drop-zone");
const categoryFileInput = document.getElementById("category-file-input");
const categoryProgressBar = document.getElementById("category-progress-bar");
const categoryProgressFill = document.getElementById("category-progress-fill");
const categoryProgressText = document.getElementById("category-progress-text");
const categoryImageInput = document.getElementById("admin-category-image");
const categoryFormTitle = document.getElementById("category-form-title");
const categorySubmitBtn = document.getElementById("category-submit-btn");
const categoryCancelBtn = document.getElementById("category-cancel-btn");
const categoryIdField = document.getElementById("category-id-field");
const categoryNameInput = document.getElementById("admin-category-name");

// Banner Management Elements
const bannerForm = document.getElementById("admin-banner-form");
const bannersList = document.getElementById("admin-banners-list");
const bannerDropZone = document.getElementById("banner-drop-zone");
const bannerFileInput = document.getElementById("banner-file-input");
const bannerProgressBar = document.getElementById("banner-progress-bar");
const bannerProgressFill = document.getElementById("banner-progress-fill");
const bannerProgressText = document.getElementById("banner-progress-text");
const bannerImageInput = document.getElementById("admin-banner-image");
const bannerFormTitle = document.getElementById("banner-form-title");
const bannerSubmitBtn = document.getElementById("banner-submit-btn");
const bannerCancelBtn = document.getElementById("banner-cancel-btn");
const bannerIdField = document.getElementById("banner-id-field");

// Review Management Elements
const reviewForm = document.getElementById("admin-review-form");
const reviewsList = document.getElementById("admin-reviews-list");
const reviewProductSelect = document.getElementById("admin-review-product");
const reviewFormTitle = document.getElementById("review-form-title");
const reviewSubmitBtn = document.getElementById("review-submit-btn");
const reviewCancelBtn = document.getElementById("review-cancel-btn");
const reviewIdField = document.getElementById("review-id-field");

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================

function getProductMedia(imageField) {
    if (!imageField) return [];
    try {
        if (typeof imageField === "string" && imageField.trim().startsWith("[")) {
            return JSON.parse(imageField);
        } else if (Array.isArray(imageField)) {
            return imageField;
        } else {
            return [imageField];
        }
    } catch (e) {
        return [imageField];
    }
}

// ==========================================================================
// CONTROLLER FUNCTIONS
// ==========================================================================

async function init() {
    if (!supabaseClient) {
        showToast("Erro: Cliente Supabase não carregado. Verifique a conexão com a internet.", "error");
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--error-color); padding: 30px;">Falha ao inicializar o Supabase. Verifique suas credenciais.</td></tr>`;
        return;
    }

    bindEvents();
    bindTabEvents();
    await loadCategories();
    await loadBanners();
    await loadProducts();
    await loadReviews();
}

// Bind Tab navigation click events
function bindTabEvents() {
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            // Switch buttons active state
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            // Switch content active state
            tabContents.forEach(content => {
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add("active");
                } else {
                    content.classList.remove("active");
                }
            });
        });
    });
}

// Fetch categories from database
async function loadCategories() {
    try {
        const { data, error } = await supabaseClient
            .from("categories")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        adminCategories = data || [];
        populateProductCategorySelect();
        renderCategoriesList();
    } catch (err) {
        showToast("Erro ao carregar categorias: " + err.message, "error");
    }
}

// Fetch banners from database
async function loadBanners() {
    try {
        const { data, error } = await supabaseClient
            .from("banners")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        adminBanners = data || [];
        renderBannersList();
    } catch (err) {
        showToast("Erro ao carregar banners: " + err.message, "error");
    }
}

// Fetch reviews from database
async function loadReviews() {
    try {
        const { data, error } = await supabaseClient
            .from("reviews")
            .select("id, name, quote, rating, product_id, products(name, image)")
            .order("id", { ascending: true });

        if (error) throw error;

        adminReviews = data || [];
        renderReviewsList();
    } catch (err) {
        showToast("Erro ao carregar avaliações: " + err.message, "error");
    }
}

// Populate product category select options
function populateProductCategorySelect() {
    if (!categorySelect) return;
    const currentVal = categorySelect.value;
    
    categorySelect.innerHTML = '<option value="" disabled selected>Escolha a categoria</option>';
    adminCategories.forEach(cat => {
        categorySelect.innerHTML += `<option value="${cat.slug}">${cat.name}</option>`;
    });

    if (currentVal) {
        categorySelect.value = currentVal;
    }
}

// Populate available products select in Review Form
function populateReviewProductSelect() {
    if (!reviewProductSelect) return;
    const currentVal = reviewProductSelect.value;

    reviewProductSelect.innerHTML = '<option value="" disabled selected>Escolha o produto</option>';
    adminProducts.forEach(prod => {
        reviewProductSelect.innerHTML += `<option value="${prod.id}">${prod.name}</option>`;
    });

    if (currentVal) {
        reviewProductSelect.value = currentVal;
    }
}

// Render administrative list of categories
function renderCategoriesList() {
    if (!categoriesList) return;
    categoriesList.innerHTML = "";

    if (adminCategories.length === 0) {
        categoriesList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding: 12px 0;">Nenhuma categoria cadastrada.</div>`;
        return;
    }

    adminCategories.forEach(cat => {
        const row = document.createElement("div");
        row.className = "admin-category-row";
        row.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${cat.image}" style="width:36px; height:36px; object-fit:cover; border-radius:4px;">
                <span style="font-weight:600; color:var(--primary-color);">${cat.name}</span>
            </div>
            <div style="display:flex; gap: 8px;">
                <button class="btn-action-edit-category" style="background:none; border:none; color:var(--primary-color); cursor:pointer; font-size:1.1rem; padding: 4px;" title="Editar Categoria"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-action-delete-category" style="background:none; border:none; color:var(--error-color); cursor:pointer; font-size:1.1rem; padding: 4px;" title="Excluir Categoria"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        row.querySelector(".btn-action-edit-category").addEventListener("click", () => editCategory(cat.id));
        row.querySelector(".btn-action-delete-category").addEventListener("click", () => deleteCategory(cat.id, cat.name));
        categoriesList.appendChild(row);
    });
}

// Populate administrative list of banners
function renderBannersList() {
    if (!bannersList) return;
    bannersList.innerHTML = "";

    if (adminBanners.length === 0) {
        bannersList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding: 12px 0;">Nenhum banner cadastrado.</div>`;
        return;
    }

    adminBanners.forEach(banner => {
        const row = document.createElement("div");
        row.className = "admin-category-row";
        row.innerHTML = `
            <div style="display:flex; align-items:center; gap:16px;">
                <img src="${banner.image}" style="width:80px; height:50px; object-fit:cover; border-radius:4px; border: 1px solid var(--border-color);">
                <div>
                    <h4 style="margin:0; font-size:0.95rem; font-weight:600; color:var(--primary-color);">${banner.title}</h4>
                    <p style="margin:4px 0 0; font-size:0.8rem; color:var(--text-muted);">${banner.subtitle}</p>
                </div>
            </div>
            <div style="display:flex; gap: 8px;">
                <button class="btn-action-edit-banner" style="background:none; border:none; color:var(--primary-color); cursor:pointer; font-size:1.1rem; padding: 4px;" title="Editar Banner"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-action-delete-banner" style="background:none; border:none; color:var(--error-color); cursor:pointer; font-size:1.1rem; padding: 4px;" title="Excluir Banner"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        row.querySelector(".btn-action-edit-banner").addEventListener("click", () => editBanner(banner.id));
        row.querySelector(".btn-action-delete-banner").addEventListener("click", () => deleteBanner(banner.id, banner.title));
        bannersList.appendChild(row);
    });
}

// Populate administrative list of reviews
function renderReviewsList() {
    if (!reviewsList) return;
    reviewsList.innerHTML = "";

    if (adminReviews.length === 0) {
        reviewsList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding: 12px 0;">Nenhuma avaliação cadastrada.</div>`;
        return;
    }

    adminReviews.forEach(rev => {
        let prodName = "Sem produto associado";
        let prodImg = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400";

        if (rev.products) {
            prodName = rev.products.name;
            const media = getProductMedia(rev.products.image);
            if (media.length > 0) prodImg = media[0];
        }

        const row = document.createElement("div");
        row.className = "admin-category-row";
        row.innerHTML = `
            <div style="display:flex; align-items:center; gap:16px;">
                <img src="${prodImg}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; border: 1px solid var(--border-color);">
                <div>
                    <h4 style="margin:0; font-size:0.95rem; font-weight:600; color:var(--primary-color);">${rev.name}</h4>
                    <p style="margin:4px 0 0; font-size:0.8rem; color:var(--text-muted);">${prodName} (${rev.rating}★)</p>
                </div>
            </div>
            <div style="display:flex; gap: 8px;">
                <button class="btn-action-edit-review" style="background:none; border:none; color:var(--primary-color); cursor:pointer; font-size:1.1rem; padding: 4px;" title="Editar Avaliação"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-action-delete-review" style="background:none; border:none; color:var(--error-color); cursor:pointer; font-size:1.1rem; padding: 4px;" title="Excluir Avaliação"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        row.querySelector(".btn-action-edit-review").addEventListener("click", () => editReview(rev.id));
        row.querySelector(".btn-action-delete-review").addEventListener("click", () => deleteReview(rev.id, rev.name));
        reviewsList.appendChild(row);
    });
}

// Populate category editing states
function editCategory(id) {
    const cat = adminCategories.find(c => c.id === id);
    if (!cat) return;

    isCategoryEditMode = true;
    editCategoryId = id;

    categoryNameInput.value = cat.name;
    categoryImageInput.value = cat.image;
    categoryIdField.value = cat.id;

    categoryFormTitle.textContent = "Editar Categoria";
    categorySubmitBtn.innerHTML = `Salvar Alterações <i class="fa-solid fa-floppy-disk"></i>`;
    categoryCancelBtn.classList.remove("hide");

    categoryForm.closest(".admin-card").scrollIntoView({ behavior: "smooth" });
}

// Populate banner editing states
function editBanner(id) {
    const banner = adminBanners.find(b => b.id === id);
    if (!banner) return;

    isBannerEditMode = true;
    editBannerId = id;

    document.getElementById("admin-banner-title").value = banner.title;
    document.getElementById("admin-banner-subtitle").value = banner.subtitle;
    bannerImageInput.value = banner.image;
    bannerIdField.value = banner.id;

    bannerFormTitle.textContent = "Editar Banner";
    bannerSubmitBtn.innerHTML = `Salvar Alterações <i class="fa-solid fa-floppy-disk"></i>`;
    bannerCancelBtn.classList.remove("hide");

    bannerForm.closest(".admin-card").scrollIntoView({ behavior: "smooth" });
}

// Populate review editing states
function editReview(id) {
    const rev = adminReviews.find(r => r.id === id);
    if (!rev) return;

    isReviewEditMode = true;
    editReviewId = id;

    document.getElementById("admin-review-name").value = rev.name;
    document.getElementById("admin-review-quote").value = rev.quote;
    document.getElementById("admin-review-rating").value = rev.rating;
    reviewProductSelect.value = rev.product_id || "";
    reviewIdField.value = rev.id;

    reviewFormTitle.textContent = "Editar Avaliação";
    reviewSubmitBtn.innerHTML = `Salvar Alterações <i class="fa-solid fa-floppy-disk"></i>`;
    reviewCancelBtn.classList.remove("hide");

    reviewForm.closest(".admin-card").scrollIntoView({ behavior: "smooth" });
}

// Reset category editing states
function resetCategoryFormMode() {
    isCategoryEditMode = false;
    editCategoryId = null;

    categoryForm.reset();
    categoryIdField.value = "";
    categoryImageInput.value = "";

    categoryFormTitle.textContent = "Cadastrar Nova Categoria";
    categorySubmitBtn.innerHTML = `Adicionar Categoria <i class="fa-solid fa-plus"></i>`;
    categoryCancelBtn.classList.add("hide");
}

// Reset banner editing states
function resetBannerFormMode() {
    isBannerEditMode = false;
    editBannerId = null;

    bannerForm.reset();
    bannerIdField.value = "";
    bannerImageInput.value = "";

    bannerFormTitle.textContent = "Cadastrar Novo Banner";
    bannerSubmitBtn.innerHTML = `Adicionar Banner <i class="fa-solid fa-plus"></i>`;
    bannerCancelBtn.classList.add("hide");
}

// Reset review editing states
function resetReviewFormMode() {
    isReviewEditMode = false;
    editReviewId = null;

    reviewForm.reset();
    reviewIdField.value = "";

    reviewFormTitle.textContent = "Cadastrar Nova Avaliação";
    reviewSubmitBtn.innerHTML = `Adicionar Avaliação <i class="fa-solid fa-plus"></i>`;
    reviewCancelBtn.classList.add("hide");
}

// Delete category handler
async function deleteCategory(id, name) {
    if (!confirm(`Deseja realmente excluir a categoria "${name}"? Os produtos associados continuarão existindo no banco de dados.`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from("categories")
            .delete()
            .eq("id", id);

        if (error) throw error;

        showToast(`Categoria "${name}" excluída com sucesso!`, "success");
        
        if (isCategoryEditMode && editCategoryId === id) {
            resetCategoryFormMode();
        }

        await loadCategories();
    } catch (err) {
        showToast("Erro ao excluir categoria: " + err.message, "error");
    }
}

// Delete banner handler
async function deleteBanner(id, title) {
    if (!confirm(`Deseja realmente excluir o banner "${title}"?`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from("banners")
            .delete()
            .eq("id", id);

        if (error) throw error;

        showToast(`Banner "${title}" excluído com sucesso!`, "success");
        
        if (isBannerEditMode && editBannerId === id) {
            resetBannerFormMode();
        }

        await loadBanners();
    } catch (err) {
        showToast("Erro ao excluir banner: " + err.message, "error");
    }
}

// Delete review handler
async function deleteReview(id, name) {
    if (!confirm(`Deseja realmente excluir a avaliação de "${name}"?`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from("reviews")
            .delete()
            .eq("id", id);

        if (error) throw error;

        showToast(`Avaliação de "${name}" excluída com sucesso!`, "success");
        
        if (isReviewEditMode && editReviewId === id) {
            resetReviewFormMode();
        }

        await loadReviews();
    } catch (err) {
        showToast("Erro ao excluir avaliação: " + err.message, "error");
    }
}

// Fetch products from database
async function loadProducts() {
    try {
        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        adminProducts = data || [];
        updateStats();
        renderTable();
        populateReviewProductSelect(); // Populate the reviews product dropdown dynamically
    } catch (err) {
        showToast("Erro ao carregar catálogo: " + err.message, "error");
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--error-color); padding: 30px;">Erro ao carregar dados. Garanta que executou o script SQL no Supabase.</td></tr>`;
    }
}

// Render dynamic table list with pagination
function renderTable() {
    tableBody.innerHTML = "";

    const filtered = adminProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery)
    );

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhum produto cadastrado.</td></tr>`;
        tablePagination.innerHTML = "";
        return;
    }

    // Pagination calculations
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ADMIN_PRODUCTS_PER_PAGE) || 1;

    if (adminCurrentPage > totalPages) {
        adminCurrentPage = totalPages;
    }

    const startIndex = (adminCurrentPage - 1) * ADMIN_PRODUCTS_PER_PAGE;
    const endIndex = startIndex + ADMIN_PRODUCTS_PER_PAGE;
    const pageProducts = filtered.slice(startIndex, endIndex);

    pageProducts.forEach(p => {
        const badgeHTML = p.badge ? `<span class="admin-badge badge-promo">${p.badge}</span>` : `<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>`;
        const priceFormatted = `R$ ${p.price.toFixed(2).replace('.', ',')}`;

        // Get first image for thumbnail display in table
        const media = getProductMedia(p.image);
        const thumbnail = media[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600';

        // Find friendly category name if available
        const catObj = adminCategories.find(c => c.slug === p.category);
        const categoryName = catObj ? catObj.name : p.category;

        const trHTML = `
            <tr data-id="${p.id}">
                <td><img src="${thumbnail}" alt="${p.name}" class="admin-table-img"></td>
                <td style="font-weight: 600; color: var(--primary-color);">${p.name}</td>
                <td><span class="admin-badge badge-category">${categoryName}</span></td>
                <td style="font-weight: 700;">${priceFormatted}</td>
                <td>${badgeHTML}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn-action btn-action-edit" title="Editar Produto"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-action btn-action-delete" title="Excluir Produto"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", trHTML);
    });

    // Render pagination controls
    renderTablePagination(totalPages);
    bindTableActionEvents();
}

// Generate pagination controls buttons
function renderTablePagination(totalPages) {
    if (!tablePagination) return;
    tablePagination.innerHTML = "";

    if (totalPages <= 1) return;

    let paginationHTML = "";

    // Previous Button
    paginationHTML += `
        <button class="page-btn" ${adminCurrentPage === 1 ? 'disabled' : ''} id="admin-table-prev-page">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    // Numerical Buttons
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="page-btn ${adminCurrentPage === i ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    // Next Button
    paginationHTML += `
        <button class="page-btn" ${adminCurrentPage === totalPages ? 'disabled' : ''} id="admin-table-next-page">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    tablePagination.innerHTML = paginationHTML;

    // Bind page change events
    const prevBtn = document.getElementById("admin-table-prev-page");
    const nextBtn = document.getElementById("admin-table-next-page");
    const numBtns = tablePagination.querySelectorAll("button[data-page]");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (adminCurrentPage > 1) {
                adminCurrentPage--;
                renderTable();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (adminCurrentPage < totalPages) {
                adminCurrentPage++;
                renderTable();
            }
        });
    }

    numBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            adminCurrentPage = parseInt(btn.getAttribute("data-page"));
            renderTable();
        });
    });
}

function bindTableActionEvents() {
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(row => {
        const id = parseInt(row.getAttribute("data-id"));
        if (!id) return;

        row.querySelector(".btn-action-edit").addEventListener("click", () => editProduct(id));
        row.querySelector(".btn-action-delete").addEventListener("click", () => deleteProduct(id));
    });
}

// Bind Page Events
function bindEvents() {
    // Form submission
    form.addEventListener("submit", submitProductForm);

    // Cancel edit button click
    formCancelBtn.addEventListener("click", resetFormMode);

    // Real-time table filter
    tableSearch.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        adminCurrentPage = 1;
        renderTable();
    });

    // PRODUCT MEDIA DRAG AND DROP
    mediaDropZone.addEventListener("click", () => mediaFileInput.click());
    
    mediaDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        mediaDropZone.classList.add("dragover");
    });
    
    mediaDropZone.addEventListener("dragleave", () => {
        mediaDropZone.classList.remove("dragover");
    });
    
    mediaDropZone.addEventListener("drop", async (e) => {
        e.preventDefault();
        mediaDropZone.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFilesUpload(files);
        }
    });
    
    mediaFileInput.addEventListener("change", async () => {
        const files = mediaFileInput.files;
        if (files.length > 0) {
            await handleFilesUpload(files);
        }
    });

    // CATEGORY COVER DRAG AND DROP & SUBMIT
    categoryForm.addEventListener("submit", submitCategoryForm);
    categoryCancelBtn.addEventListener("click", resetCategoryFormMode);
    categoryDropZone.addEventListener("click", () => categoryFileInput.click());

    categoryDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        categoryDropZone.classList.add("dragover");
    });
    
    categoryDropZone.addEventListener("dragleave", () => {
        categoryDropZone.classList.remove("dragover");
    });
    
    categoryDropZone.addEventListener("drop", async (e) => {
        e.preventDefault();
        categoryDropZone.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleCategoryCoverUpload(files[0]);
        }
    });
    
    categoryFileInput.addEventListener("change", async () => {
        const files = categoryFileInput.files;
        if (files.length > 0) {
            await handleCategoryCoverUpload(files[0]);
        }
    });

    // BANNER COVER DRAG AND DROP & SUBMIT
    bannerForm.addEventListener("submit", submitBannerForm);
    bannerCancelBtn.addEventListener("click", resetBannerFormMode);
    bannerDropZone.addEventListener("click", () => bannerFileInput.click());

    bannerDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        bannerDropZone.classList.add("dragover");
    });
    
    bannerDropZone.addEventListener("dragleave", () => {
        bannerDropZone.classList.remove("dragover");
    });
    
    bannerDropZone.addEventListener("drop", async (e) => {
        e.preventDefault();
        bannerDropZone.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleBannerCoverUpload(files[0]);
        }
    });
    
    bannerFileInput.addEventListener("change", async () => {
        const files = bannerFileInput.files;
        if (files.length > 0) {
            await handleBannerCoverUpload(files[0]);
        }
    });

    // REVIEW SUBMIT & CANCEL EVENTS
    reviewForm.addEventListener("submit", submitReviewForm);
    reviewCancelBtn.addEventListener("click", resetReviewFormMode);
}

// Handle file uploads one-by-one to Supabase Storage for product
async function handleFilesUpload(files) {
    if (!supabaseClient) {
        showToast("Erro: Cliente Supabase não inicializado.", "error");
        return;
    }

    uploadProgressBar.classList.remove("hide");
    uploadProgressFill.style.width = "0%";
    
    const totalFiles = files.length;
    let successfulUploads = 0;

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        
        // Validation: Max size 15MB
        if (file.size > 15 * 1024 * 1024) {
            showToast(`O arquivo "${file.name}" excede o limite de 15MB.`, "error");
            continue;
        }

        // Show active file name
        const percent = Math.round((i / totalFiles) * 100);
        uploadProgressFill.style.width = `${percent}%`;
        uploadProgressText.textContent = `Enviando (${i+1}/${totalFiles}): ${file.name}`;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            // Upload to 'product-media' bucket
            const { error: uploadError } = await supabaseClient
                .storage
                .from("product-media")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: publicUrlData } = supabaseClient
                .storage
                .from("product-media")
                .getPublicUrl(filePath);

            if (publicUrlData && publicUrlData.publicUrl) {
                uploadedMediaUrls.push(publicUrlData.publicUrl);
                successfulUploads++;
            }
        } catch (err) {
            showToast(`Erro ao carregar "${file.name}": ${err.message}`, "error");
            console.error(err);
        }
    }

    // Hide progress bar with a slight delay
    uploadProgressFill.style.width = "100%";
    uploadProgressText.textContent = `Envio completo! ${successfulUploads} mídias carregadas.`;
    setTimeout(() => {
        uploadProgressBar.classList.add("hide");
    }, 2000);

    // Refresh display
    updateMediaPreviews();
}

// Handle single file upload for category cover to Supabase Storage
async function handleCategoryCoverUpload(file) {
    if (!supabaseClient) {
        showToast("Erro: Cliente Supabase não inicializado.", "error");
        return;
    }

    if (file.size > 15 * 1024 * 1024) {
        showToast(`O arquivo de capa excede o limite de 15MB.`, "error");
        return;
    }

    categoryProgressBar.classList.remove("hide");
    categoryProgressFill.style.width = "30%";
    categoryProgressText.textContent = "Preparando upload...";

    const fileExt = file.name.split('.').pop();
    const fileName = `cat_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
        categoryProgressFill.style.width = "60%";
        categoryProgressText.textContent = "Carregando imagem...";

        const { error: uploadError } = await supabaseClient
            .storage
            .from("product-media")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        categoryProgressFill.style.width = "90%";
        
        const { data: publicUrlData } = supabaseClient
            .storage
            .from("product-media")
            .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
            categoryImageInput.value = publicUrlData.publicUrl;
            categoryProgressFill.style.width = "100%";
            categoryProgressText.textContent = "Upload concluído!";
            showToast("Imagem de capa carregada com sucesso!", "success");
        }
    } catch (err) {
        showToast("Erro ao fazer upload da capa: " + err.message, "error");
        console.error(err);
    }

    setTimeout(() => {
        categoryProgressBar.classList.add("hide");
    }, 2000);
}

// Handle single file upload for banner cover to Supabase Storage
async function handleBannerCoverUpload(file) {
    if (!supabaseClient) {
        showToast("Erro: Cliente Supabase não inicializado.", "error");
        return;
    }

    if (file.size > 15 * 1024 * 1024) {
        showToast(`O arquivo de imagem excede o limite de 15MB.`, "error");
        return;
    }

    bannerProgressBar.classList.remove("hide");
    bannerProgressFill.style.width = "30%";
    bannerProgressText.textContent = "Preparando upload...";

    const fileExt = file.name.split('.').pop();
    const fileName = `banner_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
        bannerProgressFill.style.width = "60%";
        bannerProgressText.textContent = "Carregando imagem...";

        const { error: uploadError } = await supabaseClient
            .storage
            .from("product-media")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        bannerProgressFill.style.width = "90%";
        
        const { data: publicUrlData } = supabaseClient
            .storage
            .from("product-media")
            .getPublicUrl(filePath);

        if (publicUrlData && publicUrlData.publicUrl) {
            bannerImageInput.value = publicUrlData.publicUrl;
            bannerProgressFill.style.width = "100%";
            bannerProgressText.textContent = "Upload concluído!";
            showToast("Imagem do banner carregada com sucesso!", "success");
        }
    } catch (err) {
        showToast("Erro ao fazer upload da capa do banner: " + err.message, "error");
        console.error(err);
    }

    setTimeout(() => {
        bannerProgressBar.classList.add("hide");
    }, 2000);
}

// Category form submit handler (Supports Insert & Edit)
async function submitCategoryForm(e) {
    e.preventDefault();

    const name = document.getElementById("admin-category-name").value.trim();
    const image = categoryImageInput.value.trim();

    if (!name || !image) {
        showToast("Preencha o nome e selecione a capa da categoria.", "error");
        return;
    }

    const slug = name.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");

    try {
        if (isCategoryEditMode) {
            const { error } = await supabaseClient
                .from("categories")
                .update({ name, slug, image })
                .eq("id", editCategoryId);

            if (error) throw error;
            showToast(`Categoria "${name}" atualizada com sucesso!`, "success");
        } else {
            const { error } = await supabaseClient
                .from("categories")
                .insert([{ name, slug, image }]);

            if (error) throw error;
            showToast(`Categoria "${name}" cadastrada com sucesso!`, "success");
        }
        
        resetCategoryFormMode();
        await loadCategories();
    } catch (err) {
        showToast("Erro nas operações de categoria: " + err.message, "error");
    }
}

// Banner form submit handler (Supports Insert & Edit)
async function submitBannerForm(e) {
    e.preventDefault();

    const title = document.getElementById("admin-banner-title").value.trim();
    const subtitle = document.getElementById("admin-banner-subtitle").value.trim();
    const image = bannerImageInput.value.trim();

    if (!title || !subtitle || !image) {
        showToast("Preencha todos os campos e faça o upload da imagem do banner.", "error");
        return;
    }

    try {
        if (isBannerEditMode) {
            const { error } = await supabaseClient
                .from("banners")
                .update({ title, subtitle, image })
                .eq("id", editBannerId);

            if (error) throw error;
            showToast(`Banner "${title}" atualizado com sucesso!`, "success");
        } else {
            const { error } = await supabaseClient
                .from("banners")
                .insert([{ title, subtitle, image }]);

            if (error) throw error;
            showToast(`Banner "${title}" cadastrado com sucesso!`, "success");
        }
        
        resetBannerFormMode();
        await loadBanners();
    } catch (err) {
        showToast("Erro nas operações de banner: " + err.message, "error");
    }
}

// Review form submit handler (Supports Insert & Edit)
async function submitReviewForm(e) {
    e.preventDefault();

    const name = document.getElementById("admin-review-name").value.trim();
    const quote = document.getElementById("admin-review-quote").value.trim();
    const rating = parseInt(document.getElementById("admin-review-rating").value);
    const productId = parseInt(reviewProductSelect.value);

    if (!name || !quote || isNaN(rating) || isNaN(productId)) {
        showToast("Preencha todos os campos obrigatórios.", "error");
        return;
    }

    const payload = {
        name,
        quote,
        rating,
        product_id: productId
    };

    try {
        if (isReviewEditMode) {
            const { error } = await supabaseClient
                .from("reviews")
                .update(payload)
                .eq("id", editReviewId);

            if (error) throw error;
            showToast(`Avaliação de "${name}" atualizada com sucesso!`, "success");
        } else {
            const { error } = await supabaseClient
                .from("reviews")
                .insert([payload]);

            if (error) throw error;
            showToast(`Avaliação de "${name}" cadastrada com sucesso!`, "success");
        }

        resetReviewFormMode();
        await loadReviews();
    } catch (err) {
        showToast("Erro nas operações de avaliação: " + err.message, "error");
    }
}

// Render uploaded media thumbnails in product form
function updateMediaPreviews() {
    mediaPreviewContainer.innerHTML = "";
    
    uploadedMediaUrls.forEach((url, index) => {
        const isVideo = url.toLowerCase().endsWith(".mp4");
        const previewItem = document.createElement("div");
        previewItem.className = "media-preview-item";
        
        if (isVideo) {
            previewItem.innerHTML = `
                <video src="${url}" muted preload="metadata"></video>
                <div class="video-badge">Vídeo</div>
            `;
        } else {
            previewItem.innerHTML = `<img src="${url}" alt="Pré-visualização ${index + 1}">`;
        }

        const removeBtn = document.createElement("div");
        removeBtn.className = "media-preview-remove";
        removeBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        removeBtn.addEventListener("click", () => {
            uploadedMediaUrls.splice(index, 1);
            updateMediaPreviews();
        });

        previewItem.appendChild(removeBtn);
        mediaPreviewContainer.appendChild(previewItem);
    });

    productImagesTextarea.value = JSON.stringify(uploadedMediaUrls);
}

// Update counters
function updateStats() {
    statTotal.textContent = adminProducts.length;
    
    const count = (cat) => adminProducts.filter(p => p.category === cat).length;
    
    if (statCozinha) statCozinha.textContent = count("cozinha");
    if (statOrganizacao) statOrganizacao.textContent = count("organizacao");
    if (statMesaPosta) statMesaPosta.textContent = count("mesa-posta");
    if (statDecoracao) statDecoracao.textContent = count("decoracao");
}

// Add or Edit product submit handler
async function submitProductForm(e) {
    e.preventDefault();

    const name = document.getElementById("admin-product-name").value.trim();
    const category = document.getElementById("admin-product-category").value;
    const price = parseFloat(document.getElementById("admin-product-price").value);
    const badge = document.getElementById("admin-product-badge").value.trim();
    const description = document.getElementById("admin-product-description").value.trim();

    if (!name || !category || isNaN(price) || uploadedMediaUrls.length === 0 || !description) {
        showToast("Por favor, preencha todos os campos obrigatórios e envie pelo menos 1 imagem/vídeo.", "error");
        return;
    }

    const payload = {
        name,
        category,
        price,
        image: JSON.stringify(uploadedMediaUrls),
        badge: badge || null,
        description,
        rating: 5.0,
        reviews: 0
    };

    try {
        if (isEditMode) {
            const { error } = await supabaseClient
                .from("products")
                .update(payload)
                .eq("id", editProductId);

            if (error) throw error;
            showToast("Produto atualizado com sucesso!", "success");
        } else {
            const { error } = await supabaseClient
                .from("products")
                .insert([payload]);

            if (error) throw error;
            showToast("Produto cadastrado com sucesso!", "success");
        }

        resetFormMode();
        await loadProducts();
    } catch (err) {
        showToast("Erro nas operações de banco: " + err.message, "error");
    }
}

// Edit Mode Activation
function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    isEditMode = true;
    editProductId = productId;

    uploadedMediaUrls = getProductMedia(product.image);
    updateMediaPreviews();

    document.getElementById("product-id-field").value = product.id;
    document.getElementById("admin-product-name").value = product.name;
    document.getElementById("admin-product-category").value = product.category;
    document.getElementById("admin-product-price").value = product.price;
    document.getElementById("admin-product-badge").value = product.badge || "";
    document.getElementById("admin-product-description").value = product.description;

    formTitle.textContent = "Editar Produto";
    formSubmitBtn.innerHTML = `Salvar Alterações <i class="fa-solid fa-floppy-disk"></i>`;
    formCancelBtn.classList.remove("hide");

    form.closest(".admin-card").scrollIntoView({ behavior: "smooth" });
}

// Reset form fields and modes
function resetFormMode() {
    isEditMode = false;
    editProductId = null;
    uploadedMediaUrls = [];
    
    updateMediaPreviews();
    form.reset();
    document.getElementById("product-id-field").value = "";

    formTitle.textContent = "Cadastrar Novo Produto";
    formSubmitBtn.innerHTML = `Adicionar Produto <i class="fa-solid fa-plus"></i>`;
    formCancelBtn.classList.add("hide");
}

// Delete product action
async function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    if (!confirm(`Deseja realmente excluir o produto "${product.name}"?`)) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from("products")
            .delete()
            .eq("id", productId);

        if (error) throw error;

        showToast("Produto excluído com sucesso!", "success");
        
        if (isEditMode && editProductId === productId) {
            resetFormMode();
        }

        await loadProducts();
    } catch (err) {
        showToast("Erro ao excluir do banco de dados: " + err.message, "error");
    }
}

// Helper to show status toast
function showToast(message, type = "success") {
    toastMsg.textContent = message;
    
    toast.className = `admin-status-toast show ${type}`;
    if (type === "success") {
        toastIcon.className = "fa-solid fa-circle-check";
    } else if (type === "error") {
        toastIcon.className = "fa-solid fa-circle-xmark";
    } else {
        toastIcon.className = "fa-solid fa-circle-info";
    }

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

window.addEventListener("DOMContentLoaded", init);
