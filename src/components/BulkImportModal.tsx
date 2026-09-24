import React, { useState, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, FileSpreadsheet, Upload, Download, CheckCircle2, AlertTriangle, Play, RefreshCw, GripHorizontal } from 'lucide-react';
import { Product } from '../types';
import { useDraggableModal } from '../hooks/useDraggableModal';

interface ParsedRow {
  title: string;
  category: string;
  brand: string;
  model: string;
  priceNGN: number;
  condition: string;
  city: string;
  state: string;
  description: string;
  status: 'Valid' | 'Warning' | 'Error';
  message?: string;
}

const TEMPLATE_SAMPLE_ROWS: ParsedRow[] = [
  {
    title: 'Altendorf F45 Slide Table Saw',
    category: 'Woodworking',
    brand: 'Altendorf',
    model: 'F45 Elmo',
    priceNGN: 18500000,
    condition: 'Refurbished',
    city: 'Lagos',
    state: 'Lagos State',
    description: 'Precision panel sizing with electronic rip fence control.',
    status: 'Valid'
  },
  {
    title: 'SCM Olimpic K360 Edgebander',
    category: 'Woodworking',
    brand: 'SCM Group',
    model: 'K360',
    priceNGN: 24000000,
    condition: 'Excellent / Used',
    city: 'Benin City',
    state: 'Edo State',
    description: 'Automatic pre-milling and corner rounding unit.',
    status: 'Valid'
  },
  {
    title: 'Felder AD951 Cast Iron Planer Thickneser',
    category: 'Woodworking',
    brand: 'Felder',
    model: 'AD951',
    priceNGN: 12500000,
    condition: 'Brand New',
    city: 'Kano',
    state: 'Kano State',
    description: 'Heavy duty cast iron tables with spiral cutting block.',
    status: 'Warning',
    message: 'Missing power specifications, defaulting to 3-Phase 380V.'
  },
  {
    title: 'Generic Circular Saw Blade',
    category: 'Unknown',
    brand: 'Generic',
    model: 'BL-250',
    priceNGN: 45000,
    condition: 'Used',
    city: 'Ibadan',
    state: 'Oyo State',
    description: 'Circular saw blade for wood.',
    status: 'Error',
    message: 'Invalid Category. Must match MTM Standard Taxonomies.'
  }
];

export const BulkImportModal: React.FC = () => {
  const { isBulkImportOpen, setIsBulkImportOpen, addNewListing, showToast } = useMarketplace();
  const { modalStyle, dragHandleProps } = useDraggableModal();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBulkImportOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processSampleTemplate = () => {
    setFileSelected('mtm_machinery_import_template_v2.csv');
    setParsedRows(TEMPLATE_SAMPLE_ROWS);
    showToast('✓ Successfully parsed 4 inventory rows from CSV. Review validations below.');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileSelected(file.name);
      processSampleTemplate();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0].name);
      processSampleTemplate();
    }
  };

  const handleDownloadTemplate = () => {
    // Simulate template download
    showToast('⬇️ Downloading standard Excel inventory import template (MTM_Bulk_Import.xlsx)');
  };

  const handleCommitImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Import valid rows into product listings
      const validRows = parsedRows.filter(row => row.status === 'Valid' || row.status === 'Warning');
      
      validRows.forEach((row, index) => {
        const isBenin = row.city.toLowerCase().includes('benin');
        
        const newProduct: Product = {
          id: `bulk-${Date.now()}-${index}`,
          title: row.title,
          slug: `imported-machine-${Date.now()}-${index}`,
          category: row.category === 'Woodworking' ? 'Woodworking Machinery' : 'Workshop Tools',
          subcategory: row.category,
          brand: row.brand,
          model: row.model,
          priceNGN: row.priceNGN,
          priceUSD: Math.round(row.priceNGN / 1550),
          condition: row.condition as any,
          location: {
            city: row.city,
            state: row.state,
            industrialArea: isBenin ? 'Edo Production Centre' : 'Ikeja Industrial Estate'
          },
          seller: {
            id: 'usr-dealer-batch',
            name: 'Batch Importer Hub Ltd',
            businessType: 'Dealer / Importer',
            isVerified: true,
            rating: 4.8,
            reviewCount: 15,
            joinedYear: 2024,
            location: `${row.city}, Nigeria`,
            responseTime: '30 mins',
            verifiedBadges: ['Bulk Importer Certificate', 'Frictionless Seller']
          },
          images: [
            row.category === 'Woodworking'
              ? '/images/scm_panel_saw_1790179186875.jpg'
              : '/images/heavy_cnc_router_1790206292970.jpg'
          ],
          hasVideoTest: true,
          hasInspectionCertificate: true,
          powerSpecs: {
            voltage: '380V / 3-Phase',
            kwRating: 5.5
          },
          technicalSpecs: {
            'Year': '2019',
            'Status': 'Factory Serviced',
            'Batch ID': 'MTM-BULK-2026A'
          },
          description: row.description,
          tags: ['Bulk Imported', 'Verified Dealer Lot'],
          stockQuantity: 1,
          unit: 'Unit',
          deliveryOptions: {
            escrowProtected: true,
            inspectionBeforePayment: true,
            freightAssisted: true,
            estimatedDays: '3-5 Days',
            originHub: isBenin ? 'Benin City Hub' : 'Lagos Hub'
          }
        };

        addNewListing(newProduct);
      });

      setIsProcessing(false);
      setIsBulkImportOpen(false);
      showToast(`⚡ Successfully imported ${validRows.length} premium machinery listings into the Escrow Marketplace!`);
    }, 1500);
  };

  return (
    <div id="bulk-import-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-3 sm:p-6 pt-14 sm:pt-16 pb-8 overflow-y-auto animate-fadeIn">
      <div 
        id="bulk-import-container" 
        style={modalStyle}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100 my-auto animate-slideUp"
      >
        
        {/* Header */}
        <div 
          {...dragHandleProps}
          className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between select-none shrink-0"
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Bulk Inventory Spreadsheet Importer</h2>
              </div>
              <p className="text-xs text-slate-500">Upload CSV / Excel spreadsheets to list multiple workshop machines or tools simultaneously</p>
            </div>
          </div>
          <button
            onClick={() => setIsBulkImportOpen(false)}
            className="no-drag p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 border border-slate-200 hover:border-rose-600 transition-colors cursor-pointer shadow-xs"
            title="Close dialog"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        <div className="p-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition flex flex-col items-center justify-center cursor-pointer ${
              dragActive 
                ? 'border-blue-600 bg-blue-50/50' 
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-3">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            <p className="text-xs font-bold text-slate-800">Upload inventory CSV or XLSX spreadsheet</p>
            <p className="text-[10px] text-slate-500 mt-1">Supports files up to 10MB with MTM column definitions</p>
            <p className="text-xs font-semibold text-blue-600 mt-2 hover:underline">Click to browse files on your computer</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download Standard CSV Template</span>
            </button>
            <button
              onClick={processSampleTemplate}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200 cursor-pointer"
            >
              Demo: Parse 4 Sample Machinery Lots
            </button>
          </div>
        </div>

        {/* Validation Preview */}
        {parsedRows.length > 0 && (
          <div className="flex-1 overflow-hidden flex flex-col border-t border-slate-100">
            <div className="px-6 py-2 bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-100">
              <span>Parsed Preview & Taxonomy Alignment Validation</span>
              <span className="text-blue-700">{parsedRows.length} Rows Identified</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {parsedRows.map((row, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg border flex items-start justify-between text-xs transition ${
                    row.status === 'Valid'
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-900'
                      : row.status === 'Warning'
                        ? 'bg-amber-50/40 border-amber-100 text-amber-900'
                        : 'bg-red-50/40 border-red-100 text-red-900'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    {row.status === 'Valid' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                    {row.status === 'Warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                    {row.status === 'Error' && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                    
                    <div>
                      <div className="font-bold">{row.title}</div>
                      <div className="text-[10px] opacity-80 flex items-center gap-1.5 mt-0.5">
                        <span>Brand: {row.brand}</span>
                        <span>•</span>
                        <span>Model: {row.model}</span>
                        <span>•</span>
                        <span>Price: ₦{row.priceNGN.toLocaleString()}</span>
                        <span>•</span>
                        <span>Hub: {row.city}</span>
                      </div>
                      {row.message && (
                        <div className="text-[10px] font-bold mt-1 text-slate-600 flex items-center gap-1">
                          <span>ℹ️</span> <span>{row.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                    row.status === 'Valid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : row.status === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Commit bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                <span>Errors must be fixed before uploading. 3 of 4 rows can be imported now.</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setParsedRows([]);
                    setFileSelected(null);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Clear CSV
                </button>
                <button
                  onClick={handleCommitImport}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to Escrow...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Commit Bulk Import</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
