import ProductManager from '../managers/ProductManager.js';

const manager = new ProductManager();

export default function setupProductSocket(io) {
    io.on('connection', async (socket) => {
        console.log('Cliente conectado');

        const products = await manager.getAll();
        socket.emit('updateProducts', products);

        socket.on('newProduct', async (data) => {
            try {
                await manager.add(data);
                const updatedProducts = await manager.getAll();
                io.emit('updateProducts', updatedProducts);
            } catch (error) {
                socket.emit('productError', error.message);
            }
        });
    });
}