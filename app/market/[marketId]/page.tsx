import { MarketDetails } from '@/components/MarketDetails';

export default function MarketPage() {
  // MarketDetails uses useParams internally to get marketId
  return <MarketDetails />;
}
