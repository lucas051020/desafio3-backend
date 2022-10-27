const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const fs = require('fs');

class Contenedor {
    constructor(route) {
        this.route = `./${route}.json`
    }

    async save(element) {
        try {
            const elements = await this.getAll()

            const id = elements.length === 0 ? 1 : elements[elements.length - 1].id + 1

            element.id = id;

            elements.push(element);

            await fs.promises.writeFile(
                this.route,
                JSON.stringify(elements, null, 3)
            );

            return element.id

        } catch (error) {
            console.log(error);
            console.log("error en Save")
        }
    }

    async getAll() {
        try {
            const file = await fs.promises.readFile(this.route, 'utf-8')
            const elements = JSON.parse(file)
            return elements;

        } catch (error) {
            if (error.code === "ENOENT") {
                await fs.promises.writeFile(this.route, JSON.stringify([], null, 3));
                console.log("error en GetAll")
                return [];
            }
        }
    }
}

const documento = new Contenedor('producto')

app.get('/productos', (req, res) => {
    documento.getAll().then(data => {
        res.json(data)
    })
    .catch(error => console.log(error))
})

const random = (valor) => {
    return (parseInt(Math.random() * valor) + 1)
}

app.get('/productoRandom', (req, res) => {
    documento.getAll().then(data => {
        (data)
        const datafinal = data[((random(data.length) - 1))]
        res.json(datafinal)
    })
    .catch(error => console.log(error))
})

app.all('*', (req, res) => res.send('<h1>Solo rutas: /productos y /productoRandom</h1>'));

const server = app.listen(PORT, () => console.log(`PORT: ${PORT}`))
server.on('error', err => console.log(`Error en server ${err}`));