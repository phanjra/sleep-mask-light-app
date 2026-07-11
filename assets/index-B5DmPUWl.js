var bt=Object.defineProperty;var vt=(i,t,e)=>t in i?bt(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var d=(i,t,e)=>vt(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();const M=1,L=100,$=50,rt=1,at=60,ot=10;function v(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(M,Math.min(L,t)):$}function N(i){const t=i.trim();if(t==="")return null;const e=Number(t);return Number.isFinite(e)?Math.round(e):null}function Q(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(rt,Math.min(at,t)):ot}const g=["mon","tue","wed","thu","fri","sat","sun"],Z=["sun","mon","tue","wed","thu","fri","sat"],wt={sun:"S",mon:"M",tue:"T",wed:"W",thu:"T",fri:"F",sat:"S"},tt={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"},D=14,lt="sml-draft-alarms-v3",Tt="sml-draft-schedule-v2";function X(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:$,postHoldMin:20,oneShot:!1}}function St(){return{...X(),enabled:!1,oneShot:!1}}function Et(){return Object.fromEntries(g.map(i=>[i,St()]))}function V(){return`alarm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Mt(i={}){const t=X();return{id:V(),days:[g[new Date().getDay()===0?6:new Date().getDay()-1]],enabled:!0,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:!1,...i}}function Lt(i){let t=0;for(const e of i){const s=g.indexOf(e);s>=0&&(t|=1<<s)}return t&127}function Dt(i){return g.filter((t,e)=>(i&1<<e)!==0)}function j(i){const t=i.slot;return{id:typeof i.id=="string"&&i.id?i.id:V(),days:Array.isArray(i.days)&&i.days.length>0?i.days:["mon"],enabled:i.enabled??(t==null?void 0:t.enabled)??!0,time:i.time??(t==null?void 0:t.time)??"07:00",prewindowMin:i.prewindowMin??(t==null?void 0:t.prewindowMin)??20,pwmMax:v(i.pwmMax??(t==null?void 0:t.pwmMax)??$),postHoldMin:i.postHoldMin??(t==null?void 0:t.postHoldMin)??20,oneShot:!!(i.oneShot??(t==null?void 0:t.oneShot))}}function U(i){const t=new Map;for(const s of g){const n=i[s];if(!n||!n.enabled&&!n.oneShot&&n.time==="07:00"&&n.prewindowMin===20&&n.pwmMax===$&&n.postHoldMin===20)continue;const a=JSON.stringify({enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin,oneShot:!!n.oneShot}),o=t.get(a)??[];o.push(s),t.set(a,o)}const e=[];for(const[s,n]of t){const r=JSON.parse(s);e.push(j({days:n,enabled:r.enabled,time:r.time,prewindowMin:r.prewindowMin,pwmMax:r.pwmMax,postHoldMin:r.postHoldMin,oneShot:!!r.oneShot}))}return e}function $t(){try{const i=localStorage.getItem(lt);if(i){const s=JSON.parse(i);if(Array.isArray(s))return s.map(n=>j(n))}const t=localStorage.getItem(Tt);if(t){const s=JSON.parse(t);return U(s)}const e=localStorage.getItem("sml-draft-schedule-v1");if(e){const s=JSON.parse(e);return U(s)}return null}catch{return null}}function T(i){localStorage.setItem(lt,JSON.stringify(i.slice(0,D)))}function x(i){const t=i.find(n=>n.startsWith("SCHED_VERSION:"));if((t?Number(t.split(":")[1].trim()):0)>=5||i.some(n=>n.startsWith("SLOT "))){const n=[];for(const r of i){const a=r.match(/^SLOT\s+(\d+)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!a)continue;const o=a[2].toUpperCase()==="ON",l=a[3],c=Number(a[4]),h=Number(a[5]),m=Number(a[6]),f=Number(a[7])===1,y=Number(a[8]);if(c<1||c>240||m<1||m>240||h<1||h>100||y<0||y>127)continue;const w=Dt(y);w.length===0&&!o||n.push(j({id:`slot-${a[1]}`,days:w.length>0?w:["mon"],enabled:o,time:l,prewindowMin:c,pwmMax:v(h),postHoldMin:m,oneShot:f}))}return n}const s=Et();for(const n of i){const r=n.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!r)continue;const a=r[1].toLowerCase(),o=Number(r[4]),l=Number(r[5]),c=Number(r[6]),h=Number(r[7])===1;o<1||o>240||c<1||c>240||l<1||l>100||(s[a]={enabled:r[2].toUpperCase()==="ON",time:r[3],prewindowMin:o,pwmMax:v(l),postHoldMin:c,oneShot:h})}return U(s)}function At(i,t){if(i.length!==t.length)return!1;const e=s=>[...s].map(n=>({days:[...n.days].sort().join(","),enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin,oneShot:n.oneShot})).sort((n,r)=>`${n.time}|${n.days}`.localeCompare(`${r.time}|${r.days}`));return JSON.stringify(e(i))===JSON.stringify(e(t))}function z(i,t){return g.indexOf(i)-g.indexOf(t)}function Ct(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);return t?Number(t[1])*60+Number(t[2]):420}function Nt(i,t,e,s){const n=Ct(t),r=Math.floor(n/60),a=n%60,o=g.indexOf(s);let c=(g.indexOf(i)-o+7)%7;const h=new Date(e);return h.setHours(r,a,0,0),c>0?h.setDate(h.getDate()+c):h.getTime()<=e.getTime()&&h.setDate(h.getDate()+7),h.getTime()}function dt(i,t,e=new Date){const s=i.match(/^(\d{1,2}):(\d{2})$/);if(!s)return t;const n=Number(s[1])*60+Number(s[2]),r=e.getHours()*60+e.getMinutes();if(n>r)return t;const a=g.indexOf(t);return g[(a+1)%7]}function et(i,t,e){const s=i.oneShot?[dt(i.time,e,t)]:i.days;return s.length===0?Number.MAX_SAFE_INTEGER:Math.min(...s.map(n=>Nt(n,i.time,t,e)))}function xt(i){return{...i,slot:{enabled:i.enabled,time:i.time,prewindowMin:i.prewindowMin,pwmMax:i.pwmMax,postHoldMin:i.postHoldMin,oneShot:i.oneShot}}}function _t(i,t=new Date,e){const s=e??["sun","mon","tue","wed","thu","fri","sat"][t.getDay()],n=i.map(xt);return n.sort((r,a)=>{const o=et(r,t,s),l=et(a,t,s);return o!==l?o-l:z(r.days[0]??"mon",a.days[0]??"mon")}),n}const Ht=new Set(["mon","tue","wed","thu","fri"]),kt=new Set(["sat","sun"]);function It(i,t){if(t&&"oneShot"in t&&t.oneShot)return"Once";if(i.length===0)return"No days";const e=[...i].sort(z);return e.length===7?"Every day":e.length===5&&e.every(s=>Ht.has(s))?"Weekdays":e.length===2&&e.every(s=>kt.has(s))?"Weekend":e.length===1?tt[e[0]]:e.map(s=>tt[s].slice(0,3)).join(", ")}function Ot(i){const t="pwmMax"in i?i.pwmMax:50,e="prewindowMin"in i?i.prewindowMin:20;return`${t}% brightness · ${e} min ramp`}function Pt(i,t,e){return i.map(s=>s.id===t.id?{...s,enabled:e}:s)}function Ft(i,t){const e={id:t.id??V(),days:[...t.days].sort(z),enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:t.oneShot};return t.isNew||!t.id?i.length>=D?i:[...i,e]:i.map(s=>s.id===t.id?e:s)}function st(i,t){return i.filter(e=>e.id!==t.id)}function Rt(i){const t=new Set(i.map(a=>a.time));let e=7,s=0,n="07:00";for(let a=0;a<96&&(n=`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`,!!t.has(n));a++)s+=15,s>=60&&(s=0,e=(e+1)%24);const r=X();return Mt({time:n,prewindowMin:r.prewindowMin,pwmMax:r.pwmMax,postHoldMin:r.postHoldMin,enabled:!0,oneShot:!1})}const B="6e400001-b5a3-f393-e0a9-e50e24dcca9e",Bt="6e400002-b5a3-f393-e0a9-e50e24dcca9e",Wt="6e400003-b5a3-f393-e0a9-e50e24dcca9e",W=200,q=3e3;class qt{constructor(){d(this,"device",null);d(this,"server",null);d(this,"rxChar",null);d(this,"buffer","");d(this,"queue",[]);d(this,"notifyWaiters",[]);d(this,"_connected",!1);d(this,"opChain",Promise.resolve());d(this,"onDisconnectCallback",null);d(this,"onUnsolicitedLine",null);d(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}setOnUnsolicitedLine(t){this.onUnsolicitedLine=t}async connect(){var n;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[B]}],optionalServices:[B]}),this.device.addEventListener("gattserverdisconnected",()=>{var a;this._connected=!1;const r=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(a=this.onDisconnectCallback)==null||a.call(this,r)});const t=await((n=this.device.gatt)==null?void 0:n.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService(B);this.rxChar=await e.getCharacteristic(Bt);const s=await e.getCharacteristic(Wt);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",r=>{const o=r.target.value;if(!o)return;const l=new TextDecoder().decode(o);for(this.buffer+=l;this.buffer.includes(`
`);){const c=this.buffer.indexOf(`
`),h=this.buffer.slice(0,c).trim();if(this.buffer=this.buffer.slice(c+1),!h)continue;const m=this.notifyWaiters.shift();m?m(h):this.onUnsolicitedLine?this.onUnsolicitedLine(h):this.queue.push(h)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const s=window.setTimeout(()=>{const r=this.notifyWaiters.indexOf(n);r>=0&&this.notifyWaiters.splice(r,1),e(null)},t),n=r=>{clearTimeout(s),e(r)};this.notifyWaiters.push(n)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(W,q)):this.collectLines(W,q))}async sendAndCollect(t,e=W,s=q,n){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,s,n)))}async collectLines(t,e,s){const n=[],r=Date.now()+e;for(;Date.now()<r;){const a=r-Date.now(),o=await this.waitForLine(Math.min(t,a));if(o===null){if(n.length)return n;continue}if(n.push(o),s!=null&&s(o,n))return n}return n}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.onUnsolicitedLine=null,this.opChain=Promise.resolve()}}const ct=250,Ut=8e3,Gt=5e3,Kt=200;function ut(i){const t=`OK ${i}`;return e=>e===t||e.startsWith(`${t} `)}function Yt(){const i=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=i.getTimezoneOffset(),s=t.getTimezoneOffset(),n=-e*60,a=e!==s?-Math.min(e,s)*60:0;return`TZ_OFFSET ${n} ${a}`}function Xt(){const i=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${i.getFullYear()}-${t(i.getMonth()+1)}-${t(i.getDate())} ${t(i.getHours())}:${t(i.getMinutes())}:${t(i.getSeconds())}`}function _(i){return i==="REQ_TIME"||i.startsWith("REQ_TIME ")}async function Vt(i){let t=i.drainQueue().some(_);if((await i.send(Yt())).some(_)&&(t=!0),!t){const s=Date.now()+2e3;for(;Date.now()<s;){const n=Math.max(100,Math.min(Kt,s-Date.now())),r=await i.sendAndCollect("",n,Math.min(600,s-Date.now()),a=>_(a));if(r.some(_)){t=!0;break}if(!r.length)break}}}async function jt(i){await i.send(Xt())}async function H(i){return await jt(i),Qt(i)}async function k(i){const t=await i.sendAndCollect("SCHED_GET",ct,Ut,ut("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function zt(i,t){const e=await i.send("SCHED_CLEAR");if(!e.some(r=>r.startsWith("OK SCHED_CLEAR")))throw new Error(`SCHED_CLEAR failed: ${e.join(" ")}`);const s=t.slice(0,D);for(let r=0;r<s.length;r++){const a=s[r];let o=Lt(a.days);o===0&&(o=1);const l=a.oneShot?1:0,c=await i.send(`SCHED_SLOT ${r} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin} ${l} ${o}`);if(!c.some(h=>h.startsWith("OK SCHED_SLOT")))throw new Error(`Failed to set slot ${r}: ${c.join(" ")}`);if(!a.enabled){const h=await i.send(`SCHED_SLOT ${r} OFF`);if(!h.some(m=>m.startsWith("OK SCHED_SLOT")))throw new Error(`Failed to disable slot ${r}: ${h.join(" ")}`)}}if(!(await i.send("SAVE")).some(r=>r.includes("SAVE ok")))throw new Error("SAVE failed")}function Jt(i){const t={};for(const e of i)e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function Qt(i){const t=await i.sendAndCollect("STATUS_LITE",ct,Gt,ut("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return Jt(t)}async function Zt(i,t,e){const s=await i.send(`LAMP_TEST ${t} ${e}`);if(!s.some(n=>n.startsWith("OK LAMP_TEST")))throw new Error(s.find(n=>n.startsWith("ERR"))??"LAMP_TEST failed")}async function te(i){const t=await i.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function J(){return typeof navigator<"u"&&!!navigator.bluetooth}function ee(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function se(){return J()}function ie(){return ee()&&!J()}function ne(i){if(!i)return!1;const t=i instanceof DOMException||i instanceof Error?i.name:"",e=i instanceof Error?i.message:String(i),s=e.toLowerCase();return!!(t==="AbortError"||t==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(e.trim()))}function re(){var i;try{const t=new Date(2020,0,1,13,0),e=new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).formatToParts(t);if(e.some(o=>o.type==="dayPeriod"))return!0;const s=((i=e.find(o=>o.type==="hour"))==null?void 0:i.value)??"";if(Number(s)===13||s==="13")return!1;const r=t.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});if(/\b(AM|PM|am|pm|a\.m\.|p\.m\.)\b/i.test(r))return!0;const{hour12:a}=new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions();return a===!0}catch{return!1}}const ht="sml-time-format-v1";function mt(){try{const i=localStorage.getItem(ht);if(i==="12"||i==="24"||i==="auto")return i}catch{}return"auto"}function ae(i){localStorage.setItem(ht,i)}function S(i=mt()){return i==="12"?!0:i==="24"?!1:re()}function oe(i){const t=i.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);if(!t)return null;const e=new Date(Number(t[1]),Number(t[2])-1,Number(t[3]),Number(t[4]),Number(t[5]),Number(t[6]??0));return Number.isNaN(e.getTime())?null:e}function it(i,t=S()){const e=oe(i);return e?new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12:t}).format(e):i}function F(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);if(!t)return{hour12:7,minute:0,period:"AM"};let e=Number(t[1]);const s=Math.max(0,Math.min(59,Number(t[2])));Number.isFinite(e)||(e=7),e=(e%24+24)%24;const n=e>=12?"PM":"AM";let r=e%12;return r===0&&(r=12),{hour12:r,minute:s,period:n}}function G(i,t,e){let s=i%12;e==="PM"&&(s+=12),e==="AM"&&i===12&&(s=0),e==="PM"&&i===12&&(s=12);const n=Math.max(0,Math.min(59,Math.round(t)));return`${String(s).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function le(i,t){const e=(Math.round(i)%24+24)%24,s=Math.max(0,Math.min(59,Math.round(t)));return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function K(i){const{hour12:t,minute:e,period:s}=F(i);return`${t}:${String(e).padStart(2,"0")} ${s}`}function Y(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);if(!t)return"07:00";const e=Number(t[1]),s=Number(t[2]);return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function de(i,t=S()){return t?K(i):Y(i)}function ce(i,t=S()){const e=i.trim();if(!e)return null;const s=e.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);if(s){const r=Number(s[1]),a=Number(s[2]);if(r<1||r>12||a>59)return null;const o=s[3].toUpperCase()==="PM"?"PM":"AM";return G(r,a,o)}const n=e.match(/^(\d{1,2}):(\d{2})$/);if(n){const r=Number(n[1]),a=Number(n[2]);return r>23||a>59?null:`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}`}if(t){const r=e.match(/^(\d{1,2}):(\d{2})$/);if(r){const a=Number(r[1]),o=Number(r[2]);if(a>=1&&a<=12&&o<=59)return G(a,o,a>=7&&a<=11?"AM":"PM")}}return null}const I=10;function ue(i,t){i.querySelectorAll(".alarm-swipe").forEach(e=>{const s=e,n=s.dataset.alarmId;if(!n)return;const r=s.querySelector(".alarm-row-panel"),a=s.querySelector(".alarm-swipe-delete");if(!r)return;let o=0,l=0,c=0,h=!1,m=null,f=null,y=!1;const w=(u,p)=>{r.style.transition=p?"transform 0.22s ease":"none",r.style.transform=u===0?"":`translateX(${u}px)`,s.classList.toggle("open",u<=-44/2)},pt=()=>{i.querySelectorAll(".alarm-swipe").forEach(u=>{const p=u;p.classList.remove("open");const b=p.querySelector(".alarm-row-panel");b&&(b.style.transition="",b.style.transform="")})},A=u=>{u<=-44?(pt(),w(-88,!0),s.classList.add("open")):(w(0,!0),s.classList.remove("open"))};a==null||a.addEventListener("click",u=>{u.stopPropagation(),t.onDelete(n)});const ft=(u,p)=>{c=s.classList.contains("open")?-88:0,o=u,l=p,h=!0,m=null,r.style.transition="none"},yt=(u,p)=>{if(!h)return;const b=u-o,C=p-l;if(m||(Math.abs(b)>I||Math.abs(C)>I)&&(m=Math.abs(b)>Math.abs(C)?"x":"y"),m!=="x")return;let E=c+b;E>0&&(E=0),E<-88&&(E=-88),w(E,!1)},gt=(u,p)=>{if(!h)return;h=!1,f=null;const b=u-o,C=p-l;if(m==="x"){A(c+b),y=!0,window.setTimeout(()=>{y=!1},400);return}if(!(Math.abs(b)>=I||Math.abs(C)>=I)){if(s.classList.contains("open")){A(0);return}t.onTap(n),y=!0,window.setTimeout(()=>{y=!1},400)}};r.addEventListener("pointerdown",u=>{if(u.pointerType==="mouse"&&u.button!==0)return;const p=u.target;p.closest(".alarm-swipe-delete")||p.closest("[data-action='group-toggle']")&&!s.classList.contains("open")||(f=u.pointerId,r.setPointerCapture(u.pointerId),ft(u.clientX,u.clientY))}),r.addEventListener("pointermove",u=>{f===u.pointerId&&(yt(u.clientX,u.clientY),m==="x"&&u.preventDefault())}),r.addEventListener("pointerup",u=>{f===u.pointerId&&(r.hasPointerCapture(u.pointerId)&&r.releasePointerCapture(u.pointerId),gt(u.clientX,u.clientY))}),r.addEventListener("pointercancel",u=>{f===u.pointerId&&(h=!1,f=null,A(s.classList.contains("open")?-88:0))}),r.addEventListener("click",u=>{if(y){u.preventDefault();return}if(s.classList.contains("open")){u.preventDefault(),A(0);return}u.target.closest("[data-action='group-toggle']")||t.onTap(n)})}),i.dataset.alarmSwipeDismissBound||(i.dataset.alarmSwipeDismissBound="1",i.addEventListener("click",e=>{e.target.closest(".alarm-swipe")||R(i)},{capture:!0}))}function R(i){i.querySelectorAll(".alarm-swipe").forEach(t=>{const e=t;e.classList.remove("open");const s=e.querySelector(".alarm-row-panel");s&&(s.style.transition="",s.style.transform="")})}const he=Array.from({length:12},(i,t)=>t+1),me=Array.from({length:24},(i,t)=>t),pe=Array.from({length:60},(i,t)=>t),fe=["AM","PM"],O=36,P=5;class ye{constructor(t,e,s,n={}){d(this,"root");d(this,"onChange");d(this,"use12Hour");d(this,"hour12");d(this,"hour24");d(this,"minute");d(this,"period");d(this,"typeInput",null);d(this,"hourCol",null);d(this,"minuteCol",null);d(this,"periodCol",null);d(this,"syncing",!1);d(this,"wrapTimers",new Map);this.root=t,this.onChange=s,this.use12Hour=n.use12Hour??S();const r=F(e);this.hour12=r.hour12,this.hour24=Number(e.split(":")[0])||7,this.minute=r.minute,this.period=r.period,this.render(),this.syncWheels(!1)}setTime24(t){const e=F(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!1),this.syncTypeField()}getTime24(){return this.use12Hour?G(this.hour12,this.minute,this.period):le(this.hour24,this.minute)}destroy(){this.wrapTimers.forEach(t=>window.clearTimeout(t)),this.wrapTimers.clear(),this.root.innerHTML=""}emit(){const t=this.getTime24();this.syncTypeField(),this.onChange(t)}syncTypeField(){this.typeInput&&(this.typeInput.value=this.use12Hour?K(this.getTime24()):Y(this.getTime24()))}placeholder(){return this.use12Hour?"6:30 AM":"18:30"}render(){var e,s,n,r,a,o;const t=this.use12Hour?'<div class="time-wheel-col time-wheel-col-period" data-wheel="period" tabindex="0"></div>':"";if(this.root.innerHTML=`
      <div class="time-wheel-picker ${this.use12Hour?"":"time-wheel-24h"}">
        <div class="time-wheel-columns">
          <div class="time-wheel-col" data-wheel="hour" tabindex="0"></div>
          <div class="time-wheel-col" data-wheel="minute" tabindex="0"></div>
          ${t}
          <div class="time-wheel-highlight" aria-hidden="true"></div>
        </div>
        <label class="time-wheel-type-label" for="time-wheel-type">Type a time</label>
        <input
          id="time-wheel-type"
          class="time-wheel-type-input"
          type="text"
          inputmode="text"
          autocomplete="off"
          placeholder="${this.placeholder()}"
          value="${this.use12Hour?K(this.getTime24()):Y(this.getTime24())}"
        />
      </div>
    `,this.hourCol=this.root.querySelector('[data-wheel="hour"]'),this.minuteCol=this.root.querySelector('[data-wheel="minute"]'),this.periodCol=this.root.querySelector('[data-wheel="period"]'),this.typeInput=this.root.querySelector("#time-wheel-type"),this.hourCol){const l=this.use12Hour?he.map(String):me.map(c=>String(c).padStart(2,"0"));this.fillColumn(this.hourCol,l,"hour",!0)}this.minuteCol&&this.fillColumn(this.minuteCol,pe.map(l=>String(l).padStart(2,"0")),"minute",!0),this.periodCol&&this.fillColumn(this.periodCol,fe,"period",!1),(e=this.hourCol)==null||e.addEventListener("scroll",()=>this.onWheelScroll("hour"),{passive:!0}),(s=this.minuteCol)==null||s.addEventListener("scroll",()=>this.onWheelScroll("minute"),{passive:!0}),(n=this.periodCol)==null||n.addEventListener("scroll",()=>this.onWheelScroll("period"),{passive:!0}),(r=this.typeInput)==null||r.addEventListener("change",()=>this.onTypeCommit()),(a=this.typeInput)==null||a.addEventListener("blur",()=>this.onTypeCommit()),(o=this.typeInput)==null||o.addEventListener("keydown",l=>{l.key==="Enter"&&(l.preventDefault(),this.onTypeCommit(),l.target.blur())})}fillColumn(t,e,s,n){const r=n?P:1,a=[];for(let o=0;o<r;o++)for(const l of e)a.push(`<div class="time-wheel-item" data-kind="${s}" data-value="${l}" data-copy="${o}">${l}</div>`);t.dataset.wrap=n?"1":"0",t.dataset.count=String(e.length),t.innerHTML=`<div class="time-wheel-spacer"></div>${a.join("")}<div class="time-wheel-spacer"></div>`}scrollToValue(t,e,s){const n=t.dataset.wrap==="1";Number(t.dataset.count||"1");const r=n?Math.floor(P/2):0,a=t.querySelector(`.time-wheel-item[data-value="${e}"][data-copy="${r}"]`),o=t.querySelector(`.time-wheel-item[data-value="${e}"]`),l=a??o;if(!l)return;const c=l.offsetTop-t.clientHeight/2+O/2;t.scrollTo({top:c,behavior:s?"smooth":"auto"})}recenterIfNeeded(t){var o;if(t.dataset.wrap!=="1")return;const e=Number(t.dataset.count||"1");if(e<1)return;const s=e*O,n=Math.floor(P/2)*s,r=((o=t.querySelector(".time-wheel-spacer"))==null?void 0:o.offsetHeight)??0,a=t.scrollTop+t.clientHeight/2-r-O/2;if(a<s||a>(P-1)*s){const l=(a%s+s)%s;this.syncing=!0,t.scrollTop=r+n+l-t.clientHeight/2+O/2,window.setTimeout(()=>{this.syncing=!1},0)}}readWheel(t){const e=t.scrollTop+t.clientHeight/2,s=t.querySelectorAll(".time-wheel-item");let n=null,r=1/0;for(let a=0;a<s.length;a++){const o=s[a],l=o.offsetTop+o.offsetHeight/2,c=Math.abs(l-e);c<r&&(r=c,n=o)}return n?n.getAttribute("data-value")??"":""}onWheelScroll(t){if(this.syncing)return;const e=t==="hour"?this.hourCol:t==="minute"?this.minuteCol:this.periodCol;if(!e)return;const s=this.wrapTimers.get(e);if(s&&window.clearTimeout(s),this.wrapTimers.set(e,window.setTimeout(()=>this.recenterIfNeeded(e),80)),t==="hour"){const n=this.readWheel(e);if(this.use12Hour){const r=Number(n);r>=1&&r<=12&&(this.hour12=r)}else{const r=Number(n);r>=0&&r<=23&&(this.hour24=r)}}else if(t==="minute"){const n=Number(this.readWheel(e));n>=0&&n<=59&&(this.minute=n)}else{const n=this.readWheel(e);(n==="AM"||n==="PM")&&(this.period=n)}this.emit()}onTypeCommit(){if(!this.typeInput)return;const t=ce(this.typeInput.value,this.use12Hour);if(!t){this.syncTypeField();return}const e=F(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!0),this.emit()}syncWheels(t){if(this.syncing=!0,this.hourCol){const e=this.use12Hour?String(this.hour12):String(this.hour24).padStart(2,"0");this.scrollToValue(this.hourCol,e,t)}this.minuteCol&&this.scrollToValue(this.minuteCol,String(this.minute).padStart(2,"0"),t),this.periodCol&&this.scrollToValue(this.periodCol,this.period,t),window.setTimeout(()=>{this.syncing=!1},t?200:0)}}class ge{constructor(t){d(this,"root");d(this,"screen","connect");d(this,"transport",null);d(this,"alarms",$t()??[]);d(this,"status",{});d(this,"message","");d(this,"messageKind","");d(this,"busy",!1);d(this,"saving",!1);d(this,"scheduleLoading",!1);d(this,"statusLoading",!1);d(this,"syncGeneration",0);d(this,"editDraft",null);d(this,"timePicker",null);d(this,"lampTestLevel",$);d(this,"lampTestSeconds",ot);d(this,"lampTestRemaining",0);d(this,"lampTestInterval",null);d(this,"lampTestExpanded",!1);d(this,"timeFormatPref",mt());d(this,"use12Hour",S(this.timeFormatPref));d(this,"scheduleRefreshInFlight",!1);this.root=t,this.render()}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const s=e instanceof Error?e.message:String(e);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const t=new qt;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),t.setOnUnsolicitedLine(e=>this.onDeviceLine(e)),await t.connect(),this.syncClockFormat(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)}catch(t){if(ne(t))this.message="",this.messageKind="";else{const e=t instanceof Error?t.message:String(t);this.setMessage(e,"error")}}finally{this.busy=!1,this.render()}}onDeviceLine(t){(t.includes("ALARM dismissed")||t.startsWith("SAVE ok"))&&this.syncScheduleFromDeviceQuiet()}async syncScheduleFromDeviceQuiet(){var t;if(!(!((t=this.transport)!=null&&t.connected)||this.scheduleRefreshInFlight||this.busy)){this.scheduleRefreshInFlight=!0;try{const e=await k(this.transport);this.alarms=x(e),T(this.alarms);try{this.status=await H(this.transport)}catch{}this.screen==="editor"&&this.render()}catch{}finally{this.scheduleRefreshInFlight=!1}}}async loadDeviceData(t,e){try{if(await Vt(t),e!==this.syncGeneration)return;const s=await k(t);if(e!==this.syncGeneration)return;const n=await H(t);if(e!==this.syncGeneration)return;this.alarms=x(s),T(this.alarms),this.status=n,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(e!==this.syncGeneration)return;const n=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${n}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await te(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const t=v(this.lampTestLevel),e=Q(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,this.lampTestExpanded=!0,await this.withBusy(async()=>{await Zt(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const n=this.root.querySelector("#lamp-test-countdown"),r=this.root.querySelector(".lamp-test-toggle-hint");n&&(n.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),r&&(r.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}syncLampTestSlider(t){const e=v(t);this.lampTestLevel=e;const s=this.root.querySelector("#lamp-test-level"),n=this.root.querySelector("#lamp-test-level-num");s&&(s.value=String(e)),n&&(n.value=String(e));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}onLampTestNumberInput(t){const e=N(t.value);if(e===null)return;const s=v(e);this.lampTestLevel=s;const n=this.root.querySelector("#lamp-test-level");n&&(n.value=String(s));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}commitLampTestNumber(t){const e=N(t.value);if(e===null){t.value=String(this.lampTestLevel);return}this.syncLampTestSlider(v(e))}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}syncClockFormat(){this.use12Hour=S(this.timeFormatPref)}setTimeFormatPref(t){this.timeFormatPref=t,ae(t),this.syncClockFormat(),this.render()}renderTimeFormatPicker(){const{timeFormatPref:t}=this;return`
      <div class="time-format-section">
        <div class="time-format-label">Time format</div>
        <div class="repeat-row time-format-chips">
          <button type="button" class="repeat-chip ${t==="auto"?"on":""}" data-time-format="auto">Auto</button>
          <button type="button" class="repeat-chip ${t==="12"?"on":""}" data-time-format="12">12-hour</button>
          <button type="button" class="repeat-chip ${t==="24"?"on":""}" data-time-format="24">24-hour</button>
        </div>
      </div>
    `}bindTimeFormatEvents(){this.root.querySelectorAll("[data-time-format]").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.timeFormat;(e==="auto"||e==="12"||e==="24")&&this.setTimeFormatPref(e)})})}scrollToTop(){window.scrollTo({top:0,left:0,behavior:"auto"})}getTodayWeekday(){return this.status.today?this.status.today:["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()]}getReferenceNow(){const t=this.status.rtc;if(t){const e=new Date(t.replace(" ","T"));if(!Number.isNaN(e.getTime()))return e}return new Date}visibleAlarmGroups(){return _t(this.alarms,this.getReferenceNow(),this.getTodayWeekday())}draftToApplyPayload(t){return{id:t.id,isNew:t.isNew,days:t.days,enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:t.oneTime}}commitAlarmEditForm(){var n,r;if(!this.editDraft)return!1;const t=this.root.querySelector("#edit-pwm-num");t&&this.commitEditBrightnessNumber(t);const e=Number(((n=this.root.querySelector("#edit-pre"))==null?void 0:n.value)??20),s=Number(((r=this.root.querySelector("#edit-hold"))==null?void 0:r.value)??20);if(this.editDraft.prewindowMin=e,this.editDraft.postHoldMin=s,this.editDraft.oneTime){const a=this.getTodayWeekday(),o=dt(this.editDraft.time,a,this.getReferenceNow());this.editDraft.days=[o]}else if(this.editDraft.days.length===0)return this.setMessage("Select at least one day for this alarm.","error"),!1;return this.alarms=Ft(this.alarms,this.draftToApplyPayload(this.editDraft)),T(this.alarms),!0}closeAlarmEdit(t){var e;this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen==="alarm-edit"&&(this.screen="editor",this.message="",this.messageKind="",this.render())}openAlarmEdit(t){const e=this.alarms.find(s=>s.id===t);e&&(this.message="",this.messageKind="",this.editDraft={id:e.id,isNew:!1,days:[...e.days],enabled:e.enabled,time:e.time,prewindowMin:e.prewindowMin,pwmMax:e.pwmMax,postHoldMin:e.postHoldMin,oneTime:e.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop())}toggleGroupEnabled(t,e){e.stopPropagation(),R(this.root),this.alarms=Pt(this.alarms,t,!t.enabled),T(this.alarms),this.render()}addAlarm(){if(this.alarms.length>=D){this.setMessage(`Maximum of ${D} alarms.`,"error");return}const t=Rt(this.alarms);this.message="",this.messageKind="",this.editDraft={id:t.id,isNew:!0,days:[...t.days],enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneTime:t.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop()}async deleteEditingAlarm(){var e;if(!this.editDraft)return;if(this.editDraft.isNew||!this.editDraft.id){this.closeAlarmEdit(!1);return}const t=this.visibleAlarmGroups().find(s=>s.id===this.editDraft.id);if(!t){this.closeAlarmEdit(!1);return}this.alarms=st(this.alarms,t),T(this.alarms),this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Alarm deleted.")}async deleteAlarmById(t){const e=this.visibleAlarmGroups().find(s=>s.id===t);e&&(this.alarms=st(this.alarms,e),T(this.alarms),R(this.root),this.render(),await this.pushScheduleToDevice("Alarm deleted."))}async pushScheduleToDevice(t){if(this.transport){this.saving=!0;try{await this.withBusy(async()=>{await zt(this.transport,this.alarms);const e=await k(this.transport),s=x(e);if(!At(this.alarms,s))throw new Error("Device schedule does not match what was sent.");this.status=await H(this.transport),this.setMessage(t,"ok")})}finally{this.saving=!1,this.render()}}}async saveToDevice(){if(this.transport){if(!this.alarms.some(t=>t.enabled)){this.setMessage("Enable at least one alarm before saving.","error");return}await this.pushScheduleToDevice("Schedule saved to mask.")}}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const t=await k(this.transport);this.alarms=x(t),T(this.alarms),this.status=await H(this.transport),this.setMessage("Reloaded from mask.","ok")})}setEditBrightnessFromSlider(t){if(!this.editDraft)return;const e=v(t);this.editDraft.pwmMax=e;const s=this.root.querySelector("#edit-pwm-range"),n=this.root.querySelector("#edit-pwm-num");s&&(s.value=String(e)),n&&(n.value=String(e))}onEditBrightnessNumberInput(t){if(!this.editDraft)return;const e=N(t.value);if(e===null)return;const s=v(e);this.editDraft.pwmMax=s;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(s))}commitEditBrightnessNumber(t){if(!this.editDraft)return;const e=N(t.value);if(e===null){t.value=String(this.editDraft.pwmMax);return}const s=v(e);this.editDraft.pwmMax=s;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(s)),t.value=String(s)}async saveAlarmEditToDevice(){var t;this.commitAlarmEditForm()&&(this.editDraft=null,(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Schedule saved to mask."))}toggleEditDay(t){if(!this.editDraft||this.editDraft.oneTime)return;const e=new Set(this.editDraft.days);if(e.has(t)){if(e.size<=1)return;e.delete(t)}else e.add(t);this.editDraft.days=Z.filter(s=>e.has(s)),this.render()}toggleEditOneTime(){this.editDraft&&(this.editDraft.oneTime=!this.editDraft.oneTime,!this.editDraft.oneTime&&this.editDraft.days.length===0&&(this.editDraft.days=[this.getTodayWeekday()]),this.render())}renderSavingBanner(){return this.saving?`
      <div class="card sync-banner">
        <span class="spinner" aria-hidden="true"></span>
        Saving to mask…
      </div>
    `:""}renderActionBar(){return`
      <div class="save-bar">
        <div class="inner">
          <button class="btn btn-secondary" id="btn-disconnect" ${this.busy?"disabled":""}>Disconnect</button>
          <button class="btn btn-secondary" id="btn-refresh" ${this.busy||this.scheduleLoading?"disabled":""}>Reload</button>
          <button class="btn btn-primary" id="btn-save" ${this.busy||this.scheduleLoading?"disabled":""}>Save to mask</button>
        </div>
      </div>
    `}renderConnect(){const t=ie(),e=se(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
      </div>`:""}

      ${!t&&!J()?`<div class="card warn">
        <h2>Browser not supported</h2>
        <p>Use <strong>Chrome</strong> or <strong>Edge</strong> on Android or desktop. Firefox cannot connect via Bluetooth.</p>
        <p>On iPhone, Safari and Chrome do not support Web Bluetooth — use <strong>Bluefy</strong> instead.</p>
      </div>`:""}

      <div class="card">
        <h2>Before you connect</h2>
        <ol class="connect-steps">
          <li>Ensure the mask is charged, powered on, and within a few meters.</li>
          <li>If the mask does not appear, wake it by holding the snooze button for 3 seconds.</li>
          <li>Click Connect below.</li>
          <li>Look for a device named <strong>SleepMask-XXXX</strong>.</li>
        </ol>
      </div>

      ${e?`<button class="btn btn-primary" id="btn-connect" ${this.busy?"disabled":""}>
        Connect via Bluetooth
      </button>`:""}

      ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
    `}renderAlarmListRow(t){const e=t.enabled?"":" off";return`
      <div class="alarm-swipe" data-alarm-id="${t.id}">
        <button
          type="button"
          class="alarm-swipe-delete"
          data-alarm-id="${t.id}"
          aria-label="Delete alarm"
        >Delete</button>
        <div class="alarm-row alarm-row-panel${e}" data-alarm-id="${t.id}">
          <div class="alarm-row-main">
            <div class="alarm-time">${de(t.time,this.use12Hour)}</div>
            <div class="alarm-subtitle">${It(t.days,t)}</div>
            <div class="alarm-subtitle alarm-subtitle-detail">${Ot(t)}</div>
          </div>
          <div
            class="toggle ${t.enabled?"on":""}"
            data-action="group-toggle"
            data-alarm-id="${t.id}"
            role="switch"
            aria-checked="${t.enabled}"
          ></div>
        </div>
      </div>
    `}renderBrightnessTestCard(){const t=this.lampTestInterval!==null,e=t&&this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:t?"Test finished":"",s=t?e:"Optional — try brightness on the mask";return`
      <div class="card lamp-test-card ${this.lampTestExpanded?"open":""}">
        <button
          type="button"
          class="lamp-test-toggle"
          id="btn-lamp-test-toggle"
          aria-expanded="${this.lampTestExpanded}"
        >
          <div class="lamp-test-toggle-text">
            <h2>Find your brightness</h2>
            <p class="lamp-test-toggle-hint">${s}</p>
          </div>
          <span class="lamp-test-chevron" aria-hidden="true">▾</span>
        </button>
        <div class="lamp-test-body">
          <p class="lamp-test-hint">Try a level on the mask before saving your schedule. Start at 50% — most people land between 40% and 70%.</p>
          <label for="lamp-test-level">Brightness</label>
          <div class="brightness-controls">
            <input
              type="range"
              id="lamp-test-level"
              min="${M}"
              max="${L}"
              value="${this.lampTestLevel}"
              ${t||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              min="${M}"
              max="${L}"
              value="${this.lampTestLevel}"
              aria-label="Brightness percent"
              ${t||this.busy?"disabled":""}
            />
            <span class="brightness-unit">%</span>
          </div>
          <div class="field-row">
            <div>
              <label for="lamp-test-seconds">Duration (seconds)</label>
              <input
                type="number"
                id="lamp-test-seconds"
                min="${rt}"
                max="${at}"
                value="${this.lampTestSeconds}"
                ${t||this.busy?"disabled":""}
              />
            </div>
          </div>
          <div class="lamp-test-actions">
            <button
              class="btn btn-primary"
              type="button"
              id="btn-lamp-test"
              ${t||this.busy?"disabled":""}
            >
              Try for ${this.lampTestSeconds}s
            </button>
            ${t?`<button class="btn btn-secondary" type="button" id="btn-lamp-cancel" ${this.busy?"disabled":""}>Cancel</button>`:""}
          </div>
          ${e&&this.lampTestExpanded?`<p class="lamp-test-countdown" id="lamp-test-countdown">${e}</p>`:""}
        </div>
      </div>
    `}renderEditor(){var s,n;const t=this.scheduleLoading,e=t?[]:this.visibleAlarmGroups();return`
      <h1>Alarms</h1>
      <p class="subtitle">${(s=this.transport)!=null&&s.connected?"Connected":"Disconnected"}</p>

      ${t?`<div class="card sync-banner">
        <span class="spinner" aria-hidden="true"></span>
        Syncing schedule from mask…
      </div>`:""}

      ${this.renderSavingBanner()}

      <div class="card status-bar ${this.statusLoading?"loading":""}">
        ${this.statusLoading?'<div class="muted">Loading device status…</div>':`
        ${this.status.rtc?`<div>Clock: <strong>${it(this.status.rtc,this.use12Hour)}</strong></div>`:""}
        ${this.status.nextRamp?`<div>Next ramp: <strong>${it(this.status.nextRamp,this.use12Hour)}</strong></div>`:""}
        ${this.status.preMin?`<div>Ramp: <strong>${this.status.preMin} min</strong></div>`:""}
        ${this.status.postHoldMin?`<div>Hold after alarm: <strong>${this.status.postHoldMin} min</strong></div>`:""}
        ${this.renderTimeFormatPicker()}
        `}
      </div>

      ${(n=this.transport)!=null&&n.connected?this.renderBrightnessTestCard():""}

      <div class="alarm-list-card ${t?"loading":""}">
        ${e.map(r=>this.renderAlarmListRow(r)).join("")}
      </div>

      <button class="btn-add-alarm" type="button" id="btn-add-alarm" ${t||this.busy?"disabled":""}>
        <span class="btn-add-icon" aria-hidden="true">+</span> Add Alarm
      </button>

      ${this.renderActionBar()}
      <div class="page-bottom-spacer"></div>
      ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
    `}renderAlarmEdit(){if(!this.editDraft)return"";const{days:t,oneTime:e,pwmMax:s,prewindowMin:n,postHoldMin:r}=this.editDraft,a=new Set(t),o=e?" repeat-disabled":"";return`
      <div class="alarm-edit-sheet">
        <div class="alarm-edit-nav">
          <button type="button" class="alarm-edit-nav-btn" id="btn-edit-cancel" ${this.busy?"disabled":""}>Cancel</button>
          <span class="alarm-edit-title">Edit Alarm</span>
          <button type="button" class="alarm-edit-nav-btn alarm-edit-done" id="btn-edit-done" ${this.busy?"disabled":""}>Save</button>
        </div>

        ${this.renderSavingBanner()}

        <div id="time-wheel-mount"></div>

        <div class="alarm-edit-section">
          <div class="alarm-edit-section-label">Repeat</div>
          <div class="repeat-row">
            <button
              type="button"
              class="repeat-chip repeat-chip-once ${e?"on":""}"
              id="btn-repeat-once"
              ${this.busy?"disabled":""}
            >Once</button>
            ${Z.map(l=>`
              <button
                type="button"
                class="repeat-chip ${!e&&a.has(l)?"on":""}${o}"
                data-repeat-day="${l}"
                ${e||this.busy?"disabled":""}
              >${wt[l]}</button>`).join("")}
          </div>
        </div>

        <div class="alarm-edit-section">
          <label>Brightness</label>
          <div class="brightness-controls">
            <input
              type="range"
              id="edit-pwm-range"
              min="${M}"
              max="${L}"
              value="${s}"
              ${this.busy?"disabled":""}
            />
            <input
              type="number"
              id="edit-pwm-num"
              min="${M}"
              max="${L}"
              value="${s}"
              aria-label="Brightness percent"
              ${this.busy?"disabled":""}
            />
            <span class="brightness-unit">%</span>
          </div>
        </div>

        <div class="alarm-edit-section field-row">
          <div>
            <label for="edit-pre">Ramp before (min)</label>
            <input type="number" id="edit-pre" min="1" max="240" value="${n}" ${this.busy?"disabled":""} />
          </div>
          <div>
            <label for="edit-hold">Hold after (min)</label>
            <input type="number" id="edit-hold" min="1" max="240" value="${r}" ${this.busy?"disabled":""} />
          </div>
        </div>

        <button type="button" class="btn-delete-alarm" id="btn-delete-alarm" ${this.busy?"disabled":""}>Delete Alarm</button>

        <div class="page-bottom-spacer"></div>
        ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
      </div>
      ${this.renderActionBar()}
    `}render(){var t;this.syncClockFormat(),(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen==="connect"?this.root.innerHTML=this.renderConnect():this.screen==="alarm-edit"?this.root.innerHTML=this.renderAlarmEdit():this.root.innerHTML=this.renderEditor(),R(this.root),this.bindEvents()}bindEvents(){if(this.screen==="connect"){this.bindConnectEvents();return}if(this.screen==="alarm-edit"){this.bindAlarmEditEvents();return}this.bindEditorEvents()}bindConnectEvents(){var t;(t=this.root.querySelector("#btn-connect"))==null||t.addEventListener("click",()=>void this.connectBle())}bindActionBarEvents(t){var e,s,n;(e=this.root.querySelector("#btn-disconnect"))==null||e.addEventListener("click",()=>void this.disconnect()),(s=this.root.querySelector("#btn-refresh"))==null||s.addEventListener("click",()=>void this.refreshFromDevice()),(n=this.root.querySelector("#btn-save"))==null||n.addEventListener("click",()=>void t())}bindEditorEvents(){var s,n,r,a,o,l;this.bindActionBarEvents(()=>this.saveToDevice()),this.bindTimeFormatEvents(),(s=this.root.querySelector("#btn-add-alarm"))==null||s.addEventListener("click",()=>this.addAlarm());const t=this.visibleAlarmGroups();ue(this.root,{onDelete:c=>void this.deleteAlarmById(c),onTap:c=>this.openAlarmEdit(c)}),this.root.querySelectorAll("[data-action='group-toggle']").forEach(c=>{c.addEventListener("click",h=>{const m=c.dataset.alarmId,f=t.find(y=>y.id===m);f&&this.toggleGroupEnabled(f,h)})}),(n=this.root.querySelector("#btn-lamp-test-toggle"))==null||n.addEventListener("click",()=>{this.toggleLampTestPanel()}),(r=this.root.querySelector("#lamp-test-level"))==null||r.addEventListener("input",c=>{this.syncLampTestSlider(Number(c.target.value))});const e=this.root.querySelector("#lamp-test-level-num");e==null||e.addEventListener("input",()=>this.onLampTestNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitLampTestNumber(e)),e==null||e.addEventListener("blur",()=>this.commitLampTestNumber(e)),(a=this.root.querySelector("#lamp-test-seconds"))==null||a.addEventListener("change",c=>{const h=c.target;this.lampTestSeconds=Q(Number(h.value)),h.value=String(this.lampTestSeconds);const m=this.root.querySelector("#btn-lamp-test");m&&(m.textContent=`Try for ${this.lampTestSeconds}s`)}),(o=this.root.querySelector("#btn-lamp-test"))==null||o.addEventListener("click",()=>void this.tryLampBrightness()),(l=this.root.querySelector("#btn-lamp-cancel"))==null||l.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")})}bindAlarmEditEvents(){var s,n,r,a,o;if(!this.editDraft)return;const t=this.root.querySelector("#time-wheel-mount");t&&(this.timePicker=new ye(t,this.editDraft.time,l=>{this.editDraft&&(this.editDraft.time=l)},{use12Hour:this.use12Hour})),(s=this.root.querySelector("#btn-repeat-once"))==null||s.addEventListener("click",()=>this.toggleEditOneTime()),(n=this.root.querySelector("#btn-edit-cancel"))==null||n.addEventListener("click",()=>this.closeAlarmEdit(!1)),(r=this.root.querySelector("#btn-edit-done"))==null||r.addEventListener("click",()=>void this.saveAlarmEditToDevice()),this.bindActionBarEvents(()=>this.saveAlarmEditToDevice()),(a=this.root.querySelector("#btn-delete-alarm"))==null||a.addEventListener("click",()=>{window.confirm("Delete this alarm?")&&this.deleteEditingAlarm()}),this.root.querySelectorAll("[data-repeat-day]").forEach(l=>{l.addEventListener("click",()=>{const c=l.dataset.repeatDay;this.toggleEditDay(c)})}),(o=this.root.querySelector("#edit-pwm-range"))==null||o.addEventListener("input",l=>{this.setEditBrightnessFromSlider(Number(l.target.value))});const e=this.root.querySelector("#edit-pwm-num");e==null||e.addEventListener("input",()=>this.onEditBrightnessNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitEditBrightnessNumber(e)),e==null||e.addEventListener("blur",()=>this.commitEditBrightnessNumber(e))}}const nt=document.getElementById("app");nt&&new ge(nt);
