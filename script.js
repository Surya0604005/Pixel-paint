const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");

let painting = false;
let undoStack = [];
let redoStack = [];

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector('.controls').offsetHeight - document.querySelector('h1').offsetHeight - 20;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function startPosition(e) {
  painting = true;
  saveState();
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
  const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = colorPicker.value;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Save state for undo
function saveState() {
  undoStack.push(canvas.toDataURL());
  if (undoStack.length > 50) undoStack.shift();
  redoStack = [];
}

// Undo
document.getElementById("undoBtn").addEventListener("click", () => {
  if (undoStack.length > 0) {
    redoStack.push(canvas.toDataURL());
    const imgData = undoStack.pop();
    let img = new Image();
    img.src = imgData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
});

// Redo
document.getElementById("redoBtn").addEventListener("click", () => {
  if (redoStack.length > 0) {
    undoStack.push(canvas.toDataURL());
    const imgData = redoStack.pop();
    let img = new Image();
    img.src = imgData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
});

// Clear
document.getElementById("clearBtn").addEventListener("click", () => {
  saveState();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Download
//document.getElementById("downloadBtn").addEventListener("click", () => {
  //const link = document.createElement("a");
  //link.download = "pixel_art.png";
  //link.href = canvas.toDataURL("image/png");
  //link.click();
//});

// Mouse events
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

// Touch events
canvas.addEventListener("touchstart", (e) => { e.preventDefault(); startPosition(e); });
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); draw(e); });