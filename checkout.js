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

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    }[char]));
}

// Effective unit price of a cart item (variation price wins over base price)
function getItemUnitPrice(item) {
    if (item.variant && item.variant.price !== undefined && item.variant.price !== null) {
        return parseFloat(item.variant.price);
    }
    return item.product.price;
}

// Display name of a cart item including the chosen variation
function getItemDisplayName(item) {
    return item.variant
        ? `${item.product.name} (${item.variant.name}: ${item.variant.label})`
        : item.product.name;
}

// ==========================================================================
// SUPABASE CLIENT CONFIGURATION
// ==========================================================================
const supabaseUrl = "https://wbgdyheswfzgxaxvhugv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2R5aGVzd2Z6Z3hheHZodWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mzk1OTIsImV4cCI6MjA5OTUxNTU5Mn0.kvPoOJIoqHPpUfA3PFBPFuQ0yDALS1LOChd2bYCGoMs";

const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let cart = [];
let currentUser = null;
let savedAddresses = [];
let savedCards = [];
let selectedPaymentMethod = "pix"; // 'pix' or 'card'
let subtotal = 0;
let shippingFee = 15.00;
let grandTotal = 0;
let appliedCoupon = null;
let discountAmount = 0;

let defaultShippingFee = 15.00;
let freeShippingMinAmount = 150.00;
let shippingRules = [];
let originCep = "17996371";
let selectedShippingOption = null;
let meShippingOptions = [];

const useRealApi = true; // Altere para true para ligar a integração real da InfinitePay

// DOM Elements
const checkoutItemsList = document.getElementById("checkout-items-list");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryShipping = document.getElementById("summary-shipping");
const summaryGrandTotal = document.getElementById("summary-grand-total");

const deliveryForm = document.getElementById("checkout-delivery-form");

// Auth Elements
const authInfoBox = document.getElementById("checkout-auth-info");
const guestInfoBox = document.getElementById("checkout-guest-info");
const welcomeText = document.getElementById("checkout-user-welcome");
const btnCheckoutLogout = document.getElementById("btn-checkout-logout");

// Saved Elements selectors
const savedAddressesGroup = document.getElementById("saved-addresses-selector-group");
const savedAddressesSelect = document.getElementById("checkout-saved-address");

// Overlay Elements
const processingOverlay = document.getElementById("processing-overlay");
const overlayLoader = document.getElementById("overlay-loader");
const overlayCheckmark = document.getElementById("overlay-checkmark");
const overlayStatusTitle = document.getElementById("overlay-status-title");
const overlayStatusDesc = document.getElementById("overlay-status-desc");

// Initialize page
document.addEventListener("DOMContentLoaded", init);

async function init() {
    loadCart();
    await loadStoreShippingConfig();
    renderSummary();

    if (supabaseClient) {
        // Monitor Auth State
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
                currentUser = session.user;
                showAuthUI();
                await loadSavedUserData();
            } else {
                currentUser = null;
                showGuestUI();
            }
        });

        // Initialize user check
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            currentUser = session.user;
            showAuthUI();
            await loadSavedUserData();
        }
    }

    // Bind event handlers
    if (btnCheckoutLogout) btnCheckoutLogout.addEventListener("click", handleLogout);
    
    const btnFinishCheckout = document.getElementById("btn-finish-checkout");
    if (btnFinishCheckout) {
        btnFinishCheckout.addEventListener("click", handleCheckout);
    }

    const btnApplyCoupon = document.getElementById("btn-apply-coupon");
    if (btnApplyCoupon) {
        btnApplyCoupon.addEventListener("click", handleApplyCoupon);
    }

    // Bind CEP event handler
    const cepInput = document.getElementById("delivery-cep");
    if (cepInput) {
        cepInput.addEventListener("blur", () => {
            const cleanVal = cepInput.value.replace(/\D/g, "");
            if (cleanVal.length === 8) {
                fetchAddressFromCep(cleanVal);
            }
            updateShippingOptionsForCep(cepInput.value);
        });
        cepInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 8) value = value.slice(0, 8);
            if (value.length > 5) {
                e.target.value = value.slice(0, 5) + "-" + value.slice(5);
            } else {
                e.target.value = value;
            }
            if (value.length === 8) {
                fetchAddressFromCep(value);
                updateShippingOptionsForCep(e.target.value);
            }
        });
    }

    // Bind Phone event handler
    const phoneInput = document.getElementById("delivery-phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
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
        });
    }
}

// ==========================================================================
// CORE FUNCTIONS
// ==========================================================================

function loadCart() {
    const savedCart = localStorage.getItem("ravilar_cart");
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    
    if (cart.length === 0) {
        alert("Seu carrinho está vazio. Você será redirecionado para a página inicial.");
        window.location.href = "index.html";
    }
}

async function loadStoreShippingConfig() {
    if (!supabaseClient) return;
    try {
        // Load Settings
        const { data: settingsData, error: settingsError } = await supabaseClient
            .from("store_settings")
            .select("*");
            
        if (!settingsError && settingsData) {
            settingsData.forEach(item => {
                if (item.key === "default_shipping_fee") {
                    defaultShippingFee = parseFloat(item.value);
                } else if (item.key === "free_shipping_min_amount") {
                    freeShippingMinAmount = parseFloat(item.value);
                } else if (item.key === "origin_cep") {
                    originCep = item.value;
                }
            });
        }
        
        // Load CEP Rules
        const { data: rulesData, error: rulesError } = await supabaseClient
            .from("shipping_rules")
            .select("*");
            
        if (!rulesError && rulesData) {
            shippingRules = rulesData;
        }
    } catch (e) {
        console.warn("Falha ao carregar configurações de frete do Supabase, usando padrões locais:", e);
    }
}

function calculateShippingFee() {
    if (subtotal === 0) {
        shippingFee = 0;
        return;
    }
    
    if (selectedShippingOption) {
        let matchedFee = parseFloat(selectedShippingOption.price);
        if (freeShippingMinAmount > 0 && subtotal >= freeShippingMinAmount) {
            shippingFee = 0;
        } else {
            shippingFee = matchedFee;
        }
    } else {
        // Fallback manual temporário se não houver opção selecionada
        const cepInput = document.getElementById("delivery-cep");
        const cep = cepInput ? cepInput.value.replace(/\D/g, "") : "";
        calculateManualShipping(cep);
        
        let matchedFee = parseFloat(selectedShippingOption.price);
        if (freeShippingMinAmount > 0 && subtotal >= freeShippingMinAmount) {
            shippingFee = 0;
        } else {
            shippingFee = matchedFee;
        }
    }
}

function renderSummary() {
    checkoutItemsList.innerHTML = "";
    subtotal = 0;

    cart.forEach(item => {
        const unitPrice = getItemUnitPrice(item);
        const itemSubtotal = unitPrice * item.quantity;
        subtotal += itemSubtotal;

        // Extract image URL safely (variation photo takes precedence)
        let imageUrl = "https://images.unsplash.com/photo-1595348020949-87cdfcd44174?auto=format&fit=crop&q=80&w=100";
        if (item.variant && item.variant.image) {
            imageUrl = item.variant.image;
        } else if (item.product.image) {
            try {
                if (typeof item.product.image === "string" && item.product.image.startsWith("[")) {
                    const parsed = JSON.parse(item.product.image);
                    imageUrl = parsed[0] || imageUrl;
                } else if (Array.isArray(item.product.image)) {
                    imageUrl = item.product.image[0] || imageUrl;
                } else {
                    imageUrl = item.product.image;
                }
            } catch (e) {
                imageUrl = item.product.image;
            }
        }

        const variantHTML = item.variant
            ? `<div style="font-size: 0.76rem; color: var(--text-muted);">${escapeHTML(item.variant.name)}: <strong>${escapeHTML(item.variant.label)}</strong></div>`
            : "";

        const row = document.createElement("div");
        row.className = "summary-item-row";
        row.innerHTML = `
            <img src="${escapeHTML(imageUrl)}" alt="${escapeHTML(item.product.name)}">
            <div class="summary-item-details">
                <div class="summary-item-name">${escapeHTML(item.product.name)}</div>
                ${variantHTML}
                <div class="summary-item-qty">${item.quantity}x R$ ${unitPrice.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="summary-item-price">R$ ${itemSubtotal.toFixed(2).replace('.', ',')}</div>
        `;
        checkoutItemsList.appendChild(row);
    });

    // Calculate shipping fee based on rules and subtotal
    calculateShippingFee();

    discountAmount = 0;
    const rowDiscount = document.getElementById("row-discount");
    const summaryDiscount = document.getElementById("summary-discount");
    
    if (appliedCoupon) {
        if (appliedCoupon.type === "percentage") {
            discountAmount = subtotal * (appliedCoupon.value / 100);
        } else {
            discountAmount = appliedCoupon.value;
        }
        
        // Cap discount
        if (discountAmount > subtotal) {
            discountAmount = subtotal;
        }
        
        if (rowDiscount && summaryDiscount) {
            rowDiscount.style.display = "flex";
            summaryDiscount.textContent = `- R$ ${discountAmount.toFixed(2).replace('.', ',')}`;
            
            const labelDiscount = rowDiscount.querySelector("span:first-child");
            if (labelDiscount) {
                if (appliedCoupon.type === "percentage") {
                    labelDiscount.textContent = `Desconto (${appliedCoupon.value}%)`;
                } else {
                    labelDiscount.textContent = `Desconto (R$ ${appliedCoupon.value.toFixed(2).replace('.', ',')})`;
                }
            }
        }
    } else {
        if (rowDiscount) {
            rowDiscount.style.display = "none";
            const labelDiscount = rowDiscount.querySelector("span:first-child");
            if (labelDiscount) labelDiscount.textContent = "Desconto";
        }
    }

    grandTotal = subtotal - discountAmount + shippingFee;
    if (grandTotal < 0.01) grandTotal = 0.01;

    const displayedSubtotal = subtotal - discountAmount;
    summarySubtotal.textContent = `R$ ${displayedSubtotal.toFixed(2).replace('.', ',')}`;
    summaryShipping.textContent = shippingFee === 0 ? "Grátis" : `R$ ${shippingFee.toFixed(2).replace('.', ',')}`;
    summaryGrandTotal.textContent = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
}

// ==========================================================================
// USER AUTHENTICATED STATE LOADERS
// ==========================================================================

function showAuthUI() {
    if (guestInfoBox) guestInfoBox.style.display = "none";
    if (authInfoBox) authInfoBox.style.display = "block";
    if (welcomeText) {
        welcomeText.textContent = `Olá, ${currentUser.user_metadata?.name || currentUser.email}`;
    }
}

function showGuestUI() {
    if (guestInfoBox) guestInfoBox.style.display = "block";
    if (authInfoBox) authInfoBox.style.display = "none";
    if (savedAddressesGroup) savedAddressesGroup.style.display = "none";
}

async function handleLogout() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        alert("Erro ao deslogar: " + error.message);
    } else {
        window.location.reload();
    }
}

async function loadSavedUserData() {
    if (!supabaseClient || !currentUser) return;

    try {
        // 1. Fetch addresses
        const { data: addresses, error: addrError } = await supabaseClient
            .from("client_addresses")
            .select("*")
            .eq("user_id", currentUser.id);

        if (!addrError && addresses && addresses.length > 0) {
            savedAddresses = addresses;
            populateAddressesDropdown();
        }

        // client_cards logic removed (payments are handled via InfinitePay redirect)

        // 3. Set profile values to delivery form if empty
        const nameField = document.getElementById("delivery-name");
        const phoneField = document.getElementById("delivery-phone");
        
        if (!nameField.value) nameField.value = currentUser.user_metadata?.name || "";
        if (!phoneField.value) phoneField.value = currentUser.user_metadata?.phone || "";

    } catch (e) {
        console.error("Erro ao carregar dados salvos do cliente:", e);
    }
}

function populateAddressesDropdown() {
    savedAddressesGroup.style.display = "block";
    savedAddressesSelect.innerHTML = `<option value="new">-- Cadastrar Novo Endereço --</option>`;

    savedAddresses.forEach(addr => {
        const option = document.createElement("option");
        option.value = addr.id;
        option.textContent = `${addr.name} - ${addr.street}, ${addr.number} (${addr.neighborhood})`;
        if (addr.is_default) {
            option.selected = true;
            fillAddressFields(addr);
        }
        savedAddressesSelect.appendChild(option);
    });

    savedAddressesSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val === "new") {
            deliveryForm.reset();
            // keep contact details
            document.getElementById("delivery-name").value = currentUser.user_metadata?.name || "";
            document.getElementById("delivery-phone").value = currentUser.user_metadata?.phone || "";
            updateShippingOptionsForCep("");
        } else {
            const selected = savedAddresses.find(a => a.id == val);
            if (selected) fillAddressFields(selected);
        }
    });
}

function fillAddressFields(addr) {
    document.getElementById("delivery-cep").value = addr.cep || "";
    document.getElementById("delivery-street").value = addr.street;
    document.getElementById("delivery-number").value = addr.number;
    document.getElementById("delivery-neighborhood").value = addr.neighborhood;
    document.getElementById("delivery-city").value = `${addr.city} - ${addr.uf}`;
    document.getElementById("delivery-complement").value = addr.complement || "";
    updateShippingOptionsForCep(addr.cep || "");
}



// ==========================================================================
// CHECKOUT SUBMISSION LOGIC
// ==========================================================================

async function handleCheckout() {
    // Validate delivery details
    if (!validateDeliveryForm()) return;

    // Show Loader Screen
    showOverlay("Processando pedido...", "Vamos registrar seu pedido e preparar seu pagamento seguro.");

    if (useRealApi && supabaseClient) {
        try {
            const deliveryData = getDeliveryFormData();
            
            // 1. Save order to Supabase first to get the official orderId
            const orderId = await saveOrderToDatabase("InfinitePay", "Pendente");
            
            // 2. Call the Edge Function to generate the checkout link from InfinitePay
            const response = await fetch(`${supabaseUrl}/functions/v1/create-infinitepay-link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${supabaseKey}`
                },
                body: JSON.stringify({
                    items: getDiscountedItems(),
                    order_nsu: orderId,
                    customer: {
                        name: deliveryData.name,
                        phone_number: "+55" + deliveryData.phone.replace(/\D/g, ""),
                        email: currentUser ? currentUser.email : ""
                    },
                    address: {
                        cep: deliveryData.cep,
                        street: deliveryData.street,
                        neighborhood: deliveryData.neighborhood,
                        number: deliveryData.number,
                        complement: deliveryData.complement
                    },
                    redirect_url: window.location.origin + "/cliente.html" // Redirects customer back to client portal
                })
            });

            const data = await response.json();
            if (response.ok && data.url) {
                // Clear cart
                localStorage.removeItem("ravilar_cart");
                // Redirect user to InfinitePay Secure Checkout Link
                window.location.href = data.url;
                return;
            } else {
                console.error("Erro InfinitePay:", data.error || data);
                alert("Erro ao gerar link de pagamento. Por favor, tente novamente.");
                hideOverlay();
                return;
            }
        } catch (err) {
            console.error("Erro ao integrar com gateway:", err);
            alert("Erro na conexão com o gateway de pagamento: " + err.message);
            hideOverlay();
            return;
        }
    }

    // Register the order locally (Simulation Mode)
    setTimeout(async () => {
        try {
            // Save order to Supabase
            const orderId = await saveOrderToDatabase("InfinitePay Simulação", "Pendente");
            
            showSuccessOverlay("Pedido Registrado!", "Seu pedido foi criado com sucesso no modo de simulação e está pendente de confirmação.");
            
            // Clear cart
            localStorage.removeItem("ravilar_cart");

            // Redirect to customer portal
            setTimeout(() => {
                window.location.href = "cliente.html";
            }, 2500);

        } catch (e) {
            hideOverlay();
            alert("Erro ao processar pedido no banco de dados: " + (e.message || JSON.stringify(e)));
            console.error(e);
        }
    }, 2500);
}

function validateDeliveryForm() {
    const name = document.getElementById("delivery-name").value.trim();
    const phone = document.getElementById("delivery-phone").value.trim();
    const cep = document.getElementById("delivery-cep").value.trim();
    const street = document.getElementById("delivery-street").value.trim();
    const number = document.getElementById("delivery-number").value.trim();
    const neighborhood = document.getElementById("delivery-neighborhood").value.trim();
    const city = document.getElementById("delivery-city").value.trim();

    if (!name || !phone || !cep || !street || !number || !neighborhood || !city) {
        alert("Por favor, preencha todos os campos obrigatórios dos dados de entrega.");
        return false;
    }
    return true;
}

function getDeliveryFormData() {
    const cityStateStr = document.getElementById("delivery-city").value.trim();
    let city = cityStateStr;
    let uf = "SP"; // default fallback

    if (cityStateStr.includes("-")) {
        const parts = cityStateStr.split("-");
        city = parts[0].trim();
        uf = parts[1].trim();
    }

    return {
        name: document.getElementById("delivery-name").value.trim(),
        phone: document.getElementById("delivery-phone").value.trim(),
        cep: document.getElementById("delivery-cep").value.trim(),
        street: document.getElementById("delivery-street").value.trim(),
        number: document.getElementById("delivery-number").value.trim(),
        neighborhood: document.getElementById("delivery-neighborhood").value.trim(),
        city: city,
        uf: uf,
        complement: document.getElementById("delivery-complement").value.trim()
    };
}

async function saveOrderToDatabase(paymentMethod, paymentStatus) {
    if (!supabaseClient) {
        throw new Error("Supabase não disponível.");
    }

    const delivery = getDeliveryFormData();

    const orderPayload = {
        user_id: currentUser ? currentUser.id : null,
        payment_method: paymentMethod,
        payment_status: "Pendente",
        total_amount: grandTotal,
        shipping_fee: shippingFee,
        shipping_method: selectedShippingOption ? selectedShippingOption.name : "Envio",
        client_name: delivery.name,
        client_phone: delivery.phone,
        client_email: currentUser ? currentUser.email : "",
        cep: delivery.cep,
        street: delivery.street,
        number: delivery.number,
        neighborhood: delivery.neighborhood,
        city: delivery.city,
        uf: delivery.uf,
        complement: delivery.complement,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        discount_amount: discountAmount,
        subtotal: subtotal - discountAmount
    };

    const itemsPayload = cart.map(item => ({
        product_id: item.product.id,
        product_name: getItemDisplayName(item),
        quantity: item.quantity,
        price: getItemUnitPrice(item)
    }));

    const { data: orderId, error: orderError } = await supabaseClient.rpc("create_checkout_order", {
        order_data: orderPayload,
        items_data: itemsPayload
    });

    if (orderError) throw orderError;

    // If customer record doesn't exist, we can register/update them in customers too
    await saveCustomerDetails(delivery);

    return orderId;
}

async function saveCustomerDetails(delivery) {
    try {
        const cleanPhone = delivery.phone.replace(/\D/g, "");
        // Check if customer exists in client customers
        const { data } = await supabaseClient
            .from("customers")
            .select("id")
            .eq("phone", cleanPhone);

        if (data && data.length > 0) {
            // update details
            await supabaseClient
                .from("customers")
                .update({
                    name: delivery.name,
                    street: delivery.street,
                    number: delivery.number,
                    neighborhood: delivery.neighborhood,
                    city: `${delivery.city} - ${delivery.uf}`,
                    email: currentUser ? currentUser.email : null
                })
                .eq("phone", cleanPhone);
        } else {
            // insert details
            await supabaseClient
                .from("customers")
                .insert({
                    phone: cleanPhone,
                    name: delivery.name,
                    street: delivery.street,
                    number: delivery.number,
                    neighborhood: delivery.neighborhood,
                    city: `${delivery.city} - ${delivery.uf}`,
                    email: currentUser ? currentUser.email : null
                });
        }
    } catch (e) {
        console.warn("Falha ao salvar detalhes do cliente na tabela customers:", e);
    }
}

// Overlay Helpers
function showOverlay(title, desc) {
    processingOverlay.style.display = "flex";
    overlayLoader.style.display = "block";
    overlayCheckmark.style.display = "none";
    overlayStatusTitle.textContent = title;
    overlayStatusDesc.textContent = desc;
}

function showSuccessOverlay(title, desc) {
    overlayLoader.style.display = "none";
    overlayCheckmark.style.display = "block";
    overlayStatusTitle.textContent = title;
    overlayStatusDesc.textContent = desc;
}

function hideOverlay() {
    processingOverlay.style.display = "none";
}

// ==========================================================================
// MELHOR ENVIO SHIPPING INTEGRATION & CONTINGENCY FALLBACK
// ==========================================================================

async function updateShippingOptionsForCep(cep) {
    const cleanCep = cep.replace(/\D/g, "");
    const shippingGroup = document.getElementById("shipping-options-group");
    const shippingList = document.getElementById("shipping-options-list");
    
    if (cleanCep.length !== 8) {
        if (shippingGroup) shippingGroup.style.display = "none";
        selectedShippingOption = null;
        meShippingOptions = [];
        calculateManualShipping("");
        renderSummary();
        return;
    }

    // Regra manual por CEP tem PRIORIDADE sobre o Melhor Envio
    // (ex: entrega local grátis para São José do Rio Preto)
    const matchingRule = findShippingRuleForCep(cleanCep);
    if (matchingRule) {
        meShippingOptions = [{
            id: "rule-" + matchingRule.id,
            name: matchingRule.name || "Entrega Local",
            price: parseFloat(matchingRule.price),
            days: null,
            daysText: "Entrega local pela loja"
        }];
        selectedShippingOption = meShippingOptions[0];
        renderShippingOptionsUI();
        renderSummary();
        return;
    }

    if (!supabaseClient) {
        fallbackToManualShipping(cleanCep);
        return;
    }

    // Exibir indicador de carregamento
    if (shippingGroup && shippingList) {
        shippingGroup.style.display = "block";
        shippingList.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; color: var(--text-dark); font-size: 0.9rem; padding: 10px;">
                <i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-color);"></i>
                <span>Calculando opções de frete real...</span>
            </div>
        `;
    }

    try {
        const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

        const { data, error } = await supabaseClient.rpc("calculate_shipping", {
            from_cep: originCep,
            to_cep: cleanCep,
            items_count: itemsCount,
            total_value: subtotal
        });

        if (error || !data || data.error || !Array.isArray(data)) {
            console.warn("Melhor Envio falhou ou não configurado, usando contingência (regras manuais):", error || data?.error);
            fallbackToManualShipping(cleanCep);
            return;
        }

        // Filtrar opções válidas e remover as com erro ou de teste inválido
        const validOptions = data.filter(opt => !opt.error && opt.price !== undefined && opt.price !== null);

        if (validOptions.length === 0) {
            console.warn("Nenhuma opção de frete válida retornada pelo Melhor Envio.");
            fallbackToManualShipping(cleanCep);
            return;
        }

        const allOptions = validOptions.map(opt => {
            const companyName = (opt.company && opt.company.name) ? opt.company.name : "";
            const modalityName = opt.name === "Melhor Envio" ? "Envio Econômico" : opt.name;
            return {
                id: opt.id.toString(),
                company: companyName,
                // Ex: "Loggi Express", "Correios SEDEX", "Jadlog .Package"
                name: companyName ? `${companyName} ${modalityName}` : modalityName,
                price: parseFloat(opt.price),
                days: opt.delivery_time || opt.delivery_range?.max || 5
            };
        }).sort((a, b) => a.price - b.price);

        // Mostrar só as principais: a opção mais barata de cada transportadora (máx. 4)...
        const seenCompanies = new Set();
        meShippingOptions = allOptions.filter(o => {
            const key = o.company || o.name;
            if (seenCompanies.has(key)) return false;
            seenCompanies.add(key);
            return true;
        }).slice(0, 4);

        // ...e garantir que a opção MAIS RÁPIDA também apareça (ex: SEDEX)
        const fastest = [...allOptions].sort((a, b) => a.days - b.days)[0];
        if (fastest && !meShippingOptions.some(o => o.id === fastest.id)) {
            meShippingOptions.push(fastest);
        }
        meShippingOptions.sort((a, b) => a.price - b.price);

        // Selecionar por padrão a opção mais barata
        if (!selectedShippingOption || !meShippingOptions.some(opt => opt.id === selectedShippingOption.id)) {
            selectedShippingOption = meShippingOptions[0];
        }

        renderShippingOptionsUI();
        renderSummary();

    } catch (e) {
        console.error("Erro na cotação de frete:", e);
        fallbackToManualShipping(cleanCep);
    }
}

function fallbackToManualShipping(cep) {
    const shippingGroup = document.getElementById("shipping-options-group");
    if (shippingGroup) shippingGroup.style.display = "none";
    
    meShippingOptions = [];
    calculateManualShipping(cep);
    renderSummary();
}

// Encontra a regra de frete manual mais específica para um CEP (prefixo mais longo)
function findShippingRuleForCep(cep) {
    if (!cep || shippingRules.length === 0) return null;
    const sortedRules = [...shippingRules].sort((a, b) => b.cep_prefix.length - a.cep_prefix.length);
    return sortedRules.find(rule => cep.startsWith(rule.cep_prefix)) || null;
}

function calculateManualShipping(cep) {
    let matchedFee = defaultShippingFee;

    const matchingRule = findShippingRuleForCep(cep);
    if (matchingRule) {
        matchedFee = parseFloat(matchingRule.price);
    }
    
    selectedShippingOption = {
        id: "manual",
        name: "Frete",
        price: matchedFee,
        days: 5
    };
}

function renderShippingOptionsUI() {
    const shippingList = document.getElementById("shipping-options-list");
    if (!shippingList) return;
    
    shippingList.innerHTML = "";
    
    meShippingOptions.forEach(opt => {
        const isChecked = selectedShippingOption && selectedShippingOption.id === opt.id;
        const optPrice = freeShippingMinAmount > 0 && subtotal >= freeShippingMinAmount ? 0 : opt.price;
        const priceText = optPrice === 0 ? "Grátis" : `R$ ${optPrice.toFixed(2).replace('.', ',')}`;
        
        const div = document.createElement("div");
        div.style.cssText = `
            display: flex;
            align-items: center;
            padding: 12px 16px;
            border: 1px solid ${isChecked ? "var(--accent-color)" : "var(--border-color)"};
            background-color: ${isChecked ? "rgba(43, 108, 176, 0.04)" : "white"};
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        div.innerHTML = `
            <input type="radio" name="shipping_option" value="${opt.id}" ${isChecked ? "checked" : ""} style="width: auto; margin-right: 12px; cursor: pointer;">
            <div style="flex: 1;">
                <div style="font-weight: 700; color: var(--text-dark); font-size: 0.95rem;">${opt.name}</div>
                <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 2px;">${opt.daysText ? opt.daysText : `Prazo: ${opt.days} dias úteis`}</div>
            </div>
            <div style="font-weight: 800; color: ${optPrice === 0 ? "#2f855a" : "var(--text-dark)"}; font-size: 1rem;">${priceText}</div>
        `;
        
        div.addEventListener("click", () => {
            selectedShippingOption = opt;
            renderShippingOptionsUI();
            renderSummary();
        });
        
        const radio = div.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener("change", (e) => {
                e.stopPropagation();
                selectedShippingOption = opt;
                renderShippingOptionsUI();
                renderSummary();
            });
        }
        
        shippingList.appendChild(div);
    });
}

async function fetchAddressFromCep(cep) {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    
    try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        
        if (data.erro) {
            console.warn("CEP não encontrado no ViaCEP.");
            return;
        }
        
        const streetInput = document.getElementById("delivery-street");
        const neighborhoodInput = document.getElementById("delivery-neighborhood");
        const cityInput = document.getElementById("delivery-city");
        const numberInput = document.getElementById("delivery-number");
        
        if (streetInput && data.logradouro) streetInput.value = data.logradouro;
        if (neighborhoodInput && data.bairro) neighborhoodInput.value = data.bairro;
        if (cityInput && data.localidade && data.uf) {
            cityInput.value = `${data.localidade} - ${data.uf}`;
        }
        
        // Focar no input de número para agilizar a digitação
        if (numberInput) numberInput.focus();
        
    } catch (e) {
        console.error("Erro ao buscar CEP no ViaCEP:", e);
    }
}

// ==========================================================================
// COUPON VALIDATION & APPLICATION
// ==========================================================================

async function handleApplyCoupon() {
    const input = document.getElementById("coupon-input");
    const msg = document.getElementById("coupon-message");
    if (!input || !msg) return;

    const code = input.value.toUpperCase().trim();
    if (!code) {
        msg.style.display = "block";
        msg.style.color = "#E53E3E";
        msg.textContent = "Digite um código de cupom.";
        return;
    }

    if (!supabaseClient) {
        msg.style.display = "block";
        msg.style.color = "#E53E3E";
        msg.textContent = "Erro de conexão com o banco de dados.";
        return;
    }

    try {
        // Query active coupon
        const { data, error } = await supabaseClient
            .from("coupons")
            .select("*")
            .eq("code", code)
            .eq("is_active", true)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            msg.style.display = "block";
            msg.style.color = "#E53E3E";
            msg.textContent = "Cupom inválido ou expirado.";
            appliedCoupon = null;
            renderSummary();
            return;
        }

        // Validate minimum purchase
        if (subtotal < data.min_purchase) {
            msg.style.display = "block";
            msg.style.color = "#E53E3E";
            msg.textContent = `Este cupom requer uma compra mínima de R$ ${data.min_purchase.toFixed(2).replace('.', ',')}.`;
            appliedCoupon = null;
            renderSummary();
            return;
        }

        // Apply coupon successfully
        appliedCoupon = data;
        renderSummary();

        msg.style.display = "block";
        msg.style.color = "#48BB78";
        msg.textContent = `Cupom "${data.code}" aplicado com sucesso!`;
    } catch (e) {
        msg.style.display = "block";
        msg.style.color = "#E53E3E";
        msg.textContent = "Erro ao validar cupom: " + e.message;
        appliedCoupon = null;
        renderSummary();
    }
}

function getDiscountedItems() {
    let remainingDiscount = discountAmount; // in Reais
    
    const items = cart.map(item => {
        let itemPrice = getItemUnitPrice(item); // original price in Reais (variation-aware)
        let totalItemPrice = itemPrice * item.quantity;
        
        if (remainingDiscount > 0) {
            if (remainingDiscount >= totalItemPrice) {
                // Discount covers this entire item. Capped at 0.01 per quantity.
                const minPrice = 0.01 * item.quantity;
                remainingDiscount -= (totalItemPrice - minPrice);
                totalItemPrice = minPrice;
            } else {
                totalItemPrice -= remainingDiscount;
                remainingDiscount = 0;
            }
        }
        
        // Calculate unit price for this item
        const unitPrice = totalItemPrice / item.quantity;
        
        return {
            quantity: item.quantity,
            price: parseFloat(unitPrice.toFixed(2)),
            description: getItemDisplayName(item)
        };
    });

    // Se houver frete, adicioná-lo como um item separado para ser cobrado no InfinitePay
    if (shippingFee > 0) {
        items.push({
            quantity: 1,
            price: parseFloat(shippingFee.toFixed(2)),
            description: `Taxa de Entrega (${selectedShippingOption ? selectedShippingOption.name : "Envio"})`
        });
    }

    return items;
}


