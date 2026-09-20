import React from 'react';
import { ShieldCheck, QrCode, Users, Sparkles } from 'lucide-react';

export default function Onboarding({ onFinish }) {
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col justify-between p-6 text-white text-right">
      <div className="mt-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3">أهلاً بك في تمام الكشافة</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          النظام الميداني الذكي لتسجيل تمام الكشافة وحضور الأفراد بسهولة وسرعة عالية أوفلاين.
        </p>

        <div className="mt-8 space-y-5">
          <div className="flex items-center space-x-4 space-x-reverse bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <QrCode className="w-8 h-8 text-indigo-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-white">مسح QR Code سريح</h3>
              <p className="text-sm text-slate-400">تحضير أوتوماتيكي بكاميرا الموبايل بدون تعقيد</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <Users className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-white">يعمل بدون إنترنت 100%</h3>
              <p className="text-sm text-slate-400">حفظ البيانات محلياً على الموبايل لضمان الأداء الميداني</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 active:scale-95 flex items-center justify-center space-x-2 space-x-reverse"
      >
        <span>ابدأ استخدام التطبيق</span>
        <Sparkles className="w-5 h-5" />
      </button>
    </div>
  );
}
