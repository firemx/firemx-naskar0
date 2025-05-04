// /backend/services/pdfService.js
const puppeteer = require('puppeteer');
const path = require('path');

const generateTicketPDF = async (event, user) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const templatePath = path.resolve(__dirname, '../templates/ticketTemplate.html');

  const html = require('fs').readFileSync(templatePath, 'utf-8')
    .replace('{{eventTitle}}', event.title)
    .replace('{{eventDate}}', new Date(event.start_date).toLocaleString())
    .replace('{{location}}', event.location)
    .replace('{{fullName}}', user.full_name)
    .replace('{{email}}', user.email);

  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();

  return pdfBuffer;
};

module.exports = { generateTicketPDF };