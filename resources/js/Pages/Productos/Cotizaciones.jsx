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

import moment from "moment";

import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image as PDFImage } from '@react-pdf/renderer';

DataTable.use(DT);


export default function Cotizaciones({ cotizaciones,productos}) {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: 20, // Reducir el padding para aprovechar más espacio
            height: '100%', // Asegurar que ocupe toda la página
        },
        sectionheader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        sectionfooter: {
            flexDirection: 'row',
            fontSize: 9,
            marginTop: 'auto', // Mover el pie de página al final
            justifyContent: 'space-between',
        },
        section: {
            flexDirection: 'row',
            marginBottom: 3,
        },
        section2: {
            flexDirection: 'row',
            alignSelf: 'center',
        },
        sectionproduct: {
            flexDirection: 'column',
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
            width: 50,
        },
        logo2: {
            width: 50,
            alignItems: 'center',
        },
        image: {
            height: 300,
            marginBottom: 10,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        subtitle: {
            fontSize: 12,
        },
        text: {
            fontSize: 10,
        },
        buttom: {
            fontSize: 18,
            cursor: 'pointer',
        }
    });

    const [modalShow, setModalShow] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [cotizacion, setCotizacion] = useState([]);
    const [title, setTitle] = useState(null);
    const [nottit,setNottit]=useState("");
    const [notmes,setNotmes]=useState("");
    const table = useRef();
    const precio = useRef();
    const [idcot, setIdcot] = useState("");
    const [det, setDet] = useState([]);
    const [showDetModal, setShowDetModal] = useState(false);

    function Createedit({cot}) {

        const [values, setValues] = useState({
            idcotizacion: '',
            nombre_cliente: '',
            rfc: '',
            telefono: '',
            correo: '',
            direccion: '',
        });
        useEffect(() => {
            if (cot) {
                setValues({
                    idcotizacion: cot.idcotizacion,
                    nombre_cliente: cot.nombre_cliente,
                    rfc: cot.rfc,
                    telefono: cot.telefono,
                    correo_cliente: cot.correo_cliente,
                    direccion: cot.direccion,
                });
            }
        }, [cot]);

        function handleChange(e) {
            const { name, value } = e.target;
            setValues({ ...values, [name]: value });
        }

        function handleSubmit(e) {
            e.preventDefault()
            const form = e.target;
            const formData = new FormData(form);
            axios.post(`/cotizaciones`,formData).then((response) => {
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
                <Form.Control type="hidden" id="idcotizacion" name="idcotizacion" value={values.idcotizacion} />
                <Row>
                    <Col md={12}>
                        <Form.Label htmlFor="nombre_cliente">Nombre:</Form.Label>
                        <Form.Control type="text" id="nombre_cliente" name="nombre_cliente" value={values.nombre_cliente} onChange={handleChange} />
                        <Form.Label htmlFor="rfc">RFC:</Form.Label>
                        <Form.Control type="text" id="rfc" name="rfc" value={values.rfc} onChange={handleChange} />
                        <Form.Label htmlFor="telefono">Telefono:</Form.Label>
                        <Form.Control type="text" id="telefono" name="telefono" value={values.telefono} onChange={handleChange} />
                        <Form.Label htmlFor="correo_cliente">Correo:</Form.Label>
                        <Form.Control type="text" id="correo_cliente"  name="correo_cliente" value={values.correo_cliente} onChange={handleChange} />
                        <Form.Label htmlFor="direccion">Direccion:</Form.Label>
                        <Form.Control type="text" id="direccion" name="direccion" value={values.direccion} onChange={handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col  md={12} className="pt-3 ">
                        <div className="d-flex gap-2 mb-2 text-end">
                            <Button type="submit" variant="primary">Agregar</Button>   
                            <Button variant="secondary" onClick={() => closeCotizacion()}>Cerrar</Button>
                        </div> 
                    </Col>
                </Row>
            </Form>
            );
    }

    // function CotDet({idcot,det,productos}){
    //     const [values, setValues] = useState([]);
    //     function handleSubmitdet(e) {
    //         e.preventDefault()
    //         const form = e.target;
    //         const formData = new FormData(form);
    //         axios.post(`/cotizaciones`,formData).then((response) => {
    //             setModalShow(false);
    //             setShowToast(true)
    //             setNottit("Processo realizado");
    //             setNotmes(response.data.message);
    //             window.location.reload(false);
    //             }).catch(error => {
    //             console.log(error);
    //             });                
    //     }
    //     function handleSelectChange(name, selectedOption) {
    //         setValues({ ...values, [name]: selectedOption ? selectedOption.value : 0 });
    //     }
    //     function handleChangedet(e) {
    //         const { name, value } = e.target;
    //         setValues({ ...values, [name]: value });
    //     }
    //     return (      
    //         <Form onSubmit={handleSubmitdet} encType="multipart/form-data">
    //             <Form.Control type="hidden" id="idcotizacion" name="idcotizacion" value={idcot} />
    //             <Row>
    //                 <Col md={12}>
    //                     <Form.Label htmlFor="producto">Producto:</Form.Label>
    //                     <Select id="producto" name="producto" 
    //                         isClearable={true}
    //                         isSearchable={true}
    //                         value={productos.find(option => option.value === productos.idproducti)}
    //                         options={productos.producto}
    //                         onChange={(selectedOption) => handleSelectChange('idproducto', selectedOption)}
    //                         placeholder="Seleccionar categoria"/>
    //                     <Form.Label htmlFor="cantidad">Cantidad:</Form.Label>
    //                     <Form.Control type="text" id="cantidad" name="cantidad"  onChange={handleChangedet} />
    //                 </Col>
    //             </Row>
    //             <Row>
    //                 <Col  md={12} className="pt-3 ">
    //                     <div className="d-flex gap-2 mb-2 text-end">
    //                         <Button type="submit" variant="primary">Agregar</Button>   
    //                         <Button variant="secondary" onClick={() => closeCotizacion()}>Cerrar</Button>
    //                     </div> 
    //                 </Col>
    //             </Row>
    //         </Form>
    //     );
    // }

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
    
    function addCotizacion() {
        setCotizacion(null);
        setTitle("Agregar Cotizacion");
        setModalShow(true);     
    }

    function closeCotizacion() {
        setCotizacion(null);
        setTitle("");
        setModalShow(false);     
    }
            
    function getCotizacion(id) {
        axios.get(`/cotizaciones/${id}/edit`).then((response) => {
            setCotizacion(response.data);
            setTitle("Editar Cotizacion");
            setModalShow(true);
        }).catch(error => {
            console.log(error);
        });                
    }

    function detCotizacion(id) {
        axios.get(`/cotizaciones/${id}/det`).then((response) => {
            setDet(response.data);
            setIdcot(id);
            setShowDetModal(true);
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
                <Toast.Body className="bg-success text-white"  >
                    <CloseButton variant="white" aria-label="Hide" onClick={() => setShowToast(false)}/>
                    {props.message} 
                </Toast.Body>
            </Toast>
            </ToastContainer>
            );
    }

    function deleteCotizacion( id ) {
        axios.delete(`/cotizaciones/${id}`).then((response) => {
            alert(response.data.message);
        });
        router.get('/cotizaciones');
    }

    function CotDetModal({ idcot, det, productos, onClose }) {
        const [values, setValues] = useState({
            idcotizacion: idcot,
            idproducto: null,
            cantidad: '',
            precio: '',
            descuento: '',
        });   

        const handleChange = (e) => {
            const { name, value } = e.target;
            setValues({ ...values, [name]: value });
        };        
        const handleSelectChange = (selectedOption) => {
            setValues({
                ...values,
                idproducto: selectedOption ? selectedOption.value : null,
                precio: selectedOption ? selectedOption.precio : '', // Coloca el precio automáticamente
            });
        };

        function delCotde(id,idcot) {
            axios.delete(`/cotizaciones/det/${id}/${idcot}`).then((response) => {
                setNottit("Processo realizado");
                setNotmes(response.data.message);
                setDet(response.data.detalle);
                setValues({
                    ...values,
                    idproducto: null,
                    cantidad: '',
                    precio: '',
                    descuento: '',
                });
                });
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            axios.post(`/cotizaciones/detalle`, values).then((response) => {
                setNottit("Processo realizado");
                setNotmes(response.data.message);
                console.log(response.data.detalle);
                setDet(response.data.detalle);
                setValues({
                    ...values,
                    idproducto: null,
                    cantidad: '',
                    precio: '',
                    descuento: '',
                });
            }).catch((error) => {
                console.error(error);
            });
        };        
        
        return (
            <Modal show={true} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de Cotización</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Control type="hidden" name="idcotizacion" value={idcot} />
                        <Row>
                            <Col md={12}>
                                <Form.Label htmlFor="idproducto">Producto:</Form.Label>
                                <Select
                                    id="idproducto"
                                    name="idproducto"
                                    isClearable={true}
                                    isSearchable={true}
                                    options={productos.map((p) => ({ value: p.value, label: p.label, precio: p.precio }))}
                                    onChange={handleSelectChange}
                                    placeholder="Seleccionar producto"
                                />
                            </Col>                                                                
                        </Row>
                        <Row className="mt-3">
                            <Col md={4}>
                                <Form.Label htmlFor="precio">Precio:</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="precio"
                                    name="precio"
                                    value={values.precio}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label htmlFor="cantidad">Cantidad:</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="cantidad"
                                    name="cantidad"
                                    ref={precio}
                                    value={values.cantidad}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label htmlFor="descuento">Descuento:</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="descuento"
                                    name="descuento"
                                    value={values.descuento}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col className="text-end">
                                <Button type="submit" variant="primary">Agregar</Button>
                                <Button variant="secondary" className="ms-2" onClick={onClose}>Cerrar</Button>
                            </Col>
                        </Row>
                    </Form>
                    <hr />
                    <h5>Productos en la Cotización</h5>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Descuento</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {det.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.producto}</td>
                                    <td>{item.cantidad}</td>
                                    <td>{item.precio}</td>
                                    <td>{item.descuento}</td>
                                    <td>{(item.cantidad * item.precio - item.descuento).toFixed(2)}</td>
                                    <td><FontAwesomeIcon  style={styles.buttom} icon="fa-solid fa-trash" onClick={() => delCotde(item.idcotdet,item.idcotizacion)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        );
    }

    function CotizacionPDF({ cotizacion, detalles }) {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.sectionheader}>
                        <View style={{ flex: 1, textAlign: 'left' }}>
                            <PDFImage
                                style={styles.logo}
                                src={`${window.location.origin}/logo.jpg`} // Ruta completa del logo
                            />
                        </View>
                        <View style={{ flex: 3, textAlign: 'right' }}>
                            <Text style={styles.title}>Soluciones Tecnológicas y Software</Text>
                            <Text style={styles.subtitle}>Seguridad, Computo y Desarrollo de software</Text>
                        </View>
                    </View>
                    <View style={{alignItems:'center', marginTop: 20,}}>
                        <Text style={styles.subtitle}>COTIZACIÓN</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10,}}>
                        <View style={{ flex: 3, textAlign: 'left', borderWidth: 1, borderColor: '#000', padding: 3 }}>
                            <View style={styles.section}>
                                <Text style={{fontSize: 10, fontWeight: 'bold' }}>Cliente: </Text> <Text style={styles.text}>{cotizacion.nombre_cliente}</Text>
                            </View>
                            <View style={styles.section}>
                            <Text style={{fontSize: 10, fontWeight: 'bold' }}>RFC: </Text> <Text style={styles.text}>{cotizacion.rfc}</Text>
                            </View>
                            <View style={styles.section}>
                            <Text style={{fontSize: 10, fontWeight: 'bold' }}>Teléfono:</Text> <Text style={styles.text}> {cotizacion.telefono}</Text>
                            </View>
                            <View style={styles.section}>
                            <Text style={{fontSize: 10, fontWeight: 'bold' }}>Correo: </Text> <Text style={styles.text}>{cotizacion.correo_cliente}</Text>
                            </View>
                            <View style={styles.section}>
                            <Text style={{fontSize: 10, fontWeight: 'bold' }}>Dirección: </Text> <Text style={styles.text}>{cotizacion.direccion}</Text>
                            </View>
                        </View>
                        <View style={{  textAlign: 'center',padding:5 }}></View>
                        <View style={{ flex: 1, textAlign: 'center' ,borderWidth: 1, borderColor: '#000', padding: 3  }}>
                            <View style={{ fontWeight: 'bold'}}>
                                <Text style={styles.text}>No. Cot.</Text>
                            </View>
                            <View >
                                <Text style={styles.text}>{cotizacion.idcotizacion}</Text>
                            </View>
                            <View style={{ fontWeight: 'bold'}}>
                                <Text style={styles.text}>Fecha</Text>
                            </View>
                            <View >
                                <Text style={styles.text}>{moment(cotizacion.created_at).format("DD/MM/YYYY") }</Text>
                            </View> 
                        </View>
                    </View>
                    <View style={{ marginTop: 10, borderWidth: 1, borderColor: '#000' }}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', padding: 3 }}>
                            <Text style={{ flex: 2, fontSize: 10, fontWeight: 'bold' }}>Producto</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Cantidad</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Precio</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Descuento</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Subtotal</Text>
                        </View>
                        {detalles.map((detalle, index) => (
                            <View key={index} style={{ flexDirection: 'row', padding: 3 }}>
                                <Text style={{ flex: 2, fontSize: 10 }}>{detalle.producto}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'center' }}>{detalle.cantidad}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>{detalle.precio.toFixed(2)}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>{detalle.descuento.toFixed(2)}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>
                                    {(detalle.cantidad * detalle.precio - detalle.descuento).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={{marginTop: 10,  padding: 3 }}>
                        <View style={{ flexDirection: 'row',}}>
                            <Text style={{ flex: 4, fontSize: 10, fontWeight: 'bold', alignItems: 'flex-end',  textAlign: 'right'}}>SubTotal</Text>
                            <Text style={{ flex: 1, fontSize: 12, fontWeight: 'bold', alignItems: 'flex-end',  textAlign: 'right'}}>$ {(detalles.reduce((acc, detalle) => acc + (detalle.cantidad * detalle.precio - detalle.descuento), 0)).toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row',}}>
                            <Text style={{ flex: 4, fontSize: 10, fontWeight: 'bold', alignItems: 'flex-end',  textAlign: 'right'}}>IVA</Text>
                            <Text style={{ flex: 1, fontSize: 12, fontWeight: 'bold', alignItems: 'flex-end',  textAlign: 'right'}}>$ 0.00</Text>
                        </View>
                        <View style={{ flexDirection: 'row',}}>
                            <Text style={{ flex: 4, fontSize: 10, fontWeight: 'bold', alignItems: 'flex-end',  textAlign: 'right'}}>Total</Text>
                            <Text style={{ flex: 1, fontSize: 12, fontWeight: 'bold', alignItems: 'flex-end',  textAlign: 'right'}}>$ {(detalles.reduce((acc, detalle) => acc + (detalle.cantidad * detalle.precio - detalle.descuento), 0)).toFixed(2)}</Text>
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
                            <View style={styles.section}>
                                <Text>Tel: 9602071882</Text>
                                </View>    
                        </View>
                        <View style={{ flex: 1, textAlign: 'center' }}>
                            <View style={styles.section2}>
                                <PDFImage
                                    style={styles.logo2}
                                    src={`${window.location.origin}/Tarjetas-2.jpg`} // Ruta completa del logo
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end',  textAlign: 'right' }}>
                            <View style={styles.section}><Text style={{ textAlign: 'right'  }}>Precio de cotizacion valida por 2 dias.</Text></View>
                            <View style={styles.section}><Text style={{ textAlign: 'right'  }}>Todo trabajo requiere el 50% de anticipo.</Text></View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Cotizaciones" />
            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Container>
                                <Row>
                                <Col md={12} >   
                                    <Button variant="primary" size="sm" onClick={() => addCotizacion()}>
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> Agregar
                                    </Button>
                                    <DataTable className="table table-bordered table-striped table-sm" id="cotizaciones" 
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
                                            <th className='text-center' style={{width: '10%',}}>ID</th>
                                                <th className='text-center'>Nombre</th>
                                                <th className='text-center' style={{width: '10%',}}>Fecha</th>
                                                <th className='text-center' style={{width: '5%',}}></th>
                                                <th className='text-center' style={{width: '5%',}}></th>v
                                                <th className='text-center' style={{width: '5%',}}></th>
                                                <th className='text-center' style={{width: '5%',}}></th>
                                            </tr>
                                        </thead>
                                        <tbody>      
                                            { cotizaciones.map( (item) => (
                                                    <tr key={item.idcotizacion}>
                                                        <td className='text-center' style={{width: '10%',}}>{item.idcotizacion}</td>
                                                        <td className='text-start'>{item.nombre_cliente}</td>
                                                        <td className='text-center' style={{width: '10%',}}>{ moment(item.created_at).format("DD/MM/YYYY") }</td>
                                                        <td className='text-center' style={{width: '5%',}}><FontAwesomeIcon  style={styles.buttom} icon="fa-solid fa-pen-to-square" onClick={() => getCotizacion(item.idcotizacion)}/></td>
                                                        <td className='text-center' style={{width: '5%',}}><FontAwesomeIcon  style={styles.buttom} icon="fa-solid fa-trash" onClick={() => deleteCotizacion(item.idcotizacion)}/></td>
                                                        <td className='text-center' style={{width: '5%',}}><FontAwesomeIcon icon="fa-solid fa-cart-plus" style={styles.buttom} onClick={() => detCotizacion(item.idcotizacion)}/></td>
                                                        <td className='text-center' style={{width: '5%',}}>
                                                            <PDFDownloadLink
                                                                document={<CotizacionPDF cotizacion={item} detalles={det.filter(d => d.idcotizacion === item.idcotizacion)} />}
                                                                fileName={`Cotizacion_${item.idcotizacion}.pdf`}
                                                                style={styles.buttom}
                                                            >
                                                                <FontAwesomeIcon icon="fa-solid fa-print" />
                                                            </PDFDownloadLink>
                                                        </td>
                                                    </tr>
                                            )) }
                                        </tbody>
                                    </DataTable>
                                    {/* </Card.Body>
                                    </Card> */}
                                    </Col>
                                </Row>
                            </Container>
                            </div>
                    </div>
                </div>
            </div>
            <Modaladd show={modalShow} title={title} onHide={() => setModalShow(false)} >
                <Createedit cot={cotizacion}/>
            </Modaladd>
            {showDetModal && (
                <CotDetModal
                    idcot={idcot}
                    det={det}
                    productos={productos}
                    onClose={() => setShowDetModal(false)}
                />
            )}
            <Notify title={nottit} message={notmes} />
        </AuthenticatedLayout>
    )
}