var GameScene = cc.Scene.extend({

    planet :null,
    ufo:null,
    user_1:null,
    user_2:null,

    gameLayer:null,

    ctor:function(){
        this._super();
        this.init();
    },

    init: function(){
        this._super();
        var gameLayer = ccs.load(res.GameLayer_json).node;
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

        var updateStatusListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "update_status",
            callback: function(event){
                cc.log("update called");
            }
        });
        cc.eventManager.addListener(updateStatusListener, 1);
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
            action = this.gameLayer.runAction(action);
            this.scheduleUpdate();
            this.planet._action =action;
        }
        else {
            action = this.this.planet._action;
            action.setDelayPerUnit(UnitConversion(speed));
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
        if(this.planet._action.isPlaying())
            cc.log('isPlaying');
    }
});
