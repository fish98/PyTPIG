/* TTFish 2021.04.01 */

const Canvas = require('canvas')
const fs = require('fs')

let cs = Canvas.createCanvas(600, 600)

let ctx = cs.getContext('2d')

let dt = 0.2;
let ds = 0.8;
// pActAct pInhAct pActInh pInhInh
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

// ここからが、メインのプログラム＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

function drawpdf(pAA, pIA, pAI, pII){
  const buffer = cs.toBuffer('image/png')
  pAA = Number(pAA).toFixed(3) // Dark Magic
  pIA = Number(pAA).toFixed(3)
  pAI = Number(pAA).toFixed(3)
  pII = Number(pAA).toFixed(3)
  fs.writeFileSync(`./Data/${pAA}-${pIA}-${pAI}-${pII}.png`, buffer)
}

// 以下、関数の定義＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

// 計算と描画

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
  ctx.fillRect(x, y, cellSize, cellSize);
}
//皮膚全体を描画するq
function drawSkin() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      drawCell(i, j, actConc[i][j]);
    }
  }
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

// 拡散計算用の配列の計算
function setDiffusionArray() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      let rightCell = actConc[(i + 1) % 100][j];
      let leftCell = actConc[(i + 99) % 100][j];
      let upperCell = actConc[i][(j + 1) % 100];
      let lowerCell = actConc[i][(j + 99) % 100];
      actDiffArray[i][j] = diffConstA * dt * (rightCell + leftCell + upperCell + lowerCell - 4 * actConc[i][j]) / ds / ds;

      rightCell = inhConc[(i + 1) % 100][j];
      leftCell = inhConc[(i + 99) % 100][j];
      upperCell = inhConc[i][(j + 1) % 100];
      lowerCell = inhConc[i][(j + 99) % 100];
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

function Fish(pAA, pIA, pAI, pII){
  randomizeArray()
  drawSkin()
  pActAct = pAA
  pInhAct = pIA
  pActInh = pAI
  pInhInh = pII

  // calculate every 5ms

  for(let i = 0; i < 1000; i++){
    Calculate()
  }

  drawpdf(pAA, pIA, pAI, pII)
  console.log(`Write Image ${pActAct} - ${pInhAct} - ${pActInh} - ${pInhInh} Success`)
}

// Main Function
num = 0
allnum = 16 ** 4
for(let a = 0; a < 16; a++){
  for(let b =  0; b < 16; b++){
    for(let c = 0; c < 16; c++){
      for(let d = 0; d < 16; d++){
        let tmpfishA = 0.01 * a
        let tmpfishB = 0.01 * b - 0.16
        let tmpfishC = 0.01 * c + 0.03
        let tmpfishD = 0.01 * d - 0.08
        Fish(tmpfishA, tmpfishB, tmpfishC, tmpfishD)
        num++
        console.log(`Process Image ${num}.............. Status: ${num/allnum*100}%`)
      }
    }
  }
}

