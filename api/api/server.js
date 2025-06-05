const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

function calculatePremium({ year, make, model, driverAge, licenseDuration }) {
  // Lógica de cálculo de seguro
  let premium = 1000.0; // Prêmio base

  // Ajuste pelo ano do veículo
  if (year < 2000) {
    premium += 500;
  } else if (year < 2010) {
    premium += 200;
  } else if (year > 2020) {
    premium += 150; // Carros mais novos podem ter seguro um pouco mais alto inicialmente
  }

  // Ajuste pela idade do condutor
  if (driverAge < 25) {
    premium += 300; // Condutores mais jovens tendem a pagar mais
  } else if (driverAge > 60) {
    premium += 200; // Condutores mais velhos também podem ter um acréscimo
  }

  // Ajuste pelo tempo de habilitação
  if (licenseDuration < 2) {
    premium += 150; // Menos tempo de habilitação, prêmio maior
  } else if (licenseDuration >= 10) {
    premium -= 100; // Mais tempo de habilitação, possível desconto
  }

  // Ajuste pelo modelo do veículo (exemplo)
  const modelLowerCase = model.toLowerCase();
  if (modelLowerCase.includes('sport') || modelLowerCase.includes('suv')) {
    premium += 250; // Modelos esportivos ou SUVs podem ter prêmio maior
  }
  if (modelLowerCase === 'gol' || modelLowerCase === 'palio') {
    premium += 50; // Modelos populares podem ter leve acréscimo devido a roubos
  }

  // Garantir que o prêmio não seja negativo após descontos
  premium = Math.max(premium, 200); // Um prêmio mínimo
  return premium;
}

// Rota de boas-vindas para o prefixo /seguroauto/
app.get('/seguroauto/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Cálculo de Seguro Automotivo com Node.js!' });
});

// Rota para cálculo do seguro
app.post('/seguroauto/quote/', (req, res) => {
  const { year, make, model, driverAge, licenseDuration } = req.body;

  // Validação básica dos dados de entrada
  if (!year || !make || !model || driverAge === undefined || licenseDuration === undefined) {
    return res.status(400).json({ error: 'Ano, marca, modelo do veículo, idade do condutor e tempo de habilitação são obrigatórios.' });
  }

  if (typeof year !== 'number' || typeof driverAge !== 'number' || typeof licenseDuration !== 'number') {
    return res.status(400).json({ error: 'Ano, idade do condutor e tempo de habilitação devem ser números.' });
  }

  if (driverAge < 18) {
    return res.status(400).json({ error: 'O condutor deve ter no mínimo 18 anos.' });
  }

  if (licenseDuration < 0) {
    return res.status(400).json({ error: 'O tempo de habilitação não pode ser negativo.' });
  }

  if (driverAge - licenseDuration < 18) {
    return res.status(400).json({ error: 'Tempo de habilitação inconsistente com a idade do condutor.' });
  }

  const premium = calculatePremium({ year, make, model, driverAge, licenseDuration });

  res.json({
    vehicle: {
      year,
      make,
      model
    },
    driverInfo: {
        driverAge,
        licenseDuration
    },
    premium
  });
});

// Para permitir o uso da função calculatePremium em testes
if (process.env.NODE_ENV === 'test') {
  module.exports = { app, calculatePremium };
} else {
  app.listen(port, () => {
    console.log(`Servidor da API rodando na porta ${port}`);
  });
} 