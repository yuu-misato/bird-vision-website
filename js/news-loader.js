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
   * microCMS API からニュース一覧を取得
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
   * microCMS API から単一記事を取得
   */
  async function fetchNewsDetail(id) {
    const { SERVICE_DOMAIN, API_KEY, ENDPOINT } = CMS_CONFIG;

    const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}/${id}`;

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
   * 記事のリンク先を決定
   * - 外部URL指定あり → そのURL
   * - なし → 詳細ページ
   */
  function getArticleHref(item) {
    if (item.url && item.url.trim()) return item.url;
    return `news-detail.html?id=${item.id}`;
  }

  function isExternalUrl(url) {
    return url && url.startsWith('http');
  }

  /**
   * 画像部分のHTML生成（サムネイルの有無で分岐）
   */
  function createImageHTML(thumbUrl, title) {
    if (thumbUrl) {
      return `
        <div class="news-v2-card-image">
          <img src="${thumbUrl}" alt="${title}" loading="lazy">
        </div>`;
    }
    return `
      <div class="news-v2-card-image news-v2-card-image--noimage">
        <span class="material-icons news-v2-card-noimage-icon">article</span>
      </div>`;
  }

  /**
   * トップページ用ニュースカード
   */
  function createCardHTML(item) {
    const thumb = item.thumbnail?.url || '';
    const title = item.title || 'No Title';
    const date = formatDate(item.date);
    const href = getArticleHref(item);
    const targetAttr = isExternalUrl(href) ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `
      <a href="${href}"${targetAttr} class="news-v2-card fade-in is-visible">
        ${createImageHTML(thumb, title)}
        <div class="news-v2-card-body">
          <time class="news-v2-card-date">${date}</time>
          <h3 class="news-v2-card-title">${title}</h3>
        </div>
      </a>
    `;
  }

  /**
   * 一覧ページ用ニュースカード
   */
  function createListCardHTML(item) {
    const thumb = item.thumbnail?.url || '';
    const title = item.title || 'No Title';
    const date = formatDateFull(item.date);
    const href = getArticleHref(item);
    const targetAttr = isExternalUrl(href) ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `
      <a href="${href}"${targetAttr} class="news-v2-card fade-in is-visible">
        ${createImageHTML(thumb, title)}
        <div class="news-v2-card-body">
          <time class="news-v2-card-date">${date}</time>
          <h3 class="news-v2-card-title">${title}</h3>
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
        id: 'demo-1',
        title: 'バードビジョン公式ホームページを開設しました',
        date: '2025-01-15T00:00:00.000Z',
        thumbnail: { url: 'https://storage.googleapis.com/studio-cms-assets/projects/G3qbB1vEqJ/s-2400x1601_v-frms_webp_bbc2ac57-6d6f-488a-a1ab-a916e31309c3_small.webp' },
        url: '',
        body: '<p>バードビジョン公式ホームページを開設しました。クレーンを使った新次元の空撮サービスについて、詳しくご紹介しています。</p>'
      },
      {
        id: 'demo-2',
        title: 'なまずのぼり2025 ニュースリリース',
        date: '2025-05-10T00:00:00.000Z',
        thumbnail: { url: 'https://storage.googleapis.com/studio-cms-assets/projects/G3qbB1vEqJ/s-4411x2941_v-frms_webp_7c03c46f-67e8-4085-99a9-7049a4cb3d63_small.webp' },
        url: 'https://prtimes.jp/main/html/rd/p/000000005.000127964.html',
        body: ''
      },
      {
        id: 'demo-3',
        title: 'なまずのぼり — クレーン空撮イベント',
        date: '2025-05-12T00:00:00.000Z',
        thumbnail: { url: 'https://storage.googleapis.com/studio-cms-assets/projects/G3qbB1vEqJ/s-6720x4480_v-frms_webp_1eff24a9-8282-44a5-8f7c-c7d20a426b3d_small.webp' },
        url: '',
        body: '<p>なまずのぼりは、篠田重機のクレーン技術を活用した地域イベントです。</p>'
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

  /**
   * 詳細ページ: 記事本文描画
   */
  async function renderNewsDetail() {
    const container = document.getElementById('newsDetail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      container.innerHTML = '<p class="news-detail-error">記事が見つかりません</p>';
      return;
    }

    const item = await fetchNewsDetail(id);

    if (!item) {
      container.innerHTML = '<p class="news-detail-error">記事の読み込みに失敗しました</p>';
      return;
    }

    const thumb = item.thumbnail?.url || '';
    const thumbHTML = thumb ? `<div class="news-detail-hero"><img src="${thumb}" alt="${item.title}" loading="lazy"></div>` : '';

    container.innerHTML = `
      ${thumbHTML}
      <div class="news-detail-meta">
        <time class="news-detail-date">${formatDateFull(item.date)}</time>
      </div>
      <h1 class="news-detail-title">${item.title || ''}</h1>
      <div class="news-detail-body">${item.body || '<p>本文はありません</p>'}</div>
    `;
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    renderTopNews();
    renderNewsList();
    renderNewsDetail();
  });
})();
