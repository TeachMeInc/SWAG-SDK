import messages from './messages';
import data, { DailyGameStreak, GamePromoLink } from './data';
import { render } from 'preact';
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import lottieStreak from './assets/lottie/streak.json';
import lottieTime from './assets/lottie/time.json';
import arrowIcon from './assets/arrow-icon.svg';
import shareIcon from './assets/share-icon.svg';
import replayIcon from './assets/replay-icon.svg';
import favoriteIcon from './assets/favorite-icon.svg';
import utils from './utils';

// #region Shockwave Upsell

interface UpsellProps {
  isMember?: boolean;
  isSubscriber?: boolean;
}

function UpsellComponent (props: UpsellProps) {
  const { isMember, isSubscriber } = props;

  return (!isMember || !isSubscriber) ? (
    <div className='swag-summary-v2__upsell'>
      <a 
        href={`https://shockwave.com${!isSubscriber ? '/unlimited' : '/account/login'}`}
        className='swag-summary-v2__upsell-banner'
      >
        {
          (!isSubscriber && isMember) ? (
            <p>
              <strong>Shockwave is more fun with a Subscription!</strong><br/>
              No Ads, Archive Access and more
            </p>
          ) : !isMember && (
            <p>
              <strong>Shockwave is more fun with an account!</strong><br/>
              Track stats, save favorites and more
            </p>
          )
        } 
        
        <img src={arrowIcon} alt='arrow' />
      </a>
    </div>
  ) : <></>;
}

// #endregion

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
      className='swag-summary-v2__btn'
      onClick={copyToClipboard}
    >
      <img src={shareIcon} alt='icon' aria-hidden />
      {
        copying 
          ? <>Copied!</> 
          : <>Share with Friends</>
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
      className='swag-summary-v2__btn --outline --noMarginTop'
      onClick={onReplay}
    >
      <img src={replayIcon} alt='icon' aria-hidden />
      Replay
    </button>
  );
}

// #region Favorite Component

interface FavoriteProps {
  onFavorite?: () => void;
}

function FavoriteComponent (props: FavoriteProps) {
  const { onFavorite } = props;

  return (
    <button 
      className='swag-summary-v2__btn --outline --noMarginTop'
      onClick={onFavorite}
    >
      <img src={favoriteIcon} alt='icon' aria-hidden />
      Add to Favorites
    </button>
  );
}

// #region Lottie Component

interface LottieProps {
  animationData: object;
  className?: string;
}

function LottieComponent ({ animationData, className }: LottieProps) {

  const lottieCanvas = useRef<HTMLCanvasElement | null>(null);
  const lottieAnimation = useRef<DotLottie | null>(null);
  
  useEffect(() => {
    if (lottieAnimation.current) return;

    renderLottieScript();
    assignLottieCanvas();

    lottieAnimation.current = new DotLottie({
      autoplay: true,
      canvas: lottieCanvas.current as HTMLCanvasElement,
      data: JSON.stringify(animationData),
      renderConfig: {
        autoResize: false
      }
    });
  }, [ animationData ]);

  const renderLottieScript = useCallback(() => {
    const scriptElementExists = document.querySelector('script#lottie-js');
    if (scriptElementExists) return;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottielab/lottie-player@latest/dist/lottie-player.js';
    script.id = 'lottie-js';

    document.body.appendChild(script);
  }, []);

  const assignLottieCanvas = useCallback(() => {
    if (!lottieCanvas.current) return;

    const dateNow = Date.now();
    const canvasId = `dotlottie-canvas-${dateNow}`;
    lottieCanvas.current.id = canvasId;
  }, []);

  return (
    <div className={className}>
      <canvas ref={lottieCanvas} id="dotlottie-canvas" width="90" height="90"></canvas>
    </div>
  );
}

// #endregion


// #region Summary Component

interface SummaryProps {
  contentHtml?: string;
  stats: { key: string, value: string, lottie: object }[];
  shareString: string;
  isMember: boolean;
  isSubscriber: boolean;
  promoLinks: { icon_url: string, background_color: string, title: string, url: string, type: string }[];
  hasPlayedToday?: boolean;
  isInjected?: boolean;
  onFavorite?: () => void;
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
    <div className={`swag-summary-v2 ${!props.isInjected ? 'swag-summary-v2__fullscreen' : 'swag-summary-v2__injected'}`}>
      <div className='swag-summary-v2__content'>
        <header dangerouslySetInnerHTML={{ __html: props.contentHtml! }} />

        <div className='swag-summary-v2__stats'>
          {
            props.stats.map(({ key, value, lottie }) => 
              <LottieComponent 
                key={key}
                className='swag-summary-v2__stat' 
                animationData={utils.parseLottie(lottie, value)} 
              />
            )
          }
        </div>

        <div className={`swag-summary-v2__button-container ${props.onFavorite ? '--has-favorite' : ''}`}>
          <ShareStatsComponent shareString={props.shareString} />
          {
            props.onReplay && (
              <ReplayComponent 
                onReplay={props.onReplay} 
              />
            )
          }
          {
            props.onFavorite && (
              <FavoriteComponent 
                onFavorite={props.onFavorite} 
              />
            )
          }
        </div>

        <UpsellComponent 
          isMember={props.isMember} 
          isSubscriber={props.isSubscriber}
        />

        {
          props.promoLinks.length
            ? (
              <div className='swag-summary-v2__promo-links-container'>
                {
                  props.promoLinks.map(({ icon_url, background_color, title, type }) => {
                    return type === 'archive' && (
                      <button key={title} style={{ backgroundColor: background_color }} onClick={() => navigateToArchive()}>
                        <img src={icon_url} alt={title} />
                        <span>{title}</span>
                        <img src={arrowIcon} alt='arrow' />
                      </button>
                    );
                  })
                }
              </div>
            ) : <></>
        }

        {
          props.promoLinks.length 
            ? (
              <div className='swag-summary-v2__related-games'>
                <p>More Games:</p>
                <ul>
                  {
                    props.promoLinks.map(({ icon_url, background_color, title, url, type }) => {
                      return type === 'link' && (
                        <li key={url} style={{ backgroundColor: background_color }} onClick={() => navigateToTitle(url)}>
                          <img src={icon_url} alt={title} />
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            ) : <></>
        }
      </div>
    </div>
  );
}

// #endregion

// #region Summary API

class SummaryAPI {
  private _rootElId: string = 'swag-summary-root';
  private _isInjected: boolean = false;

  get rootElId () {
    return this._rootElId;
  }

  set rootElId (id: string) {
    this._rootElId = id;
    this._isInjected = true;
  }

  getRootEl () {
    return document.getElementById(this.rootElId)!;
  }

  async showSummary (
    stats: { key: string, value: string, lottie: object }[], 
    contentHtml: string,
    shareString: string,
    onFavorite?: () => void,
    onReplay?: () => void,
    onClose?: () => void,
  ) {
    // Fetch member status
    let isMember = false;
    try {
      const getEntity = await data.getEntity();
      isMember = getEntity.isMember;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error checking membership status:', e);
    }

    // Fetch subscriber status
    let isSubscriber = false;
    try {
      isSubscriber = await data.isSubscriber();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error checking subscription status:', e);
    }

    // Check if the game has been played today
    let hasPlayedToday = false;
    try {
      const currentDay = await data.getCurrentDay();
      hasPlayedToday = await data.hasPlayedDay(currentDay.day);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error checking if game has been played today:', e);
    }

    // Fetch daily game streak
    let gameStreak: DailyGameStreak = { streak: 0, maxStreak: 0 };
    try {
      gameStreak = await data.getDailyGameStreak();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error fetching game streak:', e);
    }
    stats.unshift(
      {
        key: 'Streak',
        value: String(gameStreak.streak).padStart(3, '0'),
        lottie: lottieStreak
      }
    );
    
    // Add time stat if it exists
    const timeStat = stats.find(stat => stat.key.toLowerCase() === 'time');
    if (timeStat) {
      timeStat.lottie = lottieTime;
    }

    // Fetch promo links
    let promoLinks: GamePromoLink[] = [];
    try {
      const isMemberAndSubscriber = isMember && isSubscriber;
      const limit = isMemberAndSubscriber ? 6 : 3;
      const platforms = [ utils.getPlatform() === 'app' ? 'app' : 'web' ];
      promoLinks = await data.getGamePromoLinks(limit, platforms);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Error fetching promo links:', e);
    }

    const showSummary = () => {
      render(<SummaryComponent 
        stats={stats} 
        contentHtml={contentHtml}
        promoLinks={promoLinks}
        shareString={shareString}
        isMember={isMember}
        isSubscriber={isSubscriber}
        hasPlayedToday={hasPlayedToday}
        isInjected={this._isInjected}
        onFavorite={onFavorite}
        onReplay={unmount}
      />, this.getRootEl());
    };

    const unmount = () => {
      this.unmount();
      if (onReplay) onReplay();
      if (onClose) onClose();
    };

    return new Promise<void>((resolve) => {
      if (!this._isInjected) document.body.classList.add('swag-summary-open');
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



const summaryv2 = new SummaryAPI();
export default summaryv2;
