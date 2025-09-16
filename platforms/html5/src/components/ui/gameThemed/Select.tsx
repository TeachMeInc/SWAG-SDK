import Icon from '@/components/ui/Icon';

interface Props {

}

export default function Select (props: Props) {
  return (
    <div className='swag-gameThemed-input swag-gameThemed-select'>
      <select>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </select>
      <Icon icon='back' />
    </div>
  );
}
