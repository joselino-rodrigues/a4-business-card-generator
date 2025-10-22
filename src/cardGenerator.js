/**
 * Módulo para geração do design dos cartões de visita
 * Desenha cartões individuais com base nos dados fornecidos
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Classe para gerar o design de cartões de visita
 */
class CardGenerator {
    constructor(template = null) {
        // Carregar template básico se não fornecido
        this.template = template || require('../templates/basic');
    }
    
    /**
     * Desenha um cartão de visita no documento PDF
     * @param {PDFDocument} doc - Documento PDF do pdfkit
     * @param {Object} cardData - Dados do cartão validados
     * @param {Object} position - Posição do cartão na página {x, y, width, height}
     * @returns {Promise<void>}
     */
    async drawCard(doc, cardData, position) {
        const { x, y, width, height } = position;
        
        // Desenhar fundo do cartão
        this.drawCardBackground(doc, x, y, width, height);
        
        // Desenhar logo se fornecido
        if (cardData.logo) {
            await this.drawLogo(doc, cardData.logo, x, y, width, height);
        }
        
        // Desenhar informações do cartão
        this.drawCardInfo(doc, cardData, x, y, width, height);
        
        // Desenhar borda do cartão
        this.drawCardBorder(doc, x, y, width, height);
    }
    
    /**
     * Desenha o fundo do cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     */
    drawCardBackground(doc, x, y, width, height) {
        doc.rect(x, y, width, height)
           .fillColor(this.template.colors.background)
           .fill();
    }
    
    /**
     * Desenha o logo no cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {string} logoPath - Caminho do logo
     * @param {number} x - Posição X do cartão
     * @param {number} y - Posição Y do cartão
     * @param {number} cardWidth - Largura do cartão
     * @param {number} cardHeight - Altura do cartão
     * @returns {Promise<void>}
     */
    async drawLogo(doc, logoPath, x, y, cardWidth, cardHeight) {
        try {
            // Verificar se arquivo existe
            if (!fs.existsSync(logoPath)) {
                console.warn(`Logo não encontrado: ${logoPath}`);
                return;
            }
            
            // Redimensionar logo usando Sharp
            const logoBuffer = await sharp(logoPath)
                .resize(this.template.layout.logoWidth, this.template.layout.logoHeight, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .png()
                .toBuffer();
            
            // Posicionar logo no canto superior esquerdo
            const logoX = x + this.template.layout.padding;
            const logoY = y + this.template.layout.padding;
            
            doc.image(logoBuffer, logoX, logoY, {
                width: this.template.layout.logoWidth,
                height: this.template.layout.logoHeight
            });
            
        } catch (error) {
            console.warn(`Erro ao processar logo: ${error.message}`);
        }
    }
    
    /**
     * Desenha as informações do cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {Object} cardData - Dados do cartão
     * @param {number} x - Posição X do cartão
     * @param {number} y - Posição Y do cartão
     * @param {number} cardWidth - Largura do cartão
     * @param {number} cardHeight - Altura do cartão
     */
    drawCardInfo(doc, cardData, x, y, cardWidth, cardHeight) {
        // Calcular posição inicial do texto
        const startX = cardData.logo ? 
            x + this.template.layout.padding + this.template.layout.logoWidth + 10 : 
            x + this.template.layout.padding;
        
        const startY = y + this.template.layout.padding;
        const textWidth = cardWidth - (startX - x) - this.template.layout.padding;
        
        let currentY = startY;
        
        // Nome (fonte maior e negrito)
        doc.fontSize(this.template.fontSize.name)
           .font('Helvetica-Bold')
           .fillColor(this.template.colors.primary)
           .text(cardData.name, startX, currentY, {
               width: textWidth,
               align: 'left'
           });
        
        currentY += this.template.fontSize.name + this.template.layout.lineSpacing;
        
        // Cargo/Título
        if (cardData.title) {
            doc.fontSize(this.template.fontSize.title)
               .font('Helvetica')
               .fillColor(this.template.colors.secondary)
               .text(cardData.title, startX, currentY, {
                   width: textWidth,
                   align: 'left'
               });
            currentY += this.template.fontSize.title + this.template.layout.sectionSpacing;
        }
        
        // Empresa
        if (cardData.company) {
            doc.fontSize(this.template.fontSize.company)
               .font('Helvetica-Bold')
               .fillColor(this.template.colors.accent)
               .text(cardData.company, startX, currentY, {
                   width: textWidth,
                   align: 'left'
               });
            currentY += this.template.fontSize.company + this.template.layout.sectionSpacing;
        }
        
        // Informações de contato
        this.drawContactInfo(doc, cardData, startX, currentY, textWidth);
    }
    
    /**
     * Desenha as informações de contato
     * @param {PDFDocument} doc - Documento PDF
     * @param {Object} cardData - Dados do cartão
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura disponível
     */
    drawContactInfo(doc, cardData, x, y, width) {
        const contactInfo = [];
        
        if (cardData.phone) {
            contactInfo.push(`📞 ${cardData.phone}`);
        }
        
        if (cardData.email) {
            contactInfo.push(`✉️ ${cardData.email}`);
        }
        
        if (cardData.website) {
            contactInfo.push(`🌐 ${cardData.website}`);
        }
        
        if (contactInfo.length > 0) {
            doc.fontSize(this.template.fontSize.contact)
               .font('Helvetica')
               .fillColor(this.template.colors.contact)
               .text(contactInfo.join('\n'), x, y, {
                   width: width,
                   align: 'left',
                   lineGap: this.template.layout.lineSpacing
               });
        }
    }
    
    /**
     * Desenha a borda do cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     */
    drawCardBorder(doc, x, y, width, height) {
        doc.rect(x, y, width, height)
           .strokeColor('#e0e0e0')
           .lineWidth(0.5)
           .stroke();
    }
    
    /**
     * Desenha linhas de corte ao redor do cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     */
    drawCutLines(doc, x, y, width, height) {
        if (!this.template.cutLines.enabled) return;
        
        doc.strokeColor(this.template.cutLines.color)
           .lineWidth(this.template.cutLines.width)
           .dash(this.template.cutLines.dash[0], { space: this.template.cutLines.dash[1] });
        
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
     * Calcula as dimensões do texto para ajuste automático
     * @param {string} text - Texto para medir
     * @param {number} fontSize - Tamanho da fonte
     * @param {string} fontFamily - Família da fonte
     * @returns {Object} - Dimensões {width, height}
     */
    calculateTextDimensions(text, fontSize, fontFamily = 'Helvetica') {
        // Esta é uma implementação simplificada
        // Em uma implementação real, você usaria uma biblioteca como pdf-lib
        // para medir texto com precisão
        const avgCharWidth = fontSize * 0.6;
        const lineHeight = fontSize * 1.2;
        
        const lines = text.split('\n');
        const maxLineLength = Math.max(...lines.map(line => line.length));
        
        return {
            width: maxLineLength * avgCharWidth,
            height: lines.length * lineHeight
        };
    }
}

module.exports = CardGenerator;
