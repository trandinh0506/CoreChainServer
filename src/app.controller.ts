import { Controller, Get, Res, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { Public } from './decorators/customize';
import { readFileSync } from 'fs';
import { join } from 'path';
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Version(VERSION_NEUTRAL)
  @Get('/')
  getHome(@Res() res: Response) {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; img-src 'self' data:;");
    res.setHeader('Content-Type', 'text/html');
    res.send(`
          <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>HRM API - Human Resource Management</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/particlesjs/2.2.3/particles.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            body {
              background: #0f172a;
              color: #fff;
              overflow-x: hidden;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }

            #particles-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: -1;
            }

            .container {
              width: 90%;
              max-width: 1200px;
              padding: 40px;
              text-align: center;
              background: rgba(15, 23, 42, 0.8);
              border-radius: 16px;
              backdrop-filter: blur(8px);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
              transform: translateY(30px);
              opacity: 0;
              animation: fadeIn 1s ease-out forwards;
            }

            @keyframes fadeIn {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .logo {
              font-size: 3rem;
              margin-bottom: 1rem;
              color: #38bdf8;
              background: linear-gradient(to right, #38bdf8, #818cf8);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              display: inline-block;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
              100% {
                transform: scale(1);
              }
            }

            h1 {
              font-size: 2.5rem;
              margin-bottom: 1rem;
              background: linear-gradient(to right, #0ea5e9, #8b5cf6);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            p {
              font-size: 1.2rem;
              margin-bottom: 2rem;
              color: #cbd5e1;
              max-width: 600px;
              margin-left: auto;
              margin-right: auto;
            }

            .status {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              margin-bottom: 2rem;
              font-size: 1.2rem;
            }

            .status-dot {
              width: 12px;
              height: 12px;
              background-color: #22c55e;
              border-radius: 50%;
              display: inline-block;
              animation: blink 1.5s ease-in-out infinite;
            }

            @keyframes blink {
              0% {
                opacity: 0.4;
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0.4;
              }
            }

            .metrics {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 20px;
              margin-bottom: 2rem;
            }

            .metric-card {
              background: rgba(30, 41, 59, 0.7);
              padding: 20px;
              border-radius: 12px;
              width: 180px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s, box-shadow 0.3s;
              cursor: pointer;
            }

            .metric-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
            }

            .metric-icon {
              font-size: 2rem;
              margin-bottom: 10px;
              color: #38bdf8;
            }

            .metric-value {
              font-size: 1.8rem;
              font-weight: bold;
              margin-bottom: 5px;
              color: #f8fafc;
            }

            .metric-label {
              font-size: 0.9rem;
              color: #94a3b8;
            }

            .cta-button {
              background: linear-gradient(to right, #0ea5e9, #8b5cf6);
              color: white;
              border: none;
              padding: 12px 28px;
              font-size: 1rem;
              border-radius: 30px;
              cursor: pointer;
              transition: all 0.3s;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              margin: 0 10px;
              font-weight: 600;
            }

            .cta-button:hover {
              transform: translateY(-3px);
              box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
            }

            .api-endpoints {
              margin-top: 3rem;
              padding: 20px;
              background: rgba(30, 41, 59, 0.5);
              border-radius: 12px;
              text-align: left;
              max-height: 0;
              overflow: hidden;
              transition: max-height 0.5s ease-out;
              opacity: 0;
            }

            .api-endpoints.show {
              max-height: 500px;
              opacity: 1;
            }

            .api-endpoints h3 {
              margin-bottom: 1rem;
              color: #e2e8f0;
            }

            .endpoint {
              padding: 10px;
              margin-bottom: 10px;
              background: rgba(51, 65, 85, 0.5);
              border-radius: 8px;
              display: flex;
              gap: 10px;
              align-items: center;
            }

            .method {
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.8rem;
              font-weight: bold;
            }

            .get {
              background-color: #0284c7;
            }

            .post {
              background-color: #16a34a;
            }

            .put {
              background-color: #ca8a04;
            }

            .delete {
              background-color: #dc2626;
            }

            .path {
              font-family: monospace;
              color: #e2e8f0;
            }

            .footer {
              margin-top: 3rem;
              font-size: 0.9rem;
              color: #64748b;
            }

            @media (max-width: 768px) {
              .container {
                padding: 30px 20px;
              }
              
              h1 {
                font-size: 2rem;
              }
              
              .metrics {
                flex-direction: column;
                align-items: center;
              }
              
              .metric-card {
                width: 100%;
                max-width: 280px;
              }
            }
          </style>
        </head>
        <body>
          <div id="particles-container"></div>
          
          <div class="container">
            <div class="logo">
              <i class="fas fa-network-wired"></i>
            </div>
            
            <h1>HRM Backend API</h1>
            
            <div class="status">
              <span class="status-dot"></span>
              <span>API is working</span>
            </div>
            
            <p>Welcome to the HRM System - Core Chain Server. This is where powerful APIs are provided for the HRM software developed by the Not Found team.</p>
            
            <div class="metrics">
              <div class="metric-card">
                <div class="metric-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="metric-value" id="userCount">1,248</div>
                <div class="metric-label">Users</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon">
                  <i class="fas fa-database"></i>
                </div>
                <div class="metric-value" id="requestCount">232</div>
                <div class="metric-label">Request API</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon">
                  <i class="fas fa-bolt"></i>
                </div>
                <div class="metric-value" id="responseTime">67</div>
                <div class="metric-label">ms (Response)</div>
              </div>
              
              <div class="metric-card"  id="show-endpoints">
                <div class="metric-icon">
                  <i class="fas fa-code-branch"></i>
                </div>
                <div class="metric-value" id="endpoints">48</div>
                <div class="metric-label">Endpoints</div>
              </div>
            </div>
            
            <div>
              <a class="cta-button" id="docs-button" target="_blank"style="text-decoration: none" href="https://drive.google.com/file/d/1P_PSqrnzIMTFH2Rnl-cE_a6YsNlyGqOe/view?usp=sharing">View APIs Documentation</a>
              <a class="cta-button" target="_blank" href="https://github.com/trandinh0506/CoreChainServer" style="text-decoration: none">View Source</a>
            </div>
            
            <div class="api-endpoints" id="api-endpoints">
              <h3>Key Endpoints</h3>
              
              <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/v1/users</span>
              </div>
              
              <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/v1/users</span>
              </div>
              
              <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/v1/departments</span>
              </div>
              
              <div class="endpoint">
                <span class="method put">PUT</span>
                <span class="path">/api/v1/employees/:id</span>
              </div>
              
              <div class="endpoint">
                <span class="method delete">DELETE</span>
                <span class="path">/api/v1/employees/:id</span>
              </div>
            </div>
            
            <div class="footer">
              © 2025 HRM APIs - Developed by Cao Tri Ngoc
            </div>
          </div>
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              const particles = Particles.init({
                selector: '#particles-container',
                color: ['#38bdf8', '#818cf8', '#8b5cf6'],
                connectParticles: true,
                responsive: [
                  {
                    breakpoint: 768,
                    options: {
                      maxParticles: 60
                    }
                  }
                ]
              });

              function animateNumber(id, final) {
                let current = 0;
                let elem = document.getElementById(id);
                const increment = Math.ceil(final / 100);
                const timer = setInterval(() => {
                  current += increment;
                  if (current >= final) {
                    current = final;
                    clearInterval(timer);
                  }
                  elem.textContent = current;
                }, 20);
              }

              setTimeout(() => {
                animateNumber('userCount', 1248);
                animateNumber('requestCount', 78562);
                animateNumber('responseTime', 105);
                animateNumber('endpoints', 42);
              }, 500);

              const showEndpointsBtn = document.getElementById('show-endpoints');
              const apiEndpoints = document.getElementById('api-endpoints');
              
              showEndpointsBtn.addEventListener('click', () => {
                apiEndpoints.classList.toggle('show');
                showEndpointsBtn.textContent = apiEndpoints.classList.contains('show') ? 'Hide Endpoints' : 'Key Endpoints';
              });

              const docsButton = document.getElementById('docs-button');
              console.log(docsButton);
              docsButton.addEventListener('click', () => {
                alert("me....");
                window.location.href = '../Models/SoftwareDesignDocument.pdf';
              });

              const metricCards = document.querySelectorAll('.metric-card');
              metricCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                  const icon = card.querySelector('.metric-icon i');
                  icon.classList.add('fa-beat');
                  setTimeout(() => {
                    icon.classList.remove('fa-beat');
                  }, 1000);
                });
              });
            });
          </script>
        </body>
        </html>  
    `);
  }
}
