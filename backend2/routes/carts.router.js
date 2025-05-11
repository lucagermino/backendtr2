import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const cart = await manager.createCart(req.body);
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(400).send(error.message);
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await manager.getCartById(req.params.cid);
        cart
            ? res.status(200).json(cart)
            : res.status(404).send('Carrito no encontrado');
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send(error.message);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const result = await manager.addProductToCart(req.params.cid, req.params.pid);
        result
            ? res.status(200).json(result)
            : res.status(404).send('Carrito o producto no encontrado');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).send(error.message);
    }
});

export default router;