import  React,{ useState, useEffect} from 'react';
import { router } from '@inertiajs/react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select'


export default function Create({products,selects}) {
    
    
    const [values, setValues] = useState([]);
    const [combos, setCombos] = useState([]);
    function handleChange(e) {

    }
   
   // useEffect(()=>{
        
        if (products===null) {
            setValues({
                idproducto: 0,
                producto: undefined,
                descripcion: undefined,
                precio: undefined,
                stock: undefined,
                idcategoria: 0,
                idmarca: 0,
                idproveedor: 0
            });
            
        }
        else 
        {  
            setValues({
            idproducto: products.idproducto,
            producto: products.producto,
            descripcion: products.descripcion,
            precio: products.precio,
            stock: products.stock,
            idcategoria: products.idcategoria,
            idmarca: products.idmarca,
            idproveedor: products.idproveedor
            });

        }
        
    //}, [products]);

    const handleChange2 = (input, e) => {
        e.preventDefault()
        console.log({ [input]: e.target.value });
    };

    function handleSubmit(e) {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        router.post('/productos', formData)
        
    }
    return (
        
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Control type="hidden" id="idproducto" name="idproducto" value={values.idproducto} />
                <Form.Label htmlFor="idproveedor">Proveedor:</Form.Label>
                <Select id="idproveedor" name="idproveedor" 
                isClearable={true}
                isSearchable={true}
                 //value={selects.combos.proveedor.filter(option => option.value == values.idproveedor)}
                 options={selects.combos.proveedor}
                 //onChange={(e) => handleChange2('password', e)}
                placeholder="Seleccionar proveedor" />
                <Form.Label htmlFor="idcategoria">Categoria:</Form.Label>
                <Select id="idcategoria" name="idcategoria" 
                isClearable={true}
                isSearchable={true}
                //value={selects.combos.categoria.filter(option => option.value == values.idcategoria)} 
                options={selects.combos.categoria}
                //onChange={(e) => handleChange2('password', e)}
                placeholder="Seleccionar categoria"/>
                <Form.Label htmlFor="idmarca">Marca:</Form.Label>
                <Select id="idmarca" name="idmarca"  
                isClearable={true}
                isSearchable={true}
                 //value={selects.combos.marca.filter(option => option.value == values.idmarca)}
                 //onChange={(e) => handleChange2('password', e)}
                 options={selects.combos.marca}
                placeholder="Seleccionar marca" />
                <Form.Label htmlFor="producto">Producto:</Form.Label>
                <Form.Control type="text" id="producto" name="producto" value={values.producto} />
                <Form.Label htmlFor="descripcion">Decripcion:</Form.Label>
                <Form.Control type="text" id="descripcion" name="descripcion" value={values.descripcion} />
                <Form.Label htmlFor="precio">Precio:</Form.Label>
                <Form.Control type="text" id="precio" name="precio" value={values.precio} />
                <Form.Label htmlFor="stock">Stock:</Form.Label>
                <Form.Control type="text" id="stock"  name="stock" value={values.stock} />
                <Form.Label htmlFor="imagen">Imagen:</Form.Label>
                <Form.Control type="file" id="imagen" name="imagen" />
                
                <br/>
                <Row>
                    <Col  md={12} className="text-end">
                        <Button type="submit" variant="primary">Agregar</Button>
                    </Col>
                </Row>
            </Form>
    )
}