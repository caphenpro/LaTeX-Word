export interface DocSettings {
  docTitle: string;
  author: string;
  date: string;
  fontFamily: 'Times New Roman' | 'Calibri' | 'Arial' | 'Cambria';
  fontSizePt: 11 | 12 | 13 | 14;
  paperSize: 'a4' | 'letter';
  margins: 'normal' | 'narrow' | 'wide';
  lineSpacing: 1.15 | 1.25 | 1.5;
  equationNumbering: boolean;
  centerEquations: boolean;
  accentColor: string;
}

export interface TextSegment {
  text: string;
  isMath?: boolean;
  isDisplay?: boolean;
  latex?: string;
  omml?: string;
  mathml?: string;
  error?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  code?: boolean;
}

export type BlockType =
  | 'title'
  | 'section'
  | 'subsection'
  | 'subsubsection'
  | 'paragraph'
  | 'equation'
  | 'list'
  | 'table'
  | 'callout'
  | 'divider';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TitleBlock extends BaseBlock {
  type: 'title';
  title: string;
  author?: string;
  date?: string;
}

export interface SectionBlock extends BaseBlock {
  type: 'section' | 'subsection' | 'subsubsection';
  text: string;
  number?: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  segments: TextSegment[];
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

export interface EquationBlock extends BaseBlock {
  type: 'equation';
  latex: string;
  omml: string;
  mathml: string;
  error?: string;
  equationNumber?: number;
  label?: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  ordered: boolean;
  items: Array<{ id: string; segments: TextSegment[] }>;
}

export interface TableCell {
  segments: TextSegment[];
  align?: 'left' | 'center' | 'right';
  isHeader?: boolean;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  headers?: TableCell[];
  rows: TableCell[][];
  caption?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  variant: 'theorem' | 'definition' | 'lemma' | 'example' | 'proof' | 'quote' | 'note';
  title?: string;
  segments: TextSegment[];
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export type ParsedBlock =
  | TitleBlock
  | SectionBlock
  | ParagraphBlock
  | EquationBlock
  | ListBlock
  | TableBlock
  | CalloutBlock
  | DividerBlock;

export interface ConversionStats {
  equationCount: number;
  inlineEquationCount: number;
  displayEquationCount: number;
  wordCount: number;
  charCount: number;
  blockCount: number;
  errorCount: number;
}
