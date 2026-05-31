export default function handler(req, res) {
    const { symbol } = req.query;
    const target = symbol ? symbol.toUpperCase() : "";
    const shariahList = { "ENGRO": true, "SYS": true };
    return res.status(200).json({ symbol: target, isCompliant: !!shariahList[target] });
}