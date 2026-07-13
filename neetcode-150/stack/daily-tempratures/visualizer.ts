import * as blessed from 'blessed';

interface Frame {
  content: string;
  message: string;
}

function generateFrames(temperatures: number[]): Frame[] {
  const frames: Frame[] = [];
  const result = new Array(temperatures.length).fill(0);
  const stack: number[] = [];
  
  const createContent = (
    currentIndex: number, 
    popped: string, 
    pushed: string, 
    highlightResultIndex: number = -1
  ) => {
    let pointerLine1 = '';
    let pointerLine2 = '';
    
    if (currentIndex >= 0 && currentIndex < temperatures.length) {
      let prefixLength = 14 + 1; // "Temperatures: " + "["
      for (let j = 0; j < currentIndex; j++) {
        prefixLength += temperatures[j].toString().length + 2;
      }
      const center = prefixLength + Math.floor(temperatures[currentIndex].toString().length / 2);
      pointerLine1 = ' '.repeat(center) + '|';
      pointerLine2 = ' '.repeat(center) + 'V';
    }

    let resultString = "";
    for (let i = 0; i < result.length; i++) {
      if (i === highlightResultIndex) {
        resultString += `{red-bg}{white-fg}${result[i]}{/white-fg}{/red-bg}`;
      } else {
        resultString += result[i].toString();
      }
      if (i < result.length - 1) resultString += ", ";
    }
    
    const formattedStack = stack.map(idx => `${idx}(${temperatures[idx]}°)`).join(', ');

    return `${pointerLine1}\n${pointerLine2}\n` +
           `{cyan-fg}Temperatures: [${temperatures.join(', ')}]{/cyan-fg}\n` +
           `{green-fg}Result:       [${resultString}]{/green-fg}\n` +
           `{magenta-fg}Stack:        [${formattedStack}]{/magenta-fg}\n\n` +
           `POPPED = ${popped}\n` +
           `PUSHED = ${pushed}`;
  };

  frames.push({
    content: createContent(-1, "N/A", "N/A"),
    message: "{center}{bold}=== Daily Temperatures Array Visualizer ==={/bold}{/center}\n\nPress {yellow-fg}[Right Arrow]{/yellow-fg} or {yellow-fg}[Space]{/yellow-fg} to step forward.\nPress {yellow-fg}[Left Arrow]{/yellow-fg} to step backward.\nPress {yellow-fg}[q]{/yellow-fg} or {yellow-fg}[Escape]{/yellow-fg} to exit."
  });

  for (let i = 0; i < temperatures.length; i++) {
    frames.push({
      content: createContent(i, "N/A", "N/A"),
      message: `Processing index ${i} (Temperature: ${temperatures[i]}°).\nChecking if we can pop from stack...`
    });

    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const topIndex = stack[stack.length - 1];
      const topTemp = temperatures[topIndex];
      
      frames.push({
        content: createContent(i, "N/A", "N/A"),
        message: `{yellow-fg}Condition Met!{/yellow-fg} Current Temp (${temperatures[i]}°) > Stack Top Temp (${topTemp}° at index ${topIndex}).\nWe found a warmer day for the day at index ${topIndex}!`
      });
      
      const prevIndex = stack.pop()!;
      const daysWaited = i - prevIndex;
      result[prevIndex] = daysWaited;
      
      frames.push({
        content: createContent(i, `${prevIndex} (Temp: ${topTemp}°)`, "N/A", prevIndex),
        message: `Popped index ${prevIndex}.\nCalculation: Current Index (${i}) - Popped Index (${prevIndex}) = ${daysWaited} days.\nUpdated result[${prevIndex}] = ${daysWaited}`
      });
    }

    stack.push(i);
    frames.push({
      content: createContent(i, "N/A", `${i} (Temp: ${temperatures[i]}°)`),
      message: `No more elements to pop.\nPushed current index ${i} to stack.`
    });
  }

  frames.push({
    content: createContent(temperatures.length, "N/A", "N/A"),
    message: `{green-fg}FINISHED!{/green-fg} Final Result: [${result.join(', ')}]\n\nPress {yellow-fg}[q]{/yellow-fg} to exit.`
  });

  return frames;
}

function startVisualizer(temperatures: number[]) {
  const frames = generateFrames(temperatures);
  let currentFrameIdx = 0;

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Array Visualizer'
  });

  const arraysBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: '60%',
    border: { type: 'line' },
    label: ' {bold}Arrays & Pointers{/bold} ',
    tags: true,
    padding: { top: 2, left: 4 },
    style: { border: { fg: 'white' } }
  });

  const logBox = blessed.box({
    top: '60%',
    left: 'center',
    width: '100%',
    height: '40%',
    border: { type: 'line' },
    label: ' {bold}Logs{/bold} ',
    tags: true,
    padding: { top: 1, left: 4 },
    style: { border: { fg: 'white' }, fg: 'white' }
  });

  screen.append(arraysBox);
  screen.append(logBox);

  const renderFrame = () => {
    const frame = frames[currentFrameIdx];
    arraysBox.setContent(frame.content);
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

startVisualizer([30, 38, 30, 36, 35, 40, 28]);
