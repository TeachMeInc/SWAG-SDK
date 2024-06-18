import { Root } from 'react-dom/client';
import messages from './messages';

interface SummaryProps {
  resultHtml: string;
  stats: { key: string, value: string }[];
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
            Share Stats X
          </button>
        </div>
        <p>
          Ready for more? Solve more puzzles from the archive
        </p>
        <div>
          <button 
            className='swag-summary__btn'
            onClick={navigateToArchive}
          >
            View Archive
          </button>
        </div>
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
    reactRoot.render(<SummaryComponent stats={stats} resultHtml={resultHtml} />);
    document.body.classList.add('swag-dialog-open');
  }

  hideSummary (reactRoot: Root) {
    reactRoot.unmount();
    document.body.classList.remove('swag-dialog-open');
  }
}

export default new SummaryAPI();
