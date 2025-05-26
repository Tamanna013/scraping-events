# 🎉 Sydney Events Scraper & Web App

A full-stack web application that scrapes events from [Meetup.com - Sydney](https://www.meetup.com/cities/au/sydney/) using Puppeteer, exposes them through an Express API, and displays them beautifully in a Next.js frontend.

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sydney-events
cd sydney-events
```


### 2. Start the Backend (Express + Puppeteer)

```bash
npm install
cd api
node index.js
```

📍 By default, runs on `http://localhost:3001/api/events`

---

### 3. Start the Frontend (Next.js)

```bash
npm install
npm run dev
```

📍 Runs on `http://localhost:3000`

Make sure the backend server is running to fetch events.


## Tech Stack

* **Frontend**: Next.js 13+, Tailwind CSS, Framer Motion, ShadCN UI
* **Backend**: Node.js, Express.js, Puppeteer
* **Deployment**: Vercel (Frontend), Render/Localhost (Backend)
