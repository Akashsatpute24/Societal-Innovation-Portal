import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#10231c', moss: '#165c45', lime: '#d8f77c', mist: '#eff5ef' } } }, plugins: [] } satisfies Config;
