import { conmysql } from '../db.js';

export const getProductos = 
    async (req,res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos')
        res.json(result)   
     } catch (error) {
       return res.status(500).json({message: "Error al consultar productos"})
     }
    }
    export const getProductosxid = 
    async(req, res) => {
      try {
        const [result] = await conmysql.query('select * from productos where prod_id=?',[req.params.id])
        if(result.length<=0)return res.status(404).json({
          prod_id:0,
          message:"Producto no encontrado"
        })
        res.json(result[0])
      } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
      }
    }
    export const postProductos = async (req, res) => {
      try {
          const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
          const prod_imagen = req.file ? `uploads/${req.file.filename}` : null;
  
          console.log("Datos del producto:", req.body);
          console.log("Archivo de imagen:", req.file);
  
          const [rows] = await conmysql.query(
              'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)', 
              [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
          );
  
          res.send({ id: rows.insertId });
      } catch (error) {
          console.log(error); // Agregar para depurar
          return res.status(500).json({ message: 'Error del lado del servidor', error });
      }
  };
  export const putProductos = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("ID recibido: ", id);
  
      // Acceder a los datos del cuerpo y archivo
      const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
      const prod_imagen = req.file ? `uploads/${req.file.filename}` : req.body.prod_imagen || null;  // Asegúrate de que prod_imagen no sea null si no hay archivo
  
      console.log("Datos recibidos en el cuerpo:", req.body);  // Verifica los datos que se envían
      console.log("Imagen recibida: ", req.file);  // Verifica si hay un archivo subido
  
      // Verifica si el producto existe antes de intentar actualizarlo
      const [existingProduct] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
      if (existingProduct.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
  
      // Realizar la consulta para actualizar el producto
      const [result] = await conmysql.query(
        'UPDATE productos SET ' +
        'prod_codigo = ?, ' +
        'prod_nombre = ?, ' +
        'prod_stock = ?, ' +
        'prod_precio = ?, ' +
        'prod_activo = ?, ' +
        'prod_imagen = ? ' +
        'WHERE prod_id = ?',
        [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
      );
  
      console.log("Resultado de la actualización:", result);  // Verifica el resultado de la consulta
  
      // Si no se actualizó ninguna fila, enviar error
      if (result.affectedRows <= 0) {
        return res.status(400).json({ message: "No se pudo actualizar el producto" });
      }
  
      // Consultar el producto actualizado
      const [updatedProduct] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
      console.log("Producto actualizado correctamente:", updatedProduct[0]);
  
      res.json(updatedProduct[0]);  // Devolver el producto actualizado
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: 'Error del lado del servidor', error });
    }
  };
  
  
  
  export const patchProductos = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Acceder a los datos del cuerpo y archivo
      const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
      const prod_imagen = req.file ? `uploads/${req.file.filename}` : req.body.prod_imagen; // Si hay nueva imagen, usarla
  
      console.log("Datos recibidos: ", req.body);
      console.log("Imagen recibida: ", req.file);
  
      // Realizar la consulta para actualizar el producto
      const [result] = await conmysql.query(
        'UPDATE productos SET ' +
        'prod_codigo = IFNULL(?, prod_codigo), ' +
        'prod_nombre = IFNULL(?, prod_nombre), ' +
        'prod_stock = IFNULL(?, prod_stock), ' +
        'prod_precio = IFNULL(?, prod_precio), ' +
        'prod_activo = IFNULL(?, prod_activo), ' +
        'prod_imagen = IFNULL(?, prod_imagen) ' +
        'WHERE prod_id = ?',
        [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
      );
  
      if (result.affectedRows <= 0) return res.status(404).json({ message: "Producto no encontrado" });
  
      // Consultar el producto actualizado
      const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
      res.json(rows[0]);
  
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: 'Error del lado del servidor', error });
    }
  };
  
    
     export const deleteProductos=
     async(req, res)=> {
         try {
             const [rows]=await conmysql.query('delete from productos where prod_id=?', [req.params.id])
             if(rows.affectedRows<=0) return res.status(404).json({
                 id:0,
                 message:"No pudo eliminar al productos"
             })
             res.sendStatus(202)
         } catch (error) {
             return res.status(500).json({message:error})
         }
     }
