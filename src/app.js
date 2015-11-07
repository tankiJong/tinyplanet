var maxX = 0,
    maxY = 0,
    maxZ = 0;



var Main = cc.Scene.extend({

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


    init: function() {
        this._super();
        this._enableAccelerationRecognition();
    },


    onEnter:function () {
        this._super();
        this.init();


    }

});

