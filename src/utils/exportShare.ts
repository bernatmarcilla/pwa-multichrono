import { Chronometer } from '../types';
import { formatTime } from './time';

function buildTextReport(
  chronos: Chronometer[],
  getDisplayElapsed: (c: Chronometer) => number,
): string {
  const lines: string[] = ['MultiChrono Export', '==================', ''];

  for (const chrono of chronos) {
    const elapsed = getDisplayElapsed(chrono);
    lines.push(`${chrono.name}  —  ${formatTime(elapsed)}`);

    if (chrono.laps.length > 0) {
      lines.push('  Lap     Time       Δ          Total');
      lines.push('  ------  ---------  ---------  ---------');
      for (const lap of [...chrono.laps].reverse()) {
        const lapStr = formatTime(lap.lapTime).padEnd(9);
        const deltaStr = lap.number === 1 ? '—'.padEnd(9) : formatTime(Math.abs(lap.delta)).padEnd(9);
        const accStr = formatTime(lap.accumulated);
        lines.push(`  #${String(lap.number).padEnd(5)}  ${lapStr}  ${deltaStr}  ${accStr}`);
      }
    }
    lines.push('');
  }
  return lines.join('\n');
}

export async function exportAndShare(
  chronos: Chronometer[],
  getDisplayElapsed: (c: Chronometer) => number,
): Promise<void> {
  const text = buildTextReport(chronos, getDisplayElapsed);

  // if (navigator.share) {
  //   await navigator.share({ title: 'MultiChrono Export', text });
  //   return;
  // }

  // Fallback: copy to clipboard
 const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MultiChrono Export</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1c1c1e; }
            h1 { font-size: 24px; margin-bottom: 20px; color: #007AFF; border-bottom: 2px solid #F2F2F7; padding-bottom: 10px; }
            pre { font-family: ui-monospace, SFMono-Regular, SF Pro Text, monospace; font-size: 14px; line-height: 1.6; white-space: pre-wrap; background: #F2F2F7; padding: 20px; border-radius: 8px; }
            @media print {
              body { padding: 0; }
              pre { background: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>MultiChrono Report</h1>
          <pre>${text}</pre>
          <script>
            // Automatically trigger the system print/PDF dialog, then close the tab
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    return;
  }

  // Last resort: open in new window so user can print/save
  const w = window.open('', '_blank');
  if (w) {
    w.document.write(`<pre style="font-family:monospace;padding:20px">${text}</pre>`);
    w.document.close();
    w.print();
  }
}