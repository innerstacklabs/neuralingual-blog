import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FrameworkSource {
	name: string;
	work: string;
	contribution: string;
}

interface FrameworkPrinciple {
	name: string;
	description: string;
}

interface FrameworkGrouping {
	name: string;
	purpose: string;
}

interface Framework {
	methodology?: string;
	principles?: FrameworkPrinciple[];
	sources?: FrameworkSource[];
	groupings?: FrameworkGrouping[];
	takeaway?: string;
	terminology?: Array<{ term: string; definition: string }>;
	practical_application?: string;
	schemaVersion?: number;
}

interface SharedSession {
	title: string;
	emoji: string | null;
	affirmations: string[];
	voiceDisplayName: string | null;
	framework?: Framework | null;
}

type FetchState =
	| { status: 'loading' }
	| { status: 'error' }
	| { status: 'success'; data: SharedSession };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NL_API_BASE =
	typeof window !== 'undefined' && (window as any).__NL_API_URL
		? (window as any).__NL_API_URL
		: process.env.NEXT_PUBLIC_NL_API_URL || 'https://api-production-9401.up.railway.app';

const NL_SHARE_PAGE_BASE = 'https://neuralingual.com/shared';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isArrayOf<T>(val: unknown, check: (item: unknown) => item is T): val is T[] {
	return Array.isArray(val) && val.every(check);
}

function isFrameworkSource(item: unknown): item is FrameworkSource {
	if (!item || typeof item !== 'object') return false;
	const obj = item as Record<string, unknown>;
	return typeof obj.name === 'string' && typeof obj.work === 'string' && typeof obj.contribution === 'string';
}

function isFrameworkPrinciple(item: unknown): item is FrameworkPrinciple {
	if (!item || typeof item !== 'object') return false;
	const obj = item as Record<string, unknown>;
	return typeof obj.name === 'string' && typeof obj.description === 'string';
}

function parseFramework(raw: unknown): Framework | null {
	if (!raw || typeof raw !== 'object') return null;
	const obj = raw as Record<string, unknown>;

	const framework: Framework = {};

	if (typeof obj.methodology === 'string') framework.methodology = obj.methodology;
	if (typeof obj.takeaway === 'string') framework.takeaway = obj.takeaway;
	if (typeof obj.practical_application === 'string') framework.practical_application = obj.practical_application;
	if (typeof obj.schemaVersion === 'number') framework.schemaVersion = obj.schemaVersion;

	if (isArrayOf(obj.principles, isFrameworkPrinciple)) framework.principles = obj.principles;
	if (isArrayOf(obj.sources, isFrameworkSource)) framework.sources = obj.sources;

	if (Array.isArray(obj.groupings)) {
		framework.groupings = obj.groupings.filter(
			(g): g is FrameworkGrouping =>
				g && typeof g === 'object' && typeof g.name === 'string' && typeof g.purpose === 'string',
		);
	}

	if (Array.isArray(obj.terminology)) {
		framework.terminology = obj.terminology.filter(
			(t): t is { term: string; definition: string } =>
				t && typeof t === 'object' && typeof t.term === 'string' && typeof t.definition === 'string',
		);
	}

	return framework;
}

function parseSession(raw: unknown): SharedSession | null {
	if (!raw || typeof raw !== 'object') return null;
	const obj = raw as Record<string, unknown>;

	if (typeof obj.title !== 'string') return null;
	if (!Array.isArray(obj.affirmations)) return null;

	return {
		title: obj.title,
		emoji: typeof obj.emoji === 'string' ? obj.emoji : null,
		affirmations: obj.affirmations.filter((a): a is string => typeof a === 'string'),
		voiceDisplayName: typeof obj.voiceDisplayName === 'string' ? obj.voiceDisplayName : null,
		framework: parseFramework(obj.framework),
	};
}

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

type FeaturedSetProps = {
	shareId: string;
	className?: string;
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
	return (
		<div className="animate-pulse rounded-lg border border-slate-200 p-6 dark:border-neutral-700" style={{ minHeight: '280px' }}>
			<div className="mb-3 h-6 w-2/3 rounded bg-slate-200 dark:bg-neutral-700" />
			<div className="mb-6 h-4 w-1/3 rounded bg-slate-100 dark:bg-neutral-800" />
			<div className="mb-3 h-4 w-full rounded bg-slate-100 dark:bg-neutral-800" />
			<div className="mb-3 h-4 w-full rounded bg-slate-100 dark:bg-neutral-800" />
			<div className="mb-3 h-4 w-5/6 rounded bg-slate-100 dark:bg-neutral-800" />
			<div className="mt-6 mb-3 h-5 w-1/4 rounded bg-slate-200 dark:bg-neutral-700" />
			<div className="mb-2 h-4 w-full rounded bg-slate-100 dark:bg-neutral-800" />
			<div className="mb-2 h-4 w-full rounded bg-slate-100 dark:bg-neutral-800" />
		</div>
	);
}

function ErrorFallback({ shareId }: { shareId: string }) {
	const shareUrl = `${NL_SHARE_PAGE_BASE}/${encodeURIComponent(shareId)}`;
	return (
		<div className="rounded-lg border border-slate-200 p-6 text-center dark:border-neutral-700">
			<p className="mb-2 text-sm text-slate-500 dark:text-neutral-400">
				Unable to load playlist details.
			</p>
			<a
				href={shareUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary-600 dark:text-primary-500 text-sm font-medium hover:underline"
			>
				View on Neuralingual &rarr;
			</a>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function FeaturedSet({ shareId, className }: FeaturedSetProps) {
	const [state, setState] = useState<FetchState>({ status: 'loading' });
	const abortRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (!shareId) {
			setState({ status: 'error' });
			return;
		}

		const controller = new AbortController();
		abortRef.current = controller;

		const fetchData = async () => {
			const url = `${NL_API_BASE}/shared/${encodeURIComponent(shareId)}`;

			try {
				const res = await fetch(url, { signal: controller.signal });

				if (controller.signal.aborted) return;

				if (!res.ok) {
					setState({ status: 'error' });
					return;
				}

				const raw: unknown = await res.json();

				if (controller.signal.aborted) return;

				const session = parseSession(raw);
				if (!session) {
					setState({ status: 'error' });
					return;
				}

				setState({ status: 'success', data: session });
			} catch (err) {
				if (controller.signal.aborted) return;
				setState({ status: 'error' });
			}
		};

		fetchData();

		return () => {
			controller.abort();
		};
	}, [shareId]);

	if (state.status === 'loading') {
		return (
			<div className={className}>
				<LoadingSkeleton />
			</div>
		);
	}

	if (state.status === 'error') {
		return (
			<div className={className}>
				<ErrorFallback shareId={shareId} />
			</div>
		);
	}

	const { data } = state;
	const { framework } = data;
	const shareUrl = `${NL_SHARE_PAGE_BASE}/${encodeURIComponent(shareId)}`;
	const hasFramework = framework && (framework.methodology || framework.principles?.length || framework.sources?.length);

	return (
		<div className={`rounded-lg border border-slate-200 shadow-sm dark:border-neutral-700 ${className || ''}`}>
			{/* Header */}
			<div className="border-b border-slate-100 px-6 py-4 dark:border-neutral-800">
				<h3 className="text-lg font-bold text-slate-800 dark:text-neutral-50">
					{data.emoji && <span className="mr-2">{data.emoji}</span>}
					{data.title}
				</h3>
				<p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
					{data.affirmations.length} affirmation{data.affirmations.length !== 1 ? 's' : ''}
					{data.voiceDisplayName && <span> &middot; {data.voiceDisplayName}</span>}
				</p>
			</div>

			{/* Body */}
			<div className="px-6 py-5">
				{hasFramework ? (
					<FrameworkContent framework={framework} />
				) : (
					<p className="text-sm text-slate-600 dark:text-neutral-300">
						A curated affirmation set designed for focused listening.
					</p>
				)}
			</div>

			{/* Footer CTA */}
			<div className="border-t border-slate-100 px-6 py-4 dark:border-neutral-800">
				<a
					href={shareUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-primary-600 dark:text-primary-500 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
				>
					Listen on Neuralingual
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</a>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Framework Content
// ---------------------------------------------------------------------------

function FrameworkContent({ framework }: { framework: Framework }) {
	return (
		<div className="space-y-5">
			{/* Methodology */}
			{framework.methodology && (
				<div>
					<h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
						Methodology
					</h4>
					<p className="text-sm leading-relaxed text-slate-700 dark:text-neutral-200">
						{framework.methodology}
					</p>
				</div>
			)}

			{/* Principles */}
			{framework.principles && framework.principles.length > 0 && (
				<div>
					<h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
						Key Principles
					</h4>
					<ul className="space-y-2">
						{framework.principles.map((p, i) => (
							<li key={i} className="text-sm text-slate-700 dark:text-neutral-200">
								<span className="font-medium text-slate-800 dark:text-neutral-100">{p.name}</span>
								{' — '}
								{p.description}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Sources */}
			{framework.sources && framework.sources.length > 0 && (
				<div>
					<h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
						Sources
					</h4>
					<ul className="space-y-2">
						{framework.sources.map((s, i) => (
							<li key={i} className="text-sm text-slate-700 dark:text-neutral-200">
								<span className="font-medium text-slate-800 dark:text-neutral-100">
									{s.name}
								</span>
								{s.work && (
									<span className="italic text-slate-500 dark:text-neutral-400">
										{', '}
										{s.work}
									</span>
								)}
								{s.contribution && (
									<span className="text-slate-600 dark:text-neutral-300">
										{' — '}
										{s.contribution}
									</span>
								)}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Groupings */}
			{framework.groupings && framework.groupings.length > 0 && (
				<div>
					<h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
						Thematic Groupings
					</h4>
					<ul className="space-y-1">
						{framework.groupings.map((g, i) => (
							<li key={i} className="text-sm text-slate-700 dark:text-neutral-200">
								<span className="font-medium text-slate-800 dark:text-neutral-100">{g.name}</span>
								{' — '}
								{g.purpose}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Takeaway */}
			{framework.takeaway && (
				<blockquote className="border-l-4 border-primary-400 pl-4 italic text-slate-600 dark:border-primary-600 dark:text-neutral-300">
					&ldquo;{framework.takeaway}&rdquo;
				</blockquote>
			)}

			{/* Practical Application */}
			{framework.practical_application && (
				<div>
					<h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
						Practical Application
					</h4>
					<p className="text-sm leading-relaxed text-slate-700 dark:text-neutral-200">
						{framework.practical_application}
					</p>
				</div>
			)}
		</div>
	);
}

export default FeaturedSet;
