# Oral Centter — código-fonte para rodar localmente

Esta é a versão local do site atual, com a galeria automática de fotos da unidade, logo oficial, mapa, contato pelo WhatsApp, cards explicativos e efeitos de mouse. O visual e os componentes foram preservados; o ambiente de hospedagem foi substituído por React + Vite para facilitar o uso local.

## 1. Prepare o computador

- Instale o Node.js 22.13 ou superior pelo site oficial: https://nodejs.org/ . O Node 18 não é compatível com este projeto.
- Feche e abra novamente o VS Code depois da instalação.
- Extraia o ZIP antes de começar. Abra a pasta `oral-centter` no VS Code: ela contém o `package.json`.

## 2. Instale e execute

No terminal integrado do VS Code, dentro da pasta que contém o `package.json`:

```bash
node --version
npm install
npm run dev
```

Abra o endereço informado pelo terminal, normalmente http://127.0.0.1:5173 . Se essa porta estiver ocupada, o Vite informará outra.

Para encerrar, use Ctrl + C no terminal.

### Se o PowerShell bloquear o npm.ps1

Use o terminal **Prompt de Comando** do VS Code, ou execute:

```powershell
npm.cmd install
npm.cmd run dev
```

Não é necessário mudar a política de execução do Windows.

### Se aparecer ENOENT / package.json não encontrado

Você está em outra pasta. Abra a pasta `oral-centter` extraída, que contém o arquivo `package.json`.

### Se aparecer erro de native binding

Confira a versão do Node. Pare o servidor, exclua somente a pasta `node_modules` deste projeto e execute `npm install` novamente.

## 3. Onde editar

| Arquivo | Conteúdo |
| --- | --- |
| `src/site.tsx` | Cabeçalho, logo, rodapé, privacidade, WhatsApp e endereço do link de contato |
| `src/home-experience.tsx` | Seções da página, textos, cards, mapa e barra que aparece ao rolar |
| `src/clinic-gallery.tsx` | Fotos, legendas e controles da galeria automática |
| `src/globals.css` | Fontes, cores, tamanhos, responsividade e estilos de interação |
| `src/use-interactions.ts` | Efeitos que respondem ao movimento do mouse |
| `src/data.ts` | Dados da clínica e catálogo demonstrativo de tratamentos |
| `public/` | Fotos, logos e fontes locais |
| `index.html` | Título, descrição e metadados da página |

O número do WhatsApp está definido em `src/site.tsx`, na constante `whatsappUrl`. Edite também `src/data.ts` se alterar os dados de contato. O mapa e o link de rotas ficam em `src/home-experience.tsx`.

O catálogo de tratamentos continua identificado como demonstrativo até a confirmação da clínica.

## 4. Gerar versão para hospedagem

```bash
npm run build
npm run preview
```

O primeiro comando gera a pasta `dist`. O segundo permite conferir essa versão localmente, normalmente em http://127.0.0.1:4173 . Para hospedar, envie o conteúdo de `dist` a uma hospedagem de sites estáticos.

## O que esta versão precisa

- Internet para instalar as dependências e abrir Google Maps e WhatsApp.
- As fontes, fotos e logos estão incluídas no ZIP.
- Não exige login no ChatGPT, chaves de API, banco de dados ou backend.
- Não tem calendário, formulário de agendamento ou painel administrativo. As consultas são combinadas pelo WhatsApp, conforme a versão atual do site.

Não abra `index.html` por duplo clique: use `npm run dev`.

## Origem e direitos

Exportado da versão de código 9fc1348bf83cae83b46168be50ceeb72301fcf46 do site Oral Centter.
As marcas e imagens da clínica pertencem aos respectivos titulares. As licenças das fontes estão incluídas em `public/fonts`.
