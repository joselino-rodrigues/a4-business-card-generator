/**
 * Módulo para geração de PDF com cartões de visita organizados em página A4
 * Organiza cartões em grade 2x5 (10 cartões por página)
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Classe para gerar PDF com cartões de visita
 */
class PDFGenerator {
    constructor(template = null) {
        // Carregar template básico se não fornecido
        this.template = template || require('../templates/basic');
        
        // Calcular posições dos cartões na página
        this.calculateCardPositions();
    }
    
    /**
     * Calcula as posições dos cartões na página A4
     * Grade 2x5 = 2 colunas x 5 linhas = 10 cartões por página
     */
    calculateCardPositions() {
        this.cardPositions = [];
        
        const { page, dimensions } = this.template;
        
        // Calcular área disponível para cartões
        const availableWidth = page.width - (2 * dimensions.margin);
        const availableHeight = page.height - (2 * dimensions.margin);
        
        // Calcular espaçamento entre cartões
        const horizontalSpacing = (availableWidth - (page.cardsPerRow * dimensions.width)) / (page.cardsPerRow - 1);
        const verticalSpacing = (availableHeight - (page.cardsPerColumn * dimensions.height)) / (page.cardsPerColumn - 1);
        
        // Gerar posições para todos os cartões da página
        for (let row = 0; row < page.cardsPerColumn; row++) {
            for (let col = 0; col < page.cardsPerRow; col++) {
                const x = dimensions.margin + (col * (dimensions.width + horizontalSpacing));
                const y = dimensions.margin + (row * (dimensions.height + verticalSpacing));
                
                this.cardPositions.push({
                    x: x,
                    y: y,
                    width: dimensions.width,
                    height: dimensions.height
                });
            }
        }
    }
    
    /**
     * Gera PDF com cartões de visita
     * @param {Array} cardsData - Array com dados dos cartões validados
     * @param {string} outputPath - Caminho do arquivo de saída
     * @param {Object} options - Opções adicionais
     * @returns {Promise<string>} - Caminho do arquivo gerado
     */
    async generatePDF(cardsData, outputPath = 'business-cards.pdf', options = {}) {
        if (!Array.isArray(cardsData) || cardsData.length === 0) {
            throw new Error('Array de cartões não fornecido ou vazio');
        }
        
        // Configurar opções
        const config = {
            showCutLines: options.showCutLines !== false,
            template: options.template || this.template,
            ...options
        };
        
        // Criar documento PDF
        const doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        });
        
        // Pipe para arquivo
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);
        
        // Importar CardGenerator
        const CardGenerator = require('./cardGenerator');
        const cardGenerator = new CardGenerator(config.template);
        
        // Processar cartões em páginas
        let currentPage = 0;
        let cardsInCurrentPage = 0;
        let totalCards = cardsData.length;
        
        console.log(`🔄 Gerando PDF com ${totalCards} cartões...`);
        
        for (let i = 0; i < totalCards; i++) {
            // Se necessário, criar nova página
            if (cardsInCurrentPage === 0) {
                if (i > 0) {
                    doc.addPage();
                }
                currentPage++;
                console.log(`📄 Criando página ${currentPage}...`);
            }
            
            // Obter posição do cartão na página atual
            const position = this.cardPositions[cardsInCurrentPage];
            
            // Desenhar cartão
            await cardGenerator.drawCard(doc, cardsData[i], position);
            
            // Desenhar linhas de corte se habilitado
            if (config.showCutLines) {
                cardGenerator.drawCutLines(doc, position.x, position.y, position.width, position.height);
            }
            
            cardsInCurrentPage++;
            
            // Se completou uma página (10 cartões), resetar contador
            if (cardsInCurrentPage === this.template.page.cardsPerPage) {
                cardsInCurrentPage = 0;
            }
        }
        
        // Finalizar documento
        doc.end();
        
        return new Promise((resolve, reject) => {
            stream.on('finish', () => {
                console.log(`✅ PDF gerado com sucesso: ${outputPath}`);
                console.log(`📊 Estatísticas:`);
                console.log(`   - Total de cartões: ${totalCards}`);
                console.log(`   - Total de páginas: ${currentPage}`);
                console.log(`   - Cartões por página: ${this.template.page.cardsPerPage}`);
                resolve(outputPath);
            });
            
            stream.on('error', (error) => {
                reject(new Error(`Erro ao salvar PDF: ${error.message}`));
            });
        });
    }
    
    /**
     * Gera PDF a partir de arquivo JSON
     * @param {string} jsonPath - Caminho do arquivo JSON
     * @param {string} outputPath - Caminho do arquivo de saída
     * @param {Object} options - Opções adicionais
     * @returns {Promise<string>} - Caminho do arquivo gerado
     */
    async generateFromJSON(jsonPath, outputPath, options = {}) {
        try {
            console.log(`📖 Lendo arquivo JSON: ${jsonPath}`);
            
            // Ler arquivo JSON
            const jsonData = fs.readFileSync(jsonPath, 'utf8');
            const cardsData = JSON.parse(jsonData);
            
            if (!Array.isArray(cardsData)) {
                throw new Error('Arquivo JSON deve conter um array de cartões');
            }
            
            console.log(`📋 Encontrados ${cardsData.length} cartões no arquivo`);
            
            // Validar dados usando o módulo de validação
            const { validateCards } = require('./utils/validate');
            const validatedCards = validateCards(cardsData);
            
            // Gerar PDF
            return await this.generatePDF(validatedCards, outputPath, options);
            
        } catch (error) {
            throw new Error(`Erro ao processar arquivo JSON: ${error.message}`);
        }
    }
    
    /**
     * Calcula informações sobre o PDF a ser gerado
     * @param {Array} cardsData - Array com dados dos cartões
     * @returns {Object} - Informações sobre o PDF
     */
    calculatePDFInfo(cardsData) {
        const totalCards = cardsData.length;
        const cardsPerPage = this.template.page.cardsPerPage;
        const totalPages = Math.ceil(totalCards / cardsPerPage);
        
        return {
            totalCards,
            cardsPerPage,
            totalPages,
            template: this.template,
            cardDimensions: {
                width: this.template.dimensions.width,
                height: this.template.dimensions.height,
                widthMM: this.template.dimensions.width / 2.83465,
                heightMM: this.template.dimensions.height / 2.83465
            },
            pageDimensions: {
                width: this.template.page.width,
                height: this.template.page.height,
                widthMM: this.template.page.width / 2.83465,
                heightMM: this.template.page.height / 2.83465
            }
        };
    }
    
    /**
     * Cria um PDF de exemplo com cartões de demonstração
     * @param {string} outputPath - Caminho do arquivo de saída
     * @returns {Promise<string>} - Caminho do arquivo gerado
     */
    async generateSamplePDF(outputPath = 'sample-business-cards.pdf') {
        const sampleCards = [
            {
                name: "João Silva",
                title: "Desenvolvedor Full Stack",
                company: "Tech Solutions",
                phone: "(11) 99999-9999",
                email: "joao@techsolutions.com",
                website: "www.techsolutions.com"
            },
            {
                name: "Maria Oliveira",
                title: "Designer Gráfico",
                company: "Creative Studio",
                phone: "(11) 98888-8888",
                email: "maria@creativestudio.com",
                website: "www.creativestudio.com"
            },
            {
                name: "Pedro Costa",
                title: "Gerente de Projetos",
                company: "Inovação Digital",
                phone: "(11) 97777-7777",
                email: "pedro@inovacaodigital.com",
                website: "www.inovacaodigital.com"
            }
        ];
        
        console.log('🎨 Gerando PDF de exemplo...');
        return await this.generatePDF(sampleCards, outputPath);
    }
}

module.exports = PDFGenerator;
