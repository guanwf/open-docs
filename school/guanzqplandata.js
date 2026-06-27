// 2026年广东高考物理类 · 45个志愿黄金组合方案 — 数据层
// 修改此文件即可自动更新 school/guanzq.html 页面内容
window.VOLUNTEER_DATA = {
  candidate: {
    name: "子琪同学",
    score: 559,
    rank: 79275,
    subjects: "物、化、生"
  },
  intro: '本方案共设计 <strong>45个志愿（冲刺12个 + 稳妥20个 + 保底13个）</strong>。完全打破传统只按分数高低排列的混乱感，将高校按照"六大地区产业板块"进行分类规划。所有涉及专业组均为最安全的"物理+化学"或"物理+化生"组，极大降低了非生化相关专业的调剂风险。',
  plates: [
    {
      id: "plate-1",
      title: "第一大板块：【粤港澳大湾区（广/莞/佛）】",
      feature: "产业特色：临床医学检验、精细日化配方、电池能源新材料",
      schools: [
        { id: "01", name: "广州中医药大学",       group: "204药学组",         gradient: "chong", gradientLabel: "冲刺",           rank: 74220,  rankLabel: "约 74,220 名",   score: 547, majors: "药学、中药制药",                           strategy: "冲刺双一流。中药化学提取与现代药学合成，科研平台极佳。" },
        { id: "02", name: "广州大学",              group: "化学化工组",        gradient: "chong", gradientLabel: "冲刺",           rank: 75046,  rankLabel: "约 75,046 名",   score: 546, majors: "应用化学、化学工程与工艺",                strategy: "本地重点。化学与化工为大类实力学科，大湾区就业率极高。" },
        { id: "03", name: "汕头大学",              group: "化学组",           gradient: "chong", gradientLabel: "冲刺",           rank: 73500,  rankLabel: "约 73,500 名",   score: 555,  majors: "应用化学、生物技术",                          strategy: "资金极其充足，实验仪器在省属高校中堪称豪华，支持早进实验室。" },
        { id: "04", name: "东莞理工学院",           group: "215联合学位组",     gradient: "wen",   gradientLabel: "稳妥(首选)",       rank: 80517,  rankLabel: "80,517 名",       score: 550,  majors: "应用化学(莞工)+药学(广医)",                  strategy: "<strong>跨校强强联合</strong>。毕业拿双学士，兼顾化学工科与药理生物背景。" },
        { id: "05", name: "东莞理工学院",           group: "202普通化学组",     gradient: "wen",   gradientLabel: "稳妥",             rank: 80557,  rankLabel: "80,557 名",       score: 550,  majors: "应用化学、能源化学工程",                       strategy: "国家级一流专业，深度对接松山湖新能源与电子材料大厂。" },
        { id: "06", name: "广东医科大学",           group: "207检验组",        gradient: "wen",   gradientLabel: "稳妥",             rank: 82980,  rankLabel: "82,980 名",       score: 550,  majors: "医学检验技术、药学",                           strategy: "检验黄埔军校，医学检验技术为国家一流专业。医院检验科首选。" },
        { id: "07", name: "佛山大学",              group: "普通化学组",        gradient: "wen",   gradientLabel: "稳妥",             rank: 89495,  rankLabel: "约 89,495 名",   score: 544,  majors: "应用化学、材料化学",                           strategy: "成功更名“大学”，享受佛山精细化工、涂料高分子制造业红利。"},
        { id: "08", name: "广东技术师范大学",        group: "师范组",           gradient: "wen",   gradientLabel: "稳妥",             rank: 87411,  rankLabel: "约 87,411 名",   score: 545,  majors: "化学（师范）",                                 strategy: "广州本地公办。如果未来想在大湾区当中学化学老师，属于稳妥之选。" },
        { id: "09", name: "广东药科大学",           group: "202/203中山",      gradient: "bao",   gradientLabel: "保底(高配)",       rank: 113000, rankLabel: "约 113,000 名",  score: 525,  majors: "化妆品科学与技术、制药工程",                    strategy: "其化妆品科学全国A+，您的排位进去可以直接锁定最王牌专业。" },
        { id: "10", name: "五邑大学",              group: "江门化学组",        gradient: "bao",   gradientLabel: "保底",             rank: 100217, rankLabel: "约 100,217 名",  score: 537,  majors: "应用化学、制药工程",                           strategy: "重点发展化学材料，学科ESI全球前1%，师资多海归，适合考研。" },
        { id: "11", name: "仲恺农业工程学院",        group: "广州生化组",        gradient: "bao",   gradientLabel: "保底",             rank: 132071, rankLabel: "约 132,071 名",  score: 509,  majors: "应用化学、生物技术",                           strategy: "广州本地老牌公办。偏向生态化学、植物农业保护生化应用。" },
        { id: "12", name: "广东海洋大学",           group: "湛江化学组",        gradient: "bao",   gradientLabel: "保底",             rank: 122000, rankLabel: "约 122,000 名",  score: 515,  majors: "食品质量与安全、制药工程",                      strategy: "偏向海洋生物化学、水产与食品防腐安全检测。" }
      ]
    },
    {
      id: "plate-2",
      title: "第二大板块：【长三角沿海区（沪/苏/浙/皖）】",
      feature: "产业特色：外资日化总部、精细化工、现代医药研发",
      schools: [
        { id: "13", name: "上海应用技术大学",        group: "203组",            gradient: "chong", gradientLabel: "冲刺",           rank: 61000,  rankLabel: "约 61,000 名",   score: 566,  majors: "化妆品技术与工程、香料香精",                    strategy: "调香与高端日化行业的黄埔军校。高含金量冲刺，极力推荐。" },
        { id: "14", name: "上海海洋大学",           group: "207中外合作",       gradient: "chong", gradientLabel: "冲刺",           rank: 74905,  rankLabel: "约 74,905 名",   score: 554,  majors: "食品科学与工程（偏生化）",                      strategy: "上海双一流。合作组分数较温和，是留在上海发展的极佳跳板。" },
        { id: "15", name: "扬州大学",              group: "江苏理学强校",       gradient: "chong", gradientLabel: "冲刺",           rank: 74905,  rankLabel: "约 74,905 名",   score: 554,  majors: "应用化学、制药工程",                           strategy: "农学与生命科学底蕴深，化学ESI前1%，学术保研氛围极好。" },
        { id: "16", name: "南通大学",              group: "江苏生化组",         gradient: "wen",   gradientLabel: "稳妥",             rank: 89009,  rankLabel: "约 89,009 名",   score: 540,  majors: "药学、高分子材料与工程",                        strategy: "江苏省属重点，药理学与化学双全球前1%，长三角药企认可度高。" },
        { id: "17", name: "常州大学",              group: "江苏化工组",         gradient: "wen",   gradientLabel: "稳妥",             rank: 86922,  rankLabel: "约 86,922 名",   score: 546,  majors: "应用化学、化学工程与工艺",                      strategy: "传统石化强校。常州新能源和半导体材料发达，应用技术极强。" },
        { id: "18", name: "温州大学",              group: "浙江化学组",         gradient: "wen",   gradientLabel: "稳妥",             rank: 88855,  rankLabel: "约 88,855 名",   score: 545,  majors: "应用化学、化学",                               strategy: "富庶浙江，化学ESI全球前1%，偏向轻工合成材料，就业极好。" },
        { id: "19", name: "安徽工业大学",           group: "低分专业组",         gradient: "bao",   gradientLabel: "保底",             rank: 98771,  rankLabel: "约 98,771 名",   score: 538,  majors: "应用化学、化学工程与工艺",                      strategy: "传统冶金化工强校，位于南京一小时经济圈内，工科实力扎实。" },
        { id: "20", name: "浙江海洋大学",           group: "浙江生化组",         gradient: "bao",   gradientLabel: "保底",             rank: 108000, rankLabel: "约 108,000 名",  score: 532,  majors: "食品科学与工程（食品化学）",                    strategy: "位于舟山海滨，海洋食品生化分析在长三角颇具实力。" }
      ]
    },
    {
      id: "plate-3",
      title: "第三大板块：【西部金三角（西部黑马类）】",
      feature: "产业特色：国防军工特种材料、石油天然气能源化学",
      schools: [
        { id: "21", name: "西安理工大学",           group: "203组",            gradient: "chong", gradientLabel: "冲刺",           rank: 69444,  rankLabel: "约 69,444 名",   score: 558,  majors: "材料化学、应用化学",                           strategy: "军工与航天航空新材料、封装材料。用化学解决“卡脖子”技术。" },
        { id: "22", name: "西南石油大学",           group: "双一流217组",       gradient: "chong", gradientLabel: "冲刺",           rank: 71682,  rankLabel: "约 71,682 名",   score: 557,  majors: "应用化学、能源化学工程",                       strategy: "国家双一流。中石油、中石化、中海油等大型央企直通车。" },
        { id: "23", name: "成都理工大学",           group: "双一流化学组",       gradient: "chong", gradientLabel: "冲刺",           rank: 68983,  rankLabel: "约 68,983 名",   score: 559,  majors: "应用化学、生物工程",                           strategy: "国家双一流，偏向重工业、地球化学分析，国家级实验设备。" },
        { id: "24", name: "重庆理工大学",           group: "213兵工组",         gradient: "wen",   gradientLabel: "稳妥",             rank: 77001,  rankLabel: "77,001 名",       score: 553,  majors: "药学、化学工程与工艺",                           strategy: "深厚兵器工业背景。化学与药学在大西南认可度极高。等位高性价比。" },
        { id: "25", name: "西华大学",              group: "四川生化组",         gradient: "bao",   gradientLabel: "保底",             rank: 115000, rankLabel: "约 115,000 名",  score: 527,  majors: "应用化学、制药工程",                           strategy: "位于成都，重工业底子，生化应用偏向工程落地，安全性极高。" }
      ]
    },
    {
      id: "plate-4",
      title: "第四大板块：【沿海海洋与海南自贸港】",
      feature: "产业特色：海洋资源提取、质检分析、自贸港医疗特区",
      schools: [
        { id: "26", name: "华侨大学",              group: "厦门校区213/214",   gradient: "chong", gradientLabel: "冲刺",           rank: 72103,  rankLabel: "约 72,103 名",   score: 556,  majors: "应用化学、材料科学与工程",                      strategy: "国侨办直属，材料与化工学院位于美丽的厦门校区，环境极佳。" },
        { id: "27", name: "厦门理工学院",           group: "208化学组",         gradient: "wen",   gradientLabel: "稳妥(压线)",       rank: 79271,  rankLabel: "79,271 名",       score: 551,  majors: "应用化学、新能源材料与器件",                    strategy: "录取排位与考生排位极其吻合，想去厦门发展的首选目标。" },
        { id: "28", name: "海南医科大学",           group: "203化学组",         gradient: "wen",   gradientLabel: "稳妥",             rank: 86296,  rankLabel: "86,296 名",       score: 546,  majors: "医学检验技术、药学、卫检",                      strategy: "自贸港唯一医学本科。203组不含护理，享受博鳌药械通道红利。" },
        { id: "29", name: "集美大学",              group: "217化生组",         gradient: "wen",   gradientLabel: "稳妥",             rank: 88245,  rankLabel: "88,245 名",       score: 545,  majors: "生物工程、食品质量与安全",                      strategy: "厦门集美学村百年名校，高分进入可挑选生物工程等王牌专业。" }
      ]
    },
    {
      id: "plate-5",
      title: "第五大板块：【中北部学术与国家骨干区】",
      feature: "产业特色：国家级重点实验室、百年理学基础研究、前沿合成生物",
      schools: [
        { id: "30", name: "北京工商大学",           group: "205组",            gradient: "chong", gradientLabel: "冲刺",           rank: 60388,  rankLabel: "约 60,388 名",   score: 558,  majors: "化妆品科学与技术",                             strategy: "北方日化最高地，拥有行业唯一的国家级化妆品重点实验室。" },
        { id: "31", name: "湖北大学",              group: "生化组",           gradient: "chong", gradientLabel: "冲刺",           rank: 75700,  rankLabel: "约 75,700 名",   score: 546,  majors: "合成生物学、药学",                             strategy: "合成生物学是国家级优势特色，前沿细胞工厂合成技术方向。" },
        { id: "32", name: "河南大学",              group: "双一流223组",       gradient: "wen",   gradientLabel: "稳妥(压线)",       rank: 78000,  rankLabel: "78,000 名",       score: 552,  majors: "应用化学、制药工程",                           strategy: "双一流、百年名校。学风淳朴，考研率极高，适合学术深造。" },
        { id: "33", name: "中北大学",              group: "220物理化学组",      gradient: "wen",   gradientLabel: "稳妥",             rank: 85409,  rankLabel: "85,409 名",       score: 547,  majors: "应用化学、化学工程与工艺",                      strategy: "“兵工七子”之一。军工经费充足，精细合成设备达到尖端标准。" },
        { id: "34", name: "黑龙江大学",             group: "216化学组",         gradient: "bao",   gradientLabel: "保底(高配)",       rank: 108634, rankLabel: "108,634 名",      score: 532,  majors: "化学（理学重点学科）",                          strategy: "化学是国家重点学科，全球前1%，去该校必进核心化学班。" },
        { id: "35", name: "哈尔滨理工大学",          group: "生化组",           gradient: "bao",   gradientLabel: "保底",             rank: 110000, rankLabel: "约 110,000 名",  score: 531,  majors: "应用化学、高分子材料",                          strategy: "老牌工业高校。精细高分子材料应用化学在北方工业界极具名声。" }
      ]
    },
    {
      id: "plate-6",
      title: "第六大板块：【中西部资源、制药与兜底防线】",
      feature: "产业特色：湿法冶金、天然中草药化学提取、微量放射检验",
      schools: [
        { id: "36", name: "贵州大学",              group: "211双一流",         gradient: "chong", gradientLabel: "冲刺",           rank: 71500,  rankLabel: "约 71,500 名",   score: 557,  majors: "应用化学、精细化工",                           strategy: "211双一流。其绿色农药化学、精细合成全国知名，平台高。" },
        { id: "37", name: "昆明理工大学",           group: "206化学组",         gradient: "wen",   gradientLabel: "稳妥",             rank: 94952,  rankLabel: "约 94,952 名",   score: 541,  majors: "应用化学、制药工程",                           strategy: "偏向有色金属湿法冶金及云南特有中草药活性成分化学提取。" },
        { id: "38", name: "东华理工大学",           group: "江西核化学",         gradient: "bao",   gradientLabel: "保底",             rank: 110000, rankLabel: "约 110,000 名",  score: 525,  majors: "应用化学（全球前1%）",                          strategy: "中国核工业第一校。核化学与放射性微量分析在全国独具优势。" },
        { id: "39", name: "河北科技大学",           group: "河北制药组",         gradient: "bao",   gradientLabel: "保底",             rank: 110000, rankLabel: "约 110,000 名",  score: 525,  majors: "化学工程与工艺、制药工程",                      strategy: "传统生物与化学制药强校。其合成制药在华北地区享有高声誉。" },
        { id: "40", name: "桂林理工大学",           group: "广西生化组",         gradient: "bao",   gradientLabel: "保底",             rank: 121656, rankLabel: "121,656 名",      score: 524,  majors: "应用化学（全球前1%）",                          strategy: "化学ESI全球前1%。精细化工、无机材料和地质微量元素检测底蕴深。" },
        { id: "41", name: "省内高品质本科独立学院",    group: "",                gradient: "bao",   gradientLabel: "绝对保底",         rank: 150000, rankLabel: "150,000+ 名",     score: null,  majors: "药学、化妆品技术等",                           strategy: "如珠海科技学院等省内头部独立学院，用于极端情况下锁定本科席位。" }
      ]
    }
  ],
  guide: [
    { title: '“西部黑马类”的科学运用（21-25志愿）', content: "这些学校因地缘稍偏，在广东省极易出现录取排位微降。将<strong>西安理工、西南石油、重庆理工</strong>排在冲刺后部和稳妥前部，能让您以高性价比直接斩落国家双一流、兵工强校的核心化学专业。" },
    { title: "江浙与大湾区的精妙互补（4-8、13-19志愿）", content: "偏向毕业后在大湾区就业，<strong>东莞理工（215联合学位组）</strong>、<strong>广东医科大学（医学检验）</strong>须放在最黄金的稳妥位置；若偏向长三角外企研发，<strong>南通大学（药学）</strong>和<strong>常州大学（应化）</strong>是首选。" },
    { title: '终极保底的“黄金专业”策略（33-40志愿）', content: "即便排在保底档，也必须填报最得意的生化王牌。例如：<strong>广东药科大学的【化妆品科学与技术】</strong>、<strong>东华理工的【应用化学】</strong>。即使滑落保底，依然是在行业顶尖专业里学习，为考研逆袭或直接进大厂打下扎实基础。" }
  ],
  footer: "© 2026年广东高考志愿科学填报 · 祝子琪同学落笔如神，前程似锦！"
};
