/**
 * Exemplo de uso programático do A4 Business Card Generator
 */

const { generateBusinessCards, generateFromJSON } = require('../src/index');

async function exemploUso() {
    try {
        console.log('🚀 Exemplo de uso do A4 Business Card Generator');
        
        // Exemplo 1: Gerar PDF a partir de array de cartões
        const cards = [
            {
                name: "Dr. João Silva",
                professional: "Médico de Família e Comunidade",
                crm: "12345",
                crm_uf: "SP",
                phone: "(11) 99999-9999",
                email: "joao@clinica.com",
                website: "www.clinica.com.br",
                logo: "./logo.png"
            }
        ];
        
        console.log('📋 Gerando PDF a partir de array...');
        const outputPath = await generateBusinessCards(cards, {
            output: 'exemplo-programatico.pdf',
            showCutLines: true,
            duplicateCards: 10
        });
        
        console.log(`✅ PDF gerado: ${outputPath}`);
        
        // Exemplo 2: Gerar PDF a partir de arquivo JSON
        console.log('📋 Gerando PDF a partir de arquivo JSON...');
        const pdfPath = await generateFromJSON('examples/sample.json', {
            output: 'exemplo-json.pdf',
            duplicateCards: 5
        });
        
        console.log(`✅ PDF gerado: ${pdfPath}`);
        
        console.log('🎉 Exemplos concluídos com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

// Executar exemplo se chamado diretamente
if (require.main === module) {
    exemploUso();
}

module.exports = exemploUso;
