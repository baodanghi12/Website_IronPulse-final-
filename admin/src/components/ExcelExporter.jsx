import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExcelExporter = ({ reportData, bestCategories, bestProducts, flashSaleData = [], filterMeta }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Revenue Overview');

    const formatVND = (value) =>
      typeof value === 'number' ? new Intl.NumberFormat('vi-VN').format(value) + ' ₫' : '';

    const formatDateVN = (dateStr) => {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    const evaluateTrend = (value) => {
      if (typeof value !== 'number') return '';
      if (value > 0) return '🟢 Tăng';
      if (value < 0) return '🔴 Giảm';
      return '⚪ Không đổi';
    };

    const profit = reportData.revenue - reportData.totalCost;

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

    // === Tiêu đề chính đầu trang ===
    let mainTitle = 'BÁO CÁO DOANH THU';
    if (filterMeta?.rangeType === 'day' && filterMeta.dateRange?.start) {
      mainTitle = `DOANH THU NGÀY ${formatDateVN(filterMeta.dateRange.start)}`;
    } else if (filterMeta?.rangeType === 'month' && filterMeta.dateRange?.start) {
      const [year, month] = filterMeta.dateRange.start.split('-');
      mainTitle = `DOANH THU THÁNG ${month}/${year}`;
    } else if (filterMeta?.rangeType === 'quarter' && filterMeta.dateRange?.start) {
      const date = new Date(filterMeta.dateRange.start);
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const year = date.getFullYear();
      mainTitle = `DOANH THU QUÝ ${quarter} NĂM ${year}`;
    } else if (filterMeta?.rangeType === 'year' && filterMeta.dateRange?.start) {
      const [year] = filterMeta.dateRange.start.split('-');
      mainTitle = `DOANH THU NĂM ${year}`;
    } else if (filterMeta?.rangeType && filterMeta.dateRange?.start && filterMeta.dateRange?.end) {
      mainTitle = `DOANH THU TỪ ${formatDateVN(filterMeta.dateRange.start)} ĐẾN ${formatDateVN(filterMeta.dateRange.end)}`;
    }
    const titleRow = sheet.addRow([mainTitle]);
titleRow.font = { size: 16, bold: true };
titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
sheet.mergeCells(`A${titleRow.number}:G${titleRow.number}`);
    sheet.addRow([]);

    // 0. Thông tin filter
    if (filterMeta) {
      addSectionTitle('0. Bộ lọc áp dụng');
      addHeaderRow(['Loại thống kê', 'Ngày bắt đầu', 'Ngày kết thúc']);
      addDataRowWithBorder([
        filterMeta.rangeType || '',
        formatDateVN(filterMeta.dateRange?.start) || '',
        formatDateVN(filterMeta.dateRange?.end) || ''
      ]);
      sheet.addRow([]);
    }

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

    sheet.columns.forEach((col) => {
      col.width = 25;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    let filename = 'IronPulse_Revenue_Report.xlsx';

if (filterMeta?.rangeType === 'day' && filterMeta.dateRange?.start) {
  const date = formatDateVN(filterMeta.dateRange.start).replace(/\//g, '-');
  filename = `DoanhThu_${date}.xlsx`;
} else if (filterMeta?.rangeType === 'month' && filterMeta.dateRange?.start) {
  const [year, month] = filterMeta.dateRange.start.split('-');
  filename = `DoanhThu_Thang-${month}-${year}.xlsx`;
} else if (filterMeta?.rangeType === 'quarter' && filterMeta.dateRange?.start) {
  const date = new Date(filterMeta.dateRange.start);
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  const year = date.getFullYear();
  filename = `DoanhThu_Quy-${quarter}-${year}.xlsx`;
} else if (filterMeta?.rangeType === 'year' && filterMeta.dateRange?.start) {
  const [year] = filterMeta.dateRange.start.split('-');
  filename = `DoanhThu_Nam-${year}.xlsx`;
} else if (filterMeta?.dateRange?.start && filterMeta?.dateRange?.end) {
  const start = formatDateVN(filterMeta.dateRange.start).replace(/\//g, '-');
  const end = formatDateVN(filterMeta.dateRange.end).replace(/\//g, '-');
  filename = `DoanhThu_${start}_ĐẾN_${end}.xlsx`;
}

saveAs(new Blob([buffer]), filename);
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
