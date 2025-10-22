/**
 * Módulo para geração do design dos cartões de visita
 * Desenha cartões individuais com base nos dados fornecidos
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

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
        
        // Desenhar fundo do cartão com imagem completa
        await this.drawCardBackground(doc, x, y, width, height, cardData.logo);
        
        // Imagem full.png como fundo completo
        
        // Desenhar informações do cartão
        this.drawCardInfo(doc, cardData, x, y, width, height);
        
        // Desenhar QR Code se habilitado e website fornecido
        if (cardData.website && this.template.qrCode.enabled) {
            await this.drawQRCode(doc, cardData.website, x, y, width, height);
        }
        
        // Desenhar borda do cartão
        this.drawCardBorder(doc, x, y, width, height);
    }
    
    /**
     * Desenha o fundo PREMIUM do cartão COM IMAGEM COMPLETA
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     * @param {string} logoPath - Caminho da imagem de fundo
     */
    async drawCardBackground(doc, x, y, width, height, logoPath = null) {
        const { layout, colors, effects } = this.template;
        
        // Sombra do cartão (se habilitada)
        if (effects.shadow) {
            doc.rect(x + layout.shadowOffset, y + layout.shadowOffset, width, height)
               .fillColor(colors.shadowColor || '#00000020')
               .fill();
        }
        
        // Fundo principal do cartão
        doc.rect(x, y, width, height)
           .fillColor(colors.cardBackground)
           .fill();
        
        // Imagem como fundo completo (se fornecida)
        if (logoPath && fs.existsSync(logoPath)) {
            await this.drawBackgroundLogo(doc, logoPath, x, y, width, height);
        } else {
            // Gradiente sutil (se não tiver imagem)
            if (effects.gradient) {
                this.drawGradientBackground(doc, x, y, width, height);
            }
        }
        
        // Borda elegante (se habilitada)
        if (effects.border) {
            doc.rect(x, y, width, height)
               .strokeColor(colors.border)
               .lineWidth(0.5)
               .stroke();
        }
    }
    
    /**
     * Desenha logo como fundo do cartão (IMAGEM COMPLETA)
     * @param {PDFDocument} doc - Documento PDF
     * @param {string} logoPath - Caminho do logo
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura do cartão
     * @param {number} height - Altura do cartão
     */
    async drawBackgroundLogo(doc, logoPath, x, y, width, height) {
        try {
            // Redimensionar logo para cobrir todo o cartão com alta qualidade
            const logoBuffer = await sharp(logoPath)
                .resize(width, height, { 
                    fit: 'cover', 
                    position: 'center',
                    withoutEnlargement: false
                })
                .png()
                .toBuffer();
            
            // Aplicar transparência ao logo (30% de opacidade para melhor legibilidade)
            const transparentLogo = await sharp(logoBuffer)
                .composite([{
                    input: Buffer.from(`<svg width="${width}" height="${height}">
                        <rect width="100%" height="100%" fill="white" opacity="0.7"/>
                    </svg>`),
                    blend: 'multiply'
                }])
                .png()
                .toBuffer();
            
            // Desenhar logo como fundo completo
            doc.image(transparentLogo, x, y, {
                width: width,
                height: height
            });
            
        } catch (error) {
            console.warn(`Erro ao processar logo de fundo: ${error.message}`);
        }
    }
    
    /**
     * Desenha gradiente sutil no fundo
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     */
    drawGradientBackground(doc, x, y, width, height) {
        const { gradients } = this.template;
        
        // Gradiente sutil de cima para baixo
        const gradient = doc.linearGradient(x, y, x, y + height);
        gradient.stop(0, gradients.primary[0])
               .stop(1, gradients.primary[1]);
        
        doc.rect(x, y, width, height)
           .fill(gradient);
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
     * Desenha as informações do cartão ALINHADAS À ESQUERDA
     * @param {PDFDocument} doc - Documento PDF
     * @param {Object} cardData - Dados do cartão
     * @param {number} x - Posição X do cartão
     * @param {number} y - Posição Y do cartão
     * @param {number} cardWidth - Largura do cartão
     * @param {number} cardHeight - Altura do cartão
     */
    drawCardInfo(doc, cardData, x, y, cardWidth, cardHeight) {
        const { layout, colors, fontSize } = this.template;
        
        // Calcular posição inicial do texto - ALINHADO À ESQUERDA
        const startX = x + layout.padding; // Sempre à esquerda
        const startY = y + layout.padding;
        const textWidth = cardWidth - (layout.padding * 2); // Largura total disponível
        
        let currentY = startY;
        
        // Linha decorativa no topo (sempre visível sem logo)
        this.drawDecorativeLine(doc, startX, currentY - 5, textWidth);
        
        // Nome do médico com destaque padrão - AUTORIDADE MÉDICA
        doc.fontSize(fontSize.name)
           .font('Helvetica-Bold')
           .fillColor('#ffffff') // Texto branco para contraste sobre imagem
           .text(cardData.name, startX, currentY, {
               width: textWidth,
               align: 'left'
           });
        
        currentY += fontSize.name + layout.lineSpacing + 3;
        
        // Especialidades Médicas com RQE - PADRÃO PROFISSIONAL
        if (cardData.professional || cardData.title) {
            const specialty = cardData.professional || cardData.title;
            const specialtyFontSize = fontSize.professional || fontSize.title || 9;
            
            // Dividir por quebras de linha (\n) para múltiplas especialidades
            const specialtySections = specialty.split('\n');
            
            doc.fontSize(specialtyFontSize)
               .font('Helvetica')
               .fillColor('#fbbf24'); // Texto dourado elegante
            
            specialtySections.forEach((section, index) => {
                // Tratar quebras de linha dentro de cada seção
                const sectionLines = this.wrapText(section.trim(), textWidth, specialtyFontSize);
                
                sectionLines.forEach(line => {
                    doc.text(line, startX, currentY, {
                        width: textWidth,
                        align: 'left'
                    });
                    currentY += specialtyFontSize + 1;
                });
                
                // Espaçamento entre especialidades
                if (index < specialtySections.length - 1) {
                    currentY += 2;
                }
            });
            
            currentY += layout.sectionSpacing;
        }
        
        // CRM - Informação importante para médico com fundo padrão
        if (cardData.crm && cardData.crm_uf) {
            const crmFontSize = fontSize.crm || fontSize.company || 12;
            // Fundo destacado padrão para CRM
            this.drawElegantCRMBackground(doc, startX - 4, currentY - 2, textWidth + 8, crmFontSize + 4);
            
            doc.fontSize(crmFontSize)
               .font('Helvetica-Bold')
               .fillColor('#ffffff') // Texto branco para contraste
               .text(`CRM: ${cardData.crm}/${cardData.crm_uf}`, startX, currentY, {
                   width: textWidth,
                   align: 'left'
               });
            currentY += crmFontSize + layout.sectionSpacing + 4;
        } else if (cardData.company) {
            const companyFontSize = fontSize.company || 11;
            // Empresa com destaque especial - COM CONTRASTE SOBRE IMAGEM
            this.drawCompanyBackground(doc, startX - 3, currentY - 2, textWidth + 6, companyFontSize + 4);
            
            doc.fontSize(companyFontSize)
               .font('Helvetica-Bold')
               .fillColor('#ffffff') // Texto branco para contraste
               .text(cardData.company, startX, currentY, {
                   width: textWidth,
                   align: 'left'
               });
            currentY += companyFontSize + layout.sectionSpacing + 5;
        }
        
        // Informações Acadêmicas - Graduação
        if (cardData.graduation || cardData.graduation_year) {
            const graduationFontSize = fontSize.graduation || 8;
            
            doc.fontSize(graduationFontSize)
               .font('Helvetica')
               .fillColor('#cbd5e1'); // Texto cinza claro para informações acadêmicas
            
            if (cardData.graduation) {
                // Tratar quebras de linha na universidade
                const graduationLines = this.wrapText(cardData.graduation, textWidth, graduationFontSize);
                
                graduationLines.forEach(line => {
                    doc.text(line, startX, currentY, {
                        width: textWidth,
                        align: 'left'
                    });
                    currentY += graduationFontSize + 1;
                });
            }
            
            if (cardData.graduation_year) {
                doc.text(`Formado em: ${cardData.graduation_year}`, startX, currentY, {
                    width: textWidth,
                    align: 'left'
                });
                currentY += graduationFontSize + 1;
            }
            
            currentY += layout.sectionSpacing;
        }
        
        // Linha separadora elegante
        this.drawSeparatorLine(doc, startX, currentY, textWidth);
        currentY += 8;
        
        // Informações de contato - ALINHADAS À ESQUERDA
        this.drawContactInfoLeft(doc, cardData, startX, currentY, textWidth);
    }
    
    /**
     * Quebra texto em linhas baseado na largura disponível
     * @param {string} text - Texto para quebrar
     * @param {number} width - Largura disponível
     * @param {number} fontSize - Tamanho da fonte
     * @returns {Array} - Array de linhas
     */
    wrapText(text, width, fontSize) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        // Aproximação: 0.6 * fontSize = largura média por caractere
        const avgCharWidth = fontSize * 0.6;
        const maxCharsPerLine = Math.floor(width / avgCharWidth);
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            if (testLine.length <= maxCharsPerLine) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    lines.push(word);
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }
    
    /**
     * Desenha linha decorativa no topo
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     */
    drawDecorativeLine(doc, x, y, width) {
        const { colors } = this.template;
        
        // Linha principal
        doc.moveTo(x, y)
           .lineTo(x + width, y)
           .strokeColor(colors.accent)
           .lineWidth(2)
           .stroke();
        
        // Linha sutil abaixo
        doc.moveTo(x, y + 1)
           .lineTo(x + width, y + 1)
           .strokeColor(colors.highlight)
           .lineWidth(0.5)
           .stroke();
    }
    
    /**
     * Desenha fundo destacado para empresa
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     */
    drawCompanyBackground(doc, x, y, width, height) {
        const { colors } = this.template;
        
        doc.rect(x, y, width, height)
           .fillColor(colors.accent + '15') // 15% de opacidade
           .fill();
    }
    
    /**
     * Desenha fundo elegante para CRM
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     */
    drawElegantCRMBackground(doc, x, y, width, height) {
        const { layout } = this.template;
        
        // Fundo principal com gradiente sutil
        doc.rect(x, y, width, height)
           .fillColor('#1e40af') // Azul médico elegante
           .fill();
        
        // Borda elegante
        doc.rect(x, y, width, height)
           .strokeColor('#3b82f6')
           .lineWidth(1)
           .stroke();
        
        // Cantos arredondados simulados
        doc.circle(x + layout.borderRadius, y + layout.borderRadius, layout.borderRadius)
           .fillColor('#1e40af')
           .fill();
        doc.circle(x + width - layout.borderRadius, y + layout.borderRadius, layout.borderRadius)
           .fillColor('#1e40af')
           .fill();
        doc.circle(x + layout.borderRadius, y + height - layout.borderRadius, layout.borderRadius)
           .fillColor('#1e40af')
           .fill();
        doc.circle(x + width - layout.borderRadius, y + height - layout.borderRadius, layout.borderRadius)
           .fillColor('#1e40af')
           .fill();
    }
    
    /**
     * Desenha linha separadora elegante
     * @param {PDFDocument} doc - Documento PDF
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     */
    drawSeparatorLine(doc, x, y, width) {
        const { colors } = this.template;
        
        // Linha pontilhada elegante
        doc.moveTo(x, y)
           .lineTo(x + width, y)
           .strokeColor(colors.border)
           .lineWidth(0.5)
           .dash([2, 2])
           .stroke();
    }
    
    /**
     * Desenha as informações de contato COM CONTRASTE SOBRE IMAGEM
     * @param {PDFDocument} doc - Documento PDF
     * @param {Object} cardData - Dados do cartão
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura disponível
     */
    drawContactInfoLeft(doc, cardData, x, y, width) {
        const { fontSize, layout } = this.template;
        const contactFontSize = fontSize.contact || 10;
        let currentY = y;
        
        // Telefone com ícone simples e contraste
        if (cardData.phone) {
            this.drawContactItem(doc, 'T:', cardData.phone, x, currentY, width, '#ffffff');
            currentY += contactFontSize + layout.lineSpacing + 2;
        }
        
        // Email com ícone simples e contraste
        if (cardData.email) {
            this.drawContactItem(doc, 'E:', cardData.email, x, currentY, width, '#ffffff');
            currentY += contactFontSize + layout.lineSpacing + 2;
        }
        
        // Website com ícone simples e contraste
        if (cardData.website) {
            this.drawContactItem(doc, 'W:', cardData.website, x, currentY, width, '#ffffff');
        }
    }
    
    /**
     * Desenha um item de contato individual
     * @param {PDFDocument} doc - Documento PDF
     * @param {string} icon - Ícone
     * @param {string} text - Texto
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {string} color - Cor do texto
     */
    drawContactItem(doc, icon, text, x, y, width, color) {
        const { fontSize } = this.template;
        const contactFontSize = fontSize.contact || 10;
        
        // Ícone
        doc.fontSize(contactFontSize)
           .font('Helvetica')
           .fillColor(color)
           .text(icon, x, y, {
               width: 20,
               align: 'left'
           });
        
        // Texto
        doc.fontSize(contactFontSize)
           .font('Helvetica')
           .fillColor(color)
           .text(text, x + 20, y, {
               width: width - 20,
               align: 'left'
           });
    }
    
    /**
     * Desenha QR Code do website no cartão
     * @param {PDFDocument} doc - Documento PDF
     * @param {string} website - Website para gerar QR Code
     * @param {number} x - Posição X do cartão
     * @param {number} y - Posição Y do cartão
     * @param {number} cardWidth - Largura do cartão
     * @param {number} cardHeight - Altura do cartão
     */
    async drawQRCode(doc, website, x, y, cardWidth, cardHeight) {
        try {
            const { qrCode } = this.template;
            
            // Garantir que o website tenha protocolo
            let url = website;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            // Gerar QR Code com RESOLUÇÃO ULTRA ALTA
            const resolution = qrCode.resolution || 16; // 16x resolução base
            const qrBuffer = await QRCode.toBuffer(url, {
                width: qrCode.size * resolution, // Resolução ultra alta
                margin: 4,                       // Margem maior para melhor qualidade
                color: {
                    dark: qrCode.color,
                    light: qrCode.backgroundColor
                },
                errorCorrectionLevel: qrCode.quality || 'H', // Qualidade máxima
                type: 'png'                      // PNG para melhor qualidade
            });
            
            // Processamento avançado com Sharp para máxima qualidade
            let processedQR = sharp(qrBuffer);
            
            // Aplicar nitidez se habilitada
            if (qrCode.sharpening) {
                processedQR = processedQR.sharpen({
                    sigma: 1.0,      // Intensidade da nitidez
                    flat: 1.0,       // Nitidez de áreas planas
                    jagged: 2.0      // Nitidez de bordas
                });
            }
            
            // Redimensionar com algoritmo de alta qualidade
            processedQR = processedQR.resize(qrCode.size, qrCode.size, {
                kernel: sharp.kernel.lanczos3,  // Algoritmo Lanczos3 (melhor qualidade)
                fit: 'fill',                     // Preencher completamente
                background: { r: 255, g: 255, b: 255, alpha: 1 } // Fundo branco
            });
            
            // Aplicar suavização se habilitada
            if (qrCode.antialiasing) {
                processedQR = processedQR.png({
                    quality: 100,                // Qualidade máxima
                    compressionLevel: 0,         // Sem compressão
                    adaptiveFiltering: true,     // Filtro adaptativo
                    palette: false,             // Sem paleta para melhor qualidade
                    effort: 10                  // Máximo esforço de otimização
                });
            } else {
                processedQR = processedQR.png({
                    quality: 100,
                    compressionLevel: 0
                });
            }
            
            const resizedQR = await processedQR.toBuffer();
            
            // Calcular posição do QR Code
            const qrPosition = this.calculateQRCodePosition(x, y, cardWidth, cardHeight, qrCode);
            
            // Desenhar fundo do QR Code com borda elegante
            if (qrCode.cornerRadius > 0) {
                // Fundo principal
                doc.rect(qrPosition.x - qrCode.margin, qrPosition.y - qrCode.margin, 
                        qrCode.size + (qrCode.margin * 2), qrCode.size + (qrCode.margin * 2))
                   .fillColor(qrCode.backgroundColor)
                   .fill();
                
                // Borda elegante se habilitada
                if (qrCode.border) {
                    doc.rect(qrPosition.x - qrCode.margin, qrPosition.y - qrCode.margin, 
                            qrCode.size + (qrCode.margin * 2), qrCode.size + (qrCode.margin * 2))
                       .strokeColor(qrCode.borderColor || '#e2e8f0')
                       .lineWidth(qrCode.borderWidth || 1)
                       .stroke();
                }
            }
            
            // Desenhar QR Code com qualidade máxima
            doc.image(resizedQR, qrPosition.x, qrPosition.y, {
                width: qrCode.size,
                height: qrCode.size
            });
            
        } catch (error) {
            console.warn(`Erro ao gerar QR Code: ${error.message}`);
        }
    }
    
    /**
     * Calcula a posição do QR Code no cartão
     * @param {number} x - Posição X do cartão
     * @param {number} y - Posição Y do cartão
     * @param {number} cardWidth - Largura do cartão
     * @param {number} cardHeight - Altura do cartão
     * @param {Object} qrConfig - Configurações do QR Code
     * @returns {Object} - Posição {x, y}
     */
    calculateQRCodePosition(x, y, cardWidth, cardHeight, qrConfig) {
        const { layout } = this.template;
        const padding = layout.padding;
        
        switch (qrConfig.position) {
            case 'bottom-right':
                return {
                    x: x + cardWidth - qrConfig.size - padding,
                    y: y + cardHeight - qrConfig.size - padding
                };
            case 'bottom-left':
                return {
                    x: x + padding,
                    y: y + cardHeight - qrConfig.size - padding
                };
            case 'top-right':
                return {
                    x: x + cardWidth - qrConfig.size - padding,
                    y: y + padding
                };
            case 'top-left':
                return {
                    x: x + padding,
                    y: y + padding
                };
            default:
                return {
                    x: x + cardWidth - qrConfig.size - padding,
                    y: y + cardHeight - qrConfig.size - padding
                };
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
