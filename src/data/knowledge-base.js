import { CAMERAS } from './all-cameras.js';
import { FILM_LIBRARY_ROWS } from './film-library.js';

// 资料层：规格优先引用厂商博物馆/原厂手册，历史与别名用长期维护的相机资料页交叉确认；
// 价格仍沿用真实价格版资料表，并在购买时通过平台复核入口抽样，不把动态商品页伪装成固定报价。
const SOURCE_BY_NAME = {
  'Canon AE-1': [
    { label: 'Canon 历史资料（AE-1 / A-1 系列）', url: 'https://global.canon/en/c-museum/history/story06.html', tier: '厂商资料' },
    { label: 'Canon AE-1 规格资料', url: 'https://en.wikipedia.org/wiki/Canon_AE-1', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.cameraworth.com/c/canon/ae-1/', tier: '行情参考' },
  ],
  'Canon AE-1 Program': [
    { label: 'Canon A 系列历史资料', url: 'https://global.canon/en/c-museum/history/story06.html', tier: '厂商资料' },
    { label: 'AE-1 系列规格资料', url: 'https://en.wikipedia.org/wiki/Canon_AE-1', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/canon', tier: '行情参考' },
  ],
  'Canon A-1': [
    { label: 'Canon Camera Museum：A-1', url: 'https://global.canon/en/c-museum/product/film100.html', tier: '厂商资料' },
    { label: 'Canon A 系列历史资料', url: 'https://global.canon/en/c-museum/history/story06.html', tier: '厂商资料' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/canon', tier: '行情参考' },
  ],
  'Canon EOS 650': [
    { label: 'Canon EOS 650 规格资料', url: 'https://en.wikipedia.org/wiki/Canon_EOS_650', tier: '资料交叉核对' },
    { label: 'Canon EOS / EF 卡口历史', url: 'https://global.canon/en/c-museum/history/story07.html', tier: '厂商资料' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/canon', tier: '行情参考' },
  ],
  'Canon EOS 30V': [
    { label: 'Canon EOS 30 规格资料', url: 'https://en.wikipedia.org/wiki/Canon_EOS_30', tier: '资料交叉核对' },
    { label: 'Canon EOS / EF 卡口历史', url: 'https://global.canon/en/c-museum/history/story07.html', tier: '厂商资料' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/canon', tier: '行情参考' },
  ],
  'Nikon FM2/FM2n': [
    { label: 'Nikon FM2 原厂说明书', url: 'https://www.nikonusa.com/pdf/manuals/archive/FM2.pdf', tier: '原厂手册' },
    { label: 'Nikon FM2 规格资料', url: 'https://en.wikipedia.org/wiki/Nikon_FM2', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://tw.bid.yahoo.com/search/auction/product?p=nikon+fm2', tier: '行情参考' },
  ],
  'Nikon FE2': [
    { label: 'Nikon F 系列兼容资料', url: 'https://www.nikonimgsupport.com/na/NSG_article?articleNo=000048212&configured=1&lang=en_SG&sfdcIFrameOrigin=null', tier: '厂商资料' },
    { label: 'Nikon FE2 规格资料', url: 'https://en.wikipedia.org/wiki/Nikon_FE2', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/nikon', tier: '行情参考' },
  ],
  'Nikon F3': [
    { label: 'Nikon F3 发布与规格历史', url: 'https://imaging.nikon.com/history/chronicle/history-f3/', tier: '厂商资料' },
    { label: 'Nikon F3 规格资料', url: 'https://en.wikipedia.org/wiki/Nikon_F3', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/nikon', tier: '行情参考' },
  ],
  'Nikon F100': [
    { label: 'Nikon F100 官方规格', url: 'https://nij.nikon.com/products/lineup/slr/f100/spec.html', tier: '厂商资料' },
    { label: 'Nikon F100 原厂说明书', url: 'https://nij.nikon.com/cms/support/manual/slr/F100_Jp_13.pdf', tier: '原厂手册' },
    { label: '公开行情参考', url: 'https://www.cameraworth.com/n/nikon/f100/', tier: '行情参考' },
  ],
  'Nikon F80/N80': [
    { label: 'Nikon F80 规格资料', url: 'https://en.wikipedia.org/wiki/Nikon_F80', tier: '资料交叉核对' },
    { label: 'Nikon SLR 兼容资料', url: 'https://www.nikonusa.com/fileuploads/pdfs/EP_CompChart.pdf', tier: '厂商资料' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/nikon', tier: '行情参考' },
  ],
  'Pentax K1000': [
    { label: 'Pentax K1000 资料与规格', url: 'https://www.pentaxforums.com/camerareviews/pentax-k1000.html', tier: '资料交叉核对' },
    { label: 'Pentax K1000 使用定位参考', url: 'https://www.techradar.com/best/best-film-cameras', tier: '使用参考' },
    { label: '公开行情参考', url: 'https://www.cameraworth.com/a/asahi-pentax/pentax-k1000/', tier: '行情参考' },
  ],
  'Pentax MX': [
    { label: 'Pentax MX 评测与规格', url: 'https://lensandshutter.com/reviews/pentax-mx-review/', tier: '资料交叉核对' },
    { label: 'Pentax K 卡口资料', url: 'https://www.pentaxforums.com/camerareviews/pentax-k1000.html', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/pentax', tier: '行情参考' },
  ],
  'Pentax ME Super': [
    { label: 'Pentax ME Super 规格资料', url: 'https://en.wikipedia.org/wiki/Pentax_ME_Super', tier: '资料交叉核对' },
    { label: 'Pentax ME Super 使用定位', url: 'https://www.digitalcameraworld.com/buying-guides/best-film-cameras', tier: '使用参考' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/pentax', tier: '行情参考' },
  ],
  'Pentax MZ-5/ZX-5': [
    { label: 'Pentax MZ-5 / ZX-5 资料', url: 'https://www.pentaxforums.com/camerareviews/pentax-mz-5-zx-5.html', tier: '资料交叉核对' },
    { label: 'Pentax 相机说明书索引', url: 'https://www.pentax-manuals.com/manuals/compacts/compacts.htm', tier: '原厂手册索引' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/pentax', tier: '行情参考' },
  ],
  'Olympus OM-1': [
    { label: 'Olympus OM 系列资料', url: 'https://camera-wiki.org/wiki/Olympus_OM-1/2/3/4', tier: '资料交叉核对' },
    { label: 'Olympus OM 系统资料', url: 'https://camera-wiki.org/wiki/Olympus_OM_system', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.dcfever.com/cameras/secondhand.php?id=2419', tier: '行情参考' },
  ],
  'Olympus OM-2/OM-2n': [
    { label: 'Olympus OM-2 规格资料', url: 'https://en.wikipedia.org/wiki/Olympus_OM-2', tier: '资料交叉核对' },
    { label: 'Olympus OM 系列资料', url: 'https://camera-wiki.org/wiki/Olympus_OM-1/2/3/4', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/olympus', tier: '行情参考' },
  ],
  'Olympus OM-10': [
    { label: 'Olympus OM-10 规格资料', url: 'https://en.wikipedia.org/wiki/Olympus_OM-10', tier: '资料交叉核对' },
    { label: 'Olympus OM 系统资料', url: 'https://camera-wiki.org/wiki/Olympus_OM_system', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.usedlens.co.uk/guides/cameras/olympus', tier: '行情参考' },
  ],
  'Olympus μ[mju:]-II（U2 / Stylus Epic）': [
    { label: 'Olympus μ[mju:]-II 官方新闻资料', url: 'https://www.olympus.co.jp/jp/news/1997a/nr970218mju2spj.html', tier: '厂商资料' },
    { label: 'Olympus μ[mju:]-II 公开行情参考', url: 'https://www.cameraworth.com/o/olympus/mju-ii/', tier: '行情参考' },
    { label: 'Olympus 35mm 相机资料索引', url: 'https://camera-wiki.org/wiki/olympus', tier: '资料交叉核对' },
  ],
  'Minolta X-700': [
    { label: 'Minolta X-700 规格资料', url: 'https://en.wikipedia.org/wiki/Minolta_X-700', tier: '资料交叉核对' },
    { label: 'Minolta X-700 公开行情参考', url: 'https://www.cameraworth.com/m/minolta/x-700/', tier: '行情参考' },
    { label: 'Minolta MD 镜头系统参考', url: 'https://www.usedlens.co.uk/guides/cameras/minolta', tier: '行情参考' },
  ],
  'Yashica Electro 35 GSN/GTN': [
    { label: 'Yashica Electro 35 资料', url: 'https://camera-wiki.org/wiki/Yashica_Electro_35', tier: '资料交叉核对' },
    { label: 'Yashica Electro 35 规格资料', url: 'https://en.wikipedia.org/wiki/Yashica_Electro_35', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://camera-wiki.org/wiki/Yashica_Electro_35', tier: '行情参考' },
  ],
  'Canon Autoboy大魔王（New Autoboy / Caption Zoom）': [
    { label: 'Canon Camera Museum：Autoboy 系列', url: 'https://global.canon/en/c-museum/product/film135.html', tier: '厂商资料' },
    { label: 'Canon Autoboy 系列历史', url: 'https://global.canon/en/c-museum/history/story06.html', tier: '厂商资料' },
    { label: '公开行情参考', url: 'https://tw.bid.yahoo.com/search/auction/product?cid=2092077887&clv=1&p=%E5%A4%A7%E9%AD%94%E7%8E%8B', tier: '行情参考' },
  ],
  'Canon Autoboy ZOOM Super': [
    { label: 'Canon Camera Museum：Autoboy ZOOM Super', url: 'https://global.canon/zh/c-museum/product/film134.html', tier: '厂商资料' },
    { label: 'Canon Autoboy ZOOM Super 资料', url: 'https://camera-wiki.org/wiki/Canon_Sure_Shot_Zoom_XL/Prima_Zoom_F/Autoboy_Zoom_Super', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://natural-camera.com/products/13507', tier: '行情参考' },
  ],
  'Canon Autoboy AF35M II（Autoboy系列代表）': [
    { label: 'Canon Camera Museum：AF35M II', url: 'https://global.canon/zh/c-museum/product/film110.html', tier: '厂商资料' },
    { label: 'Canon AF35M 资料', url: 'https://en.wikipedia.org/wiki/Canon_AF35M', tier: '资料交叉核对' },
    { label: 'AF35M II 原厂说明书', url: 'https://www.cameramanuals.org/canon_pdf/canon_af_35m_ii.pdf', tier: '原厂手册' },
  ],
  'Pentax Espio 135M': [
    { label: 'Ricoh / Pentax 说明书索引', url: 'https://www.ricoh-imaging.co.jp/japan/support/download/manual/others.html', tier: '原厂手册索引' },
    { label: 'Pentax Espio 135M 资料', url: 'https://www.newwavepool.ca/products/pentax-espio-135m-compact-35mm-film-camera-serial-4528755', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://kakaku.com/item/10205510143/', tier: '行情参考' },
  ],
  'Minolta Capios 160A': [
    { label: 'Minolta Capios 160A 资料', url: 'https://kaerushashinki.co.jp/museum/?p=1118', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://filmphotography.eu/kamera/minolta-capios-160a/', tier: '行情参考' },
  ],
  'Fujifilm Cardia Mini Tiara（28mm固定版）': [
    { label: 'Fujifilm Cardia Mini / Tiara 资料', url: 'https://www.awane-camera.com/3/4/fuji_cardia-mini-everyday-op/index.htm', tier: '资料交叉核对' },
    { label: 'Fujifilm Cardia Mini Tiara 公开样本', url: 'https://root-camera.com/shop_view/7489', tier: '行情参考' },
    { label: 'Fujifilm Tiara 公开行情索引', url: 'https://www.cameraworth.com/f/fujifilm/fuji-dl-super-mini-fujifilm-cardia-mini-tiara-fujifilm-tiara/', tier: '行情参考' },
  ],
  'Minolta Riva Zoom 75W（Capios 75W）': [
    { label: 'Minolta Riva Zoom 75w 资料', url: 'https://camera-wiki.org/wiki/Minolta_Riva_Zoom_75w', tier: '资料交叉核对' },
    { label: 'Minolta Riva Zoom 75w 说明书', url: 'https://manualmachine.com/minolta/rivazoom75w/7123244-user-manual/', tier: '原厂手册' },
    { label: '公开行情参考', url: 'https://kamerastore.com/en-us/products/minolta-riva-zoom-75w', tier: '行情参考' },
  ],
  'Canon Sure Shot WP-1（Canon WP-1）': [
    { label: 'Canon Sure Shot WP-1 资料', url: 'https://vintagecameralab.com/canon-sure-shot-wp-1/', tier: '资料交叉核对' },
    { label: 'Canon WP-1 图像与型号核对', url: 'https://commons.wikimedia.org/wiki/File:Canon_Sure_Shot_WP-1.jpg', tier: '型号核对' },
    { label: '公开行情参考', url: 'https://www.ebay.com/sch/i.html?_nkw=Canon+Sure+Shot+WP-1', tier: '行情参考' },
  ],
  'Pentax Zoom 105-R': [
    { label: 'Pentax Zoom 105-R 使用说明书', url: 'https://manualzz.com/doc/3014078/pentax-zoom-105-r-date-camera-operating-manual', tier: '原厂手册' },
    { label: 'Pentax 相机说明书索引', url: 'https://www.pentax-manuals.com/manuals/compacts/compacts.htm', tier: '原厂手册索引' },
    { label: '公开行情参考', url: 'https://www.isofilmshop.com/product/pentax-zoom-105-r/', tier: '行情参考' },
  ],
  'Nikon One Touch Zoom 90S': [
    { label: 'Nikon One Touch Zoom 90S 说明书', url: 'https://manualsplanet.com/manualPdf/nikon-one-touch-zoom-90.pdf', tier: '原厂手册' },
    { label: 'Nikon One Touch Zoom 90S 规格索引', url: 'https://manualzz.com/doc/44881628/nikon-792101-point-and-shoot-film-camera-specification-sheet', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.ebay.com/sch/i.html?_nkw=Nikon+One+Touch+Zoom+90s', tier: '行情参考' },
  ],
  'Minolta Panorama Zoom 5': [
    { label: 'Minolta Panorama Zoom 5 资料', url: 'https://www.lomography.com/cameras/3369233-minolta-panorama-zoom-5/photos', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://cameranonaniwa.jp/shop/g/g2221070511700/', tier: '行情参考' },
  ],
  'Fujifilm DL-290 / Discovery 290 Zoom': [
    { label: 'Fujifilm Discovery 290 说明书', url: 'https://www.butkus.org/chinon/fujica/fujifilm_discovery_290/discovery_290-splash.htm', tier: '原厂手册' },
    { label: 'Fujifilm DL-290 资料', url: 'https://camera-wiki.org/wiki/Fujifilm_DL-290_Zoom', tier: '资料交叉核对' },
    { label: '公开行情参考', url: 'https://www.ebay.com/sch/i.html?_nkw=Fujifilm+DL-290+film+camera', tier: '行情参考' },
  ],
  'Olympus Trip AF31': [
    { label: 'Olympus Trip AF31 资料', url: 'https://camera-wiki.org/wiki/Olympus_Trip_AF_31', tier: '资料交叉核对' },
    { label: 'Olympus Trip AF31 公开样本', url: 'https://www.analogcamerad.com/shop/olympus-trip-af-31/', tier: '行情参考' },
    { label: '公开行情参考', url: 'https://www.ebay.com/p/1625550628', tier: '行情参考' },
  ],
  'Canon Prima Super 115（Autoboy S / Sure Shot Z115）': [
    { label: 'Canon Camera Museum：Prima / Sure Shot 系列', url: 'https://global.canon/zh/c-museum/product/film163.html', tier: '厂商资料' },
    { label: 'Canon Camera Museum：Prima Zoom 115', url: 'https://global.canon/zh/c-museum/product/film238.html', tier: '厂商资料' },
    { label: '公开行情参考', url: 'https://www.fnac.com/Appareil-photo-argentique-Canon-Prima-Super-115-Gris-Reconditionne/a17466323/w-4', tier: '行情参考' },
  ],
  'Ricoh Myport Zoom RZ-800D（用户写作2Z800）': [
    { label: 'Ricoh 官方胶片相机型号表', url: 'https://www.ricoh-imaging.co.jp/japan/products/ricoh-filmcamera/cameralist/MP-zoom.html', tier: '厂商资料' },
    { label: 'Ricoh RZ-800 公开样本', url: 'https://kamerastore.com/en-us/products/ricoh-rz-800', tier: '行情参考' },
    { label: 'Ricoh RZ-800 公开样本', url: 'https://bromurefilm.com/en/products/ricoh-rz-800', tier: '行情参考' },
  ],
};

const source = (label, url, tier = '参考资料') => ({ label, url, tier });

const familyOf = (camera) => {
  if (camera.autoFocus && camera.lens.includes('卡口')) return '自动对焦单反';
  if (!camera.autoFocus && camera.lens.includes('卡口')) return camera.autoExposure ? '半自动单反' : '机械手动单反';
  if (!camera.autoFocus && !camera.lens.includes('卡口')) return '旁轴 / 定焦';
  return '全自动便携机';
};

const aliasOf = (name) => {
  const match = name.match(/[（(](.*?)[）)]/);
  return match ? match[1].split(/\s*[/／]\s*/).filter(Boolean) : [];
};

const checksOf = (camera) => {
  const checks = camera.autoFocus
    ? ['开机、自动对焦与半按快门', '闪光灯、变焦/伸缩与电动过片', '电池仓、LCD 与回卷']
    : ['各档快门、过片与回卷', '测光指示和电池仓触点', '海绵、反光镜缓冲与漏光'];
  if (camera.lens.includes('卡口')) checks.push('镜头卡口、霉斑、雾化与划痕');
  if (camera.lens.includes('变焦')) checks.push('变焦马达是否顺畅、是否卡顿');
  if (camera.lens.includes('防水')) checks.push('密封圈与进水风险；未重新密封不下水');
  return [...new Set(checks)].slice(0, 5);
};

const focusTagsOf = (camera) => camera.scenes.filter((scene) => scene.length <= 10).slice(0, 3);

export const CAMERA_KNOWLEDGE = CAMERAS.map((camera) => {
  const links = SOURCE_BY_NAME[camera.name] || SOURCE_BY_NAME[camera.originalName] || [source('FilmMatch 原始资料表', '#')];
  const aliases = aliasOf(camera.name);
  const family = familyOf(camera);
  const searchKeywords = [camera.name, `${camera.brand} 胶片相机`, ...aliases, ...camera.scenes.slice(0, 2)];
  return {
    name: camera.name,
    brand: camera.brand,
    family,
    aliases,
    summary: camera.recommendation,
    tags: focusTagsOf(camera),
    searchKeywords,
    checks: checksOf(camera),
    riskLevel: camera.repairLevel <= 2 ? '相对可控' : camera.repairLevel === 3 ? '需要验机' : '高风险老电子',
    knowledgeNote: camera.autoFocus
      ? '电子、马达、闪光和电池触点是老便携机/自动机的核心验机项；外观好看不等于功能完整。'
      : camera.autoExposure
        ? '电子快门或测光通常依赖电池；建议带已知正常电池，逐档测试并核对测光反应。'
        : '机械控制比例更高，但仍要检查快门准确性、测光、海绵与镜头状态，不能只凭“机械”二字判断可靠性。',
    dataLineage: `FilmMatch ${CAMERAS.length} 台真实价格版资料表；规格、别名与使用建议按网页资料交叉核对，价格按平台实时复核。`,
    sources: links,
    lastReviewed: '2026-07-28',
  };
});

export const CAMERA_KNOWLEDGE_BY_NAME = new Map(CAMERA_KNOWLEDGE.map((item) => [item.name, item]));

export const KNOWLEDGE_ARTICLES = [
  {
    id: 'exposure-triangle',
    eyebrow: '入门基础',
    title: '先分清：胶卷 ISO、光圈、快门各管什么',
    summary: 'ISO 是胶卷对光的敏感度，光圈决定进光量与景深，快门决定进光时间与运动凝固。相机的自动曝光只是帮你组合参数，不会替你判断胶卷是否装对。',
    items: ['白天街拍：ISO 400 是更稳妥的起点；强光下 ISO 100/200 更容易获得较大光圈空间。', '夜景和室内：先确认测光、电池与闪光是否工作；不要用“机身贵”替代曝光判断。', '胶卷拍完后仍需冲洗和扫描，第一次体验成本应把胶卷、冲扫、电池与可能的密封更换算进去。'],
    sources: [
      source('Canon A-1 官方测光与 ISO 资料', 'https://global.canon/en/c-museum/product/film100.html', '厂商资料'),
      source('Nikon F100 官方规格', 'https://nij.nikon.com/products/lineup/slr/f100/spec.html', '厂商资料'),
    ],
  },
  {
    id: 'camera-families',
    eyebrow: '选型框架',
    title: '单反、旁轴、便携机：先选交互方式，再选型号',
    summary: '单反更适合学习镜头与曝光控制；旁轴/定焦机强调取景与镜头性格；全自动便携机把操作压到最低，但电子、马达、闪光和滑盖故障更难维修。',
    items: ['想认真学习曝光：优先看机械手动或半自动单反，再按镜头卡口和维护风险筛选。', '想轻装随手拍：便携机重点看重量、焦段、闪光和电池状态，不要只按热门程度买。', '想拍水边/雨天：防水机也必须核对密封状态；老化密封圈不能由外观直接推断安全。'],
    sources: [
      source('Nikon FM2 原厂说明书', 'https://www.nikonusa.com/pdf/manuals/archive/FM2.pdf', '原厂手册'),
      source('Canon AF35M 官方资料', 'https://global.canon/en/c-museum/product/film102.html', '厂商资料'),
      source('Olympus OM 系统资料', 'https://camera-wiki.org/wiki/Olympus_OM_system', '资料交叉核对'),
    ],
  },
  {
    id: 'used-camera-check',
    eyebrow: '二手验机',
    title: '买之前先做 5 分钟检查',
    summary: '旧胶片机最怕“看起来很新但没有测试”。带一套已知正常的电池，先检查快门/过片，再看测光、镜头、密封和电池仓，最后询问是否有测试卷或退换条件。',
    items: ['机械单反：逐档拨动快门并从后背观察帘幕动作；检查过片、回卷、反光镜和测光。', '自动/便携机：测试开机、AF、变焦、闪光、过片、回卷、LCD、镜头盖和电池触点。', '镜头：看霉、雾、划痕、镀膜损伤；机身：看漏光、海绵、腐蚀、磕碰和改装痕迹。'],
    sources: [
      source('二手胶片机检查清单', 'https://www.kubusphoto.com/blog/how-to-test-used-film-camera', '验机参考'),
      source('PetaPixel 二手胶片机购买提示', 'https://petapixel.com/2018/12/17/5-tips-for-buying-your-first-used-film-camera/', '验机参考'),
    ],
  },
  {
    id: 'market-and-cost',
    eyebrow: '预算决策',
    title: '价格区间不是成交保证，完整成本才是预算',
    summary: 'FilmMatch 的价格是常见可用机/套机的人民币二手市场参考区间；它排除了故障机、未测试机、收藏级和明显低价引流盘，但成色、镜头、整备与渠道仍会改变最终价格。',
    items: ['先比较价格下限是否在预算容差内，再看中位参考和维护风险。', '镜头、清洁、密封、电池、胶卷、冲扫可能比机身差价更影响第一次体验。', '页面里的行情入口是复核入口，不是库存或固定商品链接；交易前要以当日已测试样本为准。'],
    sources: [
      source(`FilmMatch ${CAMERAS.length} 台真实资料口径`, '#knowledge-method', '项目资料'),
      source('Canon Camera Museum 历史与规格索引', 'https://global.canon/en/c-museum/index.html', '厂商资料'),
    ],
  },
  {
    id: 'ae-af-boundaries',
    eyebrow: '曝光与对焦',
    title: '半自动不等于全自动：先弄懂 AE / AF 各自管什么',
    summary: 'AE 解决“相机如何给出曝光组合”，AF 解决“相机如何找焦点”；两者可以同时存在，也可以分别关闭。买二手机时要按机身真实模式核对，不要只看“自动”两个字。',
    items: ['光圈优先通常由相机选择快门速度；快门优先通常由相机选择光圈，超出范围时要看取景器提示。', '自动对焦也需要半按快门锁定、重新构图和检查最近对焦距离；低反差、逆光或夜景更容易误判。', '电子快门、测光和自动对焦都可能依赖电池；带一颗新电池只能验证通电，不能代替逐项功能测试。'],
    sources: [
      source('Nikon F100 官方规格', 'https://nij.nikon.com/products/lineup/slr/f100/spec.html', '厂商资料'),
      source('Canon EOS 30 资料', 'https://en.wikipedia.org/wiki/Canon_EOS_30', '资料交叉核对'),
    ],
  },
  {
    id: 'test-roll-workflow',
    eyebrow: '实机测试',
    title: '从通电到测试卷：一台二手胶片机的 12 个动作',
    summary: '“快门能响”只证明了很少一部分。完整判断应覆盖曝光、对焦、过片、回卷、闪光和漏光；高风险电子便携机尤其要问清退换或测试卷条件。',
    items: ['先看电池仓：白色/绿色腐蚀、漏液痕迹和触点松动都要拍照记录，不能只擦干净就当作无事。', '不装胶卷先测试快门、过片和回卷；装测试卷后确认计数器变化、卷片轴咬合、回卷阻力与取片方向。', '对便携机逐项测试镜头盖、变焦、AF 辅助灯、内闪、自拍、日期、电机声音；必要时拍一卷再判断曝光均匀性。'],
    sources: [
      source('二手胶片机检查清单', 'https://www.kubusphoto.com/blog/how-to-test-used-film-camera', '验机参考'),
      source('PetaPixel 二手胶片机购买提示', 'https://petapixel.com/2018/12/17/5-tips-for-buying-your-first-used-film-camera/', '验机参考'),
      source('Butkus 相机说明书资料库', 'https://www.butkus.org/chinon/', '原厂手册索引'),
    ],
  },
  {
    id: 'mount-compatibility',
    eyebrow: '镜头与卡口',
    title: '卡口兼容先查清：FD、EF、F、K、OM、MD 不是一回事',
    summary: '可换镜头机身的价格只是入口，卡口决定镜头范围、测光耦合和后续成本。外观相似的镜头不能因为“能装上”就默认可以正常测光或自动对焦。',
    items: ['Canon FD 与 EOS EF 是两套系统；AE-1/A-1 这类 FD 机身和 EOS 650/30V 这类 EF 机身，镜头采购逻辑完全不同。', 'Nikon F 卡口内部还要核对 AI/AI-S、非 AI、AF-D 等版本；Pentax K、Minolta MD、Olympus OM 也应按机身测光方式搭配。', '买镜头时同时确认光圈环、卡口锁定、无限远、霉雾划痕和叶片油污；只看焦段和最大光圈不够。'],
    sources: [
      source('Canon EOS / EF 卡口历史资料', 'https://global.canon/en/c-museum/history/story07.html', '厂商资料'),
      source('Nikon SLR 兼容资料', 'https://www.nikonusa.com/fileuploads/pdfs/EP_CompChart.pdf', '厂商资料'),
      source('Minolta MD 镜头资料', 'https://www.mir.com.my/rb/photography/companies/Minolta/35mm/slrstandard/lenses/index.htm', '资料交叉核对'),
    ],
  },
  {
    id: 'compact-hidden-costs',
    eyebrow: '便携机风险',
    title: '便携机为什么不能只看外观：四类隐藏故障',
    summary: '固定镜头便携机上手门槛低，但镜头盖、变焦马达、闪光电路、LCD 和电池触点往往集成在一个小机身里，坏了通常比机械单反更难维修。',
    items: ['定焦机要看镜头盖是否完整打开、镜片是否起雾；变焦机要从广角到长焦反复走一遍，听是否卡顿或异响。', '防水机的密封圈会随年份硬化；没有近期更换或压力测试记录时，不应把“防水型号”当成可直接下水。', '热门小机的成交价可能包含外观溢价；优先买有测试记录、退换条件和可追溯照片的样本，通常比追求最低价更省钱。'],
    sources: [
      source('Canon Sure Shot WP-1 型号资料', 'https://vintagecameralab.com/canon-sure-shot-wp-1/', '资料交叉核对'),
      source('Ricoh 胶片相机型号索引', 'https://www.ricoh-imaging.co.jp/japan/products/ricoh-filmcamera/cameralist/MP-zoom.html', '厂商资料'),
      source('Camera-wiki 相机资料库', 'https://camera-wiki.org/', '资料交叉核对'),
    ],
  },
];

// 胶卷百科：用于“知识分享”，回答胶卷本身是什么、在什么光线下表现如何；
// 选卷指南单独维护决策路径，避免把科普内容伪装成个性化推荐。
export const FILM_ENCYCLOPEDIA = [
  {
    id: 'kodak-gold-200',
    eyebrow: '彩色负片 · 日光卷',
    title: 'Kodak Gold 200：暖色、宽容度与日常记录',
    type: '彩色负片',
    iso: 'ISO 200',
    summary: 'Gold 200 是日光平衡的 ISO 200 彩色负片，适合把一卷胶卷用在街头、旅行和家庭记录等多种日常场景。',
    facts: ['日光平衡；阴天或室内混合光下，颜色可能更暖。', '颗粒细、色彩饱和度较高，官方资料给出的曝光宽容度约为欠曝 2 档、过曝 3 档。', '强光下更容易配合大光圈镜头；室内拍摄仍应先判断光线是否足够。'],
    sources: [source('Kodak Gold 200 官方资料', 'https://www.kodak.com/en/still-film/product/consumer/gold-200-film/', '厂商资料')],
  },
  {
    id: 'kodak-ultramax-400',
    eyebrow: '彩色负片 · 通用卷',
    title: 'Kodak UltraMAX 400：把光线余量留给现场',
    type: '彩色负片',
    iso: 'ISO 400',
    summary: 'UltraMAX 400 是日光平衡的 ISO 400 彩色负片，相比 ISO 200 更适合光线变化明显、需要手持或想保留快门速度的场景。',
    facts: ['ISO 400 能在同样光线下使用更快的快门或更小的光圈。', '官方定位覆盖低光、动作和闪光灯使用；但“ISO 400”不等于夜景可以不测光。', '室内混合光、霓虹灯和钨丝灯会改变色彩，想要稳定肤色要先控制光源或选择相应胶卷。'],
    sources: [source('Kodak UltraMAX 400 官方资料', 'https://www.kodak.com/en/still-film/product/consumer/ultramax-400-film/', '厂商资料')],
  },
  {
    id: 'kodak-ektar-100',
    eyebrow: '彩色负片 · 细颗粒',
    title: 'Kodak Ektar 100：高光线下的细节与饱和度',
    type: '彩色负片',
    iso: 'ISO 100',
    summary: 'Ektar 100 是日光平衡的专业彩色负片，特点是细颗粒、高锐度和更鲜明的色彩，适合风光、旅行和产品细节。',
    facts: ['ISO 100 需要更多光线，阴天、室内或高速运动时要确认快门是否足够。', '官方资料将其定位在自然、旅行、户外和产品摄影；它更适合有意识地控制光线和构图。', '高饱和度不等于所有肤色都更自然，人像使用前应结合现场光线和冲扫风格判断。'],
    sources: [source('Kodak Ektar 100 官方资料', 'https://www.kodak.com/en/still-film/product/professional/ektar-100-film/', '厂商资料')],
  },
  {
    id: 'kodak-portra-400',
    eyebrow: '彩色负片 · 人像',
    title: 'Kodak Portra 400：为什么常被放进人像与自然光讨论',
    type: '彩色负片',
    iso: 'ISO 400',
    summary: 'Portra 400 是面向专业彩色负片工作流的 ISO 400 胶卷，重点在自然肤色、细颗粒和自然光下的可用性；最终观感还取决于曝光与扫描。',
    facts: ['400 速让它在自然光、人像和旅行记录中更容易保留安全快门。', '官方产品手册强调自然肤色、细颗粒与宽容的工作方式；不要把“宽容”理解成可以忽略测光。', '同一卷在不同冲扫店、扫描仪和色彩校正下会出现明显差异，比较样片时要记录扫描条件。'],
    sources: [source('Kodak Portra 官方产品手册', 'https://www.kodak.com/global/plugins/acrobat/en/professional/products/films/portra/portraBrochure11x17.pdf', '厂商资料')],
  },
  {
    id: 'fujifilm-400',
    eyebrow: '彩色负片 · 宽容度',
    title: 'Fujifilm 400：自然色彩与更稳的日常余量',
    type: '彩色负片',
    iso: 'ISO 400',
    summary: 'Fujifilm 400 是 ISO 400 彩色负片，官方资料强调高感光度、较宽曝光范围、自然色彩和肤色表现，适合日常、旅行与家庭记录。',
    facts: ['ISO 400 是日常随身机的折中点：比 ISO 200 更能应付阴天，比 ISO 800 更容易在晴天控制曝光。', '自然色彩和肤色描述属于胶卷定位，实际结果仍受曝光、冲洗和扫描影响。', '购买时要确认保质期与保存方式；胶卷不是“放久了还能稳定表现”的电子耗材。'],
    sources: [source('Fujifilm 400 官方资料', 'https://www.fujifilm.com/us/en/consumer/films/consumer-film/fujifilm-400', '厂商资料')],
  },
  {
    id: 'ilford-hp5-plus',
    eyebrow: '黑白负片 · 练习卷',
    title: 'ILFORD HP5 Plus：ISO 400 黑白负片的可控起点',
    type: '黑白负片',
    iso: 'ISO 400',
    summary: 'HP5 Plus 是经典 ISO 400 黑白负片，适合街拍、纪实、练习曝光和后续暗房放大；它与彩色负片的冲洗流程不是一套。',
    facts: ['ISO 400 适合光线变化和手持拍摄，也给推片或拉片留下工作空间，但不同显影组合会改变反差和颗粒。', '黑白负片需要确认冲洗店是否提供黑白流程；不能默认所有“冲扫”套餐都能处理。', '黑白效果不仅由胶卷决定，曝光、显影液、显影时间、扫描曲线都会影响层次。'],
    sources: [source('ILFORD HP5 Plus 官方技术资料', 'https://www.ilfordphoto.com/amfile/file/download/file/1903/product/2252/', '厂商资料')],
  },
];

// 用户提供的扩充版胶卷库：同一份字段同时进入百科卡片与选卷指南，避免 Excel 资料只停留在附件里。
export const FILM_LIBRARY_KNOWLEDGE = FILM_LIBRARY_ROWS.map((record) => ({
  id: `library-${record.id.toLowerCase()}`,
  kind: 'film',
  eyebrow: `胶卷库 · ${record.type}`,
  title: `${record.name}：${record.style}`,
  type: record.type,
  iso: record.iso,
  summary: record.summary,
  facts: [
    `适合场景：${record.scenes}；适合季节：${record.seasons}。`,
    `画面方向：${record.style}；适合主题：${record.themes}。`,
    `拍摄建议：${record.advice}`,
    `避坑提示：${record.caution}`,
  ],
  library: record,
  sources: [source(`${record.name} 资料来源`, record.source, '用户胶卷库')],
}));

export const FILM_LIBRARY_GUIDES = FILM_LIBRARY_ROWS.map((record) => ({
  id: `library-guide-${record.id.toLowerCase()}`,
  eyebrow: `胶卷库 · ${record.type}`,
  title: `${record.name}：从场景到冲扫的使用路径`,
  scene: `${record.scenes} · ${record.iso}`,
  tags: [record.brand, record.type, record.iso],
  steps: [
    `场景：${record.scenes}；季节：${record.seasons}，先确认现场光线是否满足这卷的感光度。`,
    `画面：${record.style}；主题：${record.themes}，把风格期待和实际光线分开判断。`,
    `执行：${record.advice} 冲洗前再确认版本、保存状态与店家流程。`,
  ],
  recommendation: `${record.name} 适合从“${record.scenes}”开始尝试，画面更偏向${record.style}。`,
  caveat: record.caution,
  sources: [source(`${record.name} 资料来源`, record.source, '用户胶卷库')],
}));

// 选卷指南：以“场景—光线—预算—冲扫”给出下一卷的选择路径，不替用户虚构唯一答案。
export const FILM_CAMERA_ENCYCLOPEDIA = [
  {
    id: 'camera-mechanical-slr',
    kind: 'camera',
    eyebrow: '胶片机 · 机械单反',
    title: '机械单反怎么开始：先理解快门、光圈和测光',
    type: '胶片机',
    badge: '35mm 单反',
    summary: '机械单反把曝光控制直接交给使用者，适合想练习观察光线和建立手动曝光直觉的人。它的优势是结构直观，难点是需要在拍摄前多做一步判断。',
    facts: ['先确认快门、光圈和测光表都能正常工作，再讨论机身成色和收藏价值。', '入门时优先选择有可靠测光、快门档位完整、取景器清晰的机身。', '胶片机的“机械”不等于免维护，快门帘、海绵、测光电池和卡口仍需逐项检查。'],
    sources: [source('Nikon FM2 官方资料', 'https://www.nikonusa.com/p/nikon-fm2n/4001/overview', '厂商资料'), source('二手胶片机验机参考', 'https://www.kubusphoto.com/blog/how-to-test-used-film-camera', '验机参考')],
  },
  {
    id: 'camera-automatic-slr',
    kind: 'camera',
    eyebrow: '胶片机 · 自动单反',
    title: '自动单反适合谁：把学习成本降到按下快门之前',
    type: '胶片机',
    badge: 'AF / AE',
    summary: '自动对焦和自动曝光单反更适合旅行、家庭和活动记录，也适合希望先把注意力放在构图上的新手。购买重点从“能不能拍”转向电子功能是否稳定。',
    facts: ['确认自动对焦、自动过片、闪光灯、LCD 和电池仓都能在实机上工作。', '同一品牌的镜头卡口不一定跨代兼容，购买机身时要先确认镜头预算。', '电子故障通常比外观划痕更影响长期使用，优先选择有测试记录的样机。'],
    sources: [source('Canon Camera Museum', 'https://global.canon/en/c-museum/index.html', '厂商资料'), source('Camera-wiki 胶片机资料库', 'https://camera-wiki.org/', '资料交叉核对')],
  },
  {
    id: 'camera-rangefinder',
    kind: 'camera',
    eyebrow: '胶片机 · 旁轴与定焦',
    title: '旁轴定焦机的重点：轻便之外，还要看对焦与取景',
    type: '胶片机',
    badge: '定焦 / 旁轴',
    summary: '旁轴和定焦便携机常被喜欢街拍和随身记录的人选择。它们的优势是安静、轻巧和镜头视角明确，但对焦联动、测光与镜头盖结构需要重点检查。',
    facts: ['取景框亮度、黄斑对焦联动和近距离对焦是最值得现场验证的三项。', '固定镜头机身要检查镜片霉斑、雾化、划痕和快门叶片油污。', '轻便机不代表低风险，老电子旁轴的电池替代和维修渠道要提前确认。'],
    sources: [source('Yashica Electro 35 资料', 'https://camera-wiki.org/wiki/Yashica_Electro_35', '资料交叉核对'), source('旁轴相机基础说明', 'https://www.butkus.org/chinon/', '原厂手册索引')],
  },
  {
    id: 'camera-compact',
    kind: 'camera',
    eyebrow: '胶片机 · 便携机',
    title: '傻瓜机不等于随便买：镜头盖、闪光灯和马达要一起验',
    type: '胶片机',
    badge: '随身记录',
    summary: '便携机降低了操作门槛，却把更多功能集中到马达、排线、闪光灯和镜头盖等电子部件里。适合日常记录，但更需要关注实机状态和售后退换。',
    facts: ['先测试镜头盖开合、镜头伸缩、自动对焦、过片和回卷是否连贯。', '电池触点腐蚀、LCD 漏液和闪光灯不充电通常比外观磨损更值得警惕。', '热门型号的价格可能包含成色溢价，不能因为外观干净就跳过功能测试。'],
    sources: [source('Ricoh 胶片相机型号索引', 'https://www.ricoh-imaging.co.jp/japan/products/ricoh-filmcamera/cameralist/MP-zoom.html', '厂商资料'), source('Canon Sure Shot WP-1 资料', 'https://vintagecameralab.com/canon-sure-shot-wp-1/', '资料交叉核对')],
  },
  {
    id: 'camera-buying-checklist',
    kind: 'camera',
    eyebrow: '胶片机 · 二手验机',
    title: '买二手胶片机的顺序：先验证功能，再比较价格',
    type: '胶片机',
    badge: '购买清单',
    summary: '一台胶片机的真实成本包含机身、镜头、电池、胶片、冲扫和可能的维修。把验机顺序固定下来，比只看型号热度更能降低第一次购买的试错成本。',
    facts: ['先看电池仓、胶片仓、快门、过片和回卷，再检查镜头与外观。', '要求卖家提供通电、按快门、测光、闪光和卷片的连续视频或现场测试。', '把型号、镜头、成色、测试项目和退换条件一起记录，方便比较不同卖家。'],
    sources: [source('二手胶片机检查参考', 'https://www.kubusphoto.com/blog/how-to-test-used-film-camera', '验机参考'), source('Butkus 相机说明书资料库', 'https://www.butkus.org/chinon/', '原厂手册索引')],
  },
];

export const FILM_GUIDES = [
  {
    id: 'guide-sunny-street',
    eyebrow: '选卷指南 · 晴天街拍',
    title: '晴天街拍：先从 ISO 200 的彩负开始',
    scene: '晴天 / 旅行 / 街拍',
    tags: ['强光', '低预算', '日常记录'],
    steps: ['先选 ISO 200 日光彩负，晴天更容易保留较快光圈与较低颗粒。', '如果经常从室外走进室内，改选 ISO 400，少为光线变化反复换卷。', '拍摄前记下胶卷、曝光补偿与冲扫店，方便比较下一卷是否真的更适合。'],
    recommendation: '优先考虑 Kodak Gold 200；想要更大的阴天和室内余量，可换 Kodak UltraMAX 400 或 Fujifilm 400。',
    caveat: '强光不是“随便拍都不会过曝”；逆光、雪地和大面积浅色场景仍要看测光与曝光补偿。',
    sources: [source('Kodak Gold 200 官方资料', 'https://www.kodak.com/en/still-film/product/consumer/gold-200-film/', '厂商资料'), source('Fujifilm 400 官方资料', 'https://www.fujifilm.com/us/en/consumer/films/consumer-film/fujifilm-400', '厂商资料')],
  },
  {
    id: 'guide-cloudy-indoor',
    eyebrow: '选卷指南 · 阴天与室内',
    title: '阴天、咖啡店与室内自然光：优先看 ISO 400',
    scene: '阴天 / 室内窗边 / 家庭记录',
    tags: ['光线变化', '手持', '稳定快门'],
    steps: ['把 ISO 400 当作起点，先保证快门速度和手持稳定性，再考虑颗粒。', '若机身有测光，半按快门观察速度；若速度已经接近安全下限，ISO 200 不一定更“高级”。', '室内有钨丝灯或彩色灯时，先接受色偏可能性，或改用黑白卷把注意力放到明暗和形状。'],
    recommendation: '彩色可选 Kodak UltraMAX 400 或 Fujifilm 400；想练习反差和光线，可考虑 ILFORD HP5 Plus。',
    caveat: 'ISO 400 只是感光度，不会替代闪光、三脚架或稳定支撑；暗部仍可能没有足够细节。',
    sources: [source('Kodak UltraMAX 400 官方资料', 'https://www.kodak.com/en/still-film/product/consumer/ultramax-400-film/', '厂商资料'), source('ILFORD HP5 Plus 官方技术资料', 'https://www.ilfordphoto.com/amfile/file/download/file/1903/product/2252/', '厂商资料')],
  },
  {
    id: 'guide-portrait-natural-light',
    eyebrow: '选卷指南 · 自然光人像',
    title: '自然光人像：先选肤色取向，再比较 ISO',
    scene: '人像 / 窗边 / 户外阴影',
    tags: ['肤色', '自然光', '扫描差异'],
    steps: ['先决定你要的是自然肤色、暖色日常感，还是更鲜明的颜色；不要只按“颗粒最细”排序。', '室外或窗边自然光可从 ISO 400 开始，更容易保留安全快门和较灵活的景深。', '同一卷至少拍完一卷再评价，并记录曝光、冲扫和扫描设置，否则不同变量会混在一起。'],
    recommendation: '如果预算允许，可先试 Kodak Portra 400；想用更日常的价格和暖色表现，可从 Gold 200 开始。',
    caveat: '肤色不是胶卷单一参数，曝光、现场反射光、冲洗和扫描都会改变最终结果。',
    sources: [source('Kodak Portra 官方产品手册', 'https://www.kodak.com/global/plugins/acrobat/en/professional/products/films/portra/portraBrochure11x17.pdf', '厂商资料'), source('Kodak Gold 200 官方资料', 'https://www.kodak.com/en/still-film/product/consumer/gold-200-film/', '厂商资料')],
  },
  {
    id: 'guide-landscape-detail',
    eyebrow: '选卷指南 · 风光与细节',
    title: '晴天风光、建筑和产品细节：用 ISO 100 换细颗粒',
    scene: '风光 / 建筑 / 静物',
    tags: ['光线充足', '细节', '低感光度'],
    steps: ['先确认光线足够，再选择 ISO 100；光线不足时不要为了细颗粒牺牲快门速度。', '用三脚架或稳定支撑时，ISO 100 的优势更容易体现出来。', '如果主体包含肤色，先做一张测试并确认冲扫风格，避免把高饱和误认为“更清晰”。'],
    recommendation: '优先考虑 Kodak Ektar 100；如果天气变化大、需要更灵活的手持范围，回到 ISO 400 更稳妥。',
    caveat: 'ISO 100 更依赖光线和测光，阴天、林下或黄昏时需要重新评估。',
    sources: [source('Kodak Ektar 100 官方资料', 'https://www.kodak.com/en/still-film/product/professional/ektar-100-film/', '厂商资料')],
  },
  {
    id: 'guide-black-white-practice',
    eyebrow: '选卷指南 · 黑白练习',
    title: '想练曝光与明暗：把黑白卷当作观察训练',
    scene: '街拍 / 纪实 / 练习曝光',
    tags: ['黑白', '明暗', '后期可控'],
    steps: ['先用 ISO 400 黑白卷拍一卷，练习判断高光是否会死白、暗部是否仍有层次。', '拍摄前确认冲洗店能处理黑白负片；彩色负片的冲扫套餐不一定包含黑白流程。', '同一场景中尝试顺光、侧光和逆光，比较光线方向对反差的影响，而不是只比较“颜色”。'],
    recommendation: 'ILFORD HP5 Plus 是适合从 ISO 400 黑白流程开始的常见选择；想推片时要提前和冲洗店确认。',
    caveat: '黑白的最终反差取决于胶卷、曝光、显影和扫描/放大组合，不应只根据网络样片下结论。',
    sources: [source('ILFORD HP5 Plus 官方技术资料', 'https://www.ilfordphoto.com/amfile/file/download/file/1903/product/2252/', '厂商资料')],
  },
  {
    id: 'guide-budget-test',
    eyebrow: '选卷指南 · 预算与试错',
    title: '第一次买胶卷：把“试错成本”算进选择',
    scene: '第一次拍摄 / 预算有限 / 比较样片',
    tags: ['总成本', '先试一卷', '记录变量'],
    steps: ['把胶卷、冲扫、电池和失败帧都算进一卷的成本，不要只比较包装上的单价。', '预算有限时先选容易获得、ISO 400 或 ISO 200 的通用卷，优先建立自己的曝光和扫描参照。', '一次只改变一个变量：换胶卷时尽量保持相机、拍摄场景和冲扫店不变。'],
    recommendation: 'Gold 200、UltraMAX 400、Fujifilm 400 都可以作为日常比较起点；不要在第一卷同时换机、换卷和换冲扫店。',
    caveat: '价格与库存会随渠道和地区变化，指南只给选择逻辑，不把任何胶卷当成固定低价商品。',
    sources: [source('Kodak 仍在售胶片产品索引', 'https://www.kodak.com/en/still-film/home/', '厂商资料'), source('Fujifilm 400 官方资料', 'https://www.fujifilm.com/us/en/consumer/films/consumer-film/fujifilm-400', '厂商资料')],
  },
  ...FILM_LIBRARY_GUIDES,
];

export const KNOWLEDGE_SOURCES = [
  source('Canon Camera Museum', 'https://global.canon/en/c-museum/index.html', '厂商资料'),
  source('Nikon F100 官方规格与支持', 'https://nij.nikon.com/products/lineup/slr/f100/spec.html', '厂商资料'),
  source('Ricoh Imaging 胶片相机/说明书索引', 'https://www.ricoh-imaging.co.jp/japan/support/download/manual/others.html', '厂商资料'),
  source('Camera-wiki 相机资料库', 'https://camera-wiki.org/', '资料交叉核对'),
  source('Butkus 相机说明书资料库', 'https://www.butkus.org/chinon/', '原厂手册索引'),
  source('二手胶片机检查参考', 'https://www.kubusphoto.com/blog/how-to-test-used-film-camera', '验机参考'),
];

export const KNOWLEDGE_STATS = {
  cameraCount: CAMERA_KNOWLEDGE.length,
  brandCount: new Set(CAMERA_KNOWLEDGE.map((item) => item.brand)).size,
  sourceCount: new Set([
    ...CAMERA_KNOWLEDGE.flatMap((item) => item.sources.map((entry) => entry.url)),
    ...FILM_ENCYCLOPEDIA.flatMap((item) => item.sources.map((entry) => entry.url)),
    ...FILM_LIBRARY_KNOWLEDGE.flatMap((item) => item.sources.map((entry) => entry.url)),
    ...FILM_CAMERA_ENCYCLOPEDIA.flatMap((item) => item.sources.map((entry) => entry.url)),
    ...FILM_GUIDES.flatMap((item) => item.sources.map((entry) => entry.url)),
  ]).size,
  filmEncyclopediaCount: FILM_ENCYCLOPEDIA.length + FILM_LIBRARY_KNOWLEDGE.length + FILM_CAMERA_ENCYCLOPEDIA.length,
  guideCount: FILM_GUIDES.length,
  lastReviewed: '2026-07-28',
};
