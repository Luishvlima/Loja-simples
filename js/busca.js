let catalogoProdutos = [];  // Variável global para armazenar dados

async function carregarCatalogoProdutos() {
    try {
        let resposta = await fetch('./BANCODEDADOS/Produtos.json');

        if (!resposta.ok) {
            resposta = await fetch('../BANCODEDADOS/Produtos.json');
        }
        
        if (!resposta.ok) {
            throw new Error('Erro ao carregar JSON: ' + resposta.status);
        }
        
        const objeto = await resposta.json();
        
        catalogoProdutos = Object.values(objeto).map(produto => ({
                nome: produto.nome,
                categoria: produto.categoria,
                icone: produto.icone,
                slug: Object.keys(objeto).find(key => (objeto[key] === produto))
            }));

        console.log("✓ Catálogo carregado com sucesso:", catalogoProdutos.length, "produtos");
    } catch (erro) {
        console.error("❌ Erro ao carregar catálogo:", erro);
    }
}

document.addEventListener("DOMContentLoaded", carregarCatalogoProdutos);

const inputBusca   = document.getElementById('inputBusca');
const listaSugests = document.getElementById('listaSugestoes');

inputBusca.addEventListener('input', function () {
    const termo = this.value.trim().toLowerCase();
    if (termo.length === 0) {
        fecharSugestoes();
        return;
    }
    const resultados = catalogoProdutos.filter(function (produto) {
        return produto.nome.toLowerCase().includes(termo)
            || produto.categoria.toLowerCase().includes(termo);
    });
    renderizarSugestoes(resultados);
});

document.addEventListener('click', function (evento) {
    const wrapper = document.querySelector('.busca');
    if (!wrapper.contains(evento.target)) {
        fecharSugestoes();
    }
});

function renderizarSugestoes(resultados) {
    listaSugests.innerHTML = '';
    if (resultados.length === 0) {
        listaSugests.innerHTML = '<p class="busca__vazio">Nenhum produto encontrado.</p>';
        listaSugests.classList.add('visivel');
        return;
    }
    const limite = resultados.slice(0, 6);
    limite.forEach(function (produto) {
        const item = document.createElement('div');
        item.classList.add('busca__item');
        item.innerHTML =
            '<span class="busca__item-icone">' + produto.icone + '</span>' +
            '<div class="busca__item-info">' +
                '<span class="busca__item-nome">' + produto.nome + '</span>' +
                '<span class="busca__item-cat">'  + produto.categoria  + '</span>' +
            '</div>';
        item.addEventListener('click', function () {
            const emSubpasta = window.location.pathname.includes('/games/')
                || window.location.pathname.includes('/celular/')
                || window.location.pathname.includes('/computadores/')
                || window.location.pathname.includes('/produto/')
                || window.location.pathname.includes('/login/')
                || window.location.pathname.includes('/cadastro/');

            const baseProduto = emSubpasta ? '../produto/' : './produto/';
            window.location.href = baseProduto + '?' + encodeURIComponent(produto.slug);
        });
        listaSugests.appendChild(item);
    });
    listaSugests.classList.add('visivel');
}

function fecharSugestoes() {
    listaSugests.innerHTML = '';
    listaSugests.classList.remove('visivel');
}