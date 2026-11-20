"use strict";

// Dados do recebedor e instruções de troca ficam separados em config.js.

const form = document.getElementById("pix-form");
const amountInput = document.getElementById("amount");
const error = document.getElementById("amount-error");
const result = document.getElementById("result");
const codeOutput = document.getElementById("pix-code");
const copyButton = document.getElementById("copy-code");
const status = document.getElementById("status");
const qrContainer = document.getElementById("pix-qr");

// Biblioteca distribuída em vendor/: não consulta APIs, CDNs ou servidores.
// Codifica exatamente o texto copia e cola, com correção M e margem de 4 módulos.
function renderQrCode(payload) {
  const qr = qrcode(0, "M"); // 0 seleciona automaticamente o tamanho necessário.
  qr.addData(payload, "Byte");
  qr.make();
  const image = document.createElement("img");
  image.src = qr.createDataURL(5, 20);
  image.alt = "QR code do Pix de demonstração, com o mesmo conteúdo do código copia e cola";
  image.width = image.height = (qr.getModuleCount() + 8) * 5;
  qrContainer.replaceChildren(image);
}

// Trabalhamos com centavos inteiros para não arredondar entradas inválidas.
// Aceita 25,90 ou 25.90; separadores de milhar não são aceitos.
function parseAmount(raw) {
  const value = raw.trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(value)) {
    throw new Error("Digite um valor válido, como 25,90, sem separador de milhar.");
  }
  const [whole, fraction = ""] = value.replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(cents) || cents < 1 || cents > 99999999) {
    throw new Error("Informe um valor entre R$ 0,01 e R$ 999.999,99.");
  }
  return cents;
}

// Cada campo BR Code usa identificador + tamanho em dois dígitos + conteúdo.
function tlv(id, value) {
  const length = new TextEncoder().encode(value).length;
  if (length > 99) throw new Error("Campo Pix excede o tamanho permitido.");
  return id + String(length).padStart(2, "0") + value;
}

// CRC-16/CCITT-FALSE: polinômio 0x1021, valor inicial 0xFFFF.
function crc16(text) {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(text)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = ((crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Pix estático em reais (986), com chave, valor, recebedor e txid não informado (***).
// Referência: Manual de Padrões para Iniciação do Pix, Banco Central do Brasil.
function generatePix(cents) {
  if (!Number.isSafeInteger(cents) || cents < 1 || cents > 99999999) {
    throw new Error("Valor fora do intervalo permitido.");
  }
  const amount = Math.floor(cents / 100) + "." + String(cents % 100).padStart(2, "0");
  const merchant = tlv("00", "br.gov.bcb.pix") + tlv("01", PIX_CONFIG.chave);
  const payload = tlv("00", "01") + tlv("01", "11") + tlv("26", merchant)
    + tlv("52", "0000") + tlv("53", "986") + tlv("54", amount)
    + tlv("58", "BR") + tlv("59", PIX_CONFIG.nome) + tlv("60", PIX_CONFIG.cidade)
    + tlv("62", tlv("05", "***")) + "6304";
  // O CRC inclui o identificador 63 e seu tamanho 04, mas não o próprio checksum.
  return payload + crc16(payload);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent = "";
  try {
    const cents = parseAmount(amountInput.value);
    codeOutput.value = generatePix(cents);
    renderQrCode(codeOutput.value);
    document.getElementById("generated-amount").textContent =
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
    error.textContent = "";
    amountInput.removeAttribute("aria-invalid");
    result.hidden = false;
    status.textContent = "Código de demonstração gerado. Não faça pagamentos com esta chave.";
  } catch (err) {
    result.hidden = true;
    codeOutput.value = "";
    qrContainer.replaceChildren();
    error.textContent = err.message;
    amountInput.setAttribute("aria-invalid", "true");
    amountInput.focus();
  }
});

// Ao editar o valor, descartamos o código anterior para evitar cópias desatualizadas.
amountInput.addEventListener("input", () => {
  result.hidden = true;
  codeOutput.value = "";
  qrContainer.replaceChildren();
  error.textContent = "";
  status.textContent = "";
  amountInput.removeAttribute("aria-invalid");
});

copyButton.addEventListener("click", async () => {
  const code = codeOutput.value;
  if (!code) return;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard indisponível");
    await navigator.clipboard.writeText(code);
    if (codeOutput.value === code) status.textContent = "Código copiado! Esta chave é apenas de teste.";
  } catch {
    // Fallback para páginas abertas diretamente por file:// ou com permissão negada.
    codeOutput.focus();
    codeOutput.select();
    codeOutput.setSelectionRange(0, codeOutput.value.length);
    let copied = false;
    try { copied = document.execCommand("copy"); } catch { /* Oferece cópia manual abaixo. */ }
    status.textContent = copied ? "Código copiado! Esta chave é apenas de teste."
      : "Selecione e copie o código manualmente (Ctrl+C ou o menu Copiar do dispositivo).";
  }
});
