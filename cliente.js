// Override native alert with custom toast
window.alert = function(message) {
    let type = "success";
    const lowercaseMsg = message.toLowerCase();
    if (lowercaseMsg.includes("erro") || lowercaseMsg.includes("falha") || lowercaseMsg.includes("recusado") || lowercaseMsg.includes("expirou") || lowercaseMsg.includes("limite")) {
        type = "error";
    } else if (lowercaseMsg.includes("precisa") || lowercaseMsg.includes("mínimo") || lowercaseMsg.includes("não") || lowercaseMsg.includes("vazio") || lowercaseMsg.includes("preencha") || lowercaseMsg.includes("obrigat")) {
        type = "warning";
    } else if (lowercaseMsg.includes("copiado") || lowercaseMsg.includes("adicionado")) {
        type = "info";
    }
    
    showToast(message, type);
};

function showToast(message, type = "success") {
    let container = document.getElementById("custom-toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "custom-toast-container";
        container.style.position = "fixed";
        container.style.top = "24px";
        container.style.right = "24px";
        container.style.zIndex = "99999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "12px";
        container.style.maxWidth = "380px";
        container.style.width = "calc(100% - 48px)";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    
    let iconClass = "fa-solid fa-circle-check";
    let iconColor = "#22C55E";
    let borderColor = "#22C55E";
    
    if (type === "success") {
        iconClass = "fa-solid fa-circle-check";
        iconColor = "#22C55E";
        borderColor = "#22C55E";
    } else if (type === "error") {
        iconClass = "fa-solid fa-circle-xmark";
        iconColor = "#EF4444";
        borderColor = "#EF4444";
    } else if (type === "warning") {
        iconClass = "fa-solid fa-circle-exclamation";
        iconColor = "#F59E0B";
        borderColor = "#F59E0B";
    } else if (type === "info") {
        iconClass = "fa-solid fa-circle-info";
        iconColor = "#3B82F6";
        borderColor = "#3B82F6";
    }

    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "14px";
    toast.style.padding = "16px 20px";
    toast.style.backgroundColor = "#FFFFFF";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)";
    toast.style.borderLeft = `4px solid ${borderColor}`;
    toast.style.fontFamily = "'Montserrat', 'Inter', sans-serif";
    toast.style.fontSize = "0.9rem";
    toast.style.fontWeight = "500";
    toast.style.color = "#2D3748";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    toast.style.cursor = "pointer";

    toast.innerHTML = `
        <i class="${iconClass}" style="color: ${iconColor}; font-size: 1.3rem; flex-shrink: 0;"></i>
        <div style="flex: 1; line-height: 1.5;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
    }, 10);

    const dismiss = () => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        setTimeout(() => {
            toast.remove();
        }, 400);
    };

    const timeoutId = setTimeout(dismiss, 5000);

    toast.addEventListener("click", () => {
        clearTimeout(timeoutId);
        dismiss();
    });
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

// ==========================================================================
// SUPABASE CLIENT CONFIGURATION
// ==========================================================================
const supabaseUrl = "https://wbgdyheswfzgxaxvhugv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2R5aGVzd2Z6Z3hheHZodWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mzk1OTIsImV4cCI6MjA5OTUxNTU5Mn0.kvPoOJIoqHPpUfA3PFBPFuQ0yDALS1LOChd2bYCGoMs";

const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// State Variables
let currentUser = null;
let activeTab = "resumo";
let orders = [];
let addresses = [];
let favorites = [];
let myReviews = new Set(); // product_ids que o cliente já avaliou

// DOM Elements
const authSection = document.getElementById("auth-section");
const portalSection = document.getElementById("portal-section");

// Forms Auth
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authTitle = document.getElementById("auth-form-title");
const authSubtitle = document.getElementById("auth-form-subtitle");
const btnToggleAuth = document.getElementById("btn-toggle-auth");
const authToggleText = document.getElementById("auth-toggle-text");

// Portal Sidebar Elements
const userAvatarInitials = document.getElementById("user-avatar-initials");
const userDisplayName = document.getElementById("user-display-name");
const userDisplayEmail = document.getElementById("user-display-email");
const portalNavBtns = document.querySelectorAll(".portal-nav-btn[data-tab]");
const btnPortalLogout = document.getElementById("btn-portal-logout");

// Portal Tabs Content Containers
const tabContents = document.querySelectorAll(".portal-tab-content");

// Summary Tab Elements
const summaryTotalOrders = document.getElementById("summary-total-orders");
const summaryTotalFavorites = document.getElementById("summary-total-favorites");
const summaryTotalAddresses = document.getElementById("summary-total-addresses");
const summaryLastOrderBox = document.getElementById("summary-last-order-box");

// Orders Tab Elements
const portalOrdersContainer = document.getElementById("portal-orders-container");

// Address Tab Elements
const portalAddressesContainer = document.getElementById("portal-addresses-container");
const btnAddAddressModal = document.getElementById("btn-add-address-modal");
const addressFormModal = document.getElementById("address-form-modal");
const addressFormModalClose = document.getElementById("address-form-modal-close");
const addressModalForm = document.getElementById("address-modal-form");
const addressModalTitle = document.getElementById("address-modal-title");


// Favorites Tab Elements
const portalFavoritesContainer = document.getElementById("portal-favorites-container");

// Data Tab Forms
const profileForm = document.getElementById("portal-profile-form");
const passwordForm = document.getElementById("portal-password-form");

// Order Detail Modal Elements
const orderDetailsModal = document.getElementById("order-details-modal");
const orderDetailsModalClose = document.getElementById("order-details-modal-close");

// Initialize Portal
document.addEventListener("DOMContentLoaded", init);

async function init() {
    setupAuthToggle();
    setupTabNavigation();
    setupModals();
    checkPaymentReturn();

    if (supabaseClient) {
        // Monitor Auth State Changes
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
                currentUser = session.user;
                authSection.style.display = "none";
                portalSection.style.display = "grid";
                setupProfileHeader();
                await loadPortalData();
                await syncUserToPublicCustomers(currentUser);
                sendWelcomeEmailIfNeeded(currentUser);
            } else {
                currentUser = null;
                authSection.style.display = "block";
                portalSection.style.display = "none";
            }
        });

        // Initialize user check
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            currentUser = session.user;
            authSection.style.display = "none";
            portalSection.style.display = "grid";
            setupProfileHeader();
            await loadPortalData();
            await syncUserToPublicCustomers(currentUser);
            
            // Check if redirect is pending
            checkPendingRedirect();
        }
    }

    // Bind Forms
    loginForm.addEventListener("submit", handleLogin);
    signupForm.addEventListener("submit", handleSignup);
    btnPortalLogout.addEventListener("click", handleLogout);
    profileForm.addEventListener("submit", handleUpdateProfile);
    passwordForm.addEventListener("submit", handleUpdatePassword);
    addressModalForm.addEventListener("submit", handleAddressSubmit);
    bindPasswordToggles();

    // Bind phone and CEP masks
    const signupPhone = document.getElementById("signup-phone");
    if (signupPhone) signupPhone.addEventListener("input", handlePhoneInputMask);

    const profilePhone = document.getElementById("profile-phone");
    if (profilePhone) profilePhone.addEventListener("input", handlePhoneInputMask);

    const addressCep = document.getElementById("address-cep-field");
    if (addressCep) {
        addressCep.addEventListener("input", handleCepInputMask);
        addressCep.addEventListener("blur", () => {
            const cleanVal = addressCep.value.replace(/\D/g, "");
            if (cleanVal.length === 8) {
                fetchAddressForModal(cleanVal);
            }
        });
    }
}

// Detecta a volta do pagamento da InfinitePay e mostra a confirmação
function checkPaymentReturn() {
    const params = new URLSearchParams(window.location.search);
    const orderNsu = params.get("order_nsu");
    const receiptUrl = params.get("receipt_url");

    if (orderNsu || receiptUrl) {
        setTimeout(() => {
            alert(`Pagamento recebido com sucesso!${orderNsu ? " Pedido #RL-" + orderNsu : ""} Acompanhe o andamento na aba "Meus Pedidos".`);
        }, 600);

        // Limpa os parâmetros da URL sem recarregar a página
        window.history.replaceState({}, "", window.location.pathname);
    }
}

// Check if we should redirect back to checkout
function checkPendingRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirect");
    if (!redirectUrl) return;

    // Segurança: só permite redirecionar para páginas do próprio site
    try {
        const target = new URL(redirectUrl, window.location.origin);
        if (target.origin !== window.location.origin) return;
        setTimeout(() => {
            window.location.href = target.href;
        }, 1000);
    } catch (e) { /* URL inválida — ignora */ }
}

// ==========================================================================
// AUTHENTICATION LOGIC
// ==========================================================================

function setupAuthToggle() {
    btnToggleAuth.addEventListener("click", () => {
        if (loginForm.style.display !== "none") {
            // Switch to Signup
            loginForm.style.display = "none";
            signupForm.style.display = "block";
            authTitle.textContent = "Criar nova conta";
            authSubtitle.textContent = "Cadastre-se para aproveitar ofertas e salvar seus dados.";
            authToggleText.textContent = "Já possui uma conta?";
            btnToggleAuth.textContent = "Faça Login";
        } else {
            // Switch to Login
            loginForm.style.display = "block";
            signupForm.style.display = "none";
            authTitle.textContent = "Acesse sua Conta";
            authSubtitle.textContent = "Faça login para gerenciar seus pedidos e dados.";
            authToggleText.textContent = "Não tem uma conta ainda?";
            btnToggleAuth.textContent = "Cadastre-se";
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;
    
    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Auth state change will handle dashboard load
    } catch (err) {
        alert("Erro no login: " + err.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const phone = document.getElementById("signup-phone").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!supabaseClient) return;

    if (password.length < 6) {
        alert("A senha precisa ter no mínimo 6 caracteres.");
        return;
    }

    try {
        const { error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    phone: phone
                }
            }
        });

        if (error) throw error;

        // Sync user to public.customers table
        await upsertCustomerBasic(phone, name, email);

        alert("Cadastro realizado com sucesso! Bem-vindo(a) à RaviLar.");
        // Note: some supabase instances log user in immediately
    } catch (err) {
        alert("Erro ao cadastrar: " + err.message);
    }
}

async function syncUserToPublicCustomers(user) {
    if (!supabaseClient || !user) return;
    const name = user.user_metadata?.name || user.email.split("@")[0];
    const phone = user.user_metadata?.phone || "";
    await upsertCustomerBasic(phone, name, user.email);
}

// Insert or update customer record in public.customers.
// The table's unique key is `phone`; address columns are NOT NULL,
// so new records are inserted with empty strings (filled later at checkout).
async function upsertCustomerBasic(phone, name, email) {
    if (!supabaseClient) return;
    const cleanPhone = (phone || "").replace(/\D/g, "");
    if (!cleanPhone) return; // phone is the unique key in customers table

    try {
        // 1. Já existe ficha com esse telefone?
        const { data: byPhone, error: selError } = await supabaseClient
            .from("customers")
            .select("id")
            .eq("phone", cleanPhone);
        if (selError) throw selError;

        if (byPhone && byPhone.length > 0) {
            const { error } = await supabaseClient
                .from("customers")
                .update({ name: name, email: email })
                .eq("phone", cleanPhone);
            if (error) throw error;
            return;
        }

        // 2. Já existe ficha com esse e-mail (telefone diferente)? Atualiza ela.
        if (email) {
            const { data: byEmail } = await supabaseClient
                .from("customers")
                .select("id")
                .eq("email", email);
            if (byEmail && byEmail.length > 0) {
                const { error } = await supabaseClient
                    .from("customers")
                    .update({ name: name, phone: cleanPhone })
                    .eq("id", byEmail[0].id);
                if (error) throw error;
                return;
            }
        }

        // 3. Ficha nova
        const { error } = await supabaseClient
            .from("customers")
            .insert({
                phone: cleanPhone,
                name: name,
                email: email,
                street: "",
                number: "",
                neighborhood: "",
                city: ""
            });
        if (error) throw error;
    } catch (err) {
        console.error("Erro ao sincronizar cliente na tabela pública:", err.message);
    }
}

async function handleLogout() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert("Erro ao sair: " + error.message);
    } else {
        window.location.reload();
    }
}

// Dispara o e-mail de boas-vindas no primeiro acesso da conta.
// A função no servidor garante que só envia uma vez (marca welcome_sent).
async function sendWelcomeEmailIfNeeded(user) {
    if (!supabaseClient || !user) return;
    if (user.user_metadata?.welcome_sent) return;

    try {
        const { data, error } = await supabaseClient.functions.invoke("send-welcome-email");
        if (error) {
            console.warn("Falha no envio de boas-vindas:", error.message || error);
        } else {
            console.log("Boas-vindas:", data);
        }
    } catch (e) {
        console.warn("Não foi possível enviar o e-mail de boas-vindas:", e);
    }
}

// Profile sidebar data setup
function setupProfileHeader() {
    if (!currentUser) return;
    const name = currentUser.user_metadata?.name || currentUser.email.split("@")[0];
    const email = currentUser.email;
    
    userDisplayName.textContent = name;
    userDisplayEmail.textContent = email;
    
    // Initials avatar
    userAvatarInitials.textContent = name.charAt(0).toUpperCase();

    // Populate data forms
    document.getElementById("profile-name").value = currentUser.user_metadata?.name || "";
    document.getElementById("profile-phone").value = currentUser.user_metadata?.phone || "";
}

// ==========================================================================
// PORTAL DATA LOADING & TAB RENDERING
// ==========================================================================

async function loadPortalData() {
    if (!supabaseClient || !currentUser) return;

    try {
        // Fetch all user statistics concurrently
        const [ordersRes, addrRes, favRes, revRes] = await Promise.all([
            // Busca pedidos vinculados à conta OU feitos com o mesmo e-mail (ex: pedidos como convidado)
            supabaseClient.from("orders").select("*").or(`user_id.eq.${currentUser.id},client_email.eq.${currentUser.email}`).order("id", { ascending: false }),
            supabaseClient.from("client_addresses").select("*").eq("user_id", currentUser.id).order("is_default", { ascending: false }),
            supabaseClient.from("favorites").select("*, products(*)").eq("user_id", currentUser.id),
            supabaseClient.from("reviews").select("product_id").eq("user_id", currentUser.id)
        ]);

        orders = ordersRes.data || [];
        addresses = addrRes.data || [];
        favorites = favRes.data || [];
        myReviews = new Set((revRes.data || []).map(r => Number(r.product_id)));

        // Auto-heal: garante que o endereço padrão esteja refletido na tabela
        // pública de clientes (usada pela aba Clientes do admin)
        const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
        if (defaultAddr) {
            syncDefaultAddressToCustomers(defaultAddr);
        }

        // Render dashboard components
        renderSummaryTab();
        renderOrdersTab();
        renderAddressesTab();
        renderFavoritesTab();

    } catch (e) {
        console.error("Erro ao carregar dados do portal:", e);
    }
}

// Tab navigation trigger setup
function setupTabNavigation() {
    portalNavBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            portalNavBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            activeTab = btn.dataset.tab;
            tabContents.forEach(tab => {
                tab.classList.remove("active");
                if (tab.id === `tab-${activeTab}`) {
                    tab.classList.add("active");
                }
            });
        });
    });
}

// Modals event binding
function setupModals() {
    orderDetailsModalClose.addEventListener("click", () => {
        orderDetailsModal.classList.remove("open");
    });
    
    btnAddAddressModal.addEventListener("click", () => {
        addressModalTitle.textContent = "Novo Endereço de Entrega";
        addressModalForm.reset();
        document.getElementById("address-id-field").value = "";
        addressFormModal.classList.add("open");
    });

    addressFormModalClose.addEventListener("click", () => {
        addressFormModal.classList.remove("open");
    });
}

// TAB 1: SUMMARY PANORAMA RENDERER
function renderSummaryTab() {
    summaryTotalOrders.textContent = orders.length;
    summaryTotalFavorites.textContent = favorites.length;
    summaryTotalAddresses.textContent = addresses.length;

    if (orders.length > 0) {
        const lastOrder = orders[0];
        const dateStr = new Date(lastOrder.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
        
        summaryLastOrderBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <span class="order-card-id">#RL-${lastOrder.id}</span>
                <span class="status-badge ${statusToClass(lastOrder.status)}">${escapeHTML(lastOrder.status)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <span style="font-size: 0.9rem; color: var(--text-dark);">Realizado em: ${dateStr}</span>
                <span class="order-card-price">R$ ${lastOrder.total_amount.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="btn btn-secondary btn-sm btn-view-order-details" data-id="${lastOrder.id}" style="margin-top: 15px; width: 100%;">
                <i class="fa-solid fa-receipt"></i> Detalhes do Pedido
            </button>
        `;
        
        // bind quick details button
        summaryLastOrderBox.querySelector(".btn-view-order-details").addEventListener("click", () => {
            openOrderDetailsModal(lastOrder.id);
        });
    } else {
        summaryLastOrderBox.innerHTML = `<p style="color: var(--text-muted); font-size: 0.95rem;">Você ainda não fez nenhum pedido.</p>`;
    }
}

// TAB 2: ORDERS TAB RENDERER
function renderOrdersTab() {
    if (orders.length === 0) {
        portalOrdersContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>Nenhum pedido realizado ainda. Explore nossa loja para fazer sua primeira compra!</p>
                <a href="index.html#produtos" class="btn btn-primary btn-sm" style="margin-top: 15px;">Ver Produtos</a>
            </div>
        `;
        return;
    }

    portalOrdersContainer.innerHTML = "";
    orders.forEach(order => {
        const dateStr = new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });

        const card = document.createElement("div");
        card.className = "order-card";
        const statusClass = statusToClass(order.status);
        const statusText = escapeHTML(order.status);
        const paymentMethod = escapeHTML(order.payment_method);
        const street = escapeHTML(order.street);
        const number = escapeHTML(order.number);
        card.innerHTML = `
            <div class="order-card-header">
                <span class="order-card-id">#RL-${escapeHTML(order.id)}</span>
                <span class="order-card-date">${dateStr}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="order-card-body">
                <div class="order-card-summary">
                    <div><strong>Forma de Pagamento:</strong> ${paymentMethod}</div>
                    <div style="margin-top: 4px;"><strong>Entrega:</strong> ${street}, ${number}</div>
                </div>
                <div style="text-align: right; display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                    <span class="order-card-price">R$ ${order.total_amount.toFixed(2).replace('.', ',')}</span>
                    <button class="btn btn-secondary btn-sm btn-view-order-details" data-id="${order.id}" style="margin: 0; padding: 6px 12px; font-size: 0.78rem;">
                        <i class="fa-solid fa-receipt"></i> Ver Detalhes
                    </button>
                </div>
            </div>
        `;

        card.querySelector(".btn-view-order-details").addEventListener("click", () => {
            openOrderDetailsModal(order.id);
        });

        portalOrdersContainer.appendChild(card);
    });
}

// Open Order Details inside Modal
async function openOrderDetailsModal(orderId) {
    if (!supabaseClient) return;

    try {
        const order = orders.find(o => o.id == orderId);
        if (!order) return;

        // Fetch items
        const { data: items, error } = await supabaseClient
            .from("order_items")
            .select("*")
            .eq("order_id", orderId);

        if (error) throw error;

        // Populate Order details
        document.getElementById("modal-order-id").textContent = `Pedido #RL-${order.id}`;
        
        const dateStr = new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
        document.getElementById("modal-order-date").textContent = `Realizado em: ${dateStr}`;
        
        // Status badge
        const badge = document.getElementById("modal-order-status-badge");
        badge.className = `status-badge ${statusToClass(order.status)}`;
        badge.textContent = order.status;

        // Totals
        document.getElementById("modal-order-payment-method").textContent = order.payment_method;
        document.getElementById("modal-order-shipping-fee").textContent = order.shipping_fee === 0 ? "Grátis" : `R$ ${order.shipping_fee.toFixed(2).replace('.', ',')}`;
        
        const discount = parseFloat(order.discount_amount || 0);
        const subtotal = order.subtotal !== undefined && order.subtotal !== null
            ? parseFloat(order.subtotal)
            : (order.total_amount - order.shipping_fee);
        const subtotalEl = document.getElementById("modal-order-subtotal");
        if (subtotalEl) {
            subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        }
        const discountRow = document.getElementById("modal-order-discount-row");
        const discountVal = document.getElementById("modal-order-discount-amount");
        const discountLabel = document.getElementById("modal-order-discount-label");
        if (discountRow && discountVal) {
            if (discount > 0) {
                discountRow.style.display = "flex";
                discountVal.textContent = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
                if (discountLabel && order.coupon_code) {
                    discountLabel.textContent = `Desconto (Cupom: ${order.coupon_code}):`;
                } else if (discountLabel) {
                    discountLabel.textContent = "Desconto:";
                }
            } else {
                discountRow.style.display = "none";
            }
        }

        document.getElementById("modal-order-total-amount").textContent = `R$ ${order.total_amount.toFixed(2).replace('.', ',')}`;
        
        // Address text
        let trackingHtml = "";
        if (order.tracking_code) {
            trackingHtml = `
                <div style="margin-top: 15px; padding: 12px 16px; background-color: #EBF8FF; border: 1px solid #BEE3F8; border-radius: var(--border-radius-sm); font-size: 0.88rem; color: #2B6CB0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <i class="fa-solid fa-truck-fast" style="margin-right: 6px;"></i>
                        <strong>Código de Rastreamento:</strong> 
                        <span style="font-family: monospace; font-weight: bold; background-color: #fff; padding: 3px 8px; border: 1px solid #BEE3F8; border-radius: 4px; display: inline-block;">${escapeHTML(order.tracking_code)}</span>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="window.open('https://rastreamento.correios.com.br/app/index.php?objeto=${encodeURIComponent(order.tracking_code)}', '_blank')" style="margin: 0; padding: 4px 10px; font-size: 0.78rem;">
                        Rastrear <i class="fa-solid fa-external-link"></i>
                    </button>
                </div>
            `;
        }

        document.getElementById("modal-order-address-text").innerHTML = `
            <strong>Destinatário:</strong> ${escapeHTML(order.client_name)}<br>
            <strong>Endereço:</strong> ${escapeHTML(order.street)}, nº ${escapeHTML(order.number)} ${order.complement ? '- ' + escapeHTML(order.complement) : ''}<br>
            <strong>Bairro:</strong> ${escapeHTML(order.neighborhood)} - <strong>Cidade:</strong> ${escapeHTML(order.city)} / ${escapeHTML(order.uf)}<br>
            <strong>WhatsApp:</strong> ${escapeHTML(order.client_phone)}
            ${trackingHtml}
        `;

        // Render items list
        const itemsListContainer = document.getElementById("modal-order-items-list");
        itemsListContainer.innerHTML = "";

        items.forEach(item => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.alignItems = "center";
            row.style.padding = "10px 0";
            row.style.borderBottom = "1px solid var(--border-color)";
            row.innerHTML = `
                <div style="font-size: 0.9rem; color: var(--text-dark);">
                    <strong>${escapeHTML(item.quantity)}x</strong> ${escapeHTML(item.product_name)}
                </div>
                <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-color);">
                    R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </div>
            `;
            itemsListContainer.appendChild(row);

            // Pedido entregue: cliente pode avaliar o produto
            if (order.status === "Entregue" && item.product_id) {
                itemsListContainer.appendChild(buildReviewArea(item));
            }
        });

        // Open Modal
        orderDetailsModal.classList.add("open");

    } catch (e) {
        alert("Erro ao carregar detalhes do pedido: " + e.message);
    }
}

// Área de avaliação de um item de pedido entregue
function buildReviewArea(item) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "padding: 6px 0 12px; border-bottom: 1px solid var(--border-color);";

    const alreadyReviewed = () => {
        wrap.innerHTML = `<span style="font-size: 0.8rem; color: #48BB78; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Você já avaliou este produto. Obrigado!</span>`;
    };

    if (myReviews.has(Number(item.product_id))) {
        alreadyReviewed();
        return wrap;
    }

    const btn = document.createElement("button");
    btn.className = "btn btn-secondary btn-sm";
    btn.style.cssText = "margin: 4px 0 0; padding: 5px 12px; font-size: 0.75rem;";
    btn.innerHTML = '<i class="fa-solid fa-star" style="color: #F6AD55;"></i> Avaliar produto';

    btn.addEventListener("click", () => {
        btn.style.display = "none";

        const form = document.createElement("div");
        form.style.cssText = "margin-top: 8px; display: flex; flex-direction: column; gap: 8px;";
        form.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-size: 0.8rem; font-weight: 600; margin: 0;">Sua nota:</label>
                <select class="review-rating" style="width: auto; padding: 6px 10px; font-size: 0.85rem; border: 1px solid var(--border-color); border-radius: 6px;">
                    <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                    <option value="4">⭐⭐⭐⭐ Muito bom</option>
                    <option value="3">⭐⭐⭐ Bom</option>
                    <option value="2">⭐⭐ Regular</option>
                    <option value="1">⭐ Ruim</option>
                </select>
            </div>
            <textarea class="review-quote" placeholder="Conte como foi sua experiência com o produto..." style="min-height: 70px; padding: 10px; border: 1px solid var(--border-color); border-radius: 6px; font-family: inherit; font-size: 0.85rem; resize: vertical;"></textarea>
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary btn-sm review-send" style="margin: 0; padding: 6px 16px; font-size: 0.78rem;">Enviar avaliação</button>
                <button class="btn btn-secondary btn-sm review-cancel" style="margin: 0; padding: 6px 16px; font-size: 0.78rem;">Cancelar</button>
            </div>
        `;
        wrap.appendChild(form);

        form.querySelector(".review-cancel").addEventListener("click", () => {
            form.remove();
            btn.style.display = "";
        });

        form.querySelector(".review-send").addEventListener("click", async () => {
            const rating = parseInt(form.querySelector(".review-rating").value);
            const quote = form.querySelector(".review-quote").value.trim();
            if (!quote) {
                alert("Escreva um comentário para a sua avaliação.");
                return;
            }

            const sendBtn = form.querySelector(".review-send");
            sendBtn.disabled = true;
            sendBtn.textContent = "Enviando...";

            try {
                const { error } = await supabaseClient.from("reviews").insert({
                    name: currentUser.user_metadata?.name || currentUser.email.split("@")[0],
                    quote: quote,
                    rating: rating,
                    product_id: item.product_id,
                    user_id: currentUser.id
                });
                if (error) throw error;

                myReviews.add(Number(item.product_id));
                alreadyReviewed();
                alert("Avaliação enviada com sucesso! Ela já conta na nota do produto na loja.");
            } catch (e) {
                sendBtn.disabled = false;
                sendBtn.textContent = "Enviar avaliação";
                const msg = e.message || "";
                if (msg.includes("row-level security")) {
                    alert("Não foi possível enviar: a avaliação é liberada quando o pedido está marcado como Entregue.");
                } else if (msg.includes("duplicate")) {
                    myReviews.add(Number(item.product_id));
                    alreadyReviewed();
                } else {
                    alert("Erro ao enviar avaliação: " + msg);
                }
            }
        });
    });

    wrap.appendChild(btn);
    return wrap;
}

// TAB 3: ADDRESSES TAB RENDERER
function renderAddressesTab() {
    portalAddressesContainer.innerHTML = "";

    if (addresses.length === 0) {
        portalAddressesContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-map-location-dot" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>Nenhum endereço de entrega cadastrado.</p>
            </div>
        `;
        return;
    }

    addresses.forEach(addr => {
        const card = document.createElement("div");
        card.className = `address-card ${addr.is_default ? 'default' : ''}`;
        card.innerHTML = `
            <div class="address-card-name">${addr.name}</div>
            <div class="address-card-text">
                ${addr.street}, nº ${addr.number}<br>
                ${addr.neighborhood} - CEP: ${addr.cep}<br>
                ${addr.city} - ${addr.uf}<br>
                ${addr.complement ? 'Compl: ' + addr.complement : ''}
            </div>
            ${addr.is_default ? '<span class="address-badge-default">Padrão</span>' : ''}
            <div class="address-card-actions">
                <button class="btn btn-secondary btn-sm btn-edit-address" data-id="${addr.id}" style="margin: 0; padding: 6px 12px; font-size: 0.75rem;"><i class="fa-solid fa-pen"></i> Editar</button>
                <button class="btn btn-secondary btn-sm btn-delete-address" data-id="${addr.id}" style="margin: 0; padding: 6px 12px; font-size: 0.75rem; color: var(--error-color); border-color: var(--border-color);"><i class="fa-solid fa-trash"></i> Excluir</button>
                ${!addr.is_default ? `<button class="btn btn-secondary btn-sm btn-default-address" data-id="${addr.id}" style="margin: 0; padding: 6px 12px; font-size: 0.75rem;"><i class="fa-solid fa-check"></i> Definir Padrão</button>` : ''}
            </div>
        `;

        // Bind Address actions
        card.querySelector(".btn-edit-address").addEventListener("click", () => handleEditAddress(addr));
        card.querySelector(".btn-delete-address").addEventListener("click", () => handleDeleteAddress(addr.id));
        if (!addr.is_default) {
            card.querySelector(".btn-default-address").addEventListener("click", () => handleSetDefaultAddress(addr.id));
        }

        portalAddressesContainer.appendChild(card);
    });
}

function handleEditAddress(addr) {
    addressModalTitle.textContent = "Editar Endereço";
    document.getElementById("address-id-field").value = addr.id;
    document.getElementById("address-name-field").value = addr.name;
    document.getElementById("address-cep-field").value = addr.cep || "";
    document.getElementById("address-street-field").value = addr.street;
    document.getElementById("address-number-field").value = addr.number;
    document.getElementById("address-neighborhood-field").value = addr.neighborhood;
    document.getElementById("address-city-field").value = addr.city;
    document.getElementById("address-uf-field").value = addr.uf;
    document.getElementById("address-complement-field").value = addr.complement || "";
    document.getElementById("address-default-field").checked = addr.is_default;
    
    addressFormModal.classList.add("open");
}

async function handleDeleteAddress(id) {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;
    try {
        const { error } = await supabaseClient
            .from("client_addresses")
            .delete()
            .eq("id", id);
        if (error) throw error;
        
        await loadPortalData();
        alert("Endereço excluído com sucesso!");
    } catch (e) {
        alert("Erro ao excluir endereço: " + e.message);
    }
}

async function handleSetDefaultAddress(id) {
    try {
        // Clear all defaults
        await supabaseClient
            .from("client_addresses")
            .update({ is_default: false })
            .eq("user_id", currentUser.id);

        // Set this default
        const { error } = await supabaseClient
            .from("client_addresses")
            .update({ is_default: true })
            .eq("id", id);

        if (error) throw error;

        // Reflect the new default address in the public customers table (admin panel)
        const addr = addresses.find(a => a.id == id);
        await syncDefaultAddressToCustomers(addr);

        await loadPortalData();
    } catch (e) {
        alert("Erro ao definir endereço padrão: " + e.message);
    }
}

// Sync the user's default delivery address to public.customers,
// so the address shows up in the admin "Clientes" tab.
async function syncDefaultAddressToCustomers(addr) {
    if (!supabaseClient || !currentUser || !addr) return;
    const cleanPhone = (currentUser.user_metadata?.phone || "").replace(/\D/g, "");
    if (!cleanPhone && !currentUser.email) return;

    try {
        const payload = {
            street: addr.street,
            number: addr.number,
            neighborhood: addr.neighborhood,
            city: `${addr.city} - ${addr.uf}`
        };

        // Atualiza todas as linhas do cliente (por telefone limpo e/ou e-mail)
        const filters = [];
        if (cleanPhone) filters.push(`phone.eq.${cleanPhone}`);
        if (currentUser.email) filters.push(`email.eq.${currentUser.email}`);

        const { error } = await supabaseClient
            .from("customers")
            .update(payload)
            .or(filters.join(","));
        if (error) throw error;
    } catch (err) {
        console.error("Erro ao sincronizar endereço padrão com a tabela de clientes:", err.message);
    }
}

async function handleAddressSubmit(e) {
    e.preventDefault();
    if (!supabaseClient || !currentUser) return;

    const id = document.getElementById("address-id-field").value;
    const name = document.getElementById("address-name-field").value.trim();
    const cep = document.getElementById("address-cep-field").value.trim();
    const street = document.getElementById("address-street-field").value.trim();
    const number = document.getElementById("address-number-field").value.trim();
    const neighborhood = document.getElementById("address-neighborhood-field").value.trim();
    const city = document.getElementById("address-city-field").value.trim();
    const uf = document.getElementById("address-uf-field").value.trim().toUpperCase();
    const complement = document.getElementById("address-complement-field").value.trim();
    const isDefault = document.getElementById("address-default-field").checked;

    try {
        if (isDefault) {
            // Clear default flags
            await supabaseClient
                .from("client_addresses")
                .update({ is_default: false })
                .eq("user_id", currentUser.id);
        }

        const addressData = {
            user_id: currentUser.id,
            name, cep, street, number, neighborhood, city, uf, complement,
            is_default: isDefault
        };

        if (id) {
            // Update
            const { error } = await supabaseClient
                .from("client_addresses")
                .update(addressData)
                .eq("id", id);
            if (error) throw error;
        } else {
            // Insert
            const { error } = await supabaseClient
                .from("client_addresses")
                .insert(addressData);
            if (error) throw error;
        }

        // If saved as default, reflect it in the public customers table (admin panel)
        if (isDefault) {
            await syncDefaultAddressToCustomers(addressData);
        }

        addressFormModal.classList.remove("open");
        await loadPortalData();
        alert("Endereço salvo com sucesso!");

    } catch (err) {
        alert("Erro ao salvar endereço: " + err.message);
    }
}



// TAB 5: FAVORITES TAB RENDERER
function renderFavoritesTab() {
    portalFavoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        portalFavoritesContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i class="fa-solid fa-heart" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>Nenhum produto nos seus favoritos ainda.</p>
                <a href="index.html#produtos" class="btn btn-primary btn-sm" style="margin-top: 15px;">Ver Produtos</a>
            </div>
        `;
        return;
    }

    favorites.forEach(fav => {
        const p = fav.products;
        if (!p) return;

        // Parse Image safely
        let imageUrl = "https://images.unsplash.com/photo-1595348020949-87cdfcd44174?auto=format&fit=crop&q=80&w=200";
        if (p.image) {
            try {
                if (typeof p.image === "string" && p.image.startsWith("[")) {
                    imageUrl = JSON.parse(p.image)[0] || imageUrl;
                } else if (Array.isArray(p.image)) {
                    imageUrl = p.image[0] || imageUrl;
                } else {
                    imageUrl = p.image;
                }
            } catch (e) {
                imageUrl = p.image;
            }
        }

        const card = document.createElement("div");
        card.className = "favorite-item-card";
        card.innerHTML = `
            <img src="${imageUrl}" alt="${p.name}" class="favorite-item-img">
            <div class="favorite-item-info">
                <div class="favorite-item-name">${p.name}</div>
                <div class="favorite-item-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
                
                <div style="display: flex; gap: 8px; margin-top: 5px;">
                    <button class="btn btn-primary btn-sm btn-fav-add-to-cart" style="flex: 1; font-size: 0.72rem; padding: 8px 4px; margin: 0;">
                        <i class="fa-solid fa-cart-plus"></i> Comprar
                    </button>
                    <button class="btn btn-secondary btn-sm btn-fav-remove" style="padding: 8px; border-color: var(--border-color); color: var(--error-color); margin: 0;" title="Remover dos favoritos">
                        <i class="fa-solid fa-heart-crack"></i>
                    </button>
                </div>
            </div>
        `;

        // Bind clicks
        card.querySelector(".btn-fav-remove").addEventListener("click", () => handleRemoveFromFavorites(fav.id));
        card.querySelector(".btn-fav-add-to-cart").addEventListener("click", () => addFavoriteToCart(p));

        portalFavoritesContainer.appendChild(card);
    });
}

async function handleRemoveFromFavorites(favId) {
    try {
        const { error } = await supabaseClient
            .from("favorites")
            .delete()
            .eq("id", favId);
        
        if (error) throw error;
        
        await loadPortalData();
    } catch (e) {
        alert("Erro ao remover favorito: " + e.message);
    }
}

function addFavoriteToCart(product) {
    // Load existing cart
    let cart = [];
    const savedCart = localStorage.getItem("ravilar_cart");
    if (savedCart) {
        try { cart = JSON.parse(savedCart); } catch (e) {}
    }

    // If the product has variations, use the first option as default
    let variant = null;
    if (product.variations) {
        try {
            const v = typeof product.variations === "string" ? JSON.parse(product.variations) : product.variations;
            if (v && Array.isArray(v.options) && v.options.length > 0) {
                const opt = v.options[0];
                variant = {
                    name: v.name,
                    label: opt.label,
                    price: (opt.price !== undefined && opt.price !== null) ? parseFloat(opt.price) : null,
                    image: opt.image || null
                };
            }
        } catch (e) { /* sem variações */ }
    }

    // Add item (same product + same variation stack together)
    const existingIndex = cart.findIndex(item =>
        item.product.id === product.id &&
        (item.variant ? item.variant.label : null) === (variant ? variant.label : null)
    );
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ product, quantity: 1, variant });
    }

    localStorage.setItem("ravilar_cart", JSON.stringify(cart));
    if (variant) {
        alert(`Produto adicionado ao carrinho na opção "${variant.label}"! Você pode trocar a variação na loja.`);
    } else {
        alert("Produto adicionado ao carrinho!");
    }
}

// ==========================================================================
// PROFILE DATA SETTINGS
// ==========================================================================

async function handleUpdateProfile(e) {
    e.preventDefault();
    if (!supabaseClient || !currentUser) return;

    const name = document.getElementById("profile-name").value.trim();
    const phone = document.getElementById("profile-phone").value.trim();

    try {
        const { error } = await supabaseClient.auth.updateUser({
            data: { name, phone }
        });

        if (error) throw error;

        // Sync profile changes to public.customers table
        await upsertCustomerBasic(phone, name, currentUser.email);

        alert("Dados pessoais atualizados com sucesso!");
        setupProfileHeader();
    } catch (err) {
        alert("Erro ao atualizar dados: " + err.message);
    }
}

async function handleUpdatePassword(e) {
    e.preventDefault();
    if (!supabaseClient || !currentUser) return;

    const password = document.getElementById("profile-new-password").value;
    const confirmPassword = document.getElementById("profile-confirm-password").value;

    if (password.length < 6) {
        alert("A senha precisa ter no mínimo 6 caracteres.");
        return;
    }

    if (password !== confirmPassword) {
        alert("As senhas informadas não coincidem.");
        return;
    }

    try {
        const { error } = await supabaseClient.auth.updateUser({ password });
        if (error) throw error;

        passwordForm.reset();
        alert("Senha atualizada com sucesso!");
    } catch (err) {
        alert("Erro ao atualizar senha: " + err.message);
    }
}

// Bind all password toggle buttons
function bindPasswordToggles() {
    const toggles = document.querySelectorAll(".password-toggle-btn");
    toggles.forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            const wrapper = toggle.closest(".password-input-wrapper");
            if (!wrapper) return;
            
            const input = wrapper.querySelector("input");
            if (!input) return;
            
            const isPassword = input.getAttribute("type") === "password";
            input.setAttribute("type", isPassword ? "text" : "password");
            
            const icon = toggle.querySelector("i");
            if (icon) {
                icon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
            }
        });
    });
}

function handlePhoneInputMask(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        e.target.value = `(${value}`;
    } else {
        e.target.value = "";
    }
}

function handleCepInputMask(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
        e.target.value = value.slice(0, 5) + "-" + value.slice(5);
    } else {
        e.target.value = value;
    }
}

async function fetchAddressForModal(cep) {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    
    try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        
        if (data.erro) return;
        
        const streetInput = document.getElementById("address-street-field");
        const neighborhoodInput = document.getElementById("address-neighborhood-field");
        const cityInput = document.getElementById("address-city-field");
        const ufInput = document.getElementById("address-uf-field");
        const numberInput = document.getElementById("address-number-field");
        
        if (streetInput && data.logradouro) streetInput.value = data.logradouro;
        if (neighborhoodInput && data.bairro) neighborhoodInput.value = data.bairro;
        if (cityInput && data.localidade) cityInput.value = data.localidade;
        if (ufInput && data.uf) ufInput.value = data.uf;
        
        if (numberInput) numberInput.focus();
    } catch (e) {
        console.error(e);
    }
}
