var GameScene=cc.Scene.extend({
    planet :null,
    ufo:null,
    user_1:null,
    user_2:null,
    ctor:function(){
        this._super();
        this.init();
    },

    init: function(){
        this._super();
        var gameScene = ccs.load(res.GameScene_json).node;
        this.addChild(gameScene);
        var items=['planet','ufo','user_1','user_2'];
        for(var i=0; i<items.length; i++)
            this[items[i]]=ccui.helper.seekWidgetByName(gameScene, items[i]);
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


    },


    tik: function(){
        cc.log('i will be called many times');
    },

    unscheduleTik: function(){
        cc.unschedule(this.tik);
    },

    startScheduleTik: function(){
        cc.schedule(this.tik, 0.1);
    }

});
