import { NewsletterPlusSVG } from './icons';

export const Subscribe = () => {
	return (
		<div className="fixed z-50 bottom-10 right-10">
			<a
				href="https://buttondown.com/daveremy"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-colors hover:bg-amber-50 hover:border-amber-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800"
			>
				<NewsletterPlusSVG className="w-5 h-5 fill-current" />
				Subscribe
			</a>
		</div>
	);
};
