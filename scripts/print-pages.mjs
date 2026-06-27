import puppeteer from 'puppeteer';

let printOptionKey = process.env.PRINT_OPTION;
let accessToken = process.env.ACCESS_TOKEN;

if (!printOptionKey || !accessToken) {
  throw new Error("Must specify PRINT_OPTION and ACCESS_TOKEN");
}

const PRINT_OPTIONS = {
    'scenes': {
        'tab': 'locations',
        'idName': 'sceneId',
        'name': 'scene',
    },
    'filmDays': {
        'tab': 'film-days',
        'idName': 'filmDayId',
        'name': 'day',
    }
};

const printOption = PRINT_OPTIONS[printOptionKey];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--disable-blink-features=AutomationControlled']
});

const page = await browser.newPage()
page.on('console', msg => {
  console.log("PAGE: ", msg.text());
});
const navigationPromise = page.waitForNavigation()
await page.goto(`https://alanblakeproductions.com/shotmaker/ballad-of-the-night-owl?tab=${printOption['tab']}`);

await page.waitForSelector('div.uk-navbar-left')
const evaluate = await page.evaluate((accessToken) => {
  localStorage.setItem('shotmaker.access-token', accessToken);
}, accessToken);

await page.reload({ waitUntil: 'networkidle2' });

await page.waitForSelector('li.scene-list-item', { timeout: 5000 })

let allAnchorsList = await page.evaluate((selector) => {
  const anchors = Array.from(document.querySelectorAll("li.scene-list-item a"));
  return anchors.map(a => a.href);
});
let allAnchors = [...new Set(allAnchorsList)];
console.log("ALL ANCHORS");
console.log(allAnchors);

for (const url of allAnchors) {
  console.log(url);
  let entityId = new URL(url).searchParams.get(printOption['idName']);
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle0'
  });

  const numPages = await page.evaluate(() => {
    // Assuming standard 8.5" x 11" with 96 DPI, or use your specific CSS rules
    const pageHeight = 11 * 96;
    const totalHeight = document.documentElement.scrollHeight;
    return Math.ceil(totalHeight / pageHeight);
  });

  await page.pdf({
    path: `botno-${printOption['name']}-${entityId}.pdf`,
    format: 'Letter',
    pageRanges: numPages == 1 ? '1' : '2-',
    printBackground: true
  });
  console.log("COMPLETE");

  await page.close();
}

await browser.close();
