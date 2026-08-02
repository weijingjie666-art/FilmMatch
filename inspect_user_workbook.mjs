import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "E:/Desktop/胶卷库_扩充版.xlsx";
const outDir = "outputs/workbook-inspect";
await fs.mkdir(outDir, { recursive: true });
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const summary = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 10,
  tableMaxCols: 20,
  tableMaxCellChars: 120,
});
console.log("SUMMARY\n" + summary.ndjson);
const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 5000 });
console.log("SHEETS\n" + sheets.ndjson);
for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  if (!used) continue;
  const region = await workbook.inspect({
    kind: "region",
    sheetId: sheet.name,
    range: used.address,
    maxChars: 20000,
    tableMaxRows: 100,
    tableMaxCols: 30,
    tableMaxCellChars: 200,
  });
  console.log(`REGION ${sheet.name} ${used.address}\n${region.ndjson}`);
  const preview = await workbook.render({ sheetName: sheet.name, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${outDir}/${sheet.name.replaceAll(/[\\/:*?"<>|]/g, "_")}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const filmSheet = workbook.worksheets.getItem("胶卷库");
const filmRows = filmSheet.getRange("A4:R39").values;
await fs.writeFile(`${outDir}/胶卷库-A4-R39.json`, JSON.stringify(filmRows, null, 2), "utf8");
