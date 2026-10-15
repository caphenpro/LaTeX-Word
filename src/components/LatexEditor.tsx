import React, { useRef, useState } from 'react';
import {
  Code,
  Copy,
  Upload,
  Download,
  Trash2,
  Sparkles,
  FileCode,
  Check,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { ConversionStats } from '../types';

interface LatexEditorProps {
  value: string;
  onChange: (val: string) => void;
  stats: ConversionStats;
  onOpenHelper: () => void;
  onResetSample: () => void;
}

export const LatexEditor: React.FC<LatexEditorProps> = ({
  value,
  onChange,
  stats,
  onOpenHelper,
  onResetSample,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Helper to insert snippet at cursor
  const insertSnippet = (before: string, after: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = before + (selected || '') + after;

    const newVal = value.substring(0, start) + replacement + value.substring(end);
    onChange(newVal);

    setTimeout(() => {
      el.focus();
      const newCursorPos = start + before.length + (selected ? selected.length : 0);
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = evt => {
        const text = evt.target?.result as string;
        if (text) onChange(text);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = evt => {
        const text = evt.target?.result as string;
        if (text) onChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadTex = () => {
    const blob = new Blob([value], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tai_lieu_latex.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = value.split('\n').length;

  return (
    <div
      className={`flex flex-col h-full bg-slate-950/60 rounded-2xl border transition-colors overflow-hidden ${
        isDragging ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 gap-2 shrink-0">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-semibold text-white tracking-wide uppercase">
            Mã Nguồn LaTeX & Hình Học
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            {lineCount} dòng • {stats.wordCount} từ {stats.geometryCount > 0 && `• ${stats.geometryCount} hình TikZ`}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onOpenHelper}
            className="px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition-colors"
            title="Mở bảng ký hiệu toán & hình học"
          >
            <Compass className="w-3.5 h-3.5" /> Ký hiệu Hình học
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".tex,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Mở file .tex từ máy tính"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadTex}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Lưu mã LaTeX (.tex)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Sao chép toàn bộ mã"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={onResetSample}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Làm mới về mẫu ban đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onChange('')}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Xóa trắng khung soạn thảo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Insert Snippet Toolbar - Math & Geometry */}
      <div className="flex items-center px-3 py-1.5 bg-slate-900/70 border-b border-slate-800/80 overflow-x-auto gap-1 text-xs shrink-0 scrollbar-none">
        <span className="text-[11px] text-emerald-400 font-semibold px-1 select-none shrink-0 flex items-center gap-1">
          <Compass className="w-3 h-3" /> Hình học:
        </span>
        <button
          type="button"
          onClick={() => insertSnippet('\\vec{', '}')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] shrink-0 transition-colors"
          title="Vectơ AB"
        >
          \vec&#123;AB&#125;
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\widehat{', '}')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] shrink-0 transition-colors"
          title="Góc ABC (mũ)"
        >
          \widehat&#123;ABC&#125;
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\triangle ', '')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] shrink-0 transition-colors"
          title="Tam giác"
        >
          \triangle
        </button>
        <button
          type="button"
          onClick={() => insertSnippet(' \\perp ')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] shrink-0 transition-colors"
          title="Vuông góc"
        >
          \perp
        </button>
        <button
          type="button"
          onClick={() => insertSnippet(' \\parallel ')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] shrink-0 transition-colors"
          title="Song song"
        >
          \parallel
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('90^\\circ')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] shrink-0 transition-colors"
          title="Góc 90 độ"
        >
          90^\circ
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('d(M, (P)) = ')}
          className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px] shrink-0 transition-colors"
          title="Khoảng cách điểm tới mặt phẳng"
        >
          d(M, (P))
        </button>
        <button
          type="button"
          onClick={() =>
            insertSnippet(`\\begin{tikzpicture}
\\draw[thick] (0,0) coordinate (B) -- (4,0) coordinate (C) -- (1,3) coordinate (A) -- cycle;
\\draw[dashed] (1,3) -- (1,0) coordinate (H);
\\node[above] at (A) {$A$};
\\node[below left] at (B) {$B$};
\\node[below right] at (C) {$C$};
\\node[below] at (H) {$H$};
\\end{tikzpicture}\n`)
          }
          className="px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-white font-medium text-[11px] shrink-0 transition-colors shadow-xs"
          title="Chèn mã TikZ vẽ Tam giác có đường cao"
        >
          + TikZ Tam Giác
        </button>
        <button
          type="button"
          onClick={() =>
            insertSnippet(`\\begin{tikzpicture}
\\coordinate (A) at (0,0);
\\coordinate (B) at (1.5,-1.2);
\\coordinate (C) at (5,0);
\\coordinate (S) at (0,3.5);
\\draw[dashed, thick] (A) -- (C);
\\draw[thick] (S) -- (A) -- (B) -- (C) -- (S);
\\draw[thick] (S) -- (B);
\\node[left] at (A) {$A$};
\\node[below] at (B) {$B$};
\\node[right] at (C) {$C$};
\\node[above] at (S) {$S$};
\\end{tikzpicture}\n`)
          }
          className="px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-white font-medium text-[11px] shrink-0 transition-colors shadow-xs"
          title="Chèn mã TikZ vẽ Hình chóp S.ABC 3D"
        >
          + TikZ Chóp 3D
        </button>

        <span className="text-slate-600 px-1">|</span>
        <span className="text-[11px] text-slate-500 font-medium select-none shrink-0">Đại số:</span>
        <button
          type="button"
          onClick={() => insertSnippet('$', '$')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Công thức nội dòng $...$"
        >
          $x$
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\[\n', '\n\\]')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Công thức khối độc lập \[ ... \]"
        >
          \[ ... \]
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\frac{', '}{}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Phân số"
        >
          \frac&#123;a&#125;&#123;b&#125;
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\sqrt{', '}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Căn bậc hai"
        >
          \sqrt
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\begin{cases}\n  x + y = 1 \\\\\n  x - y = 0\n\\end{cases}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Hệ phương trình cases"
        >
          Cases
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative flex">
        <div className="w-11 py-3 bg-slate-950/80 text-slate-600 font-mono text-xs select-none text-right pr-2 shrink-0 border-r border-slate-850 overflow-hidden leading-6">
          {Array.from({ length: Math.min(lineCount, 500) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Nhập mã LaTeX và hình học... (Hỗ trợ \vec{AB}, \widehat{ABC}, \triangle, \perp, \parallel, tikzpicture, Oxyz...)"
          className="flex-1 p-3 bg-transparent text-slate-200 font-mono text-xs leading-6 resize-none focus:outline-none placeholder-slate-600 overflow-y-auto selection:bg-indigo-500/30 selection:text-white"
          spellCheck={false}
        />

        {isDragging && (
          <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none z-20 border-2 border-dashed border-indigo-400 m-2 rounded-xl">
            <Upload className="w-10 h-10 text-indigo-300 animate-bounce mb-2" />
            <p className="text-sm font-semibold text-white">Thả file .tex hoặc .txt vào đây</p>
            <p className="text-xs text-indigo-300">Nội dung sẽ được tải tự động vào trình soạn thảo</p>
          </div>
        )}
      </div>

      {/* Editor Footer */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Compass className="w-3.5 h-3.5" />
            Hỗ trợ hình học phẳng, không gian 3D, tọa độ Oxyz & hình vẽ TikZ
          </span>
        </div>
        <div className="text-slate-500 font-mono hidden sm:block">
          Mở file .tex hoặc kéo thả trực tiếp
        </div>
      </div>
    </div>
  );
};
