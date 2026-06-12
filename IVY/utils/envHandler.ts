export interface EnvironmentConfig {
    baseUrl: string;
    testAccount: string;
    testPass: string; // This will be Gmail's 16-character App Password
}

// Environment configuration for IVY
const environments: Record<string, EnvironmentConfig> = {
    staging: {
        baseUrl: 'https://staging.saas.ivy.com/insights',
        testAccount: 'ivyqa26@gmail.com',
        testPass: 'gggaqiuepfsksecd'
    }
};

const activeEnv = process.env.ENV || 'staging'; // Defaults to staging if not passed from terminal

const envKey = activeEnv.toLowerCase();
const resolvedConfig = environments[envKey];

if (!resolvedConfig) {
    throw new Error(`❌ Configuration for environment '${activeEnv}' not found!`);
}

export default resolvedConfig;
