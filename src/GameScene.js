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

    init: function(){
        this._super();
        var gameLayer = ccs.load(res.GameLayer_json).node;
        var me,other;
        this.gameLayer =gameLayer;
        cc.log('success');
        this.addChild(gameLayer);
        cc.log('load success');
        var items=['planet', 'ufo', 'user_1', 'user_2'];

        //cc.log(motionLayer?'getttttt':'Nooooooo');
        for(var i=0; i<items.length; i++){
            this[items[i]]=gameLayer.getChildByName(items[i]);
            cc.log(this[items[i]]?'getttttt':'Nooooooo');
        }

        var self= this;
        var updateStatusListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "update_status",
            callback: function(event){
                var data=event.getData();
                me.changeSpeed(data.mySpeed);
                other.changeSpeed(data.hisSpeed);
                self.updatePlanetRotation(data.planetSpeed);
            }
        });
        cc.eventManager.addListener(updateStatusListener, 1);

        //this.phisicalEngine = new PhisicalEngine();

        //var PlayerAnimationCtrl = function (animationStr) {
        //    var startRunAnimation = ccs.load(animationStr).action;
        //    startRunAnimation.gotoFrameAndPlay(0,90,true);
        //    var stopRunAnimation = ccs.load(animationStr).action;
        //    stopRunAnimation.gotoFrameAndPlay(0,90,false);
        //    var byeAnimation = ccs.load(animationStr).action;
        //    byeAnimation.gotoFrameAndPlay(0,90,true);
        //    this.startRun =function(){
        //        gameLayer.stopActionByTag(stopRunAnimation.tag);
        //        gameLayer.stopActionByTag(byeAnimation.tag);
        //        startRunAnimation.setTimeSpeed(1);
        //        gameLayer.runAction(startRunAnimation);
        //    };
        //
        //    this.changeSpeed =function(spd){
        //        startRunAnimation.setTimeSpeed(UnitConversion(spd));
        //    }
        //
        //    this.stopRun = function(){
        //        gameLayer.stopActionByTag(byeAnimation.tag);
        //        gameLayer.stopActionByTag(startRunAnimation.tag);
        //        startRunAnimation.setTimeSpeed(1);
        //        gameLayer.runAction(stopRunAnimation);
        //    };
        //    this.bye = function(){
        //        gameLayer.stopActionByTag(stopRunAnimation.tag);
        //        gameLayer.stopActionByTag(startRunAnimation.tag);
        //        gameLayer.runAction(byeAnimation);
        //    }
        //}
        //
        //this.me = me = new PlayerAnimationCtrl(res.Me_animation);
        //this.other = other = new PlayerAnimationCtrl(res.Him_animation);
    },

    onEnter:function(){
        this._super();
        this.updatePlanetRotation(1);
    },

    updatePlanetRotation: function(speed){
        var action;
        if(!this.planet._action){
            //var frames=cc.spriteFrameCache.getSpriteFrames(res.Planet_animation);
            //var animation = new cc.Animation(frames, UnitConversion(speed));
            cc.log("called update");
            action = ccs.load(res.Planet_animation).action;
            cc.log(action?'getttttt':'Nooooooo');
            action.gotoFrameAndPlay(0,90,true);
            action.setTimeSpeed(UnitConversion(1));
            action = this.gameLayer.runAction(action);
            this.scheduleUpdate();
            this.planet._action =action;
            //GameScene.ac=action;
        }
        else {
            action = this.planet._action;
            var f= action.getCurrentFrame();
            action.setTimeSpeed(UnitConversion(speed));
            action.setCurrentFrame(f);
        }
    },

    tik: function(){
        cc.log('i will be called many times');
        PhisicalEngine.ticker();
        cc.log(status.playerOmega0 + " " + status.planetOmega);
    },

    unscheduleTik: function(){
        cc.unschedule(this.tik);
    },

    startScheduleTik: function(){
        cc.schedule(this.tik, 0.1);
    },
    update:function(){
        if(this.planet._action.isPlaying()){
            cc.log('isPlaying');
            this.count++;
        }
    }
});
