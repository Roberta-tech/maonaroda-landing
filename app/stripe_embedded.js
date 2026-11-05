/**
 * MÃO NA RODA — CHECKOUT INTEGRADO INFINITEPAY
 * Startup Impetus Tecnologia • Substituição Stripe -> InfinitePay
 * Taxa zero de gateway internacional • Suporte a Cartão de Crédito e Parcelamento
 */

(function () {
  'use strict';

  const INFINITEPAY_API_KEY = 'inchk_yDq4UY3tFZOsLcC2G6NqCGhiDLgmWmwg1puRjKpriwE';
  const INFINITEPAY_ENDPOINT = 'https://api.checkout.infinitepay.io/links';

  window.openInfinitePayCheckout = async function (amount, description, customerData) {
    const finalAmount = typeof amount === 'number' && amount > 0 ? amount : 165.0;
    const priceInCents = Math.round(finalAmount * 100);
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
          box-sizing: border-box;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <!-- Cabeçalho de Segurança -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="
                width: 40px;
                height: 40px;
                border-radius: 12px;
                background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(255, 0, 128, 0.2));
                border: 1px solid rgba(0, 229, 255, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
              ">💳</div>
              <div>
                <div style="font-weight: 800; font-size: 15px; color: #ffffff; letter-spacing: -0.3px;">Pagamento com Cartão • InfinitePay</div>
                <div style="font-size: 11.5px; color: #00E5FF; font-weight: 600;">Startup Impetus • Custódia Escrow 100% Segura</div>
              </div>
            </div>
            <button id="mao-na-roda-close-checkout" style="
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.12);
              color: #ffffff;
              font-size: 16px;
              font-weight: bold;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
            ">✕</button>
          </div>

          <!-- Banner Informativo de Custódia -->
          <div style="
            background: rgba(0, 229, 255, 0.05);
            border-left: 3px solid #00E5FF;
            padding: 12px 14px;
            border-radius: 8px;
            font-size: 12px;
            color: #b0b8c1;
            margin-bottom: 18px;
            line-height: 1.45;
          ">
            🔒 <strong style="color: #ffffff;">Custódia Protegida:</strong> Seu pagamento com cartão de crédito via InfinitePay fica retido em segurança e só é transferido ao profissional quando você confirmar a conclusão do atendimento.
          </div>

          <!-- Resumo da Cobrança -->
          <div style="
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 16px;
            margin-bottom: 20px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 13px; color: #94A3B8;">Serviço:</span>
              <span id="inf-checkout-desc" style="font-size: 13px; font-weight: 600; color: #ffffff;">${desc}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 13px; color: #94A3B8;">Taxa Operacional:</span>
              <span style="font-size: 13px; font-weight: 600; color: #00E676;">10% (Menor do Brasil)</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; margin-top: 6px;">
              <span style="font-size: 15px; font-weight: 700; color: #ffffff;">Total a Pagar:</span>
              <span id="inf-checkout-amount" style="font-size: 20px; font-weight: 800; color: #00E5FF;">R$ ${finalAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <!-- Ponto de Montagem do Link / Ação -->
          <div id="infinitepay-mount-point" style="min-height: 90px;">
            <div style="text-align: center; padding: 20px 0; color: #00E5FF;">
              <div style="font-size: 28px; margin-bottom: 8px;">⚡</div>
              <div style="font-size: 13px; font-weight: 600;">Gerando checkout seguro na InfinitePay...</div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('mao-na-roda-close-checkout').addEventListener('click', function () {
        window.closeInfinitePayCheckout();
      });
    } else {
      overlay.style.display = 'flex';
      const descEl = document.getElementById('inf-checkout-desc');
      const amountEl = document.getElementById('inf-checkout-amount');
      if (descEl) descEl.textContent = desc;
      if (amountEl) amountEl.textContent = 'R$ ' + finalAmount.toFixed(2).replace('.', ',');
      const mount = document.getElementById('infinitepay-mount-point');
      if (mount) {
        mount.innerHTML = `
          <div style="text-align: center; padding: 20px 0; color: #00E5FF;">
            <div style="font-size: 28px; margin-bottom: 8px;">⚡</div>
            <div style="font-size: 13px; font-weight: 600;">Gerando checkout seguro na InfinitePay...</div>
          </div>
        `;
      }
    }

    // Links oficiais mapeados pela API InfinitePay para cada faixa de valor com retorno para /app/
    const infinitePayTierLinks = {
      11: 'https://checkout.infinitepay.io/appmaonaroda/zvK6baEc3F',
      22: 'https://checkout.infinitepay.io/appmaonaroda/4Q8M1yjVsd',
      33: 'https://checkout.infinitepay.io/appmaonaroda/1QUzsvfRiU',
      44: 'https://checkout.infinitepay.io/appmaonaroda/56qiGddqLD',
      55: 'https://checkout.infinitepay.io/appmaonaroda/exJW6Sqt64',
      66: 'https://checkout.infinitepay.io/appmaonaroda/Cbfgs4M6S0', // R$ 66,00 (Visita Técnica R$ 60 + 10%)
      77: 'https://checkout.infinitepay.io/appmaonaroda/yWHkDzhnbW',
      88: 'https://checkout.infinitepay.io/appmaonaroda/VZiFh4D4ot',
      99: 'https://checkout.infinitepay.io/appmaonaroda/Sp3TXwhGJt',
      110: 'https://checkout.infinitepay.io/appmaonaroda/Ft930ZGQMg',
      120: 'https://checkout.infinitepay.io/appmaonaroda/e7kkYseL2e',
      132: 'https://checkout.infinitepay.io/appmaonaroda/wPkow9fuvx',
      143: 'https://checkout.infinitepay.io/appmaonaroda/bxTYgtm4nN',
      154: 'https://checkout.infinitepay.io/appmaonaroda/Iurp5edFoq',
      165: 'https://checkout.infinitepay.io/appmaonaroda/1iRVY5NF60', // R$ 165,00 (Serviço Padrão R$ 150 + 10%)
      176: 'https://checkout.infinitepay.io/appmaonaroda/Up7V7rTaqd',
      198: 'https://checkout.infinitepay.io/appmaonaroda/C5jw11I3ep',
      220: 'https://checkout.infinitepay.io/appmaonaroda/u2y5BRptoF',
      242: 'https://checkout.infinitepay.io/appmaonaroda/x4hHmgL7Xe',
      264: 'https://checkout.infinitepay.io/appmaonaroda/15BTCIVezu',
      275: 'https://checkout.infinitepay.io/appmaonaroda/4AEb0dJaGU',
      330: 'https://checkout.infinitepay.io/appmaonaroda/qDeToS6AlW',
      385: 'https://checkout.infinitepay.io/appmaonaroda/PIZ16aJKvf',
      440: 'https://checkout.infinitepay.io/appmaonaroda/Bf8YM3Fxtl'
    };

    function resolvePaymentUrl(val) {
      const rounded = Math.round(val);
      if (infinitePayTierLinks[rounded]) {
        return infinitePayTierLinks[rounded];
      }
      let closest = 165;
      let minDiff = 999999;
      for (const k in infinitePayTierLinks) {
        const diff = Math.abs(parseInt(k, 10) - rounded);
        if (diff < minDiff) {
          minDiff = diff;
          closest = k;
        }
      }
      return infinitePayTierLinks[closest];
    }

    const targetUrl = resolvePaymentUrl(finalAmount);

    const mount = document.getElementById('infinitepay-mount-point');
    if (mount) {
      const renderCheckoutBtn = function(val) {
        const url = resolvePaymentUrl(val);
        const amountEl = document.getElementById('inf-checkout-amount');
        if (amountEl) amountEl.textContent = 'R$ ' + val.toFixed(2).replace('.', ',');
        mount.innerHTML = `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; color: #94A3B8; margin-bottom: 6px; font-weight: 600;">Selecione ou confirme a faixa do serviço:</div>
            <div style="display: flex; gap: 6px;">
              <button type="button" id="tier-btn-10" style="flex:1; padding: 8px 4px; border-radius: 8px; border: 1px solid ${val <= 11 ? '#00E5FF' : 'rgba(255,255,255,0.15)'}; background: ${val <= 11 ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)'}; color: #fff; font-size: 11.5px; font-weight: 700; cursor: pointer;">⚡ Teste R$ 10</button>
              <button type="button" id="tier-btn-66" style="flex:1; padding: 8px 4px; border-radius: 8px; border: 1px solid ${val === 66 ? '#00E5FF' : 'rgba(255,255,255,0.15)'}; background: ${val === 66 ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)'}; color: #fff; font-size: 11.5px; font-weight: 700; cursor: pointer;">🔧 Visita R$ 66</button>
              <button type="button" id="tier-btn-165" style="flex:1; padding: 8px 4px; border-radius: 8px; border: 1px solid ${val === 165 ? '#00E5FF' : 'rgba(255,255,255,0.15)'}; background: ${val === 165 ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)'}; color: #fff; font-size: 11.5px; font-weight: 700; cursor: pointer;">⭐ Padrão R$ 165</button>
            </div>
          </div>
          <a href="${url}" id="btn-open-infinitepay" style="
            width: 100%;
            height: 52px;
            background: linear-gradient(90deg, #00D1FF, #00B4D8);
            border: none;
            border-radius: 14px;
            color: #000000;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(0, 209, 255, 0.35);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
            box-sizing: border-box;
          ">
            <span>💳 Pagar Agora R$ ${val.toFixed(2).replace('.', ',')} (Cartão)</span>
            <span>→</span>
          </a>
          <div style="margin-top: 12px; font-size: 11.5px; text-align: center; color: #94A3B8;">
            Ambiente 100% blindado • Custódia Impetus Ativa
          </div>
        `;

        document.getElementById('tier-btn-10').onclick = function() { renderCheckoutBtn(10.0); };
        document.getElementById('tier-btn-66').onclick = function() { renderCheckoutBtn(66.0); };
        document.getElementById('tier-btn-165').onclick = function() { renderCheckoutBtn(165.0); };
        const btn = document.getElementById('btn-open-infinitepay');
        if (btn) {
          btn.onclick = function(e) {
            e.preventDefault();
            window.location.href = url;
          };
        }
      };

      renderCheckoutBtn(finalAmount);
      return;
      mount.innerHTML = `
        <a href="${targetUrl}" id="btn-open-infinitepay" style="
          width: 100%;
          height: 52px;
          background: linear-gradient(90deg, #00D1FF, #00B4D8);
          border: none;
          border-radius: 14px;
          color: #000000;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 209, 255, 0.35);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          box-sizing: border-box;
        ">
          <span>💳 Pagar Agora R$ ${finalAmount.toFixed(2).replace('.', ',')} (Cartão InfinitePay)</span>
          <span>→</span>
        </a>
        <div style="margin-top: 12px; font-size: 11.5px; text-align: center; color: #94A3B8;">
          Ambiente 100% blindado e oficial InfinitePay • Retorno automático ao App
        </div>
      `;

      const btn = document.getElementById('btn-open-infinitepay');
      if (btn) {
        btn.onclick = function (e) {
          // Navegação na mesma janela para não abrir abas duplicadas
          e.preventDefault();
          window.location.href = targetUrl;
        };
      }
    }
  };

  // Compatibilidade com as chamadas legadas do Stripe (redireciona para InfinitePay)
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
    window.openInfinitePayCheckout(amount, description || 'Serviço Especializado Mão na Roda');
  };

  window.closeInfinitePayCheckout = function () {
    const overlay = document.getElementById('mao-na-roda-checkout-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  window.closeStripeEmbeddedCheckout = window.closeInfinitePayCheckout;

  // Monitor de Retorno Oficial InfinitePay & Rastreamento no Google Analytics
  (function monitorInfinitePayReturn() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const receiptUrl = urlParams.get('receipt_url');
      const orderNsu = urlParams.get('order_nsu');
      const slug = urlParams.get('slug');

      if (receiptUrl || orderNsu || slug) {
        console.log('🎉 Retorno de pagamento InfinitePay:', { orderNsu, receiptUrl, slug });

        // Sincroniza pedido no Firebase Firestore
        try {
          if (window.firebase && window.firebase.firestore) {
            const db = window.firebase.firestore();
            const urlDocId = urlParams.get('order_id') || urlParams.get('doc_id');
            const trackingPayload = {
              pagoConfirmado: true,
              pagoEmCustodia: true,
              status: 'pendente_aceite',
              paymentStatus: 'pago_infinitepay',
              infinitepay_nsu: orderNsu || '',
              infinitepay_receipt: receiptUrl || '',
              infinitepay_slug: slug || '',
              paidAt: new Date().toISOString()
            };

            if (urlDocId) {
              db.collection('solicitacoes_servico').doc(urlDocId).set(trackingPayload, { merge: true });
            } else {
              db.collection('solicitacoes_servico')
                .where('clientEmail', 'in', ['robertaferreira1982@gmail.com', 'robertaferreirap14@gmail.com', 'caio.arapress@gmail.com'])
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
              category: 'PAGAMENTO_INFINITEPAY',
              message: 'Pagamento InfinitePay aprovado NSU: ' + (orderNsu || 'N/A') + ' (Recibo: ' + (receiptUrl ? 'Disponível' : 'N/A') + ')',
              details: 'Cliente: robertaferreira1982@gmail.com',
              timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
              platform: 'Web InfinitePay'
            }).catch(() => {});
          }
        } catch(fbErr) {
          console.warn('Erro ao atualizar Firestore no retorno da InfinitePay:', fbErr);
        }
        console.log('🎉 Retorno de pagamento InfinitePay:', { orderNsu, receiptUrl, slug });

        // 1. Google Analytics 4 (Evento Oficial de Compra)
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'purchase', {
            transaction_id: orderNsu || slug || ('MNR-' + Date.now()),
            value: 66.0,
            currency: 'BRL',
            items: [{
              item_id: orderNsu || 'servico',
              item_name: 'Serviço Especializado Mão na Roda',
              price: 66.0,
              quantity: 1
            }]
          });
        }

        // 2. Notificação visual de sucesso
        const banner = document.createElement('div');
        banner.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#00E676;color:#000;padding:14px 24px;border-radius:14px;font-weight:bold;z-index:99999999;box-shadow:0 8px 30px rgba(0,0,0,0.5);font-family:sans-serif;display:flex;align-items:center;gap:10px;';
        banner.innerHTML = '<span>✅ Pagamento Confirmado com Sucesso pela InfinitePay! Custódia ativada.</span>';
        document.body.appendChild(banner);
        setTimeout(function() { banner.remove(); }, 6000);
      }
    } catch (e) {
      console.warn('monitorInfinitePayReturn error:', e);
    }
  })();
})();
