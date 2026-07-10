var se=Object.defineProperty;var ne=(n,e,t)=>e in n?se(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var o=(n,e,t)=>ne(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const $="6e400001-b5a3-f393-e0a9-e50e24dcca9e",ie="6e400002-b5a3-f393-e0a9-e50e24dcca9e",ae="6e400003-b5a3-f393-e0a9-e50e24dcca9e",M=200,k=3e3;class re{constructor(){o(this,"device",null);o(this,"server",null);o(this,"rxChar",null);o(this,"buffer","");o(this,"queue",[]);o(this,"notifyWaiters",[]);o(this,"_connected",!1);o(this,"opChain",Promise.resolve());o(this,"onDisconnectCallback",null);o(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const e=[...this.queue];return this.queue=[],e}setOnDisconnect(e){this.onDisconnectCallback=e}async connect(){var i;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[$]}],optionalServices:[$]}),this.device.addEventListener("gattserverdisconnected",()=>{var l;this._connected=!1;const a=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(l=this.onDisconnectCallback)==null||l.call(this,a)});const e=await((i=this.device.gatt)==null?void 0:i.connect());if(!e)throw new Error("GATT connect failed");this.server=e;const t=await this.server.getPrimaryService($);this.rxChar=await t.getCharacteristic(ie);const s=await t.getCharacteristic(ae);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",a=>{const c=a.target.value;if(!c)return;const v=new TextDecoder().decode(c);for(this.buffer+=v;this.buffer.includes(`
`);){const g=this.buffer.indexOf(`
`),y=this.buffer.slice(0,g).trim();if(this.buffer=this.buffer.slice(g+1),!y)continue;const w=this.notifyWaiters.shift();w?w(y):this.queue.push(y)}}),this._connected=!0}async withLock(e){const t=this.opChain.then(()=>e());return this.opChain=t.then(()=>{},()=>{}),t}async writeLine(e){if(!this.rxChar)throw new Error("Not connected");const t=new TextEncoder().encode(e+`
`);await this.rxChar.writeValueWithoutResponse(t)}async waitForLine(e){return this.queue.length?this.queue.shift():new Promise(t=>{const s=window.setTimeout(()=>{const a=this.notifyWaiters.indexOf(i);a>=0&&this.notifyWaiters.splice(a,1),t(null)},e),i=a=>{clearTimeout(s),t(a)};this.notifyWaiters.push(i)})}async send(e){return this.withLock(async()=>e?(await this.writeLine(e),this.collectLines(M,k)):this.collectLines(M,k))}async sendAndCollect(e,t=M,s=k,i){return this.withLock(async()=>(e&&await this.writeLine(e),this.collectLines(t,s,i)))}async collectLines(e,t,s){const i=[],a=Date.now()+t;for(;Date.now()<a;){const l=a-Date.now(),c=await this.waitForLine(Math.min(e,l));if(c===null){if(i.length)return i;continue}if(i.push(c),s!=null&&s(c,i))return i}return i}disconnect(){var e;this.disconnectUserInitiated=!0,(e=this.server)==null||e.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.opChain=Promise.resolve()}}const T=1,L=100,f=50,X=1,j=60,V=10;function p(n){const e=Math.round(Number(n));return Number.isFinite(e)?Math.max(T,Math.min(L,e)):f}function K(n){const e=Math.round(Number(n));return Number.isFinite(e)?Math.max(X,Math.min(j,e)):V}const J=250,oe=8e3,le=5e3,ce=200;function Q(n){const e=`OK ${n}`;return t=>t===e||t.startsWith(`${e} `)}function de(){const n=new Date(new Date().getFullYear(),0,1),e=new Date(new Date().getFullYear(),6,1),t=n.getTimezoneOffset(),s=e.getTimezoneOffset(),i=-t*60,l=t!==s?-Math.min(t,s)*60:0;return`TZ_OFFSET ${i} ${l}`}function he(){const n=new Date,e=t=>String(t).padStart(2,"0");return`TIME ${n.getFullYear()}-${e(n.getMonth()+1)}-${e(n.getDate())} ${e(n.getHours())}:${e(n.getMinutes())}:${e(n.getSeconds())}`}function E(n){return n==="REQ_TIME"||n.startsWith("REQ_TIME ")}async function ue(n){let e=n.drainQueue().some(E);if((await n.send(de())).some(E)&&(e=!0),!e){const s=Date.now()+2e3;for(;Date.now()<s;){const i=Math.max(100,Math.min(ce,s-Date.now())),a=await n.sendAndCollect("",i,Math.min(600,s-Date.now()),l=>E(l));if(a.some(E)){e=!0;break}if(!a.length)break}}}async function pe(n){await n.send(he())}async function D(n){return await pe(n),be(n)}async function _(n){const e=await n.sendAndCollect("SCHED_GET",J,oe,Q("SCHED_GET"));if(!e.some(t=>t.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return e}async function me(n,e){const t=Object.keys(e);for(const i of t){const a=e[i];let l;a.enabled?l=`SCHED_DAY ${i} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin}`:l=`SCHED_DAY ${i} OFF`;const c=await n.send(l);if(!c.some(v=>v.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${i}: ${c.join(" ")}`)}if(!(await n.send("SAVE")).some(i=>i.includes("SAVE ok")))throw new Error("SAVE failed")}function fe(n){const e={};for(const t of n)t.startsWith("RTC: ")&&(e.rtc=t.slice(5)),t.startsWith("TODAY: ")&&(e.today=t.slice(7).trim()),t.startsWith("TODAY_ALARM: ")&&(e.todayAlarm=t.slice(13)),t.startsWith("ALARM(daily): ")&&(e.alarmDaily=t.slice(14)),t.startsWith("ALARM_AT: ")&&(e.alarmAt=t.slice(10)),t.startsWith("NEXT_RAMP: ")&&(e.nextRamp=t.slice(11)),t.startsWith("WAKE_CAUSE: ")&&(e.wakeCause=t.slice(12)),t.startsWith("BOOT_PATH: ")&&(e.bootPath=t.slice(11)),t.startsWith("NVM_OK: ")&&(e.nvmOk=t.includes("yes")),t.startsWith("PHASE: ")&&(e.phase=t.slice(7)),t.startsWith("TIME_SYNC_AUTO: ")&&(e.timeSync=t.slice(16)),t.startsWith("TIME_TRUSTED: ")&&(e.timeTrusted=t.includes("yes")),t.startsWith("PRE(min): ")&&(e.preMin=t.slice(10)),t.startsWith("POST_HOLD(min): ")&&(e.postHoldMin=t.slice(16));return e}async function be(n){const e=await n.sendAndCollect("STATUS_LITE",J,le,Q("STATUS_LITE"));if(e.some(t=>t.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!e.some(t=>t.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return fe(e)}async function ve(n,e,t){const s=await n.send(`LAMP_TEST ${e} ${t}`);if(!s.some(i=>i.startsWith("OK LAMP_TEST")))throw new Error(s.find(i=>i.startsWith("ERR"))??"LAMP_TEST failed")}async function ye(n){const e=await n.send("LAMP_TEST_CANCEL");if(!e.some(t=>t==="OK LAMP_TEST_CANCEL"))throw new Error(e.find(t=>t.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function Z(){return typeof navigator<"u"&&!!navigator.bluetooth}function ee(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function ge(){return Z()&&!ee()}function we(n){if(!n)return!1;const e=n instanceof DOMException||n instanceof Error?n.name:"",t=n instanceof Error?n.message:String(n),s=t.toLowerCase();return!!(e==="AbortError"||e==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(t.trim()))}const b=["mon","tue","wed","thu","fri","sat","sun"],te="sml-draft-schedule-v2";function Te(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:f,postHoldMin:20}}function C(){return Object.fromEntries(b.map(n=>[n,Te()]))}function Le(){try{const n=localStorage.getItem(te);if(n){const t=JSON.parse(n);return Y(t)}const e=localStorage.getItem("sml-draft-schedule-v1");if(e){const t=JSON.parse(e);return Y(t)}return null}catch{return null}}function Y(n){const e=C();for(const t of b){const s=n[t];s&&(e[t]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:p(s.pwmMax??f),postHoldMin:s.postHoldMin??20})}return e}function u(n){localStorage.setItem(te,JSON.stringify(n))}function A(n){const e=C();for(const t of n){const s=t.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/i);if(!s)continue;const i=s[1].toLowerCase();e[i]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:Number(s[4]),pwmMax:p(Number(s[5])),postHoldMin:s[6]?Number(s[6]):20}}return e}function Se(n,e){return b.every(t=>JSON.stringify(n[t])===JSON.stringify(e[t]))}class Ee{constructor(e){o(this,"root");o(this,"screen","connect");o(this,"transport",null);o(this,"schedule",Le()??C());o(this,"selected",new Set);o(this,"status",{});o(this,"message","");o(this,"messageKind","");o(this,"busy",!1);o(this,"scheduleLoading",!1);o(this,"statusLoading",!1);o(this,"syncGeneration",0);o(this,"lampTestLevel",f);o(this,"lampTestSeconds",V);o(this,"lampTestRemaining",0);o(this,"lampTestInterval",null);o(this,"lampTestExpanded",!1);this.root=e,this.render()}setMessage(e,t=""){this.message=e,this.messageKind=t,this.render()}async withBusy(e){this.busy=!0,this.render();try{await e()}catch(t){const s=t instanceof Error?t.message:String(t);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const e=new re;e.setOnDisconnect(t=>this.onTransportDisconnect(t)),await e.connect(),this.transport=e,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(e,++this.syncGeneration)}catch(e){if(we(e))this.message="",this.messageKind="";else{const t=e instanceof Error?e.message:String(e);this.setMessage(t,"error")}}finally{this.busy=!1,this.render()}}async loadDeviceData(e,t){try{if(await ue(e),t!==this.syncGeneration)return;const s=await _(e);if(t!==this.syncGeneration)return;const i=await D(e);if(t!==this.syncGeneration)return;this.schedule=A(s),u(this.schedule),this.status=i,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(t!==this.syncGeneration)return;const i=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${i}`,"error")}finally{t===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(e){var t;if(this.clearLampTestUi(),e&&((t=this.transport)!=null&&t.connected))try{await ye(this.transport)}catch{}this.render()}onTransportDisconnect(e){const t=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!e&&t&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),e||(this.syncGeneration++,this.transport=null,this.screen="connect",this.selected.clear(),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(t?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var e;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(e=this.transport)==null||e.disconnect(),this.transport=null,this.screen="connect",this.selected.clear(),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const e=p(this.lampTestLevel),t=K(this.lampTestSeconds);this.lampTestLevel=e,this.lampTestSeconds=t,this.lampTestExpanded=!0,await this.withBusy(async()=>{await ve(this.transport,e,t),this.clearLampTestUi(),this.lampTestRemaining=t,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const i=this.root.querySelector("#lamp-test-countdown"),a=this.root.querySelector(".lamp-test-toggle-hint");i&&(i.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),a&&(a.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${e}% brightness for ${t}s…`,"ok")})}setLampTestLevel(e){this.lampTestLevel=p(e)}syncLampTestLevelInputs(){const e=this.root.querySelector("#lamp-test-level"),t=this.root.querySelector("#lamp-test-level-num");e&&(e.value=String(this.lampTestLevel)),t&&(t.value=String(this.lampTestLevel));const s=this.root.querySelector("#btn-lamp-test");s&&(s.textContent=`Try for ${this.lampTestSeconds}s`)}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}toggleDay(e){this.schedule[e].enabled=!this.schedule[e].enabled,u(this.schedule),this.render()}patchDay(e,t){Object.assign(this.schedule[e],t),u(this.schedule)}toggleSelect(e){this.selected.has(e)?this.selected.delete(e):this.selected.add(e),this.render()}applyBulk(e,t,s,i,a){const l=this.selected.size?[...this.selected]:b;for(const c of l)e==="time"&&t&&(this.schedule[c].time=t,this.schedule[c].enabled=!0),(e==="brightness"||e==="all")&&s!==void 0&&i!==void 0&&(this.schedule[c].prewindowMin=s,this.schedule[c].pwmMax=p(i),a!==void 0&&(this.schedule[c].postHoldMin=a)),e==="all"&&t&&(this.schedule[c].time=t,this.schedule[c].enabled=!0);u(this.schedule),this.render()}async saveToDevice(){if(!this.transport)return;if(!b.some(t=>this.schedule[t].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await me(this.transport,this.schedule);const t=await _(this.transport),s=A(t);if(!Se(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await D(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const e=await _(this.transport);this.schedule=A(e),u(this.schedule),this.status=await D(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const e=ee(),t=ge(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${e?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
      </div>`:""}

      ${!e&&!Z()?`<div class="card warn">
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

      ${t?`<button class="btn btn-primary" id="btn-connect" ${this.busy?"disabled":""}>
        Connect via Bluetooth
      </button>`:""}

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
              <label>Brightness (${t.pwmMax}%)</label>
              <input type="range" min="${T}" max="${L}" value="${t.pwmMax}" data-field="pwmMax" data-day="${e}" ${t.enabled?"":"disabled"} />
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
    `}renderBrightnessTestCard(){const e=this.lampTestInterval!==null,t=e&&this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:e?"Test finished":"",s=e?t:"Optional — try brightness on the mask";return`
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
          <div class="lamp-test-brightness-controls">
            <input
              type="range"
              id="lamp-test-level"
              min="${T}"
              max="${L}"
              value="${this.lampTestLevel}"
              ${e||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              min="${T}"
              max="${L}"
              value="${this.lampTestLevel}"
              aria-label="Brightness percent"
              ${e||this.busy?"disabled":""}
            />
            <span class="lamp-test-unit">%</span>
          </div>
          <div class="field-row">
            <div>
              <label for="lamp-test-seconds">Duration (seconds)</label>
              <input
                type="number"
                id="lamp-test-seconds"
                min="${X}"
                max="${j}"
                value="${this.lampTestSeconds}"
                ${e||this.busy?"disabled":""}
              />
            </div>
          </div>
          <div class="lamp-test-actions">
            <button
              class="btn btn-primary"
              type="button"
              id="btn-lamp-test"
              ${e||this.busy?"disabled":""}
            >
              Try for ${this.lampTestSeconds}s
            </button>
            ${e?`<button class="btn btn-secondary" type="button" id="btn-lamp-cancel" ${this.busy?"disabled":""}>Cancel</button>`:""}
          </div>
          ${t&&this.lampTestExpanded?`<p class="lamp-test-countdown" id="lamp-test-countdown">${t}</p>`:""}
        </div>
      </div>
    `}renderEditor(){var i,a;const e=this.scheduleLoading,t=this.selected.size,s=t>0;return`
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
        ${this.status.preMin?`<div>Ramp: <strong>${this.status.preMin} min</strong></div>`:""}
        ${this.status.postHoldMin?`<div>Hold after alarm: <strong>${this.status.postHoldMin} min</strong></div>`:""}
        ${this.status.nvmOk!==void 0?`<div>Saved: <strong>${this.status.nvmOk?"yes":"no"}</strong></div>`:""}
        `}
      </div>

      ${(a=this.transport)!=null&&a.connected?this.renderBrightnessTestCard():""}

      <div class="card ${e?"loading":""}">
        <h2>Alarms</h2>
        ${b.map(l=>this.renderDayRow(l)).join("")}
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
          <label>Brightness (${f}%)</label>
          <input type="range" id="bulk-max" min="${T}" max="${L}" value="${f}" />
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
    `}render(){this.root.innerHTML=this.screen==="connect"?this.renderConnect():this.renderEditor(),this.bindEvents()}bindEvents(){var a,l,c,v,g,y,w,x,O,B,R,N,I,q,W,H,P,U;(a=this.root.querySelector("#btn-connect"))==null||a.addEventListener("click",()=>void this.connectBle()),(l=this.root.querySelector("#btn-disconnect"))==null||l.addEventListener("click",()=>void this.disconnect()),(c=this.root.querySelector("#btn-save"))==null||c.addEventListener("click",()=>void this.saveToDevice()),(v=this.root.querySelector("#btn-refresh"))==null||v.addEventListener("click",()=>void this.refreshFromDevice()),this.root.querySelectorAll("[data-action='toggle']").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.day;this.toggleDay(d)})}),this.root.querySelectorAll("[data-action='select']").forEach(r=>{r.addEventListener("click",d=>{d.stopPropagation();const h=r.dataset.day;this.toggleSelect(h)})}),this.root.querySelectorAll("[data-field]").forEach(r=>{const d=r,h=d.dataset.day,m=d.dataset.field;if(m==="enabled")return;const F=()=>{if(m==="prewindowMin"||m==="pwmMax"||m==="postHoldMin"){const S=m==="pwmMax"?p(Number(d.value)):Number(d.value);this.patchDay(h,{[m]:S})}else this.patchDay(h,{[m]:d.value})};if(d.type==="range"){d.addEventListener("input",()=>{const S=p(Number(d.value));this.patchDay(h,{pwmMax:S});const G=d.previousElementSibling;G&&(G.textContent=`Brightness (${S}%)`)});return}d.addEventListener("change",F),d.addEventListener("blur",F)}),(g=this.root.querySelector('[data-preset="weekdays"]'))==null||g.addEventListener("click",()=>{for(const r of["mon","tue","wed","thu","fri"])this.schedule[r].enabled=!0,this.schedule[r].time="06:30";u(this.schedule),this.render()}),(y=this.root.querySelector('[data-preset="weekend"]'))==null||y.addEventListener("click",()=>{for(const r of["sat","sun"])this.schedule[r].enabled=!0,this.schedule[r].time="08:00";u(this.schedule),this.render()}),(w=this.root.querySelector('[data-preset="copy-mon"]'))==null||w.addEventListener("click",()=>{const r={...this.schedule.mon};for(const d of b)this.schedule[d]={...r};u(this.schedule),this.render()});const e=()=>{var r;return((r=this.root.querySelector("#bulk-time"))==null?void 0:r.value)??"07:00"},t=()=>{var r;return Number(((r=this.root.querySelector("#bulk-pre"))==null?void 0:r.value)??20)},s=()=>{var r;return Number(((r=this.root.querySelector("#bulk-hold"))==null?void 0:r.value)??20)},i=()=>{var r;return p(Number(((r=this.root.querySelector("#bulk-max"))==null?void 0:r.value)??f))};(x=this.root.querySelector("#btn-lamp-test-toggle"))==null||x.addEventListener("click",()=>{this.toggleLampTestPanel()}),(O=this.root.querySelector("#lamp-test-level"))==null||O.addEventListener("input",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(B=this.root.querySelector("#lamp-test-level-num"))==null||B.addEventListener("input",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(R=this.root.querySelector("#lamp-test-level-num"))==null||R.addEventListener("change",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(N=this.root.querySelector("#lamp-test-level-num"))==null||N.addEventListener("blur",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(I=this.root.querySelector("#lamp-test-seconds"))==null||I.addEventListener("change",r=>{const d=r.target;this.lampTestSeconds=K(Number(d.value)),d.value=String(this.lampTestSeconds);const h=this.root.querySelector("#btn-lamp-test");h&&(h.textContent=`Try for ${this.lampTestSeconds}s`)}),(q=this.root.querySelector("#btn-lamp-test"))==null||q.addEventListener("click",()=>void this.tryLampBrightness()),(W=this.root.querySelector("#btn-lamp-cancel"))==null||W.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")}),(H=this.root.querySelector("#bulk-time-only"))==null||H.addEventListener("click",()=>{this.applyBulk("time",e())}),(P=this.root.querySelector("#bulk-bright-only"))==null||P.addEventListener("click",()=>{this.applyBulk("brightness",void 0,t(),i(),s())}),(U=this.root.querySelector("#bulk-all"))==null||U.addEventListener("click",()=>{this.applyBulk("all",e(),t(),i(),s())})}}const z=document.getElementById("app");z&&new Ee(z);
