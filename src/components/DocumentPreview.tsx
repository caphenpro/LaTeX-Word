import React, { useState } from 'react';
import {
  ParsedBlock,
  DocSettings,
  ConversionStats,
  TextSegment,
  TableBlock,
  CalloutBlock,
  ListBlock,
  ParagraphBlock,
  EquationBlock,
  TitleBlock,
  SectionBlock,
} from '../types';
import katex from 'katex';
import {
  Copy,
  Check,
  Eye,
  ListTree,
  AlertTriangle,
  Code2,
  FileText,
  FileCheck2,
} from 'lucide-react';
import { copyToClipboard } from '../utils/mathUtils';

interface DocumentPreviewProps {
  blocks: ParsedBlock[];
  settings: DocSettings;
  stats: ConversionStats;
}

/**
 * Safe KaTeX Math component
 */
const MathView: React.FC<{
  latex: string;
  displayMode?: boolean;
  omml?: string;
  mathml?: string;
  onCopyNotice: (msg: string) => void;
}> = ({ latex, displayMode = false, omml, mathml, onCopyNotice }) => {
  const [copied, setCopied] = useState(false);

  let html = '';
  try {
    html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
    });
  } catch {
    html = `<span class="text-rose-500 font-mono text-xs">${latex}</span>`;
  }

  const handleCopy = async (e: React.MouseEvent, type: 'omml' | 'mathml' | 'latex') => {
    e.stopPropagation();
    let textToCopy = latex;
    if (type === 'omml' && omml) textToCopy = omml;
    else if (type === 'mathml' && mathml) textToCopy = mathml;

    const success = await copyToClipboard(textToCopy, type);
    if (success) {
      setCopied(true);
      onCopyNotice(
        type === 'omml'
          ? 'Đã sao chép mã Word OMML!'
          : type === 'mathml'
          ? 'Đã sao chép mã MathML!'
          : 'Đã sao chép mã LaTeX!'
      );
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <span
      className={`group relative inline-block rounded transition-colors ${
        displayMode
          ? 'my-3.5 block w-full text-center py-1 bg-slate-50/50 hover:bg-indigo-50/50 border border-transparent hover:border-indigo-200'
          : 'px-1 py-0.5 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer'
      }`}
    >
      <span dangerouslySetInnerHTML={{ __html: html }} />

      {/* Floating Action Popover on hover */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center gap-1 bg-slate-900 text-white text-[11px] px-2 py-1 rounded-lg shadow-xl z-30 whitespace-nowrap border border-slate-700">
        <button
          onClick={e => handleCopy(e, 'omml')}
          className="hover:text-amber-300 font-medium px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Sao chép mã Office Math để dán trực tiếp vào Word"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          OMML (Word)
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={e => handleCopy(e, 'mathml')}
          className="hover:text-indigo-300 font-medium px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
          title="Sao chép MathML chuẩn"
        >
          MathML
        </button>
        <span className="text-slate-600">|</span>
        <button
          onClick={e => handleCopy(e, 'latex')}
          className="hover:text-emerald-300 font-mono px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
          title="Sao chép mã TeX gốc"
        >
          TeX
        </button>
      </span>
    </span>
  );
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ blocks, settings, stats }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'inspector'>('preview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Extract all equations for inspector tab
  const allEquations: Array<{
    id: string;
    latex: string;
    display: boolean;
    omml: string;
    mathml: string;
    error?: string;
  }> = [];

  blocks.forEach(b => {
    if (b.type === 'equation') {
      const eq = b as EquationBlock;
      allEquations.push({
        id: eq.id,
        latex: eq.latex,
        display: true,
        omml: eq.omml,
        mathml: eq.mathml,
        error: eq.error,
      });
    } else if (b.type === 'paragraph') {
      (b as ParagraphBlock).segments.forEach((seg, idx) => {
        if (seg.isMath && seg.latex) {
          allEquations.push({
            id: `${b.id}-math-${idx}`,
            latex: seg.latex,
            display: false,
            omml: seg.omml || '',
            mathml: seg.mathml || '',
            error: seg.error,
          });
        }
      });
    } else if (b.type === 'list') {
      (b as ListBlock).items.forEach((item, itmIdx) => {
        item.segments.forEach((seg, idx) => {
          if (seg.isMath && seg.latex) {
            allEquations.push({
              id: `${b.id}-${itmIdx}-${idx}`,
              latex: seg.latex,
              display: false,
              omml: seg.omml || '',
              mathml: seg.mathml || '',
              error: seg.error,
            });
          }
        });
      });
    } else if (b.type === 'callout') {
      (b as CalloutBlock).segments.forEach((seg, idx) => {
        if (seg.isMath && seg.latex) {
          allEquations.push({
            id: `${b.id}-math-${idx}`,
            latex: seg.latex,
            display: false,
            omml: seg.omml || '',
            mathml: seg.mathml || '',
            error: seg.error,
          });
        }
      });
    }
  });

  const renderSegments = (segments: TextSegment[]) => {
    return segments.map((seg, idx) => {
      if (seg.isMath && seg.latex) {
        return (
          <MathView
            key={idx}
            latex={seg.latex}
            displayMode={seg.isDisplay}
            omml={seg.omml}
            mathml={seg.mathml}
            onCopyNotice={showToast}
          />
        );
      }

      let classes = '';
      if (seg.bold) classes += ' font-bold';
      if (seg.italic) classes += ' italic';
      if (seg.underline) classes += ' underline';
      if (seg.strike) classes += ' line-through';
      if (seg.code) classes += ' font-mono text-xs bg-slate-100 text-slate-800 px-1 py-0.5 rounded';

      return (
        <span
          key={idx}
          className={classes.trim() || undefined}
          style={seg.color ? { color: seg.color } : undefined}
        >
          {seg.text}
        </span>
      );
    });
  };

  // Font class for simulation
  const fontStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSizePt}pt`,
  };

  // Padding corresponding to margins
  const marginPadding =
    settings.margins === 'narrow' ? 'p-8 sm:p-10' : settings.margins === 'wide' ? 'p-12 sm:p-20' : 'p-10 sm:p-14';

  return (
    <div className="flex flex-col h-full bg-slate-950/60 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Xem Trang Word A4
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'inspector'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" /> Danh Sách Công Thức ({allEquations.length})
          </button>
        </div>

        {/* Live conversion indicator */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Chuẩn OMML
          </span>
          <span className="bg-slate-800 px-2.5 py-1 rounded-md text-[11px] font-mono text-indigo-300">
            {stats.equationCount} công thức
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40 relative flex justify-center">
        {activeTab === 'preview' ? (
          <div
            className={`w-full max-w-[820px] bg-white text-slate-900 rounded-lg doc-page-simulation min-h-[1050px] transition-all my-2 ${marginPadding}`}
            style={fontStyle}
          >
            {blocks.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400 text-center">
                <FileText className="w-12 h-12 stroke-[1.5] mb-3 text-slate-300" />
                <p className="text-base font-medium text-slate-600">Chưa có nội dung xem trước</p>
                <p className="text-xs text-slate-400 mt-1">
                  Nhập mã LaTeX ở khung bên trái hoặc chọn mẫu có sẵn để bắt đầu
                </p>
              </div>
            ) : (
              blocks.map((block, idx) => {
                switch (block.type) {
                  case 'title': {
                    const b = block as TitleBlock;
                    return (
                      <div key={b.id || idx} className="text-center mb-6 pt-2">
                        <h1
                          className="font-bold text-slate-900 tracking-tight"
                          style={{ fontSize: `${settings.fontSizePt * 1.5}pt` }}
                        >
                          {b.title}
                        </h1>
                        {(b.author || b.date) && (
                          <p className="text-slate-600 italic mt-1 text-sm">
                            {[b.author, b.date].filter(Boolean).join(' • ')}
                          </p>
                        )}
                      </div>
                    );
                  }

                  case 'section': {
                    const b = block as SectionBlock;
                    return (
                      <h2
                        key={b.id || idx}
                        className="font-bold text-blue-900 mt-6 mb-2 border-b border-slate-200 pb-1"
                        style={{ fontSize: `${settings.fontSizePt * 1.25}pt` }}
                      >
                        {b.text}
                      </h2>
                    );
                  }

                  case 'subsection': {
                    const b = block as SectionBlock;
                    return (
                      <h3
                        key={b.id || idx}
                        className="font-bold text-blue-800 mt-4 mb-2"
                        style={{ fontSize: `${settings.fontSizePt * 1.12}pt` }}
                      >
                        {b.text}
                      </h3>
                    );
                  }

                  case 'subsubsection': {
                    const b = block as SectionBlock;
                    return (
                      <h4
                        key={b.id || idx}
                        className="font-bold text-slate-800 mt-3 mb-1"
                        style={{ fontSize: `${settings.fontSizePt * 1.02}pt` }}
                      >
                        {b.text}
                      </h4>
                    );
                  }

                  case 'paragraph': {
                    const b = block as ParagraphBlock;
                    return (
                      <p
                        key={b.id || idx}
                        className="my-2.5 leading-relaxed text-slate-900"
                        style={{ textAlign: b.alignment || 'left' }}
                      >
                        {renderSegments(b.segments)}
                      </p>
                    );
                  }

                  case 'equation': {
                    const b = block as EquationBlock;
                    return (
                      <div
                        key={b.id || idx}
                        className={`my-4 flex items-center justify-between ${
                          settings.centerEquations ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <div className="flex-1 text-center">
                          <MathView
                            latex={b.latex}
                            displayMode={true}
                            omml={b.omml}
                            mathml={b.mathml}
                            onCopyNotice={showToast}
                          />
                        </div>
                        {b.equationNumber && (
                          <span className="text-slate-500 italic text-sm select-none pl-4">
                            ({b.equationNumber})
                          </span>
                        )}
                      </div>
                    );
                  }

                  case 'list': {
                    const b = block as ListBlock;
                    const Tag = b.ordered ? 'ol' : 'ul';
                    return (
                      <Tag
                        key={b.id || idx}
                        className={`my-3 pl-6 space-y-1.5 ${
                          b.ordered ? 'list-decimal' : 'list-disc'
                        }`}
                      >
                        {b.items.map((item, itmIdx) => (
                          <li key={item.id || itmIdx} className="leading-relaxed">
                            {renderSegments(item.segments)}
                          </li>
                        ))}
                      </Tag>
                    );
                  }

                  case 'table': {
                    const b = block as TableBlock;
                    return (
                      <div key={b.id || idx} className="my-5 overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-300 text-sm">
                          <tbody>
                            {b.rows.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => {
                                  const CellTag = cell.isHeader ? 'th' : 'td';
                                  return (
                                    <CellTag
                                      key={cIdx}
                                      className={`border border-slate-300 p-2.5 ${
                                        cell.isHeader
                                          ? 'bg-slate-100 font-semibold text-slate-800'
                                          : 'text-slate-800'
                                      }`}
                                      style={{ textAlign: cell.align || 'center' }}
                                    >
                                      {renderSegments(cell.segments)}
                                    </CellTag>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {b.caption && (
                          <p className="text-center italic text-xs text-slate-500 mt-1.5">
                            Bảng: {b.caption}
                          </p>
                        )}
                      </div>
                    );
                  }

                  case 'callout': {
                    const b = block as CalloutBlock;
                    return (
                      <div
                        key={b.id || idx}
                        className="my-4 border-l-4 border-indigo-600 bg-indigo-50/50 p-3.5 rounded-r-lg"
                      >
                        <span className="font-bold text-indigo-900 mr-2">
                          {b.title || 'Định lý'}:
                        </span>
                        <span className="text-slate-800 leading-relaxed">
                          {renderSegments(b.segments)}
                        </span>
                      </div>
                    );
                  }

                  case 'divider': {
                    return <hr key={idx} className="my-6 border-t border-slate-300" />;
                  }

                  default:
                    return null;
                }
              })
            )}
          </div>
        ) : (
          /* Formula Inspector Tab */
          <div className="w-full max-w-4xl space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-500 block">Tổng công thức:</span>
                  <span className="text-lg font-bold text-white">{allEquations.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Công thức khối (Display):</span>
                  <span className="text-lg font-bold text-indigo-400">{stats.displayEquationCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nội dòng (Inline):</span>
                  <span className="text-lg font-bold text-emerald-400">{stats.inlineEquationCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">100% Sẵn sàng xuất OMML</span>
              </div>
            </div>

            <div className="space-y-3">
              {allEquations.map((eq, i) => (
                <div
                  key={eq.id || i}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      #{i + 1} • {eq.display ? 'Display Math' : 'Inline Math'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          copyToClipboard(eq.omml, 'omml');
                          showToast('Đã chép OMML vào Clipboard!');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Chép OMML (Word)
                      </button>
                      <button
                        onClick={() => {
                          copyToClipboard(eq.mathml, 'mathml');
                          showToast('Đã chép MathML!');
                        }}
                        className="px-2 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
                      >
                        MathML
                      </button>
                      <button
                        onClick={() => {
                          copyToClipboard(eq.latex, 'latex');
                          showToast('Đã chép mã LaTeX!');
                        }}
                        className="px-2 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
                      >
                        LaTeX
                      </button>
                    </div>
                  </div>

                  {/* Rendered Preview */}
                  <div className="p-3 bg-white rounded-lg text-slate-900 overflow-x-auto text-center">
                    <MathView
                      latex={eq.latex}
                      displayMode={eq.display}
                      omml={eq.omml}
                      mathml={eq.mathml}
                      onCopyNotice={showToast}
                    />
                  </div>

                  {/* LaTeX Source Code */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-850 overflow-x-auto">
                    <Code2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-indigo-300">{eq.latex}</span>
                  </div>

                  {eq.error && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{eq.error}</span>
                    </div>
                  )}
                </div>
              ))}

              {allEquations.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Chưa phát hiện công thức nào trong văn bản LaTeX hiện tại.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-medium animate-in slide-in-from-bottom duration-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
