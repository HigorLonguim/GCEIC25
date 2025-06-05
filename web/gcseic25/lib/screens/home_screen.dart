import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
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
      appBar: AppBar(title: const Text('Home')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const Text('Bem-vindo!'),
            const SizedBox(height: 20),
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
