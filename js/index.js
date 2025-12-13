// --- 0. 配置数据 (新增：命名空间数组) ---
const k8sNamespaces = [
    "pbs",
    "roc-sit",
    "roc-dev",
    "roc-v2-test",
    "roc-uat",
    "roc-prod",
    "pos-poc",
    "pos-sit",
    "pos-uat",
    "pos-prod",
    "wms-uat",
    "wms-prod",
    "myshop-uat",
    "myshop-prod"
];

// --- 核心数据配置 ---
const database = [
    {
        id: "shell",
        title: { zh: "Shell", en: "Shell" },
        type: "cmd",
        items: [
            { cmd: "cat /etc/os-release | grep '^ID=' | awk -F= '{print $2}'", desc: "查看系统类型" },
            { cmd: "cat /etc/os-release | grep 'VERSION_ID=' | awk -F= '{print $2}' | tr -d [:punct:]", desc: "查看系统版本" },
            { cmd: "find / -size +500M", desc: "查找大于500M文件" },
            { cmd: "docker system prune -a", desc: "清理Docker垃圾" },
            { cmd: "tail -f /var/log/messages", desc: "实时系统日志" },
            { cmd: "echo 'alias kb='kubectl'' >> ~/.bashrc && source ~/.bashrc", desc: "建立kb命令." },
            
        ]
    },
    {
        id: "net",
        title: { zh: "网络", en: "Network" },
        type: "cmd",
        items: [
             { cmd: "firewall-cmd --reload", desc: "防火墙重载" },
             { cmd: "nc -v -z 127.0.0.1 8080", desc: "探测端口(nc)" },
             { cmd: "netstat -ntlp", desc: "查看监听端口" }
        ]
    },
    {
        id: "nacos",
        title: { zh: "Nacos", en: "Nacos" },
        type: "cmd",
        items: [
             { cmd: "firewall-cmd --reload", desc: "防火墙重载" },
             { cmd: "nc -v -z 127.0.0.1 8080", desc: "探测端口(nc)" },
             { cmd: "netstat -ntlp", desc: "查看监听端口" }
        ]
    },
    {
        id: "db",
        title: { zh: "数据库", en: "Database" },
        type: "cmd",
        items: [
             { cmd: "firewall-cmd --reload", desc: "防火墙重载" },
             { cmd: "nc -v -z 127.0.0.1 8080", desc: "探测端口(nc)" },
             { cmd: "netstat -ntlp", desc: "查看监听端口" }
        ]
    },            
    {
        id: "nginx",
        title: { zh: "Nginx", en: "Nginx" },
        type: "code",
        items: [
            { 
                desc: "反向代理 (Proxy Pass)",
                cmd: `server {
    listen       9999;
    server_name  localhost;
    location / {
        proxy_pass http://192.168.0.1;
    }
}` 
            }
        ]
    },            
    {
        id: "k8s",
        title: { zh: "K8s", en: "K8s" },
        type: "k8s",
        items: [
            { cmd: "kubectl rollout restart deploy -n roc-uat roc-goods", desc: "滚动重启" ,doc:"https://kubernetes.io/zh-cn/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/" },
            { cmd: "kubectl -n roc-uat scale deployment roc-goods --replicas=1", desc: "缩容,设置pod为1份." },
            { cmd: "kubectl -n roc-uat set image deployment roc-goods roc-goods=版本号", desc: "更新pod版本." },
            { cmd: "kubectl -n roc-uat logs -f --tail 200 roc-goods", desc: "查看日志",doc:"" },
            { cmd: "kubectl -n roc-uat get pods |grep Evicted | awk '{print $1}' | xargs kubectl -n roc-uat delete pod", desc: "删除大量evicted的pod.",doc:"" },
            { cmd: "docker cp ab5593917446:/home/logs/error.log ./", desc: "ab5593917446=容器Id(通过docker ps可以查询到),从容器中复制文件到本地，反之则从本地复制到容器里面.",doc:"" },
            { cmd: "kubectl cp &lt;namespace&gt;/&lt;pod&gt;:&lt;root_dir&gt;/&lt;parent_dir&gt;/&lt;file_name&gt; ./&lt;file_name&gt;", desc: "从pod复制文件到本地",doc:"" },
            { cmd: "kubectl cp ./&lt;file_name&gt; &lt;namespace&gt;/&lt;pod&gt;:&lt;root_dir&gt;/&lt;parent_dir&gt;/&lt;file_name&gt;", desc: "从本地复制到pod.",doc:"" },

            { cmd: "docker rmi $(docker images -f 'dangling=true' -q)", desc: "批量删除这些标签为none的镜像",doc:"" },
            { cmd: "kubectl -n roc-uat exec -it roc-goods  -- curl http://www.baidu.com", desc: "通过pod临时访问外部地址，测试是否能联通.",doc:"" },

            { cmd: `kubectl -n roc-uat exec -it roc-goods  -- timeout 10 bash -c "</dev/tcp/192.168.0.1/8080" 2>/dev/null && echo "通" || echo "不通"`, desc: "通过pod测试,192.168.0.1:8080是否能通.",doc:"" },
            
            { cmd: "kubectl -n roc-uat delete pod roc-goods --grace-period=0 --force --wait=false", desc: "强制删除pod",doc:"" },
            { cmd: `kubectl -n roc-uat get pods -o=jsonpath='{range .items[*]}{"kubectl rollout restart deploy -n roc-uat "}{.metadata.labels.app}{"\\n"}'`, desc: "批量生成需要重启的pod命令.",doc:"" },

            { cmd: "kubectl -n roc-uat top pod --sort-by=memory", desc: "根据内存排序",doc:"" },
            
            { cmd: "kubectl -n roc-uat top pod --sort-by=memory | tail -n +2 | sort -k3 -h", desc: "根据内存-升序",doc:"" },
  
            


        ]
    },
    {
        id: "link",
        title: { zh: "链接", en: "Links" },
        type: "list",
        // 链接数据：包含 category 属性
        items: [
            { text: "Check IP (cip.cc)", url: "https://cip.cc/", desc: "公网IP", category: "🛠️ 工具类" },
            { text: "JSON Format", url: "https://www.json.cn/", desc: "JSON解析", category: "🛠️ 工具类" },
            { text: "Base64 Encode", url: "https://base64.us/", desc: "Base64转换", category: "🛠️ 工具类" },
            
            { text: "K8s Docs", url: "https://kubernetes.io/docs/", desc: "官方文档", category: "📚 文档类" },
            { text: "Nginx Docs", url: "http://nginx.org/en/docs/", desc: "Nginx文档", category: "📚 文档类" },
            { text: "MDN Web Docs", url: "https://developer.mozilla.org/", desc: "Web开发", category: "📚 文档类" },
            
            { text: "Prometheus", url: "http://prometheus.local", desc: "监控大盘", category: "📊 监控类" },
            { text: "Grafana", url: "http://grafana.local", desc: "图表展示", category: "📊 监控类" },                   
        ]
    }
];

// 模拟 API 数据
const mockNotifyData = {
    hasData: true,
    summary: "⚠️ [公告] 生产环境 K8s 集群将于今晚 23:00 维护，请周知。",
    detail: "<div style='padding:20px; font-family: sans-serif;'><h2>维护通知</h2><p>时间：23:00 - 01:00</p><p>内容：K8s 集群升级</p></div>"
};

const app = {
    state: {
        lang: localStorage.getItem('lang') || 'zh',
        theme: localStorage.getItem('theme') || 'light',
        k8s: { ns: 'roc-uat', pod: 'roc-goods', ver: '版本号' }
    },

    init() {
        this.render();
        this.applySettings();
        // this.checkNotification();
    },

    // 🔴 第一步：新增这个转义函数（放在 render 函数上面）
    escapeHtml(text) {
        if (!text) return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    render() {
        const desktopNav = document.getElementById('desktop-nav-container');
        const mobileMenu = document.getElementById('mobile-menu');
        const mainEl = document.getElementById('main-content');
        let navHtml = '', mainHtml = '';

        database.forEach(section => {
            const title = section.title[this.state.lang] || section.title.zh;
            navHtml += `<a href="#${section.id}" onclick="app.closeMenu()">${title}</a>`;

            // 1. 搜索框
            let searchHtml = '';
            if (['cmd', 'k8s'].includes(section.type)) {
                const ph = this.state.lang === 'zh' ? '搜索...' : 'Search...';
                searchHtml = `
                <div class="search-wrapper">
                    <input type="text" class="section-search" placeholder="${ph}" 
                        oninput="app.filterCmds(this, '${section.id}')">
                    <span class="search-clear" onclick="app.clearSearch(this, '${section.id}')">✕</span>
                </div>`;
            }

            // 2. K8S 面板
            let controlHtml = '';
            // if (section.type === 'k8s') {
            //     const btnText = this.state.lang === 'zh' ? '替换' : 'Replace';
            //     controlHtml = `
            //     <div class="control-panel">
            //         <label>NS:</label>
            //         <select id="k8s-ns" style="width:150px"><option value="roc-uat">roc-uat</option><option value="roc-prod">roc-prod</option></select>
            //         <label>Pod:</label> <input id="k8s-pod" value="roc-goods" style="width:150px">
            //         <label>Ver:</label> <input id="k8s-ver" value="版本号" style="width:300px;">
            //         <button class="action-btn" onclick="app.replaceK8sCmd()">${btnText}</button>
            //     </div>`;
            // }

            if (section.type === 'k8s') {
                const btnText = this.state.lang === 'zh' ? '替换' : 'Replace';
                
                // --- 核心修改开始：遍历数组生成 options ---
                // 逻辑：生成 HTML 字符串，如果当前值等于 state 中的值，则添加 selected 属性
                const optionsHtml = k8sNamespaces.map(ns => 
                    `<option value="${ns}" ${ns === this.state.k8s.ns ? 'selected' : ''}>${ns}</option>`
                ).join('');
                // --- 核心修改结束 ---

                controlHtml = `
                <div class="control-panel">
                    <label>NS:</label>
                    <select id="k8s-ns" style="width:150px">${optionsHtml}</select> 
                    <label>Pod:</label> <input id="k8s-pod" value="roc-goods" style="width:150px">
                    <label>Ver:</label> <input id="k8s-ver" value="版本号" style="width:300px;">
                    <button class="action-btn" onclick="app.replaceK8sCmd()">${btnText}</button>
                </div>`;
            }

            // 3. 内容区
            let contentHtml = '';
            const btnCopy = this.state.lang === 'zh' ? '复制' : 'Copy';

            if (section.type === 'list') {
                // --- Grid 分类渲染 ---
                const groups = {};
                section.items.forEach(item => {
                    const cat = item.category || 'Other';
                    if (!groups[cat]) groups[cat] = [];
                    groups[cat].push(item);
                });

                contentHtml = `<div class="link-grid-layout">`;
                for (const [cat, items] of Object.entries(groups)) {
                    const listItems = items.map(link => {
                        const descSpan = link.desc ? `<span class="link-desc">(${link.desc})</span>` : '';
                        return `<li><a href="${link.url}" target="_blank">${link.text}</a>${descSpan}</li>`;
                    }).join('');
                    
                    contentHtml += `
                    <div class="link-category-card">
                        <h3 class="link-cat-title">${cat}</h3>
                        <ol class="link-ol">${listItems}</ol>
                    </div>`;
                }
                contentHtml += `</div>`;
            } else {
                // --- 命令行渲染 ---
                contentHtml = section.items.map((item, index) => {
                    const cmdText = typeof item === 'string' ? item : item.cmd;
                    const descText = (typeof item === 'object' && item.desc) ? item.desc : '';
                    
                    // 新增：详情链接渲染逻辑
                    const docUrl = (typeof item === 'object' && item.doc) ? item.doc : '';
                    const docHtml = docUrl ? `<a href="${docUrl}" target="_blank" class="cmd-doc-link">📖 详情</a>` : '';
                    
                    // 将 docHtml 放入备注中
                    const descHtml = descText ? `<div class="cmd-desc">// ${descText} ${docHtml}</div>` : '';
                    
                    const numHtml = section.type === 'code' ? '' : `<div class="cmd-num">#${index + 1}</div>`;
                    const extraClass = section.type === 'code' ? 'code-mode' : '';
                    const searchText = (cmdText + ' ' + descText).toLowerCase();
                    
                    return `
                    <div class="cmd-box ${extraClass}" data-filter="${searchText}">
                        ${numHtml}
                        <div class="cmd-wrapper">
                            <pre>${cmdText}</pre>
                            ${descHtml}
                        </div>
                        <button class="copy-btn" onclick="app.copy(this)">${btnCopy}</button>
                    </div>`;
                }).join('');
            }

            mainHtml += `
            <div id="${section.id}" class="section">
                <div class="section-header">
                    <h2>${title}</h2>
                    ${searchHtml}
                </div>
                ${controlHtml}
                <div class="cmd-list-container">${contentHtml}</div>
            </div>`;
        });

        desktopNav.innerHTML = navHtml;
        mobileMenu.innerHTML = navHtml;
        mainEl.innerHTML = mainHtml;
    },

    // --- 功能函数 ---
    filterCmds(input, sectionId) {
        const term = input.value.toLowerCase();
        const clearBtn = input.nextElementSibling;
        clearBtn.style.display = term.length > 0 ? 'block' : 'none';
        document.querySelectorAll(`#${sectionId} .cmd-box`).forEach(box => {
            box.style.display = box.getAttribute('data-filter').includes(term) ? 'flex' : 'none';
        });
    },
    clearSearch(btn, sectionId) {
        const input = btn.previousElementSibling; input.value = ''; btn.style.display = 'none';
        document.querySelectorAll(`#${sectionId} .cmd-box`).forEach(box => box.style.display = 'flex');
        input.focus();
    },
    toggleMenu() { document.getElementById('mobile-menu').classList.toggle('open'); },
    closeMenu() { document.getElementById('mobile-menu').classList.remove('open'); },
    copy(btn) {
        const pre = btn.previousElementSibling.querySelector('pre');
        if(!pre) return;
        navigator.clipboard.writeText(pre.innerText).then(() => {
            const orig = btn.innerText; btn.innerText = "✓";
            setTimeout(() => btn.innerText = orig, 1000);
        });
    },
    replaceK8sCmd() {
        const ns = document.getElementById('k8s-ns').value;
        const pod = document.getElementById('k8s-pod').value;
        const ver = document.getElementById('k8s-ver').value;
        document.querySelectorAll('#k8s pre').forEach(pre => {
            let txt = pre.innerText;
            txt = txt.split(this.state.k8s.ns).join(ns);
            txt = txt.split(this.state.k8s.pod).join(pod);
            txt = txt.split(this.state.k8s.ver).join(ver);
            pre.innerText = txt;
        });
        this.state.k8s = { ns, pod, ver };
    },

    // --- 设置与通知 ---
    applySettings() {
        document.documentElement.setAttribute('data-theme', this.state.theme);
        document.getElementById('themeSelect').value = this.state.theme;
        document.getElementById('langSelect').value = this.state.lang;
    },
    toggleTheme(val) { this.state.theme = val; localStorage.setItem('theme', val); this.applySettings(); },
    toggleLang(val) { this.state.lang = val; localStorage.setItem('lang', val); this.render(); this.applySettings(); if(document.getElementById('notify-bar').style.display==='flex') this.adjustLayout(true); },
    
    checkNotification() {
        setTimeout(() => {
            if (mockNotifyData.hasData) {
                document.getElementById('notify-text').innerText = mockNotifyData.summary;
                this.notifyDetailHtml = mockNotifyData.detail;
                const bar = document.getElementById('notify-bar');
                bar.style.display = 'flex';
                this.adjustLayout(true);
            }
        }, 500);
    },
    
    closeNotify() { 
        document.getElementById('notify-bar').style.display = 'none'; 
        this.adjustLayout(false); 
    },
    
    showNotifyDetail() { 
        const win = window.open("", "Notify", "width=600,height=400"); win.document.write(this.notifyDetailHtml); 
    },
    
    adjustLayout(hasNotify) {
        const top = hasNotify ? '82px' : ''; 
        document.body.style.paddingTop = top;
        document.querySelectorAll('.section').forEach(el => {
            el.style.scrollMarginTop = top;
        });
    }
};

window.addEventListener('DOMContentLoaded', () => app.init());