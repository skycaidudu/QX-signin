/**
 * 一点万象（mixcapp）自动签到 - Quantumult X Task
 * 核心：POST https://app.mixcapp.com/mixc/gateway
 * action=mixc.app.memberSign.sign
 *
 * 你只需要改：deviceParams / token / imei（从 Stream 抓包里复制）
 */

const SECRET = "P@Gkbu0shTNHjhM!7F";

// ====== 1) 这里填你自己的参数（从抓包 body 里复制） ======
const mallNo = "0301A404";
const appId = "68a91a5bac6a4f3e91bf4b42856785c6";
const platform = "h5";
const imei = "D9A5E8A5-CB59-460A-89BE-F7A591DFBE30"; // 你的抓包里那串
const appVersion = "4.1.0";
const osVersion = "17.4.1";
const params = "eyJtYWxsTm8iOiIwMzAxQTQwNCJ9";

const deviceParams = "eyJwaG9uZSI6IjE1MDAwOTYyMTgwIiwiZGV2aWNlIjoiaVBob25lMTQsMiIsImRldmljZUlkIjoiQlZuWCtvTGFmNGZmK2dEYWRQeXM0K3p2K1krWHhUTWhIdndNeTFrNTF5eDZmZXRzU1djQUltclhZNzZSU3pDN1hlU0R0eGFkaDlNVHA1SUVPbDU5c1lRPT0iLCJsb2NhdGlvbiI6eyJncHNMb25naXR1ZGUiOiIxMjEuMzcyNyIsImdwc0xhdGl0dWRlIjoiMzEuMTgzOSJ9LCJkZXZpY2VOYW1lIjoiaVBob25lIn0%3D";
const token = "378009193eae41fb9493005cea9a1097";

// （可选但建议）从抓包 Request Header 里复制 Cookie，没抓到也可以先留空试
const cookie = ""; // 例如：FZ_STROAGE.mixcapp.com=...; ARK_ID=...; acw_tc=...; smidV2=...

// ====== 2) 工具函数：MD5 ======
// 轻量 md5 实现（够用）
function md5cycle(x, k) {
  let [a, b, c, d] = x;

  function ff(a, b, c, d, x, s, t) {
    a = (a + ((b & c) | (~b & d)) + (x >>> 0) + t) >>> 0;
    return (((a << s) | (a >>> (32 - s))) + b) >>> 0;
  }
  function gg(a, b, c, d, x, s, t) {
    a = (a + ((b & d) | (c & ~d)) + (x >>> 0) + t) >>> 0;
    return (((a << s) | (a >>> (32 - s))) + b) >>> 0;
  }
  function hh(a, b, c, d, x, s, t) {
    a = (a + (b ^ c ^ d) + (x >>> 0) + t) >>> 0;
    return (((a << s) | (a >>> (32 - s))) + b) >>> 0;
  }
  function ii(a, b, c, d, x, s, t) {
    a = (a + (c ^ (b | ~d)) + (x >>> 0) + t) >>> 0;
    return (((a << s) | (a >>> (32 - s))) + b) >>> 0;
  }

  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);

  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);

  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);

  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);

  x[0] = (x[0] + a) >>> 0;
  x[1] = (x[1] + b) >>> 0;
  x[2] = (x[2] + c) >>> 0;
  x[3] = (x[3] + d) >>> 0;
}

function md5blk(s) {
  const md5blks = [];
  for (let i = 0; i < 64; i += 4) {
    md5blks[i >> 2] =
      s.charCodeAt(i) +
      (s.charCodeAt(i + 1) << 8) +
      (s.charCodeAt(i + 2) << 16) +
      (s.charCodeAt(i + 3) << 24);
  }
  return md5blks;
}

function md51(s) {
  let n = s.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let i;
  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
  }
  s = s.substring(i - 64);
  const tail = new Array(16).fill(0);
  for (i = 0; i < s.length; i++)
    tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (i = 0; i < 16; i++) tail[i] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
}

function rhex(n) {
  const s = "0123456789abcdef";
  let j, str = "";
  for (j = 0; j < 4; j++)
    str += s.charAt((n >> (j * 8 + 4)) & 0x0f) + s.charAt((n >> (j * 8)) & 0x0f);
  return str;
}

function hex(x) {
  for (let i = 0; i < x.length; i++) x[i] = rhex(x[i]);
  return x.join("");
}

function md5(s) {
  return hex(md51(s));
}

// ====== 3) 计算 sign，然后发请求 ======
(async () => {
  const timestamp = Date.now().toString();

  // 这串“待加密字符串”的结构，来自公开脚本的思路：最后拼 SECRET 再 md5 :contentReference[oaicite:6]{index=6}
  const sig =
    `action=mixc.app.memberSign.sign&apiVersion=1.0` +
    `&appId=${appId}` +
    `&appVersion=${appVersion}` +
    `&deviceParams=${deviceParams}` +
    `&imei=${imei}` +
    `&mallNo=${mallNo}` +
    `&osVersion=${osVersion}` +
    `&params=${params}` +
    `&platform=${platform}` +
    `&timestamp=${timestamp}` +
    `&token=${token}` +
    `&${SECRET}`;

  const sign = md5(sig);

  const body =
    `mallNo=${mallNo}` +
    `&appId=${appId}` +
    `&platform=${platform}` +
    `&imei=${imei}` +
    `&appVersion=${appVersion}` +
    `&osVersion=${osVersion}` +
    `&action=mixc.app.memberSign.sign` +
    `&apiVersion=1.0` +
    `&timestamp=${timestamp}` +
    `&deviceParams=${deviceParams}` +
    `&token=${token}` +
    `&params=${params}` +
    `&sign=${sign}`;

  const request = {
    url: "https://app.mixcapp.com/mixc/gateway",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json, text/plain, */*",
      "Origin": "https://app.mixcapp.com",
      "Referer": `https://app.mixcapp.com/m/m-${mallNo}/signIn?showWebNavigation=true&appVersion=${appVersion}&mallNo=${mallNo}`,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) crland/4.4.0 /MIXCAPP/4.1.0",
      ...(cookie ? { "Cookie": cookie } : {})
    },
    body
  };

  try {
    const resp = await $task.fetch(request);
    const text = resp.body || "";
    $notify("一点万象签到", `HTTP ${resp.statusCode}`, text.slice(0, 200));
  } catch (e) {
    $notify("一点万象签到", "请求失败", String(e));
  }
})();
