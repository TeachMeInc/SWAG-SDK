import LottieComponent from '@/components/ui/Lottie';
import loaderLight from '@/assets/lottie/loader-light.json';
import loaderDark from '@/assets/lottie/loader-dark.json';
import utils from '@/utils';

export default function Loader () {
  const theme = utils.getPlatformTheme();
  
  return (
    <div className='swag-loader'>
      <div className='swag-loader__inner'>
        <LottieComponent
          loop
          width={68}
          height={89}
          animationData={theme === 'light' ? loaderLight : loaderDark}
        />
      </div>
    </div>
  );
}
