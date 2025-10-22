#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { generateFromJSON, generateSamplePDF, validateCardsData } = require('../src/index');

const program = new Command();

// Configurar informações do programa
program
    .name('a4-business-card-generator')
    .description('Gera cartões de visita em PDF para impressão em A4')
    .version('1.0.0');

/**
 * Comando principal para criar cartões de visita
 */
program
    .command('create')
    .description('Cria PDF de cartões de visita PREMIUM a partir de arquivo JSON')
    .option('--data <path>', 'Caminho para arquivo JSON com dados dos cartões')
    .option('--output <path>', 'Caminho para o PDF gerado', 'cartoes.pdf')
    .option('--no-cut-lines', 'Desabilitar linhas de corte')
    .option('--margin <size>', 'Margem da página em mm', '10')
    .option('--spacing <size>', 'Espaçamento entre cartões em mm', '5')
    .option('--template <path>', 'Caminho para template personalizado')
    .option('--duplicate <number>', 'Quantos cartões da mesma pessoa (padrão: 10)', '10')
    .action(async (options) => {
        try {
            console.log('🚀 A4 Business Card Generator');
            console.log('============================');
            
            // Verificar se arquivo de dados foi fornecido
            if (!options.data) {
                console.error('❌ Erro: Arquivo de dados não fornecido');
                console.log('💡 Use --data <path> para especificar o arquivo JSON');
                console.log('💡 Exemplo: npx a4-business-card-generator create --data examples/sample.json');
                process.exit(1);
            }
            
            // Verificar se arquivo JSON existe
            if (!fs.existsSync(options.data)) {
                console.error(`❌ Arquivo não encontrado: ${options.data}`);
                process.exit(1);
            }
            
            console.log(`📖 Lendo dados de: ${options.data}`);
            console.log(`📄 Arquivo de saída: ${options.output}`);
            
            // Configurar opções
            const config = {
                output: options.output,
                showCutLines: options.cutLines !== false,
                margin: parseFloat(options.margin),
                spacing: parseFloat(options.spacing),
                template: options.template,
                duplicateCards: parseInt(options.duplicate)
            };
            
            // Gerar PDF
            const outputPath = await generateFromJSON(options.data, config);
            
            console.log(`✅ PDF gerado com sucesso: ${outputPath}`);
            console.log('🎉 Pronto para impressão!');
            
        } catch (error) {
            console.error(`❌ Erro: ${error.message}`);
            process.exit(1);
        }
    });

/**
 * Comando para gerar PDF a partir de arquivo JSON (comando alternativo)
 */
program
    .command('generate')
    .description('Gera PDF de cartões de visita a partir de arquivo JSON')
    .argument('<json-file>', 'Arquivo JSON com dados dos cartões')
    .option('-o, --output <file>', 'Arquivo de saída PDF', 'business-cards.pdf')
    .option('--no-cut-lines', 'Desabilitar linhas de corte')
    .option('--margin <size>', 'Margem da página em mm', '10')
    .option('--spacing <size>', 'Espaçamento entre cartões em mm', '5')
    .action(async (jsonFile, options) => {
        try {
            console.log('🔄 Iniciando geração de cartões de visita...');
            
            // Verificar se arquivo JSON existe
            if (!fs.existsSync(jsonFile)) {
                console.error(`❌ Arquivo não encontrado: ${jsonFile}`);
                process.exit(1);
            }
            
            // Configurar opções
            const config = {
                output: options.output,
                showCutLines: options.cutLines !== false,
                margin: parseFloat(options.margin),
                spacing: parseFloat(options.spacing)
            };
            
            // Gerar PDF
            const outputPath = await generateFromJSON(jsonFile, config);
            
            console.log(`✅ PDF gerado com sucesso: ${outputPath}`);
            
        } catch (error) {
            console.error(`❌ Erro: ${error.message}`);
            process.exit(1);
        }
    });

/**
 * Comando para criar template JSON
 */
program
    .command('template')
    .description('Cria um arquivo template JSON com exemplo de cartões')
    .option('-o, --output <file>', 'Arquivo de saída JSON', 'cards-template.json')
    .action((options) => {
        try {
            const template = [
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
                    "website": "www.creativestudio.com",
                    "logo": "./logo.png"
                }
            ];
            
            fs.writeFileSync(options.output, JSON.stringify(template, null, 2));
            console.log(`✅ Template criado: ${options.output}`);
            console.log('📝 Edite o arquivo com seus dados e use o comando create');
            
        } catch (error) {
            console.error(`❌ Erro ao criar template: ${error.message}`);
            process.exit(1);
        }
    });

/**
 * Comando para validar arquivo JSON
 */
program
    .command('validate')
    .description('Valida um arquivo JSON de cartões')
    .argument('<json-file>', 'Arquivo JSON para validar')
    .action((jsonFile) => {
        try {
            console.log('🔍 Validando arquivo JSON...');
            
            // Verificar se arquivo existe
            if (!fs.existsSync(jsonFile)) {
                console.error(`❌ Arquivo não encontrado: ${jsonFile}`);
                process.exit(1);
            }
            
            // Ler e parsear JSON
            const jsonData = fs.readFileSync(jsonFile, 'utf8');
            const cardsData = JSON.parse(jsonData);
            
            if (!Array.isArray(cardsData)) {
                console.error('❌ Arquivo JSON deve conter um array de cartões');
                process.exit(1);
            }
            
            // Validar cartões usando a função de validação
            const validation = validateCardsData(cardsData);
            
            // Exibir resultados
            console.log(`📊 Total de cartões: ${cardsData.length}`);
            
            if (validation.valid) {
                console.log(`✅ Cartões válidos: ${validation.count}`);
                console.log('🎉 Todos os cartões são válidos!');
            } else {
                console.log(`❌ Erros encontrados:`);
                console.log(`   ${validation.message}`);
                process.exit(1);
            }
            
        } catch (error) {
            console.error(`❌ Erro ao validar arquivo: ${error.message}`);
            process.exit(1);
        }
    });

/**
 * Comando para gerar PDF de exemplo
 */
program
    .command('sample')
    .description('Gera um PDF de exemplo com cartões de demonstração')
    .option('-o, --output <file>', 'Arquivo de saída PDF', 'sample-cards.pdf')
    .action(async (options) => {
        try {
            console.log('🎨 Gerando PDF de exemplo...');
            
            const outputPath = await generateSamplePDF({ output: options.output });
            
            console.log(`✅ PDF de exemplo gerado: ${outputPath}`);
            console.log('🎉 Pronto para visualização!');
            
        } catch (error) {
            console.error(`❌ Erro: ${error.message}`);
            process.exit(1);
        }
    });

/**
 * Comando para mostrar informações sobre o pacote
 */
program
    .command('info')
    .description('Mostra informações sobre o gerador de cartões')
    .action(() => {
        console.log('📋 A4 Business Card Generator');
        console.log('============================');
        console.log('');
        console.log('📏 Especificações:');
        console.log('   - Dimensões do cartão: 85x55 mm');
        console.log('   - Página A4: 210x297 mm');
        console.log('   - Cartões por página: 10 (2x5)');
        console.log('   - Margens padrão: 10 mm');
        console.log('   - Espaçamento padrão: 5 mm');
        console.log('');
        console.log('📝 Campos obrigatórios:');
        console.log('   - name: Nome da pessoa');
        console.log('');
        console.log('📝 Campos opcionais:');
        console.log('   - title: Cargo/Título');
        console.log('   - company: Empresa');
        console.log('   - phone: Telefone');
        console.log('   - email: Email');
        console.log('   - website: Website');
        console.log('   - logo: Caminho para logo (PNG/JPG)');
        console.log('');
        console.log('🚀 Comandos disponíveis:');
        console.log('   create --data <file>  - Cria PDF a partir de JSON');
        console.log('   generate <file>       - Gera PDF a partir de JSON');
        console.log('   template              - Cria template JSON');
        console.log('   validate <file>        - Valida arquivo JSON');
        console.log('   sample                - Gera PDF de exemplo');
        console.log('   info                  - Mostra esta informação');
        console.log('');
        console.log('💡 Exemplo de uso:');
        console.log('   npx a4-business-card-generator create --data examples/sample.json --output cartoes.pdf');
    });

// Configurar tratamento de erros
program.configureOutput({
    writeErr: (str) => process.stderr.write(str)
});

// Parsear argumentos da linha de comando
program.parse();

// Se nenhum comando foi executado, mostrar ajuda
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
