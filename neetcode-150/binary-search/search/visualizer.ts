import * as blessed from 'blessed';

interface Frame {
  left: number;
  right: number;
  mid: number;
  message: string;
}

function generateFrames(nums: number[], target: number): Frame[] {
  const frames: Frame[] = [];
  let left = 0;
  let right = nums.length - 1;

  frames.push({
    left, right, mid: -1,
    message: `{center}{bold}=== Binary Search Visualizer ==={/bold}{/center}\n\nTarget: {cyan-fg}${target}{/cyan-fg}\n\nPress {yellow-fg}[Right Arrow]{/yellow-fg} or {yellow-fg}[Space]{/yellow-fg} to step forward.\nPress {yellow-fg}[Left Arrow]{/yellow-fg} to step backward.\nPress {yellow-fg}[q]{/yellow-fg} or {yellow-fg}[Escape]{/yellow-fg} to exit.`
  });

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    frames.push({
      left, right, mid,
      message: `Calculating Mid:\n- Left Pointer = ${left}\n- Right Pointer = ${right}\n- Mid Pointer = Math.floor((${left} + ${right}) / 2) = {yellow-fg}${mid}{/yellow-fg}\n\nChecking if nums[${mid}] (${nums[mid]}) == Target (${target})...`
    });

    if (nums[mid] === target) {
      frames.push({
        left, right, mid,
        message: `{green-bg}{black-fg}Target Found!{/black-fg}{/green-bg} nums[${mid}] == ${target}.\n\nReturning index {bold}${mid}{/bold}.`
      });
      return frames;
    }

    if (nums[mid] < target) {
      frames.push({
        left, right, mid,
        message: `nums[mid] (${nums[mid]}) < Target (${target}).\n\nTarget must be to the RIGHT of mid.\nMoving Left pointer from ${left} to mid + 1 ({bold}${mid + 1}{/bold}).`
      });
      left = mid + 1;
    } else {
      frames.push({
        left, right, mid,
        message: `nums[mid] (${nums[mid]}) > Target (${target}).\n\nTarget must be to the LEFT of mid.\nMoving Right pointer from ${right} to mid - 1 ({bold}${mid - 1}{/bold}).`
      });
      right = mid - 1;
    }
    
    if (left <= right) {
        frames.push({
            left, right, mid: -1,
            message: `Updated search space bounds: [{cyan-fg}${left}{/cyan-fg}, {magenta-fg}${right}{/magenta-fg}].\nContinuing search...`
        });
    }
  }

  frames.push({
    left, right, mid: -1,
    message: `{red-bg}{white-fg}Target Not Found!{/white-fg}{/red-bg} Left pointer (${left}) has crossed Right pointer (${right}).\n\nReturning {bold}-1{/bold}.`
  });

  return frames;
}

function startVisualizer(nums: number[], target: number) {
  const frames = generateFrames(nums, target);
  let currentFrameIdx = 0;

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Binary Search Visualizer'
  });

  const arrayBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: '60%',
    border: { type: 'line' },
    label: ` {bold}Array (Target = ${target}){/bold} `,
    tags: true,
    padding: { top: 2, left: 2 },
    style: { border: { fg: 'white' } }
  });

  const logBox = blessed.box({
    top: '60%',
    left: 'center',
    width: '100%',
    height: '40%',
    border: { type: 'line' },
    label: ' {bold}Logs & Execution{/bold} ',
    tags: true,
    padding: { top: 1, left: 4 },
    style: { border: { fg: 'white' }, fg: 'white' }
  });

  screen.append(arrayBox);
  screen.append(logBox);

  const renderFrame = () => {
    const frame = frames[currentFrameIdx];
    
    let pointersLine = "";
    let topBorderLine = "";
    let valuesLine = "";
    let bottomBorderLine = "";
    let indicesLine = "";

    for (let i = 0; i < nums.length; i++) {
        // Build Pointers
        let ptr = "";
        if (i === frame.mid) {
            if (i === frame.left && i === frame.right) ptr = "{cyan-fg}L{/cyan-fg}/{yellow-fg}M{/yellow-fg}/{magenta-fg}R{/magenta-fg}";
            else if (i === frame.left) ptr = " {cyan-fg}L{/cyan-fg}/{yellow-fg}M{/yellow-fg} ";
            else if (i === frame.right) ptr = " {yellow-fg}M{/yellow-fg}/{magenta-fg}R{/magenta-fg} ";
            else ptr = "  {yellow-fg}M{/yellow-fg}   ";
        } else if (i === frame.left && i === frame.right) {
            ptr = " {cyan-fg}L{/cyan-fg}/{magenta-fg}R{/magenta-fg} ";
        } else if (i === frame.left) {
            ptr = "  {cyan-fg}L{/cyan-fg}   ";
        } else if (i === frame.right) {
            ptr = "  {magenta-fg}R{/magenta-fg}   ";
        } else {
            ptr = "      ";
        }
        pointersLine += ptr + " ";

        // Box Color
        let colorOn = "";
        let colorOff = "";
        if (i < frame.left || i > frame.right) {
            colorOn = "{grey-fg}";
            colorOff = "{/grey-fg}";
        } else if (i === frame.mid) {
            colorOn = "{yellow-bg}{black-fg}";
            colorOff = "{/black-fg}{/yellow-bg}";
        } else {
            colorOn = "{white-fg}";
            colorOff = "{/white-fg}";
        }

        topBorderLine += `${colorOn}+----+${colorOff} `;
        
        // Format value
        let valStr = nums[i].toString();
        if (nums[i] >= 0 && nums[i] < 10) valStr = `  ${nums[i]} `;
        else if (nums[i] < 0 && nums[i] > -10) valStr = ` ${nums[i]} `;
        else if (nums[i] >= 10 && nums[i] < 100) valStr = ` ${nums[i]} `;
        else valStr = nums[i].toString().padStart(4, ' ').substring(0, 4);

        valuesLine += `${colorOn}|${valStr}|${colorOff} `;
        bottomBorderLine += `${colorOn}+----+${colorOff} `;

        indicesLine += `{grey-fg}${i.toString().padStart(3, ' ').padEnd(6, ' ')}{/grey-fg} `;
    }

    const content = `${pointersLine}\n${topBorderLine}\n${valuesLine}\n${bottomBorderLine}\n${indicesLine}`;
    
    arrayBox.setContent(content);
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
const nums = [3, 7, 12, 18, 25, 31, 39, 44, 52, 61, 73, 84, 91, 105, 120];
const target = 140;
startVisualizer(nums, target);
