import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'screens/sobre_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/forgotpassword_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'API Hub',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/splash',
      routes: {
        '/splash': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/forgotpassword': (context) => const ForgotPasswordScreen(),
        '/home': (context) => const HomeScreen(),
        '/cpf': (context) => const CPFScreen(),
        '/cnh': (context) => const CNHScreen(),
        '/calculate-premium': (context) => const CalculatePremiumScreen(),
        '/sobre_screen': (context) => const SobreScreen(),
      },

    );
  }
}


class CPFScreen extends StatefulWidget {
  const CPFScreen({super.key});
  @override
  State<CPFScreen> createState() => _CPFScreenState();
}

class _CPFScreenState extends State<CPFScreen> {
  final TextEditingController _cpfController = TextEditingController();
  String _mensagem = '';
  bool _loading = false;

  Future<void> _validarCPF() async {
    final cpf = _cpfController.text.trim();
    if (cpf.isEmpty) {
      setState(() {
        _mensagem = 'Digite um CPF.';
      });
      return;
    }
    setState(() {
      _loading = true;
      _mensagem = '';
    });
    final url = Uri.parse('http://localhost:3000/cpf/validar/$cpf');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _mensagem = data['mensagem'] ?? 'CPF válido.';
        });
      } else {
        setState(() {
          _mensagem = 'CPF inválido ou erro no servidor.';
        });
      }
    } catch (e) {
      setState(() {
        _mensagem = 'Erro de conexão: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Validar CPF')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _cpfController,
              decoration: const InputDecoration(labelText: 'Digite o CPF'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _loading ? null : _validarCPF,
              child: _loading
                  ? const CircularProgressIndicator()
                  : const Text('Validar CPF'),
            ),
            const SizedBox(height: 20),
            Text(
              _mensagem,
              style: const TextStyle(color: Colors.blue),
            ),
          ],
        ),
      ),
    );
  }
}

class CNHScreen extends StatefulWidget {
  const CNHScreen({super.key});
  @override
  State<CNHScreen> createState() => _CNHScreenState();
}

class _CNHScreenState extends State<CNHScreen> {
  final TextEditingController _cnhController = TextEditingController();
  String _mensagem = '';
  bool _loading = false;

  Future<void> _validarCNH() async {
    final cnh = _cnhController.text.trim();
    if (cnh.isEmpty) {
      setState(() {
        _mensagem = 'Digite o número da CNH.';
      });
      return;
    }
    setState(() {
      _loading = true;
      _mensagem = '';
    });
    final url = Uri.parse('http://localhost:3000/api/cnh-validator/validate-cnh');
    try {
      final response = await http.post(url,
          body: jsonEncode({'cnhNumber': cnh}),
          headers: {'Content-Type': 'application/json'});
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _mensagem = data['isValid'] == true ? 'CNH válida.' : 'CNH inválida.';
        });
      } else {
        setState(() {
          _mensagem = 'CNH inválida ou erro no servidor.';
        });
      }
    } catch (e) {
      setState(() {
        _mensagem = 'Erro de conexão: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Validar CNH')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _cnhController,
              decoration:
              const InputDecoration(labelText: 'Digite o número da CNH'),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _loading ? null : _validarCNH,
              child: _loading
                  ? const CircularProgressIndicator()
                  : const Text('Validar CNH'),
            ),
            const SizedBox(height: 20),
            Text(
              _mensagem,
              style: const TextStyle(color: Colors.blue),
            ),
          ],
        ),
      ),
    );
  }
}

class CalculatePremiumScreen extends StatefulWidget {
  const CalculatePremiumScreen({super.key});
  @override
  State<CalculatePremiumScreen> createState() => _CalculatePremiumScreenState();
}

class _CalculatePremiumScreenState extends State<CalculatePremiumScreen> {
  final TextEditingController _yearController = TextEditingController();
  final TextEditingController _makeController = TextEditingController();
  final TextEditingController _modelController = TextEditingController();
  final TextEditingController _driverAgeController = TextEditingController();
  final TextEditingController _licenseDurationController =
  TextEditingController();
  String _mensagem = '';
  bool _loading = false;

  Future<void> _calcularSeguro() async {
    final year = int.tryParse(_yearController.text.trim());
    final make = _makeController.text.trim();
    final model = _modelController.text.trim();
    final driverAge = int.tryParse(_driverAgeController.text.trim());
    final licenseDuration = int.tryParse(_licenseDurationController.text.trim());
    if (year == null ||
        make.isEmpty ||
        model.isEmpty ||
        driverAge == null ||
        licenseDuration == null) {
      setState(() {
        _mensagem = 'Preencha todos os campos corretamente.';
      });
      return;
    }
    setState(() {
      _loading = true;
      _mensagem = '';
    });
    final url = Uri.parse('http://localhost:3000/api/calculate-premium');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'year': year,
          'make': make,
          'model': model,
          'driverAge': driverAge,
          'licenseDuration': licenseDuration,
        }),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _mensagem = 'Prêmio calculado: R\$ ${data['premio']}';
        });
      } else {
        setState(() {
          _mensagem = 'Erro ao calcular o seguro.';
        });
      }
    } catch (e) {
      setState(() {
        _mensagem = 'Erro de conexão: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Calcular Seguro')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextField(
                controller: _yearController,
                decoration: const InputDecoration(labelText: 'Ano do Veículo'),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _makeController,
                decoration: const InputDecoration(labelText: 'Marca'),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _modelController,
                decoration: const InputDecoration(labelText: 'Modelo'),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _driverAgeController,
                decoration: const InputDecoration(labelText: 'Idade do Motorista'),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _licenseDurationController,
                decoration:
                const InputDecoration(labelText: 'Tempo de CNH (anos)'),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _loading ? null : _calcularSeguro,
                child: _loading
                    ? const CircularProgressIndicator()
                    : const Text('Calcular Seguro'),
              ),
              const SizedBox(height: 20),
              Text(
                _mensagem,
                style: const TextStyle(color: Colors.blue),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
