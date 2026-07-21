import * as blessed from 'blessed';

interface Frame {
  left: number;
  right: number;
  mid: number;
  totalHours: number;
  hoursBreakdown: number[];
  message: string;
}

function generateFrames(piles: number[], h: number): Frame[] {
  let left = 1;
  let right = Math.max(...piles);
  let frames: Frame[] = [];
  
  frames.push({
    left, right, mid: -1, totalHours: 0, hoursBreakdown: [],
    message: "{center}{bold}=== Koko Eating Bananas Visualizer ==={/bold}{/center}\n\nGoal: Find the minimum speed (k) to finish all bananas within " + h + " hours.\n\nPress {yellow-fg}[Right Arrow]{/yellow-fg} or {yellow-fg}[Space]{/yellow-fg} to step forward."
  });

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    let totalHours = 0;
    let hoursBreakdown: number[] = [];
    for (let i = 0; i < piles.length; i++) {
      let hrs = Math.ceil(piles[i] / mid);
      totalHours += hrs;
      hoursBreakdown.push(hrs);
    }

    frames.push({
      left, right, mid, totalHours, hoursBreakdown,
      message: `1. Testing eating speed k = {yellow-fg}${mid}{/yellow-fg} bananas/hour.\n2. Total hours needed = {bold}${totalHours}{/bold} (Target is ${h}).`
    });

    if (totalHours <= h) {
      frames.push({
        left, right, mid, totalHours, hoursBreakdown,
        message: `Total hours (${totalHours}) <= Target (${h}).\n\n{green-fg}Koko can finish in time!{/green-fg}\nBut is there a SLOWER speed that also works?\nLet's search the left half. Moving Right pointer to ${mid - 1}.`
      });
      right = mid - 1;
    } else {
      frames.push({
        left, right, mid, totalHours, hoursBreakdown,
        message: `Total hours (${totalHours}) > Target (${h}).\n\n{red-fg}Koko is too slow!{/red-fg} She won't finish before the guards return.\nShe needs to eat faster. Let's search the right half. Moving Left pointer to ${mid + 1}.`
      });
      left = mid + 1;
    }
  }
  
  frames.push({
    left, right, mid: -1, totalHours: 0, hoursBreakdown: [],
    message: `{green-fg}FINISHED!{/green-fg} The minimum eating speed required is {bold}${left}{/bold} bananas/hour.\n\nPress {yellow-fg}[q]{/yellow-fg} to exit.`
  });

  return frames;
}

function startVisualizer(piles: number[], h: number) {
  const frames = generateFrames(piles, h);
  let currentFrameIdx = 0;
  let maxPile = Math.max(...piles);

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Koko Eating Bananas Visualizer'
  });

  const searchBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: '40%',
    border: { type: 'line' },
    label: ` {bold}Search Space (Speeds k from 1 to ${maxPile}){/bold} `,
    tags: true,
    padding: { top: 1, left: 1 },
    style: { border: { fg: 'white' } }
  });
  
  const calcBox = blessed.box({
    top: '40%',
    left: 'center',
    width: '100%',
    height: '35%',
    border: { type: 'line' },
    label: ' {bold}Bananas & Hours Math{/bold} ',
    tags: true,
    padding: { top: 1, left: 2 },
    style: { border: { fg: 'white' }, fg: 'white' }
  });

  const logBox = blessed.box({
    top: '75%',
    left: 'center',
    width: '100%',
    height: '25%',
    border: { type: 'line' },
    label: ' {bold}Logs & Execution{/bold} ',
    tags: true,
    padding: { top: 1, left: 4 },
    style: { border: { fg: 'white' }, fg: 'white' }
  });

  screen.append(searchBox);
  screen.append(calcBox);
  screen.append(logBox);

  const createSearchGraph = (left: number, right: number, mid: number) => {
    let output = "";
    const itemsPerRow = 20;
    
    for (let start = 1; start <= maxPile; start += itemsPerRow) {
      let end = Math.min(start + itemsPerRow - 1, maxPile);
      
      let ptrLine = " ";
      let topBorder = " ";
      let valLine = " ";
      let botBorder = " ";

      for (let i = start; i <= end; i++) {
        let ptrStr = "   ";
        if (i === mid) {
          if (i === left && i === right) ptrStr = "{cyan-fg}L{/cyan-fg}{yellow-fg}M{/yellow-fg}{magenta-fg}R{/magenta-fg}";
          else if (i === left) ptrStr = "{cyan-fg}L{/cyan-fg} {yellow-fg}M{/yellow-fg}";
          else if (i === right) ptrStr = "{yellow-fg}M{/yellow-fg} {magenta-fg}R{/magenta-fg}";
          else ptrStr = " {yellow-fg}M{/yellow-fg} ";
        } else if (i === left && i === right) {
          ptrStr = "{cyan-fg}L{/cyan-fg} {magenta-fg}R{/magenta-fg}";
        } else if (i === left) ptrStr = " {cyan-fg}L{/cyan-fg} ";
        else if (i === right) ptrStr = " {magenta-fg}R{/magenta-fg} ";
        
        ptrLine += ptrStr + "   ";

        let colorOn = "", colorOff = "";
        if (i < left || i > right) { colorOn = "{grey-fg}"; colorOff = "{/grey-fg}"; }
        else if (i === mid) { colorOn = "{yellow-bg}{black-fg}"; colorOff = "{/black-fg}{/yellow-bg}"; }
        else { colorOn = "{white-fg}"; colorOff = "{/white-fg}"; }

        topBorder += `${colorOn}+---+${colorOff} `;
        let valStr = i.toString().padStart(3, ' ');
        valLine += `${colorOn}|${valStr}|${colorOff} `;
        botBorder += `${colorOn}+---+${colorOff} `;
      }
      
      output += `${ptrLine}\n${topBorder}\n${valLine}\n${botBorder}\n\n`;
    }
    return output;
  };

  const createMathBox = (mid: number, totalHours: number, hoursBreakdown: number[]) => {
    if (mid === -1) return "{grey-fg}Awaiting calculation...{/grey-fg}";

    let out = ` {bold}Speed (k) = ${mid} bananas/hour{/bold}\n\n`;
    out += ` {bold}Pile   Bananas   Calculation         Hours{/bold}\n`;
    out += ` {grey-fg}------------------------------------------{/grey-fg}\n`;
    
    for (let i = 0; i < piles.length; i++) {
      let pileStr = i.toString().padEnd(6, ' ');
      let bananasStr = piles[i].toString().padEnd(9, ' ');
      let calcStr = `Math.ceil(${piles[i].toString().padStart(2, ' ')} / ${mid.toString().padEnd(2, ' ')})`.padEnd(21, ' ');
      let hrsStr = hoursBreakdown[i].toString();
      
      out += `  ${pileStr}${bananasStr}${calcStr} {cyan-fg}${hrsStr}{/cyan-fg}\n`;
    }
    
    out += ` {grey-fg}------------------------------------------{/grey-fg}\n`;
    
    let colorTotal = totalHours <= h ? "{green-fg}" : "{red-fg}";
    
    out += `                        {bold}Total Hours:{/bold}  ${colorTotal}${totalHours}{/}\n`;
    out += `                       {bold}Target Hours:{/bold}  ${h}\n`;
    
    return out;
  };

  const renderFrame = () => {
    const frame = frames[currentFrameIdx];
    searchBox.setContent(createSearchGraph(frame.left, frame.right, frame.mid));
    calcBox.setContent(createMathBox(frame.mid, frame.totalHours, frame.hoursBreakdown));
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

// Example Run
import { getTestCaseNumber } from '../../../utils/cli';

const testCase = getTestCaseNumber();
let piles: number[];
let h: number;

switch (testCase) {
  case 1:
    piles = [3, 6, 7, 11];
    h = 8;
    break;
  case 2:
    piles = [30, 11, 23, 4, 20];
    h = 5;
    break;
  case 3:
    piles = [30, 11, 23, 4, 20];
    h = 6;
    break;
  case 4:
    // A smaller test case for quick execution
    piles = [10, 20, 30];
    h = 6;
    break;
  default:
    console.log(`\x1b[31mTest case ${testCase} not found. Running default test case 1.\x1b[0m`);
    piles = [3, 6, 7, 11];
    h = 8;
    break;
}

startVisualizer(piles, h);
