var gt=Object.defineProperty;var yt=(i,t,e)=>t in i?gt(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var a=(i,t,e)=>yt(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();const D=1,L=100,B=50,nt=1,rt=60,ot=10;function v(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(D,Math.min(L,t)):B}function C(i){const t=i.trim();if(t==="")return null;const e=Number(t);return Number.isFinite(e)?Math.round(e):null}function z(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(nt,Math.min(rt,t)):ot}const p=["mon","tue","wed","thu","fri","sat","sun"],J=["sun","mon","tue","wed","thu","fri","sat"],vt={sun:"S",mon:"M",tue:"T",wed:"W",thu:"T",fri:"F",sat:"S"},Q={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"},at="sml-draft-schedule-v2";function R(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:B,postHoldMin:20,oneShot:!1}}function lt(){return Object.fromEntries(p.map(i=>[i,R()]))}function Y(){return{...R(),enabled:!1,oneShot:!1}}function bt(){return Object.fromEntries(p.map(i=>[i,Y()]))}function wt(){try{const i=localStorage.getItem(at);if(i){const e=JSON.parse(i);return Z(e)}const t=localStorage.getItem("sml-draft-schedule-v1");if(t){const e=JSON.parse(t);return Z(e)}return null}catch{return null}}function Z(i){const t=lt();for(const e of p){const s=i[e];s&&(t[e]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:v(s.pwmMax??B),postHoldMin:s.postHoldMin??20,oneShot:!!s.oneShot})}return t}function w(i){localStorage.setItem(at,JSON.stringify(i))}function I(i){const t=bt();for(const e of i){const s=e.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!s)continue;const n=Number(s[4]),r=Number(s[5]),o=Number(s[6]),l=Number(s[7])===1;if(n<1||n>240||o<1||o>240||r<1||r>100)continue;const d=s[1].toLowerCase();t[d]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:n,pwmMax:v(r),postHoldMin:o,oneShot:l}}return t}function St(i,t){return p.every(e=>JSON.stringify(i[e])===JSON.stringify(t[e]))}function Tt(i){return JSON.stringify({enabled:i.enabled,time:i.time,prewindowMin:i.prewindowMin,pwmMax:i.pwmMax,postHoldMin:i.postHoldMin,oneShot:!!i.oneShot})}function X(i,t){return p.indexOf(i)-p.indexOf(t)}function Et(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);return t?Number(t[1])*60+Number(t[2]):420}function Dt(i,t,e,s){const n=Et(t),r=Math.floor(n/60),o=n%60,l=p.indexOf(s);let u=(p.indexOf(i)-l+7)%7;const h=new Date(e);return h.setHours(r,o,0,0),u>0?h.setDate(h.getDate()+u):h.getTime()<=e.getTime()&&h.setDate(h.getDate()+7),h.getTime()}function tt(i,t,e){const s=i.slot.oneShot?[ct(i.slot.time,e,t)]:i.days;return Math.min(...s.map(n=>Dt(n,i.slot.time,t,e)))}function V(i){if(i.enabled||i.oneShot)return!1;const t=R();return i.time===t.time&&i.prewindowMin===t.prewindowMin&&i.pwmMax===t.pwmMax&&i.postHoldMin===t.postHoldMin}function M(i){const t=new Map;for(const n of p){const r=Tt(i[n]),o=t.get(r)??[];o.push(n),t.set(r,o)}const e=[];let s=0;for(const n of t.values()){n.sort(X);const r={...i[n[0]]};e.push({id:`alarm-${s++}`,days:n,slot:r})}return e}function Lt(i,t=new Date,e){const s=e??["sun","mon","tue","wed","thu","fri","sat"][t.getDay()],n=M(i).filter(r=>!V(r.slot));return n.sort((r,o)=>{const l=tt(r,t,s),d=tt(o,t,s);return l!==d?l-d:X(r.days[0],o.days[0])}),n}const Mt=new Set(["mon","tue","wed","thu","fri"]),$t=new Set(["sat","sun"]);function At(i,t){if(t!=null&&t.oneShot)return"Once";if(i.length===0)return"No days";const e=[...i].sort(X);return e.length===7?"Every day":e.length===5&&e.every(s=>Mt.has(s))?"Weekdays":e.length===2&&e.every(s=>$t.has(s))?"Weekend":e.length===1?Q[e[0]]:e.map(s=>Q[s].slice(0,3)).join(", ")}function Ct(i){return`${i.pwmMax}% brightness · ${i.prewindowMin} min ramp`}function ct(i,t,e=new Date){const s=i.match(/^(\d{1,2}):(\d{2})$/);if(!s)return t;const n=Number(s[1])*60+Number(s[2]),r=e.getHours()*60+e.getMinutes();if(n>r)return t;const o=p.indexOf(t);return p[(o+1)%7]}function It(i,t,e){const s={...i};for(const n of t.days)s[n]={...s[n],enabled:e,oneShot:!!s[n].oneShot};return s}function xt(i,t,e,s){const n={...i},r=new Set(e);for(const o of t)r.has(o)||(n[o]=Y());for(const o of e)n[o]={...s};return n}function et(i,t){const e={...i};for(const s of t.days)e[s]=Y();return e}function _t(i){const t=p.find(l=>!i[l].enabled),e=t??"sat",s={...R(),enabled:!0,time:t?"07:00":"08:00",oneShot:!1},n={...i,[e]:s},r=M(n),o=r.find(l=>l.days.includes(e)&&l.slot.time===s.time);return{schedule:n,groupId:(o==null?void 0:o.id)??r[r.length-1].id}}const q="6e400001-b5a3-f393-e0a9-e50e24dcca9e",Nt="6e400002-b5a3-f393-e0a9-e50e24dcca9e",kt="6e400003-b5a3-f393-e0a9-e50e24dcca9e",P=200,F=3e3;class Ot{constructor(){a(this,"device",null);a(this,"server",null);a(this,"rxChar",null);a(this,"buffer","");a(this,"queue",[]);a(this,"notifyWaiters",[]);a(this,"_connected",!1);a(this,"opChain",Promise.resolve());a(this,"onDisconnectCallback",null);a(this,"onUnsolicitedLine",null);a(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}setOnUnsolicitedLine(t){this.onUnsolicitedLine=t}async connect(){var n;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[q]}],optionalServices:[q]}),this.device.addEventListener("gattserverdisconnected",()=>{var o;this._connected=!1;const r=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(o=this.onDisconnectCallback)==null||o.call(this,r)});const t=await((n=this.device.gatt)==null?void 0:n.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService(q);this.rxChar=await e.getCharacteristic(Nt);const s=await e.getCharacteristic(kt);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",r=>{const l=r.target.value;if(!l)return;const d=new TextDecoder().decode(l);for(this.buffer+=d;this.buffer.includes(`
`);){const u=this.buffer.indexOf(`
`),h=this.buffer.slice(0,u).trim();if(this.buffer=this.buffer.slice(u+1),!h)continue;const f=this.notifyWaiters.shift();f?f(h):this.onUnsolicitedLine?this.onUnsolicitedLine(h):this.queue.push(h)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const s=window.setTimeout(()=>{const r=this.notifyWaiters.indexOf(n);r>=0&&this.notifyWaiters.splice(r,1),e(null)},t),n=r=>{clearTimeout(s),e(r)};this.notifyWaiters.push(n)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(P,F)):this.collectLines(P,F))}async sendAndCollect(t,e=P,s=F,n){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,s,n)))}async collectLines(t,e,s){const n=[],r=Date.now()+e;for(;Date.now()<r;){const o=r-Date.now(),l=await this.waitForLine(Math.min(t,o));if(l===null){if(n.length)return n;continue}if(n.push(l),s!=null&&s(l,n))return n}return n}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.onUnsolicitedLine=null,this.opChain=Promise.resolve()}}const dt=250,Ht=8e3,Bt=5e3,Rt=200;function ut(i){const t=`OK ${i}`;return e=>e===t||e.startsWith(`${t} `)}function Wt(){const i=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=i.getTimezoneOffset(),s=t.getTimezoneOffset(),n=-e*60,o=e!==s?-Math.min(e,s)*60:0;return`TZ_OFFSET ${n} ${o}`}function qt(){const i=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${i.getFullYear()}-${t(i.getMonth()+1)}-${t(i.getDate())} ${t(i.getHours())}:${t(i.getMinutes())}:${t(i.getSeconds())}`}function x(i){return i==="REQ_TIME"||i.startsWith("REQ_TIME ")}async function Pt(i){let t=i.drainQueue().some(x);if((await i.send(Wt())).some(x)&&(t=!0),!t){const s=Date.now()+2e3;for(;Date.now()<s;){const n=Math.max(100,Math.min(Rt,s-Date.now())),r=await i.sendAndCollect("",n,Math.min(600,s-Date.now()),o=>x(o));if(r.some(x)){t=!0;break}if(!r.length)break}}}async function Ft(i){await i.send(qt())}async function _(i){return await Ft(i),Kt(i)}async function N(i){const t=await i.sendAndCollect("SCHED_GET",dt,Ht,ut("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function Ut(i,t){const e=Object.keys(t);for(const n of e){const r=t[n];let o;if(!r.enabled)o=V(r)?`SCHED_DAY ${n} OFF CLEAR`:`SCHED_DAY ${n} OFF`;else{const d=r.oneShot?" 1":"";o=`SCHED_DAY ${n} ${r.time} ${r.prewindowMin} ${r.pwmMax} ${r.postHoldMin}${d}`}const l=await i.send(o);if(!l.some(d=>d.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${n}: ${l.join(" ")}`)}if(!(await i.send("SAVE")).some(n=>n.includes("SAVE ok")))throw new Error("SAVE failed")}function Gt(i){const t={};for(const e of i)e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function Kt(i){const t=await i.sendAndCollect("STATUS_LITE",dt,Bt,ut("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return Gt(t)}async function Yt(i,t,e){const s=await i.send(`LAMP_TEST ${t} ${e}`);if(!s.some(n=>n.startsWith("OK LAMP_TEST")))throw new Error(s.find(n=>n.startsWith("ERR"))??"LAMP_TEST failed")}async function Xt(i){const t=await i.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function j(){return typeof navigator<"u"&&!!navigator.bluetooth}function Vt(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function jt(){return j()}function zt(){return Vt()&&!j()}function Jt(i){if(!i)return!1;const t=i instanceof DOMException||i instanceof Error?i.name:"",e=i instanceof Error?i.message:String(i),s=e.toLowerCase();return!!(t==="AbortError"||t==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(e.trim()))}function S(){try{const i=new Date(2020,0,1,13,0);if(new Intl.DateTimeFormat(void 0,{hour:"numeric"}).formatToParts(i).some(s=>s.type==="dayPeriod"))return!0;const e=new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions().hour12;return e===!0?!0:e===!1?!1:/\b(AM|PM|am|pm)\b/.test(i.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"}))}catch{return!0}}function Qt(i){const t=i.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);if(!t)return null;const e=new Date(Number(t[1]),Number(t[2])-1,Number(t[3]),Number(t[4]),Number(t[5]),Number(t[6]??0));return Number.isNaN(e.getTime())?null:e}function st(i,t=S()){const e=Qt(i);return e?new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit",hour12:t}).format(e):i}function O(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);if(!t)return{hour12:7,minute:0,period:"AM"};let e=Number(t[1]);const s=Math.max(0,Math.min(59,Number(t[2])));Number.isFinite(e)||(e=7),e=(e%24+24)%24;const n=e>=12?"PM":"AM";let r=e%12;return r===0&&(r=12),{hour12:r,minute:s,period:n}}function U(i,t,e){let s=i%12;e==="PM"&&(s+=12),e==="AM"&&i===12&&(s=0),e==="PM"&&i===12&&(s=12);const n=Math.max(0,Math.min(59,Math.round(t)));return`${String(s).padStart(2,"0")}:${String(n).padStart(2,"0")}`}function Zt(i,t){const e=(Math.round(i)%24+24)%24,s=Math.max(0,Math.min(59,Math.round(t)));return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function G(i){const{hour12:t,minute:e,period:s}=O(i);return`${t}:${String(e).padStart(2,"0")} ${s}`}function K(i){const t=i.match(/^(\d{1,2}):(\d{2})$/);if(!t)return"07:00";const e=Number(t[1]),s=Number(t[2]);return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function te(i,t=S()){return t?G(i):K(i)}function ee(i,t=S()){const e=i.trim();if(!e)return null;const s=e.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);if(s){const r=Number(s[1]),o=Number(s[2]);if(r<1||r>12||o>59)return null;const l=s[3].toUpperCase()==="PM"?"PM":"AM";return U(r,o,l)}const n=e.match(/^(\d{1,2}):(\d{2})$/);if(n){const r=Number(n[1]),o=Number(n[2]);return r>23||o>59?null:`${String(r).padStart(2,"0")}:${String(o).padStart(2,"0")}`}if(t){const r=e.match(/^(\d{1,2}):(\d{2})$/);if(r){const o=Number(r[1]),l=Number(r[2]);if(o>=1&&o<=12&&l<=59)return U(o,l,o>=7&&o<=11?"AM":"PM")}}return null}const k=10;function se(i,t){i.querySelectorAll(".alarm-swipe").forEach(e=>{const s=e,n=s.dataset.alarmId;if(!n)return;const r=s.querySelector(".alarm-row-panel"),o=s.querySelector(".alarm-swipe-delete");if(!r)return;const l=!s.classList.contains("alarm-swipe-off");let d=0,u=0,h=0,f=!1,y=null,b=null,T=!1;const W=(c,m)=>{r.style.transition=m?"transform 0.22s ease":"none",r.style.transform=c===0?"":`translateX(${c}px)`,s.classList.toggle("open",c<=-44/2)},ht=()=>{i.querySelectorAll(".alarm-swipe").forEach(c=>{const m=c;m.classList.remove("open");const g=m.querySelector(".alarm-row-panel");g&&(g.style.transition="",g.style.transform="")})},$=c=>{c<=-44?(ht(),W(-88,!0),s.classList.add("open")):(W(0,!0),s.classList.remove("open"))};o==null||o.addEventListener("click",c=>{c.stopPropagation(),t.onDelete(n)});const mt=(c,m)=>{h=s.classList.contains("open")?-88:0,d=c,u=m,f=!0,y=null,r.style.transition="none"},ft=(c,m)=>{if(!f)return;const g=c-d,A=m-u;if(y||(Math.abs(g)>k||Math.abs(A)>k)&&(y=Math.abs(g)>Math.abs(A)?"x":"y"),y!=="x")return;let E=h+g;E>0&&(E=0),E<-88&&(E=-88),W(E,!1)},pt=(c,m)=>{if(!f)return;f=!1,b=null;const g=c-d,A=m-u;if(y==="x"){$(h+g),T=!0,window.setTimeout(()=>{T=!1},400);return}if(!(Math.abs(g)>=k||Math.abs(A)>=k)){if(s.classList.contains("open")){$(0);return}t.onTap(n),T=!0,window.setTimeout(()=>{T=!1},400)}};r.addEventListener("pointerdown",c=>{if(!l||c.pointerType==="mouse"&&c.button!==0)return;const m=c.target;m.closest(".alarm-swipe-delete")||m.closest("[data-action='group-toggle']")&&!s.classList.contains("open")||(b=c.pointerId,r.setPointerCapture(c.pointerId),mt(c.clientX,c.clientY))}),r.addEventListener("pointermove",c=>{b===c.pointerId&&(ft(c.clientX,c.clientY),y==="x"&&c.preventDefault())}),r.addEventListener("pointerup",c=>{b===c.pointerId&&(r.hasPointerCapture(c.pointerId)&&r.releasePointerCapture(c.pointerId),pt(c.clientX,c.clientY))}),r.addEventListener("pointercancel",c=>{b===c.pointerId&&(f=!1,b=null,$(s.classList.contains("open")?-88:0))}),r.addEventListener("click",c=>{if(T){c.preventDefault();return}if(s.classList.contains("open")){c.preventDefault(),$(0);return}c.target.closest("[data-action='group-toggle']")||t.onTap(n)})}),i.dataset.alarmSwipeDismissBound||(i.dataset.alarmSwipeDismissBound="1",i.addEventListener("click",e=>{e.target.closest(".alarm-swipe")||H(i)},{capture:!0}))}function H(i){i.querySelectorAll(".alarm-swipe").forEach(t=>{const e=t;e.classList.remove("open");const s=e.querySelector(".alarm-row-panel");s&&(s.style.transition="",s.style.transform="")})}const ie=Array.from({length:12},(i,t)=>t+1),ne=Array.from({length:24},(i,t)=>t),re=Array.from({length:60},(i,t)=>t),oe=["AM","PM"],ae=36;class le{constructor(t,e,s,n={}){a(this,"root");a(this,"onChange");a(this,"use12Hour");a(this,"hour12");a(this,"hour24");a(this,"minute");a(this,"period");a(this,"typeInput",null);a(this,"hourCol",null);a(this,"minuteCol",null);a(this,"periodCol",null);a(this,"syncing",!1);this.root=t,this.onChange=s,this.use12Hour=n.use12Hour??S();const r=O(e);this.hour12=r.hour12,this.hour24=Number(e.split(":")[0])||7,this.minute=r.minute,this.period=r.period,this.render(),this.syncWheels(!1)}setTime24(t){const e=O(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!1),this.syncTypeField()}getTime24(){return this.use12Hour?U(this.hour12,this.minute,this.period):Zt(this.hour24,this.minute)}destroy(){this.root.innerHTML=""}emit(){const t=this.getTime24();this.syncTypeField(),this.onChange(t)}syncTypeField(){this.typeInput&&(this.typeInput.value=this.use12Hour?G(this.getTime24()):K(this.getTime24()))}placeholder(){return this.use12Hour?"6:30 AM":"18:30"}render(){var e,s,n,r,o,l;const t=this.use12Hour?'<div class="time-wheel-col time-wheel-col-period" data-wheel="period" tabindex="0"></div>':"";if(this.root.innerHTML=`
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
          value="${this.use12Hour?G(this.getTime24()):K(this.getTime24())}"
        />
      </div>
    `,this.hourCol=this.root.querySelector('[data-wheel="hour"]'),this.minuteCol=this.root.querySelector('[data-wheel="minute"]'),this.periodCol=this.root.querySelector('[data-wheel="period"]'),this.typeInput=this.root.querySelector("#time-wheel-type"),this.hourCol){const d=this.use12Hour?ie.map(String):ne.map(u=>String(u).padStart(2,"0"));this.fillColumn(this.hourCol,d,"hour")}this.minuteCol&&this.fillColumn(this.minuteCol,re.map(d=>String(d).padStart(2,"0")),"minute"),this.periodCol&&this.fillColumn(this.periodCol,oe,"period"),(e=this.hourCol)==null||e.addEventListener("scroll",()=>this.onWheelScroll("hour"),{passive:!0}),(s=this.minuteCol)==null||s.addEventListener("scroll",()=>this.onWheelScroll("minute"),{passive:!0}),(n=this.periodCol)==null||n.addEventListener("scroll",()=>this.onWheelScroll("period"),{passive:!0}),(r=this.typeInput)==null||r.addEventListener("change",()=>this.onTypeCommit()),(o=this.typeInput)==null||o.addEventListener("blur",()=>this.onTypeCommit()),(l=this.typeInput)==null||l.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),this.onTypeCommit(),d.target.blur())})}fillColumn(t,e,s){t.innerHTML=`<div class="time-wheel-spacer"></div>${e.map(n=>`<div class="time-wheel-item" data-kind="${s}" data-value="${n}">${n}</div>`).join("")}<div class="time-wheel-spacer"></div>`}scrollToValue(t,e,s){const n=t.querySelector(`[data-value="${e}"]`);if(!n)return;const r=n.offsetTop-t.clientHeight/2+ae/2;t.scrollTo({top:r,behavior:s?"smooth":"auto"})}readWheel(t){const e=t.scrollTop+t.clientHeight/2,s=t.querySelectorAll(".time-wheel-item");let n=null,r=1/0;for(let o=0;o<s.length;o++){const l=s[o],d=l.offsetTop+l.offsetHeight/2,u=Math.abs(d-e);u<r&&(r=u,n=l)}return n?n.getAttribute("data-value")??"":""}onWheelScroll(t){if(this.syncing)return;const e=t==="hour"?this.hourCol:t==="minute"?this.minuteCol:this.periodCol;if(e){if(t==="hour"){const s=this.readWheel(e);if(this.use12Hour){const n=Number(s);n>=1&&n<=12&&(this.hour12=n)}else{const n=Number(s);n>=0&&n<=23&&(this.hour24=n)}}else if(t==="minute"){const s=Number(this.readWheel(e));s>=0&&s<=59&&(this.minute=s)}else{const s=this.readWheel(e);(s==="AM"||s==="PM")&&(this.period=s)}this.emit()}}onTypeCommit(){if(!this.typeInput)return;const t=ee(this.typeInput.value,this.use12Hour);if(!t){this.syncTypeField();return}const e=O(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!0),this.emit()}syncWheels(t){if(this.syncing=!0,this.hourCol){const e=this.use12Hour?String(this.hour12):String(this.hour24).padStart(2,"0");this.scrollToValue(this.hourCol,e,t)}this.minuteCol&&this.scrollToValue(this.minuteCol,String(this.minute).padStart(2,"0"),t),this.periodCol&&this.scrollToValue(this.periodCol,this.period,t),window.setTimeout(()=>{this.syncing=!1},t?200:0)}}class ce{constructor(t){a(this,"root");a(this,"screen","connect");a(this,"transport",null);a(this,"schedule",wt()??lt());a(this,"status",{});a(this,"message","");a(this,"messageKind","");a(this,"busy",!1);a(this,"scheduleLoading",!1);a(this,"statusLoading",!1);a(this,"syncGeneration",0);a(this,"editingGroupId",null);a(this,"editDraft",null);a(this,"timePicker",null);a(this,"lampTestLevel",B);a(this,"lampTestSeconds",ot);a(this,"lampTestRemaining",0);a(this,"lampTestInterval",null);a(this,"lampTestExpanded",!1);a(this,"use12Hour",S());a(this,"scheduleRefreshInFlight",!1);this.root=t,this.render()}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const s=e instanceof Error?e.message:String(e);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const t=new Ot;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),t.setOnUnsolicitedLine(e=>this.onDeviceLine(e)),await t.connect(),this.use12Hour=S(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)}catch(t){if(Jt(t))this.message="",this.messageKind="";else{const e=t instanceof Error?t.message:String(t);this.setMessage(e,"error")}}finally{this.busy=!1,this.render()}}onDeviceLine(t){(t.includes("ALARM dismissed")||t.startsWith("SAVE ok"))&&this.syncScheduleFromDeviceQuiet()}async syncScheduleFromDeviceQuiet(){var t;if(!(!((t=this.transport)!=null&&t.connected)||this.scheduleRefreshInFlight||this.busy)){this.scheduleRefreshInFlight=!0;try{const e=await N(this.transport);this.schedule=I(e),w(this.schedule);try{this.status=await _(this.transport)}catch{}this.screen==="editor"&&this.render()}catch{}finally{this.scheduleRefreshInFlight=!1}}}async loadDeviceData(t,e){try{if(await Pt(t),e!==this.syncGeneration)return;const s=await N(t);if(e!==this.syncGeneration)return;const n=await _(t);if(e!==this.syncGeneration)return;this.schedule=I(s),w(this.schedule),this.status=n,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(e!==this.syncGeneration)return;const n=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${n}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await Xt(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const t=v(this.lampTestLevel),e=z(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,this.lampTestExpanded=!0,await this.withBusy(async()=>{await Yt(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const n=this.root.querySelector("#lamp-test-countdown"),r=this.root.querySelector(".lamp-test-toggle-hint");n&&(n.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),r&&(r.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}syncLampTestSlider(t){const e=v(t);this.lampTestLevel=e;const s=this.root.querySelector("#lamp-test-level"),n=this.root.querySelector("#lamp-test-level-num");s&&(s.value=String(e)),n&&(n.value=String(e));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}onLampTestNumberInput(t){const e=C(t.value);if(e===null)return;const s=v(e);this.lampTestLevel=s;const n=this.root.querySelector("#lamp-test-level");n&&(n.value=String(s));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}commitLampTestNumber(t){const e=C(t.value);if(e===null){t.value=String(this.lampTestLevel);return}this.syncLampTestSlider(v(e))}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}scrollToTop(){window.scrollTo({top:0,left:0,behavior:"auto"})}getTodayWeekday(){return this.status.today?this.status.today:["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()]}getReferenceNow(){const t=this.status.rtc;if(t){const e=new Date(t.replace(" ","T"));if(!Number.isNaN(e.getTime()))return e}return new Date}visibleAlarmGroups(){return Lt(this.schedule,this.getReferenceNow(),this.getTodayWeekday())}commitAlarmEditForm(){var n,r;if(!this.editDraft)return!1;const t=this.root.querySelector("#edit-pwm-num");t&&this.commitEditBrightnessNumber(t);const e=Number(((n=this.root.querySelector("#edit-pre"))==null?void 0:n.value)??20),s=Number(((r=this.root.querySelector("#edit-hold"))==null?void 0:r.value)??20);if(this.editDraft.slot.prewindowMin=e,this.editDraft.slot.postHoldMin=s,this.editDraft.slot.enabled=!0,this.editDraft.oneTime){const o=this.getTodayWeekday(),l=ct(this.editDraft.slot.time,o,this.getReferenceNow());this.editDraft.days=[l],this.editDraft.slot.oneShot=!0}else{if(this.editDraft.days.length===0)return this.setMessage("Select at least one day for this alarm.","error"),!1;this.editDraft.slot.oneShot=!1}return this.schedule=xt(this.schedule,this.editDraft.previousDays,this.editDraft.days,this.editDraft.slot),w(this.schedule),!0}closeAlarmEdit(t){var e;t&&!this.commitAlarmEditForm()||(this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen==="alarm-edit"&&(this.screen="editor",this.message="",this.messageKind="",this.render()))}openAlarmEdit(t){const e=M(this.schedule).find(s=>s.id===t);!e||V(e.slot)||(this.message="",this.messageKind="",this.editingGroupId=t,this.editDraft={previousDays:[...e.days],days:[...e.days],slot:{...e.slot},oneTime:!!e.slot.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop())}toggleGroupEnabled(t,e){e.stopPropagation(),H(this.root),this.schedule=It(this.schedule,t,!t.slot.enabled),w(this.schedule),this.render()}addAlarm(){const{schedule:t,groupId:e}=_t(this.schedule);this.schedule=t,w(this.schedule),this.openAlarmEdit(e)}async deleteEditingAlarm(){var e;if(!this.editingGroupId)return;const t=M(this.schedule).find(s=>s.id===this.editingGroupId);t&&(this.schedule=et(this.schedule,t),w(this.schedule),this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Alarm deleted."))}async deleteAlarmById(t){const e=M(this.schedule).find(s=>s.id===t);e&&(this.schedule=et(this.schedule,e),w(this.schedule),H(this.root),this.render(),await this.pushScheduleToDevice("Alarm deleted."))}async pushScheduleToDevice(t){this.transport&&await this.withBusy(async()=>{await Ut(this.transport,this.schedule);const e=await N(this.transport),s=I(e);if(!St(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await _(this.transport),this.setMessage(t,"ok")})}async saveToDevice(){if(!this.transport)return;if(!p.some(e=>this.schedule[e].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.pushScheduleToDevice("Schedule saved to mask.")}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const t=await N(this.transport);this.schedule=I(t),w(this.schedule),this.status=await _(this.transport),this.setMessage("Reloaded from mask.","ok")})}setEditBrightnessFromSlider(t){if(!this.editDraft)return;const e=v(t);this.editDraft.slot.pwmMax=e;const s=this.root.querySelector("#edit-pwm-range"),n=this.root.querySelector("#edit-pwm-num");s&&(s.value=String(e)),n&&(n.value=String(e))}onEditBrightnessNumberInput(t){if(!this.editDraft)return;const e=C(t.value);if(e===null)return;const s=v(e);this.editDraft.slot.pwmMax=s;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(s))}commitEditBrightnessNumber(t){if(!this.editDraft)return;const e=C(t.value);if(e===null){t.value=String(this.editDraft.slot.pwmMax);return}const s=v(e);this.editDraft.slot.pwmMax=s;const n=this.root.querySelector("#edit-pwm-range");n&&(n.value=String(s)),t.value=String(s)}async saveAlarmEditToDevice(){var t;this.commitAlarmEditForm()&&(this.editingGroupId=null,this.editDraft=null,(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Schedule saved to mask."))}toggleEditDay(t){if(!this.editDraft||this.editDraft.oneTime)return;const e=new Set(this.editDraft.days);if(e.has(t)){if(e.size<=1)return;e.delete(t)}else e.add(t);this.editDraft.days=J.filter(s=>e.has(s)),this.render()}toggleEditOneTime(){this.editDraft&&(this.editDraft.oneTime=!this.editDraft.oneTime,this.editDraft.oneTime?this.editDraft.slot.oneShot=!0:(this.editDraft.slot.oneShot=!1,this.editDraft.days.length===0&&(this.editDraft.days=[this.getTodayWeekday()])),this.render())}renderActionBar(){return`
      <div class="save-bar">
        <div class="inner">
          <button class="btn btn-secondary" id="btn-disconnect" ${this.busy?"disabled":""}>Disconnect</button>
          <button class="btn btn-secondary" id="btn-refresh" ${this.busy||this.scheduleLoading?"disabled":""}>Reload</button>
          <button class="btn btn-primary" id="btn-save" ${this.busy||this.scheduleLoading?"disabled":""}>Save to mask</button>
        </div>
      </div>
    `}renderConnect(){const t=zt(),e=jt(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
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
    `}renderAlarmListRow(t){const{slot:e,days:s,id:n}=t,r=e.enabled?"":" off";return`
      <div class="alarm-swipe${e.enabled?"":" alarm-swipe-off"}" data-alarm-id="${n}">
        <button
          type="button"
          class="alarm-swipe-delete"
          data-alarm-id="${n}"
          aria-label="Delete alarm"
        >Delete</button>
        <div class="alarm-row alarm-row-panel${r}" data-alarm-id="${n}">
          <div class="alarm-row-main">
            <div class="alarm-time">${te(e.time,this.use12Hour)}</div>
            <div class="alarm-subtitle">${At(s,e)}</div>
            <div class="alarm-subtitle alarm-subtitle-detail">${Ct(e)}</div>
          </div>
          <div
            class="toggle ${e.enabled?"on":""}"
            data-action="group-toggle"
            data-alarm-id="${n}"
            role="switch"
            aria-checked="${e.enabled}"
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
              min="${D}"
              max="${L}"
              value="${this.lampTestLevel}"
              ${t||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              min="${D}"
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
    `}renderEditor(){var s,n;const t=this.scheduleLoading,e=this.visibleAlarmGroups();return`
      <h1>Alarms</h1>
      <p class="subtitle">${(s=this.transport)!=null&&s.connected?"Connected":"Disconnected"}</p>

      ${t?`<div class="card sync-banner">
        <span class="spinner" aria-hidden="true"></span>
        Syncing schedule from mask…
      </div>`:""}

      <div class="card status-bar ${this.statusLoading?"loading":""}">
        ${this.statusLoading?'<div class="muted">Loading device status…</div>':`
        ${this.status.rtc?`<div>Clock: <strong>${st(this.status.rtc,this.use12Hour)}</strong></div>`:""}
        ${this.status.nextRamp?`<div>Next ramp: <strong>${st(this.status.nextRamp,this.use12Hour)}</strong></div>`:""}
        ${this.status.preMin?`<div>Ramp: <strong>${this.status.preMin} min</strong></div>`:""}
        ${this.status.postHoldMin?`<div>Hold after alarm: <strong>${this.status.postHoldMin} min</strong></div>`:""}
        ${this.status.nvmOk!==void 0?`<div>Saved: <strong>${this.status.nvmOk?"yes":"no"}</strong></div>`:""}
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
    `}renderAlarmEdit(){if(!this.editDraft)return"";const{slot:t,days:e,oneTime:s}=this.editDraft,n=new Set(e),r=s?" repeat-disabled":"";return`
      <div class="alarm-edit-sheet">
        <div class="alarm-edit-nav">
          <button type="button" class="alarm-edit-nav-btn" id="btn-edit-cancel">Cancel</button>
          <span class="alarm-edit-title">Edit Alarm</span>
          <button type="button" class="alarm-edit-nav-btn alarm-edit-done" id="btn-edit-done">Save</button>
        </div>

        <div id="time-wheel-mount"></div>

        <div class="alarm-edit-section">
          <div class="alarm-edit-section-label">Repeat</div>
          <div class="repeat-row">
            <button
              type="button"
              class="repeat-chip repeat-chip-once ${s?"on":""}"
              id="btn-repeat-once"
            >Once</button>
            ${J.map(o=>`
              <button
                type="button"
                class="repeat-chip ${n.has(o)?"on":""}${r}"
                data-repeat-day="${o}"
                ${s?"disabled":""}
              >${vt[o]}</button>`).join("")}
          </div>
        </div>

        <div class="alarm-edit-section">
          <label>Brightness</label>
          <div class="brightness-controls">
            <input
              type="range"
              id="edit-pwm-range"
              min="${D}"
              max="${L}"
              value="${t.pwmMax}"
            />
            <input
              type="number"
              id="edit-pwm-num"
              min="${D}"
              max="${L}"
              value="${t.pwmMax}"
              aria-label="Brightness percent"
            />
            <span class="brightness-unit">%</span>
          </div>
        </div>

        <div class="alarm-edit-section field-row">
          <div>
            <label for="edit-pre">Ramp before (min)</label>
            <input type="number" id="edit-pre" min="1" max="240" value="${t.prewindowMin}" />
          </div>
          <div>
            <label for="edit-hold">Hold after (min)</label>
            <input type="number" id="edit-hold" min="1" max="240" value="${t.postHoldMin}" />
          </div>
        </div>

        <button type="button" class="btn-delete-alarm" id="btn-delete-alarm">Delete Alarm</button>

        <div class="page-bottom-spacer"></div>
        ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
      </div>
      ${this.renderActionBar()}
    `}render(){var t;(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen==="connect"?this.root.innerHTML=this.renderConnect():this.screen==="alarm-edit"?this.root.innerHTML=this.renderAlarmEdit():this.root.innerHTML=this.renderEditor(),H(this.root),this.bindEvents()}bindEvents(){if(this.screen==="connect"){this.bindConnectEvents();return}if(this.screen==="alarm-edit"){this.bindAlarmEditEvents();return}this.bindEditorEvents()}bindConnectEvents(){var t;(t=this.root.querySelector("#btn-connect"))==null||t.addEventListener("click",()=>void this.connectBle())}bindActionBarEvents(t){var e,s,n;(e=this.root.querySelector("#btn-disconnect"))==null||e.addEventListener("click",()=>void this.disconnect()),(s=this.root.querySelector("#btn-refresh"))==null||s.addEventListener("click",()=>void this.refreshFromDevice()),(n=this.root.querySelector("#btn-save"))==null||n.addEventListener("click",()=>void t())}bindEditorEvents(){var s,n,r,o,l,d;this.bindActionBarEvents(()=>this.saveToDevice()),(s=this.root.querySelector("#btn-add-alarm"))==null||s.addEventListener("click",()=>this.addAlarm());const t=this.visibleAlarmGroups();se(this.root,{onDelete:u=>void this.deleteAlarmById(u),onTap:u=>this.openAlarmEdit(u)}),this.root.querySelectorAll("[data-action='group-toggle']").forEach(u=>{u.addEventListener("click",h=>{const f=u.dataset.alarmId,y=t.find(b=>b.id===f);y&&this.toggleGroupEnabled(y,h)})}),(n=this.root.querySelector("#btn-lamp-test-toggle"))==null||n.addEventListener("click",()=>{this.toggleLampTestPanel()}),(r=this.root.querySelector("#lamp-test-level"))==null||r.addEventListener("input",u=>{this.syncLampTestSlider(Number(u.target.value))});const e=this.root.querySelector("#lamp-test-level-num");e==null||e.addEventListener("input",()=>this.onLampTestNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitLampTestNumber(e)),e==null||e.addEventListener("blur",()=>this.commitLampTestNumber(e)),(o=this.root.querySelector("#lamp-test-seconds"))==null||o.addEventListener("change",u=>{const h=u.target;this.lampTestSeconds=z(Number(h.value)),h.value=String(this.lampTestSeconds);const f=this.root.querySelector("#btn-lamp-test");f&&(f.textContent=`Try for ${this.lampTestSeconds}s`)}),(l=this.root.querySelector("#btn-lamp-test"))==null||l.addEventListener("click",()=>void this.tryLampBrightness()),(d=this.root.querySelector("#btn-lamp-cancel"))==null||d.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")})}bindAlarmEditEvents(){var s,n,r,o,l;if(!this.editDraft)return;const t=this.root.querySelector("#time-wheel-mount");t&&(this.timePicker=new le(t,this.editDraft.slot.time,d=>{this.editDraft&&(this.editDraft.slot.time=d)},{use12Hour:this.use12Hour})),(s=this.root.querySelector("#btn-repeat-once"))==null||s.addEventListener("click",()=>this.toggleEditOneTime()),(n=this.root.querySelector("#btn-edit-cancel"))==null||n.addEventListener("click",()=>this.closeAlarmEdit(!1)),(r=this.root.querySelector("#btn-edit-done"))==null||r.addEventListener("click",()=>void this.saveAlarmEditToDevice()),this.bindActionBarEvents(()=>this.saveAlarmEditToDevice()),(o=this.root.querySelector("#btn-delete-alarm"))==null||o.addEventListener("click",()=>{window.confirm("Delete this alarm?")&&this.deleteEditingAlarm()}),this.root.querySelectorAll("[data-repeat-day]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.repeatDay;this.toggleEditDay(u)})}),(l=this.root.querySelector("#edit-pwm-range"))==null||l.addEventListener("input",d=>{this.setEditBrightnessFromSlider(Number(d.target.value))});const e=this.root.querySelector("#edit-pwm-num");e==null||e.addEventListener("input",()=>this.onEditBrightnessNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitEditBrightnessNumber(e)),e==null||e.addEventListener("blur",()=>this.commitEditBrightnessNumber(e))}}const it=document.getElementById("app");it&&new ce(it);
