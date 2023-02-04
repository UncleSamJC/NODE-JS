// let str1 = '<table class="table table-hover">'
// let str2 = 'class="h-navigation_outer h-navigation_overlap colibri-theme-nav-boxed style-2-outer style-local-7-h2-outer">'
// let str3 = '<a class="skip-link screen-reader-text" href="#content">'

const fs = require("fs");
const readline = require("node:readline");

let inputFileName = "./wp.html";
let outputFileName = "log.txt";
let lineNum = 0;

let allClassesSum = ["kk"];

function getClassNames(str2) {
  let start = str2.indexOf("class=");

  let end = str2.indexOf('"', start + 8);

  console.log(start, end);
  lineNum += 1;

  result = str2.substring(start + 7, end);

  return result.split(" ");
}

let writer = fs.createWriteStream(outputFileName);

function writeCG(x) {
  writer.write(x.toString());
  console.log("TotalLine", lineNum);
}

async function processLineByLine(callback) {
  const fileStream = fs.createReadStream(inputFileName);

  let rg = /class=/;

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (rg.test(line)) {
      // console.log(`Line from file: ${line}`);
      // console.log(getClassNames(line))
      allClassesSum.push(...getClassNames(line.trim()));
    }
  }

  callback(allClassesSum);
}

processLineByLine(writeCG);
