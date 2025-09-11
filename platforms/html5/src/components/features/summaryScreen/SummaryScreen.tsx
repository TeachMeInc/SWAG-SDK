import messages from '@/api/messages/messages';
import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import utils from '@/utils';
import arrowIcon from '@/assets/arrow-icon.svg';
import shareIcon from '@/assets/share-icon.svg';
import replayIcon from '@/assets/replay-icon.svg';
import caretIcon from '@/assets/caret-icon.svg';
import favoriteIcon from '@/assets/favorite-icon.svg';
import LottieComponent from '@/components/ui/Lottie';

// #region Shockwave Upsell

interface UpsellProps {
  isMember?: boolean;
  isSubscriber?: boolean;
}

function UpsellComponent (props: UpsellProps) {
  const { isMember, isSubscriber } = props;

  return (!isMember || !isSubscriber) ? (
    <div className='swag-summary__upsell'>
      <a 
        href={`https://shockwave.com${!isSubscriber ? '/unlimited' : '/account/login'}`}
        className='swag-summary__upsell-banner'
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
      className='swag-summary__btn'
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
      className='swag-summary__btn --outline --noMarginTop'
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
      className='swag-summary__btn --outline --noMarginTop'
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

  const handleHeaderPadding = useCallback(() => {
    if (!contentRef.current) return;

    const header = document.querySelector('header.swag-toolbar');
    if (!header) return;

    const headerHeight = header.clientHeight;
    contentRef.current!.style.marginTop = `${headerHeight}px`;
  }, []);

  const handleResize = useCallback(() => {
    if (!contentRef.current) return;

    const { scrollHeight, clientHeight } = contentRef.current;
    const isScrollable = scrollHeight > clientHeight;

    setIsOverflow(isScrollable);
    handleScroll();
  }, [ contentRef.current ]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current!;
    const isAtBottom = (scrollTop + clientHeight) >= (scrollHeight - 10); // Small buffer
    
    setShowScrollIndicator(!isAtBottom);
  }, [ contentRef.current ]);

  useEffect(() => {
    if (!contentRef.current || props.isInjected) return;

    handleResize();
    window.addEventListener('resize', handleResize);

    handleScroll();
    contentRef.current.addEventListener('scroll', handleScroll);

    handleHeaderPadding();
  }, [ contentRef.current, props.isInjected ]);

  const handleScrollToBottom = () => {
    if (!contentRef.current) return;

    contentRef.current.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className={`swag-summary ${!props.isInjected ? 'swag-summary__fullscreen' : 'swag-summary__injected'}`}>
      <div ref={contentRef} className={`swag-summary__scroll-content ${isOverflow ? '--is-overflow' : ''}`}>
        <div ref={contentRef} className='swag-summary__content'>
          <header dangerouslySetInnerHTML={{ __html: props.contentHtml! }} />

          <div className='swag-summary__stats'>
            {
              props.stats.map(({ key, value, lottie }) => 
                <LottieComponent 
                  key={key}
                  className='swag-summary__stat' 
                  animationData={utils.parseLottie(lottie, value)} 
                />
              )
            }
          </div>

          <div className={`swag-summary__button-container ${props.onFavorite ? '--has-favorite' : ''}`}>
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
                <div className='swag-summary__promo-links-container'>
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
                <div className='swag-summary__related-games'>
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

        {
          (isOverflow && showScrollIndicator) && (
            <button type='button' className='swag-summary__scroll-indicator' onClick={handleScrollToBottom}>
              <img src={caretIcon} alt='scroll down' />
            </button>
          )
        }
      </div>
    </div>
  );
}

// #endregion
