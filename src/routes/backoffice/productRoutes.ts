import Router from 'express';
import * as productController from '@/controllers/backoffice/productControllers';
import { isValidObjectId, managerAuthenticator } from '@/middlewares';
const {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = productController;

const productRouter = Router();

productRouter.use([managerAuthenticator]);

productRouter.get('/', getAllProducts);

productRouter.post('/', createProduct);

productRouter.get('/:id', isValidObjectId, getProduct);

productRouter.put('/:id', isValidObjectId, updateProduct);

productRouter.delete('/:id', isValidObjectId, deleteProduct);

export default productRouter;
