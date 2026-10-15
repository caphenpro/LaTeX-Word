import { useState, useMemo } from 'react';
import { DocSettings, ParsedBlock, ConversionStats } from './types';
import { TEMPLATES, TemplateItem } from './data/templates';
import { parseLatexDocument } from './utils/latexParser';
import { generateDocxBlob, generateWordHtml } from './utils/docxGenerator';
import { Navbar } from './components/Navbar';
import { LatexEditor } from './components/LatexEditor';
import { DocumentPreview } from './components/DocumentPreview';
import { SettingsModal } from './components/SettingsModal';
import { WordGuideModal } from './components/WordGuideModal';
import { FormulaHelperModal } from './components/FormulaHelperModal';
import { FileEdit, Eye, AlertCircle } from 'lucide-react';

const DEFAULT_SETTINGS: DocSettings = {
  docTitle: 'Tai_Lieu_Toan_Hoc',
  author: 'Ban Chuyên Môn',
  date: '2026',
  fontFamily: 'Times New Roman',
  fontSizePt: 12,
  paperSize: 'a4',
  margins: 'normal',
  lineSpacing: 1.15,
  equationNumbering: true,
  centerEquations: true,
  accentColor: '#1E3A8A',
};

export default function App() {
  const [latex, setLatex] = useState<string>(TEMPLATES[0].latex);
  const [settings, setSettings] = useState<DocSettings>(DEFAULT_SETTINGS);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(false);

  // Parse document in real time
  const { blocks, stats, docTitle, author, date } = useMemo<{
    blocks: ParsedBlock[];
    stats: ConversionStats;
    docTitle?: string;
    author?: string;
    date?: string;
  }>(() => {
    return parseLatexDocument(latex, settings);
  }, [latex, settings]);

  // Handle template selection
  const handleSelectTemplate = (tpl: TemplateItem) => {
    setLatex(tpl.latex);
    setSettings(prev => ({
      ...prev,
      docTitle: tpl.name.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF ]/g, '').trim(),
    }));
  };

  // Helper insertion into editor
  const handleInsertSnippet = (snippet: string) => {
    setLatex(prev => prev + '\n' + snippet);
  };

  // Sanitize filename
  const getCleanFilename = (ext: string) => {
    const title = docTitle || settings.docTitle || 'Tai_Lieu_Toan';
    const clean = title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    return `${clean || 'Tai_Lieu_Toan'}.${ext}`;
  };

  // Primary Action: Download Native Word .docx with OMML
  const handleDownloadDocx = async () => {
    try {
      setIsDownloading(true);
      const effectiveSettings: DocSettings = {
        ...settings,
        docTitle: docTitle || settings.docTitle,
        author: author || settings.author,
        date: date || settings.date,
      };

      const blob = await generateDocxBlob(blocks, effectiveSettings);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getCleanFilename('docx');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Lỗi khi tạo file docx', err);
      alert('Không thể tạo file docx: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsDownloading(false);
    }
  };

  // Secondary Action: Download Word HTML .doc
  const handleDownloadHtmlDoc = () => {
    try {
      const effectiveSettings: DocSettings = {
        ...settings,
        docTitle: docTitle || settings.docTitle,
        author: author || settings.author,
        date: date || settings.date,
      };
      const htmlContent = generateWordHtml(blocks, effectiveSettings);
      const blob = new Blob(['\ufeff' + htmlContent], {
        type: 'application/msword;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getCleanFilename('doc');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Lỗi khi tải file doc', err);
      alert('Không thể tạo file doc');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        onSelectTemplate={handleSelectTemplate}
        onDownloadDocx={handleDownloadDocx}
        onDownloadHtmlDoc={handleDownloadHtmlDoc}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        isDownloading={isDownloading}
        equationCount={stats.equationCount}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col p-3 sm:p-4 lg:p-5 max-w-[1720px] w-full mx-auto overflow-hidden">
        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden mb-3 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mobileTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" /> Soạn Thảo LaTeX
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mobileTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Xem Trang Word A4
            {stats.equationCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">
                {stats.equationCount}
              </span>
            )}
          </button>
        </div>

        {/* Errors / Warnings Bar if any */}
        {stats.errorCount > 0 && (
          <div className="mb-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Phát hiện <strong>{stats.errorCount}</strong> cảnh báo cú pháp công thức. Ứng dụng đã tự động sửa lỗi và bảo toàn định dạng khi xuất file Word.
              </span>
            </div>
          </div>
        )}

        {/* Split View Container */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 min-h-[600px] h-[calc(100vh-120px)]">
          {/* Left Pane: LaTeX Editor */}
          <div
            className={`h-full flex flex-col ${
              mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <LatexEditor
              value={latex}
              onChange={setLatex}
              stats={stats}
              onOpenHelper={() => setIsHelperOpen(true)}
              onResetSample={() => setLatex(TEMPLATES[0].latex)}
            />
          </div>

          {/* Right Pane: Live Document Preview */}
          <div
            className={`h-full flex flex-col ${
              mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <DocumentPreview
              blocks={blocks}
              settings={settings}
              stats={stats}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <WordGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <FormulaHelperModal
        isOpen={isHelperOpen}
        onClose={() => setIsHelperOpen(false)}
        onInsert={handleInsertSnippet}
      />
    </div>
  );
}
