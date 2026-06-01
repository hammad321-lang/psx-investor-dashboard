export default async function handler(req, res) {
    const { ticker } = req.query;

    if (!ticker) {
        return res.status(400).json({ error: "Missing ticker" });
    }

    const T = ticker.toUpperCase();

    // 🔴 TEMP DATA SOURCE (replace later with real PSX scraping/API)
    const mockDatabase = {
        SYS: { price: 438, bv: 114.4, sector: "Tech", shares: 291 },
        FFC: { price: 195, bv: 110.2, sector: "Fertilizer", shares: 1272 },
        EFERT: { price: 168.4, bv: 58.2, sector: "Fertilizer", shares: 1335 },
        MARI: { price: 2450, bv: 980.5, sector: "Oil & Gas", shares: 133 },
        OGDC: { price: 122.3, bv: 265.4, sector: "Oil & Gas", shares: 4301 },
        PPL: { price: 114.8, bv: 242.1, sector: "Oil & Gas", shares: 2721 },
        HUBC: { price: 118.5, bv: 56.4, sector: "Power", shares: 1297 },
        LUCK: { price: 745, bv: 512.3, sector: "Cement", shares: 313 }
    };

    const data = mockDatabase[T];

    if (!data) {
        return res.json({
            ticker: T,
            price: 100,
            bv: 100,
            sector: "Unknown",
            shares: 100,
            shariah: "YES"
        });
    }

    return res.json({
        ticker: T,
        price: data.price,
        bv: data.bv,
        sector: data.sector,
        sharesOutstanding: data.shares,
        shariah: "YES",

        // optional future fields
        divs: [0,0,0,0,0],
        divTypes: ["Cash","Cash","Cash","Cash","Cash"]
    });
}
