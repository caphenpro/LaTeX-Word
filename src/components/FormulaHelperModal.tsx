import React, { useState } from 'react';
import { X, Search, Sparkles, Compass } from 'lucide-react';

interface FormulaHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (snippet: string) => void;
}

interface SymbolCategory {
  title: string;
  items: Array<{ symbol: string; latex: string; label: string }>;
}

const CATEGORIES: SymbolCategory[] = [
  {
    title: 'Hình Học & Không Gian (Geometry & Spatial)',
    items: [
      { symbol: 'AB⃗', latex: '\\vec{AB}', label: 'vectơ AB ngắn' },
      { symbol: '⟶AB', latex: '\\overrightarrow{AB}', label: 'vectơ AB mũi tên dài' },
      { symbol: 'u⃗', latex: '\\vec{u}', label: 'vectơ u' },
      { symbol: 'v⃗', latex: '\\vec{v}', label: 'vectơ v' },
      { symbol: '∠ABC', latex: '\\widehat{ABC}', label: 'góc ABC mũ' },
      { symbol: '∠', latex: '\\angle ABC', label: 'ký hiệu góc angle' },
      { symbol: '△', latex: '\\triangle ABC', label: 'tam giác triangle' },
      { symbol: '⊥', latex: '\\perp', label: 'vuông góc perpendicular' },
      { symbol: '∥', latex: '\\parallel', label: 'song song parallel' },
      { symbol: '∦', latex: '\\nparallel', label: 'không song song' },
      { symbol: '90°', latex: '90^\\circ', label: 'độ degree' },
      { symbol: '⌒AB', latex: '\\overset{\\frown}{AB}', label: 'cung tròn AB' },
      { symbol: '|u⃗|', latex: '|\\vec{u}|', label: 'độ dài vectơ' },
      { symbol: 'd(M, P)', latex: 'd(M, (P))', label: 'khoảng cách từ điểm tới mặt phẳng' },
      { symbol: '[u⃗, v⃗]', latex: '[\\vec{u}, \\vec{v}]', label: 'tích có hướng' },
      { symbol: 'u⃗·v⃗', latex: '\\vec{u} \\cdot \\vec{v}', label: 'tích vô hướng' },
      { symbol: 'V(chóp)', latex: 'V = \\frac{1}{3} S_{đáy} \\cdot h', label: 'thể tích hình chóp' },
      { symbol: 'V(lăng trụ)', latex: 'V = S_{đáy} \\cdot h', label: 'thể tích lăng trụ' },
      { symbol: '(S) cầu', latex: '(S): (x-a)^2 + (y-b)^2 + (z-c)^2 = R^2', label: 'phương trình mặt cầu' },
      { symbol: '(P) phẳng', latex: '(P): Ax + By + Cz + D = 0', label: 'phương trình mặt phẳng' },
      {
        symbol: 'TikZ Tam Giác',
        latex: `\\begin{tikzpicture}
\\draw[thick] (0,0) coordinate (B) -- (4,0) coordinate (C) -- (1,3) coordinate (A) -- cycle;
\\draw[dashed] (1,3) -- (1,0) coordinate (H);
\\node[above] at (A) {$A$};
\\node[below left] at (B) {$B$};
\\node[below right] at (C) {$C$};
\\node[below] at (H) {$H$};
\\end{tikzpicture}`,
        label: 'hình vẽ tam giác có đường cao',
      },
      {
        symbol: 'TikZ Chóp 3D',
        latex: `\\begin{tikzpicture}
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
\\end{tikzpicture}`,
        label: 'hình vẽ chóp S.ABC 3D',
      },
      {
        symbol: 'TikZ Hệ Trục Oxy',
        latex: `\\begin{tikzpicture}
\\draw[->, thick] (-2.5,0) -- (3.5,0) node[right] {$x$};
\\draw[->, thick] (0,-2.5) -- (0,3.5) node[above] {$y$};
\\node[below left] at (0,0) {$O$};
\\draw[blue, thick] (0,0) circle (2);
\\end{tikzpicture}`,
        label: 'hệ trục Oxy và đường tròn',
      },
    ],
  },
  {
    title: 'Ký tự Hy Lạp (Greek Letters)',
    items: [
      { symbol: 'α', latex: '\\alpha', label: 'alpha' },
      { symbol: 'β', latex: '\\beta', label: 'beta' },
      { symbol: 'γ', latex: '\\gamma', label: 'gamma' },
      { symbol: 'δ', latex: '\\delta', label: 'delta' },
      { symbol: 'ε', latex: '\\varepsilon', label: 'epsilon' },
      { symbol: 'θ', latex: '\\theta', label: 'theta' },
      { symbol: 'λ', latex: '\\lambda', label: 'lambda' },
      { symbol: 'μ', latex: '\\mu', label: 'mu' },
      { symbol: 'π', latex: '\\pi', label: 'pi' },
      { symbol: 'σ', latex: '\\sigma', label: 'sigma' },
      { symbol: 'τ', latex: '\\tau', label: 'tau' },
      { symbol: 'φ', latex: '\\phi', label: 'phi' },
      { symbol: 'ω', latex: '\\omega', label: 'omega' },
      { symbol: 'Δ', latex: '\\Delta', label: 'Delta' },
      { symbol: 'Γ', latex: '\\Gamma', label: 'Gamma' },
      { symbol: 'Λ', latex: '\\Lambda', label: 'Lambda' },
      { symbol: 'Σ', latex: '\\Sigma', label: 'Sigma' },
      { symbol: 'Ω', latex: '\\Omega', label: 'Omega' },
    ],
  },
  {
    title: 'Phép toán & So sánh (Operators)',
    items: [
      { symbol: '±', latex: '\\pm', label: 'cộng trừ' },
      { symbol: '×', latex: '\\times', label: 'nhân' },
      { symbol: '÷', latex: '\\div', label: 'chia' },
      { symbol: '·', latex: '\\cdot', label: 'chấm nhân' },
      { symbol: '≠', latex: '\\neq', label: 'khác' },
      { symbol: '≤', latex: '\\le', label: 'nhỏ hơn bằng' },
      { symbol: '≥', latex: '\\ge', label: 'lớn hơn bằng' },
      { symbol: '≈', latex: '\\approx', label: 'xấp xỉ' },
      { symbol: '≡', latex: '\\equiv', label: 'đồng nhất' },
      { symbol: '∝', latex: '\\propto', label: 'tỉ lệ' },
      { symbol: '∞', latex: '\\infty', label: 'vô cùng' },
    ],
  },
  {
    title: 'Giải tích & Tích phân (Calculus)',
    items: [
      { symbol: '∫', latex: '\\int_{a}^{b} f(x) dx', label: 'tích phân xác định' },
      { symbol: '∬', latex: '\\iint_{D} f(x, y) dx dy', label: 'tích phân kép' },
      { symbol: '∑', latex: '\\sum_{k=1}^{n} k', label: 'tổng sigma' },
      { symbol: '∏', latex: '\\prod_{i=1}^{n} a_i', label: 'tích pi' },
      { symbol: 'lim', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x}', label: 'giới hạn limit' },
      { symbol: '∂', latex: '\\frac{\\partial f}{\\partial x}', label: 'đạo hàm riêng' },
      { symbol: '∇', latex: '\\nabla', label: 'nabla gradient' },
      { symbol: '√', latex: '\\sqrt{x}', label: 'căn bậc hai' },
      { symbol: 'a/b', latex: '\\frac{a}{b}', label: 'phân số' },
    ],
  },
  {
    title: 'Tập hợp & Cấu trúc (Sets & Structures)',
    items: [
      { symbol: '∈', latex: '\\in', label: 'thuộc' },
      { symbol: '∉', latex: '\\notin', label: 'không thuộc' },
      { symbol: '⊂', latex: '\\subset', label: 'tập con' },
      { symbol: '∪', latex: '\\cup', label: 'hợp' },
      { symbol: '∩', latex: '\\cap', label: 'giao' },
      { symbol: '⇒', latex: '\\implies', label: 'suy ra' },
      { symbol: '⇔', latex: '\\iff', label: 'tương đương' },
      { symbol: 'ℝ', latex: '\\mathbb{R}', label: 'tập số thực' },
      { symbol: 'ℕ', latex: '\\mathbb{N}', label: 'tập số tự nhiên' },
      { symbol: 'ℤ', latex: '\\mathbb{Z}', label: 'tập số nguyên' },
      {
        symbol: '[ A ]',
        latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
        label: 'ma trận',
      },
      {
        symbol: '{ cases',
        latex: '\\begin{cases} x + y = 1 \\\\ 2x - y = 3 \\end{cases}',
        label: 'hệ phương trình',
      },
    ],
  },
];

export const FormulaHelperModal: React.FC<FormulaHelperModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredCategories = CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item =>
        item.symbol.toLowerCase().includes(search.toLowerCase()) ||
        item.latex.toLowerCase().includes(search.toLowerCase()) ||
        item.label.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Bảng Ký Hiệu Hình Học & Toán LaTeX</h3>
              <p className="text-xs text-slate-400">Vectơ, góc, tam giác, hình học không gian Oxyz và hình vẽ TikZ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-850">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm ký hiệu (vd: vector, góc, vuông góc, khoảng cách, tikz, chóp, mặt cầu...)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Symbols Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          {filteredCategories.map(cat => (
            <div key={cat.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {cat.title}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {cat.items.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onInsert(item.latex);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-2.5 bg-slate-800/80 hover:bg-emerald-600/20 border border-slate-700 hover:border-emerald-500/60 rounded-xl transition-all group cursor-pointer text-center"
                    title={`${item.label} (${item.latex})`}
                  >
                    <span className="text-base font-serif text-white group-hover:scale-110 transition-transform mb-1">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 truncate max-w-full px-1">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              Không tìm thấy ký hiệu phù hợp với từ khóa &ldquo;{search}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
