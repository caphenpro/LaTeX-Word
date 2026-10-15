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
    // reset input
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
            Mã Nguồn LaTeX
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            {lineCount} dòng • {stats.wordCount} từ
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onOpenHelper}
            className="px-2.5 py-1 text-xs font-medium text-indigo-300 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg flex items-center gap-1 transition-colors"
            title="Mở bảng ký hiệu toán học"
          >
            <Sparkles className="w-3.5 h-3.5" /> Ký hiệu toán
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
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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

      {/* Quick Insert Snippet Toolbar */}
      <div className="flex items-center px-3 py-1.5 bg-slate-900/70 border-b border-slate-800/80 overflow-x-auto gap-1 text-xs shrink-0 scrollbar-none">
        <span className="text-[11px] text-slate-500 font-medium px-1 select-none shrink-0">Chèn nhanh:</span>
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
          onClick={() => insertSnippet('^{', '}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Số mũ lũy thừa"
        >
          x^n
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('_{', '}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Chỉ số dưới"
        >
          x_i
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\int_{0}^{1} ', ' dx')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Tích phân"
        >
          \int
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\sum_{i=1}^{n} ', '')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Tổng sigma"
        >
          \sum
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\begin{pmatrix}\n  a & b \\\\\n  c & d\n\\end{pmatrix}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Ma trận 2x2"
        >
          Ma trận
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\begin{cases}\n  x + y = 1 \\\\\n  x - y = 0\n\\end{cases}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Hệ phương trình cases"
        >
          Cases
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\textbf{Câu 1:} ')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Câu hỏi trắc nghiệm"
        >
          Câu 1:
        </button>
        <button
          type="button"
          onClick={() => insertSnippet('\\section{', '}')}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] shrink-0 transition-colors"
          title="Tiêu đề mục section"
        >
          \section
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative flex">
        {/* Line numbers display */}
        <div className="w-11 py-3 bg-slate-950/80 text-slate-600 font-mono text-xs select-none text-right pr-2 shrink-0 border-r border-slate-850 overflow-hidden leading-6">
          {Array.from({ length: Math.min(lineCount, 500) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Nhập hoặc dán mã LaTeX tại đây... (Ví dụ: Cho phương trình $ax^2 + bx + c = 0$ có nghiệm $x = \frac{-b \pm \sqrt{\Delta}}{2a}$)"
          className="flex-1 p-3 bg-transparent text-slate-200 font-mono text-xs leading-6 resize-none focus:outline-none placeholder-slate-600 overflow-y-auto selection:bg-indigo-500/30 selection:text-white"
          spellCheck={false}
        />

        {/* Drag and Drop Overlay */}
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
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            Hỗ trợ $...$, $$...$$, align, equation, cases, tabular, matrix...
          </span>
        </div>
        <div className="text-slate-500 font-mono hidden sm:block">
          Kéo thả file .tex trực tiếp vào bảng
        </div>
      </div>
    </div>
  );
};
