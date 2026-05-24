/**
 * Hydration hook for rendering <FeaturedSet> into DOM elements placed
 * via Hashnode's raw HTML block feature.
 *
 * Usage in blog posts (via Hashnode raw HTML block):
 *   <div data-nl-featured-set="-F2H7LxRLjWD2uses-1vBw"></div>
 *
 * Usage in page components:
 *   import { useFeaturedSetEmbed } from '../components/featured-set-embed';
 *   useFeaturedSetEmbed(post.id);
 */
import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FeaturedSet } from './featured-set';

const SELECTOR = '[data-nl-featured-set]';

/**
 * Finds all `data-nl-featured-set` elements in the document and renders
 * a FeaturedSet component into each one.
 *
 * @param contentKey - A value that changes when the page content changes
 *   (e.g., post ID or slug). Triggers re-scan on client-side navigation.
 */
export function useFeaturedSetEmbed(contentKey?: string) {
	const rootsRef = useRef<Map<Element, Root>>(new Map());

	useEffect(() => {
		const containers = document.querySelectorAll(SELECTOR);
		if (containers.length === 0) return;

		const currentRoots = rootsRef.current;

		containers.forEach((container) => {
			// Skip if already hydrated in this render cycle
			if (currentRoots.has(container)) return;

			const shareId = container.getAttribute('data-nl-featured-set');
			if (!shareId) return;

			const root = createRoot(container);
			root.render(<FeaturedSet shareId={shareId} className="my-6" />);
			currentRoots.set(container, root);
		});

		return () => {
			// Unmount all roots on cleanup (route change or effect re-run)
			currentRoots.forEach((root) => {
				root.unmount();
			});
			currentRoots.clear();
		};
	}, [contentKey]);
}

export default useFeaturedSetEmbed;
