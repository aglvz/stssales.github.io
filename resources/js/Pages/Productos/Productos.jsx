import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Image from 'react-bootstrap/Image'
import CloseButton from 'react-bootstrap/CloseButton';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-responsive-bs5';

import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image as PDFImage } from '@react-pdf/renderer';

DataTable.use(DT);


export default function Productos({ productos,combos}) {
    const [modalShow, setModalShow] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [producto, setProducto] = useState([]);
    const [title, setTitle] = useState(null);
    const [nottit,setNottit]=useState("");
    const [notmes,setNotmes]=useState("");
    const table = useRef();
  
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: 40,
            borderColor: '#000',
            borderWidth: 1,
            
        },
        sectionheader: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        sectionfooter: {
            flexDirection: 'row',
            fontSize: 12,
        },
        section: {
            flexDirection: 'row',
            marginTop: 10,
        },
        section2: {
            flexDirection: 'row',
            marginTop: 10,
            alignSelf: 'flex-end',
        },
        sectionproduct: {
            flexDirection: 'column',
            marginBottom: 10,
            textAlign: 'center',
        },
        sectionprecio: {
            flexDirection: 'column',
            textAlign: 'right',
            fontSize: 42,
            fontWeight: 'bold',
            color: 'red',
        },
        logo: {
            width: 70,
  
        },
        logo2: {
            width: 80,
            alignItems: 'right',

        },
        image: {
            height: 300,
            marginBottom: 10, 
        },
        title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        subtitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        text: {
            fontSize: 18,
            
        },
    });

    const ProductPDF = ({ product }) => (
        <Document>
            <Page
                size="A4"
                orientation="landscape"
                style={styles.page}
            >
                
                <View style={styles.sectionheader}>
                    <View style={{ flex: 1, textAlign: 'left' }}>
                        <PDFImage
                            style={styles.logo}
                            src={`${window.location.origin}/logo.jpg`} // Ruta completa del logo
                        />
                    </View>
                    <View style={{ flex: 1, textAlign: 'right' }}>
                        <Text style={styles.title}>Soluciones Tecnológicas y Software</Text>
                        <Text style={styles.text}>Seguridad, Computo y Desarrollo de software</Text>
                    </View>
                </View>
                <View style={styles.sectionproduct}>
                    <Text style={styles.subtitle}>{product.producto}</Text>
                </View>
                <View style={styles.section}>
                    <View style={{ flex: 1, textAlign: 'left' }}>
                        {product.image && (
                            <PDFImage
                                style={styles.image}
                                src={`data:image/jpeg;base64,${product.image}`}
                            />
                        )}
                    </View>
                    <View style={{ flex: 1, textAlign: 'left' }}>
                        <Text style={styles.text}>{product.descripcion}</Text>
                        <View style={styles.sectionprecio}>
                            <Text> {product.precio.toLocaleString("es-MX", {
                                        style: "currency", 
                                        currency: "MXN" 
                                    })}</Text>
                            
                        </View>
                    </View>
                </View>
                <View style={styles.sectionfooter}>
                    <View style={{ flex: 1, textAlign: 'left' }}>
                        <View style={styles.section}>
                            <Text>iscgalvez@gmail.com</Text>
                        </View>
                        <View style={styles.section}>
                            <Text>facebook.com/soltecysoft</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, textAlign: 'right' }}>
                        <View style={styles.section2}>
                            <PDFImage
                                style={styles.logo2}
                                src={`${window.location.origin}/Tarjetas-2.jpg`} // Ruta completa del logo
                            />
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );

    function Createedit({products,selects}) {
        const [values, setValues] = useState({
            idproducto: 0,
            clave: '',
            producto: '',
            descripcion: '',
            precio: '',
            stock: '',
            idcategoria: 0,
            idmarca: 0,
            idproveedor: 0
        });
        const [combos, setCombos] = useState(selects);
        useEffect(() => {
            setCombos(selects);
            if (products) {
                setValues({
                    idproducto: products.idproducto,
                    clave: products.clave,
                    producto: products.producto,
                    descripcion: products.descripcion,
                    precio: products.precio,
                    stock: products.stock,
                    idcategoria: products.idcategoria,
                    idmarca: products.idmarca,
                    idproveedor: products.idproveedor
                });
            }
        }, [selects, products]);
           
        function handleChange(e) {
            const { name, value } = e.target;
            setValues({ ...values, [name]: value });
        }

        function handleSelectChange(name, selectedOption) {
            setValues({ ...values, [name]: selectedOption ? selectedOption.value : 0 });
        }
        
        function handleSubmit(e) {
                e.preventDefault()
                const form = e.target;
                const formData = new FormData(form);
                axios.post(`/productos`,formData).then((response) => {
                    setModalShow(false);
                    setShowToast(true)
                    setNottit("Processo realizado");
                    setNotmes(response.data.message);
                    window.location.reload(false);
                  }).catch(error => {
                    console.log(error);
                  });
                
        }
        return (
                
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Form.Control type="hidden" id="idproducto" name="idproducto" value={values.idproducto} />
                        <Row>
                            <Col md={6}>
                            <Form.Label htmlFor="idproveedor">Proveedor:</Form.Label>
                                <Select id="idproveedor" name="idproveedor" 
                                isClearable={true}
                                isSearchable={true}
                                value={combos.proveedor.find(option => option.value === values.idproveedor)}
                                options={combos.proveedor}
                                onChange={(selectedOption) => handleSelectChange('idproveedor', selectedOption)}
                                placeholder="Seleccionar proveedor" />
                                <Form.Label htmlFor="idcategoria">Categoria:</Form.Label>
                                <Select id="idcategoria" name="idcategoria" 
                                isClearable={true}
                                isSearchable={true}
                                value={combos.categoria.find(option => option.value === values.idcategoria)}
                                options={combos.categoria}
                                onChange={(selectedOption) => handleSelectChange('idcategoria', selectedOption)}
                                placeholder="Seleccionar categoria"/>
                                <Form.Label htmlFor="idmarca">Marca:</Form.Label>
                                <Select id="idmarca" name="idmarca"  
                                isClearable={true}
                                isSearchable={true}
                                value={combos.marca.find(option => option.value === values.idmarca)}
                                options={combos.marca}
                                onChange={(selectedOption) => handleSelectChange('idmarca', selectedOption)}
                                placeholder="Seleccionar marca" />
                            </Col>
                            <Col md={6}>
                                <Form.Label htmlFor="clave">Clave:</Form.Label>
                                <Form.Control type="text" id="clave" name="clave" value={values.clave} onChange={handleChange} />
                                <Form.Label htmlFor="producto">Producto:</Form.Label>
                                <Form.Control type="text" id="producto" name="producto" value={values.producto} onChange={handleChange} />
                                <Form.Label htmlFor="descripcion">Decripcion:</Form.Label>
                                <Form.Control as="textarea" rows={3} id="descripcion" name="descripcion" value={values.descripcion} onChange={handleChange} />
                                <Form.Label htmlFor="precio">Precio:</Form.Label>
                                <Form.Control type="text" id="precio" name="precio" value={values.precio} onChange={handleChange} />
                                <Form.Label htmlFor="stock">Stock:</Form.Label>
                                <Form.Control type="text" id="stock"  name="stock" value={values.stock} onChange={handleChange} />
                                <Form.Label htmlFor="imagen">Imagen:</Form.Label>
                                <Form.Control type="file" id="imagen" name="imagen" />
                            </Col>
                        </Row>
                        <Row>
                            <Col  md={12} className="text-center">
                                <div className="d-flex gap-2 mb-2">
                                    <Button type="submit" variant="primary">Agregar</Button>   
                                    <Button variant="secondary" onClick={() => closeProducto()}>Cerrar</Button>
                                </div> 
                            </Col>
                        </Row>
                    </Form>
        )
    }
   
        
    function Modaladd(props) {
        return (
            <Modal {...props} size="lg">
                <Modal.Header closeButton>
                        <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal>
        );
    }
    
    function addProducto() {
            setProducto(null);
            setTitle("Agregar Producto");
            setModalShow(true);     
    }

    function closeProducto() {
        setProducto(null);
        setTitle("");
        setModalShow(false);     
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
    function Notify(props) {
        return(
            <ToastContainer
            className="p-3"
            position="top-end"
            style={{ zIndex: 1 }}
            >
            <Toast {...props} closeButton={true}  className="d-inline-block m-1" bg="Success"  onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                {/* <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2"  alt="" />
                    <strong className="me-auto">{props.title}</strong>
                    <small>11 mins ago</small>
                </Toast.Header> */}
                <Toast.Body className="bg-success text-white"  >
                    <CloseButton variant="white" aria-label="Hide" onClick={() => setShowToast(false)}/>
                    {props.message} 
                </Toast.Body>
            </Toast>
            </ToastContainer>
            );
    }
    
    function deleteProducto( idproducto ) {
            axios.delete(`/productos/${idproducto}`).then((response) => {
               alert(response.data.message);
              });
            router.get('/productos');
    }

    
    
    return (
        <AuthenticatedLayout>
            <Head title="Productos" />
            <Container>
                <Row>
                    <Col md={12} >   
                    <Card>
                        <Card.Header as="h5" className="text-center">Productos</Card.Header>
                    <Card.Body>
                    <Button variant="primary" size="sm" onClick={() => addProducto()}>
                        <FontAwesomeIcon icon="fa-solid fa-plus" /> Agregar
                    </Button>
                    <DataTable className="table table-bordered table-striped table-sm" id="productos" 
                    ref={table}
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
                            <th className='text-center'>Clave</th>
                                <th className='text-center'>Producto</th>
                                <th className='text-center'>Precio</th>
                                <th className='text-center'>Stock</th>
                                <th className='text-center' style={{width: 15,}}> </th>
                                <th className='text-center' style={{width: 15,}}></th>
                                <th className='text-center' style={{width: 15,}}></th>
                            </tr>
                        </thead>
                        <tbody>      
                            { productos.map( (item) => (
                                    <tr key={item.idproducto}>
                                        <td className='text-start'>{item.clave}</td>
                                        <td className='text-start'>{item.producto}</td>
                                        <td className='text-end'>{item.precio}</td>
                                        <td className='text-center'>{item.stock}</td>
                                        <td className='text-center' style={{width: 15,}}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" onClick={() => getProducto(item.idproducto)}/></td>
                                        <td className='text-center' style={{width: 15,}}><FontAwesomeIcon icon="fa-solid fa-trash" onClick={() => deleteProducto(item.idproducto)}/></td>
                                        <td className='text-center' style={{width: 15,}}>
                                            <PDFDownloadLink
                                                document={<ProductPDF product={item} />}
                                                fileName={`${item.producto}.pdf`}
                                            >
                                                {({ loading }) =>
                                                    loading ? "Generando PDF..." : (
                                                        <FontAwesomeIcon icon="fa-solid fa-print" />
                                                    )
                                                }
                                            </PDFDownloadLink>
                                        </td>
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
                <Createedit products={producto} selects={combos}/>
            </Modaladd>
            <Notify title={nottit} message={notmes} />
        </AuthenticatedLayout>
    )
}