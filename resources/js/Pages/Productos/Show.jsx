import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Show({ productos }) {
    return (
        <AuthenticatedLayout
                    header={
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Ver Productos
                        </h2>
                    }
                >
                    <Head title="Productos" />
            <hr/>
            <>
            <h1>{productos.descripcion}</h1>
            <hr/>
            <p>{productos.precio}</p>
        </>
        </AuthenticatedLayout>
    )
}