import { Controller, Get, Res, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { Response } from 'express';
import { Public } from './decorators/customize';

@Controller('')
export class AppController {
  @Public()
  @Version(VERSION_NEUTRAL)
  @Get('/')
  getHome(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HRM API | Human Resource Management System</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          :root {
            --primary: #4361ee;
            --secondary: #3f37c9;
            --accent: #4895ef;
            --light: #f8f9fa;
            --success: #4cc9f0;
            --dark: #121212;
            --dark-secondary: #1a1a1a;
            --text: #ffffff;
            --text-secondary: #cccccc;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          color: var(--text);
          position: relative; 
          
          /* Background setup */
          background-image: 
            url("https://res.cloudinary.com/daq721xar/image/upload/v1745718586/2_fqvr4d.jpg");
          background-size: cover;
          background-position: center;
          background-attachment: fixed; 
          background-repeat: no-repeat;
        }

        body::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(49, 50, 52, 0.9); 
          opacity: 0.7;
          z-index: -1;
        }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            position: relative;
          }
          
          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            animation: fadeInDown 1s ease;
          }
          
          .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
          }
          
          .logo i {
            font-size: 2rem;
            color: var(--accent);
          }
          
          .hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 4rem 0;
            min-height: 70vh;
          }
          
          .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            -webkit-background-clip: text;
            background-clip: text;
            color: var(--text);
            animation: fadeIn 1s ease;
            color: transparent;  
            background: linear-gradient(to right, rgb(226 231 255), rgb(39 0 255));
            -webkit-background-clip: text; 
            background-clip: text;
          }
          
          .hero p {
            font-size: 1.2rem;
            max-width: 700px;
            margin-bottom: 2rem;
            color: var(--text);
            line-height: 1.6;
            animation: fadeIn 1.5s ease;
          }
          
          .cta {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            animation: fadeInUp 2s ease;
          }
          
          .btn {
            padding: 0.8rem 1.8rem;
            border-radius: 50px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1rem;
          }
          
          .btn-primary {
            background-color: var(--primary);
            color: white;
            box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
          }
          
          .btn-primary:hover {
            background-color: var(--secondary);
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
          }
          
          .btn-outline {
            background-color: transparent;
            color: var(--primary);
            border: 2px solid var(--primary);
          }
          
          .btn-outline:hover {
            background-color: var(--primary);
            color: white;
            transform: translateY(-3px);
          }
          
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
          }
          
          .feature-card {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            text-align: center;
          }
          
          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          }
          
          .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--accent);
          }
          
          .feature-card h3 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: var(--dark);
          }
          
          .feature-card p {
            color: var(--text);
            line-height: 1.6;
          }
          
          .api-status {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            margin-top: 3rem;
            display: inline-flex;
            align-items: center;
            gap: 0.8rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            animation: pulse 2s infinite;
          }
          
          .status-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #4ade80;
          }
          
          footer {
            text-align: center;
            padding: 2rem 0;
            margin-top: 4rem;
            color: #666;
            border-top: 1px solid #eee;
          }
          
          /* Animations */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          /* Responsive */
          @media (max-width: 768px) {
            .hero h1 {
              font-size: 2.5rem;
            }
            
            .hero p {
              font-size: 1rem;
            }
            
            .cta {
              flex-direction: column;
              width: 100%;
            }
            
            .btn {
              width: 100%;
            }
          }

          .feature-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .feature-card:hover {
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }

          .feature-card h3 {
            color: var(--text-secondary);
          }

          .btn-outline {
            border: 2px solid var(--primary);
            color: var(--primary);
          }

          .btn-outline:hover {
            background: var(--primary);
            color: var(--text);
          }

          .api-status {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .status-dot {
            background-color: #4ade80;
            box-shadow: 0 0 10px #4ade8055;
          }

          footer {
            color: var(--text-secondary);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .feature-icon {
            filter: drop-shadow(0 0 8px var(--accent));
          }

          .btn-primary {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .btn-primary::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
            transform: rotate(45deg);
            animation: btnGlow 3s infinite;
          }

          @keyframes btnGlow {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <a href="#" class="logo">
              <i class="fas fa-users-cog"></i>
              <span>HRM API</span>
            </a>
          </header>
          
          <main>
            <section class="hero">
              <h1>Welcome to Core Chain Server</h1>
              <p>A powerful, scalable backend system for modern HR management solutions. Streamline your employee data, payroll, attendance, and more with our comprehensive RESTful API.</p>
              
              <div class="api-status">
                <div class="status-dot"></div>
                <span>API is working</span>
                <i class="fas fa-rocket" style="color: var(--accent); margin-left: 0.5rem;"></i>
              </div>
              
              <div class="cta">
                <a class="btn btn-primary" target="_blank"style="text-decoration: none" href="https://drive.google.com/file/d/1P_PSqrnzIMTFH2Rnl-cE_a6YsNlyGqOe/view?usp=sharing">
                  <i class="fas fa-book"></i> API Documentation
                </a>
                <a href="https://github.com/trandinh0506/CoreChainServer" target="_blank" class="btn btn-outline">
                  <i class="fab fa-github"></i> View on GitHub
                </a>
              </div>
            </section>
            
            <section class="features">
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <h3>Security</h3>
                <p>Places a strong emphasis on security. By integrating the Ethereum blockchain along with various security features and algorithms, it maximizes information safety and API protection.</p>
              </div>

              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-code"></i>
                </div>
                <h3>Professional</h3>
                <p>Designed following Domain-Driven Design principles, with a thorough system analysis and design process. It inherits and enhances multiple features compared to the previous HRM system.</p>
              </div>
              
              <div class="feature-card">
                <div class="feature-icon">
                  <i class="fas fa-bolt"></i>
                </div>
                <h3>High Performance</h3>
                <p>Built with NestJS for exceptional performance and scalability to handle your growing business needs.</p>
              </div>
            </section>
          </main>
          
          <footer>
            <p>© ${new Date().getFullYear()} HRM API. All rights reserved. By Cao Tri Ngoc</p>
          </footer>
        </div>
      </body>
      </html>
    `);
  }
}