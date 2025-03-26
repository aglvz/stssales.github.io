import React, { useState } from 'react';
// import { useRef } from "react"
import { router } from '@inertiajs/react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select'

function handleSubmit(e) {
    e.preventDefault()
    const form = e.target;
    const formData = new FormData(form);
    console.log(formData);
    router.post('/productos', formData)
    
}

class App extends React.Component {
    constructor(props) {
      super(props);
       this.state={
        categorias: props.selects.categoria,
        selectedCat: ""
       }
  
    }
 
    handleSelectCat = (option)=> {
       const selectedCat = option.value
       this.setState({selectedCat});
    }
 
    render() {
       const {selectedCat, categorias} = this.state;
    //    const [values, setValues] = useState({ // Form fields
    //         idproducto: products.idproducto,
    //         producto: products.producto,
    //         descripcion: products.descripcion,
    //         precio: products.precio,
    //         stock: products.stock,
    //         idcategoria: products.idcategoria,
    //         idmarca: products.idmarca,
    //         idproveedor: products.idproveedor
    //     });
       return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Control type="hidden" id="idproducto" name="idproducto" value={this.props.products.idproducto} />
            <Form.Label htmlFor="producto">Producto:</Form.Label>
            <Form.Control type="text" id="producto" name="producto" value={this.props.products.producto} />
            <Form.Label htmlFor="descripcion">Decripcion:</Form.Label>
            <Form.Control type="text" id="descripcion" name="descripcion" value={this.props.products.descripcion} />
            <Form.Label htmlFor="precio">Precio:</Form.Label>
            <Form.Control type="text" id="precio" name="precio" value={this.props.products.precio}/>
            <Form.Label htmlFor="stock">Stock:</Form.Label>
            <Form.Control type="text" id="stock"  name="stock" value={this.props.products.stock}/>
            <Form.Label htmlFor="imagen">Imagen:</Form.Label>
            <Form.Control type="file" id="imagen" name="imagen" />
            <Form.Label htmlFor="idcategoria">Categoria:</Form.Label>
            <Select id="idcategoria" name="idcategoria" 
            options={categorias} 
            onChange={this.handleSelectCat} 
            value={selectedCat} 
            placeholder="Seleccionar categoria"/>
            <Form.Label htmlFor="idmarca">Marca:</Form.Label>
            <Select id="idmarca" name="idmarca"  options={this.props.selects.marca} placeholder="Seleccionar marca" />
            <Form.Label htmlFor="idproveedor">Proveedor:</Form.Label>
            <Select id="idproveedor" name="idproveedor"  options={this.props.selects.proveedor}  placeholder="Seleccionar proveedor" />
            <br/>
            <Row>
                <Col  md={12} className="text-end">
                    <Button type="submit" variant="primary">Agregar</Button>
                </Col>
            </Row>
        </Form>
        )
    }
}



export default App;