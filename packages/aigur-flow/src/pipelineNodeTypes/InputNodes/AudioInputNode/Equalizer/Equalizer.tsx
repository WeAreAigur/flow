import './Equalizer.css';

export interface EqualizerProps {}

export function Equalizer(props: EqualizerProps) {
	return (
		<div className={'equalizer-container'}>
			<ol className={'equalizer-column'}>
				<li className={'colour-bar'}></li>
			</ol>
			<ol className={'equalizer-column'}>
				<li className={'colour-bar'}></li>
			</ol>
			<ol className={'equalizer-column'}>
				<li className={'colour-bar'}></li>
			</ol>
			<ol className={'equalizer-column'}>
				<li className={'colour-bar'}></li>
			</ol>
			<ol className={'equalizer-column'}>
				<li className={'colour-bar'}></li>
			</ol>
		</div>
	);
}
