/**
 * Importar as configuraçòes do servidor
 */
var app = require('./config/server');

/**
 * Parametrizar a porta de escuta
 */
var server = app.listen(80, function() {
    console.log('Servidor online');
});

var io = require('socket.io').listen(server);

/**
 * Variável global de socket
 */
app.set('io', io);

/**
 * Criar a conexão por websocket
 */
io.on('connection', function(socket) {
    console.log('Usuário conectou!');

    socket.on('disconnect', function() {
        console.log('Usuário desconectou!');
    })

    socket.on('msgParaServidor', function(data) {
        /* Diálogo */
        socket.emit(
            'msgParaCliente', { apelido: data.apelido, mensagem: data.mensagem }
        );

        socket.broadcast.emit(
            'msgParaCliente', { apelido: data.apelido, mensagem: data.mensagem }
        )

        /* Participantes */
        if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {
            socket.emit(
                'participantesParaCliente', { apelido: data.apelido }
            );

            socket.broadcast.emit(
                'participantesParaCliente', { apelido: data.apelido }
            )
        }

    });
});