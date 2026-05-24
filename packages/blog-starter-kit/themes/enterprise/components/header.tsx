import { useState } from 'react';
import { Container } from './container';

const NAV_LINKS = [
	{ label: 'App Store', href: 'https://apps.apple.com/app/id6758531476' },
	{ label: 'Newsletter', href: 'https://buttondown.com/daveremy' },
];

const RisingNIcon = ({ className }: { className?: string }) => (
	<svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className}>
		<g transform="rotate(10, 12, 12)">
			<path
				d="M5 24 L5 9 L9 9 L15 17 L15 4 L17 0 L19 4 L19 21 L15 21 L9 13 L9 24 Z"
				fill="#fbbf24"
			/>
		</g>
	</svg>
);

export const Header = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="border-b border-brand-dark/50 bg-brand-dark py-5">
			<Container className="px-5">
				<div className="flex items-center justify-between">
					{/* Logo + Wordmark */}
					<div className="flex items-center gap-3">
						<a
							href="https://neuralingual.com"
							className="flex items-center gap-2"
							aria-label="Neuralingual home"
						>
							<RisingNIcon />
							<span className="text-lg font-bold tracking-tight">
								<span className="text-brand-amber">Neura</span>
								<span className="text-white">lingual</span>
							</span>
						</a>
						<span className="text-sm text-slate-400">Blog</span>
					</div>

					{/* Desktop nav */}
					<nav className="hidden items-center gap-6 md:flex">
						{NAV_LINKS.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-slate-300 transition-colors hover:text-brand-amber"
							>
								{link.label}
							</a>
						))}
					</nav>

					{/* Mobile hamburger */}
					<button
						className="flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							{mobileMenuOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
							)}
						</svg>
					</button>
				</div>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<nav className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:hidden">
						{NAV_LINKS.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-slate-300 transition-colors hover:text-brand-amber"
							>
								{link.label}
							</a>
						))}
					</nav>
				)}
			</Container>
		</header>
	);
};
