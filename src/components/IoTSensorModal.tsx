import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Activity,
  Thermometer,
  Waves,
  Cpu,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Play,
  Pause,
  Plus,
  Trash2,
  Settings2,
  Sliders,
  Download,
  Zap,
  RotateCcw,
  Gauge,
  Radio,
  X,
  Layers,
  Flame,
  ArrowUpRight,
  Info,
  Clock,
  Building2,
  ChevronRight,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export interface LinkedMachine {
  id: string;
  name: string;
  model: string;
  category: string;
  serialNumber: string;
  sensorNodeId: string;
  protocol: 'MQTT' | 'Modbus TCP' | 'LoRaWAN' | 'BLE 5.2';
  installationBay: string;
  status: 'Normal' | 'Warning' | 'Critical';
  vibrationAlertThreshold: number; // mm/s
  temperatureAlertThreshold: number; // °C
  firmware: string;
  signalStrength: number; // -30 to -90 dBm
  nominalRpm: number;
  baseVibration: number;
  baseTemp: number;
}

interface TelemetryPoint {
  time: string;
  timestamp: number;
  vibration: number; // mm/s
  temperature: number; // °C
  rpm: number;
  accelG: number;
}

const DEFAULT_PURCHASED_MACHINES: LinkedMachine[] = [
  {
    id: 'iot-mach-1',
    name: 'Raycus 3kW Fiber Laser Cutter',
    model: 'RFL-C3000S High-Power',
    category: 'Industrial Machinery',
    serialNumber: 'SN-RAY-2026-9811',
    sensorNodeId: 'MTM-NODE-8841-A',
    protocol: 'MQTT',
    installationBay: 'Ikeja Plant • Cutting Bay 1',
    status: 'Normal',
    vibrationAlertThreshold: 4.5,
    temperatureAlertThreshold: 75.0,
    firmware: 'v2.4.12-Pro',
    signalStrength: -54,
    nominalRpm: 4200,
    baseVibration: 1.65,
    baseTemp: 52.4
  },
  {
    id: 'iot-mach-2',
    name: 'SCM Olimpic K 560 Edgebander',
    model: 'Olimpic K 560 High-Speed Pre-Milling',
    category: 'Furniture Manufacturing',
    serialNumber: 'SN-SCM-44021',
    sensorNodeId: 'MTM-NODE-9022-B',
    protocol: 'Modbus TCP',
    installationBay: 'Joinery Line 2 • Finishing Section',
    status: 'Warning',
    vibrationAlertThreshold: 4.2,
    temperatureAlertThreshold: 70.0,
    firmware: 'v3.1.0-RT',
    signalStrength: -68,
    nominalRpm: 12000,
    baseVibration: 3.85,
    baseTemp: 71.8
  },
  {
    id: 'iot-mach-3',
    name: 'Yawei 160T CNC Press Brake',
    model: 'PBH 160/3100 4+1 Axis',
    category: 'Metal Welding and Fabrication',
    serialNumber: 'SN-YAW-88301',
    sensorNodeId: 'MTM-NODE-7714-C',
    protocol: 'Modbus TCP',
    installationBay: 'Benin Fabrication Yard • Bay 4',
    status: 'Normal',
    vibrationAlertThreshold: 4.8,
    temperatureAlertThreshold: 78.0,
    firmware: 'v2.2.8-Ind',
    signalStrength: -62,
    nominalRpm: 1450,
    baseVibration: 1.42,
    baseTemp: 58.6
  },
  {
    id: 'iot-mach-4',
    name: 'Biesse Rover A 1632 CNC Machining Centre',
    model: 'Rover A FT 5-Axis SmartLine',
    category: 'Industrial Machinery',
    serialNumber: 'SN-BIE-90142',
    sensorNodeId: 'MTM-NODE-6239-D',
    protocol: 'MQTT',
    installationBay: 'Aba Engineering Hub • Cell 2',
    status: 'Normal',
    vibrationAlertThreshold: 3.8,
    temperatureAlertThreshold: 68.0,
    firmware: 'v4.0.2',
    signalStrength: -59,
    nominalRpm: 18000,
    baseVibration: 1.25,
    baseTemp: 49.3
  }
];

export const IoTSensorModal: React.FC = () => {
  const {
    isIoTSensorModalOpen,
    setIsIoTSensorModalOpen,
    selectedIoTMachineId,
    setSelectedIoTMachineId,
    cart,
    purchaseOrders,
    showToast
  } = useMarketplace();

  // Machines state
  const [machines, setMachines] = useState<LinkedMachine[]>(() => {
    const saved = localStorage.getItem('mtm_iot_linked_machines');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PURCHASED_MACHINES;
  });

  // Selected Machine
  const [activeMachineId, setActiveMachineId] = useState<string>(() => {
    return selectedIoTMachineId || DEFAULT_PURCHASED_MACHINES[0].id;
  });

  useEffect(() => {
    if (selectedIoTMachineId) {
      setActiveMachineId(selectedIoTMachineId);
    }
  }, [selectedIoTMachineId]);

  // Persist machines
  useEffect(() => {
    localStorage.setItem('mtm_iot_linked_machines', JSON.stringify(machines));
  }, [machines]);

  const activeMachine = useMemo(() => {
    return machines.find(m => m.id === activeMachineId) || machines[0] || DEFAULT_PURCHASED_MACHINES[0];
  }, [machines, activeMachineId]);

  // Telemetry stream state
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(() => {
    const now = Date.now();
    const points: TelemetryPoint[] = [];
    const baseVib = activeMachine ? activeMachine.baseVibration : 1.8;
    const baseTemp = activeMachine ? activeMachine.baseTemp : 55.0;
    const baseRpm = activeMachine ? activeMachine.nominalRpm : 3600;

    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 2000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const vibNoise = (Math.sin(i * 0.45) * 0.35) + (Math.random() * 0.25 - 0.12);
      const tempNoise = (Math.cos(i * 0.2) * 1.8) + (Math.random() * 0.8 - 0.4);
      points.push({
        time: timeStr,
        timestamp: t.getTime(),
        vibration: parseFloat(Math.max(0.4, baseVib + vibNoise).toFixed(2)),
        temperature: parseFloat((baseTemp + tempNoise).toFixed(1)),
        rpm: Math.round(baseRpm + (Math.random() * 60 - 30)),
        accelG: parseFloat((0.85 + (baseVib * 0.3) + Math.random() * 0.15).toFixed(2))
      });
    }
    return points;
  });

  // Stream controls
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamIntervalMs, setStreamIntervalMs] = useState<number>(2000);
  const [activeMetricFilter, setActiveMetricFilter] = useState<'both' | 'vibration' | 'temperature'>('both');
  const [timeWindow, setTimeWindow] = useState<'25s' | '1m' | '5m'>('25s');
  const [isAnomalyActive, setIsAnomalyActive] = useState<boolean>(false);
  const [showLinkMachineForm, setShowLinkMachineForm] = useState<boolean>(false);
  const [showIsoGuide, setShowIsoGuide] = useState<boolean>(false);

  // New Machine Form State
  const [newMachineName, setNewMachineName] = useState('');
  const [newMachineModel, setNewMachineModel] = useState('');
  const [newMachineSerial, setNewMachineSerial] = useState('');
  const [newSensorNodeId, setNewSensorNodeId] = useState('');
  const [newProtocol, setNewProtocol] = useState<'MQTT' | 'Modbus TCP' | 'LoRaWAN' | 'BLE 5.2'>('MQTT');
  const [newInstallationBay, setNewInstallationBay] = useState('Lagos Industrial Zone • Plant A');
  const [newVibLimit, setNewVibLimit] = useState(4.5);
  const [newTempLimit, setNewTempLimit] = useState(75.0);

  // Anomaly auto-timer ref
  const anomalyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time interval streaming generator
  useEffect(() => {
    if (!isStreaming || !isIoTSensorModalOpen) return;

    const interval = setInterval(() => {
      setTelemetryHistory(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const baseV = isAnomalyActive ? (activeMachine.vibrationAlertThreshold + 1.85) : activeMachine.baseVibration;
        const baseT = isAnomalyActive ? (activeMachine.temperatureAlertThreshold + 9.5) : activeMachine.baseTemp;
        
        const randomV = (Math.random() * 0.4 - 0.2) + (isAnomalyActive ? (Math.random() * 0.8) : 0);
        const randomT = (Math.random() * 0.6 - 0.3) + (isAnomalyActive ? (Math.random() * 1.2) : 0);
        
        const newVib = Math.max(0.4, parseFloat((baseV + randomV).toFixed(2)));
        const newTemp = parseFloat((baseT + randomT).toFixed(1));
        const newRpm = Math.round(activeMachine.nominalRpm + (isAnomalyActive ? -320 : (Math.random() * 80 - 40)));
        const newAccel = parseFloat((0.8 + (newVib * 0.42) + Math.random() * 0.1).toFixed(2));

        const newPoint: TelemetryPoint = {
          time: timeStr,
          timestamp: now.getTime(),
          vibration: newVib,
          temperature: newTemp,
          rpm: newRpm,
          accelG: newAccel
        };

        const maxPoints = timeWindow === '25s' ? 25 : timeWindow === '1m' ? 45 : 70;
        const updated = [...prev.slice(1 - maxPoints), newPoint];
        return updated;
      });
    }, streamIntervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, isIoTSensorModalOpen, activeMachine, isAnomalyActive, streamIntervalMs, timeWindow]);

  // Latest Telemetry Point
  const latestPoint = telemetryHistory[telemetryHistory.length - 1] || {
    vibration: activeMachine.baseVibration,
    temperature: activeMachine.baseTemp,
    rpm: activeMachine.nominalRpm,
    accelG: 1.2,
    time: 'Now'
  };

  // Severity Evaluation based on ISO 10816-3
  const isVibAlert = latestPoint.vibration >= activeMachine.vibrationAlertThreshold;
  const isTempAlert = latestPoint.temperature >= activeMachine.temperatureAlertThreshold;
  const isWarning = isVibAlert || isTempAlert;

  const isoClassification = useMemo(() => {
    const v = latestPoint.vibration;
    if (v < 2.3) return { label: 'Class I/II: Good (Zone A)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40', badge: 'Zone A' };
    if (v < 4.5) return { label: 'Class I/II: Acceptable (Zone B)', color: 'text-sky-300 bg-sky-950/60 border-sky-500/40', badge: 'Zone B' };
    if (v < 7.1) return { label: 'Class I/II: Unsatisfactory (Zone C)', color: 'text-amber-300 bg-amber-950/60 border-amber-500/40', badge: 'Zone C' };
    return { label: 'Class I/II: Unacceptable / Damage Risk (Zone D)', color: 'text-rose-300 bg-rose-950/60 border-rose-500/40', badge: 'Zone D' };
  }, [latestPoint.vibration]);

  // Trigger simulated surge anomaly
  const handleTriggerAnomaly = () => {
    setIsAnomalyActive(true);
    showToast(`⚠️ Anomaly Injected: High Vibration (${(activeMachine.vibrationAlertThreshold + 1.8).toFixed(1)} mm/s) & Thermal Surge!`);
    if (anomalyTimerRef.current) clearTimeout(anomalyTimerRef.current);
    // Auto-normalize after 16 seconds
    anomalyTimerRef.current = setTimeout(() => {
      setIsAnomalyActive(false);
      showToast('✓ Mechanical load returned to normal nominal baseline.');
    }, 16000);
  };

  const handleClearAnomaly = () => {
    setIsAnomalyActive(false);
    if (anomalyTimerRef.current) clearTimeout(anomalyTimerRef.current);
    showToast('✓ Simulation reset to normal baseline.');
  };

  // Export Telemetry CSV Log
  const handleExportCsv = () => {
    const headers = ['Timestamp', 'Time', 'Machine Name', 'Sensor Node ID', 'Vibration (mm/s)', 'Temperature (°C)', 'Spindle RPM', 'Peak Accel (g)', 'Vibration Limit', 'Temp Limit'];
    const rows = telemetryHistory.map(pt => [
      pt.timestamp,
      pt.time,
      `"${activeMachine.name}"`,
      activeMachine.sensorNodeId,
      pt.vibration,
      pt.temperature,
      pt.rpm,
      pt.accelG,
      activeMachine.vibrationAlertThreshold,
      activeMachine.temperatureAlertThreshold
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MTM_IoT_Telemetry_${activeMachine.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📄 Exported ${telemetryHistory.length} telemetry data points to CSV.`);
  };

  // Link New Machine Action
  const handleLinkNewMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachineName.trim()) {
      showToast('Please enter a machine name or select from purchases.');
      return;
    }

    const nodeGen = newSensorNodeId.trim() || `MTM-NODE-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const snGen = newMachineSerial.trim() || `SN-${newMachineName.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newMach: LinkedMachine = {
      id: `iot-mach-${Date.now()}`,
      name: newMachineName.trim(),
      model: newMachineModel.trim() || 'Industrial Specification',
      category: 'Industrial Machinery',
      serialNumber: snGen,
      sensorNodeId: nodeGen,
      protocol: newProtocol,
      installationBay: newInstallationBay.trim() || 'Factory Floor Bay 1',
      status: 'Normal',
      vibrationAlertThreshold: Number(newVibLimit) || 4.5,
      temperatureAlertThreshold: Number(newTempLimit) || 75.0,
      firmware: 'v3.2.0-IoT',
      signalStrength: -58,
      nominalRpm: 3600,
      baseVibration: 1.55,
      baseTemp: 52.0
    };

    setMachines(prev => [newMach, ...prev]);
    setActiveMachineId(newMach.id);
    setShowLinkMachineForm(false);
    setNewMachineName('');
    setNewMachineModel('');
    setNewMachineSerial('');
    setNewSensorNodeId('');
    showToast(`🎉 Linked ${newMach.name} to Sensor Node ${newMach.sensorNodeId}! Real-time stream active.`);
  };

  // Remove machine link
  const handleUnlinkMachine = (id: string, name: string) => {
    if (machines.length <= 1) {
      showToast('Cannot remove the last remaining connected equipment.');
      return;
    }
    setMachines(prev => prev.filter(m => m.id !== id));
    if (activeMachineId === id) {
      const remaining = machines.filter(m => m.id !== id);
      setActiveMachineId(remaining[0].id);
    }
    showToast(`Unlinked ${name} from IoT Telemetry Hub.`);
  };

  if (!isIoTSensorModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        id="iot-sensor-integration-modal"
        className="bg-slate-950 border border-slate-800 text-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh] my-auto animate-in zoom-in-95 duration-200"
      >
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400 shadow-lg shadow-blue-950/50 shrink-0">
              <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  IoT Sensor Integration & Telemetry Monitor
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
                  <span>Real-Time Modbus / MQTT</span>
                </span>
                {isWarning && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/50 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-bounce">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Threshold Breach</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time 3-axis vibration velocity (mm/s RMS) & bearing thermal analytics with ISO 10816-3 severity tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            {/* Live Streaming Toggle Button */}
            <button
              id="iot-stream-toggle-btn"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border cursor-pointer ${
                isStreaming
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isStreaming ? 'Pause Live Stream' : 'Resume Live Stream'}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Stream Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-300" />
                  <span>Stream Paused</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              id="iot-modal-close-btn"
              onClick={() => setIsIoTSensorModalOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 hover:border-rose-600 transition-colors cursor-pointer border border-slate-700 shadow-xs"
              title="Close dialog"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUBNAV: LINKED MACHINES TABS & ACTIONS */}
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Linked Equipment:</span>
            </span>

            {machines.map(mach => {
              const isSelected = mach.id === activeMachine.id;
              return (
                <button
                  key={mach.id}
                  id={`select-machine-tab-${mach.id}`}
                  onClick={() => {
                    setActiveMachineId(mach.id);
                    setSelectedIoTMachineId(mach.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/40'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    mach.status === 'Critical' ? 'bg-rose-400 animate-ping' : mach.status === 'Warning' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span className="truncate max-w-[140px] sm:max-w-[190px]">{mach.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({mach.sensorNodeId.slice(-4)})</span>
                </button>
              );
            })}

            <button
              id="open-link-machine-form-btn"
              onClick={() => setShowLinkMachineForm(!showLinkMachineForm)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ml-1"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Link Purchased Machine</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 self-end md:self-auto">
            {/* Anomaly Testing Button */}
            {!isAnomalyActive ? (
              <button
                id="iot-trigger-anomaly-btn"
                onClick={handleTriggerAnomaly}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                title="Simulate high vibration unbalance & bearing temperature rise"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Surge / Anomaly</span>
              </button>
            ) : (
              <button
                id="iot-clear-anomaly-btn"
                onClick={handleClearAnomaly}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md animate-pulse border border-[#7A101A]/30"
                title="Normalize machine telemetry back to baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Anomaly</span>
              </button>
            )}

            {/* Export CSV */}
            <button
              id="iot-export-csv-btn"
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              title="Download Telemetry History Log as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* ISO 10816 Guide Modal Toggle */}
            <button
              onClick={() => setShowIsoGuide(!showIsoGuide)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title="View ISO 10816-3 Vibration Standards"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE FORM: LINK NEW PURCHASED MACHINE */}
        {showLinkMachineForm && (
          <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 animate-in slide-in-from-top-3 duration-200">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-black text-white">Pair New Purchased Machine to IoT Wireless Sensor</h3>
                </div>
                <button 
                  onClick={() => setShowLinkMachineForm(false)}
                  className="text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
              </div>

              {/* Fast link from current cart or purchase orders if available */}
              {(cart.length > 0 || purchaseOrders.length > 0) && (
                <div className="bg-blue-950/40 border border-blue-800/40 p-3 rounded-xl flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-blue-300">Quick-Select from Recent Orders:</span>
                  {cart.map(c => (
                    <button
                      key={c.product.id}
                      type="button"
                      onClick={() => {
                        setNewMachineName(c.product.title);
                        setNewMachineModel(c.product.model || c.product.brand);
                        setNewMachineSerial(`SN-${c.product.brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
                        showToast(`Pre-filled specs for ${c.product.title.slice(0, 24)}...`);
                      }}
                      className="px-2 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-white font-medium border border-blue-700 transition truncate max-w-[200px]"
                    >
                      + {c.product.title}
                    </button>
                  ))}
                  {purchaseOrders.flatMap(p => p.items).slice(0, 2).map((item, idx) => (
                    <button
                      key={`po-item-${idx}`}
                      type="button"
                      onClick={() => {
                        setNewMachineName(item.title);
                        setNewMachineModel(item.model || item.brand);
                        setNewMachineSerial(`SN-PO-${Math.floor(1000 + Math.random() * 9000)}`);
                        showToast(`Pre-filled specs for PO item ${item.title.slice(0, 24)}...`);
                      }}
                      className="px-2 py-1 rounded bg-indigo-900/60 hover:bg-indigo-800 text-white font-medium border border-indigo-700 transition truncate max-w-[200px]"
                    >
                      + {item.title}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleLinkNewMachine} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Machine Name / Equipment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCM Gabbiani Panel Saw"
                    value={newMachineName}
                    onChange={e => setNewMachineName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Machine Model / Specification</label>
                  <input
                    type="text"
                    placeholder="e.g. Galaxy 3 110 T"
                    value={newMachineModel}
                    onChange={e => setNewMachineModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">IoT Sensor Node Hardware ID</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank (e.g. MTM-NODE-8812)"
                    value={newSensorNodeId}
                    onChange={e => setNewSensorNodeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Fieldbus / Communication Protocol</label>
                  <select
                    value={newProtocol}
                    onChange={e => setNewProtocol(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="MQTT">MQTT Broker (TLS 1.3)</option>
                    <option value="Modbus TCP">Modbus TCP/IP (Port 502)</option>
                    <option value="LoRaWAN">LoRaWAN Industrial (868/915 MHz)</option>
                    <option value="BLE 5.2">Bluetooth 5.2 Low Energy Mesh</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Installation Bay / Factory Plant</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos Joinery Bay 3"
                    value={newInstallationBay}
                    onChange={e => setNewInstallationBay(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Vibration Warning Limit (mm/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={newVibLimit}
                    onChange={e => setNewVibLimit(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400">Max Operating Temp Limit (°C)</label>
                  <input
                    type="number"
                    step="1"
                    min="40"
                    max="120"
                    value={newTempLimit}
                    onChange={e => setNewTempLimit(parseFloat(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md shadow-blue-900/50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Authorize & Link Sensor</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* COLLAPSIBLE ISO 10816 GUIDELINE */}
        {showIsoGuide && (
          <div className="bg-slate-900/95 border-b border-slate-800 p-4 text-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-400" />
                <h4 className="font-black text-white">ISO 10816-3 Industrial Mechanical Vibration Standards Reference</h4>
              </div>
              <button onClick={() => setShowIsoGuide(false)} className="text-slate-400 hover:text-white">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="font-bold text-emerald-400 block">Zone A: &lt; 2.3 mm/s RMS</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Newly commissioned machinery, newly installed bearings, optimal balance.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30">
                <span className="font-bold text-sky-400 block">Zone B: 2.3 – 4.5 mm/s RMS</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Machines suitable for unrestricted continuous long-term industrial operation.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="font-bold text-amber-400 block">Zone C: 4.5 – 7.1 mm/s RMS</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Unsatisfactory. Restricted operation until remedial alignment/lubrication.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                <span className="font-bold text-rose-400 block">Zone D: &gt; 7.1 mm/s RMS</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Dangerous vibration severity. Machine damage imminent; shut down immediately.</p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* ACTIVE ASSET INFO BAR */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 rounded-2xl bg-blue-900/30 border border-blue-500/30 text-blue-400 shrink-0">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-white">{activeMachine.name}</h3>
                  <span className="font-mono text-xs text-slate-400 font-bold">({activeMachine.model})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                    activeMachine.status === 'Critical' ? 'bg-rose-900/40 text-rose-300 border-rose-600' : activeMachine.status === 'Warning' ? 'bg-amber-900/40 text-amber-300 border-amber-600' : 'bg-emerald-900/40 text-emerald-300 border-emerald-600'
                  }`}>
                    Status: {activeMachine.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                  <span>Sensor: <strong className="text-slate-200 font-mono">{activeMachine.sensorNodeId}</strong></span>
                  <span>Serial: <strong className="text-slate-200 font-mono">{activeMachine.serialNumber}</strong></span>
                  <span>Bay: <strong className="text-slate-200">{activeMachine.installationBay}</strong></span>
                  <span>Protocol: <strong className="text-blue-400 font-bold">{activeMachine.protocol}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">RSSI:</span>
                <span className="font-mono font-bold text-slate-200">{activeMachine.signalStrength} dBm</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">FW:</span>
                <span className="font-mono font-bold text-slate-200">{activeMachine.firmware}</span>
              </div>
              {machines.length > 1 && (
                <button
                  onClick={() => handleUnlinkMachine(activeMachine.id, activeMachine.name)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-500 transition cursor-pointer border border-slate-700"
                  title="Unlink this equipment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* TELEMETRY KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            {/* KPI 1: VIBRATION RMS */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isVibAlert 
                ? 'bg-rose-950/40 border-rose-500/60 ring-1 ring-rose-500/50 animate-pulse' 
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-blue-400" />
                  <span>Vibration RMS</span>
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${isoClassification.color}`}>
                  {isoClassification.badge}
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${
                  isVibAlert ? 'text-rose-400' : 'text-blue-400'
                }`}>
                  {latestPoint.vibration.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-slate-400">mm/s</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Alert Limit: <strong>{activeMachine.vibrationAlertThreshold} mm/s</strong></span>
                <span className={latestPoint.vibration < activeMachine.vibrationAlertThreshold ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {latestPoint.vibration < activeMachine.vibrationAlertThreshold ? '✓ Nominal' : '⚠️ Elevated'}
                </span>
              </div>
            </div>

            {/* KPI 2: BEARING TEMPERATURE */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isTempAlert 
                ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/50 animate-pulse' 
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span>Bearing Temp</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {((latestPoint.temperature * 9) / 5 + 32).toFixed(1)}°F
                </span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${
                  isTempAlert ? 'text-amber-400' : 'text-orange-400'
                }`}>
                  {latestPoint.temperature.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-slate-400">°C</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Max Safe: <strong>{activeMachine.temperatureAlertThreshold}°C</strong></span>
                <span className={latestPoint.temperature < activeMachine.temperatureAlertThreshold ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {latestPoint.temperature < activeMachine.temperatureAlertThreshold ? '✓ Safe Range' : '⚠️ Hot Bearing'}
                </span>
              </div>
            </div>

            {/* KPI 3: SPINDLE / MOTOR RPM */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  <span>Spindle Speed</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Rotational</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  {latestPoint.rpm.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400">RPM</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Nominal: <strong>{activeMachine.nominalRpm.toLocaleString()} RPM</strong></span>
                <span className="text-emerald-400 font-bold">Stable</span>
              </div>
            </div>

            {/* KPI 4: PEAK ACCELERATION */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Peak Acceleration</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold">3-Axis</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                  {latestPoint.accelG.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-slate-400">g-force</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Peak-to-Peak: <strong>{(latestPoint.vibration * 12.4).toFixed(0)} µm</strong></span>
                <span className="text-cyan-400 font-bold">Active</span>
              </div>
            </div>

          </div>

          {/* MAIN CHART CONTAINER */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            
            {/* Chart Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Real-Time Vibration Velocity & Temperature Trends</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dual-axis telemetry stream comparing mechanical vibration (mm/s, blue) against bearing thermal rise (°C, orange).
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Metric Selector */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-1 flex items-center space-x-1">
                  <button
                    onClick={() => setActiveMetricFilter('both')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      activeMetricFilter === 'both' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Both
                  </button>
                  <button
                    onClick={() => setActiveMetricFilter('vibration')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      activeMetricFilter === 'vibration' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Vibration Only
                  </button>
                  <button
                    onClick={() => setActiveMetricFilter('temperature')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      activeMetricFilter === 'temperature' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Temp Only
                  </button>
                </div>

                {/* Stream Rate Selector */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <span>Rate:</span>
                  <select
                    value={streamIntervalMs}
                    onChange={e => setStreamIntervalMs(Number(e.target.value))}
                    className="bg-transparent text-white font-bold focus:outline-hidden cursor-pointer"
                  >
                    <option value={1000} className="bg-slate-900 text-white">1 sec</option>
                    <option value={2000} className="bg-slate-900 text-white">2 sec</option>
                    <option value={5000} className="bg-slate-900 text-white">5 sec</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RESPONSIVE RECHARTS LINE CHART */}
            <div className="w-full h-72 sm:h-80 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={telemetryHistory}
                  margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    interval="preserveStartEnd"
                  />

                  {/* Left Y-Axis: Vibration (mm/s) */}
                  {(activeMetricFilter === 'both' || activeMetricFilter === 'vibration') && (
                    <YAxis
                      yAxisId="left"
                      stroke="#38BDF8"
                      fontSize={11}
                      tickLine={false}
                      domain={[0, (dataMax: number) => Math.max(8, Math.ceil(dataMax + 1))]}
                      tickFormatter={(v) => `${v} mm/s`}
                    />
                  )}

                  {/* Right Y-Axis: Temperature (°C) */}
                  {(activeMetricFilter === 'both' || activeMetricFilter === 'temperature') && (
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#FB923C"
                      fontSize={11}
                      tickLine={false}
                      domain={[30, (dataMax: number) => Math.max(100, Math.ceil(dataMax + 10))]}
                      tickFormatter={(v) => `${v}°C`}
                    />
                  )}

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as TelemetryPoint;
                        return (
                          <div className="bg-slate-950/95 border border-slate-700 text-white p-3 rounded-xl shadow-2xl space-y-1.5 text-xs font-mono backdrop-blur-md">
                            <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                              <span>🕒 {label}</span>
                              <span className="text-[10px] text-blue-400">{activeMachine.sensorNodeId}</span>
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                              <span className="text-sky-300 font-bold flex items-center gap-1">
                                <Waves className="w-3.5 h-3.5" /> Vibration:
                              </span>
                              <span className={`font-black ${data.vibration >= activeMachine.vibrationAlertThreshold ? 'text-rose-400' : 'text-sky-300'}`}>
                                {data.vibration} mm/s
                              </span>
                            </div>
                            <div className="flex items-center justify-between space-x-4">
                              <span className="text-orange-300 font-bold flex items-center gap-1">
                                <Thermometer className="w-3.5 h-3.5" /> Temp:
                              </span>
                              <span className={`font-black ${data.temperature >= activeMachine.temperatureAlertThreshold ? 'text-amber-400' : 'text-orange-300'}`}>
                                {data.temperature} °C
                              </span>
                            </div>
                            <div className="flex items-center justify-between space-x-4 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                              <span>Spindle Speed:</span>
                              <span className="text-emerald-400 font-bold">{data.rpm} RPM</span>
                            </div>
                            <div className="flex items-center justify-between space-x-4 text-[11px] text-slate-400">
                              <span>3-Axis Accel:</span>
                              <span className="text-cyan-400 font-bold">{data.accelG} g</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />

                  {/* Reference Threshold Lines */}
                  {(activeMetricFilter === 'both' || activeMetricFilter === 'vibration') && (
                    <ReferenceLine
                      yAxisId="left"
                      y={activeMachine.vibrationAlertThreshold}
                      stroke="#F43F5E"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `ISO Limit (${activeMachine.vibrationAlertThreshold} mm/s)`,
                        fill: '#FDA4AF',
                        fontSize: 10,
                        position: 'insideTopRight'
                      }}
                    />
                  )}

                  {(activeMetricFilter === 'both' || activeMetricFilter === 'temperature') && (
                    <ReferenceLine
                      yAxisId="right"
                      y={activeMachine.temperatureAlertThreshold}
                      stroke="#F59E0B"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Max Temp (${activeMachine.temperatureAlertThreshold}°C)`,
                        fill: '#FDE68A',
                        fontSize: 10,
                        position: 'insideBottomRight'
                      }}
                    />
                  )}

                  {/* Lines */}
                  {(activeMetricFilter === 'both' || activeMetricFilter === 'vibration') && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="vibration"
                      name="Vibration Velocity (mm/s)"
                      stroke="#0284C7"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: '#38BDF8', stroke: '#0284C7', strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  )}

                  {(activeMetricFilter === 'both' || activeMetricFilter === 'temperature') && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      name="Bearing Temp (°C)"
                      stroke="#EA580C"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: '#FB923C', stroke: '#EA580C', strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Threshold Legend & Health Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                  <span>Vibration (ISO 10816 Velocity)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                  <span>PT100 Bearing Temperature</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 border-t-2 border-dashed border-rose-500 inline-block" />
                  <span>Vibration Alert Level</span>
                </span>
              </div>

              <div className="text-[11px] text-slate-400">
                <span>Sampling: <strong>1,000 Hz Internal (Buffered to 0.5 Hz Stream)</strong></span>
              </div>
            </div>

          </div>

          {/* PREDICTIVE HEALTH DIAGNOSTICS & THRESHOLDS CONFIG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Predictive Diagnostics */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>MTM Edge Diagnostic Assessment</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  ISO 10816-3 Engine
                </span>
              </div>

              <div className={`p-3 rounded-xl border text-xs space-y-2 ${
                isWarning 
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' 
                  : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}>
                <div className="flex items-center justify-between">
                  <strong className="font-bold">
                    {isWarning ? '⚠️ Cautionary Threshold Anomaly' : '✓ Normal Industrial Operation'}
                  </strong>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900">
                    {isoClassification.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isWarning 
                    ? `Current RMS velocity (${latestPoint.vibration} mm/s) or temperature (${latestPoint.temperature}°C) exceeds safety baseline. Potential causes: rotor unbalance, drive belt slippage, or bearing lubricant dry-out. Immediate maintenance review recommended.`
                    : `Spectral harmonics indicate healthy bearing race contact and optimal shaft alignment. Harmonic vibration is well below ISO 10816 Class II threshold (${activeMachine.vibrationAlertThreshold} mm/s). Run hours remain within optimal preventive maintenance interval.`
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-bold">Estimated Bearing Health</span>
                  <span className={`text-base font-black ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isWarning ? '74% (Needs Grease)' : '98% (Optimal)'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-bold">Next Maintenance Window</span>
                  <span className="text-base font-black text-slate-200">
                    {isWarning ? 'Within 24 Hours' : '320 Operating Hours'}
                  </span>
                </div>
              </div>
            </div>

            {/* Threshold Configuration Sliders */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Real-Time Alert Threshold Settings</span>
                </h4>
                <span className="text-[10px] text-slate-400">Live Auto-Save</span>
              </div>

              {/* Slider 1: Vibration Threshold */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Vibration Alert Trigger (mm/s RMS)</span>
                  <span className="font-mono font-black text-sky-400">{activeMachine.vibrationAlertThreshold} mm/s</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.1"
                  value={activeMachine.vibrationAlertThreshold}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setMachines(prev => prev.map(m => m.id === activeMachine.id ? { ...m, vibrationAlertThreshold: val } : m));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2.0 mm/s (Tight)</span>
                  <span>4.5 mm/s (ISO Standard)</span>
                  <span>8.0 mm/s (Heavy Rig)</span>
                </div>
              </div>

              {/* Slider 2: Temp Threshold */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Max Temperature Warning (°C)</span>
                  <span className="font-mono font-black text-orange-400">{activeMachine.temperatureAlertThreshold}°C</span>
                </div>
                <input
                  type="range"
                  min="55"
                  max="95"
                  step="1"
                  value={activeMachine.temperatureAlertThreshold}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setMachines(prev => prev.map(m => m.id === activeMachine.id ? { ...m, temperatureAlertThreshold: val } : m));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>55°C (Cool Spindle)</span>
                  <span>75°C (Standard Limit)</span>
                  <span>95°C (Extreme)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Active Push Channels:</span>
                <span className="font-bold text-slate-200">In-App Notification • WhatsApp Escrow Bot • Webhook</span>
              </div>
            </div>

          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Industrial IoT Gateway: <strong>192.168.10.45:1883</strong> (Port TLS 8883 Verified)</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Telemetry Report</span>
            </button>
            <button
              onClick={() => setIsIoTSensorModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md shadow-blue-900/50 cursor-pointer"
            >
              Done / Close Monitor
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
