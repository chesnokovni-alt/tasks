const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Загрузка данных из файла
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Ошибка загрузки данных:', err);
  }
  return null;
}

// Сохранение данных в файл
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Ошибка сохранения данных:', err);
    return false;
  }
}

// GET /api/data - получить сохранённые данные
app.get('/api/data', (req, res) => {
  const data = loadData();
  if (data) {
    res.json({ success: true, data });
  } else {
    res.json({ success: false, message: 'Нет сохранённых данных' });
  }
});

// POST /api/data - сохранить данные
app.post('/api/data', (req, res) => {
  const newData = req.body;
  if (saveData(newData)) {
    res.json({ success: true, message: 'Данные успешно сохранены' });
  } else {
    res.status(500).json({ success: false, message: 'Ошибка сохранения' });
  }
});

// DELETE /api/data - удалить сохранённые данные
app.delete('/api/data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
    res.json({ success: true, message: 'Данные удалены' });
  } catch (err) {
    console.error('Ошибка удаления данных:', err);
    res.status(500).json({ success: false, message: 'Ошибка удаления' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Данные сохраняются в файл: data.json');
});
