import parse from 'html-react-parser';
import Head from 'next/head';
import { useAppContext } from './contexts/appContext';

export const Meta = () => {
	const { publication } = useAppContext();
	const { metaTags } = publication;

	return (
		<Head>
			<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
			<link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
			<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#1a1a2e" />
			<meta name="msapplication-TileColor" content="#1a1a2e" />
			<meta name="theme-color" content="#1a1a2e" />
			<meta name="msapplication-config" content="/favicon/browserconfig.xml" />
			<link rel="alternate" type="application/rss+xml" href="/feed.xml" />
			{metaTags && parse(metaTags)}
		</Head>
	);
};
