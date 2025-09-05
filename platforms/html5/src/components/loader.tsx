import { render } from 'preact';
import LottieComponent from '../components/lottie';
import loaderLight from '../assets/lottie/loader-light.json';
import loaderDark from '../assets/lottie/loader-dark.json';
import utils from '../utils';



// #region Loader Component

export default function LoaderComponent () {
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

// #endregion



// #region Loader API

class LoaderAPI {
  timeout: number | null = null;

  getRootEl () {
    const el = document.body.querySelector('.swag-loader-container');
    if (el) {
      return el;
    }
    
    const newEl = document.createElement('div');
    newEl.className = 'swag-loader-container';
    document.body.appendChild(newEl);
    return newEl;
  }

  showLoader (debounce?: number) {
    const mount = () => {
      render(<LoaderComponent />, this.getRootEl());
      document.body.classList.add('swag-loader-open');
    };

    if (debounce) {
      clearTimeout(this.timeout!);
      this.timeout = setTimeout(() => {
        mount();
      }, debounce);
    } else {
      mount();
    }
  }

  hideLoader () {
    clearTimeout(this.timeout!);
    document.body.classList.remove('swag-loader-open');
    render(null, this.getRootEl());
  }
}

// #endregion



// #region Export

export const loaderAPI = new LoaderAPI();

// #endregion
