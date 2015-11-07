


var Main = cc.Scene.extend({

    _enableAccelerationRecognition: function() {

        cc.inputManager.setAccelerometerEnabled(true);
        cc.eventManager.addListener({

            event: cc.EventListener.ACCELERATION,

            callback: function(acc, event) {
                cc.log(acc.x + " " + acc.y + " " +  acc.z + " " + acc.timestamp);
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

