/* =============================================
   microCMS News Loader
   ============================================= */
(() => {
  'use strict';

  const DEFAULT_THUMB = 'https://storage.googleapis.com/studio-cms-assets/projects/G3qbB1vEqJ/s-2400x1601_v-frms_webp_bbc2ac57-6d6f-488a-a1ab-a916e31309c3_small.webp';

  /**
   * 日付を YYYY.MM 形式にフォーマット
   */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}.${m}`;
  }

  /**
   * 日付を YYYY.MM.DD 形式にフォーマット
   */
  function formatDateFull(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  }

  /**
   * microCMS API からニュースを取得
   */
  async function fetchNews(limit) {
    const { SERVICE_DOMAIN, API_KEY, ENDPOINT } = CMS_CONFIG;

    if (SERVICE_DOMAIN === 'YOUR_SERVICE_DOMAIN' || API_KEY === 'YOUR_API_KEY') {
      console.warn('[News Loader] microCMS未設定。フォールバックデータを表示します。');
      return null;
    }

    const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}?limit=${limit}&orders=-date`;

    try {
      const res = await fetch(url, {
        headers: { 'X-MICROCMS-API-KEY': API_KEY }
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[News Loader]', err);
      return null;
    }
  }

  /**
   * ニュースカードのHTML生成
   */
  function createCardHTML(item) {
    const thumb = item.thumbnail?.url || DEFAULT_THUMB;
    const title = item.title || 'No Title';
    const date = formatDate(item.date);
    const href = item.url || 'news.html';
    const isExternal = item.url && item.url.startsWith('http');
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `
      <a href="${href}"${targetAttr} class="news-v2-card fade-in is-visible">
        <div class="news-v2-card-image">
          <img src="${thumb}" alt="${title}" loading="lazy">
        </div>
        <div class="news-v2-card-body">
          <time class="news-v2-card-date">${date}</time>
          <h3 class="news-v2-card-title">${title}</h3>
        </div>
      </a>
    `;
  }

  /**
   * ニュース一覧カード（news.html用）
   */
  function createListCardHTML(item) {
    const thumb = item.thumbnail?.url || DEFAULT_THUMB;
    const title = item.title || 'No Title';
    const date = formatDateFull(item.date);
    const href = item.url || '#';
    const isExternal = item.url && item.url.startsWith('http');
    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `
      <a href="${href}"${targetAttr} class="news-list-card fade-in is-visible">
        <div class="news-list-card-image">
          <img src="${thumb}" alt="${title}" loading="lazy">
        </div>
        <div class="news-list-card-body">
          <time class="news-list-card-date">${date}</time>
          <h3 class="news-list-card-title">${title}</h3>
        </div>
      </a>
    `;
  }

  /**
   * フォールバック: microCMS未設定時のデモデータ
   */
  function getFallbackData() {
    return [
      {
        title: 'バードビジョン公式ホームページを開設しました',
        date: '2025-01-15T00:00:00.000Z',
        thumbnail: { url: 'https://storage.googleapis.com/studio-cms-assets/projects/G3qbB1vEqJ/s-2400x1601_v-frms_webp_bbc2ac57-6d6f-488a-a1ab-a916e31309c3_small.webp' },
        url: 'news.html'
      },
      {
        title: 'なまずのぼり2025 ニュースリリース',
        date: '2025-05-10T00:00:00.000Z',
        thumbnail: { url: 'https://storage.googleapis.com/studio-cms-assets/projects/G3qbB1vEqJ/s-4411x2941_v-frms_webp_7c03c46f-67e8-4085-99a9-7049a4cb3d63_small.webp' },
        url: 'https://prtimes.jp/main/html/rd/p/000000005.000127964.html'
      },
      {
        title: 'なまずのぼり — クレーン空撮イベント',
        date: '2025-05-12T00:00:00.000Z',
        thumbnail: { url: 'https://storage.googleapis.com/studio-cms-assets/projects/G3qbB1vEqJ/s-6720x4480_v-frms_webp_1eff24a9-8282-44a5-8f7c-c7d20a426b3d_small.webp' },
        url: 'news.html'
      }
    ];
  }

  /**
   * トップページ: ニュースグリッド描画
   */
  async function renderTopNews() {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;

    const data = await fetchNews(CMS_CONFIG.TOP_LIMIT);
    const items = data?.contents || getFallbackData();

    if (items.length === 0) {
      grid.innerHTML = '<div class="news-v2-empty">ニュースはまだありません</div>';
      return;
    }

    grid.innerHTML = items.map(createCardHTML).join('');
  }

  /**
   * 一覧ページ: ニュースリスト描画
   */
  async function renderNewsList() {
    const list = document.getElementById('newsList');
    if (!list) return;

    const data = await fetchNews(CMS_CONFIG.LIST_LIMIT);
    const items = data?.contents || getFallbackData();

    if (items.length === 0) {
      list.innerHTML = '<div class="news-v2-empty">ニュースはまだありません</div>';
      return;
    }

    list.innerHTML = items.map(createListCardHTML).join('');
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    renderTopNews();
    renderNewsList();
  });
})();
