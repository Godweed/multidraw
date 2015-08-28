/**
 * Created by Eamonn on 2015/8/28.
 */

var socket = require('socket.io');
var io=null;

exports.getSocketIo = function(){
    return socket;
};

exports.startSocketIo = function(server){
    io=socket(server);
    io.on('connection', function (socket) {
        socket.on('mousemove', function (data) {
            //�������ͻ��˷�����mousemove��Ϣ���data�󣬷����������еĿͻ���
            //�㲥moving�¼������˵�ǰ�ͻ��ˣ�������ʵ�����������߿ͻ����ܹ�
            //�յ��¼���ͻ��˵�data
            socket.broadcast.emit('moving', data);
        });
    });
};
