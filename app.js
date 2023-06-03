require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.get('/track/:codigo', async (req, res) => {
  try {
    const merchantId = process.env.MERCHANT_ID;
    const token = process.env.TOKEN;
    const codigo = req.params.codigo;

    const endpointUrl = `https://yango-api.azurewebsites.net/api/track/${merchantId}/${codigo}/link?code=${token}`;

    const response = await axios.get(endpointUrl);
    if (response.status === 200) {
      const data = response.data;
      const link = data.link;

      if (link) {
        return res.redirect(link);
      }
    }

    return res.send('No se pudo redireccionar al enlace');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error interno del servidor');
  }
});

app.get('/', (req, res) => {
  res.send(`
    <form action="/track" method="post">
      <label for="codigo">Ingresa el número de orden:</label>
      <input type="text" id="codigo" name="codigo">
      <button type="submit">Enviar</button>
    </form>
  `);
});

app.post('/track', (req, res) => {
  const codigo = req.body.codigo;
  res.redirect(`/track/${codigo}`);
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
