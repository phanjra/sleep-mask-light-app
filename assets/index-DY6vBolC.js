var At=Object.defineProperty;var Ct=(i,t,e)=>t in i?At(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var l=(i,t,e)=>Ct(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();const E=1,D=100,A=50,ct=1,ht=60,ut=10;function b(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(E,Math.min(D,t)):A}function x(i){const t=i.trim();if(t==="")return null;const e=Number(t);return Number.isFinite(e)?Math.round(e):null}function tt(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(ct,Math.min(ht,t)):ut}const v=["mon","tue","wed","thu","fri","sat","sun"],et=["sun","mon","tue","wed","thu","fri","sat"],Nt={sun:"S",mon:"M",tue:"T",wed:"W",thu:"T",fri:"F",sat:"S"},G={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"},$=14,mt="sml-draft-alarms-v3",xt="sml-draft-schedule-v2",pt=120,ft=60;function V(i){return Number.isFinite(i)?Math.max(1,Math.min(pt,Math.round(i))):20}function X(i){return Number.isFinite(i)?Math.max(1,Math.min(ft,Math.round(i))):20}function j(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:A,postHoldMin:20,oneShot:!1}}function Ht(){return{...j(),enabled:!1,oneShot:!1}}function kt(){return Object.fromEntries(v.map(i=>[i,Ht()]))}function z(){return`alarm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function Ft(i={}){const t=j();return{id:z(),days:[v[new Date().getDay()===0?6:new Date().getDay()-1]],enabled:!0,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:!1,...i}}function Ot(i){let t=0;for(const e of i){const s=v.indexOf(e);s>=0&&(t|=1<<s)}return t&127}function It(i){return v.filter((t,e)=>(i&1<<e)!==0)}function J(i){const t=i.slot;return{id:typeof i.id=="string"&&i.id?i.id:z(),days:Array.isArray(i.days)&&i.days.length>0?i.days:["mon"],enabled:i.enabled??(t==null?void 0:t.enabled)??!0,time:i.time??(t==null?void 0:t.time)??"07:00",prewindowMin:V(i.prewindowMin??(t==null?void 0:t.prewindowMin)??20),pwmMax:b(i.pwmMax??(t==null?void 0:t.pwmMax)??A),postHoldMin:X(i.postHoldMin??(t==null?void 0:t.postHoldMin)??20),oneShot:!!(i.oneShot??(t==null?void 0:t.oneShot))}}function K(i){const t=new Map;for(const s of v){const n=i[s];if(!n||!n.enabled&&!n.oneShot&&n.time==="07:00"&&n.prewindowMin===20&&n.pwmMax===A&&n.postHoldMin===20)continue;const a=JSON.stringify({enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin,oneShot:!!n.oneShot}),o=t.get(a)??[];o.push(s),t.set(a,o)}const e=[];for(const[s,n]of t){const r=JSON.parse(s);e.push(J({days:n,enabled:r.enabled,time:r.time,prewindowMin:r.prewindowMin,pwmMax:r.pwmMax,postHoldMin:r.postHoldMin,oneShot:!!r.oneShot}))}return e}function _t(){try{const i=localStorage.getItem(mt);if(i){const s=JSON.parse(i);if(Array.isArray(s))return s.map(n=>J(n))}const t=localStorage.getItem(xt);if(t){const s=JSON.parse(t);return K(s)}const e=localStorage.getItem("sml-draft-schedule-v1");if(e){const s=JSON.parse(e);return K(s)}return null}catch{return null}}function w(i){localStorage.setItem(mt,JSON.stringify(i.slice(0,$)))}function H(i){const t=i.find(n=>n.startsWith("SCHED_VERSION:"));if((t?Number(t.split(":")[1].trim()):0)>=5||i.some(n=>n.startsWith("SLOT "))){const n=[];for(const r of i){const a=r.match(/^SLOT\s+(\d+)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!a)continue;const o=a[2].toUpperCase()==="ON",d=a[3],h=Number(a[4]),c=Number(a[5]),m=Number(a[6]),f=Number(a[7])===1,y=Number(a[8]);if(h<1||h>240||m<1||m>240||c<1||c>100||y<0||y>127)continue;const T=It(y);T.length===0&&!o||n.push(J({id:`slot-${a[1]}`,days:T.length>0?T:["mon"],enabled:o,time:d,prewindowMin:h,pwmMax:b(c),postHoldMin:m,oneShot:f}))}return n}const s=kt();for(const n of i){const r=n.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!r)continue;const a=r[1].toLowerCase(),o=Number(r[4]),d=Number(r[5]),h=Number(r[6]),c=Number(r[7])===1;o<1||o>240||h<1||h>240||d<1||d>100||(s[a]={enabled:r[2].toUpperCase()==="ON",time:r[3],prewindowMin:V(o),pwmMax:b(d),postHoldMin:X(h),oneShot:c})}return K(s)}function st(i,t){if(i.length!==t.length)return!1;const e=s=>[...s].map(n=>({days:[...n.days].sort().join(","),enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin,oneShot:n.oneShot})).sort((n,r)=>`${n.time}|${n.days}`.localeCompare(`${r.time}|${r.days}`));return JSON.stringify(e(i))===JSON.stringify(e(t))}function Q(i,t){return v.indexOf(i)-v.indexOf(t)}function Pt(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);return t?Number(t[1])*60+Number(t[2]):420}function Bt(i,t,e,s){const n=Pt(t),r=Math.floor(n/60),a=n%60,o=v.indexOf(s);let h=(v.indexOf(i)-o+7)%7;const c=new Date(e);return c.setHours(r,a,0,0),h>0?c.setDate(c.getDate()+h):c.getTime()<=e.getTime()&&c.setDate(c.getDate()+7),c.getTime()}function yt(i,t,e=new Date){const s=i.match(/^(\d{1,2}):(\d{2})$/);if(!s)return t;const n=Number(s[1])*60+Number(s[2]),r=e.getHours()*60+e.getMinutes();if(n>r)return t;const a=v.indexOf(t);return v[(a+1)%7]}function it(i,t,e){const s=i.oneShot?[yt(i.time,e,t)]:i.days;return s.length===0?Number.MAX_SAFE_INTEGER:Math.min(...s.map(n=>Bt(n,i.time,t,e)))}function Wt(i){return{...i,slot:{enabled:i.enabled,time:i.time,prewindowMin:i.prewindowMin,pwmMax:i.pwmMax,postHoldMin:i.postHoldMin,oneShot:i.oneShot}}}function Rt(i,t=new Date,e){const s=e??["sun","mon","tue","wed","thu","fri","sat"][t.getDay()],n=i.map(Wt);return n.sort((r,a)=>{const o=it(r,t,s),d=it(a,t,s);return o!==d?o-d:Q(r.days[0]??"mon",a.days[0]??"mon")}),n}const qt=new Set(["mon","tue","wed","thu","fri"]),Ut=new Set(["sat","sun"]);function Gt(i,t){if(t&&"oneShot"in t&&t.oneShot)return"Once";if(i.length===0)return"No days";const e=[...i].sort(Q);return e.length===7?"Every day":e.length===5&&e.every(s=>qt.has(s))?"Weekdays":e.length===2&&e.every(s=>Ut.has(s))?"Weekend":e.length===1?G[e[0]]:e.map(s=>G[s].slice(0,3)).join(", ")}function Kt(i){const t="pwmMax"in i?i.pwmMax:50,e="prewindowMin"in i?i.prewindowMin:20;return`${t}% brightness · ${e} min ramp`}function Yt(i,t,e){return i.map(s=>s.id===t.id?{...s,enabled:e}:s)}function Vt(i,t){const e={id:t.id??z(),days:[...t.days].sort(Q),enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:t.oneShot};return t.isNew||!t.id?i.length>=$?i:[...i,e]:i.map(s=>s.id===t.id?e:s)}function nt(i,t){return i.filter(e=>e.id!==t.id)}function Xt(i){const t=new Set(i.map(a=>a.time));let e=7,s=0,n="07:00";for(let a=0;a<96&&(n=`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`,!!t.has(n));a++)s+=15,s>=60&&(s=0,e=(e+1)%24);const r=j();return Ft({time:n,prewindowMin:r.prewindowMin,pwmMax:r.pwmMax,postHoldMin:r.postHoldMin,enabled:!0,oneShot:!1})}const W="6e400001-b5a3-f393-e0a9-e50e24dcca9e",jt="6e400002-b5a3-f393-e0a9-e50e24dcca9e",zt="6e400003-b5a3-f393-e0a9-e50e24dcca9e",R=200,q=3e3;class Jt{constructor(){l(this,"device",null);l(this,"server",null);l(this,"rxChar",null);l(this,"buffer","");l(this,"queue",[]);l(this,"notifyWaiters",[]);l(this,"_connected",!1);l(this,"opChain",Promise.resolve());l(this,"onDisconnectCallback",null);l(this,"onUnsolicitedLine",null);l(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}setOnUnsolicitedLine(t){this.onUnsolicitedLine=t}async connect(){var n;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[W]}],optionalServices:[W]}),this.device.addEventListener("gattserverdisconnected",()=>{var a;this._connected=!1;const r=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(a=this.onDisconnectCallback)==null||a.call(this,r)});const t=await((n=this.device.gatt)==null?void 0:n.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService(W);this.rxChar=await e.getCharacteristic(jt);const s=await e.getCharacteristic(zt);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",r=>{const o=r.target.value;if(!o)return;const d=new TextDecoder().decode(o);for(this.buffer+=d;this.buffer.includes(`
`);){const h=this.buffer.indexOf(`
`),c=this.buffer.slice(0,h).trim();if(this.buffer=this.buffer.slice(h+1),!c)continue;const m=this.notifyWaiters.shift();m?m(c):this.onUnsolicitedLine?this.onUnsolicitedLine(c):this.queue.push(c)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const s=window.setTimeout(()=>{const r=this.notifyWaiters.indexOf(n);r>=0&&this.notifyWaiters.splice(r,1),e(null)},t),n=r=>{clearTimeout(s),e(r)};this.notifyWaiters.push(n)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(R,q)):this.collectLines(R,q))}async sendAndCollect(t,e=R,s=q,n){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,s,n)))}async collectLines(t,e,s){const n=[],r=Date.now()+e;for(;Date.now()<r;){const a=r-Date.now(),o=await this.waitForLine(Math.min(t,a));if(o===null){if(n.length)return n;continue}if(n.push(o),s!=null&&s(o,n))return n}return n}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.onUnsolicitedLine=null,this.opChain=Promise.resolve()}}const vt=250,Qt=8e3,Zt=5e3,te=200;function gt(i){const t=`OK ${i}`;return e=>e===t||e.startsWith(`${t} `)}function ee(){const i=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=i.getTimezoneOffset(),s=t.getTimezoneOffset(),n=-e*60,a=e!==s?-Math.min(e,s)*60:0;return`TZ_OFFSET ${n} ${a}`}function se(){const i=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${i.getFullYear()}-${t(i.getMonth()+1)}-${t(i.getDate())} ${t(i.getHours())}:${t(i.getMinutes())}:${t(i.getSeconds())}`}function k(i){return i==="REQ_TIME"||i.startsWith("REQ_TIME ")}async function ie(i){let t=i.drainQueue().some(k);if((await i.send(ee())).some(k)&&(t=!0),!t){const s=Date.now()+2e3;for(;Date.now()<s;){const n=Math.max(100,Math.min(te,s-Date.now())),r=await i.sendAndCollect("",n,Math.min(600,s-Date.now()),a=>k(a));if(r.some(k)){t=!0;break}if(!r.length)break}}}async function ne(i){await i.send(se())}async function F(i){return await ne(i),oe(i)}async function O(i){const t=await i.sendAndCollect("SCHED_GET",vt,Qt,gt("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function re(i,t){const e=await i.send("SCHED_CLEAR");if(!e.some(r=>r.startsWith("OK SCHED_CLEAR")))throw new Error(`SCHED_CLEAR failed: ${e.join(" ")}`);const s=t.slice(0,$);for(let r=0;r<s.length;r++){const a=s[r];let o=Ot(a.days);o===0&&(o=1);const d=a.oneShot?1:0,h=await i.send(`SCHED_SLOT ${r} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin} ${d} ${o}`);if(!h.some(c=>c.startsWith("OK SCHED_SLOT")))throw new Error(`Failed to set slot ${r}: ${h.join(" ")}`);if(!a.enabled){const c=await i.send(`SCHED_SLOT ${r} OFF`);if(!c.some(m=>m.startsWith("OK SCHED_SLOT")))throw new Error(`Failed to disable slot ${r}: ${c.join(" ")}`)}}if(!(await i.send("SAVE")).some(r=>r.includes("SAVE ok")))throw new Error("SAVE failed")}function ae(i){const t={};for(const e of i)e.startsWith("Battery: ")&&(t.batteryPercent=e.slice(9).trim()),e.startsWith("Battery_mV: ")&&(t.batteryMv=e.slice(12).trim()),e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function oe(i){const t=await i.sendAndCollect("STATUS_LITE",vt,Zt,gt("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return ae(t)}async function le(i,t,e){const s=await i.send(`LAMP_TEST ${t} ${e}`);if(!s.some(n=>n.startsWith("OK LAMP_TEST")))throw new Error(s.find(n=>n.startsWith("ERR"))??"LAMP_TEST failed")}async function de(i){const t=await i.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function Z(){return typeof navigator<"u"&&!!navigator.bluetooth}function ce(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function he(){return Z()}function ue(){return ce()&&!Z()}function me(i){if(!i)return!1;const t=i instanceof DOMException||i instanceof Error?i.name:"",e=i instanceof Error?i.message:String(i),s=e.toLowerCase();return!!(t==="AbortError"||t==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(e.trim()))}function rt(i){const[t,e]=i.time.split(":").map(Number),s=t*60+e;return{startMin:s-i.prewindowMin,endMin:s+i.postHoldMin}}function pe(i,t){return i.startMin<t.endMin&&t.startMin<i.endMin}function fe(i){const t=i.filter(s=>s.enabled&&s.days.length>0),e=[];for(let s=0;s<t.length;s++)for(let n=s+1;n<t.length;n++){const r=t[s],a=t[n],o=r.days.filter(d=>a.days.includes(d));o.length!==0&&pe(rt(r),rt(a))&&e.push({a:r,b:a,days:o})}return e}function ye(i,t){const e=i.slice(0,4).map(n=>{const r=n.days.map(a=>G[a]).join(", ");return`• ${t(n.a.time)} and ${t(n.b.time)} on ${r}`}),s=i.length>4?`
• …and ${i.length-4} more`:"";return`These alarms have overlapping ramp or hold windows:

`+e.join(`
`)+s+`

While both are active, the earlier alarm wins until dismissed. Save anyway?`}function ve(){var i;try{const t=new Date(2020,0,1,13,0),e=new Intl.DateTimeFormat(void 0,{hour:"numeric",minute:"2-digit"}).formatToParts(t);if(e.some(o=>o.type==="dayPeriod"))return!0;const s=((i=e.find(o=>o.type==="hour"))==null?void 0:i.value)??"";if(Number(s)===13||s==="13")return!1;const r=t.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});if(/\b(AM|PM|am|pm|a\.m\.|p\.m\.)\b/i.test(r))return!0;const{hour12:a}=new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions();return a===!0}catch{return!1}}const bt="sml-time-format-v1";function wt(){try{const i=localStorage.getItem(bt);if(i==="12"||i==="24"||i==="auto")return i}catch{}return"auto"}function ge(i){localStorage.setItem(bt,i)}function S(i=wt()){return i==="12"?!0:i==="24"?!1:ve()}function be(i){const t=i.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);if(!t)return null;const e=new Date(Number(t[1]),Number(t[2])-1,Number(t[3]),Number(t[4]),Number(t[5]),Number(t[6]??0));return Number.isNaN(e.getTime())?null:e}function at(i,t=S()){const e=be(i);return e?new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12:t}).format(e):i}function L(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);if(!t)return{hour12:7,minute:0,period:"AM"};let e=Number(t[1]);const s=Math.max(0,Math.min(59,Number(t[2])));Number.isFinite(e)||(e=7),e=(e%24+24)%24;const n=e>=12?"PM":"AM";let r=e%12;return r===0&&(r=12),{hour12:r,minute:s,period:n}}function Y(i,t,e){let s=i%12;e==="PM"&&(s+=12),e==="AM"&&i===12&&(s=0),e==="PM"&&i===12&&(s=12);const n=Math.max(0,Math.min(59,Math.round(t)));return`${String(s).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function Tt(i,t){const e=(Math.round(i)%24+24)%24,s=Math.max(0,Math.min(59,Math.round(t)));return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function we(i){const{hour12:t,minute:e,period:s}=L(i);return`${t}:${String(e).padStart(2,"0")} ${s}`}function St(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);if(!t)return"07:00";const e=Number(t[1]),s=Number(t[2]);return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function ot(i,t=S()){return t?we(i):St(i)}function Mt(i){return i.replace(/\D/g,"").slice(0,4)}function U(i){const t=Mt(i);return t.length<=2?t:`${t.slice(0,-2)}:${t.slice(-2)}`}function lt(i,t){if(t){const{hour12:e,minute:s}=L(i);return`${e}:${String(s).padStart(2,"0")}`}return St(i)}function Te(i,t=S(),e="AM"){const s=i.trim();if(!s)return null;const n=s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);if(n){const d=Number(n[1]),h=Number(n[2]);if(d<1||d>12||h>59)return null;const c=n[3].toUpperCase()==="PM"?"PM":"AM";return Y(d,h,c)}const r=Mt(s);if(!r)return null;let a,o;return r.length<=2?(a=Number(r),o=0):(a=Number(r.slice(0,-2)),o=Number(r.slice(-2))),!Number.isFinite(a)||!Number.isFinite(o)||o>59?null:t?a<1||a>12?null:Y(a,o,e):a>23?null:Tt(a,o)}const I=10;function Se(i,t){i.querySelectorAll(".alarm-swipe").forEach(e=>{const s=e,n=s.dataset.alarmId;if(!n)return;const r=s.querySelector(".alarm-row-panel"),a=s.querySelector(".alarm-swipe-delete");if(!r)return;let o=0,d=0,h=0,c=!1,m=null,f=null,y=!1;const T=(u,p)=>{r.style.transition=p?"transform 0.22s ease":"none",r.style.transform=u===0?"":`translateX(${u}px)`,s.classList.toggle("open",u<=-44/2)},Et=()=>{i.querySelectorAll(".alarm-swipe").forEach(u=>{const p=u;p.classList.remove("open");const g=p.querySelector(".alarm-row-panel");g&&(g.style.transition="",g.style.transform="")})},C=u=>{u<=-44?(Et(),T(-88,!0),s.classList.add("open")):(T(0,!0),s.classList.remove("open"))};a==null||a.addEventListener("click",u=>{u.stopPropagation(),t.onDelete(n)});const Dt=(u,p)=>{h=s.classList.contains("open")?-88:0,o=u,d=p,c=!0,m=null,r.style.transition="none"},Lt=(u,p)=>{if(!c)return;const g=u-o,N=p-d;if(m||(Math.abs(g)>I||Math.abs(N)>I)&&(m=Math.abs(g)>Math.abs(N)?"x":"y"),m!=="x")return;let M=h+g;M>0&&(M=0),M<-88&&(M=-88),T(M,!1)},$t=(u,p)=>{if(!c)return;c=!1,f=null;const g=u-o,N=p-d;if(m==="x"){C(h+g),y=!0,window.setTimeout(()=>{y=!1},400);return}if(!(Math.abs(g)>=I||Math.abs(N)>=I)){if(s.classList.contains("open")){C(0);return}t.onTap(n),y=!0,window.setTimeout(()=>{y=!1},400)}};r.addEventListener("pointerdown",u=>{if(u.pointerType==="mouse"&&u.button!==0)return;const p=u.target;p.closest(".alarm-swipe-delete")||p.closest("[data-action='group-toggle']")&&!s.classList.contains("open")||(f=u.pointerId,r.setPointerCapture(u.pointerId),Dt(u.clientX,u.clientY))}),r.addEventListener("pointermove",u=>{f===u.pointerId&&(Lt(u.clientX,u.clientY),m==="x"&&u.preventDefault())}),r.addEventListener("pointerup",u=>{f===u.pointerId&&(r.hasPointerCapture(u.pointerId)&&r.releasePointerCapture(u.pointerId),$t(u.clientX,u.clientY))}),r.addEventListener("pointercancel",u=>{f===u.pointerId&&(c=!1,f=null,C(s.classList.contains("open")?-88:0))}),r.addEventListener("click",u=>{if(y){u.preventDefault();return}if(s.classList.contains("open")){u.preventDefault(),C(0);return}u.target.closest("[data-action='group-toggle']")||t.onTap(n)})}),i.dataset.alarmSwipeDismissBound||(i.dataset.alarmSwipeDismissBound="1",i.addEventListener("click",e=>{e.target.closest(".alarm-swipe")||B(i)},{capture:!0}))}function B(i){i.querySelectorAll(".alarm-swipe").forEach(t=>{const e=t;e.classList.remove("open");const s=e.querySelector(".alarm-row-panel");s&&(s.style.transition="",s.style.transform="")})}const Me=Array.from({length:12},(i,t)=>t+1),Ee=Array.from({length:24},(i,t)=>t),De=Array.from({length:60},(i,t)=>t),Le=["AM","PM"],_=36,P=5;class $e{constructor(t,e,s,n={}){l(this,"root");l(this,"onChange");l(this,"use12Hour");l(this,"hour12");l(this,"hour24");l(this,"minute");l(this,"period");l(this,"typeInput",null);l(this,"typeHint",null);l(this,"replaceOnNextType",!1);l(this,"hourCol",null);l(this,"minuteCol",null);l(this,"periodCol",null);l(this,"syncing",!1);l(this,"wrapTimers",new Map);this.root=t,this.onChange=s,this.use12Hour=n.use12Hour??S();const r=L(e);this.hour12=r.hour12,this.hour24=Number(e.split(":")[0])||7,this.minute=r.minute,this.period=r.period,this.render(),this.syncWheels(!1)}setTime24(t){const e=L(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!1),this.syncTypeField(),this.clearTypeHint()}getTime24(){return this.use12Hour?Y(this.hour12,this.minute,this.period):Tt(this.hour24,this.minute)}destroy(){this.wrapTimers.forEach(t=>window.clearTimeout(t)),this.wrapTimers.clear(),this.root.innerHTML=""}emit(){const t=this.getTime24();this.syncTypeField(),this.clearTypeHint(),this.onChange(t)}syncTypeField(){this.typeInput&&(this.typeInput.value=lt(this.getTime24(),this.use12Hour))}clearTypeHint(){var t;this.typeHint&&(this.typeHint.hidden=!0,this.typeHint.textContent=""),(t=this.typeInput)==null||t.classList.remove("invalid")}showTypeHint(t){var e;this.typeHint&&(this.typeHint.hidden=!1,this.typeHint.textContent=t),(e=this.typeInput)==null||e.classList.add("invalid")}placeholder(){return"7:30"}render(){var e,s,n,r,a,o,d,h;const t=this.use12Hour?'<div class="time-wheel-col time-wheel-col-period" data-wheel="period" tabindex="0"></div>':"";if(this.root.innerHTML=`
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
          value="${lt(this.getTime24(),this.use12Hour)}"
        />
        <p class="time-wheel-type-hint" id="time-wheel-type-hint" hidden></p>
      </div>
    `,this.hourCol=this.root.querySelector('[data-wheel="hour"]'),this.minuteCol=this.root.querySelector('[data-wheel="minute"]'),this.periodCol=this.root.querySelector('[data-wheel="period"]'),this.typeInput=this.root.querySelector("#time-wheel-type"),this.typeHint=this.root.querySelector("#time-wheel-type-hint"),this.hourCol){const c=this.use12Hour?Me.map(String):Ee.map(m=>String(m).padStart(2,"0"));this.fillColumn(this.hourCol,c,"hour",!0)}this.minuteCol&&this.fillColumn(this.minuteCol,De.map(c=>String(c).padStart(2,"0")),"minute",!0),this.periodCol&&this.fillColumn(this.periodCol,Le,"period",!1),(e=this.hourCol)==null||e.addEventListener("scroll",()=>this.onWheelScroll("hour"),{passive:!0}),(s=this.minuteCol)==null||s.addEventListener("scroll",()=>this.onWheelScroll("minute"),{passive:!0}),(n=this.periodCol)==null||n.addEventListener("scroll",()=>this.onWheelScroll("period"),{passive:!0}),(r=this.typeInput)==null||r.addEventListener("focus",()=>{this.replaceOnNextType=!0,window.requestAnimationFrame(()=>{var c;return(c=this.typeInput)==null?void 0:c.select()})}),(a=this.typeInput)==null||a.addEventListener("input",c=>this.onTypeInput(c)),(o=this.typeInput)==null||o.addEventListener("change",()=>this.onTypeCommit()),(d=this.typeInput)==null||d.addEventListener("blur",()=>this.onTypeCommit()),(h=this.typeInput)==null||h.addEventListener("keydown",c=>{if(c.key==="Enter"){c.preventDefault(),this.onTypeCommit(),c.target.blur();return}this.replaceOnNextType&&/^\d$/.test(c.key)&&(c.preventDefault(),this.replaceOnNextType=!1,this.typeInput&&(this.typeInput.value=U(c.key)),this.clearTypeHint())})}onTypeInput(t){if(!this.typeInput)return;if(this.replaceOnNextType){this.replaceOnNextType=!1;const s=t instanceof InputEvent?t.data:null;if(s&&/\d/.test(s)){this.typeInput.value=U(s),this.clearTypeHint();return}}const e=U(this.typeInput.value);this.typeInput.value=e,this.clearTypeHint()}fillColumn(t,e,s,n){const r=n?P:1,a=[];for(let o=0;o<r;o++)for(const d of e)a.push(`<div class="time-wheel-item" data-kind="${s}" data-value="${d}" data-copy="${o}">${d}</div>`);t.dataset.wrap=n?"1":"0",t.dataset.count=String(e.length),t.innerHTML=`<div class="time-wheel-spacer"></div>${a.join("")}<div class="time-wheel-spacer"></div>`}scrollToValue(t,e,s){const n=t.dataset.wrap==="1";Number(t.dataset.count||"1");const r=n?Math.floor(P/2):0,a=t.querySelector(`.time-wheel-item[data-value="${e}"][data-copy="${r}"]`),o=t.querySelector(`.time-wheel-item[data-value="${e}"]`),d=a??o;if(!d)return;const h=d.offsetTop-t.clientHeight/2+_/2;t.scrollTo({top:h,behavior:s?"smooth":"auto"})}recenterIfNeeded(t){var o;if(t.dataset.wrap!=="1")return;const e=Number(t.dataset.count||"1");if(e<1)return;const s=e*_,n=Math.floor(P/2)*s,r=((o=t.querySelector(".time-wheel-spacer"))==null?void 0:o.offsetHeight)??0,a=t.scrollTop+t.clientHeight/2-r-_/2;if(a<s||a>(P-1)*s){const d=(a%s+s)%s;this.syncing=!0,t.scrollTop=r+n+d-t.clientHeight/2+_/2,window.setTimeout(()=>{this.syncing=!1},0)}}readWheel(t){const e=t.scrollTop+t.clientHeight/2,s=t.querySelectorAll(".time-wheel-item");let n=null,r=1/0;for(let a=0;a<s.length;a++){const o=s[a],d=o.offsetTop+o.offsetHeight/2,h=Math.abs(d-e);h<r&&(r=h,n=o)}return n?n.getAttribute("data-value")??"":""}onWheelScroll(t){if(this.syncing)return;const e=t==="hour"?this.hourCol:t==="minute"?this.minuteCol:this.periodCol;if(!e)return;const s=this.wrapTimers.get(e);if(s&&window.clearTimeout(s),this.wrapTimers.set(e,window.setTimeout(()=>this.recenterIfNeeded(e),80)),t==="hour"){const n=this.readWheel(e);if(this.use12Hour){const r=Number(n);r>=1&&r<=12&&(this.hour12=r)}else{const r=Number(n);r>=0&&r<=23&&(this.hour24=r)}}else if(t==="minute"){const n=Number(this.readWheel(e));n>=0&&n<=59&&(this.minute=n)}else{const n=this.readWheel(e);(n==="AM"||n==="PM")&&(this.period=n)}this.emit()}onTypeCommit(){if(!this.typeInput)return;const t=this.typeInput.value.trim();if(!t){this.syncTypeField(),this.clearTypeHint();return}const e=Te(t,this.use12Hour,this.period);if(!e){this.syncTypeField(),this.showTypeHint("Enter a valid time");return}const s=L(e);this.hour12=s.hour12,this.hour24=Number(e.split(":")[0])||0,this.minute=s.minute,this.period=s.period,this.syncWheels(!0),this.emit()}syncWheels(t){if(this.syncing=!0,this.hourCol){const e=this.use12Hour?String(this.hour12):String(this.hour24).padStart(2,"0");this.scrollToValue(this.hourCol,e,t)}this.minuteCol&&this.scrollToValue(this.minuteCol,String(this.minute).padStart(2,"0"),t),this.periodCol&&this.scrollToValue(this.periodCol,this.period,t),window.setTimeout(()=>{this.syncing=!1},t?200:0)}}const Ae=3e3;class Ce{constructor(t){l(this,"root");l(this,"screen","connect");l(this,"transport",null);l(this,"alarms",_t()??[]);l(this,"committedAlarms",[]);l(this,"hasCommittedBaseline",!1);l(this,"status",{});l(this,"message","");l(this,"messageKind","");l(this,"saveFlash",null);l(this,"saveFlashTimer",null);l(this,"busy",!1);l(this,"saving",!1);l(this,"scheduleLoading",!1);l(this,"statusLoading",!1);l(this,"syncGeneration",0);l(this,"editDraft",null);l(this,"timePicker",null);l(this,"lampTestLevel",A);l(this,"lampTestSeconds",ut);l(this,"lampTestRemaining",0);l(this,"lampTestInterval",null);l(this,"lampTestExpanded",!1);l(this,"timeFormatPref",wt());l(this,"use12Hour",S(this.timeFormatPref));l(this,"scheduleRefreshInFlight",!1);this.root=t,this.render()}cloneAlarms(t){return t.map(e=>({...e,days:[...e.days]}))}markCommitted(t=this.alarms){this.committedAlarms=this.cloneAlarms(t),this.hasCommittedBaseline=!0}isDirty(){return this.hasCommittedBaseline&&!st(this.alarms,this.committedAlarms)}clearSaveFlashTimer(){this.saveFlashTimer!==null&&(clearTimeout(this.saveFlashTimer),this.saveFlashTimer=null)}clearSaveFlash(){this.clearSaveFlashTimer(),this.saveFlash=null}showSaveFlash(t,e,s=Ae){this.clearSaveFlashTimer(),this.saveFlash={text:t,kind:e},this.saveFlashTimer=window.setTimeout(()=>{this.saveFlashTimer=null,this.saveFlash=null,(this.screen==="editor"||this.screen==="alarm-edit")&&this.render()},s)}afterDraftMutation(){var t;w(this.alarms),this.isDirty()&&((t=this.saveFlash)==null?void 0:t.kind)==="ok"&&this.clearSaveFlash()}confirmDiscardUnsaved(t){return this.isDirty()?window.confirm(`You have unsaved changes. ${t}`):!0}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const s=e instanceof Error?e.message:String(e);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const t=new Jt;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),t.setOnUnsolicitedLine(e=>this.onDeviceLine(e)),await t.connect(),this.syncClockFormat(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)}catch(t){if(me(t))this.message="",this.messageKind="";else{const e=t instanceof Error?t.message:String(t);this.setMessage(e,"error")}}finally{this.busy=!1,this.render()}}onDeviceLine(t){(t.includes("ALARM dismissed")||t.startsWith("SAVE ok"))&&this.syncScheduleFromDeviceQuiet()}async syncScheduleFromDeviceQuiet(){var t;if(!(!((t=this.transport)!=null&&t.connected)||this.scheduleRefreshInFlight||this.busy)){this.scheduleRefreshInFlight=!0;try{const e=await O(this.transport);this.alarms=H(e),w(this.alarms),this.markCommitted(this.alarms),this.clearSaveFlash();try{this.status=await F(this.transport)}catch{}this.screen==="editor"&&this.render()}catch{}finally{this.scheduleRefreshInFlight=!1}}}async loadDeviceData(t,e){try{if(await ie(t),e!==this.syncGeneration)return;const s=await O(t);if(e!==this.syncGeneration)return;const n=await F(t);if(e!==this.syncGeneration)return;this.alarms=H(s),w(this.alarms),this.markCommitted(this.alarms),this.clearSaveFlash(),this.status=n,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(e!==this.syncGeneration)return;const n=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${n}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await de(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.clearSaveFlash(),this.hasCommittedBaseline=!1,this.committedAlarms=[],this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;if(this.confirmDiscardUnsaved("Disconnect and discard them?"))try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,this.clearSaveFlash(),this.hasCommittedBaseline=!1,this.committedAlarms=[],(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const t=b(this.lampTestLevel),e=tt(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,this.lampTestExpanded=!0,await this.withBusy(async()=>{await le(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const n=this.root.querySelector("#lamp-test-countdown"),r=this.root.querySelector(".lamp-test-toggle-hint");n&&(n.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),r&&(r.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}syncLampTestSlider(t){const e=b(t);this.lampTestLevel=e;const s=this.root.querySelector("#lamp-test-level"),n=this.root.querySelector("#lamp-test-level-num");s&&(s.value=String(e)),n&&(n.value=String(e));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}onLampTestNumberInput(t){const e=x(t.value);if(e===null)return;const s=b(e);this.lampTestLevel=s;const n=this.root.querySelector("#lamp-test-level");n&&(n.value=String(s));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}commitLampTestNumber(t){const e=x(t.value);if(e===null){t.value=String(this.lampTestLevel);return}this.syncLampTestSlider(b(e))}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}syncClockFormat(){this.use12Hour=S(this.timeFormatPref)}setTimeFormatPref(t){this.timeFormatPref=t,ge(t),this.syncClockFormat(),this.render()}renderBatteryVoltage(){const t=this.status.batteryMv;if(!t)return"";if(t==="--")return'<div class="status-battery-mv"><strong>--</strong></div>';const e=Number(t);return Number.isFinite(e)?`<div class="status-battery-mv"><strong>${(e/1e3).toFixed(3)} V</strong></div>`:""}renderTimeFormatPicker(){const{timeFormatPref:t}=this;return`
      <div class="time-format-section">
        <div class="time-format-label">Time format</div>
        <div class="repeat-row time-format-chips">
          <button type="button" class="repeat-chip ${t==="auto"?"on":""}" data-time-format="auto">Auto</button>
          <button type="button" class="repeat-chip ${t==="12"?"on":""}" data-time-format="12">12-hour</button>
          <button type="button" class="repeat-chip ${t==="24"?"on":""}" data-time-format="24">24-hour</button>
        </div>
      </div>
    `}bindTimeFormatEvents(){this.root.querySelectorAll("[data-time-format]").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.timeFormat;(e==="auto"||e==="12"||e==="24")&&this.setTimeFormatPref(e)})})}scrollToTop(){window.scrollTo({top:0,left:0,behavior:"auto"})}getTodayWeekday(){return this.status.today?this.status.today:["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()]}getReferenceNow(){const t=this.status.rtc;if(t){const e=new Date(t.replace(" ","T"));if(!Number.isNaN(e.getTime()))return e}return new Date}visibleAlarmGroups(){return Rt(this.alarms,this.getReferenceNow(),this.getTodayWeekday())}draftToApplyPayload(t){return{id:t.id,isNew:t.isNew,days:t.days,enabled:!0,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneShot:t.oneTime}}confirmOverlapsOrAbort(t){const e=fe(t);if(e.length===0)return!0;const s=ye(e,n=>ot(n,this.use12Hour));return window.confirm(s)}buildEditedAlarmsOrNull(){var n,r;if(!this.editDraft)return null;const t=this.root.querySelector("#edit-pwm-num");t&&this.commitEditBrightnessNumber(t);const e=Number(((n=this.root.querySelector("#edit-pre"))==null?void 0:n.value)??20),s=Number(((r=this.root.querySelector("#edit-hold"))==null?void 0:r.value)??20);if(this.editDraft.prewindowMin=V(e),this.editDraft.postHoldMin=X(s),this.editDraft.enabled=!0,this.editDraft.oneTime){const a=this.getTodayWeekday(),o=yt(this.editDraft.time,a,this.getReferenceNow());this.editDraft.days=[o]}else if(this.editDraft.days.length===0)return this.setMessage("Select at least one day for this alarm.","error"),null;return Vt(this.alarms,this.draftToApplyPayload(this.editDraft))}closeAlarmEdit(t){var e;this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen==="alarm-edit"&&(this.screen="editor",this.message="",this.messageKind="",this.render())}openAlarmEdit(t){const e=this.alarms.find(s=>s.id===t);e&&(this.message="",this.messageKind="",this.editDraft={id:e.id,isNew:!1,days:[...e.days],enabled:e.enabled,time:e.time,prewindowMin:e.prewindowMin,pwmMax:e.pwmMax,postHoldMin:e.postHoldMin,oneTime:e.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop())}toggleGroupEnabled(t,e){e.stopPropagation(),B(this.root),this.alarms=Yt(this.alarms,t,!t.enabled),this.afterDraftMutation(),this.render()}addAlarm(){if(this.alarms.length>=$){this.setMessage(`Maximum of ${$} alarms.`,"error");return}const t=Xt(this.alarms);this.message="",this.messageKind="",this.editDraft={id:t.id,isNew:!0,days:[...t.days],enabled:t.enabled,time:t.time,prewindowMin:t.prewindowMin,pwmMax:t.pwmMax,postHoldMin:t.postHoldMin,oneTime:t.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop()}async deleteEditingAlarm(){var e;if(!this.editDraft)return;if(this.editDraft.isNew||!this.editDraft.id){this.closeAlarmEdit(!1);return}const t=this.visibleAlarmGroups().find(s=>s.id===this.editDraft.id);if(!t){this.closeAlarmEdit(!1);return}this.alarms=nt(this.alarms,t),w(this.alarms),this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Alarm deleted.")}async deleteAlarmById(t){const e=this.visibleAlarmGroups().find(s=>s.id===t);e&&(this.alarms=nt(this.alarms,e),w(this.alarms),B(this.root),this.render(),await this.pushScheduleToDevice("Alarm deleted."))}async pushScheduleToDevice(t){if(this.transport){this.saving=!0,this.busy=!0,this.render();try{await re(this.transport,this.alarms);const e=await O(this.transport),s=H(e);if(!st(this.alarms,s))throw new Error("Device schedule does not match what was sent.");this.alarms=s,w(this.alarms),this.markCommitted(this.alarms),this.status=await F(this.transport),this.showSaveFlash(t,"ok"),this.message="",this.messageKind=""}catch(e){const s=e instanceof Error?e.message:String(e);this.showSaveFlash(s,"error")}finally{this.saving=!1,this.busy=!1,this.render()}}}async saveToDevice(){this.transport&&this.isDirty()&&(!this.alarms.some(t=>t.enabled)&&!window.confirm(`All alarms are turned off. The mask will not wake you until you enable an alarm and save again.

Save anyway?`)||this.confirmOverlapsOrAbort(this.alarms)&&await this.pushScheduleToDevice("Schedule saved to mask."))}async refreshFromDevice(){if(this.transport&&this.confirmDiscardUnsaved("Reload from the mask and discard them?")){this.busy=!0,this.render();try{const t=await O(this.transport);this.alarms=H(t),w(this.alarms),this.markCommitted(this.alarms),this.clearSaveFlash(),this.status=await F(this.transport),this.message="",this.messageKind=""}catch(t){const e=t instanceof Error?t.message:String(t);this.showSaveFlash(e,"error")}finally{this.busy=!1,this.render()}}}setEditBrightnessFromSlider(t){if(!this.editDraft)return;const e=b(t);this.editDraft.pwmMax=e;const s=this.root.querySelector("#edit-pwm-range"),n=this.root.querySelector("#edit-pwm-num");s&&(s.value=String(e)),n&&(n.value=String(e))}onEditBrightnessNumberInput(t){if(!this.editDraft)return;const e=x(t.value);if(e===null)return;const s=b(e);this.editDraft.pwmMax=s;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(s))}commitEditBrightnessNumber(t){if(!this.editDraft)return;const e=x(t.value);if(e===null){t.value=String(this.editDraft.pwmMax);return}const s=b(e);this.editDraft.pwmMax=s;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(s)),t.value=String(s)}async saveAlarmEditToDevice(){var e;const t=this.buildEditedAlarmsOrNull();t&&(!t.some(s=>s.enabled)&&!window.confirm(`All alarms are turned off. The mask will not wake you until you enable an alarm and save again.

Save anyway?`)||this.confirmOverlapsOrAbort(t)&&(this.alarms=t,w(this.alarms),this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Schedule saved to mask.")))}toggleEditDay(t){if(!this.editDraft||this.editDraft.oneTime)return;const e=new Set(this.editDraft.days);if(e.has(t)){if(e.size<=1)return;e.delete(t)}else e.add(t);this.editDraft.days=et.filter(s=>e.has(s)),this.render()}toggleEditOneTime(){this.editDraft&&(this.editDraft.oneTime=!this.editDraft.oneTime,!this.editDraft.oneTime&&this.editDraft.days.length===0&&(this.editDraft.days=[this.getTodayWeekday()]),this.render())}renderSavingBanner(){return this.saving?`
      <div class="card sync-banner">
        <span class="spinner" aria-hidden="true"></span>
        Saving to mask…
      </div>
    `:""}renderSaveBarStatus(){var t,e;return((t=this.saveFlash)==null?void 0:t.kind)==="error"?`<div class="save-bar-status error" role="status">${this.saveFlash.text}</div>`:this.isDirty()?'<div class="save-bar-status dirty" role="status">Unsaved changes</div>':((e=this.saveFlash)==null?void 0:e.kind)==="ok"?`<div class="save-bar-status ok" role="status">${this.saveFlash.text}</div>`:'<div class="save-bar-status empty" aria-hidden="true"></div>'}renderActionBar(t){const e=(t==null?void 0:t.requireDirtyForSave)??!1,s=this.busy||this.scheduleLoading||e&&!this.isDirty();return`
      <div class="save-bar">
        ${this.renderSaveBarStatus()}
        <div class="inner">
          <button class="btn btn-secondary" id="btn-disconnect" ${this.busy?"disabled":""}>Disconnect</button>
          <button class="btn btn-secondary" id="btn-refresh" ${this.busy||this.scheduleLoading?"disabled":""}>Reload</button>
          <button class="btn btn-primary" id="btn-save" ${s?"disabled":""}>Save to mask</button>
        </div>
      </div>
    `}renderConnect(){const t=ue(),e=he(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
      </div>`:""}

      ${!t&&!Z()?`<div class="card warn">
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
            <div class="alarm-time">${ot(t.time,this.use12Hour)}</div>
            <div class="alarm-subtitle">${Gt(t.days,t)}</div>
            <div class="alarm-subtitle alarm-subtitle-detail">${Kt(t)}</div>
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
              min="${E}"
              max="${D}"
              value="${this.lampTestLevel}"
              ${t||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              inputmode="numeric"
              min="${E}"
              max="${D}"
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
                min="${ct}"
                max="${ht}"
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
        ${this.status.batteryPercent?`<div class="status-battery">Battery: <strong>${this.status.batteryPercent}</strong></div>`:""}
        ${this.renderBatteryVoltage()}
        ${this.status.rtc?`<div>Clock: <strong>${at(this.status.rtc,this.use12Hour)}</strong></div>`:""}
        ${this.status.nextRamp?`<div>Next ramp: <strong>${at(this.status.nextRamp,this.use12Hour)}</strong></div>`:""}
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

      ${this.renderActionBar({requireDirtyForSave:!0})}
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
            ${et.map(d=>`
              <button
                type="button"
                class="repeat-chip ${!e&&a.has(d)?"on":""}${o}"
                data-repeat-day="${d}"
                ${e||this.busy?"disabled":""}
              >${Nt[d]}</button>`).join("")}
          </div>
        </div>

        <div class="alarm-edit-section">
          <label>Brightness</label>
          <div class="brightness-controls">
            <input
              type="range"
              id="edit-pwm-range"
              min="${E}"
              max="${D}"
              value="${s}"
              ${this.busy?"disabled":""}
            />
            <input
              type="number"
              id="edit-pwm-num"
              inputmode="numeric"
              min="${E}"
              max="${D}"
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
            <input type="number" id="edit-pre" inputmode="numeric" min="1" max="${pt}" value="${n}" ${this.busy?"disabled":""} />
          </div>
          <div>
            <label for="edit-hold">Hold after (min)</label>
            <input type="number" id="edit-hold" inputmode="numeric" min="1" max="${ft}" value="${r}" ${this.busy?"disabled":""} />
          </div>
        </div>

        <button type="button" class="btn-delete-alarm" id="btn-delete-alarm" ${this.busy?"disabled":""}>Delete Alarm</button>

        <div class="page-bottom-spacer"></div>
        ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
      </div>
      ${this.renderActionBar()}
    `}render(){var t;this.syncClockFormat(),(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen==="connect"?this.root.innerHTML=this.renderConnect():this.screen==="alarm-edit"?this.root.innerHTML=this.renderAlarmEdit():this.root.innerHTML=this.renderEditor(),B(this.root),this.bindEvents()}bindEvents(){if(this.screen==="connect"){this.bindConnectEvents();return}if(this.screen==="alarm-edit"){this.bindAlarmEditEvents();return}this.bindEditorEvents()}bindConnectEvents(){var t;(t=this.root.querySelector("#btn-connect"))==null||t.addEventListener("click",()=>void this.connectBle())}bindActionBarEvents(t){var e,s,n;(e=this.root.querySelector("#btn-disconnect"))==null||e.addEventListener("click",()=>void this.disconnect()),(s=this.root.querySelector("#btn-refresh"))==null||s.addEventListener("click",()=>void this.refreshFromDevice()),(n=this.root.querySelector("#btn-save"))==null||n.addEventListener("click",()=>void t())}bindEditorEvents(){var s,n,r,a,o,d;this.bindActionBarEvents(()=>this.saveToDevice()),this.bindTimeFormatEvents(),(s=this.root.querySelector("#btn-add-alarm"))==null||s.addEventListener("click",()=>this.addAlarm());const t=this.visibleAlarmGroups();Se(this.root,{onDelete:h=>void this.deleteAlarmById(h),onTap:h=>this.openAlarmEdit(h)}),this.root.querySelectorAll("[data-action='group-toggle']").forEach(h=>{h.addEventListener("click",c=>{const m=h.dataset.alarmId,f=t.find(y=>y.id===m);f&&this.toggleGroupEnabled(f,c)})}),(n=this.root.querySelector("#btn-lamp-test-toggle"))==null||n.addEventListener("click",()=>{this.toggleLampTestPanel()}),(r=this.root.querySelector("#lamp-test-level"))==null||r.addEventListener("input",h=>{this.syncLampTestSlider(Number(h.target.value))});const e=this.root.querySelector("#lamp-test-level-num");e==null||e.addEventListener("input",()=>this.onLampTestNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitLampTestNumber(e)),e==null||e.addEventListener("blur",()=>this.commitLampTestNumber(e)),(a=this.root.querySelector("#lamp-test-seconds"))==null||a.addEventListener("change",h=>{const c=h.target;this.lampTestSeconds=tt(Number(c.value)),c.value=String(this.lampTestSeconds);const m=this.root.querySelector("#btn-lamp-test");m&&(m.textContent=`Try for ${this.lampTestSeconds}s`)}),(o=this.root.querySelector("#btn-lamp-test"))==null||o.addEventListener("click",()=>void this.tryLampBrightness()),(d=this.root.querySelector("#btn-lamp-cancel"))==null||d.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")})}bindAlarmEditEvents(){var s,n,r,a,o;if(!this.editDraft)return;const t=this.root.querySelector("#time-wheel-mount");t&&(this.timePicker=new $e(t,this.editDraft.time,d=>{this.editDraft&&(this.editDraft.time=d)},{use12Hour:this.use12Hour})),(s=this.root.querySelector("#btn-repeat-once"))==null||s.addEventListener("click",()=>this.toggleEditOneTime()),(n=this.root.querySelector("#btn-edit-cancel"))==null||n.addEventListener("click",()=>this.closeAlarmEdit(!1)),(r=this.root.querySelector("#btn-edit-done"))==null||r.addEventListener("click",()=>void this.saveAlarmEditToDevice()),this.bindActionBarEvents(()=>this.saveAlarmEditToDevice()),(a=this.root.querySelector("#btn-delete-alarm"))==null||a.addEventListener("click",()=>{window.confirm("Delete this alarm?")&&this.deleteEditingAlarm()}),this.root.querySelectorAll("[data-repeat-day]").forEach(d=>{d.addEventListener("click",()=>{const h=d.dataset.repeatDay;this.toggleEditDay(h)})}),(o=this.root.querySelector("#edit-pwm-range"))==null||o.addEventListener("input",d=>{this.setEditBrightnessFromSlider(Number(d.target.value))});const e=this.root.querySelector("#edit-pwm-num");e==null||e.addEventListener("input",()=>this.onEditBrightnessNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitEditBrightnessNumber(e)),e==null||e.addEventListener("blur",()=>this.commitEditBrightnessNumber(e));for(const d of["edit-pre","edit-hold","edit-pwm-num"]){const h=this.root.querySelector(`#${d}`);h==null||h.addEventListener("focus",()=>{window.requestAnimationFrame(()=>h.select())})}}}const dt=document.getElementById("app");dt&&new Ce(dt);
