export default async function handler(req, res) {
    const { plaque, mileage, age, mode } = req.query;

    if (!plaque || !mileage || !age || !mode) {
        return res.status(400).json({
            error: 'Paramètres requis : plaque, mileage (km), age (mois), mode (top3, next, etc.)',
        });
    }

    const apiUrl = 'https://api.afteriize.com/9051a843d11f4450b7e233e2ce5fb283';

    try {
        const response = await fetch(
            `${apiUrl}?reg_or_vin=${encodeURIComponent(plaque)}&reg_country=fr&country=fr&mileage=${mileage}&age=${age}&mode=${mode}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: 'ba8ff9ec0a95b2115e2bb49f20b821b6', // clé directement ici pour test
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data?.message || 'Erreur API' });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Erreur API Afteriize :', error);
        return res.status(500).json({ error: 'Erreur serveur interne' });
    }
}