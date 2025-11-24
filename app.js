// ===== Selectors =====
const buttonsContainer = document.getElementById('buttons');
const numberInput = document.getElementById('numberInput');
const unitButtonsContainer = document.getElementById('unitButtons');
const directionButtonsContainer = document.getElementById('directionButtons');
const result = document.getElementById('result');
const copyButton = document.getElementById('copyButton');

// ===== State =====
let selectedButton = null;
const units = ['days', 'weeks', 'months'];
const directions = ['before', 'after'];
let selectedUnit = 'weeks';
let selectedDirection = 'after';
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// ===== Helpers =====
function setButtonStyle(btn, selected) {
  if (selected) {
    btn.style.backgroundColor = '#007AFF';
    btn.style.color = '#fff';
    btn.classList.add('selected');
  } else {
    btn.style.backgroundColor = isDarkMode ? '#888' : '#f0f0f0';
    btn.style.color = isDarkMode ? '#fff' : '#000';
    btn.classList.remove('selected');
  }
}

function setCopyButtonStyle(copied) {
  if (copied) {
    copyButton.style.backgroundColor = '#007AFF';
    copyButton.style.color = '#fff';
    copyButton.classList.add('copied');
  } else {
    copyButton.classList.remove('copied');
    copyButton.style.backgroundColor = isDarkMode ? '#888' : '#f0f0f0';
    copyButton.style.color = isDarkMode ? '#fff' : '#000';
  }
}

function resetCopyButton() {
  copyButton.textContent = 'Copy Result';
  setCopyButtonStyle(false);
}

// Initialize copy button style on page load
setCopyButtonStyle(false);

// ===== Number Buttons 1-20 =====
for (let i = 1; i <= 20; i++) {
  const btn = document.createElement('button');
  btn.textContent = i;
  setButtonStyle(btn, false);
  btn.onclick = () => {
    numberInput.value = i;
    updateButtonSelection(btn);
    updateResult();
    resetCopyButton();
  };
  buttonsContainer.appendChild(btn);
}

function updateButtonSelection(btn) {
  if (selectedButton) setButtonStyle(selectedButton, false);
  setButtonStyle(btn, true);
  selectedButton = btn;
}

// ===== Unit Buttons =====
units.forEach(unit => {
  const btn = document.createElement('button');
  btn.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
  setButtonStyle(btn, unit === selectedUnit);
  btn.onclick = () => {
    selectedUnit = unit;
    Array.from(unitButtonsContainer.children).forEach(b => setButtonStyle(b, b === btn));
    updateResult();
    resetCopyButton();
  };
  unitButtonsContainer.appendChild(btn);
});

// ===== Direction Buttons =====
directions.forEach(dir => {
  const btn = document.createElement('button');
  btn.textContent = dir.charAt(0).toUpperCase() + dir.slice(1);
  setButtonStyle(btn, dir === selectedDirection);
  btn.onclick = () => {
    selectedDirection = dir;
    Array.from(directionButtonsContainer.children).forEach(b => setButtonStyle(b, b === btn));
    updateResult();
    resetCopyButton();
  };
  directionButtonsContainer.appendChild(btn);
});

// ===== Update Result =====
function updateResult() {
  const amount = parseInt(numberInput.value);
  if (!amount) {
    result.innerHTML = '';
    if (selectedButton) setButtonStyle(selectedButton, false);
    selectedButton = null;
    resetCopyButton();
    return;
  }

  const unit = selectedUnit;
  const direction = selectedDirection;
  const today = new Date();
  let finalDate = new Date(today);

  if (unit === 'days') finalDate.setDate(today.getDate() + (direction === 'after' ? amount : -amount));
  if (unit === 'weeks') finalDate.setDate(today.getDate() + 7 * (direction === 'after' ? amount : -amount));
  if (unit === 'months') finalDate.setMonth(today.getMonth() + (direction === 'after' ? amount : -amount));

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const verb = direction === 'after' ? 'is' : 'was';

  // Pluralization
  let displayUnit = unit;
  if (amount === 1) displayUnit = unit.slice(0, -1);

  const dateString = finalDate.toLocaleDateString(undefined, options);

  result.innerHTML = `${amount} ${displayUnit} ${direction === 'after' ? 'from today' : 'before today'} ${verb}<br><strong>${dateString}</strong>`;
}

// ===== Event Listeners =====
numberInput.addEventListener('input', () => {
  const value = parseInt(numberInput.value);

  // Deselect previous button
  if (selectedButton) setButtonStyle(selectedButton, false);
  selectedButton = null;

  // Highlight matching button
  if (value >= 1 && value <= 20) {
    const matchingBtn = buttonsContainer.children[value - 1];
    setButtonStyle(matchingBtn, true);
    selectedButton = matchingBtn;
  }

  updateResult();
  resetCopyButton();
});

// ===== Copy Button =====
copyButton.addEventListener('click', () => {
  if (!result.textContent.trim()) return;
  const strongTag = result.querySelector('strong');
  if (strongTag) {
    navigator.clipboard.writeText(strongTag.textContent);
    copyButton.textContent = 'Copied!';
    setCopyButtonStyle(true);
  }
});
