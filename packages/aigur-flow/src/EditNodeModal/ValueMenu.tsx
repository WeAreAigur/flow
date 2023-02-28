import './ValueMenu.css';

import { Cascader } from 'antd';

export interface Option {
	value: string;
	label: string;
	children?: Option[];
}

export interface ValueMenuProps {
	options: Option[];
	onChange: (value: string[]) => void;
}

export function ValueMenu(props: ValueMenuProps) {
	return (
		<Cascader
			className="w-8 aigur-flow-value-menu-root"
			popupClassName="w-96"
			options={props.options}
			expandTrigger="hover"
			displayRender={() => ''}
			onChange={props.onChange}
			showArrow={false}
			showSearch={false}
			allowClear={false}
		/>
	);
}
