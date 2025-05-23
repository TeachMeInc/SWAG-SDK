import messages from './messages';
import data from './data';
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
import shareIcon from './assets/share-icon.svg';
import replayIcon from './assets/replay-icon.svg';


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
        
        {/*
        {
          props.relatedGames.length 
            ? (
              <ul className='swag-summary__related-games'>
                {
                  props.relatedGames.map(({ slug, title, icon }) => {
                    return (
                      <li key={slug} onClick={() => navigateToTitle(slug)}>
                        <img src={icon} alt={title} />
                        <span>{title}</span>
                      </li>
                    );
                  })
                }
              </ul>
            ) : <></>
        }
        */}

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



// #region Revisit Component
/*
interface RevisitProps {
  resultHtml: string;
  isSubscriber: boolean;
  currentDate: Date;
  onReplay: () => void;
  onShowStats: () => void;
  relatedGames: { slug: string, title: string, icon: string }[];
}


function RevisitComponent (props: RevisitProps) {
  const navigateToArchive = () => {
    messages.trySendMessage('swag.navigateToArchive');
  };

  const navigateToTitle = (slug: string) => {
    messages.trySendMessage('swag.navigateToTitle', slug);
  };

  // April 23rd, 2023
  const dateFormatted = props.currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className='swag-summary'>
      <div className='swag-summary__inner'>
        <h4>
          <strong>Great Work!</strong><br />
          We'll have a new puzzle for you tomorrow.
        </h4>
        <div>
          <button 
            className='swag-summary__btn'
            onClick={props.onShowStats}
          >
            See Stats
          </button>
        </div>
        <div>
          <button 
            className='swag-summary__btn --outline'
            onClick={props.onReplay}
          >
            Replay
          </button>
        </div>
        <p>{dateFormatted}</p>
        <div 
          className='swag-summary__preview-container'
          dangerouslySetInnerHTML={{ __html: props.resultHtml }} 
        />
        {
          props.isSubscriber
            ? (
              <>
                <p>
                  Ready for more? Play more games from the archive.
                </p>
                <div>
                  <button 
                    className='swag-summary__btn'
                    onClick={navigateToArchive}
                  >
                    View Archive
                  </button>
                </div>
              </>
            )
            : (
              <>
                <p>
                  Want more puzzles? Subscribe to get access to the full archive.
                </p>
                <div>
                  <button 
                    className='swag-summary__btn'
                    onClick={navigateToArchive}
                  >
                    Subscribe
                  </button>
                </div>
              </>
            )
        }
        <ul className='swag-summary__related-games'>
          {
            props.relatedGames.map(({ slug, title, icon }) => {
              return (
                <li key={slug} onClick={() => navigateToTitle(slug)}>
                  <img src={icon} alt={title} />
                  <span>{title}</span>
                </li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
}
*/

// #endregion



// #region Summary API

class SummaryAPI {
  async showSummary (
    stats: { key: string, value: string }[], 
    resultHtml: string,
    shareString: string,
    titleHtml?: string,
    onReplay?: () => void,
    onClose?: () => void
  ) {
    const isSubscriber = await data.isSubscriber();
    // const currentDay = await data.getCurrentDay();
    // const currentDate = utils.getDate(currentDay.day);
    // const hasPlayedToday = await data.hasPlayedDay(currentDay.day);

    const gameStreak = await data.getDailyGameStreak();
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

    const promoLinks = await data.getGamePromoLinks();

    let relatedGames;
    try {
      const event = await messages.trySendMessage('swag.getRelatedGames');
      relatedGames = JSON.parse(event.message);
    } catch (e) {
      relatedGames = [];
    }

    const rootEl = document.getElementById('swag-react-root')!;

    const showSummary = () => {
      render(<SummaryComponent 
        stats={stats} 
        titleHtml={titleHtml}
        resultHtml={resultHtml}
        relatedGames={relatedGames}
        promoLinks={promoLinks}
        shareString={shareString}
        isSubscriber={isSubscriber}
        onReplay={unmount}
      />, rootEl);
    };

    /*
    const showRevisit = () => {
      render(<RevisitComponent
        resultHtml={resultHtml}
        relatedGames={relatedGames}
        isSubscriber={isSubscriber}
        currentDate={currentDate}
        onReplay={unmount}
        onShowStats={showSummary}
      />, rootEl);
    };
    */

    const unmount = () => {
      this.unmount();
      if (onReplay) onReplay();
      if (onClose) onClose();
    };

    return new Promise<void>((resolve) => {
      /*
      if (hasPlayedToday) {
        showRevisit();
      } else {
        showSummary();
      }
      */

      showSummary();
      document.body.classList.add('swag-dialog-open');
      resolve();
    });
  }

  protected unmount () {
    const rootEl = document.getElementById('swag-react-root')!;
    render(null, rootEl);
    document.body.classList.remove('swag-dialog-open');
    return Promise.resolve();
  }
}

// #endregion



const summary = new SummaryAPI();
export default summary;
