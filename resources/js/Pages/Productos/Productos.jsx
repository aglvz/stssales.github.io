import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useRef, useMemo} from 'react';
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

import $ from 'jquery';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import 'datatables.net-responsive-bs5';

import moment from "moment";
import { BlobProvider,Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image as PDFImage } from '@react-pdf/renderer';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker?url';

// Configurar el worker de pdfjs
GlobalWorkerOptions.workerSrc = workerSrc;

//$.DataTable = require('datatables.net');
DataTable.use(DT);

export default function Productos({ productos,combos}) {
    const tableRef = useRef()
    const styles = StyleSheet.create({
            sectionheader: {
                position: 'absolute',
                top: 75,
                left: 95,
                right: 410,
                textAlign: 'center',
                color: '#ffffff',
                
            },
            sectionproduct: {
                position: 'absolute',
                top: 105,
                left: 60,
                right: 330,
                textAlign: 'left',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 28
            },
            image: {
                position: 'absolute',
                top: 120,
                right: 50,
                width: 230,
                zIndex: -2,
            },
            sectionprecio: {
                position: 'absolute',
                top: 302,
                left: 185,
                right: 375,
                textAlign: 'right',
                fontSize: 30,
                color: '#ffffff',
                fontWeight: 'bold',
            },
            sectionfooter: {
            position: 'absolute',
            top: 360,
            left: 60,
            right: 350,
            color: '#ffffff',
            fontSize: 14,
            textAlign: 'left',
            },
        });

    const [modalShow, setModalShow] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [producto, setProducto] = useState([]);
    const [title, setTitle] = useState(null);
    const [nottit,setNottit]=useState("");
    const [notmes,setNotmes]=useState("");
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const options = useMemo(() => ({
            serverSide: true, // Enable server-side processing
            processing: true, // Show a "processing" indicator
            destroy: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/2.1.7/i18n/es-MX.json',
            },
            ajax: {
                url: `/productos/allproductos?reload=${reloadKey}`,
                type: 'GET'                        
            },
            columns: [
                { data: 'clave' },
                { data: 'producto' },
                { data: 'precio', render: $.fn.dataTable.render.number( ',', '.', 2, '$' )
                },
                { data: 'stock' },
                { data: 'idproducto',
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: function(data, type, row, meta) {
                        return `<button class="btn btn-sm btn-primary edit-btn" data-id="${data}"><em class="fas fa-edit"></em></button>`;
                    }
                },
                { data: 'idproducto',
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: function(data, type, row, meta) {
                        return `<button class="btn btn-sm btn-secondary print-btn" data-id="${data}"><em class="fas fa-print"></em></button>`;
                    }
                },
                { data: 'idproducto',
                    orderable: false,
                    searchable: false,
                    className: 'text-center',
                    render: function(data, type, row, meta) {
                        return `<button class="btn btn-sm btn-danger delete-btn" data-id="${data}"><em class="fas fa-trash"></em></button>`;
                    }
                },
            ],
            drawCallback: function(settings) {
                const api = this.api();
                // Attach event listeners to edit buttons
                api.$('.edit-btn').on('click', function() {
                    const id = $(this).data('id');
                    getProducto(id);
                });
                // Attach event listeners to print buttons
                api.$('.print-btn').on('click', function() {
                    const id = $(this).data('id');
                    printProducto(id);
                });
                // Attach event listeners to delete buttons
                api.$('.delete-btn').on('click', function() {
                    const id = $(this).data('id');
                    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                        deleteProducto(id);
                    }
                });
            },
    }), [reloadKey]);
    

    function ProductoPDF({product}) {   
        return (
        <Document>
            <Page
                size={[705,591]}
            >
                {/* Imagen de fondo */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                }}>
                    <PDFImage
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        src={`${window.location.origin}/flyer.png`}
                    />
                </View>
                <View style={styles.sectionheader}>
                    <Text>{product.marca}</Text>
                </View>
                <View style={styles.sectionproduct}>
                    <Text>{product.producto}</Text>
                </View>
                {product.image && (
                            <PDFImage
                                style={styles.image}
                                src={`data:image/png;base64,${product.image}`}
                            />
                )}
                <View style={styles.sectionprecio}>
                    <Text>{product.precio.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</Text>
                </View>                
                <View style={styles.sectionfooter}>
                    <Text>{product.descripcion}</Text>
                </View>                
            </Page>
        </Document>
    )};

    function Createedit({products,selects}) {
        const [values, setValues] = useState({
            idproducto: '',
            clave: '',
            producto: '',
            descripcion: '',
            precio: '',
            stock: '',
            idcategoria: 0,
            idmarca: 0,
            idproveedor: 0,
        });
        const [precios, setprecios] = useState([]);
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
        function precioChange(e) {
            const { name, value } = e.target;
            setprecios({ ...precios, [name]: value });
            var ganancia,compra,precio;
            if (name === 'ganacia') {
                ganancia = parseFloat(value);
                compra = parseFloat(precios.compra);
                precio = (compra*1.16)* (ganancia);
                setValues({ ...values, ['precio']: precio.toFixed(2) });
            }
            if (name === 'compra') {
                compra = parseFloat(value);
                ganancia = parseFloat(precios.ganacia);
                precio = (compra*1.16)* (ganancia);
                setValues({ ...values, ['precio']: precio.toFixed(2) });
            }
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
                    setShowToast(true);
                    setNottit("Processo realizado");
                    setNotmes(response.data.message);
                    // Recargar el DataTable
                    setReloadKey(prev => prev + 1);
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
                                <Form.Label htmlFor="ganacia">Porcentaje de ganacia:</Form.Label>
                                <Form.Control type="text" id="ganacia" name="ganacia" onChange={precioChange} />
                                <Form.Label htmlFor="compra">Precio Compra:</Form.Label>
                                <Form.Control type="text" id="compra" name="compra"  onChange={precioChange} />
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

    function printProducto(id) {
        axios.get(`/productos/${id}/edit`).then((response) => {
                //const productoInfo = response.data;            
                setProducto(response.data);               
                setShowPDFModal(true);
            }).catch(error => {
            console.log('Error al obtener producto:', error);
        });
    }

    function PDFModal({ producto, onClose }) {
        if (!producto) return null;
        return (
            <Modal show={showPDFModal} onHide={onClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Producto #{moment(producto.created_at).format("MM") + producto.idproducto + moment(producto.created_at).format("YY")}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '600px', overflow: 'auto' }}>
                    <BlobProvider 
                        document={<ProductoPDF product={producto} />}
                        fileName={`Producto_${producto.idproducto}.pdf`}
                    >
                        {({ blob, url, loading, error }) => {
                            if (loading) {
                                return <div className="text-center"><FontAwesomeIcon icon="fa-solid fa-spinner" spin /> Generando PDF...</div>;
                            }
                            if (error) {
                                return <div className="alert alert-danger">Error al generar el PDF</div>;
                            }

                            async function exportPdfBlobToImage(blob, filename = `Producto_${producto.idproducto}.png`) {
                                try {
                                    const arrayBuffer = await blob.arrayBuffer();
                                    const loadingTask = getDocument({ data: arrayBuffer });
                                    const pdfDoc = await loadingTask.promise;
                                    const page = await pdfDoc.getPage(1);
                                    const viewport = page.getViewport({ scale: 2 });
                                    const canvas = document.createElement('canvas');
                                    const context = canvas.getContext('2d');
                                    canvas.width = Math.floor(viewport.width);
                                    canvas.height = Math.floor(viewport.height);
                                    await page.render({ canvasContext: context, viewport }).promise;
                                    return new Promise((resolve) => {
                                        canvas.toBlob((imgBlob) => {
                                            const urlImg = URL.createObjectURL(imgBlob);
                                            const a = document.createElement('a');
                                            a.href = urlImg;
                                            a.download = filename;
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                            URL.revokeObjectURL(urlImg);
                                            resolve();
                                        }, 'image/png', 0.95);
                                    });
                                } catch (err) {
                                    console.error('Error convirtiendo PDF a imagen', err);
                                    alert('Error al convertir PDF a imagen');
                                }
                            }

                            async function downloadPdfAsImageFromUrl(url) {
                                try {
                                    const res = await fetch(url);
                                    const blobFetched = await res.blob();
                                    await exportPdfBlobToImage(blobFetched);
                                } catch (err) {
                                    console.error(err);
                                    alert('No se pudo descargar el PDF para convertirlo');
                                }
                            }

                            return (
                                <div style={{ height: '100%' }}>
                                    <div className="d-flex justify-content-end mb-2">
                                        <Button variant="secondary" size="sm" onClick={() => downloadPdfAsImageFromUrl(url)}>
                                            <FontAwesomeIcon icon="fa-solid fa-image" /> Exportar como imagen
                                        </Button>
                                    </div>
                                    <iframe
                                        src={url}
                                        style={{ width: '100%', height: 'calc(100% - 40px)', border: 'none' }}
                                        title="PDF Preview"
                                    />
                                </div>
                            );
                        }}
                    </BlobProvider>
                </Modal.Body>
                <Modal.Footer>
                    <PDFDownloadLink
                        document={<ProductoPDF product={producto} />}
                        fileName={`Producto_${producto.idproducto}.pdf`}
                    >
                        {({ blob, url, loading, error }) => (
                            <Button 
                                variant="success" 
                                disabled={loading}
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

    function Notify(props) {
        return(
            <ToastContainer
            className="p-3"
            position="top-end"
            style={{ zIndex: 1 }}
            >
            <Toast {...props} closebutton="true"  className="d-inline-block m-1" bg="Success"  onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
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
               //alert(response.data.message);
               setShowToast(true);
               setNotmes(response.data.message);
               // Recargar el DataTable
               setReloadKey(prev => prev + 1);
              }).catch(error => {
               console.log(error);
              });
    }
    

    return (
        <AuthenticatedLayout>
            <Head title="Productos" />
            <div className="py-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Container>
                                <Row>
                                    <Col md={12} >   
                                    <Button variant="primary" size="sm" onClick={() => addProducto()}>
                                        <FontAwesomeIcon icon="fa-solid fa-plus" /> Agregar
                                    </Button>
                                    <DataTable key={reloadKey} ref={tableRef} className="table table-bordered table-striped table-sm" id="productos" options={options} >
                                        <thead>
                                            <tr>
                                                <th className='text-center' style={{width: '18%',}}>Clave</th>
                                                <th className='text-center'>Producto</th>
                                                <th className='text-center' style={{width: '10%',}}>Precio</th>
                                                <th className='text-center' style={{width: '8%',}}>Stock</th>
                                                <th className='text-center' style={{width: '5%',}}> </th>
                                                <th className='text-center' style={{width: '5%',}}></th>
                                                <th className='text-center' style={{width: '5%',}}></th>
                                            </tr>
                                        </thead>
                                    </DataTable>
                                    </Col>
                                </Row>
                            </Container>
                            </div>
                    </div>
                </div>
            </div>
            <Modaladd show={modalShow} title={title} onHide={() => setModalShow(false)} >
                <Createedit products={producto} selects={combos}/>
            </Modaladd>
            {showPDFModal && producto && (
                <PDFModal 
                    producto={producto}
                    onClose={() => setShowPDFModal(false)}
                />
            )}
            <Notify title={nottit} message={notmes} />
        </AuthenticatedLayout>
    )
}