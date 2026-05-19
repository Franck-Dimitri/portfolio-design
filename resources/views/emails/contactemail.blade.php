<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #1a1a1a;
            background-color: #f5f5f5;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 580px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background: linear-gradient(135deg, #f97316, #ea580c);
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            color: white;
            font-size: 22px;
            font-weight: 600;
            letter-spacing: -0.3px;
            margin-bottom: 8px;
        }
        
        .header p {
            color: rgba(255, 255, 255, 0.85);
            font-size: 14px;
        }
        
        .content {
            padding: 40px 30px;
            background: #ffffff;
        }
        
        .greeting {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
        }
        
        .greeting h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 6px;
        }
        
        .greeting p {
            color: #666666;
            font-size: 14px;
        }
        
        .info-grid {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .info-icon {
            width: 36px;
            height: 36px;
            background: #fff7ed;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .info-icon span {
            font-size: 18px;
        }
        
        .info-content {
            flex: 1;
        }
        
        .info-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #f97316;
            margin-bottom: 4px;
        }
        
        .info-value {
            font-size: 15px;
            font-weight: 500;
            color: #1a1a1a;
            word-break: break-word;
        }
        
        .message-box {
            background: #fafafa;
            border-radius: 12px;
            padding: 20px;
            margin-top: 10px;
            border-left: 3px solid #f97316;
        }
        
        .message-box .info-label {
            margin-bottom: 12px;
        }
        
        .message-text {
            font-size: 14px;
            line-height: 1.6;
            color: #333333;
            white-space: pre-wrap;
            word-break: break-word;
        }
        
        .footer {
            background: #fafafa;
            padding: 24px 30px;
            text-align: center;
            border-top: 1px solid #eaeaea;
        }
        
        .footer p {
            font-size: 12px;
            color: #999999;
            margin-bottom: 8px;
        }
        
        .footer a {
            color: #f97316;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .badge {
            display: inline-block;
            background: #e6f4ea;
            color: #1e7e34;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 12px;
            border-radius: 20px;
            margin-top: 8px;
        }
        
        @media only screen and (max-width: 480px) {
            .container {
                border-radius: 0;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Nouvelle prise de contact</h1>
            <p>Formulaire de contact du site portfolio</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                <h2>Bonjour,</h2>
                <p>Vous avez reçu un nouveau message depuis le formulaire de contact.</p>
            </div>
            
            <!-- Information Grid -->
            <div class="info-grid">
                <!-- Name -->
                <div class="info-row">
                    <div class="info-icon">
                        <span>👤</span>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Nom complet</div>
                        <div class="info-value">{{ $data['name'] }}</div>
                    </div>
                </div>
                
                <!-- Email -->
                <div class="info-row">
                    <div class="info-icon">
                        <span>📧</span>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Adresse email</div>
                        <div class="info-value">
                            <a href="mailto:{{ $data['email'] }}" style="color: #f97316; text-decoration: none;">
                                {{ $data['email'] }}
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Phone (if provided) -->
                @if(isset($data['phone']) && $data['phone'])
                <div class="info-row">
                    <div class="info-icon">
                        <span>📞</span>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Téléphone</div>
                        <div class="info-value">
                            <a href="tel:{{ $data['phone'] }}" style="color: #1a1a1a; text-decoration: none;">
                                {{ $data['phone'] }}
                            </a>
                        </div>
                    </div>
                </div>
                @endif
                
                <!-- Service (if provided) -->
                @if(isset($data['service']) && $data['service'])
                <div class="info-row">
                    <div class="info-icon">
                        <span>🎯</span>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Service sollicité</div>
                        <div class="info-value">{{ $data['service'] }}</div>
                    </div>
                </div>
                @endif
                
                <!-- Subject -->
                <div class="info-row">
                    <div class="info-icon">
                        <span>📝</span>
                    </div>
                    <div class="info-content">
                        <div class="info-label">Sujet du message</div>
                        <div class="info-value">{{ $data['subject'] }}</div>
                    </div>
                </div>
            </div>
            
            <!-- Message Box -->
            <div class="message-box">
                <div class="info-label">Message</div>
                <div class="message-text">{{ nl2br(e($data['message'])) }}</div>
            </div>
            
            <!-- Auto-response note -->
            <div style="margin-top: 24px; padding: 12px; background: #fef7e0; border-radius: 8px; border-left: 3px solid #f97316;">
                <p style="font-size: 13px; color: #856404; margin: 0;">
                    <strong>Note :</strong> Pour répondre à ce message, utilisez l'adresse email ci-dessus.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>Cet email a été envoyé automatiquement depuis le formulaire de contact</p>
            <p>
                <a href="{{ url('/') }}">Dim's Creative Academy</a> • 
                <a href="{{ url('/contact') }}">Nous contacter</a>
            </p>
            <p>© {{ date('Y') }} Dim's Creative Academy. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>