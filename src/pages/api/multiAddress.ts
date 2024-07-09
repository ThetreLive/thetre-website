import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch('http://13.200.213.161:3000/multiaddress');
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}