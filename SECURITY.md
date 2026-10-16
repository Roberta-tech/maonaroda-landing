# Política de Segurança e Proteção de Dados — Mão na Roda
**Impetus Tecnologia — Diretrizes de Segurança da Informação & LGPD**

---

## 1. Arquitetura de Defesa em Profundidade

O ecossistema **Mão na Roda** opera com isolamento rigoroso entre camadas:

| Camada | Tecnologia | Mecanismo de Proteção |
| :--- | :--- | :--- |
| **Client-Side Web** | `security_shield.js` | Bloqueio de F12, DevTools, atalhos de inspeção (`Ctrl+Shift+I/J/C`), context menu, anti-clickjacking e auto-clear de console. |
| **Compilação Web** | Flutter Dart2JS | Ofuscação de código de produção, minificação agressiva, sem source maps expostos. |
| **Banco de Dados** | Google Cloud Firestore | Regras de segurança granulares (`firestore.rules`). Usuários só acessam seus próprios registros; pedidos são restritos ao cliente e ao prestador designado. |
| **Autenticação** | Firebase Auth | Tokens JWT criptografados, suporte a Apple Sign-In, Google Sign-In e E-mail/Senha com hashing seguro. |
| **Custódia & Pagamentos** | Escrow MNR + Stripe / PIX Oficial | Nenhuma chave privada no front-end. Checkout via canais oficiais com conformidade PCI-DSS e PIX direto na conta jurídica (Itaú). |

---

## 2. Conformidade LGPD (Lei Geral de Proteção de Dados)
- **Minimização de Dados**: Coleta estritamente necessária para operação do serviço.
- **Isolamento de Contas**: Nenhum usuário pode consultar ou exportar a lista de outros usuários cadastrados.
- **Direito ao Esquecimento**: Fluxo nativo de exclusão de conta e histórico implementado (`exclusao-conta.html`).

---

## 3. Reporte de Vulnerabilidades
Para reportar vulnerabilidades ou solicitar auditoria de segurança:
- **E-mail Oficial**: `suporte@appmaonaroda.com.br` / `contato@impetustecnologia.com.br`
- **Responsável Técnico**: Tech Lead — Impetus Tecnologia
