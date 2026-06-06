export default async function handler(req, res) {

    const { ticker } = req.query;

    try {
        // Yahoo Finance API (FREE LIVE DATA)
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}.PK`;

        const response = await fetch(url);
        const data = await response.json();

        const result = data?.quoteResponse?.result?.[0];

        if (!result) {
            return res.status(404).json({
                error: "No live data found",
                ticker
            });
        }

        // fallback values for missing fields
        const price = result.regularMarketPrice || 0;

        return res.status(200).json({
            ticker,
            price,
            bv: price * 0.35,   // estimated book value proxy
            shares: 1000,       // default until PSX API available
            sector: "PSX Market",
            shariah: "UNKNOWN",
            divs: [0, 0, 0, 0, 0]
        });

    } catch (error) {
        return res.status(500).json({
            error: "API failed",
            message: error.message
        });
    }
}
