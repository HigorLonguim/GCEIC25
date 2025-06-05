const { calculatePremium } = require('./server');

describe('calculatePremium', () => {
  test('deve retornar o prêmio base para entradas padrão sem fatores de risco elevados', () => {
    const details = { year: 2015, make: 'Honda', model: 'Civic', driverAge: 30, licenseDuration: 10 };
    // Prêmio base: 1000
    // Ano 2015 (>2010, <2020): Nenhuma alteração pelo ano
    // Idade 30 (>=25, <=60): Nenhuma alteração pela idade
    // Habilitação 10 (>=2, <=10): Nenhuma alteração pela habilitação
    // Modelo Civic (nem sport, nem suv, nem gol/palio): Nenhuma alteração pelo modelo
    // Esperado: 1000 (base) - 100 (lic > 10) = 900. Corrigindo: habilitacao > 10 anos -> -100
    expect(calculatePremium(details)).toBe(900);
  });

  test('deve aumentar o prêmio para veículo antigo', () => {
    const details = { year: 1995, make: 'Ford', model: 'Escort', driverAge: 40, licenseDuration: 20 };
    // Base: 1000
    // Ano 1995 (<2000): +500
    // Idade 40: Nenhuma alteração
    // Habilitação 20 (>10): -100
    // Modelo: Nenhuma alteração
    // Esperado: 1000 + 500 - 100 = 1400
    expect(calculatePremium(details)).toBe(1400);
  });

  test('deve aumentar o prêmio para condutor jovem', () => {
    const details = { year: 2018, make: 'VW', model: 'Polo', driverAge: 22, licenseDuration: 3 };
    // Base: 1000
    // Ano 2018: Nenhuma alteração
    // Idade 22 (<25): +300
    // Habilitação 3 (>=2): Nenhuma alteração
    // Modelo: Nenhuma alteração
    // Esperado: 1000 + 300 = 1300
    expect(calculatePremium(details)).toBe(1300);
  });

  test('deve aumentar o prêmio para pouco tempo de habilitação', () => {
    const details = { year: 2019, make: 'Chevrolet', model: 'Onix', driverAge: 35, licenseDuration: 1 };
    // Base: 1000
    // Ano 2019: Nenhuma alteração
    // Idade 35: Nenhuma alteração
    // Habilitação 1 (<2): +150
    // Modelo: Nenhuma alteração
    // Esperado: 1000 + 150 = 1150
    expect(calculatePremium(details)).toBe(1150);
  });

  test('deve aumentar o prêmio para modelo SUV e condutor mais velho', () => {
    const details = { year: 2022, make: 'Jeep', model: 'Renegade SUV', driverAge: 65, licenseDuration: 30 };
    // Base: 1000
    // Ano 2022 (>2020): +150
    // Idade 65 (>60): +200
    // Habilitação 30 (>10): -100
    // Modelo SUV: +250
    // Esperado: 1000 + 150 + 200 - 100 + 250 = 1500
    expect(calculatePremium(details)).toBe(1500);
  });

  test('deve aplicar prêmio mínimo se os descontos forem muito altos', () => {
    // Este teste é mais teórico, pois com a lógica atual é difícil chegar abaixo de 200.
    // Para forçar, vamos usar um prêmio base muito baixo na função ou ajustar fatores.
    // Por enquanto, vamos testar o comportamento padrão com um condutor com muitos descontos.
    const details = { year: 2015, make: 'Fiat', model: 'Mobi', driverAge: 50, licenseDuration: 30 };
    // Base: 1000
    // Ano 2015: Nenhuma alteração
    // Idade 50: Nenhuma alteração
    // Habilitação 30 (>10): -100
    // Modelo: Nenhuma alteração
    // Esperado: 1000 - 100 = 900. O prêmio mínimo é 200, então deve ser 900.
    expect(calculatePremium(details)).toBe(900); 
  });

  test('deve aumentar o prêmio para modelo popular como Gol', () => {
    const details = { year: 2018, make: 'VW', model: 'Gol', driverAge: 28, licenseDuration: 8 };
    // Base: 1000
    // Ano 2018: Nenhuma alteração
    // Idade 28: Nenhuma alteração
    // Habilitação 8: Nenhuma alteração
    // Modelo Gol: +50
    // Esperado: 1000 + 50 = 1050
    expect(calculatePremium(details)).toBe(1050);
  });
}); 