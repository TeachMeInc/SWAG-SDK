import Icon from '@/components/ui/Icon';

interface Props {
  options: { key: string; label: string }[];
}

export default function Select (props: Props) {
  return (
    <div className='swag-gameThemed-input swag-gameThemed-select'>
      <select>
        {props.options.map(option => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon icon='back' />
    </div>
  );
}
