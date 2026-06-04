export default function handler(req, res) {
    const { ticker } = req.query;

    const db = {
        SYS: { price: 438, bv: 114.4, shares: 291, sector: "Tech" },
        FFC: { price: 195, bv: 110.2, shares: 1272, sector: "Fertilizer" },
        EFERT: { price: 168.4, bv: 58.2, shares: 1335, sector: "Fertilizer" },
        MARI: { price: 2450, bv: 980.5, shares: 133, sector: "Oil & Gas" },
        OGDC: { price: 122.3, bv: 265.4, shares: 4301, sector: "Oil & Gas" }
    };

    const data = db[ticker.toUpperCase()];

    if (!data) {
        return res.json({
            ticker,
            price: 100,
            bv: 100,
            shares: 100,
            sector: "Unknown"
        });
    }

    return res.json({
        ticker,
        price: data.price,
        bv: data.bv,
        shares: data.shares,
        sector: data.sector,
        shariah: "YES",
        divs: [0,0,0,0,0]
    });
}
