const TOOL_DISPLAY_DELAY = 1500;
const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
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
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Update/Reset Active Tool Display
function toolDisplayDelay(time) {
  setTimeout(switchToBrush, time)
};

// Formatting Brush Size
function displayBrushSize() {
  if (brushSlider.value < 10) {
    brushSize.textContent = `0${brushSlider.value}`
  }
  else {
    brushSize.textContent = brushSlider.value;
  }
}

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

// // Eraser
eraser.addEventListener('click', () => {
  isEraser = true;
  brushIcon.style.color = 'white';
  eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser';
  currentColor = bucketColor;
  currentSize = 50;
  brushSlider.value = 50;
  displayBrushSize();
});

// // Switch back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();

}

// // Clear Canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  toolDisplayDelay(TOOL_DISPLAY_DELAY);
});

// // Draw what is stored in DrawnArray
// Can be used to create undo functionality
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = 'round';
    if (drawnArray[i].eraser) {
      context.strokeStyle = bucketColor;
    } else {
      context.strokeStyle = drawnArray[i].color;
    }
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// // Store Drawn Lines in DrawnArray
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

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  // console.log('mouse is clicked', currentPosition);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = 'round';
  context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    // console.log('mouse is moving', currentPosition);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    // Is it worth storing the undefined values in the global array?
    storeDrawn(undefined);
  }
});

// Mouse Up
canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
  // console.log('mouse is unclicked');
});

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

// Event Listener
brushIcon.addEventListener('click', switchToBrush);

// On Load
createCanvas();
