const Canvas = require('canvas')
const fs = require('fs')
// const math = require('math')

let filename = "fishtest2.png"

let cs = Canvas.createCanvas(600, 600)

let ctx = cs.getContext('2d')

let cx = cs.width
let cy = cs.height

//グローバルパラメータの初期設定
let calcOn = false;

let dt = 0.2;
let ds = 0.8;

let pActAct = 0.08,
  pInhAct = -0.08,
  pActC = 0.1;
let pActInh = 0.11,
  pInhInh = 0,
  pInhC = -0.15;
let pActLimit = 0.2,
  pInhLimit = 0.5
let diffConstA = 0.02;
diffConstI = 0.5;
let decayConstA = 0.03,
  decayConstI = 0.06;

//反応と拡散のパラメータの設定
let parameterSet = new Array(100);
for (let i = 0; i < 20; i++) {
  parameterSet[i] = new Array(20);
}

//preset parameter sets
parameterSet[0] = [0.08, -0.08, 0.1, 0.11, 0, -0.15, 0.2, 0.5, 0.02, 0.5, 0.03, 0.06];
parameterSet[1] = [0.08, -0.08, 0.01, 0.11, 0, -0.15, 0.2, 0.5, 0.02, 0.5, 0.03, 0.06];
parameterSet[2] = [0.08, -0.08, 0.2, 0.11, 0, -0.15, 0.2, 0.5, 0.02, 0.5, 0.03, 0.06];
parameterSet[3] = [0.08, -0.08, 0, 0.08, 0, -0.13, 0.9, 0.4, 0.015, 0.09, 0.03, 0.019];
parameterSet[4] = [0.08, -0.092, 0.0, 0.06, 0, -0.15, 0.2, 0.1, 0.02, 0.25, 0.03, 0.03];
parameterSet[5] = [0.09, -0.08, 0, 0.1, 0, -0.15, 0.5, 0.5, 0.01, 0.01, 0.03, 0.03];
parameterSet[6] = [0.08, -0.08, 0, 0.06, 0, -0.1, 0.2, 0.5, 0.04, 0.5, 0.03, 0.06];
parameterSet[7] = [0.09, -0.08, 0, 0.06, 0, -0.15, 0.2, 0.5, 0.01, 0.01, 0.03, 0.008];
parameterSet[8] = [0.09, -0.08, 0, 0.06, 0, -0.19, 0.2, 0.5, 0.01, 0.03, 0.03, 0.03];
parameterSet[9] = [0.1, -0.08, 0, 0.11, 0, -0.15, 0.2, 0.5, 0.04, 0.2, 0.03, 0.02];

//描画に関する変数の定義と数値の代入
let fieldSize = 100; //場の大きさ
let cellSize = 6; //1細胞の大きさ
// 配列の定義
let actConc = new Array(100);
let inhConc = new Array(100);
let actDiffArray = new Array(100);
let inhDiffArray = new Array(100);
for (let i = 0; i < 100; i++) {
  actConc[i] = new Array(100);
  inhConc[i] = new Array(100);
  actDiffArray[i] = new Array(100);
  inhDiffArray[i] = new Array(100);
}

// button操作時に呼び出す関数の設定
// document.getElementById("runButton").addEventListener("click", handleRunButton);
// document.getElementById("stopButton").addEventListener("click", handleStopButton);
// document.getElementById("randomizeButton").addEventListener("click", handleRandomButton);
// document.getElementById("clearButton").addEventListener("click", handleClearButton);
// document.getElementById("pointsButton").addEventListener("click", handlePointsButton);
// document.getElementById("xxx").addEventListener("click", changeParameterSet);

//ペンのON-offと初期値の変数定義
let drawing = false;
let penDensity = 100;
let penSize = 1;

/* USELESS FEATURE */

//お絵描き用の要素取得 
// cs.addEventListener('mousedown', function(e) {
//   drawing = true;
//   let rect = e.target.getBoundingClientRect();
//   let x = e.clientX - rect.left;
//   let px=Math.floor(x/cellSize);
//   let y = e.clientY - rect.top;
//   let py=Math.floor(y/cellSize);
//   pendrawing(px,py);
//   });

// cs.addEventListener('mousemove', function(e){
//   if (!drawing){
//     return
//   };
//   let rect = e.target.getBoundingClientRect();
//   let x = e.clientX - rect.left;
//   let px=Math.floor(x/cellSize);
//   let y = e.clientY - rect.top;
//   let py=Math.floor(y/cellSize);
//   pendrawing(px,py);
// });

// cs.addEventListener('mouseup', function() {
//   drawing = false;
// });



// ここからが、メインのプログラム＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

function drawpdf(){

  const buffer = cs.toBuffer('image/png')
  fs.writeFileSync('./fish1.png', buffer)
}

// setInterval(runCalculation, 5);




// ここまで


// 以下、関数の定義＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

// 計算と描画
function runCalculation() {
  if (calcOn == true) {
    drawSkin();
    for (i = 0; i < 50; i++) {
      calcDiffusion();
      calcReaction();
    }
  }
}

function Calculate(){
  drawSkin();
  for (i = 0; i < 50; i++) {
    calcDiffusion();
    calcReaction();
  }
}



// 描画＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

// 1個の細胞を描画する（濃度＊２５５倍）
function drawCell(px, py, c) {
  let x = px * cellSize; // 細胞の座標
  let y = py * cellSize;
  let cc = c * 50;
  if (cc > 240) {
    cc = 240;
  }
  cc = Math.round(cc) // fixing f**king bugs caused by origin code
  ctx.fillStyle = `rgb(${cc},${cc},${cc})`
  // console.log(ctx.fillStyle)
  // console.log("rgb(" + cc + "," + cc + "," + cc + ")")
  ctx.fillRect(x, y, cellSize, cellSize);
}
//皮膚全体を描画する
function drawSkin() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      // console.log(actConc[i][j])
      drawCell(i, j, actConc[i][j]);
    }
  } 
  // ctx.fillStyle = "rgb(123,111,0)"
  // console.log(ctx.fillStyle)
  // ctx.fillRect(0,0,600,600)
}


//配列の操作＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

//配列actConc, inhConcに乱数（0～１）を入力
function randomizeArray() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      actConc[i][j] = 3 * Math.random();
      inhConc[i][j] = 3 * Math.random();
    }
  }
}

//配列actConc, inhConcに0を入力
function clearArray() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      actConc[i][j] = 0;
      inhConc[i][j] = 0;
    }
  }
}

// 拡散計算用の配列の計算
function setDiffusionArray() {
  let root2 = Math.sqrt(2);
  let pp = 2;
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      let rightCell = actConc[(i + 1) % 100][j];
      let leftCell = actConc[(i + 99) % 100][j];
      let upperCell = actConc[i][(j + 1) % 100];
      let lowerCell = actConc[i][(j + 99) % 100];
      // let rightUpper=actConc[(i+1)%100][(j+1)%100]*root2/pp;
      // let leftUpper=actConc[(i+99)%100][(j+1)%100]*root2/pp;
      // let rightDown=actConc[(i+1)%100][(j+99)%100]*root2/pp;
      // let leftDown=actConc[(i+99)%100][(j+99)%100]*root2/pp;
      // actDiffArray[i][j]=diffConstA*dt*(rightCell+leftCell+upperCell+lowerCell+rightUpper+leftUpper+rightDown+leftDown-(4+4*root2/pp)*actConc[i][j])/ds/ds;
      actDiffArray[i][j] = diffConstA * dt * (rightCell + leftCell + upperCell + lowerCell - 4 * actConc[i][j]) / ds / ds;

      rightCell = inhConc[(i + 1) % 100][j];
      leftCell = inhConc[(i + 99) % 100][j];
      upperCell = inhConc[i][(j + 1) % 100];
      lowerCell = inhConc[i][(j + 99) % 100];
      // rightUpper=inhConc[(i+1)%100][(j+1)%100]*root2/pp;
      // leftUpper=inhConc[(i+99)%100][(j+1)%100]*root2/pp;
      // rightDown=inhConc[(i+1)%100][(j+99)%100]*root2/pp;
      // leftDown=inhConc[(i+99)%100][(j+99)%100]*root2/pp;
      // inhDiffArray[i][j]=diffConstI*dt*(rightCell+leftCell+upperCell+lowerCell+rightUpper+leftUpper+rightDown+leftDown-(4+4*root2/pp)*inhConc[i][j])/ds/ds;
      inhDiffArray[i][j] = diffConstI * dt * (rightCell + leftCell + upperCell + lowerCell - 4 * inhConc[i][j]) / ds / ds;
    }
  }
}

//拡散の計算
function calcDiffusion() {
  setDiffusionArray();
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      actConc[i][j] += actDiffArray[i][j];
      inhConc[i][j] += inhDiffArray[i][j];
    }
  }
}

// 反応項の計算
function calcReaction() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      let synAct = pActAct * actConc[i][j] + pInhAct * inhConc[i][j] + pActC;
      if (synAct < 0) {
        synAct = 0;
      }
      if (synAct > pActLimit) {
        synAct = pActLimit;
      }
      let synInh = pActInh * actConc[i][j] + pInhInh * inhConc[i][j] + pInhC;
      if (synInh < 0) {
        synInh = 0;
      }
      if (synInh > pInhLimit) {
        synInh = pInhLimit;
      }
      actConc[i][j] += (-decayConstA * actConc[i][j] + synAct) * dt;
      inhConc[i][j] += (-decayConstI * inhConc[i][j] + synInh) * dt;
    }
  }
}



//ボタンの操作＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

// function handleRunButton() {
//   readParameter();
//   calcOn = true;
// }

// function handleStopButton() {
//   calcOn = false;
// }

// function handleRandomButton() {
//   randomizeArray();
//   drawSkin();
// }

// function handleClearButton() {
//   clearArray();
//   drawSkin();
// }

// function handlePointsButton() {
//   clearArray();
//   for (let i = 0; i < 10; i++) {
//     let xx = Math.round(100 * Math.random());
//     let yy = Math.round(100 * Math.random());
//     actConc[xx][yy] = 5;
//   }
//   drawSkin();
// }


//parameterの値をウインドウから取得
// function readParameter() {
//   let box1 = document.getElementById("pActAct-id").value;
//   pActAct = Number(box1);
//   let box2 = document.getElementById("pInhAct-id").value;
//   pInhAct = Number(box2);
//   let box3 = document.getElementById("pActC-id").value;
//   pActC = Number(box3);
//   let box4 = document.getElementById("pActInh-id").value;
//   pActInh = Number(box4);
//   let box5 = document.getElementById("pInhInh-id").value;
//   pInhInh = Number(box5);
//   let box6 = document.getElementById("pInhC-id").value;
//   pInhC = Number(box6);
//   let box7 = document.getElementById("pActLimit-id").value;
//   pActLimit = Number(box7);
//   let box8 = document.getElementById("pInhLimit-id").value;
//   pInhLimit = Number(box8);
//   let box9 = document.getElementById("diffConstA-id").value;
//   diffConstA = Number(box9);
//   let box10 = document.getElementById("diffConstI-id").value;
//   diffConstI = Number(box10);
//   let box11 = document.getElementById("decayConstA-id").value;
//   decayConstA = Number(box11);
//   let box12 = document.getElementById("decayConstI-id").value;
//   decayConstI = Number(box12);
// }


// paramater change by the preset parameter set
// function changeParameterSet() {
//   const x = document.formParameter.selectParameterSet;
//   const num = x.selectedIndex;
//   pActAct = parameterSet[num][0];
//   pInhAct = parameterSet[num][1];
//   pActC = parameterSet[num][2];
//   pActInh = parameterSet[num][3];
//   pInhInh = parameterSet[num][4];
//   pInhC = parameterSet[num][5];
//   pActLimit = parameterSet[num][6];
//   pInhLimit = parameterSet[num][7];
//   diffConstA = parameterSet[num][8];
//   diffConstI = parameterSet[num][9];
//   decayConstA = parameterSet[num][10];
//   decayConstI = parameterSet[num][11];
//   document.getElementById("pActAct-id").value = parameterSet[num][0];
//   document.getElementById("pInhAct-id").value = parameterSet[num][1];
//   document.getElementById("pActC-id").value = parameterSet[num][2];
//   document.getElementById("pActInh-id").value = parameterSet[num][3];
//   document.getElementById("pInhInh-id").value = parameterSet[num][4];
//   document.getElementById("pInhC-id").value = parameterSet[num][5];
//   document.getElementById("pActLimit-id").value = parameterSet[num][6];
//   document.getElementById("pInhLimit-id").value = parameterSet[num][7];
//   document.getElementById("diffConstA-id").value = parameterSet[num][8];
//   document.getElementById("diffConstI-id").value = parameterSet[num][9];
//   document.getElementById("decayConstA-id").value = parameterSet[num][10];
//   document.getElementById("decayConstI-id").value = parameterSet[num][11];
// }


// //oekaki tool
// function pendrawing(x, y) {
//   for (i = x - penSize; i < x + penSize + 1; i++) {
//     for (j = y - penSize; j < y + penSize + 1; j++) {
//       let px = (i + 100) % 100;
//       let py = (j + 100) % 100;
//       drawCell(px, py, penDensity);
//       actConc[i][j] = 1;
//     }
//   }
// }

randomizeArray()
drawSkin()

// calculate every 5ms

for(let i = 0; i < 1000; i++){
  Calculate()
}

console.log("ttfish")

drawpdf()

