import React, { useState, useEffect } from 'react';
import { Users, UserPlus, QrCode, Check, RefreshCw, Smartphone, Search, Award } from 'lucide-react';
import Onboarding from './components/Onboarding';
import ScannerModal from './components/ScannerModal';
import { getStoredMembers, saveMembers, getStoredAttendance, saveAttendance } from './utils/store';
import { syncDataWithCloud } from './utils/sync';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberCode, setNewMemberCode] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [syncStatus, setSyncStatus] = useState('محلي أوفلاين');

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('tamam_seen_onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    setMembers(getStoredMembers());
    setAttendance(getStoredAttendance());
  }, []);

  const handleFinishOnboarding = () => {
    localStorage.setItem('tamam_seen_onboarding', 'true');
    setShowOnboarding(false);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      code: newMemberCode.trim() || Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toLocaleDateString('ar-EG')
    };
    const updated = [newMember, ...members];
    setMembers(updated);
    saveMembers(updated);
    setNewMemberName('');
    setNewMemberCode('');
  };

  const toggleAttendance = (id) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...attendance };
    if (!updated[today]) updated[today] = {};
    updated[today][id] = !updated[today][id];
    setAttendance(updated);
    saveAttendance(updated);
  };

  const handleScanResult = (code) => {
    const today = new Date().toISOString().split('T')[0];
    const found = members.find(m => m.code === code || m.id === code);
    if (found) {
      const updated = { ...attendance };
      if (!updated[today]) updated[today] = {};
      updated[today][found.id] = true;
      setAttendance(updated);
      saveAttendance(updated);
      alert(`تم تسجيل حضور: ${found.name}`);
    } else {
      alert(`لم يتم العثور على كشاف بهذا الكود: ${code}`);
    }
    setShowScanner(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance[todayStr] || {};
  const presentCount = Object.values(todayAttendance).filter(Boolean).length;

  const filteredMembers = members.filter(m =>
    m.name.includes(searchTerm) || m.code.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col dir-rtl font-sans max-w-md mx-auto relative border-x border-slate-800 shadow-2xl">
      {showOnboarding && <Onboarding onFinish={handleFinishOnboarding} />}
      {showScanner && <ScannerModal onClose={() => setShowScanner(false)} onScanSuccess={handleScanResult} />}

      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700/80 p-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">تمام الكشافة</h1>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              جاهز أوفلاين 100%
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
        >
          <QrCode className="w-4 h-4" />
          <span>مسح QR</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-slate-800 border border-indigo-500/30 rounded-2xl p-4 mb-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-xs text-indigo-300 font-medium mb-1">تمام اليوم ({new Date().toLocaleDateString('ar-EG')})</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{presentCount}</span>
              <span className="text-sm text-slate-400">من أصل {members.length} كشاف</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-4 border border-slate-700">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            كشوفات التمام
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${activeTab === 'add' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            إضافة كشاف جديد
          </button>
        </div>

        {activeTab === 'list' ? (
          <div>
            {/* Search input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                placeholder="بحث باسم الكشاف أو الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* List */}
            {filteredMembers.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700">
                <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">لا يوجد أفراد مضافين بعد.</p>
                <p className="text-xs text-slate-500 mt-1">انتقل لتبويب الإضافة لتسجيل الكشافة.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredMembers.map((member) => {
                  const isPresent = !!todayAttendance[member.id];
                  return (
                    <div
                      key={member.id}
                      onClick={() => toggleAttendance(member.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition cursor-pointer active:scale-98 ${
                        isPresent
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isPresent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {member.code}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-white">{member.name}</h4>
                          <span className="text-[10px] text-slate-400">تاريخ القيد: {member.createdAt}</span>
                        </div>
                      </div>

                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
                        isPresent ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600 bg-slate-800'
                      }`}>
                        {isPresent && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Add Member Form */
          <form onSubmit={handleAddMember} className="bg-slate-800 border border-slate-700 p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-700 pb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              تسجيل فرد كشفي جديد
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">اسم الكشاف رباعي *</label>
              <input
                type="text"
                required
                placeholder="مثال: مينا طارق جورج"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">كود الكشاف (اختياري)</label>
              <input
                type="text"
                placeholder="سوف يتولد تلقائياً إن تركته فارغاً"
                value={newMemberCode}
                onChange={(e) => setNewMemberCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-3 rounded-xl text-sm transition active:scale-95 shadow-lg shadow-indigo-600/30"
            >
              إضافة لكشف التمام
            </button>
          </form>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-800/95 backdrop-blur border-t border-slate-700 p-3 text-center text-xs text-slate-400 z-30 flex justify-around">
        <span className="flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          داعم للآيفون والأندرويد
        </span>
        <span className="text-slate-600">|</span>
        <span>تطبيق تمام الكشافة الميداني</span>
      </footer>
    </div>
  );
}
