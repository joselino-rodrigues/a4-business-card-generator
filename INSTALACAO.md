# Instruções de Instalação

## Pré-requisitos
- Node.js versão 14 ou superior
- npm (gerenciador de pacotes do Node.js)

## Instalação das Dependências

Execute os seguintes comandos no terminal na raiz do projeto:

```bash
# Instalar dependências principais
npm install pdfkit commander sharp

# Ou instalar todas as dependências de uma vez
npm install
```

## Verificação da Instalação

Após a instalação, você pode testar o projeto:

```bash
# Testar CLI
node bin/cli.js info

# Testar geração de exemplo
node bin/cli.js sample

# Testar com arquivo JSON
node bin/cli.js create --data examples/sample.json --output teste.pdf
```

## Estrutura Final do Projeto

```
a4-business-card-generator/
├── bin/
│   └── cli.js                 # Interface CLI
├── src/
│   ├── index.js              # API principal
│   ├── cardGenerator.js      # Geração de cartões
│   ├── pdfGenerator.js        # Geração de PDF
│   └── utils/
│       └── validate.js        # Validação de dados
├── templates/
│   └── basic.js              # Template básico
├── examples/
│   ├── sample.json           # Exemplo de dados
│   ├── cards-example.json     # Exemplo adicional
│   └── exemplo-uso.js        # Exemplo de uso programático
├── package.json               # Configurações do projeto
├── README.md                  # Documentação
├── LICENSE                    # Licença MIT
├── .gitignore                 # Arquivos ignorados pelo Git
└── .npmignore                 # Arquivos ignorados pelo npm
```

## Comandos Disponíveis

### CLI
- `create --data <file>` - Comando principal para criar PDF
- `generate <file>` - Gerar PDF a partir de JSON
- `template` - Criar template JSON
- `validate <file>` - Validar arquivo JSON
- `sample` - Gerar PDF de exemplo
- `info` - Mostrar informações

### API
- `generateBusinessCards(cards, options)` - Gerar PDF de array
- `generateFromJSON(jsonPath, options)` - Gerar PDF de JSON
- `generateSamplePDF(options)` - Gerar PDF de exemplo
- `validateCardsData(cards)` - Validar dados

## Exemplo de Uso Rápido

```bash
# 1. Criar template
node bin/cli.js template -o meus-cartoes.json

# 2. Editar o arquivo meus-cartoes.json com seus dados

# 3. Gerar PDF
node bin/cli.js create --data meus-cartoes.json --output cartoes.pdf

# 4. Abrir cartoes.pdf para visualizar
```

## Troubleshooting

Se encontrar problemas:

1. **Erro de módulo não encontrado**: Execute `npm install` primeiro
2. **Erro de permissão**: Execute como administrador (Windows) ou use `sudo` (Linux/Mac)
3. **Erro de arquivo não encontrado**: Verifique os caminhos dos arquivos
4. **Erro de validação**: Verifique o formato dos dados no JSON

## Próximos Passos

1. Instale as dependências: `npm install`
2. Teste com exemplo: `node bin/cli.js sample`
3. Crie seus próprios cartões: `node bin/cli.js template`
4. Gere seu PDF: `node bin/cli.js create --data seu-arquivo.json`
