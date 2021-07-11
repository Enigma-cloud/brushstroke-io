const TOOL_DISPLAY_DELAY = 1500;
const BRUSH_DEFAULT_SIZE = 10;
const ERASER_DEFAULT_SIZE = 20;
const NEUTRAL_COLOR = 'white'
const SELECTED_COLOR = '#465775';

// Tools
const activeToolEl = document.getElementById('active-tool'); 
const tools = document.querySelectorAll('.cursor-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const bucketBtn = document.getElementById('bucket');
const eraser = document.getElementById('eraser');
// Modal Content
const modal = document.getElementById('tools-modal');
const settingTitle = document.getElementById('setting-title');
const settingHint = document.getElementById('setting-hint');
const colorPicker = document.getElementById('color-picker');
const sizePicker = document.getElementById('size-picker');
// =======================================================================================
// Create shapes
const shapesBtn = document.getElementById('shapes');
const squareBtn = document.getElementById('square');
const circleBtn = document.getElementById('circle');
// =======================================================================================
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

// Global Variables
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const context = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
// =======================================================================================
// Update Tool Indicator Problem
// let toolBools = {  
//   isBrush: false,
//   isSquare: false,
//   isEraser: false
// }
// =======================================================================================
let isEraser = false;
let isBucket = false;
let isMouseDown = false;
let drawnArray = [];

// Capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Reset Tools
function resetTools() {
  for (const tool in toolBools) {
    tool = false;
  }
}

// Update/Reset Active Tool Display
function toolDisplayDelay(time) {
  console.log(activeToolEl.textContent);
  setTimeout(updateSelectedTool('brush'), time);
};

// Formatting Brush Size
function displayBrushSize() {
  // Format with '0' for numbers lower than 10
  if (brushSlider.value < 10) {
    brushSize.textContent = `0${brushSlider.value}`
  }
  else {
    brushSize.textContent = brushSlider.value;
  }
}

// Update Selected Tool 
function updateSelectedTool(tool) {
  // Update Button & Settings Style/Content
  if (tool === 'brush') {
    isEraser = false;
    isBucket = false;
  
    activeToolEl.textContent = 'Brush';
    settingHint.textContent = 'Hint: Use the color picker & slider to change the brush color and size respectively.';

    brushIcon.style.color = SELECTED_COLOR;
    eraser.style.color = NEUTRAL_COLOR;
    bucketBtn.style.color = NEUTRAL_COLOR;

    currentColor = `#${brushColorBtn.value}`;
    currentSize = BRUSH_DEFAULT_SIZE;
    brushSlider.value = BRUSH_DEFAULT_SIZE;

    sizePicker.style.display = 'flex';
    colorPicker.style.display = 'flex';
    brushColorBtn.style.display = 'flex';
    bucketColorBtn.style.display = 'none';

    displayBrushSize();
  }
  else if (tool === 'eraser') {
    isEraser = true;
    isBucket = false;
    
    activeToolEl.textContent = 'Eraser';
    settingHint.textContent = 'Hint: Use the slider to change the eraser size.';

    brushIcon.style.color = NEUTRAL_COLOR;
    eraser.style.color = SELECTED_COLOR;
    bucketBtn.style.color = NEUTRAL_COLOR;

    currentColor = bucketColor;
    currentSize = ERASER_DEFAULT_SIZE;
    brushSlider.value = ERASER_DEFAULT_SIZE;

    sizePicker.style.display = 'flex';
    colorPicker.style.display = 'none';

    displayBrushSize();
  }
  else if (tool === 'bucket') {
    isEraser = false;
    isBucket = true;

    activeToolEl.textContent = 'Bucket';
    settingHint.textContent = 'Hint: Use the color picker to change the background color.';

    brushIcon.style.color = NEUTRAL_COLOR;
    eraser.style.color = NEUTRAL_COLOR;
    bucketBtn.style.color = SELECTED_COLOR;

    sizePicker.style.display = 'none';
    colorPicker.style.display = 'flex';
    brushColorBtn.style.display = 'none';
    bucketColorBtn.style.display = 'flex';
  }
  else {
    return "Tool not found or incorrect tool id"
  }
}

// Switch back to Brush
function switchToBrush() {
  isEraser = false;
  isBucket = false;

  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = SELECTED_COLOR;
  eraser.style.color = NEUTRAL_COLOR;
  currentColor = `#${brushColorBtn.value}`;
  currentSize = BRUSH_DEFAULT_SIZE;
  brushSlider.value = BRUSH_DEFAULT_SIZE;
  displayBrushSize();
}

// =======================================================================================
// Update active tool display
// function updateToolIndicator(currentTool=undefined) {

//   if (currentTool === 'brush') {
//     toolBools.isEraser = false;

//     activeToolEl.textContent = capitalizeFirstLetter(currentTool);
//     tools.forEach((tool) => {
//       if (tool.id === currentTool) {
//         tool.classList.add('selected-tool');
//       }
//       else {
//         tool.classList.remove('selected-tool');
//       }
//     });

//     currentColor = `#${brushColorBtn.value}`;
//     currentSize = BRUSH_DEFAULT_SIZE;
//     brushSlider.value = BRUSH_DEFAULT_SIZE;
//     displayBrushSize();
//   }
//   else if (currentTool === 'square') {
//     toolBools.isEraser = false;

//     activeToolEl.textContent = capitalizeFirstLetter(currentTool);
//     brushIcon.classList.add('selected-tool');
//     eraser.classList.remove('selected-tool');

//     currentColor = `#${brushColorBtn.value}`;
//     currentSize = 10;
//     brushSlider.value = BRUSH_DEFAULT_SIZE;
//     displayBrushSize();
//   }
//   else if (tool === 'eraser') {
//     toolBools.isEraser = true;
//     toolBools.isBrush = false;
//     toolBools.isSquare = false;

//     activeToolEl.textContent = capitalizeFirstLetter(currentTool);
//     tools.forEach((tool) => {
//       if (tool.id === currentTool) {
//         tool.classList.add('selected-tool');
//       }
//       else {
//         tool.classList.remove('selected-tool');
//       }
//     });

//     currentColor = `#${brushColorBtn.value}`;
//     currentSize = ERASER_DEFAULT_SIZE;
//     brushSlider.value = ERASER_DEFAULT_SIZE;
//     displayBrushSize();
//   }
//   else {
//     tools.forEach((tool) => {
//       tool.classList.remove('selected-tool');
//     });
//     resetTools();

//     currentColor = `#${brushColorBtn.value}`;
//     currentSize = BRUSH_DEFAULT_SIZE;
//     brushSlider.value = BRUSH_DEFAULT_SIZE;
//     displayBrushSize();
//   }
// }
// =======================================================================================

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
}

// Update DOM - Draw what is stored in DrawnArray
function restoreCanvas(range=drawnArray.length) {
  for (let i = 1; i < range; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].erase) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  // console.log(line);
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

/** Event Listeners */

// Setting Brush Size
brushSlider.addEventListener('change', () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

// Setting Brush Color
brushColorBtn.addEventListener('change', () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

// Setting Background Color
bucketColorBtn.addEventListener('change', () => {
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});

// =======================================================================================
/** Create Shapes 
 * IN PROGRESS
*/
// Square
// SHOW UI INDICATION OF CHOSEN TOOL
// squareBtn.addEventListener('click', () => {
//   if (isSquare) {
//     isSquare = false;
//     canvas.style.cursor = 'crosshair';
//   }
//   else {
//     isSquare = true;
//     canvas.style.cursor = 'nw-resize';
//   }
//   switchToBrush();
// });
// =======================================================================================

// Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  toolDisplayDelay(TOOL_DISPLAY_DELAY);
});

/** Mouse Movement */
// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  // console.log('mouse is clicked', currentPosition);
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    // =======================================================================================
    // console.log('mouse is moving', currentPosition);
    // if (isSquare) {
    //   context.strokeRect(currentPosition.x, currentPosition.y, currentPosition.y + 1, currentPosition.x + 1);
    // }
    // else {
    //   context.lineTo(currentPosition.x, currentPosition.y);
    //   context.stroke();
    // }
    // =======================================================================================
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  }
  else {
    // Is it worth storing the undefined values in the global array?
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
  // console.log('mouse is unclicked');
});

// =======================================================================================
// Open Tool Settings
tools.forEach((tool) => {
  tool.addEventListener('click', () => {
    settingTitle.textContent = `${capitalizeFirstLetter(tool.id)} Settings`;
    updateSelectedTool(tool.id);
    modal.classList.add('show-modal');
  });
});

window.addEventListener('click', (e) => {
  if (e.target == modal) {
    modal.classList.remove('show-modal');

    if (!isEraser) {
      updateSelectedTool('brush');
    }
  }
});
// =======================================================================================

// Save to Local Storage
saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
  // Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  toolDisplayDelay(TOOL_DISPLAY_DELAY);
});

// Load from Local Storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {
    drawnArray = JSON.parse(localStorage.savedCanvas);

  // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    toolDisplayDelay(TOOL_DISPLAY_DELAY);
  }
  else {
    activeToolEl.textContent = 'No Saved Canvas';
    toolDisplayDelay(TOOL_DISPLAY_DELAY);
  }

});

// Clear Local Storage
clearStorageBtn.addEventListener('click', () => {
  // Best to use removeItem instead of clear (clear will wipe all data stored in local storage)
  localStorage.removeItem('savedCanvas');
  // Active Tool
  activeToolEl.textContent = 'Local Storage Cleared';
  toolDisplayDelay(TOOL_DISPLAY_DELAY);
});

// Download Image
downloadBtn.addEventListener('click', () => {
  // Download drawing as an image file to be downloaded from the browser
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'brushstroke-example.jpeg';
  // Active Tool
  activeToolEl.textContent = 'Image File Saved';
  toolDisplayDelay(TOOL_DISPLAY_DELAY);
});

// On Load
createCanvas();
