document.addEventListener("DOMContentLoaded", () => {


    // Requisito 2: Menu Hamburguer  
    const botaoMenu = document.getElementById('botao-menu');
    const navLinks = document.getElementById('nav-links');

    if (botaoMenu) {
        botaoMenu.addEventListener('click', () => {
            navLinks.classList.toggle('ativo');
            botaoMenu.classList.toggle('ativo');
        });
    }

    
    const containerGaleria = document.getElementById('container-galeria');



    // API pedida
    const API_URL = 'https://dummyjson.com/products';

    //  Requisito 5: Sorteio de produto da api
    const sortearBtn = document.getElementById('sortear-btn');

    if (sortearBtn) {
        sortearBtn.addEventListener('click', sortearProduto);
    }
    
    async function sortearProduto() {
        containerGaleria.innerHTML = '<p>Sorteando produto...</p>';

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            const produtos = data.products; // Correto
            
            const randomIndex = Math.floor(Math.random() * produtos.length);
            const randomProduct = produtos[randomIndex];
            renderprodutos([randomProduct], containerGaleria);

        } catch (error) {
            console.error('Falha ao sortear produto:', error);
            containerGaleria.innerHTML = `<p class="error-message">Não foi possível carregar o produto. Tente novamente.</p>`;
        }
    }



    //  Requisito 6: 4 botões com diferentes categorias
    const categoriaBotoes = document.getElementById('categoria-botoes');

    if (categoriaBotoes) {
        categoriaBotoes.addEventListener('click', (event) => {
            if (event.target.classList.contains('categoria-btn')) {
                
                const categoria = event.target.dataset.category; 
                
                if (categoria) {
                    sortearCategoria(categoria);
                }
            }
        });
    }

    async function sortearCategoria(categoria) {
        containerGaleria.innerHTML = `<p>Carregando produtos da categoria: ${categoria}...</p>`;

        try {
            const response = await fetch(`${API_URL}/category/${categoria}`);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            const produtos = data.products;
            
            renderprodutos(produtos, containerGaleria);

        } catch (error) {
            console.error(`Falha ao buscar categoria ${categoria}:`, error);
            containerGaleria.innerHTML = `<p class="error-message">Não foi possível carregar os produtos. Tente novamente.</p>`;
        }
    }


    //  Construção de interfaces com JS e Manipulação do DOM.
    function renderprodutos(produtos, container) {
        container.innerHTML = '';

        if (!produtos || produtos.length === 0) {
            container.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        produtos.forEach(product => {
            const card = document.createElement('article');
            card.className = 'card'; 

            card.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                <div class="card-content">
                    <h3>${product.title} (ID: ${product.id})</h3>
                    
                    <span class="categoria">${product.category}</span>
                    
                    <p>${product.description}</p>
                </div>
            `;
            container.appendChild(card);
        });
    }

});