<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CatalagosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('proveedores')->insert(['nombre' => 'CT Online']);
        DB::table('proveedores')->insert(['nombre' => 'Grupo CVA']);
        DB::table('proveedores')->insert(['nombre' => 'GLoma']);
        DB::table('proveedores')->insert(['nombre' => 'SYSCOM']);
        DB::table('proveedores')->insert(['nombre' => 'TVC']);
        DB::table('proveedores')->insert(['nombre' => 'Aliexpress']);
        DB::table('proveedores')->insert(['nombre' => 'Mercado Libre']);
        DB::table('proveedores')->insert(['nombre' => 'Amazon']);
        DB::table('proveedores')->insert(['nombre' => 'Office Depot']);

        DB::table('categorias')->insert(['categoria' => 'Computo']);
        DB::table('categorias')->insert(['categoria' => 'Seguridad']);
        DB::table('categorias')->insert(['categoria' => 'Software']);
        DB::table('categorias')->insert(['categoria' => 'Redes']);
        DB::table('categorias')->insert(['categoria' => 'Impresion']);
        DB::table('categorias')->insert(['categoria' => 'Accesorios']);
        DB::table('categorias')->insert(['categoria' => 'Consumibles']);
        DB::table('categorias')->insert(['categoria' => 'Telefonia']);
        DB::table('categorias')->insert(['categoria' => 'Audio']);
        DB::table('categorias')->insert(['categoria' => 'Video']);
        DB::table('categorias')->insert(['categoria' => 'Cables']);
        DB::table('categorias')->insert(['categoria' => 'Energia']);
        DB::table('categorias')->insert(['categoria' => 'Almacenamiento']);
        DB::table('categorias')->insert(['categoria' => 'Electronica']);
        DB::table('categorias')->insert(['categoria' => 'Software']);
        DB::table('categorias')->insert(['categoria' => 'Servicios']);
        DB::table('categorias')->insert(['categoria' => 'Otros']);

        DB::table('marcas')->insert(['marca' => 'HP']);
        DB::table('marcas')->insert(['marca' => 'Dell']);
        DB::table('marcas')->insert(['marca' => 'Lenovo']);
        DB::table('marcas')->insert(['marca' => 'Asus']);
        DB::table('marcas')->insert(['marca' => 'Acer']);
        DB::table('marcas')->insert(['marca' => 'Apple']);
        DB::table('marcas')->insert(['marca' => 'Samsung']);
        DB::table('marcas')->insert(['marca' => 'Xiaomi']);
        DB::table('marcas')->insert(['marca' => 'Huawei']);
        DB::table('marcas')->insert(['marca' => 'Cisco']);
        DB::table('marcas')->insert(['marca' => 'D-Link']);
        DB::table('marcas')->insert(['marca' => 'Linksys']);
        DB::table('marcas')->insert(['marca' => 'TP-Link']);
        DB::table('marcas')->insert(['marca' => 'Ubiquiti']);
        DB::table('marcas')->insert(['marca' => 'HIKVISION']);
        DB::table('marcas')->insert(['marca' => 'DAHUA']);
        DB::table('marcas')->insert(['marca' => 'HILOOK']);
        DB::table('marcas')->insert(['marca' => 'Generico']);
        DB::table('marcas')->insert(['marca' => 'Microsoft']);
        DB::table('marcas')->insert(['marca' => 'Kaspersky']);
        DB::table('marcas')->insert(['marca' => 'ESET']);
        DB::table('marcas')->insert(['marca' => 'Symantec']);
        DB::table('marcas')->insert(['marca' => 'Panda']);
        DB::table('marcas')->insert(['marca' => 'McAfee']);
        DB::table('marcas')->insert(['marca' => 'ADATA']);
        DB::table('marcas')->insert(['marca' => 'Kingston']);
        DB::table('marcas')->insert(['marca' => 'Sandisk']);
        DB::table('marcas')->insert(['marca' => 'Seagate']);
        DB::table('marcas')->insert(['marca' => 'Western Digital']);
        DB::table('marcas')->insert(['marca' => 'Toshiba']);
        DB::table('marcas')->insert(['marca' => 'EPCOM']);
        DB::table('marcas')->insert(['marca' => 'Honeywell']);

  }
}
