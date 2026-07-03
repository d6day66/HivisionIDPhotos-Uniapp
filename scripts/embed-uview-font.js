const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const fontPath = path.join(__dirname, "assets", "uview-icon.ttf");
const componentPath = path.join(
  root,
  "node_modules",
  "uview-ui",
  "components",
  "u-icon",
  "u-icon.vue"
);
const remoteFontUrl = "https://at.alicdn.com/t/font_2225171_8kdcwk4po24.ttf";

if (!fs.existsSync(componentPath)) {
  throw new Error(`uView icon component not found: ${componentPath}`);
}

const embeddedFontUrl = `data:font/truetype;base64,${fs
  .readFileSync(fontPath)
  .toString("base64")}`;
const source = fs.readFileSync(componentPath, "utf8");
const occurrences = source.split(remoteFontUrl).length - 1;

if (occurrences === 0) {
  if (source.includes(embeddedFontUrl)) {
    console.log("uView icon font is already embedded.");
    process.exit(0);
  }
  throw new Error("Expected uView icon font URL was not found.");
}

fs.writeFileSync(
  componentPath,
  source.split(remoteFontUrl).join(embeddedFontUrl),
  "utf8"
);
console.log(`Embedded uView icon font in ${occurrences} locations.`);
