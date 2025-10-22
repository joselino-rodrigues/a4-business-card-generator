const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Classe principal para gerar cartões de visita em formato A4
 * Organiza cartões em grade 2x5 (10 cartões por página)
 * Dimensões: 85x55 mm por cartão
 */
class BusinessCardGenerator {
    constructor(options = {}) {
        // Configurações padrão
        this.options = {
            // Dimensões A4 em pontos (1 mm = 2.834645669 pontos)
            pageWidth: 595.28,  // 210 mm
            pageHeight: 841.89, // 297 mm
            
            // Dimensões do cartão em pontos
            cardWidth: 240.94,  // 85 mm
            cardHeight: 155.91, // 55 mm
            
            // Margens da página em pontos
            marginTop: 28.35,    // 10 mm
            marginLeft: 28.35,   // 10 mm
            marginRight: 28.35,  // 10 mm
            marginBottom: 28.35, // 10 mm
            
            // Espaçamento entre cartões em pontos
            cardSpacing: 14.17,  // 5 mm
            
            // Configurações de fonte
            fontFamily: 'Helvetica',
            fontSize: {
                name: 16,
                title: 12,
                company: 10,
                contact: 9
            },
            
            // Cores padrão
            colors: {
                primary: '#333333',
                secondary: '#666666',
                accent: '#007bff'
            },
            
            // Configurações de linha de corte
            showCutLines: true,
            cutLineColor: '#cccccc',
            cutLineWidth: 0.5,
            
            ...options
        };
        
        // Calcular posições dos cartões na grade 2x5
        this.calculateCardPositions();
    }
    
    /**
     * Calcula as posições dos cartões na página A4
     * Grade 2x5 = 2 colunas x 5 linhas = 10 cartões por página
     */
    calculateCardPositions() {
        this.cardPositions = [];
        
        const availableWidth = this.options.pageWidth - this.options.marginLeft - this.options.marginRight;
        const availableHeight = this.options.pageHeight - this.options.marginTop - this.options.marginBottom;
        
        // Calcular espaçamento disponível entre cartões
        const horizontalSpacing = (availableWidth - (2 * this.options.cardWidth)) / 1;
        const verticalSpacing = (availableHeight - (5 * this.options.cardHeight)) / 4;
        
        // Gerar posições para 10 cartões (2x5)
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 2; col++) {
                const x = this.options.marginLeft + (col * (this.options.cardWidth + horizontalSpacing));
                const y = this.options.marginTop + (row * (this.options.cardHeight + verticalSpacing));
                
                this.cardPositions.push({
                    x: x,
                    y: y,
                    width: this.options.cardWidth,
                    height: this.options.cardHeight
                });
            }
        }
    }
    
    /**
     * Valida os dados de um cartão de visita
     * @param {Object} cardData - Dados do cartão
     * @returns {Object} - Dados validados e limpos
     */
    validateCardData(cardData) {
        const required = ['name'];
        const optional = ['title', 'company', 'phone', 'email', 'website', 'logo'];
        
        // Verificar campos obrigatórios
        for (const field of required) {
            if (!cardData[field] || typeof cardData[field] !== 'string') {
                throw new Error(`Campo obrigatório '${field}' não fornecido ou inválido`);
            }
        }
        
        // Limpar e validar dados
        const cleanData = {
            name: cardData.name.trim(),
            title: cardData.title ? cardData.title.trim() : '',
            company: cardData.company ? cardData.company.trim() : '',
            phone: cardData.phone ? cardData.phone.trim() : '',
            email: cardData.email ? cardData.email.trim() : '',
            website: cardData.website ? cardData.website.trim() : '',
            logo: cardData.logo || null
        };
        
        // Validar email se fornecido
        if (cleanData.email && !this.isValidEmail(cleanData.email)) {
            throw new Error('Email inválido fornecido');
        }
        
        // Validar website se fornecido
        if (cleanData.website && !this.isValidUrl(cleanData.website)) {
            throw new Error('Website inválido fornecido');
        }
        
        return cleanData;
    }
    
    /**
     * Valida formato de email
     * @param {string} email - Email para validar
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Valida formato de URL
     * @param {string} url - URL para validar
     * @returns {boolean}
     */
    isValidUrl(url) {
        try {
            new URL(url.startsWith('http') ? url : `https://${url}`);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Desenha um cartão de visita no PDF
     * @param {PDFDocument} doc - Documento PDF
     * @param {Object} cardData - Dados do cartão
     * @param {Object} position - Posição do cartão na página
     */
    async drawCard(doc, cardData, position) {
        const { x, y, width, height } = position;
        
        // Desenhar borda do cartão (opcional)
        doc.rect(x, y, width, height)
           .strokeColor('#e0e0e0')
           .lineWidth(0.5)
           .stroke();
        
        // Desenhar logo se fornecido
        if (cardData.logo) {
            await this.drawLogo(doc, cardData.logo, x, y, width);
        }
        
        // Desenhar informações do cartão
        this.drawCardInfo(doc, cardData, x, y, width, height);
        
        // Desenhar linhas de corte se habilitado
        if (this.options.showCutLines) {
            this.drawCutLines(doc, x, y, width, height);
        }
    }
    
    /**
     * Desenha o logo no cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {string} logoPath - Caminho para o logo
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} cardWidth - Largura do cartão
     */
    async drawLogo(doc, logoPath, x, y, cardWidth) {
        try {
            // Verificar se o arquivo existe
            if (!fs.existsSync(logoPath)) {
                console.warn(`Logo não encontrado: ${logoPath}`);
                return;
            }
            
            // Redimensionar logo usando Sharp
            const logoBuffer = await sharp(logoPath)
                .resize(60, 60, { fit: 'inside', withoutEnlargement: true })
                .png()
                .toBuffer();
            
            // Posicionar logo no canto superior esquerdo
            const logoX = x + 10;
            const logoY = y + 10;
            
            doc.image(logoBuffer, logoX, logoY, { width: 60, height: 60 });
            
        } catch (error) {
            console.warn(`Erro ao processar logo: ${error.message}`);
        }
    }
    
    /**
     * Desenha as informações do cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {Object} cardData - Dados do cartão
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura do cartão
     * @param {number} height - Altura do cartão
     */
    drawCardInfo(doc, cardData, x, y, width, height) {
        const startX = cardData.logo ? x + 80 : x + 10;
        const startY = y + 15;
        let currentY = startY;
        
        // Nome (fonte maior e negrito)
        doc.fontSize(this.options.fontSize.name)
           .font('Helvetica-Bold')
           .fillColor(this.options.colors.primary)
           .text(cardData.name, startX, currentY, {
               width: width - (startX - x) - 10,
               align: 'left'
           });
        
        currentY += this.options.fontSize.name + 5;
        
        // Cargo/Título
        if (cardData.title) {
            doc.fontSize(this.options.fontSize.title)
               .font('Helvetica')
               .fillColor(this.options.colors.secondary)
               .text(cardData.title, startX, currentY, {
                   width: width - (startX - x) - 10,
                   align: 'left'
               });
            currentY += this.options.fontSize.title + 3;
        }
        
        // Empresa
        if (cardData.company) {
            doc.fontSize(this.options.fontSize.company)
               .font('Helvetica-Bold')
               .fillColor(this.options.colors.accent)
               .text(cardData.company, startX, currentY, {
                   width: width - (startX - x) - 10,
                   align: 'left'
               });
            currentY += this.options.fontSize.company + 8;
        }
        
        // Informações de contato
        const contactInfo = [];
        if (cardData.phone) contactInfo.push(`📞 ${cardData.phone}`);
        if (cardData.email) contactInfo.push(`✉️ ${cardData.email}`);
        if (cardData.website) contactInfo.push(`🌐 ${cardData.website}`);
        
        if (contactInfo.length > 0) {
            doc.fontSize(this.options.fontSize.contact)
               .font('Helvetica')
               .fillColor(this.options.colors.secondary)
               .text(contactInfo.join('\n'), startX, currentY, {
                   width: width - (startX - x) - 10,
                   align: 'left',
                   lineGap: 2
               });
        }
    }
    
    /**
     * Desenha linhas de corte ao redor do cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura do cartão
     * @param {number} height - Altura do cartão
     */
    drawCutLines(doc, x, y, width, height) {
        doc.strokeColor(this.options.cutLineColor)
           .lineWidth(this.options.cutLineWidth)
           .dash(2, { space: 2 });
        
        // Linha superior
        doc.moveTo(x, y)
           .lineTo(x + width, y)
           .stroke();
        
        // Linha inferior
        doc.moveTo(x, y + height)
           .lineTo(x + width, y + height)
           .stroke();
        
        // Linha esquerda
        doc.moveTo(x, y)
           .lineTo(x, y + height)
           .stroke();
        
        // Linha direita
        doc.moveTo(x + width, y)
           .lineTo(x + width, y + height)
           .stroke();
        
        // Resetar dash
        doc.undash();
    }
    
    /**
     * Gera o PDF com os cartões de visita
     * @param {Array} cardsData - Array com dados dos cartões
     * @param {string} outputPath - Caminho do arquivo de saída
     * @returns {Promise<string>} - Caminho do arquivo gerado
     */
    async generatePDF(cardsData, outputPath = 'business-cards.pdf') {
        if (!Array.isArray(cardsData) || cardsData.length === 0) {
            throw new Error('Array de cartões não fornecido ou vazio');
        }
        
        // Validar todos os cartões
        const validatedCards = cardsData.map((card, index) => {
            try {
                return this.validateCardData(card);
            } catch (error) {
                throw new Error(`Erro no cartão ${index + 1}: ${error.message}`);
            }
        });
        
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
        
        // Processar cartões em páginas
        let currentPage = 0;
        let cardsInCurrentPage = 0;
        
        for (let i = 0; i < validatedCards.length; i++) {
            // Se necessário, criar nova página
            if (cardsInCurrentPage === 0) {
                if (i > 0) {
                    doc.addPage();
                }
                currentPage++;
            }
            
            // Obter posição do cartão na página atual
            const position = this.cardPositions[cardsInCurrentPage];
            
            // Desenhar cartão
            await this.drawCard(doc, validatedCards[i], position);
            
            cardsInCurrentPage++;
            
            // Se completou uma página (10 cartões), resetar contador
            if (cardsInCurrentPage === 10) {
                cardsInCurrentPage = 0;
            }
        }
        
        // Finalizar documento
        doc.end();
        
        return new Promise((resolve, reject) => {
            stream.on('finish', () => {
                console.log(`PDF gerado com sucesso: ${outputPath}`);
                console.log(`Total de cartões: ${validatedCards.length}`);
                console.log(`Total de páginas: ${currentPage}`);
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
     * @returns {Promise<string>} - Caminho do arquivo gerado
     */
    async generateFromJSON(jsonPath, outputPath) {
        try {
            const jsonData = fs.readFileSync(jsonPath, 'utf8');
            const cardsData = JSON.parse(jsonData);
            
            if (!Array.isArray(cardsData)) {
                throw new Error('Arquivo JSON deve conter um array de cartões');
            }
            
            return await this.generatePDF(cardsData, outputPath);
        } catch (error) {
            throw new Error(`Erro ao processar arquivo JSON: ${error.message}`);
        }
    }
}

module.exports = BusinessCardGenerator;
