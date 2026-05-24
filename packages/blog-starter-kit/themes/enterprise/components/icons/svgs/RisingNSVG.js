import React from 'react';

export default class RisingNSVG extends React.Component {
	render() {
		return (
			<svg
				width={this.props.width || '28'}
				height={this.props.height || '28'}
				viewBox="0 0 24 24"
				fill="none"
				className={this.props.className}
			>
				<g transform="rotate(10, 12, 12)">
					<path
						d="M5 24 L5 9 L9 9 L15 17 L15 4 L17 0 L19 4 L19 21 L15 21 L9 13 L9 24 Z"
						fill="#fbbf24"
					/>
				</g>
			</svg>
		);
	}
}
