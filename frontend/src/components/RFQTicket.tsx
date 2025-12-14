import React, { useState } from 'react';

type InstrumentType = 'SPOT' | 'FORWARD' | 'VANILLA_OPTION' | 'BARRIER_OPTION';
type Side = 'BUY' | 'SELL';

interface RFQTicketProps {
    onSubmit: (rfq: any) => void;
}

const RFQTicket: React.FC<RFQTicketProps> = ({ onSubmit }) => {
    const [instrument, setInstrument] = useState<InstrumentType>('VANILLA_OPTION');
    const [pair, setPair] = useState('EURUSD');
    const [side, setSide] = useState<Side>('BUY');
    const [amount, setAmount] = useState<number>(1000000);
    const [tenor, setTenor] = useState('1M');
    const [strike, setStrike] = useState<number | ''>('');
    const [optionType, setOptionType] = useState<'CALL' | 'PUT'>('CALL');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            instrument_type: instrument,
            pair,
            side,
            amount,
            tenor,
            strike: Number(strike),
            option_type: optionType
        });
    };

    return (
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white border-b border-slate-700 pb-2">New RFQ</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Selection */}
                <div className="grid grid-cols-2 gap-2">
                    <label className="text-slate-400 text-xs uppercase">Instrument</label>
                    <select
                        className="input-field col-span-2"
                        value={instrument}
                        onChange={(e) => setInstrument(e.target.value as InstrumentType)}
                    >
                        <option value="SPOT">Spot</option>
                        <option value="FORWARD">Forward</option>
                        <option value="VANILLA_OPTION">Vanilla Option</option>
                        <option value="BARRIER_OPTION">Barrier Option</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-slate-400 text-xs uppercase">Pair</label>
                        <input
                            type="text"
                            className="input-field uppercase font-mono"
                            value={pair}
                            onChange={(e) => setPair(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-slate-400 text-xs uppercase">Side</label>
                        <div className="flex bg-slate-800 rounded p-1">
                            <button
                                type="button"
                                className={`flex-1 text-sm rounded py-1 ${side === 'BUY' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                onClick={() => setSide('BUY')}
                            >BUY</button>
                            <button
                                type="button"
                                className={`flex-1 text-sm rounded py-1 ${side === 'SELL' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                onClick={() => setSide('SELL')}
                            >SELL</button>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-slate-400 text-xs uppercase">Notional (CCY1)</label>
                    <input
                        type="number"
                        className="input-field font-mono text-right"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </div>

                {/* Option Specific Fields */}
                {(instrument === 'VANILLA_OPTION' || instrument === 'BARRIER_OPTION') && (
                    <div className="space-y-4 border-t border-slate-800 pt-4 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-400 text-xs uppercase">Tenor</label>
                                <select
                                    className="input-field"
                                    value={tenor}
                                    onChange={(e) => setTenor(e.target.value)}
                                >
                                    <option value="1W">1 Week</option>
                                    <option value="2W">2 Weeks</option>
                                    <option value="1M">1 Month</option>
                                    <option value="3M">3 Months</option>
                                    <option value="6M">6 Months</option>
                                    <option value="1Y">1 Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-slate-400 text-xs uppercase">Type</label>
                                <div className="flex bg-slate-800 rounded p-1">
                                    <button
                                        type="button"
                                        className={`flex-1 text-sm rounded py-1 ${optionType === 'CALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                        onClick={() => setOptionType('CALL')}
                                    >CALL</button>
                                    <button
                                        type="button"
                                        className={`flex-1 text-sm rounded py-1 ${optionType === 'PUT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                        onClick={() => setOptionType('PUT')}
                                    >PUT</button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-slate-400 text-xs uppercase">Strike Price</label>
                            <input
                                type="number"
                                className="input-field font-mono text-right"
                                value={strike}
                                placeholder="Auto (ATM)"
                                onChange={(e) => setStrike(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded mt-4 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                    REQUEST QUOTE
                </button>
            </form>
        </div>
    );
};

export default RFQTicket;
