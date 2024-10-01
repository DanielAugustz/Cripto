const listaCriptomoedas = document.getElementById('lista-criptomoedas');
const listaFavoritas = document.getElementById('lista-favoritas');
const filtro = document.getElementById('filtro');
const procurar = document.getElementById('procurar');

let todasCriptomoedas = [];

async function fetchCriptomoedas() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
    const data = await response.json();
    return data;
}

function mostrarCiptomoeda(criptomoedas) {
    listaCriptomoedas.innerHTML = '';

    criptomoedas.forEach(criptomoeda => {
        const div = document.createElement('div');
        div.classList.add('criptomoeda');
        div.innerHTML = `
            <img src="${criptomoeda.image}" alt="${criptomoeda.name}" class="imagem-criptomoeda">
            <h3>${criptomoeda.name}</h3>
            <p>Valor de mercado Rank:${criptomoeda.market_cap_rank}</p>
        `;

        div.addEventListener('click', () => {
            detalhesCriptomoeda(criptomoeda);
        });

        const btnFav = document.createElement('button');
        btnFav.textContent = 'Favoritar';

        btnFav.addEventListener('click', (e) => {
            e.stopPropagation();
            adicionarFavoritos(criptomoeda);
        });
        div.appendChild(btnFav);

        listaCriptomoedas.appendChild(div);
    });
}

function detalhesCriptomoeda(criptomoeda) {
    alert(`Nome: ${criptomoeda.name}\n Simbolo: ${criptomoeda.symbol}\n Preço: $${criptomoeda.current_price}\nPreço Max 24h: $${criptomoeda.high_24h}\nPreço Min 24h: $${criptomoeda.low_24h}`);
}

function filtrarCriptomoedas() {
    const criterioSelecionado = filtro.value;
    let criptomoedasFiltradas = todasCriptomoedas;

    if (criterioSelecionado === 'maior-preco') {
        criptomoedasFiltradas.sort((a, b) => b.current_price - a.current_price);
    } else if (criterioSelecionado === 'menor-preco') {
        criptomoedasFiltradas.sort((a, b) => a.current_price - b.current_price);
    } else if (criterioSelecionado === 'subida-24h') {
        criptomoedasFiltradas.sort((a, b) => (b.price_change_percentage_24h) - (a.price_change_percentage_24h));
    } else if (criterioSelecionado === 'queda-24h') {
        criptomoedasFiltradas.sort((a, b) => (a.price_change_percentage_24h) - (b.price_change_percentage_24h));
    }

    mostrarCiptomoeda(criptomoedasFiltradas);
}


filtro.addEventListener('change', filtrarCriptomoedas);

function procurarCriptomoeda() {
    const Busca = procurar.value.toLowerCase();
    const criptomoedasFiltradas = todasCriptomoedas.filter(criptomoeda =>
        criptomoeda.name.toLowerCase().includes(Busca) || criptomoeda.symbol.toLowerCase().includes(Busca)
    );
    mostrarCiptomoeda(criptomoedasFiltradas);
}

procurar.addEventListener('input', procurarCriptomoeda);

function mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    if (favoritos.length === 0) {
        document.getElementById('favoritas').classList.add('esconder');
    } else {
        document.getElementById('favoritas').classList.remove('esconder');
        listaFavoritas.innerHTML = '';
        favoritos.forEach(criptomoeda => {
            const ul = document.createElement('ul');
            ul.innerHTML = `
                <img src="${criptomoeda.image}" <br>
                <span>${criptomoeda.symbol.toUpperCase()}</span><br>
                <button class="vizualizar-fav">Info</button>
                <button class="remover-fav">x</button>
            `;
            
            const btnRemover = ul.querySelector('.remover-fav');
            btnRemover.addEventListener('click', () => {
                removerDosFavoritos(criptomoeda);
            });

            const btnVisualizar = ul.querySelector('.vizualizar-fav');
            btnVisualizar.addEventListener('click', () => {
                detalhesCriptomoeda(criptomoeda);
            });

            listaFavoritas.appendChild(ul);
        });
    }
}


function adicionarFavoritos(criptomoeda) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (!favoritos.find(fav => fav.id === criptomoeda.id)) {
        favoritos.push(criptomoeda);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        mostrarFavoritos();
    }
}

function removerDosFavoritos(criptomoeda) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const novosFavoritos = favoritos.filter(fav => fav.id !== criptomoeda.id);
    if (novosFavoritos.length !== favoritos.length) {
        localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
        mostrarFavoritos();
    }
}

(async  () => {
    todasCriptomoedas = await fetchCriptomoedas();
    mostrarCiptomoeda(todasCriptomoedas);
    mostrarFavoritos();
})();
