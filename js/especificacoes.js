let catalogo = {};

async function carregarEspecificacoes() {
    const main = document.getElementById('conteudoSpecs');
    const rodape = document.getElementById('rodape');

    try {
        let resposta = await fetch('../BANCODEDADOS/Produtos.json');

        if (!resposta.ok) {
            resposta = await fetch('./BANCODEDADOS/Produtos.json');
        }

        if (!resposta.ok) {
            throw new Error(`Não foi possível carregar Produtos.json. Status HTTP: ${resposta.status}`);
        }

        catalogo = await resposta.json();
        window.__catalogoLookup = catalogo;

        const params = new URLSearchParams(window.location.search);
        const slug = params.get('produto') || [...params.keys()][0];

        if (!slug) {
            window.location.href = '../';
            return;
        }

        const produto = catalogo[slug];

        if (!produto) {
            if (rodape) {
                rodape.style.display = 'none';
            }
            if (main) {
                main.innerHTML =
                    '<div class="specs__erro"><span>🔍</span>Produto não encontrado.<br>' +
                        '<a href="../" style="color:#DFFF00;">Voltar para a loja</a></div>';
            }
            return;
        }

        const linhas = produto.specs.map(function(s) {
            return '<tr><td>' + s[0] + '</td><td>' + s[1] + '</td></tr>';
        }).join('');

        main.innerHTML =
            '<div class="specs__container">' +
                '<div class="specs__midia">' + produto.icone + '</div>' +
                '<div class="specs__info">' +
                    '<div class="specs__categoria">' + produto.categoria + '</div>' +
                    '<h1 class="specs__nome">' + produto.nome + '</h1>' +
                    '<div class="specs__precos">' +
                        '<span class="specs__preco-novo">' + produto.preco + '</span>' +
                        '<span class="specs__preco-antigo">' + produto.precoAntigo + '</span>' +
                        '<span class="specs__badge-off">' + produto.desconto + '</span>' +
                    '</div>' +
                    '<hr class="specs__divisor">' +
                    '<h2 class="specs__subtitulo">Sobre o Produto</h2>' +
                    '<p class="specs__descricao">' + produto.descricao + '</p>' +
                    '<hr class="specs__divisor">' +
                    '<h2 class="specs__subtitulo">Especificações Técnicas</h2>' +
                    '<table class="specs__tabela"><tbody>' + linhas + '</tbody></table>' +
                    '<div class="specs__acoes">' +
                        '<button id="btnAdicionarCarrinho" class="specs__btn-primario" type="button">🛒 Adicionar ao Carrinho</button>' +
                        '<button class="specs__btn-secundario">⚡ Comprar Agora</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        const botaoCarrinho = document.getElementById('btnAdicionarCarrinho');
        if (botaoCarrinho) {
            botaoCarrinho.addEventListener('click', async function() {
                try {
                    await window.carrinhoAPI.adicionarAoCarrinho(slug, catalogo[slug], 1);
                    alert('Adicionado ao carrinho');
                } catch (erro) {
                    console.error(erro);
                    alert('Não foi possível adicionar ao carrinho');
                }
            });
        }
    } 
    catch (erro) {
        console.error(erro);

        if (rodape) {
            rodape.style.display = 'none';
        }

        if (main) {
            main.innerHTML =
                '<div class="specs__erro"><span>⚠️</span>Erro ao carregar as especificações.<br>' +
                    '<a href="../" style="color:#DFFF00;">Voltar para a loja</a></div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', carregarEspecificacoes);

