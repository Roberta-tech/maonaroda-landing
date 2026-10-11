# Projeto: Mão na Roda — Web App & Landing Page

> **DIRETIVA DE ISOLAMENTO DE PROJETO (ROBERTA / IMPETUS TECNOLOGIA)**:
> Este repositório é EXCLUSIVO para a Landing Page e Web App (Flutter Web distribuído em `/app/`).
> Não misturar com os outros projetos de Roberta.

---

## 1. Contexto do Projeto
- **Cliente / Proprietária**: Roberta (Impetus Tecnologia)
- **Tecnologia**: HTML5 / CSS3 / JavaScript / Flutter Web (`/app/`)
- **Deploy de Produção**: `https://appmaonaroda.com.br/app/`
- **Landing Oficial**: `https://appmaonaroda.com.br`

---

## 2. Regras de Segurança e Deploy
1. **Sem Segredos em Código Público**:
   - Os arquivos JS gerados (como `main.dart.js`) são servidos publicamente na web.
   - NUNCA embutir chaves de API restritas (como chaves de IA/Google Cloud com faturamento ou permissões amplas).
2. **Atualização Web**:
   - Compilação realizada via: `flutter build web --release --base-href /app/` a partir de `mao_na_roda`.
   - Cópia limpa do `build/web/*` para `C:\Caio\maonaroda-landing\app\`.
