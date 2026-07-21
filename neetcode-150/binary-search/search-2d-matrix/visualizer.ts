import * as blessed from 'blessed';

interface Frame {
  left: number;
  right: number;
  mid: number;
  message: string;
}

function generateFrames(matrix: number[][], target: number): Frame[] {
  const frames: Frame[] = [];
  let m = matrix.length;
  let n = matrix[0].length;
  let left = 0;
  let right = m * n - 1;

  frames.push({
    left, right, mid: -1,
    message: `{center}{bold}=== 2D Matrix Binary Search Visualizer ==={/bold}{/center}\n\nTarget: {cyan-fg}${target}{/cyan-fg}\nColumns (n): ${n}\nRows (m): ${m}\n\nPress {yellow-fg}[Right Arrow]{/yellow-fg} or {yellow-fg}[Space]{/yellow-fg} to step forward.`
  });

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let row = Math.floor(mid / n);
    let column = mid % n;
    
    frames.push({
      left, right, mid,
      message: `Calculated 1D Mid Index: Math.floor((${left} + ${right}) / 2) = {yellow-fg}${mid}{/yellow-fg}\n\n` +
               `{bold}{magenta-fg}--- DEMYSTIFYING THE 2D MAPPING ---{/magenta-fg}{/bold}\n` +
               `We treat the 2D matrix as a flat 1D array. Number of columns (n) = ${n}.\n` +
               `How many full rows of size ${n} fit into index ${mid}? -> Math.floor(${mid} / ${n}) = {cyan-fg}${row}{/cyan-fg} (This is the ROW)\n` +
               `What is the remainder after those full rows? -> ${mid} % ${n} = {cyan-fg}${column}{/cyan-fg} (This is the COLUMN)\n\n` +
               `So, 1D index ${mid} maps to matrix[${row}][${column}] = {bold}${matrix[row][column]}{/bold}.`
    });

    if (matrix[row][column] === target) {
      frames.push({
        left, right, mid,
        message: `{green-bg}{black-fg}Target Found!{/black-fg}{/green-bg} matrix[${row}][${column}] == ${target}.\n\nReturning true.`
      });
      return frames;
    }

    if (matrix[row][column] < target) {
      frames.push({
        left, right, mid,
        message: `matrix[${row}][${column}] (${matrix[row][column]}) < Target (${target}).\nTarget must be to the RIGHT.\n\nMoving Left pointer from ${left} to mid + 1 ({bold}${mid + 1}{/bold}).`
      });
      left = mid + 1;
    } else {
      frames.push({
        left, right, mid,
        message: `matrix[${row}][${column}] (${matrix[row][column]}) > Target (${target}).\nTarget must be to the LEFT.\n\nMoving Right pointer from ${right} to mid - 1 ({bold}${mid - 1}{/bold}).`
      });
      right = mid - 1;
    }

    if (left <= right) {
      frames.push({
        left, right, mid: -1,
        message: `Updated 1D search space bounds: [{cyan-fg}${left}{/cyan-fg}, {magenta-fg}${right}{/magenta-fg}].\nContinuing search...`
      });
    }
  }

  frames.push({
    left, right, mid: -1,
    message: `{red-bg}{white-fg}Target Not Found!{/white-fg}{/red-bg} Left pointer (${left}) crossed Right pointer (${right}).\nReturning false.`
  });

  return frames;
}

function startVisualizer(matrix: number[][], target: number) {
  const frames = generateFrames(matrix, target);
  let currentFrameIdx = 0;
  let m = matrix.length;
  let n = matrix[0].length;

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Search 2D Matrix Visualizer'
  });

  const matrixBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: '60%',
    border: { type: 'line' },
    label: ` {bold}2D Matrix (Target = ${target}){/bold} `,
    tags: true,
    padding: { top: 1, left: 2 },
    style: { border: { fg: 'white' } }
  });

  const logBox = blessed.box({
    top: '60%',
    left: 'center',
    width: '100%',
    height: '40%',
    border: { type: 'line' },
    label: ' {bold}Logs & 2D Math Explanation{/bold} ',
    tags: true,
    padding: { top: 1, left: 4 },
    style: { border: { fg: 'white' }, fg: 'white' }
  });

  screen.append(matrixBox);
  screen.append(logBox);

  const createMatrixGraph = (left: number, right: number, mid: number) => {
    let output = "        ";
    for(let c=0; c<n; c++) output += `    Col ${c}    `;
    output += "\n";

    for (let r = 0; r < m; r++) {
      let borderLine = "      ";
      for (let c = 0; c < n; c++) {
        let idx = r * n + c;
        let colorOn = "", colorOff = "";
        if (idx < left || idx > right) { colorOn = "{grey-fg}"; colorOff = "{/grey-fg}"; }
        else if (idx === mid) { colorOn = "{yellow-bg}{black-fg}"; colorOff = "{/black-fg}{/yellow-bg}"; }
        
        borderLine += `${colorOn}+---------+${colorOff}`;
        if (c < n - 1) borderLine += " ";
      }
      output += borderLine + "\n";

      // 1D Index and Pointers
      let idxLine = "      ";
      for (let c = 0; c < n; c++) {
        let idx = r * n + c;
        let colorOn = "", colorOff = "";
        if (idx < left || idx > right) { colorOn = "{grey-fg}"; colorOff = "{/grey-fg}"; }
        else if (idx === mid) { colorOn = "{yellow-bg}{black-fg}"; colorOff = "{/black-fg}{/yellow-bg}"; }
        
        let ptrStr = "";
        let ptrVisualLen = 0;
        if (idx === mid) {
          if (idx === left && idx === right) { ptrStr = "{cyan-fg}L{/cyan-fg}{black-fg}M{/black-fg}{magenta-fg}R{/magenta-fg}"; ptrVisualLen = 3; }
          else if (idx === left) { ptrStr = "{cyan-fg}L{/cyan-fg}{black-fg}M{/black-fg}"; ptrVisualLen = 2; }
          else if (idx === right) { ptrStr = "{black-fg}M{/black-fg}{magenta-fg}R{/magenta-fg}"; ptrVisualLen = 2; }
          else { ptrStr = "{black-fg}M{/black-fg}"; ptrVisualLen = 1; }
        } else if (idx === left && idx === right) {
          ptrStr = "{cyan-fg}L{/cyan-fg}{magenta-fg}R{/magenta-fg}"; ptrVisualLen = 2;
        } else if (idx === left) {
          ptrStr = "{cyan-fg}L{/cyan-fg}"; ptrVisualLen = 1;
        } else if (idx === right) {
          ptrStr = "{magenta-fg}R{/magenta-fg}"; ptrVisualLen = 1;
        }

        let idxStr = `i:${idx}`;
        let spacesCount = 9 - idxStr.length - ptrVisualLen;
        if (spacesCount < 0) spacesCount = 0;
        
        let idxColor = "{grey-fg}";
        if (idx === mid) idxColor = "{black-fg}";
        else if (idx >= left && idx <= right) idxColor = "{cyan-fg}";
        
        let idxColorOff = idxColor.replace('{', '{/').replace('-fg}', '-fg}').replace('-bg}', '-bg}');
        if (idxColor === '{black-fg}') idxColorOff = '{/black-fg}'; // override for safety
        if (idxColor === '{cyan-fg}') idxColorOff = '{/cyan-fg}';
        if (idxColor === '{grey-fg}') idxColorOff = '{/grey-fg}';

        idxLine += `${colorOn}|${idxColor}${idxStr}${idxColorOff}${' '.repeat(spacesCount)}${ptrStr}|${colorOff}`;
        if (c < n - 1) idxLine += " ";
      }
      output += idxLine + "\n";

      // Matrix Value
      let valLine = ` Row ${r} `;
      for (let c = 0; c < n; c++) {
        let idx = r * n + c;
        let colorOn = "", colorOff = "";
        let valColor = "{white-fg}";
        
        if (idx < left || idx > right) { 
            colorOn = "{grey-fg}"; colorOff = "{/grey-fg}"; valColor = "{grey-fg}"; 
        } else if (idx === mid) { 
            colorOn = "{yellow-bg}{black-fg}"; colorOff = "{/black-fg}{/yellow-bg}"; valColor = "{black-fg}"; 
        } else {
            colorOn = "{white-fg}"; colorOff = "{/white-fg}"; 
        }
        
        let valColorOff = valColor.replace('{', '{/');
        
        let valStr = matrix[r][c].toString();
        let leftPad = Math.floor((9 - valStr.length) / 2);
        let rightPad = 9 - valStr.length - leftPad;
        let formattedVal = ' '.repeat(leftPad) + valColor + valStr + valColorOff + ' '.repeat(rightPad);
        
        valLine += `${colorOn}|${formattedVal}|${colorOff}`;
        if (c < n - 1) valLine += " ";
      }
      output += valLine + "\n";

      // Bottom border
      let bottomBorderLine = "      ";
      for (let c = 0; c < n; c++) {
        let idx = r * n + c;
        let colorOn = "", colorOff = "";
        if (idx < left || idx > right) { colorOn = "{grey-fg}"; colorOff = "{/grey-fg}"; }
        else if (idx === mid) { colorOn = "{yellow-bg}{black-fg}"; colorOff = "{/black-fg}{/yellow-bg}"; }
        
        bottomBorderLine += `${colorOn}+---------+${colorOff}`;
        if (c < n - 1) bottomBorderLine += " ";
      }
      output += bottomBorderLine + "\n";
    }

    return output;
  };

  const renderFrame = () => {
    const frame = frames[currentFrameIdx];
    matrixBox.setContent(createMatrixGraph(frame.left, frame.right, frame.mid));
    logBox.setContent(frame.message);
    screen.render();
  };

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  screen.key(['right', 'space', 'enter'], () => {
    if (currentFrameIdx < frames.length - 1) {
      currentFrameIdx++;
      renderFrame();
    }
  });

  screen.key(['left'], () => {
    if (currentFrameIdx > 0) {
      currentFrameIdx--;
      renderFrame();
    }
  });

  renderFrame();
}

// Typical example for Search 2D Matrix
const matrix = [
  [1,   3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
];
const target = 3;

startVisualizer(matrix, target);
