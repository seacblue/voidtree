addLayer("Generator", {
    name         : "Generator",
    symbol       : "G",
    resource     : "Generator",
    baseResource : "Void Point",
    color        : "#48D1CC",
    type         : "static",
    exponent     : function() {
        var exponent = 1.15
        if (hasUpgrade("Void", 23)) exponent -= upgradeEffect("Void", 23)
        if (hasUpgrade("Leap", 33)) exponent -= upgradeEffect("Leap", 33)[1]

        if (inChallenge("Leap", 12)) exponent = exponent * tmp.Leap.c12des[1]
        return exponent
    },
    position     : 1,
    row          : 1,
    branches     : ["Void"],
    requires     : new Decimal(750),
    
    resetDescription : "Compress Void Point for ",

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() {
            return 'You have ' + format(player.points) + ' Void Point'} ],
        "blank",
        "upgrades",
    ],

    hotkeys: [
        {
            key: "g",
            description: "G: Perform a Generator reset",
            onPress() {
                if (player.Generator.unlocked) doReset("Generator") 
            },
            unlocked() { return player.Generator.unlocked }
        }
    ],

    layerShown() {
        return hasUpgrade("Void", 15) || player.Generator.unlocked
    },

    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            best  : new Decimal(0),
        }
    },
    
    baseAmount() {
        return player.points
    },
    
    gainMult() {
        var value = new Decimal(1)
        if (challengeCompletions("Leap", 12) > 0) 
            value = value.mul(challengeEffect("Leap", 12)[1])
        if (hasUpgrade("Void", 31))
            value = value.mul(upgradeEffect("Void", 31))
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
            listKeep.push("best")
            if (hasUpgrade("Leap", 23)) listKeep.push("upgrades")
            layerDataReset("Generator", listKeep)
            // player.Generator.upgrades = upgradeKeep;
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
            title       : "G-Upgrade 11",
            description : function() {
                if (!hasUpgrade("Void", 21)) return "Triple Void Point gain"
                else return "Triple Void Point gain, and Void Essence boosts Void Point gain"
            },
            cost        : new Decimal(1),
            effect      : function() {
                if (!hasUpgrade("Void", 21)) return 3
                else return 3 * upgradeEffect("Void", 21)
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        12: {
            title       : "G-Upgrade 12",
            description : function() {
                if (!hasUpgrade("Leap", 23)) return "Keep Void Essence upgrades based on your Generator, up to 5 VE upgrades"
                else return "Keep Void Essence upgrades based on your best Generator"
            },
            cost        : new Decimal(3),
            effect      : function() {
                var keepValue = player.Generator.points
                if (hasUpgrade("Leap", 23)) keepValue = player.Generator.best
                var keepUList = [1, 1, 2, 3, 4, 7, 10, 12, 15, 18, 22, 26, 30, 35, 40]
                var maximum = 5
                if (hasUpgrade("Leap", 23)) maximum = keepUList.length
                for (var index = maximum - 1; index >= 0; index--) {
                    if (keepValue.gte(keepUList[index])) return index + 1
                }
                return 0
            },
            tooltip     : function() {
                return "Effect:<br>Keep " + format(upgradeEffect(this.layer, this.id), 0) + 
                       " Void Essence upgrades"
            },
            unlocked    :  function() {
                return hasUpgrade("Generator", 11) ||
                       hasUpgrade("Generator", 12)
            }
        },
        13: {
            title       : "G-Upgrade 13",
            description : "Generator boosts Void Essence gain",
            cost        : new Decimal(12),
            effect      : function() {
                var eff = (player.points).add(1).log(9.5).div(5).add(1)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VE gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    :  function() {
                return (hasUpgrade("Generator", 12) && hasUpgrade("Void", 24)) ||
                        hasUpgrade("Generator", 13)
            }
        },
        14: {
            title       : "G-Upgrade 14",
            description : "Generator boosts Void Essence gain",
            cost        : new Decimal(22),
            effect      : function() {
                var eff = (player.points).add(1).log(9.5).div(5).add(1)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VE gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    :  function() {
                return (hasUpgrade("Generator", 13) && hasUpgrade("Void", 33)) ||
                        hasUpgrade("Generator", 14)
            }
        }
    }
})