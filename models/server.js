const express = require('express');
const cors = require('cors');
const { socketController } = require('../sockets/controller');


class server{
    constructor(){
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io     = require('socket.io')(this.server);
        this.paths  = {};

        //Conectar a BD
        //this.conectarDB();

        //Middleware
        this.middleware();
        //Rutas de mi App
        this.routes();
        //Eventos socket
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middleware(){
        //CORS
        this.app.use(cors());
        //Direcctorio publico
        this.app.use(express.static('public'));
    }   

    routes(){
        //this.app.use(this.paths.auth, require('../routes/auth'));
    }

    sockets(){
        this.io.on('connection', socketController);
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('App Corriendo en: ', this.port);
        });
    }
}

module.exports = server;