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

// Customers State
let adminCustomers = [];
let adminAuthUsers = [];        // Contas de login do site (auth.users)
let adminClientAddresses = [];  // Endereços salvos no portal (client_addresses)
let customerSearchQuery = "";
let adminCustomerCurrentPage = 1;
let ADMIN_CUSTOMERS_PER_PAGE = 10;

// DOM Elements - Customers
const customerTableBody = document.getElementById("admin-customers-tbody");
const customerSearchInput = document.getElementById("admin-customers-search");
const customerPagination = document.getElementById("admin-customers-pagination");

let searchQuery = "";
let uploadedMediaUrls = []; // Holds arrays of uploaded URLs for active product form
let productVariationOptions = []; // Variation options being edited in the product form

// Catalog list pagination state
let adminCurrentPage = 1;
let ADMIN_PRODUCTS_PER_PAGE = 10;

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

// DOM Elements - Authentication
const loginForm = document.getElementById("admin-login-form");
const loginOverlay = document.getElementById("admin-login-overlay");
const loginError = document.getElementById("login-error");
const loginErrorText = document.getElementById("login-error-text");
const passwordToggle = document.getElementById("password-toggle");
const loginPasswordInput = document.getElementById("login-password");
const headerActions = document.getElementById("admin-header-actions");
const logoutBtn = document.getElementById("admin-logout-btn");

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

// Settings and Shipping Elements
const settingsForm = document.getElementById("admin-general-settings-form");
const shippingRuleForm = document.getElementById("admin-shipping-rule-form");
const shippingRulesTableBody = document.getElementById("admin-shipping-rules-table-body");
const btnAddShippingRule = document.getElementById("btn-add-shipping-rule");
const shippingRuleModal = document.getElementById("shipping-rule-modal");
const shippingRuleModalClose = document.getElementById("shipping-rule-modal-close");

let storeSettings = {};
let shippingRules = [];

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

// Return a copy of the order with client-supplied text fields HTML-escaped
// (these values come from the public checkout form and must never be injected raw)
function escapeOrder(order) {
    if (!order) return order;
    return {
        ...order,
        client_name: escapeHTML(order.client_name),
        client_phone: escapeHTML(order.client_phone),
        client_email: order.client_email ? escapeHTML(order.client_email) : order.client_email,
        street: escapeHTML(order.street),
        number: escapeHTML(order.number),
        complement: order.complement ? escapeHTML(order.complement) : order.complement,
        neighborhood: escapeHTML(order.neighborhood),
        city: escapeHTML(order.city),
        uf: escapeHTML(order.uf),
        cep: order.cep ? escapeHTML(order.cep) : order.cep,
        coupon_code: order.coupon_code ? escapeHTML(order.coupon_code) : order.coupon_code,
        shipping_method: order.shipping_method ? escapeHTML(order.shipping_method) : order.shipping_method
    };
}

// Convert order status text to a CSS-safe class (e.g. "Em Transporte" -> "em-transporte")
function statusToClass(status) {
    return String(status || "").toLowerCase().trim().replace(/\s+/g, "-");
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    }[char]));
}

function safeMediaUrl(value) {
    const fallback = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600";
    try {
        const parsed = new URL(String(value || ""), window.location.origin);
        return ["http:", "https:"].includes(parsed.protocol) ? escapeHTML(parsed.href) : fallback;
    } catch (e) {
        return fallback;
    }
}

// ==========================================================================
// CONTROLLER FUNCTIONS
// ==========================================================================

async function init() {
    if (!supabaseClient) {
        showToast("Erro: Cliente Supabase não carregado. Verifique a conexão com a internet.", "error");
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--error-color); padding: 30px;">Falha ao inicializar o Supabase. Verifique suas credenciais.</td></tr>`;
        return;
    }

    bindEvents();
    bindTabEvents();
    
    // Check if the user is authenticated
    const hasSession = await checkAuth();
    if (hasSession) {
        await loadAllDashboardData();
    }
}

async function loadAllDashboardData() {
    await loadCategories();
    await loadBanners();
    await loadProducts();
    await loadReviews();
    await loadCustomers();
    await loadAdminOrders();
    await loadStoreSettings();
    await loadShippingRules();
    await loadCoupons();
    updateStats();
    initFlyerGenerator();
    initPostGenerator();
}

// ==========================================================================
// GERADOR DE PUBLICAÇÕES PARA REDES SOCIAIS (aba Marketing > Publicações)
// ==========================================================================

function initPostGenerator() {
    const productSelect = document.getElementById("post-product-select");
    if (!productSelect) return;

    populatePostProductSelect();

    productSelect.addEventListener("change", () => {
        populatePostImageSelect();
        updatePostProductLink();
        renderPostPreview();
    });

    // Copiar link direto do produto
    const btnCopyLink = document.getElementById("btn-copy-product-link");
    if (btnCopyLink) {
        btnCopyLink.addEventListener("click", () => {
            const linkInput = document.getElementById("post-product-link");
            if (!linkInput || !linkInput.value) return;
            navigator.clipboard.writeText(linkInput.value)
                .then(() => showToast("Link do produto copiado! Cole na legenda ou na bio.", "success"))
                .catch(() => showToast("Não foi possível copiar. Link: " + linkInput.value, "error"));
        });
    }

    ["post-image-select", "post-format", "post-show-price", "post-template"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("change", renderPostPreview);
    });
    ["post-headline", "post-cta"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", renderPostPreview);
    });

    const btnDownload = document.getElementById("btn-download-post");
    if (btnDownload) {
        btnDownload.addEventListener("click", downloadPostImage);
    }

    renderPostPreview();
}

function populatePostProductSelect() {
    const select = document.getElementById("post-product-select");
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="" disabled selected>Escolha o produto</option>';
    [...adminProducts]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(p => {
            select.innerHTML += `<option value="${p.id}">${escapeHTML(p.name)}</option>`;
        });

    if (currentVal) select.value = currentVal;
    populatePostImageSelect();
}

// Mostra o link direto do produto selecionado (?produto=ID)
function updatePostProductLink() {
    const productSelect = document.getElementById("post-product-select");
    const row = document.getElementById("post-product-link-row");
    const linkInput = document.getElementById("post-product-link");
    if (!row || !linkInput) return;

    const product = adminProducts.find(p => p.id == productSelect?.value);
    if (product) {
        linkInput.value = `https://ravilarutilidades.com.br/?produto=${product.id}`;
        row.style.display = "flex";
    } else {
        row.style.display = "none";
    }
}

function populatePostImageSelect() {
    const productSelect = document.getElementById("post-product-select");
    const imageSelect = document.getElementById("post-image-select");
    if (!productSelect || !imageSelect) return;

    imageSelect.innerHTML = "";
    const product = adminProducts.find(p => p.id == productSelect.value);
    if (!product) {
        imageSelect.innerHTML = '<option value="">Escolha um produto primeiro</option>';
        return;
    }

    const media = getProductMedia(product.image).filter(u => u && !u.toLowerCase().endsWith(".mp4"));
    media.forEach((url, i) => {
        imageSelect.innerHTML += `<option value="${escapeHTML(url)}">Foto ${i + 1}</option>`;
    });

    // Fotos das variações também podem ser usadas
    const varData = parseVariationsField(product.variations);
    if (varData) {
        varData.options.forEach(opt => {
            if (opt.image) {
                imageSelect.innerHTML += `<option value="${escapeHTML(opt.image)}">${escapeHTML(varData.name)}: ${escapeHTML(opt.label)}</option>`;
            }
        });
    }

    if (imageSelect.options.length === 0) {
        imageSelect.innerHTML = '<option value="">Produto sem fotos</option>';
    }
}

function renderPostPreview() {
    const canvas = document.getElementById("post-canvas");
    const productSelect = document.getElementById("post-product-select");
    if (!canvas || !productSelect) return;

    const product = adminProducts.find(p => p.id == productSelect.value);
    if (!product) {
        canvas.innerHTML = `
            <div style="width: 540px; height: 540px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-radius: 8px; color: var(--text-muted); text-align: center; padding: 30px; box-sizing: border-box;">
                Escolha um produto ao lado para gerar a arte.
            </div>
        `;
        return;
    }

    const format = document.getElementById("post-format")?.value || "feed";
    const showPrice = document.getElementById("post-show-price")?.checked !== false;
    const headline = document.getElementById("post-headline")?.value.trim() || "OFERTA";
    const cta = document.getElementById("post-cta")?.value.trim() || "Peça pelo site ou WhatsApp!";
    const imageUrl = document.getElementById("post-image-select")?.value || getProductMedia(product.image)[0] || "";

    const template = document.getElementById("post-template")?.value || "navy";
    const isStory = format === "story";
    const W = 540;
    const H = isStory ? 960 : 540;

    const priceParts = product.price.toFixed(2).split(".");

    // Handles das redes (config da loja)
    const handleFromUrl = (url) => {
        try {
            const u = new URL(url);
            const parts = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
            return parts.length > 0 ? "@" + parts[parts.length - 1] : u.hostname;
        } catch (e) { return ""; }
    };
    const instaHandle = storeSettings["social_instagram"] ? handleFromUrl(storeSettings["social_instagram"]) : "";

    // Paletas dos 3 modelos de arte
    const palettes = {
        navy: {
            bg: "linear-gradient(160deg, #1A365D 0%, #0f2340 100%)",
            circle: "rgba(212,167,92,0.13)",
            logoPill: "background: #ffffff; border-radius: 12px; padding: 8px 14px;",
            headlineCss: "background: linear-gradient(135deg, #D4A75C, #b98a3e); color: #ffffff;",
            cardShadow: "0 14px 40px rgba(0,0,0,0.35)",
            nameColor: "#ffffff",
            priceCss: "background: linear-gradient(135deg, #D4A75C, #b98a3e); color: #ffffff; box-shadow: 0 6px 18px rgba(185,138,62,0.45);",
            footerCss: "background: rgba(255,255,255,0.08); border-top: 2px solid rgba(212,167,92,0.6);",
            ctaColor: "#D4A75C",
            footerTextColor: "rgba(255,255,255,0.85)"
        },
        light: {
            bg: "linear-gradient(160deg, #FDFBF7 0%, #F3ECE0 100%)",
            circle: "rgba(26,54,93,0.06)",
            logoPill: "padding: 4px 0;",
            headlineCss: "background: #1A365D; color: #ffffff;",
            cardShadow: "0 12px 34px rgba(26,54,93,0.18)",
            nameColor: "#1A365D",
            priceCss: "background: #1A365D; color: #ffffff; box-shadow: 0 6px 18px rgba(26,54,93,0.3);",
            footerCss: "background: rgba(26,54,93,0.05); border-top: 2px solid #D4A75C;",
            ctaColor: "#B7791F",
            footerTextColor: "#4a5568"
        },
        gold: {
            bg: "linear-gradient(160deg, #D4A75C 0%, #b98a3e 100%)",
            circle: "rgba(255,255,255,0.14)",
            logoPill: "background: #ffffff; border-radius: 12px; padding: 8px 14px;",
            headlineCss: "background: #1A365D; color: #ffffff;",
            cardShadow: "0 14px 40px rgba(90,60,15,0.4)",
            nameColor: "#ffffff",
            priceCss: "background: #ffffff; color: #1A365D; box-shadow: 0 6px 18px rgba(90,60,15,0.35);",
            footerCss: "background: rgba(15,35,64,0.22); border-top: 2px solid rgba(255,255,255,0.55);",
            ctaColor: "#ffffff",
            footerTextColor: "rgba(255,255,255,0.9)"
        }
    };
    const pal = palettes[template] || palettes.navy;

    canvas.innerHTML = `
        <div id="post-art" style="width: ${W}px; height: ${H}px; position: relative; overflow: hidden; background: ${pal.bg}; font-family: 'Montserrat', 'Inter', sans-serif; display: flex; flex-direction: column; box-sizing: border-box;">
            <!-- Círculos decorativos -->
            <div style="position: absolute; right: -80px; top: -80px; width: 240px; height: 240px; border-radius: 50%; background: ${pal.circle};"></div>
            <div style="position: absolute; left: -60px; bottom: ${isStory ? '120px' : '60px'}; width: 180px; height: 180px; border-radius: 50%; background: ${pal.circle};"></div>

            <!-- Topo: logo + chamada -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: ${isStory ? '34px 30px 10px' : '24px 26px 8px'}; position: relative; z-index: 2;">
                <div style="${pal.logoPill} line-height: 0;">
                    <img src="LogoSite.png" style="height: ${isStory ? '46px' : '38px'}; width: auto;">
                </div>
                <div style="${pal.headlineCss} font-weight: 800; font-size: ${isStory ? '1rem' : '0.85rem'}; padding: ${isStory ? '10px 20px' : '8px 16px'}; border-radius: 9999px; letter-spacing: 1px; text-transform: uppercase;">${escapeHTML(headline)}</div>
            </div>

            <!-- Foto do produto -->
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: ${isStory ? '20px 45px' : '14px 60px'}; position: relative; z-index: 2; min-height: 0;">
                <div style="background: #ffffff; border-radius: 20px; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: ${pal.cardShadow}; padding: 14px; box-sizing: border-box;">
                    ${imageUrl ? `<img src="${safeMediaUrl(imageUrl)}" style="max-width: 100%; max-height: 100%; object-fit: contain;">` : `<span style="color:#A0AEC0;">Sem foto</span>`}
                </div>
            </div>

            <!-- Nome + preço -->
            <div style="text-align: center; padding: ${isStory ? '18px 40px' : '12px 36px'}; position: relative; z-index: 2;">
                <div style="color: ${pal.nameColor}; font-weight: 800; font-size: ${isStory ? '1.5rem' : '1.15rem'}; line-height: 1.25;">${escapeHTML(product.name)}</div>
                ${showPrice && product.old_price && parseFloat(product.old_price) > product.price ? `
                <div style="color: ${pal.nameColor}; opacity: 0.75; font-weight: 700; font-size: ${isStory ? '1.05rem' : '0.85rem'}; margin-top: ${isStory ? '10px' : '6px'};">De <s>R$ ${parseFloat(product.old_price).toFixed(2).replace('.', ',')}</s> por:</div>` : ""}
                ${showPrice ? `
                <div style="margin-top: ${isStory ? '16px' : '10px'}; display: inline-flex; align-items: baseline; gap: 4px; ${pal.priceCss} border-radius: 14px; padding: ${isStory ? '10px 28px' : '8px 22px'};">
                    <span style="font-weight: 700; font-size: ${isStory ? '1.1rem' : '0.95rem'};">R$</span>
                    <span style="font-weight: 900; font-size: ${isStory ? '3rem' : '2.3rem'}; line-height: 1;">${priceParts[0]}</span>
                    <span style="font-weight: 800; font-size: ${isStory ? '1.4rem' : '1.1rem'};">,${priceParts[1]}</span>
                </div>` : ""}
            </div>

            <!-- Rodapé -->
            <div style="${pal.footerCss} padding: ${isStory ? '18px 30px 26px' : '12px 26px 16px'}; text-align: center; position: relative; z-index: 2;">
                <div style="color: ${pal.ctaColor}; font-weight: 800; font-size: ${isStory ? '1.05rem' : '0.85rem'};">${escapeHTML(cta)}</div>
                <div style="color: ${pal.footerTextColor}; font-weight: 600; font-size: ${isStory ? '0.85rem' : '0.7rem'}; margin-top: 5px;">
                    ravilarutilidades.com.br &nbsp;•&nbsp; (17) 99637-1743${instaHandle ? ` &nbsp;•&nbsp; ${escapeHTML(instaHandle)}` : ""}
                </div>
            </div>
        </div>
    `;
}

async function downloadPostImage() {
    const productSelect = document.getElementById("post-product-select");
    const product = adminProducts.find(p => p.id == productSelect?.value);
    if (!product) {
        showToast("Escolha um produto para gerar a publicação.", "error");
        return;
    }
    if (typeof html2canvas === "undefined") {
        showToast("Gerador de imagem não carregou. Recarregue a página.", "error");
        return;
    }

    const btn = document.getElementById("btn-download-post");
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando...';
    btn.disabled = true;

    try {
        const art = document.getElementById("post-art");
        const canvas = await html2canvas(art, {
            scale: 2, // 540 -> 1080
            useCORS: true,
            backgroundColor: null,
            logging: false
        });

        const format = document.getElementById("post-format")?.value || "feed";
        const template = document.getElementById("post-template")?.value || "navy";
        const slug = product.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").slice(0, 40);

        const link = document.createElement("a");
        link.download = `post_${format}_${template}_${slug}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

        showToast("Publicação gerada com sucesso!", "success");
    } catch (err) {
        console.error("Erro ao gerar publicação:", err);
        showToast("Erro ao gerar a imagem. A foto escolhida pode estar bloqueando a exportação — tente outra foto.", "error");
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
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
                    // Reload customer data when tab switches to clientes
                    if (targetTab === "clientes") {
                        loadCustomers();
                    }
                    // Refresh checklist when switching to flyer generator
                    if (targetTab === "panfleto") {
                        renderFlyerProductChecklist();
                    }
                    // Load sales orders when switching to vendas tab
                    if (targetTab === "vendas") {
                        loadAdminOrders();
                    }
                    // Load coupons when switching to coupons tab
                    if (targetTab === "cupons") {
                        loadCoupons();
                    }
                    // Refresh post generator when switching to publicacoes tab
                    if (targetTab === "publicacoes") {
                        populatePostProductSelect();
                        renderPostPreview();
                    }
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
                    <p style="margin:4px 0 0; font-size:0.8rem; color:var(--text-muted);">${prodName} (${rev.rating} ⭐)</p>
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
    const ok = await showConfirm(`Deseja realmente excluir a categoria "${name}"? Os produtos associados continuarão existindo no banco de dados.`);
    if (!ok) {
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
    const ok = await showConfirm(`Deseja realmente excluir o banner "${title}"?`);
    if (!ok) {
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
    const ok = await showConfirm(`Deseja realmente excluir a avaliação de "${name}"?`);
    if (!ok) {
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

// Fetch products from database (last edited first, so recent changes stay on top)
async function loadProducts() {
    try {
        let { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("updated_at", { ascending: false, nullsFirst: false })
            .order("id", { ascending: false });

        // Fallback: if the updated_at column doesn't exist yet (SQL not applied), order by id
        if (error && error.message && error.message.includes("updated_at")) {
            ({ data, error } = await supabaseClient
                .from("products")
                .select("*")
                .order("id", { ascending: true }));
        }

        if (error) throw error;

        adminProducts = data || [];
        updateStats();
        renderTable();
        populateReviewProductSelect(); // Populate the reviews product dropdown dynamically
    } catch (err) {
        showToast("Erro ao carregar catálogo: " + err.message, "error");
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--error-color); padding: 30px;">Erro ao carregar dados. Garanta que executou o script SQL no Supabase.</td></tr>`;
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
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhum produto cadastrado.</td></tr>`;
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
        const productName = escapeHTML(p.name);
        const badgeHTML = p.badge ? `<span class="admin-badge badge-promo">${escapeHTML(p.badge)}</span>` : `<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>`;
        const priceFormatted = `R$&nbsp;${p.price.toFixed(2).replace('.', ',')}`;

        // Get first image for thumbnail display in table
        const media = getProductMedia(p.image);
        const thumbnail = safeMediaUrl(media[0]);

        // Find friendly category name if available
        const catObj = adminCategories.find(c => c.slug === p.category);
        const categoryName = escapeHTML(catObj ? catObj.name : p.category);

        // Stock: soma das variações (produto sem variação não controla estoque)
        const varData = parseVariationsField(p.variations);
        let stockHTML = `<span style="color: var(--text-muted);">—</span>`;
        if (varData) {
            const totalStock = varData.options.reduce((acc, o) => acc + (typeof o.stock === "number" ? o.stock : 0), 0);
            stockHTML = `<strong style="color: ${totalStock > 0 ? 'var(--text-dark)' : '#E53E3E'};">${totalStock}</strong>`;
        }

        const trHTML = `
            <tr data-id="${escapeHTML(p.id)}">
                <td><img src="${thumbnail}" alt="${productName}" class="admin-table-img"></td>
                <td style="font-weight: 600; color: var(--primary-color);">${productName}</td>
                <td><span class="admin-badge badge-category">${categoryName}</span></td>
                <td style="font-weight: 700; white-space: nowrap;">${priceFormatted}</td>
                <td style="text-align: center;">${stockHTML}</td>
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

        // Sub-linhas: uma por variação (foto própria, preço e estoque)
        if (varData) {
            varData.options.forEach(opt => {
                const optPrice = (opt.price !== undefined && opt.price !== null) ? parseFloat(opt.price) : p.price;
                const optStock = (typeof opt.stock === "number") ? opt.stock : 0;
                const optThumb = opt.image
                    ? `<img src="${safeMediaUrl(opt.image)}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 5px; border: 1px solid var(--border-color);">`
                    : `<span title="Esta opção está sem foto própria" style="display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: 1px dashed #CBD5E0; border-radius: 5px; color: #A0AEC0;"><i class="fa-regular fa-image" style="font-size: 0.75rem;"></i></span>`;
                const semFotoTag = opt.image ? "" : `<span style="font-size: 0.68rem; color: #E53E3E; font-weight: 600; margin-left: 6px;">sem foto</span>`;

                const subRow = `
                    <tr style="background-color: #f8fafc;">
                        <td style="text-align: right; padding-right: 4px;">${optThumb}</td>
                        <td style="font-size: 0.85rem; color: var(--text-dark);">
                            <i class="fa-solid fa-arrow-turn-up" style="transform: rotate(90deg); color: #CBD5E0; margin-right: 6px; font-size: 0.7rem;"></i>
                            ${escapeHTML(varData.name)}: <strong>${escapeHTML(opt.label)}</strong>${semFotoTag}
                        </td>
                        <td></td>
                        <td style="font-size: 0.85rem; white-space: nowrap;">R$&nbsp;${optPrice.toFixed(2).replace('.', ',')}</td>
                        <td style="text-align: center; font-size: 0.85rem;">
                            <strong style="color: ${optStock > 0 ? 'var(--text-dark)' : '#E53E3E'};">${optStock}</strong>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML("beforeend", subRow);
            });
        }
    });

    // Render pagination controls
    renderTablePagination(totalPages);
    bindTableActionEvents();
    updateProductWarningsBadge();
}

// ==========================================================================
// AVISOS DE PRODUTOS (estoque zerado / variações sem foto)
// ==========================================================================

function getProductWarnings() {
    const warnings = [];

    adminProducts.forEach(p => {
        const varData = parseVariationsField(p.variations);
        if (!varData) return;

        const issues = [];
        let totalStock = 0;

        varData.options.forEach(opt => {
            const stock = (typeof opt.stock === "number") ? opt.stock : 0;
            totalStock += stock;
            if (stock <= 0) {
                issues.push({ type: "estoque", text: `${varData.name}: ${opt.label} — estoque zerado` });
            }
            if (!opt.image) {
                issues.push({ type: "foto", text: `${varData.name}: ${opt.label} — sem foto própria` });
            }
        });

        if (issues.length > 0) {
            warnings.push({
                product: p,
                totalStock,
                allOut: totalStock <= 0,
                issues
            });
        }
    });

    return warnings;
}

function updateProductWarningsBadge() {
    const badge = document.getElementById("product-warnings-badge");
    if (!badge) return;
    const count = getProductWarnings().reduce((acc, w) => acc + w.issues.length, 0);
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = "inline-flex";
    } else {
        badge.style.display = "none";
    }
}

function openProductWarningsModal() {
    const modal = document.getElementById("product-warnings-modal");
    const list = document.getElementById("product-warnings-list");
    if (!modal || !list) return;

    const warnings = getProductWarnings();

    if (warnings.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                <i class="fa-solid fa-circle-check" style="font-size: 2.4rem; color: #48BB78; display: block; margin-bottom: 12px;"></i>
                Tudo certo! Nenhum produto com estoque zerado ou variação sem foto.
            </div>
        `;
    } else {
        list.innerHTML = "";
        warnings.forEach(w => {
            const media = getProductMedia(w.product.image);
            const thumb = safeMediaUrl(media[0]);

            const issuesHTML = w.issues.map(i => `
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-dark); margin-top: 6px;">
                    <i class="fa-solid ${i.type === 'estoque' ? 'fa-box-open' : 'fa-camera'}" style="color: ${i.type === 'estoque' ? '#E53E3E' : '#D69E2E'}; width: 16px; text-align: center;"></i>
                    ${escapeHTML(i.text)}
                </div>
            `).join("");

            const card = document.createElement("div");
            card.style.cssText = "border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; display: flex; gap: 12px; align-items: flex-start;";
            card.innerHTML = `
                <img src="${thumb}" style="width: 46px; height: 46px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                        <strong style="font-size: 0.9rem; color: var(--primary-color);">${escapeHTML(w.product.name)}</strong>
                        ${w.allOut ? '<span style="font-size: 0.65rem; font-weight: 800; color: white; background: #E53E3E; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; flex-shrink: 0;">Esgotado</span>' : ''}
                    </div>
                    ${issuesHTML}
                    <button class="btn btn-secondary btn-sm btn-warning-edit" style="margin: 10px 0 0; padding: 4px 12px; font-size: 0.75rem;">
                        <i class="fa-solid fa-pen"></i> Editar produto
                    </button>
                </div>
            `;

            card.querySelector(".btn-warning-edit").addEventListener("click", () => {
                modal.style.display = "none";
                editProduct(w.product.id);
            });

            list.appendChild(card);
        });
    }

    modal.style.display = "flex";
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

    // Real-time customers table filter
    if (customerSearchInput) {
        customerSearchInput.addEventListener("input", (e) => {
            customerSearchQuery = e.target.value.toLowerCase().trim();
            adminCustomerCurrentPage = 1;
            renderCustomersTable();
        });
    }

    // Sales table search filter
    const ordersSearchInput = document.getElementById("admin-orders-search");
    if (ordersSearchInput) {
        ordersSearchInput.addEventListener("input", (e) => {
            ordersSearchQuery = e.target.value.toLowerCase().trim();
            ordersCurrentPage = 1;
            renderAdminOrdersTable();
        });
    }

    // Sales status filter selector
    const ordersFilterSelect = document.getElementById("admin-orders-filter-status");
    if (ordersFilterSelect) {
        ordersFilterSelect.addEventListener("change", (e) => {
            ordersFilterStatus = e.target.value;
            ordersCurrentPage = 1;
            renderAdminOrdersTable();
        });
    }

    // Products per page selector
    const productsPerPageSelect = document.getElementById("admin-products-per-page");
    if (productsPerPageSelect) {
        productsPerPageSelect.addEventListener("change", (e) => {
            ADMIN_PRODUCTS_PER_PAGE = parseInt(e.target.value);
            adminCurrentPage = 1;
            renderTable();
        });
    }

    // Product warnings (estoque zerado / sem foto)
    const btnProductWarnings = document.getElementById("btn-product-warnings");
    if (btnProductWarnings) {
        btnProductWarnings.addEventListener("click", openProductWarningsModal);
    }
    const warningsModalClose = document.getElementById("product-warnings-modal-close");
    if (warningsModalClose) {
        warningsModalClose.addEventListener("click", () => {
            document.getElementById("product-warnings-modal").style.display = "none";
        });
    }
    const warningsModal = document.getElementById("product-warnings-modal");
    if (warningsModal) {
        warningsModal.addEventListener("click", (e) => {
            if (e.target === warningsModal) warningsModal.style.display = "none";
        });
    }

    // Product Export & Import event listeners
    const btnExportProducts = document.getElementById("btn-export-products");
    if (btnExportProducts) {
        btnExportProducts.addEventListener("click", handleExportProducts);
    }
    const btnImportProductsTrigger = document.getElementById("btn-import-products-trigger");
    const inputImportProducts = document.getElementById("input-import-products");
    if (btnImportProductsTrigger && inputImportProducts) {
        btnImportProductsTrigger.addEventListener("click", () => {
            inputImportProducts.click();
        });
        inputImportProducts.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                handleImportProducts(e.target.files[0]);
                e.target.value = ""; // Reset file input
            }
        });
    }

    // Customers per page selector
    const customersPerPageSelect = document.getElementById("admin-customers-per-page");
    if (customersPerPageSelect) {
        customersPerPageSelect.addEventListener("change", (e) => {
            ADMIN_CUSTOMERS_PER_PAGE = parseInt(e.target.value);
            adminCustomerCurrentPage = 1;
            renderCustomersTable();
        });
    }

    // Orders per page selector
    const ordersPerPageSelect = document.getElementById("admin-orders-per-page");
    if (ordersPerPageSelect) {
        ordersPerPageSelect.addEventListener("change", (e) => {
            ordersPerPage = parseInt(e.target.value);
            ordersCurrentPage = 1;
            renderAdminOrdersTable();
        });
    }

    // Close admin order details modal
    const adminOrderModalClose = document.getElementById("admin-order-modal-close");
    if (adminOrderModalClose) {
        adminOrderModalClose.addEventListener("click", () => {
            document.getElementById("admin-order-modal").classList.remove("open");
        });
    }

    // Save admin order status button
    const btnSaveOrderStatus = document.getElementById("btn-save-order-status");
    if (btnSaveOrderStatus) {
        btnSaveOrderStatus.addEventListener("click", saveAdminOrderStatus);
    }

    // Toggle tracking code input based on selected status
    const statusSelect = document.getElementById("admin-order-status-select");
    const trackingContainer = document.getElementById("admin-tracking-code-container");
    if (statusSelect && trackingContainer) {
        statusSelect.addEventListener("change", (e) => {
            if (e.target.value === "Em Transporte") {
                trackingContainer.style.display = "block";
            } else {
                trackingContainer.style.display = "none";
            }
        });
    }

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

    // VARIATIONS EDITOR: add option row
    const btnAddVariationOption = document.getElementById("btn-add-variation-option");
    if (btnAddVariationOption) {
        btnAddVariationOption.addEventListener("click", () => addVariationOptionRow());
    }

    // AUTHENTICATION EVENTS
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }
    
    if (passwordToggle && loginPasswordInput) {
        passwordToggle.addEventListener("click", () => {
            const type = loginPasswordInput.getAttribute("type") === "password" ? "text" : "password";
            loginPasswordInput.setAttribute("type", type);
            
            const icon = passwordToggle.querySelector("i");
            if (icon) {
                if (type === "password") {
                    icon.className = "fa-solid fa-eye";
                } else {
                    icon.className = "fa-solid fa-eye-slash";
                }
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    // SETTINGS & SHIPPING EVENTS
    if (settingsForm) {
        settingsForm.addEventListener("submit", saveStoreSettings);
    }
    if (shippingRuleForm) {
        shippingRuleForm.addEventListener("submit", saveShippingRule);
    }
    if (btnAddShippingRule) {
        btnAddShippingRule.addEventListener("click", () => openShippingRuleModal());
    }
    if (shippingRuleModalClose) {
        shippingRuleModalClose.addEventListener("click", () => {
            shippingRuleModal.style.display = "none";
        });
    }

    // Bind mask for origin CEP in settings
    const originCepInput = document.getElementById("admin-setting-origin-cep");
    if (originCepInput) {
        originCepInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 8) value = value.slice(0, 8);
            if (value.length > 5) {
                e.target.value = value.slice(0, 5) + "-" + value.slice(5);
            } else {
                e.target.value = value;
            }
        });
    }

    // COUPON SUBMIT, CANCEL & SEARCH EVENTS
    const couponFormEl = document.getElementById("admin-coupon-form");
    if (couponFormEl) {
        couponFormEl.addEventListener("submit", submitCouponForm);
    }
    const couponCancelBtnEl = document.getElementById("coupon-cancel-btn");
    if (couponCancelBtnEl) {
        couponCancelBtnEl.addEventListener("click", resetCouponFormMode);
    }
    const couponSearchEl = document.getElementById("coupon-table-search");
    if (couponSearchEl) {
        couponSearchEl.addEventListener("input", renderCouponsTable);
    }

    const btnDeleteAdminOrder = document.getElementById("btn-delete-admin-order");
    if (btnDeleteAdminOrder) {
        btnDeleteAdminOrder.addEventListener("click", handleDeleteAdminOrder);
    }
}

// Comprime imagens no navegador antes do upload (máx. 1200px, qualidade 0.82).
// Vídeos e formatos não suportados passam direto sem alteração.
async function compressImageFile(file, maxSize = 1200, quality = 0.82) {
    if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

    try {
        const bitmap = await createImageBitmap(file);
        let { width, height } = bitmap;

        // Só reduz — nunca amplia
        if (width <= maxSize && height <= maxSize && file.size < 400 * 1024) {
            return file;
        }

        const scale = Math.min(1, maxSize / Math.max(width, height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);

        const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", quality));
        if (!blob) return file;

        const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
        return new File([blob], newName, { type: "image/webp" });
    } catch (e) {
        console.warn("Compressão falhou, enviando original:", e);
        return file;
    }
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

        // Comprime imagens antes de subir (economiza banda e acelera a loja)
        const uploadFile = await compressImageFile(file);

        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            // Upload to 'product-media' bucket
            const { error: uploadError } = await supabaseClient
                .storage
                .from("product-media")
                .upload(filePath, uploadFile);

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

    const uploadFile = await compressImageFile(file);
    const fileExt = uploadFile.name.split('.').pop();
    const fileName = `cat_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
        categoryProgressFill.style.width = "60%";
        categoryProgressText.textContent = "Carregando imagem...";

        const { error: uploadError } = await supabaseClient
            .storage
            .from("product-media")
            .upload(filePath, uploadFile);

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

    const uploadFile = await compressImageFile(file, 1600); // banners podem ser maiores
    const fileExt = uploadFile.name.split('.').pop();
    const fileName = `banner_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
        bannerProgressFill.style.width = "60%";
        bannerProgressText.textContent = "Carregando imagem...";

        const { error: uploadError } = await supabaseClient
            .storage
            .from("product-media")
            .upload(filePath, uploadFile);

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

// ==========================================================================
// PRODUCT VARIATIONS EDITOR (admin product form)
// ==========================================================================

// Parse variations coming from the DB (JSONB object or JSON string)
function parseVariationsField(value) {
    if (!value) return null;
    let v = value;
    try {
        if (typeof v === "string") v = JSON.parse(v);
    } catch (e) {
        return null;
    }
    if (!v || !Array.isArray(v.options) || v.options.length === 0) return null;
    return v;
}

function addVariationOptionRow(opt) {
    productVariationOptions.push({
        label: opt?.label || "",
        price: (opt?.price !== undefined && opt?.price !== null) ? opt.price : "",
        stock: (opt?.stock !== undefined && opt?.stock !== null) ? opt.stock : "",
        image: opt?.image || ""
    });
    renderVariationOptionsEditor();
}

let variationPickerOpenIndex = null; // Which option row has the image picker open

function renderVariationOptionsEditor() {
    const list = document.getElementById("admin-variation-options-list");
    if (!list) return;
    list.innerHTML = "";

    productVariationOptions.forEach((opt, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; background: white;";

        const row = document.createElement("div");

        const thumbHTML = opt.image
            ? `<img src="${escapeHTML(opt.image)}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">`
            : `<i class="fa-regular fa-image" style="color: var(--text-muted);"></i>`;

        row.innerHTML = `
            <!-- Linha 1: foto + nome da opção + excluir -->
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                <button type="button" class="var-opt-pick-image" title="Escolher foto do produto para esta opção"
                    style="width: 44px; height: 44px; border: 2px ${opt.image ? 'solid var(--accent-color)' : 'dashed var(--border-color)'}; border-radius: 8px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; overflow: hidden; flex-shrink: 0;">
                    ${thumbHTML}
                </button>
                <input type="text" class="var-opt-label" placeholder="Nome da opção (ex: Azul)" value="${escapeHTML(opt.label)}" style="flex: 1; padding: 10px; font-size: 0.88rem; min-width: 0;">
                <button type="button" class="var-opt-remove" title="Remover opção" style="background: none; border: none; color: var(--error-color); cursor: pointer; font-size: 1rem; padding: 4px; flex-shrink: 0;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <!-- Linha 2: preço + estoque -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                    <label style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 3px;">Preço (R$)</label>
                    <input type="number" class="var-opt-price" placeholder="0,00" step="0.01" min="0" value="${escapeHTML(opt.price)}" style="width: 100%; padding: 10px; font-size: 0.88rem; box-sizing: border-box;">
                </div>
                <div>
                    <label style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 3px;">Estoque</label>
                    <input type="number" class="var-opt-stock" placeholder="0" step="1" min="0" value="${escapeHTML(opt.stock)}" style="width: 100%; padding: 10px; font-size: 0.88rem; box-sizing: border-box;">
                </div>
            </div>
        `;

        row.querySelector(".var-opt-label").addEventListener("input", (e) => { productVariationOptions[index].label = e.target.value; });
        row.querySelector(".var-opt-price").addEventListener("input", (e) => { productVariationOptions[index].price = e.target.value; });
        row.querySelector(".var-opt-stock").addEventListener("input", (e) => { productVariationOptions[index].stock = e.target.value; });
        row.querySelector(".var-opt-remove").addEventListener("click", () => {
            productVariationOptions.splice(index, 1);
            if (variationPickerOpenIndex === index) variationPickerOpenIndex = null;
            renderVariationOptionsEditor();
        });

        // Toggle the image picker for this option
        row.querySelector(".var-opt-pick-image").addEventListener("click", () => {
            variationPickerOpenIndex = (variationPickerOpenIndex === index) ? null : index;
            renderVariationOptionsEditor();
        });

        wrapper.appendChild(row);

        // Image picker: choose among the photos already uploaded to the product
        if (variationPickerOpenIndex === index) {
            const picker = document.createElement("div");
            picker.style.cssText = "margin-top: 6px; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px; background: #f8fafc;";

            const imageUrls = uploadedMediaUrls.filter(u => u && !u.toLowerCase().endsWith(".mp4"));

            if (imageUrls.length === 0) {
                picker.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted);">Envie as fotos do produto primeiro (área "Mídias do Produto" acima) para poder escolher uma aqui.</div>`;
            } else {
                const grid = document.createElement("div");
                grid.style.cssText = "display: flex; flex-wrap: wrap; gap: 8px;";

                imageUrls.forEach(url => {
                    const isSelected = opt.image === url;
                    const thumb = document.createElement("button");
                    thumb.type = "button";
                    thumb.title = "Usar esta foto";
                    thumb.style.cssText = `width: 56px; height: 56px; border: 3px solid ${isSelected ? 'var(--accent-color)' : 'transparent'}; border-radius: 8px; padding: 0; cursor: pointer; overflow: hidden; background: white;`;
                    thumb.innerHTML = `<img src="${escapeHTML(url)}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    thumb.addEventListener("click", () => {
                        productVariationOptions[index].image = url;
                        variationPickerOpenIndex = null;
                        renderVariationOptionsEditor();
                    });
                    grid.appendChild(thumb);
                });

                // "No image" choice
                const noneBtn = document.createElement("button");
                noneBtn.type = "button";
                noneBtn.title = "Sem imagem para esta opção";
                noneBtn.style.cssText = `width: 56px; height: 56px; border: 3px solid ${!opt.image ? 'var(--accent-color)' : 'var(--border-color)'}; border-radius: 8px; cursor: pointer; background: white; color: var(--text-muted); font-size: 0.65rem; font-weight: 600;`;
                noneBtn.textContent = "Sem foto";
                noneBtn.addEventListener("click", () => {
                    productVariationOptions[index].image = "";
                    variationPickerOpenIndex = null;
                    renderVariationOptionsEditor();
                });
                grid.appendChild(noneBtn);

                picker.appendChild(grid);
            }

            wrapper.appendChild(picker);
        }

        list.appendChild(wrapper);
    });
}

// Build the JSONB payload for the variations column (or null when empty)
function getVariationsPayload() {
    const nameInput = document.getElementById("admin-variation-name");
    const varName = nameInput ? nameInput.value.trim() : "";

    const validOptions = productVariationOptions
        .filter(o => o.label && String(o.label).trim())
        .map(o => ({
            label: String(o.label).trim(),
            price: (o.price !== "" && o.price !== null && !isNaN(parseFloat(o.price))) ? parseFloat(o.price) : null,
            stock: (o.stock !== "" && o.stock !== null && !isNaN(parseInt(o.stock))) ? parseInt(o.stock) : 0,
            image: (o.image && String(o.image).trim()) || null
        }));

    if (validOptions.length === 0) return null;

    return {
        name: varName || "Opção",
        options: validOptions
    };
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

    // Refresh the variations editor so its image picker reflects the current photos
    renderVariationOptionsEditor();
}

// Update counters
function updateStats() {
    // 1. Billing (Revenue)
    const statBilling = document.getElementById("stat-billing");
    if (statBilling) {
        let faturamentoSum = 0;
        adminOrders.forEach(order => {
            if (order.status !== "Cancelado") {
                faturamentoSum += order.total_amount;
            }
        });
        statBilling.textContent = `R$ ${faturamentoSum.toFixed(2).replace('.', ',')}`;
    }

    // 2. Total Orders
    const statTotalOrders = document.getElementById("stat-total-orders");
    if (statTotalOrders) {
        statTotalOrders.textContent = adminOrders.length;
    }

    // 3. Pending Shipments
    const statPendingShipments = document.getElementById("stat-pending-shipments");
    if (statPendingShipments) {
        let pendingShipment = 0;
        adminOrders.forEach(order => {
            if (order.status === "Pendente" || order.status === "Pago" || order.status === "Separando") {
                pendingShipment++;
            }
        });
        statPendingShipments.textContent = pendingShipment;
    }

    // 4. Total Customers (únicos por telefone — não conta cadastros duplicados)
    const statTotalCustomers = document.getElementById("stat-total-customers");
    if (statTotalCustomers) {
        const uniquePhones = new Set();
        (adminCustomers || []).forEach(c => {
            if (c.email === 'ravilarutilidades@gmail.com') return;
            const cleanPhone = c.phone ? c.phone.replace(/\D/g, "") : `id-${c.id}`;
            uniquePhones.add(cleanPhone || `id-${c.id}`);
        });
        statTotalCustomers.textContent = uniquePhones.size;
    }

    // 5. Total Products
    const statTotalProducts = document.getElementById("stat-total-products");
    if (statTotalProducts) {
        statTotalProducts.textContent = adminProducts.length;
    }
}

// Add or Edit product submit handler
async function submitProductForm(e) {
    e.preventDefault();

    const name = document.getElementById("admin-product-name").value.trim();
    const category = document.getElementById("admin-product-category").value;
    const price = parseFloat(document.getElementById("admin-product-price").value);
    const oldPriceRaw = document.getElementById("admin-product-old-price")?.value;
    const oldPrice = oldPriceRaw && !isNaN(parseFloat(oldPriceRaw)) ? parseFloat(oldPriceRaw) : null;
    const badge = document.getElementById("admin-product-badge").value.trim();
    const description = document.getElementById("admin-product-description").value.trim();

    if (oldPrice !== null && oldPrice <= price) {
        showToast('O preço antigo "De" precisa ser MAIOR que o preço atual para fazer sentido.', "warning");
        return;
    }

    if (!name || !category || isNaN(price) || uploadedMediaUrls.length === 0 || !description) {
        showToast("Por favor, preencha todos os campos obrigatórios e envie pelo menos 1 imagem/vídeo.", "error");
        return;
    }

    const payload = {
        name,
        category,
        price,
        old_price: oldPrice,
        image: JSON.stringify(uploadedMediaUrls),
        badge: badge || null,
        description,
        variations: getVariationsPayload()
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
    const oldPriceInput = document.getElementById("admin-product-old-price");
    if (oldPriceInput) oldPriceInput.value = (product.old_price !== null && product.old_price !== undefined) ? product.old_price : "";
    document.getElementById("admin-product-badge").value = product.badge || "";
    document.getElementById("admin-product-description").value = product.description;

    // Load variations into the editor
    const varData = parseVariationsField(product.variations);
    const varNameInput = document.getElementById("admin-variation-name");
    productVariationOptions = [];
    if (varData) {
        if (varNameInput) varNameInput.value = varData.name || "";
        varData.options.forEach(o => productVariationOptions.push({
            label: o.label || "",
            price: (o.price !== undefined && o.price !== null) ? o.price : "",
            stock: (o.stock !== undefined && o.stock !== null) ? o.stock : "",
            image: o.image || ""
        }));
    } else {
        if (varNameInput) varNameInput.value = "";
    }
    renderVariationOptionsEditor();

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
    productVariationOptions = [];

    updateMediaPreviews();
    renderVariationOptionsEditor();
    form.reset();
    document.getElementById("product-id-field").value = "";
    const varNameInput = document.getElementById("admin-variation-name");
    if (varNameInput) varNameInput.value = "";

    formTitle.textContent = "Cadastrar Novo Produto";
    formSubmitBtn.innerHTML = `Adicionar Produto <i class="fa-solid fa-plus"></i>`;
    formCancelBtn.classList.add("hide");
}

// Delete product action
async function deleteProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    const ok = await showConfirm(`Deseja realmente excluir o produto "${product.name}"?`);
    if (!ok) {
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

// Helper to show custom confirmation modal
function showConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById("custom-confirm-modal");
        const msgEl = document.getElementById("custom-confirm-message");
        const btnOk = document.getElementById("btn-confirm-ok");
        const btnCancel = document.getElementById("btn-confirm-cancel");
        
        if (!modal || !msgEl || !btnOk || !btnCancel) {
            // Fallback to browser confirm if elements don't exist
            resolve(confirm(message));
            return;
        }
        
        msgEl.textContent = message;
        modal.style.display = "flex";
        
        // Use once listener pattern to ensure no multiple triggers
        const onOk = () => {
            modal.style.display = "none";
            btnOk.removeEventListener("click", onOk);
            btnCancel.removeEventListener("click", onCancel);
            resolve(true);
        };
        
        const onCancel = () => {
            modal.style.display = "none";
            btnOk.removeEventListener("click", onOk);
            btnCancel.removeEventListener("click", onCancel);
            resolve(false);
        };
        
        btnOk.addEventListener("click", onOk);
        btnCancel.addEventListener("click", onCancel);
    });
}

// Fetch customers from database
async function loadCustomers() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("customers")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            // Handle scenario where customer table has not been created by user in dashboard
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.warn("Tabela 'customers' não existe no Supabase.");
                customerTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 40px; color: var(--error-color);">
                            A tabela de clientes não existe no seu Supabase. <br>
                            Por favor, execute o script SQL atualizado (setup_database.sql) no Editor SQL do seu painel Supabase.
                        </td>
                    </tr>
                `;
                return;
            }
            throw error;
        }

        adminCustomers = data || [];

        // Incluir também as CONTAS DE LOGIN do site que ainda não têm ficha
        // de cliente (ex: cadastrou mas nunca comprou)
        // Buscar os endereços salvos no portal (o admin enxerga todos via RLS)
        try {
            const { data: addrData } = await supabaseClient.from("client_addresses").select("*");
            adminClientAddresses = addrData || [];
        } catch (e) {
            adminClientAddresses = [];
        }

        try {
            const { data: authUsers, error: authErr } = await supabaseClient.rpc("admin_list_auth_users");
            adminAuthUsers = authUsers || [];
            if (!authErr && authUsers) {
                const knownEmails = new Set(
                    adminCustomers.filter(c => c.email).map(c => c.email.toLowerCase())
                );
                authUsers.forEach(u => {
                    if (!u.email) return;
                    if (u.email.toLowerCase() === 'ravilarutilidades@gmail.com') return; // admin
                    if (knownEmails.has(u.email.toLowerCase())) return; // já listado

                    adminCustomers.push({
                        id: "auth-" + u.id,
                        phone: (u.phone || "").replace(/\D/g, ""),
                        email: u.email,
                        name: u.name || u.email.split("@")[0],
                        street: "", number: "", neighborhood: "", city: "",
                        created_at: u.created_at,
                        is_auth_only: true
                    });
                });
            }
        } catch (e) {
            // Função ainda não criada no banco — segue só com a tabela customers
            console.warn("admin_list_auth_users indisponível:", e.message);
        }

        renderCustomersTable();
    } catch (err) {
        showToast("Erro ao carregar clientes: " + err.message, "error");
        customerTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--error-color); padding: 30px;">Erro ao carregar clientes do banco de dados.</td></tr>`;
    }
}

// Render customers list with pagination and filter
function renderCustomersTable() {
    if (!customerTableBody) return;
    customerTableBody.innerHTML = "";

    const filtered = adminCustomers.filter(c => {
        // Exclude admin email
        if (c.email === 'ravilarutilidades@gmail.com') return false;
        
        return (c.name && c.name.toLowerCase().includes(customerSearchQuery)) ||
               (c.phone && c.phone.toLowerCase().includes(customerSearchQuery)) ||
               (c.email && c.email.toLowerCase().includes(customerSearchQuery)) ||
               (c.street && c.street.toLowerCase().includes(customerSearchQuery)) ||
               (c.neighborhood && c.neighborhood.toLowerCase().includes(customerSearchQuery)) ||
               (c.city && c.city.toLowerCase().includes(customerSearchQuery));
    });

    if (filtered.length === 0) {
        customerTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhum cliente cadastrado ou encontrado.</td></tr>`;
        if (customerPagination) customerPagination.innerHTML = "";
        return;
    }

    // Group by clean phone
    const grouped = [];
    const seenPhones = {};
    
    filtered.forEach(c => {
        const cleanPhone = c.phone ? c.phone.replace(/\D/g, "") : "no-phone";
        if (cleanPhone === "no-phone" || cleanPhone === "00000000000") {
            grouped.push({
                phone: c.phone,
                cleanPhone: cleanPhone,
                customers: [c]
            });
        } else {
            if (!seenPhones[cleanPhone]) {
                seenPhones[cleanPhone] = {
                    phone: c.phone,
                    cleanPhone: cleanPhone,
                    customers: []
                };
                grouped.push(seenPhones[cleanPhone]);
            }
            seenPhones[cleanPhone].customers.push(c);
        }
    });

    // Sort customers inside each group by created_at desc (newest first)
    grouped.forEach(g => {
        g.customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });

    // Sort grouped array by newest customer date desc
    grouped.sort((a, b) => new Date(b.customers[0].created_at) - new Date(a.customers[0].created_at));

    const totalItems = grouped.length;
    const totalPages = Math.ceil(totalItems / ADMIN_CUSTOMERS_PER_PAGE) || 1;

    if (adminCustomerCurrentPage > totalPages) {
        adminCustomerCurrentPage = totalPages;
    }

    const startIndex = (adminCustomerCurrentPage - 1) * ADMIN_CUSTOMERS_PER_PAGE;
    const endIndex = startIndex + ADMIN_CUSTOMERS_PER_PAGE;
    const pageGroups = grouped.slice(startIndex, endIndex);

    pageGroups.forEach(g => {
        // Representative row: prefer the one that has an address filled in
        const hasAddr = (x) => x.street && x.street.trim() && x.street !== "Não informado";
        const c = g.customers.find(hasAddr) || g.customers[0];
        
        const dateObj = new Date(c.created_at);
        const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Reunir TODOS os endereços da pessoa: os salvos no portal (Casa,
        // Trabalho...) + o da ficha de cliente, sem duplicar
        const addrList = [];
        const seenAddrKeys = new Set();
        const pushAddr = (label, street, number, neighborhood, city, uf, cep) => {
            if (!street || !String(street).trim() || street === "Não informado") return;
            const key = `${street}|${number}`.toLowerCase().replace(/\s+/g, "");
            if (seenAddrKeys.has(key)) return;
            seenAddrKeys.add(key);
            const cityText = uf ? `${city} - ${uf}` : city;
            addrList.push({
                label,
                text: `${street}, Nº ${number}${neighborhood ? " - " + neighborhood : ""}, ${cityText}${cep ? " (CEP " + cep + ")" : ""}`
            });
        };

        // 1. Endereços do portal dos usuários com esse telefone (têm nome e CEP)
        adminAuthUsers.forEach(u => {
            const uPhone = (u.phone || "").replace(/\D/g, "");
            if (!uPhone || uPhone !== g.cleanPhone) return;
            adminClientAddresses
                .filter(a => a.user_id === u.id)
                .forEach(a => pushAddr(
                    (a.name || "Endereço") + (a.is_default ? " ⭐" : ""),
                    a.street, a.number, a.neighborhood, a.city, a.uf, a.cep
                ));
        });

        // 2. Endereço da(s) ficha(s) de cliente do grupo
        g.customers.forEach(cust => pushAddr(null, cust.street, cust.number, cust.neighborhood, cust.city, "", null));

        const address = addrList.length > 0
            ? addrList.map(a => `
                <div style="margin-top: 4px;">
                    ${a.label ? `<strong style="font-size: 0.78rem;">${escapeHTML(a.label)}:</strong> ` : ""}<span style="font-size: 0.85rem;">${escapeHTML(a.text)}</span>
                </div>`).join("")
            : `<span style="color: var(--text-muted); font-style: italic;">Endereço não informado</span>`;
        
        let formattedPhone = g.phone;
        if (g.phone && g.phone.length === 11) {
            formattedPhone = `(${g.phone.slice(0,2)}) ${g.phone.slice(2,7)}-${g.phone.slice(7)}`;
        } else if (g.phone && g.phone.length === 10) {
            formattedPhone = `(${g.phone.slice(0,2)}) ${g.phone.slice(2,6)}-${g.phone.slice(6)}`;
        }
        formattedPhone = escapeHTML(formattedPhone);

        const phoneHTML = g.cleanPhone && g.cleanPhone !== "no-phone" && g.cleanPhone !== "00000000000"
            ? `<a href="https://wa.me/55${g.cleanPhone}" target="_blank" style="color: var(--whatsapp-color); font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: opacity 0.2s;" title="Chamar no WhatsApp" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.15rem;"></i> ${formattedPhone}
               </a>`
            : formattedPhone;

        let emailsHTML = "";
        g.customers.forEach(cust => {
            if (cust.email) {
                emailsHTML += `
                    <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                        <i class="fa-regular fa-envelope"></i>
                        <span class="client-email-text" style="word-break: break-word; white-space: nowrap;">${escapeHTML(cust.email)}</span>
                        <button class="btn-copy-email" data-email="${escapeHTML(cust.email)}" style="background: none; border: none; padding: 0; color: var(--accent-color); cursor: pointer; display: inline-flex; align-items: center; transition: color 0.2s;" title="Copiar E-mail" onmouseover="this.style.color='var(--accent-hover)'" onmouseout="this.style.color='var(--accent-color)'">
                            <i class="fa-regular fa-copy"></i>
                        </button>
                        <button class="btn-action-delete-customer" data-id="${cust.id}" style="background: none; border: none; padding: 0; color: var(--error-color); cursor: pointer; display: inline-flex; align-items: center; transition: opacity 0.2s;" title="Excluir Usuário" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                            <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                        </button>
                    </div>
                `;
            } else {
                emailsHTML += `
                    <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 6px;">
                        <i class="fa-regular fa-envelope"></i>
                        <span>E-mail não informado</span>
                        <button class="btn-action-delete-customer" data-id="${cust.id}" style="background: none; border: none; padding: 0; color: var(--error-color); cursor: pointer; display: inline-flex; align-items: center; transition: opacity 0.2s;" title="Excluir Visitante" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                            <i class="fa-solid fa-trash-can" style="font-size: 0.85rem;"></i>
                        </button>
                    </div>
                `;
            }
        });

        const trHTML = `
            <tr data-phone="${g.cleanPhone}">
                <td style="white-space: nowrap;">${phoneHTML}</td>
                <td>
                    <div style="font-weight: 600;">${escapeHTML(c.name)}</div>
                    ${emailsHTML}
                </td>
                <td>${address}</td>
                <td>${formattedDate}</td>
            </tr>
        `;
        customerTableBody.insertAdjacentHTML("beforeend", trHTML);
    });

    renderCustomersPagination(totalPages);
    bindCustomersActionEvents();
}

// Generate pagination controls for customers
function renderCustomersPagination(totalPages) {
    if (!customerPagination) return;
    customerPagination.innerHTML = "";

    if (totalPages <= 1) return;

    let paginationHTML = "";

    paginationHTML += `
        <button class="page-btn" ${adminCustomerCurrentPage === 1 ? 'disabled' : ''} id="admin-customers-prev-page">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="page-btn ${adminCustomerCurrentPage === i ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    paginationHTML += `
        <button class="page-btn" ${adminCustomerCurrentPage === totalPages ? 'disabled' : ''} id="admin-customers-next-page">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    customerPagination.innerHTML = paginationHTML;

    const prevBtn = document.getElementById("admin-customers-prev-page");
    const nextBtn = document.getElementById("admin-customers-next-page");
    const numBtns = customerPagination.querySelectorAll("button[data-page]");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (adminCustomerCurrentPage > 1) {
                adminCustomerCurrentPage--;
                renderCustomersTable();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (adminCustomerCurrentPage < totalPages) {
                adminCustomerCurrentPage++;
                renderCustomersTable();
            }
        });
    }

    numBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            adminCustomerCurrentPage = parseInt(btn.getAttribute("data-page"));
            renderCustomersTable();
        });
    });
}

// Bind click event for customer row deletion
function bindCustomersActionEvents() {
    const deleteBtns = customerTableBody.querySelectorAll(".btn-action-delete-customer");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteCustomer(id);
        });
    });

    const copyBtns = customerTableBody.querySelectorAll(".btn-copy-email");
    copyBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const email = btn.getAttribute("data-email");
            if (email) {
                navigator.clipboard.writeText(email)
                    .then(() => {
                        showToast("E-mail copiado para a área de transferência!", "success");
                        const icon = btn.querySelector("i");
                        if (icon) {
                            icon.className = "fa-solid fa-check";
                            icon.style.color = "var(--success-color)";
                            setTimeout(() => {
                                icon.className = "fa-regular fa-copy";
                                icon.style.color = "";
                            }, 2000);
                        }
                    })
                    .catch(err => {
                        showToast("Erro ao copiar e-mail: " + err, "error");
                    });
            }
        });
    });
}

// Delete customer registration from database
// Fichas de cliente saem da tabela customers; contas de login (ids "auth-...")
// são excluídas do sistema de autenticação via função segura no banco.
async function deleteCustomer(id) {
    const isAuthAccount = String(id).startsWith("auth-");
    const msg = isAuthAccount
        ? "Tem certeza que deseja excluir esta CONTA de cliente? Ela perderá o acesso ao site (favoritos e endereços salvos são removidos; pedidos são mantidos)."
        : "Tem certeza que deseja excluir o cadastro deste cliente?";

    const ok = await showConfirm(msg);
    if (!ok) return;
    if (!supabaseClient) return;

    try {
        if (isAuthAccount) {
            const userUuid = String(id).replace("auth-", "");
            const { error } = await supabaseClient.rpc("admin_delete_auth_user", { user_uuid: userUuid });
            if (error) throw error;
        } else {
            const { error } = await supabaseClient
                .from("customers")
                .delete()
                .eq("id", id);
            if (error) throw error;
        }

        showToast("Cadastro de cliente excluído com sucesso!", "success");
        await loadCustomers();
    } catch (err) {
        showToast("Erro ao excluir cliente: " + err.message, "error");
    }
}

// Check active auth session in Supabase
async function checkAuth() {
    if (!supabaseClient) {
        showLoginHideDashboard();
        return false;
    }

    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) throw error;

        if (session && session.user) {
            const adminEmail = "ravilarutilidades@gmail.com";
            if (session.user.email === adminEmail) {
                hideLoginShowDashboard();
                return true;
            } else {
                console.warn("Acesso negado: Usuário logado não é o administrador.");
                await supabaseClient.auth.signOut();
                showLoginHideDashboard();
                showLoginError("Acesso negado. Apenas o administrador do site pode acessar este painel.");
                return false;
            }
        } else {
            showLoginHideDashboard();
            return false;
        }
    } catch (err) {
        console.error("Erro na verificação de sessão:", err.message);
        showLoginHideDashboard();
        return false;
    }
}

// Show login screen, hide stats and table
function showLoginHideDashboard() {
    if (loginOverlay) loginOverlay.style.display = "flex";
    const mainContent = document.querySelector("main.container");
    if (mainContent) mainContent.style.display = "none";
    if (headerActions) headerActions.style.display = "none";
}

// Hide login screen, show stats and table
function hideLoginShowDashboard() {
    if (loginOverlay) loginOverlay.style.display = "none";
    const mainContent = document.querySelector("main.container");
    if (mainContent) mainContent.style.display = "block";
    if (headerActions) headerActions.style.display = "flex";
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = loginPasswordInput.value;
    const submitBtn = document.getElementById("login-submit-btn");
    
    if (loginError) loginError.style.display = "none";
    
    if (!supabaseClient) {
        showLoginError("Supabase não configurado.");
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Entrando... <i class="fa-solid fa-spinner fa-spin"></i>';
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        const adminEmail = "ravilarutilidades@gmail.com";
        if (data.user && data.user.email === adminEmail) {
            hideLoginShowDashboard();
            await loadAllDashboardData();
            showToast("Login realizado com sucesso!", "success");
        } else {
            await supabaseClient.auth.signOut();
            throw new Error("Acesso negado. Apenas o administrador do site pode acessar este painel.");
        }
        
    } catch (err) {
        console.error("Erro no login:", err.message);
        let errorMsg = "E-mail ou senha incorretos.";
        if (err.message.includes("Invalid login credentials")) {
            errorMsg = "E-mail ou senha incorretos.";
        } else if (err.message.includes("Acesso negado")) {
            errorMsg = err.message;
        } else if (err.message.includes("Connection")) {
            errorMsg = "Erro de conexão com o banco de dados.";
        } else {
            errorMsg = err.message;
        }
        showLoginError(errorMsg);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Entrar no Painel <i class="fa-solid fa-right-to-bracket"></i>';
    }
}

// Display error alert under logo
function showLoginError(msg) {
    if (loginError && loginErrorText) {
        loginErrorText.textContent = msg;
        loginError.style.display = "flex";
    }
}

// Handle admin logout click
async function handleLogout() {
    const ok = await showConfirm("Tem certeza que deseja sair do painel administrativo?");
    if (!ok) return;
    if (!supabaseClient) return;
    
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        
        showToast("Sessão encerrada.", "info");
        // Reload to clear state and show login screen
        window.location.reload();
    } catch (err) {
        showToast("Erro ao deslogar: " + err.message, "error");
    }
}

// Start Admin panel load
window.addEventListener("DOMContentLoaded", init);

// ==========================================================================
// FLYER GENERATOR FEATURES
// ==========================================================================
let selectedFlyerProducts = [];
let flyerSearchQuery = "";
let flyerCategoryFilter = "all";

function getContrastColor(hexColor) {
    if (!hexColor || hexColor.charAt(0) !== '#') return '#1e293b';
    const hex = hexColor.substring(1);
    if (hex.length !== 6) return '#1e293b';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1e293b' : '#ffffff';
}

// Preenche o rodapé do panfleto: QR code do site + redes sociais das Configurações
function renderFlyerFooterInfo() {
    // QR Code (gerado uma única vez)
    const qrEl = document.getElementById("flyer-qrcode");
    if (qrEl && typeof QRCode !== "undefined" && qrEl.childElementCount === 0) {
        new QRCode(qrEl, {
            text: "https://ravilarutilidades.com.br",
            width: 88,
            height: 88,
            colorDark: "#1A365D",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
    }

    // Extrai o @usuario de uma URL de rede social (ex: instagram.com/ravilar -> @ravilar)
    const handleFromUrl = (url) => {
        try {
            const u = new URL(url);
            const parts = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
            return parts.length > 0 ? "@" + parts[parts.length - 1] : u.hostname;
        } catch (e) {
            return url;
        }
    };

    const instaBox = document.getElementById("flyer-social-instagram");
    if (instaBox) {
        const instaUrl = storeSettings["social_instagram"];
        if (instaUrl && instaUrl.trim()) {
            instaBox.querySelector("span").textContent = handleFromUrl(instaUrl.trim());
            instaBox.style.display = "block";
        } else {
            instaBox.style.display = "none";
        }
    }

    const faceBox = document.getElementById("flyer-social-facebook");
    if (faceBox) {
        const faceUrl = storeSettings["social_facebook"];
        if (faceUrl && faceUrl.trim()) {
            faceBox.querySelector("span").textContent = handleFromUrl(faceUrl.trim());
            faceBox.style.display = "block";
        } else {
            faceBox.style.display = "none";
        }
    }
}

function initFlyerGenerator() {
    // Rodapé com QR code e redes sociais
    renderFlyerFooterInfo();

    // 1. Populate category dropdown
    const catSelect = document.getElementById("flyer-category-filter");
    if (catSelect) {
        catSelect.innerHTML = '<option value="all">Todas as Categorias</option>';
        adminCategories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.slug;
            opt.textContent = cat.name;
            catSelect.appendChild(opt);
        });
    }

    // 2. Bind search & filter events
    const searchInput = document.getElementById("flyer-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            flyerSearchQuery = e.target.value.toLowerCase().trim();
            renderFlyerProductChecklist();
        });
    }

    if (catSelect) {
        catSelect.addEventListener("change", (e) => {
            flyerCategoryFilter = e.target.value;
            renderFlyerProductChecklist();
        });
    }

    // 3. Bind form inputs for real-time live preview
    const titleInput = document.getElementById("flyer-title");
    const subtitleInput = document.getElementById("flyer-subtitle");
    const validityInput = document.getElementById("flyer-validity");
    const bgColorInput = document.getElementById("flyer-bg-color");
    const colsSelect = document.getElementById("flyer-columns");
    const alignSelect = document.getElementById("flyer-align");
 
    const updatePreviewInputs = () => {
        document.getElementById("flyer-title-preview").textContent = titleInput.value || "RaviLar Utilidades";
        document.getElementById("flyer-subtitle-preview").textContent = subtitleInput.value || "Ofertas Incríveis";
        document.getElementById("flyer-validity-preview").textContent = validityInput.value || "";
        
        const bgColor = bgColorInput.value || "#ffffff";
        const headerPreview = document.getElementById("flyer-header-preview");
        headerPreview.style.backgroundColor = bgColor;
        
        // Calculate contrast color for text
        const textColor = getContrastColor(bgColor);
        headerPreview.style.color = textColor;
        document.getElementById("flyer-title-preview").style.color = textColor;
        document.getElementById("flyer-subtitle-preview").style.color = textColor;
        
        // Apply alignment class to the header preview
        const alignVal = alignSelect ? alignSelect.value : "left";
        headerPreview.classList.remove("align-left", "align-center", "align-right");
        headerPreview.classList.add(`align-${alignVal}`);
        
        const grid = document.getElementById("flyer-products-grid");
        grid.className = `flyer-grid col-${colsSelect.value}`;
    };
 
    [titleInput, subtitleInput, validityInput, bgColorInput, colsSelect, alignSelect].forEach(input => {
        if (input) {
            input.addEventListener("input", updatePreviewInputs);
            input.addEventListener("change", updatePreviewInputs);
        }
    });

    // 4. Bind print button
    const printBtn = document.getElementById("btn-print-flyer");
    if (printBtn) {
        printBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (selectedFlyerProducts.length === 0) {
                showToast("Por favor, selecione pelo menos 1 produto para imprimir o panfleto.", "error");
                return;
            }
            window.print();
        });
    }

    // Baixar PDF do panfleto (mesmo visual da impressão, em A4)
    const btnFlyerPdf = document.getElementById("btn-download-flyer-pdf");
    if (btnFlyerPdf) {
        btnFlyerPdf.addEventListener("click", async (e) => {
            e.preventDefault();
            if (selectedFlyerProducts.length === 0) {
                showToast("Selecione pelo menos 1 produto para gerar o PDF.", "error");
                return;
            }
            if (typeof html2canvas === "undefined" || typeof window.jspdf === "undefined") {
                showToast("Gerador de PDF não carregou. Recarregue a página.", "error");
                return;
            }

            const originalHTML = btnFlyerPdf.innerHTML;
            btnFlyerPdf.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando PDF...';
            btnFlyerPdf.disabled = true;

            try {
                const sheet = document.getElementById("flyer-a4-sheet");
                const canvas = await html2canvas(sheet, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    logging: false
                });

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

                // Encaixa o panfleto na página A4 (210x297mm) mantendo a proporção
                const pageW = 210;
                const pageH = 297;
                const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
                const w = canvas.width * ratio;
                const h = canvas.height * ratio;
                const x = (pageW - w) / 2;
                const y = (pageH - h) / 2;

                pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", x, y, w, h);

                const dateStr = new Date().toISOString().slice(0, 10);
                pdf.save(`panfleto_ravilar_${dateStr}.pdf`);

                showToast("PDF do panfleto gerado com sucesso!", "success");
            } catch (err) {
                console.error("Erro ao gerar PDF do panfleto:", err);
                showToast("Erro ao gerar o PDF. Alguma foto externa pode estar bloqueando a exportação.", "error");
            } finally {
                btnFlyerPdf.innerHTML = originalHTML;
                btnFlyerPdf.disabled = false;
            }
        });
    }

    // Bind Clear Selection button
    const clearSelectionBtn = document.getElementById("btn-clear-flyer-selection");
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            if (selectedFlyerProducts.length === 0) return;
            const ok = await showConfirm("Deseja desmarcar todos os produtos selecionados?");
            if (!ok) return;
            
            selectedFlyerProducts = [];
            document.getElementById("flyer-selected-count").textContent = "0 produtos selecionados";
            renderFlyerProductChecklist();
            updatePreviewInputs();
            renderFlyerPreview();
            showToast("Seleção de produtos limpa.", "info");
        });
    }

    // 6. Bind Template Save / List / Delete events
    const quickSaveBtn = document.getElementById("btn-save-flyer-quick");

    const renderSavedFlyersList = () => {
        const listDiv = document.getElementById("saved-flyers-list");
        if (!listDiv) return;
        
        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem("ravilar_flyer_templates") || "[]");
        } catch (e) {
            saved = [];
        }
        
        if (saved.length === 0) {
            listDiv.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px 0;">
                    Nenhum panfleto salvo ainda.
                </div>
            `;
            return;
        }
        
        listDiv.innerHTML = "";
        saved.forEach(tpl => {
            const row = document.createElement("div");
            row.className = "saved-flyer-item";
            
            const label = document.createElement("span");
            label.textContent = tpl.name;
            label.title = tpl.name;
            
            const actions = document.createElement("div");
            actions.className = "saved-flyer-actions";
            
            const btnLoad = document.createElement("button");
            btnLoad.className = "btn-load";
            btnLoad.title = "Carregar / Editar";
            btnLoad.innerHTML = '<i class="fa-solid fa-pencil"></i>';
            btnLoad.addEventListener("click", (evt) => {
                evt.preventDefault();
                // Load values back to inputs
                titleInput.value = tpl.title || "";
                subtitleInput.value = tpl.subtitle || "";
                validityInput.value = tpl.validity || "";
                bgColorInput.value = tpl.bgColor || "#ffffff";
                colsSelect.value = tpl.columns || "3";
                if (alignSelect) {
                    alignSelect.value = tpl.align || "left";
                }

                // Restore selection
                selectedFlyerProducts = [...(tpl.selectedProducts || [])];
                
                // Refresh counts, checklist and preview
                document.getElementById("flyer-selected-count").textContent = `${selectedFlyerProducts.length} produtos selecionados`;
                renderFlyerProductChecklist();
                updatePreviewInputs();
                renderFlyerPreview();
                
                showToast(`Panfleto "${tpl.name}" carregado para edição.`, "success");
            });
            
            const btnDel = document.createElement("button");
            btnDel.className = "btn-del";
            btnDel.title = "Excluir";
            btnDel.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            btnDel.addEventListener("click", async (evt) => {
                evt.preventDefault();
                const ok = await showConfirm(`Tem certeza que deseja excluir o panfleto "${tpl.name}"?`);
                if (!ok) return;
                
                let currentSaved = [];
                try {
                    currentSaved = JSON.parse(localStorage.getItem("ravilar_flyer_templates") || "[]");
                } catch (err) {
                    currentSaved = [];
                }
                currentSaved = currentSaved.filter(t => t.name !== tpl.name);
                localStorage.setItem("ravilar_flyer_templates", JSON.stringify(currentSaved));
                
                showToast("Panfleto excluído.", "info");
                renderSavedFlyersList();
            });
            
            actions.appendChild(btnLoad);
            actions.appendChild(btnDel);
            row.appendChild(label);
            row.appendChild(actions);
            listDiv.appendChild(row);
        });
    };

    if (quickSaveBtn) {
        quickSaveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            const title = titleInput.value.trim() || "Panfleto RaviLar";
            const dateStr = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
            const autoName = `${title} - ${dateStr}`;
            
            let saved = [];
            try {
                saved = JSON.parse(localStorage.getItem("ravilar_flyer_templates") || "[]");
            } catch (err) {
                saved = [];
            }

            const newTemplate = {
                name: autoName,
                title: titleInput.value,
                subtitle: subtitleInput.value,
                validity: validityInput.value,
                bgColor: bgColorInput.value,
                columns: colsSelect.value,
                align: alignSelect ? alignSelect.value : "left",
                selectedProducts: [...selectedFlyerProducts]
            };

            // Remove existing with same name if any
            saved = saved.filter(tpl => tpl.name !== autoName);
            saved.push(newTemplate);

            localStorage.setItem("ravilar_flyer_templates", JSON.stringify(saved));
            showToast(`Panfleto salvo: "${autoName}"`, "success");
            
            renderSavedFlyersList();
        });
    }

    // Call it initially
    renderSavedFlyersList();
    updatePreviewInputs();

    // 5. Initial render of checklist
    renderFlyerProductChecklist();
}

function renderFlyerProductChecklist() {
    const listContainer = document.getElementById("flyer-product-select-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    const filtered = adminProducts.filter(p => {
        const matchesCat = (flyerCategoryFilter === "all" || p.category === flyerCategoryFilter);
        const matchesSearch = p.name.toLowerCase().includes(flyerSearchQuery) || 
                              p.description.toLowerCase().includes(flyerSearchQuery);
        return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 20px 0;">Nenhum produto encontrado.</div>`;
        return;
    }

    filtered.forEach(p => {
        const isSelected = selectedFlyerProducts.includes(p.id);
        const itemDiv = document.createElement("div");
        itemDiv.className = `flyer-select-item ${isSelected ? 'selected' : ''}`;
        
        const mediaUrls = getProductMedia(p.image);
        const imgUrl = mediaUrls.length > 0 ? mediaUrls[0] : 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400';

        itemDiv.innerHTML = `
            <img src="${imgUrl}" class="flyer-select-img" alt="${p.name}">
            <div class="flyer-select-info">
                <span class="flyer-select-name">${p.name}</span>
                <span class="flyer-select-price">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <input type="checkbox" class="flyer-select-checkbox" ${isSelected ? 'checked' : ''}>
        `;

        // Handle selection click
        const checkbox = itemDiv.querySelector(".flyer-select-checkbox");
        const toggleSelection = (e) => {
            // Avoid double toggle when clicking the checkbox directly
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            if (checkbox.checked) {
                if (!selectedFlyerProducts.includes(p.id)) {
                    selectedFlyerProducts.push(p.id);
                }
                itemDiv.classList.add("selected");
            } else {
                selectedFlyerProducts = selectedFlyerProducts.filter(id => id !== p.id);
                itemDiv.classList.remove("selected");
            }

            // Update selected count badge
            document.getElementById("flyer-selected-count").textContent = `${selectedFlyerProducts.length} produtos selecionados`;
            renderFlyerPreview();
        };

        itemDiv.addEventListener("click", toggleSelection);
        listContainer.appendChild(itemDiv);
    });
}

function renderFlyerPreview() {
    const grid = document.getElementById("flyer-products-grid");
    if (!grid) return;

    grid.innerHTML = "";

    // Dynamic compactness adjustment based on number of selected products
    const sheet = document.getElementById("flyer-a4-sheet");
    if (sheet) {
        sheet.classList.remove("compact-medium", "compact-extra");
        if (selectedFlyerProducts.length >= 10) {
            sheet.classList.add("compact-extra");
        } else if (selectedFlyerProducts.length >= 7) {
            sheet.classList.add("compact-medium");
        }
    }

    if (selectedFlyerProducts.length === 0) {
        grid.innerHTML = `
            <div class="flyer-empty-state">
                <i class="fa-solid fa-file-image fa-3x" style="color: var(--text-muted); margin-bottom: 12px; display: block;"></i>
                <p>Selecione produtos no painel ao lado para gerar o panfleto.</p>
            </div>
        `;
        return;
    }

    selectedFlyerProducts.forEach(pid => {
        const p = adminProducts.find(prod => prod.id === pid);
        if (!p) return;

        const card = document.createElement("div");
        card.className = "flyer-card";

        const mediaUrls = getProductMedia(p.image);
        const imgUrl = mediaUrls.length > 0 ? mediaUrls[0] : '';

        // Formating price in retail style: R$ XX,YY (XX in big digits, YY in superscript)
        const priceParts = p.price.toFixed(2).split('.');
        const integerPart = priceParts[0];
        const centsPart = priceParts[1];

        const flyerOldPrice = (p.old_price && parseFloat(p.old_price) > p.price)
            ? `<div style="text-decoration: line-through; color: #E53E3E; font-size: 0.72rem; font-weight: 700;">De R$ ${parseFloat(p.old_price).toFixed(2).replace('.', ',')}</div>`
            : "";

        card.innerHTML = `
            <div class="flyer-card-badge">Oferta</div>
            <div class="flyer-card-img-wrapper">
                <img src="${imgUrl}" class="flyer-card-img" alt="${p.name}">
            </div>
            <div class="flyer-card-title">${p.name}</div>
            ${flyerOldPrice}
            <div class="flyer-card-price-tag">
                <span class="flyer-price-currency">R$</span>
                <span class="flyer-price-integer">${integerPart}</span>
                <span class="flyer-price-cents">,${centsPart}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

// ==========================================================================
// ADMIN SALES MANAGEMENT TAB LOGIC
// ==========================================================================
let adminOrders = [];
let ordersCurrentPage = 1;
let ordersPerPage = 10;
let ordersSearchQuery = "";
let ordersFilterStatus = "all";
let currentAdminOrder = null;

async function loadAdminOrders() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("orders")
            .select("*")
            .order("id", { ascending: false });
        
        if (error) throw error;
        adminOrders = data || [];
        
        renderAdminOrdersMetrics();
        renderAdminOrdersTable();
        updateStats(); // Update dashboard stats as well
    } catch (e) {
        showToast("Erro ao carregar vendas: " + e.message, "error");
    }
}

function renderAdminOrdersMetrics() {
    const faturamentoVal = document.getElementById("admin-vendas-faturamento");
    const totalVal = document.getElementById("admin-vendas-total-pedidos");
    const aguardandoVal = document.getElementById("admin-vendas-aguardando");

    if (!faturamentoVal || !totalVal || !aguardandoVal) return;

    let faturamentoSum = 0;
    let totalOrdersCount = adminOrders.length;
    let pendingShipment = 0;

    adminOrders.forEach(order => {
        if (order.status !== "Cancelado") {
            faturamentoSum += order.total_amount;
        }
        if (order.status === "Pendente" || order.status === "Pago" || order.status === "Separando") {
            pendingShipment++;
        }
    });

    faturamentoVal.textContent = `R$ ${faturamentoSum.toFixed(2).replace('.', ',')}`;
    totalVal.textContent = totalOrdersCount;
    aguardandoVal.textContent = pendingShipment;
}

function renderAdminOrdersTable() {
    const tbody = document.getElementById("admin-vendas-tbody");
    if (!tbody) return;

    // 1. Filter Orders
    let filtered = adminOrders.filter(order => {
        const matchesStatus = (ordersFilterStatus === "all" || order.status === ordersFilterStatus);
        
        const q = ordersSearchQuery.toLowerCase();
        const matchesSearch = !q || 
            (order.client_name && order.client_name.toLowerCase().includes(q)) || 
            (order.client_phone && order.client_phone.includes(q)) || 
            String(order.id).includes(q);

        return matchesStatus && matchesSearch;
    });

    // 2. Paginate
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ordersPerPage);
    if (ordersCurrentPage > totalPages && totalPages > 0) {
        ordersCurrentPage = totalPages;
    }

    const startIndex = (ordersCurrentPage - 1) * ordersPerPage;
    const paginated = filtered.slice(startIndex, startIndex + ordersPerPage);

    tbody.innerHTML = "";

    if (paginated.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 30px;">Nenhum pedido correspondente encontrado.</td></tr>`;
        renderOrdersPagination(0);
        return;
    }

    paginated.forEach(rawOrder => {
        const order = escapeOrder(rawOrder);
        const dateStr = new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>#RL-${order.id}</strong></td>
            <td>
                <div><strong>${order.client_name}</strong></div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${order.client_phone}</div>
            </td>
            <td>${dateStr}</td>
            <td><strong>R$ ${order.total_amount.toFixed(2).replace('.', ',')}</strong></td>
            <td>
                <div>${order.payment_method}</div>
                <span class="status-badge ${order.payment_status === 'Pago' ? 'pago' : 'pendente'}" style="font-size: 0.65rem; padding: 2px 6px;">${order.payment_status}</span>
            </td>
            <td><span class="status-badge ${statusToClass(order.status)}">${escapeHTML(order.status)}</span></td>
            <td>
                <div style="display: flex; gap: 6px; align-items: center; white-space: nowrap;">
                    <button class="btn btn-secondary btn-sm btn-admin-order-view" data-id="${order.id}" title="Ver Detalhes" style="margin: 0; padding: 6px 10px; font-size: 0.85rem;">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm btn-admin-order-print" data-id="${order.id}" title="Imprimir Comprovante do Pedido" style="margin: 0; padding: 6px 10px; font-size: 0.85rem;">
                        <i class="fa-solid fa-receipt"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm btn-admin-order-label" data-id="${order.id}" title="Imprimir Etiqueta de Envio" style="margin: 0; padding: 6px 10px; font-size: 0.85rem;">
                        <i class="fa-solid fa-tag"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm btn-admin-order-decl" data-id="${order.id}" title="Imprimir Declaração de Conteúdo" style="margin: 0; padding: 6px 10px; font-size: 0.85rem;">
                        <i class="fa-solid fa-file-invoice"></i>
                    </button>
                    <button class="btn btn-primary btn-sm btn-admin-order-all" data-id="${order.id}" title="Imprimir Tudo (Etiqueta + Declaração)" style="margin: 0; padding: 6px 10px; font-size: 0.85rem;">
                        <i class="fa-solid fa-boxes-packing"></i>
                    </button>
                </div>
            </td>
        `;

        tr.querySelector(".btn-admin-order-view").addEventListener("click", () => {
            openAdminOrderDetails(order.id);
        });

        tr.querySelector(".btn-admin-order-print").addEventListener("click", () => {
            printEntireOrder(order.id);
        });

        tr.querySelector(".btn-admin-order-label").addEventListener("click", () => {
            printShippingLabel(order.id);
        });

        tr.querySelector(".btn-admin-order-decl").addEventListener("click", () => {
            printDeclarationOfContent(order.id);
        });

        tr.querySelector(".btn-admin-order-all").addEventListener("click", () => {
            printAllShippingDocs(order.id);
        });

        tbody.appendChild(tr);
    });

    renderOrdersPagination(totalItems);
}

function renderOrdersPagination(totalItems) {
    const container = document.getElementById("admin-orders-pagination");
    if (!container) return;

    const totalPages = Math.ceil(totalItems / ordersPerPage);
    container.innerHTML = "";

    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn";
    prevBtn.disabled = ordersCurrentPage === 1;
    prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
    prevBtn.addEventListener("click", () => {
        ordersCurrentPage--;
        renderAdminOrdersTable();
    });
    container.appendChild(prevBtn);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `pagination-btn ${ordersCurrentPage === i ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener("click", () => {
            ordersCurrentPage = i;
            renderAdminOrdersTable();
        });
        container.appendChild(btn);
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn";
    nextBtn.disabled = ordersCurrentPage === totalPages;
    nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
    nextBtn.addEventListener("click", () => {
        ordersCurrentPage++;
        renderAdminOrdersTable();
    });
    container.appendChild(nextBtn);
}

// Function to print a shipping label
function printShippingLabel(orderId) {
    const order = escapeOrder(adminOrders.find(o => o.id == orderId));
    if (!order) return;

    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) {
        showToast("Erro ao abrir janela de impressão. Verifique se o bloqueador de pop-ups está ativado.", "error");
        return;
    }

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Etiqueta de Envio - Pedido #RL-${order.id}</title>
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #000000;
        }
        .label-card {
            border: 3px solid #000000;
            padding: 24px;
            max-width: 480px;
            margin: 0 auto;
            border-radius: 8px;
            box-sizing: border-box;
        }
        .header {
            border-bottom: 3px dashed #000000;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .store-title {
            font-weight: 800;
            font-size: 1.3rem;
            letter-spacing: 0.5px;
        }
        .order-tag {
            font-size: 1.1rem;
            font-weight: 800;
            background-color: #000000;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 4px;
        }
        .section {
            margin-bottom: 24px;
        }
        .section-title {
            font-weight: 800;
            text-transform: uppercase;
            font-size: 0.85rem;
            margin-bottom: 8px;
            letter-spacing: 1px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
        }
        .recipient-info {
            font-size: 1.05rem;
            line-height: 1.5;
        }
        .name {
            font-size: 1.25rem;
            font-weight: 800;
            margin-bottom: 6px;
        }
        .cep-display {
            font-size: 1.4rem;
            font-weight: 900;
            margin-top: 12px;
            background-color: #f0f0f0;
            padding: 6px 12px;
            display: inline-block;
            border: 1px solid #000000;
            border-radius: 4px;
        }
        .sender-info {
            font-size: 0.9rem;
            line-height: 1.4;
            color: #333333;
        }
        .footer {
            border-top: 3px dashed #000000;
            padding-top: 12px;
            margin-top: 20px;
            font-size: 0.8rem;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
        }
        @media print {
            body { padding: 0; }
            .label-card {
                border: 3px solid #000000;
                box-shadow: none;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="label-card">
        <div class="header">
            <span class="store-title">RAVILAR UTILIDADES</span>
            <span class="order-tag">#RL-${order.id}</span>
        </div>
        
        <div class="section">
            <div class="section-title">Destinatário</div>
            <div class="recipient-info">
                <div class="name">${order.client_name}</div>
                <div>${order.street}, nº ${order.number} ${order.complement ? '- ' + order.complement : ''}</div>
                <div>Bairro: ${order.neighborhood}</div>
                <div>${order.city} - ${order.uf}</div>
                <div class="cep-display">CEP: ${order.cep || 'Não informado'}</div>
                <div style="font-size: 0.9rem; margin-top: 8px; font-weight: 600;">Contato: ${order.client_phone}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">Remetente</div>
            <div class="sender-info">
                <strong>RaviLar Utilidades</strong><br>
                Rua Altino Arantes, nº 908 - Centro<br>
                Santa Adélia - SP - CEP: 15950-000<br>
                Contato: (17) 99637-1743
            </div>
        </div>
        
        <div class="footer">
            Declaração de Conteúdo Anexa à Caixa
        </div>
    </div>
    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
}

// Function to print declaration of content (Declaração de Conteúdo)
async function printDeclarationOfContent(orderId) {
    const order = escapeOrder(adminOrders.find(o => o.id == orderId));
    if (!order) return;

    try {
        // Fetch items for the order
        const { data: items, error } = await supabaseClient
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);

        if (error) throw error;

        const dateStr = new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });

        const printWindow = window.open("", "_blank", "width=850,height=950");
        if (!printWindow) {
            showToast("Erro ao abrir janela de impressão.", "error");
            return;
        }

        let itemsRows = "";
        let totalValue = 0;
        let totalQty = 0;
        
        items.forEach((item, index) => {
            const itemVal = item.price * item.quantity;
            totalValue += itemVal;
            totalQty += item.quantity;
            itemsRows += `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${escapeHTML(item.product_name)}</td>
                    <td style="text-align: center;">UN</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                    <td style="text-align: right;">R$ ${itemVal.toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        });

        // Fill remaining empty rows up to 4 rows
        const minRows = 4;
        if (items.length < minRows) {
            for (let i = items.length; i < minRows; i++) {
                itemsRows += `
                    <tr>
                        <td style="text-align: center; color: transparent;">${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                `;
            }
        }

        const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Declaração de Conteúdo - Pedido #RL-${order.id}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 10px;
            color: #000;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 15px;
            box-sizing: border-box;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .header-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }
        .title {
            font-size: 14px;
            font-weight: bold;
        }
        .section-header {
            background-color: #f2f2f2;
            font-weight: bold;
            text-transform: uppercase;
            padding: 4px 8px;
            border: 1px solid #000;
            border-top: none;
            font-size: 10px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .info-table td {
            border: 1px solid #000;
            padding: 6px;
            vertical-align: top;
        }
        .goods-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .goods-table th, .goods-table td {
            border: 1px solid #000;
            padding: 6px;
            font-size: 9px;
        }
        .goods-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }
        .declaration-text {
            border: 1px solid #000;
            padding: 10px;
            line-height: 1.5;
            margin-bottom: 15px;
            text-align: justify;
        }
        .signature-box {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .signature-line {
            width: 45%;
            border-top: 1px solid #000;
            text-align: center;
            padding-top: 5px;
            margin-top: 30px;
        }
        @media print {
            body { padding: 0; }
            .container { border: 1px solid #000; }
        }
    </style>
</head>
<body>
    <div class="container">
        <table class="header-table">
            <tr>
                <td style="width: 25%;"><strong style="font-size: 14px;">CORREIOS</strong></td>
                <td style="width: 50%;"><span class="title">DECLARAÇÃO DE CONTEÚDO</span></td>
                <td style="width: 25%;">
                    <strong>Nº DO PEDIDO:</strong><br>
                    <span style="font-size: 12px; font-weight: bold;">#RL-${order.id}</span>
                </td>
            </tr>
        </table>
        
        <div class="section-header">1. Remetente</div>
        <table class="info-table">
            <tr>
                <td style="width: 60%;"><strong>NOME:</strong> RaviLar Utilidades</td>
                <td style="width: 40%;"><strong>CPF/CNPJ:</strong> 37.492.355/0001-92</td>
            </tr>
            <tr>
                <td colspan="2"><strong>ENDEREÇO:</strong> Rua Altino Arantes, nº 908 - Centro</td>
            </tr>
            <tr>
                <td><strong>CIDADE:</strong> Santa Adélia</td>
                <td><strong>UF:</strong> SP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>CEP:</strong> 15950-000</td>
            </tr>
        </table>
        
        <div class="section-header">2. Destinatário</div>
        <table class="info-table">
            <tr>
                <td style="width: 60%;"><strong>NOME:</strong> ${order.client_name}</td>
                <td style="width: 40%;"><strong>CPF/CNPJ:</strong> (Não Informado)</td>
            </tr>
            <tr>
                <td colspan="2"><strong>ENDEREÇO:</strong> ${order.street}, nº ${order.number} ${order.complement ? '- ' + order.complement : ''} - Bairro: ${order.neighborhood}</td>
            </tr>
            <tr>
                <td><strong>CIDADE:</strong> ${order.city}</td>
                <td><strong>UF:</strong> ${order.uf} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>CEP:</strong> ${order.cep || 'Não informado'}</td>
            </tr>
        </table>
        
        <div class="section-header">3. Identificação dos Bens</div>
        <table class="goods-table">
            <thead>
                <tr>
                    <th style="width: 5%;">ITEM</th>
                    <th style="width: 50%;">CONTEÚDO</th>
                    <th style="width: 8%;">UNID.</th>
                    <th style="width: 9%;">QTD.</th>
                    <th style="width: 14%;">VALOR UNIT.</th>
                    <th style="width: 14%;">VALOR TOTAL</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
                <tr style="font-weight: bold; background-color: #f9f9f9;">
                    <td colspan="3" style="text-align: right;">TOTAIS:</td>
                    <td style="text-align: center;">${totalQty}</td>
                    <td></td>
                    <td style="text-align: right;">R$ ${totalValue.toFixed(2).replace('.', ',')}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="declaration-text">
            <strong>DECLARAÇÃO:</strong><br>
            Declaro sob as penas da lei que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, 
            uma vez que não realizo, com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria, 
            ainda que se iniciem no exterior, ou prestações de serviços de transporte interestadual e intermunicipal e de comunicação. 
            Declaro ainda que o conteúdo descrito nesta declaração corresponde exatamente ao que está sendo enviado, assumindo total 
            responsabilidade civil e criminal por qualquer informação incorreta ou falsa.
        </div>
        
        <div style="font-size: 9px; margin-bottom: 20px;">
            <strong>DATA:</strong> Santa Adélia - SP, ${dateStr}
        </div>
        
        <div class="signature-box">
            <div class="signature-line">
                Assinatura do Declarante / Remetente
            </div>
            <div class="signature-line" style="border-top: none; padding-top: 15px;">
                * Documento isento de assinatura se impresso via sistema autorizado.
            </div>
        </div>
    </div>
    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    </script>
</body>
</html>
        `;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

    } catch (e) {
        showToast("Erro ao carregar itens para a declaração de conteúdo: " + e.message, "error");
    }
}

// Function to print both Shipping Label and Declaration of Content in one go
async function printAllShippingDocs(orderId) {
    const order = escapeOrder(adminOrders.find(o => o.id == orderId));
    if (!order) return;

    try {
        // Fetch items for the order
        const { data: items, error } = await supabaseClient
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);

        if (error) throw error;

        const dateStr = new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });

        const printWindow = window.open("", "_blank", "width=850,height=950");
        if (!printWindow) {
            showToast("Erro ao abrir janela de impressão.", "error");
            return;
        }

        let itemsRows = "";
        let totalValue = 0;
        let totalQty = 0;
        
        items.forEach((item, index) => {
            const itemVal = item.price * item.quantity;
            totalValue += itemVal;
            totalQty += item.quantity;
            itemsRows += `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${escapeHTML(item.product_name)}</td>
                    <td style="text-align: center;">UN</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                    <td style="text-align: right;">R$ ${itemVal.toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        });

        const minRows = 4;
        if (items.length < minRows) {
            for (let i = items.length; i < minRows; i++) {
                itemsRows += `
                    <tr>
                        <td style="text-align: center; color: transparent;">${i + 1}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                `;
            }
        }

        const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Etiqueta e Declaração - Pedido #RL-${order.id}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #000000;
        }
        
        /* 1. SHIPPING LABEL STYLES */
        .label-card {
            border: 3px solid #000000;
            padding: 24px;
            max-width: 480px;
            margin: 40px auto;
            border-radius: 8px;
            box-sizing: border-box;
        }
        .label-header {
            border-bottom: 3px dashed #000000;
            padding-bottom: 12px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .store-title {
            font-weight: 800;
            font-size: 1.3rem;
            letter-spacing: 0.5px;
        }
        .order-tag {
            font-size: 1.1rem;
            font-weight: 800;
            background-color: #000000;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 4px;
        }
        .label-section {
            margin-bottom: 24px;
        }
        .label-section-title {
            font-weight: 800;
            text-transform: uppercase;
            font-size: 0.85rem;
            margin-bottom: 8px;
            letter-spacing: 1px;
            border-bottom: 1px solid #000000;
            padding-bottom: 3px;
        }
        .recipient-info {
            font-size: 1.05rem;
            line-height: 1.5;
        }
        .recipient-name {
            font-size: 1.25rem;
            font-weight: 800;
            margin-bottom: 6px;
        }
        .cep-display {
            font-size: 1.4rem;
            font-weight: 900;
            margin-top: 12px;
            background-color: #f0f0f0;
            padding: 6px 12px;
            display: inline-block;
            border: 1px solid #000000;
            border-radius: 4px;
        }
        .sender-info {
            font-size: 0.9rem;
            line-height: 1.4;
            color: #333333;
        }
        .label-footer {
            border-top: 3px dashed #000000;
            padding-top: 12px;
            margin-top: 20px;
            font-size: 0.8rem;
            text-align: center;
            font-weight: 600;
            text-transform: uppercase;
        }

        /* 2. DECLARATION OF CONTENT STYLES */
        .decl-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 15px;
            box-sizing: border-box;
            font-size: 10px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .header-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }
        .decl-title {
            font-size: 14px;
            font-weight: bold;
        }
        .section-header {
            background-color: #f2f2f2;
            font-weight: bold;
            text-transform: uppercase;
            padding: 4px 8px;
            border: 1px solid #000;
            border-top: none;
            font-size: 10px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .info-table td {
            border: 1px solid #000;
            padding: 6px;
            vertical-align: top;
        }
        .goods-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .goods-table th, .goods-table td {
            border: 1px solid #000;
            padding: 6px;
            font-size: 9px;
        }
        .goods-table th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }
        .declaration-text {
            border: 1px solid #000;
            padding: 10px;
            line-height: 1.5;
            margin-bottom: 15px;
            text-align: justify;
        }
        .signature-box {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .signature-line {
            width: 45%;
            border-top: 1px solid #000;
            text-align: center;
            padding-top: 5px;
            margin-top: 30px;
        }

        /* 3. PRINT & PAGE BREAK SYSTEM */
        .page-break {
            page-break-before: always;
            break-before: page;
        }

        @media print {
            body { padding: 0; }
            .label-card {
                border: 3px solid #000000;
                margin-top: 0;
                page-break-inside: avoid;
            }
            .decl-container {
                border: 1px solid #000;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <!-- PAGE 1: SHIPPING LABEL -->
    <div class="label-card">
        <div class="label-header">
            <span class="store-title">RAVILAR UTILIDADES</span>
            <span class="order-tag">#RL-${order.id}</span>
        </div>
        
        <div class="label-section">
            <div class="label-section-title">Destinatário</div>
            <div class="recipient-info">
                <div class="recipient-name">${order.client_name}</div>
                <div>${order.street}, nº ${order.number} ${order.complement ? '- ' + order.complement : ''}</div>
                <div>Bairro: ${order.neighborhood}</div>
                <div>${order.city} - ${order.uf}</div>
                <div class="cep-display">CEP: ${order.cep || 'Não informado'}</div>
                <div style="font-size: 0.9rem; margin-top: 8px; font-weight: 600;">Contato: ${order.client_phone}</div>
            </div>
        </div>
        
        <div class="label-section">
            <div class="label-section-title">Remetente</div>
            <div class="sender-info">
                <strong>RaviLar Utilidades</strong><br>
                Rua Altino Arantes, nº 908 - Centro<br>
                Santa Adélia - SP - CEP: 15950-000<br>
                Contato: (17) 99637-1743
            </div>
        </div>
        
        <div class="label-footer">
            Declaração de Conteúdo Anexa à Caixa
        </div>
    </div>

    <!-- PAGE BREAK -->
    <div class="page-break"></div>

    <!-- PAGE 2: DECLARATION OF CONTENT -->
    <div class="decl-container">
        <table class="header-table">
            <tr>
                <td style="width: 25%;"><strong style="font-size: 14px;">CORREIOS</strong></td>
                <td style="width: 50%;"><span class="decl-title">DECLARAÇÃO DE CONTEÚDO</span></td>
                <td style="width: 25%;">
                    <strong>Nº DO PEDIDO:</strong><br>
                    <span style="font-size: 12px; font-weight: bold;">#RL-${order.id}</span>
                </td>
            </tr>
        </table>
        
        <div class="section-header">1. Remetente</div>
        <table class="info-table">
            <tr>
                <td style="width: 60%;"><strong>NOME:</strong> RaviLar Utilidades</td>
                <td style="width: 40%;"><strong>CPF/CNPJ:</strong> 37.492.355/0001-92</td>
            </tr>
            <tr>
                <td colspan="2"><strong>ENDEREÇO:</strong> Rua Altino Arantes, nº 908 - Centro</td>
            </tr>
            <tr>
                <td><strong>CIDADE:</strong> Santa Adélia</td>
                <td><strong>UF:</strong> SP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>CEP:</strong> 15950-000</td>
            </tr>
        </table>
        
        <div class="section-header">2. Destinatário</div>
        <table class="info-table">
            <tr>
                <td style="width: 60%;"><strong>NOME:</strong> ${order.client_name}</td>
                <td style="width: 40%;"><strong>CPF/CNPJ:</strong> (Não Informado)</td>
            </tr>
            <tr>
                <td colspan="2"><strong>ENDEREÇO:</strong> ${order.street}, nº ${order.number} ${order.complement ? '- ' + order.complement : ''} - Bairro: ${order.neighborhood}</td>
            </tr>
            <tr>
                <td><strong>CIDADE:</strong> ${order.city}</td>
                <td><strong>UF:</strong> ${order.uf} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>CEP:</strong> ${order.cep || 'Não informado'}</td>
            </tr>
        </table>
        
        <div class="section-header">3. Identificação dos Bens</div>
        <table class="goods-table">
            <thead>
                <tr>
                    <th style="width: 5%;">ITEM</th>
                    <th style="width: 50%;">CONTEÚDO</th>
                    <th style="width: 8%;">UNID.</th>
                    <th style="width: 9%;">QTD.</th>
                    <th style="width: 14%;">VALOR UNIT.</th>
                    <th style="width: 14%;">VALOR TOTAL</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRows}
                <tr style="font-weight: bold; background-color: #f9f9f9;">
                    <td colspan="3" style="text-align: right;">TOTAIS:</td>
                    <td style="text-align: center;">${totalQty}</td>
                    <td></td>
                    <td style="text-align: right;">R$ ${totalValue.toFixed(2).replace('.', ',')}</td>
                </tr>
            </tbody>
        </table>
        
        <div class="declaration-text">
            <strong>DECLARAÇÃO:</strong><br>
            Declaro sob as penas da lei que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, 
            uma vez que não realizo, com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria, 
            ainda que se iniciem no exterior, ou prestações de serviços de transporte interestadual e intermunicipal e de comunicação. 
            Declaro ainda que o conteúdo descrito nesta declaração corresponde exatamente ao que está sendo enviado, assumindo total 
            responsabilidade civil e criminal por qualquer informação incorreta ou falsa.
        </div>
        
        <div style="font-size: 9px; margin-bottom: 20px;">
            <strong>DATA:</strong> Santa Adélia - SP, ${dateStr}
        </div>
        
        <div class="signature-box">
            <div class="signature-line">
                Assinatura do Declarante / Remetente
            </div>
            <div class="signature-line" style="border-top: none; padding-top: 15px;">
                * Documento isento de assinatura se impresso via sistema autorizado.
            </div>
        </div>
    </div>
    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    </script>
</body>
</html>
        `;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

    } catch (e) {
        showToast("Erro ao carregar documentos de envio: " + e.message, "error");
    }
}

// Function to print entire order receipt
async function printEntireOrder(orderId) {
    const order = escapeOrder(adminOrders.find(o => o.id == orderId));
    if (!order) return;

    try {
        // Fetch items for the order
        const { data: items, error } = await supabaseClient
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);

        if (error) throw error;

        const dateStr = new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        const printWindow = window.open("", "_blank", "width=800,height=900");
        if (!printWindow) {
            showToast("Erro ao abrir janela de impressão.", "error");
            return;
        }

        let itemsHtml = "";
        items.forEach(item => {
            itemsHtml += `
                <tr>
                    <td>${escapeHTML(item.product_name)}</td>
                    <td style="text-align: right;">R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right; font-weight: bold;">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</td>
                </tr>
            `;
        });

        const printDiscount = parseFloat(order.discount_amount || 0);
        const printSubtotal = order.subtotal !== undefined && order.subtotal !== null
            ? parseFloat(order.subtotal)
            : (order.total_amount - order.shipping_fee);
        
        let printDiscountHtml = "";
        if (printDiscount > 0) {
            printDiscountHtml = `
            <tr>
                <td style="color: #48BB78; font-weight: 600;">Desconto ${order.coupon_code ? '(' + order.coupon_code + ')' : ''}:</td>
                <td style="text-align: right; color: #48BB78; font-weight: 600;">- R$ ${printDiscount.toFixed(2).replace('.', ',')}</td>
            </tr>
            `;
        }

        const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Comprovante de Pedido #RL-${order.id}</title>
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 30px;
            background-color: #ffffff;
            color: #333333;
        }
        .receipt-container {
            max-width: 750px;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000000;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .store-info h1 {
            margin: 0 0 5px 0;
            font-size: 1.6rem;
            color: #1A365D;
            font-weight: 800;
        }
        .store-info p {
            margin: 0;
            font-size: 0.85rem;
            color: #666;
        }
        .order-title {
            text-align: right;
        }
        .order-title h2 {
            margin: 0 0 5px 0;
            font-size: 1.4rem;
            color: #000;
            font-weight: 800;
        }
        .order-title p {
            margin: 0;
            font-size: 0.85rem;
            color: #666;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 30px;
        }
        .details-box {
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 6px;
            background-color: #f9f9f9;
        }
        .details-box h3 {
            margin: 0 0 10px 0;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #1A365D;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .details-box p {
            margin: 5px 0;
            font-size: 0.88rem;
            line-height: 1.4;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            font-size: 0.9rem;
        }
        th {
            background-color: #f1f1f1;
            font-weight: bold;
            color: #1A365D;
        }
        .totals-table {
            width: 300px;
            margin-left: auto;
            margin-bottom: 30px;
        }
        .totals-table td {
            border-bottom: none;
            padding: 6px 12px;
        }
        .totals-table tr.grand-total td {
            border-top: 2px solid #000;
            font-size: 1.1rem;
            font-weight: bold;
            color: #1A365D;
            padding-top: 10px;
        }
        .footer {
            border-top: 1px solid #ddd;
            padding-top: 15px;
            text-align: center;
            font-size: 0.85rem;
            color: #777;
            margin-top: 50px;
        }
        @media print {
            body { padding: 0; }
            .details-box { background-color: #f9f9f9 !important; -webkit-print-color-adjust: exact; }
            th { background-color: #f1f1f1 !important; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <div class="store-info">
                <h1>RaviLar Utilidades</h1>
                <p>ravilarutilidades@gmail.com | (17) 99637-1743</p>
            </div>
            <div class="order-title">
                <h2>Pedido #RL-${order.id}</h2>
                <p>Data: ${dateStr}</p>
            </div>
        </div>
        
        <div class="details-grid">
            <div class="details-box">
                <h3>Dados do Cliente</h3>
                <p><strong>Nome:</strong> ${order.client_name}</p>
                <p><strong>WhatsApp:</strong> ${order.client_phone}</p>
                <p><strong>E-mail:</strong> ${order.client_email || 'Não informado'}</p>
                <p><strong>Pagamento:</strong> ${order.payment_method} (${order.payment_status})</p>
                <p><strong>Status do Pedido:</strong> ${order.status}</p>
            </div>
            
            <div class="details-box">
                <h3>Endereço de Entrega</h3>
                <p><strong>Rua/Av:</strong> ${order.street}, nº ${order.number}</p>
                <p><strong>Bairro:</strong> ${order.neighborhood}</p>
                <p><strong>Cidade:</strong> ${order.city} - ${order.uf}</p>
                <p><strong>CEP:</strong> ${order.cep || 'Não informado'}</p>
                <p><strong>Complemento:</strong> ${order.complement || 'Não informado'}</p>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Item / Produto</th>
                    <th style="text-align: right; width: 120px;">Unitário</th>
                    <th style="text-align: center; width: 60px;">Qtd</th>
                    <th style="text-align: right; width: 120px;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
        
        <table class="totals-table">
            <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">R$ ${printSubtotal.toFixed(2).replace('.', ',')}</td>
            </tr>
            <tr>
                <td>Frete (${order.shipping_method}):</td>
                <td style="text-align: right;">${order.shipping_fee === 0 ? 'Grátis' : 'R$ ' + order.shipping_fee.toFixed(2).replace('.', ',')}</td>
            </tr>
            ${printDiscountHtml}
            <tr class="grand-total">
                <td>Total Geral:</td>
                <td style="text-align: right;">R$ ${order.total_amount.toFixed(2).replace('.', ',')}</td>
            </tr>
        </table>
        
        <div class="footer">
            Obrigado por sua compra! RaviLar Utilidades agradece a preferência.
        </div>
    </div>
    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    </script>
</body>
</html>
        `;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

    } catch (e) {
        showToast("Erro ao carregar itens do pedido para impressão: " + e.message, "error");
    }
}

async function openAdminOrderDetails(orderId) {
    if (!supabaseClient) return;
    try {
        const order = escapeOrder(adminOrders.find(o => o.id == orderId));
        if (!order) return;

        currentAdminOrder = order;

        // Fetch items
        const { data: items, error } = await supabaseClient
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);

        if (error) throw error;

        // Populate customer block
        document.getElementById("admin-order-modal-title").textContent = `Detalhes do Pedido #RL-${order.id}`;
        document.getElementById("admin-order-customer-details").innerHTML = `
            <strong>Nome:</strong> ${order.client_name}<br>
            <strong>WhatsApp:</strong> ${order.client_phone}<br>
            <strong>E-mail:</strong> ${order.client_email || 'Não informado'}
        `;

        // Populate delivery block
        document.getElementById("admin-order-delivery-address").innerHTML = `
            ${order.street}, nº ${order.number} ${order.complement ? '- ' + order.complement : ''}<br>
            Bairro: ${order.neighborhood}<br>
            ${order.city} - ${order.uf}
        `;

        // Select active status dropdown
        document.getElementById("admin-order-status-select").value = order.status;

        // Set tracking code and show/hide its field container
        const trackingInput = document.getElementById("admin-order-tracking-input");
        const trackingContainer = document.getElementById("admin-tracking-code-container");
        if (trackingInput && trackingContainer) {
            trackingInput.value = order.tracking_code || "";
            if (order.status === "Em Transporte") {
                trackingContainer.style.display = "block";
            } else {
                trackingContainer.style.display = "none";
            }
        }

        // Populate totals
        const discount = parseFloat(order.discount_amount || 0);
        const subtotal = order.subtotal !== undefined && order.subtotal !== null
            ? parseFloat(order.subtotal)
            : (order.total_amount - order.shipping_fee);
        document.getElementById("admin-order-modal-subtotal").textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
        const labelEl = document.getElementById("admin-order-modal-shipping-label");
        if (labelEl) {
            labelEl.textContent = order.shipping_method ? `Frete (${order.shipping_method})` : "Frete";
        }
        document.getElementById("admin-order-modal-shipping").textContent = order.shipping_fee === 0 ? "Grátis" : `R$ ${order.shipping_fee.toFixed(2).replace('.', ',')}`;

        const discountRow = document.getElementById("admin-order-modal-discount-row");
        const discountVal = document.getElementById("admin-order-modal-discount");
        const discountLabel = document.getElementById("admin-order-modal-discount-label");
        if (discountRow && discountVal) {
            if (discount > 0) {
                discountRow.style.display = "flex";
                discountVal.textContent = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
                if (discountLabel && order.coupon_code) {
                    discountLabel.textContent = `Desconto (Cupom: ${order.coupon_code})`;
                } else if (discountLabel) {
                    discountLabel.textContent = "Desconto";
                }
            } else {
                discountRow.style.display = "none";
            }
        }

        document.getElementById("admin-order-modal-total").textContent = `R$ ${order.total_amount.toFixed(2).replace('.', ',')}`;

        // Populate items table
        const tbody = document.getElementById("admin-order-items-tbody");
        tbody.innerHTML = "";

        items.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${escapeHTML(item.product_name)}</td>
                <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                <td>${item.quantity}</td>
                <td><strong>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</strong></td>
            `;
            tbody.appendChild(tr);
        });

        // Show Modal
        document.getElementById("admin-order-modal").classList.add("open");

    } catch (e) {
        showToast("Erro ao carregar detalhes do pedido: " + e.message, "error");
    }
}

async function saveAdminOrderStatus() {
    if (!supabaseClient || !currentAdminOrder) return;
    
    const newStatus = document.getElementById("admin-order-status-select").value;
    const trackingCode = document.getElementById("admin-order-tracking-input").value.trim();
    
    try {
        const updateData = { status: newStatus };
        
        // Save tracking code if Em Transporte (or if it's already filled, keep it)
        updateData.tracking_code = trackingCode || null;

        const { error } = await supabaseClient
            .from("orders")
            .update(updateData)
            .eq("id", currentAdminOrder.id);

        if (error) throw error;

        // Close Modal and reload
        document.getElementById("admin-order-modal").classList.remove("open");
        await loadAdminOrders();
        showToast(`Status do pedido #RL-${currentAdminOrder.id} alterado para "${newStatus}"!`, "success");
    } catch (e) {
        showToast("Erro ao salvar status: " + e.message, "error");
    }
}

// ==========================================================================
// STORE CONFIGURATION & SHIPPING RULES
// ==========================================================================

async function loadStoreSettings() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("store_settings")
            .select("*");
        
        if (error) {
            // If table doesn't exist yet, we'll get an error
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.warn("Tabela 'store_settings' não encontrada.");
                return;
            }
            throw error;
        }

        storeSettings = {};
        if (data) {
            data.forEach(item => {
                storeSettings[item.key] = item.value;
            });
        }

        // Populate fields
        const defaultShipping = document.getElementById("admin-setting-default-shipping");
        const freeShippingMin = document.getElementById("admin-setting-free-shipping-min");
        const originCep = document.getElementById("admin-setting-origin-cep");
        const meToken = document.getElementById("admin-setting-me-token");
        const meSandbox = document.getElementById("admin-setting-me-sandbox");

        if (defaultShipping) {
            defaultShipping.value = parseFloat(storeSettings['default_shipping_fee'] || 15.00);
        }
        if (freeShippingMin) {
            freeShippingMin.value = parseFloat(storeSettings['free_shipping_min_amount'] || 150.00);
        }
        if (originCep) {
            const rawCep = storeSettings['origin_cep'] || "17996371";
            if (rawCep.length === 8) {
                originCep.value = rawCep.slice(0, 5) + "-" + rawCep.slice(5);
            } else {
                originCep.value = rawCep;
            }
        }
        if (meToken) {
            meToken.value = storeSettings['melhor_envio_token'] || "";
        }
        if (meSandbox) {
            meSandbox.checked = storeSettings['melhor_envio_sandbox'] === 'true';
        }

        const socialInstagram = document.getElementById("admin-setting-social-instagram");
        const socialFacebook = document.getElementById("admin-setting-social-facebook");
        if (socialInstagram) socialInstagram.value = storeSettings['social_instagram'] || "";
        if (socialFacebook) socialFacebook.value = storeSettings['social_facebook'] || "";
    } catch (e) {
        showToast("Erro ao carregar configurações: " + e.message, "error");
    }

    // Atualiza o rodapé do panfleto (redes sociais podem ter mudado)
    renderFlyerFooterInfo();
}

async function saveStoreSettings(e) {
    e.preventDefault();
    if (!supabaseClient) return;
    
    const defaultShipping = parseFloat(document.getElementById("admin-setting-default-shipping").value);
    const freeShippingMin = parseFloat(document.getElementById("admin-setting-free-shipping-min").value);
    const originCep = document.getElementById("admin-setting-origin-cep").value.trim().replace(/\D/g, "");
    const meToken = document.getElementById("admin-setting-me-token").value.trim();
    const meSandbox = document.getElementById("admin-setting-me-sandbox").checked ? 'true' : 'false';
    const socialInstagram = (document.getElementById("admin-setting-social-instagram")?.value || "").trim();
    const socialFacebook = (document.getElementById("admin-setting-social-facebook")?.value || "").trim();

    try {
        const { error: err1 } = await supabaseClient
            .from("store_settings")
            .upsert([
                { key: 'default_shipping_fee', value: defaultShipping.toString() },
                { key: 'free_shipping_min_amount', value: freeShippingMin.toString() },
                { key: 'origin_cep', value: originCep },
                { key: 'melhor_envio_token', value: meToken },
                { key: 'melhor_envio_sandbox', value: meSandbox },
                { key: 'social_instagram', value: socialInstagram },
                { key: 'social_facebook', value: socialFacebook }
            ]);

        if (err1) throw err1;

        showToast("Configurações da loja salvas com sucesso!", "success");
        await loadStoreSettings();
    } catch (e) {
        showToast("Erro ao salvar configurações: " + e.message, "error");
    }
}

async function loadShippingRules() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("shipping_rules")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                console.warn("Tabela 'shipping_rules' não encontrada.");
                return;
            }
            throw error;
        }

        shippingRules = data || [];
        renderShippingRulesTable();
    } catch (e) {
        showToast("Erro ao carregar regras de frete: " + e.message, "error");
    }
}

function renderShippingRulesTable() {
    if (!shippingRulesTableBody) return;
    shippingRulesTableBody.innerHTML = "";

    if (shippingRules.length === 0) {
        shippingRulesTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    Nenhuma regra de frete por CEP cadastrada.
                </td>
            </tr>
        `;
        return;
    }

    shippingRules.forEach(rule => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${rule.name}</strong></td>
            <td><code>${rule.cep_prefix}</code></td>
            <td>R$ ${parseFloat(rule.price).toFixed(2).replace('.', ',')}</td>
            <td style="text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button class="btn-action btn-action-edit btn-action-edit-rule" data-id="${rule.id}" title="Editar Regra">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn-action btn-action-delete btn-action-delete-rule" data-id="${rule.id}" title="Excluir Regra">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        shippingRulesTableBody.appendChild(tr);
    });

    bindShippingRulesActionEvents();
}

function bindShippingRulesActionEvents() {
    const editBtns = shippingRulesTableBody.querySelectorAll(".btn-action-edit-rule");
    editBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const rule = shippingRules.find(r => r.id.toString() === id.toString());
            if (rule) openShippingRuleModal(rule);
        });
    });

    const deleteBtns = shippingRulesTableBody.querySelectorAll(".btn-action-delete-rule");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteShippingRule(id);
        });
    });
}

function openShippingRuleModal(rule = null) {
    if (!shippingRuleModal) return;
    
    const modalTitle = document.getElementById("shipping-rule-modal-title");
    const ruleIdInput = document.getElementById("admin-shipping-rule-id");
    const ruleNameInput = document.getElementById("admin-rule-name");
    const ruleCepPrefixInput = document.getElementById("admin-rule-cep-prefix");
    const rulePriceInput = document.getElementById("admin-rule-price");

    if (rule) {
        modalTitle.textContent = "Editar Regra de Frete";
        ruleIdInput.value = rule.id;
        ruleNameInput.value = rule.name;
        ruleCepPrefixInput.value = rule.cep_prefix;
        rulePriceInput.value = parseFloat(rule.price);
    } else {
        modalTitle.textContent = "Cadastrar Nova Regra de Frete";
        ruleIdInput.value = "";
        ruleNameInput.value = "";
        ruleCepPrefixInput.value = "";
        rulePriceInput.value = "";
    }

    shippingRuleModal.style.display = "flex";
}

async function saveShippingRule(e) {
    e.preventDefault();
    if (!supabaseClient) return;

    const ruleId = document.getElementById("admin-shipping-rule-id").value;
    const name = document.getElementById("admin-rule-name").value.trim();
    const cepPrefix = document.getElementById("admin-rule-cep-prefix").value.trim().replace(/\D/g, "");
    const price = parseFloat(document.getElementById("admin-rule-price").value);

    if (!name || !cepPrefix || isNaN(price)) {
        showToast("Por favor, preencha todos os campos corretamente.", "warning");
        return;
    }

    try {
        const payload = { name, cep_prefix: cepPrefix, price };
        let resError;

        if (ruleId) {
            // Update
            const { error } = await supabaseClient
                .from("shipping_rules")
                .update(payload)
                .eq("id", ruleId);
            resError = error;
        } else {
            // Insert
            const { error } = await supabaseClient
                .from("shipping_rules")
                .insert(payload);
            resError = error;
        }

        if (resError) {
            if (resError.message.includes("unique_violation") || resError.message.includes("duplicate key")) {
                throw new Error("Este prefixo de CEP já possui uma regra cadastrada.");
            }
            throw resError;
        }

        shippingRuleModal.style.display = "none";
        showToast("Regra de frete salva com sucesso!", "success");
        await loadShippingRules();
    } catch (e) {
        showToast("Erro ao salvar regra: " + e.message, "error");
    }
}

async function deleteShippingRule(id) {
    const ok = await showConfirm("Tem certeza que deseja excluir esta regra de frete?");
    if (!ok) return;
    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from("shipping_rules")
            .delete()
            .eq("id", id);

        if (error) throw error;

        showToast("Regra de frete excluída com sucesso!", "success");
        await loadShippingRules();
    } catch (e) {
        showToast("Erro ao excluir regra: " + e.message, "error");
    }
}

// ==========================================================================
// COUPON MANAGEMENT LOGIC
// ==========================================================================

let coupons = [];

async function loadCoupons() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        coupons = data || [];
        renderCouponsTable();
    } catch (e) {
        showToast("Erro ao carregar cupons: " + e.message, "error");
    }
}

function renderCouponsTable() {
    const tableBody = document.getElementById("coupons-table-body");
    if (!tableBody) return;

    const query = document.getElementById("coupon-table-search")?.value.toLowerCase().trim() || "";

    const filtered = coupons.filter(c => {
        return c.code.toLowerCase().includes(query);
    });

    tableBody.innerHTML = "";

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 25px;">Nenhum cupom cadastrado ou encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${escapeHTML(c.code)}</strong></td>
            <td>${c.type === "percentage" ? "Porcentagem (%)" : "Fixo (R$)"}</td>
            <td>${c.type === "percentage" ? `${c.value}%` : `R$ ${parseFloat(c.value).toFixed(2)}`}</td>
            <td>R$ ${parseFloat(c.min_purchase).toFixed(2)}</td>
            <td>
                <span class="badge ${c.is_active ? "badge-success" : "badge-danger"}" style="padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; background-color: ${c.is_active ? "#48BB78" : "#E53E3E"}; color: white;">
                    ${c.is_active ? "Ativo" : "Inativo"}
                </span>
            </td>
            <td>
                <div class="admin-table-actions" style="display: flex; gap: 8px;">
                    <button class="btn-action-edit-coupon btn btn-sm btn-outline" title="Editar Cupom">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-action-delete-coupon btn btn-sm btn-outline btn-danger" title="Excluir Cupom">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;

        row.querySelector(".btn-action-edit-coupon").addEventListener("click", () => editCoupon(c.id));
        row.querySelector(".btn-action-delete-coupon").addEventListener("click", () => deleteCoupon(c.id, c.code));

        tableBody.appendChild(row);
    });
}

async function submitCouponForm(e) {
    e.preventDefault();
    if (!supabaseClient) return;

    const id = document.getElementById("coupon-id-field").value;
    const code = document.getElementById("coupon-code").value.toUpperCase().trim();
    const type = document.getElementById("coupon-type").value;
    const value = parseFloat(document.getElementById("coupon-value").value);
    const minPurchase = parseFloat(document.getElementById("coupon-min-purchase").value || 0);
    const isActive = document.getElementById("coupon-active").value === "true";
    const maxUsesStr = document.getElementById("coupon-max-uses-per-client").value;
    const maxUses = maxUsesStr ? parseInt(maxUsesStr) : null;

    if (!code) {
        showToast("Por favor, digite o código do cupom.", "warning");
        return;
    }
    if (isNaN(value) || value <= 0) {
        showToast("Por favor, digite um valor de desconto válido.", "warning");
        return;
    }

    const payload = {
        code,
        type,
        value,
        min_purchase: minPurchase,
        is_active: isActive,
        max_uses_per_client: maxUses
    };

    try {
        let resError = null;

        if (id) {
            // Edit mode
            const { error } = await supabaseClient
                .from("coupons")
                .update(payload)
                .eq("id", id);
            resError = error;
        } else {
            // New mode
            const { error } = await supabaseClient
                .from("coupons")
                .insert(payload);
            resError = error;
        }

        if (resError) {
            if (resError.message.includes("unique_violation") || resError.message.includes("duplicate key")) {
                throw new Error("Já existe um cupom cadastrado com este código.");
            }
            throw resError;
        }

        showToast("Cupom salvo com sucesso!", "success");
        resetCouponFormMode();
        await loadCoupons();
    } catch (e) {
        showToast("Erro ao salvar cupom: " + e.message, "error");
    }
}

function editCoupon(id) {
    const c = coupons.find(item => item.id == id);
    if (!c) return;

    document.getElementById("coupon-id-field").value = c.id;
    document.getElementById("coupon-code").value = c.code;
    document.getElementById("coupon-type").value = c.type;
    document.getElementById("coupon-value").value = c.value;
    document.getElementById("coupon-min-purchase").value = c.min_purchase;
    document.getElementById("coupon-active").value = String(c.is_active);
    document.getElementById("coupon-max-uses-per-client").value = c.max_uses_per_client !== null && c.max_uses_per_client !== undefined ? String(c.max_uses_per_client) : "";

    document.getElementById("coupon-form-title").textContent = "Editar Cupom: " + c.code;
    document.getElementById("coupon-submit-btn").textContent = "Salvar Alterações";
    document.getElementById("coupon-cancel-btn").style.display = "inline-block";
}

async function deleteCoupon(id, code) {
    const ok = await showConfirm(`Tem certeza que deseja excluir o cupom ${code}?`);
    if (!ok) return;
    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from("coupons")
            .delete()
            .eq("id", id);

        if (error) throw error;

        showToast("Cupom excluído com sucesso!", "success");
        await loadCoupons();
    } catch (e) {
        showToast("Erro ao excluir cupom: " + e.message, "error");
    }
}

function resetCouponFormMode() {
    const form = document.getElementById("admin-coupon-form");
    if (form) form.reset();
    document.getElementById("coupon-id-field").value = "";
    document.getElementById("coupon-max-uses-per-client").value = "";
    document.getElementById("coupon-form-title").textContent = "Cadastrar Novo Cupom";
    document.getElementById("coupon-submit-btn").textContent = "Salvar Cupom";
    document.getElementById("coupon-cancel-btn").style.display = "none";
}

async function handleDeleteAdminOrder() {
    if (!supabaseClient || !currentAdminOrder) return;

    const ok = await showConfirm(`ATENÇÃO: Você tem certeza que deseja EXCLUIR DEFINITIVAMENTE o pedido #RL-${currentAdminOrder.id}? Esta ação não pode ser desfeita e removerá todos os registros associados.`);
    if (!ok) return;

    try {
        const { error } = await supabaseClient
            .from("orders")
            .delete()
            .eq("id", currentAdminOrder.id);

        if (error) throw error;

        showToast(`Pedido #RL-${currentAdminOrder.id} excluído com sucesso!`, "success");
        
        const modal = document.getElementById("admin-order-modal");
        if (modal) modal.classList.remove("open");
        
        await loadAdminOrders();
    } catch (e) {
        showToast("Erro ao excluir pedido: " + e.message, "error");
    }
}

// ==========================================================================
// PRODUCTS IMPORT & EXPORT LOGIC (CSV / EXCEL)
// ==========================================================================

async function handleExportProducts() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            showToast("Nenhum produto encontrado no catálogo para exportar.", "warning");
            return;
        }

        exportProductsToCSV(data);
        showToast("Catálogo de produtos exportado com sucesso!", "success");
    } catch (e) {
        showToast("Erro ao exportar produtos: " + e.message, "error");
    }
}

function exportProductsToCSV(products) {
    const headers = ["id", "name", "category", "price", "image_urls", "description", "badge", "rating", "reviews", "variations"];
    const separator = ";"; // Ponto-e-vírgula para compatibilidade nativa com Excel em português
    
    const rows = products.map(p => {
        const id = p.id || "";
        const name = `"${(p.name || "").replace(/"/g, '""')}"`;
        const category = `"${(p.category || "").replace(/"/g, '""')}"`;
        
        // Exportar preço no formato de vírgula decimal brasileiro (ex: 49,90) para o Excel reconhecer como número direto
        const priceStr = p.price ? p.price.toFixed(2).replace(".", ",") : "0,00";
        const price = `"${priceStr}"`;
        
        let urls = [];
        if (p.image) {
            try {
                if (typeof p.image === "string" && p.image.startsWith("[")) {
                    urls = JSON.parse(p.image);
                } else if (Array.isArray(p.image)) {
                    urls = p.image;
                } else {
                    urls = [p.image];
                }
            } catch(e) {
                urls = [p.image];
            }
        }
        const imageUrlsStr = `"${urls.join('|').replace(/"/g, '""')}"`;
        const description = `"${(p.description || "").replace(/"/g, '""')}"`;
        const badge = `"${(p.badge || "").replace(/"/g, '""')}"`;
        
        const ratingStr = p.rating ? p.rating.toString().replace(".", ",") : "5,0";
        const rating = `"${ratingStr}"`;
        const reviews = p.reviews || 0;

        // Variações em JSON (vazio quando o produto não tem)
        let variationsJson = "";
        const varData = parseVariationsField(p.variations);
        if (varData) {
            variationsJson = JSON.stringify(varData);
        }
        const variations = `"${variationsJson.replace(/"/g, '""')}"`;

        return [id, name, category, price, imageUrlsStr, description, badge, rating, reviews, variations].join(separator);
    });
    
    const csvContent = "\uFEFF" + [headers.join(separator), ...rows].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `produtos_ravilar_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

async function handleImportProducts(file) {
    if (!supabaseClient) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target.result;
            
            // Detectar separador automaticamente (vírgula ou ponto-e-vírgula)
            const firstLine = text.split("\n")[0];
            const separator = firstLine.includes(";") ? ";" : ",";
            
            const parsedLines = parseCSV(text, separator);
            if (parsedLines.length < 2) {
                showToast("Arquivo CSV inválido ou vazio.", "error");
                return;
            }
            
            const headers = parsedLines[0].map(h => h.trim().toLowerCase());
            const idIdx = headers.indexOf("id");
            const nameIdx = headers.indexOf("name");
            const categoryIdx = headers.indexOf("category");
            const priceIdx = headers.indexOf("price");
            const imageUrlsIdx = headers.indexOf("image_urls");
            const descIdx = headers.indexOf("description");
            const badgeIdx = headers.indexOf("badge");
            const ratingIdx = headers.indexOf("rating");
            const reviewsIdx = headers.indexOf("reviews");
            const variationsIdx = headers.indexOf("variations");
            
            if (nameIdx === -1 || categoryIdx === -1 || priceIdx === -1 || descIdx === -1) {
                showToast("Colunas obrigatórias não encontradas no CSV (name, category, price, description).", "error");
                return;
            }
            
            const productsToUpsert = [];
            
            for (let i = 1; i < parsedLines.length; i++) {
                const row = parsedLines[i];
                if (row.length < 4 || !row[nameIdx]) continue;
                
                const product = {
                    name: row[nameIdx],
                    category: row[categoryIdx],
                    price: parsePrice(row[priceIdx]),
                    description: row[descIdx],
                    badge: badgeIdx !== -1 && row[badgeIdx] ? row[badgeIdx] : null,
                    rating: ratingIdx !== -1 && row[ratingIdx] ? parsePrice(row[ratingIdx]) : 5.0,
                    reviews: reviewsIdx !== -1 && row[reviewsIdx] ? parseInt(row[reviewsIdx]) : 0
                };
                
                if (idIdx !== -1 && row[idIdx]) {
                    product.id = parseInt(row[idIdx]);
                }
                
                let urls = [];
                if (imageUrlsIdx !== -1 && row[imageUrlsIdx]) {
                    urls = row[imageUrlsIdx].split('|').map(u => u.trim()).filter(Boolean);
                }
                product.image = JSON.stringify(urls);

                // Variações (coluna opcional com JSON)
                if (variationsIdx !== -1) {
                    const rawVar = (row[variationsIdx] || "").trim();
                    if (rawVar) {
                        try {
                            const parsedVar = JSON.parse(rawVar);
                            product.variations = (parsedVar && Array.isArray(parsedVar.options) && parsedVar.options.length > 0) ? parsedVar : null;
                        } catch (e) {
                            product.variations = null;
                        }
                    } else {
                        product.variations = null;
                    }
                }

                productsToUpsert.push(product);
            }
            
            if (productsToUpsert.length === 0) {
                showToast("Nenhum produto válido encontrado no CSV.", "warning");
                return;
            }
            
            const confirmImport = await showConfirm(`Deseja realmente importar/atualizar ${productsToUpsert.length} produtos no seu catálogo?`);
            if (!confirmImport) return;
            
            const { error } = await supabaseClient
                .from("products")
                .upsert(productsToUpsert, { onConflict: "id" });
                
            if (error) throw error;
            
            showToast(`${productsToUpsert.length} produtos importados/atualizados com sucesso!`, "success");
            await loadProducts();
        } catch (err) {
            showToast("Erro ao importar CSV: " + err.message, "error");
        }
    };
    reader.readAsText(file, "UTF-8");
}

function parseCSV(text, separator = ",") {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i+1];
        
        if (c === '"') {
            if (inQuotes && next === '"') {
                row[row.length - 1] += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (c === separator && !inQuotes) {
            row.push('');
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
            if (c === '\r' && next === '\n') i++;
            lines.push(row);
            row = [''];
        } else {
            row[row.length - 1] += c;
        }
    }
    if (row.length > 1 || row[0] !== '') {
        lines.push(row);
    }
    return lines;
}

function parsePrice(val) {
    if (!val) return 0;
    // Remove R$ e espaços
    let clean = val.toString().replace(/R\$\s?/gi, "").trim();
    // Identificar formato brasileiro (ex: 1.250,90 ou 49,90) e converter para float JS padrão (ponto decimal)
    if (clean.includes(",") && !clean.includes(".")) {
        clean = clean.replace(",", ".");
    } else if (clean.includes(",") && clean.includes(".")) {
        clean = clean.replace(/\./g, "").replace(",", ".");
    }
    return parseFloat(clean) || 0;
}
