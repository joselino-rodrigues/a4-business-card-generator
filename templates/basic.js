/**
 * Template PADRÃO para cartões de visita médicos
 * Design equilibrado, elegante e profissional
 */
module.exports = {
    // Configurações de fonte PADRÃO MÉDICA
    font: 'Helvetica',
    fontSize: {
        name: 16,      // Nome do médico (reduzido para equilíbrio)
        professional: 7, // Especialidades com RQE (reduzido para caber)
        crm: 10,       // CRM (destaque)
        graduation: 8, // Informações acadêmicas (pequeno)
        contact: 9     // Informações de contato (padrão)
    },
    
    // Paleta de cores PADRÃO MÉDICA PROFISSIONAL
    colors: {
        // Cores principais médicas padrão
        primary: '#0f172a',        // Preto médico elegante
        secondary: '#1e293b',     // Cinza médico escuro
        accent: '#3b82f6',        // Azul confiança médica
        highlight: '#f59e0b',     // Dourado elegante
        medical: '#1e40af',       // Azul médico específico
        emergency: '#ef4444',      // Vermelho emergência
        
        // Cores de fundo padrão
        background: '#ffffff',     // Branco puro
        cardBackground: '#f8fafc', // Fundo médico sutil
        border: '#e2e8f0',        // Borda médica
        
        // Cores de texto médicas padrão
        textPrimary: '#ffffff',   // Texto branco para contraste
        textSecondary: '#f8fafc', // Texto secundário claro
        textAccent: '#dbeafe',     // Texto de destaque azul claro
        textMuted: '#cbd5e1',     // Texto discreto
        textMedical: '#ffffff',    // Texto médico branco
        textGold: '#fbbf24'       // Texto dourado para destaque
    },
    
    // Layout PADRÃO MÉDICO
    layout: {
        padding: 12,               // Padding interno padrão
        logoHeight: 35,            // Logo padrão
        logoWidth: 35,             // Logo padrão
        lineSpacing: 2,            // Espaçamento entre linhas padrão
        sectionSpacing: 6,         // Espaçamento entre seções padrão
        borderRadius: 8,           // Bordas padrão
        shadowOffset: 2,           // Sombra padrão
        shadowBlur: 4,             // Desfoque da sombra padrão
        shadowColor: '#00000015'   // Cor da sombra padrão
    },
    
    // Configurações de dimensões do cartão
    dimensions: {
        width: 241,                // 85mm em pontos
        height: 156,               // 55mm em pontos
        margin: 28.3465            // 10mm em pontos
    },
    
    // Configurações da página A4
    page: {
        width: 595.28,             // 210mm em pontos
        height: 841.89,            // 297mm em pontos
        cardsPerRow: 2,            // Cartões por linha
        cardsPerColumn: 5,         // Cartões por coluna
        cardsPerPage: 10           // Total de cartões por página
    },
    
    // Configurações de linha de corte PREMIUM
    cutLines: {
        enabled: true,             // Habilitar linhas de corte
        color: '#d1d5db',          // Cor mais sutil
        width: 0.3,                // Linha mais fina
        dash: [3, 3]               // Padrão mais elegante
    },
    
    // Efeitos visuais PREMIUM
    effects: {
        gradient: true,            // Gradiente sutil
        shadow: true,              // Sombra no cartão
        border: true,              // Borda elegante
        roundedCorners: true       // Cantos arredondados
    },
    
    // Gradientes PREMIUM
    gradients: {
        primary: ['#f8fafc', '#f1f5f9'],     // Gradiente sutil
        accent: ['#dbeafe', '#bfdbfe'],      // Gradiente azul
        highlight: ['#fef3c7', '#fde68a']    // Gradiente dourado
    },
    
    // Configurações do QR Code - ALTA RESOLUÇÃO
    qrCode: {
        enabled: true,             // Habilitar QR Code
        size: 50,                  // Tamanho do QR Code (pontos) - PADRÃO
        margin: 8,                 // Margem ao redor do QR Code - PADRÃO
        color: '#0f172a',          // Cor do QR Code padrão
        backgroundColor: '#ffffff', // Cor de fundo do QR Code
        position: 'bottom-right',  // Posição: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        cornerRadius: 6,           // Cantos padrão
        quality: 'H',              // Qualidade alta para melhor definição
        border: true,              // Borda elegante ao redor
        borderColor: '#e2e8f0',    // Cor da borda padrão
        borderWidth: 1,            // Espessura da borda padrão
        resolution: 16,            // Resolução base (16x para máxima qualidade)
        sharpening: true,          // Aplicar nitidez
        antialiasing: true         // Suavização de bordas
    }
};
