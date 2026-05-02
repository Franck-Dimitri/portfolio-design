<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau message de contact</title>
    <style>
        body {
            font-family: 'Outfit', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e5e5e5;
        }
        .field {
            margin-bottom: 20px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            border-left: 3px solid #f97316;
        }
        .label {
            font-weight: bold;
            color: #f97316;
            margin-bottom: 5px;
            font-size: 12px;
            text-transform: uppercase;
        }
        .value {
            color: #333;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>📬 Nouveau message de contact</h2>
    </div>
    
    <div class="content">
        <div class="field">
            <div class="label">Nom complet</div>
            <div class="value">{{ $data['name'] }}</div>
        </div>
        
        <div class="field">
            <div class="label">Email</div>
            <div class="value">{{ $data['email'] }}</div>
        </div>
        
        @if(isset($data['phone']) && $data['phone'])
        <div class="field">
            <div class="label">Téléphone</div>
            <div class="value">{{ $data['phone'] }}</div>
        </div>
        @endif
        
        @if(isset($data['service']) && $data['service'])
        <div class="field">
            <div class="label">Service souhaité</div>
            <div class="value">{{ $data['service'] }}</div>
        </div>
        @endif
        
        <div class="field">
            <div class="label">Sujet</div>
            <div class="value">{{ $data['subject'] }}</div>
        </div>
        
        <div class="field">
            <div class="label">Message</div>
            <div class="value">{{ nl2br($data['message']) }}</div>
        </div>
    </div>
    
    <div class="footer">
        <p>Message envoyé depuis le formulaire de contact du site portfolio</p>
        <p>© {{ date('Y') }} Dim's Creative Academy</p>
    </div>
</body>
</html>