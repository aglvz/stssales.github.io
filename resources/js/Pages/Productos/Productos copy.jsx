import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import jQuery from "jquery";
import jszip from 'jszip';
import pdfmake from 'pdfmake';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-responsive-bs5';

import Add from '@/Pages/Productos/Create';
 

DataTable.use(DT);

export default function Productos({ productos,combos}) {
        const [modalShow, setModalShow] = useState(false);
        const [producto, setProducto] = useState([]);
        const [title, setTitle] = useState(null);
        function Modaladd(props) {
            return (
                <Modal {...props} >
                        <Modal.Header closeButton>
                        <Modal.Title>{props.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {props.children}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={props.onHide}>Close</Button>
                        </Modal.Footer>
                    </Modal>
            );
        }
    
        function addProducto() {
            setProducto(null);
            setTitle("Agregar Producto");
            setModalShow(true);
            
        }
        
        function getProducto(idproducto) {
            axios.get(`/productos/${idproducto}/edit`).then((response) => {
                setProducto(response.data);
                setTitle("Editar Producto");
                setModalShow(true);
              }).catch(error => {
                console.log(error);
              });
            
        }
    
        function deleteProducto( idproducto ) {
            axios.delete(`/productos/${idproducto}`).then((response) => {
               alert(response.data.message);
              });
            router.get('/productos');
        }
        
        // function cmb() {
        //     axios.get(`/productos/combos`).then((response) => {
        //        const res = response.data;
        //        setCombos(res);
        //      }); 
        // }
    
    return (
        <AuthenticatedLayout>
            <Head title="Productos" />
            <Container>
                <Row>
                    <Col md={12}>   
                    <Card>
                        <Card.Header as="h5" className="text-center">Productos</Card.Header>
                    <Card.Body>
                    <Button variant="primary" size="sm" onClick={() => addProducto()}>
                    <FontAwesomeIcon icon="fa-solid fa-plus" /> Agregar
                    </Button>
                    <DataTable className="table table-bordered table-striped table-sm" id="productos" 
                    options={{
                        language: {
                            url: 'https://cdn.datatables.net/plug-ins/2.1.7/i18n/es-MX.json',
                        },
                        layout: {
                            topStart: 'search',
                            topEnd: null,
                            bottomEnd: {
                                paging: {
                                    firstLast: false,
                                    type: 'numbers'
                                }
                            },
                            bottomStart: 'info',
                           
                        },
                        destroy: true,
                        responsive: true,
                    }}
                    >
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>      
                            { productos.map( (item) => (
                                    <tr key={item.idproducto}>
                                        <td>{item.producto}</td>
                                        <td>{item.precio}</td>
                                        <td>{item.stock}</td>
                                        <td className='text-center'><FontAwesomeIcon icon="fa-solid fa-pen-to-square" onClick={() => getProducto(item.idproducto)}/></td>
                                        <td className='text-center'><FontAwesomeIcon icon="fa-solid fa-trash" onClick={() => deleteProducto(item.idproducto)}/></td>
                                    </tr>
                            )) }
                        </tbody>
                    </DataTable>
                    </Card.Body>
                    </Card>
                    </Col>
                </Row>
            </Container>
            <Modaladd show={modalShow} title={title} onHide={() => setModalShow(false)} >
                <Add products={producto} selects={combos}/>
            </Modaladd>
        </AuthenticatedLayout>
    )
}