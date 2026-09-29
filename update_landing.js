const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mão na Roda - Conectando quem faz com quem precisa</title>
    <link rel="icon" type="image/png" href="logo_menor.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0A0B0E;
            --card-bg: #14181F;
            --card-border: rgba(255, 255, 255, 0.08);
            --accent-cyan: #00D1FF;
            --accent-pink: #FF4B91;
            --text-main: #FFFFFF;
            --text-muted: #94A3B8;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Header Navigation */
        header {
            width: 100%;
            padding: 18px 5%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: rgba(10, 11, 14, 0.85);
            backdrop-filter: blur(12px);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            border-bottom: 1px solid var(--card-border);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .brand-logo {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 2px solid var(--accent-cyan);
            box-shadow: 0 0 15px rgba(0, 209, 255, 0.4);
            object-fit: cover;
        }

        .brand-title {
            font-size: 22px;
            font-weight: 800;
            background: linear-gradient(90deg, var(--accent-pink), var(--accent-cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 0.5px;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 30px;
        }

        nav a {
            color: var(--text-muted);
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
            transition: color 0.3s ease;
        }

        nav a:hover {
            color: var(--accent-cyan);
        }

        .nav-btn {
            background: linear-gradient(90deg, var(--accent-pink), #FF1493);
            color: white !important;
            padding: 10px 22px;
            border-radius: 25px;
            font-weight: 600 !important;
            box-shadow: 0 4px 15px rgba(255, 75, 145, 0.3);
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }

        .nav-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 75, 145, 0.5);
        }

        /* Hero Section */
        .hero {
            padding: 160px 5% 100px;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            background: rgba(0, 209, 255, 0.1);
            border: 1px solid rgba(0, 209, 255, 0.3);
            border-radius: 20px;
            color: var(--accent-cyan);
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
        }

        .hero h1 {
            font-size: 52px;
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 24px;
            max-width: 900px;
        }

        .hero h1 span {
            background: linear-gradient(90deg, var(--accent-pink), var(--accent-cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 20px;
            color: var(--text-muted);
            max-width: 720px;
            margin-bottom: 40px;
        }

        .cta-group {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .btn-primary {
            padding: 16px 36px;
            border-radius: 30px;
            font-size: 18px;
            font-weight: 700;
            text-decoration: none;
            background: linear-gradient(90deg, var(--accent-cyan), #0099FF);
            color: #0A0B0E;
            box-shadow: 0 8px 25px rgba(0, 209, 255, 0.35);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0, 209, 255, 0.5);
        }

        .btn-secondary {
            padding: 16px 36px;
            border-radius: 30px;
            font-size: 18px;
            font-weight: 600;
            text-decoration: none;
            background: transparent;
            color: var(--text-main);
            border: 1.5px solid var(--card-border);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn-secondary:hover {
            border-color: var(--accent-pink);
            color: var(--accent-pink);
            transform: translateY(-3px);
        }

        /* Features Section */
        .features {
            padding: 90px 5%;
            max-width: 1200px;
            margin: 0 auto;
        }

        .section-title {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-title h2 {
            font-size: 38px;
            font-weight: 800;
            margin-bottom: 12px;
        }

        .section-title p {
            color: var(--text-muted);
            font-size: 18px;
        }

        .grid-3 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 24px;
        }

        .feature-card {
            background-color: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 36px 28px;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-6px);
            border-color: rgba(0, 209, 255, 0.4);
        }

        .feature-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: rgba(0, 209, 255, 0.1);
            color: var(--accent-cyan);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 20px;
        }

        .feature-card.pink .feature-icon {
            background: rgba(255, 75, 145, 0.1);
            color: var(--accent-pink);
        }

        .feature-card h3 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        .feature-card p {
            color: var(--text-muted);
            font-size: 15px;
            line-height: 1.6;
        }

        /* How it Works Section */
        .how-it-works {
            padding: 90px 5%;
            background-color: rgba(20, 24, 31, 0.5);
            border-top: 1px solid var(--card-border);
            border-bottom: 1px solid var(--card-border);
        }

        .how-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .how-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 40px;
        }

        @media (max-width: 850px) {
            .how-grid {
                grid-template-columns: 1fr;
            }
        }

        .how-box {
            background-color: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 40px 32px;
        }

        .how-box-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 30px;
        }

        .how-box-title {
            font-size: 24px;
            font-weight: 800;
        }

        .step-list {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .step-item {
            display: flex;
            gap: 16px;
        }

        .step-num {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            color: var(--accent-cyan);
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .step-text h4 {
            font-size: 17px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .step-text p {
            color: var(--text-muted);
            font-size: 14px;
        }

        /* Categories Section */
        .categories-sec {
            padding: 90px 5%;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .cat-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            justify-content: center;
            margin-top: 36px;
        }

        .cat-chip {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 15px;
            font-weight: 600;
            color: var(--text-main);
            transition: all 0.2s ease;
        }

        .cat-chip:hover {
            border-color: var(--accent-cyan);
            color: var(--accent-cyan);
            transform: translateY(-2px);
        }

        /* Banner CTA */
        .banner-cta {
            padding: 80px 5%;
            max-width: 1000px;
            margin: 60px auto 90px;
            background: linear-gradient(135deg, rgba(255, 75, 145, 0.15), rgba(0, 209, 255, 0.15));
            border: 1px solid rgba(0, 209, 255, 0.3);
            border-radius: 28px;
            text-align: center;
        }

        .banner-cta h2 {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 16px;
        }

        .banner-cta p {
            color: var(--text-muted);
            font-size: 18px;
            margin-bottom: 32px;
        }

        /* Footer */
        footer {
            padding: 40px 5%;
            border-top: 1px solid var(--card-border);
            text-align: center;
            color: var(--text-muted);
            font-size: 14px;
        }

        footer a {
            color: var(--accent-cyan);
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        .footer-links {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 16px;
        }
    </style>
</head>
<body>

    <header>
        <a href="#" class="brand">
            <img src="logo_menor.png" alt="Mão na Roda" class="brand-logo">
            <span class="brand-title">MÃO NA RODA</span>
        </a>
        <nav>
            <a href="#como-funciona">Como Funciona</a>
            <a href="#vantagens">Vantagens</a>
            <a href="#categorias">Categorias</a>
            <a href="app/" class="nav-btn">Acessar App Web</a>
        </nav>
    </header>

    <main class="hero">
        <div class="hero-badge">✨ A plataforma nº 1 em Araraquara & Região</div>
        <h1>Conectando quem <span>precisa de ajuda</span> a quem <span>sabe fazer</span>.</h1>
        <p>Encontre profissionais qualificados para a sua casa ou empresa, ou ofereça seus serviços e conquiste novos clientes em poucos cliques.</p>
        
        <div class="cta-group">
            <a href="app/" class="btn-primary">
                🚀 Entrar na Plataforma Web
            </a>
            <a href="#baixar" class="btn-secondary">
                📲 Baixar App no Celular
            </a>
        </div>
    </main>

    <section class="features" id="vantagens">
        <div class="section-title">
            <h2>Por que usar o Mão na Roda?</h2>
            <p>Criado para facilitar a vida de quem contrata e valorizar quem trabalha.</p>
        </div>

        <div class="grid-3">
            <div class="feature-card">
                <div class="feature-icon">📍</div>
                <h3>Profissionais por Geolocalização</h3>
                <p>Veja no mapa em tempo real os prestadores de serviço mais próximos da sua localização em Araraquara e região.</p>
            </div>
            <div class="feature-card pink">
                <div class="feature-icon">🛡️</div>
                <h3>Segurança e Transparência</h3>
                <p>Perfis verificados com avaliações de outros clientes, histórico de serviços e especialidades detalhadas.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>Contratação Direta e Sem Complicação</h3>
                <p>Sem intermediários morosos. Escolha a categoria, navegue pelos perfis e entre em contato rapidamente.</p>
            </div>
        </div>
    </section>

    <section class="how-it-works" id="como-funciona">
        <div class="how-container">
            <div class="section-title">
                <h2>Como Funciona?</h2>
                <p>Uma experiência simples e intuitiva para ambos os lados.</p>
            </div>

            <div class="how-grid">
                <div class="how-box">
                    <div class="how-box-header">
                        <span style="font-size: 32px;">🔍</span>
                        <h3 class="how-box-title">Para quem quer Contratar</h3>
                    </div>
                    <div class="step-list">
                        <div class="step-item">
                            <div class="step-num">1</div>
                            <div class="step-text">
                                <h4>Escolha a Categoria ou Veja no Mapa</h4>
                                <p>Filtre por Eletricista, Encanador, Limpeza, Pintor e muitas outras opções.</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-num">2</div>
                            <div class="step-text">
                                <h4>Analise o Perfil do Profissional</h4>
                                <p>Veja fotos dos trabalhos, avaliações de outros usuários e taxa de cobrança.</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-num">3</div>
                            <div class="step-text">
                                <h4>Solicite o Serviço com Agilidade</h4>
                                <p>Combine os detalhes diretamente na plataforma e resolva seu problema sem estresse.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="how-box" style="border-color: rgba(255, 75, 145, 0.3);">
                    <div class="how-box-header">
                        <span style="font-size: 32px;">🧰</span>
                        <h3 class="how-box-title">Para quem quer Trabalhar</h3>
                    </div>
                    <div class="step-list">
                        <div class="step-item">
                            <div class="step-num" style="color: var(--accent-pink);">1</div>
                            <div class="step-text">
                                <h4>Crie seu Perfil Profissional</h4>
                                <p>Cadastre suas habilidades, experiências, fotos de serviços realizados e sua área de atuação.</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-num" style="color: var(--accent-pink);">2</div>
                            <div class="step-text">
                                <h4>Fique Visível no Mapa da Cidade</h4>
                                <p>Clientes da sua região encontrarão seu perfil assim que buscarem pelos seus serviços.</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <div class="step-num" style="color: var(--accent-pink);">3</div>
                            <div class="step-text">
                                <h4>Aumente sua Carteira de Clientes</h4>
                                <p>Receba solicitações diariamente e construa sua reputação de excelência na cidade.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="categories-sec" id="categorias">
        <div class="section-title">
            <h2>Categorias em Destaque</h2>
            <p>Tudo o que você precisa em um único lugar.</p>
        </div>

        <div class="cat-chips">
            <span class="cat-chip">⚡ Eletricista</span>
            <span class="cat-chip">🚰 Encanador & Hidráulica</span>
            <span class="cat-chip">🎨 Pintura & Acabamento</span>
            <span class="cat-chip">🧹 Limpeza & Diaristas</span>
            <span class="cat-chip">🔨 Reformas & Pedreiros</span>
            <span class="cat-chip">🔧 Mecânica & Guincho</span>
            <span class="cat-chip">🌿 Jardinagem & Paisagismo</span>
            <span class="cat-chip">❄️ Ar-Condicionado & Refrigeração</span>
            <span class="cat-chip">💻 Tecnologia & Assistência</span>
        </div>
    </section>

    <section class="banner-cta" id="baixar">
        <h2>Pronto para começar?</h2>
        <p>Acesse agora mesmo pelo navegador ou baixe nosso aplicativo em breve nas lojas oficiais!</p>
        <div class="cta-group">
            <a href="app/" class="btn-primary">
                Acessar Plataforma Web Agora
            </a>
        </div>
    </section>

    <footer>
        <p>&copy; 2026 Mão na Roda. Todos os direitos reservados. Araraquara - SP.</p>
        <div class="footer-links">
            <a href="privacidade.html">Política de Privacidade</a>
            <span>•</span>
            <a href="app/">Entrar no App</a>
        </div>
    </footer>

</body>
</html>
`;

fs.writeFileSync('C:\\Caio\\maonaroda-landing\\index.html', htmlContent, 'utf8');
console.log('Landing page HTML successfully updated!');
