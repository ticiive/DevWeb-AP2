/* --- Organização do Código: JS em arquivo separado --- */

// Executa o script quando o DOM estiver totalmente carregado
document.addEventListener("DOMContentLoaded", () => {

    /* --- Requisito 2: Lógica do Menu Hamburguer --- */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // Alterna a classe 'active' no menu e no botão
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    /* --- Lógica Específica da Página (index.html ou categories.html) --- */
    
    // Seleciona o container da galeria (comum a ambas as páginas)
    const galleryContainer = document.getElementById('gallery-container');

    // Variável base da API
    const API_URL = 'https://dummyjson.com/products';

    /* --- Requisito 5: Lógica da Página de Sorteio (index.html) --- */
    const sortearBtn = document.getElementById('sortear-btn');

    if (sortearBtn) {
        sortearBtn.addEventListener('click', fetchRandomProduct);
    }

    /**
     * Requisito 5: Busca TODOS os produtos, sorteia UM e o exibe.
     * Inclui Requisito de Tratamento de Erros.
     */
    async function fetchRandomProduct() {
        // Limpa a galeria e mostra um "loading"
        galleryContainer.innerHTML = '<p>Sorteando produto...</p>';

        try {
            // 1. Busca dados na API (endpoint /products)
            const response = await fetch(API_URL);

            // 2. Tratamento de erro básico da requisição
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            const products = data.products;

            // 3. Sorteia um produto aleatoriamente
            const randomIndex = Math.floor(Math.random() * products.length);
            const randomProduct = products[randomIndex];

            // 4. Exibe o produto (reaproveitando a função de renderização)
            // Passamos o produto como um array de 1 item
            renderProducts([randomProduct], galleryContainer);

        } catch (error) {
            // 5. Requisito de Tratamento de Erros (exibição para o usuário)
            console.error('Falha ao sortear produto:', error);
            galleryContainer.innerHTML = `<p class="error-message">Não foi possível carregar o produto. Tente novamente.</p>`;
        }
    }


    /* --- Requisito 6: Lógica da Página de Categorias (categories.html) --- */
    const categoryButtonsContainer = document.getElementById('category-buttons');

    if (categoryButtonsContainer) {
        // Usamos "Event Delegation" para gerenciar todos os botões com um só listener
        categoryButtonsContainer.addEventListener('click', (event) => {
            // Verifica se o clique foi realmente em um botão com a classe 'category-btn'
            if (event.target.classList.contains('category-btn')) {
                const category = event.target.dataset.category;
                fetchProductsByCategory(category);
            }
        });
    }

    /**
     * Requisito 6: Busca produtos da API filtrados por categoria.
     * Inclui Requisito de Tratamento de Erros.
     */
    async function fetchProductsByCategory(category) {
        // Limpa a galeria e mostra "loading"
        galleryContainer.innerHTML = `<p>Carregando produtos da categoria: ${category}...</p>`;

        try {
            // 1. Busca dados na API (endpoint /products/category/{categoria})
            const response = await fetch(`${API_URL}/category/${category}`);

            // 2. Tratamento de erro
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            const products = data.products;

            // 3. Renderiza os produtos na tela
            renderProducts(products, galleryContainer);

        } catch (error) {
            // 4. Requisito de Tratamento de Erros
            console.error(`Falha ao buscar categoria ${category}:`, error);
            galleryContainer.innerHTML = `<p class="error-message">Não foi possível carregar os produtos. Tente novamente.</p>`;
        }
    }


    /**
     * Requisito 5, 6 e 8: Construção de interfaces com JS e Manipulação do DOM.
     * Esta função centralizada renderiza os cards de produto.
     * @param {Array} products - O array de produtos a ser exibido.
     * @param {HTMLElement} container - O elemento (galleryContainer) onde os cards serão inseridos.
     */
    function renderProducts(products, container) {
        // 1. Limpa o container antes de adicionar novos itens
        container.innerHTML = '';

        // 2. Verifica se há produtos
        if (products.length === 0) {
            container.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        // 3. Itera sobre o array e cria o HTML de cada card
        products.forEach(product => {
            // Cria um novo elemento 'article' para o card
            const card = document.createElement('article');
            card.className = 'card'; // Adiciona a classe CSS

            // Informações requisitadas: id, nome, descrição, categoria, imagem (images[0])
            card.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                <div class="card-content">
                    <h3>${product.title} (ID: ${product.id})</h3>
                    <span class="category">${product.category}</span>
                    <p>${product.description}</p>
                </div>
            `;

            // 4. Adiciona o card criado ao container da galeria
            container.appendChild(card);
        });
    }

});