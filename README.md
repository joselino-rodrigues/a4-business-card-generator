# A4 Business Card Generator

Um pacote npm que permite criar cartões de visita personalizados organizados em uma página A4 para impressão em PDF.

## 📋 Características

- **Dimensões**: Cartões de 85x55 mm (padrão internacional)
- **Layout**: Organização automática em grade 2x5 (10 cartões por página A4)
- **Margens**: 10 mm de margem em todas as bordas
- **Formato**: PDF pronto para impressão
- **Design MÉDICO PROFISSIONAL**: Cores médicas, tipografia elegante e autoridade
- **Imagem de Fundo**: Imagem completa como fundo com transparência otimizada
- **QR Code ULTRA RESOLUÇÃO**: QR Code com resolução 16x, nitidez aplicada e qualidade máxima
- **Suporte Médico Completo**: Campos específicos para médicos (CRM, especialidades, RQE, graduação)
- **Múltiplos Cartões**: 10 cartões da mesma pessoa por padrão
- **Validação Inteligente**: Validação específica para cartões médicos e padrão
- **Informações Acadêmicas**: Suporte a universidade e ano de formatura

## 🚀 Instalação

```bash
npm install a4-business-card-generator
```

## 📖 Uso

### Via CLI (Linha de Comando)

#### Comando Principal
```bash
npx a4-business-card-generator create --data examples/sample.json --output cartoes.pdf
```

#### Comandos com Funcionalidades MÉDICAS PROFISSIONAIS

```bash
# Gerar cartões médicos profissionais (10 por padrão)
npx a4-business-card-generator create --data cartao-medico.json --output cartoes-medicos.pdf

# Personalizar quantidade de cartões médicos
npx a4-business-card-generator create --data cartao-medico.json --duplicate 20 --output muitos-cartoes-medicos.pdf

# Gerar PDF com QR Code de alta qualidade
npx a4-business-card-generator create --data cartao-medico.json --output cartao-medico-qr.pdf

# Outros comandos disponíveis
npx a4-business-card-generator generate examples/sample.json -o cartoes.pdf
npx a4-business-card-generator template -o meu-template.json
npx a4-business-card-generator validate examples/sample.json
npx a4-business-card-generator sample -o exemplo.pdf
npx a4-business-card-generator info
```

### Via API (Programática)

```javascript
const { generateBusinessCards, generateFromJSON } = require('a4-business-card-generator');

// Gerar PDF MÉDICO PROFISSIONAL a partir de array de cartões
const medicalCards = [
    {
        name: "Dr. João Silva",
        professional: "Médico de Família e Comunidade",
        crm: "12345",
        crm_uf: "SP",
        phone: "(11) 99999-9999",
        email: "joao@clinica.com",
        website: "www.clinica.com.br",
        logo: "./background.jpg"  // Imagem como fundo completo
    }
];

// Gerar múltiplos cartões médicos da mesma pessoa
const outputPath = await generateBusinessCards(medicalCards, {
    output: 'cartoes-medicos.pdf',
    showCutLines: true,
    duplicateCards: 10  // 10 cartões da mesma pessoa
});

// Gerar PDF a partir de arquivo JSON médico
const pdfPath = await generateFromJSON('cartao-medico.json', {
    output: 'cartoes-medicos.pdf',
    duplicateCards: 20  // 20 cartões da mesma pessoa
});
```

## 📝 Formato dos Dados

### Campos Obrigatórios
- `name`: Nome da pessoa

### Campos para Cartões Médicos
- `name`: Nome completo do médico
- `crm`: Número do CRM (ex: "27323")
- `crm_uf`: Estado do CRM (ex: "SP", "RJ", "BA")
- `professional`: Especialidades médicas com RQE (ex: "MEDICINA DO TRÁFEGO - RQE Nº: 17192\nMEDICINA DE FAMÍLIA E COMUNIDADE - RQE Nº: 22526")
- `graduation`: Instituição de graduação (ex: "UNIVERSIDADE ESTADUAL DE FEIRA DE SANTANA")
- `graduation_year`: Ano de formatura (ex: "2014")
- `phone`: Telefone (formato: (XX) XXXXX-XXXX)
- `email`: Email
- `website`: Website
- `logo`: Caminho para imagem de fundo (PNG, JPG, JPEG, GIF, BMP, SVG)

### Campos para Cartões Padrão
- `title`: Cargo/Título
- `company`: Empresa
- `phone`: Telefone (formato: (XX) XXXXX-XXXX)
- `email`: Email
- `website`: Website
- `logo`: Caminho para imagem de fundo (PNG, JPG, JPEG, GIF, BMP, SVG)

### Exemplo de Cartão Médico Completo
```json
[
  {
    "name": "JOSELINO RODRIGUES",
    "crm": "27323",
    "crm_uf": "BA",
    "professional": "MEDICINA DO TRÁFEGO - RQE Nº: 17192\nMEDICINA DE FAMÍLIA E COMUNIDADE - RQE Nº: 22526",
    "graduation": "UNIVERSIDADE ESTADUAL DE FEIRA DE SANTANA",
    "graduation_year": "2014",
    "phone": "(75) 98121-0488",
    "email": "joselino.rodrigues@unifesp.br",
    "website": "www.telemedicina.com.br",
    "logo": "./background.jpg"
  }
]
```

### Exemplo de Cartão Padrão
```json
[
  {
    "name": "João Silva",
    "title": "Desenvolvedor Full Stack",
    "company": "Tech Solutions",
    "phone": "(11) 99999-9999",
    "email": "joao@techsolutions.com",
    "website": "www.techsolutions.com",
    "logo": "./background.jpg"
  }
]
```

## ⚙️ Opções de Configuração

### CLI
- `--data <path>`: Caminho para arquivo JSON
- `--output <path>`: Arquivo de saída PDF (padrão: cartoes.pdf)
- `--duplicate <number>`: Quantos cartões da mesma pessoa (padrão: 10)
- `--no-cut-lines`: Desabilitar linhas de corte
- `--margin <size>`: Margem da página em mm (padrão: 10)
- `--spacing <size>`: Espaçamento entre cartões em mm (padrão: 5)
- `--template <path>`: Caminho para template personalizado

### API
```javascript
const options = {
    output: 'cartoes.pdf',           // Arquivo de saída
    showCutLines: true,              // Mostrar linhas de corte
    duplicateCards: 10,              // Quantos cartões da mesma pessoa
    template: './meu-template.js',   // Template personalizado
    margin: 10,                      // Margem em mm
    spacing: 5                       // Espaçamento em mm
};
```

## 🎨 Personalização

### Template Personalizado PREMIUM

Crie um arquivo `meu-template.js`:

```javascript
module.exports = {
    // Fontes otimizadas
    font: 'Helvetica',
    fontSize: {
        name: 14,      // Nome da pessoa
        title: 11,     // Cargo/título
        company: 10,   // Empresa
        contact: 9     // Informações de contato
    },
    
    // Paleta de cores PREMIUM
    colors: {
        primary: '#1a1a1a',        // Preto elegante
        secondary: '#4a4a4a',      // Cinza escuro
        accent: '#2563eb',         // Azul moderno
        highlight: '#f59e0b',      // Dourado
        textPrimary: '#111827',    // Texto principal
        textSecondary: '#6b7280'   // Texto secundário
    },
    
    // Layout PREMIUM
    layout: {
        padding: 15,               // Padding interno
        logoHeight: 40,            // Logo maior
        logoWidth: 40,             // Logo maior
        borderRadius: 8,           // Bordas arredondadas
        shadowOffset: 2,           // Sombra sutil
        shadowBlur: 4              // Desfoque da sombra
    },
    
    // QR Code otimizado
    qrCode: {
        enabled: true,             // Habilitar QR Code
        size: 50,                  // Tamanho otimizado
        position: 'bottom-right',  // Posição
        color: '#1a1a1a',          // Cor do QR Code
        backgroundColor: '#ffffff'  // Cor de fundo
    }
};
```

## 📏 Especificações Técnicas

- **Dimensões do cartão**: 85x55 mm (241x156 pontos)
- **Página A4**: 210x297 mm (595x842 pontos)
- **Cartões por página**: 10 (2 colunas x 5 linhas)
- **Margens**: 10 mm (28.35 pontos)
- **Espaçamento**: 5 mm (14.17 pontos)
- **QR Code**: 50x50 pontos (tamanho otimizado)
- **Resolução QR Code**: 16x para máxima qualidade
- **Processamento QR Code**: Lanczos3 + nitidez + antialiasing
- **Imagem de fundo**: Redimensionada para cobrir todo o cartão
- **Transparência**: 30% para legibilidade do texto
- **Conversão**: 1 mm = 2.83465 pontos

## 🔧 Dependências

- `pdfkit`: Geração de PDF
- `commander`: Interface de linha de comando
- `sharp`: Processamento de imagens (logos)
- `qrcode`: Geração de QR Codes

## 📁 Estrutura do Projeto

```
a4-business-card-generator/
├── src/
│   ├── index.js              # API principal
│   ├── cardGenerator.js      # Geração de cartões
│   ├── pdfGenerator.js       # Geração de PDF
│   └── utils/
│       └── validate.js       # Validação de dados
├── templates/
│   └── basic.js             # Template básico
├── bin/
│   └── cli.js               # Interface CLI
├── examples/
│   └── sample.json          # Exemplo de dados
├── package.json
└── README.md
```

## 🐛 Solução de Problemas

### Erro: "Arquivo não encontrado"
- Verifique se o caminho do arquivo JSON está correto
- Use caminhos absolutos se necessário

### Erro: "Email inválido"
- Use formato válido: usuario@dominio.com
- Verifique se não há espaços extras

### Erro: "Telefone inválido"
- Use formato brasileiro: (XX) XXXXX-XXXX
- Exemplo: (11) 99999-9999

### Logo não aparece
- Verifique se o arquivo existe no caminho especificado
- Use formatos suportados: PNG, JPG, JPEG, GIF, BMP, SVG
- Verifique permissões de leitura do arquivo

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção de solução de problemas
2. Consulte os exemplos fornecidos
3. Abra uma issue no GitHub

## ✨ Funcionalidades MÉDICAS PROFISSIONAIS

### 🏥 **Design Médico Sofisticado**
- **Cores médicas profissionais** (azul médico, verde confiança, dourado elegante)
- **Tipografia hierárquica** (nome > especialidades > CRM > contatos)
- **Layout médico específico** com CRM destacado em fundo azul
- **Sombras elegantes** para profundidade visual
- **Linhas decorativas** médicas

### 🖼️ **Imagem de Fundo Completa**
- **Imagem redimensionada** para cobrir todo o cartão
- **Transparência de 30%** para legibilidade otimizada
- **Posicionamento central** com ajuste automático
- **Qualidade preservada** com Sharp (algoritmo Lanczos3)

### 📱 **QR Code Ultra Resolução**
- **Tamanho otimizado** (50x50 pontos)
- **Resolução 16x maior** para máxima nitidez
- **Qualidade H** (errorCorrectionLevel)
- **Algoritmo Lanczos3** para redimensionamento
- **Nitidez aplicada** (sharpen com parâmetros otimizados)
- **Antialiasing** para bordas suaves
- **Qualidade 100%** sem compressão
- **Posicionamento inteligente** (canto inferior direito)

### 🏥 **Suporte Médico Completo**
- **Campos médicos**: `name`, `crm`, `crm_uf`, `professional`
- **Especialidades com RQE**: Suporte a múltiplas especialidades
- **Informações acadêmicas**: `graduation`, `graduation_year`
- **Validação CRM**: Formato correto (números + estado)
- **Layout médico**: CRM destacado com fundo especial
- **Compatibilidade**: Suporte a cartões médicos e padrão

### 🔄 **Múltiplos Cartões**
- **10 cartões da mesma pessoa** por padrão
- **Personalizável** com `--duplicate <número>`
- **Ideal para distribuição** médica em massa
- **Layout organizado** em grade 2x5

## 🎯 Roadmap

- [x] Design PREMIUM com gradientes e sombras
- [x] Logo como fundo do cartão
- [x] QR Code otimizado
- [x] Múltiplos cartões da mesma pessoa
- [x] QR Code ultra resolução (16x)
- [x] Suporte a especialidades com RQE
- [x] Informações acadêmicas (graduação)
- [x] Processamento avançado de imagem
- [ ] Suporte a mais templates
- [ ] Editor visual de cartões
- [ ] Integração com APIs de CRM
- [ ] Templates responsivos
- [ ] Validação de logos online