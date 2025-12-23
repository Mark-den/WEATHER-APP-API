// Get the display and history elements from HTML
const display = document.getElementById("display");
const historyBox = document.getElementById("history");

// Add a number or operator to the display
function press(value) {
  // Don't let user add two operators in a row
  const lastChar = display.value.slice(-1);
  if ("+-*/".includes(value) && "+-*/".includes(lastChar)) {
    return;
  }
  
  // Replace 0 with new number (unless adding decimal/operator)
  if (display.value === "0" && value !== "." && value !== "/" && value !== "*" && value !== "+" && value !== "-") {
    display.value = value;
    return;
  }
  
  display.value += value;
}

// Clear the display
function clearDisplay() {
  display.value = "";
}

// Calculate the result and save to history
function calculate() {
  try {
    const expression = display.value;
    
    // Show undefined if display is empty, Error if ends with operator
    if (!expression) {
      display.value = "undefined";
      return;
    }
    
    if (expression.match(/[+\-*/]$/)) {
      display.value = "Error";
      return;
    }
    
    // Convert display symbols to JavaScript operators
    const sanitized = expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
    
    // Calculate safely
    const result = Function('"use strict"; return (' + sanitized + ')')();
    
    // Fix floating point rounding errors
    const formatted = Math.round(result * 100000000) / 100000000;
    display.value = formatted;

    // Add to history
    const entry = document.createElement("div");
    entry.textContent = expression + " = " + formatted;
    historyBox.prepend(entry);
  } catch {
    display.value = "Error";
  }
}

// Clear all history entries
function clearHistory() {
  historyBox.innerHTML = "";
}

// Switch between themes
function setTheme(theme) {
  document.body.className = theme;
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if ("0123456789.".includes(e.key)) press(e.key);  // Numbers and decimal
  if ("+-*/".includes(e.key)) press(e.key);          // Operators
  if (e.key === "Enter") calculate();                // Calculate
  if (e.key === "Backspace") display.value = display.value.slice(0, -1);  // Delete last
  if (e.key === "Escape") clearDisplay();            // Clear all
});
