import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    async getAll() {
        try {
            const data = await fs.readFile(filePath, 'utf-8');

            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading products file:', error);

            throw new Error('Could not read products file');
        }
    }

    async getById(id) {
        const products = await this.getAll();

        return products.find(p => p.id === id);
    }

    async add(product) {
        try {
            const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
            const invalidFilds = [];
            for (const field of requiredFields) {
                if (!product[field]) {
                    invalidFilds.push(field);
                }
            }

            if (invalidFilds.length) {
                throw new Error(`Missing required fields: ${invalidFilds.join(', ')}`);
            }

            const products = await this.getAll();
            const existingProduct = products.find(p => p.code === product.code);
            if (existingProduct) {
                throw new Error(`Product with code ${product.code} already exists`);
            }

            const newProduct = {
                id: uuidv4(),
                ...product
            };
            products.push(newProduct);
            await fs.writeFile(filePath, JSON.stringify(products, null, 2));

            return newProduct;
        } catch (error) {
            console.error('Error adding product:', error);

            throw new Error('Could not add product');
        }
    }

    async update(id, updates) {
        try {
            const products = await this.getAll();
            const index = products.findIndex(p => p.id == id);
            if (index === -1) {
                return null;
            }

            const updated = { ...products[index], ...updates, id: products[index].id };
            products[index] = updated;
            await fs.writeFile(filePath, JSON.stringify(products, null, 2));

            return updated;
        } catch (error) {
            console.error('Error updating product:', error);

            throw new Error('Could not update product');
        }
    }

    async delete(id) {
        try {
            let products = await this.getAll();
            const index = products.findIndex(p => p.id == id);
            if (index === -1) {
                return false;
            }

            products = products.filter(p => p.id != id);

            await fs.writeFile(filePath, JSON.stringify(products, null, 2));

            return true;
        } catch (error) {
            console.error('Error deleting product:', error);

            throw new Error('Could not delete product');
        }
    }
}

export default ProductManager;