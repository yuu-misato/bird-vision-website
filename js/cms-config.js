/* =============================================
   microCMS Configuration
   =============================================

   設定手順:
   1. https://microcms.io でアカウント作成
   2. サービス作成 → API「news」をリスト形式で作成
   3. フィールド設定:
      - title (テキストフィールド) — 記事タイトル
      - date (日時) — 公開日
      - thumbnail (画像) — サムネイル画像
      - url (テキストフィールド, 任意) — 外部リンクURL
   4. 下記のSERVICE_DOMAINとAPI_KEYを書き換え
   ============================================= */

const CMS_CONFIG = {
  // ▼▼▼ ここを自分のmicroCMS情報に書き換え ▼▼▼
  SERVICE_DOMAIN: 'birdvision',
  API_KEY: 'fJ4SfMVPi928qCoOQEIoJvmjtlUfdNKRqKLB',
  // ▲▲▲ ここを書き換え ▲▲▲

  ENDPOINT: 'news',
  TOP_LIMIT: 3,    // トップページに表示する件数
  LIST_LIMIT: 20,  // 一覧ページに表示する件数
};
