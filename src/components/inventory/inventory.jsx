"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { QrCode, Camera, Download, Check, AlertCircle, ShieldCheck, ChevronRight, Eye, Edit3 } from "lucide-react";
import api from "@/lib/api";
// import QRScanner from "../QRScanner/QRScanner";
import ItemDetailsModal from "../ItemDetailsModal/ItemDetailsModal";

// Import the new components (you'll need to create these files)
// import QRScanner from "./QRScanner";
// import ItemDetailsModal from "./ItemDetailsModal";

const statusColor = {
  "In Use": "bg-blue-50 text-blue-600 border-blue-100",
  Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
  "In maintenance": "bg-amber-50 text-amber-600 border-amber-100",
  Damaged: "bg-red-50 text-red-600 border-red-100",
};

const InventoryList = ({ onAddNewItem, inventory, setInventory }) => {
  const [editData, setEditData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [hiddenRows, setHiddenRows] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
const [bulkFile, setBulkFile] = useState(null);
const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
const [bulkUploadStatus, setBulkUploadStatus] = useState('');
const [selectedItemsForQR, setSelectedItemsForQR] = useState([]);
const [showBulkQRModal, setShowBulkQRModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedItem, setScannedItem] = useState(null);

  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [replacementItem, setReplacementItem] = useState(null);
  const [replacementReason, setReplacementReason] = useState("");

  const fileInputRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleVisibility = (barcode) => {
    setHiddenRows((prev) => ({
      ...prev,
      [barcode]: !prev[barcode],
    }));
  };

  const handleDeleteItem = async (barcodeId) => {
    try {
      await api.delete(`/api/adminauth/inventory/${barcodeId}`);
      setInventory((prev) =>
        prev.filter((item) => item.barcodeId !== barcodeId)
      );
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
    }
  };

  const handleUploadReceipt = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedItem) return;

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      const { data } = await api.put(
        `/api/adminauth/inventory/${selectedItem._id}/receipt`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setInventory((prev) =>
        prev.map((item) => (item._id === data.item._id ? data.item : item))
      );
      alert(`Receipt uploaded for ${data.item.itemName}`);
    } catch (error) {
      console.error("Failed to upload receipt:", error);
    }
  };

  // Add this function in InventoryList component
const handleBulkUpload = async () => {
  if (!bulkFile) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', bulkFile);

  try {
    setBulkUploadStatus('Uploading...');
    const { data } = await api.post(
      '/api/adminauth/inventory/bulk-upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setBulkUploadProgress(progress);
        },
      }
    );

    if (data.success) {
      setBulkUploadStatus(`Successfully added ${data.addedCount} items!`);
      setInventory((prev) => [...prev, ...data.items]);
      setTimeout(() => {
        setShowBulkUploadModal(false);
        setBulkFile(null);
        setBulkUploadProgress(0);
        setBulkUploadStatus('');
      }, 2000);
    }
  } catch (error) {
    console.error('Bulk upload failed:', error);
    setBulkUploadStatus(
      `Error: ${error.response?.data?.message || 'Upload failed'}`
    );
  }
};

// Add this function to download Excel template
const downloadBulkTemplate = () => {
  const template = [
    ['Item Name', 'Category', 'Location', 'Status', 'Room No', 'Floor', 'Description', 'Purchase Date', 'Purchase Cost'],
    ['Example Item 1', 'Electronics', 'Main Building', 'Available', '101', '1', 'Sample description', '10-11-2025', '5000'],
    ['Example Item 2', 'Furniture', 'Kitchen', 'In Use', '102', '1', 'Another description', '09-11-2025', '3000'],
  ];
  
  // Create CSV content
  const csvContent = template.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'inventory_bulk_upload_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

  const generateMonthlyStockReport = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/adminauth/inventory/stock-report", {
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        responseType: "blob", // This is important for file downloads with axios
      });

      // For axios, check response.status instead of response.ok
      if (response.status === 200) {
        const blob = response.data; // axios already gives you the blob in response.data
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Generate filename with current month and year
        const now = new Date();
        const monthYear = now.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        link.download = `Monthly_Stock_Report_${monthYear}.xlsx`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert("Stock report downloaded successfully!");
      } else {
        alert("Failed to generate stock report");
      }
    } catch (error) {
      console.error("Error generating stock report:", error);
      alert("Error generating stock report");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setEditData({ ...item });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    try {
      const { data } = await api.put(
        `/api/adminauth/inventory/${editData._id}`,
        editData
      );
      setInventory((prev) =>
        prev.map((item) => (item._id === data.item._id ? data.item : item))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleGenerateQR = async (item) => {
    try {
      const response = await api.post(
        `/api/adminauth/inventory/${item._id}/qr-code`
      );
      if (response.data.success) {
        alert("QR code generated successfully!");
        // Update the item in the inventory list
        setInventory((prev) =>
          prev.map((inv) =>
            inv._id === item._id
              ? { ...inv, qrCodeUrl: response.data.qrCodeUrl }
              : inv
          )
        );
      }
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      alert("Failed to generate QR code");
    }
  };

 const handleDownloadQR = async (item) => {
  try {
    const response = await api.get(
      `/api/adminauth/inventory/${item._id}/qr-code/download`,
      { 
        responseType: 'blob' // This is crucial for downloading files
      }
    );
    
    if (response.data) {
      const blob = new Blob([response.data], { type: 'image/png' }); // Explicitly create blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.itemName}-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      alert("Failed to download QR code");
    }
  } catch (error) {
    console.error("Error downloading QR code:", error);
    alert("Error downloading QR code");
  }
};

const handleBulkQRGeneration = async () => {
  try {
    setLoading(true);
    const { data } = await api.post('/api/adminauth/inventory/bulk-qr-generate', {
      itemIds: selectedItemsForQR
    });
    
    if (data.success) {
      setInventory(prev => 
        prev.map(item => {
          const updated = data.items.find(i => i._id === item._id);
          return updated || item;
        })
      );
      setSelectedItemsForQR([]);
      setShowBulkQRModal(false);
      alert(`Successfully generated ${data.count} QR codes!`);
    }
  } catch (error) {
    console.error('Bulk QR generation failed:', error);
    alert('Failed to generate QR codes');
  } finally {
    setLoading(false);
  }
};

  // const handleQRScanResult = (item) => {
  //   setScannedItem(item);
  //   setShowDetailModal(true);
  //   setSelectedItem(item);
  // };
const handleApplyReplacement = (item) => {
  setReplacementItem(item);
  setShowReplacementModal(true);
};

const submitReplacementRequest = async () => {

  if (!replacementReason.trim()) {
    alert("Please enter replacement reason");
    return;
  }

  try {

    const { data } = await api.post(
      `/api/adminauth/inventory/${replacementItem._id}/replacement-request`,
      {
        reason: replacementReason,
      }
    );

    if (data.success) {

      alert("Replacement request sent successfully");

      setInventory((prev) =>
        prev.map((item) =>
          item._id === replacementItem._id
            ? data.inventory
            : item
        )
      );

      setShowReplacementModal(false);

      setReplacementReason("");

      setReplacementItem(null);
    }

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to send replacement request"
    );
  }
};

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Logistics Terminal</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Management & Records Terminal</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {selectedItemsForQR.length > 0 && (
            <button
              onClick={() => setShowBulkQRModal(true)}
              className="flex items-center gap-2 bg-[#1A1F16] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all"
            >
              <QrCode size={14} /> Bulk QR ({selectedItemsForQR.length})
            </button>
          )}
          <button
            onClick={generateMonthlyStockReport}
            className="flex items-center gap-2 bg-white border border-[#7A8B5E]/10 text-[#1A1F16] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-[#F8FAF5] transition-all"
          >
            <Download size={14} /> Stock Report
          </button>
          <button
            onClick={onAddNewItem}
            className="flex items-center gap-2 bg-[#7A8B5E] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A8B5E]/20 hover:bg-[#8B9D6E] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M13 11V5h-2v6H5v2h6v6h2v-6h6v-2z" /></svg>
            Register Item
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 p-8 flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all"
            placeholder="Search Serial or Barcode..."
          />
        </div>
        <select
          className="bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1A1F16] outline-none appearance-none min-w-[200px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>In Use</option>
          <option>Available</option>
          <option>In maintenance</option>
          <option>Damaged</option>
        </select>
        <select
          className="bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#1A1F16] outline-none appearance-none min-w-[200px]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All Categories</option>
          <option>Furniture</option>
          <option>Electronics</option>
          <option>Applications</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">
                  <input
                    type="checkbox"
                    className="accent-[#7A8B5E]"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItemsForQR(inventory.filter(item => !item.qrCodeUrl).map(item => item._id));
                      } else {
                        setSelectedItemsForQR([]);
                      }
                    }}
                    checked={selectedItemsForQR.length > 0 && selectedItemsForQR.length === inventory.filter(item => !item.qrCodeUrl).length}
                  />
                </th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Serial No</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Asset Narrative</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Classification</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Location</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Compliance</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Directives</th>
              </tr>
            </thead>
            <tbody>
              {inventory
                .filter((item) =>
                  (statusFilter === "All Status" || item.status === statusFilter) &&
                  (categoryFilter === "All Categories" || item.category === categoryFilter) &&
                  (item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   item.barcodeId.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item, index) => (
                  <tr key={item.barcodeId} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                    <td className="px-10 py-8">
                      {!item.qrCodeUrl && (
                        <input
                          type="checkbox"
                          className="accent-[#7A8B5E]"
                          checked={selectedItemsForQR.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedItemsForQR(prev => [...prev, item._id]);
                            else setSelectedItemsForQR(prev => prev.filter(id => id !== item._id));
                          }}
                        />
                      )}
                    </td>
                    <td className="px-10 py-8 text-xs font-black text-[#1A1F16] tracking-widest">{item.barcodeId}</td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-[#1A1F16] tracking-tight">{item.itemName}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3 py-1 bg-[#F8FAF5] border border-[#7A8B5E]/10 text-[#7A8B5E] rounded-lg text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                    </td>
                    <td className="px-10 py-8 text-[10px] font-bold text-[#1A1F16]">{item.location}</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColor[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleViewDetails(item)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEditClick(item)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-[#1A1F16] hover:text-white transition-all shadow-sm">
                          <Edit3 size={18} />
                        </button>
                        {item.qrCodeUrl ? (
                          <button onClick={() => handleDownloadQR(item)} className="p-3 bg-[#1A1F16] text-white rounded-2xl hover:bg-black transition-all shadow-lg">
                            <Download size={18} />
                          </button>
                        ) : (
                          <button onClick={() => handleGenerateQR(item)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
                            <QrCode size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDeleteItem(item.barcodeId)} className="p-3 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {inventory.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/10">
                <AlertCircle size={40} />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Assets Logged</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {Math.ceil(inventory.length / itemsPerPage) > 1 && (
          <div className="p-10 border-t border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/30">
            <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, inventory.length)} of {inventory.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
              >
                <ChevronRight className="rotate-180" size={16} />
              </button>
              <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-widest px-4">{currentPage} / {Math.ceil(inventory.length / itemsPerPage)}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(inventory.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(inventory.length / itemsPerPage)}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>


      {/* QR Scanner Modal - Uncomment when you create the QRScanner component */}
      {/* <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanResult={handleQRScanResult}
      /> */}

      {/* Item Details Modal - Uncomment when you create the ItemDetailsModal component */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedItem(null);
          setScannedItem(null);
        }}
        onEdit={handleEditClick}
      />

        {/* ADD SNIPPET 5 HERE - Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4">Bulk Upload Items</h3>
            
            <div className="mb-4">
              <button
                onClick={downloadBulkTemplate}
                className="text-blue-600 hover:underline text-sm mb-2"
              >
                Download Template (CSV)
              </button>
              <p className="text-xs text-gray-600 mb-3">
                Upload a CSV file with columns: Item Name, Category, Location, Status, Room No, Floor, Description, Purchase Date, Purchase Cost
              </p>
              
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setBulkFile(e.target.files[0])}
                className="mb-4 w-full"
              />
              
              {bulkFile && (
                <p className="text-sm text-gray-700 mb-2">
                  Selected: <strong>{bulkFile.name}</strong>
                </p>
              )}
              
              {bulkUploadProgress > 0 && (
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${bulkUploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{bulkUploadProgress}%</p>
                </div>
              )}
              
              {bulkUploadStatus && (
                <p className={`text-sm mb-2 ${bulkUploadStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {bulkUploadStatus}
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setBulkFile(null);
                  setBulkUploadProgress(0);
                  setBulkUploadStatus('');
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!bulkFile}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4">Upload Receipt</h3>
            <input
              type="file"
               ref={fileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUploadReceipt}
              className="mb-4 w-full"
            />
            {receiptFile && (
              <p className="text-sm text-gray-700 mb-2">
                Selected: <strong>{receiptFile.name}</strong>
              </p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setReceiptFile(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (receiptFile) {
                    alert(`Uploaded: ${receiptFile.name}`);
                    setShowUploadModal(false);
                    setReceiptFile(null);
                  } else {
                    alert("Please select a file to upload.");
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {/* {showEditModal && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Item</h3>
            {["itemName", "barcodeId", "category", "location"].map((field) => (
              <input
                key={field}
                className="border px-3 py-2 w-full mb-3 rounded"
                value={editData[field]}
                onChange={(e) =>
                  setEditData({ ...editData, [field]: e.target.value })
                }
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            ))}
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="w-full border px-3 py-2 mb-4 rounded"
            >
              <option>Available</option>
              <option>In Use</option>
              <option>In maintenance</option>
              <option>Damaged</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
                onClick={handleEditSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )} */}


      {showEditModal && editData && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      <h3 className="text-xl font-bold mb-4">Edit Item</h3>

      {/* Item Name */}
      <input
        className="border px-3 py-2 w-full mb-3 rounded"
        value={editData.itemName}
        onChange={(e) =>
          setEditData({ ...editData, itemName: e.target.value })
        }
        placeholder="Item Name"
      />

      {/* Barcode ID */}
      <input
        className="border px-3 py-2 w-full mb-3 rounded"
        value={editData.barcodeId}
        onChange={(e) =>
          setEditData({ ...editData, barcodeId: e.target.value })
        }
        placeholder="Barcode ID"
      />

      {/* Category Dropdown */}
      <select
        value={editData.category}
        onChange={(e) =>
          setEditData({ ...editData, category: e.target.value })
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      >
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
        <option value="Furniture">Furniture</option>
        <option value="Bedding">Bedding</option>
        <option value="Applications">Applications</option>
      </select>

      {/* Location Dropdown */}
      <select
        value={editData.location}
        onChange={(e) =>
          setEditData({ ...editData, location: e.target.value })
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      >
        <option value="">Select Location</option>
        <option value="Main Building">Main Building</option>
        <option value="Kitchen">Kitchen</option>
        <option value="Mess Hall">Mess Hall</option>
        <option value="Recreation Room">Recreation Room</option>
        <option value="Study Hall">Study Hall</option>
      </select>

      {/* Status Dropdown */}
      <select
        value={editData.status}
        onChange={(e) =>
          setEditData({ ...editData, status: e.target.value })
        }
        className="w-full border px-3 py-2 mb-4 rounded"
      >
        <option value="">Select Status</option>
        <option value="Available">Available</option>
        <option value="In Use">In Use</option>
        <option value="In maintenance">In maintenance</option>
        <option value="Damaged">Damaged</option>
      </select>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded cursor-pointer"
          onClick={() => setShowEditModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer"
          onClick={handleEditSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

        {showBulkQRModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-bold mb-4">Generate QR Codes</h3>
            <p className="mb-4">
              Generate QR codes for {selectedItemsForQR.length} selected items?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowBulkQRModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkQRGeneration}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Detail Modal with QR Code Support */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl w-full h-[80%] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Item Details</h3>
              <button
                className="text-gray-600 cursor-pointer hover:text-red-600 text-xl"
                onClick={() => setShowDetailModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Basic Information</h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Item Name:</span>{" "}
                    {selectedItem.itemName}
                  </p>
                  <p>
                    <span className="font-semibold">Barcode ID:</span>{" "}
                    {selectedItem.barcodeId}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {selectedItem.category}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {selectedItem.location}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`inline-block ml-2 px-2 py-1 text-xs rounded ${
                        statusColor[selectedItem.status] || "bg-gray-200"
                      }`}
                    >
                      {selectedItem.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-2">
                  Additional Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {selectedItem.description || "No description available"}
                  </p>
                  <p>
                    <span className="font-semibold">Purchase Date:</span>{" "}
                    {/* {selectedItem.purchaseDate || "Not specified"} */}
                    {selectedItem.purchaseDate
  ? new Date(selectedItem.purchaseDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  : "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold">Purchase Cost:</span>{" "}
                    {selectedItem.purchaseCost
                      ? `₹${selectedItem.purchaseCost}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
           {/* QR Code Section - FIXED */}
<div className="mt-6">
  <h4 className="font-bold text-lg mb-2">QR Code</h4>
  <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
    {selectedItem.qrCodeUrl ? (
      <div className="flex flex-col items-center">
        <img
          src={(() => {
            // Construct the correct URL for QR code
            const baseUrl = process.env.NEXT_PUBLIC_PROD_API_URL || 'http://localhost:5224';
            let qrPath = selectedItem.qrCodeUrl;
            
            // If it's already a complete URL, use it
            if (qrPath.startsWith('http')) {
              return qrPath;
            }
            
            // Clean up the path and construct proper URL
            if (qrPath.startsWith('/')) qrPath = qrPath.substring(1);
            if (qrPath.startsWith('public/')) qrPath = qrPath.substring(7);
            if (!qrPath.startsWith('qrcodes/')) qrPath = `qrcodes/${qrPath}`;
            
            return `${baseUrl}/${qrPath}`;
          })()}
          alt="QR Code"
          className="w-32 h-32 border border-gray-300 rounded-lg mb-2"
          onError={(e) => {
            console.error('QR code failed to load. Trying alternative URLs...');
            const filename = selectedItem.qrCodeUrl.split('/').pop();
            const baseUrl = process.env.NEXT_PUBLIC_PROD_API_URL || 'http://localhost:5224';
            const alternatives = [
              `${baseUrl}/qrcodes/${filename}`,
              `${baseUrl}/public/qrcodes/${filename}`,
              `${baseUrl}${selectedItem.qrCodeUrl}`,
            ];
            
            // Try alternative URLs
            const currentSrc = e.target.src;
            const nextAlt = alternatives.find(alt => alt !== currentSrc);
            
            if (nextAlt) {
              console.log('Trying alternative URL:', nextAlt);
              e.target.src = nextAlt;
            } else {
              // All alternatives failed, show error
              console.error('All QR code URL attempts failed');
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }
          }}
          onLoad={() => {
            console.log('QR code loaded successfully');
          }}
        />
        <div style={{ display: 'none' }} className="w-32 h-32 border border-red-300 rounded-lg mb-2 flex items-center justify-center bg-red-50">
          <span className="text-red-500 text-xs text-center">QR Code<br/>Load Failed</span>
        </div>
        <p className="mb-2">QR Code generated</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={() => handleDownloadQR(selectedItem)}
        >
          <Download size={16} />
          Download QR Code
        </button>
      </div>
    ) : (
      <div className="flex flex-col items-center">
        <QrCode size={48} className="text-gray-400 mb-2" />
        <p className="mb-2">No QR code generated</p>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          onClick={() => handleGenerateQR(selectedItem)}
        >
          <QrCode size={16} />
          Generate QR Code
        </button>
      </div>
    )}
  </div>
</div>

            {/* Receipt Section */}
            <div className="mt-6">
              <h4 className="font-bold text-lg mb-2">Receipt</h4>
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                {selectedItem.receiptUrl ? (
                  <div className="flex flex-col items-center">
                    <p>Receipt uploaded</p>
                    {/* <button
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => {
                        window.open(selectedItem.receiptUrl, "_blank");
                      }}
                    >
                      View Receipt
                    </button> */}
                    <button
  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  onClick={() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_PROD_API_URL || "http://localhost:5224";

    window.open(`${baseUrl}${selectedItem.receiptUrl}`, "_blank");
  }}
>
  View Receipt
</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="mb-2">No receipt uploaded</p>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() => {
                        // setShowDetailModal(false);
                        // setSelectedItem(selectedItem);
                        // triggerFileInput();
                          setShowDetailModal(false);
  setShowUploadModal(true);
                      }}
                    >
                      Upload Receipt
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Replacement Modal */}
      {showReplacementModal && (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Apply Replacement
        </h2>

        <div className="mb-3">
          <p className="text-sm text-gray-500">
            Item Name
          </p>

          <p className="font-semibold text-lg">
            {replacementItem?.itemName}
          </p>
        </div>

        <textarea
          value={replacementReason}
          onChange={(e) =>
            setReplacementReason(e.target.value)
          }
          placeholder="Enter replacement reason..."
          rows={5}
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-orange-400 mb-4"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={() => {
              setShowReplacementModal(false);
              setReplacementReason("");
            }}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={submitReplacementRequest}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
    )}
  </div>
  );
}

// AddNewItem component integrated within the same file
function AddNewItem({ onBackToInventory, onItemAdded }) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    barcodeId: "",
    location: "",
    purchaseDate: "",
    purchaseCost: "",
    floor: "",
    roomNo: "",
    status: "Available",
    description: "",
    receipt: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedItem, setGeneratedItem] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.itemName || !formData.category) {
      alert("Please specify Item Name and Category.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'receipt' && formData[key]) {
          dataToSend.append('receipt', formData[key]);
        } else {
          dataToSend.append(key, formData[key]);
        }
      });

      const { data } = await api.post("/api/adminauth/inventory/add", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.success) {
        setGeneratedItem(data.item);
        setShowSuccessModal(true);
        if (onItemAdded) onItemAdded(data.item);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!generatedItem) return;
    try {
      const response = await api.get(`/api/adminauth/inventory/${generatedItem._id}/qr-code/download`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${generatedItem.itemName}-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("QR Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Asset Intake</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Official Resource Registration Portal</p>
          </div>
        </div>
        
        <button onClick={onBackToInventory} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7A8B5E] hover:text-[#1A1F16] transition-all group">
          <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Registry
        </button>
      </div>

      {/* Registration Form */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="p-10 border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/30 flex items-center gap-4">
          <ShieldCheck size={20} className="text-[#7A8B5E]" />
          <h2 className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.2em]">Item Specification Form</h2>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Primary Details */}
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Asset Denomination</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all"
                placeholder="e.g. Executive Desk"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Classification</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Applications">Applications</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Serial / ID</label>
                <input
                  type="text"
                  name="barcodeId"
                  value={formData.barcodeId}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all"
                  placeholder="ID-8829"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Intake Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Acquisition Cost</label>
                <input
                  type="number"
                  name="purchaseCost"
                  value={formData.purchaseCost}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Secondary Details */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Floor Level</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none"
                  placeholder="Floor"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Unit/Room</label>
                <input
                  type="text"
                  name="roomNo"
                  value={formData.roomNo}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none"
                  placeholder="Room"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Compliance Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none"
              >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="In maintenance">Maintenance</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Description Narrative</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[32px] p-6 text-sm font-bold text-[#1A1F16] outline-none resize-none"
                placeholder="Details of the asset..."
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-5 bg-[#1A1F16] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-black/20 hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Finalizing Registry..." : "Complete Registration"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && generatedItem && (
        <div className="fixed inset-0 bg-[#1A1F16]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-12 max-w-md w-full shadow-2xl text-center space-y-8">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
              <Check size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#1A1F16] uppercase italic tracking-tight">Success Verified</h3>
              <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em]">{generatedItem.itemName} Logged</p>
            </div>
            
            {generatedItem.qrCodeUrl && (
              <div className="bg-[#F8FAF5] p-6 rounded-[32px] border border-[#7A8B5E]/10">
                <img 
                  src={generatedItem.qrCodeUrl.startsWith('http') ? generatedItem.qrCodeUrl : `${window.location.protocol}//${window.location.host}${generatedItem.qrCodeUrl}`}
                  alt="QR Code"
                  className="w-32 h-32 mx-auto rounded-2xl shadow-lg border border-white"
                />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={handleDownloadQR} className="w-full py-4 bg-[#1A1F16] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all flex items-center justify-center gap-2">
                <Download size={14} /> Download QR Code
              </button>
              <button onClick={() => { setShowSuccessModal(false); onBackToInventory(); }} className="w-full py-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#7A8B5E] hover:bg-[#F8FAF5] transition-all">
                Dismiss to Registry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main component that manages the view state and central inventory data
export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [currentView, setCurrentView] = useState("inventory");

  const fetchInventory = async () => {
    try {
      const { data } = await api.get(`/api/adminauth/inventory`);
      setInventory(data.items);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddNewItem = () => setCurrentView("addItem");
  const handleBackToInventory = () => setCurrentView("inventory");
  const handleItemAdded = (newItem) =>
    setInventory((prev) => [...prev, newItem]);

  return currentView === "inventory" ? (
    <InventoryList
      onAddNewItem={handleAddNewItem}
      inventory={inventory}
      setInventory={setInventory}
      fetchInventory={fetchInventory}
    />
  ) : (
    <AddNewItem
      onBackToInventory={handleBackToInventory}
      onItemAdded={handleItemAdded}
    />
  );
}
