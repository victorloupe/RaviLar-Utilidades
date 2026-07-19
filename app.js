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

// ==========================================================================
// SUPABASE CLIENT CONFIGURATION
// ==========================================================================
const supabaseUrl = "https://wbgdyheswfzgxaxvhugv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZ2R5aGVzd2Z6Z3hheHZodWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mzk1OTIsImV4cCI6MjA5OTUxNTU5Mn0.kvPoOJIoqHPpUfA3PFBPFuQ0yDALS1LOChd2bYCGoMs";

// Initialize Supabase Client
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// Auth & Favorites state
let currentUser = null;

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
        description: "Mantenha mosquitos e insetos longe de crianças e bebês de forma natural e sem odor. Adesivos autocolantes com Óleos essenciais naturais que podem ser colados em roupas, bonés ou carrinhos.",
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
        description: "Otimize a pia da cozinha! Este dispenser dosador comporta detergente líquido no reservatério inferior e organiza a esponja na parte superior. Pressione para dosar o sabão direto na esponja sem desperdício.",
        badge: "Mais Vendido",
        rating: 4.7,
        reviews: 63
    }
];

// Active Products Array (Loaded dynamically from database)
let PRODUCTS = [];

// WhatsApp Shop Configuration
let SHOP_WHATSAPP_NUMBER = "5517996371743"; // Padrão; sobrescrito pelas Configurações do admin

// ==========================================================================
// APPLICATION STATE
// ==========================================================================
let cart = [];
let activeFilter = "all";
let searchQuery = "";
let sortBy = "default";
let currentProduct = null;
let modalQuantity = 1;
let modalSelectedVariation = null; // Selected variation option in the product modal
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12; // 12 fecha a grade em 4, 3 ou 2 colunas sem buracos

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
    
    // Load social links from store settings (footer/contact icons)
    loadSocialLinks();

    // Load categories first
    await loadCategories();
    
    // Load products from Supabase
    await loadProducts();

    // Deep-link: ?produto=ID abre o modal do produto direto
    const urlParams = new URLSearchParams(window.location.search);
    const deepLinkProductId = parseInt(urlParams.get("produto"));
    if (!isNaN(deepLinkProductId)) {
        openProductModal(deepLinkProductId);
    }

    // Load header banners slider
    await loadBanners();

    // Initialize circular testimonials slider
    initTestimonialsSlider();

    // Populate and bind UI
    updateCartUI();
    bindEvents();

    if (supabaseClient) {
        // Listen to Auth state change for favorites sync
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
                currentUser = session.user;
                await loadUserFavorites();
            } else {
                currentUser = null;
                userFavorites = [];
            }
            renderProducts();
        });

        // Initial check
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            currentUser = session.user;
            await loadUserFavorites();
            renderProducts();
        }
    }
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

// Abrevia o nome do cliente por privacidade: "Victor Lourenço Pereira" -> "Victor L."
function formatReviewName(fullName) {
    const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "Cliente RaviLar";
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
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
                    name: formatReviewName(item.name),
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

// Load social media links configured in the admin (store_settings)
async function loadSocialLinks() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from("store_settings")
            .select("key, value")
            .in("key", [
                "social_instagram", "social_facebook",
                "contact_whatsapp", "contact_email",
                "hours_weekday", "hours_weekend"
            ]);

        if (error) throw error;

        const settings = {};
        (data || []).forEach(item => { settings[item.key] = item.value; });

        const applyLink = (elId, url) => {
            const el = document.getElementById(elId);
            if (!el) return;
            if (url && url.trim()) {
                el.href = url.trim();
                el.style.display = "";
            } else {
                el.style.display = "none"; // Esconde o ícone se não configurado
            }
        };

        // Ícones do rodapé (coluna Atendimento)
        applyLink("social-instagram-footer", settings["social_instagram"]);
        applyLink("social-facebook-footer", settings["social_facebook"]);

        // WhatsApp de atendimento (rodapé + Fale Conosco + botão de pedido)
        const rawWhats = (settings["contact_whatsapp"] || "").trim();
        if (rawWhats) {
            const digits = rawWhats.replace(/\D/g, "");
            const waNumber = digits.length <= 11 ? "55" + digits : digits;
            SHOP_WHATSAPP_NUMBER = waNumber;
            ["footer-whatsapp-link", "contact-whatsapp-link"].forEach(id => {
                const el = document.getElementById(id);
                if (!el) return;
                el.textContent = rawWhats;
                el.href = `https://wa.me/${waNumber}`;
            });
        }

        // E-mail de contato
        const email = (settings["contact_email"] || "").trim();
        const emailEl = document.getElementById("contact-email-link");
        if (email && emailEl) {
            emailEl.textContent = email;
            emailEl.href = `mailto:${email}`;
        }

        // Horários de atendimento
        const applyHours = (elId, value) => {
            const el = document.getElementById(elId);
            if (!el) return;
            if (value && value.trim()) {
                el.textContent = value.trim();
                el.style.display = "";
                if (el.previousElementSibling?.tagName === "BR") el.previousElementSibling.style.display = "";
            } else {
                el.style.display = "none";
                if (el.previousElementSibling?.tagName === "BR") el.previousElementSibling.style.display = "none";
            }
        };
        if ("hours_weekday" in settings) applyHours("footer-hours-weekday", settings["hours_weekday"]);
        if ("hours_weekend" in settings) applyHours("footer-hours-weekend", settings["hours_weekend"]);
    } catch (e) {
        console.warn("Não foi possível carregar os links sociais:", e.message);
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
            console.warn("Tabela 'products' vazia no Supabase. Usando catélogo local de demonstração.");
            PRODUCTS = FALLBACK_PRODUCTS;
        }
    } catch (err) {
        console.error("Falha ao se conectar com Supabase:", err.message);
        console.warn("Carregando catélogo de demonstração offline.");
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
    });
    cartContinueShopping.addEventListener("click", closeCart);

    // Checkout Trigger
    checkoutTriggerBtn.addEventListener("click", () => {
        closeCart();
        window.location.href = "checkout.html";
    });

    // Modal Close handlers
    productModalClose.addEventListener("click", closeProductModal);

    // Modal Favorite Click Handler
    const modalFavBtn = document.getElementById("modal-favorite-btn");
    if (modalFavBtn) {
        modalFavBtn.addEventListener("click", () => {
            if (currentProduct) {
                toggleProductFavorite(currentProduct.id);
            }
        });
    }

    // Modal Share Click Handler: copia o link direto do produto
    const modalShareBtn = document.getElementById("modal-share-btn");
    if (modalShareBtn) {
        modalShareBtn.addEventListener("click", () => {
            if (!currentProduct) return;
            const shareUrl = `${window.location.origin}${window.location.pathname}?produto=${currentProduct.id}`;
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert("Link do produto copiado! Cole no WhatsApp ou Instagram para divulgar."))
                .catch(() => alert("Não foi possível copiar o link: " + shareUrl));
        });
    }

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
            // Produto com variações mas nenhuma disponível/selecionada
            if (getProductVariations(currentProduct) && !modalSelectedVariation) {
                alert("Este produto está esgotado no momento.");
                return;
            }
            addToCart(currentProduct.id, modalQuantity, modalSelectedVariation);
            closeProductModal();
        }
    });

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
    if (!productModal.classList.contains("open")) {
        cartOverlay.classList.remove("open");
        document.body.style.overflow = "";
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
        cart.forEach((item, index) => {
            // Prefer the variation photo when the item has one
            const mediaList = getProductMedia(item.product.image);
            const firstImg = (item.variant && item.variant.image) || mediaList[0] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600';
            const unitPrice = getItemUnitPrice(item);
            const variantHTML = item.variant
                ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px;">${escapeHTML(item.variant.name)}: <strong>${escapeHTML(item.variant.label)}</strong></div>`
                : "";

            const itemHTML = `
                <div class="cart-item" data-index="${index}">
                    <img src="${safeMediaUrl(firstImg)}" alt="${escapeHTML(item.product.name)}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${escapeHTML(item.product.name)}</h4>
                        ${variantHTML}
                        <div class="cart-item-price">R$ ${unitPrice.toFixed(2).replace('.', ',')}</div>
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
        const index = parseInt(item.getAttribute("data-index"));

        item.querySelector(".cart-minus").addEventListener("click", () => {
            updateQuantity(index, -1);
        });

        item.querySelector(".cart-plus").addEventListener("click", () => {
            updateQuantity(index, 1);
        });

        item.querySelector(".cart-item-remove").addEventListener("click", () => {
            removeFromCart(index);
        });
    });
}

function addToCart(productId, qty = 1, variant = null) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Product has variations but none was chosen (e.g. quick-add from the card):
    // open the modal so the customer picks one first.
    if (!variant && getProductVariations(product)) {
        openProductModal(productId);
        return;
    }

    const existingItem = cart.find(item =>
        item.product.id === productId &&
        (item.variant ? item.variant.label : null) === (variant ? variant.label : null)
    );

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push({
            product: product,
            quantity: qty,
            variant: variant
        });
    }

    saveCart();
    updateCartUI();

    // Smooth transition: open cart drawer to show item added
    openCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateQuantity(index, delta) {
    const item = cart[index];
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(index);
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
        subtotal += getItemUnitPrice(item) * item.quantity;
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

// Parse the product variations field (JSONB object or JSON string).
// Returns { name, options: [{label, price, stock, image}] } or null.
function getProductVariations(product) {
    if (!product || !product.variations) return null;
    let v = product.variations;
    try {
        if (typeof v === "string") v = JSON.parse(v);
    } catch (e) {
        return null;
    }
    if (!v || !Array.isArray(v.options) || v.options.length === 0) return null;
    return v;
}

// Effective unit price of a cart item (variation price wins over base price)
function getItemUnitPrice(item) {
    if (item.variant && item.variant.price !== undefined && item.variant.price !== null) {
        return parseFloat(item.variant.price);
    }
    return item.product.price;
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
        const productName = escapeHTML(p.name);
        const productCategory = escapeHTML(String(p.category || "").replace("-", " "));
        const productId = escapeHTML(p.id);
        const badgeHTML = p.badge ? `<span class="product-badge">${escapeHTML(p.badge)}</span>` : "";
        const hasOldPrice = p.old_price && parseFloat(p.old_price) > p.price;
        const priceHTML = hasOldPrice
            ? `<span style="display: block; font-size: 0.72rem; color: var(--text-muted); font-weight: 600;"><s>De R$ ${parseFloat(p.old_price).toFixed(2).replace('.', ',')}</s></span>R$ ${p.price.toFixed(2).replace('.', ',')}`
            : `R$ ${p.price.toFixed(2).replace('.', ',')}`;
        
        // Use first image of media list for catalog display thumbnail
        const mediaList = getProductMedia(p.image);
        const firstMedia = safeMediaUrl(mediaList[0]);
        
        const isFav = isProductFavorited(p.id);

        const cardHTML = `
            <div class="product-card" data-id="${productId}">
                ${badgeHTML}
                <button class="product-favorite-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remover dos favoritos' : 'Favoritar'}">
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <div class="product-img-wrapper">
                    <img src="${firstMedia}" alt="${productName}" loading="lazy">
                    <div class="product-actions-overlay">
                        <button class="btn-icon btn-view-details" title="Visualizar Detalhes"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn-icon btn-quick-add" title="Adicionar ao Carrinho"><i class="fa-solid fa-cart-plus"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-cat">${productCategory}</span>
                    <h3 class="product-title">${productName}</h3>
                    <div class="product-rating">
                        ${renderStars(p.rating || 5)}
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

        // Toggle favorite
        const favBtn = card.querySelector(".product-favorite-btn");
        if (favBtn) {
            favBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleProductFavorite(id);
            });
        }

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

    // Preço antigo "De" riscado (quando em oferta)
    let oldPriceEl = document.getElementById("modal-old-price");
    if (!oldPriceEl && modalProductPrice) {
        modalProductPrice.insertAdjacentHTML("beforebegin", '<div id="modal-old-price" style="display: none; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 2px;"></div>');
        oldPriceEl = document.getElementById("modal-old-price");
    }
    const oldPriceVal = parseFloat(product.old_price);
    if (oldPriceEl) {
        if (oldPriceVal && oldPriceVal > product.price) {
            oldPriceEl.innerHTML = `De <s>R$ ${oldPriceVal.toFixed(2).replace('.', ',')}</s> por:`;
            oldPriceEl.style.display = "block";
        } else {
            oldPriceEl.style.display = "none";
        }
    }
    
    // Dynamic stars & reviews for modal
    const modalProductStars = document.getElementById("modal-product-stars");
    if (modalProductStars) {
        modalProductStars.innerHTML = `
            ${renderStars(product.rating || 5)}
            <span>(${product.reviews || 0} avaliações)</span>
        `;
    }
    
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
    
    // Variation selector (color, kit, units...)
    modalSelectedVariation = null;
    const variationsBox = document.getElementById("modal-variations");
    if (variationsBox) {
        const varData = getProductVariations(product);
        if (varData) {
            variationsBox.style.display = "block";
            renderModalVariations(varData);
        } else {
            variationsBox.style.display = "none";
            variationsBox.innerHTML = "";
        }
    }

    productModal.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // Set favorite button visual state in details modal
    updateModalFavoriteButton(productId);
}

// Render the variation option buttons inside the product modal
function renderModalVariations(varData) {
    const box = document.getElementById("modal-variations");
    if (!box) return;

    box.innerHTML = `
        <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-dark); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${escapeHTML(varData.name)}: <span id="modal-variation-selected" style="color: var(--accent-color);"></span>
        </div>
        <div id="modal-variation-options" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
    `;

    const optionsWrap = box.querySelector("#modal-variation-options");
    const selectedLabel = box.querySelector("#modal-variation-selected");

    const selectOption = (opt, btn) => {
        modalSelectedVariation = {
            name: varData.name,
            label: opt.label,
            price: (opt.price !== undefined && opt.price !== null) ? parseFloat(opt.price) : null,
            image: opt.image || null
        };

        // Visual state of the buttons
        optionsWrap.querySelectorAll("button").forEach(b => {
            b.style.borderColor = "var(--border-color)";
            b.style.backgroundColor = "white";
            b.style.fontWeight = "500";
        });
        btn.style.borderColor = "var(--accent-color)";
        btn.style.backgroundColor = "rgba(43, 108, 176, 0.06)";
        btn.style.fontWeight = "700";

        if (selectedLabel) selectedLabel.textContent = opt.label;

        // Update displayed price
        if (modalSelectedVariation.price !== null && modalProductPrice) {
            modalProductPrice.textContent = `R$ ${modalSelectedVariation.price.toFixed(2).replace('.', ',')}`;
        }

        // Swap main image if the option has its own photo
        if (opt.image) {
            const mainContainer = document.getElementById("gallery-main-container");
            if (mainContainer) {
                mainContainer.innerHTML = `<img src="${safeMediaUrl(opt.image)}" alt="${escapeHTML(opt.label)}" style="width:100%; height:100%; object-fit:cover;">`;
            }
        }
    };

    let firstAvailableSelected = false;

    varData.options.forEach((opt) => {
        const isOutOfStock = (typeof opt.stock === "number") && opt.stock <= 0;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.style.cssText = `
            padding: 8px 16px;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            background-color: white;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.85rem;
            color: var(--text-dark);
            transition: all 0.2s;
        `;

        if (isOutOfStock) {
            btn.innerHTML = `${escapeHTML(opt.label)} <span style="font-size: 0.68rem; font-weight: 700; color: #E53E3E; text-transform: uppercase;">Esgotado</span>`;
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
            btn.style.textDecoration = "line-through";
        } else {
            btn.textContent = opt.label;
            btn.addEventListener("click", () => selectOption(opt, btn));
        }

        optionsWrap.appendChild(btn);

        // Pre-select the first AVAILABLE option
        if (!isOutOfStock && !firstAvailableSelected) {
            firstAvailableSelected = true;
            selectOption(opt, btn);
        }
    });

    // All options out of stock
    if (!firstAvailableSelected) {
        modalSelectedVariation = null;
        if (selectedLabel) {
            selectedLabel.textContent = "Esgotado";
            selectedLabel.style.color = "#E53E3E";
        }
    }
}

// Close Modal
function closeProductModal() {
    productModal.classList.remove("open");
    if (!cartDrawer.classList.contains("open")) {
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

// (Fluxo antigo de checkout via WhatsApp removido — o checkout agora é feito
//  na página checkout.html com pagamento integrado pela InfinitePay.)

// ==========================================================================
// CLIENT FAVORITES FUNCTIONS
// ==========================================================================
let userFavorites = [];

async function loadUserFavorites() {
    if (!supabaseClient || !currentUser) return;
    try {
        const { data, error } = await supabaseClient
            .from("favorites")
            .select("product_id")
            .eq("user_id", currentUser.id);
        
        if (error) throw error;
        userFavorites = data ? data.map(f => Number(f.product_id)) : [];
    } catch (e) {
        console.error("Erro ao carregar favoritos:", e);
    }
}

function isProductFavorited(productId) {
    return userFavorites.includes(Number(productId));
}

async function toggleProductFavorite(productId) {
    if (!supabaseClient) return;
    if (!currentUser) {
        alert("Por favor, faça login para favoritar produtos!");
        window.location.href = "cliente.html";
        return;
    }

    const prodId = Number(productId);
    const isFav = isProductFavorited(prodId);

    try {
        if (isFav) {
            // Remove
            const { error } = await supabaseClient
                .from("favorites")
                .delete()
                .eq("user_id", currentUser.id)
                .eq("product_id", prodId);
            if (error) throw error;
            userFavorites = userFavorites.filter(id => id !== prodId);
        } else {
            // Add
            const { error } = await supabaseClient
                .from("favorites")
                .insert({
                    user_id: currentUser.id,
                    product_id: prodId
                });
            if (error) throw error;
            userFavorites.push(prodId);
        }
        
        // Re-render
        renderProducts();
        updateModalFavoriteButton(prodId);
    } catch (e) {
        console.error("Erro ao alternar favorito:", e);
    }
}

function updateModalFavoriteButton(productId) {
    const modalFavBtn = document.getElementById("modal-favorite-btn");
    if (modalFavBtn && currentProduct && currentProduct.id == productId) {
        const isFav = isProductFavorited(productId);
        if (isFav) {
            modalFavBtn.classList.add("active");
            modalFavBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        } else {
            modalFavBtn.classList.remove("active");
            modalFavBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
        }
    }
}

function renderStars(rating) {
    const r = Math.round((rating || 5) * 2) / 2;
    let html = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= r) {
            html += `<i class="fa-solid fa-star"></i>`;
        } else if (i - 0.5 === r) {
            html += `<i class="fa-solid fa-star-half-stroke"></i>`;
        } else {
            html += `<i class="fa-regular fa-star"></i>`;
        }
    }
    return html;
}

// Start Application on Load
window.addEventListener("DOMContentLoaded", init);
