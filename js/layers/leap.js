addLayer("Leap", {
    name         : "Leap",
    symbol       : "L",
    resource     : "Leap Point",
    baseResource : "Void Point",
    color        : "#483D8B",
    type         : "normal",
    exponent     : 0.35,
    position     : 0,
    row          : 2,
    branches     : ["Collapser", "Generator"],
    requires     : new Decimal("1e4"),

    resetDescription : "Merge Void Point for ",

    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function() {
                    if (tmp.Leap.passiveGeneration == 0)
                        return 'You have ' + format(player.points) + ' Void Point'
                    else
                        return 'You passively generates ' + 
                            format(tmp.Leap.resetGain * tmp.Leap.passiveGeneration) +
                            ' Leap Point per second'}],
                "blank",
                "upgrades",
            ],
            unlocked() { return hasUpgrade("Leap", 15) || challengeCompletions("Leap", 11) > 0 }
        },
        "Challenges": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function() {
                    if (tmp.Leap.passiveGeneration == 0)
                        return 'You have ' + format(player.points) + ' Void Point'
                    else
                        return 'You passively generates ' + 
                            format(tmp.Leap.resetGain * tmp.Leap.passiveGeneration) +
                            ' Leap Point per second'}],
                "blank",
                "challenges",
            ],
            unlocked() { return hasUpgrade("Leap", 15) || challengeCompletions("Leap", 11) > 0 }
        }
    },
    
    hotkeys: [
        {
            key: "l",
            description: "L: Perform a Void Leap reset",
            onPress() {
                if (player.Leap.unlocked) doReset("Leap")
            },
            unlocked() { return player.Leap.unlocked }
        }
    ],

    layerShown() {
        if (player.Generator.points.gte(3) || player.Leap.unlocked) {
            player.Leap.unlocked = true
            return true
        }
        return false
    },

    startData() {    
        return {
        unlocked: false,
        points: new Decimal(0),
        resetTime: 0
        }
    },
    
    baseAmount() {
        return player.points
    },
    
    gainMult() {
        var value = new Decimal(1)
        if (hasUpgrade("Void", 22)) value = value.mul(upgradeEffect("Void", 22))
        if (hasUpgrade("Photon", 11)) value = value.mul(upgradeEffect("Photon", 11)[2])
        return value
    },
    
    gainExp() {
        return new Decimal(1)
    },
    
    update(diff) {
        player.Leap.resetTime = player.Leap.resetTime + diff
    },

    passiveGeneration : function() {
        if (hasUpgrade("Leap", 32)) {
            return upgradeEffect("Leap", 32) / 100
        }
        return 0
    },

    doReset(Layer) {
        if (Layer && layers[Layer].row > layers[this.layer].row) {
            var listKeep = []
            var upgradeKeep = []
            if (hasUpgrade("Leap", 34) && hasUpgrade("Leap", 21)) upgradeKeep.push(21)
            listKeep.push("challenges")
            layerDataReset("Leap", listKeep)
            player.Leap.upgrades = upgradeKeep;
        }
    },
    
    upgrades: {
        rows: 5,
        cols: 5,
        11: {
            title       : "L-Upgrade 11",
            description : "Time played during this leap boosts Void Point gain",
            cost        : new Decimal(1),
            effect      : function() {
                return Math.pow(player.Leap.resetTime + 1, 0.17)
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        12: {
            title       : "L-Upgrade 12",
            description : "Generator boosts Void Point gain",
            cost        : new Decimal(1),
            effect      : function() {
                return (player.Generator.points).add(2).log(2).div(1.5).add(1)
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        13: {
            title       : "L-Upgrade 13",
            description : "Void Point boosts itself",
            cost        : new Decimal(1),
            effect      : function() {
                return (player.points).add(1).log(7.5).div(2.1).add(1)
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id))
            }
        },
        14: {
            title       : "L-Upgrade 14",
            description : "Leap Point boosts Void Point & Void Essence gain",
            cost        : new Decimal(3),
            effect      : function() {
                var val1 = (player.Leap.points).add(2.5).log(9.5).div(2.1).add(1)
                var val2 = (player.Leap.points).add(1.6).log(13).div(2.4).add(1)
                if (hasUpgrade("Leap", 31)) {
                    val1 = val1.mul(upgradeEffect("Leap", 31))
                    val2 = val2.mul(upgradeEffect("Leap", 31))
                }
                return [val1, val2]
            },
            tooltip     : function() {
                return "Effect:<br>VP gain x" + format(upgradeEffect(this.layer, this.id)[0])
                     + "<br>VE gain x" + format(upgradeEffect(this.layer, this.id)[1])
            },
            unlocked    : function() {
                return hasUpgrade("Leap", 11) && hasUpgrade("Leap", 12) && hasUpgrade("Leap", 13)
            }
        },
        15: {
            title       : "L-Upgrade 15",
            description : "Unlock Leap Challenge 11",
            cost        : new Decimal(5),
            unlocked    : function() {
                return hasUpgrade("Leap", 14)
            }
        },
        21: {
            title       : "L-Upgrade 21",
            description : "Autogain Collapser & Generator, and they do not reset anything",
            cost        : new Decimal(15),
            unlocked    : function() {
                return (hasUpgrade("Leap", 15) && challengeCompletions("Leap", 11) >= 1) ||
                        hasUpgrade("Leap", 21)
            }
        },
        22: {
            title       : "L-Upgrade 22",
            description : "Keep C-Upgrades on Leap reset, and improve CU 13 effect to 100%",
            cost        : new Decimal(20),
            unlocked    : function() {
                return (hasUpgrade("Leap", 21) && challengeCompletions("Leap", 11) >= 1) ||
                        hasUpgrade("Leap", 22)
            }
        },
        23: {
            title       : "L-Upgrade 23",
            description : "Keep G-Upgrades on Leap reset, uncap GU 12 effect, and GU 12 effect is based on highest Generator",
            cost        : new Decimal(40),
            unlocked    : function() {
                return (hasUpgrade("Leap", 22) && challengeCompletions("Leap", 11) >= 2) ||
                        hasUpgrade("Leap", 23)
            }
        },
        24: {
            title       : "L-Upgrade 24",
            description : "Collapser cost exponent is reduced based on Void Essence",
            cost        : new Decimal(50),
            effect      : function() {
                var eff = (player.Void.points).add(1).log(9.5).div(452)
                eff = softcap(eff, new Decimal(0.010), 0.7)
                eff = softcap(eff, new Decimal(0.045), 0.5)
                eff = softcap(eff, new Decimal(0.086), 0.3)
                eff = softcap(eff, new Decimal(0.120), 0.1)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>Collapser cost exponent -" + format(upgradeEffect(this.layer, this.id), 4)
            },
            unlocked    : function() {
                return (hasUpgrade("Leap", 23) && challengeCompletions("Leap", 11) >= 2) ||
                        hasUpgrade("Leap", 24)
            }
        },
        25: {
            title       : "L-Upgrade 25",
            description : "Unlock Leap Challenge 12",
            cost        : new Decimal(60),
            unlocked    : function() {
                return (hasUpgrade("Leap", 24) && challengeCompletions("Leap", 11) >= 2) ||
                        hasUpgrade("Leap", 25)
            }
        },
        31: {
            title       : "L-Upgrade 31",
            description : "Leap Point boosts L-Upgrade 14 effect",
            cost        : new Decimal(200),
            effect      : function() {
                var eff = (player.Leap.points).add(1).log(2.5).div(4).add(1)
                return eff
            },
            tooltip     : function() {
                return "Effect:<br>LU 14 effect x" + format(upgradeEffect(this.layer, this.id))
            },
            unlocked    : function() {
                return (hasUpgrade("Leap", 25) && challengeCompletions("Leap", 12) >= 2) ||
                        hasUpgrade("Leap", 31)
            }
        },
        32: {
            title       : "L-Upgrade 32",
            description : function() {
                return "Passively generates " + format(upgradeEffect(this.layer, this.id), 0) + "% of Leap Point per second"
            },
            cost        : new Decimal(300),
            effect      : function() {
                return 10
            },
            unlocked    : function() {
                return (hasUpgrade("Leap", 31) && challengeCompletions("Leap", 12) >= 2) ||
                        hasUpgrade("Leap", 32)
            }
        },
        33: {
            title       : "L-Upgrade 33",
            description : "Collapser & Generator cost exponent is reduced based on each other",
            cost        : new Decimal(2000),
            effect      : function() {
                var eff1 = (player.Generator.points).add(1).log(1.5).div(352)
                eff1 = softcap(eff1, new Decimal(0.010), 0.7)
                eff1 = softcap(eff1, new Decimal(0.045), 0.5)
                eff1 = softcap(eff1, new Decimal(0.086), 0.3)
                eff1 = softcap(eff1, new Decimal(0.120), 0.1)
                
                var eff2 = (player.Collapser.points).add(1).log(1.5).div(252)
                eff2 = softcap(eff2, new Decimal(0.010), 0.7)
                eff2 = softcap(eff2, new Decimal(0.045), 0.5)
                eff2 = softcap(eff2, new Decimal(0.086), 0.3)
                eff2 = softcap(eff2, new Decimal(0.120), 0.1)
                return [eff1, eff2]
            },
            tooltip     : function() {
                return "Effect:<br>Collapser cost exponent -" + 
                       format(upgradeEffect(this.layer, this.id)[0], 4) +
                       "<br>Generator cost exponent -" +
                       format(upgradeEffect(this.layer, this.id)[1], 4)
            },
            unlocked    : function() {
                return (hasUpgrade("Leap", 32) && challengeCompletions("Leap", 12) >= 2) ||
                        hasUpgrade("Leap", 33)
            }
        },
        34: {
            title       : "L-Upgrade 34",
            description : "Unlock a new layer to extract your Leap Point, and keep L-Upgrade 21 when resetting",
            cost        : new Decimal("1.5e4"),
            unlocked    : function() {
                return (hasUpgrade("Leap", 33) && 
                        challengeCompletions("Leap", 12) >= 2 &&
                        challengeCompletions("Leap", 11) >= 4) ||
                        hasUpgrade("Leap", 34)
            }
        },
        35: {
            title       : "L-Upgrade 35",
            description : "Unlock Leap Challenge 21",
            cost        : new Decimal("1e6"),
            unlocked    : function() {
                return (hasUpgrade("Leap", 34) && 
                        challengeCompletions("Leap", 12) >= 2 &&
                        challengeCompletions("Leap", 11) >= 4) ||
                        hasUpgrade("Leap", 35)
            }
        }
    },

    c11des() {
        var valList = [0.75, 0.65, 0.55, 0.45, 0.35, 0]
        return valList[challengeCompletions(this.layer, 11)]
    },
    c11goal() {
        var valList1 = [7, 11, 15, 18, 999, 1]
        var valList2 = [5, 7, 7, 7, 999, 1]
        return [valList1[challengeCompletions(this.layer, 11)], 
                valList2[challengeCompletions(this.layer, 11)]]
    },

    c12des() {
        var valList1 = [1.25, 1.33, 1.40, 2.0, 2.3, 0]
        var valList2 = [2.15, 2.37, 2.66, 3.4, 4.2, 0]
        return [valList1[challengeCompletions(this.layer, 12)],
                valList2[challengeCompletions(this.layer, 12)]]
    },
    c12goal() {
        var valList1 = [10, 10, 999, 21, 25, 1]
        var valList2 = [4, 4, 999, 17, 22, 1]
        return [valList1[challengeCompletions(this.layer, 12)], 
                valList2[challengeCompletions(this.layer, 12)]]
    },

    challenges: {
        rows: 2,
        cols: 2,
        11: {
            name: "L-Challenge 11",
            challengeDescription() {
                return "[ " + challengeCompletions(this.layer, this.id) + 
                    "/" + this.completionLimit + " completions ]<br>" +
                    "Void Point produces ^" +
                    format(tmp.Leap.c11des) + "<br>"
            },
            goalDescription() {
                return format(tmp.Leap.c11goal[0], 0) + 
                       " Collapser & " + 
                       format(tmp.Leap.c11goal[1], 0) +
                       " Generator"
            },
            rewardEffect() {
                if (challengeCompletions(this.layer, 11) == 0) return [1, 0]
                var val1 = 9.5 - 0.14 * challengeCompletions(this.layer, 11)
                var val2 = 0.2 + (0.24 * challengeCompletions(this.layer, 11))
                var eff1 = (player.points).add(1).log(val1).mul(val2).add(1)
                var eff2 = 2 * challengeCompletions(this.layer, 11)
                return [eff1, eff2]
            },
            rewardDescription() {
                return "Void Point gives itself a " + 
                    format(challengeEffect(this.layer, this.id)[0]) + "x boost, and unlock " + 
                    format(challengeEffect(this.layer, this.id)[1], 0) + " more Void Essence upgrades"
            },
            canComplete() {
                return player.Collapser.points.gte(tmp.Leap.c11goal[0]) &&  
                       player.Generator.points.gte(tmp.Leap.c11goal[1])
            },
            completionLimit: 5
        },
        12: {
            name: "L-Challenge 12",
            challengeDescription() {
                return "[ " + challengeCompletions(this.layer, this.id) + 
                    "/" + this.completionLimit + " completions ]<br>" +
                    "Collapser cost exponent +" + format(tmp.Leap.c12des[0]) + 
                    ", Generator cost exponent +" + format(tmp.Leap.c12des[1])
            },
            goalDescription() {
                return format(tmp.Leap.c12goal[0], 0) + 
                       " Collapser & " + 
                       format(tmp.Leap.c12goal[1], 0) +
                       " Generator"
            },
            rewardEffect() {
                if (challengeCompletions(this.layer, 12) == 0) return [1, 1]
                var eff1 = 1 + 0.11 * challengeCompletions(this.layer, 12)
                var eff2 = 1 + 0.14 * challengeCompletions(this.layer, 12)

                return [eff1, eff2]
            },
            rewardDescription() {
                return "Collapser gain x" + 
                       format(challengeEffect(this.layer, this.id)[0]) + 
                       ", and Generator gain x" + 
                       format(challengeEffect(this.layer, this.id)[1])
            },
            canComplete() {
                return player.Collapser.points.gte(tmp.Leap.c12goal[0]) &&
                       player.Generator.points.gte(tmp.Leap.c12goal[1])
            },
            completionLimit: 5,
            unlocked    : function() {
                return hasUpgrade("Leap", 25) || challengeCompletions("Leap", 12) > 0
            }
        }
    }
})