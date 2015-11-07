var SETTINGS = {
    TIMEINTERVAL: 0.1,
    INITMOMENTUM: 100,

    PLAYERI0: 1, // 转动惯量
    PLAYERI1: 1,
    PLANETI: 10
};

var UnitConversion = function (actual) {
    return actual;
}
var status = {
    playerOmega0: 0, // 角速度
    playerOmega1: 0,
    planetOmega: 0,

    playerAlpha0: 0, // 角加速度
    playerAlpha1: 0,
    planetAlpha: 0,

    playerTheta0: 0, // 位置(极坐标)
    playerTheta1: 0,
    planetTheta: 0,

};

PLAYER = {
    ME: 0,
    OPPONENT: 1
};

var PhisicalEngine = {

    /* @function
     */
    ticker: function() {
        // 计算相对位置

        status.playerTheta0 += SETTINGS.TIMEINTERVAL * (status.playerOmega0 + status.playerAlpha0/2);
        status.playerTheta1 += SETTINGS.TIMEINTERVAL * (status.playerOmega1 + status.playerAlpha1/2);
        status.planetTheta += SETTINGS.TIMEINTERVAL * (status.planetOmega + status.planetAlpha/2);

        // 计算速度
        status.playerOmega0 += SETTINGS.TIMEINTERVAL * status.playerAlpha0;
        status.playerOmega1 += SETTINGS.TIMEINTERVAL * status.playerAlpha1;
        status.planetOmega = (SETTINGS.INITMOMENTUM -
                SETTINGS.PLAYERI0 * status.playerOmega0 -
                SETTINGS.PLAYERI1 * status.playerOmega1
        ) / SETTINGS.PLANETI;
    },

    /*
     * @function
     * @param {number} player
     * @param {number} alpha
     */
    updateAlpha: function(player, alpha) {
        // 计算角加速度
        if (player == PLAYER.ME) {
            status.playerAlpha0 = alpha;
        }
        else if (player == PLAYER.OPPONENT) {
            status.playerAlpha1 = alpha;
        }

        status.planetAlpha =
            -(status.playerI0 * status.playerAlpha0 + status.playerI1 * status.playerAlpha1)
            / status.planetI;
    }
};

