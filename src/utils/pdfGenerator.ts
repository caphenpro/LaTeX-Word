import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports the target DOM element directly to a downloadable multi-page A4 PDF file
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename = 'Tai_Lieu_Toan_Hoc.pdf',
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    if (!element) throw new Error('Không tìm thấy vùng tài liệu để xuất PDF');

    onProgress?.('Đang kết xuất hình ảnh & công thức...');

    // Render HTML element to high-res canvas (scale 2 for crisp vector-like text & math)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: element.scrollWidth,
    });

    onProgress?.('Đang tạo các trang PDF A4...');

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const doc = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // First page
    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages if long document
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    onProgress?.('Đang lưu file PDF...');
    doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (err) {
    console.error('Lỗi khi xuất PDF:', err);
    throw err;
  }
}

/**
 * Triggers native browser print dialog for 100% lossless vector PDF output
 */
export function printVectorDocument(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
