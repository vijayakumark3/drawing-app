let undoStack = [];
let redoStack = [];

let erasing = false;


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let color = document.getElementById("colorPicker").value;
let size = document.getElementById("sizeSlider").value;


function startDrawing(e) {
    drawing = true;
    saveState(); // 👈 Save current canvas before new stroke
    draw(e);
}


function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}


function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = size;
    ctx.lineCap = "round";
    // ctx.strokeStyle = color;
    ctx.strokeStyle = erasing ? "#ffffff" : color;


    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

document.getElementById("colorPicker").addEventListener("change", (e) => {
    color = e.target.value;
});

document.getElementById("sizeSlider").addEventListener("input", (e) => {
    size = e.target.value;
});

document.getElementById("clearBtn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Resize canvas when window resizes
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// save/download the drawing as a img file
document.getElementById("saveBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});



function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // clear redo stack when new action is made
}


// implement undo & redo logic
function restoreState(state) {
    const img = new Image();
    img.src = state;
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

document.getElementById("undoBtn").addEventListener("click", () => {
    if (undoStack.length === 0) return;
    const current = canvas.toDataURL();
    redoStack.push(current);
    const prev = undoStack.pop();
    restoreState(prev);
});

document.getElementById("redoBtn").addEventListener("click", () => {
    if (redoStack.length === 0) return;
    const next = redoStack.pop();
    undoStack.push(canvas.toDataURL());
    restoreState(next);
});



document.getElementById("eraserBtn").addEventListener("click", () => {
    erasing = !erasing;
    document.getElementById("eraserBtn").textContent = erasing ? "Draw" : "Eraser";
});
