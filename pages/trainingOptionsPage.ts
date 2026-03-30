import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class TrainingOptionsPage extends BasePage {
    // 7-12 Age Group Training
    readonly scholasticGroupTrainingBtn: Locator;
    readonly scholasticPersonalTrainingBtn: Locator;
    readonly scholasticSmallGroupTrainingBtn: Locator;
    
    // Pro Training
    readonly collegiateProTrainingBtn: Locator;
    
    // Adult Training
    readonly adultGroupTrainingBtn: Locator;
    readonly adultPersonalTrainingBtn: Locator;
    readonly adultSmallGroupTrainingBtn: Locator;
    
    // Special
    readonly teamTrainingBtn: Locator;
    readonly d1OnCampusBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.scholasticGroupTrainingBtn = page.getByRole('button', { name: 'Group Training' }).first();
        this.scholasticPersonalTrainingBtn = page.getByRole('button', { name: 'Personal Training' }).first();
        this.scholasticSmallGroupTrainingBtn = page.getByRole('button', { name: 'Small Group Training' }).first();
        
        this.collegiateProTrainingBtn = page.getByRole('button', { name: 'collegiate & PRO TRAINING' });
        
        this.adultGroupTrainingBtn = page.getByRole('button', { name: 'Group Training' }).nth(2);
        this.adultPersonalTrainingBtn = page.getByRole('button', { name: 'Personal Training' }).nth(1);
        this.adultSmallGroupTrainingBtn = page.getByRole('button', { name: 'Small Group Training' }).nth(1);
        
        this.teamTrainingBtn = page.getByRole('button', { name: 'Team Training' });
        this.d1OnCampusBtn = page.getByRole('button', { name: 'D1 On Campus' });
    }

    async exploreScholasticTraining() {
        await this.scholasticGroupTrainingBtn.click();
        await this.scholasticPersonalTrainingBtn.click();
        await this.scholasticSmallGroupTrainingBtn.click();
    }

    async exploreProTraining() {
        await this.collegiateProTrainingBtn.click();
    }

    async exploreAdultTraining() {
        await this.adultGroupTrainingBtn.click();
        await this.adultPersonalTrainingBtn.click();
        await this.adultSmallGroupTrainingBtn.click();
        await this.teamTrainingBtn.click();
        await this.d1OnCampusBtn.click();
    }
}
