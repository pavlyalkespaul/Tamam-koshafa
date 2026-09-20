import React, { useState } from 'react';
import { X, QrCode, CheckCircle2 } from 'lucide-react';

export default function ScannerModal({ onClose, onScanSuccess }) {
  const [manualCode, setManualCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 dir-rtl">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-700/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mt-2">
          <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <QrCode className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-1">تأكيد حضور الكشاف</h2>
          <p className="text-sm text-slate-400 mb-6">ادخل كود/رقم الكشاف لتسجيل التمام أوفلاين</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="رقم أو كود الكشاف..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              autoFocus
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 space-x-reverse transition active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>تسجيل التمام الآن</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
