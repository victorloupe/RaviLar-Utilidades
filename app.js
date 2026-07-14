// ==========================================================================
// SUPABASE CLIENT CONFIGURATION
// ==========================================================================
const supabaseUrl = "https://wbgdyheswfzgxaxvhugv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2R5aGVzd2Z6Z3hheHZodWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mzk1OTIsImV4cCI6MjA5OTUxNTU5Mn0.kvPoOJIoqHPpUfA3PFBPFuQ0yDALS1LOChd2bYCGoMs";

// Initialize Supabase Client
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// ==========================================================================
// FALLBACK PRODUCTS DATABASE (If Supabase is not configured yet)
// ==========================================================================
const FALLBACK_PRODUCTS = [
    {
        id: 1,
        name: "Forma Para Moldar Hamburguer Recheado 3 em 1",
        category: "cozinha",
        price: 25.30,
        image: [
            "https://www.utimix.com/wp-content/uploads/2023/05/oferta-forma-para-moldar-hamburguer-recheado-3-em-1.jpg",
            "https://www.utimix.com/wp-content/uploads/2023/05/oferta-forma-para-moldar-hamburguer-recheado-3-em-1-2.jpg",
            "https://www.utimix.com/wp-content/uploads/2023/05/oferta-forma-para-moldar-hamburguer-recheado-3-em-1-3.jpg",
            "https://www.utimix.com/wp-content/uploads/2023/05/oferta-forma-para-moldar-hamburguer-recheado-3-em-1-4.jpg",
            "https://www.utimix.com/wp-content/uploads/2023/05/oferta-forma-para-moldar-hamburguer-recheado-3-em-1-5.jpg",
            "https://www.utimix.com/wp-content/uploads/2023/05/oferta-forma-para-moldar-hamburguer-recheado-3-em-1-6.jpg"
        ],
        description: "Prepare hambúrgueres perfeitos e recheados em casa com esta forma prática 3 em 1. Feita com material resistente e fácil de limpar, molda hambúrgueres de diferentes tamanhos com acabamento profissional.",
        badge: "Destaque",
        rating: 4.8,
        reviews: 12
    },
    {
        id: 2,
        name: "Forma Para Air Fryer De Silicone Antiaderente - Sem Sujeira",
        category: "cozinha",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=600",
        description: "Chega de gordura encrostada na sua fritadeira! Esta forma de silicone flexível e antiaderente suporta altas temperaturas, facilita o manuseio dos alimentos e é super fácil de lavar. Reutilizável e ecológica.",
        badge: "Mais Vendido",
        rating: 4.9,
        reviews: 87
    },
    {
        id: 3,
        name: "Balança Cozinha Digital 10kg Alta Precision Dieta e Nutrição",
        category: "cozinha",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1603706125194-6d43e5c94297?auto=format&fit=crop&q=80&w=600",
        description: "Pese seus ingredientes com precisão cirúrgica de até 10kg. Ideal para receitas de panificação, controle de porções de dietas ou medições de precisão. Display digital de fácil leitura e função Tara.",
        badge: "Mais Vendido",
        rating: 4.8,
        reviews: 45
    },
    {
        id: 4,
        name: "Pratos de Sobremesa Plástico Coloridos com Base Organizadora Kit 10",
        category: "mesa-posta",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600",
        description: "Conjunto alegre com 10 pratos de sobremesa coloridos feitos em plástico resistente de alta qualidade. Acompanha base organizadora vertical para economizar espaço no armário e manter tudo no lugar.",
        badge: "Novidade",
        rating: 4.7,
        reviews: 16
    },
    {
        id: 5,
        name: "Suporte Organizador para 30 Ovos com Rolamento Automático",
        category: "organizacao",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=600",
        description: "Organizador de ovos inteligente de fluxo rolante. Comporta até 30 ovos que deslizam suavemente para a frente à medida que você retira o anterior. Design vertical compacto perfeito para geladeiras ou despensas.",
        badge: "Mais Vendido",
        rating: 4.9,
        reviews: 38
    },
    {
        id: 6,
        name: "Kit com 4 Potes Herméticos 150ml com Tampa e Travas para Lancheira",
        category: "organizacao",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1595348020949-87cdfcd44174?auto=format&fit=crop&q=80&w=600",
        description: "Perfeitos para lanches rápidos, molhos ou papinhas. Este conjunto vem com 4 potes herméticos de 150ml equipados com travas nas laterais e vedação de silicone que garante zero vazamento.",
        badge: "Novidade",
        rating: 4.6,
        reviews: 9
    },
    {
        id: 7,
        name: "Defletor de Ar Condicionado Split Direcionador de Vento Universal Ajustável",
        category: "organizacao",
        price: 17.99,
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
        description: "Evite o vento gelado direto no rosto ou corpo. Este direcionador de vento universal e ajustável é fácil de instalar em qualquer ar condicionado split sem necessidade de furos, melhorando a climatização do ambiente.",
        badge: "",
        rating: 4.5,
        reviews: 14
    },
    {
        id: 8,
        name: "Kit Medidor Culinário Colher Copo Em Aço Inox - 08 Peças",
        category: "cozinha",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=600",
        description: "Kit completo com 4 copos medidores e 4 colheres medidoras em aço inoxidável premium de alta durabilidade. As marcações gravadas garantem medidas perfeitas para que suas receitas saiam idênticas às profissionais.",
        badge: "Destaque",
        rating: 4.8,
        reviews: 22
    },
    {
        id: 9,
        name: "Cortador Multi Fatiador Nicer Alimentos e Frutas Cinza 13 em 1",
        category: "cozinha",
        price: 32.99,
        image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=600",
        description: "Economize tempo na cozinha! O fatiador e cortador multiuso 13 em 1 fatia, rala e corta legumes, verduras e frutas em diferentes formatos com precisão e segurança. Acompanha recipiente organizador de resíduos.",
        badge: "Destaque",
        rating: 4.7,
        reviews: 33
    },
    {
        id: 10,
        name: "Conjunto de Tigelas Potes de Inox com Tampa - 5 peças",
        category: "organizacao",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600",
        description: "Conjunto com 5 tigelas de aço inoxidável resistentes, ideais para misturar ingredientes, servir saladas ou guardar alimentos no refrigerador. Acompanha tampas flexíveis para vedação rápida e segura.",
        badge: "Oferta",
        rating: 4.6,
        reviews: 21
    },
    {
        id: 11,
        name: "Abajur Luminária Touch Sem Fio Cristal RGB 16 Cores",
        category: "decoracao",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
        description: "Adicione requinte e modernidade a qualquer espaço. Esta luminária em formato de cristal reflete belos efeitos visuais geométricos e oferece 16 cores selecionáveis por toque ou controle remoto. Bateria recarregável sem fio.",
        badge: "Mais Vendido",
        rating: 4.8,
        reviews: 56
    },
    {
        id: 12,
        name: "Luva Microfibra Macia Para Limpeza e Lavagem Automotiva",
        category: "organizacao",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600",
        description: "Ideal para limpar poeira de móveis ou lavar o carro sem riscar a lataria e vidros. Feita de microfibra de alta absorção que retém as partículas de sujeira com extrema suavidade.",
        badge: "",
        rating: 4.6,
        reviews: 12
    },
    {
        id: 13,
        name: "Utensílios De Cozinha Silicone com Fue - Kit c/ 5",
        category: "cozinha",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=600",
        description: "Kit essencial com 5 utensílios de silicone maciço que suportam altas temperaturas. Não arranham panelas antiaderentes e oferecem empunhadura confortável. Acompanha batedor de ovos (fue).",
        badge: "Oferta",
        rating: 4.7,
        reviews: 19
    },
    {
        id: 14,
        name: "Descascador de Legumes com Lâmina Afiada em Aço Inox",
        category: "cozinha",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600",
        description: "Descasque batatas, cenouras e abobrinhas em segundos com esta lâmina afiada em aço inox de movimento oscilante. Cabo ergonômico e encaixe lateral para remoção de imperfeições.",
        badge: "",
        rating: 4.5,
        reviews: 31
    },
    {
        id: 15,
        name: "Kit C/12 Utensílios De Cozinha Silicone Cabo Madeira",
        category: "cozinha",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=600",
        description: "Jogo de utensílios gourmet de 12 peças em silicone nobre e cabo de madeira tratada. Resistentes ao calor e de excelente empunhadura, acompanha balde organizador que dá um charme rústico à sua bancada.",
        badge: "Destaque",
        rating: 4.9,
        reviews: 14
    },
    {
        id: 16,
        name: "Kit de Tampas de Silicone Universal - 6 peças",
        category: "cozinha",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1595348020949-87cdfcd44174?auto=format&fit=crop&q=80&w=600",
        description: "Tampas elásticas de silicone que se adaptam a diferentes tamanhos de potes, tigelas, copos e até frutas cortadas. Vedação hermética perfeita que conserva o frescor dos alimentos.",
        badge: "Mais Vendido",
        rating: 4.7,
        reviews: 52
    },
    {
        id: 17,
        name: "Conjunto Colher Medidores Culinários 6 Medidas Cook Easy",
        category: "cozinha",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=600",
        description: "Faça receitas precisas com facilidade. Kit com 6 colheres medidoras empilháveis de plástico rígido. Excelente para confeitaria e dosagens culinárias rápidas.",
        badge: "",
        rating: 4.5,
        reviews: 8
    },
    {
        id: 18,
        name: "Adesivos Repelentes de Mosquitos Kit com 36",
        category: "organizacao",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600",
        description: "Mantenha mosquitos e insetos longe de crianças e bebês de forma natural e sem odor. Adesivos autocolantes com óleos essenciais naturais que podem ser colados em roupas, bonés ou carrinhos.",
        badge: "Novidade",
        rating: 4.6,
        reviews: 17
    },
    {
        id: 19,
        name: "Mini Mixer Misturador Batedor Ovos e Bebidas Elétrico Recarregável",
        category: "cozinha",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600",
        description: "Prepare espumas cremosas para café, bata ovos ou misture wheys em segundos. Este batedor elétrico recarregável de alta rotação possui carregamento USB e pontas removíveis intercambiáveis.",
        badge: "Destaque",
        rating: 4.8,
        reviews: 29
    },
    {
        id: 20,
        name: "Porta Sabonete Líquido Minimalista 300ml - Branco",
        category: "decoracao",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600",
        description: "Porta sabonete líquido ou loção com design minimalista escandinavo. Com capacidade para 300ml, seu acabamento em branco fosco traz leveza e sofisticação para banheiros ou lavabos.",
        badge: "",
        rating: 4.6,
        reviews: 5
    },
    {
        id: 21,
        name: "Processador Alimentos Manual 3 Lâminas Triturador",
        category: "cozinha",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=600",
        description: "Triture cebola, alho, temperos ou castanhas rapidamente puxando a corda retrátil. Equipado com 3 lâminas afiadas de aço inox e base antiderrapante para total estabilidade no manuseio.",
        badge: "Mais Vendido",
        rating: 4.9,
        reviews: 115
    },
    {
        id: 22,
        name: "Luminária De Mesa Touch Capivara",
        category: "decoracao",
        price: 26.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
        description: "Luminária noturna fofa em formato de capivara, feita em silicone macio ao toque. Possui controle de brilho por toque físico, luz quente aconchegante e bateria interna recarregável.",
        badge: "Novidade",
        rating: 4.9,
        reviews: 44
    },
    {
        id: 23,
        name: "Pistola Divertida De Bolhas Com 10 Saídas Bubble Gun",
        category: "decoracao",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
        description: "Gere milhares de bolhas de sabão por minuto com a incrível pistola de 10 saídas. Diversão garantida para festas de aniversário infantis ou brincadeiras ao ar livre no quintal.",
        badge: "",
        rating: 4.4,
        reviews: 23
    },
    {
        id: 24,
        name: "Conjunto Chave de Fenda Magnética 24 em 1 para Eletrônicos e Celulares",
        category: "organizacao",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
        description: "Estojo compacto de alumínio com 24 ponteiras de precisão magnéticas de alta resistência (aço S2). Ideal para abrir celulares, computadores, relógios, óculos ou pequenos eletrodomésticos.",
        badge: "Mais Vendido",
        rating: 4.8,
        reviews: 67
    },
    {
        id: 25,
        name: "Saca Rolha Tipo Borboleta Multiuso",
        category: "cozinha",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1602881917760-7379db593981?auto=format&fit=crop&q=80&w=600",
        description: "Abra garrafas de vinho sem esforço e com total elegância. Este saca-rolhas clássico tipo borboleta possui engrenagens robustas e abridor de garrafas integrado no topo.",
        badge: "",
        rating: 4.6,
        reviews: 12
    },
    {
        id: 26,
        name: "Adesivo Régua de Crescimento Infantil para Parede",
        category: "decoracao",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
        description: "Acompanhe o crescimento dos pequenos de forma lúdica. Adesivo autocolante com régua de altura e ilustrações decorativas. Fácil aplicação e remoção sem danificar a pintura da parede.",
        badge: "Novidade",
        rating: 4.5,
        reviews: 9
    },
    {
        id: 27,
        name: "Galheteiro de Vidro 500ml com Bico Dosador para Azeite Óleo e Vinagre",
        category: "mesa-posta",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
        description: "Garrafa de vidro borossilicato de 500ml com tampa inteligente de bico dosador corta-gotas de inox. Ideal para conservar e servir azeites, vinagres ou molhos à mesa com total higiene.",
        badge: "Novidade",
        rating: 4.7,
        reviews: 11
    },
    {
        id: 28,
        name: "Luminária Lâmpada Infantil Silicone Pato Recarregável",
        category: "decoracao",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
        description: "Luminária decorativa em silicone macio BPA-free com design de patinho. Toque para acender ou mudar a intensidade da luz. Possui timer de desligamento automático de 30 minutos.",
        badge: "Destaque",
        rating: 4.8,
        reviews: 19
    },
    {
        id: 29,
        name: "Manta Cobertor Infantil Mágico Brilha No Escuro",
        category: "decoracao",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=600",
        description: "Manta super macia e aconchegante com estampas divertidas de estrelas que carregam sob a luz e brilham no escuro. Proporcione noites mais tranquilas e divertidas para as crianças.",
        badge: "Destaque",
        rating: 4.9,
        reviews: 15
    },
    {
        id: 30,
        name: "Dispenser Detergente 2 em 1 Esponja Limpeza Louça Dosador",
        category: "cozinha",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600",
        description: "Otimize a pia da cozinha! Este dispenser dosador comporta detergente líquido no reservatório inferior e organiza a esponja na parte superior. Pressione para dosar o sabão direto na esponja sem desperdício.",
        badge: "Mais Vendido",
        rating: 4.7,
        reviews: 63
    }
];

// Active Products Array (Loaded dynamically from database)
let PRODUCTS = [];

// WhatsApp Shop Configuration
const SHOP_WHATSAPP_NUMBER = "5517996371743"; // Substituir pelo número real da loja RaviLar

// ==========================================================================
// APPLICATION STATE
// ==========================================================================
let cart = [];
let activeFilter = "all";
let searchQuery = "";
let sortBy = "default";
let currentProduct = null;
let modalQuantity = 1;
let currentPage = 1;
const PRODUCTS_PER_PAGE = 10;

// Dynamic Categories Arrays
let CATEGORIES = [];

// Hero Banner Slider Arrays
let bannerSlides = [];
let currentSlideIndex = 0;
let slideInterval = null;

// Circular Testimonials Array & State
let testimonialsList = [];
let activeTestimonialIndex = 0;
let testimonialInterval = null;
const FALLBACK_TESTIMONIALS = [
  {
    quote: "Os potes herméticos são maravilhosos! A vedação é perfeita e deixou a minha despensa super organizada e linda. O atendimento foi excelente!",
    name: "Mariana Sousa",
    image: "https://images.unsplash.com/photo-1595348020949-87cdfcd44174?auto=format&fit=crop&q=80&w=400",
    productId: 6
  },
  {
    quote: "Comprei o kit de utensílios de silicone e me surpreendi com a qualidade. Eles não riscam as panelas e o cabo em bambu dá um charme especial na cozinha.",
    name: "Ricardo Ferreira",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&q=80&w=400",
    productId: 15
  },
  {
    quote: "Amei o galheteiro de vidro borossilicato! Super higiênico, não escorre azeite na garrafa e fica lindo na mesa do almoço.",
    name: "Ana Oliveira",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400",
    productId: 27
  }
];
const FALLBACK_CATEGORIES = [
    { name: "Cozinha", slug: "cozinha", image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=400" },
    { name: "Organização", slug: "organizacao", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400" },
    { name: "Mesa Posta", slug: "mesa-posta", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400" },
    { name: "Decoração", slug: "decoracao", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400" }
];

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("product-search");
const sortSelect = document.getElementById("product-sort");

const cartTrigger = document.getElementById("cart-trigger");
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerClose = document.getElementById("cart-drawer-close");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartBadge = document.getElementById("cart-badge");
const cartContinueShopping = document.getElementById("cart-continue-shopping");
const checkoutTriggerBtn = document.getElementById("checkout-trigger-btn");

const productModal = document.getElementById("product-modal");
const productModalClose = document.getElementById("product-modal-close");
const modalProductImg = document.getElementById("modal-product-img");
const modalProductCat = document.getElementById("modal-product-cat");
const modalProductName = document.getElementById("modal-product-name");
const modalProductPrice = document.getElementById("modal-product-price");
const modalProductDesc = document.getElementById("modal-product-desc");
const qtyMinusBtn = document.getElementById("qty-minus");
const qtyPlusBtn = document.getElementById("qty-plus");
const qtyVal = document.getElementById("qty-val");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");

const checkoutModal = document.getElementById("checkout-modal");
const checkoutModalClose = document.getElementById("checkout-modal-close");
const checkoutForm = document.getElementById("checkout-form");

const contactForm = document.getElementById("contact-form");
const formSuccessMsg = document.getElementById("form-success-msg");

const menuMobileTrigger = document.getElementById("menu-mobile-trigger");
const mainNav = document.getElementById("main-nav");
const header = document.getElementById("header");

// ==========================================================================
// CORE FUNCTIONS
// ==========================================================================

// Initialization
async function init() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("ravilar_cart");
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    
    // Load categories first
    await loadCategories();
    
    // Load products from Supabase
    await loadProducts();

    // Load header banners slider
    await loadBanners();

    // Initialize circular testimonials slider
    initTestimonialsSlider();

    // Bind Event Listeners
    bindEvents();
    
    // Update cart UI badge & contents
    updateCartUI();
}

// Circular Testimonials Logic
function calculateTestimonialGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

function getTestimonialImageStyle(index, activeIndex, testimonialsLength, containerWidth) {
    const gap = calculateTestimonialGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const offset = (index - activeIndex + testimonialsLength) % testimonialsLength;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    
    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: `translateX(0px) translateY(0px) scale(0.5) rotateY(0deg)`,
    };
}

async function loadTestimonials() {
    if (!supabaseClient) {
        testimonialsList = FALLBACK_TESTIMONIALS;
        renderTestimonialsSlider();
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("reviews")
            .select("id, name, quote, rating, product_id, products(id, name, image)")
            .order("id", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            testimonialsList = data.map(item => {
                let imgUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400";
                let productId = null;
                if (item.products) {
                    productId = item.products.id;
                    try {
                        const media = JSON.parse(item.products.image);
                        if (media && media.length > 0) {
                            imgUrl = media[0];
                        }
                    } catch (e) {
                        imgUrl = item.products.image;
                    }
                }
                return {
                    id: item.id,
                    name: item.name,
                    quote: item.quote,
                    rating: item.rating || 5,
                    productId: productId,
                    image: imgUrl
                };
            });
        } else {
            testimonialsList = FALLBACK_TESTIMONIALS;
        }
    } catch (err) {
        console.error("Erro ao carregar depoimentos do Supabase:", err.message);
        testimonialsList = FALLBACK_TESTIMONIALS;
    }

    renderTestimonialsSlider();
}

function initTestimonialsSlider() {
    // Bind navigation click handlers
    const prevBtn = document.getElementById("ct-prev-btn");
    const nextBtn = document.getElementById("ct-next-btn");
    const linkBtn = document.getElementById("ct-product-link-btn");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (testimonialInterval) clearInterval(testimonialInterval);
            activeTestimonialIndex = (activeTestimonialIndex - 1 + testimonialsList.length) % testimonialsList.length;
            updateTestimonialsSlider();
            startTestimonialsAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (testimonialInterval) clearInterval(testimonialInterval);
            activeTestimonialIndex = (activeTestimonialIndex + 1) % testimonialsList.length;
            updateTestimonialsSlider();
            startTestimonialsAutoplay();
        });
    }

    if (linkBtn) {
        linkBtn.addEventListener("click", () => {
            const activeTestimonial = testimonialsList[activeTestimonialIndex];
            if (activeTestimonial && activeTestimonial.productId) {
                openProductModal(activeTestimonial.productId);
            }
        });
    }

    // Window resize handler
    window.addEventListener("resize", () => {
        updateTestimonialsSlider();
    });

    loadTestimonials();
}

function renderTestimonialsSlider() {
    const container = document.getElementById("ct-images-container");
    if (!container || testimonialsList.length === 0) return;

    // Render image elements
    container.innerHTML = "";
    testimonialsList.forEach((t, idx) => {
        const img = document.createElement("img");
        img.src = t.image;
        img.alt = t.name;
        img.className = "ct-image";
        
        // Clicking on the product image also opens the product modal!
        img.addEventListener("click", () => {
            if (t.productId) {
                openProductModal(t.productId);
            }
        });
        
        container.appendChild(img);
    });

    updateTestimonialsSlider();
    startTestimonialsAutoplay();
}

function startTestimonialsAutoplay() {
    if (testimonialsList.length <= 1) return;
    if (testimonialInterval) clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
        activeTestimonialIndex = (activeTestimonialIndex + 1) % testimonialsList.length;
        updateTestimonialsSlider();
    }, 6000);
}

function updateTestimonialsSlider() {
    const container = document.getElementById("ct-images-container");
    if (!container || testimonialsList.length === 0) return;

    const width = container.offsetWidth || 1200;
    const images = container.querySelectorAll(".ct-image");
    const testimonialsLength = testimonialsList.length;

    images.forEach((img, index) => {
        const style = getTestimonialImageStyle(index, activeTestimonialIndex, testimonialsLength, width);
        img.style.zIndex = style.zIndex;
        img.style.opacity = style.opacity;
        img.style.pointerEvents = style.pointerEvents;
        img.style.transform = style.transform;
    });

    // Update text data
    const activeTestimonial = testimonialsList[activeTestimonialIndex];
    const nameEl = document.getElementById("ct-user-name");
    const quoteEl = document.getElementById("ct-user-quote");
    const linkContainer = document.getElementById("ct-product-link-container");

    if (nameEl) nameEl.textContent = activeTestimonial.name;
    
    // Hide or show the product link button depending on whether the review has a product associated
    if (linkContainer) {
        if (activeTestimonial.productId) {
            linkContainer.style.display = "block";
        } else {
            linkContainer.style.display = "none";
        }
    }

    // Word by word fade in animation
    if (quoteEl) {
        quoteEl.innerHTML = "";
        activeTestimonial.quote.split(" ").forEach((word, i) => {
            const span = document.createElement("span");
            span.innerHTML = word + "&nbsp;";
            span.style.display = "inline-block";
            span.style.opacity = "0";
            span.style.filter = "blur(10px)";
            span.style.transform = "translateY(5px)";
            span.style.transition = `opacity 0.22s ease-in-out ${0.025 * i}s, filter 0.22s ease-in-out ${0.025 * i}s, transform 0.22s ease-in-out ${0.025 * i}s`;
            
            quoteEl.appendChild(span);

            setTimeout(() => {
                span.style.opacity = "1";
                span.style.filter = "blur(0px)";
                span.style.transform = "translateY(0px)";
            }, 20);
        });
    }
}

// Load banners from database
async function loadBanners() {
    const defaultBanners = [
        { image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800", title: "Design Premium", subtitle: "Qualidade selecionada" },
        { image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800", title: "Praticidade", subtitle: "Organizadores inteligentes" },
        { image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", title: "Mesa Posta", subtitle: "Requinte nas refeições" }
    ];

    if (!supabaseClient) {
        bannerSlides = defaultBanners;
        initHero3DCarousel();
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("banners")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            bannerSlides = data;
        } else {
            bannerSlides = defaultBanners;
        }
    } catch (err) {
        console.error("Erro ao carregar banners do Supabase:", err.message);
        bannerSlides = defaultBanners;
    }

    initHero3DCarousel();
}

function initHero3DCarousel() {
    const wrapper = document.getElementById("hero-3d-carousel");
    if (!wrapper) return;

    // Render 3D cards
    wrapper.innerHTML = "";
    bannerSlides.forEach(banner => {
        const card = document.createElement("div");
        card.className = "hero-carousel-card";
        card.innerHTML = `
            <img src="${banner.image}" alt="${banner.title}">
            <div class="hero-carousel-card-overlay">
                <h4>${banner.title}</h4>
                <p>${banner.subtitle}</p>
            </div>
        `;
        wrapper.appendChild(card);
    });

    // Bind controls
    const prevBtn = document.getElementById("hero-carousel-prev");
    const nextBtn = document.getElementById("hero-carousel-next");

    if (prevBtn) {
        prevBtn.onclick = () => {
            if (slideInterval) clearInterval(slideInterval);
            currentSlideIndex = (currentSlideIndex - 1 + bannerSlides.length) % bannerSlides.length;
            updateHero3DCarousel();
            startBannerSlider();
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            if (slideInterval) clearInterval(slideInterval);
            currentSlideIndex = (currentSlideIndex + 1) % bannerSlides.length;
            updateHero3DCarousel();
            startBannerSlider();
        };
    }

    // Swipe support for mobile
    let touchstartX = 0;
    let touchendX = 0;

    if (wrapper) {
        wrapper.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        wrapper.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchendX < touchstartX - threshold) {
                if (slideInterval) clearInterval(slideInterval);
                currentSlideIndex = (currentSlideIndex + 1) % bannerSlides.length;
                updateHero3DCarousel();
                startBannerSlider();
            }
            if (touchendX > touchstartX + threshold) {
                if (slideInterval) clearInterval(slideInterval);
                currentSlideIndex = (currentSlideIndex - 1 + bannerSlides.length) % bannerSlides.length;
                updateHero3DCarousel();
                startBannerSlider();
            }
        }, { passive: true });
    }

    updateHero3DCarousel();
    startBannerSlider();
}

function updateHero3DCarousel() {
    const wrapper = document.getElementById("hero-3d-carousel");
    if (!wrapper || bannerSlides.length === 0) return;

    const cards = wrapper.querySelectorAll(".hero-carousel-card");
    const total = bannerSlides.length;

    cards.forEach((card, index) => {
        let offset = index - currentSlideIndex;
        let pos = (offset + total) % total;
        if (pos > Math.floor(total / 2)) {
            pos = pos - total;
        }

        const isCenter = pos === 0;
        const isAdjacent = Math.abs(pos) === 1;

        const scale = isCenter ? 1 : (isAdjacent ? 0.85 : 0.7);
        const rotateY = pos * -10;
        const translateX = pos * 45; // percentage
        const zIndex = isCenter ? 10 : (isAdjacent ? 5 : 1);
        const opacity = isCenter ? 1 : (isAdjacent ? 0.45 : 0);
        const filter = isCenter ? 'blur(0px)' : 'blur(4px)';
        const visibility = Math.abs(pos) > 1 ? 'hidden' : 'visible';

        card.style.transform = `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
        card.style.filter = filter;
        card.style.visibility = visibility;

        if (isCenter) {
            card.classList.add("active");
        } else {
            card.classList.remove("active");
        }
    });
}

// Start auto transitioning slides rotation loop
function startBannerSlider() {
    if (bannerSlides.length <= 1) return;

    if (slideInterval) clearInterval(slideInterval);

    slideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % bannerSlides.length;
        updateHero3DCarousel();
    }, 4000);
}

// Load categories from database
async function loadCategories() {
    if (!supabaseClient) {
        console.warn("Supabase não carregado. Utilizando categorias locais (fallback).");
        CATEGORIES = FALLBACK_CATEGORIES;
        renderCategories();
        renderCategoryFilters();
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from("categories")
            .select("*")
            .order("id", { ascending: true });
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            CATEGORIES = data;
        } else {
            console.warn("Tabela 'categories' vazia. Usando categorias padrão.");
            CATEGORIES = FALLBACK_CATEGORIES;
        }
    } catch (err) {
        console.error("Falha ao carregar categorias do Supabase:", err.message);
        CATEGORIES = FALLBACK_CATEGORIES;
    }
    
    renderCategories();
    renderCategoryFilters();
}

// Render category cards on Homepage
function renderCategories() {
    const grid = document.getElementById("categories-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    CATEGORIES.forEach(cat => {
        const cardHTML = `
            <div class="category-card" data-category="${cat.slug}">
                <div class="category-img-container">
                    <img src="${cat.image}" alt="${cat.name}" loading="lazy">
                </div>
                <div class="category-info">
                    <h3>${cat.name}</h3>
                    <span>Ver itens <i class="fa-solid fa-chevron-right"></i></span>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML("beforeend", cardHTML);
    });
    
    // Bind event listeners to new cards
    const cards = grid.querySelectorAll(".category-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const cat = card.getAttribute("data-category");
            activeFilter = cat;
            currentPage = 1;
            
            // Sync filter buttons active states
            const filterContainer = document.getElementById("filter-categories");
            if (filterContainer) {
                filterContainer.querySelectorAll(".filter-btn").forEach(b => {
                    if (b.getAttribute("data-filter") === cat) {
                        b.classList.add("active");
                    } else {
                        b.classList.remove("active");
                    }
                });
            }
            
            renderProducts();
            
            // Scroll smoothly to products section
            const target = document.getElementById("produtos");
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

// Render dynamic catalog filters toolbar buttons
function renderCategoryFilters() {
    const container = document.getElementById("filter-categories");
    if (!container) return;
    
    container.innerHTML = "";
    
    // Add "Todos" button first
    let buttonsHTML = `<button class="filter-btn active" data-filter="all">Todos</button>`;
    
    CATEGORIES.forEach(cat => {
        buttonsHTML += `<button class="filter-btn" data-filter="${cat.slug}">${cat.name}</button>`;
    });
    
    container.innerHTML = buttonsHTML;
    
    // Bind click events on filter buttons
    const filterButtons = container.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            activeFilter = e.currentTarget.getAttribute("data-filter");
            currentPage = 1;
            renderProducts();
        });
    });
}

// Fetch products from database
async function loadProducts() {
    if (!supabaseClient) {
        console.warn("Supabase não carregado. Utilizando banco local (fallback).");
        PRODUCTS = FALLBACK_PRODUCTS;
        renderProducts();
        return;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true });
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            PRODUCTS = data;
        } else {
            console.warn("Tabela 'products' vazia no Supabase. Usando catálogo local de demonstração.");
            PRODUCTS = FALLBACK_PRODUCTS;
        }
    } catch (err) {
        console.error("Falha ao se conectar com Supabase:", err.message);
        console.warn("Carregando catálogo de demonstração offline.");
        PRODUCTS = FALLBACK_PRODUCTS;
    }
    
    renderProducts();
}

// Bind Events
function bindEvents() {
    // Scroll header styling
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Mobile Menu Toggle
    menuMobileTrigger.addEventListener("click", () => {
        mainNav.classList.toggle("open");
        const icon = menuMobileTrigger.querySelector("i");
        if (mainNav.classList.contains("open")) {
            icon.className = "fa-solid fa-xmark";
        } else {
            icon.className = "fa-solid fa-bars";
        }
    });

    // Close mobile nav on link click
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            navLinks.forEach(l => l.classList.remove("active"));
            e.currentTarget.classList.add("active");
            mainNav.classList.remove("open");
            const icon = menuMobileTrigger.querySelector("i");
            if (icon) icon.className = "fa-solid fa-bars";
        });
    });

    // Search input handler
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        currentPage = 1;
        renderProducts();
    });

    // Sort select handler
    sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        currentPage = 1;
        renderProducts();
    });



    // Cart opening/closing
    cartTrigger.addEventListener("click", openCart);
    cartDrawerClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", () => {
        closeCart();
        closeProductModal();
        closeCheckoutModal();
    });
    cartContinueShopping.addEventListener("click", closeCart);

    // Checkout Trigger
    checkoutTriggerBtn.addEventListener("click", () => {
        closeCart();
        openCheckoutModal();
    });

    // Modal Close handlers
    productModalClose.addEventListener("click", closeProductModal);
    checkoutModalClose.addEventListener("click", closeCheckoutModal);

    // Quantity selectors in Modal
    qtyMinusBtn.addEventListener("click", () => {
        if (modalQuantity > 1) {
            modalQuantity--;
            qtyVal.textContent = modalQuantity;
        }
    });

    qtyPlusBtn.addEventListener("click", () => {
        modalQuantity++;
        qtyVal.textContent = modalQuantity;
    });

    // Modal Add To Cart
    modalAddToCartBtn.addEventListener("click", () => {
        if (currentProduct) {
            addToCart(currentProduct.id, modalQuantity);
            closeProductModal();
        }
    });

    // Checkout Form Submit (WhatsApp redirect)
    checkoutForm.addEventListener("submit", submitCheckout);

    // Auto-fill customer details from phone number on blur/change
    const checkoutPhone = document.getElementById("checkout-phone");
    if (checkoutPhone) {
        checkoutPhone.addEventListener("blur", handlePhoneBlur);
        checkoutPhone.addEventListener("input", formatPhoneInput);
    }

    // Contact Form Submit
    if (contactForm) {
        contactForm.addEventListener("submit", submitContactForm);
    }
}

// ==========================================================================
// CART OPERATIONS
// ==========================================================================

function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden"; // Disable scroll behind
}

function closeCart() {
    cartDrawer.classList.remove("open");
    if (!productModal.classList.contains("open") && !checkoutModal.classList.contains("open")) {
        cartOverlay.classList.remove("open");
        document.body.style.overflow = "";
    }
}

function openCheckoutModal() {
    checkoutModal.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
    checkoutModal.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
    
    // Clear phone search status message
    const phoneStatus = document.getElementById("checkout-phone-status");
    if (phoneStatus) {
        phoneStatus.style.display = "none";
        phoneStatus.textContent = "";
    }
}

function updateCartUI() {
    // Clear items list
    const cartItems = cartItemsContainer.querySelectorAll(".cart-item");
    cartItems.forEach(item => item.remove());
    
    const emptyMsg = cartItemsContainer.querySelector(".empty-cart-message");
    
    if (cart.length === 0) {
        emptyMsg.style.display = "block";
        checkoutTriggerBtn.disabled = true;
    } else {
        emptyMsg.style.display = "none";
        checkoutTriggerBtn.disabled = false;
        
        // Append current cart items
        cart.forEach(item => {
            const mediaList = getProductMedia(item.product.image);
            const firstImg = mediaList[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600';
            
            const itemHTML = `
                <div class="cart-item" data-id="${item.product.id}">
                    <img src="${firstImg}" alt="${item.product.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.product.name}</h4>
                        <div class="cart-item-price">R$ ${item.product.price.toFixed(2).replace('.', ',')}</div>
                        <div class="cart-item-controls">
                            <div class="cart-item-qty">
                                <button class="cart-qty-btn cart-minus" aria-label="Diminuir quantidade"><i class="fa-solid fa-minus"></i></button>
                                <span class="cart-qty-val">${item.quantity}</span>
                                <button class="cart-qty-btn cart-plus" aria-label="Aumentar quantidade"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <button class="cart-item-remove" aria-label="Remover item"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
        });
        
        // Bind dynamic buttons inside cart list
        bindCartItemButtons();
    }
    
    // Update Totals & Badge
    const totals = calculateCartTotals();
    cartSubtotal.textContent = `R$ ${totals.subtotal.toFixed(2).replace('.', ',')}`;
    cartBadge.textContent = totals.itemCount;
    
    // Show badge only if count > 0
    if (totals.itemCount > 0) {
        cartBadge.style.display = "flex";
    } else {
        cartBadge.style.display = "none";
    }
}

function bindCartItemButtons() {
    const items = cartItemsContainer.querySelectorAll(".cart-item");
    items.forEach(item => {
        const id = parseInt(item.getAttribute("data-id"));
        
        item.querySelector(".cart-minus").addEventListener("click", () => {
            updateQuantity(id, -1);
        });
        
        item.querySelector(".cart-plus").addEventListener("click", () => {
            updateQuantity(id, 1);
        });
        
        item.querySelector(".cart-item-remove").addEventListener("click", () => {
            removeFromCart(id);
        });
    });
}

function addToCart(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.product.id === productId);
    
    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            product: product,
            quantity: qty
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Smooth transition: open cart drawer to show item added
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.product.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function calculateCartTotals() {
    let itemCount = 0;
    let subtotal = 0;
    
    cart.forEach(item => {
        itemCount += item.quantity;
        subtotal += item.product.price * item.quantity;
    });
    
    return { itemCount, subtotal };
}

// Save Cart
function saveCart() {
    localStorage.setItem("ravilar_cart", JSON.stringify(cart));
}

// ==========================================================================
// PRODUCT CATALOG FUNCTIONS
// ==========================================================================

// Helper to get media array from the image field (handles both JSON array and old string formats)
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

function renderProducts() {
    // 1. Filter Products
    let filtered = PRODUCTS.filter(p => {
        const matchesCategory = (activeFilter === "all" || p.category === activeFilter);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                              p.description.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });
    
    // 2. Sort Products
    if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    // 3. Paginate Products
    const totalItems = filtered.length;
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginatedProducts = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    // 4. Render HTML
    productsGrid.innerHTML = "";
    
    if (paginatedProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="loading-products">
                <i class="fa-solid fa-face-frown-open"></i>
                <p>Nenhum produto encontrado correspondente aos filtros.</p>
            </div>
        `;
        document.getElementById("catalog-pagination").innerHTML = "";
        return;
    }
    
    paginatedProducts.forEach(p => {
        const badgeHTML = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";
        const priceHTML = `R$ ${p.price.toFixed(2).replace('.', ',')}`;
        
        // Use first image of media list for catalog display thumbnail
        const mediaList = getProductMedia(p.image);
        const firstMedia = mediaList[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600';
        
        const cardHTML = `
            <div class="product-card" data-id="${p.id}">
                ${badgeHTML}
                <div class="product-img-wrapper">
                    <img src="${firstMedia}" alt="${p.name}" loading="lazy">
                    <div class="product-actions-overlay">
                        <button class="btn-icon btn-view-details" title="Visualizar Detalhes"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn-icon btn-quick-add" title="Adicionar ao Carrinho"><i class="fa-solid fa-cart-plus"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-cat">${p.category.replace('-', ' ')}</span>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <span>(${p.reviews || 0})</span>
                    </div>
                    <div class="product-price-action">
                        <div class="product-price">${priceHTML}</div>
                        <button class="add-cart-btn-card btn-card-add" aria-label="Adicionar ao carrinho"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
    
    // Bind click events on new product cards
    bindProductCardEvents();

    // Render pagination controls
    renderPagination(totalItems);
}

function renderPagination(totalItems) {
    const paginationContainer = document.getElementById("catalog-pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = "";
        return;
    }

    let paginationHTML = "";

    // Anterior button
    paginationHTML += `
        <button class="pagination-btn pagination-arrow" ${currentPage === 1 ? 'disabled' : ''} id="prev-page" aria-label="Página anterior">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    // Próximo button
    paginationHTML += `
        <button class="pagination-btn pagination-arrow" ${currentPage === totalPages ? 'disabled' : ''} id="next-page" aria-label="Próxima página">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Bind event listeners
    const pageButtons = paginationContainer.querySelectorAll(".pagination-btn");
    pageButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.id === "prev-page") {
                if (currentPage > 1) currentPage--;
            } else if (btn.id === "next-page") {
                if (currentPage < totalPages) currentPage++;
            } else {
                currentPage = parseInt(btn.getAttribute("data-page"));
            }

            renderProducts();
            
            // Scroll smoothly to catalog header
            const catalogHeader = document.getElementById("produtos");
            if (catalogHeader) {
                catalogHeader.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

function bindProductCardEvents() {
    const cards = productsGrid.querySelectorAll(".product-card");
    cards.forEach(card => {
        const id = parseInt(card.getAttribute("data-id"));
        
        // Add to cart from quick icon
        card.querySelector(".btn-quick-add").addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(id, 1);
        });

        // Add to cart from plus icon button
        card.querySelector(".btn-card-add").addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(id, 1);
        });
        
        // Open details modal
        card.querySelector(".btn-view-details").addEventListener("click", () => {
            openProductModal(id);
        });

        // Open details modal by clicking anywhere on the card (except action buttons)
        card.addEventListener("click", (e) => {
            if (!e.target.closest("button")) {
                openProductModal(id);
            }
        });
    });
}

// Details Modal
function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    modalQuantity = 1;
    qtyVal.textContent = modalQuantity;
    
    modalProductCat.textContent = product.category.replace('-', ' ');
    modalProductName.textContent = product.name;
    modalProductPrice.textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    modalProductDesc.textContent = product.description;
    
    // Media gallery setup
    const media = getProductMedia(product.image);
    const mainContainer = document.getElementById("gallery-main-container");
    const thumbsContainer = document.getElementById("gallery-thumbs-container");
    
    // Clear containers
    mainContainer.innerHTML = "";
    thumbsContainer.innerHTML = "";
    
    if (media.length === 0) {
        mainContainer.innerHTML = `<img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600" alt="Sem Imagem">`;
    } else {
        // Function to set the main media item
        const setMainMedia = (url) => {
            mainContainer.innerHTML = "";
            if (url.toLowerCase().endsWith(".mp4")) {
                mainContainer.innerHTML = `
                    <video src="${url}" controls autoplay muted class="modal-product-media" style="width:100%; height:100%; object-fit:cover;"></video>
                `;
            } else {
                mainContainer.innerHTML = `
                    <img id="modal-product-img" src="${url}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">
                `;
            }
        };

        // Render first media as main
        setMainMedia(media[0]);
        
        // Render thumbnails
        media.forEach((url, index) => {
            const isVideo = url.toLowerCase().endsWith(".mp4");
            const thumbItem = document.createElement("div");
            thumbItem.className = `gallery-thumb-item ${index === 0 ? 'active' : ''}`;
            
            if (isVideo) {
                thumbItem.innerHTML = `
                    <video src="${url}" muted preload="metadata"></video>
                    <div class="thumb-video-badge"><i class="fa-solid fa-play"></i></div>
                `;
            } else {
                thumbItem.innerHTML = `<img src="${url}" alt="Thumbnail ${index + 1}">`;
            }
            
            thumbItem.addEventListener("click", () => {
                // Update active class
                thumbsContainer.querySelectorAll(".gallery-thumb-item").forEach(t => t.classList.remove("active"));
                thumbItem.classList.add("active");
                setMainMedia(url);
            });
            
            thumbsContainer.appendChild(thumbItem);
        });
    }
    
    productModal.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

// Close Modal
function closeProductModal() {
    productModal.classList.remove("open");
    if (!cartDrawer.classList.contains("open") && !checkoutModal.classList.contains("open")) {
        cartOverlay.classList.remove("open");
        document.body.style.overflow = "";
    }
    currentProduct = null;
}

// ==========================================================================
// SUBMISSIONS & CHECKOUT
// ==========================================================================

function submitContactForm(e) {
    e.preventDefault();
    
    // Simulate API call success
    formSuccessMsg.classList.remove("hide");
    contactForm.reset();
    
    setTimeout(() => {
        formSuccessMsg.classList.add("hide");
    }, 5000);
}

function submitCheckout(e) {
    e.preventDefault();
    
    const clientName = document.getElementById("checkout-name").value.trim();
    const clientPhone = document.getElementById("checkout-phone").value.trim();
    const street = document.getElementById("checkout-street").value.trim();
    const number = document.getElementById("checkout-number").value.trim();
    const neighborhood = document.getElementById("checkout-neighborhood").value.trim();
    const city = document.getElementById("checkout-city").value.trim();
    const paymentMethod = document.getElementById("checkout-payment").value;
    
    if (!clientName || !clientPhone || !street || !number || !neighborhood || !city || !paymentMethod) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    
    // 1. Format Cart Items list for the message
    let itemsText = "";
    let total = 0;
    
    cart.forEach(item => {
        const itemSubtotal = item.product.price * item.quantity;
        total += itemSubtotal;
        itemsText += `• ${item.quantity}x ${item.product.name} (R$ ${item.product.price.toFixed(2).replace('.', ',')} c/u)\n`;
    });
    
    // 2. Build full message text
    const divider = "----------------------------------";
    const textMsg = 
`🛒 *Novo Pedido - RaviLar Utilidades*

*Cliente:* ${clientName}
*WhatsApp:* ${clientPhone}
*Forma de Pagamento:* ${paymentMethod}

*Endereço de Entrega:*
Rua/Av: ${street}, Nº ${number}
Bairro: ${neighborhood}
Cidade: ${city}

${divider}
*Itens do Pedido:*
${itemsText}
*Subtotal:* R$ ${total.toFixed(2).replace('.', ',')}
*Taxa de entrega:* A combinar
*Total:* R$ ${total.toFixed(2).replace('.', ',')}
${divider}

Olá RaviLar, gostaria de confirmar o pedido acima!`;

    // 3. Save/update customer details in Supabase
    saveCustomer(clientPhone, clientName, street, number, neighborhood, city);

    // 4. Create WhatsApp URL and redirect
    const encodedText = encodeURIComponent(textMsg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${SHOP_WHATSAPP_NUMBER}&text=${encodedText}`;
    
    // Open in a new tab/app window
    window.open(whatsappUrl, "_blank");
    
    // 5. Reset Cart
    cart = [];
    saveCart();
    updateCartUI();
    
    // Close modals
    closeCheckoutModal();
    checkoutForm.reset();
    
    alert("Pedido enviado! Você será redirecionado para o WhatsApp da RaviLar para finalizar o pagamento e combinar a entrega.");
}

// Phone number formatting in real time (XX) XXXXX-XXXX
function formatPhoneInput(e) {
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
    }
}

// Check database for existing customer on blur
async function handlePhoneBlur(e) {
    const phone = e.target.value.replace(/\D/g, "");
    const phoneStatus = document.getElementById("checkout-phone-status");
    if (phone.length < 10) {
        if (phoneStatus) {
            phoneStatus.style.display = "none";
        }
        return;
    }
    
    if (!supabaseClient) return;
    
    try {
        if (phoneStatus) {
            phoneStatus.style.color = "var(--text-muted)";
            phoneStatus.style.display = "block";
            phoneStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando cadastro...';
        }
        
        const { data, error } = await supabaseClient
            .from("customers")
            .select("*")
            .eq("phone", phone)
            .maybeSingle();
            
        if (error) {
            console.error("Erro ao buscar dados do cliente:", error.message);
            if (phoneStatus) phoneStatus.style.display = "none";
            return;
        }
        
        if (data) {
            // Auto fill checkout fields
            document.getElementById("checkout-name").value = data.name || "";
            document.getElementById("checkout-street").value = data.street || "";
            document.getElementById("checkout-number").value = data.number || "";
            document.getElementById("checkout-neighborhood").value = data.neighborhood || "";
            document.getElementById("checkout-city").value = data.city || "";
            
            if (phoneStatus) {
                phoneStatus.style.color = "var(--success-color)";
                phoneStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Cadastro de <strong>${data.name.split(' ')[0]}</strong> encontrado e preenchido!`;
            }
        } else {
            if (phoneStatus) {
                phoneStatus.style.display = "none";
            }
        }
    } catch (err) {
        console.error("Erro na busca de cliente:", err);
        if (phoneStatus) phoneStatus.style.display = "none";
    }
}

// Save/Update customer details in Supabase
async function saveCustomer(phone, name, street, number, neighborhood, city) {
    if (!supabaseClient) return;
    const cleanPhone = phone.replace(/\D/g, "");
    try {
        const { error } = await supabaseClient
            .from("customers")
            .upsert({
                phone: cleanPhone,
                name: name,
                street: street,
                number: number,
                neighborhood: neighborhood,
                city: city
            }, { onConflict: 'phone' });
            
        if (error) {
            console.error("Erro ao salvar cliente no banco:", error.message);
        }
    } catch (err) {
        console.error("Erro na requisição de cadastro do cliente:", err);
    }
}

// Start Application on Load
window.addEventListener("DOMContentLoaded", init);
