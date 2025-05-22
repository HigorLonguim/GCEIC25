const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.')); 

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

function validarCNH(cnh) {
  cnh = cnh.replace(/\D/g, '');

  if (cnh.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cnh)) return false;

  const numeros = cnh.split('').map(n => parseInt(n));

  let soma = 0;
  let peso = 9;
  for (let i = 0; i < 9; i++) {
    soma += numeros[i] * peso;
    peso--;
  }
  let digito1 = soma % 11;
  if (digito1 >= 10) digito1 = 0;

  soma = 0;
  peso = 1;
  for (let i = 0; i < 9; i++) {
    soma += numeros[i] * peso;
    peso++;
  }
  let digito2 = soma % 11;
  if (digito2 >= 10) digito2 = 0;

  return digito1 === numeros[9] && digito2 === numeros[10];
}

function calculatePremium(details) {
  let premium = 1000;

  // Validação básica dentro da função (opcional)
  if (typeof details.year !== 'number' || details.year < 1900) {
    throw new Error('Ano do veículo inválido');
  }
  if (typeof details.driverAge !== 'number' || details.driverAge <= 0) {
    throw new Error('Idade do motorista inválida');
  }
  if (typeof details.licenseDuration !== 'number' || details.licenseDuration < 0) {
    throw new Error('Tempo de habilitação inválido');
  }
  if (typeof details.model !== 'string' || details.model.trim() === '') {
    throw new Error('Modelo do veículo inválido');
  }

  // Ajuste pelo ano do veículo
  if (details.year < 2000) {
    premium += 500;
  } else if (details.year > 2020) {
    premium += 150;
  }

  // Ajuste pela idade do motorista
  if (details.driverAge < 25) {
    premium += 300;
  } else if (details.driverAge > 60) {
    premium += 200;
  }

  // Ajuste pelo tempo de habilitação
  if (details.licenseDuration < 2) {
    premium += 150;
  } else if (details.licenseDuration > 10) {
    premium -= 100;
  }

  // Ajuste pelo modelo do veículo
  const modelLower = details.model.toLowerCase();
  if (modelLower.includes('suv')) {
    premium += 250;
  } else if (modelLower.includes('gol') || modelLower.includes('palio')) {
    premium += 50;
  }

  // Prêmio mínimo
  if (premium < 200) premium = 200;

  return premium;
}


app.post('/seguro/calcular', (req, res) => {
  const { model, year, driverAge, licenseDuration } = req.body;

  if (!model || !year || !driverAge || !licenseDuration) {
    return res.status(400).json({ 
      sucesso: false, 
      mensagem: "Dados incompletos. Envie: model, year, driverAge, licenseDuration." 
    });
  }

  const premio = calculatePremium({ model, year, driverAge, licenseDuration });

  res.json({
    sucesso: true,
    premio,
    mensagem: ` Prêmio calculado: R$ ${premio.toFixed(2)}`
  });
});

app.get('/cpf/validar/:numero', (req, res) => {
  const numero = req.params.numero;

  if (!numero || numero.length !== 11) {
    return res.status(400).json({ valido: false, mensagem: "Número de CPF inválido (esperado 11 dígitos)." });
  }

  const valido = validarCPF(numero);
  res.json({
    numero,
    valido,
    mensagem: valido ? "✅ CPF válido" : "❌ CPF inválido"
  });
});

app.get('/cnh/validar/:numero', (req, res) => {
  const numero = req.params.numero;

  if (!numero || numero.length !== 11) {
    return res.status(400).json({ valido: false, mensagem: "Número de CNH inválido (esperado 11 dígitos)." });
  }

  const valido = validarCNH(numero);
  res.json({
    numero,
    valido,
    mensagem: valido ? "✅ CNH válida" : "❌ CNH inválida"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
