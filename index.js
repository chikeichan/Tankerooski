var app = require('./server/server.js');
var port = process.env.PORT || 9000;
var io = require('socket.io').listen(app.listen(port));
var User = require('./server/models/userModel.js');


// Launch
var tanks = {};

io.on('connection',function(socket, a, b){
	socket.emit('login',socket.id);

	socket.on('spawn',function(d){
		User.findById(d,function(err,tank){
			socket.emit('id',{id: socket.id,tank:tank});
		})
	});
	socket.on('send',function(d){
		socket.broadcast.emit('broadcast',d);
	});
	socket.on('sync',function(state){
		socket.broadcast.emit('move',state)
	});
	socket.on('syncBullet',function(state){
		socket.broadcast.emit('addBullet',state)
	});
	socket.on('hit',function(hitter){
		socket.broadcast.emit('goodHit', hitter);
	});
	socket.on('dead',function(kills){
		User.findById(kills.kill,function(err,tank){
			tank.player.kills++;
			tank.save();
		});

		User.findById(kills.death,function(err,tank){
			tank.player.killed++;
			tank.save();
		});

		socket.broadcast.emit('killed', kills);
	});
	socket.on('disconnect',function(){
		socket.broadcast.emit('exit',socket.id)
	});

	socket.on('stat',function(d){
		User.findById(d.objectID,function(err,tank){
			if(tank.player.fired === undefined){
				tank.player.fired = 0;
			}
			if(tank.player.onTarget === undefined){
				tank.player.onTarget = 0;
			}
			tank.player.fired += d.fired;
			tank.player.onTarget += d.onTarget;
			tank.save();
		});
	})

})

console.log('I hear there is a party on port ' + port + '...');