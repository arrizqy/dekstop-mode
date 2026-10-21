import React, { useState } from 'react';
import { Delete, History } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleDigit = (digit: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    setOperator(op);
    setPrevValue(display);
    setDisplay('0');
  };

  const handleEquals = () => {
    if (!prevValue || !operator) return;
    const a = parseFloat(prevValue);
    const b = parseFloat(display);
    let result = 0;

    switch (operator) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '×':
        result = a * b;
        break;
      case '÷':
        result = b !== 0 ? a / b : NaN;
        break;
    }

    const resStr = isNaN(result) ? 'Error' : Math.round(result * 1000000) / 1000000 + '';
    setHistory([`${prevValue} ${operator} ${display} = ${resStr}`, ...history.slice(0, 8)]);
    setDisplay(resStr);
    setPrevValue(null);
    setOperator(null);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 overflow-hidden select-none p-3">
      {/* Display bar */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-white/10 mb-3 flex flex-col justify-end text-right min-h-[90px] relative">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="absolute top-2 left-2 text-slate-400 hover:text-white p-1"
          title="Riwayat Perhitungan"
        >
          <History className="w-4 h-4" />
        </button>

        {prevValue && (
          <div className="text-xs text-slate-400 font-mono">
            {prevValue} {operator}
          </div>
        )}
        <div className="text-2xl font-bold font-mono tracking-tight text-white truncate">
          {display}
        </div>
      </div>

      {/* History popover */}
      {showHistory && (
        <div className="bg-slate-800 border border-white/10 rounded-xl p-2.5 mb-2 text-xs font-mono text-slate-300 max-h-28 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-slate-500 text-center py-2">Belum ada riwayat</div>
          ) : (
            history.map((h, i) => <div key={i} className="py-0.5 border-b border-white/5">{h}</div>)
          )}
        </div>
      )}

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button onClick={handleClear} className="btn-calc bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold rounded-xl hover:bg-rose-600/40">C</button>
        <button onClick={() => setDisplay((prev) => (parseFloat(prev) * -1).toString())} className="btn-calc bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700">±</button>
        <button onClick={() => setDisplay((prev) => (parseFloat(prev) / 100).toString())} className="btn-calc bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700">%</button>
        <button onClick={() => handleOperator('÷')} className="btn-calc bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold">÷</button>

        <button onClick={() => handleDigit('7')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">7</button>
        <button onClick={() => handleDigit('8')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">8</button>
        <button onClick={() => handleDigit('9')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">9</button>
        <button onClick={() => handleOperator('×')} className="btn-calc bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold">×</button>

        <button onClick={() => handleDigit('4')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">4</button>
        <button onClick={() => handleDigit('5')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">5</button>
        <button onClick={() => handleDigit('6')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">6</button>
        <button onClick={() => handleOperator('-')} className="btn-calc bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold">-</button>

        <button onClick={() => handleDigit('1')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">1</button>
        <button onClick={() => handleDigit('2')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">2</button>
        <button onClick={() => handleDigit('3')} className="btn-calc bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">3</button>
        <button onClick={() => handleOperator('+')} className="btn-calc bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold">+</button>

        <button onClick={() => handleDigit('0')} className="btn-calc col-span-2 bg-slate-800/80 text-white rounded-xl hover:bg-slate-700 text-base font-semibold">0</button>
        <button onClick={() => handleDigit('.')} className="btn-calc bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-base font-bold">.</button>
        <button onClick={handleEquals} className="btn-calc bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:brightness-110">=</button>
      </div>
    </div>
  );
};
