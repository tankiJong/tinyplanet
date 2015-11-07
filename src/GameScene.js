var GameScene=cc.Scene.extend({
    planet :null,
    ctor:function(){
        this._super();
        this.init();
    },

    init: function(){
        this._super();
        var gameScene = ccs.load(res.GameScene_json).node;
        this.addChild(gameScene);
        var planet=ccui.helper.seekWidgetByName(gameScene, "planet");
        this.planet=planet;
        var updateStatusListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "update_status",
            callback: function(event){
                cc.log("update called")
            }
        });
        cc.eventManager.addListener(updateStatusListener, 1);
    },

    onEnter:function(){
        this._super();


    }

});