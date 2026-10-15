import React from 'react';
import { X, BookOpen, CheckCircle2, Zap, HelpCircle } from 'lucide-react';

interface WordGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordGuideModal: React.FC<WordGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Hướng Dẫn Công Thức Toán Trong Word</h3>
              <p className="text-xs text-slate-400">Cách hoạt động và mẹo sử dụng định dạng OMML chính xác</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Feature Highlight */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start space-x-3.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-indigo-200 mb-1">
                Công nghệ OMML (Office Open XML Math) nguyên bản
              </h4>
              <p className="text-xs text-indigo-300/80 leading-relaxed">
                Khác với các công cụ tạo ảnh công thức bị nhòe vỡ, ứng dụng này biên dịch trực tiếp mã LaTeX
                thành định dạng <strong>OMML chuẩn của Microsoft Word</strong>. Công thức hiển thị sắc nét ở mọi độ phân giải,
                tự động co giãn theo cỡ chữ và có thể <strong>chỉnh sửa trực tiếp</strong> bằng Equation Editor của Word.
              </p>
            </div>
          </div>

          {/* Quick Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Quy trình sử dụng
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  1
                </div>
                <h5 className="font-semibold text-white text-xs mb-1">Nhập mã LaTeX</h5>
                <p className="text-[11px] text-slate-400">
                  Dán đề thi, bài tập hoặc công thức dạng $...$, $$...$$, align, matrix...
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  2
                </div>
                <h5 className="font-semibold text-white text-xs mb-1">Xem trước trực quan</h5>
                <p className="text-[11px] text-slate-400">
                  Kiểm tra xem trước công thức trên trang A4 theo thời gian thực.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                  3
                </div>
                <h5 className="font-semibold text-white text-xs mb-1">Tải file .docx</h5>
                <p className="text-[11px] text-slate-400">
                  Mở trực tiếp bằng Word 2013-2024, Office 365, LibreOffice hoặc Google Docs.
                </p>
              </div>
            </div>
          </div>

          {/* Tips for Editing in Word */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mẹo chỉnh sửa công thức trong Microsoft Word
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Chỉnh sửa công thức:</strong> Nhấp đúp chuột trực tiếp vào bất kỳ công thức nào trong Word để con trỏ nhảy vào bên trong hộp Equation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Phím tắt chèn công thức mới:</strong> Nhấn tổ hợp phím <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-amber-300 font-mono">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-amber-300 font-mono">=</kbd> trong Word để tạo khung công thức toán.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Chuyển đổi kiểu hiển thị:</strong> Nhấp chuột phải vào công thức trong Word &rarr; chọn <em>Linear (Một hàng)</em> hoặc <em>Professional (Hai tầng)</em>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>
                  <strong>Dán nhanh vào văn bản Word hiện có:</strong> Bấm vào nút <em>&ldquo;Sao chép OMML&rdquo;</em> trên công thức bất kỳ rồi nhấn <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-amber-300 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-amber-300 font-mono">V</kbd> vào Word.
                </span>
              </li>
            </ul>
          </div>

          {/* Compatibility */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              Khả năng tương thích phần mềm
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Microsoft Word 2013, 2016, 2019, 2021, 2024</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Microsoft 365 (Word Windows, Mac, iPad)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>LibreOffice Writer / Apache OpenOffice</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>WPS Office & Google Docs (Import .docx)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-800/30 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
