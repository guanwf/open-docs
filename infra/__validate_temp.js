// ═══════════════════════════════════════════════════
//  DATA — JSON-friendly configuration
// ═══════════════════════════════════════════════════

const categoryMap = {
  '操作系统类': 'c-os', '数据库类': 'c-db', '中间件类': 'c-middleware',
  'K8s类': 'c-k8s', '监控类': 'c-monitor', '日志类': 'c-log', '其他': 'c-other'
};

// ── Default Templates ──
let templates = [
  { id:'ob',  name:'OB数据库',   category:'数据库类', function:'数据处理',  type:'normal', cpu:16, memory:64,  sysDisk:500,  dataDisk:1000, count:3, note:'OceanBase分布式数据库' },
  { id:'mysql', name:'MySQL数据库', category:'数据库类', function:'数据处理', type:'normal', cpu:8,  memory:32,  sysDisk:200,  dataDisk:500,  count:2, note:'MySQL主从部署' },
  { id:'mw',  name:'中间件',     category:'中间件类', function:'应用服务',  type:'normal', cpu:8,  memory:16,  sysDisk:100,  dataDisk:200,  count:2, note:'Tomcat / Nginx 等中间件' },
  { id:'k8s', name:'K8s集群',   category:'K8s类',    function:'调度管理',  type:'k8s',
    masterCpu:8, masterMemory:16, masterSysDisk:200, masterDataDisk:0,   masterCount:3,
    nodeCpu:16,  nodeMemory:64,  nodeSysDisk:200,   nodeDataDisk:500,    nodeCount:5,
    note:'Kubernetes 生产集群' },
  { id:'mon', name:'监控',       category:'监控类',   function:'监控告警',  type:'normal', cpu:8,  memory:32,  sysDisk:200,  dataDisk:500,  count:2, note:'Prometheus + Grafana' },
  { id:'alert', name:'告警',     category:'监控类',   function:'监控告警',  type:'normal', cpu:4,  memory:8,   sysDisk:100,  dataDisk:200,  count:1, note:'告警中心' },
  { id:'log', name:'日志',       category:'日志类',   function:'日志收集',  type:'normal', cpu:16, memory:64,  sysDisk:500,  dataDisk:2000, count:3, note:'ELK / Loki 日志集群' },
];
let tmplNextId = 100;

// ── Environment Data ──
let testData = [
  { id:1, name:'app-server-01', ip:'', category:'中间件类', function:'应用服务', os:'Linux', count:2, cpu:8, memory:16, sysDisk:100, dataDisk:200, note:'应用服务器集群' },
  { id:2, name:'mysql-test-01', ip:'', category:'数据库类', function:'数据处理', os:'Linux', count:1, cpu:8, memory:32, sysDisk:200, dataDisk:500, note:'MySQL测试库' },
  { id:3, name:'redis-test-01', ip:'', category:'数据库类', function:'数据处理', os:'Linux', count:1, cpu:4, memory:8,  sysDisk:100, dataDisk:200, note:'Redis缓存' },
];
let prodData = [];
let nextId = 100;

let currentTab = 'test';
let editId = null;
let tmplEditId = null;

// ── Basic Info (for "基本信息" tab) ──
let basicInfo = localStorage.getItem('infraBasicInfo') || '';

// ── Column Definitions (for export) ──
const columnDefs = [
  { key:'seq',      label:'序号' },
  { key:'name',     label:'服务器名称' },
  { key:'ip',       label:'IP地址' },
  { key:'category', label:'分类' },
  { key:'function', label:'职能' },
  { key:'os',       label:'操作系统' },
  { key:'count',    label:'服务器数量' },
  { key:'cpu',      label:'CPU' },
  { key:'memory',   label:'内存(G)' },
  { key:'sysDisk',  label:'系统盘(G)' },
  { key:'dataDisk', label:'数据盘(G)' },
  { key:'note',     label:'备注' },
];
const sumKeys = ['count','cpu','memory','sysDisk','dataDisk'];

// ── Grid column order (drag-reorderable) ──
let columnOrder = ['seq','name','ip','category','function','os','count','cpu','memory','sysDisk','dataDisk','note','actions'];
let columnWidths = {};

const headerHtml = {
  seq:'<th class="seq" draggable="true" data-col="seq">#</th>',
  name:'<th draggable="true" data-col="name">服务器名称</th>',
  ip:'<th draggable="true" data-col="ip">IP地址</th>',
  category:'<th draggable="true" data-col="category">分类</th>',
  function:'<th draggable="true" data-col="function">职能</th>',
  os:'<th draggable="true" data-col="os">操作系统</th>',
  count:'<th draggable="true" data-col="count" style="text-align:right">服务器数量</th>',
  cpu:'<th draggable="true" data-col="cpu" style="text-align:right">CPU</th>',
  memory:'<th draggable="true" data-col="memory" style="text-align:right">内存(G)</th>',
  sysDisk:'<th draggable="true" data-col="sysDisk" style="text-align:right">系统盘(G)</th>',
  dataDisk:'<th draggable="true" data-col="dataDisk" style="text-align:right">数据盘(G)</th>',
  note:'<th draggable="true" data-col="note">备注</th>',
  actions:'<th draggable="true" data-col="actions" style="width:130px">操作</th>',
};

const cellHtml = {
  seq:     (d,idx) => `<td class="seq">${idx+1}</td>`,
  name:    (d) => `<td><span class="sname">${escHtml(d.name)}</span></td>`,
  ip:      (d) => `<td><span class="ip-addr">${d.ip||'—'}</span></td>`,
  category:(d) => `<td><span class="cat-chip ${categoryMap[d.category]||'c-other'}">${d.category}</span></td>`,
  function:(d) => `<td><span class="func-tag">${d.function||'—'}</span></td>`,
  os:      (d) => `<td><span class="os-tag">${d.os||'—'}</span></td>`,
  count:   (d) => `<td class="num-cell">${d.count}</td>`,
  cpu:     (d) => `<td class="num-cell">${(d.cpu||0)*(d.count||1)}</td>`,
  memory:  (d) => `<td class="num-cell">${(d.memory||0)*(d.count||1)}</td>`,
  sysDisk: (d) => `<td class="num-cell">${(d.sysDisk||0)*(d.count||1)}</td>`,
  dataDisk:(d) => `<td class="num-cell">${(d.dataDisk||0)*(d.count||1)}</td>`,
  note:    (d) => `<td class="note-cell">${escHtml(d.note||'')}</td>`,
  actions: (d) => `<td><div class="act-wrap"><button class="act-btn up" onclick="moveRow(${d.id},-1)" title="上移">↑</button><button class="act-btn down" onclick="moveRow(${d.id},1)" title="下移">↓</button><button class="act-btn" onclick="openModal(${d.id})">编辑</button><button class="act-btn del" onclick="delItem(${d.id})">删除</button></div></td>`,
};

// ═══════════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════════

function setTheme(t) {
  document.body.classList.remove('dark','eyecare');
  if (t==='dark') document.body.classList.add('dark');
  if (t==='eyecare') document.body.classList.add('eyecare');
  ['light','eyecare','dark'].forEach(k => document.getElementById('t-'+k).classList.toggle('active',k===t));
  localStorage.setItem('theme',t);
}
(function(){ const t=localStorage.getItem('theme'); if(t) setTheme(t); })();

// ═══════════════════════════════════════════════════
//  UTILITY
// ═══════════════════════════════════════════════════

function showToast(msg) {
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1800);
}

function clearSearch() {
  document.getElementById('search').value='';
  render();
}

function getCurrentData() {
  return currentTab==='test' ? testData : prodData;
}

// ── Basic Info ──
function onBasicInfoChange() {
  const ta=document.getElementById('basicInfoText');
  basicInfo=ta.value;
  localStorage.setItem('infraBasicInfo',basicInfo);
  document.getElementById('basicInfoCount').textContent=basicInfo.length;
}

function getDataRef() {
  return currentTab==='test' ? 'testData' : 'prodData';
}

// ═══════════════════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════════════════

function switchTab(tab) {
  currentTab=tab;
  document.querySelectorAll('.tab').forEach(el=>el.classList.toggle('active',el.dataset.tab===tab));

  const serverPanel=document.getElementById('serverPanel');
  const basicPanel=document.getElementById('basicInfoPanel');
  if(tab==='basic'){
    serverPanel.classList.add('hidden');
    basicPanel.classList.add('open');
    // Restore textarea content
    document.getElementById('basicInfoText').value=basicInfo;
    document.getElementById('basicInfoCount').textContent=basicInfo.length;
  }else{
    serverPanel.classList.remove('hidden');
    basicPanel.classList.remove('open');
  }

  render();
}

function render() {
  // Skip table rendering for basic tab
  if(currentTab==='basic'){
    document.getElementById('badge-test').textContent=testData.length;
    document.getElementById('badge-prod').textContent=prodData.length;
    return;
  }
  const data=getCurrentData();
  const q=(document.getElementById('search').value||'').toLowerCase().trim();
  const filtered=data.filter(d=>{
    if(!q) return true;
    return [d.name,d.ip,d.category,d.function,d.os,d.note].some(v=>(v||'').toLowerCase().includes(q));
  });

  // Badges
  document.getElementById('badge-test').textContent=testData.length;
  document.getElementById('badge-prod').textContent=prodData.length;

  // Inline stats
  let tCount=0,tCpu=0,tMem=0,tDisk=0;
  filtered.forEach(d=>{ tCount+=d.count; tCpu+=d.cpu*d.count; tMem+=d.memory*d.count; tDisk+=d.dataDisk*d.count; });
  document.getElementById('st-count').textContent=tCount;
  document.getElementById('st-cpu').textContent=tCpu;
  document.getElementById('st-mem').textContent=tMem;
  document.getElementById('st-disk').textContent=tDisk;

  // Template dropdown
  renderTemplateSelect();

  // Thead
  document.getElementById('thead').innerHTML='<tr>'+columnOrder.map(k=>headerHtml[k]).join('')+'</tr>';

  // Resize handles + apply stored widths
  document.querySelectorAll('thead th').forEach(function(th){
    var col=th.dataset.col;
    var h=document.createElement('span');
    h.className='resize-handle';
    th.appendChild(h);
    if(columnWidths[col]) th.style.width=columnWidths[col]+'px';
  });

  // Compute totals (multiplied by count)
  const tot={count:0,cpu:0,memory:0,sysDisk:0,dataDisk:0};
  filtered.forEach(d=>{
    tot.count+=d.count;
    tot.cpu+=d.cpu*d.count;
    tot.memory+=d.memory*d.count;
    tot.sysDisk+=d.sysDisk*d.count;
    tot.dataDisk+=d.dataDisk*d.count;
  });

  // Table body
  const tbody=document.getElementById('tbody');
  const colSpan=columnOrder.length;
  if(!filtered.length){
    tbody.innerHTML='<tr class="empty-row"><td colspan="'+colSpan+'">没有匹配的服务器</td></tr>';
    return;
  }
  const rowsHtml=filtered.map((d,idx)=>{
    return '<tr>'+columnOrder.map(k=>{
      if(k==='seq') return cellHtml.seq(d,idx);
      return cellHtml[k](d);
    }).join('')+'</tr>';
  }).join('')+
  '<tr class="total-row">'+columnOrder.map(k=>{
    if(k==='seq') return '<td class="seq">合计</td>';
    if(k==='count') return '<td class="num-cell">'+tot.count+'</td>';
    if(k==='cpu') return '<td class="num-cell">'+tot.cpu+'</td>';
    if(k==='memory') return '<td class="num-cell">'+tot.memory+'</td>';
    if(k==='sysDisk') return '<td class="num-cell">'+tot.sysDisk+'</td>';
    if(k==='dataDisk') return '<td class="num-cell">'+tot.dataDisk+'</td>';
    return '<td></td>';
  }).join('')+'</tr>';

  tbody.innerHTML=rowsHtml;

  // Measure column widths for Excel export
  setTimeout(function(){
    var w={};
    document.querySelectorAll('thead th').forEach(function(th,i){
      if(i<columnOrder.length) w[columnOrder[i]]=Math.max(5,Math.round(th.offsetWidth/8));
    });
    window._colWidths=w;
  },0);
}

function escHtml(s){ return String(s).replace(/[&<>"]/g,function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]; }); }

// ═══════════════════════════════════════════════════
//  CRUD
// ═══════════════════════════════════════════════════

function openModal(id) {
  editId=id||null;
  document.getElementById('modalTitle').textContent=id?'编辑服务器':'新增服务器';
  const data=getCurrentData();
  const d=id?(data.find(x=>x.id===id)||{}):{};
  document.getElementById('f-name').value=d.name||'';
  document.getElementById('f-ip').value=d.ip||'';
  document.getElementById('f-category').value=d.category||'中间件类';
  document.getElementById('f-function').value=d.function||'应用服务';
  document.getElementById('f-os').value=d.os||'Linux';
  document.getElementById('f-count').value=d.count||1;
  document.getElementById('f-cpu').value=d.cpu||8;
  document.getElementById('f-memory').value=d.memory||16;
  document.getElementById('f-sysDisk').value=d.sysDisk||100;
  document.getElementById('f-dataDisk').value=d.dataDisk||200;
  document.getElementById('f-note').value=d.note||'';
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }
document.getElementById('modalOverlay').addEventListener('click',function(e){ if(e.target===this) closeModal(); });

function saveItem() {
  const name=document.getElementById('f-name').value.trim();
  if(!name){ alert('服务器名称不能为空'); return; }
  const obj={
    name,
    ip:document.getElementById('f-ip').value.trim(),
    category:document.getElementById('f-category').value,
    function:document.getElementById('f-function').value,
    os:document.getElementById('f-os').value,
    count:parseInt(document.getElementById('f-count').value)||1,
    cpu:parseInt(document.getElementById('f-cpu').value)||8,
    memory:parseInt(document.getElementById('f-memory').value)||16,
    sysDisk:parseInt(document.getElementById('f-sysDisk').value)||100,
    dataDisk:parseInt(document.getElementById('f-dataDisk').value)||0,
    note:document.getElementById('f-note').value.trim(),
  };
  const data=getCurrentData();
  if(editId){
    const i=data.findIndex(x=>x.id===editId);
    if(i>-1) data[i]={...data[i],...obj};
  }else{
    data.push({id:nextId++,...obj});
  }
  closeModal(); render();
  showToast(editId?'已更新：'+name:'已新增：'+name);
}

function delItem(id) {
  const data=getCurrentData();
  const d=data.find(x=>x.id===id);
  if(!d) return;
  if(!confirm('确认删除「'+d.name+'」？')) return;
  const idx=data.findIndex(x=>x.id===id);
  if(idx>-1) data.splice(idx,1);
  render();
  showToast('已删除：'+d.name);
}

function moveRow(id,dir) {
  const data=getCurrentData();
  const idx=data.findIndex(x=>x.id===id);
  if(idx===-1) return;
  const target=idx+dir;
  if(target<0||target>=data.length) return;
  [data[idx],data[target]]=[data[target],data[idx]];
  render();
}

// ═══════════════════════════════════════════════════
//  TEMPLATES
// ═══════════════════════════════════════════════════

function renderTemplateSelect() {
  const sel=document.getElementById('templateSelect');
  sel.innerHTML=templates.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
}

function applyTemplate() {
  const sel=document.getElementById('templateSelect');
  const tmpl=templates.find(t=>t.id===sel.value);
  if(!tmpl) return;
  const data=getCurrentData();

  if(tmpl.type==='k8s'){
    // Generate master rows
    for(let i=1;i<=tmpl.masterCount;i++){
      data.push({
        id:nextId++, name:tmpl.name+'-master-'+String(i).padStart(2,'0'), ip:'',
        category:tmpl.category, function:tmpl.function, os:'Linux',
        count:1, cpu:tmpl.masterCpu, memory:tmpl.masterMemory,
        sysDisk:tmpl.masterSysDisk, dataDisk:tmpl.masterDataDisk, note:tmpl.note||''
      });
    }
    // Generate node rows
    for(let i=1;i<=tmpl.nodeCount;i++){
      data.push({
        id:nextId++, name:tmpl.name+'-node-'+String(i).padStart(2,'0'), ip:'',
        category:tmpl.category, function:tmpl.function, os:'Linux',
        count:1, cpu:tmpl.nodeCpu, memory:tmpl.nodeMemory,
        sysDisk:tmpl.nodeSysDisk, dataDisk:tmpl.nodeDataDisk, note:tmpl.note||''
      });
    }
    showToast(`已应用模板「${tmpl.name}」：${tmpl.masterCount} master + ${tmpl.nodeCount} node`);
  }else{
    for(let i=1;i<=tmpl.count;i++){
      data.push({
        id:nextId++, name:tmpl.name+'-'+String(i).padStart(2,'0'), ip:'',
        category:tmpl.category, function:tmpl.function, os:'Linux',
        count:1, cpu:tmpl.cpu, memory:tmpl.memory,
        sysDisk:tmpl.sysDisk, dataDisk:tmpl.dataDisk, note:tmpl.note||''
      });
    }
    showToast(`已应用模板「${tmpl.name}」：${tmpl.count} 台`);
  }
  render();
}

// ── Template Management ──

function openTemplateMgr() {
  renderTemplateList();
  document.getElementById('tmplMgrOverlay').classList.add('open');
}
function closeTemplateMgr() { document.getElementById('tmplMgrOverlay').classList.remove('open'); }
document.getElementById('tmplMgrOverlay').addEventListener('click',function(e){ if(e.target===this) closeTemplateMgr(); });

function renderTemplateList() {
  const container=document.getElementById('tmplList');
  container.innerHTML=templates.map(t=>{
    let spec='';
    if(t.type==='k8s'){
      spec=`Master: ${t.masterCpu}核 ${t.masterMemory}G ×${t.masterCount} | Node: ${t.nodeCpu}核 ${t.nodeMemory}G ×${t.nodeCount}`;
    }else{
      spec=`${t.cpu}核 ${t.memory}G 系统${t.sysDisk}G 数据${t.dataDisk}G ×${t.count}台`;
    }
    return `<div class="tmpl-item">
      <div class="tmpl-icon ${t.type}">${t.type==='k8s'?'☸':'🖥'}</div>
      <div class="tmpl-info">
        <div class="tmpl-name">${escHtml(t.name)}</div>
        <div class="tmpl-desc">${escHtml(spec)}${t.note?' — '+escHtml(t.note):''}</div>
      </div>
      <div class="tmpl-acts">
        <button class="act-btn" onclick="openTemplateEdit('${t.id}')">编辑</button>
        <button class="act-btn del" onclick="deleteTemplate('${t.id}')">删除</button>
      </div>
    </div>`;
  }).join('');
}

function openTemplateEdit(id) {
  tmplEditId=id||null;
  document.getElementById('tmplEditTitle').textContent=id?'编辑模板':'新增模板';
  const t=id?templates.find(x=>x.id===id):null;

  document.getElementById('tf-name').value=t?t.name:'';
  document.getElementById('tf-category').value=t?t.category:'中间件类';
  document.getElementById('tf-function').value=t?t.function:'应用服务';
  document.getElementById('tf-type').value=t?t.type:'normal';
  document.getElementById('tf-note').value=t?t.note||'':'';

  // Normal fields
  document.getElementById('tf-cpu').value=t&&t.type==='normal'?t.cpu:8;
  document.getElementById('tf-memory').value=t&&t.type==='normal'?t.memory:16;
  document.getElementById('tf-sysDisk').value=t&&t.type==='normal'?t.sysDisk:100;
  document.getElementById('tf-dataDisk').value=t&&t.type==='normal'?t.dataDisk:200;
  document.getElementById('tf-count').value=t&&t.type==='normal'?t.count:1;

  // K8s fields
  document.getElementById('tf-mCpu').value=t&&t.type==='k8s'?t.masterCpu:8;
  document.getElementById('tf-mMemory').value=t&&t.type==='k8s'?t.masterMemory:16;
  document.getElementById('tf-mSysDisk').value=t&&t.type==='k8s'?t.masterSysDisk:200;
  document.getElementById('tf-mDataDisk').value=t&&t.type==='k8s'?t.masterDataDisk:0;
  document.getElementById('tf-mCount').value=t&&t.type==='k8s'?t.masterCount:3;
  document.getElementById('tf-nCpu').value=t&&t.type==='k8s'?t.nodeCpu:16;
  document.getElementById('tf-nMemory').value=t&&t.type==='k8s'?t.nodeMemory:64;
  document.getElementById('tf-nSysDisk').value=t&&t.type==='k8s'?t.nodeSysDisk:200;
  document.getElementById('tf-nDataDisk').value=t&&t.type==='k8s'?t.nodeDataDisk:500;
  document.getElementById('tf-nCount').value=t&&t.type==='k8s'?t.nodeCount:5;

  toggleTmplType();
  document.getElementById('tmplEditOverlay').classList.add('open');
  document.getElementById('tmplMgrOverlay').classList.remove('open');
}

function closeTemplateEdit() { document.getElementById('tmplEditOverlay').classList.remove('open'); }
document.getElementById('tmplEditOverlay').addEventListener('click',function(e){ if(e.target===this) closeTemplateEdit(); });

function toggleTmplType() {
  const type=document.getElementById('tf-type').value;
  document.getElementById('tf-normal').style.display=type==='normal'?'block':'none';
  document.getElementById('tf-k8s').style.display=type==='k8s'?'block':'none';
}

function saveTemplate() {
  const name=document.getElementById('tf-name').value.trim();
  if(!name){ alert('模板名称不能为空'); return; }

  const type=document.getElementById('tf-type').value;
  const base={
    name, category:document.getElementById('tf-category').value,
    function:document.getElementById('tf-function').value,
    type, note:document.getElementById('tf-note').value.trim(),
  };

  if(type==='k8s'){
    Object.assign(base,{
      masterCpu:parseInt(document.getElementById('tf-mCpu').value)||8,
      masterMemory:parseInt(document.getElementById('tf-mMemory').value)||16,
      masterSysDisk:parseInt(document.getElementById('tf-mSysDisk').value)||200,
      masterDataDisk:parseInt(document.getElementById('tf-mDataDisk').value)||0,
      masterCount:parseInt(document.getElementById('tf-mCount').value)||3,
      nodeCpu:parseInt(document.getElementById('tf-nCpu').value)||16,
      nodeMemory:parseInt(document.getElementById('tf-nMemory').value)||64,
      nodeSysDisk:parseInt(document.getElementById('tf-nSysDisk').value)||200,
      nodeDataDisk:parseInt(document.getElementById('tf-nDataDisk').value)||500,
      nodeCount:parseInt(document.getElementById('tf-nCount').value)||5,
    });
  }else{
    Object.assign(base,{
      cpu:parseInt(document.getElementById('tf-cpu').value)||8,
      memory:parseInt(document.getElementById('tf-memory').value)||16,
      sysDisk:parseInt(document.getElementById('tf-sysDisk').value)||100,
      dataDisk:parseInt(document.getElementById('tf-dataDisk').value)||200,
      count:parseInt(document.getElementById('tf-count').value)||1,
    });
  }

  if(tmplEditId){
    const i=templates.findIndex(x=>x.id===tmplEditId);
    if(i>-1) templates[i]={...templates[i],...base};
    showToast('已更新模板：'+name);
  }else{
    base.id='t'+ (tmplNextId++);
    templates.push(base);
    showToast('已新增模板：'+name);
  }
  closeTemplateEdit();
  openTemplateMgr(); // refresh list
  renderTemplateSelect();
}

function deleteTemplate(id) {
  const t=templates.find(x=>x.id===id);
  if(!t) return;
  if(!confirm('确认删除模板「'+t.name+'」？')) return;
  templates=templates.filter(x=>x.id!==id);
  renderTemplateList();
  renderTemplateSelect();
  showToast('已删除模板：'+t.name);
}

// ═══════════════════════════════════════════════════
//  EXPORT — Column Selection
// ═══════════════════════════════════════════════════

function createExportListItem(col,includeCheckbox){
  const div=document.createElement('div');
  div.className='export-list-item';
  div.dataset.key=col.key;
  if(includeCheckbox){
    div.innerHTML=`<input type="checkbox" class="export-checkbox"><span class="col-label">${col.label}</span><span class="col-key">${col.key}</span>`;
  }else{
    div.innerHTML=`<span class="col-label">${col.label}</span><span class="col-key">${col.key}</span>`;
  }
  div.addEventListener('click',function(e){
    if(e.target.type==='checkbox'||e.target.tagName==='BUTTON') return;
    document.querySelectorAll('.export-list-item.selected').forEach(el=>el.classList.remove('selected'));
    this.classList.toggle('selected');
  });
  return div;
}

function openExportModal(){
  const avail=document.getElementById('availableColumns');
  const sel=document.getElementById('selectedColumns');
  avail.innerHTML=''; sel.innerHTML='';
  columnDefs.forEach(col=>avail.appendChild(createExportListItem(col,true)));
  document.getElementById('exportModalOverlay').classList.add('open');
}
function closeExportModal(){ document.getElementById('exportModalOverlay').classList.remove('open'); }
document.getElementById('exportModalOverlay').addEventListener('click',function(e){ if(e.target===this) closeExportModal(); });

function selectAll(list,checked){
  const container=document.getElementById(list==='available'?'availableColumns':'selectedColumns');
  container.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.checked=checked);
}

function moveColumns(dir){
  const fromList=document.getElementById(dir==='toSelected'?'availableColumns':'selectedColumns');
  const toList=document.getElementById(dir==='toSelected'?'selectedColumns':'availableColumns');
  const items=Array.from(fromList.querySelectorAll('.export-list-item')).filter(item=>{
    const cb=item.querySelector('input[type="checkbox"]');
    return cb&&cb.checked;
  });
  if(!items.length){
    const sel=document.querySelector('.export-list-item.selected');
    if(!sel||!fromList.contains(sel)){ alert('请先勾选要移动的列'); return; }
    items.push(sel);
  }
  items.forEach(item=>{
    const col=columnDefs.find(c=>c.key===item.dataset.key);
    if(!col) return;
    const newItem=createExportListItem(col,true);
    toList.appendChild(newItem);
    item.remove();
  });
}

function moveColumn(dir){
  const list=document.getElementById('selectedColumns');
  const sel=list.querySelector('.export-list-item.selected');
  if(!sel){ alert('请在导出列列表中选择要移动的列'); return; }
  const sib=dir==='up'?sel.previousElementSibling:sel.nextElementSibling;
  if(sib) list.insertBefore(dir==='up'?sel:sib, dir==='up'?sib:sel);
}

// ═══════════════════════════════════════════════════
//  EXPORT — Excel
// ═══════════════════════════════════════════════════

// Convert 1-based column index to Excel column letter (A, B, ..., Z, AA, AB, ...)
function colLetter(n){
  let s='';
  while(n>0){ n--; s=String.fromCharCode(65+(n%26))+s; n=Math.floor(n/26); }
  return s;
}

async function exportToExcel(){
  const selList=document.getElementById('selectedColumns');
  const items=Array.from(selList.querySelectorAll('.export-list-item'));
  if(!items.length){ alert('请至少选择一列进行导出'); return; }

  const cols=items.map(item=>columnDefs.find(c=>c.key===item.dataset.key)).filter(Boolean);
  const title=document.getElementById('reportTitle').value.trim()||'服务器配置清单';

  const wb=new ExcelJS.Workbook();
  // Create "基本信息" sheet first
  await createBasicInfoSheet(wb, basicInfo);
  await createSheet(wb,'测试环境',testData,cols,title);
  await createSheet(wb,'生产环境',prodData,cols,title);

  const buffer=await wb.xlsx.writeBuffer();
  const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=(title.replace(/[/\\*?:"<>|]/g,'_')||'服务器配置清单')+'.xlsx';
  a.click();
  URL.revokeObjectURL(url);

  closeExportModal();
  showToast('导出成功！文件已下载（含测试/生产两个 Sheet，底部有合计行）。');
}

async function createSheet(wb,sheetName,data,cols,title){
  const ws=wb.addWorksheet(sheetName,{properties:{tabColor:{argb:'FF2D8C5E'}}});

  var wm=window._colWidths||{};
  var widthMap={
    seq:wm.seq||5, name:wm.name||22, ip:wm.ip||18, category:wm.category||10,
    function:wm.function||10, os:wm.os||14, count:wm.count||10, cpu:wm.cpu||8,
    memory:wm.memory||9, sysDisk:wm.sysDisk||10, dataDisk:wm.dataDisk||10, note:wm.note||20
  };
  // Define columns (creates header row at row 1 automatically)
  ws.columns=cols.map(c=>({header:c.label, key:c.key, width:(widthMap[c.key]||14)}));

  // ── Insert title row at position 1 (shifts header to row 2) ──
  ws.spliceRows(1,0,[]);
  ws.mergeCells(1,1,1,cols.length);
  const tCell=ws.getCell(1,1);
  tCell.value=title;
  tCell.font={bold:true,size:14,name:'Segoe UI',color:{argb:'FF2D5C4E'}};
  tCell.alignment={vertical:'middle',horizontal:'center'};
  tCell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF5F6F0'}};
  tCell.border={bottom:{style:'thin',color:{argb:'FFDDDDD5'}},left:{style:'thin',color:{argb:'FFDDDDD5'}},right:{style:'thin',color:{argb:'FFDDDDD5'}}};
  ws.getRow(1).height=30;

  // ── Style header (row 2) ──
  const hdr=ws.getRow(2);
  hdr.height=22;
  hdr.eachCell((cell)=>{
    cell.font={bold:true,color:{argb:'FFFFFFFF'},name:'Segoe UI',size:11};
    cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF2D5C4E'}};
    cell.alignment={vertical:'middle',horizontal:'center'};
    cell.border={top:{style:'thin',color:{argb:'FF1A7A3E'}},bottom:{style:'thin',color:{argb:'FF1A7A3E'}},left:{style:'thin',color:{argb:'FF1A7A3E'}},right:{style:'thin',color:{argb:'FF1A7A3E'}}};
  });

  // ── Data rows (values multiplied by count) ──
  data.forEach((row,idx)=>{
    const mult=v=>(v||0)*(row.count||1);
    const values=cols.map(c=>{
      if(c.key==='seq') return idx+1;
      if(['cpu','memory','sysDisk','dataDisk'].includes(c.key)){
        return mult(row[c.key]);
      }
      const v=row[c.key];
      return v!==undefined&&v!==null?v:'';
    });
    const rowObj=ws.addRow(values);
    rowObj.eachCell((cell,cellIdx)=>{
      cell.font={name:'Segoe UI',size:11,color:{argb:'FF2C2C28'}};
      cell.border={bottom:{style:'thin',color:{argb:'FFDDDDD5'}},left:{style:'thin',color:{argb:'FFDDDDD5'}},right:{style:'thin',color:{argb:'FFDDDDD5'}}};
      cell.alignment={vertical:'middle'};
      const colDef=cols[cellIdx-1];
      if(colDef&&sumKeys.includes(colDef.key)){
        cell.alignment={vertical:'middle',horizontal:'right'};
        cell.numFmt='#,##0';
      }
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:idx%2===0?'FFFFFFFF':'FFF5F6F0'}};
    });
  });

  // ── Total row ──
  const lastDataRow=2+data.length;
  const totalRow=ws.addRow([]);
  totalRow.height=22;
  cols.forEach((col,idx)=>{
    const cell=totalRow.getCell(idx+1);
    if(col.key==='seq'){
      cell.value='合计';
      cell.font={bold:true,size:11,name:'Segoe UI',color:{argb:'FF2D5C4E'}};
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE6F4ED'}};
      cell.alignment={vertical:'middle',horizontal:'left'};
    }else if(sumKeys.includes(col.key)){
      const letter=colLetter(idx+1);
      cell.value={formula:`SUM(${letter}3:${letter}${lastDataRow})`};
      cell.numFmt='#,##0';
      cell.font={bold:true,size:11,name:'Segoe UI',color:{argb:'FFC97C10'}};
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFEF4E0'}};
      cell.alignment={vertical:'middle',horizontal:'right'};
    }else{
      cell.value='';
    }
    cell.border={top:{style:'medium',color:{argb:'FF2D8C5E'}},bottom:{style:'double',color:{argb:'FF2D8C5E'}},left:{style:'thin',color:{argb:'FF2D8C5E'}},right:{style:'thin',color:{argb:'FF2D8C5E'}}};
  });

  return ws;
}

// ── Create "基本信息" Sheet ──
async function createBasicInfoSheet(wb, content){
  const ws=wb.addWorksheet('基本信息',{properties:{tabColor:{argb:'FF5B6ABF'}}});
  ws.columns=[{header:'项目',key:'item',width:20},{header:'内容',key:'content',width:80}];

  // Title row
  ws.spliceRows(1,0,[]);
  ws.mergeCells(1,1,1,2);
  const tCell=ws.getCell(1,1);
  tCell.value='基本信息';
  tCell.font={bold:true,size:14,name:'Segoe UI',color:{argb:'FF5B6ABF'}};
  tCell.alignment={vertical:'middle',horizontal:'center'};
  tCell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF5F6F0'}};
  tCell.border={bottom:{style:'thin',color:{argb:'FFDDDDD5'}},left:{style:'thin',color:{argb:'FFDDDDD5'}},right:{style:'thin',color:{argb:'FFDDDDD5'}}};
  ws.getRow(1).height=30;

  // Header row
  const hdr=ws.getRow(2);
  hdr.height=22;
  hdr.getCell(1).value='项目';
  hdr.getCell(2).value='内容';
  [1,2].forEach(i=>{
    const cell=hdr.getCell(i);
    cell.font={bold:true,color:{argb:'FFFFFFFF'},name:'Segoe UI',size:11};
    cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF5B6ABF'}};
    cell.alignment={vertical:'middle',horizontal:'center'};
    cell.border={top:{style:'thin',color:{argb:'FF4A5AAE'}},bottom:{style:'thin',color:{argb:'FF4A5AAE'}},left:{style:'thin',color:{argb:'FF4A5AAE'}},right:{style:'thin',color:{argb:'FF4A5AAE'}}};
  });

  // Content rows - split by newline
  const lines=content.split('\n').filter(l=>l.trim());
  if(lines.length===0){
    ws.addRow(['','']);
  }else{
    lines.forEach((line,idx)=>{
      const row=ws.addRow(['',line]);
      row.getCell(1).value='记录 '+(idx+1);
      row.eachCell((cell,ci)=>{
        cell.font={name:'Segoe UI',size:11,color:{argb:'FF2C2C28'}};
        cell.border={bottom:{style:'thin',color:{argb:'FFDDDDD5'}},left:{style:'thin',color:{argb:'FFDDDDD5'}},right:{style:'thin',color:{argb:'FFDDDDD5'}}};
        cell.alignment={vertical:'middle'};
        cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:idx%2===0?'FFFFFFFF':'FFF5F6F0'}};
      });
    });
  }

  return ws;
}

// ═══════════════════════════════════════════════════
//  EMAIL — Send via SMTP
// ═══════════════════════════════════════════════════

async function sendEmail(){
  const toInput=document.getElementById('emailTo').value.trim();
  if(!toInput){ alert('请输入收件人邮箱地址'); return; }
  const btn=document.getElementById('sendEmailBtn');
  btn.disabled=true;
  btn.textContent='⏳ 发送中…';

  try{
    // Parse recipients
    const recipients=toInput.split(/[,;，；]/).map(s=>s.trim()).filter(Boolean);
    if(!recipients.length){ alert('请输入有效的收件人邮箱地址'); btn.disabled=false; btn.textContent='📧 发送邮件'; return; }

    // Validate emails
    const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for(const r of recipients){
      if(!emailRe.test(r)){ alert('邮箱格式无效: '+r); btn.disabled=false; btn.textContent='📧 发送邮件'; return; }
    }

    // Generate Excel
    const title=document.getElementById('reportTitle').value.trim()||'服务器配置清单';
    const wb=new ExcelJS.Workbook();
    await createBasicInfoSheet(wb, basicInfo);
    // Get selected columns for server sheets (default to all if not configured)
    const selList=document.getElementById('selectedColumns');
    let exportItems=Array.from(selList.querySelectorAll('.export-list-item'));
    if(!exportItems.length){
      // Use all columns as default
      exportItems=columnDefs.map(c=>document.createElement('div'));
      exportItems.forEach((item,i)=>{item.dataset.key=columnDefs[i].key;});
    }
    const cols=exportItems.map(item=>columnDefs.find(c=>c.key===item.dataset.key)).filter(Boolean);
    await createSheet(wb,'测试环境',testData,cols,title);
    await createSheet(wb,'生产环境',prodData,cols,title);
    const buffer=await wb.xlsx.writeBuffer();

    // Convert to base64
    const bytes=new Uint8Array(buffer);
    let binary='';
    for(let i=0;i<bytes.length;i++) binary+=String.fromCharCode(bytes[i]);
    const base64=btoa(binary);
    const filename=(title.replace(/[/\\*?:"<>|]/g,'_')||'服务器配置清单')+'.xlsx';

        // Send via local mail server
    const mailServerUrl=window.location.protocol+'//'+window.location.host+'/api/sendmail';
    const resp=await fetch(mailServerUrl, {
      method: 'POST',
      headers: {'Content-Type':'application/json; charset=utf-8'},
      body: JSON.stringify({
        to: recipients,
        subject: title,
        body: '您好，请查收附件中的服务器配置清单。

此邮件由系统自动发送。',
        attachment: base64,
        filename: filename
      })
    });
    const result=await resp.json();
    if(result.ok){
      showToast('邮件发送成功！收件人：'+recipients.join(', '));
    }else{
      throw new Error(result.error||'服务器响应异常');
    }
  }catch(e){
    console.error('Email send error:', e);
    alert('邮件发送失败：'+e.message);
  }finally{
    btn.disabled=false;
    btn.textContent='📧 发送邮件';
  }
}

// ═══════════════════════════════════════════════════
//  DRAG & DROP — Column reorder
// ═══════════════════════════════════════════════════

function initDragDrop(){
  var thead=document.querySelector('thead');
  if(!thead) return;
  var dragKey=null;
  thead.addEventListener('dragstart',function(e){
    if(e.target.closest('.resize-handle')) return;
    var th=e.target.closest('th');
    if(!th) return;
    dragKey=th.dataset.col;
    e.dataTransfer.effectAllowed='move';
    setTimeout(function(){th.classList.add('drag-src');},0);
  });
  thead.addEventListener('dragend',function(){
    document.querySelectorAll('.drag-src,.drag-over').forEach(function(el){el.classList.remove('drag-src','drag-over');});
    dragKey=null;
  });
  thead.addEventListener('dragover',function(e){
    e.preventDefault();
    var th=e.target.closest('th');
    if(!th||th.dataset.col===dragKey) return;
    document.querySelectorAll('.drag-over').forEach(function(el){el.classList.remove('drag-over');});
    th.classList.add('drag-over');
  });
  thead.addEventListener('dragleave',function(e){
    var th=e.target.closest('th');
    if(th) th.classList.remove('drag-over');
  });
  thead.addEventListener('drop',function(e){
    e.preventDefault();
    var th=e.target.closest('th');
    if(!th||!dragKey||th.dataset.col===dragKey) return;
    var rect=th.getBoundingClientRect();
    var before=e.clientX<rect.left+rect.width/2;
    var fromIdx=columnOrder.indexOf(dragKey);
    var toIdx=columnOrder.indexOf(th.dataset.col);
    if(toIdx<0) return;
    if(!before&&toIdx<fromIdx) toIdx++;
    else if(before&&toIdx>fromIdx) toIdx--;
    if(fromIdx>=0&&toIdx>=0&&toIdx<columnOrder.length){
      var item=columnOrder.splice(fromIdx,1)[0];
      columnOrder.splice(toIdx,0,item);
      render();
    }
    document.querySelectorAll('.drag-src,.drag-over').forEach(function(el){el.classList.remove('drag-src','drag-over');});
    dragKey=null;
  });
}

// ═══════════════════════════════════════════════════
//  COLUMN RESIZE (mouse drag)
// ═══════════════════════════════════════════════════

function initColumnResize(){
  var st=null;
  document.addEventListener('mousedown',function(e){
    var h=e.target.closest('.resize-handle');
    if(!h) return;
    var th=h.closest('th');
    if(!th) return;
    e.preventDefault();
    st={col:th.dataset.col,startX:e.clientX,startWidth:th.offsetWidth};
    h.classList.add('resizing');
  });
  document.addEventListener('mousemove',function(e){
    if(!st) return;
    e.preventDefault();
    var diff=e.clientX-st.startX;
    var w=Math.max(30,st.startWidth+diff);
    columnWidths[st.col]=w;
    document.querySelectorAll('th[data-col="'+st.col+'"]').forEach(function(th){
      th.style.width=w+'px';
    });
    // Update export column width measurement
    if(!window._colWidths) window._colWidths={};
    window._colWidths[st.col]=Math.round(w/8);
  });
  document.addEventListener('mouseup',function(){
    if(!st) return;
    document.querySelectorAll('.resize-handle.resizing').forEach(function(el){el.classList.remove('resizing');});
    st=null;
  });
}

// ═══════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════

initDragDrop();
initColumnResize();
render();
