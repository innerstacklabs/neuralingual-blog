import { Container } from './container';

const FOOTER_LINKS = [
	{ label: 'App Store', href: 'https://apps.apple.com/app/id6758531476' },
	{ label: 'Newsletter', href: 'https://buttondown.com/daveremy' },
	{ label: 'Privacy', href: 'https://neuralingual.com/privacy' },
	{ label: 'Terms', href: 'https://neuralingual.com/terms' },
	{ label: 'Support', href: 'https://neuralingual.com/support' },
];

export const Footer = () => {
	return (
		<footer className="border-t border-brand-dark/50 bg-brand-dark py-12">
			<Container className="px-5">
				<div className="flex flex-col items-center gap-6 text-center">
					{/* Logo + wordmark */}
					<div className="flex items-center gap-2">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<g transform="rotate(10, 12, 12)">
								<path
									d="M5 24 L5 9 L9 9 L15 17 L15 4 L17 0 L19 4 L19 21 L15 21 L9 13 L9 24 Z"
									fill="#fbbf24"
								/>
							</g>
						</svg>
						<span className="text-lg font-bold tracking-tight">
							<span className="text-brand-amber">Neura</span>
							<span className="text-white">lingual</span>
						</span>
					</div>

					<p className="text-sm text-slate-400">
						Built by Dave Remy at Inner Stack Labs
					</p>

					{/* Links */}
					<nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
						{FOOTER_LINKS.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-slate-400 transition-colors hover:text-brand-amber"
							>
								{link.label}
							</a>
						))}
					</nav>

					<p className="text-xs text-slate-500">
						&copy; {new Date().getFullYear()} Inner Stack Labs
					</p>
				</div>
			</Container>
		</footer>
	);
};
