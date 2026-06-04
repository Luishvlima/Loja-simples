const CARRINHO_CACHE_KEY = 'loja_carrinho_cache_v2';
const CARRINHO_API_URL = new URL(
  '../carrinho/api.php',
  (document.currentScript && document.currentScript.src) ? document.currentScript.src : window.location.href
).href;

let carrinhoCache = loadCarrinhoLocal();

function loadCarrinhoLocal() {
  try {
    const raw = localStorage.getItem(CARRINHO_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (erro) {
    return {};
  }
}

function saveCarrinhoLocal(carrinho) {
  carrinhoCache = carrinho || {};
  try {
    localStorage.setItem(CARRINHO_CACHE_KEY, JSON.stringify(carrinhoCache));
  } catch (erro) {
    return;
  }
}

function parsePreco(precoStr) {
  if (!precoStr) return 0;
  const normalizado = String(precoStr).replace(/[R$\s\.]/g, '').replace(',', '.');
  const valor = parseFloat(normalizado);
  return Number.isFinite(valor) ? valor : 0;
}

function formatarPreco(num) {
  return Number(num || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularTotal(carrinho) {
  return Object.values(carrinho || {}).reduce((total, item) => {
    const produto = item && item.produto ? item.produto : {};
    const qtd = item && item.qtd ? Number(item.qtd) : 0;
    return total + parsePreco(produto.preco) * qtd;
  }, 0);
}

async function chamarApiCarrinho(payload) {
  const resposta = await fetch(CARRINHO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!resposta.ok) {
    throw new Error(`Falha ao comunicar com o carrinho. HTTP ${resposta.status}`);
  }

  return resposta.json();
}

async function sincronizarCarrinho() {
  const dados = await chamarApiCarrinho({ acao: 'get' });
  saveCarrinhoLocal(dados.carrinho || {});
  return carrinhoCache;
}

function obterCarrinho() {
  return carrinhoCache || {};
}

async function adicionarAoCarrinho(slug, produto, quantidade = 1) {
  const dados = await chamarApiCarrinho({
    acao: 'add',
    slug,
    produto,
    quantidade
  });

  saveCarrinhoLocal(dados.carrinho || {});
  return dados.carrinho || {};
}

async function atualizarQuantidade(slug, novaQtd, produto) {
  const dados = await chamarApiCarrinho({
    acao: 'update',
    slug,
    produto,
    quantidade: novaQtd
  });

  saveCarrinhoLocal(dados.carrinho || {});
  return dados.carrinho || {};
}

async function removerDoCarrinho(slug) {
  const dados = await chamarApiCarrinho({
    acao: 'remove',
    slug
  });

  saveCarrinhoLocal(dados.carrinho || {});
  return dados.carrinho || {};
}

async function limparCarrinho() {
  const dados = await chamarApiCarrinho({ acao: 'clear' });
  saveCarrinhoLocal(dados.carrinho || {});
  return dados.carrinho || {};
}

function renderizarItemCarrinho(slug, item, catalogoLookup) {
  const produto = item.produto || (catalogoLookup && catalogoLookup[slug]) || {};
  return `
    <div class="carrinho__item" data-slug="${slug}">
      <div class="carrinho__info">
        <div class="carrinho__icone">${produto.icone || ''}</div>
        <div>
          <div class="carrinho__nome">${produto.nome || slug}</div>
          <div class="carrinho__preco">${produto.preco || ''}</div>
        </div>
      </div>
      <div class="carrinho__acoes">
        <div class="carrinho__quant">
          <button class="botao" data-action="dec" type="button">-</button>
          <span class="carrinho__qtd">${item.qtd}</span>
          <button class="botao" data-action="inc" type="button">+</button>
        </div>
        <button class="botao botao--entrar" data-action="rem" type="button">Remover</button>
      </div>
    </div>`;
}

async function renderCarrinho(catalogoLookup) {
  const container = document.getElementById('listaCarrinho');
  const totalEl = document.getElementById('totalCarrinho');

  if (!container) {
    return;
  }

  const carrinho = await sincronizarCarrinho();
  const chaves = Object.keys(carrinho || {});

  if (chaves.length === 0) {
    container.innerHTML = '<div class="carrinho__vazio">Seu carrinho está vazio.</div>';
    if (totalEl) totalEl.textContent = '';
    return;
  }

  container.innerHTML = chaves.map((slug) => renderizarItemCarrinho(slug, carrinho[slug], catalogoLookup)).join('');

  if (totalEl) {
    totalEl.textContent = 'Total: ' + formatarPreco(calcularTotal(carrinho));
  }

  container.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const itemEl = btn.closest('[data-slug]');
      const slug = itemEl ? itemEl.getAttribute('data-slug') : '';
      const acao = btn.getAttribute('data-action');
      const item = carrinho[slug] || {};
      const produto = item.produto || (catalogoLookup && catalogoLookup[slug]) || {};

      try {
        if (acao === 'inc') {
          await adicionarAoCarrinho(slug, produto, 1);
        } else if (acao === 'dec') {
          await atualizarQuantidade(slug, (item.qtd || 0) - 1, produto);
        } else if (acao === 'rem') {
          await removerDoCarrinho(slug);
        }

        await renderCarrinho(catalogoLookup);
      } catch (erro) {
        console.error(erro);
        alert('Não foi possível atualizar o carrinho.');
      }
    });
  });
}

window.carrinhoAPI = {
  sincronizarCarrinho,
  obterCarrinho,
  adicionarAoCarrinho,
  atualizarQuantidade,
  removerDoCarrinho,
  limparCarrinho,
  renderCarrinho,
  parsePreco,
  formatarPreco,
  calcularTotal
};

document.addEventListener('DOMContentLoaded', () => {
  sincronizarCarrinho().catch((erro) => console.error(erro));

  const listaCarrinho = document.getElementById('listaCarrinho');
  if (listaCarrinho) {
    renderCarrinho(window.__catalogoLookup || {}).catch((erro) => console.error(erro));
  }
});
