const display = document.getElementById("display");

function appendToDisplay(value) {
  if (value === ".") {
    const lastChunk = display.value.split(/[\+\-\*\/\(\)\s]/).pop();
    if (lastChunk.includes(".")) return;
  }
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function toggleSign() {
  const s = display.value;
  const match = s.match(/(-?\d*\.?\d+)(?!.*\d)/);
  if (!match) return;

  const num = match[1];
  const startIndex = match.index;

  const toggled = num.startsWith("-") ? num.slice(1) : "-" + num;
  display.value = s.slice(0, startIndex) + toggled + s.slice(startIndex + num.length);
}

function percent() {
  const s = display.value;
  const match = s.match(/(-?\d*\.?\d+)(?!.*\d)/);
  if (!match) return;

  const num = match[1];
  const startIndex = match.index;

  const asPercent = String(Number(num) / 100);
  display.value = s.slice(0, startIndex) + asPercent + s.slice(startIndex + num.length);
}

function safeEval(expr) {
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) throw new Error("Invalid");
  return Function(`"use strict"; return (${expr});`)();
}

function equals() {
  if (!display.value.trim()) return;

  try {
    const result = safeEval(display.value);
    display.value = Number.isFinite(result) ? String(result) : "Error";
  } catch {
    display.value = "Error";
  }
}

document.querySelectorAll("button").forEach((btn) => {
  const value = btn.getAttribute("data-value");
  const action = btn.getAttribute("data-action");

  btn.addEventListener("click", () => {
    if (value !== null) appendToDisplay(value);
    if (action === "clear") clearDisplay();
    if (action === "backspace") backspace();
    if (action === "toggle-sign") toggleSign();
    if (action === "percent") percent();
    if (action === "equals") equals();
  });
});

window.addEventListener("keydown", (e) => {
  const k = e.key;

  if ((k >= "0" && k <= "9") || ["+", "-", "*", "/", "(", ")", "."].includes(k)) {
    appendToDisplay(k);
  } else if (k === "Enter" || k === "=") {
    e.preventDefault();
    equals();
  } else if (k === "Backspace") {
    backspace();
  } else if (k === "Escape") {
    clearDisplay();
  }
});
