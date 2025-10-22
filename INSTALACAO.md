# 📦 Instalação - A4 Business Card Generator

## 🚀 Instalação Rápida

### 1. Instalar Node.js
- Baixe e instale o Node.js do site oficial: https://nodejs.org/
- Escolha a versão LTS (recomendada)
- **IMPORTANTE**: Marque "Add to PATH" durante a instalação

### 2. Verificar Instalação
```bash
node --version
npm --version
```

### 3. Instalar Dependências
```bash
npm install pdfkit commander sharp qrcode
```

## 🔧 Solução de Problemas

### Erro: "npm não é reconhecido"
- **Causa**: Node.js não foi adicionado ao PATH
- **Solução**: 
  1. Reinstale o Node.js
  2. Marque "Add to PATH" durante a instalação
  3. Reinicie o terminal

### Erro: "Execution Policy"
- **Causa**: PowerShell bloqueia execução de scripts
- **Solução**: Use Command Prompt (cmd) em vez do PowerShell

### Erro: "Cannot find module"
- **Causa**: Dependências não instaladas
- **Solução**: Execute `npm install` na pasta do projeto

## ✅ Verificação Final

Se tudo estiver correto, você deve conseguir executar:
```bash
node bin/cli.js --help
```

E ver a ajuda do comando aparecer.
