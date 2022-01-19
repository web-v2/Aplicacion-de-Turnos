const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    //Cuando un nuevo Cliente se conecta.
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) =>{               
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ({escritorio}, callback) =>{ 
        if(!escritorio){
            return callback({
                ok: false,
                message: 'El Escritorio es Obligatorio!'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.emit('tickets-pendientes', ticketControl.tickets.length);

        if(!ticket){
            callback({
                ok: false, 
                message: 'Ya no hay tickets que atender'
            });
        }else{
            callback({
                ok: true, 
                ticket
            });          
        }
    });
}


module.exports = {
    socketController
}