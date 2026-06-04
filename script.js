let expr = '';
let current = '0';
let justCalc = false;
let logStep = 0;
let logBase = '';

const elExpr = document.getElementById('expr');
const elValue = document.getElementById('value');

function updateDisplay() {
  elExpr.textContent = expr;
  elValue.textContent = current;
}

function inputNum(n) {
  if (justCalc) { expr = ''; justCalc = false; }
  current = (current === '0' && n !== '.') ? n : current + n;
  updateDisplay();
}

function inputDot() {
  if (justCalc) { current = '0'; expr = ''; justCalc = false; }
  if (!current.includes('.')) current += '.';
  updateDisplay();
}

function inputOp(op) {
  justCalc = false;
  expr += current + ' ' + op + ' ';
  current = '0';
  updateDisplay();
}

function inputLog() {
  justCalc = false;
  logStep = 1;
  logBase = current;
  expr = 'log_' + current + '( ';
  current = '0';
  updateDisplay();
}

function clearAll() {
  expr = ''; current = '0'; justCalc = false; logStep = 0; logBase = '';
  updateDisplay();
}

function calculate() {
  try {
    let result;

    if (logStep === 1) {
      const base = parseFloat(logBase);
      const n = parseFloat(current);
      if (base <= 0 || base === 1 || n <= 0) throw new Error('Inválido');
      result = Math.log(n) / Math.log(base);
      expr = 'log_' + logBase + '(' + current + ') =';
      logStep = 0; logBase = '';
    } else {
      const full = expr + current;
      const safe = full.replace(/\^/g, '**');
      result = Function('"use strict"; return (' + safe + ')')();
      expr = full + ' =';
    }

    if (!isFinite(result)) throw new Error('Inválido');
    current = parseFloat(result.toFixed(10)).toString();
    justCalc = true;
    updateDisplay();
  } catch (e) {
    current = 'Erro';
    justCalc = true;
    updateDisplay();
  }
}
