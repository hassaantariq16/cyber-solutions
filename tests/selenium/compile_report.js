const markdownpdf = require("markdown-pdf");
const path = require("path");

const srcPath = path.resolve(__dirname, "../../docs/DevOps_Final_Report.md");
const destPath = path.resolve(__dirname, "../../Report.pdf");
const destPathFA23 = path.resolve(__dirname, "../../FA23-BCS-118/Report.pdf");

console.log(`Compiling ${srcPath} to PDF...`);

markdownpdf().from(srcPath).to(destPath, function () {
  console.log(`Report compiled successfully to ${destPath}`);
  
  const fs = require('fs');
  if (fs.existsSync(path.dirname(destPathFA23))) {
    fs.copyFileSync(destPath, destPathFA23);
    console.log(`Report copied to ${destPathFA23}`);
  }
  process.exit(0);
});
