import { Root } from 'react-dom/client';
import messages from './messages';

interface SummaryProps {
  resultHtml: string;
  stats: { key: string, value: string }[];
  relatedGames?: { slug: string, title: string, icon: string }[];
}

function SummaryComponent (props: SummaryProps) {
  const navigateToArchive = () => {
    messages.trySendMessage('swag.navigateToArchive');
  };

  const shareStats = () => {
    console.log('TODO: Implement shareStats')
  };

  return (
    <div className='swag-summary'>
      <div className='swag-summary__inner'>
        <div 
          className='swag-summary__preview'
          dangerouslySetInnerHTML={{__html: props.resultHtml}} 
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
        <div>
          <button 
            className='swag-summary__btn'
            onClick={shareStats}
          >
            Share Stats
          </button>
        </div>
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
                <li key={slug}>
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

class SummaryAPI {
  showSummary (
    reactRoot: Root, 
    stats: { key: string, value: string }[], 
    resultHtml: string
  ) {
    return new Promise<void>(async (resolve) => {
      try {
        const event = await messages.trySendMessage('swag.getRelatedGames');
        const relatedGames = JSON.parse(event.message);
        reactRoot.render(<SummaryComponent 
          stats={stats} 
          resultHtml={resultHtml}
          relatedGames={relatedGames} 
        />);
        document.body.classList.add('swag-dialog-open');
        resolve();
      } catch (e) {
        reactRoot.render(<SummaryComponent 
          stats={stats} 
          resultHtml={resultHtml} 
        />);
        document.body.classList.add('swag-dialog-open');
        resolve();
      }
    });
  }

  hideSummary (reactRoot: Root) {
    reactRoot.unmount();
    document.body.classList.remove('swag-dialog-open');
    return Promise.resolve();
  }
}

export default new SummaryAPI();
