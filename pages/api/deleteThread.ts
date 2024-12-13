import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`[DEBUG] Request method: ${req.method}`);
    console.log(`[DEBUG] Request body:`, req.body);

    if (req.method === 'DELETE') {
        const { threadId } = req.body;

        // バリデーション: 必須項目の確認
        if (!threadId) {
            console.error(`[ERROR] Invalid request body:`, req.body);
            return res.status(400).json({
                message: 'Invalid Request',
                details: 'threadId is required.',
            });
        }

        try {
            // Azure Functions にリクエストを転送
            const response = await fetch('https://nextjs-functions-appllkmnjc35s.azurewebsites.net/api/deleteThread', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    threadId
                }),
            });

            if (!response.ok) {
                throw new Error(`Azure Functions returned ${response.status}`);
            }

            const data = await response.json();
            return res.status(200).json({
                message: 'Thread Deleted',
                deletedThread: data.deletedThread
            });

        } catch (error) {
            console.error(`[ERROR] Failed to process request:`, error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error.message,
            });
        }
    } else {
        console.error(`[ERROR] Method Not Allowed: ${req.method}`);
        return res.status(405).json({
            message: 'Method Not Allowed',
            allowedMethods: ['DELETE'],
        });
    }
}