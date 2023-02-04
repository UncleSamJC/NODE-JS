const fs = require("fs");
const readline = require("node:readline");

let classSum = ["colibri-wp-theme"];

let innerMedia = false; //这个FLAG看是否在一个媒体查询中间
let innerClass = false; //这个FLAG用来标识 是否在一个类里面
let dot = 0;

let baseCss = "./tt.css";
let outPutCss = "target.css";

let writerCss = fs.createWriteStream(outPutCss);

let prevLine = "";
let currentLine = "";

async function processLineByLine() {
  const fileStream = fs.createReadStream(baseCss);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    //更新当前行和前一行的值
    prevLine = currentLine;
    currentLine = line;

    //正则表达式匹配 给当前的class前面拼一个点
    let classCurrent = "." + classSum[0];

    let reg1 = new RegExp(classCurrent + " "); //是否包含这个类进行匹配
    let reg2 = /}$/; //找到这个css段的结尾
    let reg3 = /^\@media.*/; //找到媒体查询的开头

    if (reg3.test(line)) {
      innerMedia = true;
      //   console.log(currentLine);
      writerCss.write(currentLine);
    }
    if (reg2.test(line)) {
      dot += 1;
    } else {
      dot = 0;
    }

    if (reg1.test(line)) {
      innerClass = true;
    }

    if (reg2.test(line) && innerClass) {
      innerClass = false;
      //   console.log("}");
      writerCss.write("}" + "\n");
    }

    if (reg1.test(line) || innerClass) {
      // console.log(`Line from file: ${line}`);
      //   console.log(currentLine);
      writerCss.write(currentLine);
    }

    if (dot == 2) {
      console.log("}");
      writerCss.write("}" + "\n");
    }
  }
}

processLineByLine();
