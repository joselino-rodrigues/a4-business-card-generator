# A4 Business Card Generator

Um pacote npm que permite criar cartões de visita personalizados organizados em uma página A4 para impressão em PDF.

## 📋 Características

- **Dimensões**: Cartões de 85x55 mm (padrão internacional)
- **Layout**: Organização automática em grade 2x5 (10 cartões por página A4)
- **Margens**: 10 mm de margem em todas as bordas
- **Formato**: PDF pronto para impressão
- **Template**: Design profissional com suporte a logos
- **Validação**: Validação completa de dados de entrada

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

#### Outros Comandos Disponíveis

```bash
# Gerar PDF a partir de JSON
npx a4-business-card-generator generate examples/sample.json -o cartoes.pdf

# Criar template JSON
npx a4-business-card-generator template -o meu-template.json

# Validar arquivo JSON
npx a4-business-card-generator validate examples/sample.json

# Gerar PDF de exemplo
npx a4-business-card-generator sample -o exemplo.pdf

# Mostrar informações
npx a4-business-card-generator info
```

### Via API (Programática)

```javascript
const { generateBusinessCards, generateFromJSON } = require('a4-business-card-generator');

// Gerar PDF a partir de array de cartões
const cards = [
    {
        name: "João Silva",
        title: "Desenvolvedor Full Stack",
        company: "Tech Solutions",
        phone: "(11) 99999-9999",
        email: "joao@techsolutions.com",
        website: "www.techsolutions.com",
        logo: "./logo.png"
    }
];

const outputPath = await generateBusinessCards(cards, {
    output: 'meus-cartoes.pdf',
    showCutLines: true
});

// Gerar PDF a partir de arquivo JSON
const pdfPath = await generateFromJSON('dados.json', {
    output: 'cartoes.pdf'
});
```

## 📝 Formato dos Dados

### Campos Obrigatórios
- `name`: Nome da pessoa

### Campos Opcionais
- `title`: Cargo/Título
- `company`: Empresa
- `phone`: Telefone (formato: (XX) XXXXX-XXXX)
- `email`: Email
- `website`: Website
- `logo`: Caminho para logo (PNG, JPG, JPEG, GIF, BMP, SVG)

### Exemplo de Arquivo JSON

```json
[
  {
    "name": "João Silva",
    "title": "Desenvolvedor Full Stack",
    "company": "Tech Solutions",
    "phone": "(11) 99999-9999",
    "email": "joao@techsolutions.com",
    "website": "www.techsolutions.com",
    "logo": "./logo.png"
  },
  {
    "name": "Maria Oliveira",
    "title": "Designer Gráfico",
    "company": "Creative Studio",
    "phone": "(11) 98888-8888",
    "email": "maria@creativestudio.com",
    "website": "www.creativestudio.com"
  }
]
```

## ⚙️ Opções de Configuração

### CLI
- `--data <path>`: Caminho para arquivo JSON
- `--output <path>`: Arquivo de saída PDF (padrão: cartoes.pdf)
- `--no-cut-lines`: Desabilitar linhas de corte
- `--margin <size>`: Margem da página em mm (padrão: 10)
- `--spacing <size>`: Espaçamento entre cartões em mm (padrão: 5)
- `--template <path>`: Caminho para template personalizado

### API
```javascript
const options = {
    output: 'cartoes.pdf',           // Arquivo de saída
    showCutLines: true,              // Mostrar linhas de corte
    template: './meu-template.js',   // Template personalizado
    margin: 10,                      // Margem em mm
    spacing: 5                       // Espaçamento em mm
};
```

## 🎨 Personalização

### Template Personalizado

Crie um arquivo `meu-template.js`:

```javascript
module.exports = {
    font: 'Helvetica',
    fontSize: {
        name: 16,
        title: 12,
        company: 11,
        contact: 10
    },
    colors: {
        primary: '#333333',
        secondary: '#666666',
        accent: '#007bff',
        contact: '#555555'
    },
    layout: {
        padding: 10,
        logoHeight: 30,
        logoWidth: 30
    }
};
```

## 📏 Especificações Técnicas

- **Dimensões do cartão**: 85x55 mm (241x156 pontos)
- **Página A4**: 210x297 mm (595x842 pontos)
- **Cartões por página**: 10 (2 colunas x 5 linhas)
- **Margens**: 10 mm (28.35 pontos)
- **Espaçamento**: 5 mm (14.17 pontos)
- **Conversão**: 1 mm = 2.83465 pontos

## 🔧 Dependências

- `pdfkit`: Geração de PDF
- `commander`: Interface de linha de comando
- `sharp`: Processamento de imagens (logos)

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

## 🎯 Roadmap

- [ ] Suporte a mais templates
- [ ] Editor visual de cartões
- [ ] Integração com APIs de CRM
- [ ] Suporte a QR codes
- [ ] Templates responsivos
- [ ] Validação de logos online