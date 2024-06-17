import { Root } from 'react-dom/client';

function Summary (props: any) {
  return (
    <div />
  );
}

class SummaryAPI {
  showSummary (reactRoot: Root, stats: Record<string, string>, resultHtml: string) {
    return Promise.resolve();
  }
}

export default new SummaryAPI();
