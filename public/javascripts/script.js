$(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	var url = 'http://localhost:8080';

	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
        //����һ�������ڻ����ϻ�ͼ�Ļ���
		ctx = canvas[0].getContext('2d'),
		instructions = $('#instructions');
	
	// Generate an unique ID
	//var id = Math.round($.now()*Math.random());
    var utils = new Utils();
	var id = utils.getQueryString('username');

	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};

	//get socket from socket.io.js
	var socket = io.connect(url);

	socket.on('moving', function (data) {
		//���յ����Է�������moving�¼���dataʱ�����data.id������Բ���clients
        //���һ�����ͼ��
		if(! (data.id in clients)){
            //��ʵcusors�����ÿһ�����Դ����һ��div�飬���div��һ�����ͼƬ
			cursors[data.id] = $('<div class="cursor">'+'<div>'+data.id+'</div>').appendTo('#cursors');
            //$('<p>'+data.id+'</p>').appendTo('#cursors');
		}
        //��¼�¼������ͼƬ��λ�ã�ͨ����������������data����¼
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		if(data.drawing && clients[data.id]){
			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer
			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
		}
		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});


	var prev = {};
    var me = true;
	//���on������jquery����ģ��൱�ڰ���mousedown�¼�
    //Ϊ������mousedown�¼�������갴�µ����꣬����prev
	canvas.on('mousedown',function(e){
        e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
        //����ҳ�Ļ�ӭ��������
		instructions.fadeOut();
	});
	doc.bind('mouseup mouseleave',function(){
		drawing = false;
	});
    //���һ��������������¼���ʱ�䣿
	var lastEmit = $.now();
    //������ƶ���ʱ��ÿ��30���룿�������emitһ�Σ�
	doc.on('mousemove',function(e){
        if(me){
            $('<p class="myid">'+id+'</p>').appendTo('#cursors');
            me=false;
        }
		if($.now() - lastEmit > 30){
            //����������͵�������һ��data����
            //��������ƶ������꣬�Ƿ�drawing��id
			socket.emit('mousemove',{
				'x': e.pageX,
				'y': e.pageY,
				'drawing': drawing,
				'id': id
			});
			lastEmit = $.now();
		}
		if(drawing){
            //��������Ϊ ��ǰ��갴�µĵ���ƶ��ĵ�
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
            //���µ�ǰ���xy����
			prev.x = e.pageX;
			prev.y = e.pageY;
		}
	});
	// �Ƴ������꣬��������᲻ͣ�ص��ã�ֱ��clearInterval��
	// �� setInterval() ���ص� ID ֵ������ clearInterval() �����Ĳ�����
	setInterval(function(){
		//ident������˭�������ģ�
		for(ident in clients){
            //����10�룬ɾ��dom�ڵ㣬ɾ������
			if($.now() - clients[ident].updated > 1000000){
				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}
	},10000);

	function drawLine(fromx, fromy, tox, toy){
        //��·���ƶ��������е�ָ���㣬����������
		ctx.moveTo(fromx, fromy);
        //���һ���µ㣬Ȼ���ڻ����д����Ӹõ㵽���ָ���������
		ctx.lineTo(tox, toy);
        //�����Ѷ���·��
		ctx.stroke();
	}

});