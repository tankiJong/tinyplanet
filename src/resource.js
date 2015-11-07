var res = {
    HelloWorld_png : "res/HelloWorld.png",
    MainScene_json : "res/MainScene.json",
    GameLayer_json : "res/generalPlanet.json",
    Planet_animation : "res/planet.json",
    Me_animation : "res/user_1.json",
    Him_animation : "res/user_2.json",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
