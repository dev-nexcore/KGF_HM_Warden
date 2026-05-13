import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Package, 
  Info, 
  QrCode, 
  History,
  FileText,
  Edit3,
  Download,
  CreditCard,
  Building
} from 'lucide-react';

const ItemDetailsModal = ({ item, isOpen, onClose, onEdit }) => {
  if (!isOpen || !item) return null;

  const statusColor = {
    "In Use": "bg-blue-50 text-blue-600 border-blue-100",
    "Available": "bg-emerald-50 text-emerald-600 border-emerald-100", 
    "In maintenance": "bg-amber-50 text-amber-600 border-amber-100",
    "Damaged": "bg-red-50 text-red-600 border-red-100",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No data";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(`/api/adminauth/inventory/${item._id}/qr-code/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${item.itemName}-QR.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1A1F16]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-2xl shadow-[#1A1F16]/10 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#7A8B5E] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Asset Dossier</h2>
              <p className="text-[9px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Resource Specification & Logistics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Visuals & QR */}
            <div className="space-y-8">
              <div className="bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[32px] p-8 text-center space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest">Authentication Matrix</div>
                  {item.qrCodeUrl ? (
                    <div className="relative group">
                      <img 
                        src={item.qrCodeUrl.startsWith('http') ? item.qrCodeUrl : `${window.location.protocol}//${window.location.host}${item.qrCodeUrl}`}
                        alt="QR Code"
                        className="w-48 h-48 bg-white border border-[#7A8B5E]/10 rounded-[24px] p-4 shadow-xl"
                      />
                      <button onClick={handleDownloadQR} className="absolute inset-0 flex items-center justify-center bg-[#1A1F16]/80 text-white rounded-[24px] opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                        <Download size={24} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-white border border-[#7A8B5E]/10 rounded-[24px] flex items-center justify-center text-[#7A8B5E]/20">
                      <QrCode size={64} />
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-black text-[#1A1F16] bg-white border border-[#7A8B5E]/5 py-2 rounded-xl shadow-inner">
                  SN: {item.barcodeId}
                </div>
              </div>

              {item.receiptUrl && (
                <div className="bg-[#1A1F16] rounded-[32px] p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#7A8B5E] rounded-xl flex items-center justify-center text-white">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Acquisition Doc</span>
                  </div>
                  <button 
                    onClick={() => window.open(item.receiptUrl.startsWith('http') ? item.receiptUrl : `http://localhost:5224${item.receiptUrl}`, '_blank')}
                    className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-[#1A1F16] transition-all"
                  >
                    View Receipt
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Detailed Stats (Spans 2) */}
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-[#1A1F16] tracking-tight">{item.itemName}</h3>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <div className="h-px bg-[#7A8B5E]/10 w-full"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <DetailBadge icon={<Building />} label="Classification" value={item.category} />
                <DetailBadge icon={<MapPin />} label="Placement" value={item.location} />
                <DetailBadge icon={<Calendar />} label="Acquired On" value={formatDate(item.purchaseDate)} />
                <DetailBadge icon={<CreditCard />} label="Valuation" value={`₹${item.purchaseCost || "0"}`} />
                <DetailBadge icon={<History />} label="Last Sync" value={formatDate(item.updatedAt)} />
                <DetailBadge icon={<Info />} label="Inventory ID" value={item._id.slice(-6).toUpperCase()} />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">Technical Description</h4>
                <div className="bg-[#F8FAF5] rounded-[32px] p-8 border border-[#7A8B5E]/5">
                  <p className="text-sm font-bold text-[#1A1F16] leading-relaxed italic opacity-80">
                    {item.description || "No narrative specification provided for this asset."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-6 border-t border-[#7A8B5E]/5 bg-[#F8FAF5]/50 flex justify-end gap-4">
          <button onClick={onClose} className="px-8 py-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A1F16] hover:bg-[#F8FAF5] transition-all">
            Dismiss
          </button>
          {onEdit && (
            <button 
              onClick={() => { onEdit(item); onClose(); }} 
              className="px-10 py-4 bg-[#1A1F16] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:bg-black transition-all flex items-center gap-3"
            >
              <Edit3 size={16} /> Modify Asset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function DetailBadge({ icon, label, value }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[#7A8B5E]">
        {React.cloneElement(icon, { size: 14 })}
        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <div className="text-xs font-black text-[#1A1F16] uppercase">{value}</div>
    </div>
  );
}

export default ItemDetailsModal;