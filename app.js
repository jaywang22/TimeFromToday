const buttonsContainer = document.getElementById('buttons');
const numberInput = document.getElementById('numberInput');
const unitSelect = document.getElementById('unit');
const directionSelect = document.getElementById('direction');
const result = document.getElementById('result');
const copyButton = document.getElementById('copyButton');

let selectedButton = null;
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function setButtonStyle(btn, selected) {
  if (selected) {
    btn.style.backgroundColor = '#007AFF';
    btn.style.color = '#fff';
  } else {
    btn.style.backgroundColor = isDarkMode ? '#444' : '#ccc';
    btn.style.color = isDarkMode ? '#fff' : '#000';
  }
}

function setCopyButtonStyle(copied) {
  if (copied) {
    copyButton.style.backgroundColor = '#007AFF';
    copyButton.style.color = '#fff';
  } else {
    copyButton.style.backgroundColor = isDarkMode ? '#555' : '#ccc';
    copyButton.style.color = isDarkMode ? '#fff' : '#000';
  }
}

function resetCopyButton() {
  copyButton.textContent = 'Copy Result';
  setCopyButtonStyle(false);
}

// Create number buttons 1-20
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

function updateResult() {
  const amount = parseInt(numberInput.value);
  if (!amount) {
    result.innerHTML = '';
    if (selectedButton) setButtonStyle(selectedButton, false);
    selectedButton = null;
    resetCopyButton();
    return;
  }

  const unit = unitSelect.value;
  const direction = directionSelect.value;
  const today = new Date();
  let finalDate = new Date(today);

  if (unit === 'days') finalDate.setDate(today.getDate() + (direction === 'after' ? amount : -amount));
  if (unit === 'weeks') finalDate.setDate(today.getDate() + 7 * (direction === 'after' ? amount : -amount));
  if (unit === 'months') finalDate.setMonth(today.getMonth() + (direction === 'after' ? amount : -amount));

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const verb = direction === 'after' ? 'is' : 'was';
  const dateString = finalDate.toLocaleDateString(undefined, options);

  result.innerHTML = `${amount} ${unit} ${direction === 'after' ? 'from today' : 'before today'} ${verb}<br><strong>${dateString}</strong>`;
  resetCopyButton();
}

// Event listeners
numberInput.addEventListener('input', () => {
  updateResult();
  if (!numberInput.value && selectedButton) {
    setButtonStyle(selectedButton, false);
    selectedButton = null;
  }
  resetCopyButton();
});

unitSelect.addEventListener('change', () => {
  updateResult();
  resetCopyButton();
});

directionSelect.addEventListener('change', () => {
  updateResult();
  resetCopyButton();
});

// Copy result (only day and date)
copyButton.addEventListener('click', () => {
  if (result.textContent.trim() === '') return;

  const strongTag = result.querySelector('strong');
  if (strongTag) {
    navigator.clipboard.writeText(strongTag.textContent);
    copyButton.textContent = 'Copied!';
    setCopyButtonStyle(true);
  }
});
