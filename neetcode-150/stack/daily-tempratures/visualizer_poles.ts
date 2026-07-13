import * as blessed from 'blessed';

interface Frame {
  colors: string[];
  lightBeam?: { startIndex: number, endIndex: number, height: number };
  message: string;
}

function generateFrames(temperatures: number[]): Frame[] {
  const frames: Frame[] = [];
  const result = new Array(temperatures.length).fill(0);
  const stack: number[] = [];
  const resolved = new Set<number>();

  const getColors = (currentIndex: number, comparingTo: number = -1) => {
    return temperatures.map((_, i) => {
      if (i === comparingTo) return 'red';
      if (i === currentIndex) return 'cyan';
      if (i > currentIndex) return 'grey';
      if (stack.includes(i)) return 'magenta';
      if (resolved.has(i)) return 'green';
      return 'grey';
    });
  };

  frames.push({
    colors: getColors(-1),
    message: "{center}{bold}=== Daily Temperatures Blessed Visualizer ==={/bold}{/center}\n\nPress {yellow-fg}[Right Arrow]{/yellow-fg} or {yellow-fg}[Space]{/yellow-fg} to step forward.\nPress {yellow-fg}[Left Arrow]{/yellow-fg} to step backward.\nPress {yellow-fg}[q]{/yellow-fg} or {yellow-fg}[Escape]{/yellow-fg} to exit."
  });

  for (let i = 0; i < temperatures.length; i++) {
    frames.push({
      colors: getColors(i),
      message: `Processing pole at index ${i} (Temp: ${temperatures[i]}°).\nChecking if it's taller than the pole at the top of the stack...`
    });

    while (
      stack.length > 0 &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      const topIndex = stack[stack.length - 1];
      
      frames.push({
        colors: getColors(i, topIndex),
        lightBeam: { startIndex: i, endIndex: topIndex, height: temperatures[topIndex] },
        message: `{yellow-fg}Condition Met!{/yellow-fg} Cyan pole (${temperatures[i]}°) > Red stack top (${temperatures[topIndex]}°).\nThe Cyan pole shines a {yellow-bg}{black-fg} yellow light {/black-fg}{/yellow-bg} over the shorter poles to hit the Red pole!\nRed pole found its next warmer temperature.`
      });

      const prevIndex = stack.pop()!;
      result[prevIndex] = i - prevIndex;
      resolved.add(prevIndex);
      
      frames.push({
        colors: getColors(i),
        message: `Popped index ${prevIndex}. Days waited = ${i} - ${prevIndex} = {bold}${i - prevIndex}{/bold} days.\nThe pole is now resolved (Green).`
      });
    }

    stack.push(i);
    frames.push({
      colors: getColors(i),
      message: `No more shorter poles to pop.\nPushed index ${i} onto the stack (Magenta).`
    });
  }

  frames.push({
    colors: getColors(temperatures.length - 1),
    message: `{green-fg}FINISHED!{/green-fg} The remaining Magenta poles never found a taller pole.\nFinal Result: [${result.join(', ')}]\n\nPress {yellow-fg}[q]{/yellow-fg} to exit.`
  });

  return frames;
}

function startVisualizer(temperatures: number[]) {
  const frames = generateFrames(temperatures);
  let currentFrameIdx = 0;

  const screen = blessed.screen({
    smartCSR: true,
    title: 'Monotonic Stack Visualizer'
  });

  const mainBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: '75%',
    border: { type: 'line' },
    label: ' {bold}Light Poles{/bold} ',
    tags: true,
    style: {
      border: { fg: 'white' }
    }
  });

  const logBox = blessed.box({
    top: '75%',
    left: 'center',
    width: '100%',
    height: '25%',
    border: { type: 'line' },
    label: ' {bold}Status & Log{/bold} ',
    tags: true,
    style: {
      border: { fg: 'white' },
      fg: 'white'
    },
    content: frames[0].message
  });

  // Legend
  const legendText = ` {cyan-bg}  {/cyan-bg} Current ` +
                     ` {magenta-bg}  {/magenta-bg} Stack ` +
                     ` {red-bg}  {/red-bg} Comparing ` +
                     ` {green-bg}  {/green-bg} Resolved ` +
                     ` {yellow-bg}  {/yellow-bg} Light Shadow `;

  const legendBox = blessed.box({
    parent: mainBox,
    top: 0,
    right: 2,
    width: legendText.replace(/{[^}]+}/g, '').length + 2, // approximation
    height: 3,
    border: { type: 'line' },
    tags: true,
    content: legendText
  });

  screen.append(mainBox);
  screen.append(logBox);

  const minTemp = Math.min(...temperatures);
  
  const poleBoxes: blessed.Widgets.BoxElement[] = [];
  const poleWidth = 6;
  const poleSpacing = 3;

  // Create Pole Boxes
  temperatures.forEach((temp, i) => {
    const h = (temp - minTemp) + 4; // Map temp to lines
    const pole = blessed.box({
      parent: mainBox,
      bottom: 0,
      left: i * (poleWidth + poleSpacing) + 2,
      width: poleWidth,
      height: h,
      content: `\n ${temp}°\n Idx\n  ${i}`,
      tags: true,
      style: { bg: 'grey', fg: 'black' }
    });
    poleBoxes.push(pole);
  });

  // Create Light Beam Box
  const lightBeamBox = blessed.box({
    parent: mainBox,
    height: 1,
    style: { bg: 'yellow' },
    hidden: true
  });

  const renderFrame = () => {
    const frame = frames[currentFrameIdx];

    // Update poles
    poleBoxes.forEach((pole, i) => {
      pole.style.bg = frame.colors[i];
      if (frame.colors[i] === 'grey') {
        pole.style.fg = 'white';
      } else {
        pole.style.fg = 'black'; // better contrast for colored backgrounds
      }
    });

    // Update light beam
    if (frame.lightBeam) {
      const startBoxRightEdge = frame.lightBeam.endIndex * (poleWidth + poleSpacing) + 2 + poleWidth;
      const endBoxLeftEdge = frame.lightBeam.startIndex * (poleWidth + poleSpacing) + 2;
      
      lightBeamBox.left = startBoxRightEdge;
      lightBeamBox.width = endBoxLeftEdge - startBoxRightEdge;
      
      const targetPoleHeight = (frame.lightBeam.height - minTemp) + 4;
      lightBeamBox.bottom = targetPoleHeight - 1; // Top of the red pole
      lightBeamBox.show();
    } else {
      lightBeamBox.hide();
    }

    // Update log
    logBox.setContent(frame.message);
    screen.render();
  };

  // Input handling
  screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

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

  // Initial render
  renderFrame();
}

// Example Run
const exampleTemperatures = [30, 38, 30, 36, 35, 40, 28];
startVisualizer(exampleTemperatures);
