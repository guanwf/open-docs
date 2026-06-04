// --- 0. 配置数据 (命名空间数组) ---
const k8sNamespaces = [
    "pbs",
    "logging",
    "monitoring",
    "roc-sit",
    "roc-dev",
    "roc-v2-test",
    "roc-uat",
    "roc-prod",
    "pos-pbs",
    "pos-sit",
    "pos-uat",
    "pos-prod",
    "pos-preprod",
    "wms-uat",
    "wms-prod",
    "jstore-uat",
    "jstore-prod",
    "myshop-uat",
    "myshop-prod"
];

// --- 核心数据配置 ---
const database = [
    {
        id: "shell",
        title: { zh: "Shell", en: "Shell" },
        type: "cmd",
        layout: "grid", // <--- 核心：添加这行，开启一行两个        
        items: [
            { cmd: "cat /etc/os-release | grep '^ID=' | awk -F= '{print $2}'", desc: "查看系统类型" },
            { cmd: "cat /etc/os-release | grep 'VERSION_ID=' | awk -F= '{print $2}' | tr -d [:punct:]", desc: "查看系统版本" },
            { cmd: "cat /etc/redhat-release", desc: "查看Red Hat版本" },
            { cmd: "cat /dev/urandom | tr -dc A-Za-z0-9 | head -c 64;echo", desc: "生成64位随机数" },

            { cmd: "uname -r", desc: "查看内核信息" ,tags: ["系统", "信息"] },
            { cmd: "cat /proc/cpuinfo", desc: "查看CPU信息" ,tags: ["系统", "信息"] },
            { cmd: "lscpu", desc: "查看CPU信息" },
            { cmd: "free -h", desc: "查看内存使用情况;1、总内存：total,2、程序可用内存：available" },
            { cmd: "cat /proc/meminfo", desc: "查看内存使用情况" },

            { cmd: "uptime", desc: "查看系统运行时间" },
            { cmd: "who -b", desc: "最近一次启动时间" },
            { cmd: "df -h", desc: "查询磁盘" },
            { cmd: "du --inodes -d 1 /data | sort -nr | head -n 10", desc: "快速扫描一级子目录，前10的" },
            { cmd: "docker ps -q | xargs docker inspect --format '{{.Name}}, {{.GraphDriver.Data.WorkDir}}' | grep <你的Hash前缀>", desc: "将哈希目录反查为 K8s Pod 名称" },          

            { cmd: "top", desc: "最常用的交互式系统监控工具,实时动态查看系统的整体运行状态和进程资源占用情况.top -b -n 1 | grep mongod" },

            { cmd: "lsof -c java  # 列出所有java进程打开的文件", desc: "lsof [选项] [文件名/进程名/端口号]；lsof -p 1234  # 列出PID为1234的进程打开的文件" },
            { cmd: "lsof -i :8080  # 查看8080端口的占用进程", desc: "lsof -i -s TCP:LISTEN; lsof -i TCP:80 # 查看TCP 80端口;lsof -i @192.168.1.1:80" },
            { cmd: "lsof -u root  # 列出root用户的进程打开的文件;", desc: "lsof -u ^root # 排除root用户" },

            { cmd: "ps -eo pid,comm,lstart,etime | grep mongod", desc: "检查运行时间." },
            { cmd: "dmesg -T | grep -i 'out of memory'", desc: "检查系统日志是否有OOM记录." },

            { cmd: "dos2unix filename", desc: "format file" },
            { cmd: "set ff=unix", desc: "vi format file" },

            { cmd: "echo 'alias kb='kubectl'' >> ~/.bashrc && source ~/.bashrc", desc: "建立kb命令." },
            { cmd: "tail -f /var/log/messages", desc: "实时系统日志" },

            { cmd: "find / -size +500M", desc: "#size,查找大于500M文件" },
            { cmd: "du -h --max-depth=1 /XXX", desc: "#size,查看某个目录下每个文件的大小" },
            { cmd: `for dir in */; do echo -n "$dir: "; find "$dir" -type f | wc -l; done`, desc: "#size,查看哪些目录下文件数量最多（需要在(具体目录下)/vdb1分区内执行）" },

            { cmd: "find /vdb1/tmp -type f -mtime +30 -delete", desc: "#size,清理30天前的临时文件（请确认路径正确性）" },
            { cmd: `find /vdb1/var/log -name "*.log.*" -type f -delete`, desc: "#size,清理旧日志（谨慎操作，确保不影响系统运行）" },            
            
            { cmd: "docker system prune -a", desc: "#docker,清理无用的镜像和卷" },
            { cmd: "docker image prune -a", desc: "#docker,清理无用的镜像和卷" },            
            { cmd: "docker tag nginx registry.example.com/nginx:v2", desc: "#docker,打标签,docker tag 源镜像[:源标签] 目标镜像[:目标标签]" },
            { cmd: "docker push zhangsan/myapp:v1.0", desc: "#docker,推送镜像" },
            { cmd: `docker ps -a --filter "status=exited"`, desc: "#docker,查询" },
            { cmd: "docker system prune -f --volumes", desc: "#docker,清理无用的镜像和卷" },
            { cmd: `docker images -f "dangling=true"`, desc: "#docker,查询挂起的镜像" },
            { cmd: "docker images | grep aeon | awk '{print $3}' | xargs docker rmi -f", desc: "#docker,清理无用的镜像和卷" },
            { cmd: "docker stats containerId", desc: "#docker,实时监控容器资源使用情况;docker stats 3. 监控所有运行中的容器" },
            { cmd: "docker run -m 512m --memory-swap 1g my_image", desc: "#docker,限制内存使用：可以在创建容器时设置内存限制" },
            { cmd: "docker inspect rmqbroker --format='{{.State.OOMKilled}}'", desc: "#docker,检查容器是否因 OOM 被杀" },
            { cmd: "docker-compose ps -q | xargs docker inspect -f '{{.Name}}: {{.RestartCount}} 次重启'", desc: "#docker-compose,查看重启次数" },
            { cmd: "docker update --memory=13g --memory-swap=26g mysql84", desc: "#docker,更新容器内存限制，docker inspect mysql84 | grep -i memory" },
            { cmd: "docker update --restart unless-stopped mongodb", desc: "#docker,更新容器重启策略" },

            { cmd: `建立pos用户,目录，分配权限，切换sudo权限
mkdir -p /data/pos-work
groupadd posgroup
useradd -g posgroup pos -d /data/pos-work
passwd pos
密码: 输入自定义密码
这是目录权限
chown -R pos:posgroup /data/pos-work
sudo visudo -c && echo "pos ALL=(ALL:ALL) ALL" | tee -a /etc/sudoers && echo "pos ALL=(ALL) NOPASSWD: ALL" | tee -a /etc/sudoers`, desc: "#user,建立pos用户,根据需要调整用户名称，密码，目录." },

            { cmd: "iostat -d -x -k 3 3 ", desc: "一秒中被IO消耗的CPU百分比(%)" },

            { cmd: "dd if=/dev/zero of=/tmp/test_iops bs=4k count=10000 oflag=direct", desc: "#iops=总操作次数/总耗时; 普通机械硬盘 (HDD): 顺序写入通常在 100 MB/s - 200 MB/s;  SATA SSD: 通常在 450 MB/s - 550 MB/s;  NVMe SSD: 通常在 1500 MB/s - 7000 MB/s。" },
            { cmd: "fio -name=randwrite -ioengine=libaio -iodepth=1 -rw=randwrite -bs=4k -direct=1 -size=512M -numjobs=1 -runtime=60 -group_reporting", desc: "#iops 测试随机写入 IOPS (4k块大小)" },

            // ── 系统服务管理 ──
            { cmd: `systemctl status <service> --no-pager -l
# 常用子命令:
systemctl restart <service>   # 重启
systemctl enable <service>    # 开机自启
systemctl daemon-reload       # 重载systemd配置`, desc: "#systemctl,查看/管理服务状态; 常用子命令: start/stop/restart/enable/disable/daemon-reload", tags: ["系统"] },

            { cmd: `journalctl -u <service> -f
# 其他常用:
journalctl -u <service> --since "10 min ago"
journalctl -xe               # 查看最近错误日志`, desc: "#systemctl,查看服务日志; -f 实时跟踪; -xe 跳到末尾显示详细错误; --since/--until 时间过滤", tags: ["系统"] },

            { cmd: `timedatectl set-timezone Asia/Shanghai
hostnamectl set-hostname <new-hostname>`, desc: "#systemctl,系统时间/主机名配置; timedatectl 查看NTP同步状态; hostnamectl 查看当前主机信息", tags: ["系统"] },
            { cmd: "timedatectl set-time \"2026-05-24 10:38:00\"", desc: "#systemctl,设置系统时间", tags: ["系统"] },
            // ── 磁盘 ──
            { cmd: "lsblk -f", desc: "#disk,列出块设备及文件系统; lsblk 树形显示磁盘分区; -f 显示FS类型和UUID; -m 显示权限和属主", tags: ["磁盘"] },

            // ── 网络诊断 ──
            { cmd: "ss -tlnp", desc: "#net,查看所有监听TCP端口(现代替代netstat); ss -tunap 全部TCP/UDP连接; ss -s 统计概要", tags: ["网络"] },

            { cmd: "ip addr show && ip route show", desc: "#net,查看IP地址和路由表(现代替代ifconfig/route); ip a s 简写; ip route add/del 增删路由; ip neigh 查看ARP表", tags: ["网络"] },

            { cmd: `curl -v http://127.0.0.1:8080/api -H "Content-Type: application/json" -d '{"key":"val"}'
# 其他常用:
curl -I http://example.com                    # 仅获取响应头
curl -k https://self-signed.badssl.com/       # 跳过SSL证书校验
curl -o file.tar.gz http://example.com/file   # 下载文件
curl -u user:pass http://example.com          # 基本认证`, desc: "#net,调试HTTP接口; -v 请求/响应详情; -I 仅响应头; -k 跳过SSL; -H 请求头; -d POST数据; -o 下载; -u 认证", tags: ["网络"] },

            // ── 文件操作 ──
            { cmd: `# 压缩: tar -czvf archive.tar.gz /path/to/folder
# 解压: tar -xzvf archive.tar.gz -C /target/
# 查看: tar -tzvf archive.tar.gz
# 排除: tar -czvf a.tar.gz --exclude=logs /path`, desc: "#file,打包/压缩/解压; .tar.gz 用 z; .tar.bz2 用 j; .tar.xz 用 J; -C 指定解压目录; -c创建 -x解压 -t查看 -v详细", tags: ["文件"] },

            { cmd: "chmod +x script.sh && chown -R user:group /path", desc: "#file,修改权限与所有者; 数字模式: chmod 755 dir / 644 file; 符号模式: u+x g-w o-r; 递归: -R", tags: ["文件"] },

            { cmd: `rsync -avz --progress /source/ user@host:/dest/
# 关键选项:
rsync -avzn /src/ host:/dst/       # -n 干运行预览
rsync -avz --delete /src/ /dst/    # --delete 同步删除目标多余文件`, desc: "#file,高效文件同步(增量传输); -a 归档保留属性; -v 详细; -z 压缩传输; -n 干运行; --delete 删除目标多余文件", tags: ["文件"] },

            // ── 文本处理 ──
            { cmd: `grep -rn "pattern" /path --include="*.log" --exclude-dir=node_modules
# 常用选项:
grep -rnil "keyword" /path    # -l 仅列出匹配文件名
grep -rn -A 3 "keyword" file  # -A N 匹配行后N行
grep -rn -B 2 "keyword" file  # -B N 匹配行前N行
grep -rn -C 3 "keyword" file  # -C N 前后各N行`, desc: "#text,递归搜索文本; -r 递归; -n 行号; -i 忽略大小写; -w 全词匹配; -v 反向匹配; --include/--exclude-dir 过滤", tags: ["文本"] },

            { cmd: `sed -i 's/old_text/new_text/g' file
# 其他常用:
sed -i.bak 's/old/new/g' file       # 备份原文件为 file.bak
sed -i '/pattern/d' file             # 删除匹配行
sed -i '3a\\new line' file            # 在第3行后插入新行`, desc: "#text,原地替换文本; -i 直接修改文件; -i.bak 备份后修改; g 全局替换; -r 启用扩展正则", tags: ["文本"] },

            { cmd: `awk '{print $1, $NF, NR}' file
# 常用示例:
awk -F: '{print $1,$3}' /etc/passwd        # -F: 指定分隔符
awk '$3>1000{print $1}' /etc/passwd        # 条件过滤
awk '{sum+=$2}END{print sum}' data.txt     # 求和`, desc: "#text,列提取与文本处理; $1第一列 $NF最后一列 NR行号; -F指定分隔符; BEGIN/END三段式", tags: ["文本"] },

            { cmd: `cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -n 10`, desc: "#text,统计频率Top N; 管道: 提取列 > sort排序 > uniq -c去重计数 > sort -rn逆序 > head取前N; 注: uniq -c必须先sort", tags: ["文本"] },

            { cmd: `command 2>&1 | tee output.log
# 追加模式:
command 2>&1 | tee -a output.log`, desc: "#text,输出到终端同时保存到文件; tee -a 追加而非覆盖; 2>&1 合并stderr到stdout", tags: ["文本"] },

            // ── 进程管理 ──
            { cmd: "watch -n 2 -d 'command'", desc: "#process,每2秒刷新执行命令; -n 间隔秒数(最小0.1s); -d 高亮变化部分; -t 隐藏标题; Ctrl+C 退出", tags: ["进程"] },

            { cmd: `history | grep keyword
# 快捷复用:
!123                          # 执行历史第123条命令
!!                            # 重复上一条命令
Ctrl+R                        # 交互式反向搜索(最常用)`, desc: "#process,搜索/复用命令历史; ~/.bash_history持久化; history -c清空当前会话", tags: ["进程"] },

            { cmd: `pgrep -f "pattern"       # 按进程名/完整命令行查找PID
pkill -f "pattern"       # 按进程名/完整命令行终止
pgrep -l -u username     # 列出某用户所有进程`, desc: "#process,按名称查找/终止进程; pgrep输出PID列表; pkill发送信号(默认15); pkill -9 强制终止; -u按用户 -t按终端", tags: ["进程"] },

            { cmd: `crontab -l        # 查看当前用户定时任务
crontab -e        # 编辑定时任务
# 格式: 分(0-59) 时(0-23) 日(1-31) 月(1-12) 周(0-7) command
# 特殊: @reboot, @daily, @hourly, @yearly`, desc: "#process,查看/编辑定时任务; crontab -r 删除所有; crontab -u user 指定用户; 日志: /var/log/cron", tags: ["进程"] },

            // ── 通用工具 ──
            { cmd: `find . -name "*.log" -print0 | xargs -0 rm -f
# 关键参数:
... | xargs -n 10 command       # 每批最多10个参数
... | xargs -P 4 command        # 并行4个进程
... | xargs -I {} mv {} /bak/   # 用{}占位替换`, desc: "#tool,管道输入转为命令行参数; -n 每批N个; -P 并行数; -I {} 占位; -0 处理含空格文件名(配合find -print0)", tags: ["工具"] },

            { cmd: "which kubectl && type kubectl && command -v kubectl", desc: "#tool,定位命令路径/类型; which查PATH中可执行文件; type查shell解析(alias/function/builtin/file); command -v 最可移植", tags: ["工具"] },

            { cmd: "ps -aux | grep clear2 | grep -v grep | awk '{print $2}' | xargs kill -9", desc: "批量kill进程" },
            { cmd: `
# 源机器
docker save -o nginx.tar nginx:latest
# 拷贝 nginx.tar 到目标机器

# 目标机器
docker load -i nginx.tar
docker run -d -p 80:80 nginx:latest             
                `, desc: "镜像迁移" },
            { cmd: `
# 专门过滤慢查询关键字
grep -i "slow query" observer.log
grep -E "GLIBC|symbol lookup error|version|libraries" *.log

                `, desc: "过滤关键字" },
            { cmd: `
dmesg -T
dmesg -T | grep -i oom
dmesg -T | grep -i "out of memory"
dmesg -T | grep -i "oom\|killed"

                `, desc: "dmesg是查看 Linux 内核日志的命令，专门用来查：系统级别的硬件、驱动、内存、进程被杀、网络、IO 等底层问题。" },

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
            { cmd: `ping -c 4 192.168.0.1            # 发送4个ICMP包测试连通性
ping -c 10 -i 0.2 192.168.0.1   # 快速发送10个包(间隔0.2秒)
ping -s 1000 192.168.0.1        # 指定包大小1000字节
ping -W 2 192.168.0.1           # 超时等待2秒
ping -I eth0 192.168.0.1        # 指定源网卡`, desc: "#ping,最基础的连通性测试; -c 发包数; -i 间隔秒数; -s 包大小; -W 超时; -I 指定网卡; -f 洪水模式" },
            { cmd: "nc -v -z 192.168.0.1 9999", desc: "探测端口(nc)" },
            { cmd: "telnet 192.168.0.1 9999", desc: "探测端口" },
            { cmd: "netstat -ntlp", desc: "查看监听端口" },
            { cmd: "netstat -anop|grep 9999", desc: "查看监听指定端口" },
            { cmd: `ss -tlnp                   # 查看所有监听TCP端口(现代替代netstat)
ss -tunap                  # 查看全部TCP/UDP连接(含进程)
ss -s                      # Socket统计概要
ss -o state established    # 仅查看已建立的连接
ss -tlnp | grep 8080       # 查看特定端口
ss dst 192.168.0.1         # 查看目标IP的所有连接`, desc: "#ss,Socket统计工具(现代替代netstat,性能更好); -t tcp; -u udp; -l listening; -n numeric; -p process; -a all" },
            { cmd: `timeout 10 bash -c "</dev/tcp/192.168.0.1/9999" 2>/dev/null && echo "通" || echo "不通"`, desc: "查看监听端口" },
            { cmd: "ifconfig -a", desc: "网卡详情,window: ipconfig -a " },
            { cmd: `arp -a                          # 查看ARP缓存表(旧)
ip neigh show                   # 查看邻居表(现代替代arp)
ip neigh add 192.168.0.1 lladdr xx:xx:xx dev eth0  # 添加静态ARP
ip neigh del 192.168.0.1 dev eth0                  # 删除ARP条目
arp -d 192.168.0.1              # 删除ARP缓存(旧)`, desc: "#arp,查看/管理ARP邻居表(二层网络排查); arp -a 查看; ip neigh 现代替代; 排查IP冲突/ARP欺骗" },
            { cmd: "nslookup 域名", desc: "域名解析,example:nslookup itor.westlakeerp.com 8.8.8.8, nslookup g.cn 172.17.1.250",doc:"https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/nslookup"},
            { cmd: `dig 域名
dig @8.8.8.8 域名            # 指定DNS服务器查询
dig 域名 ANY                  # 查询所有类型记录(A/AAAA/MX/NS等)
dig 域名 +short               # 简洁输出(只显示结果)
dig -x 192.168.0.1            # 反向解析(IP -> 域名)
dig 域名 +trace               # 追踪DNS递归解析全过程
dig 域名 +dnssec              # 查看DNSSEC信息`, desc: "#dig,DNS诊断利器(比nslookup信息更丰富); +short简洁; +trace追踪; -x反向解析; @指定DNS服务器" },
            { cmd: "resolvectl status             # 查看DNS解析器全局状态\nresolvectl query 域名          # 查询域名解析\nresolvectl statistics          # 查看解析统计\ncat /etc/resolv.conf            # 直接查看DNS配置", desc: "#resolvectl,systemd DNS解析器状态查询(替代dig/nslookup的现代工具); 显示每个网卡的DNS服务器配置" },
            { cmd: "traceroute 192.168.0.1", desc: "traceroute [目标主机/IP],诊断网络连接问题" },
            { cmd: "traceroute -n -m 10 域名", desc: "路由追踪前10跳,对应Windows的tracert -d -h 10" },

            { cmd: "tracepath  192.168.0.1", desc: "追踪数据包从本机到目标主机所经过的网络路由路径, tracepath [域名]" },

            { cmd: `mtr -r -c 10 192.168.0.1     # -r报告模式 -c发包次数
mtr 192.168.0.1                # 实时交互模式
mtr -n 192.168.0.1             # 不解析主机名(更快)`, desc: "#mtr,结合ping+traceroute的网络质量诊断;显示每一跳丢包率/延迟;定位是哪一跳出了问题" },

            { cmd: "sar -n DEV 1", desc: "查看网卡是否打满.",doc:"https://xd20al46gl.feishu.cn/docx/RWH6dWc2Yobe1Exb1aGcXgvYnlc" },
            { cmd: "sar [选项] -f <日志文件路径>", desc: "sar -f /var/log/sa/sa02，查看网指定要读取的历史数据文件，必须配合日志文件使用卡是否打满." ,doc:"https://xd20al46gl.feishu.cn/docx/RWH6dWc2Yobe1Exb1aGcXgvYnlc" },
            { cmd: "sar -f /var/log/sa/sa02 -s 09:00:00 -e 12:00:00", desc: "查看指定时间段的网络数据." },
            
            { cmd: "tsar -n DEV 1", desc: "查看网卡是否打满.tsar -tcp -i 1 -d20260331" },

            { cmd: "ethtool -S ens192", desc: "查看网卡数据，其中ens192是网卡名称." },
            
            // { cmd: "tracert g.cn", desc: "查看网卡是否打满." },
            // nslookup g.cn 8.8.8.8
            
            { cmd: "docker run --dns 223.5.5.5", desc: "Google的DNS(8.8.8.8或8.8.4.4);阿里公共DNS主DNS：223.5.5.5；辅 DNS：223.6.6.6." },
            { cmd: `>>192.168.0.1机器开启监听
nc -l 9999

>>发送测试
nc -v 192.168.0.1 9999`, desc: "用nc临时测试2个主机的port是否通！" },

            { cmd: "tcpdump -i any port 9999 -n -v", desc: "抓取物理网卡上9999端口的包." },
            { cmd: "iptables -A INPUT -p tcp --sport 3306 -j DROP", desc: "丢弃，阻止来自3306端口的入站TCP连接" },
            { cmd: `iptables -L -n -v             # 查看所有规则(带计数器)
iptables -L -n -v --line-numbers  # 带行号
iptables -D INPUT 3                # 删除INPUT链第3条规则
iptables -F INPUT                  # 清空INPUT链
iptables -t nat -L -n -v           # 查看NAT表规则
iptables-save > /etc/iptables.rules    # 保存规则
iptables-restore < /etc/iptables.rules # 恢复规则`, desc: "#iptables,防火墙规则查看与管理; -L列出; -F清空; -D删除; -n不解析; -v详细; -t指定表(filter/nat/mangle)" },
            { cmd: `curl -o /dev/null -s -w 'DNS解析:%{time_namelookup}s
TCP握手:%{time_connect}s
SSL握手:%{time_appconnect}s
首字节:%{time_starttransfer}s
总耗时:%{time_total}s\n' http://example.com`, desc: "#net,分析HTTP请求各阶段耗时;定位DNS慢、TCP慢还是服务器处理慢; 配合-o /dev/null只计时不下载" },

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
 { cmd: 
    `
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: conf-env-center
      namespace: wms-uat
    data:
      SERVICE_NACOS_USER: "wms"
      SERVICE_NACOS_PASS: "nacos"
      SERVICE_NACOS_HOST: "http://nacos.pbs:8848"
      SERVICE_NACOS_GROUP: "DEFAULT_GROUP"
      SERVICE_NACOS_NAMESPACE: "wms-uat"
      CONFIG_SPRING_PROFILES: "default"
      CONFIG_NAMESPACE_NAME: "wms-uat"
      CONFIG_SKYWALKING_ENABLE: "false"
      CONFIG_SKYWALKING_PARAMS: "-javaagent:/opt/agent/skywalking-agent.jar -Dskywalking.agent.service_name=sit-srmp-order-online -Dskywalking.collector.backend_service=10.0.12.94:11800"
      JAVA_OPTS: "-Drocketmq.namesrv.addr=10.0.14.156:9876"
    
      # Portal DB
      SERVICE_MYSQL_URI: "10.255.100.104:3306"
      SERVICE_MYSQL_USER: "root"
      SERVICE_MYSQL_PASS: "密码"
      SERVICE_MYSQL_DB: "user"
      SERVICE_MDM_TOKEN: "1592161107706568120"
      SERVICE_MYSQL_MASTER: "10.255.100.104:3306"
    
      # Portal Redis
      SERVICE_REDIS_MODE: "single"
      SERVICE_REDIS_HOST: "redis-server.pbs"
      SERVICE_REDIS_PORT: "6379"
      SERVICE_REDIS_PASS: "efuture"
      SERVICE_REDIS_DB: "0"
    
      # Public RocketMQ
      SERVICE_OMNI_MQ: "rocketmq-name.pbs:9876"
      
      # Public Mongodb
      SERVICE_MONGODB_HOST: "mongodb-server.pbs"
      SERVICE_MONGODB_PORT: "27017"
      SERVICE_MONGODB_USER: "root"
      SERVICE_MONGODB_PASS: "passwd"
    
      TIME_ZONE: Asia/Shanghai
      TZ: Asia/Shanghai

`, desc: "configMap" }

        ]
    },
    {
        id: "db",
        title: { zh: "数据库", en: "Database" },
        type: "cmd",
        items: [
             { cmd: "GRANT SELECT, INSERT,UPDATE,DELETE,CREATE,INDEX,ALTER,CREATE VIEW,SHOW VIEW ON reportdb.* TO roc;", desc: "分配权限", tags: ["MySQL","权限"] },
             { cmd: "select * from information_schema.processlist;", desc: "查看所有连接,kill id值", tags: ["MySQL","进程"] },
             { cmd: "SELECT * FROM information_schema.SESSION_STATUS;", desc: "会话状态", tags: ["MySQL","状态"] },
             { cmd: "SELECT LEFT(HOST, INSTR(HOST, ':')-1) client_ip, COUNT(*) cnt FROM information_schema.processlist GROUP BY client_ip ORDER BY cnt DESC;;", desc: "根据ip看连接", tags: ["MySQL","进程"] },
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
             `, desc: "设置超时时间", tags: ["OB","配置"] },
             { cmd: `
select zone,concat(SVR_IP,':',SVR_PORT) observer,
cpu_capacity_max cpu_total,cpu_assigned_max cpu_assigned,
cpu_capacity-cpu_assigned_max as cpu_free,
round(memory_limit/1024/1024/1024,2) as memory_total,
round((memory_limit-mem_capacity)/1024/1024/1024,2) as system_memory,
round(mem_assigned/1024/1024/1024,2) as mem_assigned,
round((mem_capacity-mem_assigned)/1024/1024/1024,2) as memory_free,
round(log_disk_capacity/1024/1024/1024,2) as log_disk_capacity,
round(log_disk_assigned/1024/1024/1024,2) as log_disk_assigned,
round((log_disk_capacity-log_disk_assigned)/1024/1024/1024,2) as log_disk_free,
round((data_disk_capacity/1024/1024/1024),2) as data_disk,
round((data_disk_in_use/1024/1024/1024),2) as data_disk_used,
round((data_disk_capacity-data_disk_in_use)/1024/1024/1024,2) as data_disk_free
from gv$ob_servers;
             `, desc: "在sys租户下面查询，查看租户的内存及磁盘使用情况." , tags: ["OB","资源"]},

        	             { cmd: `SHOW DATABASES;                              # 查看所有数据库
SHOW TABLES;                                # 查看当前库所有表
DESC table_name;                            # 查看表结构(最简)
SHOW COLUMNS FROM table_name;               # 查看表结构(含类型/键)
SHOW CREATE TABLE table_name;               # 查看建表语句(含索引/约束)
SHOW INDEX FROM table_name;                 # 查看索引信息`, desc: "#basic,MySQL基础查看; SHOW DATABASES/TABLES 看库表; DESC/SHOW COLUMNS 看结构; SHOW CREATE TABLE 看完整建表; SHOW INDEX 看索引" , tags: ["MySQL","基础"]},
	             { cmd: `SHOW FULL PROCESSLIST;                       # 查看所有连接(含完整SQL文本,最常用)
SELECT * FROM information_schema.processlist WHERE command != 'Sleep';  # 仅看活跃连接(排除Sleep)
SELECT * FROM information_schema.processlist WHERE time > 60 ORDER BY time DESC;  # 执行超60s的查询
SELECT CONCAT('KILL ', id, ';') FROM information_schema.processlist WHERE command != 'Sleep' AND time > 30;  # 生成批量KILL语句
KILL <connection_id>;                        # 杀死指定连接(回滚事务)
KILL QUERY <connection_id>;                  # 仅杀查询,不断连接`, desc: "#process,MySQL进程管理; FULL PROCESSLIST看完整SQL; 排除Sleep看活跃; time>60找长查询; SELECT CONCAT生成批量KILL; KILL杀连接; KILL QUERY仅杀查询" , tags: ["MySQL","进程"]},
	             { cmd: `SELECT * FROM information_schema.INNODB_TRX;      # 当前活跃事务(含开始时间/持锁数)
SELECT * FROM performance_schema.data_lock_waits;          # MySQL 8.0 查看锁等待关系
SELECT * FROM information_schema.INNODB_LOCK_WAITS;        # MySQL 5.x 查看锁等待关系
SHOW ENGINE INNODB STATUS;                                 # InnoDB总体状态(含最近死锁日志)
SELECT @@transaction_isolation;                            # 查看当前事务隔离级别`, desc: "#lock,MySQL锁与事务排查; INNODB_TRX看活跃事务; data_lock_waits看阻塞链; INNODB STATUS看死锁详情; @@transaction_isolation看隔离级别" , tags: ["MySQL","锁事务"]},
	             { cmd: `SHOW GLOBAL STATUS LIKE 'Threads%';                # 线程统计(connected当前连接/running执行中)
SHOW GLOBAL STATUS LIKE '%Slow%';                          # 慢查询数量(Slow_queries累计值)
SHOW GLOBAL STATUS LIKE 'Questions';                       # 查询总次数
SHOW VARIABLES LIKE '%slow%';                              # 慢查询相关配置
SHOW VARIABLES LIKE 'long_query_time';                     # 慢查询阈值(秒,默认10)
SHOW VARIABLES LIKE 'max_connections';                     # 最大连接数配置
SHOW VARIABLES LIKE '%timeout%';                           # 各类超时配置`, desc: "#status,MySQL状态变量与配置; SHOW STATUS运行指标; SHOW VARIABLES配置参数; Threads_connected当前连接; Slow_queries慢查累计; Questions查询总量" , tags: ["MySQL","配置"]},
	             { cmd: `SELECT user,host FROM mysql.user;                   # 查看所有用户
CREATE USER 'user'@'host' IDENTIFIED BY 'password';        # 创建用户
DROP USER 'user'@'host';                                   # 删除用户
ALTER USER 'user'@'host' IDENTIFIED BY 'new_password';     # 修改密码(MySQL 8.0+)
SET PASSWORD FOR 'user'@'host' = PASSWORD('new_pwd');      # 修改密码(MySQL 5.x)
SHOW GRANTS FOR 'user'@'host';                             # 查看用户权限
REVOKE ALL PRIVILEGES ON *.* FROM 'user'@'host';           # 回收全部权限
FLUSH PRIVILEGES;                                           # 刷新权限表(使生效)`, desc: "#user,MySQL用户权限管理; CREATE/DROP/ALTER USER用户生命周期; SHOW GRANTS看权限; GRANT/REVOKE授权回收; FLUSH PRIVILEGES刷新使生效" , tags: ["MySQL","权限"]},
	             { cmd: `# 各库大小(GB) - 容量规划
SELECT table_schema 库名, ROUND(SUM(data_length+index_length)/1024/1024/1024,2) 大小GB
FROM information_schema.tables GROUP BY table_schema ORDER BY 大小GB DESC;

# 指定库下各表大小(MB)
SELECT table_name 表名, ROUND((data_length+index_length)/1024/1024,2) 大小MB
FROM information_schema.tables WHERE table_schema='库名' ORDER BY (data_length+index_length) DESC;

# Top 10 大表(GB)
SELECT table_schema,table_name,ROUND((data_length+index_length)/1024/1024/1024,2) 大小GB
FROM information_schema.tables ORDER BY (data_length+index_length) DESC LIMIT 10;`, desc: "#size,MySQL库表大小统计; data_length数据+index_length索引=总占用; GROUP BY table_schema按库汇总; WHERE table_schema看单库; ORDER BY找大表" , tags: ["MySQL","容量"]},
	             { cmd: `SHOW PROCESSLIST;                                      # OB进程列表(同MySQL语法)
# 活跃会话(含当前执行SQL, 最重要)
SELECT * FROM gv$session WHERE state = 'ACTIVE';
# 最后调用超过60秒的会话(可能长事务/慢SQL)
SELECT * FROM gv$session WHERE last_call_et > 60;
# 非后台会话概览
SELECT sid,serial#,username,status,sql_id,last_call_et FROM gv$session WHERE type!='BACKGROUND';
ALTER SYSTEM KILL SESSION '<sid>,<serial#>' IMMEDIATE;        # 强制杀会话(OB语法)
ALTER SYSTEM CANCEL SQL '<sql_id>';                            # 取消指定SQL,不杀会话`, desc: "#OB-session,OceanBase会话管理; SHOW PROCESSLIST简洁; gv$session.state=ACTIVE看活跃; last_call_et最后调用时长(秒); KILL SESSION IMMEDIATE强制杀; CANCEL SQL温和取消" , tags: ["OB","进程"]},
	             { cmd: `# SQL审计 - 排查历史SQL(OB核心排查工具)
SELECT * FROM gv$sql_audit WHERE query_sql LIKE '%关键表名%' ORDER BY REQUEST_TIME DESC LIMIT 10;
# 按执行时间排序(找慢SQL, elapsed_time单位微秒)
SELECT * FROM gv$sql_audit WHERE tenant_name='租户名' AND elapsed_time > 1000000 ORDER BY elapsed_time DESC LIMIT 20;
# OB锁等待(当前阻塞链)
SELECT * FROM __all_virtual_lock_wait_stat;`, desc: "#OB-audit,OceanBase SQL审计与锁等待; gv$sql_audit存放历史SQL(受保留时长限制); elapsed_time微秒; __all_virtual_lock_wait_stat当前锁等待链" , tags: ["OB","审计"]},
	             { cmd: `# 合并管理
ALTER SYSTEM MAJOR FREEZE;                                    # 手动触发全量合并
SELECT * FROM gv$merge_info ORDER BY START_TIME DESC LIMIT 5;  # 查看合并历史/进度
# OB参数查询
SHOW PARAMETERS LIKE '%timeout%';                             # 超时相关参数
SHOW PARAMETERS LIKE '%memory%';                              # 内存相关参数
# 执行计划
EXPLAIN SELECT ...;                                           # 查看执行计划
EXPLAIN EXTENDED SELECT ...;                                  # 详细执行计划(含更多细节)`, desc: "#OB-ops,OceanBase合并/参数/执行计划; MAJOR FREEZE手动合并; gv$merge_info合并历史; SHOW PARAMETERS查OB配置; EXPLAIN看执行计划" , tags: ["OB","运维"]},

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
        proxy_set_header Host $http_host; 
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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
                proxy_set_header Host $http_host; 
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
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
                proxy_set_header Host $http_host; 
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
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
                proxy_set_header Host $http_host; 
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;         
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
                proxy_set_header Host $http_host; 
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
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
            {
                desc: "itor-portal proxy",
                cmd: `
#itor-portal
server {
    listen       9977;
    server_name  localhost;
    charset utf-8;
    location ~ / {
        proxy_next_upstream http_503 http_500 http_502 http_404 error timeout invalid_header;
        expires -1;
        proxy_pass http://192.168.0.1:30092;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}` 
            },
            {
                desc: "isrm-portal proxy",
                cmd: `
#isrm-portal
server {
    listen       9966;
    server_name  localhost;
    charset utf-8;
    location ~ / {
        proxy_next_upstream http_503 http_500 http_502 http_404 error timeout invalid_header;
        expires -1;
        proxy_pass http://192.168.0.1:30091;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}` 
            },
            {
                desc: "tcp proxy",
                cmd: `
stream {
    #需要安装--with-stream 
    upstream cloud_redis {
        server 172.17.0.116:6379;
    }

    server {
        listen 6379; # Java客户端连接Nginx的这个端口
        
        # 纯粹转发，去掉所有 proxy_ssl 相关的配置！
        proxy_pass cloud_redis;
        
        # 保持长连接不中断
        proxy_timeout 24h;
        proxy_connect_timeout 10s;
    }
}
` 
            },                               
        ]
    },            
    {
        id: "k8s",
        title: { zh: "K8s", en: "K8s" },
        type: "k8s",
        layout: "grid", // 开启一行两个
        items: [
            { cmd: "kubectl -n roc-uat get pod|grep abc", desc: "get pod,abc 改成需要的.",doc:"",
	            tags: ["资源"]
	        },
            { cmd: `kubectl -n roc-uat get all                # 查看所有资源(常用排查起手式)
kubectl -n roc-uat get pods -o wide     # Pod带节点和IP信息
kubectl -n roc-uat get svc              # 查看Service
kubectl -n roc-uat get endpoints        # 查看Endpoints(Service后端Pod IP列表)
kubectl -n roc-uat get ingress          # 查看Ingress路由规则
kubectl -n roc-uat get pvc              # 查看持久化卷声明
kubectl -n roc-uat get pv               # 查看持久化卷
kubectl -n roc-uat get secrets          # 查看Secrets列表(仅名称)`, desc: "#get,常用资源查看; -o wide显示更多列; get all 查看该ns下一切资源; kubectl api-resources 查看所有支持的资源类型",
	            tags: ["资源"]
	        },
            { cmd: "kubectl rollout restart deploy -n roc-uat roc-goods", desc: "滚动重启" ,doc:"https://kubernetes.io/zh-cn/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_restart/",
	            tags: ["部署"]
	        },
            { cmd: `kubectl -n roc-uat rollout undo deployment roc-goods      # 回滚到上一版本(必须)
kubectl -n roc-uat rollout history deployment roc-goods   # 查看部署历史版本
kubectl -n roc-uat rollout status deployment roc-goods    # 查看Deployment升级状态
kubectl -n roc-uat rollout undo deployment roc-goods --to-revision=2   # 回滚到指定版本`, desc: "#rollout,部署回滚与状态查看; undo回滚; history查看所有revision; status看升级进度; --to-revision指定版本号",
	            tags: ["部署"]
	        },
            { cmd: "kubectl -n roc-uat scale deployment roc-goods --replicas=1", desc: "缩容,设置pod为1份.",
	            tags: ["部署"]
	        },
            { cmd: "kubectl -n roc-uat set image deployment roc-goods roc-goods=版本号", desc: "更新pod版本.",
	            tags: ["部署"]
	        },
            { cmd: "kubectl -n roc-uat logs -f --tail 200 roc-goods", desc: "查看日志",doc:"",
	            tags: ["Pod"]
	        },
            { cmd: "kubectl -n roc-uat exec -it roc-goods  -- sh", desc: "进入pod,如果有多个容器则要加参数 -c [容器名称].",doc:"",
	            tags: ["Pod"]
	        },            
            { cmd: "kubectl -n roc-uat delete pod roc-goods", desc: "删除pod.",doc:"",
	            tags: ["Pod"]
	        },
            { cmd: "systemctl restart kubelet", desc: "重启kubelet服务,如果是节点问题导致的pod异常,可以尝试重启kubelet.",doc:"",
	            tags: ["节点"]
	        },
            { cmd: "kubectl -n roc-uat delete pod roc-goods --grace-period=0 --force --wait=false", desc: "强制删除pod",doc:"",
	            tags: ["Pod"]
	        },            
            { cmd: "kubectl -n roc-uat describe pod roc-goods", desc: "查看pod明细",doc:"",
	            tags: ["资源"]
	        },
            { cmd: "kubectl -n roc-uat describe node [nodeName]", desc: "查看node明细",doc:"",
	            tags: ["节点"]
	        },
            { cmd: `kubectl get nodes -o wide                   # 节点详情(含IP/OS/内核/容器运行时)
kubectl cordon node-1                       # 标记节点不可调度(已有Pod不受影响)
kubectl uncordon node-1                     # 恢复节点为可调度
kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data  # 安全驱逐节点Pod
kubectl taint nodes node-1 key=value:NoSchedule   # 添加污点(排斥Pod)
kubectl taint nodes node-1 key=value:NoSchedule-  # 删除污点(末尾减号)`, desc: "#node,节点维护; get nodes -o wide详细; cordon封禁; drain迁走Pod; taint污点精细调度",
	            tags: ["节点"]
	        },

            { cmd: "kubectl apply -f k8s-pod.yaml", desc: "重新Apply",doc:"",
	            tags: ["部署"]
	        },
            { cmd: "kubectl replace --force -f k8s-pod.yaml", desc: "强制替换 (Force Replace)",doc:"",
	            tags: ["部署"]
	        },
            
            { cmd: "kubectl -n roc-uat get pods |grep Evicted | awk '{print $1}' | xargs kubectl -n roc-uat delete pod", desc: "删除大量evicted的pod.",doc:"",
	            tags: ["批量"]
	        },
            { cmd: "docker cp ab5593917446:/home/logs/error.log ./", desc: "ab5593917446=容器Id(通过docker ps可以查询到),从容器中复制文件到本地，反之则从本地复制到容器里面. >> docker cp [本地文件/目录路径] [容器名或容器ID]:[容器内目标路径]",doc:"",
	            tags: ["Pod"]
	        },
            { cmd: "kubectl cp <namespace>/<pod>:<root_dir>/<parent_dir>/<file_name> ./<file_name>", desc: "从pod复制文件到本地",doc:"",
	            tags: ["Pod"]
	        },
            { cmd: "kubectl cp ./<file_name> <namespace>/<pod>:<root_dir>/<parent_dir>/<file_name>", desc: "从本地复制到pod.",doc:"",
	            tags: ["Pod"]
	        },

            { cmd: "docker rmi $(docker images -f 'dangling=true' -q)", desc: "批量删除这些标签为none的镜像",doc:"",
	            tags: ["批量"]
	        },
            { cmd: "kubectl -n roc-uat exec -it roc-goods  -- curl http://www.baidu.com", desc: "通过pod临时访问外部地址，测试是否能联通.",doc:"",
	            tags: ["网络"]
	        },

            { cmd: `kubectl -n roc-uat exec -it roc-goods  -- timeout 10 bash -c "</dev/tcp/192.168.0.1/8080" 2>/dev/null && echo "通" || echo "不通"`, desc: "通过pod测试,192.168.0.1:8080是否能通.",doc:"",
	            tags: ["网络"]
	        },
            
            { cmd: `kubectl -n roc-uat get pods -o=jsonpath='{range .items[*]}{"kubectl rollout restart deploy -n roc-uat "}{.metadata.labels.app}{"\\n"}' | sort -u`, desc: "批量生成需要重启的pod命令.",doc:"",
	            tags: ["批量"]
	        },

            { cmd: "kubectl -n roc-uat top pod --sort-by=memory", desc: "根据内存排序",doc:"",
	            tags: ["资源"]
	        },
            
            { cmd: "kubectl -n roc-uat top pod --sort-by=memory | tail -n +2 | sort -k3 -h", desc: "根据内存-升序",doc:"",
	            tags: ["资源"]
	        },
            { cmd: "kubectl -n roc-uat top pod --sort-by=memory | tail -n +2 | sort -k3 -h -r", desc: "根据内存-降序",doc:"",
	            tags: ["资源"]
	        },
            

            { cmd: "kubectl -n roc-uat get configmap", desc: "#cm,查找configMap-list",doc:"",
	            tags: ["配置"]
	        },
            { cmd: "kubectl -n roc-uat describe configmap common-config", desc: "#cm,详细查看具体common-config的内容.",doc:"",
	            tags: ["配置"]
	        },
            
            { cmd: "kubectl -n roc-uat get configmap common-config -o jsonpath='{.data.NACOS_SERVER}'", desc: "#cm,查询configMap里面的NACOS_SERVER参数的值,其他参数类似.",doc:"",
	            tags: ["配置"]
	        },
            { cmd: `kubectl -n roc-uat patch configmap common-config -p '{"data":{"NACOS_SERVER":"http://nacos.pbs:8848"}}'`, desc: "#cm,设置configMap里面的NACOS_SERVER参数的值,其他参数类似.",doc:"",
	            tags: ["配置"]
	        },
            { cmd: `kubectl -n roc-uat patch deployment roc-goods -p '{"spec":{"template":{"spec":{"containers":[{"name":"roc-goods","resources":{"limits":{"memory":"4Gi"}}}]}}}}'`, desc: "#deployment,设置deployment的资源限制",doc:"",
	            tags: ["部署"]
	        },
            { cmd: `kubectl create configmap my-cm --from-file=app.properties -n roc-uat     # 从文件创建
kubectl create configmap my-cm --from-literal=KEY=VALUE -n roc-uat   # 从键值对创建
kubectl create secret generic my-secret --from-literal=user=admin -n roc-uat
kubectl create secret docker-registry myreg --docker-server=registry.cn-hangzhou.aliyuncs.com --docker-username=xxx --docker-password=xxx -n roc-uat
kubectl create secret tls my-tls --cert=cert.pem --key=key.pem -n roc-uat`, desc: "#create,创建ConfigMap/Secret; generic通用密钥; docker-registry镜像拉取密钥; tls TLS证书密钥",
	            tags: ["配置"]
	        },

            { cmd: "kubectl port-forward --address 0.0.0.0 svc/kube-prometheus-stack-alertmanager -n monitoring 9093:9093", desc: "根据service直接代理给k8s-master机器的端口访问，如：http://192.168.227.102:9093/#/alerts",doc:"",
	            tags: ["网络"]
	        },
            
            { cmd: "kubectl -n roc-uat logs -f --since=1h roc-goods > /tmp/roc-goods.log", desc: "#log,取1小时内的日志",doc:"",
	            tags: ["Pod"]
	        },

            { cmd: "kubectl run -it --rm dns-test --image=registry.cn-zhangjiakou.aliyuncs.com/abtv/busybox:1.28 --restart=Never -- nslookup www.baidu.com", desc: "#测试pod访问外网是否正常.镜像2M,用完删除.",doc:"",
	            tags: ["网络"]
	        },
                        
            { cmd: "kubectl -n roc-uat debug -it dble-pos-7655bd6f46-z77bs --image=registry.cn-zhangjiakou.aliyuncs.com/abtv/redis:7.2.0 --target=dble-pos -- bash", desc: "#debug,进入pod调试",doc:"",
	            tags: ["Pod"]
	        },            
            { cmd: "kubectl -n roc-uat logs roc-goods-794ccfdd79-2zwtm -c roc-goods --previous", desc: "查看上一次被杀死的容器的日志(-c roc-goods表示指定容器),专门用来查：Pod 为什么崩溃、为什么重启、为什么被 kill",doc:"",
	            tags: ["Pod"]
	        },
            { cmd: `kubectl get pods -n roc-uat -o=jsonpath='{range .items[*]}{"Pod: kubectl -n roc-uat set image deployment "}{.metadata.labels.app}{" "}{.metadata.labels.app}{"="}{range .spec.containers[*]}{.image}{"\n"}{end}{"\n"}{end}' > roc-image.log`, desc: "生成所有deployment的镜像更新命令,并存放在roc-image.log文件中",doc:"",
	            tags: ["批量"]
	        },
{ cmd: `
#!/bin/bash
#把所有service打印出来
for svc in $(kubectl -n pos-uat get svc | awk 'NR>1 {print $1}'); do
  echo "kubectl -n pos-uat scale deployment "$svc" --replicas=1"
done
`, desc: "把所有service打印出来.",doc:"",
	            tags: ["批量"]
	        },
{ cmd: `
#使用 Ephemeral Containers (临时容器) 抓包
kubectl debug -it <pod-name> --image=registry.cn-zhangjiakou.aliyuncs.com/abtv/netshoot:0.15-- target <container-name>

#进入后执行：
tcpdump -i any port <缓存端口> -vvv
`, desc: "debug-k8s-pod-network.",doc:"https://xd20al46gl.feishu.cn/docx/PCEbdjNNYo702GxeJlIcnFcAnbd",
	            tags: ["网络"]
	        },
    { cmd: `kubectl -n <命名空间> get <类型> <名称> -o yaml > 输出文件.yaml`, desc: "导出 Kubernetes 资源的 YAML 配置", doc: "",
	            tags: ["批量"]
	        },
    { cmd: `kubectl api-resources                    # 列出所有API资源(含简称/API组)
kubectl explain pod.spec.containers    # 查看资源字段说明(递归)
kubectl auth can-i get pods --namespace roc-uat   # 检查当前用户权限
kubectl auth can-i '*' '*' -n roc-uat             # 检查全部权限`, desc: "#info,API资源/权限/文档; api-resources查看ShortName; explain查看字段含义; auth can-i排查权限问题",
	            tags: ["资源"]
	        },
    { cmd: `kubectl -n roc-uat get events --sort-by=.metadata.creationTimestamp  # 按时间排序
kubectl -n roc-uat get events -w                                      # 实时Watch事件流
kubectl -n roc-uat get events --field-selector involvedObject.name=roc-goods   # 过滤特定资源`, desc: "#events,集群事件排查; Pod启动失败/调度失败/OOM都会记录; -w实时监听; --field-selector过滤",
	            tags: ["资源"]
	        },
    { cmd: `kubectl -n roc-uat edit deployment roc-goods    # 在线编辑资源(自动打开vi)
kubectl diff -f k8s-pod.yaml                # 预览apply即将产生的变更(不会执行)
kubectl create deploy my-app --image=nginx -n roc-uat --dry-run=client -o yaml`, desc: "#edit,在线编辑与对比; edit直接修改集群资源; diff预览变更(安全审查); --dry-run生成YAML不执行",
	            tags: ["部署"]
	        },
    { cmd: `kubectl -n roc-uat label pod roc-goods env=prod        # 添加/修改标签
kubectl -n roc-uat get pods -l app=roc-goods                   # 按标签筛选Pod
kubectl -n roc-uat get pods --show-labels                      # 显示所有Pod标签
kubectl -n roc-uat annotate pod roc-goods desc="my pod"        # 添加注解`, desc: "#label,标签与注解操作; -l 筛选; -l 'env in (prod,staging)' 多值; --show-labels 显示标签列",
	            tags: ["配置"]
	        },
    { cmd: `
kubectl get deploy,sts -n roc-uat -o custom-columns="KIND:.kind,NAME:.metadata.name,REPLICAS:.spec.replicas" --no-headers | awk '{rep=$3; if(rep=="<none>") rep=1; printf "kubectl -n roc-uat scale %s %s --replicas=%s\n", tolower($1), $2, rep}' > roc-uat-pod-replicas.log
`, desc: "#scale,批量生成缩容命令; custom-columns自定义输出列; --no-headers去掉表头; awk生成缩容命令并保存到文件",
	            tags: ["资源"]
	        },
        ]
    },
    {
        id: "link",
        title: { zh: "链接", en: "Links" },
        type: "list",
        // 链接数据：包含 category 属性
        items: [
            { category: "🛠️Tools",text:"查看出口ip", url: "https://cip.cc/", desc: "公网IP"},
            
            { category: "🛠️Tools",text:"generate password", url: "./infra/passwd.html", desc: "生产密码"},
            { category: "🛠️Tools",text:"ip check", url: "https://www.ip138.com/", desc: ""},
            { category: "🛠️Tools",text:"1024tools", url: "https://1024tools.com/uuid", desc: "各种格式转换,加解密,网络工具"},
            { category: "🛠️Tools",text:"ssl-check", url: "https://www.ssllabs.com/ssltest/analyze.html", desc: ""},
            { category: "🛠️Tools",text:"yaml-check", url: "https://www.yamllint.com/", desc: ""},
            { category: "🛠️Tools",text:"perfcode", url: "https://www.perfcode.com/linux/kali/password-dictionary", desc: ""},
            { category: "🛠️Tools",text:"windy", url: "https://www.windy.com", desc: ""},            
            { category: "🛠️Tools",text:"whatismyipaddress", url: "https://whatismyipaddress.com/", desc: ""},            
            { category: "🛠️Tools",text:"Docker-Image-Hub", url: "http://8.220.217.46:8000/", desc: ""},            
            { category: "🛠️Tools",text:"docker-aityp", url: "https://docker.aityp.com/", desc: "docker research"},            
            { category: "🛠️Tools",text:"Dependency-Check", url: "https://owasp.org/www-project-dependency-check/", desc: "项目依赖及漏洞扫描"},            
            { category: "🛠️Tools",text:"start-spring-io", url: "https://start.spring.io/", desc: "generate java projects"},            
            { category: "🛠️Tools",text:"properties2yaml-在线格式转换", url: "https://www.bejson.com/devtools/properties2yaml/", desc: ""},
            { category: "🛠️Tools",text:"icon-getemoji", url: "https://getemoji.com/", desc: "icon"},
            { category: "🛠️Tools",text:"pdf转换", url: "https://tools.pdf24.org/zh/", desc: "pdf各种转换-免费"},
            { category: "🛠️Tools",text:"中国气象局雷达图", url: "https://www.nmc.cn/publish/radar/chinaall.html", desc: ""},
            
            { category:"📚Doc",text:"FastDeploy&FastLink", url: "https://xd20al46gl.feishu.cn/docx/Hkhvdh1CkoHkYGxhe4Hc3oWqn7Z", desc: ""},
            { category:"📚Doc",text:"基础设施组件清单", url: "./infra/infra-list.html", desc: ""},
            { category:"📚Doc",text:"服务器配置清单", url: "./infra/infra-servers.html", desc: ""},
            { category:"📚Doc",text:"Nginx升级方法", url: "https://xd20al46gl.feishu.cn/docx/Bdo2ddv4LoLkAvx1BfjcgOW0ndh", desc: "4N11294&"},
            { category: "📚Doc",text: "Nginx Docs", url: "http://nginx.org/en/docs/", desc: "Nginx文档" },
            { category: "📚Doc",text: "MDN Web Docs", url: "https://developer.mozilla.org/", desc: "Web开发"},
            { category: "📚Doc",text:"镜像版本列表", url: "./infra/imagelist.html", desc: ""},
            
            { category: "📚Doc",text:"rocky-os-下载", url: "https://rockylinux.org/zh-CN/download", desc: ""},
            
            { category: "📚Doc",text:"Java所有版本下载", url: "https://adoptium.net/zh-CN/temurin/releases", desc: "Java所有版本下载-LTS"},
            { category: "📚Doc",text:"磁盘压测", url: "https://xd20al46gl.feishu.cn/docx/CxapdqUGxoF8Vtxi9nacifPonGd", desc: "IOPS压测."},
            { category: "📚Doc",text:"多镜像仓库使用说明", url: "https://xd20al46gl.feishu.cn/docx/J17sdDzUVo4NfZxxupbcq6uSnoh", desc: ""},            
            { category: "📚Doc",text:"使用minIO操作说明", url: "https://xd20al46gl.feishu.cn/docx/Z44pdIQkOoE2tDxEL2WcYx5EnIf", desc: ""},


            { category: "❄️K8s",text:"K8s日常操作", url: "https://xd20al46gl.feishu.cn/docx/TbnNda0dXom9C3xs8mNcYqTcnJe", desc: "418#48r5"},      
            { category: "❄️K8s",text: "K8s Docs", url: "https://kubernetes.io/docs/", desc: "官方文档"},
            
            { category: "❄️K8s",text: "Kubernetes-Architecture", url: "https://kubernetes.io/zh-cn/docs/concepts/architecture/", desc: "k8s-架构" },
            { category: "❄️K8s",text: "Kubernetes-版本记录", url: "https://kubernetes.io/zh-cn/releases/", desc: "发行版本" },
            
            { category: "❄️K8s",text:"Kubernetes|大规模集群的注意事项", url: "https://kubernetes.io/zh-cn/docs/setup/best-practices/cluster-large/", desc: ""},
            { category: "❄️K8s",text:"測試 K8S Pod 數量超過 110 會發生甚麼事?", url: "https://hackmd.io/@QI-AN/What-happens-when-the-number-of-K8S-Pods-exceeds-110#15-%E6%9F%A5%E7%9C%8B%E7%8B%80%E6%85%8B%E7%82%BA-Running-%E7%9A%84-Pod-%E6%98%AF%E5%90%A6%E6%9C%89%E8%A2%AB%E5%BD%B1%E9%9F%BF", desc: ""},
            
            { category: "❄️K8s",text:"Kubernetes|kubelet-config", url: "https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/", desc: ""},
            { category: "❄️K8s",text:"Kubernetes|tool-reference", url: "https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/", desc: ""},            
            { category: "❄️K8s",text:"Kubernetes|K8S 修改节点 pod 上限", url: "https://koomu.cn/k8s-modify-node-pods-limits/", desc: ""},
            
            { category: "❄️K8s",text:"K8S-配置存活、就绪和启动探针", url: "https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/", desc: ""},
            { category: "❄️K8s",text:"通过kubectl连接集群-hw-cce", url: "https://support.huaweicloud.com/intl/zh-cn/usermanual-cce/cce_10_0107.html", desc: ""},            

            { category: "❄️K8s",text:"获取yaml文件创建pod", url: "http://39.103.177.212:30008/", desc: "需要vpn"},
            { category: "❄️K8s",text:"K8s Pod YAML 生成器", url: "./infra/k8s-pod-yaml-generator.html", desc: ""},
            
            { category: "❄️K8s",text:"k8s-kubeadm集群证书过期更换方法", url: "https://xd20al46gl.feishu.cn/docx/GaDrdYRvuoTnT4xaMvNczu9TnId", desc: ""},            
            { category: "❄️K8s",text:"k8s-网络-debug", url: "https://xd20al46gl.feishu.cn/docx/PCEbdjNNYo702GxeJlIcnFcAnbd", desc: ""},

            { category: "❄️K8s",text:"k8s-rancher增加集群管理", url: "https://xd20al46gl.feishu.cn/docx/EwEmdHyndovGXzxckU1cz4Cansd", desc: ""},

            { category: "📚DB",text:"ob-入门到出门指引", url: "https://xd20al46gl.feishu.cn/docx/J0nDdW5cJoe1ByxrxJwcArDZnIb", desc: ""},
            { category: "📚DB",text:"ob-oms-调优", url: "https://xd20al46gl.feishu.cn/docx/HcURd9NSAoWvBPxUfyccuFNznTc", desc: ""},
            { category: "📚DB",text:"OMS社区版文档", url: "https://www.oceanbase.com/docs/community-oms-cn-1000000005763933", desc: ""},
            
            { category: "📚DB",text:"OBServer-版本选择说明", url: "https://xd20al46gl.feishu.cn/docx/WMMmd6iFUoIhtKxywwBclEsBnKc", desc: ""},
            { category: "📚DB",text:"OBServer-日常维护", url: "https://xd20al46gl.feishu.cn/docx/I3BcdNX6doYjrExlSNrcAF1inff", desc: ""},
            { category: "📚DB",text:"mySQL-安装方法", url: "https://xd20al46gl.feishu.cn/docx/J05VdQykeotDM5xKE0icDV9Qn4g", desc: "333q31&2"},
            { category: "📚DB",text:"mySQL日常操作", url: "https://xd20al46gl.feishu.cn/docx/HGmndOA03o3zgbxkos6cwBwinNd", desc: "7@e15734"},
            { category: "📚DB",text:"OBServer-部署前配置", url: "https://www.oceanbase.com/docs/community-observer-cn-10000000000900490", desc: ""},
            { category: "📚DB",text:"OBServer-文档概览", url: "https://www.oceanbase.com/docs/community-observer-cn-1000000000056379", desc: ""},
            { category: "📚DB",text:"OBServer-数据库整体架构", url: "https://www.oceanbase.com/docs/community-observer-cn-10000000000900890", desc: ""},
            { category: "📚DB",text:"OCP-文档概述", url: "https://www.oceanbase.com/docs/ocp", desc: ""},
            { category: "📚DB",text:"ODP-数据库代理", url: "https://www.oceanbase.com/docs/odp-doc-cn", desc: ""},
            { category: "📚DB",text:"OB-发布版本记录", url: "https://www.oceanbase.com/product/oceanbase-database-community-rn/releaseNote#V4.2.5", desc: ""},
            { category: "📚DB",text:"SQL-生成器", url: "./infra/mysql-sql-generator.html", desc: ""},

            {category: "📊Monitor", text: "Prometheus", url: "http://prometheus.local", desc: "监控大盘" },
            {category: "📊Monitor", text: "Grafana", url: "http://grafana.local", desc: "图表展示"},

            
            { category: "⚽️NetWork",text:"wireguard", url: "https://www.wireguard.com/quickstart/", desc: "vpc"},
            { category: "⚽️NetWork",text:"centralops-DNS-Domain -Check-Traceroute", url: "https://centralops.net/", desc: ""},
            { category: "⚽️NetWork",text:"Visual Subnet Calculator", url: "https://www.davidc.net/sites/default/subnets/subnets.html", desc: "子网分配计算"},

            { category: "⚽️NetWork",text:"WinMTR", url: "https://sourceforge.net/projects/winmtr/", desc: "network check"},

            { category: "⚽️NetWork",text:"Wireshark", url: "https://www.wireshark.org/docs/relnotes/", desc: "抓包分析"},
            { category: "⚽️NetWork",text:"itdog", url: "https://www.itdog.cn/", desc: "itdog-网速检测"},
            { category: "⚽️NetWork",text:"TCP抓包分析", url: "https://xd20al46gl.feishu.cn/docx/UzL7dnZFfow325xCk4ocz11knQg", desc: ""},
            // https://mp.weixin.qq.com/s/47AWj_IBKjoT71eL8dALug
            

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
        this.updateFooter();
        this._footerTimer = setInterval(() => this.updateFooter(), 1000);
    },

    updateFooter() {
        const now = new Date();
        const lang = this.state.lang === 'zh' ? 'zh-CN' : 'en-US';
        const dateStr = now.toLocaleDateString(lang, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
        const timeStr = now.toLocaleTimeString(lang, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = -now.getTimezoneOffset() / 60;
        const offsetStr = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
        const region = navigator.language || 'unknown';
        document.getElementById('footer-datetime').textContent = `${dateStr} ${timeStr} ${tz} (${offsetStr})`;
        document.getElementById('footer-locale').textContent = `Region: ${region}`;
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
            // let searchHtml = '';
            // if (['cmd','nginx', 'k8s'].includes(section.type)) {
            //     const ph = this.state.lang === 'zh' ? '搜索...' : 'Search...';
            //     searchHtml = `
            //     <div class="search-wrapper">
            //         <input type="text" class="section-search" placeholder="${ph}" 
            //             oninput="app.filterCmds(this, '${section.id}')">
            //         <span class="search-clear" onclick="app.clearSearch(this, '${section.id}')">✕</span>
            //     </div>`;
            // }

            // --- 1. 构建头部控件 (搜索框 + 标签下拉) ---
            let headerControlsHtml = '';
            let searchHtml = '';

            // 仅 cmd, k8s, nginx 类型显示搜索和标签
            if (['cmd', 'k8s', 'list'].includes(section.type)) {
                
                // A. 搜索框
                const ph = this.state.lang === 'zh' ? '搜索...' : 'Search...';
                searchHtml = `
                <div class="search-wrapper">
                    <input type="text" class="section-search" placeholder="${ph}" 
                        oninput="app.filterSection('${section.id}')">
                    <span class="search-clear" onclick="app.clearSearch(this, '${section.id}')">✕</span>
                </div>`;

                // B. 标签下拉框 (安全处理 tags)
                let tagSelectHtml = '';
                const allTags = new Set();
                if (section.items) {
                    section.items.forEach(item => {
                        // [修改点] 增加判断：只有当 item.tags 存在且是数组时才处理
                        if (item.tags && Array.isArray(item.tags)) {
                            item.tags.forEach(t => allTags.add(t));
                        }
                    });
                }

                // 只有当该区域确实有标签时，才显示下拉框
                if (allTags.size > 0) {
                    const labelAll = this.state.lang === 'zh' ? '全部标签' : 'All Tags';
                    const options = Array.from(allTags).map(tag => `<option value="${tag}">${tag}</option>`).join('');
                    
                    tagSelectHtml = `
                    <select class="section-tag-select" onchange="app.filterSection('${section.id}')">
                        <option value="">${labelAll}</option>
                        ${options}
                    </select>`;
                }

                // 组合控件
                headerControlsHtml = `
                <div class="header-controls">
                    ${tagSelectHtml}
                    ${searchHtml}                    
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
                        const filterText = (link.text + ' ' + (link.desc || '') + ' ' + (link.category || '')).toLowerCase();
                        return `<li data-filter="${app.escapeHtml(filterText)}"><a href="${link.url}" target="_blank">${link.text}</a>${descSpan}</li>`;
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
                    
                    // [修改点] 容错处理：如果没有 tags，默认为空数组，避免报错
                    // 如果 item.tags 是 undefined，这里会变成 ""
                    const tagsStr = (item.tags || []).join(',');

                    // <div class="cmd-box ${extraClass}" data-filter="${searchText}">
                    return `
                    <div class="cmd-box ${extraClass}" data-filter="${app.escapeHtml(searchText)}"
                        data-tags="${tagsStr}">
                        ${numHtml}
                        <div class="cmd-wrapper">
                            <pre>${cmdText}</pre>
                            ${descHtml}
                        </div>
                        <button class="copy-btn" onclick="app.copy(this)">${btnCopy}</button>
                    </div>`;
                }).join('');
            }


            // [修改点]：检查 section 是否配置了 layout: 'grid'
            const gridClass = section.layout === 'grid' ? 'grid-2-col' : '';

            // ${searchHtml}
            mainHtml += `
            <div id="${section.id}" class="section">
                <div class="section-header">
                    <h2>${title}</h2>
                    
                    <!-- [核心修复] 使用包含下拉框的完整变量 headerControlsHtml -->
                    ${headerControlsHtml}
                    
                </div>
                ${controlHtml}
                <!-- [修改点]：将 gridClass 添加到这个容器 div 上 -->
                <div class="cmd-list-container ${gridClass}"">${contentHtml}</div>
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
        // 重置所有元素的显示状态
        const boxes = document.querySelectorAll(`#${sectionId} .cmd-box`);
        if (boxes.length > 0) {
            boxes.forEach(box => box.style.display = 'flex');
        } else {
            // 链接区块：显示所有li和分类卡片
            document.querySelectorAll(`#${sectionId} .link-ol li`).forEach(li => li.style.display = '');
            document.querySelectorAll(`#${sectionId} .link-category-card`).forEach(card => card.style.display = '');
        }

        // 触发筛选（此时会保留标签的选择状态，只清空了搜索词）
        app.filterSection(sectionId);
        input.focus();
    },
    toggleMenu() { document.getElementById('mobile-menu').classList.toggle('open'); },
    closeMenu() { document.getElementById('mobile-menu').classList.remove('open'); },
    // copy(btn) {
    //     const pre = btn.previousElementSibling.querySelector('pre');
    //     if(!pre) return;
    //     navigator.clipboard.writeText(pre.innerText).then(() => {
    //         const orig = btn.innerText; btn.innerText = "✓";
    //         setTimeout(() => btn.innerText = orig, 1000);
    //     });
    // },
    // --- 兼容手机和 HTTP 环境的复制函数 ---
    copy(btn) {
        // 1. 获取要复制的文本
        // 根据之前的 HTML 结构：button 的前一个兄弟元素是 wrapper，wrapper 里有 pre
        const wrapper = btn.previousElementSibling;
        const pre = wrapper ? wrapper.querySelector('pre') : null;
        
        if (!pre) return;
        const text = pre.innerText;

        // 定义成功的 UI 反馈
        const showSuccess = () => {
            const original = btn.innerText;
            btn.innerText = "✓";
            setTimeout(() => btn.innerText = original, 1000);
        };

        // 2. 尝试使用现代 API (需要 HTTPS 或 localhost)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(showSuccess)
                .catch(() => {
                    // 如果现代 API 失败（例如在 HTTP 下），转入兼容模式
                    legacyCopy(text);
                });
        } else {
            // 如果浏览器不支持现代 API，直接用兼容模式
            legacyCopy(text);
        }

        // 3. 定义兼容模式 (老式方法，支持 HTTP)
        function legacyCopy(txt) {
            const textArea = document.createElement("textarea");
            textArea.value = txt;
            
            // 防止在手机上拉起键盘或造成页面抖动
            textArea.style.position = "fixed"; 
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            textArea.setAttribute("readonly", ""); // 防止 iOS 弹键盘
            
            document.body.appendChild(textArea);
            
            // 选中文本
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, 99999); // 专门针对 iOS 的兼容写法

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showSuccess();
                } else {
                    alert("复制失败，请长按文本手动复制");
                }
            } catch (err) {
                console.error("无法复制", err);
                alert("复制功能被拦截，请手动复制");
            }

            // 清理临时元素
            document.body.removeChild(textArea);
        }
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
    },

     // --- [核心修改] 统一筛选函数 (同时处理 搜索框 和 标签下拉) ---
     filterSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // 1. 获取搜索框的值
        const searchInput = section.querySelector('.section-search');
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        
        // 控制清除按钮显示
        if (searchInput) {
            const clearBtn = section.querySelector('.search-clear');
            if (clearBtn) clearBtn.style.display = term.length > 0 ? 'block' : 'none';
        }

        // 2. 获取标签下拉框的值
        const tagSelect = section.querySelector('.section-tag-select');
        const selectedTag = tagSelect ? tagSelect.value : '';

        // 3. 遍历并筛选
        const boxes = section.querySelectorAll('.cmd-box');
        if (boxes.length > 0) {
            // 命令区块过滤逻辑
            boxes.forEach(box => {
                const textMatch = box.getAttribute('data-filter').includes(term);

                // 标签匹配逻辑：如果选了标签，检查 data-tags 是否包含该标签
                let tagMatch = true;
                if (selectedTag) {
                    const boxTags = box.getAttribute('data-tags').split(',');
                    tagMatch = boxTags.includes(selectedTag);
                }

                // 同时满足才显示
                if (textMatch && tagMatch) {
                    box.style.display = 'flex';
                } else {
                    box.style.display = 'none';
                }
            });
        } else {
            // 链接区块过滤逻辑
            const linkItems = section.querySelectorAll('.link-ol li');
            linkItems.forEach(li => {
                const textMatch = li.getAttribute('data-filter').includes(term);
                if (textMatch) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });

            // 处理分类卡片：隐藏没有可见链接的卡片
            const categoryCards = section.querySelectorAll('.link-category-card');
            categoryCards.forEach(card => {
                const links = card.querySelectorAll('.link-ol li');
                let hasVisible = false;
                links.forEach(li => {
                    if (li.style.display !== 'none') {
                        hasVisible = true;
                    }
                });
                if (!hasVisible) {
                    card.style.display = 'none';
                } else {
                    card.style.display = '';
                }
            });
        }
    },

};

window.addEventListener('DOMContentLoaded', () => app.init());