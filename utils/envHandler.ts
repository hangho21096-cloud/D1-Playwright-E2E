export interface EnvironmentConfig {
    baseUrl: string;
    apiEndpoint: string;
    testAccount: string;
    testPass: string;
}

// 1. Store configs in objects mapped by environment string
const environments: Record<string, EnvironmentConfig> = {
    staging: {
        baseUrl: 'https://staging.d1training.com/',
        apiEndpoint: 'https://api-staging.d1training.com',
        testAccount: 'hani+1@offspringdigital.com',
        testPass: '123456qQ@'
    },
    prod: {
        baseUrl: 'https://www.d1training.com/',
        apiEndpoint: 'https://api.d1training.com',
        testAccount: 'hani@offspringdigital.com',
        testPass: '123456qQ@'
    }
};

// 2. Extract ENV securely from the terminal process (e.g. `ENV=staging npx playwright test`)
const activeEnv = process.env.ENV;

// 3. Fail fast if no environment was specified
if (!activeEnv) {
    throw new Error("❌ BOMB: Missing 'ENV' system variable! You must specify an environment. Example: ENV=staging npx playwright test");
}

// Ensure case insensitivity
const envKey = activeEnv.toLowerCase();
const resolvedConfig = environments[envKey];

// 4. Fail fast if the environment string doesn't match our config keys
if (!resolvedConfig) {
    throw new Error(`❌ BOMB: Invalid Environment '${activeEnv}' specified! Valid options are: [${Object.keys(environments).join(', ')}]`);
}

// 5. Instantly export the resolved object for tests to consume dynamically
export default resolvedConfig;
