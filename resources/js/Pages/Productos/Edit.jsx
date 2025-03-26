import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Edit({productos}) {
    console.log(productos);
    const [values, setValues] = useState({ // Form fields
        descripcion: productos.descripcion,
        precio: productos.precio
    });

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value
        setValues(values => ({
            ...values,
            [key]: value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        router.put(`/productos/${productos.idproducto}`, values)
    }

    return (
            <Form onSubmit={handleSubmit}>
                {/* Pay attention how we create here input fields */}
                <Form.Label htmlFor="descripcion">Decripcion:</Form.Label>
                <Form.Control id="descripcion" value={values.descripcion} onChange={handleChange} />

                <Form.Label htmlFor="precio">Precio:</Form.Label>
                <Form.Control id="precio" value={values.precio} onChange={handleChange} />
                <br/>
                <Button type="submit">Actualizar</Button>
            </Form>
    )
}