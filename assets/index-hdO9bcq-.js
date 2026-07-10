var J=Object.defineProperty;var Q=(i,t,e)=>t in i?J(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var r=(i,t,e)=>Q(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const M="6e400001-b5a3-f393-e0a9-e50e24dcca9e",Z="6e400002-b5a3-f393-e0a9-e50e24dcca9e",tt="6e400003-b5a3-f393-e0a9-e50e24dcca9e",k=200,D=3e3;class et{constructor(){r(this,"device",null);r(this,"server",null);r(this,"rxChar",null);r(this,"buffer","");r(this,"queue",[]);r(this,"notifyWaiters",[]);r(this,"_connected",!1);r(this,"opChain",Promise.resolve());r(this,"onDisconnectCallback",null);r(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}async connect(){var s;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[M]}],optionalServices:[M]}),this.device.addEventListener("gattserverdisconnected",()=>{var l;this._connected=!1;const a=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(l=this.onDisconnectCallback)==null||l.call(this,a)});const t=await((s=this.device.gatt)==null?void 0:s.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService(M);this.rxChar=await e.getCharacteristic(Z);const n=await e.getCharacteristic(tt);await n.startNotifications(),n.addEventListener("characteristicvaluechanged",a=>{const d=a.target.value;if(!d)return;const y=new TextDecoder().decode(d);for(this.buffer+=y;this.buffer.includes(`
`);){const g=this.buffer.indexOf(`
`),v=this.buffer.slice(0,g).trim();if(this.buffer=this.buffer.slice(g+1),!v)continue;const w=this.notifyWaiters.shift();w?w(v):this.queue.push(v)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const n=window.setTimeout(()=>{const a=this.notifyWaiters.indexOf(s);a>=0&&this.notifyWaiters.splice(a,1),e(null)},t),s=a=>{clearTimeout(n),e(a)};this.notifyWaiters.push(s)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(k,D)):this.collectLines(k,D))}async sendAndCollect(t,e=k,n=D,s){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,n,s)))}async collectLines(t,e,n){const s=[],a=Date.now()+e;for(;Date.now()<a;){const l=a-Date.now(),d=await this.waitForLine(Math.min(t,l));if(d===null){if(s.length)return s;continue}if(s.push(d),n!=null&&n(d,s))return s}return s}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.opChain=Promise.resolve()}}const E=1,$=100,b=50,K=1,Y=60,z=10;function m(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(E,Math.min($,t)):b}function U(i){const t=Math.round(Number(i));return Number.isFinite(t)?Math.max(K,Math.min(Y,t)):z}const X=250,st=8e3,nt=5e3,it=200;function j(i){const t=`OK ${i}`;return e=>e===t||e.startsWith(`${t} `)}function at(){const i=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=i.getTimezoneOffset(),n=t.getTimezoneOffset(),s=-e*60,l=e!==n?-Math.min(e,n)*60:0;return`TZ_OFFSET ${s} ${l}`}function ot(){const i=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${i.getFullYear()}-${t(i.getMonth()+1)}-${t(i.getDate())} ${t(i.getHours())}:${t(i.getMinutes())}:${t(i.getSeconds())}`}function L(i){return i==="REQ_TIME"||i.startsWith("REQ_TIME ")}async function rt(i){let t=i.drainQueue().some(L);if((await i.send(at())).some(L)&&(t=!0),!t){const n=Date.now()+2e3;for(;Date.now()<n;){const s=Math.max(100,Math.min(it,n-Date.now())),a=await i.sendAndCollect("",s,Math.min(600,n-Date.now()),l=>L(l));if(a.some(L)){t=!0;break}if(!a.length)break}}}async function lt(i){await i.send(ot())}async function A(i){return await lt(i),ht(i)}async function _(i){const t=await i.sendAndCollect("SCHED_GET",X,st,j("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function ct(i,t){const e=Object.keys(t);for(const s of e){const a=t[s];let l;a.enabled?l=`SCHED_DAY ${s} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin}`:l=`SCHED_DAY ${s} OFF`;const d=await i.send(l);if(!d.some(y=>y.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${s}: ${d.join(" ")}`)}if(!(await i.send("SAVE")).some(s=>s.includes("SAVE ok")))throw new Error("SAVE failed")}function dt(i){const t={};for(const e of i)e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function ht(i){const t=await i.sendAndCollect("STATUS_LITE",X,nt,j("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return dt(t)}async function ut(i,t,e){const n=await i.send(`LAMP_TEST ${t} ${e}`);if(!n.some(s=>s.startsWith("OK LAMP_TEST")))throw new Error(n.find(s=>s.startsWith("ERR"))??"LAMP_TEST failed")}async function pt(i){const t=await i.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function mt(){return typeof navigator<"u"&&!!navigator.bluetooth}function ft(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function bt(){if(!ft())return!1;const i=navigator.userAgent;return/Safari/i.test(i)&&!/CriOS|FxiOS|EdgiOS/i.test(i)}const f=["mon","tue","wed","thu","fri","sat","sun"],V="sml-draft-schedule-v2";function yt(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:b,postHoldMin:20}}function O(){return Object.fromEntries(f.map(i=>[i,yt()]))}function vt(){try{const i=localStorage.getItem(V);if(i){const e=JSON.parse(i);return F(e)}const t=localStorage.getItem("sml-draft-schedule-v1");if(t){const e=JSON.parse(t);return F(e)}return null}catch{return null}}function F(i){const t=O();for(const e of f){const n=i[e];n&&(t[e]={enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin??20,pwmMax:m(n.pwmMax??b),postHoldMin:n.postHoldMin??20})}return t}function p(i){localStorage.setItem(V,JSON.stringify(i))}function C(i){const t=O();for(const e of i){const n=e.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/i);if(!n)continue;const s=n[1].toLowerCase();t[s]={enabled:n[2].toUpperCase()==="ON",time:n[3],prewindowMin:Number(n[4]),pwmMax:m(Number(n[5])),postHoldMin:n[6]?Number(n[6]):20}}return t}function gt(i,t){return f.every(e=>JSON.stringify(i[e])===JSON.stringify(t[e]))}class wt{constructor(t){r(this,"root");r(this,"screen","connect");r(this,"transport",null);r(this,"schedule",vt()??O());r(this,"selected",new Set);r(this,"status",{});r(this,"message","");r(this,"messageKind","");r(this,"busy",!1);r(this,"scheduleLoading",!1);r(this,"statusLoading",!1);r(this,"syncGeneration",0);r(this,"lampTestLevel",b);r(this,"lampTestSeconds",z);r(this,"lampTestRemaining",0);r(this,"lampTestInterval",null);this.root=t,this.render()}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const n=e instanceof Error?e.message:String(e);this.setMessage(n,"error")}finally{this.busy=!1,this.render()}}async connectBle(){await this.withBusy(async()=>{const t=new et;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),await t.connect(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)})}async loadDeviceData(t,e){try{if(await rt(t),e!==this.syncGeneration)return;const n=await _(t);if(e!==this.syncGeneration)return;const s=await A(t);if(e!==this.syncGeneration)return;this.schedule=C(n),p(this.schedule),this.status=s,this.setMessage("Schedule loaded from mask.","ok")}catch(n){if(e!==this.syncGeneration)return;const s=n instanceof Error?n.message:String(n);this.setMessage(`Sync failed: ${s}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await pt(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.transport=null,this.screen="connect",this.selected.clear(),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.selected.clear(),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var n;if(!((n=this.transport)!=null&&n.connected)||this.busy)return;const t=m(this.lampTestLevel),e=U(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,await this.withBusy(async()=>{await ut(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const s=this.root.querySelector("#lamp-test-countdown");s&&(s.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}applyTestBrightnessToAllDays(){const t=m(this.lampTestLevel);this.lampTestLevel=t;for(const e of f)this.schedule[e].pwmMax=t;p(this.schedule),this.setMessage(`Set draft brightness to ${t}% for all days. Save to mask when ready.`,"ok")}toggleDay(t){this.schedule[t].enabled=!this.schedule[t].enabled,p(this.schedule),this.render()}patchDay(t,e){Object.assign(this.schedule[t],e),p(this.schedule)}toggleSelect(t){this.selected.has(t)?this.selected.delete(t):this.selected.add(t),this.render()}applyBulk(t,e,n,s,a){const l=this.selected.size?[...this.selected]:f;for(const d of l)t==="time"&&e&&(this.schedule[d].time=e,this.schedule[d].enabled=!0),(t==="brightness"||t==="all")&&n!==void 0&&s!==void 0&&(this.schedule[d].prewindowMin=n,this.schedule[d].pwmMax=m(s),a!==void 0&&(this.schedule[d].postHoldMin=a)),t==="all"&&e&&(this.schedule[d].time=e,this.schedule[d].enabled=!0);p(this.schedule),this.render()}async saveToDevice(){if(!this.transport)return;if(!f.some(e=>this.schedule[e].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await ct(this.transport,this.schedule);const e=await _(this.transport),n=C(e);if(!gt(this.schedule,n))throw new Error("Device schedule does not match what was sent.");this.status=await A(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const t=await _(this.transport);this.schedule=C(t),p(this.schedule),this.status=await A(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const t=mt(),e=bt(),n=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${e?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari and Chrome on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${n}</p>
      </div>`:""}

      ${t?`<button class="btn btn-primary" id="btn-connect" ${this.busy?"disabled":""}>
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
    `}renderDayRow(t){const e=this.schedule[t],n=t.toUpperCase(),s=this.selected.has(t);return`
      <div class="day-row ${e.enabled?"":"disabled"} ${s?"selected":""}" data-day="${t}">
        <div class="day-head">
          <span class="day-label">${n}</span>
          <div class="toggle ${e.enabled?"on":""}" data-action="toggle" data-day="${t}" role="switch" aria-checked="${e.enabled}"></div>
          <button type="button" class="btn-secondary" style="width:auto;padding:0.2rem 0.45rem;font-size:0.7rem;margin:0" data-action="select" data-day="${t}">
            ${s?"✓":"○"}
          </button>
        </div>
        <div class="day-fields">
          <div>
            <label>Wake time</label>
            <input type="time" value="${e.time}" data-field="time" data-day="${t}" ${e.enabled?"":"disabled"} />
          </div>
          <div class="field-row">
            <div>
              <label>Brightness (${e.pwmMax}%)</label>
              <input type="range" min="${E}" max="${$}" value="${e.pwmMax}" data-field="pwmMax" data-day="${t}" ${e.enabled?"":"disabled"} />
            </div>
            <div>
              <label>Ramp before (min)</label>
              <input type="number" min="1" max="240" value="${e.prewindowMin}" data-field="prewindowMin" data-day="${t}" ${e.enabled?"":"disabled"} />
            </div>
            <div>
              <label>Hold after (min)</label>
              <input type="number" min="1" max="240" value="${e.postHoldMin}" data-field="postHoldMin" data-day="${t}" ${e.enabled?"":"disabled"} />
            </div>
          </div>
        </div>
      </div>
    `}renderBrightnessTestCard(){const t=this.lampTestInterval!==null,e=t&&this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:t?"Test finished":"";return`
      <div class="card lamp-test-card">
        <h2>Find your brightness</h2>
        <p class="lamp-test-hint">Try a level on the mask before saving your schedule. Start at 50% — most people land between 40% and 70%.</p>
        <label>Brightness (${this.lampTestLevel}%)</label>
        <input
          type="range"
          id="lamp-test-level"
          min="${E}"
          max="${$}"
          value="${this.lampTestLevel}"
          ${t||this.busy?"disabled":""}
        />
        <div class="field-row">
          <div>
            <label>Duration (seconds)</label>
            <input
              type="number"
              id="lamp-test-seconds"
              min="${K}"
              max="${Y}"
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
        ${e?`<p class="lamp-test-countdown" id="lamp-test-countdown">${e}</p>`:""}
        <button
          class="btn btn-secondary lamp-test-apply"
          type="button"
          id="btn-lamp-apply-all"
          ${t||this.busy?"disabled":""}
        >
          Use ${this.lampTestLevel}% for all days
        </button>
      </div>
    `}renderEditor(){var s,a;const t=this.scheduleLoading,e=this.selected.size,n=e>0;return`
      <h1>Week schedule</h1>
      <p class="subtitle">${(s=this.transport)!=null&&s.connected?"Connected":"Disconnected"} · tap ○ to select days for bulk edit</p>

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

      ${(a=this.transport)!=null&&a.connected?this.renderBrightnessTestCard():""}

      <div class="card ${t?"loading":""}">
        <h2>Alarms</h2>
        ${f.map(l=>this.renderDayRow(l)).join("")}
        <div class="preset-row">
          <button type="button" data-preset="weekdays">Weekdays 6:30</button>
          <button type="button" data-preset="weekend">Weekend 8:00</button>
          <button type="button" data-preset="copy-mon">Copy Mon → all</button>
        </div>
      </div>

      ${n?`<div class="bulk-panel">
        <div class="card">
          <h2>Apply to ${e} day${e>1?"s":""}</h2>
          <div class="field-row">
            <div><label>Time</label><input type="time" id="bulk-time" value="07:00" /></div>
            <div><label>Ramp</label><input type="number" id="bulk-pre" min="1" max="240" value="20" /></div>
            <div><label>Hold</label><input type="number" id="bulk-hold" min="1" max="240" value="20" /></div>
          </div>
          <label>Brightness (${b}%)</label>
          <input type="range" id="bulk-max" min="${E}" max="${$}" value="${b}" />
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
    `}render(){this.root.innerHTML=this.screen==="connect"?this.renderConnect():this.renderEditor(),this.bindEvents()}bindEvents(){var a,l,d,y,g,v,w,B,x,R,N,I,q,W,H;(a=this.root.querySelector("#btn-connect"))==null||a.addEventListener("click",()=>void this.connectBle()),(l=this.root.querySelector("#btn-disconnect"))==null||l.addEventListener("click",()=>void this.disconnect()),(d=this.root.querySelector("#btn-save"))==null||d.addEventListener("click",()=>void this.saveToDevice()),(y=this.root.querySelector("#btn-refresh"))==null||y.addEventListener("click",()=>void this.refreshFromDevice()),this.root.querySelectorAll("[data-action='toggle']").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.day;this.toggleDay(c)})}),this.root.querySelectorAll("[data-action='select']").forEach(o=>{o.addEventListener("click",c=>{c.stopPropagation();const h=o.dataset.day;this.toggleSelect(h)})}),this.root.querySelectorAll("[data-field]").forEach(o=>{const c=o,h=c.dataset.day,u=c.dataset.field;if(u==="enabled")return;const T=()=>{if(u==="prewindowMin"||u==="pwmMax"||u==="postHoldMin"){const S=u==="pwmMax"?m(Number(c.value)):Number(c.value);this.patchDay(h,{[u]:S})}else this.patchDay(h,{[u]:c.value})};if(c.type==="range"){c.addEventListener("input",()=>{const S=m(Number(c.value));this.patchDay(h,{pwmMax:S});const P=c.previousElementSibling;P&&(P.textContent=`Brightness (${S}%)`)});return}c.addEventListener("change",T),c.addEventListener("blur",T)}),(g=this.root.querySelector('[data-preset="weekdays"]'))==null||g.addEventListener("click",()=>{for(const o of["mon","tue","wed","thu","fri"])this.schedule[o].enabled=!0,this.schedule[o].time="06:30";p(this.schedule),this.render()}),(v=this.root.querySelector('[data-preset="weekend"]'))==null||v.addEventListener("click",()=>{for(const o of["sat","sun"])this.schedule[o].enabled=!0,this.schedule[o].time="08:00";p(this.schedule),this.render()}),(w=this.root.querySelector('[data-preset="copy-mon"]'))==null||w.addEventListener("click",()=>{const o={...this.schedule.mon};for(const c of f)this.schedule[c]={...o};p(this.schedule),this.render()});const t=()=>{var o;return((o=this.root.querySelector("#bulk-time"))==null?void 0:o.value)??"07:00"},e=()=>{var o;return Number(((o=this.root.querySelector("#bulk-pre"))==null?void 0:o.value)??20)},n=()=>{var o;return Number(((o=this.root.querySelector("#bulk-hold"))==null?void 0:o.value)??20)},s=()=>{var o;return m(Number(((o=this.root.querySelector("#bulk-max"))==null?void 0:o.value)??b))};(B=this.root.querySelector("#lamp-test-level"))==null||B.addEventListener("input",o=>{const c=o.target;this.lampTestLevel=m(Number(c.value));const h=c.previousElementSibling;h&&(h.textContent=`Brightness (${this.lampTestLevel}%)`);const u=this.root.querySelector("#btn-lamp-test");u&&(u.textContent=`Try for ${this.lampTestSeconds}s`);const T=this.root.querySelector("#btn-lamp-apply-all");T&&(T.textContent=`Use ${this.lampTestLevel}% for all days`)}),(x=this.root.querySelector("#lamp-test-seconds"))==null||x.addEventListener("change",o=>{const c=o.target;this.lampTestSeconds=U(Number(c.value)),c.value=String(this.lampTestSeconds);const h=this.root.querySelector("#btn-lamp-test");h&&(h.textContent=`Try for ${this.lampTestSeconds}s`)}),(R=this.root.querySelector("#btn-lamp-test"))==null||R.addEventListener("click",()=>void this.tryLampBrightness()),(N=this.root.querySelector("#btn-lamp-cancel"))==null||N.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")}),(I=this.root.querySelector("#btn-lamp-apply-all"))==null||I.addEventListener("click",()=>{this.applyTestBrightnessToAllDays()}),(q=this.root.querySelector("#bulk-time-only"))==null||q.addEventListener("click",()=>{this.applyBulk("time",t())}),(W=this.root.querySelector("#bulk-bright-only"))==null||W.addEventListener("click",()=>{this.applyBulk("brightness",void 0,e(),s(),n())}),(H=this.root.querySelector("#bulk-all"))==null||H.addEventListener("click",()=>{this.applyBulk("all",t(),e(),s(),n())})}}const G=document.getElementById("app");G&&new wt(G);
