const { generateBusinessCards, generateFromJSON, generateSamplePDF } = require('./src/index');

async function exemploUso() {
    try {
        console.log('🚀 Exemplo de uso do A4 Business Card Generator');
        console.log('===============================================');
        
        // Exemplo 1: Gerar PDF a partir de array de cartões
        console.log('\n📝 Exemplo 1: Gerando PDF a partir de array de cartões...');
        
        const cartoes = [
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
            }
        ];
        
        const pdfPath1 = await generateBusinessCards(cartoes, {
            output: 'exemplo-cartoes.pdf',
            showCutLines: true
        });
        
        console.log(`✅ PDF gerado: ${pdfPath1}`);
        
        // Exemplo 2: Gerar PDF a partir de arquivo JSON
        console.log('\n📖 Exemplo 2: Gerando PDF a partir de arquivo JSON...');
        
        const pdfPath2 = await generateFromJSON('examples/sample.json', {
            output: 'cartoes-do-json.pdf'
        });
        
        console.log(`✅ PDF gerado: ${pdfPath2}`);
        
        // Exemplo 3: Gerar PDF de exemplo
        console.log('\n🎨 Exemplo 3: Gerando PDF de exemplo...');
        
        const pdfPath3 = await generateSamplePDF({
            output: 'exemplo-demonstracao.pdf'
        });
        
        console.log(`✅ PDF de exemplo gerado: ${pdfPath3}`);
        
        console.log('\n🎉 Todos os exemplos executados com sucesso!');
        console.log('📄 Verifique os arquivos PDF gerados no diretório atual.');
        
    } catch (error) {
        console.error('❌ Erro ao executar exemplos:', error.message);
    }
}

// Executar exemplo se este arquivo for chamado diretamente
if (require.main === module) {
    exemploUso();
}

module.exports = exemploUso;
