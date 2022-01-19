//Referencias HTML elements
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlert      = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const btnReiniciar  = document.querySelector('#reiniciar');

const searchParams = new URLSearchParams(window.location.search);

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es Obligatorio!');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlert.style.display = 'none';
btnReiniciar.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled   = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (pendientes) => { 
    if(pendientes === 0 ){
        lblPendientes.innerText = 0;
        btnReiniciar.style.display = '';
    }else{
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }
});

btnAtender.addEventListener( 'click', () => {   
    socket.emit('atender-ticket', {escritorio}, ({ok, ticket, message}) => {
        if (!ok) {
            lblTicket.innerText = '...';
            lblPendientes.innerText = 0;            
            return btnAtender.disabled = true;
        }
        lblTicket.innerText = 'El Ticket '+ ticket.numero;
    });
});

btnReiniciar.addEventListener( 'click', () => {
    btnReiniciar.style.display = 'none';
    window.location.reload();
});