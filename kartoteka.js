let allTreatments;
try{allTreatments=JSON.parse(localStorage.getItem('kartoteka-treatments'))||{}}catch{allTreatments={}}
const defaultTreatmentItems=[{title:'Profesionalno čišćenje',detail:'Završeno · 14.09.2026.',price:'80 KM',state:'done',marker:'✓'},{title:'Kompozitni ispun · zub 26',detail:'Planirano · 24.09.2026.',price:'100 KM',state:'progress',marker:'2'},{title:'Kontrolni pregled',detail:'Na čekanju',price:'—',state:'waiting',marker:'3'}];
let appToastTimer;
function showToast(message){const toast=document.querySelector('#app-toast');if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(appToastTimer);appToastTimer=setTimeout(()=>toast.classList.remove('show'),3500)}
function getTreatments(){return allTreatments[selected]||defaultTreatmentItems}
function renderTreatments(){const listElement=document.querySelector('.treatment-list');if(!listElement)return;listElement.innerHTML=getTreatments().map(item=>`<li><span class="${item.state}">${item.marker}</span><div><strong>${item.title}</strong><p>${item.detail}</p></div><b>${item.price}</b></li>`).join('')}
function saveTreatments(){localStorage.setItem('kartoteka-treatments',JSON.stringify(allTreatments))}
function addTreatment(){const title=window.prompt('Naziv terapije ili zahvata:');if(!title?.trim())return;const amount=window.prompt('Iznos u KM (nije obavezno):','');const items=[...getTreatments()];items.push({title:title.trim(),detail:'Planirano · upravo dodano',price:amount?.trim()?`${amount.trim()} KM`:'—',state:'waiting',marker:String(items.length+1)});allTreatments[selected]=items;saveTreatments();renderTreatments();showToast('Stavka terapije je dodana za odabranog pacijenta.')}
function titleCase(value=''){return value.toLocaleLowerCase('bs-BA').replace(/(^|[\s-])(\p{L})/gu,(match,prefix,letter)=>`${prefix}${letter.toLocaleUpperCase('bs-BA')}`)}
function editCurrentPatient(){const patient=patients.find(item=>item.id===selected);if(!patient)return;const name=window.prompt('Ime i prezime:',patient.name);if(name===null||!name.trim())return;const father=window.prompt('Ime oca:',patient.father);if(father===null)return;const phone=window.prompt('Telefon:',patient.phone);if(phone===null)return;const email=window.prompt('E-mail:',patient.email);if(email===null)return;const address=window.prompt('Adresa:',patient.address);if(address===null)return;patient.name=titleCase(name.trim());patient.father=titleCase(father.trim())||'Nije uneseno';patient.phone=phone.trim()||'Nije uneseno';patient.email=email.trim()||'Nije uneseno';patient.address=titleCase(address.trim())||'Nije uneseno';patient.initials=patient.name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase();localStorage.setItem('kartoteka-patients',JSON.stringify(patients));showPatient(patient.id);showToast('Osnovni podaci pacijenta su sačuvani lokalno.')}
document.addEventListener('DOMContentLoaded',()=>{renderTreatments();document.querySelectorAll('.contact-card .card-heading button,.record-actions .secondary-button').forEach(button=>button.addEventListener('click',editCurrentPatient));document.querySelector('.icon-button').addEventListener('click',()=>showToast('Nema novih obavijesti.'));document.querySelector('.more-button').addEventListener('click',()=>showToast(`Otvoren je zapis pacijenta #${selected}.`));document.querySelector('.next-visit .card-heading button').addEventListener('click',()=>{openAppointmentDialog();const form=document.querySelector('#appointment-form');form.elements.namedItem('name').value=patients.find(item=>item.id===selected)?.name||'';form.dataset.patientId=selected});document.querySelector('.treatment-list').closest('.card').querySelector('.card-heading button').addEventListener('click',addTreatment);document.querySelector('.timeline').closest('.card').querySelector('.card-heading button').addEventListener('click',()=>{activateTab('posjete');showToast('Otvorena je puna historija posjeta.')});document.querySelectorAll('.main-nav a').forEach((link,index)=>link.addEventListener('click',event=>{if(index===1)return;event.preventDefault();if(index===0){activateTab('pregled');showToast('Prikazan je pregled pacijenta.')}else if(index===2){activateTab('posjete');showToast('Prikazani su termini i posjete pacijenta.')}else if(index===3){activateTab('zubi');showToast('Finansije po zahvatu dostupne su uz status zuba.')}else showToast('Postavke će biti dostupne nakon povezivanja sa sigurnim serverom.')}));});

let dashboardDay=new Date(),dashboardMonth=new Date(dashboardDay.getFullYear(),dashboardDay.getMonth(),1);
function loadDemoArray(key,fallback=[]){try{const saved=localStorage.getItem(key);if(saved===null)return JSON.parse(JSON.stringify(fallback));const value=JSON.parse(saved);return Array.isArray(value)?value:[]}catch{return JSON.parse(JSON.stringify(fallback))}}
function demoFutureDate(offset){const date=new Date();date.setDate(date.getDate()+offset);return dateKey(date)}
const dashboardAppointments=loadDemoArray('kartoteka-appointments');
const waitingEntries=loadDemoArray('kartoteka-waiting-list');
const defaultOnlineRequests=[
  {id:'web-demo-1',name:'Selma Bećirović',phone:'+387 61 222 345',email:'',service:'Opći stomatološki pregled',date:demoFutureDate(2),time:'11:00',confirmationMethod:'WhatsApp',note:'Prvi pregled.',status:'Novi',createdAt:new Date().toISOString()},
  {id:'web-demo-2',name:'Adnan Šabić',phone:'+387 62 418 720',email:'adnan.sabic@example.com',service:'Kontrolni pregled',date:demoFutureDate(3),time:'15:00',confirmationMethod:'E-mail',note:'Kontrola nakon terapije.',status:'Novi',createdAt:new Date().toISOString()},
  {id:'web-demo-3',name:'Mina Kovačević',phone:'+387 60 310 988',email:'',service:'Preventivna stomatologija',date:demoFutureDate(5),time:'10:00',confirmationMethod:'SMS poruka',note:'',status:'Novi',createdAt:new Date().toISOString()}
];
const onlineRequests=loadDemoArray('kartoteka-online-requests',defaultOnlineRequests);
let requestFilter='svi';
const dashboardMonths=['januar','februar','mart','april','maj','juni','juli','august','septembar','oktobar','novembar','decembar'];
const dashboardWeekdays=['nedjelja','ponedjeljak','utorak','srijeda','četvrtak','petak','subota'];
const dailyMessages=['Jedan pažljiv pregled može nekome promijeniti cijeli dan.','Strpljenje, preciznost i osmijeh uvijek ostavljaju trag.','Mali koraci svaki dan donose veliku razliku.','Dobar rad počinje dobrom pripremom.','Vaša stručnost pacijentu donosi sigurnost.','Najbolji rezultat dolazi iz pažnje prema svakom detalju.','Neka današnji rad bude razlog za nečiji mirniji osmijeh.','Organizovan dan ostavlja više prostora za ono važno.','Kvalitet se gradi jednim pažljivo urađenim korakom.','Svaka zdrava navika počinje jednim dobrim savjetom.'];
let dailyMessageIndex;
function dateKey(date){const local=new Date(date.getTime()-date.getTimezoneOffset()*60000);return local.toISOString().slice(0,10)}
function renderDailyMessage(index){const key=`kartoteka-daily-message-${dateKey(dashboardDay)}`;if(Number.isInteger(index))dailyMessageIndex=index%dailyMessages.length;else{const saved=Number(localStorage.getItem(key));dailyMessageIndex=Number.isInteger(saved)&&saved>=0&&saved<dailyMessages.length?saved:Math.abs([...dateKey(dashboardDay)].reduce((total,char)=>total+char.charCodeAt(0),0))%dailyMessages.length}localStorage.setItem(key,String(dailyMessageIndex));document.querySelector('#daily-message-text').textContent=dailyMessages[dailyMessageIndex]}
function formatDashboardDate(date){return `${dashboardWeekdays[date.getDay()]}, ${String(date.getDate()).padStart(2,'0')}. ${dashboardMonths[date.getMonth()]} ${date.getFullYear()}.`}
function getDayTasks(){const key=`kartoteka-day-tasks-${dateKey(dashboardDay)}`;try{return JSON.parse(localStorage.getItem(key))||[{text:'Pozivi pacijentima',done:false},{text:'Naručivanje robe',done:false},{text:'Čišćenje i sterilizacija',done:false}]}catch{return []}}
function saveDayTasks(tasks){localStorage.setItem(`kartoteka-day-tasks-${dateKey(dashboardDay)}`,JSON.stringify(tasks))}
function renderTasks(){const tasks=getDayTasks(),target=document.querySelector('#task-list');target.innerHTML=tasks.map((task,index)=>`<label class="task-item"><input type="checkbox" data-task="${index}" ${task.done?'checked':''}><span>${escapeHtml(task.text)}</span><button type="button" data-remove-task="${index}" aria-label="Ukloni obavezu">×</button></label>`).join('')||'<p class="empty-tasks">Nema obaveza za ovaj dan.</p>';document.querySelector('#task-progress').textContent=tasks.length?`${tasks.filter(task=>task.done).length}/${tasks.length} završeno`:''}
function renderDayNote(){const key=`kartoteka-day-note-${dateKey(dashboardDay)}`;document.querySelector('#day-note').value=localStorage.getItem(key)||'';document.querySelector('#day-note-state').textContent=''}
function renderAgenda(){
  const target=document.querySelector('#agenda-list');
  const items=dashboardAppointments.filter(item=>item.date===dateKey(dashboardDay)).sort((a,b)=>a.time.localeCompare(b.time));
  const statuses=['Zakazan','Potvrđen','Došao','Završen','Nije došao','Otkazan'];
  target.innerHTML=items.length?items.map(item=>`<div class="agenda-item"><time>${escapeHtml(item.time)}</time><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.type)} · ${Number(item.duration)||30} min</span><select aria-label="Status termina za ${escapeHtml(item.name)}" data-appointment-status="${escapeHtml(item.id)}">${statuses.map(status=>`<option ${item.status===status?'selected':''}>${status}</option>`).join('')}</select></div></div>`).join(''):'<p class="empty-tasks">Nema upisanih termina.</p>';
  document.querySelector('#agenda-count').textContent=items.length?`${items.length} termina`:'';
}
function renderCalendar(){const firstDay=new Date(dashboardMonth.getFullYear(),dashboardMonth.getMonth(),1),lastDay=new Date(dashboardMonth.getFullYear(),dashboardMonth.getMonth()+1,0),start=(firstDay.getDay()+6)%7,days=[];document.querySelector('#calendar-month').textContent=`${dashboardMonths[dashboardMonth.getMonth()]} ${dashboardMonth.getFullYear()}.`;for(let index=0;index<start;index++)days.push('<span class="calendar-empty"></span>');for(let day=1;day<=lastDay.getDate();day++){const value=new Date(dashboardMonth.getFullYear(),dashboardMonth.getMonth(),day),key=dateKey(value),hasEvents=dashboardAppointments.some(item=>item.date===key&&item.status!=='Otkazan'),classes=[dateKey(value)===dateKey(dashboardDay)?'selected':'',dateKey(value)===dateKey(new Date())?'today':'',hasEvents?'has-event':''].filter(Boolean).join(' ');days.push(`<button class="${classes}" data-calendar-date="${key}" type="button">${day}</button>`)}document.querySelector('#calendar-days').innerHTML=days.join('')}
function renderDashboard(){document.querySelector('#dashboard-date').textContent=formatDashboardDate(dashboardDay);renderOnlineRequests();renderCalendar();renderAgenda();renderWaitlist();renderTasks();renderDayNote();renderDailyMessage()}
function showDashboard(navIndex=0){document.querySelector('#dashboard').hidden=false;document.querySelector('#workspace').hidden=true;document.querySelector('#new-patient').hidden=true;document.querySelector('#topbar-eyebrow').textContent='DNEVNI PREGLED';document.querySelector('#topbar-title').textContent='Raspored ordinacije';document.querySelectorAll('.main-nav a').forEach((link,index)=>link.classList.toggle('active',index===navIndex));renderDashboard()}
function showWorkspace(){document.querySelector('#dashboard').hidden=true;document.querySelector('#workspace').hidden=false;document.querySelector('#new-patient').hidden=false;document.querySelector('#topbar-eyebrow').textContent='E-KARTOTEKA';document.querySelector('#topbar-title').textContent='Pacijenti';document.querySelectorAll('.main-nav a').forEach((link,index)=>link.classList.toggle('active',index===1))}
document.querySelector('.main-nav').addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;setMobileMenu(false);const links=[...document.querySelectorAll('.main-nav a')],index=links.indexOf(link);if(index<=4){event.preventDefault();event.stopPropagation();if(index===0)showDashboard();if(index===1)showWorkspace();if(index===2){showDashboard(2);document.querySelector('#online-zahtjevi').scrollIntoView({behavior:'smooth',block:'start'})}if(index===3){showDashboard(3);document.querySelector('#lista-cekanja').scrollIntoView({behavior:'smooth',block:'start'})}if(index===4){showWorkspace();activateTab('zubi')}}},true);
document.querySelector('#calendar-prev').addEventListener('click',()=>{dashboardMonth=new Date(dashboardMonth.getFullYear(),dashboardMonth.getMonth()-1,1);renderCalendar()});
document.querySelector('#calendar-next').addEventListener('click',()=>{dashboardMonth=new Date(dashboardMonth.getFullYear(),dashboardMonth.getMonth()+1,1);renderCalendar()});
document.querySelector('#dashboard-today').addEventListener('click',()=>{dashboardDay=new Date();dashboardMonth=new Date(dashboardDay.getFullYear(),dashboardDay.getMonth(),1);renderDashboard()});
document.querySelector('#calendar-days').addEventListener('click',event=>{const button=event.target.closest('[data-calendar-date]');if(!button)return;dashboardDay=new Date(`${button.dataset.calendarDate}T12:00:00`);renderDashboard()});
document.querySelector('#save-day-note').addEventListener('click',()=>{localStorage.setItem(`kartoteka-day-note-${dateKey(dashboardDay)}`,document.querySelector('#day-note').value);document.querySelector('#day-note-state').textContent='Napomena je sačuvana lokalno.'});
document.querySelector('#next-daily-message').addEventListener('click',()=>renderDailyMessage((dailyMessageIndex+1)%dailyMessages.length));
document.querySelector('#task-form').addEventListener('submit',event=>{event.preventDefault();const input=document.querySelector('#task-input'),text=input.value.trim();if(!text)return;const tasks=getDayTasks();tasks.push({text,done:false});saveDayTasks(tasks);input.value='';renderTasks()});
document.querySelector('#task-list').addEventListener('click',event=>{const remove=event.target.closest('[data-remove-task]');if(remove){const tasks=getDayTasks();tasks.splice(Number(remove.dataset.removeTask),1);saveDayTasks(tasks);renderTasks();return}const checkbox=event.target.closest('[data-task]');if(checkbox){const tasks=getDayTasks();tasks[Number(checkbox.dataset.task)].done=checkbox.checked;saveDayTasks(tasks);renderTasks()}});
document.querySelectorAll('[data-title-case]').forEach(input=>input.addEventListener('input',event=>{const position=event.target.selectionStart;event.target.value=titleCase(event.target.value);event.target.setSelectionRange(position,position)}));
showDashboard();

let allVisits,selectedVisitId=null;
try{allVisits=JSON.parse(localStorage.getItem('kartoteka-visits'))||{}}catch{allVisits={}}
if(!allVisits['000124'])allVisits['000124']=[{id:'demo-visit-1',date:'2026-09-14',time:'10:15',type:'Higijenski tretman',reason:'Redovni pregled i profesionalno čišćenje.',findings:'Prisutan supragingivalni kamenac. Sluznica bez patoloških promjena.',diagnosis:'Dentalni plak i kamenac.',treatment:'Uklanjanje kamenca i poliranje zuba.',recommendations:'Redovna oralna higijena i interdentalne četkice.',nextVisit:'2027-03-14'}];
const visitForm=document.querySelector('#visit-form');
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]))}
function formatVisitDate(value){if(!value)return 'Nije uneseno';const date=new Date(`${value}T12:00:00`);return Number.isNaN(date)?value:date.toLocaleDateString('bs-BA',{day:'2-digit',month:'2-digit',year:'numeric'})}
function getVisits(){return allVisits[selected]||[]}
function renderPrintVisit(visit){const patient=patients.find(item=>item.id===selected);const rows=[['Datum i vrijeme',`${formatVisitDate(visit.date)}${visit.time?` · ${visit.time}`:''}`],['Vrsta posjete',visit.type],['Razlog dolaska',visit.reason],['Klinički nalaz',visit.findings],['Dijagnoza',visit.diagnosis],['Izvedena terapija',visit.treatment],['Preporuke',visit.recommendations],['Naredna kontrola',visit.nextVisit?formatVisitDate(visit.nextVisit):'Prema potrebi']];document.querySelector('#printable-visit').innerHTML=`<header><strong>Dr Kunić Tarik</strong><span>Stomatološka ordinacija · Humska 11, Sarajevo</span></header><h1>Nalaz stomatološke posjete</h1><p class="print-patient"><b>Pacijent:</b> ${escapeHtml(displayName(patient))} &nbsp; <b>Kartonski broj:</b> #${escapeHtml(patient.id)}</p><dl>${rows.map(([label,value])=>`<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value||'Nije uneseno')}</dd></div>`).join('')}</dl><footer><span>Doktor stomatologije: Dr Tarik Kunić</span><span>Datum štampe: ${new Date().toLocaleDateString('bs-BA')}</span></footer>`}
function renderVisitHistory(){const target=document.querySelector('#visit-history-list'),visits=[...getVisits()].sort((a,b)=>`${b.date}${b.time||''}`.localeCompare(`${a.date}${a.time||''}`));target.innerHTML=visits.length?visits.map(visit=>`<button class="visit-history-item ${visit.id===selectedVisitId?'active':''}" type="button" data-visit-id="${escapeHtml(visit.id)}"><span>${formatVisitDate(visit.date)}</span><strong>${escapeHtml(visit.type)}</strong><small>${escapeHtml(visit.diagnosis||visit.reason||'Bez dodatne napomene')}</small></button>`).join(''):'<p class="empty-visits">Još nema sačuvanih posjeta.</p>'}
function startNewVisit(){selectedVisitId=null;visitForm.reset();visitForm.elements.date.value=new Date().toISOString().slice(0,10);document.querySelector('#visit-state').textContent='Novi zapis';document.querySelector('#visit-saved').textContent='';document.querySelector('#print-visit').disabled=true;document.querySelector('#email-visit').disabled=true;renderVisitHistory()}
function loadVisit(visitId){const visit=getVisits().find(item=>item.id===visitId);if(!visit)return;selectedVisitId=visit.id;Object.entries(visit).forEach(([key,value])=>{if(visitForm.elements[key])visitForm.elements[key].value=value||''});document.querySelector('#visit-state').textContent=`Sačuvano · ${formatVisitDate(visit.date)}`;document.querySelector('#print-visit').disabled=false;document.querySelector('#email-visit').disabled=false;renderPrintVisit(visit);renderVisitHistory()}
function loadVisits(){startNewVisit()}
visitForm.addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(visitForm).entries());const visits=[...getVisits()];const id=selectedVisitId||`visit-${Date.now()}`;const index=visits.findIndex(item=>item.id===id);const visit={...data,id};if(index>=0)visits[index]=visit;else visits.unshift(visit);allVisits[selected]=visits;localStorage.setItem('kartoteka-visits',JSON.stringify(allVisits));selectedVisitId=id;renderPrintVisit(visit);renderVisitHistory();document.querySelector('#visit-state').textContent=`Sačuvano · ${formatVisitDate(visit.date)}`;document.querySelector('#visit-saved').textContent='Posjeta je sačuvana lokalno.';document.querySelector('#print-visit').disabled=false;document.querySelector('#email-visit').disabled=false});
visitForm.addEventListener('input',()=>{document.querySelector('#visit-saved').textContent='';if(selectedVisitId)document.querySelector('#visit-state').textContent='Izmjene nisu sačuvane';document.querySelector('#print-visit').disabled=true;document.querySelector('#email-visit').disabled=true});
document.querySelector('#visit-history-list').addEventListener('click',event=>{const button=event.target.closest('[data-visit-id]');if(button)loadVisit(button.dataset.visitId)});
document.querySelector('#new-visit').addEventListener('click',startNewVisit);
function printPreparedDocument(){document.body.classList.add('printing-visit');window.print();setTimeout(()=>document.body.classList.remove('printing-visit'),500)}
function prepareEmail(subject,body){const patient=patients.find(item=>item.id===selected);if(!patient?.email||patient.email==='Nije uneseno'){showToast('Za ovog pacijenta prvo unesite e-mail adresu.');return}window.location.href=`mailto:${encodeURIComponent(patient.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;showToast('Otvoren je pripremljen e-mail. Pregledajte ga i pošaljite iz svog e-mail programa.')}
function emailCurrentVisit(){const visit=getVisits().find(item=>item.id===selectedVisitId);if(!visit){showToast('Prvo sačuvajte nalaz koji želite poslati.');return}const patient=patients.find(item=>item.id===selected);prepareEmail(`Nalaz stomatološke posjete · ${formatVisitDate(visit.date)}`,`Poštovani/a ${displayName(patient)},\n\nu prilogu vam dostavljamo nalaz stomatološke posjete od ${formatVisitDate(visit.date)}.\n\nSrdačan pozdrav,\nDr Kunić Tarik\nStomatološka ordinacija`)}
function excelCell(value=''){return `<td>${escapeHtml(value||'')}</td>`}
function exportVisitHistory(){const patient=patients.find(item=>item.id===selected),headers=['Datum','Vrijeme','Vrsta posjete','Razlog dolaska','Klinički nalaz','Dijagnoza','Izvedena terapija','Preporuke','Naredna kontrola'],rows=getVisits().map(visit=>[formatVisitDate(visit.date),visit.time,visit.type,visit.reason,visit.findings,visit.diagnosis,visit.treatment,visit.recommendations,visit.nextVisit?formatVisitDate(visit.nextVisit):'']),table=`<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;color:#17332f}h1{font-size:18pt}p{font-size:10pt}table{border-collapse:collapse;width:100%}th{background:#17332f;color:#fff;text-align:left}th,td{border:1px solid #b9cbc5;padding:8px;vertical-align:top;font-size:10pt;white-space:pre-wrap}</style></head><body><h1>Historija posjeta</h1><p><b>Pacijent:</b> ${escapeHtml(displayName(patient))} &nbsp; <b>Kartonski broj:</b> #${escapeHtml(patient.id)}</p><table><thead><tr>${headers.map(header=>`<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(excelCell).join('')}</tr>`).join('')}</tbody></table></body></html>`,blob=new Blob([table],{type:'application/vnd.ms-excel;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`historija-posjeta-${patient.id}.xls`;link.click();URL.revokeObjectURL(url);showToast('Historija posjeta je preuzeta kao Excel tabela.')}
function renderInstallmentDocument(){if(!selectedTooth){showToast('Prvo odaberite zub u kartici Status zuba.');return false}const patient=patients.find(item=>item.id===selected),data=toothData[selectedTooth],total=Math.max(1,Number(data.total)||1),paid=Math.min(total,Math.max(0,Number(data.paid)||0)),price=Math.max(0,Number(data.price)||0),remaining=total-paid;document.querySelector('#printable-visit').innerHTML=`<header><strong>Dr Kunić Tarik</strong><span>Stomatološka ordinacija · Humska 11, Sarajevo</span></header><h1>Plan otplate na rate</h1><p class="print-patient"><b>Pacijent:</b> ${escapeHtml(displayName(patient))} &nbsp; <b>Kartonski broj:</b> #${escapeHtml(patient.id)}</p><dl><div><dt>Zub</dt><dd>${selectedTooth}</dd></div><div><dt>Klinička bilješka</dt><dd>${escapeHtml(data.note||'Nije uneseno')}</dd></div><div><dt>Ukupan iznos</dt><dd>${price.toFixed(2)} KM</dd></div><div><dt>Planirani broj rata</dt><dd>${total}</dd></div><div><dt>Plaćeno rata</dt><dd>${paid}</dd></div><div><dt>Preostalo za platiti</dt><dd>${(price/total*remaining).toFixed(2)} KM (${remaining} rata)</dd></div></dl><footer><span>Doktor stomatologije: Dr Tarik Kunić</span><span>Datum štampe: ${new Date().toLocaleDateString('bs-BA')}</span></footer>`;return true}
function printInstallments(){if(renderInstallmentDocument())printPreparedDocument()}
function emailInstallments(){if(!renderInstallmentDocument())return;const patient=patients.find(item=>item.id===selected),data=toothData[selectedTooth],total=Math.max(1,Number(data.total)||1),paid=Math.min(total,Math.max(0,Number(data.paid)||0)),remaining=total-paid,price=Math.max(0,Number(data.price)||0);prepareEmail(`Plan otplate · zub ${selectedTooth}`,`Poštovani/a ${displayName(patient)},\n\nu prilogu vam dostavljamo plan otplate za zub ${selectedTooth}.\nUkupan iznos: ${price.toFixed(2)} KM\nPreostalo: ${(price/total*remaining).toFixed(2)} KM (${remaining} rata)\n\nSrdačan pozdrav,\nDr Kunić Tarik\nStomatološka ordinacija`)}
document.querySelector('#print-visit').insertAdjacentHTML('beforebegin','<button class="secondary-button" id="email-visit" type="button" disabled>✉ Pripremi e-mail</button>');
document.querySelector('#new-visit').insertAdjacentHTML('afterend','<button class="history-export" id="export-visits" type="button">⇩ Preuzmi Excel</button>');
document.querySelector('.installment-title').insertAdjacentHTML('beforeend','<div class="installment-actions"><button class="secondary-button" id="email-installment" type="button">✉ E-mail rata</button><button class="secondary-button" id="print-installment" type="button">🖨 Štampaj rate</button></div>');
document.querySelector('#print-visit').addEventListener('click',()=>{if(selectedVisitId)printPreparedDocument()});
document.querySelector('#email-visit').addEventListener('click',emailCurrentVisit);document.querySelector('#export-visits').addEventListener('click',exportVisitHistory);document.querySelector('#print-installment').addEventListener('click',printInstallments);document.querySelector('#email-installment').addEventListener('click',emailInstallments);

let allBotoxData;
try{allBotoxData=JSON.parse(localStorage.getItem('kartoteka-botox-data'))||{}}catch{allBotoxData={}}
const botoxForm=document.querySelector('#botox-form');
function getBotoxData(){return allBotoxData[selected]||{date:'',type:'Botox · estetski tretman',units:'',product:'',lot:'',expiry:'',areas:[],note:'',followUp:'',consent:false}}
function renderBotoxSummary(data){const summary=document.querySelector('#botox-summary');if(!data.savedAt){summary.innerHTML='<span>✦</span><h3>Sačuvani tretman</h3><p>Nakon unosa ovdje će biti prikazan sažetak za odabranog pacijenta.</p>';return}summary.innerHTML=`<span>✦</span><p class="eyebrow">POSLJEDNJI UNOS</p><h3>${escapeHtml(data.type)}</h3><dl><div><dt>Datum</dt><dd>${escapeHtml(formatVisitDate(data.date))}</dd></div><div><dt>Preparat</dt><dd>${escapeHtml(data.product||'Nije uneseno')}</dd></div><div><dt>Jedinice</dt><dd>${escapeHtml(data.units||'—')}</dd></div><div><dt>Regije</dt><dd>${escapeHtml((data.areas||[]).join(', ')||'Nije uneseno')}</dd></div></dl><small>Sačuvano: ${escapeHtml(data.savedAt)}</small>`}
function loadBotox(){const data=getBotoxData();botoxForm.reset();['date','type','units','product','lot','expiry','note','followUp'].forEach(name=>{botoxForm.elements[name].value=data[name]||''});botoxForm.elements.consent.checked=Boolean(data.consent);botoxForm.querySelectorAll('[name="areas"]').forEach(input=>input.checked=(data.areas||[]).includes(input.value));const saved=Boolean(data.savedAt);document.querySelector('#botox-state').textContent=saved?`Evidentirano · ${formatVisitDate(data.date)}`:'Nije evidentirano';document.querySelector('#botox-badge').textContent=saved?'✓':'!';document.querySelector('#botox-badge').classList.toggle('complete',saved);document.querySelector('#botox-saved').textContent='';renderBotoxSummary(data)}
botoxForm.addEventListener('submit',event=>{event.preventDefault();const formData=new FormData(botoxForm),data=Object.fromEntries(formData.entries());data.areas=formData.getAll('areas');data.consent=true;data.savedAt=new Date().toLocaleString('bs-BA',{dateStyle:'short',timeStyle:'short'});allBotoxData[selected]=data;localStorage.setItem('kartoteka-botox-data',JSON.stringify(allBotoxData));loadBotox();document.querySelector('#botox-saved').textContent='Botox evidencija je sačuvana lokalno.'});

const defaultPatients=[
  {id:'000124',name:'Amina Memić',father:'Haris',initials:'AM',detail:'34 god. · Sarajevo',meta:'34 godine · Žensko · Posljednja posjeta 14.09.2026.',phone:'+387 61 000 124',email:'amina.memic@example.com',birth:'12. april 1992.',address:'Demo adresa 124, Sarajevo',alert:'Alergija na penicilin. Obratiti pažnju prije propisivanja terapije.'},
  {id:'000123',name:'Emir Hadžić',father:'Nedim',initials:'EH',detail:'42 god. · Ilidža',meta:'42 godine · Muško · Posljednja posjeta 09.09.2026.',phone:'+387 62 000 123',email:'emir.hadzic@example.com',birth:'7. januar 1984.',address:'Demo adresa 123, Ilidža',alert:'Pacijent koristi antikoagulantnu terapiju. Provjeriti terapiju prije zahvata.'},
  {id:'000122',name:'Lejla Kovačević',father:'Samir',initials:'LK',detail:'28 god. · Centar',meta:'28 godina · Žensko · Posljednja posjeta 02.09.2026.',phone:'+387 61 000 122',email:'lejla.kovacevic@example.com',birth:'21. juni 1998.',address:'Demo adresa 122, Sarajevo',alert:'Nema evidentiranih alergija ni posebnih medicinskih napomena.'},
  {id:'000121',name:'Adnan Selimović',father:'Kemal',initials:'AS',detail:'51 god. · Novo Sarajevo',meta:'51 godina · Muško · Posljednja posjeta 26.08.2026.',phone:'+387 60 000 121',email:'adnan.selimovic@example.com',birth:'3. februar 1975.',address:'Demo adresa 121, Sarajevo',alert:'Dijabetes tip 2. Jutarnje termine uskladiti s obrokom i redovnom terapijom.'}
];
let patients;
try{patients=JSON.parse(localStorage.getItem('kartoteka-patients'))||defaultPatients}catch{patients=defaultPatients}
patients=patients.map((patient,index)=>({...patient,father:patient.father||defaultPatients.find(item=>item.id===patient.id)?.father||'Nije uneseno'}));
const list=document.querySelector('#patient-list');
const count=document.querySelector('#patient-count');
let selected=patients[0].id;

function renderList(query=''){
  const normalized=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const term=normalized(query);
  const filtered=patients.filter(p=>normalized(`${p.name} ${p.father} ${p.detail} ${p.phone} ${p.email}`).includes(term));
  count.textContent=`${filtered.length} ${filtered.length===1?'pacijent':'pacijenta'}`;
  list.innerHTML=filtered.map(p=>`<button class="patient-item ${p.id===selected?'active':''}" data-id="${escapeHtml(p.id)}"><span class="avatar">${escapeHtml(p.initials)}</span><span><strong>${escapeHtml(displayName(p))}</strong><small>${escapeHtml(p.detail)}</small></span><span>›</span></button>`).join('')||'<p style="padding:18px;color:#73847f;font-size:12px">Nema rezultata.</p>';
}
function displayName(patient){const parts=patient.name.trim().split(/\s+/),first=parts.shift(),last=parts.join(' ');return `${first} (${patient.father}) ${last}`.trim()}
function renderNextVisit(){
  const patient=patients.find(item=>item.id===selected);if(!patient)return;
  const appointment=dashboardAppointments.filter(item=>(item.patientId===patient.id||(!item.patientId&&item.name.toLowerCase()===patient.name.toLowerCase()))&&item.date>=dateKey(new Date())&&!['Završen','Nije došao','Otkazan'].includes(item.status)).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))[0];
  const date=appointment?new Date(`${appointment.date}T12:00:00`):null;
  document.querySelector('#next-visit-day').textContent=date?String(date.getDate()):'—';
  document.querySelector('#next-visit-month').textContent=date?date.toLocaleDateString('bs-BA',{month:'short'}).toUpperCase():'';
  document.querySelector('#next-visit-type').textContent=appointment?.type||'Nema zakazanog termina';
  const end=appointment?minutesFromTime(appointment.time)+(Number(appointment.duration)||30):0;
  const endTime=`${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`;
  document.querySelector('#next-visit-time').textContent=appointment?`${date.toLocaleDateString('bs-BA',{weekday:'long'})} · ${appointment.time}–${endTime}`:'Termin možete dodati iz kartona.';
  document.querySelector('#next-visit-status').textContent=appointment?.status||'';
}
function showPatient(id){
  const p=patients.find(item=>item.id===id);if(!p)return;selected=id;
  const fields={
    'patient-avatar':p.initials,'patient-id':`#${p.id}`,'patient-name':displayName(p),'patient-meta':p.meta,
    'patient-phone':p.phone,'patient-email':p.email,'patient-birth':p.birth,'patient-father':p.father,'patient-address':p.address,'patient-alert':p.alert
  };
  Object.entries(fields).forEach(([key,value])=>document.getElementById(key).textContent=value);
  renderList(document.querySelector('#patient-search').value);
  selectedTooth=null;loadToothData();renderOdontogram();resetToothPanel();
  loadAnamnesis();loadPeriodontal();loadBotox();renderTreatments();loadVisits();renderNextVisit();
}
renderList();
document.querySelector('#patient-search').addEventListener('input',e=>renderList(e.target.value));
list.addEventListener('click',e=>{const button=e.target.closest('[data-id]');if(button)showPatient(button.dataset.id)});
function activateTab(tabName){
  const button=document.querySelector(`.tabs button[data-tab="${tabName}"]`);if(!button)return;
  document.querySelectorAll('.tabs button').forEach(item=>item.classList.toggle('active',item===button));
  document.querySelectorAll('.tab-content').forEach(content=>content.classList.toggle('active',content.id===button.dataset.tab));
}
document.querySelectorAll('.tabs button').forEach(button=>button.addEventListener('click',()=>activateTab(button.dataset.tab)));
if(location.hash==='#posjete')activateTab('posjete');
const dialog=document.querySelector('#patient-dialog');
document.querySelector('#new-patient').addEventListener('click',()=>dialog.showModal());
document.querySelector('#new-patient').addEventListener('click',()=>{document.querySelector('#new-patient-form').elements.email.value='@gmail.com'});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
document.querySelector('.dialog-cancel').addEventListener('click',()=>dialog.close());
document.querySelector('#new-patient-form').addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget),name=titleCase(data.get('name').trim()),birth=new Date(`${data.get('birth')}T12:00:00`),today=new Date(),email=data.get('email').trim()==='@gmail.com'?'':data.get('email').trim();
  const age=Math.max(0,today.getFullYear()-birth.getFullYear()-((today.getMonth()<birth.getMonth()||(today.getMonth()===birth.getMonth()&&today.getDate()<birth.getDate()))?1:0));
  const patient={id:String(Math.max(...patients.map(p=>Number(p.id)),124)+1).padStart(6,'0'),name,father:titleCase(data.get('father').trim()),initials:name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase(),detail:`${age} god. · Sarajevo`,meta:`${age} godina · Novi pacijent · Bez prethodnih posjeta`,phone:data.get('phone'),email:email||'Nije uneseno',birth:birth.toLocaleDateString('bs-BA',{day:'2-digit',month:'2-digit',year:'numeric'}),address:titleCase(data.get('address').trim())||'Nije uneseno',alert:data.get('alert')||'Nema evidentiranih alergija ni posebnih medicinskih napomena.'};
  patient.manualAlert=patient.alert;patients.unshift(patient);localStorage.setItem('kartoteka-patients',JSON.stringify(patients));selected=patient.id;showPatient(patient.id);event.currentTarget.reset();dialog.close();activateTab('anamneza');document.querySelector('#anamnesis-form').scrollIntoView({behavior:'smooth',block:'start'});
});
const sidebar=document.querySelector('.sidebar');
const menuButton=document.querySelector('.mobile-menu');
const menuBackdrop=document.querySelector('.menu-backdrop');
function setMobileMenu(open){
  const isOpen=open&&window.matchMedia('(max-width:750px)').matches;
  sidebar.classList.toggle('open',isOpen);
  menuBackdrop.hidden=!isOpen;
  menuButton.setAttribute('aria-expanded',String(isOpen));
  document.body.classList.toggle('menu-open',isOpen);
}
menuButton.addEventListener('click',()=>setMobileMenu(!sidebar.classList.contains('open')));
document.querySelector('.menu-close').addEventListener('click',()=>setMobileMenu(false));
menuBackdrop.addEventListener('click',()=>setMobileMenu(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape')setMobileMenu(false)});
window.addEventListener('resize',()=>{if(window.innerWidth>750)setMobileMenu(false)});
setMobileMenu(false);

let allAnamnesis;
try{allAnamnesis=JSON.parse(localStorage.getItem('kartoteka-anamnesis'))||{}}catch{allAnamnesis={}}
if(!allAnamnesis['000124'])allAnamnesis['000124']={diseases:'',medications:'',cardio:'Ne',hospital:'Ne',pacemaker:'Ne',diabetes:'Ne',allergy:'Da',allergyDetail:'Penicilin',infectious:'Ne',radiation:'Ne',surgery:'Ne',anesthesia:'Da',anesthesiaIssue:'Ne',pregnant:'Ne',confirmed:true,savedAt:'14.09.2026. 10:15'};
const anamnesisForm=document.querySelector('#anamnesis-form');
const anamnesisDefaults={cardio:'Ne',hospital:'Ne',pacemaker:'Ne',diabetes:'Ne',allergy:'Ne',infectious:'Ne',radiation:'Ne',surgery:'Ne',anesthesia:'Ne',anesthesiaIssue:'Ne',pregnant:'Ne'};
function updateAnamnesisDetails(){
  anamnesisForm.querySelectorAll('.detail-input').forEach(field=>{const baseName=field.name.replace('Detail',''),enabled=anamnesisForm.elements[baseName]?.value==='Da';field.disabled=!enabled;if(!enabled)field.value=''});
}
function loadAnamnesis(){
  const data={...anamnesisDefaults,...(allAnamnesis[selected]||{})};anamnesisForm.reset();
  [...anamnesisForm.elements].forEach(field=>{if(!field.name)return;if(field.type==='radio')field.checked=data[field.name]===field.value;else if(field.type==='checkbox')field.checked=Boolean(data[field.name]);else field.value=data[field.name]||''});
  updateAnamnesisDetails();
  const complete=Boolean(data.savedAt);document.querySelector('#anamnesis-state').textContent=complete?`Popunjeno · ${data.savedAt}`:'Nije popunjeno';document.querySelector('#anamnesis-badge').textContent=complete?'✓':'!';document.querySelector('#anamnesis-badge').classList.toggle('complete',complete);document.querySelector('#anamnesis-saved').textContent='';
}
anamnesisForm.addEventListener('change',event=>{if(event.target.type==='radio')updateAnamnesisDetails()});
function createMedicalSummary(data,patient){
  const diagnoses=[],therapies=[],important=[];
  if(data.diseases)diagnoses.push(data.diseases);
  if(data.cardio==='Da')diagnoses.push(`Kardiovaskularno oboljenje${data.cardioDetail?`: ${data.cardioDetail}`:''}`);
  if(data.diabetes==='Da')diagnoses.push(`Dijabetes${data.diabetesDetail?`: ${data.diabetesDetail}`:''}`);
  if(data.infectious==='Da')diagnoses.push(`Infektivna bolest${data.infectiousDetail?`: ${data.infectiousDetail}`:''}`);
  if(data.medications)therapies.push(data.medications);
  if(data.pacemaker==='Da')important.push(`Pacemaker/vještački zalistak${data.pacemakerDetail?`: ${data.pacemakerDetail}`:''}`);
  if(data.allergy==='Da')important.push(`ALERGIJA${data.allergyDetail?`: ${data.allergyDetail}`:''}`);
  if(data.hospital==='Da')important.push(`Bolničko liječenje u posljednje 2 godine${data.hospitalDetail?`: ${data.hospitalDetail}`:''}`);
  if(data.radiation==='Da')important.push(`Terapijsko zračenje${data.radiationDetail?`: ${data.radiationDetail}`:''}`);
  if(data.surgery==='Da')important.push(`Operacija čeljusti/zuba${data.surgeryDetail?`: ${data.surgeryDetail}`:''}`);
  if(data.anesthesiaIssue==='Da')important.push(`Komplikacija pri lokalnoj anesteziji${data.anesthesiaIssueDetail?`: ${data.anesthesiaIssueDetail}`:''}`);
  if(data.pregnant==='Da')important.push(`Trudnoća${data.pregnantDetail?` · termin poroda: ${data.pregnantDetail}`:''}`);
  const sections=[];if(diagnoses.length)sections.push(`DIJAGNOZE: ${diagnoses.join('; ')}`);if(therapies.length)sections.push(`TERAPIJA: ${therapies.join('; ')}`);if(important.length)sections.push(`VAŽNO: ${important.join('; ')}`);
  const manual=patient.manualAlert&&patient.manualAlert!=='Nema evidentiranih alergija ni posebnih medicinskih napomena.'?patient.manualAlert:'';if(manual)sections.push(`DODATNA NAPOMENA: ${manual}`);
  return sections.join(' | ')||'Anamneza popunjena: pacijent nije naveo posebne dijagnoze, terapije, alergije ni medicinske rizike.';
}
anamnesisForm.addEventListener('submit',event=>{
  event.preventDefault();const data=Object.fromEntries(new FormData(anamnesisForm).entries());data.confirmed=true;data.savedAt=new Date().toLocaleString('bs-BA',{dateStyle:'short',timeStyle:'short'});allAnamnesis[selected]=data;localStorage.setItem('kartoteka-anamnesis',JSON.stringify(allAnamnesis));const patient=patients.find(item=>item.id===selected);if(!patient.manualAlert)patient.manualAlert=patient.alert;patient.alert=createMedicalSummary(data,patient);localStorage.setItem('kartoteka-patients',JSON.stringify(patients));document.querySelector('#patient-alert').textContent=patient.alert;loadAnamnesis();document.querySelector('#anamnesis-saved').textContent='Anamneza i medicinska napomena su sačuvane.';
});
loadAnamnesis();loadBotox();loadVisits();

const perioTeeth=[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28,48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
let allPerioData;
try{allPerioData=JSON.parse(localStorage.getItem('kartoteka-periodontal-data'))||{}}catch{allPerioData={}}
const perioForm=document.querySelector('#perio-form');
function getPerioData(){return allPerioData[selected]||{tissues:'',irregularity:'Ne',dentures:'Ne',hygiene:'Dobra',periodontitis:'Ne',pbi:{},depth:{},mobility:{},note:''}}
function renderPerioGrid(id,field,type){const values=getPerioData()[field]||{},options=field==='pbi'?[0,1,2,3,4]:[0,1,2,3];document.querySelector(id).innerHTML=perioTeeth.map(tooth=>`<label class="perio-tooth"><span>${tooth}</span>${type==='select'?`<select data-perio="${field}" data-tooth="${tooth}">${options.map(value=>`<option value="${value}" ${String(values[tooth]||0)===String(value)?'selected':''}>${value}</option>`).join('')}</select>`:`<input data-perio="${field}" data-tooth="${tooth}" type="number" min="0" max="12" step="1" value="${values[tooth]||''}" placeholder="—">`}</label>`).join('')}
function updatePbiScore(){const values=Object.values(getPerioData().pbi||{}).map(Number),filled=values.filter(value=>Number.isFinite(value));const score=filled.length?filled.reduce((sum,value)=>sum+value,0)/filled.length:null;document.querySelector('#pbi-score').textContent=score===null?'PBI —':`PBI ${score.toFixed(1)}`}
function loadPeriodontal(){const data=getPerioData();perioForm.reset();['tissues','irregularity','dentures','hygiene','periodontitis','note'].forEach(name=>{perioForm.elements[name].value=data[name]||''});renderPerioGrid('#pbi-grid','pbi','select');renderPerioGrid('#depth-grid','depth','input');renderPerioGrid('#mobility-grid','mobility','select');const complete=Boolean(data.savedAt);document.querySelector('#perio-state').textContent=complete?`Sačuvano · ${data.savedAt}`:'Nije popunjeno';document.querySelector('#perio-badge').textContent=complete?'✓':'!';document.querySelector('#perio-badge').classList.toggle('complete',complete);document.querySelector('#perio-saved').textContent='';updatePbiScore()}
function savePerioMeasure(event){const target=event.target;if(!target.matches('[data-perio]'))return;const data=getPerioData(),field=target.dataset.perio;if(!data[field])data[field]={};data[field][target.dataset.tooth]=target.value;allPerioData[selected]=data;localStorage.setItem('kartoteka-periodontal-data',JSON.stringify(allPerioData));if(field==='pbi')updatePbiScore()}
perioForm.addEventListener('input',savePerioMeasure);perioForm.addEventListener('change',savePerioMeasure);
perioForm.addEventListener('submit',event=>{event.preventDefault();const current=getPerioData(),formData=new FormData(perioForm);['tissues','irregularity','dentures','hygiene','periodontitis','note'].forEach(name=>current[name]=formData.get(name)||'');current.savedAt=new Date().toLocaleString('bs-BA',{dateStyle:'short',timeStyle:'short'});allPerioData[selected]=current;localStorage.setItem('kartoteka-periodontal-data',JSON.stringify(allPerioData));loadPeriodontal();document.querySelector('#perio-saved').textContent='Parodontološki status je sačuvan.'});
loadPeriodontal();

const upperTeeth=[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28],lowerTeeth=[48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
document.querySelector('.tooth-legend').insertAdjacentHTML('beforeend','<span><i class="filling"></i>Plomba</span>');
document.querySelector('.condition-picker').insertAdjacentHTML('beforeend','<button data-condition="filling" type="button"><i></i> Plomba</button>');
let toothCondition='caries',selectedTooth=null;
let allDentalData;
try{allDentalData=JSON.parse(localStorage.getItem('kartoteka-dental-data'))||{}}catch{allDentalData={}}
if(!allDentalData['000124'])allDentalData['000124']={26:{condition:'caries',note:'Karijes okluzalno',price:600,total:6,paid:2},16:{condition:'treated',note:'Kompozitni ispun',price:100,total:1,paid:1},46:{condition:'missing',note:'Zub ekstrahiran',price:0,total:1,paid:1}};
let toothData={};
function loadToothData(){toothData=allDentalData[selected]||{}}
function saveToothData(){allDentalData[selected]=toothData;localStorage.setItem('kartoteka-dental-data',JSON.stringify(allDentalData))}
function renderJaw(target,teeth){document.querySelector(target).innerHTML=teeth.map(number=>`<button class="tooth-button ${toothData[number]?.condition||'healthy'}" data-tooth="${number}" type="button" title="Zub ${number}"><span class="tooth-shape"></span><small>${number}</small></button>`).join('')}
function renderOdontogram(){renderJaw('#upper-jaw',upperTeeth);renderJaw('#lower-jaw',lowerTeeth);if(selectedTooth)document.querySelector(`[data-tooth="${selectedTooth}"]`)?.classList.add('selected')}
function resetToothPanel(){document.querySelector('.tooth-preview').textContent='—';document.querySelector('#selected-tooth strong').textContent='Odaberite zub na prikazu';document.querySelector('#selected-tooth p').textContent='Njegovo stanje i bilješka prikazat će se ovdje.';['tooth-note','tooth-price','installment-total','installment-paid'].forEach(id=>{const field=document.getElementById(id);field.disabled=true;field.value=''});document.querySelector('#installment-status').textContent='Odaberite zub';document.querySelector('#installment-remaining').textContent='—';document.querySelector('#installment-amount').textContent='—'}
function updateInstallmentSummary(){if(!selectedTooth)return;const data=toothData[selectedTooth],total=Math.max(1,Number(data.total)||1),paid=Math.min(total,Math.max(0,Number(data.paid)||0)),price=Math.max(0,Number(data.price)||0),remaining=total-paid,amount=total?price/total*remaining:0;document.querySelector('#installment-status').textContent=remaining?`${remaining} ${remaining===1?'rata preostala':'rate preostale'}`:'Plaćeno u cijelosti';document.querySelector('#installment-remaining').textContent=`${remaining} / ${total} rata`;document.querySelector('#installment-amount').textContent=`${amount.toFixed(2)} KM preostalo`}
function showTooth(number){selectedTooth=number;const data=toothData[number]||{condition:'healthy',note:'',price:0,total:1,paid:0};toothData[number]=data;renderOdontogram();const names={healthy:'Zdrav',caries:'Karijes',treated:'Liječen',missing:'Nedostaje',filling:'Plomba'};document.querySelector('.tooth-preview').textContent=number;document.querySelector('#selected-tooth strong').textContent=`Zub ${number} · ${names[data.condition]}`;document.querySelector('#selected-tooth p').textContent='Stanje i plaćanje vode se samo za ovog pacijenta.';const values={'tooth-note':data.note||'','tooth-price':data.price||0,'installment-total':data.total||1,'installment-paid':data.paid||0};Object.entries(values).forEach(([id,value])=>{const field=document.getElementById(id);field.disabled=false;field.value=value});updateInstallmentSummary()}
loadToothData();renderOdontogram();
document.querySelectorAll('.condition-picker button').forEach(button=>button.addEventListener('click',()=>{toothCondition=button.dataset.condition;document.querySelectorAll('.condition-picker button').forEach(item=>item.classList.toggle('active',item===button))}));
document.querySelector('.jaw-wrap').addEventListener('click',event=>{const button=event.target.closest('[data-tooth]');if(!button)return;const number=Number(button.dataset.tooth),old=toothData[number]||{};toothData[number]={condition:toothCondition,note:old.note||'',price:old.price||0,total:old.total||1,paid:old.paid||0};saveToothData();showTooth(number)});
document.querySelector('#tooth-note').addEventListener('input',event=>{if(!selectedTooth)return;toothData[selectedTooth].note=event.target.value;saveToothData()});
['tooth-price','installment-total','installment-paid'].forEach(id=>document.getElementById(id).addEventListener('input',event=>{if(!selectedTooth)return;const keys={'tooth-price':'price','installment-total':'total','installment-paid':'paid'};toothData[selectedTooth][keys[id]]=Math.max(0,Number(event.target.value)||0);if(id==='installment-paid'&&toothData[selectedTooth].paid>toothData[selectedTooth].total)toothData[selectedTooth].paid=toothData[selectedTooth].total;saveToothData();updateInstallmentSummary()}));

function saveAppointments(){localStorage.setItem('kartoteka-appointments',JSON.stringify(dashboardAppointments))}
function saveWaitingEntries(){localStorage.setItem('kartoteka-waiting-list',JSON.stringify(waitingEntries))}
function saveOnlineRequests(){localStorage.setItem('kartoteka-online-requests',JSON.stringify(onlineRequests))}
function requestDateLabel(request){const date=new Date(`${request.date}T12:00:00`);return `${dashboardWeekdays[date.getDay()].slice(0,3)}, ${String(date.getDate()).padStart(2,'0')}.${String(date.getMonth()+1).padStart(2,'0')}. u ${request.time}`}
function appointmentConflict(date,time,duration,ignoredId=''){const start=minutesFromTime(time),end=start+Number(duration);return dashboardAppointments.some(item=>item.id!==ignoredId&&item.date===date&&item.status!=='Otkazan'&&start<minutesFromTime(item.time)+(Number(item.duration)||30)&&end>minutesFromTime(item.time))}
function requestMatchesFilter(request){if(requestFilter==='novi')return request.status==='Novi';if(requestFilter==='potvrđeni')return request.status==='Potvrđen';if(requestFilter==='završeni')return ['Odbijen','Otkazan online'].includes(request.status);return true}
function renderOnlineRequests(){
  const target=document.querySelector('#request-list');
  if(!target)return;
  const statusOrder={Novi:0,'Potvrđen':1,'Otkazan online':2,Odbijen:3};
  const requests=[...onlineRequests].filter(requestMatchesFilter).sort((a,b)=>(statusOrder[a.status]??9)-(statusOrder[b.status]??9)||a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
  const newCount=onlineRequests.filter(item=>item.status==='Novi').length;
  document.querySelector('#request-count').textContent=newCount?`${newCount} nova`:'Nema novih';
  document.querySelector('.icon-button span').hidden=newCount===0;
  target.innerHTML=requests.length?requests.map(request=>{
    const contact=[request.phone,request.email].filter(Boolean).join(' · ');
    const note=request.note?`<p class="request-note">${escapeHtml(request.note)}</p>`:'';
    const actions=request.status==='Novi'
      ? `<button class="request-confirm" type="button" data-request-action="confirm" data-request-id="${escapeHtml(request.id)}">Potvrdi</button><button type="button" data-request-action="change" data-request-id="${escapeHtml(request.id)}">Promijeni termin</button><button type="button" data-request-action="reject" data-request-id="${escapeHtml(request.id)}">Odbij</button>`
      : request.status==='Potvrđen'
        ? `<button type="button" data-request-action="open-date" data-request-id="${escapeHtml(request.id)}">Prikaži u kalendaru</button><button class="request-cancel" type="button" data-request-action="cancel" data-request-id="${escapeHtml(request.id)}">Otkazano online</button>`
        : '';
    return `<article class="request-item"><div class="request-main"><div class="request-person"><strong>${escapeHtml(request.name)}</strong><span>${escapeHtml(contact)}</span></div><span class="request-status status-${escapeHtml(request.status.toLowerCase().replaceAll(' ','-'))}">${escapeHtml(request.status)}</span><h4>${escapeHtml(request.service)}</h4><p class="request-time">${escapeHtml(requestDateLabel(request))} · potvrda: ${escapeHtml(request.confirmationMethod)}</p>${note}</div><div class="request-actions">${actions}</div></article>`
  }).join(''):'<p class="empty-tasks">Nema zahtjeva u ovoj grupi.</p>';
}
function appointmentFromRequest(request,date=request.date,time=request.time,duration=60){
  const matchingPatient=patients.find(patient=>patient.name.toLowerCase()===request.name.toLowerCase());
  const appointment={id:crypto.randomUUID(),patientId:matchingPatient?.id||'',requestId:request.id,name:request.name,date,time,duration:Number(duration),type:request.service,status:'Potvrđen'};
  dashboardAppointments.push(appointment);
  request.status='Potvrđen';request.appointmentId=appointment.id;request.confirmedAt=new Date().toISOString();request.date=date;request.time=time;
  saveAppointments();saveOnlineRequests();
  dashboardDay=new Date(`${date}T12:00:00`);dashboardMonth=new Date(dashboardDay.getFullYear(),dashboardDay.getMonth(),1);
  renderDashboard();renderNextVisit();
  showToast(`Termin je potvrđen. Pacijenta kontaktirati putem: ${request.confirmationMethod}.`);
}
function renderWaitlist(){
  const target=document.querySelector('#waiting-list');
  const entries=[...waitingEntries].sort((a,b)=>(a.status==='Čeka'?0:a.status==='Pozvano'?1:2)-(b.status==='Čeka'?0:b.status==='Pozvano'?1:2)||Number(b.priority==='hitno')-Number(a.priority==='hitno'));
  document.querySelector('#waiting-count').textContent=`${waitingEntries.filter(item=>item.status==='Čeka').length} čeka · ${waitingEntries.filter(item=>item.status==='Pozvano').length} pozvano`;
  target.innerHTML=entries.length?entries.map(item=>`<article class="waiting-item"><div><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.reason)}</p><div class="waiting-tags"><span class="waiting-status">${escapeHtml(item.status)}</span>${item.priority==='hitno'?'<span class="waiting-urgent">Hitno</span>':''}</div></div><div class="waiting-actions">${item.status==='Čeka'?`<button type="button" data-waiting-action="call" data-waiting-id="${escapeHtml(item.id)}">Pozvano</button>`:''}${['Čeka','Pozvano'].includes(item.status)?`<button type="button" data-waiting-action="schedule" data-waiting-id="${escapeHtml(item.id)}">Zakaži</button><button type="button" data-waiting-action="resolve" data-waiting-id="${escapeHtml(item.id)}">Riješeno</button>`:''}</div></article>`).join(''):'<p class="empty-tasks">Lista čekanja je prazna.</p>';
}
function minutesFromTime(time){const [hours,minutes]=String(time).split(':').map(Number);return hours*60+minutes}
function openAppointmentDialog(waitingId='',requestId=''){
  const form=document.querySelector('#appointment-form');
  form.reset();
  form.dataset.waitingId=waitingId;
  form.dataset.requestId=requestId;
  form.dataset.patientId='';
  form.elements.date.value=dateKey(dashboardDay);
  form.elements.time.value='09:00';
  document.querySelector('#appointment-error').textContent='';
  const requestNote=document.querySelector('#request-dialog-note');
  requestNote.hidden=true;requestNote.textContent='';
  document.querySelector('#appointment-patients').innerHTML=patients.map(patient=>`<option value="${escapeHtml(patient.name)}"></option>`).join('');
  const waiting=waitingEntries.find(item=>item.id===waitingId);
  if(waiting){form.elements.name.value=waiting.name;form.elements.type.value=waiting.reason}
  const request=onlineRequests.find(item=>item.id===requestId);
  if(request){form.elements.name.value=request.name;form.elements.date.value=request.date;form.elements.time.value=request.time;form.elements.duration.value='60';form.elements.type.value=request.service;requestNote.hidden=false;requestNote.textContent=`Online zahtjev · potvrda putem ${request.confirmationMethod}. Sačuvani termin će zamijeniti traženo vrijeme.`}
  document.querySelector('#appointment-dialog').showModal();
}
document.querySelector('#add-appointment').addEventListener('click',()=>openAppointmentDialog());
document.querySelector('.appointment-close').addEventListener('click',()=>document.querySelector('#appointment-dialog').close());
document.querySelector('.appointment-cancel').addEventListener('click',()=>document.querySelector('#appointment-dialog').close());
document.querySelector('#appointment-form').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget,data=Object.fromEntries(new FormData(form));
  const conflict=appointmentConflict(data.date,data.time,data.duration);
  if(conflict){document.querySelector('#appointment-error').textContent='U ovom vremenu već postoji termin. Odaberite drugo vrijeme.';return}
  const onlineRequest=onlineRequests.find(item=>item.id===form.dataset.requestId);
  if(onlineRequest){
    appointmentFromRequest(onlineRequest,data.date,data.time,data.duration);
    form.closest('dialog').close();
    return;
  }
  const matchingPatient=patients.find(patient=>patient.name.toLowerCase()===data.name.trim().toLowerCase());
  const appointment={id:crypto.randomUUID(),patientId:form.dataset.patientId||matchingPatient?.id||'',name:data.name.trim(),date:data.date,time:data.time,duration:Number(data.duration),type:data.type.trim(),status:'Zakazan'};
  dashboardAppointments.push(appointment);
  saveAppointments();
  const waiting=waitingEntries.find(item=>item.id===form.dataset.waitingId);
  if(waiting){waiting.status='Zakazano';waiting.appointmentId=appointment.id;saveWaitingEntries()}
  dashboardDay=new Date(`${data.date}T12:00:00`);
  dashboardMonth=new Date(dashboardDay.getFullYear(),dashboardDay.getMonth(),1);
  form.closest('dialog').close();
  renderNextVisit();
  showDashboard(2);
  showToast('Termin je sačuvan u ovom pregledniku.');
});
document.querySelector('#agenda-list').addEventListener('change',event=>{
  const field=event.target.closest('[data-appointment-status]');if(!field)return;
  const appointment=dashboardAppointments.find(item=>item.id===field.dataset.appointmentStatus);if(!appointment)return;
  appointment.status=field.value;saveAppointments();
  if(field.value==='Otkazan'){
    const waiting=waitingEntries.find(item=>item.appointmentId===appointment.id);
    if(waiting){waiting.status='Čeka';delete waiting.appointmentId;saveWaitingEntries();renderWaitlist()}
    const request=onlineRequests.find(item=>item.appointmentId===appointment.id);
    if(request){request.status='Otkazan online';request.cancelledAt=new Date().toISOString();saveOnlineRequests();renderOnlineRequests()}
  }
  renderAgenda();renderCalendar();renderNextVisit();
});
document.querySelector('#waiting-form').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget,data=Object.fromEntries(new FormData(form));
  waitingEntries.push({id:crypto.randomUUID(),name:data.name.trim(),reason:data.reason.trim(),priority:data.priority,status:'Čeka'});
  saveWaitingEntries();form.reset();renderWaitlist();
});
document.querySelector('#waiting-list').addEventListener('click',event=>{
  const button=event.target.closest('[data-waiting-action]');if(!button)return;
  const entry=waitingEntries.find(item=>item.id===button.dataset.waitingId);if(!entry)return;
  if(button.dataset.waitingAction==='schedule'){openAppointmentDialog(entry.id);return}
  entry.status=button.dataset.waitingAction==='call'?'Pozvano':'Riješeno';
  saveWaitingEntries();renderWaitlist();
});
document.querySelector('.request-filters').addEventListener('click',event=>{
  const button=event.target.closest('[data-request-filter]');if(!button)return;
  requestFilter=button.dataset.requestFilter;
  document.querySelectorAll('[data-request-filter]').forEach(item=>item.classList.toggle('active',item===button));
  renderOnlineRequests();
});
document.querySelector('#request-list').addEventListener('click',event=>{
  const button=event.target.closest('[data-request-action]');if(!button)return;
  const request=onlineRequests.find(item=>item.id===button.dataset.requestId);if(!request)return;
  if(button.dataset.requestAction==='open-date'){dashboardDay=new Date(`${request.date}T12:00:00`);dashboardMonth=new Date(dashboardDay.getFullYear(),dashboardDay.getMonth(),1);renderDashboard();document.querySelector('.calendar-card').scrollIntoView({behavior:'smooth',block:'start'});return}
  if(button.dataset.requestAction==='change'){openAppointmentDialog('',request.id);return}
  if(button.dataset.requestAction==='confirm'){
    if(appointmentConflict(request.date,request.time,60)){openAppointmentDialog('',request.id);document.querySelector('#appointment-error').textContent='Traženi termin se preklapa s postojećim. Odaberite drugo vrijeme.';return}
    appointmentFromRequest(request);return;
  }
  if(button.dataset.requestAction==='reject'){request.status='Odbijen';request.resolvedAt=new Date().toISOString();showToast(`Zahtjev je odbijen. Pacijenta obavijestiti putem: ${request.confirmationMethod}.`)}
  if(button.dataset.requestAction==='cancel'){request.status='Otkazan online';request.cancelledAt=new Date().toISOString();const appointment=dashboardAppointments.find(item=>item.id===request.appointmentId);if(appointment){appointment.status='Otkazan';saveAppointments()}showToast('Otkazivanje je evidentirano i termin je oslobođen.')}
  saveOnlineRequests();renderDashboard();renderNextVisit();
});
document.querySelector('.icon-button').onclick=()=>{showDashboard(2);document.querySelector('#online-zahtjevi').scrollIntoView({behavior:'smooth',block:'start'});const count=onlineRequests.filter(item=>item.status==='Novi').length;showToast(count?`Imate ${count} nova online zahtjeva.`:'Nema novih online zahtjeva.')};
