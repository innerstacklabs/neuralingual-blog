import Link from 'next/link';
import { RisingNSVG } from './icons';

export const PublicationLogo = ({ isSidebar }: { isSidebar?: boolean }) => {
	return (
		<h1 className="relative w-full">
			<Link
				href={'/'}
				aria-label="Neuralingual blog home page"
				className="flex flex-row items-center justify-center gap-2"
			>
				<RisingNSVG width="24" height="24" />
				<span className="text-lg font-bold tracking-tight">
					<span className="text-brand-amber">Neura</span>
					<span className={isSidebar ? 'text-black dark:text-white' : 'text-white'}>lingual</span>
				</span>
			</Link>
		</h1>
	);
};
