/**
 * mixc_get_params.js
 * 作用：从 /mixc/gateway 的请求体里抓：token / deviceParams / imei / mallNo / appVersion / osVersion / appId
 * 保存到 QX 的持久化存储（prefs），供定时任务脚本读取。
 */

function parseForm(body) {
  const obj = {};
  if (!body) return obj;
  body.split("&").forEach(kv => {
    const idx = kv.indexOf("=");
    if (idx === -1) return;
    const k = kv.slice(0, idx);
    const v = kv.slice(idx + 1);
    obj[k] = v;
  });
  return obj;
}

try {
  const body = $request.body || "";
  const p = parseForm(body);

  // 只要 body 里出现了这些字段，就保存
  const keys = ["token", "deviceParams", "imei", "mallNo", "appVersion", "osVersion", "appId"];
  let saved = [];

  keys.forEach(k => {
    if (p[k]) {
      $prefs.setValueForKey(p[k], `mixc_${k}`);
      saved.push(`${k}✅`);
    }
  });

  // 额外保存：最近一次 action（方便你确认抓到的是不是万象的请求）
  if (p["action"]) {
    $prefs.setValueForKey(p["action"], "mixc_last_action");
    saved.push("action✅");
  }

  if (saved.length > 0) {
    $notify(
      "一点万象 - 已抓到参数",
      saved.join(" "),
      `last_action: ${$prefs.valueForKey("mixc_last_action") || ""}`
    );
  } else {
    $notify("一点万象 - 未抓到参数", "请确认打开了万象签到页", "并且已开启 MITM + 重写");
  }
} catch (e) {
  $notify("一点万象 - 抓参数脚本异常", "", String(e));
}

$done({});
