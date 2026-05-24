import Link from 'next/link';

export const PublicationLogo = ({ isSidebar }: { isSidebar?: boolean }) => {
	return (
		<h1 className="relative w-full">
			<Link
				href={'/'}
				aria-label="Neuralingual blog home page"
				className="flex flex-row items-center justify-center gap-2"
			>
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
					<span className={isSidebar ? 'text-black dark:text-white' : 'text-white'}>lingual</span>
				</span>
			</Link>
		</h1>
	);
};
