var GameScene = cc.Scene.extend({

    planet :null,
    ufo:null,
    user_1:null,
    user_2:null,
    phisicalEngine:null,
    gameLayer:null,
    me:null,
    other:null,
    spacecraft:null,
    ctor:function(){
        this._super();
        this.init();
    },

    init: function() {
        this._super();
        var gameLayer = ccs.load(res.GameLayer_json).node;
        var me, other;
        this.gameLayer = gameLayer;
        cc.log('success');
        this.addChild(gameLayer);
        cc.log('load success');
        var items = ['planet', 'ufo', 'user_1', 'user_2'];

        //cc.log(motionLayer?'getttttt':'Nooooooo');
        for (var i = 0; i < items.length; i++) {
            this[items[i]] = gameLayer.getChildByName(items[i]);
            cc.log(this[items[i]] ? 'getttttt' : 'Nooooooo');
        }

        var self = this;
        var updateStatusListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "update_status",

            callback: function(event){
                var data = event.getUserData();
                data = JSON.parse(data);

                if (status.local) {
                }
                else {
                }
                self.updatePlanetRotation(data.planetOmega);


            }
        });
        cc.eventManager.addListener(updateStatusListener, 1);

        //this.phisicalEngine = new PhisicalEngine();


        var PlayerAnimationCtrl = function (animationStr) {
            var startRunAnimation = ccs.load(animationStr).action;
            startRunAnimation.gotoFrameAndPlay(0, 90, true);
            var stopRunAnimation = ccs.load(animationStr).action;
            stopRunAnimation.gotoFrameAndPlay(0, 90, false);
            var byeAnimation = ccs.load(animationStr).action;
            byeAnimation.gotoFrameAndPlay(0, 90, true);

            this.startRun = function () {
                gameLayer.stopActionByTag(stopRunAnimation.tag);
                gameLayer.stopActionByTag(byeAnimation.tag);
                startRunAnimation.setTimeSpeed(1);
                gameLayer.runAction(startRunAnimation);
            };

            this.changeSpeed = function (spd) {
                startRunAnimation.setTimeSpeed(UnitConversion(spd));
            };

            this.stopRun = function () {
                gameLayer.stopActionByTag(byeAnimation.tag);
                gameLayer.stopActionByTag(startRunAnimation.tag);
                startRunAnimation.setTimeSpeed(1);
                gameLayer.runAction(stopRunAnimation);
            };
            this.bye = function () {
                gameLayer.stopActionByTag(stopRunAnimation.tag);
                gameLayer.stopActionByTag(startRunAnimation.tag);
                gameLayer.runAction(byeAnimation);
            }
        }


        this.me = me = new PlayerAnimationCtrl(res.Me_animation);
        this.me.startRun();
        this.other = other = new PlayerAnimationCtrl(res.Him_animation);
        this.other.startRun();
        other.location = 180;

        other.rotate = function (deg) {
            if (deg < 0) {
                var sprite = this.user_2.getChildByName('Sprite');
                sprite.setFlippedX(!sprite.flippedX);
            }
            this.user_2.setRotation(this.user_2.rotation + deg);
        }.bind(this);
        this.other = other;
        
        var action = ccs.load(res.UFO_animation).action;
        action.gotoFrameAndPlay(0,144,true);
        action.setTimeSpeed(1);
        this.gameLayer.runAction(action);
        this.ufo.rotate = function (deg) {
            this.ufo.setRotation(this.ufo.rotation + deg);
        }.bind(this);

        this.planet.rotate = function (deg) {
            this.planet.setRotation(this.planet.rotation + deg);
        }.bind(this);

    },

    onEnter:function(){
        this._super();
        //this.updatePlanetRotation(1);
        this._enableAccelerationRecognition();
        this.startScheduleTik();
    },

    //updatePlanetRotation: function(speed){
    //    var action;
    //    if(!this.planet._action){
    //        //var frames=cc.spriteFrameCache.getSpriteFrames(res.Planet_animation);
    //        //var animation = new cc.Animation(frames, UnitConversion(speed));
    //        cc.log("called update");
    //        action = ccs.load(res.Planet_animation).action;
    //        cc.log(action?'getttttt':'Nooooooo');
    //        action.gotoFrameAndPlay(0,360,true);
    //        action.setTimeSpeed(UnitConversion(1));
    //        action = this.gameLayer.runAction(action);
    //        this.scheduleUpdate();
    //        this.planet._action =action;
    //        action.direction =1;
    //        //GameScene.ac=action;
    //    }
    //    else {
    //        var f= action.getCurrentFrame();
    //        action = this.planet._action;
    //        if(speed*action.direction < 0){
    //            if(speed > 0){
    //                action.gotoFrameAndPlay(0,360,true);
    //                action.setCurrentFrame(720 - f);
    //                action.setTimeSpeed(UnitConversion(speed));
    //            } else {
    //                action.gotoFrameAndPlay(360,720,true);
    //                action.setCurrentFrame(720 - f);
    //                action.setTimeSpeed(UnitConversion(-speed));
    //            }
    //            action.direction = action.direction *(-1);
    //
    //        }
    //
    //        action.setTimeSpeed(UnitConversion(speed));
    //        action.setCurrentFrame(f);
    //    }
    //},

    tik: function(){
        cc.log('i will be called many times');
        PhisicalEngine.ticker();
        cc.log(status.playerOmega0 + " " + status.planetOmega);
    },

    unscheduleTik: function(){
        this.unschedule(this.tik);
    },

    startScheduleTik: function(){
        this.schedule(this.tik, SETTINGS.TIMEINTERVAL, cc.REPEAT_FOREVER, 0);
    },

    _enableAccelerationRecognition: function() {

        cc.inputManager.setAccelerometerEnabled(true);
        cc.eventManager.addListener({

            event: cc.EventListener.ACCELERATION,

            callback: function(acc, event) {

                status.player0 = acc.y;
                //console.log(acc.x + " " + acc.y + " " + acc.z);
                PhisicalEngine.update(PLAYER.ME, acc.y)
            }

        }, this);
    },

    update:function(){
    }
});
