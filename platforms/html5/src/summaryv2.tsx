import messages from './messages';
import data from './data';
import { render } from 'preact';
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import utils from './utils';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import lottieStreak from './lottie/streak.json';
import arrowIcon from './assets/arrow-icon.svg';
import shareIcon from './assets/share-icon.svg';
import replayIcon from './assets/replay-icon.svg';
import favoriteIcon from './assets/favorite-icon.svg';

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

function LottieComponent({ animationData, className }: LottieProps) {

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
        autoResize: true
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
      <canvas ref={lottieCanvas} id="dotlottie-canvas" width="6rem" height="6rem"></canvas>
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
  relatedGames: { slug: string, title: string, icon: string }[];
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
          props.relatedGames.length 
            ? (
              <div className='swag-summary-v2__related-games'>
                <p>More Games:</p>
                <ul>
                  {
                    props.relatedGames.map(({ slug, title, icon }) => {
                      return (
                        <li key={slug} onClick={() => navigateToTitle(slug)}>
                          <img src={icon} alt={title} />
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            ) : <></>
        }

        {
          props.promoLinks.length
            ? (
              <div className='swag-summary-v2__promo-links-container'>
                {
                  props.promoLinks.map(({ icon_url, background_color, title, url, type }) => {
                    const navMethod = type === 'archive' ? navigateToArchive : navigateToTitle;
                    return (
                      <button key={title} style={{ backgroundColor: background_color }} onClick={() => navMethod(url)}>
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
      </div>
    </div>
  );
}

// #endregion

// #region Summary API

class SummaryAPI {
  async showSummary (
    stats: { key: string, value: string, lottie: object }[], 
    contentHtml: string,
    shareString: string,
    onFavorite?: () => void,
    onReplay?: () => void,
    onClose?: () => void,
    injectDiv?: string
  ) {

    const getEntity = await data.getEntity();
    const isMember = getEntity.isMember;
    const isSubscriber = await data.isSubscriber();
    const currentDay = await data.getCurrentDay();
    const hasPlayedToday = await data.hasPlayedDay(currentDay.day);

    const gameStreak = await data.getDailyGameStreak();

    stats.unshift(
      {
        key: 'Streak',
        value: String(gameStreak.streak).padStart(3, '0'),
        lottie: lottieStreak
      }
    );

    const promoLinks = await data.getGamePromoLinks();

    let relatedGames;
    try {
      const event = await messages.trySendMessage('swag.getRelatedGames');
      relatedGames = JSON.parse(event.message);
    } catch (e) {
      relatedGames = [];
    }

    const rootEl = !injectDiv 
      ? document.getElementById('swag-react-root')!
      : document.querySelector(injectDiv)!;

    const showSummary = () => {
      render(<SummaryComponent 
        stats={stats} 
        contentHtml={contentHtml}
        relatedGames={relatedGames}
        promoLinks={promoLinks}
        shareString={shareString}
        isMember={isMember}
        isSubscriber={isSubscriber}
        hasPlayedToday={hasPlayedToday}
        isInjected={!!injectDiv}
        onFavorite={onFavorite}
        onReplay={unmount}
      />, rootEl);
    };

    const unmount = () => {
      this.unmount(rootEl!, injectDiv);
      if (onReplay) onReplay();
      if (onClose) onClose();
    };

    return new Promise<void>((resolve) => {
      /*
      if (hasPlayedToday) 
        showRevisit();
      else
        showSummary();
      */

      showSummary();
      if (!injectDiv)
        document.body.classList.add('swag-dialog-open');
      resolve();
    });
  }

  protected unmount (rootEl: Element, injectDiv?: string) {
    render(null, rootEl);
    if (!injectDiv)
      document.body.classList.remove('swag-dialog-open');
    return Promise.resolve();
  }
}

// #endregion



const summaryv2 = new SummaryAPI();
export default summaryv2;
