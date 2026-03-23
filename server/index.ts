import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Intentionally annoying middleware
app.use((req, res, next) => {
  // Random delay between 500ms and 5000ms
  const delay = Math.random() * 4500 + 500;
  
  // 10% chance for a malicious redirect loop
  if (Math.random() < 0.1) {
    const redirectCount = parseInt(req.query.rc as string || '0');
    if (redirectCount < 20) {
      setTimeout(() => {
        res.redirect(`${req.url.split('?')[0]}?rc=${redirectCount + 1}`);
      }, 300);
      return;
    }
  }

  // 15% chance to just fail randomly with malformed keys (zero-width space)
  if (Math.random() < 0.15) {
    setTimeout(() => {
      res.status(503).json({ "e\u200Brror": 'Oops! Our servers tripped over a wire.' });
    }, delay);
    return;
  }

  // 10% chance to send an incorrect Content-Length to hang the browser
  if (Math.random() < 0.1) {
    setTimeout(() => {
       res.setHeader('Content-Length', '99999');
       res.status(200).write('{"message": "Wait for the rest..."'); // never finishes the stream
       // We intentionally don't call res.end()
    }, delay);
    return;
  }
  
  setTimeout(() => next(), delay);
});

app.get('/api/annoy', (req, res) => {
  res.json({ message: 'Why did you even click this? It took forever.' });
});

app.post('/api/submit', (req, res) => {
  const { data } = req.body;
  if (Math.random() < 0.5) {
     res.status(400).json({ error: 'Validation failed. The vibes were off.' });
  } else {
     res.json({ message: `Successfully saved: ${data}. Just kidding, it was discarded.` });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Annoying server running on port ${PORT}`);
});
