"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
exports.getConfig = getConfig;
exports.validateEnv = validateEnv;
var zod_1 = require("zod");
var config = null;
function getConfig() {
    if (config)
        return config;
    config = {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        youtubeApiKey: process.env.NEXT_PUBLIC_YT_API_KEY || '',
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        openaiOrganizationId: process.env.OPENAI_ORGANIZATION_ID || '',
        sessionSecret: process.env.SESSION_SECRET || 'default-secret-key'
    };
    return config;
}
exports.envSchema = zod_1.z.object({
    // Required for YouTube API
    NEXT_PUBLIC_YT_API_KEY: zod_1.z.string().min(1, 'YouTube API Key is required'),
    // Required for OpenAI API
    OPENAI_API_KEY: zod_1.z.string().min(1, 'OpenAI API Key is required'),
    OPENAI_ORGANIZATION_ID: zod_1.z.string().min(1, 'OpenAI Organization ID is required'),
    // Optional environment variables
    NEXT_PUBLIC_BASE_URL: zod_1.z.string().optional(),
    SESSION_SECRET: zod_1.z.string().optional()
});
// Validate environment variables
function validateEnv() {
    var parsedEnv = exports.envSchema.safeParse(process.env);
    if (!parsedEnv.success) {
        console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables');
    }
    return parsedEnv.data;
}
