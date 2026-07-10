var mt=Object.defineProperty;var pt=(n,t,e)=>t in n?mt(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var o=(n,t,e)=>pt(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const T=1,E=100,I=50,st=1,it=60,nt=10;function v(n){const t=Math.round(Number(n));return Number.isFinite(t)?Math.max(T,Math.min(E,t)):I}function $(n){const t=n.trim();if(t==="")return null;const e=Number(t);return Number.isFinite(e)?Math.round(e):null}function V(n){const t=Math.round(Number(n));return Number.isFinite(t)?Math.max(st,Math.min(it,t)):nt}const f=["mon","tue","wed","thu","fri","sat","sun"],z=["sun","mon","tue","wed","thu","fri","sat"],ft={sun:"S",mon:"M",tue:"T",wed:"W",thu:"T",fri:"F",sat:"S"},J={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"},rt="sml-draft-schedule-v2";function k(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:I,postHoldMin:20,oneShot:!1}}function at(){return Object.fromEntries(f.map(n=>[n,k()]))}function Y(){return{...k(),enabled:!1,oneShot:!1}}function gt(){return Object.fromEntries(f.map(n=>[n,Y()]))}function yt(){try{const n=localStorage.getItem(rt);if(n){const e=JSON.parse(n);return Q(e)}const t=localStorage.getItem("sml-draft-schedule-v1");if(t){const e=JSON.parse(t);return Q(e)}return null}catch{return null}}function Q(n){const t=at();for(const e of f){const s=n[e];s&&(t[e]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:v(s.pwmMax??I),postHoldMin:s.postHoldMin??20,oneShot:!!s.oneShot})}return t}function w(n){localStorage.setItem(rt,JSON.stringify(n))}function B(n){const t=gt();for(const e of n){const s=e.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i);if(!s)continue;const i=Number(s[4]),r=Number(s[5]),a=Number(s[6]),l=Number(s[7])===1;if(i<1||i>240||a<1||a>240||r<1||r>100)continue;const d=s[1].toLowerCase();t[d]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:i,pwmMax:v(r),postHoldMin:a,oneShot:l}}return t}function vt(n,t){return f.every(e=>JSON.stringify(n[e])===JSON.stringify(t[e]))}function bt(n){return JSON.stringify({enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin,oneShot:!!n.oneShot})}function F(n,t){return f.indexOf(n)-f.indexOf(t)}function X(n){if(n.enabled||n.oneShot)return!1;const t=k();return n.time===t.time&&n.prewindowMin===t.prewindowMin&&n.pwmMax===t.pwmMax&&n.postHoldMin===t.postHoldMin}function L(n){const t=new Map;for(const i of f){const r=bt(n[i]),a=t.get(r)??[];a.push(i),t.set(r,a)}const e=[];let s=0;for(const i of t.values()){i.sort(F);const r={...n[i[0]]};e.push({id:`alarm-${s++}`,days:i,slot:r})}return e.sort((i,r)=>{const a=i.slot.time.localeCompare(r.slot.time);return a!==0?a:F(i.days[0],r.days[0])}),e}function Z(n){return L(n).filter(t=>!X(t.slot))}const wt=new Set(["mon","tue","wed","thu","fri"]),St=new Set(["sat","sun"]);function Tt(n,t){if(t!=null&&t.oneShot)return"Once";if(n.length===0)return"No days";const e=[...n].sort(F);return e.length===7?"Every day":e.length===5&&e.every(s=>wt.has(s))?"Weekdays":e.length===2&&e.every(s=>St.has(s))?"Weekend":e.length===1?J[e[0]]:e.map(s=>J[s].slice(0,3)).join(", ")}function Et(n){return`${n.pwmMax}% brightness · ${n.prewindowMin} min ramp`}function Lt(n,t,e=new Date){const s=n.match(/^(\d{1,2}):(\d{2})$/);if(!s)return t;const i=Number(s[1])*60+Number(s[2]),r=e.getHours()*60+e.getMinutes();if(i>r)return t;const a=f.indexOf(t);return f[(a+1)%7]}function Dt(n,t,e){const s={...n};for(const i of t.days)s[i]={...s[i],enabled:e,oneShot:e?s[i].oneShot:!1};return s}function Mt(n,t,e,s){const i={...n},r=new Set(e);for(const a of t)r.has(a)||(i[a]=Y());for(const a of e)i[a]={...s};return i}function tt(n,t){const e={...n};for(const s of t.days)e[s]=Y();return e}function $t(n){const t=f.find(l=>!n[l].enabled),e=t??"sat",s={...k(),enabled:!0,time:t?"07:00":"08:00",oneShot:!1},i={...n,[e]:s},r=L(i),a=r.find(l=>l.days.includes(e)&&l.slot.time===s.time);return{schedule:i,groupId:(a==null?void 0:a.id)??r[r.length-1].id}}const H="6e400001-b5a3-f393-e0a9-e50e24dcca9e",At="6e400002-b5a3-f393-e0a9-e50e24dcca9e",Ct="6e400003-b5a3-f393-e0a9-e50e24dcca9e",W=200,q=3e3;class _t{constructor(){o(this,"device",null);o(this,"server",null);o(this,"rxChar",null);o(this,"buffer","");o(this,"queue",[]);o(this,"notifyWaiters",[]);o(this,"_connected",!1);o(this,"opChain",Promise.resolve());o(this,"onDisconnectCallback",null);o(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}async connect(){var i;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[H]}],optionalServices:[H]}),this.device.addEventListener("gattserverdisconnected",()=>{var a;this._connected=!1;const r=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(a=this.onDisconnectCallback)==null||a.call(this,r)});const t=await((i=this.device.gatt)==null?void 0:i.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService(H);this.rxChar=await e.getCharacteristic(At);const s=await e.getCharacteristic(Ct);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",r=>{const l=r.target.value;if(!l)return;const d=new TextDecoder().decode(l);for(this.buffer+=d;this.buffer.includes(`
`);){const u=this.buffer.indexOf(`
`),m=this.buffer.slice(0,u).trim();if(this.buffer=this.buffer.slice(u+1),!m)continue;const p=this.notifyWaiters.shift();p?p(m):this.queue.push(m)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const s=window.setTimeout(()=>{const r=this.notifyWaiters.indexOf(i);r>=0&&this.notifyWaiters.splice(r,1),e(null)},t),i=r=>{clearTimeout(s),e(r)};this.notifyWaiters.push(i)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(W,q)):this.collectLines(W,q))}async sendAndCollect(t,e=W,s=q,i){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,s,i)))}async collectLines(t,e,s){const i=[],r=Date.now()+e;for(;Date.now()<r;){const a=r-Date.now(),l=await this.waitForLine(Math.min(t,a));if(l===null){if(i.length)return i;continue}if(i.push(l),s!=null&&s(l,i))return i}return i}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.opChain=Promise.resolve()}}const ot=250,xt=8e3,It=5e3,kt=200;function lt(n){const t=`OK ${n}`;return e=>e===t||e.startsWith(`${t} `)}function Ot(){const n=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=n.getTimezoneOffset(),s=t.getTimezoneOffset(),i=-e*60,a=e!==s?-Math.min(e,s)*60:0;return`TZ_OFFSET ${i} ${a}`}function Nt(){const n=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${n.getFullYear()}-${t(n.getMonth()+1)}-${t(n.getDate())} ${t(n.getHours())}:${t(n.getMinutes())}:${t(n.getSeconds())}`}function A(n){return n==="REQ_TIME"||n.startsWith("REQ_TIME ")}async function Bt(n){let t=n.drainQueue().some(A);if((await n.send(Ot())).some(A)&&(t=!0),!t){const s=Date.now()+2e3;for(;Date.now()<s;){const i=Math.max(100,Math.min(kt,s-Date.now())),r=await n.sendAndCollect("",i,Math.min(600,s-Date.now()),a=>A(a));if(r.some(A)){t=!0;break}if(!r.length)break}}}async function Ht(n){await n.send(Nt())}async function R(n){return await Ht(n),Rt(n)}async function P(n){const t=await n.sendAndCollect("SCHED_GET",ot,xt,lt("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function Wt(n,t){const e=Object.keys(t);for(const i of e){const r=t[i];let a;if(!r.enabled)a=X(r)?`SCHED_DAY ${i} OFF CLEAR`:`SCHED_DAY ${i} OFF`;else{const d=r.oneShot?" 1":"";a=`SCHED_DAY ${i} ${r.time} ${r.prewindowMin} ${r.pwmMax} ${r.postHoldMin}${d}`}const l=await n.send(a);if(!l.some(d=>d.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${i}: ${l.join(" ")}`)}if(!(await n.send("SAVE")).some(i=>i.includes("SAVE ok")))throw new Error("SAVE failed")}function qt(n){const t={};for(const e of n)e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function Rt(n){const t=await n.sendAndCollect("STATUS_LITE",ot,It,lt("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return qt(t)}async function Pt(n,t,e){const s=await n.send(`LAMP_TEST ${t} ${e}`);if(!s.some(i=>i.startsWith("OK LAMP_TEST")))throw new Error(s.find(i=>i.startsWith("ERR"))??"LAMP_TEST failed")}async function Ft(n){const t=await n.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function j(){return typeof navigator<"u"&&!!navigator.bluetooth}function Gt(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function Ut(){return j()}function Kt(){return Gt()&&!j()}function Yt(n){if(!n)return!1;const t=n instanceof DOMException||n instanceof Error?n.name:"",e=n instanceof Error?n.message:String(n),s=e.toLowerCase();return!!(t==="AbortError"||t==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(e.trim()))}function O(){try{return new Intl.DateTimeFormat(void 0,{hour:"numeric"}).resolvedOptions().hour12===!0}catch{return!0}}function _(n){const t=n.match(/^(\d{1,2}):(\d{2})$/);if(!t)return{hour12:7,minute:0,period:"AM"};let e=Number(t[1]);const s=Math.max(0,Math.min(59,Number(t[2])));Number.isFinite(e)||(e=7),e=(e%24+24)%24;const i=e>=12?"PM":"AM";let r=e%12;return r===0&&(r=12),{hour12:r,minute:s,period:i}}function G(n,t,e){let s=n%12;e==="PM"&&(s+=12),e==="AM"&&n===12&&(s=0),e==="PM"&&n===12&&(s=12);const i=Math.max(0,Math.min(59,Math.round(t)));return`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function Xt(n,t){const e=(Math.round(n)%24+24)%24,s=Math.max(0,Math.min(59,Math.round(t)));return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function U(n){const{hour12:t,minute:e,period:s}=_(n);return`${t}:${String(e).padStart(2,"0")} ${s}`}function K(n){const t=n.match(/^(\d{1,2}):(\d{2})$/);if(!t)return"07:00";const e=Number(t[1]),s=Number(t[2]);return`${String(e).padStart(2,"0")}:${String(s).padStart(2,"0")}`}function jt(n,t=O()){return t?U(n):K(n)}function Vt(n,t=O()){const e=n.trim();if(!e)return null;const s=e.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);if(s){const r=Number(s[1]),a=Number(s[2]);if(r<1||r>12||a>59)return null;const l=s[3].toUpperCase()==="PM"?"PM":"AM";return G(r,a,l)}const i=e.match(/^(\d{1,2}):(\d{2})$/);if(i){const r=Number(i[1]),a=Number(i[2]);return r>23||a>59?null:`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}`}if(t){const r=e.match(/^(\d{1,2}):(\d{2})$/);if(r){const a=Number(r[1]),l=Number(r[2]);if(a>=1&&a<=12&&l<=59)return G(a,l,a>=7&&a<=11?"AM":"PM")}}return null}const C=10;function zt(n,t){n.querySelectorAll(".alarm-swipe").forEach(e=>{const s=e,i=s.dataset.alarmId;if(!i)return;const r=s.querySelector(".alarm-row-panel"),a=s.querySelector(".alarm-swipe-delete");if(!r)return;let l=0,d=0,u=0,m=!1,p=null,y=null,b=!1;const N=(c,h)=>{r.style.transition=h?"transform 0.22s ease":"none",r.style.transform=c===0?"":`translateX(${c}px)`,s.classList.toggle("open",c<=-44/2)},ct=()=>{n.querySelectorAll(".alarm-swipe").forEach(c=>{const h=c;h.classList.remove("open");const g=h.querySelector(".alarm-row-panel");g&&(g.style.transition="",g.style.transform="")})},D=c=>{c<=-44?(ct(),N(-88,!0),s.classList.add("open")):(N(0,!0),s.classList.remove("open"))};a==null||a.addEventListener("click",c=>{c.stopPropagation(),t.onDelete(i)});const dt=(c,h)=>{u=s.classList.contains("open")?-88:0,l=c,d=h,m=!0,p=null,r.style.transition="none"},ut=(c,h)=>{if(!m)return;const g=c-l,M=h-d;if(p||(Math.abs(g)>C||Math.abs(M)>C)&&(p=Math.abs(g)>Math.abs(M)?"x":"y"),p!=="x")return;let S=u+g;S>0&&(S=0),S<-88&&(S=-88),N(S,!1)},ht=(c,h)=>{if(!m)return;m=!1,y=null;const g=c-l,M=h-d;if(p==="x"){D(u+g),b=!0,window.setTimeout(()=>{b=!1},400);return}if(!(Math.abs(g)>=C||Math.abs(M)>=C)){if(s.classList.contains("open")){D(0);return}t.onTap(i),b=!0,window.setTimeout(()=>{b=!1},400)}};r.addEventListener("pointerdown",c=>{if(c.pointerType==="mouse"&&c.button!==0)return;const h=c.target;h.closest(".alarm-swipe-delete")||h.closest("[data-action='group-toggle']")&&!s.classList.contains("open")||(y=c.pointerId,r.setPointerCapture(c.pointerId),dt(c.clientX,c.clientY))}),r.addEventListener("pointermove",c=>{y===c.pointerId&&(ut(c.clientX,c.clientY),p==="x"&&c.preventDefault())}),r.addEventListener("pointerup",c=>{y===c.pointerId&&(r.hasPointerCapture(c.pointerId)&&r.releasePointerCapture(c.pointerId),ht(c.clientX,c.clientY))}),r.addEventListener("pointercancel",c=>{y===c.pointerId&&(m=!1,y=null,D(s.classList.contains("open")?-88:0))}),r.addEventListener("click",c=>{if(b){c.preventDefault();return}if(s.classList.contains("open")){c.preventDefault(),D(0);return}c.target.closest("[data-action='group-toggle']")||t.onTap(i)})}),n.dataset.alarmSwipeDismissBound||(n.dataset.alarmSwipeDismissBound="1",n.addEventListener("click",e=>{e.target.closest(".alarm-swipe")||x(n)},{capture:!0}))}function x(n){n.querySelectorAll(".alarm-swipe").forEach(t=>{const e=t;e.classList.remove("open");const s=e.querySelector(".alarm-row-panel");s&&(s.style.transition="",s.style.transform="")})}const Jt=Array.from({length:12},(n,t)=>t+1),Qt=Array.from({length:24},(n,t)=>t),Zt=Array.from({length:60},(n,t)=>t),te=["AM","PM"],ee=36;class se{constructor(t,e,s,i={}){o(this,"root");o(this,"onChange");o(this,"use12Hour");o(this,"hour12");o(this,"hour24");o(this,"minute");o(this,"period");o(this,"typeInput",null);o(this,"hourCol",null);o(this,"minuteCol",null);o(this,"periodCol",null);o(this,"syncing",!1);this.root=t,this.onChange=s,this.use12Hour=i.use12Hour??O();const r=_(e);this.hour12=r.hour12,this.hour24=Number(e.split(":")[0])||7,this.minute=r.minute,this.period=r.period,this.render(),this.syncWheels(!1)}setTime24(t){const e=_(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!1),this.syncTypeField()}getTime24(){return this.use12Hour?G(this.hour12,this.minute,this.period):Xt(this.hour24,this.minute)}destroy(){this.root.innerHTML=""}emit(){const t=this.getTime24();this.syncTypeField(),this.onChange(t)}syncTypeField(){this.typeInput&&(this.typeInput.value=this.use12Hour?U(this.getTime24()):K(this.getTime24()))}placeholder(){return this.use12Hour?"6:30 AM":"18:30"}render(){var e,s,i,r,a,l;const t=this.use12Hour?'<div class="time-wheel-col time-wheel-col-period" data-wheel="period" tabindex="0"></div>':"";if(this.root.innerHTML=`
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
          value="${this.use12Hour?U(this.getTime24()):K(this.getTime24())}"
        />
      </div>
    `,this.hourCol=this.root.querySelector('[data-wheel="hour"]'),this.minuteCol=this.root.querySelector('[data-wheel="minute"]'),this.periodCol=this.root.querySelector('[data-wheel="period"]'),this.typeInput=this.root.querySelector("#time-wheel-type"),this.hourCol){const d=this.use12Hour?Jt.map(String):Qt.map(u=>String(u).padStart(2,"0"));this.fillColumn(this.hourCol,d,"hour")}this.minuteCol&&this.fillColumn(this.minuteCol,Zt.map(d=>String(d).padStart(2,"0")),"minute"),this.periodCol&&this.fillColumn(this.periodCol,te,"period"),(e=this.hourCol)==null||e.addEventListener("scroll",()=>this.onWheelScroll("hour"),{passive:!0}),(s=this.minuteCol)==null||s.addEventListener("scroll",()=>this.onWheelScroll("minute"),{passive:!0}),(i=this.periodCol)==null||i.addEventListener("scroll",()=>this.onWheelScroll("period"),{passive:!0}),(r=this.typeInput)==null||r.addEventListener("change",()=>this.onTypeCommit()),(a=this.typeInput)==null||a.addEventListener("blur",()=>this.onTypeCommit()),(l=this.typeInput)==null||l.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),this.onTypeCommit(),d.target.blur())})}fillColumn(t,e,s){t.innerHTML=`<div class="time-wheel-spacer"></div>${e.map(i=>`<div class="time-wheel-item" data-kind="${s}" data-value="${i}">${i}</div>`).join("")}<div class="time-wheel-spacer"></div>`}scrollToValue(t,e,s){const i=t.querySelector(`[data-value="${e}"]`);if(!i)return;const r=i.offsetTop-t.clientHeight/2+ee/2;t.scrollTo({top:r,behavior:s?"smooth":"auto"})}readWheel(t){const e=t.scrollTop+t.clientHeight/2,s=t.querySelectorAll(".time-wheel-item");let i=null,r=1/0;for(let a=0;a<s.length;a++){const l=s[a],d=l.offsetTop+l.offsetHeight/2,u=Math.abs(d-e);u<r&&(r=u,i=l)}return i?i.getAttribute("data-value")??"":""}onWheelScroll(t){if(this.syncing)return;const e=t==="hour"?this.hourCol:t==="minute"?this.minuteCol:this.periodCol;if(e){if(t==="hour"){const s=this.readWheel(e);if(this.use12Hour){const i=Number(s);i>=1&&i<=12&&(this.hour12=i)}else{const i=Number(s);i>=0&&i<=23&&(this.hour24=i)}}else if(t==="minute"){const s=Number(this.readWheel(e));s>=0&&s<=59&&(this.minute=s)}else{const s=this.readWheel(e);(s==="AM"||s==="PM")&&(this.period=s)}this.emit()}}onTypeCommit(){if(!this.typeInput)return;const t=Vt(this.typeInput.value,this.use12Hour);if(!t){this.syncTypeField();return}const e=_(t);this.hour12=e.hour12,this.hour24=Number(t.split(":")[0])||0,this.minute=e.minute,this.period=e.period,this.syncWheels(!0),this.emit()}syncWheels(t){if(this.syncing=!0,this.hourCol){const e=this.use12Hour?String(this.hour12):String(this.hour24).padStart(2,"0");this.scrollToValue(this.hourCol,e,t)}this.minuteCol&&this.scrollToValue(this.minuteCol,String(this.minute).padStart(2,"0"),t),this.periodCol&&this.scrollToValue(this.periodCol,this.period,t),window.setTimeout(()=>{this.syncing=!1},t?200:0)}}class ie{constructor(t){o(this,"root");o(this,"screen","connect");o(this,"transport",null);o(this,"schedule",yt()??at());o(this,"status",{});o(this,"message","");o(this,"messageKind","");o(this,"busy",!1);o(this,"scheduleLoading",!1);o(this,"statusLoading",!1);o(this,"syncGeneration",0);o(this,"editingGroupId",null);o(this,"editDraft",null);o(this,"timePicker",null);o(this,"lampTestLevel",I);o(this,"lampTestSeconds",nt);o(this,"lampTestRemaining",0);o(this,"lampTestInterval",null);o(this,"lampTestExpanded",!1);o(this,"use12Hour",O());this.root=t,this.render()}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const s=e instanceof Error?e.message:String(e);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const t=new _t;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),await t.connect(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)}catch(t){if(Yt(t))this.message="",this.messageKind="";else{const e=t instanceof Error?t.message:String(t);this.setMessage(e,"error")}}finally{this.busy=!1,this.render()}}async loadDeviceData(t,e){try{if(await Bt(t),e!==this.syncGeneration)return;const s=await P(t);if(e!==this.syncGeneration)return;const i=await R(t);if(e!==this.syncGeneration)return;this.schedule=B(s),w(this.schedule),this.status=i,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(e!==this.syncGeneration)return;const i=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${i}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await Ft(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const t=v(this.lampTestLevel),e=V(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,this.lampTestExpanded=!0,await this.withBusy(async()=>{await Pt(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const i=this.root.querySelector("#lamp-test-countdown"),r=this.root.querySelector(".lamp-test-toggle-hint");i&&(i.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),r&&(r.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}syncLampTestSlider(t){const e=v(t);this.lampTestLevel=e;const s=this.root.querySelector("#lamp-test-level"),i=this.root.querySelector("#lamp-test-level-num");s&&(s.value=String(e)),i&&(i.value=String(e));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}onLampTestNumberInput(t){const e=$(t.value);if(e===null)return;const s=v(e);this.lampTestLevel=s;const i=this.root.querySelector("#lamp-test-level");i&&(i.value=String(s));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}commitLampTestNumber(t){const e=$(t.value);if(e===null){t.value=String(this.lampTestLevel);return}this.syncLampTestSlider(v(e))}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}scrollToTop(){window.scrollTo({top:0,left:0,behavior:"auto"})}getTodayWeekday(){return this.status.today?this.status.today:["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()]}getReferenceNow(){const t=this.status.rtc;if(t){const e=new Date(t.replace(" ","T"));if(!Number.isNaN(e.getTime()))return e}return new Date}commitAlarmEditForm(){var i,r;if(!this.editDraft)return!1;const t=this.root.querySelector("#edit-pwm-num");t&&this.commitEditBrightnessNumber(t);const e=Number(((i=this.root.querySelector("#edit-pre"))==null?void 0:i.value)??20),s=Number(((r=this.root.querySelector("#edit-hold"))==null?void 0:r.value)??20);if(this.editDraft.slot.prewindowMin=e,this.editDraft.slot.postHoldMin=s,this.editDraft.slot.enabled=!0,this.editDraft.oneTime){const a=this.getTodayWeekday(),l=Lt(this.editDraft.slot.time,a,this.getReferenceNow());this.editDraft.days=[l],this.editDraft.slot.oneShot=!0}else{if(this.editDraft.days.length===0)return this.setMessage("Select at least one day for this alarm.","error"),!1;this.editDraft.slot.oneShot=!1}return this.schedule=Mt(this.schedule,this.editDraft.previousDays,this.editDraft.days,this.editDraft.slot),w(this.schedule),!0}closeAlarmEdit(t){var e;t&&!this.commitAlarmEditForm()||(this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen==="alarm-edit"&&(this.screen="editor",this.message="",this.messageKind="",this.render()))}openAlarmEdit(t){const e=L(this.schedule).find(s=>s.id===t);!e||X(e.slot)||(this.message="",this.messageKind="",this.editingGroupId=t,this.editDraft={previousDays:[...e.days],days:[...e.days],slot:{...e.slot},oneTime:!!e.slot.oneShot},this.screen="alarm-edit",this.render(),this.scrollToTop())}toggleGroupEnabled(t,e){e.stopPropagation(),x(this.root),this.schedule=Dt(this.schedule,t,!t.slot.enabled),w(this.schedule),this.render()}addAlarm(){const{schedule:t,groupId:e}=$t(this.schedule);this.schedule=t,w(this.schedule),this.openAlarmEdit(e)}async deleteEditingAlarm(){var e;if(!this.editingGroupId)return;const t=L(this.schedule).find(s=>s.id===this.editingGroupId);t&&(this.schedule=tt(this.schedule,t),w(this.schedule),this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Alarm deleted."))}async deleteAlarmById(t){const e=L(this.schedule).find(s=>s.id===t);e&&(this.schedule=tt(this.schedule,e),w(this.schedule),x(this.root),this.render(),await this.pushScheduleToDevice("Alarm deleted."))}async pushScheduleToDevice(t){this.transport&&await this.withBusy(async()=>{await Wt(this.transport,this.schedule);const e=await P(this.transport),s=B(e);if(!vt(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await R(this.transport),this.setMessage(t,"ok")})}async saveToDevice(){if(!this.transport)return;if(!f.some(e=>this.schedule[e].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.pushScheduleToDevice("Schedule saved to mask.")}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const t=await P(this.transport);this.schedule=B(t),w(this.schedule),this.status=await R(this.transport),this.setMessage("Reloaded from mask.","ok")})}setEditBrightnessFromSlider(t){if(!this.editDraft)return;const e=v(t);this.editDraft.slot.pwmMax=e;const s=this.root.querySelector("#edit-pwm-range"),i=this.root.querySelector("#edit-pwm-num");s&&(s.value=String(e)),i&&(i.value=String(e))}onEditBrightnessNumberInput(t){if(!this.editDraft)return;const e=$(t.value);if(e===null)return;const s=v(e);this.editDraft.slot.pwmMax=s;const i=this.root.querySelector("#edit-pwm-range");i&&(i.value=String(s))}commitEditBrightnessNumber(t){if(!this.editDraft)return;const e=$(t.value);if(e===null){t.value=String(this.editDraft.slot.pwmMax);return}const s=v(e);this.editDraft.slot.pwmMax=s;const i=this.root.querySelector("#edit-pwm-range");i&&(i.value=String(s)),t.value=String(s)}async saveAlarmEditToDevice(){var t;this.commitAlarmEditForm()&&(this.editingGroupId=null,this.editDraft=null,(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.pushScheduleToDevice("Schedule saved to mask."))}toggleEditDay(t){if(!this.editDraft||this.editDraft.oneTime)return;const e=new Set(this.editDraft.days);if(e.has(t)){if(e.size<=1)return;e.delete(t)}else e.add(t);this.editDraft.days=z.filter(s=>e.has(s)),this.render()}toggleEditOneTime(){this.editDraft&&(this.editDraft.oneTime=!this.editDraft.oneTime,this.editDraft.oneTime?this.editDraft.slot.oneShot=!0:(this.editDraft.slot.oneShot=!1,this.editDraft.days.length===0&&(this.editDraft.days=[this.getTodayWeekday()])),this.render())}renderActionBar(){return`
      <div class="save-bar">
        <div class="inner">
          <button class="btn btn-secondary" id="btn-disconnect" ${this.busy?"disabled":""}>Disconnect</button>
          <button class="btn btn-secondary" id="btn-refresh" ${this.busy||this.scheduleLoading?"disabled":""}>Reload</button>
          <button class="btn btn-primary" id="btn-save" ${this.busy||this.scheduleLoading?"disabled":""}>Save to mask</button>
        </div>
      </div>
    `}renderConnect(){const t=Kt(),e=Ut(),s=window.location.href;return`
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
    `}renderAlarmListRow(t){const{slot:e,days:s,id:i}=t,r=e.enabled?"":" off";return`
      <div class="alarm-swipe" data-alarm-id="${i}">
        <button
          type="button"
          class="alarm-swipe-delete"
          data-alarm-id="${i}"
          aria-label="Delete alarm"
        >Delete</button>
        <div class="alarm-row alarm-row-panel${r}" data-alarm-id="${i}">
          <div class="alarm-row-main">
            <div class="alarm-time">${jt(e.time,this.use12Hour)}</div>
            <div class="alarm-subtitle">${Tt(s,e)}</div>
            <div class="alarm-subtitle alarm-subtitle-detail">${Et(e)}</div>
          </div>
          <div
            class="toggle ${e.enabled?"on":""}"
            data-action="group-toggle"
            data-alarm-id="${i}"
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
              min="${T}"
              max="${E}"
              value="${this.lampTestLevel}"
              ${t||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              min="${T}"
              max="${E}"
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
                min="${st}"
                max="${it}"
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
    `}renderEditor(){var s,i;const t=this.scheduleLoading,e=Z(this.schedule);return`
      <h1>Alarms</h1>
      <p class="subtitle">${(s=this.transport)!=null&&s.connected?"Connected":"Disconnected"}</p>

      ${t?`<div class="card sync-banner">
        <span class="spinner" aria-hidden="true"></span>
        Syncing schedule from mask…
      </div>`:""}

      <div class="card status-bar ${this.statusLoading?"loading":""}">
        ${this.statusLoading?'<div class="muted">Loading device status…</div>':`
        ${this.status.rtc?`<div>Clock: <strong>${this.status.rtc}</strong></div>`:""}
        ${this.status.nextRamp?`<div>Next ramp: <strong>${this.status.nextRamp}</strong></div>`:""}
        ${this.status.preMin?`<div>Ramp: <strong>${this.status.preMin} min</strong></div>`:""}
        ${this.status.postHoldMin?`<div>Hold after alarm: <strong>${this.status.postHoldMin} min</strong></div>`:""}
        ${this.status.nvmOk!==void 0?`<div>Saved: <strong>${this.status.nvmOk?"yes":"no"}</strong></div>`:""}
        `}
      </div>

      ${(i=this.transport)!=null&&i.connected?this.renderBrightnessTestCard():""}

      <div class="alarm-list-card ${t?"loading":""}">
        ${e.map(r=>this.renderAlarmListRow(r)).join("")}
      </div>

      <button class="btn-add-alarm" type="button" id="btn-add-alarm" ${t||this.busy?"disabled":""}>
        <span class="btn-add-icon" aria-hidden="true">+</span> Add Alarm
      </button>

      ${this.renderActionBar()}
      <div class="page-bottom-spacer"></div>
      ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
    `}renderAlarmEdit(){if(!this.editDraft)return"";const{slot:t,days:e,oneTime:s}=this.editDraft,i=new Set(e),r=s?" repeat-disabled":"";return`
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
            ${z.map(a=>`
              <button
                type="button"
                class="repeat-chip ${i.has(a)?"on":""}${r}"
                data-repeat-day="${a}"
                ${s?"disabled":""}
              >${ft[a]}</button>`).join("")}
          </div>
        </div>

        <div class="alarm-edit-section">
          <label>Brightness</label>
          <div class="brightness-controls">
            <input
              type="range"
              id="edit-pwm-range"
              min="${T}"
              max="${E}"
              value="${t.pwmMax}"
            />
            <input
              type="number"
              id="edit-pwm-num"
              min="${T}"
              max="${E}"
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
    `}render(){var t;(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen==="connect"?this.root.innerHTML=this.renderConnect():this.screen==="alarm-edit"?this.root.innerHTML=this.renderAlarmEdit():this.root.innerHTML=this.renderEditor(),x(this.root),this.bindEvents()}bindEvents(){if(this.screen==="connect"){this.bindConnectEvents();return}if(this.screen==="alarm-edit"){this.bindAlarmEditEvents();return}this.bindEditorEvents()}bindConnectEvents(){var t;(t=this.root.querySelector("#btn-connect"))==null||t.addEventListener("click",()=>void this.connectBle())}bindActionBarEvents(t){var e,s,i;(e=this.root.querySelector("#btn-disconnect"))==null||e.addEventListener("click",()=>void this.disconnect()),(s=this.root.querySelector("#btn-refresh"))==null||s.addEventListener("click",()=>void this.refreshFromDevice()),(i=this.root.querySelector("#btn-save"))==null||i.addEventListener("click",()=>void t())}bindEditorEvents(){var s,i,r,a,l,d;this.bindActionBarEvents(()=>this.saveToDevice()),(s=this.root.querySelector("#btn-add-alarm"))==null||s.addEventListener("click",()=>this.addAlarm());const t=Z(this.schedule);zt(this.root,{onDelete:u=>void this.deleteAlarmById(u),onTap:u=>this.openAlarmEdit(u)}),this.root.querySelectorAll("[data-action='group-toggle']").forEach(u=>{u.addEventListener("click",m=>{const p=u.dataset.alarmId,y=t.find(b=>b.id===p);y&&this.toggleGroupEnabled(y,m)})}),(i=this.root.querySelector("#btn-lamp-test-toggle"))==null||i.addEventListener("click",()=>{this.toggleLampTestPanel()}),(r=this.root.querySelector("#lamp-test-level"))==null||r.addEventListener("input",u=>{this.syncLampTestSlider(Number(u.target.value))});const e=this.root.querySelector("#lamp-test-level-num");e==null||e.addEventListener("input",()=>this.onLampTestNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitLampTestNumber(e)),e==null||e.addEventListener("blur",()=>this.commitLampTestNumber(e)),(a=this.root.querySelector("#lamp-test-seconds"))==null||a.addEventListener("change",u=>{const m=u.target;this.lampTestSeconds=V(Number(m.value)),m.value=String(this.lampTestSeconds);const p=this.root.querySelector("#btn-lamp-test");p&&(p.textContent=`Try for ${this.lampTestSeconds}s`)}),(l=this.root.querySelector("#btn-lamp-test"))==null||l.addEventListener("click",()=>void this.tryLampBrightness()),(d=this.root.querySelector("#btn-lamp-cancel"))==null||d.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")})}bindAlarmEditEvents(){var s,i,r,a,l;if(!this.editDraft)return;const t=this.root.querySelector("#time-wheel-mount");t&&(this.timePicker=new se(t,this.editDraft.slot.time,d=>{this.editDraft&&(this.editDraft.slot.time=d)},{use12Hour:this.use12Hour})),(s=this.root.querySelector("#btn-repeat-once"))==null||s.addEventListener("click",()=>this.toggleEditOneTime()),(i=this.root.querySelector("#btn-edit-cancel"))==null||i.addEventListener("click",()=>this.closeAlarmEdit(!1)),(r=this.root.querySelector("#btn-edit-done"))==null||r.addEventListener("click",()=>void this.saveAlarmEditToDevice()),this.bindActionBarEvents(()=>this.saveAlarmEditToDevice()),(a=this.root.querySelector("#btn-delete-alarm"))==null||a.addEventListener("click",()=>{window.confirm("Delete this alarm?")&&this.deleteEditingAlarm()}),this.root.querySelectorAll("[data-repeat-day]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.repeatDay;this.toggleEditDay(u)})}),(l=this.root.querySelector("#edit-pwm-range"))==null||l.addEventListener("input",d=>{this.setEditBrightnessFromSlider(Number(d.target.value))});const e=this.root.querySelector("#edit-pwm-num");e==null||e.addEventListener("input",()=>this.onEditBrightnessNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitEditBrightnessNumber(e)),e==null||e.addEventListener("blur",()=>this.commitEditBrightnessNumber(e))}}const et=document.getElementById("app");et&&new ie(et);
