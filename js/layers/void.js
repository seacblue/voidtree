addLayer("Void", {
    name         : "Void",
    symbol       : "V",
    resource     : "Void Essence",
    baseResource : "Void Point",
    color        : "#8A2BE2",
    type         : "normal",
    exponent     : 0.45,
    position     : 0,
    row          : 0,
    requires     : new Decimal(10),

    resetDescription : "Merge Void Point for ",

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() {
            if (tmp.Void.passiveGeneration == 0)
                return 'You have ' + format(player.points) + ' Void Point'
            else
                return 'You passively generates ' + 
                       format(tmp.Void.resetGain * tmp.Void.passiveGeneration) +
                       ' Void Essence per second'}],
        "blank",
        "upgrades",
    ],

    hotkeys: [
        {
            key: "v",
            description: "V: Perform a Void Essence reset",
            onPress() { doReset("Void") },
            unlocked() { return true}
        }
    ],

    layerShown() {
        return true
    },

    startData() {    
        return {
        unlocked: true,
        points: new Decimal(0)
        }
    },
    
    baseAmount() {
        return player.points
    },
    
    gainMult() {
        var value = new Decimal(1)
        if (hasUpgrade("Void", 14)) value = value.mul(upgradeEffect("Void", 14))
        if (hasUpgrade("Leap", 14)) value = value.mul(upgradeEffect("Leap", 14)[1])
        if (hasUpgrade("Generator", 13)) value = value.mul(upgradeEffect("Generator", 13))
        if (hasUpgrade("Photon", 11)) value = value.mul(upgradeEffect("Photon", 11)[1])
        return value
    },
    
    gainExp() {
        return new Decimal(1)
    },
    
    update(diff) {
    },

    passiveGeneration : function() {
        if (hasUpgrade("Collapser", 13)) {
            return upgradeEffect("Collapser", 13) / 100
        }
        return 0
    },
    
    doReset(Layer) {
        if (Layer && layers[Layer].row > layers[this.layer].row && tmp[Layer].autoPrestige == true) {
            return
        }
        if (Layer && layers[Layer].row > layers[this.layer].row) {
            var listKeep = []
            var upgradeKeep = []
            if (hasUpgrade("Void", 11)) upgradeKeep.push(11)
            if (player.Collapser.unlocked) upgradeKeep.push(12)
            if (player.Generator.unlocked) upgradeKeep.push(15)
            if (hasUpgrade("Generator", 12)) {
                var upgradeList = [11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 34, 35]
                var keepValue = upgradeEffect("Generator", 12)
                for (let index = 0; index < upgradeList.length; index++) {
                    if (keepValue > index && hasUpgrade("Void", upgradeList[index])) upgradeKeep.push(upgradeList[index])
                }
            }
            layerDataReset("Void", listKeep)
            player.Void.upgrades = upgradeKeep;
        }
    },

    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title       : "V-Upgrade 11",
            description : "Produce 1 Void Point per second",
            cost        : new Decimal(1),
        },
        12: {
            title       : "V-Upgrade 12",
            description : "Unlock a new layer to collapse your Void Essence",
            cost        : new Decimal(3),
            unlocked    : function() {
                return hasUpgrade("Void", 11) || 
                       player.Collapser.unlocked
            },
            onPurchase  : function() {
                player.Collapser.unlocked = true
            }
        },
        13: {
            title       : "V-Upgrade 13",
            description : "Void Point boosts itself",
            cost        : new Decimal(20),
            effect      : function() {
                var eff = (player.points).add(1).log(12).div(3).add(1)
                if (hasUpgrade("Void", 24)) eff = eff.mul(upgradeEffect("Void", 24))
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    :  function() {
                return (hasUpgrade("Void", 12) && hasUpgrade("Collapser", 12)) || 
                        hasUpgrade("Void", 15) ||
                        player.Generator.unlocked
            }
        },
        14: {
            title       : "V-Upgrade 14",
            description : "Void Point boosts Void Essence gain",
            cost        : new Decimal(35),
            effect      : function() {
                var eff = (player.points).add(1).log(9.5).div(5).add(1)
                if (hasUpgrade("Collapser", 14)) eff = eff.mul(upgradeEffect("Collapser", 14))
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VE gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    :  function() {
                return hasUpgrade("Void", 13) || 
                       hasUpgrade("Void", 15) ||
                       player.Generator.unlocked
            }
        },
        15: {
            title       : "V-Upgrade 15",
            description : "Unlock a new layer to compress your Void Point",
            cost        : new Decimal(50),
            unlocked    : function() {
                return hasUpgrade("Void", 14) || 
                       hasUpgrade("Void", 15) || 
                       player.Generator.unlocked
            },
            onPurchase  : function() {
                player.Generator.unlocked = true
            }
        },
        21: {
            title       : "V-Upgrade 21",
            description : "G-Upgrade 11 is based on Void Essence",
            cost        : new Decimal(1000),
            effect      : function() {
                var eff = (player.Void.points).add(1).log(9.5).div(2.4).add(1)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>GU 11 effect x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    : function() {
                return hasUpgrade("Void", 15) && challengeCompletions("Leap", 11) >= 1
            }
        },
        22: {
            title       : "V-Upgrade 22",
            description : "Void Point boosts Leap Point gain",
            cost        : new Decimal(5000),
            effect      : function() {
                var eff = (player.points).pow(0.5).add(1).log(20).div(8).add(1)
                if (hasUpgrade("Void", 32)) eff = eff.mul(upgradeEffect("Void", 32))
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>LP gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    : function() {
                return hasUpgrade("Void", 21) && challengeCompletions("Leap", 11) >= 1
            }
        },
        23: {
            title       : "V-Upgrade 23",
            description : "Generator cost exponent is reduced based on Void Essence",
            cost        : new Decimal("2.5e4"),
            effect      : function() {
                var eff = (player.Void.points).add(1).log(9.5).div(252)
                eff = softcap(eff, new Decimal(0.015), 0.8)
                eff = softcap(eff, new Decimal(0.052), 0.55)
                eff = softcap(eff, new Decimal(0.096), 0.28)
                eff = softcap(eff, new Decimal(0.140), 0.1)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>Generator cost exponent -" + format(upgradeEffect(this.layer, this.id), 4)
            },
            unlocked    : function() {
                return hasUpgrade("Void", 22) && challengeCompletions("Leap", 11) >= 2
            }
        },
        24: {
            title       : "V-Upgrade 24",
            description : "Unlock a Generator upgrade, and improve V-Upgrade 13 based on Void Essence",
            cost        : new Decimal("5e4"),
            effect      : function() {
                var eff = (player.Void.points).pow(0.8).add(1).log(6).div(4).add(1)
                softcap(eff, new Decimal(4), 0.5)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VU 13 effect x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    : function() {
                return hasUpgrade("Void", 23) && challengeCompletions("Leap", 11) >= 2
            }
        },
        25: {
            title       : "V-Upgrade 25",
            description : "Leap Point boosts Void Point gain",
            cost        : new Decimal("5e6"),
            effect      : function() {
                var eff = (player.Leap.points).add(1).log(6).div(7).add(1)
                if (hasUpgrade("Void", 33)) eff = eff.mul(2)
                softcap(eff, new Decimal(4), 0.5)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    : function() {
                return hasUpgrade("Void", 24) && challengeCompletions("Leap", 11) >= 3
            }
        },
        31: {
            title       : "V-Upgrade 31",
            description : "Void Essence boosts Generator gain",
            cost        : new Decimal("2e7"),
            effect      : function() {
                var eff = (player.Void.points).add(1).log(1.57).pow(0.3).add(1).log(12).div(10).add(1)
                softcap(eff, new Decimal(1), 0.5)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>Generator gain x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    : function() {
                return hasUpgrade("Void", 25) && challengeCompletions("Leap", 11) >= 3
            }
        },
        32: {
            title       : "V-Upgrade 32",
            description : "Void Essence boosts V-Upgrade 22 effect",
            cost        : new Decimal("2.5e8"),
            effect      : function() {
                var eff = (player.Void.points).add(1).log(1.57).pow(0.6).add(1).log(8).add(1)
                softcap(eff, new Decimal(3), 0.5)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>VU 22 effect x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    : function() {
                return hasUpgrade("Void", 31) && challengeCompletions("Leap", 11) >= 4
            }
        },
        33: {
            title       : "V-Upgrade 33",
            description : "Unlock a Generator upgrade, and V-Upgrade 25 effect x2",
            cost        : new Decimal("5e8"),
            unlocked    : function() {
                return hasUpgrade("Void", 32) && challengeCompletions("Leap", 11) >= 4
            }
        }
    }
})