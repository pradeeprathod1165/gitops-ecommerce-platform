const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitOps Ecommerce Dashboard</title>
        <style>
            :root {
                --bg-color: #0f172a;
                --card-bg: #1e293b;
                --text-color: #f8fafc;
                --accent-color: #38bdf8;
                --success-color: #4ade80;
            }
            body {
                font-family: system-ui, -apple-system, sans-serif;
                background-color: var(--bg-color);
                color: var(--text-color);
                margin: 0;
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .container {
                max-width: 800px;
                width: 100%;
            }
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                border-bottom: 1px solid #334155;
                padding-bottom: 20px;
            }
            h1 { margin: 0; font-size: 24px; color: var(--accent-color); }
            .badge {
                background-color: rgba(74, 222, 128, 0.1);
                color: var(--success-color);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                border: 1px solid rgba(74, 222, 128, 0.2);
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 20px;
            }
            .card {
                background-color: var(--card-bg);
                padding: 20px;
                border-radius: 12px;
                border: 1px solid #334155;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .card h3 { margin-top: 0; color: #e2e8f0; }
            .price { font-size: 20px; font-weight: bold; color: var(--accent-color); margin: 15px 0; }
            button {
                background-color: var(--accent-color);
                color: #0f172a;
                border: none;
                padding: 10px 16px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
                transition: opacity 0.2s;
            }
            button:hover { opacity: 0.9; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <h1>GitOps E-Commerce Store</h1>
                <div class="badge">● Pipeline Active & Healthy</div>
            </header>
            <div class="grid">
                <div class="card">
                    <h3>Developer Hoodie</h3>
                    <p>High-quality cotton hoodie featuring terminal aesthetic graphics.</p>
                    <div class="price">$49.99</div>
                    <button onclick="alert('Item added to cart!')">Add to Cart</button>
                </div>
                <div class="card">
                    <h3>Mechanical Keyboard</h3>
                    <p>Hot-swappable custom mechanical keyboard for peak developer productivity.</p>
                    <div class="price">$129.99</div>
                    <button onclick="alert('Item added to cart!')">Add to Cart</button>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

const port = 8080;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
