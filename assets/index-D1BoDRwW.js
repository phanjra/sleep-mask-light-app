var Q=Object.defineProperty;var Z=(n,t,e)=>t in n?Q(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var o=(n,t,e)=>Z(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const y=1,v=100,L=50,G=1,K=60,Y=10;function w(n){const t=Math.round(Number(n));return Number.isFinite(t)?Math.max(y,Math.min(v,t)):L}function P(n){const t=Math.round(Number(n));return Number.isFinite(t)?Math.max(G,Math.min(K,t)):Y}const m=["mon","tue","wed","thu","fri","sat","sun"],B=["sun","mon","tue","wed","thu","fri","sat"],tt={sun:"S",mon:"M",tue:"T",wed:"W",thu:"T",fri:"F",sat:"S"},H={mon:"Monday",tue:"Tuesday",wed:"Wednesday",thu:"Thursday",fri:"Friday",sat:"Saturday",sun:"Sunday"},V="sml-draft-schedule-v2";function x(){return{enabled:!0,time:"07:00",prewindowMin:20,pwmMax:L,postHoldMin:20}}function O(){return Object.fromEntries(m.map(n=>[n,x()]))}function et(){try{const n=localStorage.getItem(V);if(n){const e=JSON.parse(n);return F(e)}const t=localStorage.getItem("sml-draft-schedule-v1");if(t){const e=JSON.parse(t);return F(e)}return null}catch{return null}}function F(n){const t=O();for(const e of m){const s=n[e];s&&(t[e]={enabled:s.enabled,time:s.time,prewindowMin:s.prewindowMin??20,pwmMax:w(s.pwmMax??L),postHoldMin:s.postHoldMin??20})}return t}function g(n){localStorage.setItem(V,JSON.stringify(n))}function M(n){const t=O();for(const e of n){const s=e.match(/^DAY\s+(mon|tue|wed|thu|fri|sat|sun)\s+(ON|OFF)\s+(\d{2}:\d{2})\s+(\d+)\s+(\d+)(?:\s+(\d+))?/i);if(!s)continue;const i=s[1].toLowerCase();t[i]={enabled:s[2].toUpperCase()==="ON",time:s[3],prewindowMin:Number(s[4]),pwmMax:w(Number(s[5])),postHoldMin:s[6]?Number(s[6]):20}}return t}function st(n,t){return m.every(e=>JSON.stringify(n[e])===JSON.stringify(t[e]))}function it(n){return JSON.stringify({enabled:n.enabled,time:n.time,prewindowMin:n.prewindowMin,pwmMax:n.pwmMax,postHoldMin:n.postHoldMin})}function I(n,t){return m.indexOf(n)-m.indexOf(t)}function b(n){const t=new Map;for(const i of m){const r=it(n[i]),a=t.get(r)??[];a.push(i),t.set(r,a)}const e=[];let s=0;for(const i of t.values()){i.sort(I);const r={...n[i[0]]};e.push({id:`alarm-${s++}`,days:i,slot:r})}return e.sort((i,r)=>{if(i.slot.enabled!==r.slot.enabled)return i.slot.enabled?-1:1;const a=i.slot.time.localeCompare(r.slot.time);return a!==0?a:I(i.days[0],r.days[0])}),e}const nt=new Set(["mon","tue","wed","thu","fri"]),rt=new Set(["sat","sun"]);function at(n){if(n.length===0)return"No days";const t=[...n].sort(I);return t.length===7?"Every day":t.length===5&&t.every(e=>nt.has(e))?"Weekdays":t.length===2&&t.every(e=>rt.has(e))?"Weekend":t.length===1?H[t[0]]:t.map(e=>H[e].slice(0,3)).join(", ")}function ot(n){return`${n.pwmMax}% brightness · ${n.prewindowMin} min ramp`}function lt(n,t,e){const s={...n};for(const i of t.days)s[i]={...s[i],enabled:e};return s}function dt(n,t,e,s){const i={...n},r=new Set(e);for(const a of t)r.has(a)||(i[a]={...x(),enabled:!1});for(const a of e)i[a]={...s};return i}function ct(n,t){const e={...n};for(const s of t.days)e[s]={...e[s],enabled:!1};return e}function ht(n){const t=m.find(l=>!n[l].enabled),e=t??"sat",s={...x(),enabled:!0,time:t?"07:00":"08:00"},i={...n,[e]:s},r=b(i),a=r.find(l=>l.days.includes(e)&&l.slot.time===s.time);return{schedule:i,groupId:(a==null?void 0:a.id)??r[r.length-1].id}}const $="6e400001-b5a3-f393-e0a9-e50e24dcca9e",ut="6e400002-b5a3-f393-e0a9-e50e24dcca9e",mt="6e400003-b5a3-f393-e0a9-e50e24dcca9e",D=200,A=3e3;class pt{constructor(){o(this,"device",null);o(this,"server",null);o(this,"rxChar",null);o(this,"buffer","");o(this,"queue",[]);o(this,"notifyWaiters",[]);o(this,"_connected",!1);o(this,"opChain",Promise.resolve());o(this,"onDisconnectCallback",null);o(this,"disconnectUserInitiated",!1)}get connected(){return this._connected}drainQueue(){const t=[...this.queue];return this.queue=[],t}setOnDisconnect(t){this.onDisconnectCallback=t}async connect(){var i;if(!navigator.bluetooth)throw new Error("Web Bluetooth is not available in this browser.");this.device=await navigator.bluetooth.requestDevice({filters:[{services:[$]}],optionalServices:[$]}),this.device.addEventListener("gattserverdisconnected",()=>{var a;this._connected=!1;const r=this.disconnectUserInitiated;this.disconnectUserInitiated=!1,(a=this.onDisconnectCallback)==null||a.call(this,r)});const t=await((i=this.device.gatt)==null?void 0:i.connect());if(!t)throw new Error("GATT connect failed");this.server=t;const e=await this.server.getPrimaryService($);this.rxChar=await e.getCharacteristic(ut);const s=await e.getCharacteristic(mt);await s.startNotifications(),s.addEventListener("characteristicvaluechanged",r=>{const l=r.target.value;if(!l)return;const d=new TextDecoder().decode(l);for(this.buffer+=d;this.buffer.includes(`
`);){const h=this.buffer.indexOf(`
`),u=this.buffer.slice(0,h).trim();if(this.buffer=this.buffer.slice(h+1),!u)continue;const p=this.notifyWaiters.shift();p?p(u):this.queue.push(u)}}),this._connected=!0}async withLock(t){const e=this.opChain.then(()=>t());return this.opChain=e.then(()=>{},()=>{}),e}async writeLine(t){if(!this.rxChar)throw new Error("Not connected");const e=new TextEncoder().encode(t+`
`);await this.rxChar.writeValueWithoutResponse(e)}async waitForLine(t){return this.queue.length?this.queue.shift():new Promise(e=>{const s=window.setTimeout(()=>{const r=this.notifyWaiters.indexOf(i);r>=0&&this.notifyWaiters.splice(r,1),e(null)},t),i=r=>{clearTimeout(s),e(r)};this.notifyWaiters.push(i)})}async send(t){return this.withLock(async()=>t?(await this.writeLine(t),this.collectLines(D,A)):this.collectLines(D,A))}async sendAndCollect(t,e=D,s=A,i){return this.withLock(async()=>(t&&await this.writeLine(t),this.collectLines(e,s,i)))}async collectLines(t,e,s){const i=[],r=Date.now()+e;for(;Date.now()<r;){const a=r-Date.now(),l=await this.waitForLine(Math.min(t,a));if(l===null){if(i.length)return i;continue}if(i.push(l),s!=null&&s(l,i))return i}return i}disconnect(){var t;this.disconnectUserInitiated=!0,(t=this.server)==null||t.disconnect(),this._connected=!1,this.device=null,this.server=null,this.rxChar=null,this.queue=[],this.notifyWaiters=[],this.opChain=Promise.resolve()}}const j=250,ft=8e3,gt=5e3,yt=200;function X(n){const t=`OK ${n}`;return e=>e===t||e.startsWith(`${t} `)}function vt(){const n=new Date(new Date().getFullYear(),0,1),t=new Date(new Date().getFullYear(),6,1),e=n.getTimezoneOffset(),s=t.getTimezoneOffset(),i=-e*60,a=e!==s?-Math.min(e,s)*60:0;return`TZ_OFFSET ${i} ${a}`}function bt(){const n=new Date,t=e=>String(e).padStart(2,"0");return`TIME ${n.getFullYear()}-${t(n.getMonth()+1)}-${t(n.getDate())} ${t(n.getHours())}:${t(n.getMinutes())}:${t(n.getSeconds())}`}function S(n){return n==="REQ_TIME"||n.startsWith("REQ_TIME ")}async function wt(n){let t=n.drainQueue().some(S);if((await n.send(vt())).some(S)&&(t=!0),!t){const s=Date.now()+2e3;for(;Date.now()<s;){const i=Math.max(100,Math.min(yt,s-Date.now())),r=await n.sendAndCollect("",i,Math.min(600,s-Date.now()),a=>S(a));if(r.some(S)){t=!0;break}if(!r.length)break}}}async function Tt(n){await n.send(bt())}async function C(n){return await Tt(n),Lt(n)}async function _(n){const t=await n.sendAndCollect("SCHED_GET",j,ft,X("SCHED_GET"));if(!t.some(e=>e.startsWith("OK SCHED_GET")))throw new Error("SCHED_GET failed");return t}async function St(n,t){const e=Object.keys(t);for(const i of e){const r=t[i];let a;r.enabled?a=`SCHED_DAY ${i} ${r.time} ${r.prewindowMin} ${r.pwmMax} ${r.postHoldMin}`:a=`SCHED_DAY ${i} OFF`;const l=await n.send(a);if(!l.some(d=>d.startsWith("OK SCHED_DAY")))throw new Error(`Failed to set ${i}: ${l.join(" ")}`)}if(!(await n.send("SAVE")).some(i=>i.includes("SAVE ok")))throw new Error("SAVE failed")}function Et(n){const t={};for(const e of n)e.startsWith("RTC: ")&&(t.rtc=e.slice(5)),e.startsWith("TODAY: ")&&(t.today=e.slice(7).trim()),e.startsWith("TODAY_ALARM: ")&&(t.todayAlarm=e.slice(13)),e.startsWith("ALARM(daily): ")&&(t.alarmDaily=e.slice(14)),e.startsWith("ALARM_AT: ")&&(t.alarmAt=e.slice(10)),e.startsWith("NEXT_RAMP: ")&&(t.nextRamp=e.slice(11)),e.startsWith("WAKE_CAUSE: ")&&(t.wakeCause=e.slice(12)),e.startsWith("BOOT_PATH: ")&&(t.bootPath=e.slice(11)),e.startsWith("NVM_OK: ")&&(t.nvmOk=e.includes("yes")),e.startsWith("PHASE: ")&&(t.phase=e.slice(7)),e.startsWith("TIME_SYNC_AUTO: ")&&(t.timeSync=e.slice(16)),e.startsWith("TIME_TRUSTED: ")&&(t.timeTrusted=e.includes("yes")),e.startsWith("PRE(min): ")&&(t.preMin=e.slice(10)),e.startsWith("POST_HOLD(min): ")&&(t.postHoldMin=e.slice(16));return t}async function Lt(n){const t=await n.sendAndCollect("STATUS_LITE",j,gt,X("STATUS_LITE"));if(t.some(e=>e.includes("ERR unknown cmd: STATUS_LITE")))return{};if(!t.some(e=>e.startsWith("OK STATUS_LITE")))throw new Error("STATUS_LITE failed");return Et(t)}async function Mt(n,t,e){const s=await n.send(`LAMP_TEST ${t} ${e}`);if(!s.some(i=>i.startsWith("OK LAMP_TEST")))throw new Error(s.find(i=>i.startsWith("ERR"))??"LAMP_TEST failed")}async function $t(n){const t=await n.send("LAMP_TEST_CANCEL");if(!t.some(e=>e==="OK LAMP_TEST_CANCEL"))throw new Error(t.find(e=>e.startsWith("ERR"))??"LAMP_TEST_CANCEL failed")}function N(){return typeof navigator<"u"&&!!navigator.bluetooth}function Dt(){return/iPad|iPhone|iPod/.test(navigator.userAgent)}function At(){return N()}function Ct(){return Dt()&&!N()}function _t(n){if(!n)return!1;const t=n instanceof DOMException||n instanceof Error?n.name:"",e=n instanceof Error?n.message:String(n),s=e.toLowerCase();return!!(t==="AbortError"||t==="NotFoundError"||s.includes("cancel")||s.includes("abort")||s.includes("chooser")||s.includes("dismiss")||/^\d+$/.test(e.trim()))}function E(n){const t=n.match(/^(\d{1,2}):(\d{2})$/);if(!t)return{hour12:7,minute:0,period:"AM"};let e=Number(t[1]);const s=Math.max(0,Math.min(59,Number(t[2])));Number.isFinite(e)||(e=7),e=(e%24+24)%24;const i=e>=12?"PM":"AM";let r=e%12;return r===0&&(r=12),{hour12:r,minute:s,period:i}}function z(n,t,e){let s=n%12;e==="PM"&&(s+=12),e==="AM"&&n===12&&(s=0),e==="PM"&&n===12&&(s=12);const i=Math.max(0,Math.min(59,Math.round(t)));return`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function k(n){const{hour12:t,minute:e,period:s}=E(n);return`${t}:${String(e).padStart(2,"0")} ${s}`}function It(n){const t=n.trim();if(!t)return null;const e=t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);if(e){const i=Number(e[1]),r=Number(e[2]);if(i<1||i>12||r>59)return null;const a=e[3].toUpperCase()==="PM"?"PM":"AM";return z(i,r,a)}const s=t.match(/^(\d{1,2}):(\d{2})$/);if(s){const i=Number(s[1]),r=Number(s[2]);return i>23||r>59?null:`${String(i).padStart(2,"0")}:${String(r).padStart(2,"0")}`}return null}const kt=Array.from({length:12},(n,t)=>t+1),xt=Array.from({length:60},(n,t)=>t),Ot=["AM","PM"],Nt=36;class Wt{constructor(t,e,s){o(this,"root");o(this,"onChange");o(this,"hour12");o(this,"minute");o(this,"period");o(this,"typeInput",null);o(this,"hourCol",null);o(this,"minuteCol",null);o(this,"periodCol",null);o(this,"syncing",!1);this.root=t,this.onChange=s;const i=E(e);this.hour12=i.hour12,this.minute=i.minute,this.period=i.period,this.render(),this.syncWheels(!1)}setTime24(t){const e=E(t);this.hour12=e.hour12,this.minute=e.minute,this.period=e.period,this.syncWheels(!1),this.syncTypeField()}getTime24(){return z(this.hour12,this.minute,this.period)}destroy(){this.root.innerHTML=""}emit(){const t=this.getTime24();this.syncTypeField(),this.onChange(t)}syncTypeField(){this.typeInput&&(this.typeInput.value=k(this.getTime24()))}render(){var t,e,s,i,r,a;this.root.innerHTML=`
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
          value="${k(this.getTime24())}"
        />
      </div>
    `,this.hourCol=this.root.querySelector('[data-wheel="hour"]'),this.minuteCol=this.root.querySelector('[data-wheel="minute"]'),this.periodCol=this.root.querySelector('[data-wheel="period"]'),this.typeInput=this.root.querySelector("#time-wheel-type"),this.hourCol&&this.fillColumn(this.hourCol,kt.map(String),"hour"),this.minuteCol&&this.fillColumn(this.minuteCol,xt.map(l=>String(l).padStart(2,"0")),"minute"),this.periodCol&&this.fillColumn(this.periodCol,Ot,"period"),(t=this.hourCol)==null||t.addEventListener("scroll",()=>this.onWheelScroll("hour"),{passive:!0}),(e=this.minuteCol)==null||e.addEventListener("scroll",()=>this.onWheelScroll("minute"),{passive:!0}),(s=this.periodCol)==null||s.addEventListener("scroll",()=>this.onWheelScroll("period"),{passive:!0}),(i=this.typeInput)==null||i.addEventListener("change",()=>this.onTypeCommit()),(r=this.typeInput)==null||r.addEventListener("blur",()=>this.onTypeCommit()),(a=this.typeInput)==null||a.addEventListener("keydown",l=>{l.key==="Enter"&&(l.preventDefault(),this.onTypeCommit(),l.target.blur())})}fillColumn(t,e,s){t.innerHTML=`<div class="time-wheel-spacer"></div>${e.map(i=>`<div class="time-wheel-item" data-kind="${s}" data-value="${i}">${i}</div>`).join("")}<div class="time-wheel-spacer"></div>`}scrollToValue(t,e,s){const i=t.querySelector(`[data-value="${e}"]`);if(!i)return;const r=i.offsetTop-t.clientHeight/2+Nt/2;t.scrollTo({top:r,behavior:s?"smooth":"auto"})}readWheel(t){const e=t.scrollTop+t.clientHeight/2,s=t.querySelectorAll(".time-wheel-item");let i=null,r=1/0;for(let a=0;a<s.length;a++){const l=s[a],d=l.offsetTop+l.offsetHeight/2,h=Math.abs(d-e);h<r&&(r=h,i=l)}return i?i.getAttribute("data-value")??"":""}onWheelScroll(t){if(this.syncing)return;const e=t==="hour"?this.hourCol:t==="minute"?this.minuteCol:this.periodCol;if(e){if(t==="hour"){const s=Number(this.readWheel(e));s>=1&&s<=12&&(this.hour12=s)}else if(t==="minute"){const s=Number(this.readWheel(e));s>=0&&s<=59&&(this.minute=s)}else{const s=this.readWheel(e);(s==="AM"||s==="PM")&&(this.period=s)}this.emit()}}onTypeCommit(){if(!this.typeInput)return;const t=It(this.typeInput.value);if(!t){this.syncTypeField();return}const e=E(t);this.hour12=e.hour12,this.minute=e.minute,this.period=e.period,this.syncWheels(!0),this.emit()}syncWheels(t){this.syncing=!0,this.hourCol&&this.scrollToValue(this.hourCol,String(this.hour12),t),this.minuteCol&&this.scrollToValue(this.minuteCol,String(this.minute).padStart(2,"0"),t),this.periodCol&&this.scrollToValue(this.periodCol,this.period,t),window.setTimeout(()=>{this.syncing=!1},t?200:0)}}class Rt{constructor(t){o(this,"root");o(this,"screen","connect");o(this,"transport",null);o(this,"schedule",et()??O());o(this,"status",{});o(this,"message","");o(this,"messageKind","");o(this,"busy",!1);o(this,"scheduleLoading",!1);o(this,"statusLoading",!1);o(this,"syncGeneration",0);o(this,"editingGroupId",null);o(this,"editDraft",null);o(this,"timePicker",null);o(this,"lampTestLevel",L);o(this,"lampTestSeconds",Y);o(this,"lampTestRemaining",0);o(this,"lampTestInterval",null);o(this,"lampTestExpanded",!1);this.root=t,this.render()}setMessage(t,e=""){this.message=t,this.messageKind=e,this.render()}async withBusy(t){this.busy=!0,this.render();try{await t()}catch(e){const s=e instanceof Error?e.message:String(e);this.setMessage(s,"error")}finally{this.busy=!1,this.render()}}async connectBle(){this.busy=!0,this.render();try{const t=new pt;t.setOnDisconnect(e=>this.onTransportDisconnect(e)),await t.connect(),this.transport=t,this.screen="editor",this.status={},this.scheduleLoading=!0,this.statusLoading=!0,this.setMessage("Connected — loading schedule in background…","ok"),this.loadDeviceData(t,++this.syncGeneration)}catch(t){if(_t(t))this.message="",this.messageKind="";else{const e=t instanceof Error?t.message:String(t);this.setMessage(e,"error")}}finally{this.busy=!1,this.render()}}async loadDeviceData(t,e){try{if(await wt(t),e!==this.syncGeneration)return;const s=await _(t);if(e!==this.syncGeneration)return;const i=await C(t);if(e!==this.syncGeneration)return;this.schedule=M(s),g(this.schedule),this.status=i,this.setMessage("Schedule loaded from mask.","ok")}catch(s){if(e!==this.syncGeneration)return;const i=s instanceof Error?s.message:String(s);this.setMessage(`Sync failed: ${i}`,"error")}finally{e===this.syncGeneration&&(this.scheduleLoading=!1,this.statusLoading=!1,this.render())}}clearLampTestUi(){this.lampTestInterval!==null&&(clearInterval(this.lampTestInterval),this.lampTestInterval=null),this.lampTestRemaining=0}async cancelLampTestOnDevice(t){var e;if(this.clearLampTestUi(),t&&((e=this.transport)!=null&&e.connected))try{await $t(this.transport)}catch{}this.render()}onTransportDisconnect(t){const e=this.lampTestInterval!==null||this.lampTestRemaining>0;this.clearLampTestUi(),!t&&e&&window.alert("Bluetooth disconnected during the brightness test. The lamp should be off — reconnect if you want to try again."),t||(this.syncGeneration++,this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage(e?"Connection lost during brightness test.":"Bluetooth disconnected.","error"))}async disconnect(){var t;try{await this.cancelLampTestOnDevice(!0)}finally{this.syncGeneration++,(t=this.transport)==null||t.disconnect(),this.transport=null,this.screen="connect",this.closeAlarmEdit(!1),this.status={},this.scheduleLoading=!1,this.statusLoading=!1,this.setMessage("")}}async tryLampBrightness(){var s;if(!((s=this.transport)!=null&&s.connected)||this.busy)return;const t=w(this.lampTestLevel),e=P(this.lampTestSeconds);this.lampTestLevel=t,this.lampTestSeconds=e,this.lampTestExpanded=!0,await this.withBusy(async()=>{await Mt(this.transport,t,e),this.clearLampTestUi(),this.lampTestRemaining=e,this.lampTestInterval=window.setInterval(()=>{this.lampTestRemaining=Math.max(0,this.lampTestRemaining-1);const i=this.root.querySelector("#lamp-test-countdown"),r=this.root.querySelector(".lamp-test-toggle-hint");i&&(i.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),r&&(r.textContent=this.lampTestRemaining>0?`Testing… ${this.lampTestRemaining}s left`:"Test finished"),this.lampTestRemaining<=0&&(this.clearLampTestUi(),this.render())},1e3),this.setMessage(`Trying ${t}% brightness for ${e}s…`,"ok")})}setLampTestLevel(t){this.lampTestLevel=w(t)}syncLampTestLevelInputs(){const t=this.root.querySelector("#lamp-test-level"),e=this.root.querySelector("#lamp-test-level-num");t&&(t.value=String(this.lampTestLevel)),e&&(e.value=String(this.lampTestLevel));const s=this.root.querySelector("#btn-lamp-test");s&&(s.textContent=`Try for ${this.lampTestSeconds}s`)}toggleLampTestPanel(){this.lampTestExpanded=!this.lampTestExpanded,this.render()}closeAlarmEdit(t){var e;if(t&&this.editDraft){if(this.editDraft.days.length===0){this.setMessage("Select at least one day for this alarm.","error");return}this.schedule=dt(this.schedule,this.editDraft.previousDays,this.editDraft.days,this.editDraft.slot),g(this.schedule)}this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen==="alarm-edit"&&(this.screen="editor",this.message="",this.messageKind="",this.render())}openAlarmEdit(t){const e=b(this.schedule).find(s=>s.id===t);e&&(this.editingGroupId=t,this.editDraft={previousDays:[...e.days],days:[...e.days],slot:{...e.slot}},this.screen="alarm-edit",this.render())}toggleGroupEnabled(t,e){e.stopPropagation(),this.schedule=lt(this.schedule,t,!t.slot.enabled),g(this.schedule),this.render()}addAlarm(){const{schedule:t,groupId:e}=ht(this.schedule);this.schedule=t,g(this.schedule),this.openAlarmEdit(e)}deleteEditingAlarm(){var e;if(!this.editingGroupId)return;const t=b(this.schedule).find(s=>s.id===this.editingGroupId);t&&(this.schedule=ct(this.schedule,t),g(this.schedule)),this.editingGroupId=null,this.editDraft=null,(e=this.timePicker)==null||e.destroy(),this.timePicker=null,this.screen="editor",this.render()}toggleEditDay(t){if(!this.editDraft)return;const e=new Set(this.editDraft.days);if(e.has(t)){if(e.size<=1)return;e.delete(t)}else e.add(t);this.editDraft.days=B.filter(s=>e.has(s)),this.render()}syncEditBrightnessInputs(t){const e=w(t);if(!this.editDraft)return;this.editDraft.slot.pwmMax=e;const s=this.root.querySelector("#edit-pwm-range"),i=this.root.querySelector("#edit-pwm-num");s&&(s.value=String(e)),i&&(i.value=String(e))}async saveToDevice(){if(!this.transport)return;if(!m.some(e=>this.schedule[e].enabled)){this.setMessage("Enable at least one day before saving.","error");return}await this.withBusy(async()=>{await St(this.transport,this.schedule);const e=await _(this.transport),s=M(e);if(!st(this.schedule,s))throw new Error("Device schedule does not match what was sent.");this.status=await C(this.transport),this.setMessage("Schedule saved to mask.","ok")})}async refreshFromDevice(){this.transport&&await this.withBusy(async()=>{const t=await _(this.transport);this.schedule=M(t),g(this.schedule),this.status=await C(this.transport),this.setMessage("Reloaded from mask.","ok")})}renderConnect(){const t=Ct(),e=At(),s=window.location.href;return`
      <h1>Sleep Mask Programmer</h1>
      <p class="subtitle">Set your week of wake-up alarms over Bluetooth. No account required.</p>

      ${t?`<div class="card warn">
        <h2>iPhone detected</h2>
        <p>Safari, Chrome, and other browsers on iPhone do not support Web Bluetooth. Install the free <strong>Bluefy</strong> browser, then open this page there:</p>
        <p><a href="https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055" target="_blank" rel="noopener">Get Bluefy on the App Store</a></p>
        <p style="word-break:break-all">${s}</p>
      </div>`:""}

      ${!t&&!N()?`<div class="card warn">
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
    `}renderAlarmListRow(t){const{slot:e,days:s,id:i}=t;return`
      <div class="alarm-row${e.enabled?"":" off"}" data-alarm-id="${i}" role="button" tabindex="0">
        <div class="alarm-row-main">
          <div class="alarm-time">${k(e.time)}</div>
          <div class="alarm-subtitle">${at(s)}</div>
          <div class="alarm-subtitle alarm-subtitle-detail">${ot(e)}</div>
        </div>
        <div
          class="toggle ${e.enabled?"on":""}"
          data-action="group-toggle"
          data-alarm-id="${i}"
          role="switch"
          aria-checked="${e.enabled}"
        ></div>
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
              min="${y}"
              max="${v}"
              value="${this.lampTestLevel}"
              ${t||this.busy?"disabled":""}
            />
            <input
              type="number"
              id="lamp-test-level-num"
              min="${y}"
              max="${v}"
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
                min="${G}"
                max="${K}"
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
    `}renderEditor(){var s,i;const t=this.scheduleLoading,e=b(this.schedule);return`
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
            ${B.map(i=>`
              <button
                type="button"
                class="repeat-chip ${s.has(i)?"on":""}"
                data-repeat-day="${i}"
              >${tt[i]}</button>`).join("")}
          </div>
        </div>

        <div class="alarm-edit-section">
          <label>Brightness</label>
          <div class="brightness-controls">
            <input
              type="range"
              id="edit-pwm-range"
              min="${y}"
              max="${v}"
              value="${t.pwmMax}"
            />
            <input
              type="number"
              id="edit-pwm-num"
              min="${y}"
              max="${v}"
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
      </div>
    `}render(){var t;(t=this.timePicker)==null||t.destroy(),this.timePicker=null,this.screen==="connect"?this.root.innerHTML=this.renderConnect():this.screen==="alarm-edit"?this.root.innerHTML=this.renderAlarmEdit():this.root.innerHTML=this.renderEditor(),this.bindEvents()}bindEvents(){if(this.screen==="connect"){this.bindConnectEvents();return}if(this.screen==="alarm-edit"){this.bindAlarmEditEvents();return}this.bindEditorEvents()}bindConnectEvents(){var t;(t=this.root.querySelector("#btn-connect"))==null||t.addEventListener("click",()=>void this.connectBle())}bindEditorEvents(){var e,s,i,r,a,l,d,h,u,p,W,R;(e=this.root.querySelector("#btn-disconnect"))==null||e.addEventListener("click",()=>void this.disconnect()),(s=this.root.querySelector("#btn-save"))==null||s.addEventListener("click",()=>void this.saveToDevice()),(i=this.root.querySelector("#btn-refresh"))==null||i.addEventListener("click",()=>void this.refreshFromDevice()),(r=this.root.querySelector("#btn-add-alarm"))==null||r.addEventListener("click",()=>this.addAlarm());const t=b(this.schedule);this.root.querySelectorAll(".alarm-row[data-alarm-id]").forEach(c=>{c.addEventListener("click",()=>{const f=c.dataset.alarmId;f&&this.openAlarmEdit(f)})}),this.root.querySelectorAll("[data-action='group-toggle']").forEach(c=>{c.addEventListener("click",f=>{const T=c.dataset.alarmId,q=t.find(J=>J.id===T);q&&this.toggleGroupEnabled(q,f)})}),(a=this.root.querySelector("#btn-lamp-test-toggle"))==null||a.addEventListener("click",()=>{this.toggleLampTestPanel()}),(l=this.root.querySelector("#lamp-test-level"))==null||l.addEventListener("input",c=>{this.setLampTestLevel(Number(c.target.value)),this.syncLampTestLevelInputs()}),(d=this.root.querySelector("#lamp-test-level-num"))==null||d.addEventListener("input",c=>{this.setLampTestLevel(Number(c.target.value)),this.syncLampTestLevelInputs()}),(h=this.root.querySelector("#lamp-test-level-num"))==null||h.addEventListener("change",c=>{this.setLampTestLevel(Number(c.target.value)),this.syncLampTestLevelInputs()}),(u=this.root.querySelector("#lamp-test-level-num"))==null||u.addEventListener("blur",c=>{this.setLampTestLevel(Number(c.target.value)),this.syncLampTestLevelInputs()}),(p=this.root.querySelector("#lamp-test-seconds"))==null||p.addEventListener("change",c=>{const f=c.target;this.lampTestSeconds=P(Number(f.value)),f.value=String(this.lampTestSeconds);const T=this.root.querySelector("#btn-lamp-test");T&&(T.textContent=`Try for ${this.lampTestSeconds}s`)}),(W=this.root.querySelector("#btn-lamp-test"))==null||W.addEventListener("click",()=>void this.tryLampBrightness()),(R=this.root.querySelector("#btn-lamp-cancel"))==null||R.addEventListener("click",()=>{this.cancelLampTestOnDevice(!0),this.setMessage("Brightness test cancelled.","ok")})}bindAlarmEditEvents(){var e,s,i,r,a,l;if(!this.editDraft)return;const t=this.root.querySelector("#time-wheel-mount");t&&(this.timePicker=new Wt(t,this.editDraft.slot.time,d=>{this.editDraft&&(this.editDraft.slot.time=d)})),(e=this.root.querySelector("#btn-edit-cancel"))==null||e.addEventListener("click",()=>this.closeAlarmEdit(!1)),(s=this.root.querySelector("#btn-edit-done"))==null||s.addEventListener("click",()=>{var d,h;if(this.editDraft){const u=Number(((d=this.root.querySelector("#edit-pre"))==null?void 0:d.value)??20),p=Number(((h=this.root.querySelector("#edit-hold"))==null?void 0:h.value)??20);this.editDraft.slot.prewindowMin=u,this.editDraft.slot.postHoldMin=p,this.editDraft.slot.enabled=!0}this.closeAlarmEdit(!0)}),(i=this.root.querySelector("#btn-delete-alarm"))==null||i.addEventListener("click",()=>{window.confirm("Delete this alarm?")&&this.deleteEditingAlarm()}),this.root.querySelectorAll("[data-repeat-day]").forEach(d=>{d.addEventListener("click",()=>{const h=d.dataset.repeatDay;this.toggleEditDay(h)})}),(r=this.root.querySelector("#edit-pwm-range"))==null||r.addEventListener("input",d=>{this.syncEditBrightnessInputs(Number(d.target.value))}),(a=this.root.querySelector("#edit-pwm-num"))==null||a.addEventListener("input",d=>{this.syncEditBrightnessInputs(Number(d.target.value))}),(l=this.root.querySelector("#edit-pwm-num"))==null||l.addEventListener("change",d=>{this.syncEditBrightnessInputs(Number(d.target.value))})}}const U=document.getElementById("app");U&&new Rt(U);
