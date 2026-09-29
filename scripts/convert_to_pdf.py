import os
import re
import subprocess
from markdown_it import MarkdownIt

def build_pdf():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_path = os.path.join(base_dir, "INTERVIEW_DEFENSE_AND_WALKTHROUGH.md")
    html_path = os.path.join(base_dir, "INTERVIEW_DEFENSE_AND_WALKTHROUGH.html")
    pdf_path = os.path.join(base_dir, "INTERVIEW_DEFENSE_AND_WALKTHROUGH.pdf")

    print(f"Reading markdown from: {md_path}")
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Pre-process math blocks for clean display without external JS dependencies
    md_text = re.sub(
        r'\$\$\\text\{IDF\}\(t\)\s*=\s*\\ln\\left\(\\frac\{N\s*\+\s*1\}\{\\text\{DF\}\(t\)\s*\+\s*1\}\\right\)\s*\+\s*1\$\$',
        '<div class="math-box"><strong>IDF Formula:</strong> IDF(t) = ln((N + 1) / (DF(t) + 1)) + 1</div>',
        md_text
    )
    md_text = re.sub(
        r'\$\$\\text\{Similarity\}\s*=\s*\\sum\s*\(q_i\s*\\cdot\s*d_i\)\$\$',
        '<div class="math-box"><strong>Cosine Similarity:</strong> Similarity = &Sigma; (q<sub>i</sub> &bull; d<sub>i</sub>) &nbsp; [Normalized unit vectors]</div>',
        md_text
    )

    # Initialize markdown parser with tables and strikethrough
    md = MarkdownIt().enable('table').enable('strikethrough')
    content_html = md.render(md_text)

    # Wrap in executive print-ready styling
    styled_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quantum Weave AI Full-Stack Developer Defense & Interview Guide</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    @page {{
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
      @bottom-right {{
        content: counter(page);
        font-size: 8pt;
        color: #64748b;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }}
    }}
    
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}
    
    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 9.5pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }}

    .document-header {{
      border-bottom: 2.5px solid #4f46e5;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }}

    .brand-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }}

    .brand-name {{
      font-size: 13pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
    }}

    .brand-sub {{
      font-size: 8.5pt;
      font-weight: 600;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}

    .meta-pills {{
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }}

    .meta-pill {{
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 8pt;
      color: #334155;
      font-weight: 600;
    }}

    .meta-pill.accent {{
      background: #eef2ff;
      border-color: #c7d2fe;
      color: #4338ca;
    }}

    .meta-pill.success {{
      background: #ecfdf5;
      border-color: #a7f3d0;
      color: #065f46;
    }}

    h1 {{
      font-size: 17pt;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10px 0;
      line-height: 1.25;
      letter-spacing: -0.02em;
    }}

    h2 {{
      font-size: 12.5pt;
      font-weight: 800;
      color: #1e1b4b;
      margin: 22px 0 10px 0;
      padding-bottom: 5px;
      border-bottom: 1.5px solid #e2e8f0;
      page-break-after: avoid;
    }}

    h3 {{
      font-size: 10.5pt;
      font-weight: 700;
      color: #312e81;
      margin: 16px 0 6px 0;
      page-break-after: avoid;
    }}

    h4 {{
      font-size: 9.5pt;
      font-weight: 700;
      color: #4338ca;
      margin: 12px 0 4px 0;
      page-break-after: avoid;
    }}

    p {{
      margin: 0 0 8px 0;
      color: #334155;
    }}

    strong {{
      color: #0f172a;
      font-weight: 700;
    }}

    ul, ol {{
      margin: 0 0 10px 0;
      padding-left: 20px;
    }}

    li {{
      margin-bottom: 4px;
      color: #334155;
    }}

    blockquote {{
      margin: 10px 0;
      padding: 10px 14px;
      background: #f8fafc;
      border-left: 3.5px solid #4f46e5;
      border-radius: 0 6px 6px 0;
      font-size: 9pt;
      line-height: 1.55;
      color: #1e293b;
      page-break-inside: avoid;
    }}

    blockquote p {{
      margin: 0 0 6px 0;
    }}

    blockquote p:last-child {{
      margin-bottom: 0;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }}

    th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
      font-size: 8.5pt;
    }}

    td {{
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: top;
    }}

    tr:nth-child(even) td {{
      background: #f8fafc;
    }}

    code {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.2pt;
      background: #f1f5f9;
      color: #4338ca;
      padding: 1.5px 4.5px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }}

    pre {{
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 6px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      line-height: 1.45;
      margin: 8px 0 12px 0;
      page-break-inside: avoid;
    }}

    pre code {{
      background: transparent;
      color: #e2e8f0;
      border: none;
      padding: 0;
    }}

    hr {{
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 16px 0;
    }}

    a {{
      color: #4f46e5;
      text-decoration: none;
      font-weight: 600;
    }}

    a:hover {{
      text-decoration: underline;
    }}

    .math-box {{
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 8px 0 12px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      color: #312e81;
      page-break-inside: avoid;
    }}

    .section-banner {{
      background: #4f46e5;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 10pt;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }}
  </style>
</head>
<body>
  <div class="document-header">
    <div class="brand-bar">
      <div>
        <div class="brand-name">QUANTUM WEAVE</div>
        <div class="brand-sub">BrandMint AI Pvt. Ltd. | Enterprise AI Venture</div>
      </div>
      <div style="text-align: right;">
        <span class="meta-pill accent">Practical Skill Test Defense</span>
        <span class="meta-pill success">18/18 Tests Passed</span>
      </div>
    </div>
    <div class="meta-pills">
      <span class="meta-pill"><strong>Candidate:</strong> Chirag N Sundar</span>
      <span class="meta-pill"><strong>Role:</strong> AI Full-Stack Developer</span>
      <span class="meta-pill"><strong>Live App:</strong> <a href="https://quantum-weave-project.vercel.app/" target="_blank">quantum-weave-project.vercel.app</a></span>
      <span class="meta-pill"><strong>GitHub:</strong> <a href="https://github.com/ChiragNSundar/QuantumWeaveProject" target="_blank">ChiragNSundar/QuantumWeaveProject</a></span>
    </div>
  </div>

  <div class="content-body">
    {content_html}
  </div>
</body>
</html>"""

    print(f"Writing styled HTML to: {html_path}")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(styled_html)

    # Convert HTML to PDF using Chrome Headless
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if not os.path.exists(chrome_path):
        chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

    print(f"Using browser: {chrome_path}")
    print(f"Generating PDF at: {pdf_path}")

    args = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]

    result = subprocess.run(args, capture_output=True, text=True)
    if result.returncode == 0 and os.path.exists(pdf_path):
        size_kb = os.path.getsize(pdf_path) / 1024
        print(f"SUCCESS! PDF created: {pdf_path} ({size_kb:.1f} KB)")
    else:
        print(f"Error generating PDF: {result.stderr}")

if __name__ == "__main__":
    build_pdf()
