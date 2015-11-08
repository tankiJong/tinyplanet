var SETTINGS = {
    TIMEINTERVAL: 0.1,
    INITMOMENTUM: 12,

    PLAYERI0: 1, // 转动惯量
    PLAYERI1: 1,
    PLANETI: 10
};

var state = {
    playerOmega0: 1, // 角速度
    playerOmega1: 1,
    planetOmega: 1,

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
        if (state.local) {
            // 更新远程端的加速度
            var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NetworkServer", "getClientInput", "()Ljava/lang/String;");
            state.playerAlpha1 = parseFloat(result);

            // 计算相对位置

            state.playerTheta0 += SETTINGS.TIMEINTERVAL * (state.playerOmega0 + state.playerAlpha0/2);
            /*
            while (state.playerTheta0 < 0)
                state.playerTheta0 += 360;
            while (state.playerTheta0 < 360)
                state.playerTheta0 -= 360;
                */

            state.playerTheta1 += SETTINGS.TIMEINTERVAL * (state.playerOmega1 + state.playerAlpha1/2);
            /*
            while (state.playerTheta1 < 0)
                state.playerTheta1 += 360;
            while (state.playerTheta1 < 360)
                state.playerTheta1 -= 360;
                */

            state.planetTheta += SETTINGS.TIMEINTERVAL * (state.planetOmega + state.planetAlpha/2);
            /*
            while (state.planetTheta < 0)
                state.planetTheta += 360;
            while (state.planetTheta < 360)
                state.planetTheta -= 360;
                */

            // 计算速度
            state.playerOmega0 += SETTINGS.TIMEINTERVAL * state.playerAlpha0 * SETTINGS.PLAYERI0 /
                (SETTINGS.PLANETI + SETTINGS.PLAYERI1);
            state.playerOmega1 += SETTINGS.TIMEINTERVAL * state.playerAlpha1 * SETTINGS.PLAYERI1 /
                (SETTINGS.PLANETI + SETTINGS.PLAYERI0);
            state.planetOmega += SETTINGS.TIMEINTERVAL * state.playerAlpha0 * SETTINGS.PLAYERI0 /
                (SETTINGS.PLANETI + SETTINGS.PLAYERI1) + SETTINGS.TIMEINTERVAL * state.playerAlpha1 * SETTINGS.PLAYERI1 /
                (SETTINGS.PLANETI + SETTINGS.PLAYERI0);

                /*
                (SETTINGS.INITMOMENTUM -
                    SETTINGS.PLAYERI0 * state.playerOmega0 -
                    SETTINGS.PLAYERI1 * state.playerOmega1
                ) / SETTINGS.PLANETI;
                */

            // update server
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NetworkServer", "setServerState", "(Ljava/lang/String;)V", JSON.stringify(state));
        }
        else {
            //state = JSON.stringify(jsb.reflection.callStaticMethod("org/cocos2dx/javascript/NetworkClient", "getState", "()Ljava/lang/String;)"));
        }

        // update ticker
        var event = new cc.EventCustom("update_state");
        event.setUserData(JSON.stringify(state));
        cc.eventManager.dispatchEvent(event);

        cc.log(state.playerOmega0 + " " + state.playerOmega1 + " " + state.planetOmega + " "
            + state.playerTheta0 + " " + state.playerTheta1 + " " + state.planetTheta);
    },

    /*
     * @function
     * @param {number} player
     * @param {number} alpha
     */
    update: function(player, alpha) {
        // 计算角加速度
        alpha = alpha * alpha * ((alpha > 0)?1:-1) * 10;
        if (player === PLAYER.ME) {
            state.playerAlpha0 = alpha;
        }
        else if (player === PLAYER.OPPONENT) {
            state.playerAlpha1 = alpha;
        }


        state.planetAlpha =
            -(SETTINGS.PLAYERI0 * state.playerAlpha0 + SETTINGS.PLAYERI1 * state.playerAlpha1)
            / SETTINGS.PLANETI;

    }
};
