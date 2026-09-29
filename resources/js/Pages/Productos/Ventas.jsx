import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import CloseButton from 'react-bootstrap/CloseButton';

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-responsive-bs5';

import moment from "moment";
import { BlobProvider, Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image as PDFImage } from '@react-pdf/renderer';

DataTable.use(DT);

export default function Ventas({ productos }) {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: 20,
            height: '100%',
        },
        sectionheader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        sectionfooter: {
            flexDirection: 'row',
            fontSize: 8,
            marginTop: 'auto',
            justifyContent: 'space-between',
        },
        section: {
            flexDirection: 'row',
            marginBottom: 3,
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
    const [venta, setVenta] = useState([]);
    const [title, setTitle] = useState(null);
    const [nottit, setNottit] = useState("");
    const [notmes, setNotmes] = useState("");
    const table = useRef();
    const precio = useRef();
    const [idventa, setIdventa] = useState("");
    const [det, setDet] = useState([]);
    const [showDetModal, setShowDetModal] = useState(false);
    const [ventaData, setVentaData] = useState(null);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [showIVAModal, setShowIVAModal] = useState(false);
    const [includeIVA, setIncludeIVA] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);
    
    function Createedit({ venta }) {
        const [values, setValues] = useState({
            idventa: '',
            nombre_cliente: '',
            rfc: '',
            telefono: '',
            correo_cliente: '',
            direccion: '',
        });

        useEffect(() => {
            if (venta) {
                setValues({
                    idventa: venta.idventa,
                    nombre_cliente: venta.nombre_cliente,
                    rfc: venta.rfc,
                    telefono: venta.telefono,
                    correo_cliente: venta.correo_cliente,
                    direccion: venta.direccion,
                });
            }
        }, [venta]);

        function handleChange(e) {
            const { name, value } = e.target;
            setValues({ ...values, [name]: value });
        }

        function handleSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            axios.post(`/ventas`, formData).then((response) => {
                setModalShow(false);
                setShowToast(true);
                setNottit("Proceso realizado");
                setNotmes(response.data.message);
                setReloadKey(reloadKey + 1);
            }).catch(error => {
                console.log(error);
            });
        }

        return (
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Control type="hidden" id="idventa" name="idventa" value={values.idventa} />
                <Row>
                    <Col md={12}>
                        <Form.Label htmlFor="nombre_cliente">Nombre:</Form.Label>
                        <Form.Control type="text" id="nombre_cliente" name="nombre_cliente" value={values.nombre_cliente} onChange={handleChange} />
                        <Form.Label htmlFor="rfc">RFC:</Form.Label>
                        <Form.Control type="text" id="rfc" name="rfc" value={values.rfc} onChange={handleChange} />
                        <Form.Label htmlFor="telefono">Teléfono:</Form.Label>
                        <Form.Control type="text" id="telefono" name="telefono" value={values.telefono} onChange={handleChange} />
                        <Form.Label htmlFor="correo_cliente">Correo:</Form.Label>
                        <Form.Control type="email" id="correo_cliente" name="correo_cliente" value={values.correo_cliente} onChange={handleChange} />
                        <Form.Label htmlFor="direccion">Dirección:</Form.Label>
                        <Form.Control type="text" id="direccion" name="direccion" value={values.direccion} onChange={handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="pt-3">
                        <div className="d-flex gap-2 mb-2 text-end">
                            <Button type="submit" variant="primary">Agregar</Button>
                            <Button variant="secondary" onClick={() => closeVenta()}>Cerrar</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
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

    function addVenta() {
        setVenta(null);
        setTitle("Agregar Venta");
        setModalShow(true);
    }

    function closeVenta() {
        setVenta(null);
        setTitle("");
        setModalShow(false);
    }

    function getVenta(id) {
        axios.get(`/ventas/${id}/edit`).then((response) => {
            setVenta(response.data);
            setTitle("Editar Venta");
            setModalShow(true);
        }).catch(error => {
            console.log(error);
        });
    }

    function detVenta(id) {
        axios.get(`/ventas/${id}/det`).then((response) => {
            setDet(response.data);
            setIdventa(id);
            setShowDetModal(true);
        }).catch(error => {
            console.log(error);
        });
    }

    function printVenta(id) {
        setShowIVAModal(true);
        setIdventa(id);
    }

    function proceedWithPrint(withIVA) {
        axios.get(`/ventas/${idventa}/edit`).then((response) => {
            const ventaInfo = response.data;
            axios.get(`/ventas/${idventa}/det`).then((detailResponse) => {
                const detalles = detailResponse.data;
                setVentaData({
                    venta: ventaInfo,
                    detalles: detalles
                });
                setIncludeIVA(withIVA);
                setShowPDFModal(true);
                setShowIVAModal(false);
            }).catch(error => {
                console.log('Error al obtener detalles:', error);
            });
        }).catch(error => {
            console.log('Error al obtener venta:', error);
        });
    }

    const markVentaAsPaid = (ventaId) => {
        axios.post(`/ventas/${ventaId}/pagada`).then((response) => {
            setNottit('Proceso realizado');
            setNotmes(response.data.message);
            setShowToast(true);
            setReloadKey(reloadKey + 1);
        }).catch((error) => {
            console.error('Error marcando venta como pagada:', error);
            setNottit('Error');
            setNotmes('No se pudo actualizar el estado a pagada');
            setShowToast(true);
        });
    };

    function deleteVenta(id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
            axios.delete(`/ventas/${id}`).then((response) => {
                setNottit("Proceso realizado");
                setNotmes(response.data.message);
                setShowToast(true);
                setReloadKey(reloadKey + 1);
            }).catch(error => {
                console.log(error);
            });
        }
    }

    function Notify(props) {
        return (
            <ToastContainer
                className="p-3"
                position="top-end"
                style={{ zIndex: 1 }}
            >
                <Toast {...props} closeButton={true} className="d-inline-block m-1" bg="Success" onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body className="bg-success text-white">
                        <CloseButton variant="white" aria-label="Hide" onClick={() => setShowToast(false)} />
                        {props.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        );
    }

    function IVAModal() {
        return (
            <Modal show={showIVAModal} onHide={() => setShowIVAModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Opción de IVA</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Deseas incluir el IVA en el ticket de impresión?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => proceedWithPrint(true)}>
                        <FontAwesomeIcon icon="fa-solid fa-check" /> Con IVA
                    </Button>
                    <Button variant="warning" onClick={() => proceedWithPrint(false)}>
                        <FontAwesomeIcon icon="fa-solid fa-times" /> Sin IVA
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function PDFModal({ ventaData, onClose }) {
        if (!ventaData) return null;

        return (
            <Modal show={showPDFModal} onHide={onClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Venta #{moment(ventaData.venta.created_at).format("MM") + ventaData.venta.idventa + moment(ventaData.venta.created_at).format("YY")}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '600px', overflow: 'auto' }}>
                    <BlobProvider
                        document={<VentaPDF venta={ventaData.venta} detalles={ventaData.detalles} includeIVA={includeIVA} />}
                        fileName={`Venta_${ventaData.venta.idventa}.pdf`}
                    >
                        {({ blob, url, loading, error }) => {
                            if (loading) {
                                return <div className="text-center"><FontAwesomeIcon icon="fa-solid fa-spinner" spin /> Generando PDF...</div>;
                            }
                            if (error) {
                                return <div className="alert alert-danger">Error al generar el PDF</div>;
                            }
                            return (
                                <iframe
                                    src={url}
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    title="PDF Preview"
                                />
                            );
                        }}
                    </BlobProvider>
                </Modal.Body>
                <Modal.Footer>
                    <PDFDownloadLink
                        document={<VentaPDF venta={ventaData.venta} detalles={ventaData.detalles} includeIVA={includeIVA} />}
                        fileName={`Venta_${ventaData.venta.idventa}.pdf`}
                    >
                        {({ blob, url, loading, error }) => (
                            <Button
                                variant="success"
                                disabled={loading}
                                onClick={() => markVentaAsPaid(ventaData.venta.idventa)}
                            >
                                <FontAwesomeIcon icon="fa-solid fa-download" /> {loading ? 'Preparando...' : 'Descargar PDF'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                    <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function VentDetModal({ idventa, det, productos, onClose }) {
        const [values, setValues] = useState({
            idventa: idventa,
            idproducto: null,
            cantidad: '',
            precio: '',
            descuento: 0,
        });
        const [numeroCotizacion, setNumeroCotizacion] = useState('');
        const [importLoading, setImportLoading] = useState(false);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setValues({ ...values, [name]: value });
        };

        const handleSelectChange = (selectedOption) => {
            setValues({
                ...values,
                idproducto: selectedOption ? selectedOption.value : null,
                precio: selectedOption ? selectedOption.precio : '',
            });
        };

        function delVentdet(id, idventa) {
            axios.delete(`/ventas/det/${id}/${idventa}`).then((response) => {
                setNottit("Proceso realizado");
                setNotmes(response.data.message);
                setDet(response.data.detalle);
                setValues({
                    ...values,
                    idproducto: null,
                    cantidad: '',
                    precio: '',
                    descuento: 0,
                });
            });
        }

        const handleSubmit = (e) => {
            e.preventDefault();
            axios.post(`/ventas/detalle`, values).then((response) => {
                setNottit("Proceso realizado");
                setNotmes(response.data.message);
                setDet(response.data.detalle);
                setValues({
                    ...values,
                    idproducto: null,
                    cantidad: '',
                    precio: '',
                    descuento: 0,
                });
            }).catch((error) => {
                console.error(error);
            });
        };

        const importCotizacion = (e) => {
            e.preventDefault();
            if (!numeroCotizacion) {
                setNottit("Error");
                setNotmes("Ingresa un número de cotización válido");
                setShowToast(true);
                return;
            }
            setImportLoading(true);
            axios.get(`/cotizaciones/${numeroCotizacion}/det`).then((response) => {
                const cotdet = response.data;
                if (!Array.isArray(cotdet) || cotdet.length === 0) {
                    setNottit("Info");
                    setNotmes("No se encontraron productos en la cotización");
                    setShowToast(true);
                    setImportLoading(false);
                    return;
                }

                const promises = cotdet.map(item => {
                    return axios.post('/ventas/detalle', {
                        idventa: idventa,
                        idproducto: item.idproducto,
                        cantidad: item.cantidad,
                        precio: item.precio,
                        descuento: item.descuento || 0,
                    });
                });

                Promise.all(promises).then(() => {
                    axios.get(`/ventas/${idventa}/det`).then((detResponse) => {
                        setDet(detResponse.data);
                        setNottit("Proceso realizado");
                        setNotmes(`Productos importados de cotización #${numeroCotizacion}`);
                        setShowToast(true);
                        setNumeroCotizacion('');
                    });
                }).catch((error) => {
                    console.error(error);
                    setNottit("Error");
                    setNotmes("Error al importar los detalles");
                    setShowToast(true);
                }).finally(() => {
                    setImportLoading(false);
                });
            }).catch((error) => {
                setImportLoading(false);
                console.error(error);
                setNottit("Error");
                setNotmes("No se pudo cargar cotización");
                setShowToast(true);
            });
        };

        return (
            <Modal show={true} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de Venta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3">
                        <Col md={8}>
                            <Form.Group controlId="numeroCotizacion">
                                <Form.Label>Número de Cotización</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese número de cotización"
                                    value={numeroCotizacion}
                                    onChange={(e) => setNumeroCotizacion(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex align-items-end">
                            <Button
                                type="button"
                                variant="success"
                                onClick={importCotizacion}
                                disabled={importLoading}
                            >
                                {importLoading ? 'Importando...' : 'Importar Cotización'}
                            </Button>
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <Form.Control type="hidden" name="idventa" value={idventa} />
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
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    step="0.01"
                                    value={values.precio}
                                    onChange={handleChange}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label htmlFor="cantidad">Cantidad:</Form.Label>
                                <Form.Control
                                    type="number"
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
                                    type="number"
                                    id="descuento"
                                    name="descuento"
                                    step="0.01"
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
                    <h5>Productos en la Venta</h5>
                    <table className="table table-bordered table-sm">
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
                                    <td>${parseFloat(item.precio).toFixed(2)}</td>
                                    <td>${parseFloat(item.descuento).toFixed(2)}</td>
                                    <td>${(item.cantidad * item.precio - item.descuento).toFixed(2)}</td>
                                    <td><FontAwesomeIcon style={styles.buttom} icon="fa-solid fa-trash" onClick={() => delVentdet(item.idventadet, item.idventa)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        );
    }

    function VentaPDF({ venta, detalles, includeIVA = true }) {
        const subtotal = detalles.reduce((acc, detalle) => acc + (detalle.cantidad * detalle.precio - detalle.descuento), 0);
        const iva = subtotal * 0.16;
        const total = includeIVA ? subtotal + iva : subtotal;

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.sectionheader}>
                        <View style={{ flex: 3, textAlign: 'left' }}>
                            <Text style={styles.title}>Soluciones Tecnológicas y Software</Text>
                            <Text style={styles.subtitle}>Seguridad, Computo y Desarrollo de software</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={styles.subtitle}>VENTA</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 3, textAlign: 'left', borderWidth: 1, borderColor: '#000', padding: 3 }}>
                            <View style={styles.section}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Cliente: </Text> <Text style={styles.text}>{venta.nombre_cliente}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>RFC: </Text> <Text style={styles.text}>{venta.rfc}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Teléfono:</Text> <Text style={styles.text}> {venta.telefono}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Correo: </Text> <Text style={styles.text}>{venta.correo_cliente}</Text>
                            </View>
                            <View style={styles.section}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Dirección: </Text> <Text style={styles.text}>{venta.direccion}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, textAlign: 'center', borderWidth: 1, borderColor: '#000', padding: 3 }}>
                            <View style={{ fontWeight: 'bold' }}>
                                <Text style={styles.text}>No. Venta</Text>
                            </View>
                            <View>
                                <Text style={styles.text}>{moment(venta.created_at).format("MM") + venta.idventa + moment(venta.created_at).format("YY")}</Text>
                            </View>
                            <View style={{ fontWeight: 'bold' }}>
                                <Text style={styles.text}>Fecha</Text>
                            </View>
                            <View>
                                <Text style={styles.text}>{moment(venta.created_at).format("DD/MM/YYYY")}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, borderWidth: 1, borderColor: '#000' }}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', padding: 3 }}>
                            <Text style={{ flex: 3, fontSize: 10, fontWeight: 'bold' }}>Producto</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Cantidad</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Precio</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Descuento</Text>
                            <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>Subtotal</Text>
                        </View>
                        {detalles.map((detalle, index) => (
                            <View key={index} style={{ flexDirection: 'row', padding: 3 }}>
                                <Text style={{ flex: 3, fontSize: 10 }}>{detalle.producto}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'center' }}>{detalle.cantidad}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>${detalle.precio.toFixed(2)}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>${detalle.descuento.toFixed(2)}</Text>
                                <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>
                                    ${(detalle.cantidad * detalle.precio - detalle.descuento).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ marginTop: 10, padding: 3 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 4, fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>SubTotal</Text>
                            <Text style={{ flex: 1, fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>$ {subtotal.toFixed(2)}</Text>
                        </View>
                        {includeIVA && (
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 4, fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>IVA (16%)</Text>
                                <Text style={{ flex: 1, fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>$ {iva.toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ flex: 4, fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>Total</Text>
                            <Text style={{ flex: 1, fontSize: 12, fontWeight: 'bold', textAlign: 'right' }}>$ {total.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={styles.sectionfooter}>
                        <View style={{ flex: 2, textAlign: 'left' }}>
                            <View style={styles.section}>
                                <Text>Email: info@soltecysoft.com</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>Web: www.soltecysoft.com</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2, alignItems: 'flex-end', textAlign: 'right' }}>
                            <View style={styles.section}><Text>Gracias por su compra</Text></View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Ventas" />
            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Container>
                                <Row>
                                    <Col md={12}>
                                        <Button variant="primary" size="sm" onClick={() => addVenta()}>
                                            <FontAwesomeIcon icon="fa-solid fa-plus" /> Agregar Venta
                                        </Button>
                                        <DataTable className="table table-bordered table-striped table-sm" id="ventas"
                                            key={reloadKey}
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
                                                serverSide: true,
                                                processing: true,
                                                ajax: '/ventas/allventas',
                                                columns: [
                                                    { data: 'idventa' },
                                                    { data: 'numero_venta' },
                                                    { data: 'nombre_cliente' },
                                                    { data: 'total' },
                                                    { data: 'estado' },
                                                    { data: 'created_at' },
                                                    { data: 'acciones', orderable: false, searchable: false }
                                                ],
                                                columnDefs: [
                                                    {
                                                        targets: 6,
                                                        render: function(data, type, row) {
                                                            return `<div class="btn-group btn-group-sm" role="group">
                                                                <button type="button" class="btn btn-info btn-sm edit-btn" data-id="${row.idventa}" title="Editar"><i class="fa fa-edit"></i></button>
                                                                <button type="button" class="btn btn-secondary btn-sm detail-btn" data-id="${row.idventa}" title="Detalles"><i class="fa fa-list"></i></button>
                                                                <button type="button" class="btn btn-primary btn-sm print-btn" data-id="${row.idventa}" title="Imprimir"><i class="fa fa-print"></i></button>
                                                                <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${row.idventa}" title="Eliminar"><i class="fa fa-trash"></i></button>
                                                            </div>`;
                                                        }
                                                    }
                                                ],
                                                drawCallback: function() {
                                                    document.querySelectorAll('.edit-btn').forEach(btn => {
                                                        btn.onclick = function() {
                                                            getVenta(this.dataset.id);
                                                        };
                                                    });
                                                    document.querySelectorAll('.detail-btn').forEach(btn => {
                                                        btn.onclick = function() {
                                                            detVenta(this.dataset.id);
                                                        };
                                                    });
                                                    document.querySelectorAll('.print-btn').forEach(btn => {
                                                        btn.onclick = function() {
                                                            printVenta(this.dataset.id);
                                                        };
                                                    });
                                                    document.querySelectorAll('.delete-btn').forEach(btn => {
                                                        btn.onclick = function() {
                                                            deleteVenta(this.dataset.id);
                                                        };
                                                    });
                                                },
                                                footerCallback: function(row, data, start, end, display) {
                                                    let api = this.api();
                                                    let total = 0;
                                                    
                                                    api.column(3).data().each(function(value) {
                                                        let numValue = parseFloat(value.replace(/\$|,/g, ''));
                                                        if (!isNaN(numValue)) {
                                                            total += numValue;
                                                        }
                                                    });
                                                    
                                                    let totalCell = api.column(3).footer();
                                                    if (totalCell) {
                                                        totalCell.innerHTML = '<strong>Total: $' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '</strong>';
                                                    }
                                                }
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th className='text-center' style={{ width: '10%' }}>ID</th>
                                                    <th className='text-center'>Número</th>
                                                    <th className='text-center'>Cliente</th>
                                                    <th className='text-center' style={{ width: '10%' }}>Total</th>
                                                    <th className='text-center' style={{ width: '10%' }}>Estado</th>
                                                    <th className='text-center' style={{ width: '8%' }}>Fecha</th>
                                                    <th className='text-center' style={{ width: '20%' }}>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="3" className='text-end' style={{ paddingRight: '15px' }}>Total de Ventas:</th>
                                                    <th className='text-center'>$0.00</th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                        </DataTable>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
            <Modaladd show={modalShow} title={title} onHide={() => setModalShow(false)}>
                <Createedit venta={venta} />
            </Modaladd>
            {showDetModal && (
                <VentDetModal
                    idventa={idventa}
                    det={det}
                    productos={productos}
                    onClose={() => setShowDetModal(false)}
                />
            )}
            {showPDFModal && ventaData && (
                <PDFModal
                    ventaData={ventaData}
                    onClose={() => setShowPDFModal(false)}
                />
            )}
            <IVAModal />
            <Notify title={nottit} message={notmes} />
        </AuthenticatedLayout>
    )
}