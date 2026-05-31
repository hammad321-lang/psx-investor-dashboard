export default function handler(req, res) {
    const { symbol } = req.query;
    const companies = {
        "ENGRO": {
            name: "Engro Corporation Limited", symbol: "ENGRO", sector: "Fertilizer / Conglomerate", price: 340.50, pe: "8.09", bookValue: "210.00", pb: "1.62", yield: "12.5",
            overview: { what: "Conglomerate managing deep assets across Pakistan.", revenue: "Fertilizers, energy, polymer, and terminal logistics.", position: "Market leader with strong multi-industry moats." },
            quality: { business: "Excellent", dividend: "High", debt: "Stable", valuation: "Undervalued" }
        },
        "SYS": {
            name: "Systems Limited", symbol: "SYS", sector: "Technology", price: 415.00, pe: "14.61", bookValue: "95.00", pb: "4.37", yield: "2.1",
            overview: { what: "Premier technical house providing software export operations.", revenue: "Global software provisioning billing in USD.", position: "Top tier tech exporter." },
            quality: { business: "Exceptional", dividend: "Low Payout", debt: "Zero Debt", valuation: "Premium" }
        }
    };
    const target = symbol ? symbol.toUpperCase() : "";
    if (companies[target]) return res.status(200).json(companies[target]);
    return res.status(404).json({ error: "Company not found" });
}