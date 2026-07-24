const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/vendor-docx-CBx4UedY.js","assets/rolldown-runtime-DAXXjFlN.js"])))=>i.map(i=>d[i]);
import{o as e}from"./rolldown-runtime-DAXXjFlN.js";import{n as t}from"./vendor-pdf-Dk3nZWcD.js";import{n}from"./assets-CyYEtk40.js";function r(e){return e.replace(/\\/g,`\\textbackslash{}`).replace(/([{}$&#_%])/g,`\\$1`).replace(/~/g,`\\textasciitilde{}`).replace(/\^/g,`\\textasciicircum{}`)}function i(e){return e.replace(/[{}]/g,``)}var a=[{id:`cn-paper`,name:`中文论文`,documentClass:`ctexart`,engine:`xelatex`,packages:[`geometry`,`hyperref`,`booktabs`,`graphicx`,`amsmath`,`amssymb`,`listings`,`xcolor`,`fancyhdr`,`setspace`],preamble:`\\geometry{a4paper,top=3.5cm,bottom=3.5cm,left=2.8cm,right=2.8cm}
\\setstretch{1.5}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot[C]{\\thepage}
\\lstset{basicstyle=\\ttfamily\\small,breaklines=true,frame=single}`,structure:[`title`,`author`,`abstract`,`tableofcontents`,`body`,`bibliography`],description:`ctexart + XeLaTeX，适合中文学位/课程论文`},{id:`cn-report`,name:`中文报告`,documentClass:`ctexrep`,engine:`xelatex`,packages:[`geometry`,`hyperref`,`graphicx`,`booktabs`,`listings`,`amsmath`],preamble:`\\geometry{a4paper,margin=2.5cm}
\\lstset{basicstyle=\\ttfamily\\small,breaklines=true}`,structure:[`title`,`author`,`body`],description:`报告类文档`},{id:`en-paper`,name:`英文论文`,documentClass:`article`,engine:`pdflatex`,packages:[`geometry`,`hyperref`,`booktabs`,`graphicx`,`amsmath`,`natbib`,`listings`],preamble:`\\geometry{a4paper,margin=2.5cm}
\\lstset{basicstyle=\\ttfamily\\small,breaklines=true}`,structure:[`title`,`author`,`abstract`,`body`,`bibliography`]},{id:`lab-report`,name:`实验报告`,documentClass:`ctexart`,engine:`xelatex`,packages:[`geometry`,`hyperref`,`graphicx`,`booktabs`,`amsmath`,`listings`],preamble:`\\geometry{a4paper,margin=2.5cm}`,structure:[`title`,`author`,`body`]},{id:`tech-doc`,name:`技术文档`,documentClass:`ctexart`,engine:`xelatex`,packages:[`geometry`,`hyperref`,`listings`,`xcolor`,`graphicx`,`fancyhdr`],preamble:`\\geometry{a4paper,margin=2.2cm}
\\lstset{basicstyle=\\ttfamily\\small,breaklines=true,keywordstyle=\\color{blue}}`,structure:[`title`,`tableofcontents`,`body`]},{id:`resume`,name:`简历`,documentClass:`ctexart`,engine:`xelatex`,packages:[`geometry`,`hyperref`,`enumitem`],preamble:`\\geometry{a4paper,margin=1.5cm}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}`,structure:[`title`,`body`]},{id:`beamer`,name:`Beamer`,documentClass:`beamer`,engine:`xelatex`,packages:[`ctex`,`graphicx`,`booktabs`],preamble:`\\usetheme{Madrid}
\\usecolortheme{default}`,structure:[`title`,`author`,`body`],description:`演示文稿（frame 需手动调整）`},{id:`blank`,name:`空白模板`,documentClass:`article`,engine:`xelatex`,packages:[`geometry`],preamble:`\\geometry{a4paper,margin=2.5cm}`,structure:[`body`]}];function o(e){return a.find(t=>t.id===e)??a[0]}function s(e){return e.map(e=>{let t=r(e.text),n=e.marks??[];return n.includes(`code`)?`\\texttt{${r(e.text)}}`:n.includes(`link`)&&e.href?`\\href{${i(e.href)}}{${t}}`:(n.includes(`strong`)&&(t=`\\textbf{${t}}`),n.includes(`emphasis`)&&(t=`\\emph{${t}}`),n.includes(`delete`)&&(t=`\\sout{${t}}`),t)}).join(``)}function c(e){return e<=1?`section`:e===2?`subsection`:e===3?`subsubsection`:e===4?`paragraph`:`subparagraph`}function l(e,t){switch(e.type){case`heading`:{let n=s(e.children);return t?`\\begin{frame}{${n}}\n% content\n\\end{frame}`:`\\${c(e.level)}{${n}}`}case`paragraph`:return`${s(e.children)}\n`;case`ordered-list`:return`\\begin{enumerate}
`+e.items.map(e=>`  \\item ${e.children.map(e=>l(e,t)).join(` `).trim()}`).join(`
`)+`
\\end{enumerate}`;case`unordered-list`:case`task-list`:return`\\begin{itemize}
`+e.items.map(e=>`  \\item ${e.children.map(e=>l(e,t)).join(` `).trim()}`).join(`
`)+`
\\end{itemize}`;case`blockquote`:return`\\begin{quote}
`+e.children.map(e=>l(e,t)).join(`
`)+`
\\end{quote}`;case`code`:return`\\begin{lstlisting}${e.lang?`[language=${e.lang}]`:``}\n${e.value}\n\\end{lstlisting}`;case`formula`:return e.display===`block`?`\\[\n${e.value}\n\\]`:`\\(${e.value}\\)`;case`image`:return`\\begin{figure}[htbp]\n\\centering\n\\includegraphics[width=0.8\\textwidth]{${i(e.assetId?`images/${e.assetId}.png`:(e.src.startsWith(`http`),e.src))}}\n`+(e.caption?`\\caption{${r(e.caption)}}\n`:e.alt?`\\caption{${r(e.alt)}}\n`:``)+`\\end{figure}`;case`table`:{if(!e.rows.length)return``;let t=e.rows[0]?.length??1,n=`|`+`l|`.repeat(t),i=e.rows.map(e=>e.map(e=>s(e.children)).join(` & `)+` \\\\`).join(`
\\hline
`);return`\\begin{table}[htbp]
\\centering
`+(e.caption?`\\caption{${r(e.caption)}}\n`:``)+`\\begin{tabular}{${n}}\n\\hline\n${i}\n\\hline\n\\end{tabular}\n\\end{table}`}case`page-break`:return`\\newpage`;case`thematic-break`:return`\\hrulefill`;case`citation`:return`\\cite{${e.keys.join(`,`)}}`;case`footnote`:return`\\footnote{${e.children.map(e=>l(e,t)).join(` `)}}`;case`raw-latex`:return e.value;case`raw-markdown`:return`% raw-markdown\n${e.value.split(`
`).map(e=>`% ${e}`).join(`
`)}`;case`raw-html`:return`% raw-html omitted
`;default:return``}}function u(e){return e?.entries.length?`
\\begin{thebibliography}{99}
`+e.entries.map(e=>{let t=e.fields,n=[t.author,t.title?`\\textit{${r(t.title)}}`:``,t.journal,t.year,t.doi?`DOI: ${r(t.doi)}`:t.url].filter(Boolean).join(`, `);return`\\bibitem{${e.key}} ${n}`}).join(`
`)+`
\\end{thebibliography}
`:``}function d(e,t=`cn-paper`,n){let i=n??o(t),a=i.documentClass===`beamer`,s=i.packages.map(e=>e===`ctex`&&i.documentClass.startsWith(`ctex`)?``:`\\usepackage{${e}}`).filter(Boolean).join(`
`),c=r(e.metadata.title??`Untitled`),d=Array.isArray(e.metadata.author)?e.metadata.author.map(r).join(`\\and `):r(e.metadata.author??``),f=r(e.metadata.date??`\\today`),p=e.blocks.map(e=>l(e,a)).join(`

`),m=e.references?.entries.length?`
\\bibliographystyle{plain}
\\bibliography{references}
`:u(e.references);return`% Generated by AI Output Formatter — LaTeX Studio
% Engine: ${i.engine}
% Template: ${i.id}
\\documentclass{${i.documentClass}}
${s}
${i.preamble}

\\title{${c}}
\\author{${d}}
\\date{${f}}

\\begin{document}
\\maketitle
${e.metadata.abstract?`\\begin{abstract}\n${r(e.metadata.abstract)}\n\\end{abstract}\n`:``}
${i.structure.includes(`tableofcontents`)?`\\tableofcontents
\\newpage
`:``}
${p}
${i.structure.includes(`bibliography`)?m:``}
\\end{document}
`}function f(e){let t=[],n=[],r=/@(\w+)\s*\{\s*([^,]+)\s*,([\s\S]*?)\n\s*\}/g,i,a=new Set;for(;i=r.exec(e);){let e=(i[1]??`misc`).toLowerCase(),r=(i[2]??``).trim();if(!r){t.push(`存在缺少 citation key 的条目`);continue}a.has(r)&&t.push(`重复的 Citation Key：${r}`),a.add(r);let o=i[3]??``,s={},c=/(\w+)\s*=\s*(\{([^{}]*)\}|"([^"]*)"|([^,\n]+))/g,l;for(;l=c.exec(o);){let e=(l[1]??``).toLowerCase();s[e]=(l[3]??l[4]??l[5]??``).trim().replace(/,$/,``)}s.title||t.push(`${r}: 缺少 title`),!s.author&&!s.editor&&t.push(`${r}: 缺少 author/editor`),s.year&&!/^\d{4}$/.test(s.year)&&t.push(`${r}: 年份格式异常`),s.doi&&/\s/.test(s.doi)&&t.push(`${r}: DOI 含空白`),n.push({key:r,type:e,fields:s})}return!n.length&&e.trim()&&t.push(`未能解析任何 BibTeX 条目`),{data:{entries:n},warnings:t}}function p(e){return e.entries.map(e=>{let t=Object.entries(e.fields).map(([e,t])=>`  ${e} = {${t}}`).join(`,
`);return`@${e.type}{${e.key},\n${t}\n}`}).join(`

`)+(e.entries.length?`
`:``)}async function m(n,r=`cn-paper`,i){let a=(await t(async()=>{let{default:t}=await import(`./vendor-docx-CBx4UedY.js`).then(t=>e(t.n(),1));return{default:t}},__vite__mapDeps([0,1]))).default,s=new a,c=i??o(r),l=d(n,r,i);s.file(`main.tex`,l),n.references?.entries.length&&s.file(`references.bib`,p(n.references));let u=s.folder(`images`);for(let e of n.assets)e.dataBase64&&e.mime.startsWith(`image/`)&&u?.file(`${e.id}.png`,e.dataBase64,{base64:!0});let f=`AI Output Formatter — LaTeX 工程导出
================================

推荐编译命令（请在本机 TeX 环境执行，浏览器不会执行）：

  ${c.engine} main.tex
  bibtex main
  ${c.engine} main.tex
  ${c.engine} main.tex

或使用 Biber（若使用 biblatex）：

  ${c.engine} main.tex
  biber main
  ${c.engine} main.tex
  ${c.engine} main.tex

模板：${c.name} (${c.id})
引擎：${c.engine}
生成时间：${new Date().toISOString()}

说明：
- KaTeX 预览不是完整 XeLaTeX 编译结果。
- 在线 PDF 编译需配置 Document Conversion Service。
`;return s.file(`README.txt`,f),s.file(`compile.json`,JSON.stringify({engine:c.engine,main:`main.tex`,bibliography:n.references?.entries.length?`references.bib`:null,template:c.id,shellEscape:!1,generatedAt:new Date().toISOString()},null,2)),s.generateAsync({type:`blob`})}async function h(e,t=`cn-paper`,r){let i=await m(e,t),a=n(r||e.metadata.title||`latex-project`),o=URL.createObjectURL(i),s=document.createElement(`a`);s.href=o,s.download=`${a}.zip`,s.rel=`noopener`,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(o)}var g=`aof:document-service-url`;function _(){try{let e=localStorage.getItem(g)?.trim();if(e)return e.replace(/\/$/,``)}catch{}return`https://aof-document-converter.onrender.com`.replace(/\/$/,``)}function v(e){let t=e,n=t?.name||``,r=t?.message||String(e);return n===`AbortError`||/aborted|timeout/i.test(r)?`连接超时。免费服务冷启动可能需要 1–2 分钟，请再试一次。`:/Failed to fetch|NetworkError|Load failed|fetch/i.test(r)?`网络失败（常见于免费服务冷启动）。请等待约 1 分钟后重试；也可先打开服务 /health 唤醒。`:r||`未知网络错误`}async function y(e,t={},n=6e4){let r=new AbortController,i=setTimeout(()=>r.abort(),n);try{return await fetch(e,{...t,signal:r.signal})}finally{clearTimeout(i)}}async function b(e){try{let t=await e.json();return t.error||t.message||`HTTP ${e.status}`}catch{return`HTTP ${e.status}`}}async function x(e){let t=_();if(!t)return{ok:!1,message:`未配置转换服务地址`};try{let n=await y(`${t}/health`,{method:`GET`,cache:`no-store`},e?.timeoutMs??6e4);return n.ok?{ok:!0,message:`服务可用`}:{ok:!1,message:await b(n),coldStartHint:!0}}catch(e){return{ok:!1,message:v(e),coldStartHint:!0}}}async function S(e){let t=_();if(!t)throw Error(`转换服务地址为空`);for(let n=1;n<=8;n++){e?.(n===1?`正在连接转换服务…`:`正在唤醒免费服务（第 ${n}/8 次，可能需 1–2 分钟）…`);let r=await x({timeoutMs:5e4});if(r.ok){e?.(`服务已就绪`);return}if(n<8)await new Promise(e=>setTimeout(e,8e3));else throw Error(`${r.message}（地址 ${t}）。请稍后重试，或在新标签打开 ${t}/health 手动唤醒。`)}}async function C(e,t,n){let r=_();if(!r)throw Error(`转换服务地址为空`);let i=e;if(!e.name.includes(`.`)){let n=t.inputFormat===`markdown`?`md`:t.inputFormat===`latex`?`tex`:t.inputFormat===`html`?`html`:t.inputFormat===`docx`?`docx`:`txt`;i=new File([e],`${e.name||`input`}.${n}`,{type:e.type||`application/octet-stream`})}let a=new FormData;a.append(`file`,i),a.append(`inputFormat`,t.inputFormat),a.append(`outputFormat`,t.outputFormat),a.append(`standalone`,String(!!t.standalone)),a.append(`toc`,String(!!t.toc)),a.append(`numberSections`,String(!!t.numberSections)),a.append(`pdfEngine`,t.pdfEngine||`wkhtmltopdf`),t.highlightStyle&&a.append(`highlightStyle`,t.highlightStyle),t.wrap&&a.append(`wrap`,t.wrap),t.metadataYaml&&a.append(`metadataYaml`,t.metadataYaml),n?.referenceDocx&&a.append(`referenceDocx`,n.referenceDocx),n?.bibliography&&a.append(`bibliography`,n.bibliography),n?.csl&&a.append(`csl`,n.csl);let o={};n?.apiKey&&(o[`X-API-Key`]=n.apiKey);try{let e=await y(`${r}/v1/convert`,{method:`POST`,body:a,headers:o},9e4);if(!e.ok)throw Error(await b(e));return{jobId:(await e.json()).id}}catch(e){throw Error(v(e))}}async function w(e,t){let n=_();if(!n)throw Error(`转换服务地址为空`);let r=new FormData;for(let t of e){let e=t.name.includes(`.`)?t.name:`${t.name||`main`}.tex`;r.append(`files`,t,e)}r.append(`engine`,t.engine||`wkhtmltopdf`),t.mainFile&&r.append(`mainFile`,t.mainFile);let i={};t.apiKey&&(i[`X-API-Key`]=t.apiKey);try{let e=await y(`${n}/v1/latex/compile`,{method:`POST`,body:r,headers:i},9e4);if(!e.ok)throw Error(await b(e));return{jobId:(await e.json()).id}}catch(e){throw Error(v(e))}}async function T(e,t){let n=_();if(!n)throw Error(`转换服务地址为空`);let r={};t&&(r[`X-API-Key`]=t);try{let t=await y(`${n}/v1/jobs/${encodeURIComponent(e)}`,{headers:r,cache:`no-store`},45e3);if(!t.ok)throw Error(await b(t));return await t.json()}catch(e){throw Error(v(e))}}async function E(e,t){let n=_();if(!n)throw Error(`转换服务地址为空`);let r={};t&&(r[`X-API-Key`]=t);try{let t=await y(`${n}/v1/jobs/${encodeURIComponent(e)}/download`,{headers:r},9e4);if(!t.ok)throw Error(await b(t));return t.blob()}catch(e){throw Error(v(e))}}async function D(e,t){let n=_();if(!n)return;let r={};t&&(r[`X-API-Key`]=t);try{await y(`${n}/v1/jobs/${encodeURIComponent(e)}`,{method:`DELETE`,headers:r},3e4)}catch{}}var O=[{from:`markdown`,to:`docx`,needsService:!0},{from:`markdown`,to:`html`,needsService:!1},{from:`markdown`,to:`latex`,needsService:!1},{from:`markdown`,to:`pdf`,needsService:!0},{from:`docx`,to:`markdown`,needsService:!0},{from:`docx`,to:`html`,needsService:!0},{from:`html`,to:`markdown`,needsService:!1},{from:`html`,to:`docx`,needsService:!0},{from:`latex`,to:`markdown`,needsService:!0},{from:`latex`,to:`docx`,needsService:!0},{from:`latex`,to:`pdf`,needsService:!0}];export{_ as a,w as c,f as d,p as f,E as i,S as l,a as m,x as n,T as o,d as p,D as r,C as s,O as t,h as u};