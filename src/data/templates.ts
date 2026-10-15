export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: 'exam' | 'reference' | 'paper' | 'simple';
  latex: string;
}

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'exam-thpt',
    name: 'Đề thi THPT Quốc Gia (Toán)',
    description: 'Đề thi trắc nghiệm Toán chuẩn gồm câu hỏi, công thức giải tích, hình học Oxyz và các phương án A, B, C, D',
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

\\textbf{Câu 4:} Cho số phức $z$ thỏa mãn điều kiện $(1 + 2i)z + 3 - 4i = 0$. Môđun của số phức $z$ là:
\\[
|z| = \\sqrt{a^2 + b^2} = \\sqrt{5}
\\]

\\section{Phần Tự Luận & Ứng Dụng}

\\begin{theorem}
Nghiệm của phương trình bậc hai $ax^2 + bx + c = 0$ ($a \\neq 0$) với biệt thức $\\Delta = b^2 - 4ac$ được cho bởi:
\\[
x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\\]
\\end{theorem}

\\end{document}`,
  },
  {
    id: 'calculus-handbook',
    name: 'Sổ tay Giải tích & Đại số',
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

Tích phân Gauss đóng vai trò nền tảng trong xác suất thống kê:
\\[
\\int_{-\\infty}^{+\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\]

\\section{Khai Triển Chuỗi Taylor}

Chuỗi Taylor của hàm số khả vi vô hạn $f(x)$ tại lân cận điểm $x_0$:
\\[
f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(x_0)}{n!} (x - x_0)^n
\\]

Một số khai triển Maclaurin tiêu biểu:
\\begin{itemize}
  \\item $e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$
  \\item $\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n+1}}{(2n+1)!}$
  \\item $\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\dots = \\sum_{n=0}^{\\infty} (-1)^n \\frac{x^{2n}}{(2n)!}$
\\end{itemize}

\\section{Đại Số Tuyến Tính & Ma Trận}

Ma trận nghịch đảo của ma trận vuông cấp 2:
\\[
\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}
\\]

\\end{document}`,
  },
  {
    id: 'research-paper',
    name: 'Báo cáo Khoa học / Đồ án',
    description: 'Cấu trúc bài báo khoa học với Tóm tắt (Abstract), phương trình vi phân, bảng dữ liệu và kết luận',
    category: 'paper',
    latex: `\\documentclass{article}
\\usepackage{amsmath}

\\title{Nghiên Cứu Mô Hình Truyền Nhiệt Phi Tuyến Tính}
\\author{TS. Trần Hoàng Nam, ThS. Lê Diệu Linh}
\\date{Tháng 10, 2026}

\\begin{document}
\\maketitle

\\begin{quote}
\\textbf{Tóm tắt:} Bài viết trình bày giải pháp giải phương trình truyền nhiệt phi tuyến bằng phương pháp sai phân hữu hạn kết hợp thuật toán tối ưu Gradient Descent.
\\end{quote}

\\section{Mô Hình Toán Học}

Xét phương trình đạo hàm riêng mô tả quá trình khuếch tán nhiệt trong vật liệu:
\\[
\\frac{\\partial u}{\\partial t} = \\alpha \\left( \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} \\right) + Q(x, y, t)
\\]
với điều kiện biên Dirichlet:
\\[
\\begin{cases}
u(0, y, t) = T_0 \\\\
u(L, y, t) = T_1 \\\\
u(x, y, 0) = f(x, y)
\\end{cases}
\\]

\\section{Kết Quả Thực Nghiệm}

\\begin{table}
\\caption{So sánh sai số giữa phương pháp giải tích và phương pháp số}
\\begin{tabular}{|c|c|c|c|}
Thời gian (s) & Nhiệt độ lý thuyết ($^\\circ$C) & Thực nghiệm ($^\\circ$C) & Sai số (\\%) \\\\
0 & 25.0 & 25.0 & 0.00 \\\\
10 & 42.5 & 42.1 & 0.94 \\\\
30 & 68.3 & 67.9 & 0.58 \\\\
60 & 89.7 & 89.2 & 0.55 \\\\
\\end{tabular}
\\end{table}

\\section{Kết Luận}
Mô hình hội tụ với tốc độ bậc hai $O(\\Delta t + \\Delta x^2)$ và sai số trung bình dưới $1\\%$.

\\end{document}`,
  },
  {
    id: 'physics-chemistry',
    name: 'Công thức Vật Lý & Hóa Học',
    description: 'Hệ phương trình Maxwell, cơ học lượng tử Schrödinger, quang học sóng và phân rã phóng xạ',
    category: 'reference',
    latex: `\\documentclass{article}
\\usepackage{amsmath}

\\title{CÁC PHƯƠNG TRÌNH VẬT LÝ KINH ĐIỂN}
\\author{Bộ Môn Vật Lý Đại Cương}
\\date{2026}

\\begin{document}
\\maketitle

\\section{Hệ Phương Trình Điện Từ Maxwell}

Trong môi trường chân không, hệ phương trình Maxwell vi phân:
\\[
\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}
\\]
\\[
\\nabla \\cdot \\mathbf{B} = 0
\\]
\\[
\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}
\\]
\\[
\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}
\\]

\\section{Cơ Học Lượng Tử & Tương Đối}

Phương trình Schrödinger phụ thuộc thời gian mô tả hàm sóng $\\Psi(\\mathbf{r}, t)$:
\\[
i\\hbar \\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r}, t) = \\left[ -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r}, t) \\right] \\Psi(\\mathbf{r}, t)
\\]

Hệ thức tương đối hẹp Einstein:
\\[
E^2 = (pc)^2 + (m_0 c^2)^2
\\]

Định luật phóng xạ hạt nhân:
\\[
N(t) = N_0 \\cdot 2^{-\\frac{t}{T}} = N_0 \\cdot e^{-\\lambda t}
\\]

\\end{document}`,
  },
  {
    id: 'simple-formulas',
    name: 'Công thức Toán đơn giản',
    description: 'Mẫu nhanh gồm các công thức căn bản: phương trình bậc hai, lượng giác, giới hạn và tổ hợp',
    category: 'simple',
    latex: `% Mẫu thử nghiệm công thức đơn giản
\\textbf{1. Công thức nghiệm phương trình bậc hai:}
\\[
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\\]

\\textbf{2. Đẳng thức lượng giác cơ bản:}
\\[
\\sin^2(x) + \\cos^2(x) = 1, \\quad 1 + \\tan^2(x) = \\frac{1}{\\cos^2(x)}
\\]

\\textbf{3. Công thức tổ hợp và nhị thức Newton:}
\\[
(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k, \\quad \\text{với } \\binom{n}{k} = \\frac{n!}{k!(n-k)!}
\\]

\\textbf{4. Giới hạn quan trọng:}
\\[
\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e
\\]`,
  },
];
