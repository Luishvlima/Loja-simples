(function () {
  const currentScript = document.currentScript;
  const baseUrl = currentScript && currentScript.src ? currentScript.src : window.location.href;
  const statusUrl = new URL('../auth/status.php', baseUrl).href;
  const logoutUrl = new URL('../login/logout.php', baseUrl).href;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getAuthArea() {
    return document.querySelector('.barra-nav__acoes');
  }

  function removeAuthLinks(container) {
    document.querySelectorAll('a[href*="login/index.php"], a[href*="/login/"], a[href*="../login/"], a[href*="cadastro/index.php"], a[href*="/cadastro/"], a[href*="../cadastro/"]').forEach((link) => link.remove());
    container.querySelectorAll('a[href*="login/index.php"], a[href*="/login/"], a[href*="../login/"], a[href*="cadastro/index.php"], a[href*="/cadastro/"], a[href*="../cadastro/"]').forEach((link) => link.remove());
  }

  function createMenu(user) {
    const menu = document.createElement('div');
    menu.className = 'auth-menu';
    menu.innerHTML = `
      <button type="button" class="botao botao--entrar auth-menu__botao auth-menu__nome" aria-haspopup="true" aria-expanded="false">
        ${escapeHtml(user.nome || 'Minha conta')}
      </button>
      <div class="auth-menu__dropdown" role="menu">
        <a class="auth-menu__logout" href="${logoutUrl}">Fazer logout</a>
      </div>
    `;

    const button = menu.querySelector('button');
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', () => {
      menu.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    });

    return menu;
  }

  async function init() {
    const container = getAuthArea();
    if (!container) return;

    try {
      const response = await fetch(statusUrl, { credentials: 'same-origin' });
      if (!response.ok) return;

      const data = await response.json();
      if (!data.logged_in || !data.user) return;

      removeAuthLinks(container);

      if (container.querySelector('.auth-menu')) return;

      const reference = container.querySelector('.busca__wrapper');
      const menu = createMenu(data.user);
      if (reference && reference.nextSibling) {
        reference.parentNode.insertBefore(menu, reference.nextSibling);
      } else if (reference) {
        reference.parentNode.appendChild(menu);
      } else {
        container.appendChild(menu);
      }
    } catch (erro) {
      console.error(erro);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
