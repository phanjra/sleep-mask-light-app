var lt=Object.defineProperty;var ct=(n,t,e)=>t in n?lt(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var l=(n,t,e)=>ct(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const M=1,D=100,x=50,J=1,Q=60,Z=10;function v(n){const t=Math.round(Number(n));return Number.isFinite(t)?Math.max(M,Math.min(D,t)):x}function C(n){const t=n.trim();if(t==="")return null;const e=Number(t);return Number.isFinite(e)?Math.round(e):null}function K(n){const t=Math.round(Number(n));return Number.isFinite(t)?Math.max(J,Math.min(Q,t)):Z}const w=["mon","tue","wed","thu","fri","sat","sun"],Y=["sun","mon","tue","wed","thu","fri","sat"],dt={sun:"S",mon:"M",tue:"T",wed:"W",thu:"T",fri:"F",sat:"S"},X={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"},tt="sml-draft-schedule-v2";function F(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:x,postHoldMin:20}}function G(){return Object.fromEntries(w.map(n=>[n,F()]))}function ut(){try{const n=localStorage.getItem(tt);if(n){const e=JSON.parse(n);return V(e)}const t=localStorage.getItem("sml-draft-schedule-v1");if(t){const e=JSON.parse(t);return V(e)}return null}catch{return null}}function V(n){const t=G();for(const e of w){const s=n[e];s&&(t[e]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:v(s.pwmMax??x),postHoldMin:s.postHoldMin??20})}return t}function T(n){localStorage.setItem(tt,JSON.stringify(n))}function O(n){const t=G();for(const e of n){const s=e.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/i);if(!s)continue;const i=s[1].toLowerCase();t[i]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:Number(s[4]),pwmMax:v(Number(s[5])),postHoldMin:s[6]?Number(s[6]):20}}return t}function ht(n,t){return w.every(e=>JSON.stringify(n[e])===JSON.stringify(t[e]))}function mt(n){return JSON.stringify({enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin})}function R(n,t){return w.indexOf(n)-w.indexOf(t)}function E(n){const t=new Map;for(const i of w){const r=mt(n[i]),a=t.get(r)??[];a.push(i),t.set(r,a)}const e=[];let s=0;for(const i of t.values()){i.sort(R);const r={...n[i[0]]};e.push({id:`alarm-${s++}`,days:i,slot:r})}return e.sort((i,r)=>{const a=i.slot.time.localeCompare(r.slot.time);return a!==0?a:R(i.days[0],r.days[0])}),e}const pt=new Set(["mon","tue","wed","thu","fri"]),ft=new Set(["sat","sun"]);function gt(n){if(n.length===0)return"No days";const t=[...n].sort(R);return t.length===7?"Every day":t.length===5&&t.every(e=>pt.has(e))?"Weekdays":t.length===2&&t.every(e=>ft.has(e))?"Weekend":t.length===1?X[t[0]]:t.map(e=>X[e].slice(0,3)).join(", ")}function yt(n){return`${n.pwmMax}% brightness · ${n.prewindowMin} min ramp`}function vt(n,t,e){const s={...n};for(const i of t.days)s[i]={...s[i],enabled:e};return s}function bt(n,t,e,s){const i={...n},r=new Set(e);for(const a of t)r.has(a)||(i[a]={...F(),enabled:!1});for(const a of e)i[a]={...s};return i}function j(n,t){const e={...n};for(const s of t.days)e[s]={...e[s],enabled:!1};return e}function wt(n){const t=w.find(c=>!n[c].enabled),e=t??"sat",s={...F(),enabled:!0,time:t?"07:00":"08:00"},i={...n,[e]:s},r=E(i),a=r.find(c=>c.days.includes(e)&&c.slot.time===s.time);return{schedule:i,groupId:(a==null?void 0:a.id)??r[r.length-1].id}}const q="6e400001-b5a3-f393-e0a9-e50e24dcca9e",Tt="6e400002-b5a3-f393-e0a9-e50e24dcca9e",St="6e400003-b5a3-f393-e0a9-e50e24dcca9e",B=200,N=3e3;class Et{constructor(){l(this,"device",null);l(this,"server",null);l(this,"rxChar",null);l(this,"buffer","");l(this,"queue",[]);l(this,"notifyWaiters",[]);l(this,"_connected",!1);l(this,"opChain",Promise.resolve());l(this,"onDisconnectCallback",null);l(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}async connect(){var i;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[q]}],optionalServices:[q]}),this.device.addEventListener("gattserverdisconnected",()=>{var a;this._connected=!1;const r=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(a=this.onDisconnectCallback)==null||a.call(this,r)});const t=await((i=this.device.gatt)==null?void 0:i.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService(q);this.rxChar=await e.getCharacteristic(Tt);const s=await e.getCharacteristic(St);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",r=>{const c=r.target.value;if(!c)return;const d=new TextDecoder().decode(c);for(this.buffer+=d;this.buffer.includes(`
`);){const m=this.buffer.indexOf(`
`),p=this.buffer.slice(0,m).trim();if(this.buffer=this.buffer.slice(m+1),!p)continue;const f=this.notifyWaiters.shift();f?f(p):this.queue.push(p)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const s=window.setTimeout(()=>{const r=this.notifyWaiters.indexOf(i);r>=0&&this.notifyWaiters.splice(r,1),e(null)},t),i=r=>{clearTimeout(s),e(r)};this.notifyWaiters.push(i)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(B,N)):this.collectLines(B,N))}async sendAndCollect(t,e=B,s=N,i){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,s,i)))}async collectLines(t,e,s){const i=[],r=Date.now()+e;for(;Date.now()<r;){const a=r-Date.now(),c=await this.waitForLine(Math.min(t,a));if(c===null){if(i.length)return i;continue}if(i.push(c),s!=null&&s(c,i))return i}return i}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.opChain=Promise.resolve()}}const et=250,Lt=8e3,Mt=5e3,Dt=200;function st(n){const t=`OK ${n}`;return e=>e===t||e.startsWith(`${t} `)}function $t(){const n=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=n.getTimezoneOffset(),s=t.getTimezoneOffset(),i=-e*60,a=e!==s?-Math.min(e,s)*60:0;return`TZ_OFFSET ${i} ${a}`}function At(){const n=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${n.getFullYear()}-${t(n.getMonth()+1)}-${t(n.getDate())} ${t(n.getHours())}:${t(n.getMinutes())}:${t(n.getSeconds())}`}function _(n){return n==="REQ_TIME"||n.startsWith("REQ_TIME ")}async function Ct(n){let t=n.drainQueue().some(_);if((await n.send($t())).some(_)&&(t=!0),!t){const s=Date.now()+2e3;for(;Date.now()<s;){const i=Math.max(100,Math.min(Dt,s-Date.now())),r=await n.sendAndCollect("",i,Math.min(600,s-Date.now()),a=>_(a));if(r.some(_)){t=!0;break}if(!r.length)break}}}async function _t(n){await n.send(At())}async function W(n){return await _t(n),xt(n)}async function P(n){const t=await n.sendAndCollect("SCHED_GET",et,Lt,st("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function It(n,t){const e=Object.keys(t);for(const i of e){const r=t[i];let a;r.enabled?a=`SCHED_DAY ${i} ${r.time} ${r.prewindowMin} ${r.pwmMax} ${r.postHoldMin}`:a=`SCHED_DAY ${i} OFF`;const c=await n.send(a);if(!c.some(d=>d.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${i}: ${c.join(" ")}`)}if(!(await n.send("SAVE")).some(i=>i.includes("SAVE ok")))throw new Error("SAVE failed")}function kt(n){const t={};for(const e of n)e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function xt(n){const t=await n.sendAndCollect("STATUS_LITE",et,Mt,st("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return kt(t)}async function Ot(n,t,e){const s=await n.send(`LAMP_TEST ${t} ${e}`);if(!s.some(i=>i.startsWith("OK LAMP_TEST")))throw new Error(s.find(i=>i.startsWith("ERR"))??"LAMP_TEST failed")}async function qt(n){const t=await n.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function U(){return typeof navigator<"u"&&!!navigator.bluetooth}function Bt(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function Nt(){return U()}function Wt(){return Bt()&&!U()}function Pt(n){if(!n)return!1;const t=n instanceof DOMException||n instanceof Error?n.name:"",e=n instanceof Error?n.message:String(n),s=e.toLowerCase();return!!(t==="AbortError"||t==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(e.trim()))}function k(n){const t=n.match(/^(\d{1,2}):(\d{2})$/);if(!t)return{hour12:7,minute:0,period:"AM"};let e=Number(t[1]);const s=Math.max(0,Math.min(59,Number(t[2])));Number.isFinite(e)||(e=7),e=(e%24+24)%24;const i=e>=12?"PM":"AM";let r=e%12;return r===0&&(r=12),{hour12:r,minute:s,period:i}}function it(n,t,e){let s=n%12;e==="PM"&&(s+=12),e==="AM"&&n===12&&(s=0),e==="PM"&&n===12&&(s=12);const i=Math.max(0,Math.min(59,Math.round(t)));return`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function H(n){const{hour12:t,minute:e,period:s}=k(n);return`${t}:${String(e).padStart(2,"0")} ${s}`}function Rt(n){const t=n.trim();if(!t)return null;const e=t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);if(e){const i=Number(e[1]),r=Number(e[2]);if(i<1||i>12||r>59)return null;const a=e[3].toUpperCase()==="PM"?"PM":"AM";return it(i,r,a)}const s=t.match(/^(\d{1,2}):(\d{2})$/);if(s){const i=Number(s[1]),r=Number(s[2]);return i>23||r>59?null:`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`}return null}const I=10;function Ht(n,t){n.querySelectorAll(".alarm-swipe").forEach(e=>{const s=e,i=s.dataset.alarmId;if(!i)return;const r=s.querySelector(".alarm-row-panel"),a=s.querySelector(".alarm-swipe-delete");if(!r)return;let c=0,d=0,m=0,p=!1,f=null,u=null,g=!1;const b=(o,h)=>{r.style.transition=h?"transform 0.22s ease":"none",r.style.transform=o===0?"":`translateX(${o}px)`,s.classList.toggle("open",o<=-44/2)},$=()=>{n.querySelectorAll(".alarm-swipe").forEach(o=>{const h=o;h.classList.remove("open");const y=h.querySelector(".alarm-row-panel");y&&(y.style.transition="",y.style.transform="")})},S=o=>{o<=-44?($(),b(-88,!0),s.classList.add("open")):(b(0,!0),s.classList.remove("open"))};a==null||a.addEventListener("click",o=>{o.stopPropagation(),t.onDelete(i)});const rt=(o,h)=>{m=s.classList.contains("open")?-88:0,c=o,d=h,p=!0,f=null,r.style.transition="none"},at=(o,h)=>{if(!p)return;const y=o-c,A=h-d;if(f||(Math.abs(y)>I||Math.abs(A)>I)&&(f=Math.abs(y)>Math.abs(A)?"x":"y"),f!=="x")return;let L=m+y;L>0&&(L=0),L<-88&&(L=-88),b(L,!1)},ot=(o,h)=>{if(!p)return;p=!1,u=null;const y=o-c,A=h-d;if(f==="x"){S(m+y),g=!0,window.setTimeout(()=>{g=!1},400);return}if(!(Math.abs(y)>=I||Math.abs(A)>=I)){if(s.classList.contains("open")){S(0);return}t.onTap(i),g=!0,window.setTimeout(()=>{g=!1},400)}};r.addEventListener("pointerdown",o=>{if(o.pointerType==="mouse"&&o.button!==0)return;const h=o.target;h.closest(".alarm-swipe-delete")||h.closest("[data-action='group-toggle']")&&!s.classList.contains("open")||(u=o.pointerId,r.setPointerCapture(o.pointerId),rt(o.clientX,o.clientY))}),r.addEventListener("pointermove",o=>{u===o.pointerId&&(at(o.clientX,o.clientY),f==="x"&&o.preventDefault())}),r.addEventListener("pointerup",o=>{u===o.pointerId&&(r.hasPointerCapture(o.pointerId)&&r.releasePointerCapture(o.pointerId),ot(o.clientX,o.clientY))}),r.addEventListener("pointercancel",o=>{u===o.pointerId&&(p=!1,u=null,S(s.classList.contains("open")?-88:0))}),r.addEventListener("click",o=>{if(g){o.preventDefault();return}if(s.classList.contains("open")){o.preventDefault(),S(0);return}o.target.closest("[data-action='group-toggle']")||t.onTap(i)})}),n.dataset.alarmSwipeDismissBound||(n.dataset.alarmSwipeDismissBound="1",n.addEventListener("click",e=>{e.target.closest(".alarm-swipe")||nt(n)},{capture:!0}))}function nt(n){n.querySelectorAll(".alarm-swipe").forEach(t=>{const e=t;e.classList.remove("open");const s=e.querySelector(".alarm-row-panel");s&&(s.style.transition="",s.style.transform="")})}const Ft=Array.from({length:12},(n,t)=>t+1),Gt=Array.from({length:60},(n,t)=>t),Ut=["AM","PM"],Kt=36;class Yt{constructor(t,e,s){l(this,"root");l(this,"onChange");l(this,"hour12");l(this,"minute");l(this,"period");l(this,"typeInput",null);l(this,"hourCol",null);l(this,"minuteCol",null);l(this,"periodCol",null);l(this,"syncing",!1);this.root=t,this.onChange=s;const i=k(e);this.hour12=i.hour12,this.minute=i.minute,this.period=i.period,this.render(),this.syncWheels(!1)}setTime24(t){const e=k(t);this.hour12=e.hour12,this.minute=e.minute,this.period=e.period,this.syncWheels(!1),this.syncTypeField()}getTime24(){return it(this.hour12,this.minute,this.period)}destroy(){this.root.innerHTML=""}emit(){const t=this.getTime24();this.syncTypeField(),this.onChange(t)}syncTypeField(){this.typeInput&&(this.typeInput.value=H(this.getTime24()))}render(){var t,e,s,i,r,a;this.root.innerHTML=`
      <div class="time-wheel-picker">
        <div class="time-wheel-columns">
          <div class="time-wheel-col" data-wheel="hour" tabindex="0"></div>
          <div class="time-wheel-col" data-wheel="minute" tabindex="0"></div>
          <div class="time-wheel-col time-wheel-col-period" data-wheel="period" tabindex="0"></div>
          <div class="time-wheel-highlight" aria-hidden="true"></div>
        </div>
        <label class="time-wheel-type-label" for="time-wheel-type">Type a time</label>
        <input
          id="time-wheel-type"
          class="time-wheel-type-input"
          type="text"
          inputmode="text"
          autocomplete="off"
          placeholder="6:30 AM"
          value="${H(this.getTime24())}"
        />
      </div>
    `,this.hourCol=this.root.querySelector('[data-wheel="hour"]'),this.minuteCol=this.root.querySelector('[data-wheel="minute"]'),this.periodCol=this.root.querySelector('[data-wheel="period"]'),this.typeInput=this.root.querySelector("#time-wheel-type"),this.hourCol&&this.fillColumn(this.hourCol,Ft.map(String),"hour"),this.minuteCol&&this.fillColumn(this.minuteCol,Gt.map(c=>String(c).padStart(2,"0")),"minute"),this.periodCol&&this.fillColumn(this.periodCol,Ut,"period"),(t=this.hourCol)==null||t.addEventListener("scroll",()=>this.onWheelScroll("hour"),{passive:!0}),(e=this.minuteCol)==null||e.addEventListener("scroll",()=>this.onWheelScroll("minute"),{passive:!0}),(s=this.periodCol)==null||s.addEventListener("scroll",()=>this.onWheelScroll("period"),{passive:!0}),(i=this.typeInput)==null||i.addEventListener("change",()=>this.onTypeCommit()),(r=this.typeInput)==null||r.addEventListener("blur",()=>this.onTypeCommit()),(a=this.typeInput)==null||a.addEventListener("keydown",c=>{c.key==="Enter"&&(c.preventDefault(),this.onTypeCommit(),c.target.blur())})}fillColumn(t,e,s){t.innerHTML=`<div class="time-wheel-spacer"></div>${e.map(i=>`<div class="time-wheel-item" data-kind="${s}" data-value="${i}">${i}</div>`).join("")}<div class="time-wheel-spacer"></div>`}scrollToValue(t,e,s){const i=t.querySelector(`[data-value="${e}"]`);if(!i)return;const r=i.offsetTop-t.clientHeight/2+Kt/2;t.scrollTo({top:r,behavior:s?"smooth":"auto"})}readWheel(t){const e=t.scrollTop+t.clientHeight/2,s=t.querySelectorAll(".time-wheel-item");let i=null,r=1/0;for(let a=0;a<s.length;a++){const c=s[a],d=c.offsetTop+c.offsetHeight/2,m=Math.abs(d-e);m<r&&(r=m,i=c)}return i?i.getAttribute("data-value")??"":""}onWheelScroll(t){if(this.syncing)return;const e=t==="hour"?this.hourCol:t==="minute"?this.minuteCol:this.periodCol;if(e){if(t==="hour"){const s=Number(this.readWheel(e));s>=1&&s<=12&&(this.hour12=s)}else if(t==="minute"){const s=Number(this.readWheel(e));s>=0&&s<=59&&(this.minute=s)}else{const s=this.readWheel(e);(s==="AM"||s==="PM")&&(this.period=s)}this.emit()}}onTypeCommit(){if(!this.typeInput)return;const t=Rt(this.typeInput.value);if(!t){this.syncTypeField();return}const e=k(t);this.hour12=e.hour12,this.minute=e.minute,this.period=e.period,this.syncWheels(!0),this.emit()}syncWheels(t){this.syncing=!0,this.hourCol&&this.scrollToValue(this.hourCol,String(this.hour12),t),this.minuteCol&&this.scrollToValue(this.minuteCol,String(this.minute).padStart(2,"0"),t),this.periodCol&&this.scrollToValue(this.periodCol,this.period,t),window.setTimeout(()=>{this.syncing=!1},t?200:0)}}class Xt{constructor(t){l(this,"root");l(this,"screen","connect");l(this,"transport",null);l(this,"schedule",ut()??G());l(this,"status",{});l(this,"message","");l(this,"messageKind","");l(this,"busy",!1);l(this,"scheduleLoading",!1);l(this,"statusLoading",!1);l(this,"syncGeneration",0);l(this,"editingGroupId",null);l(this,"editDraft",null);l(this,"timePicker",null);l(this,"lampTestLevel",x);l(this,"lampTestSeconds",Z);l(this,"lampTestRemaining",0);l(this,"lampTestInterval",null);l(this,"lampTestExpanded",!1);this.root=t,this.render()}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const s=e instanceof Error?e.message:String(e);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const t=new Et;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),await t.connect(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)}catch(t){if(Pt(t))this.message="",this.messageKind="";else{const e=t instanceof Error?t.message:String(t);this.setMessage(e,"error")}}finally{this.busy=!1,this.render()}}async loadDeviceData(t,e){try{if(await Ct(t),e!==this.syncGeneration)return;const s=await P(t);if(e!==this.syncGeneration)return;const i=await W(t);if(e!==this.syncGeneration)return;this.schedule=O(s),T(this.schedule),this.status=i,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(e!==this.syncGeneration)return;const i=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${i}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await qt(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const t=v(this.lampTestLevel),e=K(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,this.lampTestExpanded=!0,await this.withBusy(async()=>{await Ot(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const i=this.root.querySelector("#lamp-test-countdown"),r=this.root.querySelector(".lamp-test-toggle-hint");i&&(i.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),r&&(r.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}syncLampTestSlider(t){const e=v(t);this.lampTestLevel=e;const s=this.root.querySelector("#lamp-test-level"),i=this.root.querySelector("#lamp-test-level-num");s&&(s.value=String(e)),i&&(i.value=String(e));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}onLampTestNumberInput(t){const e=C(t.value);if(e===null)return;const s=v(e);this.lampTestLevel=s;const i=this.root.querySelector("#lamp-test-level");i&&(i.value=String(s));const r=this.root.querySelector("#btn-lamp-test");r&&(r.textContent=`Try for ${this.lampTestSeconds}s`)}commitLampTestNumber(t){const e=C(t.value);if(e===null){t.value=String(this.lampTestLevel);return}this.syncLampTestSlider(v(e))}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}commitAlarmEditForm(){var i,r;if(!this.editDraft)return!1;if(this.editDraft.days.length===0)return this.setMessage("Select at least one day for this alarm.","error"),!1;const t=this.root.querySelector("#edit-pwm-num");t&&this.commitEditBrightnessNumber(t);const e=Number(((i=this.root.querySelector("#edit-pre"))==null?void 0:i.value)??20),s=Number(((r=this.root.querySelector("#edit-hold"))==null?void 0:r.value)??20);return this.editDraft.slot.prewindowMin=e,this.editDraft.slot.postHoldMin=s,this.editDraft.slot.enabled=!0,this.schedule=bt(this.schedule,this.editDraft.previousDays,this.editDraft.days,this.editDraft.slot),T(this.schedule),!0}closeAlarmEdit(t){var e;t&&!this.commitAlarmEditForm()||(this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen==="alarm-edit"&&(this.screen="editor",this.message="",this.messageKind="",this.render()))}openAlarmEdit(t){const e=E(this.schedule).find(s=>s.id===t);e&&(this.editingGroupId=t,this.editDraft={previousDays:[...e.days],days:[...e.days],slot:{...e.slot}},this.screen="alarm-edit",this.render())}toggleGroupEnabled(t,e){e.stopPropagation(),this.schedule=vt(this.schedule,t,!t.slot.enabled),T(this.schedule),this.render()}addAlarm(){const{schedule:t,groupId:e}=wt(this.schedule);this.schedule=t,T(this.schedule),this.openAlarmEdit(e)}deleteEditingAlarm(){var e;if(!this.editingGroupId)return;const t=E(this.schedule).find(s=>s.id===this.editingGroupId);t&&(this.schedule=j(this.schedule,t),T(this.schedule)),this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render()}toggleEditDay(t){if(!this.editDraft)return;const e=new Set(this.editDraft.days);if(e.has(t)){if(e.size<=1)return;e.delete(t)}else e.add(t);this.editDraft.days=Y.filter(s=>e.has(s)),this.render()}setEditBrightnessFromSlider(t){if(!this.editDraft)return;const e=v(t);this.editDraft.slot.pwmMax=e;const s=this.root.querySelector("#edit-pwm-range"),i=this.root.querySelector("#edit-pwm-num");s&&(s.value=String(e)),i&&(i.value=String(e))}onEditBrightnessNumberInput(t){if(!this.editDraft)return;const e=C(t.value);if(e===null)return;const s=v(e);this.editDraft.slot.pwmMax=s;const i=this.root.querySelector("#edit-pwm-range");i&&(i.value=String(s))}commitEditBrightnessNumber(t){if(!this.editDraft)return;const e=C(t.value);if(e===null){t.value=String(this.editDraft.slot.pwmMax);return}const s=v(e);this.editDraft.slot.pwmMax=s;const i=this.root.querySelector("#edit-pwm-range");i&&(i.value=String(s)),t.value=String(s)}async saveAlarmEditToDevice(){var t;this.commitAlarmEditForm()&&(this.editingGroupId=null,this.editDraft=null,(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen="editor",this.render(),await this.saveToDevice())}deleteAlarmById(t){const e=E(this.schedule).find(s=>s.id===t);e&&(this.schedule=j(this.schedule,e),T(this.schedule),this.setMessage("Alarm deleted.","ok"),this.render())}async saveToDevice(){if(!this.transport)return;if(!w.some(e=>this.schedule[e].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await It(this.transport,this.schedule);const e=await P(this.transport),s=O(e);if(!ht(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await W(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const t=await P(this.transport);this.schedule=O(t),T(this.schedule),this.status=await W(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const t=Wt(),e=Nt(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
      </div>`:""}

      ${!t&&!U()?`<div class="card warn">
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
            <div class="alarm-time">${H(e.time)}</div>
            <div class="alarm-subtitle">${gt(s)}</div>
            <div class="alarm-subtitle alarm-subtitle-detail">${yt(e)}</div>
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
              min="${M}"
              max="${D}"
              value="${this.lampTestLevel}"
              ${t||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              min="${M}"
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
                min="${J}"
                max="${Q}"
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
    `}renderEditor(){var s,i;const t=this.scheduleLoading,e=E(this.schedule);return`
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

      <div class="save-bar">
        <div class="inner">
          <button class="btn btn-secondary" id="btn-disconnect" ${this.busy?"disabled":""}>Disconnect</button>
          <button class="btn btn-primary" id="btn-save" ${this.busy||this.scheduleLoading?"disabled":""}>Save to mask</button>
        </div>
      </div>

      <button class="btn btn-secondary" id="btn-refresh" ${this.busy||this.scheduleLoading?"disabled":""}>Reload from mask</button>
      ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
    `}renderAlarmEdit(){if(!this.editDraft)return"";const{slot:t,days:e}=this.editDraft,s=new Set(e);return`
      <div class="alarm-edit-sheet">
        <div class="alarm-edit-nav">
          <button type="button" class="alarm-edit-nav-btn" id="btn-edit-cancel">Cancel</button>
          <span class="alarm-edit-title">Edit Alarm</span>
          <button type="button" class="alarm-edit-nav-btn alarm-edit-done" id="btn-edit-done">Done</button>
        </div>

        <div id="time-wheel-mount"></div>

        <div class="alarm-edit-section">
          <div class="alarm-edit-section-label">Repeat</div>
          <div class="repeat-row">
            ${Y.map(i=>`
              <button
                type="button"
                class="repeat-chip ${s.has(i)?"on":""}"
                data-repeat-day="${i}"
              >${dt[i]}</button>`).join("")}
          </div>
        </div>

        <div class="alarm-edit-section">
          <label>Brightness</label>
          <div class="brightness-controls">
            <input
              type="range"
              id="edit-pwm-range"
              min="${M}"
              max="${D}"
              value="${t.pwmMax}"
            />
            <input
              type="number"
              id="edit-pwm-num"
              min="${M}"
              max="${D}"
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

        <div class="alarm-edit-actions">
          <button
            type="button"
            class="btn btn-primary"
            id="btn-edit-save"
            ${this.busy||this.scheduleLoading?"disabled":""}
          >Save to mask</button>
        </div>

        ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
      </div>
    `}render(){var t;(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen==="connect"?this.root.innerHTML=this.renderConnect():this.screen==="alarm-edit"?this.root.innerHTML=this.renderAlarmEdit():this.root.innerHTML=this.renderEditor(),nt(this.root),this.bindEvents()}bindEvents(){if(this.screen==="connect"){this.bindConnectEvents();return}if(this.screen==="alarm-edit"){this.bindAlarmEditEvents();return}this.bindEditorEvents()}bindConnectEvents(){var t;(t=this.root.querySelector("#btn-connect"))==null||t.addEventListener("click",()=>void this.connectBle())}bindEditorEvents(){var s,i,r,a,c,d,m,p,f;(s=this.root.querySelector("#btn-disconnect"))==null||s.addEventListener("click",()=>void this.disconnect()),(i=this.root.querySelector("#btn-save"))==null||i.addEventListener("click",()=>void this.saveToDevice()),(r=this.root.querySelector("#btn-refresh"))==null||r.addEventListener("click",()=>void this.refreshFromDevice()),(a=this.root.querySelector("#btn-add-alarm"))==null||a.addEventListener("click",()=>this.addAlarm());const t=E(this.schedule);Ht(this.root,{onDelete:u=>this.deleteAlarmById(u),onTap:u=>this.openAlarmEdit(u)}),this.root.querySelectorAll("[data-action='group-toggle']").forEach(u=>{u.addEventListener("click",g=>{const b=u.dataset.alarmId,$=t.find(S=>S.id===b);$&&this.toggleGroupEnabled($,g)})}),(c=this.root.querySelector("#btn-lamp-test-toggle"))==null||c.addEventListener("click",()=>{this.toggleLampTestPanel()}),(d=this.root.querySelector("#lamp-test-level"))==null||d.addEventListener("input",u=>{this.syncLampTestSlider(Number(u.target.value))});const e=this.root.querySelector("#lamp-test-level-num");e==null||e.addEventListener("input",()=>this.onLampTestNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitLampTestNumber(e)),e==null||e.addEventListener("blur",()=>this.commitLampTestNumber(e)),(m=this.root.querySelector("#lamp-test-seconds"))==null||m.addEventListener("change",u=>{const g=u.target;this.lampTestSeconds=K(Number(g.value)),g.value=String(this.lampTestSeconds);const b=this.root.querySelector("#btn-lamp-test");b&&(b.textContent=`Try for ${this.lampTestSeconds}s`)}),(p=this.root.querySelector("#btn-lamp-test"))==null||p.addEventListener("click",()=>void this.tryLampBrightness()),(f=this.root.querySelector("#btn-lamp-cancel"))==null||f.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")})}bindAlarmEditEvents(){var s,i,r,a,c;if(!this.editDraft)return;const t=this.root.querySelector("#time-wheel-mount");t&&(this.timePicker=new Yt(t,this.editDraft.slot.time,d=>{this.editDraft&&(this.editDraft.slot.time=d)})),(s=this.root.querySelector("#btn-edit-cancel"))==null||s.addEventListener("click",()=>this.closeAlarmEdit(!1)),(i=this.root.querySelector("#btn-edit-done"))==null||i.addEventListener("click",()=>this.closeAlarmEdit(!0)),(r=this.root.querySelector("#btn-edit-save"))==null||r.addEventListener("click",()=>void this.saveAlarmEditToDevice()),(a=this.root.querySelector("#btn-delete-alarm"))==null||a.addEventListener("click",()=>{window.confirm("Delete this alarm?")&&this.deleteEditingAlarm()}),this.root.querySelectorAll("[data-repeat-day]").forEach(d=>{d.addEventListener("click",()=>{const m=d.dataset.repeatDay;this.toggleEditDay(m)})}),(c=this.root.querySelector("#edit-pwm-range"))==null||c.addEventListener("input",d=>{this.setEditBrightnessFromSlider(Number(d.target.value))});const e=this.root.querySelector("#edit-pwm-num");e==null||e.addEventListener("input",()=>this.onEditBrightnessNumberInput(e)),e==null||e.addEventListener("change",()=>this.commitEditBrightnessNumber(e)),e==null||e.addEventListener("blur",()=>this.commitEditBrightnessNumber(e))}}const z=document.getElementById("app");z&&new Xt(z);
