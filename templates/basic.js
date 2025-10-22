/**
 * Template básico para cartões de visita
 * Configurações de estilo, fonte, cores e layout
 */
module.exports = {
    // Configurações de fonte
    font: 'Helvetica',
    fontSize: {
        name: 14,      // Nome da pessoa
        title: 12,     // Cargo/título
        company: 11,   // Empresa
        contact: 10    // Informações de contato
    },
    
    // Configurações de cores
    colors: {
        text: '#000000',           // Cor do texto principal
        background: '#FFFFFF',     // Cor de fundo
        primary: '#333333',        // Cor primária (nome)
        secondary: '#666666',      // Cor secundária (cargo)
        accent: '#007bff',         // Cor de destaque (empresa)
        contact: '#555555'         // Cor do contato
    },
    
    // Configurações de layout
    layout: {
        padding: 10,               // Padding interno do cartão (pontos)
        logoHeight: 30,            // Altura máxima do logo (pontos)
        logoWidth: 30,             // Largura máxima do logo (pontos)
        lineSpacing: 2,            // Espaçamento entre linhas
        sectionSpacing: 5          // Espaçamento entre seções
    },
    
    // Configurações de dimensões do cartão
    dimensions: {
        width: 241,                // 85mm em pontos (85 * 2.83465)
        height: 156,               // 55mm em pontos (55 * 2.83465)
        margin: 28.3465            // 10mm em pontos (10 * 2.83465)
    },
    
    // Configurações da página A4
    page: {
        width: 595.28,             // 210mm em pontos
        height: 841.89,            // 297mm em pontos
        cardsPerRow: 2,            // Cartões por linha
        cardsPerColumn: 5,         // Cartões por coluna
        cardsPerPage: 10           // Total de cartões por página
    },
    
    // Configurações de linha de corte
    cutLines: {
        enabled: true,             // Habilitar linhas de corte
        color: '#cccccc',          // Cor das linhas de corte
        width: 0.5,                // Espessura das linhas
        dash: [2, 2]               // Padrão de linha tracejada
    }
};
