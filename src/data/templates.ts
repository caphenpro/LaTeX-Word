export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: 'geometry' | 'exam' | 'reference' | 'paper' | 'simple';
  latex: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'geometry-spatial-exam',
    name: 'Đề Thi Hình Học Không Gian & Oxyz (Có Hình Vẽ TikZ)',
    description: 'Đề bài hình học không gian gồm hình chóp S.ABC, góc, khoảng cách, phương trình mặt cầu và hình vẽ TikZ 3D',
    category: 'geometry',
    latex: `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{tikz}

\\title{CHUYÊN ĐỀ HÌNH HỌC KHÔNG GIAN & TỌA ĐỘ OXYZ}
\\author{Tổ Toán - Khảo Sát Ôn Thi THPT}
\\date{Năm học 2026 - 2027}

\\begin{document}
\\maketitle

\\section{Hình Học Không Gian Cổ Điển}

\\textbf{Bài toán 1:} Cho hình chóp $S.ABC$ có đáy $ABC$ là tam giác vuông tại $B$, $AB = a$, $BC = a\\sqrt{3}$. Cạnh bên $SA$ vuông góc với mặt phẳng đáy $(ABC)$ và $SA = 2a$.

\\begin{tikzpicture}[scale=1]
  % Coordinates
  \\coordinate (A) at (0,0);
  \\coordinate (B) at (1.5,-1.2);
  \\coordinate (C) at (5,0);
  \\coordinate (S) at (0,3.5);
  
  % Dashed line
  \\draw[dashed, thick] (A) -- (C);
  
  % Solid lines
  \\draw[thick] (S) -- (A) -- (B) -- (C) -- (S);
  \\draw[thick] (S) -- (B);
  
  % Right angle at A (SA perp ABC)
  \\draw (0,0.3) -- (0.3,0.3) -- (0.3,0);
  
  % Nodes
  \\node[left] at (A) {$A$};
  \\node[below] at (B) {$B$};
  \\node[right] at (C) {$C$};
  \\node[above] at (S) {$S$};
\\end{tikzpicture}

\\begin{enumerate}
  \\item Chứng minh rằng tam giác $SBC$ vuông tại $B$.
  \\[
  \\begin{cases}
  BC \\perp AB \\\\
  BC \\perp SA \\quad (\\text{do } SA \\perp (ABC))
  \\end{cases}
  \\implies BC \\perp (SAB) \\implies BC \\perp SB
  \\]
  
  \\item Tính thể tích khối chóp $S.ABC$:
  \\[
  V_{S.ABC} = \\frac{1}{3} S_{\\triangle ABC} \\cdot SA = \\frac{1}{3} \\left(\\frac{1}{2} a \\cdot a\\sqrt{3}\\right) \\cdot 2a = \\frac{a^3\\sqrt{3}}{3}
  \\]
  
  \\item Tính khoảng cách từ điểm $A$ đến mặt phẳng $(SBC)$. Kẻ $AH \\perp SB$ ($H \\in SB$):
  \\[
  d(A, (SBC)) = AH = \\frac{SA \\cdot AB}{\\sqrt{SA^2 + AB^2}} = \\frac{2a \\cdot a}{\\sqrt{4a^2 + a^2}} = \\frac{2a\\sqrt{5}}{5}
  \\]
\\end{enumerate}

\\section{Phương Pháp Tọa Độ Trong Không Gian Oxyz}

Trong không gian $Oxyz$, cho bốn điểm $A(1; 0; 2)$, $B(-1; 1; 3)$, $C(3; 2; 0)$ và $D(1; 1; 1)$.

\\begin{itemize}
  \\item Vectơ chỉ phương và độ dài đoạn thẳng:
  \\[
  \\vec{AB} = (-2; 1; 1) \\implies |\\vec{AB}| = \\sqrt{(-2)^2 + 1^2 + 1^2} = \\sqrt{6}
  \\]
  
  \\item Tích có hướng giữa hai vectơ $\\vec{AB}$ và $\\vec{AC}$:
  \\[
  \\vec{AC} = (2; 2; -2) \\implies [\\vec{AB}, \\vec{AC}] = \\left( -4; -2; -6 \\right)
  \\]
  
  \\item Phương trình tổng quát của mặt phẳng $(ABC)$ đi qua $A(1;0;2)$ nhận $\\vec{n} = (2; 1; 3)$ làm vectơ pháp tuyến:
  \\[
  2(x - 1) + 1(y - 0) + 3(z - 2) = 0 \\iff 2x + y + 3z - 8 = 0
  \\]
  
  \\item Phương trình mặt cầu $(S)$ tâm $I(a; b; c)$, bán kính $R$:
  \\[
  (S): (x - a)^2 + (y - b)^2 + (z - c)^2 = R^2
  \\]
\\end{itemize}

\\end{document}`,
  },
  {
    id: 'geometry-plane-tikz',
    name: 'Hình Học Phẳng & Hệ Trục Oxy (Hình Vẽ TikZ)',
    description: 'Hệ thức lượng trong tam giác, đường tròn, góc định hướng và hệ trục tọa độ Oxy trực quan',
    category: 'geometry',
    latex: `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{tikz}

\\title{HỆ THỨC LƯỢNG TRONG TAM GIÁC & TỌA ĐỘ OXY}
\\author{Tổ Hình Học}
\\date{2026}

\\begin{document}
\\maketitle

\\section{Hệ Thức Lượng & Các Định Lý Kinh Điển}

\\begin{tikzpicture}[scale=1]
  \\draw[thick] (0,0) coordinate (B) -- (4.5,0) coordinate (C) -- (1.2,3) coordinate (A) -- cycle;
  \\draw[dashed] (1.2,3) -- (1.2,0) coordinate (H);
  \\draw (1.2,0.25) -- (1.45,0.25) -- (1.45,0);
  
  \\node[above] at (A) {$A$};
  \\node[below left] at (B) {$B$};
  \\node[below right] at (C) {$C$};
  \\node[below] at (H) {$H$};
\\end{tikzpicture}

\\textbf{1. Định lý côsin và định lý sin:}
\\[
a^2 = b^2 + c^2 - 2bc \\cos \\widehat{A}, \\quad \\frac{a}{\\sin \\widehat{A}} = \\frac{b}{\\sin \\widehat{B}} = \\frac{c}{\\sin \\widehat{C}} = 2R
\\]

\\textbf{2. Các công thức tính diện tích tam giác $S$:}
\\[
S = \\frac{1}{2} a h_a = \\frac{1}{2} ab \\sin \\widehat{C} = \\frac{abc}{4R} = pr = \\sqrt{p(p-a)(p-b)(p-c)}
\\]
với $p = \\frac{a + b + c}{2}$ là nửa chu vi tam giác.

\\section{Hệ Trục Tọa Độ Đề-Các Oxy}

\\begin{tikzpicture}[scale=0.9]
  \\draw[->, thick] (-2.5,0) -- (3.5,0) node[right] {$x$};
  \\draw[->, thick] (0,-2.5) -- (0,3.5) node[above] {$y$};
  \\node[below left] at (0,0) {$O$};
  \\draw[blue, thick] (0,0) circle (2);
  \\node[above right, blue] at (1.4, 1.4) {$(C): x^2 + y^2 = R^2$};
\\end{tikzpicture}

Góc giữa hai đường thẳng $d_1: A_1 x + B_1 y + C_1 = 0$ và $d_2: A_2 x + B_2 y + C_2 = 0$:
\\[
\\cos(d_1, d_2) = \\frac{|A_1 A_2 + B_1 B_2|}{\\sqrt{A_1^2 + B_1^2} \\cdot \\sqrt{A_2^2 + B_2^2}}
\\]

\\end{document}`,
  },
  {
    id: 'geometry-cheat-sheet',
    name: 'Sổ Tay Công Thức Hình Học Toàn Diện',
    description: 'Tổng hợp công thức hình học phẳng, thể tích đa diện, nón - trụ - cầu và tọa độ không gian',
    category: 'reference',
    latex: `\\documentclass{article}
\\usepackage{amsmath}

\\title{CẨM NANG TOÀN BỘ CÔNG THỨC HÌNH HỌC THPT}
\\author{Hội Đồng Khoa Học Sư Phạm}
\\date{Phiên bản 2026}

\\begin{document}
\\maketitle

\\section{Thể Tích Các Khối Đa Diện}

\\begin{itemize}
  \\item \\textbf{Khối chóp:} $V = \\frac{1}{3} S_{đáy} \\cdot h$
  \\item \\textbf{Khối lăng trụ:} $V = S_{đáy} \\cdot h$
  \\item \\textbf{Khối hộp chữ nhật:} $V = a \\cdot b \\cdot c, \\quad d = \\sqrt{a^2 + b^2 + c^2}$
  \\item \\textbf{Khối tứ diện đều cạnh $a$:} $V = \\frac{a^3 \\sqrt{2}}{12}$
  \\item \\textbf{Khối chóp tam giác đều cạnh đáy $a$, cạnh bên $b$:} $h = \\sqrt{b^2 - \\frac{a^2}{3}}$
\\end{itemize}

\\section{Khối Tròn Xoay (Nón - Trụ - Cầu)}

\\begin{tabular}{|c|c|c|c|}
Khối Tròn Xoay & Diện tích xung quanh ($S_{xq}$) & Diện tích toàn phần ($S_{tp}$) & Thể tích ($V$) \\\\
Hình Nón & $\\pi R l$ & $\\pi R l + \\pi R^2$ & $\\frac{1}{3}\\pi R^2 h$ \\\\
Hình Trụ & $2\\pi R h$ & $2\\pi R h + 2\\pi R^2$ & $\\pi R^2 h$ \\\\
Mặt Cầu & $4\\pi R^2$ & $4\\pi R^2$ & $\\frac{4}{3}\\pi R^3$ \\\\
\\end{tabular}

\\section{Hình Học Tọa Độ Oxyz}

\\begin{itemize}
  \\item Tích có hướng: $[\\vec{u}, \\vec{v}] = (u_2 v_3 - u_3 v_2; u_3 v_1 - u_1 v_3; u_1 v_2 - u_2 v_1)$
  \\item Diện tích tam giác: $S_{\\triangle ABC} = \\frac{1}{2} |[\\vec{AB}, \\vec{AC}]|$
  \\item Thể tích khối tứ diện: $V_{ABCD} = \\frac{1}{6} |[\\vec{AB}, \\vec{AC}] \\cdot \\vec{AD}|$
  \\item Khoảng cách từ điểm $M(x_0; y_0; z_0)$ đến mặt phẳng $(P): Ax + By + Cz + D = 0$:
  \\[
  d(M, (P)) = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}
  \\]
\\end{itemize}

\\end{document}`,
  },
  {
    id: 'exam-thpt',
    name: 'Đề thi THPT Quốc Gia (Đại số & Giải tích)',
    description: 'Đề thi trắc nghiệm Toán chuẩn gồm câu hỏi, công thức giải tích, tích phân và các phương án A, B, C, D',
    category: 'exam',
    latex: `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amsfonts}

\\title{ĐỀ KHẢO SÁT CHẤT LƯỢNG MÔN TOÁN THPT}
\\author{Ban Chuyên Môn Toán Học}
\\date{Năm học 2026 - 2027}

\\begin{document}
\\maketitle

\\section{Phần Trắc Nghiệm Khách Quan}

\\textbf{Câu 1:} Cho hàm số $f(x) = x^3 - 3x^2 + 2$. Điểm cực đại của đồ thị hàm số là:
\\begin{enumerate}
  \\item $A. (0; 2)$
  \\item $B. (2; -2)$
  \\item $C. (1; 0)$
  \\item $D. (0; -2)$
\\end{enumerate}

\\textbf{Câu 2:} Tính tích phân sau:
\\[
I = \\int_{0}^{1} \\frac{2x + 1}{x^2 + x + 1} dx
\\]
\\begin{enumerate}
  \\item $A. I = \\ln 3$
  \\item $B. I = \\ln 2$
  \\item $C. I = 2\\ln 3$
  \\item $D. I = \\frac{1}{2}\\ln 3$
\\end{enumerate}

\\textbf{Câu 3:} Trong không gian với hệ tọa độ $Oxyz$, cho mặt phẳng $(P)$ có phương trình:
\\[
2x - y + 2z - 5 = 0
\\]
Khoảng cách từ gốc tọa độ $O(0;0;0)$ đến mặt phẳng $(P)$ bằng:
\\begin{enumerate}
  \\item $A. \\frac{5}{3}$
  \\item $B. 5$
  \\item $C. \\frac{5}{9}$
  \\item $D. \\frac{5}{\\sqrt{5}}$
\\end{enumerate}

\\end{document}`,
  },
  {
    id: 'calculus-handbook',
    name: 'Sổ tay Giải tích Cao cấp',
    description: 'Tổng hợp các công thức đạo hàm, tích phân, chuỗi Taylor, ma trận và công thức Euler nổi tiếng',
    category: 'reference',
    latex: `\\documentclass{article}
\\usepackage{amsmath}

\\title{CẨM NANG CÔNG THỨC TOÁN CAO CẤP}
\\author{Viện Toán Ứng Dụng}
\\date{Phiên bản 2026}

\\begin{document}
\\maketitle

\\section{Các Đẳng Thức Đẹp Nhất Toán Học}

Công thức Euler liên hệ 5 hằng số cơ bản của toán học:
\\[
e^{i\\pi} + 1 = 0
\\]

Tích phân Gauss:
\\[
\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\]

\\end{document}`,
  },
];
