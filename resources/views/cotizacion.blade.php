<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización {{ $data[0]->idcotizacion }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header, .footer {
            text-align: center;
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
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Cotización {{ $data[0]->idcotizacion }}</h1>
        <p>Fecha: {{ $data[0]->fecha }}</p>
        <p>Cliente: {{ $data[0]->cliente_nombre }}</p>
    </div>
    <div class="content">
        <h2>Detalles de la Cotización</h2>
        <table>
            <thead>
                <tr>
                    <th>Clave</th>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Descuento</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $detalle)
                <tr>
                    <td>{{ $detalle->clave }}</td>
                    <td>{{ $detalle->producto }}</td>
                    <td>{{ $detalle->descripcion }}</td>
                    <td>{{ $detalle->cantidad }}</td>
                    <td>{{ $detalle->precio }}</td>
                    <td>{{ $detalle->descuento }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="footer">
        <p>Gracias por su preferencia.</p>
    </div>      