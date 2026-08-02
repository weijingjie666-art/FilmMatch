import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/2026-07-26-film-camera-v1";
const outputPath = `${outputDir}/胶片机数据表_首版20台.xlsx`;
await fs.mkdir(outputDir, { recursive: true });

const updateDate = new Date("2026-07-26T00:00:00+08:00");

const specs = {
  canonAe1: "https://en.wikipedia.org/wiki/Canon_AE-1",
  canonA1: "https://global.canon/en/c-museum/product/film100.html",
  canonEOS650: "https://en.wikipedia.org/wiki/Canon_EOS_650",
  canonEOS30V: "https://en.wikipedia.org/wiki/Canon_EOS_30",
  nikonFm2: "https://en.wikipedia.org/wiki/Nikon_FM2",
  nikonFe2: "https://en.wikipedia.org/wiki/Nikon_FE2",
  nikonF3: "https://en.wikipedia.org/wiki/Nikon_F3",
  nikonF100: "https://nij.nikon.com/products/lineup/slr/f100/spec.html",
  nikonF80: "https://en.wikipedia.org/wiki/Nikon_F80",
  pentaxK1000: "https://en.wikipedia.org/wiki/Pentax_K1000",
  pentaxMx: "https://en.wikipedia.org/wiki/Pentax_MX",
  pentaxMeSuper: "https://en.wikipedia.org/wiki/Pentax_ME_Super",
  pentaxMz5: "https://www.pentaxforums.com/camerareviews/pentax-mz-5-zx-5.html",
  olympusOm1: "https://en.wikipedia.org/wiki/Olympus_OM-1",
  olympusOm2: "https://en.wikipedia.org/wiki/Olympus_OM-2",
  olympusOm10: "https://en.wikipedia.org/wiki/Olympus_OM-10",
  olympusMju2: "https://www.olympus.co.jp/jp/news/1997a/nr970218mju2spj.html",
  minoltaX700: "https://en.wikipedia.org/wiki/Minolta_X-700",
  yashicaElectro: "https://camera-wiki.org/wiki/Yashica_Electro_35",
};

const marketRefs = {
  canonAe1: "https://www.cameraworth.com/c/canon/ae-1/；公开样本：Yahoo拍卖 https://tw.bid.yahoo.com/search/auction/product?cid=22423286&clv=3&p=canon+ae1",
  canonA1: "https://www.usedlens.co.uk/guides/cameras/canon；品牌价格参考及公开二手市场观察",
  canonEOS650: "https://www.usedlens.co.uk/guides/cameras/canon；公开二手市场观察",
  canonEOS30V: "https://www.usedlens.co.uk/guides/cameras/canon；公开二手市场观察",
  nikonFm2: "https://tw.bid.yahoo.com/search/auction/product?p=nikon+fm2；公开样本：正常FM2/FM2n约NT$7,500–15,000",
  nikonFe2: "https://www.usedlens.co.uk/guides/cameras/nikon；公开二手市场观察",
  nikonF3: "https://www.usedlens.co.uk/guides/cameras/nikon；公开二手市场观察",
  nikonF100: "https://www.cameraworth.com/n/nikon/f100/；https://usedlens.co.uk/product/nikon-f100；2026年公开价格索引",
  nikonF80: "https://www.usedlens.co.uk/guides/cameras/nikon；公开二手市场观察",
  pentaxK1000: "https://www.cameraworth.com/a/asahi-pentax/pentax-k1000/；https://marketplaceiq.app/price-checker/pentax-k1000/",
  pentaxMx: "https://lensandshutter.com/reviews/pentax-mx-review/；公开二手市场观察",
  pentaxMeSuper: "https://www.usedlens.co.uk/guides/cameras/pentax；公开二手市场观察",
  pentaxMz5: "https://www.pentaxforums.com/camerareviews/pentax-mz-5-zx-5.html；公开二手市场观察",
  olympusOm1: "https://www.dcfever.com/cameras/secondhand.php?id=2419；https://www.usedlens.co.uk/guides/cameras/olympus",
  olympusOm2: "https://www.usedlens.co.uk/guides/cameras/olympus；公开二手市场观察",
  olympusOm10: "https://www.usedlens.co.uk/guides/cameras/olympus；公开二手市场观察",
  olympusMju2: "https://www.cameraworth.com/o/olympus/mju-ii/；https://kamerastore.com/products/olympus-mju-ii-zoom-115-t128374",
  minoltaX700: "https://www.cameraworth.com/m/minolta/x-700/；公开样本：工作机身约£50–90锤价",
  yashicaElectro: "https://camera-wiki.org/wiki/Yashica_Electro_35；公开二手市场观察",
};

const taobaoUrl = (q) => `https://s.taobao.com/search?q=${encodeURIComponent(q)}`;
const goofishUrl = (q) => `https://www.goofish.com/search?q=${encodeURIComponent(q)}`;

const rows = [
  {name:"Canon AE-1", brand:"Canon", key:"canonAe1", low:800, high:1600, af:"否", ae:"是（快门优先）", wind:"是", weight:590, size:"141×87×48", flash:"否（外接热靴）", lens:"Canon FD卡口，可换镜头；常见FD 50mm", repair:"中", beginner:"高", scene:"街拍、日常、人文；练习快门优先", risk:"电子快门/测光依赖电池；常见快门啸叫、海绵老化", rec:"操作逻辑简单、配件多、价格和学习成本适中", notRec:"老机成色差异大；未测试机可能需要维修", status:"规格可核验；价格需App内复核"},
  {name:"Canon AE-1 Program", brand:"Canon", key:"canonAe1", low:900, high:1800, af:"否", ae:"是（程序/快门优先）", wind:"是", weight:590, size:"141×87×48", flash:"否（外接热靴）", lens:"Canon FD卡口，可换镜头；常见FD 50mm", repair:"中", beginner:"高", scene:"旅行、街拍；希望自动曝光但保留手动控制", risk:"电子快门与测光老化；电池仓腐蚀需检查", rec:"比AE-1多程序曝光，初学容错更高", notRec:"热门机溢价明显；塑料件和电子件老化", status:"规格可核验；价格需App内复核"},
  {name:"Canon A-1", brand:"Canon", key:"canonA1", low:900, high:1800, af:"否", ae:"是（P/Tv/Av）", wind:"是", weight:620, size:"141×92×48", flash:"否（外接热靴）", lens:"Canon FD卡口，可换镜头；FD镜头资源丰富", repair:"高", beginner:"中", scene:"人文、静物、想同时学习多种曝光模式", risk:"电子系统复杂；显示、快门和电磁部件老化", rec:"曝光模式最完整，适合进阶学习", notRec:"故障排查和维修比AE-1更复杂", status:"规格可核验；价格需App内复核"},
  {name:"Canon EOS 650", brand:"Canon", key:"canonEOS650", low:300, high:800, af:"是", ae:"是（P/Tv/Av/M）", wind:"否（电机过片）", weight:660, size:"148×108×68", flash:"否（外接闪光灯）", lens:"Canon EF卡口，可换镜头；EF镜头兼容性好", repair:"高", beginner:"高", scene:"想要自动对焦、自动曝光和现代化操控的入门者", risk:"电子机身年限较老；电池仓、马达、LCD和快门需测试", rec:"价格低、AF和自动曝光齐全、EF镜头好找", notRec:"年代早、外观大；无法像机械机一样无电工作", status:"规格可核验；价格需App内复核"},
  {name:"Canon EOS 30V", brand:"Canon", key:"canonEOS30V", low:1200, high:2500, af:"是", ae:"是（P/Tv/Av/M）", wind:"否（电机过片）", weight:580, size:"141×91×58", flash:"是", lens:"Canon EF卡口；适合搭配EF 50mm f/1.8", repair:"高", beginner:"高", scene:"旅行、家庭、活动；需要快速对焦和自动化", risk:"电子机身维修资料和零件有限；背盖、闪光灯、马达需测试", rec:"功能现代、轻、对新手友好，成像控制稳定", notRec:"价格受成色和卖家检测影响大；不适合追求全机械手感", status:"规格可核验；价格需App内复核"},
  {name:"Nikon FM2/FM2n", brand:"Nikon", key:"nikonFm2", low:1800, high:3500, af:"否", ae:"否（仅测光提示）", wind:"是", weight:540, size:"142.5×90×60.5", flash:"否（外接闪光灯）", lens:"Nikon F卡口；AI/AI-S手动镜头选择多", repair:"中", beginner:"中", scene:"风光、街拍、纪实；喜欢全手动和机械可靠性", risk:"快门帘、测光、闪光同步和机身磕碰需检；热门型号易溢价", rec:"机械快门、耐用、学习曝光基本功很合适", notRec:"全手动容错低；正常可用机价格较高", status:"规格可核验；价格需App内复核"},
  {name:"Nikon FE2", brand:"Nikon", key:"nikonFe2", low:1300, high:2500, af:"否", ae:"是（光圈优先）", wind:"是", weight:550, size:"142×90.5×57.5", flash:"否（外接闪光灯）", lens:"Nikon F卡口；AI/AI-S镜头适配广", repair:"中高", beginner:"中", scene:"旅行、街拍；希望自动曝光与手动曝光兼顾", risk:"电子快门和测光依赖电池；高速快门和曝光锁需测试", rec:"比FM2更易获得稳定曝光，同时保留手动体验", notRec:"电子故障维修难度高于FM2", status:"规格可核验；价格需App内复核"},
  {name:"Nikon F3", brand:"Nikon", key:"nikonF3", low:1500, high:3000, af:"否", ae:"是（光圈优先）", wind:"是", weight:715, size:"148.5×96.5×65.5", flash:"否（外接闪光灯）", lens:"Nikon F卡口；AI/AI-S镜头资源丰富", repair:"高", beginner:"中", scene:"人文、棚拍、长期使用；重视专业机身操控", risk:"LCD、测光、电子快门和底部电池盒老化；机身较重", rec:"专业操控、取景器信息完整、耐用性好", notRec:"体积重量大；维修成本和检测要求高", status:"规格可核验；价格需App内复核"},
  {name:"Nikon F100", brand:"Nikon", key:"nikonF100", low:700, high:1600, af:"是", ae:"是（P/A/S/M）", wind:"否（电机过片）", weight:785, size:"155×113×66", flash:"否（外接闪光灯）", lens:"Nikon F卡口；兼容大量AF-D镜头", repair:"高", beginner:"高", scene:"运动、活动、旅行；需要快速AF和自动曝光", risk:"背盖黏化、电子故障、对焦和电池触点需检查", rec:"功能接近专业数码单反，二手价格相对低", notRec:"较重且电子化；故障后维修不如机械机直观", status:"规格可核验；价格需App内复核"},
  {name:"Nikon F80/N80", brand:"Nikon", key:"nikonF80", low:200, high:600, af:"是", ae:"是（P/A/S/M）", wind:"否（电机过片）", weight:515, size:"141.5×98×53.5", flash:"是", lens:"Nikon F卡口；适合AF-D镜头", repair:"高", beginner:"高", scene:"家庭、旅行、活动；预算有限但想用AF", risk:"电子机身老化、胶片仓和电池触点需检查", rec:"便宜、轻、自动化程度高、带内闪", notRec:"塑料机身和电子件老化，收藏价值低", status:"规格可核验；价格需App内复核"},
  {name:"Pentax K1000", brand:"Pentax", key:"pentaxK1000", low:1000, high:2000, af:"否", ae:"否（仅测光提示）", wind:"是", weight:625, size:"143×92×50", flash:"否（外接闪光灯）", lens:"Pentax K卡口；SMC手动镜头丰富", repair:"中", beginner:"中", scene:"摄影课、街拍、风光；学习测光和手动曝光", risk:"测光表、电池仓、反光镜缓冲海绵和快门需检查", rec:"结构直观、手动学习路径清晰、镜头资源好", notRec:"热门标签带来溢价；并非所有版本都同样耐用", status:"规格可核验；价格需App内复核"},
  {name:"Pentax MX", brand:"Pentax", key:"pentaxMx", low:900, high:1800, af:"否", ae:"否（仅测光提示）", wind:"是", weight:495, size:"135.5×82.5×49.5", flash:"否（外接闪光灯）", lens:"Pentax K卡口；体积小，适合SMC定焦镜头", repair:"中高", beginner:"中", scene:"轻装街拍、旅行、风光；想要小型机械单反", risk:"测光、电容、快门速度准确性和过片机构需检测", rec:"小巧、取景明亮、机械手感好", notRec:"内部结构紧凑，维修不一定比K1000简单", status:"规格可核验；价格需App内复核"},
  {name:"Pentax ME Super", brand:"Pentax", key:"pentaxMeSuper", low:400, high:900, af:"否", ae:"是（光圈优先）", wind:"是", weight:460, size:"131.5×83×49.5", flash:"否（外接热靴）", lens:"Pentax K卡口；SMC-M镜头匹配好", repair:"中高", beginner:"高", scene:"旅行、日常、入门；希望机身小且有自动曝光", risk:"电子快门和按键触点老化；低温、电池状态影响较明显", rec:"轻便、价格低、光圈优先容易上手", notRec:"电子故障不易自行处理；不适合无电拍摄", status:"规格可核验；价格需App内复核"},
  {name:"Pentax MZ-5/ZX-5", brand:"Pentax", key:"pentaxMz5", low:300, high:800, af:"是", ae:"是（P/A/S/M）", wind:"否（电机过片）", weight:515, size:"147×93×68.5", flash:"是", lens:"Pentax K卡口；兼容AF和大量手动K镜头", repair:"高", beginner:"高", scene:"旅行、家庭、日常；希望AF、内闪和自动曝光", risk:"塑料齿轮、内闪、胶片仓和电子件老化；维修价值需评估", rec:"功能丰富、便宜、带内闪，适合自动化入门", notRec:"机身可靠性和维修性不如机械机", status:"规格可核验；价格需App内复核"},
  {name:"Olympus OM-1", brand:"Olympus", key:"olympusOm1", low:900, high:1800, af:"否", ae:"否（仅测光提示）", wind:"是", weight:510, size:"136×83×50", flash:"否（外接闪光灯）", lens:"Olympus OM卡口；Zuiko镜头小巧", repair:"中", beginner:"中", scene:"旅行、人文、风光；追求轻巧机械单反", risk:"老式电池替代、测光漂移、海绵老化和棱镜腐蚀需检查", rec:"小巧、安静、镜头轻，适合长期随身携带", notRec:"老机测光和棱镜问题可能增加维修成本", status:"规格可核验；价格需App内复核"},
  {name:"Olympus OM-2/OM-2n", brand:"Olympus", key:"olympusOm2", low:1200, high:2400, af:"否", ae:"是（光圈优先）", wind:"是", weight:520, size:"136×83×50", flash:"否（外接闪光灯）", lens:"Olympus OM卡口；Zuiko定焦镜头资源好", repair:"高", beginner:"中", scene:"旅行、人文、逆光；需要更稳定的自动曝光", risk:"电子快门、测光、TTL闪光电路和棱镜需检测", rec:"轻巧且自动曝光优秀，适合复杂光线", notRec:"维修和检测要求高，故障机不适合新手接手", status:"规格可核验；价格需App内复核"},
  {name:"Olympus OM-10", brand:"Olympus", key:"olympusOm10", low:400, high:900, af:"否", ae:"是（光圈优先）", wind:"是", weight:430, size:"135×83×50", flash:"否（外接闪光灯）", lens:"Olympus OM卡口；可加手动适配器", repair:"中高", beginner:"高", scene:"入门、旅行、日常；主要使用自动曝光", risk:"电子快门和测光依赖电池；手动适配器容易缺失", rec:"轻、便宜、光圈优先直观，镜头可逐步升级", notRec:"无手动适配器时控制范围有限；电子故障难修", status:"规格可核验；价格需App内复核"},
  {name:"Olympus μ[mju:]-II", brand:"Olympus", key:"olympusMju2", low:2000, high:4500, af:"是", ae:"是（程序自动）", wind:"否（电机过片）", weight:155, size:"109.5×59×34", flash:"是", lens:"固定35mm f/2.8镜头；不可换镜头", repair:"高", beginner:"高", scene:"旅行、聚会、随身记录；追求小巧和快速拍摄", risk:"镜头滑盖、AF、闪光灯、液晶和漏光问题；热门机溢价明显", rec:"极轻便、AF+内闪+自动过片，几乎零学习成本", notRec:"价格高且电子故障难修；无法换镜头或手动控曝", status:"规格可核验；价格需App内复核"},
  {name:"Minolta X-700", brand:"Minolta", key:"minoltaX700", low:800, high:1600, af:"否", ae:"是（P/A/M）", wind:"是", weight:505, size:"137×89×51.5", flash:"否（外接闪光灯）", lens:"Minolta MD卡口；Rokkor定焦镜头性价比高", repair:"高", beginner:"高", scene:"人文、旅行、人像；想要程序/光圈优先与手动", risk:"电容、电子快门、测光和过片机构老化", rec:"模式完整、取景器好、镜头便宜，学习曲线平缓", notRec:"热门型号价格受维修和成色影响大", status:"规格可核验；价格需App内复核"},
  {name:"Yashica Electro 35 GSN/GTN", brand:"Yashica", key:"yashicaElectro", low:700, high:1500, af:"否（联动测距手动对焦）", ae:"是（光圈优先）", wind:"是", weight:580, size:"138×75×45", flash:"否（外接热靴/闪光）", lens:"固定45mm f/1.7 Yashinon；不可换镜头", repair:"高", beginner:"中", scene:"街拍、人文、夜景；喜欢旁轴取景和大光圈", risk:"电池替代、Pad of Death、测距对焦、漏光和电子快门需检", rec:"镜头明亮、旁轴体验独特、自动曝光操作简单", notRec:"老电子旁轴维修依赖经验；固定镜头限制题材", status:"规格可核验；价格需App内复核"},
];

for (const r of rows) {
  const q = `${r.name} 胶片相机`;
  const source = `规格：${specs[r.key]}；公开行情：${marketRefs[r.key]}；平台复核入口：闲鱼 ${goofishUrl(q)}；淘宝 ${taobaoUrl(q)}`;
  r.source = source;
  r.date = updateDate;
}

const workbook = Workbook.create();
const dataSheet = workbook.worksheets.add("相机数据");
const noteSheet = workbook.worksheets.add("查询说明");
const summarySheet = workbook.worksheets.add("概览");

const navy = "#1F4E78";
const blue = "#D9EAF7";
const paleBlue = "#EEF5FB";
const gold = "#FFF2CC";
const green = "#E2F0D9";
const red = "#FCE4D6";
const grey = "#F2F2F2";
const border = "#B7C9D6";
const text = "#1F2937";

dataSheet.showGridLines = false;
dataSheet.getRange("A1:U1").merge();
dataSheet.getRange("A1").values = [["胶片机使用情况｜首版真实资料表（20台）"]];
dataSheet.getRange("A1:U1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 }, horizontalAlignment: "center", verticalAlignment: "center" };
dataSheet.getRange("A1:U1").format.rowHeight = 30;
dataSheet.getRange("A2:U2").merge();
dataSheet.getRange("A2").values = [["口径：人民币二手市场常见可用机/常见套机参考区间；排除故障机、未测试机、收藏级/纪念版和明显低价引流盘。价格不是固定报价，购买前请点击来源并在App内复核。"]];
dataSheet.getRange("A2:U2").format = { fill: gold, font: { color: "#7F6000", italic: true, size: 10 }, wrapText: true, verticalAlignment: "center" };
dataSheet.getRange("A2:U2").format.rowHeight = 34;

const headers = ["相机名称","品牌","价格区间（元）","价格下限（元）","价格上限（元）","是否自动对焦","是否支持自动曝光","是否需要手动过片","机身重量（g）","体积（宽×高×厚 mm）","是否自带闪光灯","镜头情况","维修难度","新手友好度","适合场景","使用风险","推荐理由","不推荐理由","数据来源","数据更新时间","数据核验状态"];
dataSheet.getRange("A4:U4").values = [headers];
dataSheet.getRange("A4:U4").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 10 }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: "#FFFFFF" } };
dataSheet.getRange("A4:U4").format.rowHeight = 42;

const values = rows.map((r) => [
  r.name, r.brand, `¥${r.low.toLocaleString("zh-CN")}–¥${r.high.toLocaleString("zh-CN")}`, r.low, r.high,
  r.af, r.ae, r.wind, r.weight, r.size, r.flash, r.lens, r.repair, r.beginner,
  r.scene, r.risk, r.rec, r.notRec, r.source, r.date, r.status,
]);
dataSheet.getRange(`A5:U${4 + values.length}`).values = values;
dataSheet.getRange(`A5:U${4 + values.length}`).format = { font: { color: text, size: 9 }, verticalAlignment: "top", wrapText: true, borders: { preset: "inside", style: "thin", color: border } };
dataSheet.getRange(`A5:U${4 + values.length}`).format.rowHeight = 86;
dataSheet.getRange(`A5:U${4 + values.length}`).format.borders = { insideHorizontal: { style: "thin", color: border }, insideVertical: { style: "thin", color: border }, bottom: { style: "thin", color: border } };
for (let i = 5; i <= 4 + values.length; i++) {
  if (i % 2 === 0) dataSheet.getRange(`A${i}:U${i}`).format.fill = paleBlue;
}
dataSheet.getRange(`D5:E${4 + values.length}`).format.numberFormat = "¥#,##0";
dataSheet.getRange(`I5:I${4 + values.length}`).format.numberFormat = "#,##0";
dataSheet.getRange(`T5:T${4 + values.length}`).format.numberFormat = "yyyy-mm-dd";
dataSheet.getRange(`A5:B${4 + values.length}`).format.font = { bold: true, color: text, size: 9 };
dataSheet.getRange(`D5:E${4 + values.length}`).format.horizontalAlignment = "right";
dataSheet.getRange(`I5:I${4 + values.length}`).format.horizontalAlignment = "right";
dataSheet.getRange(`F5:H${4 + values.length}`).format.horizontalAlignment = "center";
dataSheet.getRange(`K5:N${4 + values.length}`).format.horizontalAlignment = "center";
dataSheet.getRange(`T5:U${4 + values.length}`).format.horizontalAlignment = "center";

const table = dataSheet.tables.add(`A4:U${4 + values.length}`, true, "FilmCameraData");
table.showFilterButton = true;
table.showBandedRows = true;
dataSheet.freezePanes.freezeRows(4);
dataSheet.freezePanes.freezeColumns(2);

// Useful validation lists for future edits.
dataSheet.getRange(`F5:H${4 + values.length}`).dataValidation = { rule: { type: "list", values: ["是", "否"] } };
dataSheet.getRange(`K5:K${4 + values.length}`).dataValidation = { rule: { type: "list", values: ["是", "否", "否（外接热靴）"] } };
dataSheet.getRange(`M5:N${4 + values.length}`).dataValidation = { rule: { type: "list", values: ["低", "中", "中高", "高"] } };
dataSheet.getRange(`U5:U${4 + values.length}`).dataValidation = { rule: { type: "list", values: ["规格可核验；价格需App内复核", "已由用户二次核对", "待补充来源"] } };
dataSheet.getRange(`M5:M${4 + values.length}`).conditionalFormats.add("containsText", { text: "高", format: { fill: red, font: { color: "#9C0006", bold: true } } });
dataSheet.getRange(`N5:N${4 + values.length}`).conditionalFormats.add("containsText", { text: "高", format: { fill: green, font: { color: "#006100", bold: true } } });
dataSheet.getRange(`N5:N${4 + values.length}`).conditionalFormats.add("containsText", { text: "中", format: { fill: gold, font: { color: "#7F6000" } } });
dataSheet.getRange(`U5:U${4 + values.length}`).conditionalFormats.add("containsText", { text: "需App内复核", format: { fill: gold, font: { color: "#7F6000", bold: true } } });

const widths = { A:18, B:10, C:15, D:12, E:12, F:12, G:15, H:14, I:12, J:18, K:14, L:28, M:10, N:10, O:24, P:30, Q:30, R:30, S:58, T:13, U:20 };
for (const [col, width] of Object.entries(widths)) dataSheet.getRange(`${col}:${col}`).format.columnWidth = width;

// Overview sheet
summarySheet.showGridLines = false;
summarySheet.getRange("A1:H1").merge();
summarySheet.getRange("A1").values = [["首版数据概览与核验提醒"]];
summarySheet.getRange("A1:H1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 }, horizontalAlignment: "center", verticalAlignment: "center" };
summarySheet.getRange("A1:H1").format.rowHeight = 30;
summarySheet.getRange("A3:B8").values = [
  ["指标", "数值"],
  ["相机数量", null],
  ["品牌数量", null],
  ["支持自动对焦", null],
  ["支持自动曝光", null],
  ["价格需App内复核", null],
];
summarySheet.getRange("A3:B3").format = { fill: blue, font: { bold: true, color: text }, horizontalAlignment: "center", borders: { preset: "all", style: "thin", color: border } };
summarySheet.getRange("A4:A8").format = { fill: paleBlue, font: { bold: true, color: text }, borders: { preset: "all", style: "thin", color: border } };
summarySheet.getRange("B4:B8").formulas = [["=COUNTA('相机数据'!A5:A24)"],["=COUNTA(UNIQUE('相机数据'!B5:B24))"],["=COUNTIF('相机数据'!F5:F24,\"是\")"],["=COUNTIF('相机数据'!G5:G24,\"<>否（仅测光提示）\")"],["=COUNTIF('相机数据'!U5:U24,\"规格可核验；价格需App内复核\")"]];
summarySheet.getRange("B4:B8").format = { fill: "#FFFFFF", font: { bold: true, color: navy, size: 14 }, horizontalAlignment: "center", borders: { preset: "all", style: "thin", color: border }, numberFormat: "#,##0" };

summarySheet.getRange("D3:E3").values = [["品牌", "台数"]];
summarySheet.getRange("D3:E3").format = { fill: blue, font: { bold: true, color: text }, horizontalAlignment: "center", borders: { preset: "all", style: "thin", color: border } };
summarySheet.getRange("D4:D9").values = [["Canon"],["Nikon"],["Pentax"],["Olympus"],["Minolta"],["Yashica"]];
summarySheet.getRange("E4:E9").formulas = [["=COUNTIF('相机数据'!B5:B24,D4)"],["=COUNTIF('相机数据'!B5:B24,D5)"],["=COUNTIF('相机数据'!B5:B24,D6)"],["=COUNTIF('相机数据'!B5:B24,D7)"],["=COUNTIF('相机数据'!B5:B24,D8)"],["=COUNTIF('相机数据'!B5:B24,D9)"]];
summarySheet.getRange("D4:E9").format = { borders: { preset: "all", style: "thin", color: border }, font: { color: text }, horizontalAlignment: "center" };
summarySheet.getRange("D4:D9").format.fill = paleBlue;

summarySheet.getRange("A11:H11").merge();
summarySheet.getRange("A11").values = [["核验提醒"]];
summarySheet.getRange("A11:H11").format = { fill: gold, font: { bold: true, color: "#7F6000" }, horizontalAlignment: "left" };
summarySheet.getRange("A12:H15").merge(true);
summarySheet.getRange("A12:A15").values = [
  ["1. 规格字段优先采用厂商资料、原厂说明或长期维护的相机资料页；重量和体积按机身、通常不含镜头/电池的口径整理，具体版本可能有小差异。"],
  ["2. 价格区间是正常可用机/常见套机的参考带，不是单一报价；同一型号的成色、是否保修、镜头型号、是否整备会显著影响价格。"],
  ["3. 淘宝/闲鱼页面动态、登录和个性化明显，工作簿保留检索入口而不是伪造稳定商品页；购买前应按说明页步骤再抽样核对。"],
  ["4. 数据更新时间是本次整理日期：2026-07-26。若后续价格变化，优先更新价格下限/上限、价格区间、行情来源和更新时间。"],
];
summarySheet.getRange("A12:H15").format = { fill: "#FFFDF2", font: { color: text, size: 10 }, wrapText: true, verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#E6D8A8" } };
summarySheet.getRange("A12:H15").format.rowHeight = 34;
summarySheet.getRange("A17:H17").merge();
summarySheet.getRange("A17").values = [["字段说明与筛选建议：先按新手友好度、维修难度和使用风险筛选，再比较价格；不要仅按最低价购买未测试机。"]];
summarySheet.getRange("A17:H17").format = { fill: green, font: { color: "#006100", italic: true }, wrapText: true, verticalAlignment: "center" };
summarySheet.getRange("A17:H17").format.rowHeight = 28;
summarySheet.getRange("A:A").format.columnWidth = 24;
summarySheet.getRange("B:B").format.columnWidth = 14;
summarySheet.getRange("C:C").format.columnWidth = 4;
summarySheet.getRange("D:D").format.columnWidth = 16;
summarySheet.getRange("E:E").format.columnWidth = 12;
summarySheet.getRange("F:H").format.columnWidth = 16;

// Query process sheet
noteSheet.showGridLines = false;
noteSheet.getRange("A1:H1").merge();
noteSheet.getRange("A1").values = [["查询全过程、价格口径与复核入口"]];
noteSheet.getRange("A1:H1").format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 16 }, horizontalAlignment: "center", verticalAlignment: "center" };
noteSheet.getRange("A1:H1").format.rowHeight = 30;

noteSheet.getRange("A3:B8").values = [
  ["项目", "本次口径"],
  ["首版范围", "20台常见35mm胶片机，覆盖手动单反、自动曝光单反、自动对焦单反、旁轴和便携机"],
  ["价格单位", "人民币；区间以正常可用、非故障、非收藏级、机身或常见套机为主"],
  ["观察日期", updateDate],
  ["排除项", "故障机、未测试机、零件机、拆修痕迹明显、纪念版/限量版、价格明显偏离市场的引流盘"],
  ["真实性边界", "规格可以通过资料页核验；平台价格受登录、地区、成色和个性化影响，必须把区间理解为可审计的市场参考，不把检索入口当成成交数据库"],
];
noteSheet.getRange("A3:B3").format = { fill: blue, font: { bold: true, color: text }, horizontalAlignment: "center", borders: { preset: "all", style: "thin", color: border } };
noteSheet.getRange("A4:A8").format = { fill: paleBlue, font: { bold: true, color: text }, borders: { preset: "all", style: "thin", color: border }, verticalAlignment: "top" };
noteSheet.getRange("B4:B8").format = { wrapText: true, font: { color: text }, borders: { preset: "all", style: "thin", color: border }, verticalAlignment: "top" };
noteSheet.getRange("B6").format.numberFormat = "yyyy-mm-dd";
noteSheet.getRange("A4:B8").format.rowHeight = 42;

noteSheet.getRange("A10:H10").merge();
noteSheet.getRange("A10").values = [["一、我实际采用的查询流程"]];
noteSheet.getRange("A10:H10").format = { fill: blue, font: { bold: true, color: text } };
noteSheet.getRange("A11:D16").values = [
  ["步骤", "具体动作", "记录到哪里", "复核要点"],
  ["1", "先列出型号清单，按品牌与操控类型分组，避免一开始凭印象编数据。", "主数据表20行；概览页统计", "确认型号不是同名数码机或不同代际混淆"],
  ["2", "查规格：先看厂商资料/原厂说明，再用长期维护的相机资料页交叉确认。", "相机数据→数据来源", "重量、体积要注明是机身口径；自动曝光与自动对焦不能混为一谈"],
  ["3", "查行情：用型号+胶片相机/机身/套机/已测试等关键词，在公开二手市场和拍卖页面观察价格带。", "价格下限、价格上限、行情来源", "把正常可用机与故障机、收藏级分开"],
  ["4", "做平台复核入口：为每台相机生成淘宝和闲鱼的型号检索链接，便于你在登录后的实时页面抽样检查。", "数据来源；查询明细表", "平台页面会变动，需记录复核当天看到的最低/中位/最高有效样本"],
  ["5", "把结果整理为价格区间，而不是伪造一个精确成交价；同时写使用风险、维修难度和推荐/不推荐理由。", "主数据表全部字段", "购买判断不能只看价格"],
];
noteSheet.getRange("A11:D11").format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", wrapText: true };
noteSheet.getRange("A12:D16").format = { font: { color: text, size: 10 }, wrapText: true, verticalAlignment: "top", borders: { preset: "all", style: "thin", color: border } };
noteSheet.getRange("A12:A16").format = { fill: paleBlue, horizontalAlignment: "center", verticalAlignment: "top", borders: { preset: "all", style: "thin", color: border } };
noteSheet.getRange("A11:D16").format.rowHeight = 52;

noteSheet.getRange("A18:H18").merge();
noteSheet.getRange("A18").values = [["二、来源分层与我能否直接核验"]];
noteSheet.getRange("A18:H18").format = { fill: blue, font: { bold: true, color: text } };
noteSheet.getRange("A19:C23").values = [
  ["层级", "用途", "本次处理"],
  ["A｜原厂/原始资料", "确认机型规格、尺寸、重量、功能", "Canon Camera Museum、Nikon官方规格、Olympus官方新闻稿等"],
  ["B｜长期维护资料页", "补齐版本差异、镜头/维修风险和使用细节", "Camera-Wiki、Wikipedia、Pentax Forums、CameraWorth等"],
  ["C｜公开二手/拍卖行情", "观察当前价格带和成色溢价", "Yahoo拍卖公开搜索、CameraWorth/UsedLens等价格页；部分页面展示的是挂牌或拍卖记录"],
  ["D｜淘宝/闲鱼实时复核", "你在中国平台内核对实时供给与价格", "工作簿为每台相机保留搜索入口；由于登录和动态页面限制，本次不把无法稳定抓取的页面冒充为已核验成交样本"],
];
noteSheet.getRange("A19:C19").format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
noteSheet.getRange("A20:C23").format = { wrapText: true, verticalAlignment: "top", borders: { preset: "all", style: "thin", color: border }, font: { color: text, size: 10 } };
noteSheet.getRange("A20:A23").format.fill = paleBlue;
noteSheet.getRange("A19:C23").format.rowHeight = 42;

noteSheet.getRange("A25:H25").merge();
noteSheet.getRange("A25").values = [["三、逐台平台复核入口与公开行情来源"]];
noteSheet.getRange("A25:H25").format = { fill: blue, font: { bold: true, color: text } };
noteSheet.getRange("A26:E26").values = [["相机名称","检索关键词","闲鱼复核入口","淘宝复核入口","公开行情/规格来源"]];
noteSheet.getRange("A26:E26").format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", wrapText: true };
const detailRows = rows.map(r => [r.name, `${r.name} 胶片相机`, goofishUrl(`${r.name} 胶片相机`), taobaoUrl(`${r.name} 胶片相机`), `${specs[r.key]}；${marketRefs[r.key]}`]);
noteSheet.getRange(`A27:E${26 + detailRows.length}`).values = detailRows;
noteSheet.getRange(`A27:E${26 + detailRows.length}`).format = { font: { color: text, size: 9 }, wrapText: true, verticalAlignment: "top", borders: { preset: "all", style: "thin", color: border } };
noteSheet.getRange(`A27:E${26 + detailRows.length}`).format.rowHeight = 56;
noteSheet.getRange(`A27:A${26 + detailRows.length}`).format.fill = paleBlue;
noteSheet.getRange("A:A").format.columnWidth = 22;
noteSheet.getRange("B:B").format.columnWidth = 26;
noteSheet.getRange("C:D").format.columnWidth = 42;
noteSheet.getRange("E:E").format.columnWidth = 58;
noteSheet.getRange("F:H").format.columnWidth = 12;
noteSheet.freezePanes.freezeRows(26);

noteSheet.getRange("A49:H49").merge();
noteSheet.getRange("A49").values = [["四、你检查价格真实性时的建议"]];
noteSheet.getRange("A49:H49").format = { fill: gold, font: { bold: true, color: "#7F6000" } };
noteSheet.getRange("A50:H53").merge(true);
noteSheet.getRange("A50:A53").values = [
  ["1. 先在闲鱼按“最新发布/价格从低到高/验货宝”交替排序，排除未测试和零件机，再记录5–10条正常可用样本。"],
  ["2. 在淘宝按同型号+“已测试/整备/保修”搜索，分开机身、带普通定焦镜头、带高级镜头三种口径。"],
  ["3. 用有效样本的中间带更新价格下限/上限，不要把最低的引流盘或最高的收藏级当成市场价格。"],
  ["4. 若实际看到的价格与表格差异超过约20%，优先相信你当天平台内同成色样本，并把来源和更新时间同步改掉。"],
];
noteSheet.getRange("A50:H53").format = { fill: "#FFFDF2", font: { color: text, size: 10 }, wrapText: true, verticalAlignment: "center", borders: { preset: "all", style: "thin", color: "#E6D8A8" } };
noteSheet.getRange("A50:H53").format.rowHeight = 30;

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

const check = await workbook.inspect({ kind: "table", range: "相机数据!A1:U24", include: "values,formulas", tableMaxRows: 5, tableMaxCols: 21, tableMaxCellChars: 80 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(errors.ndjson);
for (const sheetName of ["概览", "查询说明", "相机数据"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}
console.log(`EXPORTED ${outputPath}`);
