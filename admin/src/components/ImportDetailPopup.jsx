import React from 'react';
import dayjs from 'dayjs';
import { VND } from '../utils/handleCurrency';

const ImportDetailPopup = ({ importRecord, onClose }) => {
  if (!importRecord) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start p-6 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 mt-10 rounded-2xl shadow-2xl w-full max-w-4xl relative border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Import Receipt</h2>
          <p className="text-gray-500 text-sm">
            Import Date: {dayjs(importRecord.importDate).format('DD/MM/YYYY HH:mm')} | Receipt ID: #{importRecord._id?.slice(-6)}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div><strong>Total Cost:</strong> <span className="text-green-700 font-semibold">{VND.format(importRecord.totalCost)}</span></div>
          <div><strong>Note:</strong> {importRecord.note || '(none)'}</div>
        </div>

        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Product List</h3>

        {importRecord.productDetails?.map((prod, idx) => {
          const totalLineCost = prod.cost * prod.quantity;
          const imageUrl = Array.isArray(prod.image) && prod.image.length > 0 ? prod.image[0] : '/default.png';

          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-5 shadow-sm">
              <div className="flex items-start gap-5">
                <img
                  src={imageUrl}
                  alt={prod.name}
                  className="w-24 h-24 object-cover rounded-md border"
                />
                <div className="flex flex-col gap-1 text-sm">
                  <p><strong>{prod.name}</strong></p>
                  <p>Unit Price: {VND.format(prod.cost)}</p>
                  <p>Quantity: {prod.quantity} pcs</p>
                  <p>Total: <span className="text-green-700 font-semibold">{VND.format(totalLineCost)}</span></p>
                </div>
              </div>

              <div className="mt-3">
                <p className="font-medium text-sm mb-1">Size Details:</p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {prod.sizes.map((s, i) => (
                    <li key={i}>{s.size}: {s.quantity} pcs</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImportDetailPopup;
