import React, { useState } from 'react';
import {
  Download,
  Sliders,
  HelpCircle,
  FileDown,
  Layers,
  ChevronDown,
  Compass,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import { TEMPLATES, TemplateItem } from '../data/templates';

interface NavbarProps {
  onSelectTemplate: (tpl: TemplateItem) => void;
  onDownloadDocx: () => void;
  onDownloadHtmlDoc: () => void;
  onDownloadPdf: () => void;
  onPrintPdf: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  isDownloadingDocx: boolean;
  isExportingPdf: boolean;
  equationCount: number;
  geometryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectTemplate,
  onDownloadDocx,
  onDownloadHtmlDoc,
  onDownloadPdf,
  onPrintPdf,
  onOpenSettings,
  onOpenGuide,
  isDownloadingDocx,
  isExportingPdf,
  equationCount,
  geometryCount,
}) => {
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-6 py-2.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-rose-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-sm tracking-tight border border-indigo-400/30">
            <span className="font-serif italic text-base">TeX</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                LaTeX <span className="text-indigo-400 font-normal">sang</span> Word & PDF
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Compass className="w-3 h-3" /> OMML & TikZ
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Chuyển đổi công thức toán OMML, hình học TikZ sang Microsoft Word (.docx) & PDF chuẩn A4
            </p>
          </div>
        </div>

        {/* Center / Actions */}
        <div className="flex items-center space-x-2">
          {/* Template Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTemplateDropdownOpen(!templateDropdownOpen);
                setExportDropdownOpen(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Mẫu văn bản</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {templateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setTemplateDropdownOpen(false)}
                />
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 rounded-xl bg-slate-900 border border-slate-750 shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                    <span>Chọn mẫu văn bản</span>
                    <span className="text-emerald-400 text-[10px] font-normal">Có Hình vẽ TikZ</span>
                  </div>
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        onSelectTemplate(tpl);
                        setTemplateDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-indigo-600/20 flex flex-col transition-colors border-b border-slate-800/50 last:border-none"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{tpl.name}</span>
                        {tpl.category === 'geometry' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400">
                            Hình học
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {tpl.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Tùy chỉnh định dạng trang Word & PDF"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Cài đặt</span>
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            title="Hướng dẫn sử dụng công thức trong Word"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Mẹo Word</span>
          </button>

          {/* PDF Export Button (Direct Action) */}
          <button
            onClick={onDownloadPdf}
            disabled={isExportingPdf}
            className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 flex items-center gap-1.5 transition-all cursor-pointer border border-rose-500"
            title="Xuất file PDF (.pdf) chuẩn A4"
          >
            <FileText className="w-4 h-4" />
            <span>{isExportingPdf ? 'Đang tạo PDF...' : 'Xuất PDF'}</span>
          </button>

          {/* Primary Download Button: Word .docx with Dropdown */}
          <div className="relative flex items-center">
            <button
              onClick={onDownloadDocx}
              disabled={isDownloadingDocx}
              className="px-3.5 py-1.5 rounded-l-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer border border-blue-500"
              title="Tải văn bản Word .docx với công thức OMML & hình vẽ"
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloadingDocx ? 'Đang xuất Word...' : 'Tải Word (.docx)'}
              </span>
              {(equationCount > 0 || geometryCount > 0) && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-700 text-[10px] text-blue-100 font-mono">
                  {equationCount}
                </span>
              )}
            </button>

            {/* Split dropdown for more formats */}
            <button
              onClick={() => {
                setExportDropdownOpen(!exportDropdownOpen);
                setTemplateDropdownOpen(false);
              }}
              className="px-2 py-1.5 rounded-r-xl bg-blue-700 hover:bg-blue-600 text-white text-xs border-y border-r border-blue-500 transition-colors"
              title="Thêm định dạng xuất file"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {exportDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setExportDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-slate-900 border border-slate-750 shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      onDownloadDocx();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-blue-600/30 flex items-center gap-2.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">File Word Chuẩn (.docx)</div>
                      <div className="text-[10px] text-slate-400">Công thức OMML & hình vẽ TikZ nhúng an toàn</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onDownloadPdf();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-rose-600/30 flex items-center gap-2.5 transition-colors border-t border-slate-800"
                  >
                    <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Tải File PDF (.pdf)</div>
                      <div className="text-[10px] text-slate-400">Xuất file PDF nhiều trang chuẩn A4 trực tiếp</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onPrintPdf();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors border-t border-slate-800"
                  >
                    <Printer className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">In / Lưu PDF Vector (A4)</div>
                      <div className="text-[10px] text-slate-400">In trực tiếp sắc nét 100% bằng trình duyệt</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onDownloadHtmlDoc();
                      setExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:text-white hover:bg-slate-800 flex items-center gap-2.5 transition-colors border-t border-slate-800"
                  >
                    <FileDown className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">File Word HTML (.doc)</div>
                      <div className="text-[10px] text-slate-400">Dùng cho Word cũ hoặc sao chép nhanh</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
