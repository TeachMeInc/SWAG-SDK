import messages from '@/api/messages';
import { useState, useRef, useEffect } from 'preact/hooks';
import utils from '@/utils';
import arrowIcon from '@/assets/arrow-icon.svg';
import shareIcon from '@/assets/share-icon.svg';
import replayIcon from '@/assets/replay-icon.svg';
import caretIcon from '@/assets/caret-icon.svg';
import favoriteIcon from '@/assets/favorite-icon.svg';
import trophyIcon from '@/assets/trophy-icon.svg';
import scrollIndicatorLottie from '@/assets/lottie/scroll-indicator.json';
import LottieComponent from '@/components/ui/Lottie';
import session from '@/session';
import leaderboardScreenUi from '@/api/leaderboardScreenUi';
import summaryScreenUi from '@/api/summaryScreenUi';
import config from '@/config';
import dataApi from '@/api/data';
import upsellBanner from '@/assets/upsell-banner.jpg';

// #region Shockwave Upsell

interface UpsellProps {
  isMember?: boolean;
  isSubscriber?: boolean;
}

function UpsellComponent (props: UpsellProps) {
  const { isMember, isSubscriber } = props;

  const targetUrl = 'https://shockwave.com' + ((isMember && !isSubscriber)
    ? '/unlimited' 
    : '/account/register');

  const sendEvent = () => {
    if (isMember && !isSubscriber) {
      dataApi.sendTagBeacon('swu_upsell', { target_url: targetUrl });
    } else {
      dataApi.sendTagBeacon('account_upsell', { target_url: targetUrl });
    }
  };

  return (
    (isMember && isSubscriber) ? (
      <></>
    ) : (
      <div className='swag-summaryScreen__upsell'>
        <a 
          href={targetUrl}
          target='_blank'
          onClick={sendEvent}
          className='swag-summaryScreen__upsell-banner'
          style={{ backgroundImage: `url(${upsellBanner})` }}
        >
          {
            (isMember && !isSubscriber) ? (
              <p>
                <strong>Shockwave is more fun with a Subscription!</strong><br/>
                No Ads, Archive Access and more
              </p>
            ) : (
              <p>
                <strong>Shockwave is more fun with an account!</strong><br/>
                Track stats, save favorites and more
              </p>
            )
          }
          <img src={arrowIcon} alt='arrow' />
        </a>
      </div>
    )
  );
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
      className='swag-summaryScreen__btn --fullWidth'
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

// #region Play With Friends Component

function PlayWithFriendsComponent () {
  const onClickChallengeFriends = () => {
    leaderboardScreenUi.show({
      source: 'summaryScreen',
    });
  };

  return (
    <button 
      className='swag-summaryScreen__btn --fullWidth'
      onClick={onClickChallengeFriends}
    >
      <img src={trophyIcon} alt='icon' aria-hidden />
      Challenge Your Friends
    </button>
  );
}

// #endregion

// #region Replay Component

interface ReplayProps {
  onReplay?: () => void;
}

function ReplayComponent (props: ReplayProps) {
  const onReplay = () => {
    if (props.onReplay) props.onReplay();
    dataApi.postTag('navigate_replay');
  };

  return (
    <button 
      className='swag-summaryScreen__btn --outline --noMarginTop'
      onClick={onReplay}
    >
      <img src={replayIcon} alt='icon' aria-hidden />
      Replay
    </button>
  );
}

// #endregion

// #region Favorite Component

interface FavoriteProps {
  onFavorite?: () => void;
}

function FavoriteComponent (props: FavoriteProps) {
  const { onFavorite } = props;

  return (
    <button 
      className='swag-summaryScreen__btn --outline --noMarginTop'
      onClick={onFavorite}
    >
      <img src={favoriteIcon} alt='icon' aria-hidden />
      Add to Favorites
    </button>
  );
}

// #endregion

// #region Summary Component

interface SummaryProps {
  contentHtml?: string;
  footerHtml?: string;
  stats: { key: string, value: string, lottie: object }[];
  shareString: string;
  isMember: boolean;
  isSubscriber: boolean;
  promoLinks: { icon_url: string, background_color: string, title: string, url: string, type: string }[];
  hasPlayedToday?: boolean;
  isInjected?: boolean;
  hideStats?: boolean;
  onFavorite?: () => void;
  onReplay?: () => void;
  hasLeaderboard?: boolean;
}

export default function SummaryScreen (props: SummaryProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [ isOverflow, setIsOverflow ] = useState<boolean>(false);
  const [ showScrollIndicator, setShowScrollIndicator ] = useState<boolean>(false);

  const navigateToTitle = (slug: string) => {
    messages.trySendMessage('swag.navigateToTitle', slug);
  };
  
  const navigateToArchive = () => {
    messages.trySendMessage('swag.navigateToArchive');
  };

  const handleResize = () => {
    if (!contentRef.current) return;

    const { scrollHeight, clientHeight } = contentRef.current;
    const isScrollable = scrollHeight > clientHeight;

    setIsOverflow(isScrollable);
    handleScroll();
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current!;
    const isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 10); // Small buffer
    
    setShowScrollIndicator(!isAtBottom);
  };

  useEffect(() => {
    if (!contentRef.current || props.isInjected) return;

    const contentEl = contentRef.current;

    handleResize();
    window.addEventListener('resize', handleResize);

    handleScroll();
    contentEl.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      contentEl.removeEventListener('scroll', handleScroll);
    };
  });

  const handleScrollToBottom = () => {
    if (!contentRef.current) return;

    contentRef.current.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const [ exiting, setExiting ] = useState(false);
  const handleReplay = () => {
    setExiting(true);
    setTimeout(() => {
      if (props.onReplay) props.onReplay();
      summaryScreenUi.hide();
    }, 400);
  };

  const style = props.isInjected 
    ? {} 
    : { marginTop: session.toolbarHeight };
  
  return (
    <div
      className={`swag-summaryScreen ${!props.isInjected ? 'swag-summaryScreen__fullscreen' : 'swag-summaryScreen__injected'} ${exiting ? 'swag-slide-out-down' : ''}`}
    >
      <div ref={contentRef} className={`swag-summaryScreen__scroll-content ${isOverflow ? '--is-overflow' : ''}`} style={style}>
        <div ref={contentRef} className='swag-summaryScreen__content'>
          <header dangerouslySetInnerHTML={{ __html: props.contentHtml! }} />

          {
            !props.hideStats && (
              <div className='swag-summaryScreen__stats'>
                {
                  props.stats.map(({ key, value, lottie }) => 
                    <LottieComponent 
                      key={key}
                      className='swag-summaryScreen__stat' 
                      animationData={utils.parseLottie(lottie, value)} 
                      delay={config.loaderDelay ? 200 : 0} // screen transition is 400ms
                    />
                  )
                }
              </div>
            )
          }

          <div className={`swag-summaryScreen__button-container ${props.onFavorite ? '--has-favorite' : ''}`}>
            <ShareStatsComponent shareString={props.shareString} />
            {
              props.hasLeaderboard ? <PlayWithFriendsComponent /> : null
            }
            {
              props.onReplay && (
                <ReplayComponent 
                  onReplay={handleReplay} 
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

          {
            props.footerHtml && (
              <div className='swag-summaryScreen__footer' dangerouslySetInnerHTML={{ __html: props.footerHtml! }} />
            )
          }

          <UpsellComponent 
            isMember={props.isMember} 
            isSubscriber={props.isSubscriber}
          />

          {
            props.promoLinks.length
              ? (
                <div className='swag-summaryScreen__promo-links-container'>
                  {
                    props.promoLinks.map(({ icon_url, background_color, title, type }) => {
                      return type === 'archive' && (
                        <button key={title} style={{ backgroundColor: background_color }} onClick={async () => {
                          await dataApi.postTag('navigate_archive');
                          navigateToArchive();
                        }}>
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
                <div className='swag-summaryScreen__related-games'>
                  <p>More Games:</p>
                  <ul>
                    {
                      props.promoLinks.map(({ icon_url, background_color, title, url, type }) => {
                        return type === 'link' && (
                          <li 
                            key={url} 
                            style={{ backgroundColor: background_color }} onClick={async () => {
                              await dataApi.postTag('navigate_new_game', {
                                target_url: url,
                              });
                              navigateToTitle(url);
                            }}
                          >
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

        {
          (isOverflow && showScrollIndicator) && (
            <button type='button' className='swag-summaryScreen__scroll-indicator' onClick={handleScrollToBottom}>
              <LottieComponent 
                animationData={scrollIndicatorLottie} 
                delay={config.loaderDelay ? 200 : 0} // screen transition is 400ms
              />
            </button>
          )
        }
      </div>
    </div>
  );
}

// #endregion
