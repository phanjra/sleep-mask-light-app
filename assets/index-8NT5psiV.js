var wt=Object.defineProperty;var Tt=(s,t,e)=>t in s?wt(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var c=(s,t,e)=>Tt(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();const M=1,L=100,A=50,nt=1,rt=60,at=10;function v(s){const t=Math.round(Number(s));return Number.isFinite(t)?Math.max(M,Math.min(L,t)):A}function H(s){const t=s.trim();if(t==="")return null;const e=Number(t);return Number.isFinite(e)?Math.round(e):null}function z(s){const t=Math.round(Number(s));return Number.isFinite(t)?Math.max(nt,Math.min(rt,t)):at}const g=["mon","tue","wed","thu","fri","sat","sun"],J=["sun","mon","tue","wed","thu","fri","sat"],St={sun:"S",mon:"M",tue:"T",wed:"W",thu:"T",fri:"F",sat:"S"},Q={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"},$=14,ot="sml-draft-alarms-v3",Et="sml-draft-schedule-v2";function K(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:A,postHoldMin:20,oneShot:!1}}function Mt(){return{...K(),enabled:!1,oneShot:!1}}function Lt(){return Object.fromEntries(g.map(s=>[s,Mt()]))}function Y(){return`alarm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Dt(s={}){const t=K();return{id:Y(),days:[g[new Date().getDay()===0?6:new Date().getDay()-1]],enabled:!0,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:!1,...s}}function $t(s){let t=0;for(const e of s){const i=g.indexOf(e);i>=0&&(t|=1<<i)}return t&127}function At(s){return g.filter((t,e)=>(s&1<<e)!==0)}function X(s){const t=s.slot;return{id:typeof s.id=="string"&&s.id?s.id:Y(),days:Array.isArray(s.days)&&s.days.length>0?s.days:["mon"],enabled:s.enabled??(t==null?void 0:t.enabled)??!0,time:s.time??(t==null?void 0:t.time)??"07:00",prewindowMin:s.prewindowMin??(t==null?void 0:t.prewindowMin)??20,pwmMax:v(s.pwmMax??(t==null?void 0:t.pwmMax)??A),postHoldMin:s.postHoldMin??(t==null?void 0:t.postHoldMin)??20,oneShot:!!(s.oneShot??(t==null?void 0:t.oneShot))}}function U(s){const t=new Map;for(const i of g){const n=s[i];if(!n||!n.enabled&&!n.oneShot&&n.time==="07:00"&&n.prewindowMin===20&&n.pwmMax===A&&n.postHoldMin===20)continue;const a=JSON.stringify({enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin,oneShot:!!n.oneShot}),o=t.get(a)??[];o.push(i),t.set(a,o)}const e=[];for(const[i,n]of t){const r=JSON.parse(i);e.push(X({days:n,enabled:r.enabled,time:r.time,prewindowMin:r.prewindowMin,pwmMax:r.pwmMax,postHoldMin:r.postHoldMin,oneShot:!!r.oneShot}))}return e}function Ct(){try{const s=localStorage.getItem(ot);if(s){const i=JSON.parse(s);if(Array.isArray(i))return i.map(n=>X(n))}const t=localStorage.getItem(Et);if(t){const i=JSON.parse(t);return U(i)}const e=localStorage.getItem("sml-draft-schedule-v1");if(e){const i=JSON.parse(e);return U(i)}return null}catch{return null}}function T(s){localStorage.setItem(ot,JSON.stringify(s.slice(0,$)))}function x(s){const t=s.find(n=>n.startsWith("SCHED_VERSION:"));if((t?Number(t.split(":")[1].trim()):0)>=5||s.some(n=>n.startsWith("SLOT "))){const n=[];for(const r of s){const a=r.match(/^SLOT\s+(\d+)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!a)continue;const o=a[2].toUpperCase()==="ON",d=a[3],l=Number(a[4]),h=Number(a[5]),m=Number(a[6]),f=Number(a[7])===1,y=Number(a[8]);if(l<1||l>240||m<1||m>240||h<1||h>100||y<0||y>127)continue;const w=At(y);w.length===0&&!o||n.push(X({id:`slot-${a[1]}`,days:w.length>0?w:["mon"],enabled:o,time:d,prewindowMin:l,pwmMax:v(h),postHoldMin:m,oneShot:f}))}return n}const i=Lt();for(const n of s){const r=n.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!r)continue;const a=r[1].toLowerCase(),o=Number(r[4]),d=Number(r[5]),l=Number(r[6]),h=Number(r[7])===1;o<1||o>240||l<1||l>240||d<1||d>100||(i[a]={enabled:r[2].toUpperCase()==="ON",time:r[3],prewindowMin:o,pwmMax:v(d),postHoldMin:l,oneShot:h})}return U(i)}function Nt(s,t){if(s.length!==t.length)return!1;const e=i=>[...i].map(n=>({days:[...n.days].sort().join(","),enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin,oneShot:n.oneShot})).sort((n,r)=>`${n.time}|${n.days}`.localeCompare(`${r.time}|${r.days}`));return JSON.stringify(e(s))===JSON.stringify(e(t))}function V(s,t){return g.indexOf(s)-g.indexOf(t)}function Ht(s){const t=s.match(/^(\d{1,2}):(\d{2})$/);return t?Number(t[1])*60+Number(t[2]):420}function xt(s,t,e,i){const n=Ht(t),r=Math.floor(n/60),a=n%60,o=g.indexOf(i);let l=(g.indexOf(s)-o+7)%7;const h=new Date(e);return h.setHours(r,a,0,0),l>0?h.setDate(h.getDate()+l):h.getTime()<=e.getTime()&&h.setDate(h.getDate()+7),h.getTime()}function lt(s,t,e=new Date){const i=s.match(/^(\d{1,2}):(\d{2})$/);if(!i)return t;const n=Number(i[1])*60+Number(i[2]),r=e.getHours()*60+e.getMinutes();if(n>r)return t;const a=g.indexOf(t);return g[(a+1)%7]}function Z(s,t,e){const i=s.oneShot?[lt(s.time,e,t)]:s.days;return i.length===0?Number.MAX_SAFE_INTEGER:Math.min(...i.map(n=>xt(n,s.time,t,e)))}function It(s){return{...s,slot:{enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin,pwmMax:s.pwmMax,postHoldMin:s.postHoldMin,oneShot:s.oneShot}}}function _t(s,t=new Date,e){const i=e??["sun","mon","tue","wed","thu","fri","sat"][t.getDay()],n=s.map(It);return n.sort((r,a)=>{const o=Z(r,t,i),d=Z(a,t,i);return o!==d?o-d:V(r.days[0]??"mon",a.days[0]??"mon")}),n}const kt=new Set(["mon","tue","wed","thu","fri"]),Ot=new Set(["sat","sun"]);function Ft(s,t){if(t&&"oneShot"in t&&t.oneShot)return"Once";if(s.length===0)return"No days";const e=[...s].sort(V);return e.length===7?"Every day":e.length===5&&e.every(i=>kt.has(i))?"Weekdays":e.length===2&&e.every(i=>Ot.has(i))?"Weekend":e.length===1?Q[e[0]]:e.map(i=>Q[i].slice(0,3)).join(", ")}function Pt(s){const t="pwmMax"in s?s.pwmMax:50,e="prewindowMin"in s?s.prewindowMin:20;return`${t}% brightness · ${e} min ramp`}function Rt(s,t,e){return s.map(i=>i.id===t.id?{...i,enabled:e}:i)}function Bt(s,t){const e={id:t.id??Y(),days:[...t.days].sort(V),enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:t.oneShot};return t.isNew||!t.id?s.length>=$?s:[...s,e]:s.map(i=>i.id===t.id?e:i)}function tt(s,t){return s.filter(e=>e.id!==t.id)}function Wt(s){const t=new Set(s.map(a=>a.time));let e=7,i=0,n="07:00";for(let a=0;a<96&&(n=`${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`,!!t.has(n));a++)i+=15,i>=60&&(i=0,e=(e+1)%24);const r=K();return Dt({time:n,prewindowMin:r.prewindowMin,pwmMax:r.pwmMax,postHoldMin:r.postHoldMin,enabled:!0,oneShot:!1})}const B="6e400001-b5a3-f393-e0a9-e50e24dcca9e",qt="6e400002-b5a3-f393-e0a9-e50e24dcca9e",Ut="6e400003-b5a3-f393-e0a9-e50e24dcca9e",W=200,q=3e3;class Gt{constructor(){c(this,"device",null);c(this,"server",null);c(this,"rxChar",null);c(this,"buffer","");c(this,"queue",[]);c(this,"notifyWaiters",[]);c(this,"_connected",!1);c(this,"opChain",Promise.resolve());c(this,"onDisconnectCallback",null);c(this,"onUnsolicitedLine",null);c(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}setOnUnsolicitedLine(t){this.onUnsolicitedLine=t}async connect(){var n;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[B]}],optionalServices:[B]}),this.device.addEventListener("gattserverdisconnected",()=>{var a;this._connected=!1;const r=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(a=this.onDisconnectCallback)==null||a.call(this,r)});const t=await((n=this.device.gatt)==null?void 0:n.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService(B);this.rxChar=await e.getCharacteristic(qt);const i=await e.getCharacteristic(Ut);await i.startNotifications(),i.addEventListener("characteristicvaluechanged",r=>{const o=r.target.value;if(!o)return;const d=new TextDecoder().decode(o);for(this.buffer+=d;this.buffer.includes(`
`);){const l=this.buffer.indexOf(`
`),h=this.buffer.slice(0,l).trim();if(this.buffer=this.buffer.slice(l+1),!h)continue;const m=this.notifyWaiters.shift();m?m(h):this.onUnsolicitedLine?this.onUnsolicitedLine(h):this.queue.push(h)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const i=window.setTimeout(()=>{const r=this.notifyWaiters.indexOf(n);r>=0&&this.notifyWaiters.splice(r,1),e(null)},t),n=r=>{clearTimeout(i),e(r)};this.notifyWaiters.push(n)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(W,q)):this.collectLines(W,q))}async sendAndCollect(t,e=W,i=q,n){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,i,n)))}async collectLines(t,e,i){const n=[],r=Date.now()+e;for(;Date.now()<r;){const a=r-Date.now(),o=await this.waitForLine(Math.min(t,a));if(o===null){if(n.length)return n;continue}if(n.push(o),i!=null&&i(o,n))return n}return n}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.onUnsolicitedLine=null,this.opChain=Promise.resolve()}}const dt=250,Kt=8e3,Yt=5e3,Xt=200;function ct(s){const t=`OK ${s}`;return e=>e===t||e.startsWith(`${t} `)}function Vt(){const s=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=s.getTimezoneOffset(),i=t.getTimezoneOffset(),n=-e*60,a=e!==i?-Math.min(e,i)*60:0;return`TZ_OFFSET ${n} ${a}`}function jt(){const s=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${s.getFullYear()}-${t(s.getMonth()+1)}-${t(s.getDate())} ${t(s.getHours())}:${t(s.getMinutes())}:${t(s.getSeconds())}`}function I(s){return s==="REQ_TIME"||s.startsWith("REQ_TIME ")}async function zt(s){let t=s.drainQueue().some(I);if((await s.send(Vt())).some(I)&&(t=!0),!t){const i=Date.now()+2e3;for(;Date.now()<i;){const n=Math.max(100,Math.min(Xt,i-Date.now())),r=await s.sendAndCollect("",n,Math.min(600,i-Date.now()),a=>I(a));if(r.some(I)){t=!0;break}if(!r.length)break}}}async function Jt(s){await s.send(jt())}async function _(s){return await Jt(s),te(s)}async function k(s){const t=await s.sendAndCollect("SCHED_GET",dt,Kt,ct("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function Qt(s,t){const e=await s.send("SCHED_CLEAR");if(!e.some(r=>r.startsWith("OK SCHED_CLEAR")))throw new Error(`SCHED_CLEAR failed: ${e.join(" ")}`);const i=t.slice(0,$);for(let r=0;r<i.length;r++){const a=i[r];let o=$t(a.days);o===0&&(o=1);const d=a.oneShot?1:0,l=await s.send(`SCHED_SLOT ${r} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin} ${d} ${o}`);if(!l.some(h=>h.startsWith("OK SCHED_SLOT")))throw new Error(`Failed to set slot ${r}: ${l.join(" ")}`);if(!a.enabled){const h=await s.send(`SCHED_SLOT ${r} OFF`);if(!h.some(m=>m.startsWith("OK SCHED_SLOT")))throw new Error(`Failed to disable slot ${r}: ${h.join(" ")}`)}}if(!(await s.send("SAVE")).some(r=>r.includes("SAVE ok")))throw new Error("SAVE failed")}function Zt(s){const t={};for(const e of s)e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function te(s){const t=await s.sendAndCollect("STATUS_LITE",dt,Yt,ct("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return Zt(t)}async function ee(s,t,e){const i=await s.send(`LAMP_TEST ${t} ${e}`);if(!i.some(n=>n.startsWith("OK LAMP_TEST")))throw new Error(i.find(n=>n.startsWith("ERR"))??"LAMP_TEST failed")}async function ie(s){const t=await s.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function j(){return typeof navigator<"u"&&!!navigator.bluetooth}function se(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function ne(){return j()}function re(){return se()&&!j()}function ae(s){if(!s)return!1;const t=s instanceof DOMException||s instanceof Error?s.name:"",e=s instanceof Error?s.message:String(s),i=e.toLowerCase();return!!(t==="AbortError"||t==="NotFoundError"||i.includes("cancel")||i.includes("abort")||i.includes("chooser")||i.includes("dismiss")||/^\d+$/.test(e.trim()))}function oe(){var s;try{const t=new Date(2020,0,1,13,0),e=new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).formatToParts(t);if(e.some(o=>o.type==="dayPeriod"))return!0;const i=((s=e.find(o=>o.type==="hour"))==null?void 0:s.value)??"";if(Number(i)===13||i==="13")return!1;const r=t.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});if(/\b(AM|PM|am|pm|a\.m\.|p\.m\.)\b/i.test(r))return!0;const{hour12:a}=new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions();return a===!0}catch{return!1}}const ut="sml-time-format-v1";function ht(){try{const s=localStorage.getItem(ut);if(s==="12"||s==="24"||s==="auto")return s}catch{}return"auto"}function le(s){localStorage.setItem(ut,s)}function S(s=ht()){return s==="12"?!0:s==="24"?!1:oe()}function de(s){const t=s.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);if(!t)return null;const e=new Date(Number(t[1]),Number(t[2])-1,Number(t[3]),Number(t[4]),Number(t[5]),Number(t[6]??0));return Number.isNaN(e.getTime())?null:e}function et(s,t=S()){const e=de(s);return e?new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12:t}).format(e):s}function D(s){const t=s.match(/^(\d{1,2}):(\d{2})$/);if(!t)return{hour12:7,minute:0,period:"AM"};let e=Number(t[1]);const i=Math.max(0,Math.min(59,Number(t[2])));Number.isFinite(e)||(e=7),e=(e%24+24)%24;const n=e>=12?"PM":"AM";let r=e%12;return r===0&&(r=12),{hour12:r,minute:i,period:n}}function G(s,t,e){let i=s%12;e==="PM"&&(i+=12),e==="AM"&&s===12&&(i=0),e==="PM"&&s===12&&(i=12);const n=Math.max(0,Math.min(59,Math.round(t)));return`${String(i).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function mt(s,t){const e=(Math.round(s)%24+24)%24,i=Math.max(0,Math.min(59,Math.round(t)));return`${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function ce(s){const{hour12:t,minute:e,period:i}=D(s);return`${t}:${String(e).padStart(2,"0")} ${i}`}function pt(s){const t=s.match(/^(\d{1,2}):(\d{2})$/);if(!t)return"07:00";const e=Number(t[1]),i=Number(t[2]);return`${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function ue(s,t=S()){return t?ce(s):pt(s)}function ft(s){return s.replace(/\D/g,"").slice(0,4)}function he(s){const t=ft(s);return t.length<=2?t:`${t.slice(0,-2)}:${t.slice(-2)}`}function it(s,t){if(t){const{hour12:e,minute:i}=D(s);return`${e}:${String(i).padStart(2,"0")}`}return pt(s)}function me(s,t=S(),e="AM"){const i=s.trim();if(!i)return null;const n=i.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);if(n){const d=Number(n[1]),l=Number(n[2]);if(d<1||d>12||l>59)return null;const h=n[3].toUpperCase()==="PM"?"PM":"AM";return G(d,l,h)}const r=ft(i);if(!r)return null;let a,o;return r.length<=2?(a=Number(r),o=0):(a=Number(r.slice(0,-2)),o=Number(r.slice(-2))),!Number.isFinite(a)||!Number.isFinite(o)||o>59?null:t?a<1||a>12?null:G(a,o,e):a>23?null:mt(a,o)}const O=10;function pe(s,t){s.querySelectorAll(".alarm-swipe").forEach(e=>{const i=e,n=i.dataset.alarmId;if(!n)return;const r=i.querySelector(".alarm-row-panel"),a=i.querySelector(".alarm-swipe-delete");if(!r)return;let o=0,d=0,l=0,h=!1,m=null,f=null,y=!1;const w=(u,p)=>{r.style.transition=p?"transform 0.22s ease":"none",r.style.transform=u===0?"":`translateX(${u}px)`,i.classList.toggle("open",u<=-44/2)},yt=()=>{s.querySelectorAll(".alarm-swipe").forEach(u=>{const p=u;p.classList.remove("open");const b=p.querySelector(".alarm-row-panel");b&&(b.style.transition="",b.style.transform="")})},C=u=>{u<=-44?(yt(),w(-88,!0),i.classList.add("open")):(w(0,!0),i.classList.remove("open"))};a==null||a.addEventListener("click",u=>{u.stopPropagation(),t.onDelete(n)});const gt=(u,p)=>{l=i.classList.contains("open")?-88:0,o=u,d=p,h=!0,m=null,r.style.transition="none"},bt=(u,p)=>{if(!h)return;const b=u-o,N=p-d;if(m||(Math.abs(b)>O||Math.abs(N)>O)&&(m=Math.abs(b)>Math.abs(N)?"x":"y"),m!=="x")return;let E=l+b;E>0&&(E=0),E<-88&&(E=-88),w(E,!1)},vt=(u,p)=>{if(!h)return;h=!1,f=null;const b=u-o,N=p-d;if(m==="x"){C(l+b),y=!0,window.setTimeout(()=>{y=!1},400);return}if(!(Math.abs(b)>=O||Math.abs(N)>=O)){if(i.classList.contains("open")){C(0);return}t.onTap(n),y=!0,window.setTimeout(()=>{y=!1},400)}};r.addEventListener("pointerdown",u=>{if(u.pointerType==="mouse"&&u.button!==0)return;const p=u.target;p.closest(".alarm-swipe-delete")||p.closest("[data-action='group-toggle']")&&!i.classList.contains("open")||(f=u.pointerId,r.setPointerCapture(u.pointerId),gt(u.clientX,u.clientY))}),r.addEventListener("pointermove",u=>{f===u.pointerId&&(bt(u.clientX,u.clientY),m==="x"&&u.preventDefault())}),r.addEventListener("pointerup",u=>{f===u.pointerId&&(r.hasPointerCapture(u.pointerId)&&r.releasePointerCapture(u.pointerId),vt(u.clientX,u.clientY))}),r.addEventListener("pointercancel",u=>{f===u.pointerId&&(h=!1,f=null,C(i.classList.contains("open")?-88:0))}),r.addEventListener("click",u=>{if(y){u.preventDefault();return}if(i.classList.contains("open")){u.preventDefault(),C(0);return}u.target.closest("[data-action='group-toggle']")||t.onTap(n)})}),s.dataset.alarmSwipeDismissBound||(s.dataset.alarmSwipeDismissBound="1",s.addEventListener("click",e=>{e.target.closest(".alarm-swipe")||R(s)},{capture:!0}))}function R(s){s.querySelectorAll(".alarm-swipe").forEach(t=>{const e=t;e.classList.remove("open");const i=e.querySelector(".alarm-row-panel");i&&(i.style.transition="",i.style.transform="")})}const fe=Array.from({length:12},(s,t)=>t+1),ye=Array.from({length:24},(s,t)=>t),ge=Array.from({length:60},(s,t)=>t),be=["AM","PM"],F=36,P=5;class ve{constructor(t,e,i,n={}){c(this,"root");c(this,"onChange");c(this,"use12Hour");c(this,"hour12");c(this,"hour24");c(this,"minute");c(this,"period");c(this,"typeInput",null);c(this,"typeHint",null);c(this,"hourCol",null);c(this,"minuteCol",null);c(this,"periodCol",null);c(this,"syncing",!1);c(this,"wrapTimers",new Map);this.root=t,this.onChange=i,this.use12Hour=n.use12Hour??S();const r=D(e);this.hour12=r.hour12,this.hour24=Number(e.split(":")[0])||7,this.minute=r.minute,this.period=r.period,this.render(),this.syncWheels(!1)}setTime24(t){const e=D(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!1),this.syncTypeField(),this.clearTypeHint()}getTime24(){return this.use12Hour?G(this.hour12,this.minute,this.period):mt(this.hour24,this.minute)}destroy(){this.wrapTimers.forEach(t=>window.clearTimeout(t)),this.wrapTimers.clear(),this.root.innerHTML=""}emit(){const t=this.getTime24();this.syncTypeField(),this.clearTypeHint(),this.onChange(t)}syncTypeField(){this.typeInput&&(this.typeInput.value=it(this.getTime24(),this.use12Hour))}clearTypeHint(){var t;this.typeHint&&(this.typeHint.hidden=!0,this.typeHint.textContent=""),(t=this.typeInput)==null||t.classList.remove("invalid")}showTypeHint(t){var e;this.typeHint&&(this.typeHint.hidden=!1,this.typeHint.textContent=t),(e=this.typeInput)==null||e.classList.add("invalid")}placeholder(){return"7:30"}render(){var e,i,n,r,a,o,d;const t=this.use12Hour?'<div class="time-wheel-col time-wheel-col-period" data-wheel="period" tabindex="0"></div>':"";if(this.root.innerHTML=`
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
          inputmode="numeric"
          autocomplete="off"
          enterkeyhint="done"
          placeholder="${this.placeholder()}"
          value="${it(this.getTime24(),this.use12Hour)}"
        />
        <p class="time-wheel-type-hint" id="time-wheel-type-hint" hidden></p>
      </div>
    `,this.hourCol=this.root.querySelector('[data-wheel="hour"]'),this.minuteCol=this.root.querySelector('[data-wheel="minute"]'),this.periodCol=this.root.querySelector('[data-wheel="period"]'),this.typeInput=this.root.querySelector("#time-wheel-type"),this.typeHint=this.root.querySelector("#time-wheel-type-hint"),this.hourCol){const l=this.use12Hour?fe.map(String):ye.map(h=>String(h).padStart(2,"0"));this.fillColumn(this.hourCol,l,"hour",!0)}this.minuteCol&&this.fillColumn(this.minuteCol,ge.map(l=>String(l).padStart(2,"0")),"minute",!0),this.periodCol&&this.fillColumn(this.periodCol,be,"period",!1),(e=this.hourCol)==null||e.addEventListener("scroll",()=>this.onWheelScroll("hour"),{passive:!0}),(i=this.minuteCol)==null||i.addEventListener("scroll",()=>this.onWheelScroll("minute"),{passive:!0}),(n=this.periodCol)==null||n.addEventListener("scroll",()=>this.onWheelScroll("period"),{passive:!0}),(r=this.typeInput)==null||r.addEventListener("input",()=>this.onTypeInput()),(a=this.typeInput)==null||a.addEventListener("change",()=>this.onTypeCommit()),(o=this.typeInput)==null||o.addEventListener("blur",()=>this.onTypeCommit()),(d=this.typeInput)==null||d.addEventListener("keydown",l=>{l.key==="Enter"&&(l.preventDefault(),this.onTypeCommit(),l.target.blur())})}onTypeInput(){if(!this.typeInput)return;const t=he(this.typeInput.value);this.typeInput.value=t,this.clearTypeHint()}fillColumn(t,e,i,n){const r=n?P:1,a=[];for(let o=0;o<r;o++)for(const d of e)a.push(`<div class="time-wheel-item" data-kind="${i}" data-value="${d}" data-copy="${o}">${d}</div>`);t.dataset.wrap=n?"1":"0",t.dataset.count=String(e.length),t.innerHTML=`<div class="time-wheel-spacer"></div>${a.join("")}<div class="time-wheel-spacer"></div>`}scrollToValue(t,e,i){const n=t.dataset.wrap==="1";Number(t.dataset.count||"1");const r=n?Math.floor(P/2):0,a=t.querySelector(`.time-wheel-item[data-value="${e}"][data-copy="${r}"]`),o=t.querySelector(`.time-wheel-item[data-value="${e}"]`),d=a??o;if(!d)return;const l=d.offsetTop-t.clientHeight/2+F/2;t.scrollTo({top:l,behavior:i?"smooth":"auto"})}recenterIfNeeded(t){var o;if(t.dataset.wrap!=="1")return;const e=Number(t.dataset.count||"1");if(e<1)return;const i=e*F,n=Math.floor(P/2)*i,r=((o=t.querySelector(".time-wheel-spacer"))==null?void 0:o.offsetHeight)??0,a=t.scrollTop+t.clientHeight/2-r-F/2;if(a<i||a>(P-1)*i){const d=(a%i+i)%i;this.syncing=!0,t.scrollTop=r+n+d-t.clientHeight/2+F/2,window.setTimeout(()=>{this.syncing=!1},0)}}readWheel(t){const e=t.scrollTop+t.clientHeight/2,i=t.querySelectorAll(".time-wheel-item");let n=null,r=1/0;for(let a=0;a<i.length;a++){const o=i[a],d=o.offsetTop+o.offsetHeight/2,l=Math.abs(d-e);l<r&&(r=l,n=o)}return n?n.getAttribute("data-value")??"":""}onWheelScroll(t){if(this.syncing)return;const e=t==="hour"?this.hourCol:t==="minute"?this.minuteCol:this.periodCol;if(!e)return;const i=this.wrapTimers.get(e);if(i&&window.clearTimeout(i),this.wrapTimers.set(e,window.setTimeout(()=>this.recenterIfNeeded(e),80)),t==="hour"){const n=this.readWheel(e);if(this.use12Hour){const r=Number(n);r>=1&&r<=12&&(this.hour12=r)}else{const r=Number(n);r>=0&&r<=23&&(this.hour24=r)}}else if(t==="minute"){const n=Number(this.readWheel(e));n>=0&&n<=59&&(this.minute=n)}else{const n=this.readWheel(e);(n==="AM"||n==="PM")&&(this.period=n)}this.emit()}onTypeCommit(){if(!this.typeInput)return;const t=this.typeInput.value.trim();if(!t){this.syncTypeField(),this.clearTypeHint();return}const e=me(t,this.use12Hour,this.period);if(!e){this.syncTypeField(),this.showTypeHint("Enter a valid time");return}const i=D(e);this.hour12=i.hour12,this.hour24=Number(e.split(":")[0])||0,this.minute=i.minute,this.period=i.period,this.syncWheels(!0),this.emit()}syncWheels(t){if(this.syncing=!0,this.hourCol){const e=this.use12Hour?String(this.hour12):String(this.hour24).padStart(2,"0");this.scrollToValue(this.hourCol,e,t)}this.minuteCol&&this.scrollToValue(this.minuteCol,String(this.minute).padStart(2,"0"),t),this.periodCol&&this.scrollToValue(this.periodCol,this.period,t),window.setTimeout(()=>{this.syncing=!1},t?200:0)}}class we{constructor(t){c(this,"root");c(this,"screen","connect");c(this,"transport",null);c(this,"alarms",Ct()??[]);c(this,"status",{});c(this,"message","");c(this,"messageKind","");c(this,"busy",!1);c(this,"saving",!1);c(this,"scheduleLoading",!1);c(this,"statusLoading",!1);c(this,"syncGeneration",0);c(this,"editDraft",null);c(this,"timePicker",null);c(this,"lampTestLevel",A);c(this,"lampTestSeconds",at);c(this,"lampTestRemaining",0);c(this,"lampTestInterval",null);c(this,"lampTestExpanded",!1);c(this,"timeFormatPref",ht());c(this,"use12Hour",S(this.timeFormatPref));c(this,"scheduleRefreshInFlight",!1);this.root=t,this.render()}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const i=e instanceof Error?e.message:String(e);this.setMessage(i,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const t=new Gt;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),t.setOnUnsolicitedLine(e=>this.onDeviceLine(e)),await t.connect(),this.syncClockFormat(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)}catch(t){if(ae(t))this.message="",this.messageKind="";else{const e=t instanceof Error?t.message:String(t);this.setMessage(e,"error")}}finally{this.busy=!1,this.render()}}onDeviceLine(t){(t.includes("ALARM dismissed")||t.startsWith("SAVE ok"))&&this.syncScheduleFromDeviceQuiet()}async syncScheduleFromDeviceQuiet(){var t;if(!(!((t=this.transport)!=null&&t.connected)||this.scheduleRefreshInFlight||this.busy)){this.scheduleRefreshInFlight=!0;try{const e=await k(this.transport);this.alarms=x(e),T(this.alarms);try{this.status=await _(this.transport)}catch{}this.screen==="editor"&&this.render()}catch{}finally{this.scheduleRefreshInFlight=!1}}}async loadDeviceData(t,e){try{if(await zt(t),e!==this.syncGeneration)return;const i=await k(t);if(e!==this.syncGeneration)return;const n=await _(t);if(e!==this.syncGeneration)return;this.alarms=x(i),T(this.alarms),this.status=n,this.setMessage("Schedule loaded from mask.","ok")}catch(i){if(e!==this.syncGeneration)return;const n=i instanceof Error?i.message:String(i);this.setMessage(`Sync failed: ${n}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await ie(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var i;if(!((i=this.transport)!=null&&i.connected)||this.busy)return;const t=v(this.lampTestLevel),e=z(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,this.lampTestExpanded=!0,await this.withBusy(async()=>{await ee(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const n=this.root.querySelector("#lamp-test-countdown"),r=this.root.querySelector(".lamp-test-toggle-hint");n&&(n.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),r&&(r.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}syncLampTestSlider(t){const e=v(t);this.lampTestLevel=e;const i=this.root.querySelector("#lamp-test-level"),n=this.root.querySelector("#lamp-test-level-num");i&&(i.value=String(e)),n&&(n.value=String(e));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}onLampTestNumberInput(t){const e=H(t.value);if(e===null)return;const i=v(e);this.lampTestLevel=i;const n=this.root.querySelector("#lamp-test-level");n&&(n.value=String(i));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}commitLampTestNumber(t){const e=H(t.value);if(e===null){t.value=String(this.lampTestLevel);return}this.syncLampTestSlider(v(e))}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}syncClockFormat(){this.use12Hour=S(this.timeFormatPref)}setTimeFormatPref(t){this.timeFormatPref=t,le(t),this.syncClockFormat(),this.render()}renderTimeFormatPicker(){const{timeFormatPref:t}=this;return`
      <div class="time-format-section">
        <div class="time-format-label">Time format</div>
        <div class="repeat-row time-format-chips">
          <button type="button" class="repeat-chip ${t==="auto"?"on":""}" data-time-format="auto">Auto</button>
          <button type="button" class="repeat-chip ${t==="12"?"on":""}" data-time-format="12">12-hour</button>
          <button type="button" class="repeat-chip ${t==="24"?"on":""}" data-time-format="24">24-hour</button>
        </div>
      </div>
    `}bindTimeFormatEvents(){this.root.querySelectorAll("[data-time-format]").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.timeFormat;(e==="auto"||e==="12"||e==="24")&&this.setTimeFormatPref(e)})})}scrollToTop(){window.scrollTo({top:0,left:0,behavior:"auto"})}getTodayWeekday(){return this.status.today?this.status.today:["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()]}getReferenceNow(){const t=this.status.rtc;if(t){const e=new Date(t.replace(" ","T"));if(!Number.isNaN(e.getTime()))return e}return new Date}visibleAlarmGroups(){return _t(this.alarms,this.getReferenceNow(),this.getTodayWeekday())}draftToApplyPayload(t){return{id:t.id,isNew:t.isNew,days:t.days,enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:t.oneTime}}commitAlarmEditForm(){var n,r;if(!this.editDraft)return!1;const t=this.root.querySelector("#edit-pwm-num");t&&this.commitEditBrightnessNumber(t);const e=Number(((n=this.root.querySelector("#edit-pre"))==null?void 0:n.value)??20),i=Number(((r=this.root.querySelector("#edit-hold"))==null?void 0:r.value)??20);if(this.editDraft.prewindowMin=e,this.editDraft.postHoldMin=i,this.editDraft.oneTime){const a=this.getTodayWeekday(),o=lt(this.editDraft.time,a,this.getReferenceNow());this.editDraft.days=[o]}else if(this.editDraft.days.length===0)return this.setMessage("Select at least one day for this alarm.","error"),!1;return this.alarms=Bt(this.alarms,this.draftToApplyPayload(this.editDraft)),T(this.alarms),!0}closeAlarmEdit(t){var e;this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen==="alarm-edit"&&(this.screen="editor",this.message="",this.messageKind="",this.render())}openAlarmEdit(t){const e=this.alarms.find(i=>i.id===t);e&&(this.message="",this.messageKind="",this.editDraft={id:e.id,isNew:!1,days:[...e.days],enabled:e.enabled,time:e.time,prewindowMin:e.prewindowMin,pwmMax:e.pwmMax,postHoldMin:e.postHoldMin,oneTime:e.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop())}toggleGroupEnabled(t,e){e.stopPropagation(),R(this.root),this.alarms=Rt(this.alarms,t,!t.enabled),T(this.alarms),this.render()}addAlarm(){if(this.alarms.length>=$){this.setMessage(`Maximum of ${$} alarms.`,"error");return}const t=Wt(this.alarms);this.message="",this.messageKind="",this.editDraft={id:t.id,isNew:!0,days:[...t.days],enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneTime:t.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop()}async deleteEditingAlarm(){var e;if(!this.editDraft)return;if(this.editDraft.isNew||!this.editDraft.id){this.closeAlarmEdit(!1);return}const t=this.visibleAlarmGroups().find(i=>i.id===this.editDraft.id);if(!t){this.closeAlarmEdit(!1);return}this.alarms=tt(this.alarms,t),T(this.alarms),this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Alarm deleted.")}async deleteAlarmById(t){const e=this.visibleAlarmGroups().find(i=>i.id===t);e&&(this.alarms=tt(this.alarms,e),T(this.alarms),R(this.root),this.render(),await this.pushScheduleToDevice("Alarm deleted."))}async pushScheduleToDevice(t){if(this.transport){this.saving=!0;try{await this.withBusy(async()=>{await Qt(this.transport,this.alarms);const e=await k(this.transport),i=x(e);if(!Nt(this.alarms,i))throw new Error("Device schedule does not match what was sent.");this.status=await _(this.transport),this.setMessage(t,"ok")})}finally{this.saving=!1,this.render()}}}async saveToDevice(){if(this.transport){if(!this.alarms.some(t=>t.enabled)){this.setMessage("Enable at least one alarm before saving.","error");return}await this.pushScheduleToDevice("Schedule saved to mask.")}}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const t=await k(this.transport);this.alarms=x(t),T(this.alarms),this.status=await _(this.transport),this.setMessage("Reloaded from mask.","ok")})}setEditBrightnessFromSlider(t){if(!this.editDraft)return;const e=v(t);this.editDraft.pwmMax=e;const i=this.root.querySelector("#edit-pwm-range"),n=this.root.querySelector("#edit-pwm-num");i&&(i.value=String(e)),n&&(n.value=String(e))}onEditBrightnessNumberInput(t){if(!this.editDraft)return;const e=H(t.value);if(e===null)return;const i=v(e);this.editDraft.pwmMax=i;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(i))}commitEditBrightnessNumber(t){if(!this.editDraft)return;const e=H(t.value);if(e===null){t.value=String(this.editDraft.pwmMax);return}const i=v(e);this.editDraft.pwmMax=i;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(i)),t.value=String(i)}async saveAlarmEditToDevice(){var t;this.commitAlarmEditForm()&&(this.editDraft=null,(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Schedule saved to mask."))}toggleEditDay(t){if(!this.editDraft||this.editDraft.oneTime)return;const e=new Set(this.editDraft.days);if(e.has(t)){if(e.size<=1)return;e.delete(t)}else e.add(t);this.editDraft.days=J.filter(i=>e.has(i)),this.render()}toggleEditOneTime(){this.editDraft&&(this.editDraft.oneTime=!this.editDraft.oneTime,!this.editDraft.oneTime&&this.editDraft.days.length===0&&(this.editDraft.days=[this.getTodayWeekday()]),this.render())}renderSavingBanner(){return this.saving?`
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
    `}renderConnect(){const t=re(),e=ne(),i=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${i}</p>
      </div>`:""}

      ${!t&&!j()?`<div class="card warn">
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
            <div class="alarm-time">${ue(t.time,this.use12Hour)}</div>
            <div class="alarm-subtitle">${Ft(t.days,t)}</div>
            <div class="alarm-subtitle alarm-subtitle-detail">${Pt(t)}</div>
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
    `}renderBrightnessTestCard(){const t=this.lampTestInterval!==null,e=t&&this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:t?"Test finished":"",i=t?e:"Optional — try brightness on the mask";return`
      <div class="card lamp-test-card ${this.lampTestExpanded?"open":""}">
        <button
          type="button"
          class="lamp-test-toggle"
          id="btn-lamp-test-toggle"
          aria-expanded="${this.lampTestExpanded}"
        >
          <div class="lamp-test-toggle-text">
            <h2>Find your brightness</h2>
            <p class="lamp-test-toggle-hint">${i}</p>
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
              inputmode="numeric"
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
                inputmode="numeric"
                min="${nt}"
                max="${rt}"
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
    `}renderEditor(){var i,n;const t=this.scheduleLoading,e=t?[]:this.visibleAlarmGroups();return`
      <h1>Alarms</h1>
      <p class="subtitle">${(i=this.transport)!=null&&i.connected?"Connected":"Disconnected"}</p>

      ${t?`<div class="card sync-banner">
        <span class="spinner" aria-hidden="true"></span>
        Syncing schedule from mask…
      </div>`:""}

      ${this.renderSavingBanner()}

      <div class="card status-bar ${this.statusLoading?"loading":""}">
        ${this.statusLoading?'<div class="muted">Loading device status…</div>':`
        ${this.status.rtc?`<div>Clock: <strong>${et(this.status.rtc,this.use12Hour)}</strong></div>`:""}
        ${this.status.nextRamp?`<div>Next ramp: <strong>${et(this.status.nextRamp,this.use12Hour)}</strong></div>`:""}
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
    `}renderAlarmEdit(){if(!this.editDraft)return"";const{days:t,oneTime:e,pwmMax:i,prewindowMin:n,postHoldMin:r}=this.editDraft,a=new Set(t),o=e?" repeat-disabled":"";return`
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
            ${J.map(d=>`
              <button
                type="button"
                class="repeat-chip ${!e&&a.has(d)?"on":""}${o}"
                data-repeat-day="${d}"
                ${e||this.busy?"disabled":""}
              >${St[d]}</button>`).join("")}
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
              value="${i}"
              ${this.busy?"disabled":""}
            />
            <input
              type="number"
              id="edit-pwm-num"
              inputmode="numeric"
              min="${M}"
              max="${L}"
              value="${i}"
              aria-label="Brightness percent"
              ${this.busy?"disabled":""}
            />
            <span class="brightness-unit">%</span>
          </div>
        </div>

        <div class="alarm-edit-section field-row">
          <div>
            <label for="edit-pre">Ramp before (min)</label>
            <input type="number" id="edit-pre" inputmode="numeric" min="1" max="240" value="${n}" ${this.busy?"disabled":""} />
          </div>
          <div>
            <label for="edit-hold">Hold after (min)</label>
            <input type="number" id="edit-hold" inputmode="numeric" min="1" max="240" value="${r}" ${this.busy?"disabled":""} />
          </div>
        </div>

        <button type="button" class="btn-delete-alarm" id="btn-delete-alarm" ${this.busy?"disabled":""}>Delete Alarm</button>

        <div class="page-bottom-spacer"></div>
        ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
      </div>
      ${this.renderActionBar()}
    `}render(){var t;this.syncClockFormat(),(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen==="connect"?this.root.innerHTML=this.renderConnect():this.screen==="alarm-edit"?this.root.innerHTML=this.renderAlarmEdit():this.root.innerHTML=this.renderEditor(),R(this.root),this.bindEvents()}bindEvents(){if(this.screen==="connect"){this.bindConnectEvents();return}if(this.screen==="alarm-edit"){this.bindAlarmEditEvents();return}this.bindEditorEvents()}bindConnectEvents(){var t;(t=this.root.querySelector("#btn-connect"))==null||t.addEventListener("click",()=>void this.connectBle())}bindActionBarEvents(t){var e,i,n;(e=this.root.querySelector("#btn-disconnect"))==null||e.addEventListener("click",()=>void this.disconnect()),(i=this.root.querySelector("#btn-refresh"))==null||i.addEventListener("click",()=>void this.refreshFromDevice()),(n=this.root.querySelector("#btn-save"))==null||n.addEventListener("click",()=>void t())}bindEditorEvents(){var i,n,r,a,o,d;this.bindActionBarEvents(()=>this.saveToDevice()),this.bindTimeFormatEvents(),(i=this.root.querySelector("#btn-add-alarm"))==null||i.addEventListener("click",()=>this.addAlarm());const t=this.visibleAlarmGroups();pe(this.root,{onDelete:l=>void this.deleteAlarmById(l),onTap:l=>this.openAlarmEdit(l)}),this.root.querySelectorAll("[data-action='group-toggle']").forEach(l=>{l.addEventListener("click",h=>{const m=l.dataset.alarmId,f=t.find(y=>y.id===m);f&&this.toggleGroupEnabled(f,h)})}),(n=this.root.querySelector("#btn-lamp-test-toggle"))==null||n.addEventListener("click",()=>{this.toggleLampTestPanel()}),(r=this.root.querySelector("#lamp-test-level"))==null||r.addEventListener("input",l=>{this.syncLampTestSlider(Number(l.target.value))});const e=this.root.querySelector("#lamp-test-level-num");e==null||e.addEventListener("input",()=>this.onLampTestNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitLampTestNumber(e)),e==null||e.addEventListener("blur",()=>this.commitLampTestNumber(e)),(a=this.root.querySelector("#lamp-test-seconds"))==null||a.addEventListener("change",l=>{const h=l.target;this.lampTestSeconds=z(Number(h.value)),h.value=String(this.lampTestSeconds);const m=this.root.querySelector("#btn-lamp-test");m&&(m.textContent=`Try for ${this.lampTestSeconds}s`)}),(o=this.root.querySelector("#btn-lamp-test"))==null||o.addEventListener("click",()=>void this.tryLampBrightness()),(d=this.root.querySelector("#btn-lamp-cancel"))==null||d.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")})}bindAlarmEditEvents(){var i,n,r,a,o;if(!this.editDraft)return;const t=this.root.querySelector("#time-wheel-mount");t&&(this.timePicker=new ve(t,this.editDraft.time,d=>{this.editDraft&&(this.editDraft.time=d)},{use12Hour:this.use12Hour})),(i=this.root.querySelector("#btn-repeat-once"))==null||i.addEventListener("click",()=>this.toggleEditOneTime()),(n=this.root.querySelector("#btn-edit-cancel"))==null||n.addEventListener("click",()=>this.closeAlarmEdit(!1)),(r=this.root.querySelector("#btn-edit-done"))==null||r.addEventListener("click",()=>void this.saveAlarmEditToDevice()),this.bindActionBarEvents(()=>this.saveAlarmEditToDevice()),(a=this.root.querySelector("#btn-delete-alarm"))==null||a.addEventListener("click",()=>{window.confirm("Delete this alarm?")&&this.deleteEditingAlarm()}),this.root.querySelectorAll("[data-repeat-day]").forEach(d=>{d.addEventListener("click",()=>{const l=d.dataset.repeatDay;this.toggleEditDay(l)})}),(o=this.root.querySelector("#edit-pwm-range"))==null||o.addEventListener("input",d=>{this.setEditBrightnessFromSlider(Number(d.target.value))});const e=this.root.querySelector("#edit-pwm-num");e==null||e.addEventListener("input",()=>this.onEditBrightnessNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitEditBrightnessNumber(e)),e==null||e.addEventListener("blur",()=>this.commitEditBrightnessNumber(e))}}const st=document.getElementById("app");st&&new we(st);
