/**
 * API Principal do A4 Business Card Generator
 * Função principal que coordena a geração de cartões de visita em PDF
 */

const PDFGenerator = require('./pdfGenerator');
const { validateCards } = require('./utils/validate');

/**
 * Função principal para gerar cartões de visita
 * @param {Array} cards - Array de objetos com dados dos cartões
 * @param {Object} options - Opções de configuração
 * @returns {Promise<string>} - Caminho do arquivo PDF gerado
 */
async function generateBusinessCards(cards, options = {}) {
    try {
        console.log('🚀 Iniciando geração de cartões de visita...');
        
        // Validar dados de entrada
        if (!Array.isArray(cards)) {
            throw new Error('Parâmetro "cards" deve ser um array');
        }
        
        if (cards.length === 0) {
            throw new Error('Array de cartões não pode estar vazio');
        }
        
        // Validar dados dos cartões
        console.log('🔍 Validando dados dos cartões...');
        const validatedCards = validateCards(cards);
        
        // Configurar opções padrão
        const config = {
            output: options.output || 'business-cards.pdf',
            template: options.template || null,
            showCutLines: options.showCutLines !== false,
            cardsPerPage: options.cardsPerPage || 10,
            ...options
        };
        
        // Criar instância do gerador de PDF
        const pdfGenerator = new PDFGenerator(config.template);
        
        // Gerar PDF
        const outputPath = await pdfGenerator.generatePDF(validatedCards, config.output, config);
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Erro na geração de cartões:', error.message);
        throw error;
    }
}

/**
 * Gera cartões de visita a partir de arquivo JSON
 * @param {string} jsonPath - Caminho do arquivo JSON
 * @param {Object} options - Opções de configuração
 * @returns {Promise<string>} - Caminho do arquivo PDF gerado
 */
async function generateFromJSON(jsonPath, options = {}) {
    try {
        console.log(`📖 Lendo arquivo JSON: ${jsonPath}`);
        
        // Criar instância do gerador de PDF
        const pdfGenerator = new PDFGenerator(options.template);
        
        // Configurar caminho de saída
        const outputPath = options.output || 'business-cards.pdf';
        
        // Gerar PDF a partir do JSON
        const result = await pdfGenerator.generateFromJSON(jsonPath, outputPath, options);
        
        return result;
        
    } catch (error) {
        console.error('❌ Erro ao gerar PDF do JSON:', error.message);
        throw error;
    }
}

/**
 * Cria um PDF de exemplo com cartões de demonstração
 * @param {Object} options - Opções de configuração
 * @returns {Promise<string>} - Caminho do arquivo PDF gerado
 */
async function generateSamplePDF(options = {}) {
    try {
        console.log('🎨 Gerando PDF de exemplo...');
        
        // Criar instância do gerador de PDF
        const pdfGenerator = new PDFGenerator(options.template);
        
        // Configurar caminho de saída
        const outputPath = options.output || 'sample-business-cards.pdf';
        
        // Gerar PDF de exemplo
        const result = await pdfGenerator.generateSamplePDF(outputPath);
        
        return result;
        
    } catch (error) {
        console.error('❌ Erro ao gerar PDF de exemplo:', error.message);
        throw error;
    }
}

/**
 * Calcula informações sobre o PDF a ser gerado
 * @param {Array} cards - Array de cartões
 * @param {Object} options - Opções de configuração
 * @returns {Object} - Informações sobre o PDF
 */
function calculatePDFInfo(cards, options = {}) {
    try {
        // Criar instância do gerador de PDF
        const pdfGenerator = new PDFGenerator(options.template);
        
        // Calcular informações
        const info = pdfGenerator.calculatePDFInfo(cards);
        
        return info;
        
    } catch (error) {
        console.error('❌ Erro ao calcular informações do PDF:', error.message);
        throw error;
    }
}

/**
 * Valida dados de cartões sem gerar PDF
 * @param {Array} cards - Array de cartões para validar
 * @returns {Object} - Resultado da validação
 */
function validateCardsData(cards) {
    try {
        const validatedCards = validateCards(cards);
        
        return {
            valid: true,
            cards: validatedCards,
            count: validatedCards.length,
            message: 'Todos os cartões são válidos'
        };
        
    } catch (error) {
        return {
            valid: false,
            cards: null,
            count: 0,
            message: error.message
        };
    }
}

// Exportar funções principais
module.exports = {
    generateBusinessCards,
    generateFromJSON,
    generateSamplePDF,
    calculatePDFInfo,
    validateCardsData,
    
    // Exportar classes para uso avançado
    PDFGenerator,
    CardGenerator: require('./cardGenerator'),
    
    // Exportar utilitários
    validateCards
};
