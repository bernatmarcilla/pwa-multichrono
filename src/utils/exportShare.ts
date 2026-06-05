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

  if (navigator.share) {
    await navigator.share({ title: 'MultiChrono Export', text });
    return;
  }

  // Fallback: copy to clipboard
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
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