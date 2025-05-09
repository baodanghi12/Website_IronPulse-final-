import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExcelExporter = ({ reportData, bestCategories, bestProducts, flashSaleData = [] }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Revenue Overview');

    const formatVND = (value) =>
      typeof value === 'number' ? new Intl.NumberFormat('vi-VN').format(value) + ' ₫' : '';

    const evaluateTrend = (value) => {
      if (typeof value !== 'number') return '';
      if (value > 0) return '🟢 Tăng';
      if (value < 0) return '🔴 Giảm';
      return '⚪ Không đổi';
    };

    const profit = reportData.revenue - reportData.totalCost;

    // Helpers
    const addSectionTitle = (title) => {
      sheet.addRow([title]);
      sheet.lastRow.font = { bold: true };
    };

    const addHeaderRow = (headers) => {
      const row = sheet.addRow(headers);
      row.font = { bold: true };
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    };

    const addDataRowWithBorder = (values) => {
      const row = sheet.addRow(values);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    };

    // I. Tổng quan doanh thu
    addSectionTitle('I. Tổng quan doanh thu');
    addHeaderRow(['Chỉ tiêu', 'Giá trị', 'Ghi chú']);
    addDataRowWithBorder(['Tổng đơn hàng', reportData.orders]);
    addDataRowWithBorder(['Tổng hóa đơn', reportData.bills]);
    addDataRowWithBorder(['Tổng doanh thu', formatVND(reportData.revenue), evaluateTrend(reportData.revenue)]);
    addDataRowWithBorder(['Tổng chi phí', formatVND(reportData.totalCost), evaluateTrend(-reportData.totalCost)]);
    addDataRowWithBorder(['Lợi nhuận', formatVND(profit), evaluateTrend(profit)]);
    addDataRowWithBorder(['Profit MOM', (reportData.profitMOM || 0).toFixed(1) + '%', evaluateTrend(reportData.profitMOM)]);
    addDataRowWithBorder(['Profit YOY', (reportData.profitYOY || 0).toFixed(1) + '%', evaluateTrend(reportData.profitYOY)]);
    sheet.addRow([]);

    // II. Tỉ trọng doanh thu theo danh mục
    addSectionTitle('II. Tỉ trọng doanh thu theo danh mục');
    addHeaderRow(['STT', 'Danh mục', 'Doanh thu (VNĐ)', 'Tỉ trọng (%)']);
    bestCategories.forEach((cat, i) => {
      addDataRowWithBorder([
        i + 1,
        cat.category,
        formatVND(cat.turnOver),
        cat.percentage !== undefined ? cat.percentage + '%' : '',
      ]);
    });
    sheet.addRow([]);

    // III. Sản phẩm bán chạy
    addSectionTitle('III. Sản phẩm bán chạy');
    addHeaderRow(['STT', 'Tên sản phẩm', 'Danh mục', 'Số lượng bán', 'Doanh thu (VNĐ)', 'Giá bán', 'Tồn kho']);
    bestProducts.forEach((prod, i) => {
      addDataRowWithBorder([
        i + 1,
        prod.productName,
        prod.category,
        prod.count,
        formatVND(prod.turnOver),
        formatVND(prod.price || 0),
        prod.remainingQuantity,
      ]);
    });
    sheet.addRow([]);

    // IV. Flash Sale
    addSectionTitle('IV. Flash Sale');
    addHeaderRow([
      'STT',
      'Tên sản phẩm',
      'Giá gốc (VNĐ)',
      'Giá sale (VNĐ)',
      'Số lượng bán ra',
      'Doanh thu từ Flash Sale',
      'Thời gian Flash Sale',
    ]);
    flashSaleData.forEach((item, i) => {
      addDataRowWithBorder([
        i + 1,
        item.name,
        formatVND(item.originalPrice),
        formatVND(item.salePrice),
        item.quantitySold,
        formatVND(item.saleRevenue),
        item.timeRange,
      ]);
    });
    sheet.addRow([]);

    // V. Ghi chú / Công thức
    addSectionTitle('V. Ghi chú / Công thức');
    addHeaderRow(['Hạng mục', 'Công thức', 'Ghi chú']);
    addDataRowWithBorder(['Profit', '', 'Tổng lợi nhuận sau chi phí']);
    addDataRowWithBorder(['Profit MOM', '', 'Tăng trưởng lợi nhuận theo tháng (%)']);
    addDataRowWithBorder(['Profit YOY', 'Tương tự MOM', 'Tăng trưởng lợi nhuận theo năm (%)']);

    // Format column width
    sheet.columns.forEach((col) => {
      col.width = 25;
    });

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'IronPulse_Revenue_Report.xlsx');
  };

  return (
    <button
      onClick={exportToExcel}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      📥 Xuất Excel
    </button>
  );
};

export default ExcelExporter;
