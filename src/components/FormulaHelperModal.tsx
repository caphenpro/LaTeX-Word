import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';

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
      { symbol: '≪', latex: '\\ll', label: 'rất nhỏ' },
      { symbol: '≫', latex: '\\gg', label: 'rất lớn' },
      { symbol: '∞', latex: '\\infty', label: 'vô cùng' },
    ],
  },
  {
    title: 'Giải tích & Tích phân (Calculus)',
    items: [
      { symbol: '∫', latex: '\\int_{a}^{b} f(x) dx', label: 'tích phân xác định' },
      { symbol: '∬', latex: '\\iint_{D} f(x, y) dx dy', label: 'tích phân kép' },
      { symbol: '∮', latex: '\\oint_{C} \\mathbf{F} \\cdot d\\mathbf{r}', label: 'tích phân đường' },
      { symbol: '∑', latex: '\\sum_{k=1}^{n} k', label: 'tổng sigma' },
      { symbol: '∏', latex: '\\prod_{i=1}^{n} a_i', label: 'tích pi' },
      { symbol: 'lim', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x}', label: 'giới hạn limit' },
      { symbol: '∂', latex: '\\frac{\\partial f}{\\partial x}', label: 'đạo hàm riêng' },
      { symbol: '∇', latex: '\\nabla', label: 'nabla gradient' },
      { symbol: '√', latex: '\\sqrt{x}', label: 'căn bậc hai' },
      { symbol: 'ⁿ√', latex: '\\sqrt[n]{x}', label: 'căn bậc n' },
      { symbol: 'a/b', latex: '\\frac{a}{b}', label: 'phân số' },
    ],
  },
  {
    title: 'Tập hợp & Logic (Sets & Logic)',
    items: [
      { symbol: '∈', latex: '\\in', label: 'thuộc' },
      { symbol: '∉', latex: '\\notin', label: 'không thuộc' },
      { symbol: '⊂', latex: '\\subset', label: 'tập con' },
      { symbol: '⊆', latex: '\\subseteq', label: 'tập con bằng' },
      { symbol: '∪', latex: '\\cup', label: 'hợp' },
      { symbol: '∩', latex: '\\cap', label: 'giao' },
      { symbol: '∅', latex: '\\emptyset', label: 'tập rỗng' },
      { symbol: '∀', latex: '\\forall', label: 'với mọi' },
      { symbol: '∃', latex: '\\exists', label: 'tồn tại' },
      { symbol: '⇒', latex: '\\implies', label: 'suy ra' },
      { symbol: '⇔', latex: '\\iff', label: 'tương đương' },
      { symbol: 'ℝ', latex: '\\mathbb{R}', label: 'tập số thực' },
      { symbol: 'ℕ', latex: '\\mathbb{N}', label: 'tập số tự nhiên' },
      { symbol: 'ℤ', latex: '\\mathbb{Z}', label: 'tập số nguyên' },
      { symbol: 'ℚ', latex: '\\mathbb{Q}', label: 'tập số hữu tỉ' },
      { symbol: 'ℂ', latex: '\\mathbb{C}', label: 'tập số phức' },
    ],
  },
  {
    title: 'Cấu trúc & Ma trận (Structures)',
    items: [
      {
        symbol: '[ A ]',
        latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
        label: 'ma trận ngoặc tròn',
      },
      {
        symbol: '| det |',
        latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',
        label: 'định thức ma trận',
      },
      {
        symbol: '{ cases',
        latex: '\\begin{cases} x + y = 1 \\\\ 2x - y = 3 \\end{cases}',
        label: 'hệ phương trình / cases',
      },
      {
        symbol: 'C(n,k)',
        latex: '\\binom{n}{k}',
        label: 'tổ hợp nhị thức',
      },
      {
        symbol: 'xⁿ',
        latex: 'x^{2}',
        label: 'số mũ lũy thừa',
      },
      {
        symbol: 'xᵢ',
        latex: 'x_{i}',
        label: 'chỉ số dưới',
      },
      {
        symbol: 'x̄',
        latex: '\\bar{x}',
        label: 'gạch đầu'
      },
      {
        symbol: 'v⃗',
        latex: '\\vec{v}',
        label: 'vectơ'
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Bảng Ký Hiệu & Cấu Trúc Toán LaTeX</h3>
              <p className="text-xs text-slate-400">Nhấp vào bất kỳ ký hiệu nào để chèn vào vị trí con trỏ</p>
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
              placeholder="Tìm kiếm ký hiệu (vd: alpha, tích phân, căn, matrix, delta...)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Symbols Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          {filteredCategories.map(cat => (
            <div key={cat.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
                {cat.title}
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {cat.items.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onInsert(item.latex);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-2.5 bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/60 rounded-xl transition-all group cursor-pointer text-center"
                    title={`${item.label} (${item.latex})`}
                  >
                    <span className="text-lg font-serif text-white group-hover:scale-110 transition-transform mb-1">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-300 truncate max-w-full px-1">
                      {item.latex}
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
