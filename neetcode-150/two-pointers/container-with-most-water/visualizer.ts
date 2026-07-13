import * as blessed from 'blessed';

interface Frame {
  left: number;
  right: number;
  maxArea: number;
  currentArea: number;
  message: string;
}

function generateFrames(heights: number[]): Frame[] {
  const frames: Frame[] = [];
  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;

  frames.push({
    left, right, maxArea, currentArea: 0,
    message: "{center}{bold}=== Container With Most Water Visualizer ==={/bold}{/center}\n\nPress {yellow-fg}[Right Arrow]{/yellow-fg} or {yellow-fg}[Space]{/yellow-fg} to step forward.\nPress {yellow-fg}[Left Arrow]{/yellow-fg} to step backward.\nPress {yellow-fg}[q]{/yellow-fg} or {yellow-fg}[Escape]{/yellow-fg} to exit."
  });

  while (left < right) {
    const height = Math.min(heights[left], heights[right]);
    const width = right - left;
    const area = height * width;
    
    // Frame 1: Calculate current area
    frames.push({
      left, right, maxArea, currentArea: area,
      message: `Calculating Area:\n- Left Pointer (Idx ${left}): Height = ${heights[left]}\n- Right Pointer (Idx ${right}): Height = ${heights[right]}\n- Water Level = min(${heights[left]}, ${heights[right]}) = {blue-fg}${height}{/blue-fg}\n- Width = ${right} - ${left} = {blue-fg}${width}{/blue-fg}\n- Current Area = ${height} * ${width} = {bold}${area}{/bold}`
    });

    // Frame 2: Update max area
    if (area > maxArea) {
      maxArea = area;
      frames.push({
        left, right, maxArea, currentArea: area,
        message: `{green-fg}New Max Area Found!{/green-fg} Updated Max Area to {bold}${maxArea}{/bold}.`
      });
    } else {
      frames.push({
        left, right, maxArea, currentArea: area,
        message: `Area ${area} is not greater than Max Area ${maxArea}. Keeping Max Area as ${maxArea}.`
      });
    }

    // Frame 3: Move pointer
    if (heights[left] < heights[right]) {
      frames.push({
        left, right, maxArea, currentArea: area,
        message: `Left height (${heights[left]}) < Right height (${heights[right]}).\nMoving the Left pointer to the right to search for a taller boundary.`
      });
      left++;
    } else {
      frames.push({
        left, right, maxArea, currentArea: area,
        message: `Right height (${heights[right]}) <= Left height (${heights[left]}).\nMoving the Right pointer to the left to search for a taller boundary.`
      });
      right--;
    }
  }

  frames.push({
    left, right, maxArea, currentArea: 0,
    message: `{green-fg}FINISHED!{/green-fg} Pointers have met.\nFinal Max Area: {bold}${maxArea}{/bold}\n\nPress {yellow-fg}[q]{/yellow-fg} to exit.`
  });

  return frames;
}

function startVisualizer(heights: number[]) {
  const frames = generateFrames(heights);
  let currentFrameIdx = 0;

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Container With Most Water Visualizer'
  });

  const graphBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: '70%',
    border: { type: 'line' },
    label: ' {bold}Water Container{/bold} ',
    tags: true,
    padding: { top: 1, left: 2 },
    style: { border: { fg: 'white' } }
  });

  const logBox = blessed.box({
    top: '70%',
    left: 'center',
    width: '100%',
    height: '30%',
    border: { type: 'line' },
    label: ' {bold}Status & Log{/bold} ',
    tags: true,
    padding: { top: 1, left: 2 },
    style: { border: { fg: 'white' }, fg: 'white' }
  });

  // Legend
  const legendText = ` {cyan-bg}  {/cyan-bg} Left Pointer ` +
                     ` {magenta-bg}  {/magenta-bg} Right Pointer ` +
                     ` {blue-bg}  {/blue-bg} Water ` +
                     ` {grey-bg}  {/grey-bg} Walls `;

  const legendBox = blessed.box({
    parent: graphBox,
    top: 0,
    right: 2,
    width: legendText.replace(/{[^}]+}/g, '').length + 2, // approximation
    height: 3,
    border: { type: 'line' },
    tags: true,
    content: legendText
  });

  screen.append(graphBox);
  screen.append(logBox);

  const maxTemp = Math.max(...heights);

  const createGraph = (left: number, right: number) => {
    let output = "";
    const waterLevel = (left < right) ? Math.min(heights[left], heights[right]) : 0;

    for (let h = maxTemp; h >= 1; h--) {
      let line = `${h.toString().padStart(2, ' ')} |`;

      for (let i = 0; i < heights.length; i++) {
        const isLeft = i === left;
        const isRight = i === right;
        const isBar = heights[i] >= h;
        const isWater = left < right && i > left && i < right && h <= waterLevel;

        if (isBar) {
          if (isLeft) line += ' {cyan-fg}█{/cyan-fg} ';
          else if (isRight) line += ' {magenta-fg}█{/magenta-fg} ';
          else line += ' {grey-fg}█{/grey-fg} ';
        } else {
          if (isWater) {
            line += ' {blue-fg}≈{/blue-fg} '; // Water ripples
          } else {
            line += '   ';
          }
        }
      }
      output += line + "\n";
    }

    // X-axis
    output += "   +" + "---".repeat(heights.length) + "\n";
    let idxLine = "Idx:";
    for (let i = 0; i < heights.length; i++) {
      idxLine += ` ${i.toString().padStart(2, '0')}`;
    }
    output += idxLine + "\n";
    
    // Draw Stats
    output += `\n{bold}Max Area:{/bold} {green-fg}${frames[currentFrameIdx].maxArea}{/green-fg}    `;
    if (frames[currentFrameIdx].currentArea > 0) {
      output += `{bold}Current Area:{/bold} {blue-fg}${frames[currentFrameIdx].currentArea}{/blue-fg}`;
    }
    
    return output;
  };

  const renderFrame = () => {
    const frame = frames[currentFrameIdx];
    graphBox.setContent(createGraph(frame.left, frame.right));
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

// Typical example for Container With Most Water
startVisualizer([1, 8, 6, 2, 5, 4, 8, 3, 7]);
