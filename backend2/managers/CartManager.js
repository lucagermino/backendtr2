import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsPath = path.join(__dirname, '../data/carts.json');

class CartManager {
    async getAll() {
        try {
            const data = await fs.readFile(cartsPath, 'utf-8');

            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading carts file:', error);
            throw new Error('Could not read carts file');
        }
    }

    async createCart(products) {
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('Invalid products list');
        }

        try {
            const carts = await this.getAll();
            const newCart = {
                id: uuidv4(),
                products: products.map(product => ({
                    product: product.id,
                    quantity: product.quantity || 1
                }))
            };
            carts.push(newCart);
            await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));

            return newCart;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw new Error('Could not create cart');
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getAll();

            return carts.find(c => c.id == id);
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw new Error('Could not fetch cart');
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getAll();
            const cart = carts.find(c => c.id == cartId);
            if (!cart) {
                return null;
            }

            const product = cart.products.find(p => p.product === productId);
            if (product) {
                product.quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error('Error adding product to cart:', error);
            throw new Error('Could not add product to cart');
        }
    }
}

export default CartManager;