import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const files = [
  "E:/Desktop/【重要】秋招/项目经历/excel运营/excel练习/Excel运营产品实战_第1课_VLOOKUP与数据透视表.xlsx",
  "E:/Desktop/【重要】秋招/项目经历/excel运营/excel练习/Excel运营产品实战_第2课_术语与真实场景训练.xlsx",
];

for (const file of files) {
  const input = await FileBlob.load(file);
  const wb = await SpreadsheetFile.importXlsx(input);
  console.log(`FILE\t${file}`);
  const summary = await wb.inspect({
    kind: "workbook,sheet,table",
    maxChars: 12000,
    tableMaxRows: 12,
    tableMaxCols: 16,
    tableMaxCellChars: 100,
  });
  console.log(summary.ndjson);
  const sheets = wb.worksheets.items;
  for (const sheet of sheets) {
    const used = sheet.getUsedRange();
    if (!used) continue;
    console.log(`SHEET\t${sheet.name}\tUSED\t${used.address}`);
    const region = await wb.inspect({
      kind: "region",
      sheetId: sheet.name,
      range: used.address,
      maxChars: 20000,
      tableMaxRows: 30,
      tableMaxCols: 20,
      tableMaxCellChars: 140,
    });
    console.log(region.ndjson);
  }
}
