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

document.querySelectorAll('.busca').forEach(busca => {

    const input = busca.querySelector('.busca__input');
    const lista = busca.querySelector('.busca__sugestoes');

    input.addEventListener('input', function() {

        const termo = this.value.trim().toLowerCase();

        if (termo.length === 0) {
            lista.innerHTML = '';
            lista.classList.remove('visivel');
            return;
        }

        const resultados = catalogoProdutos.filter(produto =>
            produto.nome.toLowerCase().includes(termo) ||
            produto.categoria.toLowerCase().includes(termo)
        );

        renderizarSugestoes(resultados, lista);
    });

});

document.addEventListener('click', function(evento){
    document.querySelectorAll('.busca').forEach(wrapper => {
        if(!wrapper.contains(evento.target)){
            const lista = wrapper.querySelector('.busca__sugestoes');
            lista.innerHTML = '';
            lista.classList.remove('visivel');
        }

    });

});

function renderizarSugestoes(resultados, lista) {

    lista.innerHTML = '';

    if (resultados.length === 0) {
        lista.innerHTML =
            '<p class="busca__vazio">Nenhum produto encontrado.</p>';

        lista.classList.add('visivel');
        return;
    }

    resultados.slice(0, 6).forEach(produto => {

        const item = document.createElement('div');

        item.classList.add('busca__item');

        item.innerHTML =
            '<span class="busca__item-icone">' + produto.icone + '</span>' +
            '<div class="busca__item-info">' +
            '<span class="busca__item-nome">' + produto.nome + '</span>' +
            '<span class="busca__item-cat">' + produto.categoria + '</span>' +
            '</div>';

        lista.appendChild(item);
    });

    lista.classList.add('visivel');
}