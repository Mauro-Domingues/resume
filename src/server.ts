import express from 'express';
import path from 'path';
import { RegisterTemplateService } from './services/RegisterTemplateService';
import { PDFService } from './services/PDFService';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false); // Desabilita cache em desenvolvimento

app.use(express.static(path.resolve(__dirname, '..', 'public')));

function convertDates(obj: any) {
  if (!obj || typeof obj !== 'object') return;

  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (val && typeof val === 'object') {
      convertDates(val);
    }
    if (key === 'startsAt' || key === 'endsAt') {
      if (typeof val === 'string' || typeof val === 'number') {
        obj[key] = new Date(val);
      }
    }
  });
}

app.get('/', (_req, res) => {
  res.render('index');
});

app.post('/api/render', (req, res) => {
  try {
    const variables = req.body;
    convertDates(variables);

    const register = new RegisterTemplateService();
    const html = register.getContent(variables);

    res.type('html').send(html);
  } catch (err) {
    // minimal error handling
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/pdf', async (req, res) => {
  try {
    const variables = req.body;
    convertDates(variables);

    const register = new RegisterTemplateService();
    console.log('Generating PDF with variables:', JSON.stringify(variables, null,2))
    const html = register.getContent(variables);

    const pdfService = new PDFService();
    const pdf = await pdfService.generate({ template: html });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.send(Buffer.from(pdf));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://localhost:${port}`);
});
