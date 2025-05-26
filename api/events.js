const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3001;
const MEETUP_URL = 'https://www.meetup.com/cities/au/sydney/';

app.use(cors());
app.use(express.json());

const fetchEvents = async () => {
  try {
    console.log("Starting event scraping using JSON-LD...");
    const browser = await puppeteer.launch({
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(MEETUP_URL, { waitUntil: 'domcontentloaded', timeout: 0 });
    console.log("Page loaded...");

    const events = await page.evaluate(() => {
      const eventList = [];
      const ldJsonScripts = document.querySelectorAll('script[type="application/ld+json"]');

      ldJsonScripts.forEach((script) => {
        try {
          const jsonData = JSON.parse(script.textContent);
          // Check if the JSON data is an individual event or an array of events
          if (Array.isArray(jsonData)) {
            jsonData.forEach(item => {
              if (item['@type'] === 'Event' && item.name && item.url) {
                let imageUrls = [];
                if (item.image) {
                  if (Array.isArray(item.image)) {
                    imageUrls = item.image.map(img => {
                      if (img.startsWith('/')) {
                        return `https://secure.meetupstatic.com${img}`;
                      }
                      return img;
                    });
                  } else if (typeof item.image === 'string') {
                    if (item.image.startsWith('/')) {
                      imageUrls = [`https://secure.meetupstatic.com${item.image}`];
                    } else {
                      imageUrls = [item.image];
                    }
                  }
                }
                eventList.push({
                  id: item.url,
                  title: item.name,
                  date: item.startDate ? new Date(item.startDate).toLocaleDateString() : '',
                  time: item.startDate ? new Date(item.startDate).toLocaleTimeString() : '',
                  location: item.location?.address?.addressLocality || '',
                  images: imageUrls,
                  ticketUrl: item.url,
                  description: item.description || '',
                });
              }
            });
          } else if (jsonData && jsonData['@type'] === 'Event' && jsonData.name && jsonData.url) {
            let imageUrls = [];
            if (jsonData.image) {
              if (Array.isArray(jsonData.image)) {
                imageUrls = jsonData.image.map(img => {
                  if (img.startsWith('/')) {
                        return `https://secure.meetupstatic.com${img}`;
                      }
                      return img;
                    });
              } else if (typeof jsonData.image === 'string') {
                if (jsonData.image.startsWith('/')) {
                  imageUrls = [`https://secure.meetupstatic.com${jsonData.image}`];
                } else {
                  imageUrls = [jsonData.image];
                }
              }
            }
            eventList.push({
              id: jsonData.url,
              title: jsonData.name,
              date: jsonData.startDate ? new Date(jsonData.startDate).toLocaleDateString() : '',
              time: jsonData.startDate ? new Date(jsonData.startDate).toLocaleTimeString() : '',
              location: jsonData.location?.address?.addressLocality || '',
              images: imageUrls,
              ticketUrl: jsonData.url,
              description: jsonData.description || '',
            });
          }
        } catch (error) {
          console.error("Error parsing JSON-LD:", error);
        }
      });
      return eventList;
    });

    console.log("Scraped events:", events);
    await browser.close();
    return events;
  } catch (err) {
    console.error("Error scraping events:", err.message);
    throw new Error('Failed to fetch events');
  }
};

app.get('/api/events', async (req, res) => {
  try {
    const events = await fetchEvents();
    res.json(events);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper API running at http://localhost:${PORT}`);
});