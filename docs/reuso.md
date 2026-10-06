# Registro de reuso

## Fundação multipágina

- Origem: `https://github.com/maicon-oliveira-dev/mp_modas`
- Referência usada: tag `multipage-base-v1`, commit `9b8850e0f33475369d570f0f73c7ba79885b9b88`.
- Reaproveitado/adaptado: arquitetura dos tokens, reset/base, componentes de cabeçalho e rodapé e a lógica acessível do menu móvel em `assets/js/menu.js`.
- Dependências: nenhuma; HTML, CSS e JavaScript nativos.
- Licença: o repositório consultado não apresenta arquivo de licença no commit utilizado. Uso registrado para validação com o titular antes de distribuição.

## Referências ainda não integradas

- Neon UI Assets: `https://github.com/maicon-oliveira-dev/neon-ui-assets`; a referência de galeria `initGallery3D` foi identificada como componente para etapa futura. A página do repositório declara licença MIT. Nenhum código, imagem ou dependência foi copiado nesta etapa.
- Decorelas: `https://github.com/maicon-oliveira-dev/decorelas`; `initLightbox` foi localizado em `assets/js/main.js` do repositório. Nenhum código, imagem ou dependência foi copiado nesta etapa. A licença não pôde ser confirmada no clone parcial disponível; validar antes de integrar.

As futuras integrações deverão manter os avisos de licença aplicáveis e registrar a revisão/fonte exata do código incorporado.

## Componentes preparados — Villa Munhoz

- `assets/js/gallery.js`: adaptação isolada da API `initGallery3D()` do Neon. Depende apenas de `[data-gallery-3d]`, `[data-gallery-track]`, `[data-gallery-prev]`, `[data-gallery-next]` e itens `[data-lightbox]`; inclui setas, teclado, gesto horizontal e respeita rolagem vertical/troca manual.
- `assets/js/lightbox.js`: adaptação isolada das ideias de `initLightbox()` e `initFilters()` do Decorelas. Depende de uma caixa `[data-lightbox-dialog]`, controles correspondentes e itens `[data-lightbox]`; a lista é recalculada para incluir somente itens visíveis.
- `assets/css/gallery.css`: estilos autorais e compactos para a galeria e o visualizador, usando os tokens vinho/creme existentes. Não foram copiados arquivos CSS completos.

O Neon declara MIT em sua página pública; manter a atribuição MIT se qualquer trecho literal for incorporado. O Decorelas não expôs um arquivo de licença no clone parcial disponível; validar autorização/licença antes de reutilizar literalmente seu código.
