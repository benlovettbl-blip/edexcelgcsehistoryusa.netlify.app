const puppeteer = require('puppeteer-core');

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new'
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        
        await page.goto('http://127.0.0.1:8080', { waitUntil: 'load', timeout: 5000 });
        await new Promise(r => setTimeout(r, 3000));
        
        await page.screenshot({ path: 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\64e7abdd-b49b-4734-ab5c-04d1694afb55\\screenshot_dash_check.png' });

        await browser.close();
    } catch (err) {
        console.error("error:", err);
        process.exit(1);
    }
})();
