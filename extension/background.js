// 安装时创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'clip-page',
    title: '📥 智能抓取此页',
    contexts: ['page']
  });
});

// 点扩展图标直接抓取（不弹窗）
chrome.action.onClicked.addListener((tab) => {
  clipPage(tab);
});

// 右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'clip-page' && tab) {
    clipPage(tab);
  }
});

// 核心抓取函数：注入 content script 提取页面正文并在页面内下载
function clipPage(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractAndDownload,
  }).then((results) => {
    // 下载在 content script 里完成，这里只检查是否成功
    if (results && results[0] && results[0].result) {
      const { ok, filename, error } = results[0].result;
      if (!ok) {
        console.error('下载失败:', error);
      }
    }
  }).catch((err) => {
    console.error('抓取失败:', err);
  });
}

// 注入到页面执行的函数（在页面上下文下载，避免 Service Worker 限制）
function extractAndDownload() {
  try {
    var sels = ['#js_content', '.rich_media_content', 'article', 'main', '.post-content', '.article-content', '.entry-content', '#content', '.content', '.article-body'];
    var el = null;
    for (var i = 0; i < sels.length; i++) {
      var e = document.querySelector(sels[i]);
      if (e && e.textContent.trim().length > 80) { el = e; break; }
    }
    if (!el) el = document.body;

    var tEl = document.querySelector('h1') || document.querySelector('#activity-name') || document.querySelector('.rich_media_title') || document.querySelector('meta[property="og:title"]');
    var t = tEl ? (tEl.textContent || tEl.content || '').trim() : '';
    if (!t) t = document.title || '';
    if (!t) t = location.hostname || 'webpage';

    var cl = el.cloneNode(true);
    cl.querySelectorAll('script,style,img,nav,header,footer,aside,iframe,form,button,svg,noscript,.ad,.sidebar,.comment,.share,.related,.recommend,.qr_code_pc,.reward_area,.rich_media_tool,[class*=comment],[class*=recommend],[class*=advert],[class*=sidebar],[class*=footer],[class*=header]').forEach(function(e) { e.remove(); });

    var body = '';
    function walk(n) {
      n.childNodes.forEach(function(x) {
        if (x.nodeType === 3) {
          var tx = x.textContent.replace(/\s+/g, ' ');
          if (tx.trim()) body += tx;
        } else if (x.nodeType === 1) {
          var tg = x.tagName.toLowerCase();
          if (['h1','h2','h3','h4','h5','h6'].indexOf(tg) > -1) {
            body += '\n\n' + '#'.repeat(parseInt(tg[1])) + ' ' + x.textContent.trim() + '\n\n';
          } else if (tg === 'p') { walk(x); body += '\n\n'; }
          else if (tg === 'pre') { body += '\n```\n' + x.textContent + '\n```\n\n'; }
          else if (tg === 'blockquote') { body += '\n> ' + x.textContent.replace(/\n/g, '\n> ') + '\n\n'; }
          else if (tg === 'br') { body += '\n'; }
          else if (tg === 'ul' || tg === 'ol') {
            x.querySelectorAll(':scope>li').forEach(function(li) { body += '\n- ' + li.textContent.trim(); });
            body += '\n\n';
          } else if (['div','section','article','span','figure','main'].indexOf(tg) > -1) { walk(x); }
        }
      });
    }
    walk(cl);
    body = body.replace(/\n{3,}/g, '\n\n').trim();

    var md = '---\ntitle: ' + t + '\nsource: ' + location.href + '\ndomain: ' + location.hostname + '\nimported: ' + new Date().toISOString() + '\n---\n\n# ' + t + '\n\n' + body;
    var safeName = t.replace(/[^a-zA-Z0-9_一-龥]/g, '_').replace(/_+/g, '_').slice(0, 50);
    if (!safeName || safeName === '_') safeName = 'webpage_' + Date.now();
    var filename = 'imported_' + safeName + '.md';

    // 在页面上下文里下载（用 Blob + a.click，和书签版一样）
    var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);

    return { ok: true, filename: filename };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
