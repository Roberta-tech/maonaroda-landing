/**
 * MÃO NA RODA — CHECKOUT TRANSPARENTE NATIVO IN-APP
 * Startup Impetus Tecnologia • Stripe Elements & Embedded Checkout
 */

(function () {
  'use strict';

  let currentElements = null;
  let currentCheckout = null;

  window.openStripeEmbeddedCheckout = async function (clientSecret) {
    if (!clientSecret) {
      alert('Erro ao iniciar o checkout seguro. Tente novamente.');
      return;
    }

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
        background-color: rgba(0, 0, 0, 0.85);
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
          max-width: 520px;
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
                width: 38px;
                height: 38px;
                border-radius: 12px;
                background: rgba(0, 229, 255, 0.12);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
              ">🛡️</div>
              <div>
                <div style="font-weight: 800; font-size: 15px; color: #ffffff; letter-spacing: -0.3px;">Checkout Seguro Mão na Roda</div>
                <div style="font-size: 11.5px; color: #00E5FF; font-weight: 600;">Startup Impetus • Custódia Protegida</div>
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

          <!-- Banner Informativo -->
          <div style="
            background: rgba(0, 229, 255, 0.05);
            border-left: 3px solid #00E5FF;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 11.5px;
            color: #b0b8c1;
            margin-bottom: 16px;
            line-height: 1.4;
          ">
            🔒 <strong style="color: #ffffff;">Proteção Garantida:</strong> Seu pagamento fica retido em custódia segura e só é liberado ao profissional após você aprovar a conclusão do serviço.
          </div>

          <!-- Container do Stripe -->
          <div id="stripe-checkout-mount-point" style="min-height: 280px;">
            <div style="text-align: center; padding: 40px 0; color: #00E5FF;">
              <div style="font-size: 28px; margin-bottom: 10px;">⚡</div>
              <div style="font-size: 13px; font-weight: 600;">Carregando checkout seguro...</div>
            </div>
          </div>

          <!-- Botão de Confirmação (para Payment Element) -->
          <div id="stripe-confirm-wrapper" style="display: none; margin-top: 18px;">
            <button id="stripe-btn-confirm" style="
              width: 100%;
              height: 52px;
              background: #FF0080;
              border: none;
              border-radius: 14px;
              color: #ffffff;
              font-size: 15px;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 8px 24px rgba(255, 0, 128, 0.35);
              transition: all 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            ">
              <span>🔒 Confirmar Pagamento Seguro</span>
            </button>
            <div id="stripe-payment-message" style="margin-top: 10px; font-size: 12px; text-align: center; color: #FF0080; display: none;"></div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('mao-na-roda-close-checkout').addEventListener('click', function () {
        window.closeStripeEmbeddedCheckout();
      });
    } else {
      overlay.style.display = 'flex';
      const mount = document.getElementById('stripe-checkout-mount-point');
      if (mount) {
        mount.innerHTML = `
          <div style="text-align: center; padding: 40px 0; color: #00E5FF;">
            <div style="font-size: 28px; margin-bottom: 10px;">⚡</div>
            <div style="font-size: 13px; font-weight: 600;">Carregando checkout seguro...</div>
          </div>
        `;
      }
      document.getElementById('stripe-confirm-wrapper').style.display = 'none';
      document.getElementById('stripe-payment-message').style.display = 'none';
    }

    try {
      if (typeof Stripe === 'undefined') {
        throw new Error('Stripe.js não está carregado.');
      }

      const stripe = Stripe('pk_live_51TIEpPJ8bCrM1s4sQNHPQ461G5Pbt9xcD2yRZbLj2rUN4YaUlX80vpfW8up1UtDyxVnCbNjb85sV0PEdRYlJgBRP00oHTPeonf');

      // Se for um PaymentIntent (pi_..._secret_...)
      if (clientSecret.includes('_secret_')) {
        const elements = stripe.elements({
          clientSecret: clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#00E5FF',
              colorBackground: '#0A0B0E',
              colorText: '#ffffff',
              colorDanger: '#FF0080',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
          },
        });

        currentElements = elements;
        const paymentElement = elements.create('payment');
        const mount = document.getElementById('stripe-checkout-mount-point');
        if (mount) {
          mount.innerHTML = '';
          paymentElement.mount('#stripe-checkout-mount-point');
        }

        const confirmWrapper = document.getElementById('stripe-confirm-wrapper');
        const confirmBtn = document.getElementById('stripe-btn-confirm');
        const msgDiv = document.getElementById('stripe-payment-message');
        confirmWrapper.style.display = 'block';

        confirmBtn.onclick = async function () {
          confirmBtn.disabled = true;
          confirmBtn.innerHTML = '<span>⚡ Processando pagamento seguro...</span>';
          msgDiv.style.display = 'none';

          const { error } = await stripe.confirmPayment({
            elements: elements,
            confirmParams: {
              return_url: window.location.origin + '/app/',
            },
            redirect: 'if_required',
          });

          if (error) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<span>🔒 Tentar Novamente</span>';
            msgDiv.textContent = error.message || 'Falha ao processar o pagamento.';
            msgDiv.style.display = 'block';
          } else {
            confirmBtn.style.background = '#00BDAE';
            confirmBtn.innerHTML = '<span>✅ Pagamento Aprovado com Sucesso!</span>';
            setTimeout(function () {
              window.closeStripeEmbeddedCheckout();
            }, 1800);
          }
        };
      }
    } catch (err) {
      console.error('Erro ao montar Checkout Stripe:', err);
      const mount = document.getElementById('stripe-checkout-mount-point');
      if (mount) {
        mount.innerHTML = `
          <div style="text-align: center; padding: 30px; color: #FF0080;">
            <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
            <div style="font-size: 13px; font-weight: bold;">Falha ao carregar o checkout seguro.</div>
            <div style="font-size: 11px; color: #B0B8C1; margin-top: 6px;">${err.message || 'Tente novamente em instantes.'}</div>
          </div>
        `;
      }
    }
  };

  window.closeStripeEmbeddedCheckout = function () {
    const overlay = document.getElementById('mao-na-roda-checkout-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    if (currentCheckout) {
      try {
        currentCheckout.destroy();
      } catch (_) {}
      currentCheckout = null;
    }
    currentElements = null;
  };
})();
