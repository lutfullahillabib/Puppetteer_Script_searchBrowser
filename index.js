const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const searchQuery = await getInput();

  await page.goto(`https://www.google.com/search?q=${searchQuery}`);

  await page.waitForSelector("h3");

  const results = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll("h3").forEach((title) => {
      const link = title.parentElement.href;
      const description = title.parentElement.nextElementSibling
        ? title.parentElement.nextElementSibling.innerText
        : "";
      results.push({ title: title.innerText, link, description });
    });
    return results;
  });

  results.forEach((result) => {
    console.log(`Title: ${result.title}`);
    console.log(`Link: ${result.link}`);
    console.log(`Description: ${result.description}\n`);
  });

  await browser.close();
})();

async function getInput() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    readline.question("Type search keyword: ", (answer) => {
      resolve(answer);
      readline.close();
    });
  });
}


