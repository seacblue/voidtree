addLayer("Photon", {
    name         : "Photon",
    symbol       : "P",
    resource     : "Photon",
    baseResource : "Leap Point",
    color        : "#F4A460",
    type         : "static",
    exponent     : function() {
        var exponent = 1.3
        return exponent
    },
    position     : 0,
    row          : 3,
    branches     : ["Leap"],
    requires     : new Decimal("1e4"),
    
    resetDescription : "Extract Leap Point for ",

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() {
            return 'You have ' + format(player.Leap.points) + ' Leap Point'}],
        "blank",
        "upgrades",
    ],

    hotkeys: [
        {
            key: "p",
            description: "P: Perform a Photon reset",
            onPress() {
                if (player.Photon.unlocked) doReset("Photon")
            },
            unlocked() { return player.Photon.unlocked }
        }
    ],

    layerShown() {
        return hasUpgrade("Leap", 34) || player.Photon.unlocked
    },

    startData() {    
        return {
        unlocked: false,
        points: new Decimal(0),
        }
    },
    
    baseAmount() {
        return player.Leap.points
    },
    
    gainMult() {
        var value = new Decimal(1)
        return value
    },
    
    gainExp() {
        return new Decimal(1)
    },
    
    update(diff) {
    },
    
    doReset(Layer) {
        if (Layer && layers[Layer].row > layers[this.layer].row) {
            var listKeep = []
            var upgradeKeep = []
            layerDataReset("Photon", listKeep)
            player.Photon.upgrades = upgradeKeep;
        }
    },

    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title       : "P-Upgrade 11",
            description : "Photon boosts Void Point, Void Essence and Leap Point gain",
            cost        : new Decimal(1),
            effect      : function() {
                var eff1 = (player.Photon.points).add(4).log(1.75).add(1)
                var eff2 = (player.Photon.points).add(3.5).log(3.25).add(1)
                var eff3 = (player.Photon.points).add(1.2).log(4.05).add(1)
                return [eff1, eff2, eff3]
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id)[0]) +
                       "<br>VE gain x" + format(upgradeEffect(this.layer, this.id)[1]) +
                       "<br>LP gain x" + format(upgradeEffect(this.layer, this.id)[2])
            }
        }
    }
})