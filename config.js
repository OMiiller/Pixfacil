"use strict";

// CONFIGURAÇÃO DO RECEBEDOR — mantenha os dados de teste durante o desenvolvimento.
// Para usar depois: substitua somente os valores abaixo pela chave cadastrada
// no banco e pelo nome/cidade do titular. Não altere a lógica em script.js.
// Chave: CPF/CNPJ somente dígitos, telefone com +55, e-mail ou chave aleatória.
// Nome: até 25 caracteres; cidade: até 15. Use letras sem acentos nos dois.
// Confirme a chave e o recebedor no app do banco antes de qualquer pagamento real.
// Este arquivo é público: nunca coloque senhas, tokens ou credenciais bancárias.
// A página offline não verifica o cadastro da chave no DICT.
const PIX_CONFIG = Object.freeze({
  chave: "teste@example.invalid", // Endereço fictício; não recebe pagamentos.
  nome: "RECEBEDOR TESTE",
  cidade: "SAO PAULO"
});
