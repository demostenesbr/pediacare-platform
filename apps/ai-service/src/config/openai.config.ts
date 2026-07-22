export const openaiConfig = {
    apiKeyConfigured: Boolean(process.env.OPENAI_API_KEY),
    baseUrl: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
};