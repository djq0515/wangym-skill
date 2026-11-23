CREATE DATABASE IF NOT EXISTS wangym_zhihu DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE wangym_zhihu;

CREATE TABLE IF NOT EXISTS wangym_news (
  wangym_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '新闻ID',
  wangym_title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  wangym_source VARCHAR(100) NOT NULL COMMENT '来源媒体',
  wangym_summary VARCHAR(500) NOT NULL COMMENT '摘要',
  wangym_content TEXT NOT NULL COMMENT '正文内容',
  wangym_url VARCHAR(500) NOT NULL COMMENT '原文链接',
  wangym_views INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  wangym_publish_time DATETIME NOT NULL COMMENT '发布时间',
  PRIMARY KEY (wangym_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

CREATE TABLE IF NOT EXISTS wangym_gallery (
  wangym_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图文ID',
  wangym_title VARCHAR(200) NOT NULL COMMENT '图文标题',
  wangym_description VARCHAR(500) NOT NULL COMMENT '图文描述',
  wangym_image_url VARCHAR(500) NOT NULL COMMENT '图片地址',
  wangym_author VARCHAR(100) NOT NULL COMMENT '作者',
  wangym_likes INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  wangym_create_time DATETIME NOT NULL COMMENT '创建时间',
  PRIMARY KEY (wangym_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图文列表';

INSERT INTO wangym_news (wangym_title, wangym_source, wangym_summary, wangym_content, wangym_url, wangym_views, wangym_publish_time) VALUES
('国产大模型集体升级：千亿参数开源版本密集发布', '新华社', '本周多家国内厂商陆续开源千亿参数大模型，覆盖代码生成、多模态理解与长文本推理等场景，开源生态进入加速期。', '本周国内大模型领域迎来密集发布潮。多家厂商在三天内相继开源千亿参数级别模型，在代码生成、多模态理解和长文本推理等评测集上刷新纪录。业内人士认为，开源模型能力的快速提升将显著降低中小企业应用大模型的门槛，推动智能体应用在垂直行业落地。', 'https://www.news.cn/tech/', 12840, '2026-11-21 09:30:00'),
('鸿蒙原生应用突破十万款 生态进入规模化新阶段', '科技日报', '鸿蒙原生应用数量正式突破十万款，覆盖政务、金融、出行等重点行业，生态建设由“可用”迈向“好用”。', '据开发者大会披露，鸿蒙原生应用数量已正式突破十万款，头部应用基本完成原生适配。政务、金融、医疗、出行等重点行业的鸿蒙化改造明显提速，开发工具链和分布式能力的成熟让多设备协同体验成为差异化优势。', 'https://www.stdaily.com/', 9652, '2026-11-19 14:10:00'),
('2026世界人工智能大会开幕 具身智能成最大焦点', '中国新闻网', '本届大会集中展示人形机器人、智能体与行业大模型应用，具身智能从实验室走向真实生产场景。', '2026世界人工智能大会今日开幕，展会现场人形机器人和具身智能设备成为最大焦点。多家企业展示了在汽车总装、仓储物流、家庭服务等场景的落地案例，行业普遍认为具身智能正处在从技术验证走向规模商用的关键节点。', 'https://www.chinanews.com.cn/', 15320, '2026-11-18 10:05:00'),
('国产7nm车规级芯片量产上车 智能驾驶硬件成本再下探', 'IT之家', '新一代国产7nm车规级智能驾驶芯片实现量产装车，算力提升的同时成本下降约三成，推动高阶智驾向中端车型普及。', '国产7nm车规级智能驾驶芯片本周宣布量产装车，单芯片算力较上一代提升明显，整体硬件成本下降约三成。多家车企表示将在明年上市的中端车型中标配高阶辅助驾驶功能，智能驾驶的普及速度有望进一步加快。', 'https://www.ithome.com/', 8764, '2026-11-16 16:42:00'),
('量子计算新突破：新型纠错码将逻辑量子比特寿命提升十倍', '中国科学报', '研究团队提出新型量子纠错方案，在超导量子平台上将逻辑量子比特寿命提升约十倍，为实用化量子计算奠定基础。', '国内研究团队在超导量子计算平台上验证了一种新型量子纠错码方案，将逻辑量子比特的相干寿命提升约十倍，同时降低了纠错所需的物理比特开销。该成果被认为是迈向容错量子计算的重要一步。', 'https://www.sciencenet.cn/', 5431, '2026-11-14 11:20:00'),
('6G研发进入关键窗口期 太赫兹通信完成外场试验', '芯智讯', '6G关键技术研发取得阶段性进展，太赫兹频段通信完成外场试验，峰值速率与低时延指标达到预期。', '6G技术研发进入关键窗口期，太赫兹通信外场试验近日完成，峰值传输速率和端到端时延指标均达到预期目标。产业界预计6G将在2030年前后进入商用阶段，通感一体、空天地一体网络成为主要演进方向。', 'https://www.icsmart.cn/', 6890, '2026-11-12 09:00:00'),
('AI编程助手渗透率超六成 开发者工作流被重塑', '36氪', '调查显示超过六成开发者日常使用AI编程助手，代码补全、单元测试与代码评审成为最常用的三类场景。', '最新开发者调查显示，AI编程助手的日常渗透率已超过六成。代码补全、单元测试生成和代码评审是最常用的三类场景。开发者普遍表示，AI工具显著缩短了重复性编码时间，但对系统设计和架构判断能力的要求反而更高。', 'https://36kr.com/', 11209, '2026-11-09 18:30:00'),
('固态电池中试线投产 单次充电续航突破1000公里', '第一财经', '国内首条车规级固态电池中试线正式投产，搭载样车单次充电续航突破1000公里，量产时间表同步公布。', '国内首条车规级固态电池中试线正式投产，首批样品完成装车测试，单次充电续航突破1000公里。企业同时公布了量产时间表，预计明年启动小批量交付。固态电池在能量密度和安全性上的优势有望缓解用户的里程焦虑。', 'https://www.yicai.com/', 7412, '2026-11-06 15:15:00');

INSERT INTO wangym_gallery (wangym_title, wangym_description, wangym_image_url, wangym_author, wangym_likes, wangym_create_time) VALUES
('未来城市天际线', '玻璃幕墙与霓虹灯光交织，勾勒出科技感十足的城市轮廓。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20city%20skyline%20at%20dusk%2C%20neon%20lights%2C%20glass%20towers%2C%20cinematic%20photography&image_size=landscape_4_3', '林晓', 328, '2026-11-20 20:15:00'),
('人工智能实验室', '蓝色灯带下的服务器阵列，是模型训练日夜不息的心跳。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20AI%20research%20laboratory%2C%20scientists%2C%20glowing%20server%20racks%2C%20blue%20light&image_size=landscape_4_3', '陈默', 286, '2026-11-18 10:40:00'),
('量子芯片特写', '金色电路在暗色背景中延展，量子比特在此完成计算。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20computer%20chip%20macro%20shot%2C%20golden%20circuits%2C%20dark%20background%2C%20high%20detail&image_size=landscape_4_3', '苏芮', 401, '2026-11-16 09:20:00'),
('智慧出行', '自动驾驶电动车行驶在智能高速上，晚霞铺满天际。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=autonomous%20electric%20car%20on%20smart%20highway%2C%20futuristic%20city%2C%20sunset%2C%20cinematic&image_size=landscape_4_3', '周远', 512, '2026-11-14 17:55:00'),
('太空探索', '火箭穿过云层奔向星空，人类的目光从未停止向远方延伸。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rocket%20launch%20into%20starry%20sky%2C%20space%20exploration%2C%20dramatic%20clouds%2C%20epic&image_size=landscape_4_3', '何清', 368, '2026-11-12 21:30:00'),
('绿色能源农场', '风机与光伏板在田野间铺展，构成一张清洁能源网络。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wind%20turbines%20and%20solar%20panels%20green%20energy%20farm%2C%20aerial%20view%2C%20sunny&image_size=landscape_4_3', '顾言', 245, '2026-11-10 08:45:00'),
('医疗机器人', '机械臂在洁净手术室中精准操作，科技守护每一次心跳。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20robot%20arm%20in%20modern%20hospital%2C%20clean%20white%20room%2C%20soft%20light&image_size=landscape_4_3', '沈舟', 199, '2026-11-08 13:10:00'),
('低空经济', '无人机出租车掠过城市夜空，低空航线正在被重新定义。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=drone%20taxi%20flying%20over%20city%20at%20night%2C%20low%20altitude%20economy%2C%20neon%20lights&image_size=landscape_4_3', '唐糖', 433, '2026-11-05 19:25:00');
