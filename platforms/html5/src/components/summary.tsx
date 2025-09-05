import messages from '../messages';
import data, { DailyGameStreak, GamePromoLink } from '../data';
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
import shareIcon from '../assets/share-icon.svg';
import replayIcon from '../assets/replay-icon.svg';
import { loaderAPI } from '../components/loader';



// #region Share Stats Component

interface ShareStatsProps {
  shareString: string;
}

function ShareStatsComponent (props: ShareStatsProps) {
  const timeoutRef = useRef<number | null>(null);
  const [ copying, setCopying ] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(props.shareString);

    setCopying(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTimeout(() => {
      setCopying(false);
    }, 1500);
  };

  return (
    <button 
      className='swag-summary__btn'
      onClick={copyToClipboard}
    >
      {
        copying 
          ? <>Copied!</> 
          : <>Share<img src={shareIcon} alt='icon' aria-hidden /></>
      }
    </button>
  );
}

// #endregion



// #region Replay Component

interface ReplayProps {
  onReplay?: () => void;
}

function ReplayComponent (props: ReplayProps) {
  const { onReplay } = props;

  return (
    <button 
      className='swag-summary__btn --outline --noMarginTop'
      onClick={onReplay}
    >
      Replay<img src={replayIcon} alt='icon' aria-hidden />
    </button>
  );
}

// #endregion



// #region Summary Component

interface SummaryProps {
  titleHtml?: string;
  resultHtml: string;
  stats: { key: string, value: string }[];
  shareString: string;
  isSubscriber: boolean;
  relatedGames: { slug: string, title: string, icon: string }[];
  promoLinks: { icon_url: string, background_color: string, title: string, url: string, type: string }[];
  onReplay?: () => void;
}

function SummaryComponent (props: SummaryProps) {

  const navigateToTitle = (slug: string) => {
    messages.trySendMessage('swag.navigateToTitle', slug);
  };
  
  const navigateToArchive = () => {
    messages.trySendMessage('swag.navigateToArchive');
  };

  return (
    <div className='swag-summary'>
      <div className='swag-summary__inner'>
        <header>
          {props.titleHtml && (
            <div 
              className='swag-summary__title'
              dangerouslySetInnerHTML={{ __html: props.titleHtml }}
            />
          )}
          <div 
            className='swag-summary__preview'
            dangerouslySetInnerHTML={{ __html: props.resultHtml }} 
          />
          <ul
            className='swag-summary__stats'
          >
            {
              props.stats.map(({ key, value }, i) => {
                return (
                  <li key={i}>
                    <span><strong>{value}</strong></span>
                    <span>{key}</span>
                  </li>
                );
              })
            }
          </ul>
        </header>

        <div className='swag-summary__button-container'>
          <ShareStatsComponent shareString={props.shareString} />
          {
            props.onReplay && (
              <ReplayComponent 
                onReplay={props.onReplay} 
              />
            )
          }
        </div>
        {
          props.promoLinks.length
            ? (
              <ul className='swag-summary__promo-links'>
                {
                  props.promoLinks.map(({ icon_url, background_color, title, url, type }) => {
                    const navMethod = type === 'archive' ? navigateToArchive : navigateToTitle;
                    return (
                      <li key={title} style={{ backgroundColor: background_color }} onClick={() => navMethod(url)}>
                        <img src={icon_url} alt={title} />
                        <span>{title}</span>
                      </li>
                    );
                  })
                }
              </ul>
            ) : <></>
        }
      </div>
    </div>
  );
}

// #endregion



// #region Summary API

class SummaryAPI {
  rootElId: string = 'swag-summary-root';

  getRootEl () {
    return document.getElementById(this.rootElId)!;
  }

  async showSummary (
    stats: { key: string, value: string }[], 
    resultHtml: string,
    shareString: string,
    titleHtml?: string,
    onReplay?: () => void,
    onClose?: () => void
  ) {
    loaderAPI.showLoader(350);

    const promises = [];

    // let isSubscriber = false;
    
    promises.push((async () => {
      try {
        return await data.isSubscriber();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error checking subscription status:', e);
      }
    })());

    promises.push((async () => {
      let gameStreak: DailyGameStreak = { streak: 0, maxStreak: 0 };
      try {
        gameStreak = await data.getDailyGameStreak();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error fetching game streak:', e);
      }
      return gameStreak;
    })());

    // let promoLinks: GamePromoLink[] = [];
    promises.push((async () => {
      try {
        return await data.getGamePromoLinks();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error fetching promo links:', e);
      }
    })());

    const [ 
      isSubscriber, 
      gameStreak, 
      promoLinks 
    ] = await Promise.all(promises) as [
      boolean, 
      DailyGameStreak, 
      GamePromoLink[]
    ];

    stats.unshift(
      {
        key: 'Current Streak',
        value: gameStreak.streak?.toString()
      },
      {
        key: 'Max Streak',
        value: gameStreak.maxStreak?.toString()
      }
    );

    const showSummary = () => {
      loaderAPI.hideLoader();

      render(<SummaryComponent 
        stats={stats} 
        titleHtml={titleHtml}
        resultHtml={resultHtml}
        relatedGames={[]}
        promoLinks={promoLinks}
        shareString={shareString}
        isSubscriber={isSubscriber}
        onReplay={unmount}
      />, this.getRootEl());
    };

    const unmount = () => {
      loaderAPI.hideLoader();
      
      this.unmount();
      if (onReplay) onReplay();
      if (onClose) onClose();
    };

    return new Promise<void>((resolve) => {
      document.body.classList.add('swag-summary-open');
      showSummary();
      resolve();
    });
  }

  protected unmount () {
    document.body.classList.remove('swag-summary-open');
    render(null, this.getRootEl());
    return Promise.resolve();
  }
}

// #endregion



// #region Export

const summary = new SummaryAPI();
export default summary;

// #endregion
