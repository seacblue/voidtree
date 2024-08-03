let modInfo = {
	name: "The Void Tree",
	id: "voidtree",
	author: "Seako",
	pointsName: "Void Point",
	modFiles: ["layers/void.js", 
               "layers/collapser.js", 
               "layers/generator.js",
               "layers/leap.js",
               "layers/photon.js",
               "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), // Used for hard resets and new players
	offlineLimit: 0  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.0",
	name: "You should start at somewhere",
}

let winText = `Congratulations! You have reached the end and beaten this game.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
    return hasUpgrade("Void", 11)
}

// Calculate points/sec!
function getPointGen() {
	if (!canGenPoints())
		return new Decimal(0)

	var gain = new Decimal(1)
    if (hasUpgrade("Collapser", 11)) gain = gain.mul(upgradeEffect("Collapser", 11))
    if (hasUpgrade("Collapser", 12)) gain = gain.mul(upgradeEffect("Collapser", 12))
    if (hasUpgrade("Void", 13)) gain = gain.mul(upgradeEffect("Void", 13))
    if (hasUpgrade("Generator", 11)) gain = gain.mul(upgradeEffect("Generator", 11))
    if (hasUpgrade("Leap", 11)) gain = gain.mul(upgradeEffect("Leap", 11))
    if (hasUpgrade("Leap", 12)) gain = gain.mul(upgradeEffect("Leap", 12))
    if (hasUpgrade("Leap", 13)) gain = gain.mul(upgradeEffect("Leap", 13))
    if (hasUpgrade("Leap", 14)) gain = gain.mul(upgradeEffect("Leap", 14)[0])
    if (hasUpgrade("Void", 25)) gain = gain.mul(upgradeEffect("Void", 25))
    if (hasUpgrade("Photon", 11)) gain = gain.mul(upgradeEffect("Photon", 11)[0])

    if (challengeCompletions("Leap", 11) > 0) gain = gain.mul(challengeEffect("Leap", 11)[0])
    
    if (inChallenge("Leap", 11) == true) {
        gain = gain.pow(tmp.Leap.c11des)
    }
    
    var realGain = gain
    var realGain100 = realGain.mul(100)
    if (player.points.gte(realGain100)) {
        var ratio = player.points.div(realGain100).max(1)
        realGain = realGain.div(ratio).div(ratio.log(1.13).max(1)).mul(ratio.mul(-1).add(2))
        realGain.min(gain)
        realGain.max(0)
    }

    return realGain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
    return (player.Photon.points.gte(1) || hasUpgrade("Photon", 11)) && 
           challengeCompletions("Leap", 11) >= 4 &&
           challengeCompletions("Leap", 12) >= 2
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

let changelog = 
    `<h1>Changelog:</h1><br><br>
    <h3 style='color: #32CD32'>Endgame:</h3><br> 1 Photon, 4 LC 11 completions, 2 LC 12 completions.<br><br>
	<h3 style='color: #CC6600'>v0.1.0</h3><h3> - You should start at somewhere</h3> <b style='color: #808080'>[2024/8/3]</b><br>
	- Add 5 layers.<br>
    - Add 2 challenges.`