
function Tank(attr) {

	var tank = {};

	tank.x = attr.x;
	tank.y = attr.y;
	tank.z = attr.z;
	tank.color = attr.color;
	tank.speed = attr.speed;
	tank.hp = attr.hp;
	tank.maxHP = attr.hp;
	tank.name = attr.name;
	tank.objectID = attr.objectID;
	tank.damage = attr.damage;
	tank.isCollide = false;
  tank.bulletFreq = attr.bulletFreq;
	tank.fired = 0;
	tank.onTarget = 0;
	tank.kills = 0;
	tank.deaths = 0;

	//direction system
	tank.currentSpeed = 0;
	tank.spin = 0
	tank.direction = Math.PI/2;

	//turret system
	tank.torretY = 0;
	tank.torretDirection = Math.PI/2;
	tank.cameraDirection = Math.PI/2;

	//Fire state
	tank.isFire = false;
	tank.noFire = false;

	tank.material = {
		tank: new THREE.MeshLambertMaterial({ color: tank.color }),
		hp: new THREE.MeshBasicMaterial({ color: 'green'}),
		reload: new THREE.MeshBasicMaterial({ color: 'blue'})
	};

	tank.driveSound = new buzz.sound('./Sound/tank-driving-edited.ogg');

	//HP Bar
	tank.hpbar = new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.5), tank.material.hp );

	//Reload Bar
	tank.reloadBar = new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.5), tank.material.reload);

	//Reload Sound
	tank.reloadSound = playTankReload;

  /**************** This loader may need to be changed for the falcon **********/
	var loader = new THREE.ObjectLoader();
	tank.tanker = loader.parse(GermanTank);
  tank.tanker.children.forEach(function(part,i){
  	if(i === 1){
			tank.tanker.children[1].material.color.set(tank.color);			
  	} else if (i < 5){
			tank.tanker.children[i].material = TankTexture[i];		  	
  	}
  	tank.tanker.children[i].scale.set(tank.x, tank.y, tank.z);
  	tank.tanker.children[i].receiveShadow = true;
  	tank.tanker.children[i].castShadow = true;
  })

  tank.tanker.children.push(tank.hpbar)
  tank.tanker.children.push(tank.reloadBar)
  attr.onLoad(tank.tanker);

  tank.reload = function(){
  	setTimeout(tank.reloadSound, tank.bulletFreq - 1200)
  	tank.reloadBar.scale.z = 0;
  	tank.reloadBar.material.color.set('red')
  	var loading = function(){
  		if (tank.reloadBar.scale.z < 1){
	  		tank.reloadBar.scale.z += 1/(tank.bulletFreq/(20 - (tank.bulletFreq - 1200)/160));
  		}
  		if (tank.reloadBar.scale.z > 0.4 && tank.reloadBar.scale.z !== 1){
  			tank.reloadBar.material.color.set('yellow')
  		}
  		if (tank.reloadBar.scale.z > 0.7 && tank.reloadBar.scale.z !== 1){
  			tank.reloadBar.material.color.set('orange')
  		}
  	}
  	var loadingInterval = setInterval(loading, 10)

  	setTimeout(function() {
  		clearInterval(loadingInterval)
  		tank.reloadBar.material.color.set('blue')
  		tank.reloadBar.scale.z = 1;
  	}, tank.bulletFreq - 100)
  }
  
	// Tank fire
	tank.fire = function(direction){
		tank.reload();
		bullet = Bullet(-Math.sin(direction), -Math.cos(direction), 10, this.tanker.position);
		bullet.bulleter.position.x = this.tanker.position.x - Math.cos(direction)*2;
		bullet.bulleter.position.y = this.tanker.position.y + this.y*2;
		bullet.bulleter.position.z = this.tanker.position.z - Math.sin(direction)*2;
		return bullet;
	};

	//tank flip
	tank.flip = function(){
		var tankctx = this;
		var flip = setInterval(function(){
			tankctx.tanker.rotation.x += 0.2;
			if(tankctx.tanker.rotation.x > Math.PI/2){
				tankctx.tanker.position.y -= 0.2;
			} else {
				tankctx.tanker.position.y += 0.4;
			}
			if(tankctx.tanker.rotation.x > Math.PI){
				clearInterval(flip);
				tankctx.tanker.position.y = attr.y*2;
			}
		},30)
	}

	tank.restore = function(){
		this.tanker.rotation.x = 0;
		this.tanker.position.y = 0;
	}

	return tank;
}

