let isSalesInput = true;
let ccSales = 0;
let ccTips = 0;
let cashSales = 0;
let cashTips = 0;
let history = JSON.parse(localStorage.getItem("history")) || [];

window.onload = () => {
  history = JSON.parse(localStorage.getItem("history")) || [];
  recalculateTotalsFromHistory();
  loadHistory();
  updateTable();
};

function recalculateTotalsFromHistory() {
  ccSales = 0;
  ccTips = 0;
  cashSales = 0;
  cashTips = 0;

  history.forEach(([amount, type, paymentMethod]) => {
    amount = parseFloat(amount);
    if (type === "Sale") {
      if (paymentMethod === "Cash") {
        cashSales += amount;
      } else {
        ccSales += amount;
      }
    } else if (type === "Tip") {
      if (paymentMethod === "Cash") {
        cashTips += amount;
      } else {
        ccTips += amount;
      }
    }
  });
}

const elements = {
  amount: document.getElementById("amount"),
  toggle: document.getElementById("toggle"),
  inputIndicator: document.getElementById("input-indicator"),
  ccSales: document.getElementById("ccSales"),
  ccTips: document.getElementById("ccTips"),
  ccTotal: document.getElementById("ccTotal"),
  cashSales: document.getElementById("cashSales"),
  cashTips: document.getElementById("cashTips"),
  cashTotal: document.getElementById("cashTotal"),
  totalSales: document.getElementById("totalSales"),
  totalTips: document.getElementById("totalTips"),
  deduction: document.getElementById("deduction"),
};

function formatNumber(num) {
  return num.toFixed(2);
}

function submitAmount() {
  const amount = parseFloat(elements.amount.value);
  const toggleStatus = elements.toggle.checked;

  if (isNaN(amount)) {
    console.error("Please enter a valid number");
    return;
  }

  const type = isSalesInput ? "Sale" : "Tip";

  if (toggleStatus) {
    if (isSalesInput) {
      cashSales += amount;
    } else {
      cashTips += amount;
    }
  } else {
    if (isSalesInput) {
      ccSales += amount;
    } else {
      ccTips += amount;
    }
  }
  isSalesInput = !isSalesInput;
  elements.inputIndicator.textContent = isSalesInput ? "Sale:" : "Tip:";
  history.push([amount, type, toggleStatus ? "Cash" : "Card"]);
  localStorage.setItem("history", JSON.stringify(history));

  loadHistory();
  updateTable();
  elements.amount.value = "";
}

function undoLastEntry() {
  if (history.length > 0) {
    const lastEntry = history.pop();
    const lastType = lastEntry[1];
    elements.inputIndicator.textContent = isSalesInput ? "Sale:" : "Tip:";
    localStorage.setItem("history", JSON.stringify(history));
    recalculateTotalsFromHistory();
    loadHistory();
    updateTable();
  }
}

function loadHistory() {
  const historyTableBody = document
    .getElementById("historyTable")
    .getElementsByTagName("tbody")[0];
  historyTableBody.innerHTML = "";

  history.forEach((entry) => {
    let row = historyTableBody.insertRow();
    entry.forEach((cellData) => {
      let cell = row.insertCell();
      cell.textContent = cellData;
    });
  });
}

function updateTable() {
  elements.ccSales.textContent = formatNumber(ccSales);
  elements.ccTips.textContent = formatNumber(ccTips);
  elements.ccTotal.textContent = formatNumber(ccSales + ccTips);

  elements.cashSales.textContent = formatNumber(cashSales);
  elements.cashTips.textContent = formatNumber(cashTips);
  elements.cashTotal.textContent = formatNumber(cashSales + cashTips);

  const totalSales = ccSales + cashSales;
  const totalTips = ccTips + cashTips;
  elements.totalSales.textContent = formatNumber(totalSales);
  elements.totalTips.textContent = formatNumber(totalTips);
  elements.deduction.textContent = formatNumber(totalTips * 0.4);
}

function resetTable() {
  ccSales = 0;
  ccTips = 0;
  cashSales = 0;
  cashTips = 0;
  isSalesInput = true;
  elements.amount.value = "";
  elements.toggle.checked = false;
  elements.inputIndicator.textContent = "Sale";
  updateTable();
  history = [];
  localStorage.removeItem("history");
  loadHistory();
}

function inputDigit(digit) {
  elements.amount.value += digit;
}

function deleteDigit() {
  elements.amount.value = elements.amount.value.slice(0, -1);
}

function toggleHistory() {
  const historyTable = document.getElementById("historyTable");
  historyTable.style.display =
    historyTable.style.display === "none" ? "" : "none";
  const historyButton = document.querySelector(
    'button[onclick="toggleHistory()"]'
  );
  historyButton.textContent =
    historyTable.style.display === "none" ? "Show History" : "Hide History";
}
