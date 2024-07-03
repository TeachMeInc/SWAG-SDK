import { Root } from 'react-dom/client';
import messages from './messages';
import { useRef, useState } from 'react';



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
    }, 1000);
  };

  return (
    <button 
      className='swag-summary__btn'
      onClick={copyToClipboard}
    >
      {
        copying 
          ? <>Copied!</> 
          : <>Share Stats</>
      }
    </button>
  );
}

// #endregion



// #region Summary Component

interface SummaryProps {
  resultHtml: string;
  stats: { key: string, value: string }[];
  relatedGames?: { slug: string, title: string, icon: string }[];
  shareString?: string;
}

function SummaryComponent (props: SummaryProps) {
  const navigateToArchive = () => {
    messages.trySendMessage('swag.navigateToArchive');
  };

  const navigateToTitle = (slug: string) => {
    messages.trySendMessage('swag.navigateToTitle', slug);
  };

  return (
    <div className='swag-summary'>
      <div className='swag-summary__inner'>
        <header>
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
        {
          props.shareString
            ? (
              <div>
                <ShareStatsComponent shareString={props.shareString} />
              </div>
            )
            : <div></div>
        }
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
        <ul className='swag-summary__related-games'>
          {
            props.relatedGames?.map(({ slug, title, icon }) => {
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

// #endregion



// #region Summary API

class SummaryAPI {
  showSummary (
    reactRoot: Root, 
    stats: { key: string, value: string }[], 
    resultHtml: string,
    shareString?: string,
  ) {
    return new Promise<void>((resolve) => {
      (async () => {
        try {
          const event = await messages.trySendMessage('swag.getRelatedGames');
          const relatedGames = JSON.parse(event.message);
          reactRoot.render(<SummaryComponent 
            stats={stats} 
            resultHtml={resultHtml}
            relatedGames={relatedGames}
            shareString={shareString}
          />);
          document.body.classList.add('swag-dialog-open');
          resolve();
        } catch (e) {
          reactRoot.render(<SummaryComponent 
            stats={stats} 
            resultHtml={resultHtml} 
            shareString={shareString}
          />);
          document.body.classList.add('swag-dialog-open');
          resolve();
        }
      })();
    });
  }

  protected unmount (reactRoot: Root) {
    reactRoot.unmount();
    document.body.classList.remove('swag-dialog-open');
    return Promise.resolve();
  }
}

// #endregion



const summary = new SummaryAPI();
export default summary;
