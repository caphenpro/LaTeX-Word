import React from 'react';
import { DocSettings } from '../types';
import { X, Sliders, Type, FileText, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DocSettings;
  onUpdateSettings: (newSettings: DocSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Cài Đặt Xuất File Word (.docx)</h3>
              <p className="text-xs text-slate-400">Tùy chỉnh định dạng văn bản và công thức toán học</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Metadata Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Thông tin tài liệu
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tiêu đề tài liệu Word
                </label>
                <input
                  type="text"
                  value={settings.docTitle}
                  onChange={e => onUpdateSettings({ ...settings, docTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Ví dụ: Đề Thi Khảo Sát Môn Toán"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tác giả / Giáo viên
                  </label>
                  <input
                    type="text"
                    value={settings.author}
                    onChange={e => onUpdateSettings({ ...settings, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ngày tháng / Năm học
                  </label>
                  <input
                    type="text"
                    value={settings.date}
                    onChange={e => onUpdateSettings({ ...settings, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="2026 - 2027"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" /> Phông chữ & Kích thước
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phông chữ chính
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={e =>
                    onUpdateSettings({
                      ...settings,
                      fontFamily: e.target.value as DocSettings['fontFamily'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Times New Roman">Times New Roman (Chuẩn VN)</option>
                  <option value="Calibri">Calibri (Hiện đại)</option>
                  <option value="Arial">Arial (Không chân)</option>
                  <option value="Cambria">Cambria (Đồng bộ Math)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Công thức toán luôn dùng Cambria Math</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cỡ chữ nội dung
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {([11, 12, 13, 14] as const).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onUpdateSettings({ ...settings, fontSizePt: size })}
                      className={`py-2 text-center rounded-lg font-medium text-xs transition-colors border ${
                        settings.fontSizePt === size
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750'
                      }`}
                    >
                      {size}pt
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Page & Margins */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Khổ giấy & Căn lề
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kích thước trang
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, paperSize: 'a4' })}
                    className={`py-2 text-center rounded-lg text-xs font-medium border ${
                      settings.paperSize === 'a4'
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    A4 (210×297mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, paperSize: 'letter' })}
                    className={`py-2 text-center rounded-lg text-xs font-medium border ${
                      settings.paperSize === 'letter'
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Letter (US)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Độ rộng lề trang
                </label>
                <select
                  value={settings.margins}
                  onChange={e =>
                    onUpdateSettings({
                      ...settings,
                      margins: e.target.value as DocSettings['margins'],
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="normal">Chuẩn (2.54 cm / 1 inch)</option>
                  <option value="narrow">Hẹp (1.27 cm / 0.5 inch)</option>
                  <option value="wide">Rộng (3.81 cm / 1.5 inch)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Math Equations Settings */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Cấu hình công thức toán học
            </h4>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-750 hover:border-slate-700 cursor-pointer">
                <div>
                  <span className="font-medium text-white block">Tự động đánh số công thức độc lập</span>
                  <span className="text-xs text-slate-400">
                    Hiển thị (1), (2)... ở phía bên phải các công thức equation/align
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.equationNumbering}
                  onChange={e =>
                    onUpdateSettings({ ...settings, equationNumbering: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-750 hover:border-slate-700 cursor-pointer">
                <div>
                  <span className="font-medium text-white block">Căn giữa công thức khối (Display Math)</span>
                  <span className="text-xs text-slate-400">
                    Căn giữa các phương trình \[ ... \] thay vì căn lề trái
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.centerEquations}
                  onChange={e =>
                    onUpdateSettings({ ...settings, centerEquations: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-600"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-800/30 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Check className="w-4 h-4" /> Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
