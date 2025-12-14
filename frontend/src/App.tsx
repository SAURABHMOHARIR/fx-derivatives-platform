import { useState, useEffect } from 'react'
import RFQTicket from './components/RFQTicket'

// Mock Data Types
interface Quote {
  id: string;
  dealer: string;
  price: number;
  valid_until: string;
}

interface RFQ {
  id: number;
  pair: string;
  amount: number;
  status: string;
}

function App() {
  const [activeRFQ, setActiveRFQ] = useState<RFQ | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const handleRFQSubmit = async (rfqData: any) => {
    console.log("Submitting RFQ:", rfqData);

    // In real app, post to API
    // const res = await fetch('http://localhost:8000/rfqs', { method: 'POST', body: JSON.stringify(rfqData) ... })
    // const data = await res.json()

    // Mock Response
    const mockRFQ = {
      id: Math.floor(Math.random() * 1000),
      pair: rfqData.pair,
      amount: rfqData.amount,
      status: 'QUOTING'
    };
    setActiveRFQ(mockRFQ);
    setQuotes([]);

    // Simulate Dealer Quotes coming in
    setTimeout(() => {
      addMockQuote(mockRFQ.id, "JPM FX");
    }, 1500);
    setTimeout(() => {
      addMockQuote(mockRFQ.id, "GS TRADING");
    }, 2500);
    setTimeout(() => {
      addMockQuote(mockRFQ.id, "DB MARKETS");
    }, 3000);
  };

  const addMockQuote = (rfqId: number, dealer: string) => {
    const price = 1.1050 + (Math.random() - 0.5) * 0.0010;
    const quote: Quote = {
      id: Math.random().toString(36).substr(2, 9),
      dealer,
      price,
      valid_until: new Date(Date.now() + 30000).toISOString()
    };
    setQuotes(prev => [...prev, quote]);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-300 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 p-4 flex flex-col">
        <div className="text-2xl font-bold text-white mb-8 tracking-tighter">
          <span className="text-blue-500">FX</span>GO
        </div>
        <nav className="space-y-2">
          <a className="block px-4 py-2 bg-blue-900/20 text-blue-400 rounded border-l-2 border-blue-500">
            RFQ Execution
          </a>
          <a className="block px-4 py-2 hover:bg-slate-800 rounded transition-colors">
            Trade Blotter
          </a>
          <a className="block px-4 py-2 hover:bg-slate-800 rounded transition-colors">
            Market Data
          </a>
          <a className="block px-4 py-2 hover:bg-slate-800 rounded transition-colors">
            Analytics
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 flex items-center px-6 justify-between">
          <div className="font-mono text-sm text-slate-500">
            MARKET STATUS: <span className="text-green-500">OPEN</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-700"></div>
          </div>
        </header>

        <main className="flex-1 p-6 flex gap-6">

          {/* Left: Ticket */}
          <div className="w-[400px]">
            <RFQTicket onSubmit={handleRFQSubmit} />
          </div>

          {/* Right: Pricing Grid */}
          <div className="flex-1 bg-[#131620] rounded-lg border border-slate-800 p-6">
            <h3 className="text-lg font-medium text-white mb-6">Live Dealer Pricing</h3>

            {!activeRFQ && (
              <div className="h-full flex items-center justify-center text-slate-600">
                Awaiting RFQ...
              </div>
            )}

            {activeRFQ && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{activeRFQ.pair}</div>
                    <div className="text-sm font-mono text-slate-500">{activeRFQ.amount.toLocaleString()} USD</div>
                  </div>
                  <div className="px-3 py-1 rounded bg-yellow-900/30 text-yellow-500 text-xs font-bold animate-pulse">
                    {activeRFQ.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quotes.map(quote => (
                    <div key={quote.id} className="bg-slate-800 border border-slate-700 hover:border-blue-500 p-4 rounded cursor-pointer transition-all group">
                      <div className="text-xs text-slate-400 mb-2">{quote.dealer}</div>
                      <div className="text-3xl font-mono text-white group-hover:text-blue-400">
                        {quote.price.toFixed(5)}
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-xs text-slate-500">Valid: 15s</div>
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          EXECUTE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default App
