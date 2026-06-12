import fs from 'fs';
import path from 'path';

async function globalTeardown() {
    const allureResultsDir = path.resolve(__dirname, '../allure-results');
    
    // Ensure directory exists meaning tests finished and allure generated its logs
    if (fs.existsSync(allureResultsDir)) {
        const executorData = {
            name: "Hani-Offspring", // the active operator string
            type: "Local CLI Execution",
            buildOrder: 1,
            buildName: `Playwright E2E Run on ${process.env.ENV?.toUpperCase() || 'STAGING'}`,
            reportName: "D1 Training Premium Allure Report",
            reportUrl: "http://localhost:8080" // or Jenkins/GitHub Action URL
        };
        
        fs.writeFileSync(
            path.join(allureResultsDir, 'executor.json'),
            JSON.stringify(executorData, null, 2)
        );
        console.log("✅ Injected Custom Executor info into Allure!");
    }
}

export default globalTeardown;
