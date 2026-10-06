// Simple square-capped line icons, one per service.
const paths: Record<string, string> = {
  'commercial-demolition': 'M4 21V5h9v16M13 9h7v12M7 9h3M7 13h3M7 17h3M16 13h1M16 17h1M2 21h20',
  'residential-demolition': 'M3 11l9-7 9 7M5 9.5V21h14V9.5M10 21v-6h4v6',
  'industrial-dismantling': 'M3 21V10l5 3V10l5 3V6l4-3v18M3 21h18M17 8h3v13',
  'concrete-recycling': 'M7 7l3-4 3 4M10 3v8M17 9l3 4h-5M20 13l-4 7M7 20H3l2-4M3 16l3-1M14 20H9',
  'containers-and-hauling': 'M2 7h11v9H2zM13 10h5l3 3v3h-8M6 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01',
  'site-clearing': 'M3 19h18M5 19l3-7h8l3 7M9 12V7h6v5M12 7V3',
  'interior-gut-outs': 'M4 3h16v18H4zM4 9h16M10 9v12M14 13v4',
  'tanks-and-pools': 'M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 8c2 2 4-2 8 0s6-2 8 0M9 4h6',
  'tree-removal': 'M12 21v-6M7 15h10L12 3zM4 21h16',
};

export function ServiceIcon({ id, className = 'h-6 w-6' }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
      <path d={paths[id] ?? paths['site-clearing']} />
    </svg>
  );
}
