/**
 * MÃO NA RODA — CHECKOUT OFICIAL STRIPE CONNECT (CUSTÓDIA & SPLIT)
 * Startup Impetus Tecnologia • Separate Charges and Transfers (Escrow)
 * Suporte Nativo a Cartão de Crédito e PIX Oficial via Stripe Connect
 */

(function () {
  'use strict';

  // Limpeza automática de caches antigos de pedidos no navegador (evita pedidos fantasmas)
  try {
    const legacyKeys = [
      'flutter.mao_na_roda_client_orders_v5_prod',
      'flutter.mao_na_roda_client_orders_v4',
      'flutter.mao_na_roda_client_orders_v3',
      'flutter.mao_na_roda_client_orders_v7_real'
    ];
    for (let i = 0; i < legacyKeys.length; i++) {
      if (window.localStorage && window.localStorage.getItem(legacyKeys[i])) {
        window.localStorage.removeItem(legacyKeys[i]);
      }
    }
  } catch (_) {}

  // Links Oficiais Stripe Connect (Conta: Startup Impetus - acct_1TIEpPJ8bCrM1s4s)
  // Configurados com transfer_group (ESCROW_MNR) e metadados de Split (10% Cliente + 10% Prestador)
  const stripeConnectTierLinks = {
    10: 'https://buy.stripe.com/6oUdRadZb4Nx1ql95M1RC02',
    11: 'https://buy.stripe.com/14AdRa9IV5RB3ytdm21RC03',
    22: 'https://buy.stripe.com/3cI9AUaMZeo7fhbdm21RC04',
    33: 'https://buy.stripe.com/9B68wQ9IV4Nxfhb5TA1RC05',
    44: 'https://buy.stripe.com/aFaeVe5sF93Nc4Zfua1RC06',
    55: 'https://buy.stripe.com/dRmcN6f3f4Nxfhbfua1RC07',
    66: 'https://buy.stripe.com/14A4gA7ANcfZ7OJ2Ho1RC08', // R$ 66,00 (Visita Técnica R$ 60 + 10%)
    77: 'https://buy.stripe.com/bJebJ2f3f2Fp7OJ5TA1RC09',
    88: 'https://buy.stripe.com/4gMdRadZbgwf6KF3Ls1RC0a',
    99: 'https://buy.stripe.com/4gM5kEdZb93N0mh81I1RC0b',
    110: 'https://buy.stripe.com/14A9AU7ANcfZ3ytdm21RC0c',
    120: 'https://buy.stripe.com/bJeaEY5sFdk3b0V4Pw1RC0d',
    132: 'https://buy.stripe.com/fZu8wQ6wJcfZ7OJ95M1RC0e',
    143: 'https://buy.stripe.com/eVqbJ24oB93N9WRchY1RC0f',
    154: 'https://buy.stripe.com/9B628s08lgwf3yt95M1RC0g',
    165: 'https://buy.stripe.com/5kQfZi6wJ7ZJglfdm21RC0h', // R$ 165,00 (Serviço Padrão R$ 150 + 10%)
    176: 'https://buy.stripe.com/5kQbJ29IV4Nx5GBfua1RC0i',
    198: 'https://buy.stripe.com/7sY28s08l0xhfhba9Q1RC0j',
    220: 'https://buy.stripe.com/dRm4gA7AN7ZJb0V5TA1RC0k',
    242: 'https://buy.stripe.com/dRm6oIg7j5RB3ytchY1RC0l',
    264: 'https://buy.stripe.com/7sY6oI2gt3Jt2up4Pw1RC0m',
    275: 'https://buy.stripe.com/cNiaEYaMZ3Jt9WRgye1RC0n',
    330: 'https://buy.stripe.com/14AdRa08l4Nx2upgye1RC0o',
    385: 'https://buy.stripe.com/00w9AU08l7ZJ6KF0zg1RC0p',
    440: 'https://buy.stripe.com/aFa00k7AN4Nx6KFeq61RC0q'
  };

  function resolvePaymentUrl(val) {
    const rounded = Math.round(val);
    if (stripeConnectTierLinks[rounded]) {
      return stripeConnectTierLinks[rounded];
    }
    let closest = 165;
    let minDiff = 999999;
    for (const k in stripeConnectTierLinks) {
      const diff = Math.abs(parseInt(k, 10) - rounded);
      if (diff < minDiff) {
        minDiff = diff;
        closest = k;
      }
    }
    return stripeConnectTierLinks[closest];
  }

  window.openStripeConnectCheckout = async function (amount, description) {
    const finalAmount = typeof amount === 'number' && amount > 0 ? amount : 165.0;
    const desc = description || 'Serviço Especializado Mão na Roda';

    let overlay = document.getElementById('mao-na-roda-checkout-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mao-na-roda-checkout-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.88);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
      `;

      overlay.innerHTML = `
        <div id="mao-na-roda-modal-card" style="
          background: #14181F;
          border: 1px solid rgba(0, 229, 255, 0.4);
          border-radius: 24px;
          width: 100%;
          max-width: 480px;
          max-height: 92vh;
          overflow-y: auto;
          position: relative;
          padding: 24px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 229, 255, 0.2);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #ffffff;
        ">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="
                width: 40px;
                height: 40px;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(99, 91, 255, 0.25));
                border: 1px solid rgba(0, 229, 255, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
              ">🛡️</div>
              <div>
                <div style="font-weight: 800; font-size: 15px; color: #ffffff; letter-spacing: -0.3px;">Stripe Connect • Custódia Impetus</div>
                <div style="font-size: 11.5px; color: #00E5FF; font-weight: 600;">Cobrança & Transferência Separada • Segregação de Fundos</div>
              </div>
            </div>
            <button id="mao-na-roda-close-checkout" style="
              background: rgba(255, 255, 255, 0.08);
              border: none;
              color: #ffffff;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
            ">✕</button>
          </div>

          <!-- Banner Informativo de Custódia -->
          <div style="
            background: rgba(0, 229, 255, 0.06);
            border-left: 3px solid #00E5FF;
            padding: 12px 14px;
            border-radius: 8px;
            font-size: 12px;
            color: #b0b8c1;
            margin-bottom: 18px;
            line-height: 1.45;
          ">
            🔒 <strong style="color: #ffffff;">Arquitetura Oficial Stripe Connect (Separate Charges & Transfers):</strong> O pagamento via Cartão/Carteira Digital é capturado com segurança na conta de custódia segregada da <strong>Startup Impetus</strong> (sem risco de expiração em 7 dias) e transferido ao prestador assim que você confirmar a conclusão do serviço.
          </div>

          <!-- Resumo do Pedido -->
          <div style="
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div>
              <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Serviço Selecionado</div>
              <div id="inf-checkout-desc" style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 4px;">${desc}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Total em Custódia</div>
              <div id="inf-checkout-amount" style="font-size: 18px; font-weight: 900; color: #00E676; margin-top: 2px;">R$ ${finalAmount.toFixed(2).replace('.', ',')}</div>
            </div>
          </div>

          <!-- Container de Ação -->
          <div id="infinitepay-mount-point" style="min-height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.getElementById('mao-na-roda-close-checkout').addEventListener('click', function () {
        window.closeStripeEmbeddedCheckout();
      });
    } else {
      overlay.style.display = 'flex';
      const descEl = document.getElementById('inf-checkout-desc');
      const amountEl = document.getElementById('inf-checkout-amount');
      if (descEl) descEl.textContent = desc;
      if (amountEl) amountEl.textContent = 'R$ ' + finalAmount.toFixed(2).replace('.', ',');
    }

    const mount = document.getElementById('infinitepay-mount-point');
    if (mount) {
      const renderCheckoutBtn = function (val) {
        const url = resolvePaymentUrl(val);
        const liquido = ((val / 1.10) * 0.90).toFixed(2).replace('.', ',');
        const taxa = (val - ((val / 1.10) * 0.90)).toFixed(2).replace('.', ',');
        const amountEl = document.getElementById('inf-checkout-amount');
        if (amountEl) amountEl.textContent = 'R$ ' + val.toFixed(2).replace('.', ',');

        mount.innerHTML = `
          <div style="width: 100%; background: rgba(0, 230, 118, 0.06); border: 1px dashed rgba(0, 230, 118, 0.35); border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; font-size: 11.5px; color: #cbd5e1; display: flex; justify-content: space-between;">
            <span>💼 Valor do Serviço (Prestador): <strong style="color: #00E676;">R$ ${(val / 1.10).toFixed(2).replace('.', ',')}</strong></span>
            <span>🛡️ Taxa Custódia (10%): <strong style="color: #00E5FF;">R$ ${(val - (val / 1.10)).toFixed(2).replace('.', ',')}</strong></span>
          </div>

          <a href="${url}" id="btn-open-stripe-connect" style="
            width: 100%;
            height: 52px;
            background: linear-gradient(90deg, #635BFF, #00D1FF);
            border: none;
            border-radius: 14px;
            color: #ffffff;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(99, 91, 255, 0.4);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
            box-sizing: border-box;
          ">
            <span>💳 Pagar R$ ${val.toFixed(2).replace('.', ',')} via Stripe Connect</span>
            <span>→</span>
          </a>
          <div style="margin-top: 12px; font-size: 11px; text-align: center; color: #94A3B8; line-height: 1.4;">
            Processado por <strong>Stripe Connect (Startup Impetus)</strong> • Cartão de Crédito, Apple Pay e Google Pay.<br/>
            Para pagar via <strong>PIX Instantâneo (CNPJ 66.472.410/0001-43)</strong>, selecione a opção PIX na tela do Checkout.
          </div>
        `;

        const btn = document.getElementById('btn-open-stripe-connect');
        if (btn) {
          btn.onclick = function (e) {
            e.preventDefault();
            try {
              const txId = 'STRIPE-' + Date.now();
              if (window.localStorage) {
                window.localStorage.setItem('mnr_pending_stripe_purchase', JSON.stringify({
                  transaction_id: txId,
                  value: val,
                  description: desc,
                  ts: Date.now()
                }));
              }
              if (typeof window.gtag === 'function') {
                window.gtag('event', 'begin_checkout', {
                  currency: 'BRL',
                  value: val,
                  items: [{ item_id: txId, item_name: desc, price: val, quantity: 1 }],
                  transport_type: 'beacon'
                });
              }
            } catch (_) {}
            window.location.href = url;
          };
        }
      };

      renderCheckoutBtn(finalAmount);
    }
  };

  window.openInfinitePayCheckout = window.openStripeConnectCheckout;

  window.openStripeEmbeddedCheckout = function (clientSecretOrAmount, description) {
    let amount = 165.0;
    if (typeof clientSecretOrAmount === 'number') {
      amount = clientSecretOrAmount;
    } else if (typeof clientSecretOrAmount === 'string') {
      const parsed = parseFloat(clientSecretOrAmount.replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed;
      }
    }
    window.openStripeConnectCheckout(amount, description || 'Serviço Especializado Mão na Roda');
  };

  window.closeStripeEmbeddedCheckout = function () {
    const overlay = document.getElementById('mao-na-roda-checkout-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  window.closeInfinitePayCheckout = window.closeStripeEmbeddedCheckout;

  // Monitor Oficial de Retorno Stripe Connect & Sincronização Automática com Firestore + GA4
  (function monitorStripeConnectReturn() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const stripeStatus = urlParams.get('stripe_status');
      const sessionId = urlParams.get('session_id');
      const paidAmount = parseFloat(urlParams.get('amount') || '66.0');
      const receiptUrl = urlParams.get('receipt_url');
      const orderNsu = urlParams.get('order_nsu');

      if (stripeStatus === 'paid' || sessionId || receiptUrl || orderNsu) {
        const txId = sessionId || orderNsu || ('STRIPE-' + Date.now());
        console.log('🎉 Pagamento em Custódia Confirmado (Stripe Connect):', { txId, paidAmount });

        // 1. Dispara Evento Oficial purchase no Google Analytics 4 (com beacon garantido)
        const firePurchaseEvent = function () {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'purchase', {
              transaction_id: txId,
              value: paidAmount,
              currency: 'BRL',
              transport_type: 'beacon',
              items: [{
                item_id: txId,
                item_name: 'Serviço em Custódia Mão na Roda (Stripe Connect)',
                price: paidAmount,
                quantity: 1
              }]
            });
          }
        };
        firePurchaseEvent();
        setTimeout(firePurchaseEvent, 1500);
        try {
          if (window.localStorage) {
            window.localStorage.removeItem('mnr_pending_stripe_purchase');
          }
        } catch (_) {}

        // 2. Sincroniza com Firebase Firestore em Tempo Real
        try {
          if (window.firebase && window.firebase.firestore) {
            const db = window.firebase.firestore();
            const urlDocId = urlParams.get('order_id') || urlParams.get('doc_id');
            const liquidoPrestador = Number(((paidAmount / 1.10) * 0.90).toFixed(2));
            const taxaImpetus = Number((paidAmount - liquidoPrestador).toFixed(2));

            const trackingPayload = {
              pagoConfirmado: true,
              pagoEmCustodia: true,
              status: 'pendente_aceite',
              paymentStatus: 'pago_stripe_connect',
              paymentMethod: 'stripe_connect_escrow',
              stripe_session_id: txId,
              amount: paidAmount,
              valorLiquidoPrestador: liquidoPrestador,
              taxaPlataformaImpetus: taxaImpetus,
              transferGroup: 'ESCROW_MNR_' + Math.round(paidAmount),
              paidAt: new Date().toISOString()
            };

            if (urlDocId) {
              db.collection('solicitacoes_servico').doc(urlDocId).set(trackingPayload, { merge: true });
            } else {
              db.collection('solicitacoes_servico')
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get()
                .then(snap => {
                  if (!snap.empty) {
                    snap.docs[0].ref.update(trackingPayload);
                  }
                }).catch(e => console.warn('Busca doc recente:', e));
            }

            db.collection('logs_sistema').add({
              severity: 'INFO',
              category: 'STRIPE_CONNECT_ESCROW',
              message: `Pagamento Stripe Connect aprovado (R$ ${paidAmount.toFixed(2)}) — Sessão: ${txId.substring(0, 18)}...`,
              details: `Custódia Startup Impetus | Líquido Prestador: R$ ${liquidoPrestador.toFixed(2)} | Taxa Impetus: R$ ${taxaImpetus.toFixed(2)}`,
              timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
              platform: 'Web Stripe Connect'
            }).catch(() => {});
          }
        } catch (fbErr) {
          console.warn('Erro ao atualizar Firestore no retorno da Stripe:', fbErr);
        }

        // 3. Banner Visual de Confirmação de Custódia
        const banner = document.createElement('div');
        banner.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:linear-gradient(90deg,#00E676,#00B4D8);color:#000;padding:14px 24px;border-radius:14px;font-weight:800;z-index:99999999;box-shadow:0 8px 30px rgba(0,0,0,0.6);font-family:sans-serif;display:flex;align-items:center;gap:10px;';
        banner.innerHTML = '<span>🛡️ Pagamento Confirmado via Stripe Connect! Valor retido em Custódia Impetus.</span>';
        document.body.appendChild(banner);
        setTimeout(function () { banner.remove(); }, 7000);
      }
    } catch (e) {
      console.warn('monitorStripeConnectReturn error:', e);
    }
  })();
})();
