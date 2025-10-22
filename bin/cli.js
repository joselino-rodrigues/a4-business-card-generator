#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const BusinessCardGenerator = require('../src/index');

const program = new Command();

// Configurar informações do programa
program
    .name('a4-business-card')
    .description('Gerador de cartões de visita em formato A4 para impressão')
    .version('1.0.0');

/**
 * Comando para gerar PDF a partir de arquivo JSON
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
            
            // Configurar opções do gerador
            const generatorOptions = {
                showCutLines: options.cutLines,
                marginTop: parseFloat(options.margin) * 2.834645669, // Converter mm para pontos
                marginLeft: parseFloat(options.margin) * 2.834645669,
                marginRight: parseFloat(options.margin) * 2.834645669,
                marginBottom: parseFloat(options.margin) * 2.834645669,
                cardSpacing: parseFloat(options.spacing) * 2.834645669
            };
            
            // Criar instância do gerador
            const generator = new BusinessCardGenerator(generatorOptions);
            
            // Gerar PDF
            const outputPath = await generator.generateFromJSON(jsonFile, options.output);
            
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
                    "company": "Tech Solutions Ltda",
                    "phone": "(11) 99999-9999",
                    "email": "joao@techsolutions.com",
                    "website": "www.techsolutions.com",
                    "logo": "path/to/logo.png"
                },
                {
                    "name": "Maria Santos",
                    "title": "Gerente de Projetos",
                    "company": "Inovação Digital",
                    "phone": "(11) 88888-8888",
                    "email": "maria@inovacaodigital.com",
                    "website": "www.inovacaodigital.com"
                },
                {
                    "name": "Pedro Costa",
                    "title": "Designer UX/UI",
                    "company": "Creative Studio",
                    "phone": "(11) 77777-7777",
                    "email": "pedro@creativestudio.com",
                    "website": "www.creativestudio.com"
                }
            ];
            
            fs.writeFileSync(options.output, JSON.stringify(template, null, 2));
            console.log(`✅ Template criado: ${options.output}`);
            console.log('📝 Edite o arquivo com seus dados e use o comando generate');
            
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
            
            // Validar cada cartão
            const generator = new BusinessCardGenerator();
            let validCards = 0;
            let errors = [];
            
            cardsData.forEach((card, index) => {
                try {
                    generator.validateCardData(card);
                    validCards++;
                } catch (error) {
                    errors.push(`Cartão ${index + 1}: ${error.message}`);
                }
            });
            
            // Exibir resultados
            console.log(`📊 Total de cartões: ${cardsData.length}`);
            console.log(`✅ Cartões válidos: ${validCards}`);
            
            if (errors.length > 0) {
                console.log(`❌ Erros encontrados:`);
                errors.forEach(error => console.log(`   - ${error}`));
                process.exit(1);
            } else {
                console.log('🎉 Todos os cartões são válidos!');
            }
            
        } catch (error) {
            console.error(`❌ Erro ao validar arquivo: ${error.message}`);
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
        console.log('   generate <json-file>  - Gera PDF a partir de JSON');
        console.log('   template              - Cria template JSON');
        console.log('   validate <json-file>   - Valida arquivo JSON');
        console.log('   info                  - Mostra esta informação');
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
