var q=Object.defineProperty;var R=(n,e,t)=>e in n?q(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var c=(n,e,t)=>R(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const w="6e400001-b5a3-f393-e0a9-e50e24dcca9e",N="6e400002-b5a3-f393-e0a9-e50e24dcca9e",P="6e400003-b5a3-f393-e0a9-e50e24dcca9e",S=200,E=3e3;class I{constructor(){c(this,"device",null);c(this,"server",null);c(this,"rxChar",null);c(this,"buffer","");c(this,"queue",[]);c(this,"notifyWaiters",[]);c(this,"_connected",!1)}get connected(){return this._connected}drainQueue(){const e=[...this.queue];return this.queue=[],e}async connect(){var i;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[w]}],optionalServices:[w]}),this.device.addEventListener("gattserverdisconnected",()=>{this._connected=!1});const e=await((i=this.device.gatt)==null?void 0:i.connect());if(!e)throw new Error("GATT connect failed");this.server=e;const t=await this.server.getPrimaryService(w);this.rxChar=await t.getCharacteristic(N);const s=await t.getCharacteristic(P);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",a=>{const r=a.target.value;if(!r)return;const f=new TextDecoder().decode(r);for(this.buffer+=f;this.buffer.includes(`
`);){const m=this.buffer.indexOf(`
`),p=this.buffer.slice(0,m).trim();if(this.buffer=this.buffer.slice(m+1),!p)continue;const y=this.notifyWaiters.shift();y?y(p):this.queue.push(p)}}),this._connected=!0}async writeLine(e){if(!this.rxChar)throw new Error("Not connected");const t=new TextEncoder().encode(e+`
`);await this.rxChar.writeValueWithoutResponse(t)}async waitForLine(e){return this.queue.length?this.queue.shift():new Promise(t=>{const s=window.setTimeout(()=>{const a=this.notifyWaiters.indexOf(i);a>=0&&this.notifyWaiters.splice(a,1),t(null)},e),i=a=>{clearTimeout(s),t(a)};this.notifyWaiters.push(i)})}async send(e){return e?(await this.writeLine(e),this.collectLines(S,E)):this.collectLines(S,E)}async sendAndCollect(e,t=S,s=E,i){return e&&await this.writeLine(e),this.collectLines(t,s,i)}async collectLines(e,t,s){const i=[],a=Date.now()+t;for(;Date.now()<a;){const l=a-Date.now(),r=await this.waitForLine(Math.min(e,l));if(r===null){if(i.length)return i;continue}if(i.push(r),s!=null&&s(r,i))return i}return i}disconnect(){var e;(e=this.server)==null||e.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[]}}const W=250,F=8e3,U=5e3,G=200;function B(n){const e=`OK ${n}`;return t=>t===e||t.startsWith(`${e} `)}function K(){const n=new Date(new Date().getFullYear(),0,1),e=new Date(new Date().getFullYear(),6,1),t=n.getTimezoneOffset(),s=e.getTimezoneOffset(),i=-t*60,l=t!==s?-Math.min(t,s)*60:0;return`TZ_OFFSET ${i} ${l}`}function Y(){const n=new Date,e=t=>String(t).padStart(2,"0");return`TIME ${n.getFullYear()}-${e(n.getMonth()+1)}-${e(n.getDate())} ${e(n.getHours())}:${e(n.getMinutes())}`}function g(n){return n==="REQ_TIME"||n.startsWith("REQ_TIME ")}async function z(n){let e=n.drainQueue().some(g);if((await n.send(K())).some(g)&&(e=!0),!e){const s=Date.now()+2e3;for(;Date.now()<s;){const i=Math.max(100,Math.min(G,s-Date.now())),a=await n.sendAndCollect("",i,Math.min(600,s-Date.now()),l=>g(l));if(a.some(g)){e=!0;break}if(!a.length)break}}await n.send(Y())}async function L(n){const e=await n.sendAndCollect("SCHED_GET",W,F,B("SCHED_GET"));if(!e.some(t=>t.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return e}async function j(n,e){const t=Object.keys(e);for(const i of t){const a=e[i];let l;a.enabled?l=`SCHED_DAY ${i} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin}`:l=`SCHED_DAY ${i} OFF`;const r=await n.send(l);if(!r.some(f=>f.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${i}: ${r.join(" ")}`)}if(!(await n.send("SAVE")).some(i=>i.includes("SAVE ok")))throw new Error("SAVE failed")}function V(n){const e={};for(const t of n)t.startsWith("RTC: ")&&(e.rtc=t.slice(5)),t.startsWith("TODAY: ")&&(e.today=t.slice(7).trim()),t.startsWith("TODAY_ALARM: ")&&(e.todayAlarm=t.slice(13)),t.startsWith("ALARM(daily): ")&&(e.alarmDaily=t.slice(14)),t.startsWith("ALARM_AT: ")&&(e.alarmAt=t.slice(10)),t.startsWith("NEXT_RAMP: ")&&(e.nextRamp=t.slice(11)),t.startsWith("WAKE_CAUSE: ")&&(e.wakeCause=t.slice(12)),t.startsWith("BOOT_PATH: ")&&(e.bootPath=t.slice(11)),t.startsWith("NVM_OK: ")&&(e.nvmOk=t.includes("yes")),t.startsWith("POWER: ")&&(e.power=t.slice(7)),t.startsWith("PHASE: ")&&(e.phase=t.slice(7)),t.startsWith("TIME_SYNC_AUTO: ")&&(e.timeSync=t.slice(16)),t.startsWith("TIME_TRUSTED: ")&&(e.timeTrusted=t.includes("yes")),t.startsWith("PRE(min): ")&&(e.preMin=t.slice(10)),t.startsWith("POST_HOLD(min): ")&&(e.postHoldMin=t.slice(16));return e}async function k(n){const e=await n.sendAndCollect("STATUS_LITE",W,U,B("STATUS_LITE"));if(e.some(t=>t.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!e.some(t=>t.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return V(e)}function X(){return typeof navigator<"u"&&!!navigator.bluetooth}function J(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function Q(){if(!J())return!1;const n=navigator.userAgent;return/Safari/i.test(n)&&!/CriOS|FxiOS|EdgiOS/i.test(n)}const h=["mon","tue","wed","thu","fri","sat","sun"],H="sml-draft-schedule-v2";function Z(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:255,postHoldMin:20}}function $(){return Object.fromEntries(h.map(n=>[n,Z()]))}function ee(){try{const n=localStorage.getItem(H);if(n){const t=JSON.parse(n);return x(t)}const e=localStorage.getItem("sml-draft-schedule-v1");if(e){const t=JSON.parse(e);return x(t)}return null}catch{return null}}function x(n){const e=$();for(const t of h){const s=n[t];s&&(e[t]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:s.pwmMax??255,postHoldMin:s.postHoldMin??20})}return e}function u(n){localStorage.setItem(H,JSON.stringify(n))}function M(n){const e=$();for(const t of n){const s=t.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/i);if(!s)continue;const i=s[1].toLowerCase();e[i]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:Number(s[4]),pwmMax:Number(s[5]),postHoldMin:s[6]?Number(s[6]):20}}return e}function te(n,e){return h.every(t=>JSON.stringify(n[t])===JSON.stringify(e[t]))}class se{constructor(e){c(this,"root");c(this,"screen","connect");c(this,"transport",null);c(this,"schedule",ee()??$());c(this,"selected",new Set);c(this,"status",{});c(this,"message","");c(this,"messageKind","");c(this,"busy",!1);c(this,"scheduleLoading",!1);c(this,"statusLoading",!1);c(this,"syncGeneration",0);this.root=e,this.render()}setMessage(e,t=""){this.message=e,this.messageKind=t,this.render()}async withBusy(e){this.busy=!0,this.render();try{await e()}catch(t){const s=t instanceof Error?t.message:String(t);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){await this.withBusy(async()=>{const e=new I;await e.connect(),this.transport=e,this.screen="editor",this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(e,++this.syncGeneration)})}async loadDeviceData(e,t){try{if(await z(e),t!==this.syncGeneration)return;const[s,i]=await Promise.all([L(e),k(e)]);if(t!==this.syncGeneration)return;this.schedule=M(s),u(this.schedule),this.status=i,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(t!==this.syncGeneration)return;const i=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${i}`,"error")}finally{t===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}disconnect(){var e;this.syncGeneration++,(e=this.transport)==null||e.disconnect(),this.transport=null,this.screen="connect",this.selected.clear(),this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}toggleDay(e){this.schedule[e].enabled=!this.schedule[e].enabled,u(this.schedule),this.render()}patchDay(e,t){Object.assign(this.schedule[e],t),u(this.schedule)}toggleSelect(e){this.selected.has(e)?this.selected.delete(e):this.selected.add(e),this.render()}applyBulk(e,t,s,i,a){const l=this.selected.size?[...this.selected]:h;for(const r of l)e==="time"&&t&&(this.schedule[r].time=t,this.schedule[r].enabled=!0),(e==="brightness"||e==="all")&&s!==void 0&&i!==void 0&&(this.schedule[r].prewindowMin=s,this.schedule[r].pwmMax=i,a!==void 0&&(this.schedule[r].postHoldMin=a)),e==="all"&&t&&(this.schedule[r].time=t,this.schedule[r].enabled=!0);u(this.schedule),this.render()}async saveToDevice(){if(!this.transport)return;if(!h.some(t=>this.schedule[t].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await j(this.transport,this.schedule);const t=await L(this.transport),s=M(t);if(!te(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await k(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const e=await L(this.transport);this.schedule=M(e),u(this.schedule),this.status=await k(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const e=X(),t=Q(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari and Chrome on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
      </div>`:""}

      ${e?`<button class="btn btn-primary" id="btn-connect" ${this.busy?"disabled":""}>
        Connect via Bluetooth
      </button>`:`<div class="card warn">
        <h2>Browser not supported</h2>
        <p>Use <strong>Chrome</strong> or <strong>Edge</strong> on Android or desktop. Firefox and iPhone Safari cannot connect via Bluetooth.</p>
      </div>`}

      <div class="card">
        <h2>Before you connect</h2>
        <ul>
          <li>Power on the mask and stay within a few metres.</li>
          <li>Look for a device named <strong>SleepMask-XXXX</strong>.</li>
          <li>Grant Bluetooth permission when prompted.</li>
        </ul>
        <details>
          <summary>Troubleshooting</summary>
          <p>If the mask does not appear, wake it by plugging in USB briefly or holding the snooze button while connecting.</p>
        </details>
      </div>

      <p class="message">Home use only — BLE has no pairing password in v1.</p>
      ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
    `}renderDayRow(e){const t=this.schedule[e],s=e.toUpperCase(),i=this.selected.has(e);return`
      <div class="day-row ${t.enabled?"":"disabled"} ${i?"selected":""}" data-day="${e}">
        <div class="day-head">
          <span class="day-label">${s}</span>
          <div class="toggle ${t.enabled?"on":""}" data-action="toggle" data-day="${e}" role="switch" aria-checked="${t.enabled}"></div>
          <button type="button" class="btn-secondary" style="width:auto;padding:0.2rem 0.45rem;font-size:0.7rem;margin:0" data-action="select" data-day="${e}">
            ${i?"✓":"○"}
          </button>
        </div>
        <div class="day-fields">
          <div>
            <label>Wake time</label>
            <input type="time" value="${t.time}" data-field="time" data-day="${e}" ${t.enabled?"":"disabled"} />
          </div>
          <div class="field-row">
            <div>
              <label>Brightness (${t.pwmMax})</label>
              <input type="range" min="1" max="255" value="${t.pwmMax}" data-field="pwmMax" data-day="${e}" ${t.enabled?"":"disabled"} />
            </div>
            <div>
              <label>Ramp before (min)</label>
              <input type="number" min="1" max="240" value="${t.prewindowMin}" data-field="prewindowMin" data-day="${e}" ${t.enabled?"":"disabled"} />
            </div>
            <div>
              <label>Hold after (min)</label>
              <input type="number" min="1" max="240" value="${t.postHoldMin}" data-field="postHoldMin" data-day="${e}" ${t.enabled?"":"disabled"} />
            </div>
          </div>
        </div>
      </div>
    `}renderEditor(){var i;const e=this.scheduleLoading,t=this.selected.size,s=t>0;return`
      <h1>Week schedule</h1>
      <p class="subtitle">${(i=this.transport)!=null&&i.connected?"Connected":"Disconnected"} · tap ○ to select days for bulk edit</p>

      ${e?`<div class="card sync-banner">
        <span class="spinner" aria-hidden="true"></span>
        Syncing schedule from mask…
      </div>`:""}

      <div class="card status-bar ${this.statusLoading?"loading":""}">
        ${this.statusLoading?'<div class="muted">Loading device status…</div>':`
        ${this.status.rtc?`<div>Clock: <strong>${this.status.rtc}</strong></div>`:""}
        ${this.status.nextRamp?`<div>Next ramp: <strong>${this.status.nextRamp}</strong></div>`:""}
        ${this.status.power?`<div>Power: <strong>${this.status.power}</strong>${this.status.power==="battery"?" (max brightness capped at 50 on device)":""}</div>`:""}
        ${this.status.preMin?`<div>Ramp: <strong>${this.status.preMin} min</strong></div>`:""}
        ${this.status.postHoldMin?`<div>Hold after alarm: <strong>${this.status.postHoldMin} min</strong></div>`:""}
        ${this.status.nvmOk!==void 0?`<div>Saved: <strong>${this.status.nvmOk?"yes":"no"}</strong></div>`:""}
        `}
      </div>

      <div class="card ${e?"loading":""}">
        <h2>Alarms</h2>
        ${h.map(a=>this.renderDayRow(a)).join("")}
        <div class="preset-row">
          <button type="button" data-preset="weekdays">Weekdays 6:30</button>
          <button type="button" data-preset="weekend">Weekend 8:00</button>
          <button type="button" data-preset="copy-mon">Copy Mon → all</button>
        </div>
      </div>

      ${s?`<div class="bulk-panel">
        <div class="card">
          <h2>Apply to ${t} day${t>1?"s":""}</h2>
          <div class="field-row">
            <div><label>Time</label><input type="time" id="bulk-time" value="07:00" /></div>
            <div><label>Ramp</label><input type="number" id="bulk-pre" min="1" max="240" value="20" /></div>
            <div><label>Hold</label><input type="number" id="bulk-hold" min="1" max="240" value="20" /></div>
          </div>
          <label>Brightness</label>
          <input type="range" id="bulk-max" min="1" max="255" value="200" />
          <div class="bulk-actions">
            <button class="btn btn-secondary" type="button" id="bulk-time-only">Time only</button>
            <button class="btn btn-secondary" type="button" id="bulk-bright-only">Bright+ramp+hold</button>
            <button class="btn btn-secondary" type="button" id="bulk-all">All</button>
          </div>
        </div>
      </div>`:""}

      <div class="save-bar">
        <div class="inner">
          <button class="btn btn-secondary" id="btn-disconnect" ${this.busy?"disabled":""}>Disconnect</button>
          <button class="btn btn-primary" id="btn-save" ${this.busy||this.scheduleLoading?"disabled":""}>Save to mask</button>
        </div>
      </div>

      <button class="btn btn-secondary" id="btn-refresh" ${this.busy||this.scheduleLoading?"disabled":""}>Reload from mask</button>
      ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
    `}render(){this.root.innerHTML=this.screen==="connect"?this.renderConnect():this.renderEditor(),this.bindEvents()}bindEvents(){var a,l,r,f,m,p,y,T,D,A;(a=this.root.querySelector("#btn-connect"))==null||a.addEventListener("click",()=>void this.connectBle()),(l=this.root.querySelector("#btn-disconnect"))==null||l.addEventListener("click",()=>this.disconnect()),(r=this.root.querySelector("#btn-save"))==null||r.addEventListener("click",()=>void this.saveToDevice()),(f=this.root.querySelector("#btn-refresh"))==null||f.addEventListener("click",()=>void this.refreshFromDevice()),this.root.querySelectorAll("[data-action='toggle']").forEach(o=>{o.addEventListener("click",()=>{const d=o.dataset.day;this.toggleDay(d)})}),this.root.querySelectorAll("[data-action='select']").forEach(o=>{o.addEventListener("click",d=>{d.stopPropagation();const v=o.dataset.day;this.toggleSelect(v)})}),this.root.querySelectorAll("[data-field]").forEach(o=>{const d=o,v=d.dataset.day,b=d.dataset.field;if(b==="enabled")return;const _=()=>{b==="prewindowMin"||b==="pwmMax"||b==="postHoldMin"?this.patchDay(v,{[b]:Number(d.value)}):this.patchDay(v,{[b]:d.value})};if(d.type==="range"){d.addEventListener("input",()=>{this.patchDay(v,{pwmMax:Number(d.value)});const O=d.previousElementSibling;O&&(O.textContent=`Brightness (${d.value})`)});return}d.addEventListener("change",_),d.addEventListener("blur",_)}),(m=this.root.querySelector('[data-preset="weekdays"]'))==null||m.addEventListener("click",()=>{for(const o of["mon","tue","wed","thu","fri"])this.schedule[o].enabled=!0,this.schedule[o].time="06:30";u(this.schedule),this.render()}),(p=this.root.querySelector('[data-preset="weekend"]'))==null||p.addEventListener("click",()=>{for(const o of["sat","sun"])this.schedule[o].enabled=!0,this.schedule[o].time="08:00";u(this.schedule),this.render()}),(y=this.root.querySelector('[data-preset="copy-mon"]'))==null||y.addEventListener("click",()=>{const o={...this.schedule.mon};for(const d of h)this.schedule[d]={...o};u(this.schedule),this.render()});const e=()=>{var o;return((o=this.root.querySelector("#bulk-time"))==null?void 0:o.value)??"07:00"},t=()=>{var o;return Number(((o=this.root.querySelector("#bulk-pre"))==null?void 0:o.value)??20)},s=()=>{var o;return Number(((o=this.root.querySelector("#bulk-hold"))==null?void 0:o.value)??20)},i=()=>{var o;return Number(((o=this.root.querySelector("#bulk-max"))==null?void 0:o.value)??200)};(T=this.root.querySelector("#bulk-time-only"))==null||T.addEventListener("click",()=>{this.applyBulk("time",e())}),(D=this.root.querySelector("#bulk-bright-only"))==null||D.addEventListener("click",()=>{this.applyBulk("brightness",void 0,t(),i(),s())}),(A=this.root.querySelector("#bulk-all"))==null||A.addEventListener("click",()=>{this.applyBulk("all",e(),t(),i(),s())})}}const C=document.getElementById("app");C&&new se(C);
