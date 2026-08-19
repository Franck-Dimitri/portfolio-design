<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture_{{ $subscription->reference }} - DCA</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #f97316;
            --dark: #0A0A0A;
            --border: #222222;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            background-color: #0d0d0d;
            color: #e5e7eb;
            font-family: 'Plus Jakarta Sans', sans-serif;
            padding: 40px 20px;
            font-size: 13px;
            line-height: 1.5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #111111;
            border: 1px solid var(--border);
            padding: 40px;
            position: relative;
        }
        .corner {
            position: absolute;
            width: 8px;
            height: 8px;
            border-color: var(--primary);
        }
        .corner-tl { top: 0; left: 0; border-top: 2px solid; border-left: 2px solid; }
        .corner-tr { top: 0; right: 0; border-top: 2px solid; border-right: 2px solid; }
        .corner-bl { bottom: 0; left: 0; border-bottom: 2px solid; border-left: 2px solid; }
        .corner-br { bottom: 0; right: 0; border-bottom: 2px solid; border-right: 2px solid; }

        .mono { font-family: 'JetBrains Mono', monospace; }
        .display { font-family: 'Syne', sans-serif; }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
            margin-bottom: 30px;
        }
        .logo-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border: 1px solid var(--primary);
            color: var(--primary);
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .badge-paid {
            display: inline-block;
            background: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            border: 1px solid rgba(34, 197, 94, 0.3);
            padding: 6px 14px;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        .info-card {
            background: #141414;
            border: 1px solid var(--border);
            padding: 20px;
        }
        .info-title {
            color: var(--primary);
            font-size: 10px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 12px;
            display: block;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .table th {
            background: #161616;
            border-bottom: 1px solid var(--border);
            padding: 12px 16px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #9ca3af;
        }
        .table td {
            padding: 16px;
            border-bottom: 1px solid #1a1a1a;
        }
        .total-box {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }
        .total-content {
            width: 300px;
            background: #141414;
            border: 1px solid var(--border);
            padding: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
        }
        .total-row.grand {
            border-top: 1px solid var(--border);
            padding-top: 10px;
            margin-top: 10px;
            font-size: 16px;
            font-weight: bold;
            color: var(--primary);
        }
        .footer-note {
            border-top: 1px solid var(--border);
            padding-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
        .actions-bar {
            max-width: 800px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .btn-print {
            background: var(--primary);
            color: #000;
            border: none;
            padding: 10px 20px;
            font-weight: bold;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
            cursor: pointer;
            font-family: 'JetBrains Mono', monospace;
        }
        .btn-back {
            color: #9ca3af;
            text-decoration: none;
            font-size: 11px;
            font-family: 'JetBrains Mono', monospace;
        }
        .btn-back:hover { color: #fff; }

        @media print {
            body {
                background: #fff;
                color: #000;
                padding: 0;
            }
            .container {
                border: 1px solid #ddd;
                background: #fff;
                color: #000;
                box-shadow: none;
                padding: 30px;
            }
            .actions-bar { display: none; }
            .info-card, .table th, .total-content {
                background: #f9f9f9 !important;
                border-color: #ddd !important;
                color: #000 !important;
            }
            .table td { border-bottom-color: #eee !important; color: #000 !important; }
            .total-row.grand { color: #000 !important; border-color: #000 !important; }
            .badge-paid {
                background: #e6f7ec !important;
                color: #059669 !important;
                border-color: #059669 !important;
            }
            .logo-box { border-color: #000 !important; color: #000 !important; }
            .corner { display: none; }
        }
    </style>
</head>
<body>

    <div class="actions-bar">
        <a href="javascript:history.back()" class="btn-back">← RETOUR</a>
        <button onclick="window.print()" class="btn-print">IMPRIMER / ENREGISTRER EN PDF</button>
    </div>

    <div class="container">
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>

        <!-- HEADER -->
        <div class="header">
            <div>
                <div class="logo-box mono">DCA</div>
                <h1 class="display" style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">
                    DIM'S CREATIVE ACADEMY
                </h1>
                <p class="mono" style="font-size: 11px; color: #9ca3af;">STUDIO DE DESIGN & IDENTITÉ VISUELLE</p>
                <p class="mono" style="font-size: 10px; color: #6b7280; margin-top: 4px;">Yaoundé / Douala, Cameroun • contact@dimscreative.com</p>
            </div>

            <div style="text-align: right;">
                <div class="badge-paid mono">
                    {{ $subscription->status === 'active' ? 'PAIEMENT VALIDÉ ✓' : strtoupper($subscription->status) }}
                </div>
                <p class="mono" style="font-size: 12px; font-weight: bold; margin-top: 10px; color: #fff;">
                    FACTURE #{{ $subscription->reference }}
                </p>
                <p class="mono" style="font-size: 10px; color: #9ca3af;">
                    Émise le {{ $subscription->created_at->format('d/m/Y') }}
                </p>
            </div>
        </div>

        <!-- COORDONNÉES -->
        <div class="grid-2">
            <div class="info-card">
                <span class="info-title mono">01 // FACTURÉ À</span>
                <p style="font-weight: bold; color: #fff; font-size: 14px; text-transform: uppercase;">{{ $clientNom }}</p>
                <p class="mono" style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Email : {{ $clientEmail }}</p>
                <p class="mono" style="font-size: 11px; color: #9ca3af;">Tél : {{ $clientPhone }}</p>
            </div>

            <div class="info-card">
                <span class="info-title mono">02 // TRANSACTION DE PAIEMENT</span>
                <p class="mono" style="font-size: 11px; color: #9ca3af;">
                    <strong>Passerelle :</strong> Mobile Money / HRSkills Pay
                </p>
                @if($payment)
                    <p class="mono" style="font-size: 11px; color: #9ca3af; margin-top: 2px;">
                        <strong>Réf. Transaction :</strong> {{ $payment->transaction_id ?: $payment->payment_reference }}
                    </p>
                    <p class="mono" style="font-size: 11px; color: #9ca3af; margin-top: 2px;">
                        <strong>Date de règlement :</strong> {{ $payment->created_at->format('d/m/Y H:i') }}
                    </p>
                @else
                    <p class="mono" style="font-size: 11px; color: #9ca3af; margin-top: 2px;">
                        <strong>Statut :</strong> Enregistré sur la plateforme
                    </p>
                @endif
            </div>
        </div>

        <!-- TABLEAU DES PRESTATIONS -->
        <table class="table">
            <thead>
                <tr>
                    <th class="mono">DESCRIPTION DU SERVICE</th>
                    <th class="mono">DURÉE / QUOTA</th>
                    <th class="mono" style="text-align: right;">MONTANT (FCFA)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong style="color: #fff; text-transform: uppercase;">{{ $item->titre ?: $item->nom ?: 'Prestation de Design Sur-Mesure' }}</strong>
                        <p class="mono" style="font-size: 11px; color: #9ca3af; margin-top: 4px;">
                            {{ $item->description_courte ?: $item->description ?: 'Conception graphique et livrables HD.' }}
                        </p>
                        @if($subscription->besoins)
                            <p class="mono" style="font-size: 10px; color: #6b7280; margin-top: 4px;">
                                <em>Brief : {{ Str::limit($subscription->besoins, 100) }}</em>
                            </p>
                        @endif
                    </td>
                    <td class="mono" style="font-size: 11px;">
                        {{ $subscription->duration_months ? $subscription->duration_months . ' mois' : '1 engagement' }}
                    </td>
                    <td class="mono" style="text-align: right; font-weight: bold; color: #fff;">
                        {{ number_format($subscription->montant, 0, ',', ' ') }} F
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- TOTALS -->
        <div class="total-box">
            <div class="total-content">
                <div class="total-row mono">
                    <span style="color: #9ca3af;">SOUS-TOTAL HT</span>
                    <span>{{ number_format($subscription->montant, 0, ',', ' ') }} FCFA</span>
                </div>
                <div class="total-row mono">
                    <span style="color: #9ca3af;">TVA (0%)</span>
                    <span>0 FCFA</span>
                </div>
                <div class="total-row grand mono">
                    <span>TOTAL PAYÉ</span>
                    <span>{{ number_format($subscription->montant, 0, ',', ' ') }} FCFA</span>
                </div>
            </div>
        </div>

        <!-- FOOTER SIGNATURE -->
        <div class="footer-note mono">
            <p>Ce document certifie le règlement intégral de la commande #{{ $subscription->reference }}.</p>
            <p style="margin-top: 4px;">DIM'S CREATIVE ACADEMY — Franck Dims • Tous droits réservés.</p>
        </div>
    </div>

</body>
</html>
