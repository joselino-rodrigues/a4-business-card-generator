/**
 * Módulo de validação para dados de cartões de visita
 * Valida campos obrigatórios e opcionais, formatos de email, URL, etc.
 */

/**
 * Valida os dados de um cartão de visita
 * @param {Object} card - Dados do cartão
 * @param {number} index - Índice do cartão (para mensagens de erro)
 * @returns {Object} - Dados validados e limpos
 * @throws {Error} - Se os dados forem inválidos
 */
function validateCard(card, index = 0) {
    // Campos obrigatórios
    const requiredFields = ['name'];
    
    // Campos opcionais (médico e padrão)
    const optionalFields = ['title', 'company', 'professional', 'crm', 'crm_uf', 'phone', 'email', 'website', 'logo'];
    
    // Verificar se o objeto existe
    if (!card || typeof card !== 'object') {
        throw new Error(`Cartão ${index + 1}: Dados do cartão devem ser um objeto válido`);
    }
    
    // Verificar campos obrigatórios
    for (const field of requiredFields) {
        if (!card[field] || typeof card[field] !== 'string' || card[field].trim() === '') {
            throw new Error(`Cartão ${index + 1}: Campo obrigatório '${field}' não fornecido ou vazio`);
        }
    }
    
    // Limpar e validar dados
    const cleanCard = {};
    
    // Processar campos obrigatórios
    cleanCard.name = card.name.trim();
    
    // Processar campos opcionais
    for (const field of optionalFields) {
        if (card[field] && typeof card[field] === 'string') {
            cleanCard[field] = card[field].trim();
        } else if (card[field]) {
            cleanCard[field] = card[field];
        } else {
            cleanCard[field] = '';
        }
    }
    
    // Validações específicas
    validateEmail(cleanCard.email, index);
    validateWebsite(cleanCard.website, index);
    validatePhone(cleanCard.phone, index);
    validateLogo(cleanCard.logo, index);
    validateCRM(cleanCard.crm, cleanCard.crm_uf, index);
    
    return cleanCard;
}

/**
 * Valida formato de email
 * @param {string} email - Email para validar
 * @param {number} index - Índice do cartão
 * @throws {Error} - Se o email for inválido
 */
function validateEmail(email, index) {
    if (!email) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error(`Cartão ${index + 1}: Email inválido '${email}'`);
    }
}

/**
 * Valida formato de website
 * @param {string} website - Website para validar
 * @param {number} index - Índice do cartão
 * @throws {Error} - Se o website for inválido
 */
function validateWebsite(website, index) {
    if (!website) return;
    
    // Adicionar protocolo se não tiver
    let url = website;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    try {
        new URL(url);
    } catch (error) {
        throw new Error(`Cartão ${index + 1}: Website inválido '${website}'`);
    }
}

/**
 * Valida formato de telefone
 * @param {string} phone - Telefone para validar
 * @param {number} index - Índice do cartão
 * @throws {Error} - Se o telefone for inválido
 */
function validatePhone(phone, index) {
    if (!phone) return;
    
    // Regex para telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error(`Cartão ${index + 1}: Telefone inválido '${phone}'. Use o formato (XX) XXXXX-XXXX`);
    }
}

/**
 * Valida caminho do logo
 * @param {string} logo - Caminho do logo
 * @param {number} index - Índice do cartão
 * @throws {Error} - Se o logo for inválido
 */
function validateLogo(logo, index) {
    if (!logo) return;
    
    // Verificar se é uma string válida
    if (typeof logo !== 'string') {
        throw new Error(`Cartão ${index + 1}: Logo deve ser uma string com o caminho do arquivo`);
    }
    
    // Verificar extensão do arquivo
    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'];
    const hasValidExtension = validExtensions.some(ext => 
        logo.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
        throw new Error(`Cartão ${index + 1}: Logo deve ter uma extensão válida (${validExtensions.join(', ')})`);
    }
}

/**
 * Valida CRM (Conselho Regional de Medicina)
 * @param {string} crm - Número do CRM
 * @param {string} crm_uf - Estado do CRM
 * @param {number} index - Índice do cartão
 * @throws {Error} - Se o CRM for inválido
 */
function validateCRM(crm, crm_uf, index) {
    // Se não tem CRM, não precisa validar
    if (!crm && !crm_uf) return;
    
    // Se tem um, deve ter o outro
    if ((crm && !crm_uf) || (!crm && crm_uf)) {
        throw new Error(`Cartão ${index + 1}: CRM e CRM_UF devem ser fornecidos juntos`);
    }
    
    // Validar formato do CRM (apenas números)
    if (crm && !/^\d+$/.test(crm)) {
        throw new Error(`Cartão ${index + 1}: CRM deve conter apenas números`);
    }
    
    // Validar formato do CRM_UF (2 letras maiúsculas)
    if (crm_uf && !/^[A-Z]{2}$/.test(crm_uf)) {
        throw new Error(`Cartão ${index + 1}: CRM_UF deve ter 2 letras maiúsculas (ex: BA, SP, RJ)`);
    }
}

/**
 * Valida um array de cartões
 * @param {Array} cards - Array de cartões
 * @returns {Array} - Array de cartões validados
 * @throws {Error} - Se algum cartão for inválido
 */
function validateCards(cards) {
    if (!Array.isArray(cards)) {
        throw new Error('Dados devem ser um array de cartões');
    }
    
    if (cards.length === 0) {
        throw new Error('Array de cartões não pode estar vazio');
    }
    
    const validatedCards = [];
    const errors = [];
    
    // Validar cada cartão
    for (let i = 0; i < cards.length; i++) {
        try {
            const validatedCard = validateCard(cards[i], i);
            validatedCards.push(validatedCard);
        } catch (error) {
            errors.push(error.message);
        }
    }
    
    // Se houver erros, lançar exceção com todos os erros
    if (errors.length > 0) {
        throw new Error(`Erros de validação:\n${errors.join('\n')}`);
    }
    
    return validatedCards;
}

/**
 * Valida arquivo JSON
 * @param {string} jsonPath - Caminho do arquivo JSON
 * @returns {Array} - Array de cartões validados
 * @throws {Error} - Se o arquivo for inválido
 */
function validateJSONFile(jsonPath) {
    const fs = require('fs');
    
    try {
        // Verificar se arquivo existe
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`Arquivo não encontrado: ${jsonPath}`);
        }
        
        // Ler arquivo
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        
        // Parsear JSON
        const cards = JSON.parse(fileContent);
        
        // Validar cartões
        return validateCards(cards);
        
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Arquivo JSON inválido: ${error.message}`);
        }
        throw error;
    }
}

module.exports = {
    validateCard,
    validateCards,
    validateJSONFile,
    validateEmail,
    validateWebsite,
    validatePhone,
    validateLogo,
    validateCRM
};
