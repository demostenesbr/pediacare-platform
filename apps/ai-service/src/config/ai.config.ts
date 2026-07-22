export const aiConfig = {
    model: process.env.AI_MODEL ?? 'gpt-4.1-mini',
    temperature: Number(process.env.AI_TEMPERATURE ?? 0.2),
};