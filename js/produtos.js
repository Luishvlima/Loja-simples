async function carregarProdutos() {
  let resposta = await fetch("./BANCODEDADOS/Produtos.json");

  if (!resposta.ok) {
    resposta = await fetch("../BANCODEDADOS/Produtos.json");
  }

  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar Produtos.json. Status HTTP: ${resposta.status}`);
  }

  const objeto = await resposta.json();
  // Converter objeto {chave: {...}} em array [{...}, {...}]
  // Anotar cada produto com seu slug e expor um lookup global para o carrinho
  Object.keys(objeto).forEach(k => { objeto[k]._slug = k; });
  window.__catalogoLookup = objeto;

  return Object.values(objeto);
}

function renderizarAcoes(produto) {
  if (!produto.acoes || produto.acoes.length === 0) {
    return "<div class=\"cartao-produto__overlay\"></div>";
  }

  // remover ações sem texto; manter ações com href vazio (serão mostradas desabilitadas)
  const acoesValidas = produto.acoes.filter(acao => acao && acao.texto && acao.texto.trim() !== "");
  if (acoesValidas.length === 0) {
    return "<div class=\"cartao-produto__overlay\"></div>";
  }

  const botoes = acoesValidas
    .map((acao) => {
      if (acao.href && acao.href.trim() !== "") {
        return `<button class="overlay__btn botao--entrar" type="button" onclick="window.location.href='${acao.href}'">${acao.texto}</button>`;
      }

      if (acao.texto && acao.texto.toLowerCase().includes('carrinho')) {
        const slugSeguro = (produto._slug || '').replace(/'/g, '&#39;');
        return `<button class="overlay__btn botao--entrar botao--carrinho" type="button" data-slug="${slugSeguro}">${acao.texto}</button>`;
      }

      return `<button class="overlay__btn botao--entrar" disabled aria-disabled="true" type="button">${acao.texto}</button>`;
    })
    .join("");

  return `
    <div class="cartao-produto__overlay">
      <div class="grade-botao">
        ${botoes}
      </div>
    </div>
  `;
}

function renderizarProduto(produto) {
  // garantir que exista slug para uso nos botões
  produto._slug = produto._slug || produto.slug || '';
  return `
    <article class="cartao-produto">
      <span class="etiqueta etiqueta--destaque etiqueta--absoluta">${produto.destaque}</span>
      <div class="cartao-produto__midia">
        <div class="cartao-produto__sobreposicao"></div>
        <span class="cartao-produto__icone">${produto.icone}</span>
      </div>
      <div class="cartao-produto__corpo">
        ${renderizarAcoes(produto)}
        <div class="cartao-produto__categoria">${produto.categoria}</div>
        <div class="cartao-produto__nome">${produto.nome}</div>
        <div class="cartao-produto__rodape">
          <span class="cartao-produto__preco">${produto.preco}</span>
          <span class="cartao-produto__preco cartao-produto__preco--antigo">${produto.precoAntigo}</span>
        </div>
        <span class="etiqueta etiqueta--perigo">${produto.desconto}</span>
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("listaProdutos");

  if (!container) {
    return;
  }

  try {
    const produtos = await carregarProdutos();
    container.innerHTML = produtos.map(renderizarProduto).join("");

    container.querySelectorAll('.botao--carrinho').forEach((botao) => {
      botao.addEventListener('click', async () => {
        const slug = botao.getAttribute('data-slug');
        const produto = window.__catalogoLookup && window.__catalogoLookup[slug] ? window.__catalogoLookup[slug] : {};

        try {
          await window.carrinhoAPI.adicionarAoCarrinho(slug, produto, 1);
          alert('Adicionado ao carrinho');
        } catch (erro) {
          console.error(erro);
          alert('Não foi possível adicionar ao carrinho');
        }
      });
    });
  } catch (erro) {
    console.error(erro);
    container.innerHTML = "<p>Erro ao carregar os produtos.</p>";
  }
});
