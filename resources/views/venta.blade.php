<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Venta {{ $venta->idventa }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #2c3e50;
        }
        .company-info {
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .client-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        .info-section h3 {
            margin-top: 0;
            color: #2c3e50;
        }
        .info-section p {
            margin: 5px 0;
            font-size: 14px;
        }
        .content {
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #2c3e50;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .total-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .total-box {
            width: 300px;
        }
        .total-box div {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        .total-box .grand-total {
            background-color: #2c3e50;
            color: white;
            font-weight: bold;
            font-size: 16px;
            border: none;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            font-size: 12px;
            color: #666;
        }
        .align-right {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <h2>Soluciones Tecnológicas y Software</h2>
            <p>Seguridad, Cómputo y Desarrollo de Software</p>
            <p>Email: info@soltecysoft.com | Web: www.soltecysoft.com</p>
        </div>
        <h1>COMPROBANTE DE VENTA</h1>
    </div>

    <div class="client-info">
        <div class="info-section">
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> {{ $venta->nombre_cliente }}</p>
            <p><strong>RFC:</strong> {{ $venta->rfc }}</p>
            <p><strong>Teléfono:</strong> {{ $venta->telefono }}</p>
            <p><strong>Correo:</strong> {{ $venta->correo_cliente }}</p>
            <p><strong>Dirección:</strong> {{ $venta->direccion }}</p>
        </div>
        <div class="info-section">
            <h3>Información de la Venta</h3>
            <p><strong>Número de Venta:</strong> {{ $venta->numero_venta ?? $venta->idventa }}</p>
            <p><strong>Fecha:</strong> {{ $venta->created_at->format('d/m/Y H:i') }}</p>
            <p><strong>Estado:</strong> <span style="background-color: #e8f4f8; padding: 3px 8px; border-radius: 3px;">{{ ucfirst($venta->estado) }}</span></p>
            <p><strong>Usuario:</strong> {{ optional($venta->usuario)->name ?? 'Sistema' }}</p>
        </div>
    </div>

    <div class="content">
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th class="align-right">Cantidad</th>
                    <th class="align-right">Precio Unitario</th>
                    <th class="align-right">Descuento</th>
                    <th class="align-right">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @php $subtotal = 0; @endphp
                @foreach($detalles as $detalle)
                @php 
                    $item_subtotal = ($detalle->cantidad * $detalle->precio) - $detalle->descuento;
                    $subtotal += $item_subtotal;
                @endphp
                <tr>
                    <td>{{ $detalle->producto }}</td>
                    <td class="align-right">{{ $detalle->cantidad }}</td>
                    <td class="align-right">${{ number_format($detalle->precio, 2) }}</td>
                    <td class="align-right">${{ number_format($detalle->descuento, 2) }}</td>
                    <td class="align-right">${{ number_format($item_subtotal, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="total-section">
        <div class="total-box">
            <div>
                <span>Subtotal:</span>
                <span>${{ number_format($subtotal, 2) }}</span>
            </div>
            <div>
                <span>IVA (16%):</span>
                <span>${{ number_format($subtotal * 0.16, 2) }}</span>
            </div>
            <div class="grand-total">
                <span>TOTAL:</span>
                <span>${{ number_format($subtotal * 1.16, 2) }}</span>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Gracias por su compra. Este comprobante es válido para garantía.</p>
        <p>Impreso: {{ now()->format('d/m/Y H:i') }}</p>
    </div>      
</body>
</html>
