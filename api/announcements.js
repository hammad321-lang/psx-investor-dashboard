export default function handler(req, res) {
    const { symbol } = req.query;
    const target = symbol ? symbol.toUpperCase() : "";
    return res.status(200).json([
        { title: `${target} Cash Payout Disclosed`, type: "Dividends" },
        { title: `${target} Notice of Board Meeting`, type: "Material Info" }
    ]);
}