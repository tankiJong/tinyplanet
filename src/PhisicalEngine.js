var SETTINGS = {
    TIMEINTERVAL: 0.1,
    INITMOMENTUM: 10,

    PLAYERI0: 1, // 转动惯量
    PLAYERI1: 1,
    PLANETI: 10
};

var status = {
    playerOmega0: 0, // 角速度
    playerOmega1: 0,
    planetOmega: 0,

    playerAlpha0: 0, // 角加速度
    playerAlpha1: 0,
    planetAlpha: 0,

    playerTheta0: 0, // 位置(极坐标)
    playerTheta1: 160,
    planetTheta: 0,

    local: 1
};

PLAYER = {
    ME: 0,
    OPPONENT: 1
};

var PhisicalEngine = {

    /* @function
     */
    ticker: function() {

        cc.log(123);
        if (status.local) {
            // 更新远程端的加速度
            var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NetworkServer", "getClientInput", "()Ljava/lang/String;");
            status.playerAlpha1 = parseFloat(result);


            // 计算相对位置

            status.playerTheta0 += SETTINGS.TIMEINTERVAL * (status.playerOmega0 + status.playerAlpha0/2);
            /*
            while (status.playerTheta0 < 0)
                status.playerTheta0 += 360;
            while (status.playerTheta0 < 360)
                status.playerTheta0 -= 360;
                */

            status.playerTheta1 += SETTINGS.TIMEINTERVAL * (status.playerOmega1 + status.playerAlpha1/2);
            /*
            while (status.playerTheta1 < 0)
                status.playerTheta1 += 360;
            while (status.playerTheta1 < 360)
                status.playerTheta1 -= 360;
                */

            status.planetTheta += SETTINGS.TIMEINTERVAL * (status.planetOmega + status.planetAlpha/2);
            /*
            while (status.planetTheta < 0)
                status.planetTheta += 360;
            while (status.planetTheta < 360)
                status.planetTheta -= 360;
                */

            // 计算速度
            status.playerOmega0 += SETTINGS.TIMEINTERVAL * status.playerAlpha0;
            status.playerOmega1 += SETTINGS.TIMEINTERVAL * status.playerAlpha1;
            status.planetOmega = (SETTINGS.INITMOMENTUM -
                    SETTINGS.PLAYERI0 * status.playerOmega0 -
                    SETTINGS.PLAYERI1 * status.playerOmega1
                ) / SETTINGS.PLANETI;

            // update server
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NetworkServer", "setServerState", "(Ljava/lang/String;)V", JSON.stringify(status));
        }
        else {
            //status = JSON.stringify(jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NetworkClient", "getState", "()Ljava/lang/String;)"));
        }

        // update ticker
        var event = new cc.EventCustom("update_status");
        event.setUserData(JSON.stringify(status));
        cc.eventManager.dispatchEvent(event);

        cc.log(status.playerOmega0 + " " + status.playerOmega1 + " " + status.planetOmega + " "
            + status.playerTheta0 + " " + status.playerTheta1 + " " + status.planetTheta);
    },

    /*
     * @function
     * @param {number} player
     * @param {number} alpha
     */
    update: function(player, alpha) {
        // 计算角加速度
        alpha = alpha * alpha * ((alpha > 0)?1:-1);
        if (player === PLAYER.ME) {
            status.playerAlpha0 = alpha;
        }
        else if (player === PLAYER.OPPONENT) {
            status.playerAlpha1 = alpha;
        }


        status.planetAlpha =
            -(SETTINGS.PLAYERI0 * status.playerAlpha0 + SETTINGS.PLAYERI1 * status.playerAlpha1)
            / SETTINGS.PLANETI;

    }
};