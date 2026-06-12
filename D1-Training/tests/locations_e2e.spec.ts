import { test, expect } from '../fixtures/testBase';

test.describe('D1 Training - Location Smoke Test @smoke', () => {

    test('Verify Map Zoom and Location Search functionality', async ({ locationsPage }) => {
        // 1. Navigate to Location Page
        await locationsPage.navigateToLocations();

        // 2. Search for specifically requested location data
        const searchData = 'D1 Training Site 1 Demo';
        await locationsPage.searchLocation(searchData);

        // 3. Zoom Map In / Out
        await locationsPage.interactWithMapZoom();

        // 4. Click Go to this Location Page
        await locationsPage.navigateToLocationDetail();
    });

});
