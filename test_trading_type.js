const puppeteer = require('puppeteer-core');

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new'
        });
        const page = await browser.newPage();
        
        await page.goto('http://127.0.0.1:8080', { waitUntil: 'load', timeout: 5000 });
        await new Promise(r => setTimeout(r, 1000));
        
        const type = await page.evaluate(() => {
            return typeof window.renderTradingCardsView;
        });
        console.log("Type of renderTradingCardsView:", type);

        await browser.close();
    } catch (err) {
        console.error("error:", err);
        process.exit(1);
    }
})();
