import utils from '@/utils';
import swLoaderLight from '@/assets/sw-loader-light.svg';
import swLoaderDark from '@/assets/sw-loader-dark.svg';
import { useRef, useState } from 'preact/hooks';

export default function Loader () {
  const theme = utils.getPlatformTheme();
  const loaderRef = useRef<HTMLDivElement>(null);
  const [ isLoaded, setIsLoaded ] = useState(false);

  const onLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`swag-loader ${isLoaded ? '--swag-loader-show' : '--swag-loader-hide'}`} ref={loaderRef}>
      <div className='swag-loader__inner'>
        <object 
          type='image/svg+xml' 
          data={theme === 'light' ? swLoaderLight : swLoaderDark} 
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}
