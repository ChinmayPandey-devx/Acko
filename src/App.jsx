import React, { useState, useEffect } from 'react';
import { ChevronRight, FileText, CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

// --- MOCK DATA ---
const claimDetails = {
  title: "Bike claim",
  filedDate: "May 30",
  policyExpiry: "Jun 1",
};

const decisionTrail = [
  { id: 1, time: "May 30, 10:00 AM", event: "Claim filed with 6 photos", status: "completed" },
  { id: 2, time: "May 31, 2:30 PM", event: "Survey assigned to agent", status: "completed" },
  { id: 3, time: "Jun 2, 11:15 AM", event: "Repair estimate document received", status: "completed" },
  { id: 4, time: "Jun 27, 4:00 PM", event: "Missing: signed claim form", clauseCited: "4.2", status: "rejected" },
];

const policyClauses = {
  "4.2": "Signed claim form required within 30 days of survey completion. Failure to provide this document will result in claim rejection."
};

const initialSyncStatus = [
  { id: 1, step: "Claim approved", time: "Jun 2, 09:00 AM", status: "confirmed" },
  { id: 2, step: "Survey completed", time: "Jun 3, 11:30 AM", status: "confirmed" },
  { id: 3, step: "Work order released", time: "Pending", status: "unconfirmed" },
];

// --- MAIN COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('trail'); // 'trail' | 'sync'
  const [isAfterState, setIsAfterState] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      
      {/* Mobile Device Frame */}
      <div className="w-full max-w-[390px] h-[800px] bg-gray-50 rounded-[3rem] shadow-2xl border-[14px] border-gray-900 relative overflow-hidden flex flex-col">
        
        {/* Header / Notch Area */}
        <div className="bg-white pt-10 pb-4 px-6 shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              acko<span className="text-brand-purple">.</span>
            </h1>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">JD</div>
          </div>
          
          {/* Segmented Control */}
          <div className="flex p-1 bg-gray-100 rounded-xl relative">
            <button 
              onClick={() => setActiveTab('trail')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 z-10 ${activeTab === 'trail' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Decision Trail
            </button>
            <button 
              onClick={() => setActiveTab('sync')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 z-10 ${activeTab === 'sync' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Live Sync
            </button>
            
            {/* Sliding background */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-purple rounded-lg transition-transform duration-300 ease-out shadow-sm"
              style={{ transform: activeTab === 'trail' ? 'translateX(0)' : 'translateX(100%)' }}
            />
          </div>
        </div>

        {/* Global Before/After Toggle */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center z-10">
          <span className="text-sm font-semibold text-gray-600">Trust Layer Demo</span>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
            <button 
              onClick={() => setIsAfterState(false)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${!isAfterState ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Before
            </button>
            <button 
              onClick={() => setIsAfterState(true)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${isAfterState ? 'bg-white shadow-sm text-brand-purple' : 'text-gray-500'}`}
            >
              After
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-12 relative">
          <div className="transition-opacity duration-300">
            {activeTab === 'trail' ? (
              <DecisionTrailTab isAfter={isAfterState} />
            ) : (
              <LiveSyncTab isAfter={isAfterState} />
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

// --- TAB 1: DECISION TRAIL ---
function DecisionTrailTab({ isAfter }) {
  const [expandedClause, setExpandedClause] = useState(false);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h2 className="text-lg font-bold px-1 text-gray-800">
        Claim Decision
      </h2>

      {!isAfter ? (
        /* BEFORE STATE */
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">{claimDetails.title}</h3>
              <p className="text-sm text-gray-500">Filed {claimDetails.filedDate}</p>
            </div>
            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
              Closed
            </div>
          </div>
          
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-red-600 mb-1">Claim Rejected</h2>
            <p className="text-gray-600 text-sm font-medium">Documents were incorrect</p>
          </div>
          
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mt-4">
            <p className="text-xs text-red-800 font-medium">
              Rejected 2 days before policy expiry, after 4 weeks of document requests.
            </p>
          </div>
        </div>
      ) : (
        /* AFTER STATE */
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-5">
          <div className="flex justify-between items-start pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900">{claimDetails.title}</h3>
              <p className="text-sm text-gray-500">Filed {claimDetails.filedDate}</p>
            </div>
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
              Closed
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-4">Decision Audit Trail</h4>
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              
              {decisionTrail.map((item, index) => {
                const isLast = index === decisionTrail.length - 1;
                const isRejected = item.status === 'rejected';
                
                return (
                  <div key={item.id} className="relative">
                    {/* Status Dot */}
                    <div className={`absolute -left-[30px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      isRejected ? 'bg-red-500' : 'bg-brand-green'
                    }`}>
                      {isRejected ? (
                        <XCircle className="w-3 h-3 text-white" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-400">{item.time}</span>
                      <p className={`text-sm font-medium ${isRejected ? 'text-red-600' : 'text-gray-800'}`}>
                        {item.event} {item.clauseCited && <span className="font-bold">(Policy clause {item.clauseCited})</span>}
                      </p>
                      
                      {isRejected && item.clauseCited && (
                        <div className="mt-2">
                          <button 
                            onClick={() => setExpandedClause(!expandedClause)}
                            className="flex items-center gap-1 text-xs font-bold text-brand-purple bg-brand-purple/5 hover:bg-brand-purple/10 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            See policy clause cited
                            {expandedClause ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                          </button>
                          
                          {expandedClause && (
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-600 animate-in slide-in-from-top-2 fade-in duration-200">
                              <span className="font-bold text-gray-800 block mb-1">Clause {item.clauseCited}:</span>
                              {policyClauses[item.clauseCited]}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- TAB 2: LIVE SYNC ---
function LiveSyncTab({ isAfter }) {
  const [syncStatus, setSyncStatus] = useState(initialSyncStatus);
  const [isSimulating, setIsSimulating] = useState(false);

  // Reset state when toggling before/after
  useEffect(() => {
    setSyncStatus(initialSyncStatus);
    setIsSimulating(false);
  }, [isAfter]);

  const handleSimulate = () => {
    if (isSimulating || syncStatus[2].status === 'confirmed') return;
    
    setIsSimulating(true);
    
    // Simulate network delay
    setTimeout(() => {
      setSyncStatus(prev => {
        const newStatus = [...prev];
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        
        newStatus[2] = {
          ...newStatus[2],
          status: 'confirmed',
          time: `Today, ${timeString}`
        };
        return newStatus;
      });
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h2 className="text-lg font-bold px-1 text-gray-800">
        Claim Status
      </h2>

      {!isAfter ? (
        /* BEFORE STATE */
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-medium text-gray-800">Claim approved</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-medium text-gray-800">Survey completed</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-medium text-gray-800">Work order released</span>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-red-800">
              Service center: "we never received a work order"
            </p>
          </div>
        </div>
      ) : (
        /* AFTER STATE */
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-5">
          <div className="space-y-5">
            {syncStatus.map((item, index) => {
              const isConfirmed = item.status === 'confirmed';
              
              return (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {isConfirmed ? (
                        <CheckCircle2 className="w-5 h-5 text-brand-green" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.step}</p>
                      <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isConfirmed 
                          ? 'bg-green-50 text-brand-green' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {isConfirmed ? 'Confirmed' : 'Sent, unconfirmed'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-400 text-right">
                    {item.time}
                  </div>
                </div>
              );
            })}
          </div>

          {syncStatus[2].status === 'unconfirmed' && (
            <div className="mt-4 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                Waiting on service center to confirm receipt — you'll be notified when they do.
              </p>
            </div>
          )}

          {/* Interaction Trigger */}
          <div className="pt-4 mt-2 border-t border-gray-100">
            <button
              onClick={handleSimulate}
              disabled={syncStatus[2].status === 'confirmed' || isSimulating}
              className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                syncStatus[2].status === 'confirmed'
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-purple text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing with partner API...
                </>
              ) : syncStatus[2].status === 'confirmed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Sync Complete
                </>
              ) : (
                'Simulate confirmation received'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
