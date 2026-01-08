/**
 * 一点万象（mixcapp.com）自动签到 Quantumult X
 * 用法：
 * 1) 先开启重写（rewrite_local）让脚本抓 Cookie
 * 2) 打开 App 触发一次签到页 /signIn（或你抓到的同域请求），看到“获取Cookie成功”
 * 3) 配置 task_local 定时运行本脚本即可
 *
 * 说明：
 * - 本脚本按你的抓包：GET https://app.mixcapp.com/m/m-xxxx/signIn?... 复现
 * - timestamp 每次自动生成（Date.now()）
 */

const COOKIE_KEY = "mixc_cookie";
const PATH_KEY = "mixc_signin_path"; // 例如 /m/m-0301A404/signIn
const UA_KEY = "mixc_ua";

function getStore(key) {
  if (typeof $prefs !== "undefined") return $prefs.valueForKey(key);
  return $persistentStore.read(key);
}

function setStore(key, val) {
  if (typeof $prefs !== "undefined") return $prefs.setValueForKey(val, key);
  return $persistentStore.write(val, key);
}

function notify(title, subtitle, message) {
  if (typeof $notify !== "undefined") $notify(title, subtitle, message);
}

function done(value = {}) {
  if (typeof $done !== "undefined") $done(value);
}

const isRequest = typeof $request !== "undefined";

if (isRequest) {
  // ========== 获取 Cookie 模式 ==========
  const url = $request.url || "";
  const headers = $request.headers || {};
  const cookie = headers["Cookie"] || headers["cookie"] || "";
  const ua = headers["User-Agent"] || headers["user-agent"] || "";

  if (!cookie) {
    notify("一点万象", "未获取到 Cookie", "请确认已开启 MitM 且访问了 app.mixcapp.com 的页面/接口");
    return done({});
  }

  // 从 URL 里提取 /signIn 的路径（你抓到的是 /m/m-0301A404/signIn）
  const m = url.match(/https?:\/\/app\.mixcapp\.com(\/[^?]*signIn)/i);
  if (m && m[1]) setStore(PATH_KEY, m[1]);

  setStore(COOKIE_KEY, cookie);
  if (ua) setStore(UA_KEY, ua);

  notify("一点万象", "Cookie 获取成功 ✅", `已保存 Cookie\n已保存路径：${getStore(PATH_KEY) || "（未识别到 signIn 路径，后续可手动写死）"}`);
  return done({});
}

// ========== 定时签到模式 ==========
(async () => {
  const cookie = getStore(COOKIE_KEY);
  const path = getStore(PATH_KEY) || "/m/m-0301A404/signIn"; // 兜底：用你抓到的
  const ua = getStore(UA_KEY) || "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) /MIXCAPP/4.1.0";

  if (!cookie) {
    notify("一点万象", "未签到", "还没抓到 Cookie：先开启重写，然后打开 App 触发一次 signIn");
    return done();
  }

  // 你的抓包参数里很多是展示相关的，这里保留关键的 timestamp，其他可按需加
  const ts = Date.now();
  const url = `https://app.mixcapp.com${path}?timestamp=${ts}`;

  const opts = {
    url,
    method: "GET",
    headers: {
      "Host": "app.mixcapp.com",
      "Cookie": cookie,
      "User-Agent": ua,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Connection": "keep-alive",
    },
  };

  try {
    const resp = await $task.fetch(opts);
    const status = resp.statusCode || resp.status || 0;
    const body = resp.body || "";

    // 简单判断：HTTP 状态 + body 里是否有“签到/成功/积分”等字样（不同地区/版本可能不同）
    const okHint = /签到|签到了|成功|积分|已领取|已签到/i.test(body);
    const resultLine = `HTTP ${status}${okHint ? "（疑似成功）" : ""}`;

    notify("一点万象", "签到请求已发送", resultLine);
  } catch (e) {
    notify("一点万象", "签到失败", String(e));
  }

  done();
})();
