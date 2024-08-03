addLayer("Collapser", {
    name         : "Collapser",
    symbol       : "C",
    resource     : "Collapser",
    baseResource : "Void Essence",
    color        : "#FFE4B5",
    type         : "static",
    exponent     : function() {
        var exponent = 1.075
        if (hasUpgrade("Leap", 24)) exponent -= upgradeEffect("Leap", 24)
        if (hasUpgrade("Leap", 33)) exponent -= upgradeEffect("Leap", 33)[0]

        if (inChallenge("Leap", 12)) exponent = exponent * tmp.Leap.c12des[0]
        return exponent
    },
    position     : 0,
    row          : 1,
    branches     : ["Void"],
    requires     : new Decimal(2),
    
    resetDescription : "Sacrifice Void Essence for ",

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() {
            return 'You have ' + format(player.Void.points) + ' Void Essence'}],
        "blank",
        "upgrades",
    ],

    hotkeys: [
        {
            key: "c",
            description: "C: Perform a Collapse reset",
            onPress() {
                if (player.Collapser.unlocked) doReset("Collapser")
            },
            unlocked() { return player.Collapser.unlocked }
        }
    ],

    layerShown() {
        return hasUpgrade("Void", 12) || player.Collapser.unlocked
    },

    startData() {    
        return {
        unlocked: false,
        points: new Decimal(0),
        }
    },
    
    baseAmount() {
        return player.Void.points
    },
    
    gainMult() {
        var value = new Decimal(1)
        if (challengeCompletions("Leap", 12) > 0) 
            value = value.mul(challengeEffect("Leap", 12)[0])
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
            if (hasUpgrade("Leap", 22)) listKeep.push("upgrades")
            layerDataReset("Collapser", listKeep)
            // player.Collapser.upgrades = upgradeKeep;
        }
    },

    autoPrestige() {
        return hasUpgrade("Leap", 21)
    },

    canBuyMax() {
        return hasUpgrade("Leap", 21)
    },

    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title       : "C-Upgrade 11",
            description : "Collapser boosts Void Point gain",
            cost        : new Decimal(1),
            effect      : function() {
                var eff = (player.Collapser.points).add(2).log(2.25).add(1)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        12: {
            title       : "C-Upgrade 12",
            description : "Void Essence boosts Void Point gain",
            cost        : new Decimal(3),
            effect      : function() {
                var eff = (player.Void.points).add(1).log(4.32).add(1)
                eff = softcap(eff, new Decimal(3.5), 0.3)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    :  function() {
                return hasUpgrade("Collapser", 11) || 
                       hasUpgrade("Collapser", 12) || 
                       hasUpgrade("Collapser", 13)
            }
        },
        13: {
            title       : "C-Upgrade 13",
            description : function() {
                return "Passively generates " + format(upgradeEffect(this.layer, this.id), 0) + "% of Void Essence per second"
            },
            effect      : function() {
                var eff = 25
                if (hasUpgrade("Leap", 22)) eff = 100
                return eff
            },
            cost        :  new Decimal(5),
            unlocked    :  function() {
                return hasUpgrade("Collapser", 12) || 
                       hasUpgrade("Collapser", 13)
            }
        },
        14: {
            title       : "C-Upgrade 14",
            description : function() {
                return "Collapser boosts V-Upgrade 14 effect"
            },
            effect      : function() {
                var eff = (player.Collapser.points).add(1).log(2.52).add(1)
                eff = softcap(eff, new Decimal(4.5), 0.8)
                return eff
            },
            cost        :  new Decimal(18),
            tooltip     : function() {
                return "Effect:<br>VU 14 effect x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    :  function() {
                return (hasUpgrade("Collapser", 13) && challengeCompletions("Leap", 12) >= 1) || 
                        hasUpgrade("Collapser", 14)
            }
        }
    }
})