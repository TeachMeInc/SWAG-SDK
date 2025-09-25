import Icon from '@/components/ui/Icon';

interface Props {
  value?: string;
  options: { key: string; label: string }[];
  onChange?: (value: string) => void;
}

export default function Select (props: Props) {
  const onChange = (evt: any) => {
    props.onChange?.(evt.target.value);
  };

  return (
    <div className='swag-gameThemed-input swag-gameThemed-select'>
      <select value={props.value} onChange={onChange}>
        {props.options.map(option => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon icon='chevron-down' iconStyle='line' />
    </div>
  );
}
