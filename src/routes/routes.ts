import { Router } from 'express';

import { CreateProductController } from '../controllers/products/create-product.controller.js';
import { DeleteProductByIdController } from '../controllers/products/delete-product-by-id.controller.js';
import { FindProductByIdController } from '../controllers/products/get-product-by-id.controller.js';
import { ListProductsController } from '../controllers/products/list-products.controller.js';
import { UpdateProductController } from '../controllers/products/update-product.controller.js';

import { AddOptionsToProductController } from '../controllers/product-option/add-options-to-product.controller.js';
import { CreateProductOptionController } from '../controllers/product-option/create-product-option.controller.js';
import { DeleteProductOptionController } from '../controllers/product-option/delete-product-option.controller.js';

import { CreateCartController } from '../controllers/cart/create-cart.controller.js';
import { DeleteCartController } from '../controllers/cart/delete-cart.controller.js';
import { ListCartsController } from '../controllers/cart/list-carts.controller.js';

import { DeleteItemToProductController } from '../controllers/cart-item/Delete-item-to-product.controller.js';
import { AddItemToCartController } from '../controllers/cart-item/add-item-to-cart.controller.js';
import { CalculateTotalController } from '../controllers/cart-item/calculate-total.controller.js';
import { ListItemsToCartController } from '../controllers/cart-item/list-items-to-cart.controller.js';
import { UpdateItemQuantityController } from '../controllers/cart-item/update-item-quantity.controller.js';

import { ValidateApiKeyController } from '../controllers/auth/validate-api-key.controller.js';
import { PixGeneratorController } from '../controllers/pix/pix-generator.controller.js';
import { adminAuth } from '../middleware/adminAuth.js';

const routes = Router();

const createProductController = new CreateProductController();
const listProductsController = new ListProductsController();
const findProductByIdController = new FindProductByIdController();
const updateProductController = new UpdateProductController();
const deleteProductByIdController = new DeleteProductByIdController();

const createProductOptionController = new CreateProductOptionController();
const addOptionsToProductController = new AddOptionsToProductController();
const deleteProductOptionController = new DeleteProductOptionController();

const createCartController = new CreateCartController();
const listCartsController = new ListCartsController();
const deleteCartController = new DeleteCartController();

const addItemToCartController = new AddItemToCartController();
const listItemsToCartController = new ListItemsToCartController();
const updateItemQuantityController = new UpdateItemQuantityController();
const deleteItemToProductController = new DeleteItemToProductController();
const calculateTotalController = new CalculateTotalController();

const pixGeneratorController = new PixGeneratorController();
const validateApiKeyController = new ValidateApiKeyController();

// Rota para validar API Key (pública, mas requer API Key no header)
routes.post('/admin/validate', (req, res) => validateApiKeyController.handle(req, res));

// Rotas públicas (leitura)
routes.get('/products', (req, res) => listProductsController.handle(req, res));
routes.get('/products/:id', (req, res) => findProductByIdController.handle(req, res));

// Rotas protegidas - Admin (requerem API Key)
routes.post('/products', adminAuth, (req, res) => createProductController.handle(req, res));
routes.put('/products/:id', adminAuth, (req, res) => updateProductController.handle(req, res));
routes.delete('/products/:id', adminAuth, (req, res) =>
  deleteProductByIdController.handle(req, res)
);

routes.post('/products/:productId/options', adminAuth, (req, res) =>
  addOptionsToProductController.handle(req, res)
);

routes.post('/productOptions', adminAuth, (req, res) =>
  createProductOptionController.handle(req, res)
);
routes.delete('/productOptions/:productOptionId', adminAuth, (req, res) =>
  deleteProductOptionController.handle(req, res)
);

routes.get('/carts', (req, res) => listCartsController.handle(req, res));
routes.post('/carts', (req, res) => createCartController.handle(req, res));
routes.delete('/carts/:uuid', (req, res) => deleteCartController.handle(req, res));

routes.post('/carts/:cartUuid/items', (req, res) => addItemToCartController.handle(req, res));
routes.get('/carts/:cartUuid/items', (req, res) => listItemsToCartController.handle(req, res));
routes.put('/carts/:cartUuid/items/:productOptionId', (req, res) =>
  updateItemQuantityController.handle(req, res)
);
routes.delete('/carts/:cartUuid/items/:productOptionId', (req, res) =>
  deleteItemToProductController.handle(req, res)
);
routes.get('/carts/:cartUuid/total', (req, res) => calculateTotalController.handle(req, res));

routes.post('/carts/:cartUuid/pix', (req, res) => pixGeneratorController.handle(req, res));

export { routes };
