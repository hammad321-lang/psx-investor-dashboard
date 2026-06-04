export default function handler(req, res) {

    const { ticker } = req.query;

    // SIMPLE DATABASE (SAFE & CLEAN)
    const db = {
        SYS: { price: 438, bv: 114.4, shares: 291, sector: "Tech", shariah: "YES", divs: [8,6,5,4,3] },
        FFC: { price: 195, bv: 110.2, shares: 1272, sector: "Fertilizer", shariah: "YES", divs: [18,16,14,13,12] },
        EFERT: { price: 168, bv: 58.2, shares: 1335, sector: "Fertilizer", shariah: "YES", divs: [21,18,15,12,11] },
        MARI: { price: 2450, bv: 980.5, shares: 133, sector: "Oil & Gas", shariah: "YES", divs: [142,120,98,82,75] },
        OGDC: { price: 122, bv: 265.4, shares: 4301, sector: "Oil & Gas", shariah: "YES", divs: [10,9,8,7,6] },
        PPL: { price: 114, bv: 242.1, shares: 2721, sector: "Oil & Gas", shariah: "YES", divs: [8,7,6,5,4] },
        HUBC: { price: 118, bv: 56.4, shares: 1297, sector: "Power", shariah: "YES", divs: [18,15,12,10,8] },
        LUCK: { price: 745, bv: 512.3, shares: 313, sector: "Cement", shariah: "YES", divs: [18,15,12,10,0] }
    };

    const stock = db[ticker];

    if (!stock) {
        return res.status(404).json({
            error: "Ticker not found",
            ticker
        });
    }

    return res.status(200).json({
        ticker,
        ...stock
    });
}
