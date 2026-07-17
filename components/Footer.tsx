'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full py-6 text-center text-[10px] text-neutral-400 dark:text-zinc-550 space-y-1 select-none">
      <p>
        💡 <span className="font-semibold text-neutral-500 dark:text-zinc-450">Keyboard Shortcuts:</span> Use{' '}
        <span className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-zinc-800">←</span>{' '}
        <span className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-zinc-800">→</span>{' '}
        <span className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-zinc-800">↑</span>{' '}
        <span className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-zinc-800">↓</span> to navigate the grid.
      </p>
      <p>
        Press <span className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-zinc-800">Space</span> or{' '}
        <span className="rounded bg-neutral-100 px-1 py-0.5 font-mono dark:bg-zinc-800">Enter</span> to place your mark.
      </p>
      <p className="pt-2 font-mono">
        Built with Next.js • React 19 • Tailwind CSS v4 • Web Audio Synth
      </p>
    </footer>
  );
};

export default Footer;
