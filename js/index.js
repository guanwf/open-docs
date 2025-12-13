// --- 0. 配置数据 (命名空间数组) ---
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
            
            { cmd: "cat /dev/urandom | tr -dc A-Za-z0-9 | head -c 64;echo", desc: "生成64位随机数" },

            { cmd: "uname -r", desc: "查看内核信息" },
            { cmd: "cat /proc/cpuinfo", desc: "查看CPU信息" },
            { cmd: "lscpu", desc: "查看CPU信息" },
            { cmd: "free -h", desc: "查看内存使用情况" },
            { cmd: "cat /proc/meminfo", desc: "查看内存使用情况" },

            { cmd: "uptime", desc: "查看系统运行时间" },
            { cmd: "who -b", desc: "最近一次启动时间" },            

            { cmd: "dos2unix filename", desc: "format file" },
            { cmd: ":set ff=unix", desc: "vi format file" },

            { cmd: "echo 'alias kb='kubectl'' >> ~/.bashrc && source ~/.bashrc", desc: "建立kb命令." },
            { cmd: "tail -f /var/log/messages", desc: "实时系统日志" },

            { cmd: "find / -size +500M", desc: "#size,查找大于500M文件" },
            { cmd: "du -h --max-depth=1 /XXX", desc: "#size,查看某个目录下每个文件的大小" },
            { cmd: `for dir in */; do echo -n "$dir: "; find "$dir" -type f | wc -l; done`, desc: "#size,查看哪些目录下文件数量最多（需要在(具体目录下)/vdb1分区内执行）" },


            { cmd: "find /vdb1/tmp -type f -mtime +30 -delete", desc: "#size,清理30天前的临时文件（请确认路径正确性）" },
            { cmd: `find /vdb1/var/log -name "*.log.*" -type f -delete`, desc: "#size,清理旧日志（谨慎操作，确保不影响系统运行）" },            
            
            { cmd: "docker system prune -a", desc: "#docker,清理无用的镜像和卷" },
            { cmd: "docker image prune -a", desc: "#docker,清理无用的镜像和卷" },
            { cmd: `docker ps -a --filter "status=exited"`, desc: "#docker,查询" },
            { cmd: "docker system prune -f --volumes", desc: "#docker,清理无用的镜像和卷" },
            { cmd: `docker images -f "dangling=true"`, desc: "#docker,查询挂起的" },
            { cmd: "docker images | grep aeon | awk '{print $3}' | xargs docker rmi -f", desc: "#docker,清理无用的镜像和卷" },
            
            { cmd: `建立pos用户,目录，分配权限，切换sudo权限
mkdir -p /data/pos-work
groupadd posgroup
useradd -g posgroup pos -d /data/pos-work
passwd pos
密码: 输入自定义密码
这是目录权限
chown -R pos:posgroup /data/pos-work
sudo visudo -c && echo "pos ALL=(ALL:ALL) ALL" | tee -a /etc/sudoers && echo "pos ALL=(ALL) NOPASSWD: ALL" | tee -a /etc/sudoers`, desc: "#user,建立pos用户,根据需要调整用户名称，密码，目录." },

        ]
    },
    {
        id: "net",
        title: { zh: "网络", en: "Network" },
        type: "net",
        items: [
            { cmd: `
firewall-cmd --zone=public --add-port=9999/tcp --permanent
firewall-cmd --reload
`, desc: "开防火墙端口" },
            { cmd: "nc -v -z 192.168.0.1 9999", desc: "探测端口(nc)" },
            { cmd: "telnet 192.168.0.1 9999", desc: "探测端口" },
            { cmd: "netstat -ntlp", desc: "查看监听端口" },
            { cmd: `timeout 10 bash -c "</dev/tcp/192.168.0.1/9999" 2>/dev/null && echo "通" || echo "不通"`, desc: "查看监听端口" },            
            { cmd: "ifconfig -a", desc: "网卡详情,window: ipconfig -a " },
            { cmd: "nslookup 域名", desc: "域名解析,nslookup itor.westlakeerp.com 8.8.8.8" },
            { cmd: "traceroute 192.168.0.1", desc: "traceroute [目标主机/IP],诊断网络连接问题" },
            { cmd: "traceroute -n -m 10 域名", desc: "路由追踪前10跳,对应Windows的tracert -d -h 10" },

            { cmd: "tracepath  192.168.0.1", desc: "追踪数据包从本机到目标主机所经过的网络路由路径, tracepath [域名]" },

            

        ]
    },
    {
        id: "nacos",
        title: { zh: "Nacos", en: "Nacos" },
        type: "cmd",
        items: [
             { cmd: 
                `
data:
NAME_SPACE: roc-uat
JAVA_OPTS: -server -Xms512m -Xmx2048m -Xss1024k -XX:MetaspaceSize=512m -XX:MaxMetaspaceSize=1024m -XX:+UseG1GC
SKYWALKING_SERVER: 127.0.0.1:11800
NACOS_SERVER: http://nacos.pbs:8848
CONFIG_USER_NAME: roc
CONFIG_PASSWORD: nacos
DISCOVERY_USER_NAME: roc
DISCOVERY_PASSWORD: nacos

BAS_DATASOURCE_HOST: 127.0.0.1
BAS_DATASOURCE_PORT: "2883"
BAS_DATASOURCE_USERNAME: "roc_db_user"
BAS_DATASOURCE_PASSWORD: "roc_db_pwd"

STS_DATASOURCE_HOST: 127.0.0.1
STS_DATASOURCE_PORT: "2883"
STS_DATASOURCE_USERNAME: "roc_db_user"
STS_DATASOURCE_PASSWORD: "roc_db_pwd"

RFS_DATASOURCE_HOST: 127.0.0.1
RFS_DATASOURCE_PORT: "2883"
RFS_DATASOURCE_USERNAME: "roc_db_user"
RFS_DATASOURCE_PASSWORD: "roc_db_pwd"

REDIS_HOST: redis.pbs
REDIS_PASSWORD: efuture
REDIS_PORT: "6379"

MINIO_URL: http://minio.pbs:6900
MINIO_ACCESS-KEY: ljaLwA6TQYEw4LuDXnaZ
MINO_SECRET-KEY: LlS43XbrpAChY10o6pQIMa7eHWKZnOiElcksg3W7

FILE_STORAGE_TYPE: minio
#fastdfs、minio
PORTAL_URL: http://127.0.0.1:9999

FDFS_TRACKERLIST: 127.0.0.1:22122

ROCKETMQ_NAME-SERVER: rocketmq-name:9876.pbs
ROCKETMQ_ACCESS-KEY: mq_pub_key_string
ROCKETMQ_SECRET-KEY: efuture_rocketmq

SHC_DBTYPE: none
#none，elasticsearch
ES_HOSTS: 127.0.0.1:9200
ES_USERNAME: ""
ES_PASSWORD: ""
 `, desc: "configMap" },
        ]
    },
    {
        id: "db",
        title: { zh: "数据库", en: "Database" },
        type: "cmd",
        items: [
             { cmd: "GRANT SELECT, INSERT,UPDATE,DELETE,CREATE,INDEX,ALTER,CREATE VIEW,SHOW VIEW ON reportdb.* TO roc;", desc: "分配权限" },
             { cmd: "select * from information_schema.processlist;", desc: "查看所有连接,kill id值" },
             { cmd: "SELECT * FROM information_schema.SESSION_STATUS;", desc: "会话状态" },
             { cmd: "ELECT LEFT(HOST, INSTR(HOST, ':')-1) client_ip, COUNT(*) cnt FROM information_schema.processlist GROUP BY client_ip ORDER BY cnt DESC;;", desc: "根据ip看连接" },
             { cmd: `
单位：微秒
SET ob_query_timeout=20000000;
60秒
set global ob_query_timeout=60000000;
120秒
set global ob_query_timeout=120000000;
300秒
set global ob_query_timeout=3000000000;
查看
SHOW VARIABLES LIKE 'ob_query_timeout';
             `, desc: "设置超时时间" },

        ]
    },            
    {
        id: "nginx",
        title: { zh: "Nginx", en: "Nginx" },
        type: "nginx",
        items: [
            { 
                desc: "portal proxy",
                cmd: `
#portal
server {
    listen       9999;
    server_name  localhost;
    charset utf-8;
    location ~ / {
        proxy_next_upstream http_503 http_500 http_502 http_404 error timeout invalid_header;
        expires -1;
        proxy_pass http://192.168.0.1;
    }
}` 
            },
            {
                desc: "nacos proxy",
                cmd: `
#nacos
server {
    listen       9092;
    server_name  localhost;
    location ~ /nacos {
                proxy_next_upstream http_503 http_500 http_502 http_404 error timeout invalid_header;
                expires -1;
                proxy_pass http://192.168.0.1;
    }
}` 
            },
            { 
                desc: "xxl-job-admin proxy",
                cmd: `
#xxljob
server {
    listen       9093;
    server_name  localhost;
    location ~ /xxl-job-admin {
                proxy_next_upstream http_503 http_500 http_502 http_404 error timeout invalid_header;
                expires -1;
                proxy_pass http://192.168.0.1;
    }
}` 
            },
            { 
                desc: "minio proxy",
                cmd: `
#minio
server {
    listen       6901;
    server_name  localhost;
    location ~ / {
                proxy_next_upstream http_503 http_500 http_502 http_404 error timeout invalid_header;
                expires -1;
                proxy_pass http://192.168.0.1;
    }
}` 
            },
            { 
                desc: "rocketmq proxy",
                cmd: `
#rocketmq
server {
    listen       7298;
    server_name  localhost;
    location ~ /rocketmq {
                proxy_next_upstream http_503 http_500 http_502 http_404 error timeout invalid_header;
                expires -1;
                proxy_pass http://192.168.0.1;
    }
}` 
            },
            { 
                desc: "pos-sftp proxy",
                cmd: `
#pos-sftp
server {
    listen       9192;
    server_name  localhost;
    location / {
        root /data/sftp;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
        charset utf-8;
        }
    }` 
            },
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
            { cmd: "kubectl -n roc-uat describe pod roc-goods", desc: "查看pod明细",doc:"" },
            { cmd: "kubectl -n roc-uat describe node [nodeName]", desc: "查看node明细",doc:"" },
            { cmd: "kubectl -n roc-uat get pods |grep Evicted | awk '{print $1}' | xargs kubectl -n roc-uat delete pod", desc: "删除大量evicted的pod.",doc:"" },
            { cmd: "docker cp ab5593917446:/home/logs/error.log ./", desc: "ab5593917446=容器Id(通过docker ps可以查询到),从容器中复制文件到本地，反之则从本地复制到容器里面. >> docker cp [本地文件/目录路径] [容器名或容器ID]:[容器内目标路径]",doc:"" },
            { cmd: "kubectl cp <namespace>/<pod>:<root_dir>/<parent_dir>/<file_name> ./<file_name>", desc: "从pod复制文件到本地",doc:"" },
            { cmd: "kubectl cp ./<file_name> <namespace>/<pod>:<root_dir>/<parent_dir>/<file_name>", desc: "从本地复制到pod.",doc:"" },

            { cmd: "docker rmi $(docker images -f 'dangling=true' -q)", desc: "批量删除这些标签为none的镜像",doc:"" },
            { cmd: "kubectl -n roc-uat exec -it roc-goods  -- curl http://www.baidu.com", desc: "通过pod临时访问外部地址，测试是否能联通.",doc:"" },

            { cmd: `kubectl -n roc-uat exec -it roc-goods  -- timeout 10 bash -c "</dev/tcp/192.168.0.1/8080" 2>/dev/null && echo "通" || echo "不通"`, desc: "通过pod测试,192.168.0.1:8080是否能通.",doc:"" },
            
            { cmd: "kubectl -n roc-uat delete pod roc-goods --grace-period=0 --force --wait=false", desc: "强制删除pod",doc:"" },
            { cmd: `kubectl -n roc-uat get pods -o=jsonpath='{range .items[*]}{"kubectl rollout restart deploy -n roc-uat "}{.metadata.labels.app}{"\\n"}'`, desc: "批量生成需要重启的pod命令.",doc:"" },

            { cmd: "kubectl -n roc-uat top pod --sort-by=memory", desc: "根据内存排序",doc:"" },
            
            { cmd: "kubectl -n roc-uat top pod --sort-by=memory | tail -n +2 | sort -k3 -h", desc: "根据内存-升序",doc:"" },
            { cmd: "kubectl -n roc-uat top pod --sort-by=memory | tail -n +2 | sort -k3 -h -r", desc: "根据内存-降序",doc:"" },
            

            { cmd: "kubectl -n roc-uat get configmap", desc: "#cm,查找configMap-list",doc:"" },
            { cmd: "kubectl -n roc-uat describe configmap common-config", desc: "#cm,详细查看具体common-config的内容.",doc:"" },
            
            { cmd: "kubectl -n roc-uat get configmap common-config -o jsonpath='{.data.NACOS_SERVER}'", desc: "#cm,查询configMap里面的NACOS_SERVER参数的值,其他参数类似.",doc:"" },
            { cmd: `kubectl -n roc-uat patch configmap common-config -p '{"data":{"NACOS_SERVER":"http://nacos.pbs:8848"}}'`, desc: "#cm,设置configMap里面的NACOS_SERVER参数的值,其他参数类似.",doc:"" },
            
        ]
    },
    {
        id: "link",
        title: { zh: "链接", en: "Links" },
        type: "list",
        // 链接数据：包含 category 属性
        items: [
            { category: "🛠️工具类",text:"查看出口ip", url: "https://cip.cc/", desc: "公网IP"},
            
            { category: "🛠️工具类",text:"generate password", url: "./passwd.html", desc: "生产密码"},
            { category: "🛠️工具类",text:"ip check", url: "https://www.ip138.com/", desc: ""},
            { category: "🛠️工具类",text:"生成一个UUIDv4", url: "https://1024tools.com/uuid", desc: ""},
            { category: "🛠️工具类",text:"ssl-check", url: "https://www.ssllabs.com/ssltest/analyze.html", desc: ""},
            { category: "🛠️工具类",text:"yaml-check", url: "https://www.yamllint.com/", desc: ""},
            { category: "🛠️工具类",text:"perfcode", url: "https://www.perfcode.com/linux/kali/password-dictionary", desc: ""},
            { category: "🛠️工具类",text:"windy", url: "https://www.windy.com", desc: ""},
            { category: "🛠️工具类",text:"通过kubectl连接集群-hw-cce", url: "https://support.huaweicloud.com/intl/zh-cn/usermanual-cce/cce_10_0107.html", desc: ""},
            { category: "🛠️工具类",text:"whatismyipaddress", url: "https://whatismyipaddress.com/", desc: ""},
            
            { category: "🛠️工具类",text:"Docker-Image-Hub", url: "http://8.220.217.46:8000/", desc: ""},
            
            { category: "🛠️工具类",text:"docker-aityp", url: "https://docker.aityp.com/", desc: "docker research"},
            
            { category: "🛠️工具类",text:"Dependency-Check", url: "https://owasp.org/www-project-dependency-check/", desc: "项目依赖及漏洞扫描"},
            
            { category: "🛠️工具类",text:"start-spring-io", url: "https://start.spring.io/", desc: "generate java projects"},
            
            { category: "🛠️工具类",text:"properties2yaml-在线格式转换", url: "https://www.bejson.com/devtools/properties2yaml/", desc: ""},
            { category: "🛠️工具类",text:"icon-getemoji", url: "https://getemoji.com/", desc: "icon"},
            

            { category:"📚文档类",text:"FastDeploy&FastLink", url: "https://xd20al46gl.feishu.cn/docx/Hkhvdh1CkoHkYGxhe4Hc3oWqn7Z", desc: ""},
            { category:"📚文档类",text:"Nginx升级方法", url: "https://xd20al46gl.feishu.cn/docx/Bdo2ddv4LoLkAvx1BfjcgOW0ndh", desc: "4N11294&"},
            { category: "📚文档类",text: "Nginx Docs", url: "http://nginx.org/en/docs/", desc: "Nginx文档" },
            { category: "📚文档类",text: "MDN Web Docs", url: "https://developer.mozilla.org/", desc: "Web开发"},


            { category: "❄️K8s",text:"K8s日常操作", url: "https://xd20al46gl.feishu.cn/docx/TbnNda0dXom9C3xs8mNcYqTcnJe", desc: "418#48r5"},      
            { category: "❄️K8s",text: "K8s Docs", url: "https://kubernetes.io/docs/", desc: "官方文档"},
            { category: "❄️K8s",text:"Kubernetes|大规模集群的注意事项", url: "https://kubernetes.io/zh-cn/docs/setup/best-practices/cluster-large/", desc: ""},
            { category: "❄️K8s",text:"測試 K8S Pod 數量超過 110 會發生甚麼事?", url: "https://hackmd.io/@QI-AN/What-happens-when-the-number-of-K8S-Pods-exceeds-110#15-%E6%9F%A5%E7%9C%8B%E7%8B%80%E6%85%8B%E7%82%BA-Running-%E7%9A%84-Pod-%E6%98%AF%E5%90%A6%E6%9C%89%E8%A2%AB%E5%BD%B1%E9%9F%BF", desc: ""},
            
            { category: "❄️K8s",text:"Kubernetes|kubelet-config", url: "https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/", desc: ""},
            { category: "❄️K8s",text:"Kubernetes|tool-reference", url: "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/", desc: ""},            
            { category: "❄️K8s",text:"Kubernetes|K8S 修改节点 pod 上限", url: "https://koomu.cn/k8s-modify-node-pods-limits/", desc: ""},
            
            { category: "❄️K8s",text:"K8S-配置存活、就绪和启动探针", url: "https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", desc: ""},
            
            {category: "📊监控类", text: "Prometheus", url: "http://prometheus.local", desc: "监控大盘" },
            {category: "📊监控类", text: "Grafana", url: "http://grafana.local", desc: "图表展示"},

            { category: "⚽️NetWork",text:"wireguard", url: "https://www.wireguard.com/quickstart/", desc: "vpc"},
            { category: "⚽️NetWork",text:"centralops-DNS-Domain -Check-Traceroute", url: "https://centralops.net/", desc: ""},
            { category: "⚽️NetWork",text:"Visual Subnet Calculator", url: "https://www.davidc.net/sites/default/subnets/subnets.html", desc: "子网分配计算"},

            { category: "⚽️NetWork",text:"winMTR", url: "https://sourceforge.net/projects/winmtr/", desc: "network check"},
            
            
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
        k8s: { ns: 'roc-uat', pod: 'roc-goods', ver: '版本号' },
        nginx: { ip: '192.168.0.1' },
        net: { ip: '192.168.0.1',port: 9999 }
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
    //IP 格式校验函数
    isValidIP(ip) {
        const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(ip);
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
            if (['cmd','nginx', 'k8s'].includes(section.type)) {
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
            const btnText = this.state.lang === 'zh' ? '替换' : 'Replace';

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
                // --- 核心修改开始：遍历数组生成 options ---
                // 逻辑：生成 HTML 字符串，如果当前值等于 state 中的值，则添加 selected 属性
                const optionsHtml = k8sNamespaces.map(ns => 
                    `<option value="${ns}" ${ns === this.state.k8s.ns ? 'selected' : ''}>${ns}</option>`
                ).join('');
                // --- 核心修改结束 ---

                controlHtml = `
                <div class="control-panel">
                    <label>NameSpace:</label>
                    <select id="k8s-ns" style="width:150px">${optionsHtml}</select> 
                    <label>PodName:</label> <input id="k8s-pod" value="roc-goods" style="width:150px">
                    <label>VersionId:</label> <input id="k8s-ver" value="版本号" style="width:300px;">
                    <button class="action-btn" onclick="app.replaceK8sCmd()">${btnText}</button>
                </div>`;
            }else if (section.type === 'nginx'){
                controlHtml = `
                <div class="control-panel">
                    <label>ip address:</label> <input id="nginx-ip" placeholder="e.g. 10.0.0.1" value="192.168.0.1" style="width:150px">
                    <button class="action-btn" onclick="app.replaceNginxCmd()">${btnText}</button>
                </div>`;
            }else if (section.type === 'net'){
                controlHtml = `
                <div class="control-panel">
                    <label>ip address:</label> <input id="net-ip" placeholder="e.g. 10.0.0.1" value="192.168.0.1" style="width:150px">
                    <label>port:</label> <input id="net-ip-port" placeholder="e.g. 10.0.0.1" value="9999" style="width:100px">
                    <button class="action-btn" onclick="app.replaceNetCmd()">${btnText}</button>
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
                    // const cmdText = typeof item === 'string' ? item : item.cmd;
                    const descText = (typeof item === 'object' && item.desc) ? item.desc : '';
                    
                    const rawCmd = typeof item === 'string' ? item : item.cmd;

                    // 🔴 第二步：在这里调用 escapeHtml ！！！
                    // 这样 < 和 > 就会变成 &lt; 和 &gt;，浏览器就能正确显示了
                    const cmdText = app.escapeHtml(rawCmd); 

                    // 新增：详情链接渲染逻辑
                    const docUrl = (typeof item === 'object' && item.doc) ? item.doc : '';
                    const docHtml = docUrl ? `<a href="${docUrl}" target="_blank" class="cmd-doc-link">📖 详情</a>` : '';
                    
                    // 将 docHtml 放入备注中
                    const descHtml = descText ? `<div class="cmd-desc">// ${descText} ${docHtml}</div>` : '';
                    
 // [Update] 如果是 nginx 类型，也应用 code-mode 样式 (保留缩进)
//  const extraClass = (section.type === 'code' || section.type === 'nginx') ? 'code-mode' : '';
//  const searchText = (rawCmd + ' ' + descText).toLowerCase();
 
 
                    const numHtml = section.type === 'code' ? '' : `<div class="cmd-num">#${index + 1}</div>`;
                    const extraClass = ( section.type === 'code' || section.type === 'net' || section.type === 'nginx' ) ? 'code-mode' : '';
                    const searchText = (cmdText + ' ' + descText).toLowerCase();
                    
                    // <div class="cmd-box ${extraClass}" data-filter="${searchText}">
                    return `
                    <div class="cmd-box ${extraClass}" data-filter="${app.escapeHtml(searchText)}">                    
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

    // [New] Nginx IP 替换逻辑
    replaceNginxCmd() {
        const newIP = document.getElementById('nginx-ip').value.trim();
        const msg = this.state.lang === 'zh' ? '请输入有效的 IP 地址!' : 'Please enter a valid IP address!';
        
        // 校验 IP
        if (!this.isValidIP(newIP)) {
            alert(msg);
            return;
        }

        // 执行替换
        document.querySelectorAll('#nginx pre').forEach(pre => {
            let txt = pre.innerText;
            // 全局替换旧 IP 为新 IP
            txt = txt.split(this.state.nginx.ip).join(newIP);
            pre.innerText = txt;
        });

        // 更新状态，以便下次替换知道旧值是什么
        this.state.nginx = { ip: newIP };
    },

    // replaceNetCmd
    replaceNetCmd() {
        const newIP = document.getElementById('net-ip').value.trim();
        const newIpPort = document.getElementById('net-ip-port').value.trim();
        const msg = this.state.lang === 'zh' ? '请输入有效的 IP 地址!' : 'Please enter a valid IP address!';
        
        // 校验 IP
        if (!this.isValidIP(newIP)) {
            alert(msg);
            return;
        }

        // 执行替换
        document.querySelectorAll('#net pre').forEach(pre => {
            let txt = pre.innerText;
            // 全局替换旧 IP 为新 IP
            txt = txt.split(this.state.net.ip).join(newIP);
            txt = txt.split(this.state.net.port).join(newIpPort);
            pre.innerText = txt;
        });

        // 更新状态，以便下次替换知道旧值是什么
        this.state.net = { ip: newIP ,port: newIpPort};
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