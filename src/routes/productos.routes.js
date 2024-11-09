import { Router } from 'express'
import multer from 'multer'
import {getProductos,getProductosxid,postProductos,putProductos,patchProductos,deleteProductos} from '../controladores/productosCtrl.js'

//configurar multer para almacenar las imagenes
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads'); //carpeta donde se guardan las imagenes
    },
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
        
    }
});

const upload=multer({storage});

const router=Router()
//armar nuestras rutas
// armar nuestras rutas
router.get('/productos', getProductos)// select
router.get('/productos/:id', getProductosxid)//select x id 
router.post('/productos',upload.single('prod_imagen'), postProductos); // Insert
router.put('/productos/:id', upload.single('prod_imagen'), putProductos); // Actualizar un producto

router.patch('/productos/:id', upload.single('prod_imagen'), patchProductos); // Modificar un producto
router.delete('/productos/:id', deleteProductos)//delete



export default router
