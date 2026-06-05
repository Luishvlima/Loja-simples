(function () {
  const currentScript = document.currentScript;
  const baseUrl =
    currentScript && currentScript.src
      ? currentScript.src
      : window.location.href;

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

  function getAuthAreas() {
    const mobile = document.querySelector('.cabecalho_mobile .lado__acoes');
    const desktop = document.querySelector('.cabecalho_desktop .lado__acoes');

    return [mobile, desktop].filter(Boolean);
  }

  function removeAuthLinks(container) {
    container.querySelectorAll(
      'a[href*="login"], a[href*="cadastro"]'
    ).forEach((link) => link.remove());
  }

  function createMenu(user) {
    const menu = document.createElement('div');
    menu.className = 'auth-menu';

    menu.innerHTML = `
      <button type="button" class="botao botao--entrar auth-menu__botao auth-menu__nome"
        aria-haspopup="true" aria-expanded="false">
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

    return menu;
  }

  // 🔥 listener global único (fora do createMenu)
  document.addEventListener('click', () => {
    document.querySelectorAll('.auth-menu.is-open').forEach((menu) => {
      menu.classList.remove('is-open');

      const btn = menu.querySelector('button');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  async function init() {
    const containers = getAuthAreas();
    if (!containers.length) return;

    try {
      const response = await fetch(statusUrl, {
        credentials: 'same-origin',
      });

      if (!response.ok) return;

      const data = await response.json();
      if (!data.logged_in || !data.user) return;

      containers.forEach((container) => {
        removeAuthLinks(container);

        // remove menu antigo
        const oldMenu = container.querySelector('.auth-menu');
        if (oldMenu) oldMenu.remove();

        const menu = createMenu(data.user);

        container.appendChild(menu);
      });
    } catch (erro) {
      console.error(erro);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();