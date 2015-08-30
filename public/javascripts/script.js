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
    //var button = document.createElement('button');
    //button.value='ClearAll';

	// Generate an unique ID
	//var id = Math.round($.now()*Math.random());
    var utils = new Utils();
	var id = utils.getQueryString('username');
    if(!getCookie('name'))
        win.location='/';

	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};
	var name={};

	//get socket from socket.io.js
	var socket = io.connect(url);

    socket.on('resume',function(data){

       //console.log('s-data:');
       console.log(data);
        for(var i=0;i<data.length;i++){
            //ctx.moveTo(data, data.y[i-1]);
            for(var j=0;j<data[i].x.length;j++){
                ctx.lineTo(data[i].x[j], data[i].y[j]);
                ctx.stroke();
            }
            if((data[i+1]!=null)&&(data[i+1]!=undefined)){
                ctx.moveTo(data[i+1].x[0],data[i+1].y[0]);
            }
        }
    });

	socket.on('moving', function (data) {
		//���յ����Է�������moving�¼���dataʱ�����data.id������Բ���clients
        //���һ�����ͼ��
		if(! (data.id in clients)){
            //��ʵcusors�����ÿһ�����Դ����һ��div�飬���div��һ�����ͼƬ
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
            name[data.id] = $('<div class="username">'+data.id+'</div>').appendTo('#cursors');
		}
        //��¼�¼������ͼƬ��λ�ã�ͨ����������������data����¼
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});
		name[data.id].css({
			'left' : data.x+5,
			'top' : data.y+17
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
        socket.emit('mousedown',{});
        e.preventDefault();
		drawing = true;
		prev.x = e.pageX;
		prev.y = e.pageY;
        //����ҳ�Ļ�ӭ��������
		instructions.fadeOut();
	});
	doc.bind('mouseup',function(){
		drawing = false;
        socket.emit('newdraw',{});
	});
    doc.bind('mouseleave', function () {
        drawing = false;
    });
    //���һ��������������¼���ʱ�䣿
	var lastEmit = $.now();
    //������ƶ���ʱ��ÿ��30���룿�������emitһ�Σ�
	doc.on('mousemove',function(e){
        if(me){
            $('<p class="myid">'+id+'</p>').appendTo('#cursors');
            $('<button id="clear">ClearAll</button>').appendTo('#cursors');
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
			drawLine(prev.x, prev.y, e.pageX, e.pageY);
            //���µ�ǰ���xy����
            prev.x = e.pageX;
            prev.y = e.pageY;
            socket.emit('mouserecord',{
                'x': e.pageX,
                'y': e.pageY,
                'id': id
            });
		}
	});
   var  clearAll = $('button');
    clearAll.bind('click',function(){
        alert('aa');
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