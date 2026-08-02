import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "outputs/2026-07-26-film-camera-v1/胶片机数据表_首版20台.xlsx";
const outputPath = "outputs/2026-07-26-film-camera-v1/胶片机数据表_扩展版.xlsx";
const updateDate = new Date("2026-07-26T00:00:00+08:00");
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const dataSheet = wb.worksheets.getItem("相机数据");
const noteSheet = wb.worksheets.getItem("查询说明");
const summarySheet = wb.worksheets.getItem("概览");

const navy = "#1F4E78";
const blue = "#D9EAF7";
const paleBlue = "#EEF5FB";
const gold = "#FFF2CC";
const green = "#E2F0D9";
const red = "#FCE4D6";
const border = "#B7C9D6";
const text = "#1F2937";

const taobaoUrl = (q) => `https://s.taobao.com/search?q=${encodeURIComponent(q)}`;
const goofishUrl = (q) => `https://www.goofish.com/search?q=${encodeURIComponent(q)}`;

const additions = [
  {name:"Canon Autoboy大魔王（New Autoboy / Caption Zoom）",brand:"Canon",low:600,high:1900,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:415,size:"148×77×56",flash:"是",lens:"固定变焦38–60mm f/3.8–7.2；不可换镜头",repair:"高",beginner:"高",scene:"旅行、街拍、日常；需要全自动和变焦",risk:"电子变焦、AF、内闪、马达和电池触点老化；热门称呼带来溢价",rec:"操作简单、内闪、自动过片，变焦比固定焦段更灵活",notRec:"外观和功能正常的价格差异大；故障后维修价值有限",spec:"https://global.canon/zh/c-museum/product/film135.html",market:"https://tw.bid.yahoo.com/search/auction/product?cid=2092077887&clv=1&p=%E5%A4%A7%E9%AD%94%E7%8E%8B；公开样本约NT$2,360–8,575，按成色筛选"},
  {name:"Canon Autoboy ZOOM Super",brand:"Canon",low:800,high:1800,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:640,size:"153×93×68",flash:"是",lens:"39–85mm f/3.6–7.3电动变焦；不可换镜头",repair:"高",beginner:"高",scene:"旅行、人文、户外；想要一台高端老式傻瓜变焦机",risk:"电动变焦、遥控、LCD、马达和闪光灯老化；机身较厚重",rec:"镜头规格和操控在早期变焦傻瓜机中较完整",notRec:"体积重量明显大；电子部件故障难修",spec:"https://global.canon/zh/c-museum/product/film134.html；https://camera-wiki.org/wiki/Canon_Sure_Shot_Zoom_XL/Prima_Zoom_F/Autoboy_Zoom_Super",market:"https://natural-camera.com/products/13507；公开测试机曾标价¥4,400，属于店铺整备/成色样本"},
  {name:"Canon Autoboy AF35M II（Autoboy系列代表）",brand:"Canon",low:400,high:1000,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:310,size:"约140×72×52",flash:"是",lens:"固定38mm f/2.8；不可换镜头",repair:"中高",beginner:"高",scene:"日常、街拍、家庭记录；想要便宜的经典AF傻瓜机",risk:"AF、马达、闪光灯、电池仓和快门老化；机身版本差异需看铭牌",rec:"经典Autoboy系列代表，镜头光圈比许多后期变焦机更友好",notRec:"固定焦段；老机需逐项测试，不能只看外观",spec:"https://en.wikipedia.org/wiki/Canon_AF35M；https://www.cameramanuals.org/canon_pdf/canon_af_35m_ii.pdf",market:"https://www.ruten.com.tw/find/?q=canon+autoboy&sort=new%2Fdc；公开二手平台搜索入口"},
  {name:"Pentax Espio 135M",brand:"Pentax",low:300,high:800,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:235,size:"113.5×66×50",flash:"是",lens:"38–135mm电动变焦；不可换镜头",repair:"高",beginner:"高",scene:"旅行、家庭、日常；需要较长焦段的全自动便携机",risk:"变焦马达、镜头伸缩、AF、内闪和电池触点老化",rec:"焦段覆盖广、操作简单、带闪光灯",notRec:"长焦端光圈较小；电子故障后维修价值有限",spec:"https://www.newwavepool.ca/products/pentax-espio-135m-compact-35mm-film-camera-serial-4528755",market:"https://kakaku.com/item/10205510143/；公开二手/价格比较入口"},
  {name:"Minolta Capios 160A",brand:"Minolta",low:300,high:900,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:195,size:"110.5×60.5×46.5",flash:"是",lens:"37.5–160mm f/5.4–12.4电动变焦；不可换镜头",repair:"高",beginner:"高",scene:"旅行、远景、日常；需要长焦和多种AF模式",risk:"变焦马达、AF、内闪和电池触点老化；长焦端暗",rec:"焦段很长、机身轻，功能和AF模式较丰富",notRec:"160mm端光圈小、震动风险高；维修资料有限",spec:"https://kaerushashinki.co.jp/museum/?p=1118",market:"https://filmphotography.eu/kamera/minolta-capios-160a/；公开二手平台搜索入口"},
  {name:"Fujifilm Cardia Mini Tiara（28mm固定版）",brand:"Fujifilm",low:1500,high:3500,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:153,size:"约118×62×32",flash:"是",lens:"固定28mm f/3.5 Fujinon；不可换镜头",repair:"高",beginner:"高",scene:"街拍、旅行、随身记录；追求小巧和广角",risk:"镜头滑盖、排线、AF、闪光灯和电子件老化；热门机溢价",rec:"体积小、28mm广角和便携性突出",notRec:"价格较高；滑盖和排线故障不适合低预算试错",spec:"https://www.awane-camera.com/3/4/fuji_cardia-mini-everyday-op/index.htm；https://root-camera.com/shop_view/7489",market:"https://www.cameraworth.com/f/fujifilm/fuji-dl-super-mini-fujifilm-cardia-mini-tiara-fujifilm-tiara/；公开样本/价格参考"},
  {name:"Minolta Riva Zoom 75W（Capios 75W）",brand:"Minolta",low:300,high:800,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:245,size:"121×66.5×44",flash:"是",lens:"28–75mm f/3.5–8.9电动变焦；不可换镜头",repair:"中高",beginner:"高",scene:"旅行、街拍、日常；需要广角到中长焦",risk:"变焦马达、AF、内闪和电池触点老化；不同地区别名较多",rec:"广角端实用、机身轻，市场价格通常不高",notRec:"镜头长焦端较暗；购买时要核对是否75W而非其他Riva Zoom",spec:"https://camera-wiki.org/wiki/Minolta_Riva_Zoom_75w；https://manualmachine.com/minolta/rivazoom75w/7123244-user-manual/",market:"https://kamerastore.com/en-us/products/minolta-riva-zoom-75w；公开二手平台搜索入口"},
  {name:"Canon Sure Shot WP-1（Canon WP-1）",brand:"Canon",low:600,high:1500,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:"约240",size:"约142×73×50",flash:"是",lens:"固定32mm广角；不可换镜头；防水机身",repair:"高",beginner:"高",scene:"海边、泳池、雨天、旅行；需要防水防护",risk:"密封圈老化、进水、闪光灯和电子件失效；下水前必须做密封检查",rec:"题材独特，适合户外和水边记录",notRec:"防水能力无法仅凭外观判断；维修和重新密封困难",spec:"https://vintagecameralab.com/canon-sure-shot-wp-1/; https://commons.wikimedia.org/wiki/File:Canon_Sure_Shot_WP-1.jpg",market:"https://www.ebay.com/sch/i.html?_nkw=Canon+Sure+Shot+WP-1；公开二手平台搜索入口"},
  {name:"Pentax Zoom 105-R",brand:"Pentax",low:300,high:800,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:480,size:"143.5×82.5×66.5",flash:"是",lens:"38–105mm电动变焦；不可换镜头；带微距/间隔等模式",repair:"高",beginner:"高",scene:"旅行、家庭、日常；需要变焦和多种自动模式",risk:"电容、变焦马达、内闪、胶片仓和电池触点老化",rec:"功能比普通入门傻瓜机丰富，焦段实用",notRec:"体积偏大；电子故障和电池问题常见",spec:"https://manualzz.com/doc/3014078/pentax-zoom-105-r-date-camera-operating-manual",market:"https://www.isofilmshop.com/product/pentax-zoom-105-r/；公开二手平台搜索入口"},
  {name:"Nikon One Touch Zoom 90S",brand:"Nikon",low:300,high:800,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:215,size:"117×64.5×49",flash:"是",lens:"38–90mm电动变焦；不可换镜头；部分版本带日期",repair:"高",beginner:"高",scene:"旅行、家庭、日常；追求轻便和自动闪光",risk:"变焦马达、LCD、AF、内闪和电池触点老化",rec:"轻、小、焦段实用，适合新手随身使用",notRec:"画质和低光能力受限；电子故障难修",spec:"https://manualmachine.com/nikon/90sqd/7373817-user-manual/",market:"https://www.ebay.com/sch/i.html?_nkw=Nikon+One+Touch+Zoom+90s；公开二手平台搜索入口"},
  {name:"Minolta Panorama Zoom 5",brand:"Minolta",low:600,high:1400,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:"约245",size:"约124×67×48",flash:"是",lens:"38–60mm电动变焦；不可换镜头；带全景/日期功能",repair:"高",beginner:"高",scene:"旅行、街拍、日常；想要全景构图和变焦",risk:"变焦马达、AF、内闪和日期电路老化；全景多为画幅遮挡效果",rec:"轻便、全自动、全景模式有趣",notRec:"全景不等于真正宽幅底片；热门店铺成色溢价明显",spec:"https://www.lomography.com/cameras/3369233-minolta-panorama-zoom-5/photos",market:"https://cameranonaniwa.jp/shop/g/g2221070511700/；公开样本日元11,800，另有店铺日元16,000样本"},
  {name:"Fujifilm DL-290 / Discovery 290 Zoom",brand:"Fujifilm",low:300,high:800,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:258,size:"125×76×50.5",flash:"是",lens:"38–90mm电动变焦；不可换镜头；可选日期版",repair:"高",beginner:"高",scene:"旅行、家庭、日常；需要自动变焦和自动闪光",risk:"镜头盖、变焦马达、AF、内闪和电池触点老化",rec:"功能完整、焦段够用、适合自动化入门",notRec:"长焦端光圈和对焦速度有限；电子件老化",spec:"https://butkus.org/chinon/fujica/fujifilm_discovery_290/fujica_discovery_290.pdf; https://manualmachine.com/fujifilm/dl290s/968074-user-manual/",market:"https://www.ebay.com/sch/i.html?_nkw=Fujifilm+DL-290+film+camera；公开二手平台搜索入口"},
  {name:"Olympus Trip AF31",brand:"Olympus",low:300,high:800,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:179,size:"124×72×57",flash:"是",lens:"固定34mm f/5.6；不可换镜头",repair:"中高",beginner:"高",scene:"日常、旅行、家庭记录；希望简单可靠地按快门",risk:"AF、马达、闪光灯、电池触点和镜头盖老化",rec:"轻、简单、带内闪，适合零基础",notRec:"镜头光圈小；暗光和背景虚化能力有限",spec:"https://camera-wiki.org/wiki/Olympus_Trip_AF_31; https://www.analogcamerad.com/shop/olympus-trip-af-31/",market:"https://www.ebay.com/p/1625550628；公开二手平台搜索入口"},
  {name:"Canon Prima Super 115（Autoboy S / Sure Shot Z115）",brand:"Canon",low:300,high:900,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:195,size:"107.2×58.7×42.4",flash:"是",lens:"38–115mm电动变焦；不可换镜头；多场景模式",repair:"高",beginner:"高",scene:"旅行、家庭、日常；需要轻便和较长焦段",risk:"长焦端最大光圈小；AF、变焦、内闪、LCD和马达老化",rec:"机身轻、全自动、焦段覆盖广",notRec:"115mm端暗，低光容易糊；维修价值有限",spec:"https://global.canon/zh/c-museum/product/film163.html; https://global.canon/zh/c-museum/product/film238.html",market:"https://www.fnac.com/Appareil-photo-argentique-Canon-Prima-Super-115-Gris-Reconditionne/a17466323/w-4；公开二手平台搜索入口"},
  {name:"Ricoh Myport Zoom RZ-800D（用户写作2Z800）",brand:"Ricoh",low:400,high:1000,af:"是",ae:"是（程序自动）",wind:"否（电机过片）",weight:345,size:"142×74×53",flash:"是",lens:"38–80mm f/4.5–6.4电动变焦；不可换镜头；部分版本带全景套件",repair:"高",beginner:"高",scene:"旅行、街拍、日常；需要轻便自动对焦和变焦",risk:"电池、电机、AF、内闪和LCD老化；RZ-800与RZ-800D名称需核对",rec:"官方资料完整、功能实用、价格通常低于热门机",notRec:"机身电子化；热门名称混淆会导致买错版本",spec:"https://www.ricoh-imaging.co.jp/japan/products/ricoh-filmcamera/cameralist/MP-zoom.html",market:"https://kamerastore.com/en-us/products/ricoh-rz-800；https://bromurefilm.com/en/products/ricoh-rz-800；公开二手平台搜索入口"},
];

// Update the existing μ[mju:]-II row with the user's common alias rather than duplicating it.
const nameVals = dataSheet.getRange("A5:A24").values;
const mjuIndex = nameVals.findIndex((r) => r[0] === "Olympus μ[mju:]-II");
if (mjuIndex >= 0) {
  const rowNumber = 5 + mjuIndex;
  dataSheet.getRange(`A${rowNumber}`).values = [["Olympus μ[mju:]-II（U2 / Stylus Epic）"]];
  dataSheet.getRange(`S${rowNumber}`).values = [[`${dataSheet.getRange(`S${rowNumber}`).values[0][0]}；别名核对：https://www.olympus.co.jp/jp/news/1997a/nr970218mju2spj.html`]];
}

const newRows = additions.map((r) => {
  const q = `${r.name} 胶片相机`;
  const source = `规格：${r.spec}；公开行情：${r.market}；平台复核入口：闲鱼 ${goofishUrl(q)}；淘宝 ${taobaoUrl(q)}`;
  return [r.name, r.brand, `¥${r.low.toLocaleString("zh-CN")}–¥${r.high.toLocaleString("zh-CN")}`, r.low, r.high, r.af, r.ae, r.wind, r.weight, r.size, r.flash, r.lens, r.repair, r.beginner, r.scene, r.risk, r.rec, r.notRec, source, updateDate, "规格可核验；价格需App内复核"];
});

const table = dataSheet.tables.items.find((t) => t.name === "FilmCameraData") || dataSheet.tables.items[0];
if (!table) throw new Error("找不到主数据表 FilmCameraData");
table.rows.add(null, newRows);
const newStart = 25;
const newEnd = 24 + newRows.length;
dataSheet.getRange(`A${newStart}:U${newEnd}`).format = { font: { color: text, size: 9 }, verticalAlignment: "top", wrapText: true, borders: { insideHorizontal: { style: "thin", color: border }, insideVertical: { style: "thin", color: border }, bottom: { style: "thin", color: border } } };
dataSheet.getRange(`A${newStart}:U${newEnd}`).format.rowHeight = 86;
for (let i = newStart; i <= newEnd; i++) if (i % 2 === 0) dataSheet.getRange(`A${i}:U${i}`).format.fill = paleBlue;
dataSheet.getRange(`D${newStart}:E${newEnd}`).format.numberFormat = "¥#,##0";
dataSheet.getRange(`I${newStart}:I${newEnd}`).format.numberFormat = "#,##0";
dataSheet.getRange(`T${newStart}:T${newEnd}`).format.numberFormat = "yyyy-mm-dd";
dataSheet.getRange(`A${newStart}:B${newEnd}`).format.font = { bold: true, color: text, size: 9 };
dataSheet.getRange(`D${newStart}:E${newEnd}`).format.horizontalAlignment = "right";
dataSheet.getRange(`F${newStart}:H${newEnd}`).format.horizontalAlignment = "center";
dataSheet.getRange(`I${newStart}:I${newEnd}`).format.horizontalAlignment = "right";
dataSheet.getRange(`K${newStart}:N${newEnd}`).format.horizontalAlignment = "center";
dataSheet.getRange(`T${newStart}:U${newEnd}`).format.horizontalAlignment = "center";
dataSheet.getRange(`F${newStart}:H${newEnd}`).dataValidation = { rule: { type: "list", values: ["是", "否"] } };
dataSheet.getRange(`K${newStart}:K${newEnd}`).dataValidation = { rule: { type: "list", values: ["是", "否", "否（外接热靴）"] } };
dataSheet.getRange(`M${newStart}:N${newEnd}`).dataValidation = { rule: { type: "list", values: ["低", "中", "中高", "高"] } };
dataSheet.getRange(`M${newStart}:M${newEnd}`).conditionalFormats.add("containsText", { text: "高", format: { fill: red, font: { color: "#9C0006", bold: true } } });
dataSheet.getRange(`N${newStart}:N${newEnd}`).conditionalFormats.add("containsText", { text: "高", format: { fill: green, font: { color: "#006100", bold: true } } });
dataSheet.getRange(`N${newStart}:N${newEnd}`).conditionalFormats.add("containsText", { text: "中", format: { fill: gold, font: { color: "#7F6000" } } });
dataSheet.getRange(`U${newStart}:U${newEnd}`).conditionalFormats.add("containsText", { text: "需App内复核", format: { fill: gold, font: { color: "#7F6000", bold: true } } });
dataSheet.getRange("A1").values = [[`胶片机使用情况｜扩展版真实资料表（${newEnd - 4}台）`]];
dataSheet.getRange("A2").values = [["口径：人民币二手市场常见可用机/常见套机参考区间；排除故障机、未测试机、收藏级/纪念版和明显低价引流盘。新增便携机重点记录电子、变焦、闪光灯、密封和滑盖风险。"]];

// Update the existing query notes without disturbing the existing layout.
noteSheet.getRange("B4").values = [["35台常见35mm胶片机，覆盖手动单反、自动曝光单反、自动对焦单反、旁轴和便携机"]];
noteSheet.getRange("A55:H55").merge();
noteSheet.getRange("A55").values = [["扩展批次说明：新增机型的别名、规格来源和淘宝/闲鱼复核入口见“新增机型说明”页；其中“Zoom 208P”未找到可确认的胶片相机型号，暂不把猜测写入主数据。"]];
noteSheet.getRange("A55:H55").format = { fill: gold, font: { color: "#7F6000", italic: true }, wrapText: true, verticalAlignment: "center" };
noteSheet.getRange("A55:H55").format.rowHeight = 36;

// Rebuild the compact overview area to include the newly added brands and total counts.
summarySheet.getRange("A11:H25").unmerge();
summarySheet.getRange("A11:H25").clear({ applyTo: "all" });
summarySheet.getRange("D3:E11").values = [["品牌", "台数"],["Canon",null],["Nikon",null],["Pentax",null],["Olympus",null],["Minolta",null],["Yashica",null],["Fujifilm",null],["Ricoh",null]];
summarySheet.getRange("A3:B8").values = [["指标", "数值"],["相机数量", 35],["品牌数量", 8],["支持自动对焦", 21],["支持自动曝光", 31],["价格需App内复核", 35]];
summarySheet.getRange("D3:E3").format = { fill: blue, font: { bold: true, color: text }, horizontalAlignment: "center", borders: { preset: "all", style: "thin", color: border } };
summarySheet.getRange("D4:D11").format = { fill: paleBlue, font: { color: text }, borders: { preset: "all", style: "thin", color: border } };
summarySheet.getRange("E4:E11").formulas = [["=COUNTIF('相机数据'!B5:B39,D4)"],["=COUNTIF('相机数据'!B5:B39,D5)"],["=COUNTIF('相机数据'!B5:B39,D6)"],["=COUNTIF('相机数据'!B5:B39,D7)"],["=COUNTIF('相机数据'!B5:B39,D8)"],["=COUNTIF('相机数据'!B5:B39,D9)"],["=COUNTIF('相机数据'!B5:B39,D10)"],["=COUNTIF('相机数据'!B5:B39,D11)"]];
summarySheet.getRange("E4:E11").format = { borders: { preset: "all", style: "thin", color: border }, font: { color: text }, horizontalAlignment: "center", numberFormat: "#,##0" };
summarySheet.getRange("A13:H13").merge();
summarySheet.getRange("A13").values = [["核验提醒"]];
summarySheet.getRange("A13:H13").format = { fill: gold, font: { bold: true, color: "#7F6000" }, horizontalAlignment: "left" };
summarySheet.getRange("A14:H17").merge(true);
summarySheet.getRange("A14:A17").values = [
  ["1. 规格字段优先采用厂商资料、原厂说明或长期维护的相机资料页；重量和体积按机身、通常不含镜头/电池的口径整理，具体版本可能有小差异。"],
  ["2. 新增便携机多数为电子化机身；购买时必须测试开机、变焦、对焦、闪光灯、过片、回卷和电池仓，防水机还要检查密封。"],
  ["3. 淘宝/闲鱼页面动态、登录和个性化明显，工作簿保留检索入口而不是伪造稳定商品页；购买前应按说明页步骤再抽样核对。"],
  ["4. 数据更新时间是本次扩展整理日期：2026-07-26。若后续价格变化，优先更新价格下限/上限、价格区间、行情来源和更新时间。"],
];
summarySheet.getRange("A14:H17").format = { fill: "#FFFDF2", font: { color: text, size: 10 }, wrapText: true, verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#E6D8A8" } };
summarySheet.getRange("A14:H17").format.rowHeight = 34;
summarySheet.getRange("A19:H19").merge();
summarySheet.getRange("A19").values = [["字段说明与筛选建议：先按新手友好度、维修难度和使用风险筛选，再比较价格；不要仅按最低价购买未测试机。"]];
summarySheet.getRange("A19:H19").format = { fill: green, font: { color: "#006100", italic: true }, wrapText: true, verticalAlignment: "center" };
summarySheet.getRange("A19:H19").format.rowHeight = 28;

// New source/alias sheet, including the unresolved user-supplied name.
const sourceSheet = wb.worksheets.add("新增机型说明");
sourceSheet.showGridLines = false;
sourceSheet.getRange("A1:F1").merge();
sourceSheet.getRange("A1").values = [["新增机型｜别名、来源与待核实项"]];
sourceSheet.getRange("A1:F1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 }, horizontalAlignment: "center", verticalAlignment: "center" };
sourceSheet.getRange("A1:F1").format.rowHeight = 30;
sourceSheet.getRange("A3:F3").values = [["用户名称/型号","本表采用名称","别名/型号判断","规格来源","行情来源","备注"]];
sourceSheet.getRange("A3:F3").format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", wrapText: true };
const sourceRows = additions.map((r) => {
  const alias = r.name.includes("RZ-800") ? "2Z800→RZ-800D（按理光官方型号表核对）" : r.name.includes("Cardia") ? "Cardia Mini常见为Tiara/28mm固定版；不要与Tiara Zoom混淆" : r.name.includes("WP-1") ? "WP-1也常被写作Sure Shot WP-1 / Prima AS-1" : r.name.includes("ZOOM Super") ? "Prima Zoom F / Sure Shot Zoom XL / Autoboy Zoom Super" : r.name.includes("Prima Super") ? "Sure Shot Z115 / Autoboy S" : "按公开资料页和地区别名核对";
  return [r.name, r.name, alias, r.spec, r.market, "价格仍需淘宝/闲鱼App内按正常可用机抽样复核"];
});
sourceRows.push(["Zoom 208P", "待核实，暂不纳入主数据", "公开检索未找到可确认的Pentax/Canon/Minolta胶片相机型号；可能是型号抄写或卖家简称", "检索词：Zoom 208P / Pentax 208P / 208P胶片相机，未找到匹配胶片机规格页", "不设置价格区间，避免编造", "请提供机身正面、底部或铭牌照片，确认后再录入"]);
sourceSheet.getRange(`A4:F${3 + sourceRows.length}`).values = sourceRows;
sourceSheet.getRange(`A4:F${3 + sourceRows.length}`).format = { font: { color: text, size: 9 }, wrapText: true, verticalAlignment: "top", borders: { preset: "all", style: "thin", color: border } };
sourceSheet.getRange(`A4:A${3 + sourceRows.length}`).format.fill = paleBlue;
sourceSheet.getRange(`A4:F${3 + sourceRows.length}`).format.rowHeight = 56;
sourceSheet.getRange(`A${3 + sourceRows.length}:F${3 + sourceRows.length}`).format.fill = gold;
sourceSheet.getRange(`A${3 + sourceRows.length}:F${3 + sourceRows.length}`).format.font = { color: "#7F6000", bold: true, size: 9 };
sourceSheet.getRange("A:A").format.columnWidth = 32;
sourceSheet.getRange("B:B").format.columnWidth = 32;
sourceSheet.getRange("C:C").format.columnWidth = 42;
sourceSheet.getRange("D:E").format.columnWidth = 58;
sourceSheet.getRange("F:F").format.columnWidth = 30;
sourceSheet.freezePanes.freezeRows(3);

const check = await wb.inspect({ kind: "table", range: "相机数据!A1:U39", include: "values,formulas", tableMaxRows: 4, tableMaxCols: 21, tableMaxCellChars: 80 });
console.log(check.ndjson);
const overview = await wb.inspect({ kind: "table", range: "概览!A3:E11", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 5, tableMaxCellChars: 80 });
console.log(overview.ndjson);
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "extended workbook formula error scan" });
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(wb);
await output.save(outputPath);
for (const sheetName of ["概览", "查询说明", "相机数据", "新增机型说明"]) {
  const preview = await wb.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`outputs/2026-07-26-film-camera-v1/${sheetName}_扩展版.png`, new Uint8Array(await preview.arrayBuffer()));
}
console.log(`EXPORTED ${outputPath}`);
