var C=Object.defineProperty;var _=(n,e,t)=>e in n?C(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var c=(n,e,t)=>_(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();const w="6e400001-b5a3-f393-e0a9-e50e24dcca9e",x="6e400002-b5a3-f393-e0a9-e50e24dcca9e",W="6e400003-b5a3-f393-e0a9-e50e24dcca9e",D=1e3,B=2e4;class q{constructor(){c(this,"device",null);c(this,"server",null);c(this,"rxChar",null);c(this,"buffer","");c(this,"queue",[]);c(this,"notifyWaiters",[]);c(this,"_connected",!1)}get connected(){return this._connected}async connect(){var s;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[w]}],optionalServices:[w]}),this.device.addEventListener("gattserverdisconnected",()=>{this._connected=!1});const e=await((s=this.device.gatt)==null?void 0:s.connect());if(!e)throw new Error("GATT connect failed");this.server=e;const t=await this.server.getPrimaryService(w);this.rxChar=await t.getCharacteristic(x);const i=await t.getCharacteristic(W);await i.startNotifications(),i.addEventListener("characteristicvaluechanged",a=>{const d=a.target.value;if(!d)return;const f=new TextDecoder().decode(d);for(this.buffer+=f;this.buffer.includes(`
`);){const y=this.buffer.indexOf(`
`),p=this.buffer.slice(0,y).trim();if(this.buffer=this.buffer.slice(y+1),!p)continue;const v=this.notifyWaiters.shift();v?v(p):this.queue.push(p)}}),this._connected=!0}async writeLine(e){if(!this.rxChar)throw new Error("Not connected");const t=new TextEncoder().encode(e+`
`);await this.rxChar.writeValueWithoutResponse(t)}async waitForLine(e){return this.queue.length?this.queue.shift():new Promise(t=>{const i=window.setTimeout(()=>{const a=this.notifyWaiters.indexOf(s);a>=0&&this.notifyWaiters.splice(a,1),t(null)},e),s=a=>{clearTimeout(i),t(a)};this.notifyWaiters.push(s)})}async send(e){return e?(await this.writeLine(e),this.collectLines(400,5e3)):this.collectLines(D,3e3)}async sendAndCollect(e,t=D,i=B){return e&&await this.writeLine(e),this.collectLines(t,i)}async collectLines(e,t){const i=[],s=Date.now()+t;for(;Date.now()<s;){const a=s-Date.now(),o=await this.waitForLine(Math.min(e,a));if(o===null){if(i.length)return i;continue}i.push(o)}return i}disconnect(){var e;(e=this.server)==null||e.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[]}}const T=1e3,A=2e4;function N(){const n=new Date(new Date().getFullYear(),0,1),e=new Date(new Date().getFullYear(),6,1),t=n.getTimezoneOffset(),i=e.getTimezoneOffset(),s=-t*60,o=t!==i?-Math.min(t,i)*60:0;return`TZ_OFFSET ${s} ${o}`}function R(){const n=new Date,e=t=>String(t).padStart(2,"0");return`TIME ${n.getFullYear()}-${e(n.getMonth()+1)}-${e(n.getDate())} ${e(n.getHours())}:${e(n.getMinutes())}`}async function g(n){const e=await n.sendAndCollect("SCHED_GET",T,A);if(!e.some(t=>t.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return e}async function F(n,e){const t=Object.keys(e);for(const s of t){const a=e[s];let o;a.enabled?o=`SCHED_DAY ${s} ${a.time} ${a.prewindowMin} ${a.pwmMax}`:o=`SCHED_DAY ${s} OFF`;const d=await n.send(o);if(!d.some(f=>f.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${s}: ${d.join(" ")}`)}if(!(await n.send("SAVE")).some(s=>s.includes("SAVE ok")))throw new Error("SAVE failed")}function P(n){const e={};for(const t of n)t.startsWith("RTC: ")&&(e.rtc=t.slice(5)),t.startsWith("TODAY: ")&&(e.today=t.slice(7).trim()),t.startsWith("TODAY_ALARM: ")&&(e.todayAlarm=t.slice(13)),t.startsWith("ALARM(daily): ")&&(e.alarmDaily=t.slice(14)),t.startsWith("ALARM_AT: ")&&(e.alarmAt=t.slice(10)),t.startsWith("NEXT_RAMP: ")&&(e.nextRamp=t.slice(11)),t.startsWith("WAKE_CAUSE: ")&&(e.wakeCause=t.slice(12)),t.startsWith("BOOT_PATH: ")&&(e.bootPath=t.slice(11)),t.startsWith("NVM_OK: ")&&(e.nvmOk=t.includes("yes")),t.startsWith("POWER: ")&&(e.power=t.slice(7)),t.startsWith("PHASE: ")&&(e.phase=t.slice(7)),t.startsWith("TIME_SYNC_AUTO: ")&&(e.timeSync=t.slice(16)),t.startsWith("TIME_TRUSTED: ")&&(e.timeTrusted=t.includes("yes"));return e}async function S(n){const e=await n.sendAndCollect("STATUS",T,A);return P(e)}function I(){return typeof navigator<"u"&&!!navigator.bluetooth}function U(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function Y(){if(!U())return!1;const n=navigator.userAgent;return/Safari/i.test(n)&&!/CriOS|FxiOS|EdgiOS/i.test(n)}const m=["mon","tue","wed","thu","fri","sat","sun"],M="sml-draft-schedule-v1";function H(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:255}}function O(){return Object.fromEntries(m.map(n=>[n,H()]))}function K(){try{const n=localStorage.getItem(M);return n?JSON.parse(n):null}catch{return null}}function h(n){localStorage.setItem(M,JSON.stringify(n))}function E(n){const e=O();for(const t of n){const i=t.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)/i);if(!i)continue;const s=i[1].toLowerCase();e[s]={enabled:i[2].toUpperCase()==="ON",time:i[3],prewindowMin:Number(i[4]),pwmMax:Number(i[5])}}return e}function j(n,e){return m.every(t=>JSON.stringify(n[t])===JSON.stringify(e[t]))}class z{constructor(e){c(this,"root");c(this,"screen","connect");c(this,"transport",null);c(this,"schedule",K()??O());c(this,"selected",new Set);c(this,"status",{});c(this,"message","");c(this,"messageKind","");c(this,"busy",!1);this.root=e,this.render()}setMessage(e,t=""){this.message=e,this.messageKind=t,this.render()}async withBusy(e){this.busy=!0,this.render();try{await e()}catch(t){const i=t instanceof Error?t.message:String(t);this.setMessage(i,"error")}finally{this.busy=!1,this.render()}}async connectBle(){await this.withBusy(async()=>{const e=new q;await e.connect(),await e.send(N()),await this.waitForReqTime(e),await e.send(R());const t=await g(e);this.schedule=E(t),h(this.schedule),this.status=await S(e),this.transport=e,this.screen="editor",this.setMessage("Connected and schedule loaded.","ok")})}async waitForReqTime(e){const t=Date.now()+5e3;for(;Date.now()<t;)if((await e.sendAndCollect("",300,600)).some(s=>s==="REQ_TIME"||s.startsWith("REQ_TIME ")))return}disconnect(){var e;(e=this.transport)==null||e.disconnect(),this.transport=null,this.screen="connect",this.selected.clear(),this.setMessage("")}toggleDay(e){this.schedule[e].enabled=!this.schedule[e].enabled,h(this.schedule),this.render()}updateDay(e,t){Object.assign(this.schedule[e],t),h(this.schedule),this.render()}toggleSelect(e){this.selected.has(e)?this.selected.delete(e):this.selected.add(e),this.render()}applyBulk(e,t,i,s){const a=this.selected.size?[...this.selected]:m;for(const o of a)e==="time"&&t&&(this.schedule[o].time=t,this.schedule[o].enabled=!0),(e==="brightness"||e==="all")&&i!==void 0&&s!==void 0&&(this.schedule[o].prewindowMin=i,this.schedule[o].pwmMax=s),e==="all"&&t&&(this.schedule[o].time=t,this.schedule[o].enabled=!0);h(this.schedule),this.render()}async saveToDevice(){if(!this.transport)return;if(!m.some(t=>this.schedule[t].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await F(this.transport,this.schedule);const t=await g(this.transport),i=E(t);if(!j(this.schedule,i))throw new Error("Device schedule does not match what was sent.");this.status=await S(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const e=await g(this.transport);this.schedule=E(e),h(this.schedule),this.status=await S(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const e=I(),t=Y(),i=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari and Chrome on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${i}</p>
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
    `}renderDayRow(e){const t=this.schedule[e],i=e.toUpperCase(),s=this.selected.has(e);return`
      <div class="day-row ${t.enabled?"":"disabled"} ${s?"selected":""}" data-day="${e}">
        <div class="day-head">
          <span class="day-label">${i}</span>
          <div class="toggle ${t.enabled?"on":""}" data-action="toggle" data-day="${e}" role="switch" aria-checked="${t.enabled}"></div>
          <button type="button" class="btn-secondary" style="width:auto;padding:0.2rem 0.45rem;font-size:0.7rem;margin:0" data-action="select" data-day="${e}">
            ${s?"✓":"○"}
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
              <label>Ramp (min)</label>
              <input type="number" min="1" max="60" value="${t.prewindowMin}" data-field="prewindowMin" data-day="${e}" ${t.enabled?"":"disabled"} />
            </div>
          </div>
        </div>
      </div>
    `}renderEditor(){var i;const e=this.selected.size,t=e>0;return`
      <h1>Week schedule</h1>
      <p class="subtitle">${(i=this.transport)!=null&&i.connected?"Connected":"Disconnected"} · tap ○ to select days for bulk edit</p>

      <div class="card status-bar">
        ${this.status.rtc?`<div>Clock: <strong>${this.status.rtc}</strong></div>`:""}
        ${this.status.nextRamp?`<div>Next ramp: <strong>${this.status.nextRamp}</strong></div>`:""}
        ${this.status.power?`<div>Power: <strong>${this.status.power}</strong>${this.status.power==="battery"?" (max brightness capped at 50 on device)":""}</div>`:""}
        ${this.status.nvmOk!==void 0?`<div>Saved: <strong>${this.status.nvmOk?"yes":"no"}</strong></div>`:""}
      </div>

      <div class="card">
        <h2>Alarms</h2>
        ${m.map(s=>this.renderDayRow(s)).join("")}
        <div class="preset-row">
          <button type="button" data-preset="weekdays">Weekdays 6:30</button>
          <button type="button" data-preset="weekend">Weekend 8:00</button>
          <button type="button" data-preset="copy-mon">Copy Mon → all</button>
        </div>
      </div>

      ${t?`<div class="bulk-panel">
        <div class="card">
          <h2>Apply to ${e} day${e>1?"s":""}</h2>
          <div class="field-row">
            <div><label>Time</label><input type="time" id="bulk-time" value="07:00" /></div>
            <div><label>Ramp</label><input type="number" id="bulk-pre" min="1" max="60" value="20" /></div>
          </div>
          <label>Brightness</label>
          <input type="range" id="bulk-max" min="1" max="255" value="200" />
          <div class="bulk-actions">
            <button class="btn btn-secondary" type="button" id="bulk-time-only">Time only</button>
            <button class="btn btn-secondary" type="button" id="bulk-bright-only">Bright+ramp</button>
            <button class="btn btn-secondary" type="button" id="bulk-all">All</button>
          </div>
        </div>
      </div>`:""}

      <div class="save-bar">
        <div class="inner">
          <button class="btn btn-secondary" id="btn-disconnect" ${this.busy?"disabled":""}>Disconnect</button>
          <button class="btn btn-primary" id="btn-save" ${this.busy?"disabled":""}>Save to mask</button>
        </div>
      </div>

      <button class="btn btn-secondary" id="btn-refresh" ${this.busy?"disabled":""}>Reload from mask</button>
      ${this.message?`<p class="message ${this.messageKind}">${this.message}</p>`:""}
    `}render(){this.root.innerHTML=this.screen==="connect"?this.renderConnect():this.renderEditor(),this.bindEvents()}bindEvents(){var s,a,o,d,f,y,p,v,k,$;(s=this.root.querySelector("#btn-connect"))==null||s.addEventListener("click",()=>void this.connectBle()),(a=this.root.querySelector("#btn-disconnect"))==null||a.addEventListener("click",()=>this.disconnect()),(o=this.root.querySelector("#btn-save"))==null||o.addEventListener("click",()=>void this.saveToDevice()),(d=this.root.querySelector("#btn-refresh"))==null||d.addEventListener("click",()=>void this.refreshFromDevice()),this.root.querySelectorAll("[data-action='toggle']").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.day;this.toggleDay(l)})}),this.root.querySelectorAll("[data-action='select']").forEach(r=>{r.addEventListener("click",l=>{l.stopPropagation();const b=r.dataset.day;this.toggleSelect(b)})}),this.root.querySelectorAll("[data-field]").forEach(r=>{r.addEventListener("change",()=>{const l=r,b=l.dataset.day,u=l.dataset.field;u!=="enabled"&&(u==="prewindowMin"||u==="pwmMax"?this.updateDay(b,{[u]:Number(l.value)}):this.updateDay(b,{[u]:l.value}))}),r.type==="range"&&r.addEventListener("input",()=>{const l=r,b=l.dataset.day;this.updateDay(b,{pwmMax:Number(l.value)});const u=l.previousElementSibling;u&&(u.textContent=`Brightness (${l.value})`)})}),(f=this.root.querySelector('[data-preset="weekdays"]'))==null||f.addEventListener("click",()=>{for(const r of["mon","tue","wed","thu","fri"])this.schedule[r].enabled=!0,this.schedule[r].time="06:30";h(this.schedule),this.render()}),(y=this.root.querySelector('[data-preset="weekend"]'))==null||y.addEventListener("click",()=>{for(const r of["sat","sun"])this.schedule[r].enabled=!0,this.schedule[r].time="08:00";h(this.schedule),this.render()}),(p=this.root.querySelector('[data-preset="copy-mon"]'))==null||p.addEventListener("click",()=>{const r={...this.schedule.mon};for(const l of m)this.schedule[l]={...r};h(this.schedule),this.render()});const e=()=>{var r;return((r=this.root.querySelector("#bulk-time"))==null?void 0:r.value)??"07:00"},t=()=>{var r;return Number(((r=this.root.querySelector("#bulk-pre"))==null?void 0:r.value)??20)},i=()=>{var r;return Number(((r=this.root.querySelector("#bulk-max"))==null?void 0:r.value)??200)};(v=this.root.querySelector("#bulk-time-only"))==null||v.addEventListener("click",()=>{this.applyBulk("time",e())}),(k=this.root.querySelector("#bulk-bright-only"))==null||k.addEventListener("click",()=>{this.applyBulk("brightness",void 0,t(),i())}),($=this.root.querySelector("#bulk-all"))==null||$.addEventListener("click",()=>{this.applyBulk("all",e(),t(),i())})}}const L=document.getElementById("app");L&&new z(L);
