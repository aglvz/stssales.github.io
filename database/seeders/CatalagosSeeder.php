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
        DB::table('proveedores')->insert([['nombre' => 'CT Online'],
                                          ['nombre' => 'Grupo CVA'],
                                          ['nombre' => 'GLoma'],
                                          ['nombre' => 'SYSCOM'],
                                          ['nombre' => 'Ingram Micro'],
                                          ['nombre' => 'CT Internacional'],
                                          ['nombre' => 'TVC'],
                                          ['nombre' => 'Aliexpress'],
                                          ['nombre' => 'Mercado Libre'],
                                          ['nombre' => 'Amazon'],
                                          ['nombre' => 'Office Depot']]);
        DB::table('categorias')->insert([['categoria' => 'Computo'],
                                        ['categoria' => 'Seguridad'],
                                        ['categoria' => 'Software'],
                                        ['categoria' => 'Redes'],
                                        ['categoria' => 'Impresion'],
                                        ['categoria' => 'Accesorios'],
                                        ['categoria' => 'Consumibles'],
                                        ['categoria' => 'Telefonia'],
                                        ['categoria' => 'Audio'],
                                        ['categoria' => 'Video'],
                                        ['categoria' => 'Cables'],
                                        ['categoria' => 'Energia'],
                                        ['categoria' => 'Almacenamiento'],
                                        ['categoria' => 'Electronica'],
                                        ['categoria' => 'Software'],
                                        ['categoria' => 'Servicios'],
                                        ['categoria' => 'Otros']]);
        DB::table('marcas')->insert([['marca' => 'HP'],
                                    ['marca' => 'Dell'],
                                    ['marca' => 'Lenovo'],
                                    ['marca' => 'Asus'],
                                    ['marca' => 'Acer'],
                                    ['marca' => 'Apple'],
                                    ['marca' => 'Samsung'],
                                    ['marca' => 'Xiaomi'],
                                    ['marca' => 'Huawei'],
                                    ['marca' => 'Cisco'],
                                    ['marca' => 'D-Link'],
                                    ['marca' => 'Linksys'],
                                    ['marca' => 'TP-Link'],
                                    ['marca' => 'Ubiquiti'],
                                    ['marca' => 'HIKVISION'],
                                    ['marca' => 'DAHUA'],
                                    ['marca' => 'HILOOK'],
                                    ['marca' => 'Generico'],
                                    ['marca' => 'Microsoft'],
                                    ['marca' => 'Kaspersky'],
                                    ['marca' => 'ESET'],
                                    ['marca' => 'Symantec'],
                                    ['marca' => 'Panda'],
                                    ['marca' => 'McAfee'],
                                    ['marca' => 'ADATA'],
                                    ['marca' => 'Kingston'],
                                    ['marca' => 'Sandisk'],
                                    ['marca' => 'Seagate'],
                                    ['marca' => 'Western Digital'],
                                    ['marca' => 'Toshiba'],
                                    ['marca' => 'EPCOM'],
                                    ['marca' => 'Honeywell']]);
  }
}
