var B=Object.defineProperty;var H=(n,e,t)=>e in n?B(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var c=(n,e,t)=>H(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const w="6e400001-b5a3-f393-e0a9-e50e24dcca9e",q="6e400002-b5a3-f393-e0a9-e50e24dcca9e",R="6e400003-b5a3-f393-e0a9-e50e24dcca9e",S=200,E=3e3;class N{constructor(){c(this,"device",null);c(this,"server",null);c(this,"rxChar",null);c(this,"buffer","");c(this,"queue",[]);c(this,"notifyWaiters",[]);c(this,"_connected",!1)}get connected(){return this._connected}drainQueue(){const e=[...this.queue];return this.queue=[],e}async connect(){var i;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[w]}],optionalServices:[w]}),this.device.addEventListener("gattserverdisconnected",()=>{this._connected=!1});const e=await((i=this.device.gatt)==null?void 0:i.connect());if(!e)throw new Error("GATT connect failed");this.server=e;const t=await this.server.getPrimaryService(w);this.rxChar=await t.getCharacteristic(q);const s=await t.getCharacteristic(R);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",a=>{const r=a.target.value;if(!r)return;const p=new TextDecoder().decode(r);for(this.buffer+=p;this.buffer.includes(`
`);){const y=this.buffer.indexOf(`
`),b=this.buffer.slice(0,y).trim();if(this.buffer=this.buffer.slice(y+1),!b)continue;const v=this.notifyWaiters.shift();v?v(b):this.queue.push(b)}}),this._connected=!0}async writeLine(e){if(!this.rxChar)throw new Error("Not connected");const t=new TextEncoder().encode(e+`
`);await this.rxChar.writeValueWithoutResponse(t)}async waitForLine(e){return this.queue.length?this.queue.shift():new Promise(t=>{const s=window.setTimeout(()=>{const a=this.notifyWaiters.indexOf(i);a>=0&&this.notifyWaiters.splice(a,1),t(null)},e),i=a=>{clearTimeout(s),t(a)};this.notifyWaiters.push(i)})}async send(e){return e?(await this.writeLine(e),this.collectLines(S,E)):this.collectLines(S,E)}async sendAndCollect(e,t=S,s=E,i){return e&&await this.writeLine(e),this.collectLines(t,s,i)}async collectLines(e,t,s){const i=[],a=Date.now()+t;for(;Date.now()<a;){const d=a-Date.now(),r=await this.waitForLine(Math.min(e,d));if(r===null){if(i.length)return i;continue}if(i.push(r),s!=null&&s(r,i))return i}return i}disconnect(){var e;(e=this.server)==null||e.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[]}}const x=250,P=8e3,I=5e3,F=200;function C(n){const e=`OK ${n}`;return t=>t===e||t.startsWith(`${e} `)}function U(){const n=new Date(new Date().getFullYear(),0,1),e=new Date(new Date().getFullYear(),6,1),t=n.getTimezoneOffset(),s=e.getTimezoneOffset(),i=-t*60,d=t!==s?-Math.min(t,s)*60:0;return`TZ_OFFSET ${i} ${d}`}function G(){const n=new Date,e=t=>String(t).padStart(2,"0");return`TIME ${n.getFullYear()}-${e(n.getMonth()+1)}-${e(n.getDate())} ${e(n.getHours())}:${e(n.getMinutes())}`}function g(n){return n==="REQ_TIME"||n.startsWith("REQ_TIME ")}async function K(n){let e=n.drainQueue().some(g);if((await n.send(U())).some(g)&&(e=!0),!e){const s=Date.now()+2e3;for(;Date.now()<s;){const i=Math.max(100,Math.min(F,s-Date.now())),a=await n.sendAndCollect("",i,Math.min(600,s-Date.now()),d=>g(d));if(a.some(g)){e=!0;break}if(!a.length)break}}await n.send(G())}async function L(n){const e=await n.sendAndCollect("SCHED_GET",x,P,C("SCHED_GET"));if(!e.some(t=>t.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return e}async function Y(n,e){const t=Object.keys(e);for(const i of t){const a=e[i];let d;a.enabled?d=`SCHED_DAY ${i} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin}`:d=`SCHED_DAY ${i} OFF`;const r=await n.send(d);if(!r.some(p=>p.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${i}: ${r.join(" ")}`)}if(!(await n.send("SAVE")).some(i=>i.includes("SAVE ok")))throw new Error("SAVE failed")}function z(n){const e={};for(const t of n)t.startsWith("RTC: ")&&(e.rtc=t.slice(5)),t.startsWith("TODAY: ")&&(e.today=t.slice(7).trim()),t.startsWith("TODAY_ALARM: ")&&(e.todayAlarm=t.slice(13)),t.startsWith("ALARM(daily): ")&&(e.alarmDaily=t.slice(14)),t.startsWith("ALARM_AT: ")&&(e.alarmAt=t.slice(10)),t.startsWith("NEXT_RAMP: ")&&(e.nextRamp=t.slice(11)),t.startsWith("WAKE_CAUSE: ")&&(e.wakeCause=t.slice(12)),t.startsWith("BOOT_PATH: ")&&(e.bootPath=t.slice(11)),t.startsWith("NVM_OK: ")&&(e.nvmOk=t.includes("yes")),t.startsWith("POWER: ")&&(e.power=t.slice(7)),t.startsWith("PHASE: ")&&(e.phase=t.slice(7)),t.startsWith("TIME_SYNC_AUTO: ")&&(e.timeSync=t.slice(16)),t.startsWith("TIME_TRUSTED: ")&&(e.timeTrusted=t.includes("yes")),t.startsWith("PRE(min): ")&&(e.preMin=t.slice(10)),t.startsWith("POST_HOLD(min): ")&&(e.postHoldMin=t.slice(16));return e}async function k(n){const e=await n.sendAndCollect("STATUS_LITE",x,I,C("STATUS_LITE"));if(e.some(t=>t.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!e.some(t=>t.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return z(e)}function j(){return typeof navigator<"u"&&!!navigator.bluetooth}function V(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function X(){if(!V())return!1;const n=navigator.userAgent;return/Safari/i.test(n)&&!/CriOS|FxiOS|EdgiOS/i.test(n)}const f=["mon","tue","wed","thu","fri","sat","sun"],W="sml-draft-schedule-v2";function J(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:255,postHoldMin:20}}function $(){return Object.fromEntries(f.map(n=>[n,J()]))}function Q(){try{const n=localStorage.getItem(W);if(n){const t=JSON.parse(n);return _(t)}const e=localStorage.getItem("sml-draft-schedule-v1");if(e){const t=JSON.parse(e);return _(t)}return null}catch{return null}}function _(n){const e=$();for(const t of f){const s=n[t];s&&(e[t]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:s.pwmMax??255,postHoldMin:s.postHoldMin??20})}return e}function h(n){localStorage.setItem(W,JSON.stringify(n))}function M(n){const e=$();for(const t of n){const s=t.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/i);if(!s)continue;const i=s[1].toLowerCase();e[i]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:Number(s[4]),pwmMax:Number(s[5]),postHoldMin:s[6]?Number(s[6]):20}}return e}function Z(n,e){return f.every(t=>JSON.stringify(n[t])===JSON.stringify(e[t]))}class ee{constructor(e){c(this,"root");c(this,"screen","connect");c(this,"transport",null);c(this,"schedule",Q()??$());c(this,"selected",new Set);c(this,"status",{});c(this,"message","");c(this,"messageKind","");c(this,"busy",!1);c(this,"scheduleLoading",!1);c(this,"statusLoading",!1);c(this,"syncGeneration",0);this.root=e,this.render()}setMessage(e,t=""){this.message=e,this.messageKind=t,this.render()}async withBusy(e){this.busy=!0,this.render();try{await e()}catch(t){const s=t instanceof Error?t.message:String(t);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){await this.withBusy(async()=>{const e=new N;await e.connect(),this.transport=e,this.screen="editor",this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(e,++this.syncGeneration)})}async loadDeviceData(e,t){try{if(await K(e),t!==this.syncGeneration)return;const[s,i]=await Promise.all([L(e),k(e)]);if(t!==this.syncGeneration)return;this.schedule=M(s),h(this.schedule),this.status=i,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(t!==this.syncGeneration)return;const i=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${i}`,"error")}finally{t===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}disconnect(){var e;this.syncGeneration++,(e=this.transport)==null||e.disconnect(),this.transport=null,this.screen="connect",this.selected.clear(),this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}toggleDay(e){this.schedule[e].enabled=!this.schedule[e].enabled,h(this.schedule),this.render()}updateDay(e,t){Object.assign(this.schedule[e],t),h(this.schedule),this.render()}toggleSelect(e){this.selected.has(e)?this.selected.delete(e):this.selected.add(e),this.render()}applyBulk(e,t,s,i,a){const d=this.selected.size?[...this.selected]:f;for(const r of d)e==="time"&&t&&(this.schedule[r].time=t,this.schedule[r].enabled=!0),(e==="brightness"||e==="all")&&s!==void 0&&i!==void 0&&(this.schedule[r].prewindowMin=s,this.schedule[r].pwmMax=i,a!==void 0&&(this.schedule[r].postHoldMin=a)),e==="all"&&t&&(this.schedule[r].time=t,this.schedule[r].enabled=!0);h(this.schedule),this.render()}async saveToDevice(){if(!this.transport)return;if(!f.some(t=>this.schedule[t].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await Y(this.transport,this.schedule);const t=await L(this.transport),s=M(t);if(!Z(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await k(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const e=await L(this.transport);this.schedule=M(e),h(this.schedule),this.status=await k(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const e=j(),t=X(),s=window.location.href;return`
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
        ${f.map(a=>this.renderDayRow(a)).join("")}
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
    `}render(){this.root.innerHTML=this.screen==="connect"?this.renderConnect():this.renderEditor(),this.bindEvents()}bindEvents(){var a,d,r,p,y,b,v,T,D,A;(a=this.root.querySelector("#btn-connect"))==null||a.addEventListener("click",()=>void this.connectBle()),(d=this.root.querySelector("#btn-disconnect"))==null||d.addEventListener("click",()=>this.disconnect()),(r=this.root.querySelector("#btn-save"))==null||r.addEventListener("click",()=>void this.saveToDevice()),(p=this.root.querySelector("#btn-refresh"))==null||p.addEventListener("click",()=>void this.refreshFromDevice()),this.root.querySelectorAll("[data-action='toggle']").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.day;this.toggleDay(l)})}),this.root.querySelectorAll("[data-action='select']").forEach(o=>{o.addEventListener("click",l=>{l.stopPropagation();const m=o.dataset.day;this.toggleSelect(m)})}),this.root.querySelectorAll("[data-field]").forEach(o=>{o.addEventListener("change",()=>{const l=o,m=l.dataset.day,u=l.dataset.field;u!=="enabled"&&(u==="prewindowMin"||u==="pwmMax"||u==="postHoldMin"?this.updateDay(m,{[u]:Number(l.value)}):this.updateDay(m,{[u]:l.value}))}),o.type==="range"&&o.addEventListener("input",()=>{const l=o,m=l.dataset.day;this.updateDay(m,{pwmMax:Number(l.value)});const u=l.previousElementSibling;u&&(u.textContent=`Brightness (${l.value})`)})}),(y=this.root.querySelector('[data-preset="weekdays"]'))==null||y.addEventListener("click",()=>{for(const o of["mon","tue","wed","thu","fri"])this.schedule[o].enabled=!0,this.schedule[o].time="06:30";h(this.schedule),this.render()}),(b=this.root.querySelector('[data-preset="weekend"]'))==null||b.addEventListener("click",()=>{for(const o of["sat","sun"])this.schedule[o].enabled=!0,this.schedule[o].time="08:00";h(this.schedule),this.render()}),(v=this.root.querySelector('[data-preset="copy-mon"]'))==null||v.addEventListener("click",()=>{const o={...this.schedule.mon};for(const l of f)this.schedule[l]={...o};h(this.schedule),this.render()});const e=()=>{var o;return((o=this.root.querySelector("#bulk-time"))==null?void 0:o.value)??"07:00"},t=()=>{var o;return Number(((o=this.root.querySelector("#bulk-pre"))==null?void 0:o.value)??20)},s=()=>{var o;return Number(((o=this.root.querySelector("#bulk-hold"))==null?void 0:o.value)??20)},i=()=>{var o;return Number(((o=this.root.querySelector("#bulk-max"))==null?void 0:o.value)??200)};(T=this.root.querySelector("#bulk-time-only"))==null||T.addEventListener("click",()=>{this.applyBulk("time",e())}),(D=this.root.querySelector("#bulk-bright-only"))==null||D.addEventListener("click",()=>{this.applyBulk("brightness",void 0,t(),i(),s())}),(A=this.root.querySelector("#bulk-all"))==null||A.addEventListener("click",()=>{this.applyBulk("all",e(),t(),i(),s())})}}const O=document.getElementById("app");O&&new ee(O);
