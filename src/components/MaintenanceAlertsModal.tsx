import React, { useState } from 'react';
import { 
  Wrench, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  Activity,
  Send,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const MaintenanceAlertsModal: React.FC = () => {
  const { isMaintenanceAlertsOpen, setIsMaintenanceAlertsOpen, openIoTSensorModal, showToast } = useMarketplace();
  const [alerts, setAlerts] = useState([
    {
      id: 'm-1',
      machine: 'Raycus 3kW Fiber Laser Cutter #2',
      issue: 'Optical lens cooling flow below normal threshold (1.8 L/min)',
      severity: 'Critical',
      timestamp: '25 mins ago',
      status: 'Pending Admin Action',
      location: 'Ikeja Industrial Hub, Lagos'
    },
    {
      id: 'm-2',
      machine: 'Yawei 160T Hydraulic Press Brake',
      issue: 'Hydraulic oil temperature elevated (58°C)',
      severity: 'Warning',
      timestamp: '2 hours ago',
      status: 'Pending Admin Action',
      location: 'Benin City Fabrication Yard'
    },
    {
      id: 'm-3',
      machine: 'Miller Dynasty 400 TIG Welder',
      issue: 'Inverter cooling fan RPM fluctuation detected',
      severity: 'Info',
      timestamp: 'Yesterday',
      status: 'Scheduled Inspection',
      location: 'Aba Engineering Zone'
    }
  ]);

  if (!isMaintenanceAlertsOpen) return null;

  const handleResolveAlert = (id: string, machineName: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Technician Dispatched & Resolved' } : a));
    showToast(`🔧 Maintenance technician dispatched for ${machineName}. Alert resolved!`);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-600 text-white shadow shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black">Industrial Maintenance & IoT Sensor Alerts</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Real-time telemetry and predictive maintenance alerts requiring admin action.</p>
            </div>
          </div>
          <button
            onClick={() => setIsMaintenanceAlertsOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700 hover:border-rose-600 transition-colors cursor-pointer shrink-0 ml-2 shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Live IoT Sensor Integration Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/60 rounded-xl p-3.5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 shrink-0">
                <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Live Vibration & Bearing Temperature Analytics</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">Stream real-time sensor node waveforms and link purchased equipment to Recharts monitor.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMaintenanceAlertsOpen(false);
                openIoTSensorModal();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
            >
              <span>Launch IoT Monitor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Active IoT Telemetry Alerts ({alerts.filter(a => a.status.includes('Pending')).length})</h3>
            <span className="text-xs text-slate-500">Auto-synced with MTM Factory Gateways</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-xl border transition space-y-3 ${
                  alert.severity === 'Critical' 
                    ? 'bg-rose-50/70 border-rose-300' 
                    : alert.severity === 'Warning'
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-blue-50/50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'Critical' ? 'bg-rose-600 text-white' : alert.severity === 'Warning' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        alert.severity === 'Critical' ? 'bg-rose-600 text-white' : alert.severity === 'Warning' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {alert.severity} Priority
                      </span>
                      <h4 className="font-black text-sm text-slate-900 mt-1">{alert.machine}</h4>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-200">
                  <strong>Issue:</strong> {alert.issue}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-slate-500">Location: <strong className="text-slate-700">{alert.location}</strong></span>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                      alert.status.includes('Resolved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.status}
                    </span>

                    {!alert.status.includes('Resolved') && (
                      <button
                        onClick={() => handleResolveAlert(alert.id, alert.machine)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Dispatch Technician</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Admin Action Center • MTM Industrial Operations</span>
          <button
            onClick={() => setIsMaintenanceAlertsOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
