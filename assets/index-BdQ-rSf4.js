var ie=Object.defineProperty;var ae=(i,e,t)=>e in i?ie(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var o=(i,e,t)=>ae(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();const $="6e400001-b5a3-f393-e0a9-e50e24dcca9e",re="6e400002-b5a3-f393-e0a9-e50e24dcca9e",oe="6e400003-b5a3-f393-e0a9-e50e24dcca9e",M=200,k=3e3;class le{constructor(){o(this,"device",null);o(this,"server",null);o(this,"rxChar",null);o(this,"buffer","");o(this,"queue",[]);o(this,"notifyWaiters",[]);o(this,"_connected",!1);o(this,"opChain",Promise.resolve());o(this,"onDisconnectCallback",null);o(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const e=[...this.queue];return this.queue=[],e}setOnDisconnect(e){this.onDisconnectCallback=e}async connect(){var n;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[$]}],optionalServices:[$]}),this.device.addEventListener("gattserverdisconnected",()=>{var l;this._connected=!1;const a=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(l=this.onDisconnectCallback)==null||l.call(this,a)});const e=await((n=this.device.gatt)==null?void 0:n.connect());if(!e)throw new Error("GATT connect failed");this.server=e;const t=await this.server.getPrimaryService($);this.rxChar=await t.getCharacteristic(re);const s=await t.getCharacteristic(oe);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",a=>{const d=a.target.value;if(!d)return;const w=new TextDecoder().decode(d);for(this.buffer+=w;this.buffer.includes(`
`);){const S=this.buffer.indexOf(`
`),T=this.buffer.slice(0,S).trim();if(this.buffer=this.buffer.slice(S+1),!T)continue;const L=this.notifyWaiters.shift();L?L(T):this.queue.push(T)}}),this._connected=!0}async withLock(e){const t=this.opChain.then(()=>e());return this.opChain=t.then(()=>{},()=>{}),t}async writeLine(e){if(!this.rxChar)throw new Error("Not connected");const t=new TextEncoder().encode(e+`
`);await this.rxChar.writeValueWithoutResponse(t)}async waitForLine(e){return this.queue.length?this.queue.shift():new Promise(t=>{const s=window.setTimeout(()=>{const a=this.notifyWaiters.indexOf(n);a>=0&&this.notifyWaiters.splice(a,1),t(null)},e),n=a=>{clearTimeout(s),t(a)};this.notifyWaiters.push(n)})}async send(e){return this.withLock(async()=>e?(await this.writeLine(e),this.collectLines(M,k)):this.collectLines(M,k))}async sendAndCollect(e,t=M,s=k,n){return this.withLock(async()=>(e&&await this.writeLine(e),this.collectLines(t,s,n)))}async collectLines(e,t,s){const n=[],a=Date.now()+t;for(;Date.now()<a;){const l=a-Date.now(),d=await this.waitForLine(Math.min(e,l));if(d===null){if(n.length)return n;continue}if(n.push(d),s!=null&&s(d,n))return n}return n}disconnect(){var e;this.disconnectUserInitiated=!0,(e=this.server)==null||e.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.opChain=Promise.resolve()}}const b=1,v=100,y=50,Q=1,Z=60,ee=10;function m(i){const e=Math.round(Number(i));return Number.isFinite(e)?Math.max(b,Math.min(v,e)):y}function j(i){const e=Math.round(Number(i));return Number.isFinite(e)?Math.max(Q,Math.min(Z,e)):ee}const te=250,ce=8e3,de=5e3,ue=200;function se(i){const e=`OK ${i}`;return t=>t===e||t.startsWith(`${e} `)}function he(){const i=new Date(new Date().getFullYear(),0,1),e=new Date(new Date().getFullYear(),6,1),t=i.getTimezoneOffset(),s=e.getTimezoneOffset(),n=-t*60,l=t!==s?-Math.min(t,s)*60:0;return`TZ_OFFSET ${n} ${l}`}function me(){const i=new Date,e=t=>String(t).padStart(2,"0");return`TIME ${i.getFullYear()}-${e(i.getMonth()+1)}-${e(i.getDate())} ${e(i.getHours())}:${e(i.getMinutes())}:${e(i.getSeconds())}`}function E(i){return i==="REQ_TIME"||i.startsWith("REQ_TIME ")}async function pe(i){let e=i.drainQueue().some(E);if((await i.send(he())).some(E)&&(e=!0),!e){const s=Date.now()+2e3;for(;Date.now()<s;){const n=Math.max(100,Math.min(ue,s-Date.now())),a=await i.sendAndCollect("",n,Math.min(600,s-Date.now()),l=>E(l));if(a.some(E)){e=!0;break}if(!a.length)break}}}async function fe(i){await i.send(me())}async function D(i){return await fe(i),ye(i)}async function x(i){const e=await i.sendAndCollect("SCHED_GET",te,ce,se("SCHED_GET"));if(!e.some(t=>t.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return e}async function be(i,e){const t=Object.keys(e);for(const n of t){const a=e[n];let l;a.enabled?l=`SCHED_DAY ${n} ${a.time} ${a.prewindowMin} ${a.pwmMax} ${a.postHoldMin}`:l=`SCHED_DAY ${n} OFF`;const d=await i.send(l);if(!d.some(w=>w.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${n}: ${d.join(" ")}`)}if(!(await i.send("SAVE")).some(n=>n.includes("SAVE ok")))throw new Error("SAVE failed")}function ve(i){const e={};for(const t of i)t.startsWith("RTC: ")&&(e.rtc=t.slice(5)),t.startsWith("TODAY: ")&&(e.today=t.slice(7).trim()),t.startsWith("TODAY_ALARM: ")&&(e.todayAlarm=t.slice(13)),t.startsWith("ALARM(daily): ")&&(e.alarmDaily=t.slice(14)),t.startsWith("ALARM_AT: ")&&(e.alarmAt=t.slice(10)),t.startsWith("NEXT_RAMP: ")&&(e.nextRamp=t.slice(11)),t.startsWith("WAKE_CAUSE: ")&&(e.wakeCause=t.slice(12)),t.startsWith("BOOT_PATH: ")&&(e.bootPath=t.slice(11)),t.startsWith("NVM_OK: ")&&(e.nvmOk=t.includes("yes")),t.startsWith("PHASE: ")&&(e.phase=t.slice(7)),t.startsWith("TIME_SYNC_AUTO: ")&&(e.timeSync=t.slice(16)),t.startsWith("TIME_TRUSTED: ")&&(e.timeTrusted=t.includes("yes")),t.startsWith("PRE(min): ")&&(e.preMin=t.slice(10)),t.startsWith("POST_HOLD(min): ")&&(e.postHoldMin=t.slice(16));return e}async function ye(i){const e=await i.sendAndCollect("STATUS_LITE",te,de,se("STATUS_LITE"));if(e.some(t=>t.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!e.some(t=>t.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return ve(e)}async function ge(i,e,t){const s=await i.send(`LAMP_TEST ${e} ${t}`);if(!s.some(n=>n.startsWith("OK LAMP_TEST")))throw new Error(s.find(n=>n.startsWith("ERR"))??"LAMP_TEST failed")}async function we(i){const e=await i.send("LAMP_TEST_CANCEL");if(!e.some(t=>t==="OK LAMP_TEST_CANCEL"))throw new Error(e.find(t=>t.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function A(){return typeof navigator<"u"&&!!navigator.bluetooth}function Te(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function Se(){return A()}function Le(){return Te()&&!A()}function Ee(i){if(!i)return!1;const e=i instanceof DOMException||i instanceof Error?i.name:"",t=i instanceof Error?i.message:String(i),s=t.toLowerCase();return!!(e==="AbortError"||e==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(t.trim()))}const g=["mon","tue","wed","thu","fri","sat","sun"],ne="sml-draft-schedule-v2";function $e(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:y,postHoldMin:20}}function C(){return Object.fromEntries(g.map(i=>[i,$e()]))}function Me(){try{const i=localStorage.getItem(ne);if(i){const t=JSON.parse(i);return V(t)}const e=localStorage.getItem("sml-draft-schedule-v1");if(e){const t=JSON.parse(e);return V(t)}return null}catch{return null}}function V(i){const e=C();for(const t of g){const s=i[t];s&&(e[t]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:m(s.pwmMax??y),postHoldMin:s.postHoldMin??20})}return e}function f(i){localStorage.setItem(ne,JSON.stringify(i))}function _(i){const e=C();for(const t of i){const s=t.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/i);if(!s)continue;const n=s[1].toLowerCase();e[n]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:Number(s[4]),pwmMax:m(Number(s[5])),postHoldMin:s[6]?Number(s[6]):20}}return e}function ke(i,e){return g.every(t=>JSON.stringify(i[t])===JSON.stringify(e[t]))}class De{constructor(e){o(this,"root");o(this,"screen","connect");o(this,"transport",null);o(this,"schedule",Me()??C());o(this,"selected",new Set);o(this,"status",{});o(this,"message","");o(this,"messageKind","");o(this,"busy",!1);o(this,"scheduleLoading",!1);o(this,"statusLoading",!1);o(this,"syncGeneration",0);o(this,"lampTestLevel",y);o(this,"lampTestSeconds",ee);o(this,"lampTestRemaining",0);o(this,"lampTestInterval",null);o(this,"lampTestExpanded",!1);this.root=e,this.render()}setMessage(e,t=""){this.message=e,this.messageKind=t,this.render()}async withBusy(e){this.busy=!0,this.render();try{await e()}catch(t){const s=t instanceof Error?t.message:String(t);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const e=new le;e.setOnDisconnect(t=>this.onTransportDisconnect(t)),await e.connect(),this.transport=e,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(e,++this.syncGeneration)}catch(e){if(Ee(e))this.message="",this.messageKind="";else{const t=e instanceof Error?e.message:String(e);this.setMessage(t,"error")}}finally{this.busy=!1,this.render()}}async loadDeviceData(e,t){try{if(await pe(e),t!==this.syncGeneration)return;const s=await x(e);if(t!==this.syncGeneration)return;const n=await D(e);if(t!==this.syncGeneration)return;this.schedule=_(s),f(this.schedule),this.status=n,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(t!==this.syncGeneration)return;const n=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${n}`,"error")}finally{t===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(e){var t;if(this.clearLampTestUi(),e&&((t=this.transport)!=null&&t.connected))try{await we(this.transport)}catch{}this.render()}onTransportDisconnect(e){const t=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!e&&t&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),e||(this.syncGeneration++,this.transport=null,this.screen="connect",this.selected.clear(),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(t?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var e;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(e=this.transport)==null||e.disconnect(),this.transport=null,this.screen="connect",this.selected.clear(),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const e=m(this.lampTestLevel),t=j(this.lampTestSeconds);this.lampTestLevel=e,this.lampTestSeconds=t,this.lampTestExpanded=!0,await this.withBusy(async()=>{await ge(this.transport,e,t),this.clearLampTestUi(),this.lampTestRemaining=t,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const n=this.root.querySelector("#lamp-test-countdown"),a=this.root.querySelector(".lamp-test-toggle-hint");n&&(n.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),a&&(a.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${e}% brightness for ${t}s…`,"ok")})}setLampTestLevel(e){this.lampTestLevel=m(e)}syncLampTestLevelInputs(){const e=this.root.querySelector("#lamp-test-level"),t=this.root.querySelector("#lamp-test-level-num");e&&(e.value=String(this.lampTestLevel)),t&&(t.value=String(this.lampTestLevel));const s=this.root.querySelector("#btn-lamp-test");s&&(s.textContent=`Try for ${this.lampTestSeconds}s`)}syncDayPwmMaxInputs(e,t){const s=m(t),n=this.root.querySelector(`.day-row[data-day="${e}"]`);if(!n)return;const a=n.querySelector('[data-field="pwmMax"][data-control="range"]'),l=n.querySelector('[data-field="pwmMax"][data-control="num"]');a&&(a.value=String(s)),l&&(l.value=String(s))}syncBulkMaxInputs(e){const t=m(e),s=this.root.querySelector("#bulk-max"),n=this.root.querySelector("#bulk-max-num");s&&(s.value=String(t)),n&&(n.value=String(t))}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}toggleDay(e){this.schedule[e].enabled=!this.schedule[e].enabled,f(this.schedule),this.render()}patchDay(e,t){Object.assign(this.schedule[e],t),f(this.schedule)}toggleSelect(e){this.selected.has(e)?this.selected.delete(e):this.selected.add(e),this.render()}applyBulk(e,t,s,n,a){const l=this.selected.size?[...this.selected]:g;for(const d of l)e==="time"&&t&&(this.schedule[d].time=t,this.schedule[d].enabled=!0),(e==="brightness"||e==="all")&&s!==void 0&&n!==void 0&&(this.schedule[d].prewindowMin=s,this.schedule[d].pwmMax=m(n),a!==void 0&&(this.schedule[d].postHoldMin=a)),e==="all"&&t&&(this.schedule[d].time=t,this.schedule[d].enabled=!0);f(this.schedule),this.render()}async saveToDevice(){if(!this.transport)return;if(!g.some(t=>this.schedule[t].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await be(this.transport,this.schedule);const t=await x(this.transport),s=_(t);if(!ke(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await D(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const e=await x(this.transport);this.schedule=_(e),f(this.schedule),this.status=await D(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const e=Le(),t=Se(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${e?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
      </div>`:""}

      ${!e&&!A()?`<div class="card warn">
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
    `}renderDayRow(e){const t=this.schedule[e],s=e.toUpperCase(),n=this.selected.has(e);return`
      <div class="day-row ${t.enabled?"":"disabled"} ${n?"selected":""}" data-day="${e}">
        <div class="day-head">
          <span class="day-label">${s}</span>
          <div class="toggle ${t.enabled?"on":""}" data-action="toggle" data-day="${e}" role="switch" aria-checked="${t.enabled}"></div>
          <button type="button" class="btn-secondary" style="width:auto;padding:0.2rem 0.45rem;font-size:0.7rem;margin:0" data-action="select" data-day="${e}">
            ${n?"✓":"○"}
          </button>
        </div>
        <div class="day-fields">
          <div>
            <label>Wake time</label>
            <input type="time" value="${t.time}" data-field="time" data-day="${e}" ${t.enabled?"":"disabled"} />
          </div>
          <div>
            <label>Brightness</label>
            <div class="brightness-controls">
              <input
                type="range"
                min="${b}"
                max="${v}"
                value="${t.pwmMax}"
                data-field="pwmMax"
                data-control="range"
                data-day="${e}"
                ${t.enabled?"":"disabled"}
              />
              <input
                type="number"
                min="${b}"
                max="${v}"
                value="${t.pwmMax}"
                data-field="pwmMax"
                data-control="num"
                data-day="${e}"
                aria-label="Brightness percent"
                ${t.enabled?"":"disabled"}
              />
              <span class="brightness-unit">%</span>
            </div>
          </div>
          <div class="field-row">
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
          <div class="brightness-controls">
            <input
              type="range"
              id="lamp-test-level"
              min="${b}"
              max="${v}"
              value="${this.lampTestLevel}"
              ${e||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              min="${b}"
              max="${v}"
              value="${this.lampTestLevel}"
              aria-label="Brightness percent"
              ${e||this.busy?"disabled":""}
            />
            <span class="brightness-unit">%</span>
          </div>
          <div class="field-row">
            <div>
              <label for="lamp-test-seconds">Duration (seconds)</label>
              <input
                type="number"
                id="lamp-test-seconds"
                min="${Q}"
                max="${Z}"
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
    `}renderEditor(){var n,a;const e=this.scheduleLoading,t=this.selected.size,s=t>0;return`
      <h1>Week schedule</h1>
      <p class="subtitle">${(n=this.transport)!=null&&n.connected?"Connected":"Disconnected"} · tap ○ to select days for bulk edit</p>

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
        ${g.map(l=>this.renderDayRow(l)).join("")}
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
          <div class="brightness-controls">
            <input type="range" id="bulk-max" min="${b}" max="${v}" value="${y}" />
            <input
              type="number"
              id="bulk-max-num"
              min="${b}"
              max="${v}"
              value="${y}"
              aria-label="Brightness percent"
            />
            <span class="brightness-unit">%</span>
          </div>
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
    `}render(){this.root.innerHTML=this.screen==="connect"?this.renderConnect():this.renderEditor(),this.bindEvents()}bindEvents(){var a,l,d,w,S,T,L,O,B,I,q,N,R,W,P,H,U,F,G,K,Y;(a=this.root.querySelector("#btn-connect"))==null||a.addEventListener("click",()=>void this.connectBle()),(l=this.root.querySelector("#btn-disconnect"))==null||l.addEventListener("click",()=>void this.disconnect()),(d=this.root.querySelector("#btn-save"))==null||d.addEventListener("click",()=>void this.saveToDevice()),(w=this.root.querySelector("#btn-refresh"))==null||w.addEventListener("click",()=>void this.refreshFromDevice()),this.root.querySelectorAll("[data-action='toggle']").forEach(r=>{r.addEventListener("click",()=>{const c=r.dataset.day;this.toggleDay(c)})}),this.root.querySelectorAll("[data-action='select']").forEach(r=>{r.addEventListener("click",c=>{c.stopPropagation();const u=r.dataset.day;this.toggleSelect(u)})}),this.root.querySelectorAll("[data-field]").forEach(r=>{const c=r,u=c.dataset.day,h=c.dataset.field;if(h==="enabled")return;const z=()=>{if(h==="prewindowMin"||h==="pwmMax"||h==="postHoldMin"){const p=h==="pwmMax"?m(Number(c.value)):Number(c.value);this.patchDay(u,{[h]:p})}else this.patchDay(u,{[h]:c.value})};if(c.type==="range"&&h==="pwmMax"){c.addEventListener("input",()=>{const p=m(Number(c.value));this.patchDay(u,{pwmMax:p}),this.syncDayPwmMaxInputs(u,p)});return}if(c.type==="number"&&h==="pwmMax"){const p=()=>{const X=m(Number(c.value));this.patchDay(u,{pwmMax:X}),this.syncDayPwmMaxInputs(u,X)};c.addEventListener("input",p),c.addEventListener("change",p),c.addEventListener("blur",p);return}c.type!=="range"&&(c.addEventListener("change",z),c.addEventListener("blur",z))}),(S=this.root.querySelector('[data-preset="weekdays"]'))==null||S.addEventListener("click",()=>{for(const r of["mon","tue","wed","thu","fri"])this.schedule[r].enabled=!0,this.schedule[r].time="06:30";f(this.schedule),this.render()}),(T=this.root.querySelector('[data-preset="weekend"]'))==null||T.addEventListener("click",()=>{for(const r of["sat","sun"])this.schedule[r].enabled=!0,this.schedule[r].time="08:00";f(this.schedule),this.render()}),(L=this.root.querySelector('[data-preset="copy-mon"]'))==null||L.addEventListener("click",()=>{const r={...this.schedule.mon};for(const c of g)this.schedule[c]={...r};f(this.schedule),this.render()});const e=()=>{var r;return((r=this.root.querySelector("#bulk-time"))==null?void 0:r.value)??"07:00"},t=()=>{var r;return Number(((r=this.root.querySelector("#bulk-pre"))==null?void 0:r.value)??20)},s=()=>{var r;return Number(((r=this.root.querySelector("#bulk-hold"))==null?void 0:r.value)??20)},n=()=>{var u,h;const r=(u=this.root.querySelector("#bulk-max-num"))==null?void 0:u.value,c=(h=this.root.querySelector("#bulk-max"))==null?void 0:h.value;return m(Number(r??c??y))};(O=this.root.querySelector("#bulk-max"))==null||O.addEventListener("input",r=>{this.syncBulkMaxInputs(Number(r.target.value))}),(B=this.root.querySelector("#bulk-max-num"))==null||B.addEventListener("input",r=>{this.syncBulkMaxInputs(Number(r.target.value))}),(I=this.root.querySelector("#bulk-max-num"))==null||I.addEventListener("change",r=>{this.syncBulkMaxInputs(Number(r.target.value))}),(q=this.root.querySelector("#btn-lamp-test-toggle"))==null||q.addEventListener("click",()=>{this.toggleLampTestPanel()}),(N=this.root.querySelector("#lamp-test-level"))==null||N.addEventListener("input",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(R=this.root.querySelector("#lamp-test-level-num"))==null||R.addEventListener("input",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(W=this.root.querySelector("#lamp-test-level-num"))==null||W.addEventListener("change",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(P=this.root.querySelector("#lamp-test-level-num"))==null||P.addEventListener("blur",r=>{this.setLampTestLevel(Number(r.target.value)),this.syncLampTestLevelInputs()}),(H=this.root.querySelector("#lamp-test-seconds"))==null||H.addEventListener("change",r=>{const c=r.target;this.lampTestSeconds=j(Number(c.value)),c.value=String(this.lampTestSeconds);const u=this.root.querySelector("#btn-lamp-test");u&&(u.textContent=`Try for ${this.lampTestSeconds}s`)}),(U=this.root.querySelector("#btn-lamp-test"))==null||U.addEventListener("click",()=>void this.tryLampBrightness()),(F=this.root.querySelector("#btn-lamp-cancel"))==null||F.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")}),(G=this.root.querySelector("#bulk-time-only"))==null||G.addEventListener("click",()=>{this.applyBulk("time",e())}),(K=this.root.querySelector("#bulk-bright-only"))==null||K.addEventListener("click",()=>{this.applyBulk("brightness",void 0,t(),n(),s())}),(Y=this.root.querySelector("#bulk-all"))==null||Y.addEventListener("click",()=>{this.applyBulk("all",e(),t(),n(),s())})}}const J=document.getElementById("app");J&&new De(J);
