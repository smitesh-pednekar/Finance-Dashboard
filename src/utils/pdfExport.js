import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmt = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

function getMonthLabel(key) {
  const [y, m] = key.split('-');
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

export function generatePDF(transactions, budgets = {}) {
  const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // ─── Header Band ─────────────────────────────────────────────────────────
  doc.setFillColor(0, 51, 204);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('FinTrack', 14, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Financial Report', 14, 22);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    pageW - 14, 22, { align: 'right' }
  );
  doc.setTextColor(0, 0, 0);

  // ─── Summary ─────────────────────────────────────────────────────────────
  const income   = transactions.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance  = income - expenses;
  const savings  = income > 0 ? (balance / income) * 100 : 0;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FINANCIAL SUMMARY', 14, 42);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(14, 45, pageW - 14, 45);

  autoTable(doc, {
    startY: 48,
    head: [],
    body: [
      ['Total Balance',  fmt(balance),  'Total Income',  fmt(income)],
      ['Total Expenses', fmt(expenses), 'Savings Rate',  `${savings.toFixed(1)}%`],
    ],
    styles: { fontSize: 10, cellPadding: 3.5 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [82, 82, 82], cellWidth: 40 },
      1: { fontStyle: 'bold', textColor: [0, 51, 204], cellWidth: 50 },
      2: { fontStyle: 'bold', textColor: [82, 82, 82], cellWidth: 40 },
      3: { fontStyle: 'bold', textColor: [0, 51, 204], cellWidth: 50 },
    },
    theme: 'plain',
  });

  // ─── Monthly Breakdown ───────────────────────────────────────────────────
  const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort();
  const monthlyRows = months.map(m => {
    const txns = transactions.filter(t => t.date.startsWith(m));
    const inc  = txns.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0);
    const exp  = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const net  = inc - exp;
    return [getMonthLabel(m), fmt(inc), fmt(exp), { content: fmt(net), styles: { textColor: net >= 0 ? [0, 128, 96] : [216, 44, 13] } }];
  });

  const y1 = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('MONTHLY BREAKDOWN', 14, y1);
  doc.line(14, y1 + 3, pageW - 14, y1 + 3);

  autoTable(doc, {
    startY: y1 + 6,
    head: [['Month', 'Income', 'Expenses', 'Net']],
    body: monthlyRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [10, 10, 10], textColor: [247, 247, 245], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 249, 249] },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' } },
  });

  // ─── Top Categories ──────────────────────────────────────────────────────
  const catMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const catRows = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([cat, val]) => [cat, fmtInt(val), `${((val / expenses) * 100).toFixed(1)}%`]);

  const y2 = doc.lastAutoTable.finalY + 10;
  if (y2 > 230) doc.addPage();
  const catY = y2 > 230 ? 20 : y2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOP SPENDING CATEGORIES', 14, catY);
  doc.line(14, catY + 3, pageW - 14, catY + 3);

  autoTable(doc, {
    startY: catY + 6,
    head: [['Category', 'Amount', '% of Expenses']],
    body: catRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [10, 10, 10], textColor: [247, 247, 245], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 249, 249] },
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
  });

  // ─── Budget Status (if budgets configured) ───────────────────────────────
  const budgetEntries = Object.entries(budgets);
  if (budgetEntries.length > 0) {
    const lastMonth = months[months.length - 1];
    const budgetRows = budgetEntries.map(([cat, monthlyBudget]) => {
      const budget = monthlyBudget * months.length;
      const spent  = (catMap[cat] || 0);
      const pct    = budget > 0 ? ((spent / budget) * 100).toFixed(1) : '0.0';
      const status = parseFloat(pct) >= 100 ? 'OVER' : parseFloat(pct) >= 80 ? 'WARNING' : 'OK';
      return [cat, fmtInt(monthlyBudget), fmtInt(budget), fmtInt(spent), `${pct}%`,
        { content: status, styles: { textColor: status === 'OVER' ? [216,44,13] : status === 'WARNING' ? [245,158,11] : [0,128,96], fontStyle: 'bold' } }
      ];
    });

    const y3 = doc.lastAutoTable.finalY + 10;
    if (y3 > 230) doc.addPage();
    const budY = y3 > 230 ? 20 : y3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('BUDGET STATUS', 14, budY);
    doc.line(14, budY + 3, pageW - 14, budY + 3);

    autoTable(doc, {
      startY: budY + 6,
      head: [['Category', 'Monthly Budget', `Total (${months.length}mo)`, 'Spent', 'Used %', 'Status']],
      body: budgetRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [10, 10, 10], textColor: [247, 247, 245], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      columnStyles: { 1:{halign:'right'}, 2:{halign:'right'}, 3:{halign:'right'}, 4:{halign:'right'}, 5:{halign:'center'} },
    });
  }

  // ─── Recent Transactions ─────────────────────────────────────────────────
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 25);
  const txRows = recent.map(t => [
    t.date, t.description, t.category,
    { content: t.type === 'income' ? 'Income' : 'Expense',
      styles: { textColor: t.type === 'income' ? [0, 128, 96] : [216, 44, 13] } },
    { content: (t.type === 'income' ? '+' : '-') + fmt(t.amount),
      styles: { halign: 'right', textColor: t.type === 'income' ? [0, 128, 96] : [216, 44, 13] } },
  ]);

  const y4 = doc.lastAutoTable.finalY + 10;
  if (y4 > 220) doc.addPage();
  const txY = y4 > 220 ? 20 : y4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RECENT TRANSACTIONS (LAST 25)', 14, txY);
  doc.line(14, txY + 3, pageW - 14, txY + 3);

  autoTable(doc, {
    startY: txY + 6,
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: txRows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [10, 10, 10], textColor: [247, 247, 245], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 249, 249] },
  });

  // ─── Page Footers ─────────────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(163, 163, 163);
    doc.text(
      `Page ${i} of ${pages}  •  FinTrack Financial Report  •  Confidential`,
      pageW / 2, 290, { align: 'center' }
    );
  }

  doc.save(`fintrack-report-${new Date().toISOString().split('T')[0]}.pdf`);
}
