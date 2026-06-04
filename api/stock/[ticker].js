export default function handler(req, res) {

    const { ticker } = req.query;

    const db = {
        SYS: {
            price: 438,
            bv: 114.4,
            shares: 291,
            sector: "Tech",
            shariah: "YES",
            divs: [8, 6, 5, 4, 3]
        }
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
