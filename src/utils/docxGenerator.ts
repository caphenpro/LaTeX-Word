import JSZip from 'jszip';
import {
  ParsedBlock,
  DocSettings,
  TextSegment,
  TableBlock,
  CalloutBlock,
  ListBlock,
  ParagraphBlock,
  EquationBlock,
  TitleBlock,
  SectionBlock,
  GeometryBlock,
} from '../types';
import { escapeXml } from './mathUtils';
import { svgToPngData } from './tikzUtils';

/**
 * Builds the complete [Content_Types].xml file
 */
function buildContentTypesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
</Types>`;
}

/**
 * Builds root _rels/.rels
 */
function buildRootRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
}

/**
 * Builds word/_rels/document.xml.rels with only valid existing image relationships
 */
function buildDocumentRelsXml(imageCount: number): string {
  let rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>`;

  for (let i = 1; i <= imageCount; i++) {
    rels += `\n  <Relationship Id="rIdImg${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${i}.png"/>`;
  }

  rels += '\n</Relationships>';
  return rels;
}

/**
 * Builds word/fontTable.xml with Cambria Math declared
 */
function buildFontTableXml(fontFamily: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:font w:name="${fontFamily}">
    <w:panose1 w:val="020F0502020204030204"/>
    <w:charset w:val="00"/>
    <w:family w:val="roman"/>
    <w:pitch w:val="variable"/>
  </w:font>
  <w:font w:name="Cambria Math">
    <w:panose1 w:val="02040503050406030204"/>
    <w:charset w:val="00"/>
    <w:family w:val="roman"/>
    <w:pitch w:val="variable"/>
  </w:font>
  <w:font w:name="Consolas">
    <w:panose1 w:val="020B0609020204030204"/>
    <w:charset w:val="00"/>
    <w:family w:val="modern"/>
    <w:pitch w:val="fixed"/>
  </w:font>
</w:fonts>`;
}

/**
 * Builds word/settings.xml with Office Math configuration
 */
function buildSettingsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" 
            xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
  <m:mathPr>
    <m:mathFont m:val="Cambria Math"/>
    <m:brkBin m:val="before"/>
    <m:brkBinSub m:val="--"/>
    <m:smallFrac m:val="0"/>
    <m:dispDef/>
    <m:lMargin m:val="0"/>
    <m:rMargin m:val="0"/>
    <m:defJc m:val="centerGroup"/>
    <m:wrapIndent m:val="1440"/>
    <m:intLim m:val="subSup"/>
    <m:naryLim m:val="undOvr"/>
  </m:mathPr>
</w:settings>`;
}

/**
 * Builds word/styles.xml matching document typography
 */
function buildStylesXml(fontFamily: string, fontSizePt: number): string {
  const halfPoints = fontSizePt * 2;
  const titleSize = Math.round(fontSizePt * 3.2);
  const h1Size = Math.round(fontSizePt * 2.5);
  const h2Size = Math.round(fontSizePt * 2.2);

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="${fontFamily}" w:hAnsi="${fontFamily}" w:cs="${fontFamily}"/>
        <w:sz w:val="${halfPoints}"/>
        <w:szCs w:val="${halfPoints}"/>
        <w:lang w:val="vi-VN"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="276" w:lineRule="auto" w:after="120"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>

  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="240" w:after="160"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="${titleSize}"/>
      <w:szCs w:val="${titleSize}"/>
      <w:color w:val="0F172A"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="280" w:after="100"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="${h1Size}"/>
      <w:szCs w:val="${h1Size}"/>
      <w:color w:val="1E3A8A"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="200" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="${h2Size}"/>
      <w:szCs w:val="${h2Size}"/>
      <w:color w:val="1D4ED8"/>
    </w:rPr>
  </w:style>

  <w:style w:type="paragraph" w:styleId="ListParagraph">
    <w:name w:val="List Paragraph"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:ind w:left="720"/>
      <w:spacing w:before="40" w:after="40"/>
    </w:pPr>
  </w:style>
</w:styles>`;
}

/**
 * Renders an inline text segment or inline OMML math
 */
function renderSegmentXml(seg: TextSegment): string {
  if (seg.isMath && seg.omml) {
    return seg.omml;
  }

  const rPrElements: string[] = [];
  if (seg.bold) rPrElements.push('<w:b/>');
  if (seg.italic) rPrElements.push('<w:i/>');
  if (seg.underline) rPrElements.push('<w:u w:val="single"/>');
  if (seg.strike) rPrElements.push('<w:strike/>');
  if (seg.code) {
    rPrElements.push('<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>');
    rPrElements.push('<w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>');
  }
  if (seg.color && seg.color.startsWith('#')) {
    rPrElements.push(`<w:color w:val="${seg.color.replace('#', '')}"/>`);
  }

  const rPr = rPrElements.length > 0 ? `<w:rPr>${rPrElements.join('')}</w:rPr>` : '';
  return `<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(seg.text)}</w:t></w:r>`;
}

/**
 * Renders an embedded geometry drawing (PNG image) in Word OpenXML
 */
function renderGeometryDrawingXml(imageIdx: number, widthPx: number, heightPx: number, caption?: string): string {
  const maxCx = 4500000; // ~12cm
  let cx = Math.round(widthPx * 9525);
  let cy = Math.round(heightPx * 9525);

  if (cx > maxCx) {
    const ratio = maxCx / cx;
    cx = maxCx;
    cy = Math.round(cy * ratio);
  }

  let xml = `<w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="180" w:after="120"/>
    </w:pPr>
    <w:r>
      <w:drawing>
        <wp:inline distT="0" distB="0" distL="0" distR="0">
          <wp:extent cx="${cx}" cy="${cy}"/>
          <wp:effectExtent l="0" t="0" r="0" b="0"/>
          <wp:docPr id="${imageIdx}" name="Picture ${imageIdx}"/>
          <wp:cNvGraphicFramePr>
            <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
          </wp:cNvGraphicFramePr>
          <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:nvPicPr>
                  <pic:cNvPr id="${imageIdx}" name="Picture ${imageIdx}"/>
                  <pic:cNvPicPr/>
                </pic:nvPicPr>
                <pic:blipFill>
                  <a:blip r:embed="rIdImg${imageIdx}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
                  <a:stretch>
                    <a:fillRect/>
                  </a:stretch>
                </pic:blipFill>
                <pic:spPr>
                  <a:xfrm>
                    <a:off x="0" y="0"/>
                    <a:ext cx="${cx}" cy="${cy}"/>
                  </a:xfrm>
                  <a:prstGeom prst="rect">
                    <a:avLst/>
                  </a:prstGeom>
                </pic:spPr>
              </pic:pic>
            </a:graphicData>
          </a:graphic>
        </wp:inline>
      </w:drawing>
    </w:r>
  </w:p>`;

  if (caption) {
    xml += `<w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:before="60" w:after="160"/>
      </w:pPr>
      <w:r>
        <w:rPr><w:i/><w:sz w:val="20"/><w:color w:val="475569"/></w:rPr>
        <w:t xml:space="preserve">Hình: ${escapeXml(caption)}</w:t>
      </w:r>
    </w:p>`;
  }

  return xml;
}

/**
 * Renders a table block to <w:tbl>
 */
function renderTableXml(block: TableBlock): string {
  let xml = `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="0" w:type="auto"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="120" w:type="dxa"/>
        <w:left w:w="160" w:type="dxa"/>
        <w:bottom w:w="120" w:type="dxa"/>
        <w:right w:w="160" w:type="dxa"/>
      </w:tblCellMar>
      <w:jc w:val="center"/>
    </w:tblPr>`;

  for (const row of block.rows) {
    xml += '<w:tr>';
    for (const cell of row) {
      xml += '<w:tc>';
      xml += '<w:tcPr>';
      if (cell.isHeader) {
        xml += '<w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>';
      }
      xml += '</w:tcPr>';

      xml += '<w:p>';
      xml += '<w:pPr>';
      xml += `<w:jc w:val="${cell.align || 'center'}"/>`;
      xml += '<w:spacing w:before="40" w:after="40"/>';
      xml += '</w:pPr>';

      if (cell.segments && cell.segments.length > 0) {
        for (const seg of cell.segments) {
          if (cell.isHeader) {
            seg.bold = true;
          }
          xml += renderSegmentXml(seg);
        }
      } else {
        xml += '<w:r><w:t></w:t></w:r>';
      }

      xml += '</w:p>';
      xml += '</w:tc>';
    }
    xml += '</w:tr>';
  }

  xml += '</w:tbl>';
  return xml;
}

/**
 * Generates the full word/document.xml string with pure OMML and valid relationships
 */
function buildDocumentXml(
  blocks: ParsedBlock[],
  settings: DocSettings,
  geometryMap: Map<string, { imageIdx: number; width: number; height: number }>
): string {
  let width = 11906;
  let height = 16838;
  if (settings.paperSize === 'letter') {
    width = 12240;
    height = 15840;
  }

  let top = 1440;
  let bottom = 1440;
  let left = 1440;
  let right = 1440;

  if (settings.margins === 'narrow') {
    top = 720;
    bottom = 720;
    left = 720;
    right = 720;
  } else if (settings.margins === 'wide') {
    left = 2160;
    right = 2160;
  }

  let bodyXml = '';

  for (const block of blocks) {
    switch (block.type) {
      case 'title': {
        const titleBlk = block as TitleBlock;
        bodyXml += `<w:p>
          <w:pPr>
            <w:pStyle w:val="Title"/>
            <w:jc w:val="center"/>
            <w:spacing w:before="240" w:after="120"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:b/>
              <w:sz w:val="${settings.fontSizePt * 3}"/>
              <w:szCs w:val="${settings.fontSizePt * 3}"/>
              <w:color w:val="0F172A"/>
            </w:rPr>
            <w:t xml:space="preserve">${escapeXml(titleBlk.title)}</w:t>
          </w:r>
        </w:p>`;

        if (titleBlk.author || titleBlk.date) {
          const subText = [titleBlk.author, titleBlk.date].filter(Boolean).join(' • ');
          bodyXml += `<w:p>
            <w:pPr>
              <w:jc w:val="center"/>
              <w:spacing w:before="60" w:after="160"/>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:i/>
                <w:color w:val="475569"/>
              </w:rPr>
              <w:t xml:space="preserve">${escapeXml(subText)}</w:t>
            </w:r>
          </w:p>`;
        }
        break;
      }

      case 'section': {
        const secBlk = block as SectionBlock;
        bodyXml += `<w:p>
          <w:pPr>
            <w:pStyle w:val="Heading1"/>
            <w:spacing w:before="280" w:after="100"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:b/>
              <w:sz w:val="${Math.round(settings.fontSizePt * 2.5)}"/>
              <w:color w:val="1E3A8A"/>
            </w:rPr>
            <w:t xml:space="preserve">${escapeXml(secBlk.text)}</w:t>
          </w:r>
        </w:p>`;
        break;
      }

      case 'subsection': {
        const secBlk = block as SectionBlock;
        bodyXml += `<w:p>
          <w:pPr>
            <w:pStyle w:val="Heading2"/>
            <w:spacing w:before="200" w:after="80"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:b/>
              <w:sz w:val="${Math.round(settings.fontSizePt * 2.2)}"/>
              <w:color w:val="1D4ED8"/>
            </w:rPr>
            <w:t xml:space="preserve">${escapeXml(secBlk.text)}</w:t>
          </w:r>
        </w:p>`;
        break;
      }

      case 'subsubsection': {
        const secBlk = block as SectionBlock;
        bodyXml += `<w:p>
          <w:pPr>
            <w:spacing w:before="140" w:after="60"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:b/>
              <w:sz w:val="${settings.fontSizePt * 2}"/>
              <w:color w:val="334155"/>
            </w:rPr>
            <w:t xml:space="preserve">${escapeXml(secBlk.text)}</w:t>
          </w:r>
        </w:p>`;
        break;
      }

      case 'paragraph': {
        const pBlk = block as ParagraphBlock;
        bodyXml += `<w:p>
          <w:pPr>
            <w:spacing w:before="60" w:after="100"/>
          </w:pPr>
          ${pBlk.segments.map(renderSegmentXml).join('')}
        </w:p>`;
        break;
      }

      case 'equation': {
        const eqBlk = block as EquationBlock;
        const alignJc = settings.centerEquations ? 'center' : 'left';

        // Direct OMML in paragraph guarantees 100% validity across all Word versions
        bodyXml += `<w:p>
          <w:pPr>
            <w:jc w:val="${alignJc}"/>
            <w:spacing w:before="160" w:after="160"/>
          </w:pPr>
          ${eqBlk.omml}`;

        if (eqBlk.equationNumber) {
          bodyXml += `<w:r>
            <w:rPr>
              <w:i/>
              <w:color w:val="64748B"/>
            </w:rPr>
            <w:t xml:space="preserve">    (${eqBlk.equationNumber})</w:t>
          </w:r>`;
        }

        bodyXml += `</w:p>`;
        break;
      }

      case 'geometry': {
        const gBlk = block as GeometryBlock;
        const info = geometryMap.get(gBlk.id);
        if (info) {
          bodyXml += renderGeometryDrawingXml(info.imageIdx, info.width, info.height, gBlk.caption);
        } else if (gBlk.caption) {
          bodyXml += `<w:p>
            <w:pPr>
              <w:jc w:val="center"/>
              <w:spacing w:before="100" w:after="100"/>
            </w:pPr>
            <w:r>
              <w:rPr><w:i/><w:color w:val="475569"/></w:rPr>
              <w:t xml:space="preserve">[Hình học: ${escapeXml(gBlk.caption)}]</w:t>
            </w:r>
          </w:p>`;
        }
        break;
      }

      case 'list': {
        const listBlk = block as ListBlock;
        listBlk.items.forEach((item, idx) => {
          bodyXml += `<w:p>
            <w:pPr>
              <w:pStyle w:val="ListParagraph"/>
              <w:ind w:left="720" w:hanging="360"/>
              <w:spacing w:before="40" w:after="40"/>
            </w:pPr>
            <w:r>
              <w:rPr><w:b/></w:rPr>
              <w:t xml:space="preserve">${listBlk.ordered ? `${idx + 1}. ` : '•   '}</w:t>
            </w:r>
            ${item.segments.map(renderSegmentXml).join('')}
          </w:p>`;
        });
        break;
      }

      case 'table': {
        const tblBlk = block as TableBlock;
        bodyXml += renderTableXml(tblBlk);
        if (tblBlk.caption) {
          bodyXml += `<w:p>
            <w:pPr>
              <w:jc w:val="center"/>
              <w:spacing w:before="60" w:after="120"/>
            </w:pPr>
            <w:r>
              <w:rPr><w:i/><w:sz w:val="${Math.round(settings.fontSizePt * 1.8)}"/></w:rPr>
              <w:t xml:space="preserve">Bảng: ${escapeXml(tblBlk.caption)}</w:t>
            </w:r>
          </w:p>`;
        }
        break;
      }

      case 'callout': {
        const calloutBlk = block as CalloutBlock;
        bodyXml += `<w:p>
          <w:pPr>
            <w:pBdr>
              <w:left w:val="single" w:sz="24" w:space="15" w:color="2563EB"/>
            </w:pBdr>
            <w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/>
            <w:ind w:left="360" w:right="180"/>
            <w:spacing w:before="140" w:after="140"/>
          </w:pPr>
          <w:r>
            <w:rPr><w:b/><w:color w:val="1E40AF"/></w:rPr>
            <w:t xml:space="preserve">${escapeXml(calloutBlk.title || 'Ghi chú')}: </w:t>
          </w:r>
          ${calloutBlk.segments.map(renderSegmentXml).join('')}
        </w:p>`;
        break;
      }

      case 'divider': {
        bodyXml += `<w:p>
          <w:pPr>
            <w:pBdr>
              <w:bottom w:val="single" w:sz="6" w:space="1" w:color="CBD5E1"/>
            </w:pBdr>
            <w:spacing w:before="120" w:after="120"/>
          </w:pPr>
        </w:p>`;
        break;
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" 
            xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" 
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
            xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" 
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
            xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="${width}" w:h="${height}"/>
      <w:pgMar w:top="${top}" w:right="${right}" w:bottom="${bottom}" w:left="${left}" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

/**
 * Builds and packages complete Word (.docx) file as a Blob with native OMML and safe image embedding
 */
export async function generateDocxBlob(
  blocks: ParsedBlock[],
  settings: DocSettings
): Promise<Blob> {
  const zip = new JSZip();

  const geometryBlocks = blocks.filter(b => b.type === 'geometry') as GeometryBlock[];
  const geometryMap = new Map<string, { imageIdx: number; width: number; height: number }>();

  const wordFolder = zip.folder('word');
  const mediaFolder = wordFolder?.folder('media');

  let imgCounter = 0;
  for (const gBlock of geometryBlocks) {
    if (gBlock.svg) {
      const w = gBlock.width || 450;
      const h = gBlock.height || 350;
      try {
        const pngData = await svgToPngData(gBlock.svg, w, h);
        if (pngData && pngData.length > 0 && mediaFolder) {
          imgCounter++;
          mediaFolder.file(`image${imgCounter}.png`, pngData);
          geometryMap.set(gBlock.id, { imageIdx: imgCounter, width: w, height: h });
        }
      } catch (err) {
        console.warn('Không thể chuyển ảnh TikZ sang PNG, bỏ qua nhúng', err);
      }
    }
  }

  // 1. [Content_Types].xml (always valid)
  zip.file('[Content_Types].xml', buildContentTypesXml());

  // 2. _rels/.rels
  zip.folder('_rels')?.file('.rels', buildRootRelsXml());

  // 3. word files with EXACT count of written images
  if (wordFolder) {
    wordFolder.folder('_rels')?.file('document.xml.rels', buildDocumentRelsXml(imgCounter));
    wordFolder.file('fontTable.xml', buildFontTableXml(settings.fontFamily));
    wordFolder.file('settings.xml', buildSettingsXml());
    wordFolder.file('styles.xml', buildStylesXml(settings.fontFamily, settings.fontSizePt));
    wordFolder.file('document.xml', buildDocumentXml(blocks, settings, geometryMap));
  }

  // Generate binary docx zip
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  return blob;
}

/**
 * Generates Word HTML (.doc) format with MathML & SVG geometry drawings
 */
export function generateWordHtml(blocks: ParsedBlock[], settings: DocSettings): string {
  let contentHtml = '';

  for (const block of blocks) {
    switch (block.type) {
      case 'title': {
        const b = block as TitleBlock;
        contentHtml += `<h1 style="text-align: center; color: #0F172A; margin-bottom: 4px;">${escapeXml(b.title)}</h1>`;
        if (b.author || b.date) {
          contentHtml += `<p style="text-align: center; color: #475569; font-style: italic; margin-top: 0;">${escapeXml([b.author, b.date].filter(Boolean).join(' • '))}</p>`;
        }
        break;
      }
      case 'section':
        contentHtml += `<h2 style="color: #1E3A8A; margin-top: 18px; margin-bottom: 8px;">${escapeXml((block as SectionBlock).text)}</h2>`;
        break;
      case 'subsection':
        contentHtml += `<h3 style="color: #1D4ED8; margin-top: 14px; margin-bottom: 6px;">${escapeXml((block as SectionBlock).text)}</h3>`;
        break;
      case 'subsubsection':
        contentHtml += `<h4 style="color: #334155; margin-top: 10px; margin-bottom: 4px;">${escapeXml((block as SectionBlock).text)}</h4>`;
        break;
      case 'paragraph': {
        const p = block as ParagraphBlock;
        const inner = p.segments
          .map(s => {
            if (s.isMath && s.mathml) return s.mathml;
            let res = escapeXml(s.text);
            if (s.bold) res = `<strong>${res}</strong>`;
            if (s.italic) res = `<em>${res}</em>`;
            if (s.underline) res = `<u>${res}</u>`;
            return res;
          })
          .join('');
        contentHtml += `<p style="line-height: 1.5; margin: 8px 0;">${inner}</p>`;
        break;
      }
      case 'equation': {
        const eq = block as EquationBlock;
        contentHtml += `<div style="text-align: ${settings.centerEquations ? 'center' : 'left'}; margin: 14px 0;">
          ${eq.mathml}
          ${eq.equationNumber ? `<span style="float: right; color: #64748B;">(${eq.equationNumber})</span>` : ''}
        </div>`;
        break;
      }
      case 'geometry': {
        const g = block as GeometryBlock;
        if (g.svg) {
          contentHtml += `<div style="text-align: center; margin: 16px 0;">
            ${g.svg}
            ${g.caption ? `<p style="font-style: italic; color: #475569; font-size: 10pt; margin-top: 6px;">Hình: ${escapeXml(g.caption)}</p>` : ''}
          </div>`;
        }
        break;
      }
      case 'list': {
        const l = block as ListBlock;
        const tag = l.ordered ? 'ol' : 'ul';
        contentHtml += `<${tag} style="padding-left: 24px; margin: 8px 0;">`;
        l.items.forEach(item => {
          const itemText = item.segments
            .map(s => (s.isMath && s.mathml ? s.mathml : escapeXml(s.text)))
            .join('');
          contentHtml += `<li style="margin: 4px 0;">${itemText}</li>`;
        });
        contentHtml += `</${tag}>`;
        break;
      }
      case 'table': {
        const t = block as TableBlock;
        contentHtml += `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; margin: 12px auto; width: 90%;">`;
        t.rows.forEach(row => {
          contentHtml += '<tr>';
          row.forEach(cell => {
            const tag = cell.isHeader ? 'th' : 'td';
            const bg = cell.isHeader ? 'background-color: #F1F5F9;' : '';
            const cellContent = cell.segments
              .map(s => (s.isMath && s.mathml ? s.mathml : escapeXml(s.text)))
              .join('');
            contentHtml += `<${tag} style="${bg} text-align: ${cell.align || 'center'};">${cellContent}</${tag}>`;
          });
          contentHtml += '</tr>';
        });
        contentHtml += '</table>';
        break;
      }
      case 'callout': {
        const c = block as CalloutBlock;
        const inner = c.segments
          .map(s => (s.isMath && s.mathml ? s.mathml : escapeXml(s.text)))
          .join('');
        contentHtml += `<div style="border-left: 4px solid #2563EB; background: #F8FAFC; padding: 10px 14px; margin: 12px 0;">
          <strong style="color: #1E40AF;">${escapeXml(c.title || 'Ghi chú')}:</strong> ${inner}
        </div>`;
        break;
      }
      case 'divider':
        contentHtml += '<hr style="border: none; border-top: 1px solid #CBD5E1; margin: 16px 0;"/>';
        break;
    }
  }

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${escapeXml(settings.docTitle)}</title>
  <style>
    body {
      font-family: '${settings.fontFamily}', serif;
      font-size: ${settings.fontSizePt}pt;
      color: #000000;
      margin: 2cm;
    }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`;
}
