/**
 * Pokemon Auto Chess Live Data Calculator - Injected Overlay
 * Draggable floating panel with live data extraction
 * 
 * @author Galliano Games
 * @version 3.2.2
 */

(function() {
  'use strict';

  // Prevent double injection
  if (window.__PACCalculatorInjected) return;
  window.__PACCalculatorInjected = true;

  // OPTIMIZATION: Console logging gating
  const DEBUG_MODE = false; // Set to true only for development

  if (DEBUG_MODE) console.log('🎮 PAC Calculator: Injecting overlay...');

  // ═══════════════════════════════════════════════════════════════════════════
  // POKEMON DATABASE (1060 pokemon with rarities)
  // ═══════════════════════════════════════════════════════════════════════════

const POKEMON_DATA = {
  "ABOMASNOW": { rarity: "epic", types: ["grass", "ice", "monster"], additional: false, regional: true, stars: 2 },
  "ABRA": { rarity: "rare", types: ["psychic", "human"], additional: false, regional: false, stars: 1 },
  "ABSOL": { rarity: "unique", types: ["wild", "dark"], additional: false, regional: false, stars: 1 },
  "AEGISLASH": { rarity: "rare", types: ["ghost", "steel", "artificial"], additional: false, regional: false, stars: 3 },
  "AEGISLASHBLADE": { rarity: "rare", types: ["ghost", "steel", "artificial"], additional: false, regional: false, stars: 1 },
  "AERODACTYL": { rarity: "unique", types: ["rock", "flying", "fossil"], additional: false, regional: false, stars: 1 },
  "AGGRON": { rarity: "common", types: ["steel", "monster", "rock"], additional: false, regional: false, stars: 3 },
  "AIPOM": { rarity: "uncommon", types: ["wild", "normal"], additional: false, regional: false, stars: 1 },
  "ALAKAZAM": { rarity: "rare", types: ["psychic", "human"], additional: false, regional: false, stars: 3 },
  "ALCREMIECARAMELSWIRL": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIELEMON": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIEMATCHA": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIEMINT": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIERAINBOWSWIRL": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIERUBY": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIERUBYSWIRL": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIESALTED": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALCREMIEVANILLA": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "ALOLANDIGLETT": { rarity: "uncommon", types: ["ground", "steel"], additional: true, regional: true, stars: 1 },
  "ALOLANDUGTRIO": { rarity: "uncommon", types: ["ground", "steel"], additional: true, regional: true, stars: 1 },
  "ALOLANEXEGGUTOR": { rarity: "epic", types: ["dragon", "flora", "psychic"], additional: true, regional: true, stars: 1 },
  "ALOLANGEODUDE": { rarity: "common", types: ["electric", "rock"], additional: false, regional: true, stars: 1 },
  "ALOLANGOLEM": { rarity: "common", types: ["electric", "rock"], additional: false, regional: true, stars: 1 },
  "ALOLANGRAVELER": { rarity: "common", types: ["electric", "rock"], additional: false, regional: true, stars: 1 },
  "ALOLANGRIMER": { rarity: "uncommon", types: ["poison", "dark", "amorphous"], additional: true, regional: true, stars: 1 },
  "ALOLANMAROWAK": { rarity: "epic", types: ["ground", "fire", "ghost"], additional: true, regional: true, stars: 1 },
  "ALOLANMEOWTH": { rarity: "rare", types: ["normal", "dark"], additional: true, regional: true, stars: 1 },
  "ALOLANMUK": { rarity: "uncommon", types: ["poison", "dark", "amorphous"], additional: true, regional: true, stars: 1 },
  "ALOLANNINETALES": { rarity: "rare", types: ["ice", "fairy"], additional: true, regional: true, stars: 1 },
  "ALOLANPERSIAN": { rarity: "rare", types: ["normal", "dark"], additional: true, regional: true, stars: 1 },
  "ALOLANRAICHU": { rarity: "common", types: ["electric", "fairy", "psychic"], additional: false, regional: true, stars: 1 },
  "ALOLANRATICATE": { rarity: "common", types: ["wild", "dark"], additional: false, regional: true, stars: 1 },
  "ALOLANRATTATA": { rarity: "common", types: ["wild", "dark"], additional: false, regional: true, stars: 1 },
  "ALOLANSANDSHREW": { rarity: "uncommon", types: ["ice", "steel"], additional: true, regional: true, stars: 1 },
  "ALOLANSANDSLASH": { rarity: "uncommon", types: ["ice", "steel"], additional: true, regional: true, stars: 1 },
  "ALOLANVULPIX": { rarity: "rare", types: ["ice", "fairy"], additional: true, regional: true, stars: 1 },
  "ALTARIA": { rarity: "epic", types: ["dragon", "fairy", "sound"], additional: true, regional: false, stars: 2 },
  "AMAURA": { rarity: "epic", types: ["fossil", "ice"], additional: true, regional: false, stars: 1 },
  "AMBIPOM": { rarity: "uncommon", types: ["wild", "normal"], additional: false, regional: false, stars: 2 },
  "AMPHAROS": { rarity: "common", types: ["electric", "field", "light"], additional: false, regional: false, stars: 3 },
  "ANNIHILAPE": { rarity: "epic", types: ["wild", "fighting", "ghost"], additional: false, regional: false, stars: 3 },
  "ANORITH": { rarity: "uncommon", types: ["fossil", "bug", "aquatic"], additional: true, regional: false, stars: 1 },
  "APPLETUN": { rarity: "unique", types: ["dragon", "gourmet", "grass"], additional: false, regional: false, stars: 1 },
  "APPLIN": { rarity: "unique", types: ["dragon", "gourmet", "grass"], additional: false, regional: false, stars: 1 },
  "ARAQUANID": { rarity: "uncommon", types: ["water", "bug", "amorphous"], additional: true, regional: false, stars: 2 },
  "ARBOK": { rarity: "uncommon", types: ["poison", "dark"], additional: true, regional: false, stars: 2 },
  "ARBOLIVA": { rarity: "common", types: ["grass", "normal", "gourmet"], additional: false, regional: false, stars: 3 },
  "ARCANINE": { rarity: "uncommon", types: ["fire", "field"], additional: true, regional: false, stars: 2 },
  "ARCEUS": { rarity: "legendary", types: ["none"], additional: false, regional: false, stars: 1 },
  "ARCHALUDON": { rarity: "unique", types: ["dragon", "steel", "electric"], additional: false, regional: false, stars: 1 },
  "ARCHEN": { rarity: "uncommon", types: ["rock", "flying", "fossil"], additional: true, regional: false, stars: 1 },
  "ARCHEOPS": { rarity: "uncommon", types: ["rock", "flying", "fossil"], additional: true, regional: false, stars: 2 },
  "ARCTIBAX": { rarity: "ultra", types: ["dragon", "ice"], additional: false, regional: false, stars: 2 },
  "ARCTOVISH": { rarity: "unique", types: ["ice", "aquatic", "fossil"], additional: false, regional: false, stars: 1 },
  "ARCTOZOLT": { rarity: "unique", types: ["electric", "ice", "fossil"], additional: false, regional: false, stars: 1 },
  "ARIADOS": { rarity: "uncommon", types: ["wild", "bug", "poison"], additional: false, regional: false, stars: 2 },
  "ARMALDO": { rarity: "uncommon", types: ["fossil", "bug", "aquatic"], additional: true, regional: false, stars: 2 },
  "ARMAROUGE": { rarity: "unique", types: ["fire", "psychic", "human"], additional: false, regional: false, stars: 1 },
  "ARON": { rarity: "common", types: ["steel", "monster", "rock"], additional: false, regional: false, stars: 1 },
  "ARROKUDA": { rarity: "special", types: ["water"], additional: false, regional: false, stars: 1 },
  "ARTICUNO": { rarity: "legendary", types: ["ice", "flying"], additional: false, regional: false, stars: 1 },
  "AUDINO": { rarity: "unique", types: ["normal", "sound"], additional: false, regional: false, stars: 1 },
  "AURORUS": { rarity: "epic", types: ["fossil", "ice"], additional: true, regional: false, stars: 2 },
  "AXEW": { rarity: "hatch", types: ["dragon"], additional: false, regional: false, stars: 1 },
  "AZELF": { rarity: "unique", types: ["psychic", "fairy"], additional: false, regional: false, stars: 1 },
  "AZUMARILL": { rarity: "common", types: ["water", "fairy"], additional: false, regional: false, stars: 3 },
  "AZURILL": { rarity: "common", types: ["water", "fairy", "baby"], additional: false, regional: false, stars: 1 },
  "BAGON": { rarity: "uncommon", types: ["dragon", "monster"], additional: false, regional: false, stars: 1 },
  "BALTOY": { rarity: "epic", types: ["ground", "psychic", "artificial"], additional: true, regional: false, stars: 1 },
  "BANETTE": { rarity: "epic", types: ["ghost", "artificial"], additional: true, regional: false, stars: 2 },
  "BARBARACLE": { rarity: "rare", types: ["rock", "water"], additional: true, regional: false, stars: 2 },
  "BARBOACH": { rarity: "epic", types: ["water", "ground"], additional: true, regional: false, stars: 1 },
  "BASCULEGIONFEMALE": { rarity: "unique", types: ["water", "ghost"], additional: false, regional: false, stars: 1 },
  "BASCULEGIONMALE": { rarity: "unique", types: ["water", "ghost"], additional: false, regional: false, stars: 1 },
  "BASCULINBLUE": { rarity: "unique", types: ["water", "wild"], additional: false, regional: false, stars: 1 },
  "BASCULINRED": { rarity: "unique", types: ["water", "wild"], additional: false, regional: false, stars: 1 },
  "BASCULINWHITE": { rarity: "unique", types: ["water", "ghost"], additional: false, regional: false, stars: 1 },
  "BASTIODON": { rarity: "rare", types: ["fossil", "steel"], additional: true, regional: false, stars: 2 },
  "BAXCALIBUR": { rarity: "ultra", types: ["dragon", "ice"], additional: false, regional: false, stars: 3 },
  "BAYLEEF": { rarity: "special", types: ["grass", "flora"], additional: false, regional: false, stars: 1 },
  "BEARTIC": { rarity: "epic", types: ["ice", "field", "aquatic"], additional: true, regional: false, stars: 2 },
  "BEAUTIFLY": { rarity: "epic", types: ["bug", "normal", "flying"], additional: false, regional: false, stars: 3 },
  "BEEDRILL": { rarity: "common", types: ["bug", "poison", "flying"], additional: false, regional: false, stars: 3 },
  "BEHEEYEM": { rarity: "rare", types: ["psychic", "monster", "light"], additional: true, regional: false, stars: 2 },
  "BELDUM": { rarity: "epic", types: ["psychic", "steel", "artificial"], additional: false, regional: false, stars: 1 },
  "BELLIBOLT": { rarity: "rare", types: ["electric", "light", "aquatic"], additional: true, regional: false, stars: 2 },
  "BELLOSSOM": { rarity: "special", types: ["flora", "grass", "sound"], additional: false, regional: false, stars: 1 },
  "BELLSPROUT": { rarity: "special", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 1 },
  "BEWEAR": { rarity: "epic", types: ["normal", "fighting"], additional: true, regional: false, stars: 2 },
  "BIBAREL": { rarity: "uncommon", types: ["normal", "aquatic"], additional: true, regional: false, stars: 2 },
  "BIDOOF": { rarity: "uncommon", types: ["normal", "aquatic"], additional: true, regional: false, stars: 1 },
  "BINACLE": { rarity: "rare", types: ["rock", "water"], additional: true, regional: false, stars: 1 },
  "BISHARP": { rarity: "ultra", types: ["dark", "steel"], additional: false, regional: false, stars: 2 },
  "BLACEPHALON": { rarity: "legendary", types: ["fire", "ghost", "human"], additional: false, regional: false, stars: 1 },
  "BLASTOISE": { rarity: "common", types: ["water", "field"], additional: false, regional: false, stars: 3 },
  "BLAZIKEN": { rarity: "rare", types: ["fire", "fighting", "flying"], additional: false, regional: false, stars: 3 },
  "BLIPBUG": { rarity: "common", types: ["bug", "psychic"], additional: false, regional: true, stars: 1 },
  "BLISSEY": { rarity: "ultra", types: ["normal", "fairy", "gourmet"], additional: false, regional: false, stars: 3 },
  "BOLDORE": { rarity: "epic", types: ["rock", "light"], additional: false, regional: false, stars: 2 },
  "BONSLEY": { rarity: "epic", types: ["rock", "flora", "baby"], additional: true, regional: false, stars: 1 },
  "BOUNSWEET": { rarity: "epic", types: ["grass", "fighting", "gourmet"], additional: false, regional: false, stars: 1 },
  "BRAIXEN": { rarity: "common", types: ["fire", "psychic", "human"], additional: false, regional: false, stars: 2 },
  "BRAVIARY": { rarity: "uncommon", types: ["wild", "flying"], additional: false, regional: true, stars: 2 },
  "BRELOOM": { rarity: "uncommon", types: ["grass", "fighting"], additional: true, regional: false, stars: 2 },
  "BRIONNE": { rarity: "hatch", types: ["water", "fairy", "sound"], additional: false, regional: false, stars: 1 },
  "BRONZONG": { rarity: "rare", types: ["steel", "psychic", "sound"], additional: true, regional: false, stars: 2 },
  "BRONZOR": { rarity: "rare", types: ["steel", "psychic"], additional: true, regional: false, stars: 1 },
  "BRUXISH": { rarity: "unique", types: ["water", "psychic"], additional: false, regional: false, stars: 1 },
  "BUDEW": { rarity: "epic", types: ["grass", "poison", "baby"], additional: false, regional: false, stars: 1 },
  "BUIZEL": { rarity: "epic", types: ["water", "aquatic", "field"], additional: true, regional: false, stars: 1 },
  "BULBASAUR": { rarity: "rare", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 1 },
  "BUNEARY": { rarity: "uncommon", types: ["normal", "fighting"], additional: false, regional: true, stars: 1 },
  "BURMYPLANT": { rarity: "rare", types: ["bug", "grass"], additional: false, regional: true, stars: 1 },
  "BURMYSANDY": { rarity: "rare", types: ["bug", "ground"], additional: false, regional: true, stars: 1 },
  "BURMYTRASH": { rarity: "rare", types: ["bug", "artificial"], additional: false, regional: true, stars: 1 },
  "BUTTERFREE": { rarity: "common", types: ["bug", "flying", "amorphous"], additional: false, regional: false, stars: 3 },
  "BUZZWOLE": { rarity: "legendary", types: ["bug", "fighting"], additional: false, regional: false, stars: 1 },
  "CACNEA": { rarity: "rare", types: ["grass", "dark", "human"], additional: true, regional: false, stars: 1 },
  "CACTURNE": { rarity: "rare", types: ["grass", "dark", "human"], additional: true, regional: false, stars: 2 },
  "CAMERUPT": { rarity: "epic", types: ["fire", "field", "ground"], additional: false, regional: true, stars: 2 },
  "CAPSAKID": { rarity: "uncommon", types: ["grass", "fire", "gourmet"], additional: true, regional: false, stars: 1 },
  "CARBINK": { rarity: "epic", types: ["fossil", "rock", "fairy"], additional: true, regional: false, stars: 1 },
  "CARNIVINE": { rarity: "unique", types: ["monster", "grass", "flora"], additional: false, regional: false, stars: 1 },
  "CARRACOSTA": { rarity: "unknown", types: ["fossil", "water"], additional: true, regional: false, stars: 1 },
  "CARVANHA": { rarity: "rare", types: ["water", "dark"], additional: true, regional: false, stars: 1 },
  "CASCOON": { rarity: "epic", types: ["bug", "poison"], additional: false, regional: true, stars: 2 },
  "CASTFORM": { rarity: "unique", types: ["artificial", "amorphous"], additional: false, regional: false, stars: 1 },
  "CASTFORMHAIL": { rarity: "unique", types: ["artificial", "ice", "amorphous"], additional: false, regional: false, stars: 1 },
  "CASTFORMRAIN": { rarity: "unique", types: ["artificial", "water", "amorphous"], additional: false, regional: false, stars: 1 },
  "CASTFORMSUN": { rarity: "unique", types: ["artificial", "fire", "amorphous"], additional: false, regional: false, stars: 1 },
  "CATERPIE": { rarity: "common", types: ["bug", "amorphous"], additional: false, regional: false, stars: 1 },
  "CELEBI": { rarity: "legendary", types: ["grass", "psychic", "flora"], additional: false, regional: false, stars: 1 },
  "CELESTEELA": { rarity: "legendary", types: ["steel", "flying", "grass"], additional: false, regional: false, stars: 1 },
  "CENTISKORCH": { rarity: "uncommon", types: ["fire", "bug"], additional: false, regional: true, stars: 2 },
  "CERULEDGE": { rarity: "unique", types: ["fire", "ghost", "human"], additional: false, regional: false, stars: 1 },
  "CHANDELURE": { rarity: "common", types: ["ghost", "fire", "light"], additional: false, regional: false, stars: 3 },
  "CHANSEY": { rarity: "ultra", types: ["normal", "fairy", "gourmet"], additional: false, regional: false, stars: 2 },
  "CHARCADET": { rarity: "unique", types: ["fire", "baby"], additional: false, regional: false, stars: 1 },
  "CHARIZARD": { rarity: "common", types: ["dragon", "fire", "flying"], additional: false, regional: false, stars: 3 },
  "CHARJABUG": { rarity: "hatch", types: ["bug", "electric"], additional: false, regional: false, stars: 1 },
  "CHARMANDER": { rarity: "common", types: ["dragon", "fire"], additional: false, regional: false, stars: 1 },
  "CHARMELEON": { rarity: "common", types: ["dragon", "fire"], additional: false, regional: false, stars: 2 },
  "CHATOT": { rarity: "unique", types: ["flying", "sound"], additional: false, regional: false, stars: 1 },
  "CHERRIM": { rarity: "epic", types: ["flora", "light", "gourmet"], additional: false, regional: true, stars: 2 },
  "CHERRIMSUNLIGHT": { rarity: "epic", types: ["flora", "light", "gourmet"], additional: false, regional: true, stars: 1 },
  "CHERUBI": { rarity: "epic", types: ["flora", "light", "gourmet"], additional: false, regional: false, stars: 1 },
  "CHESNAUGHT": { rarity: "common", types: ["grass", "fighting"], additional: false, regional: false, stars: 3 },
  "CHESPIN": { rarity: "common", types: ["grass", "fighting"], additional: false, regional: false, stars: 1 },
  "CHEWTLE": { rarity: "rare", types: ["aquatic", "rock", "monster"], additional: true, regional: false, stars: 1 },
  "CHIKORITA": { rarity: "special", types: ["grass", "flora"], additional: false, regional: false, stars: 1 },
  "CHIMCHAR": { rarity: "common", types: ["fire", "fighting", "human"], additional: false, regional: true, stars: 1 },
  "CHIMECHO": { rarity: "unique", types: ["sound", "psychic"], additional: false, regional: false, stars: 1 },
  "CHINCHOU": { rarity: "uncommon", types: ["water", "electric", "light"], additional: true, regional: false, stars: 1 },
  "CHINGLING": { rarity: "unique", types: ["sound", "psychic", "baby"], additional: false, regional: false, stars: 1 },
  "CHIYU": { rarity: "legendary", types: ["fire", "dark"], additional: false, regional: false, stars: 1 },
  "CINCCINO": { rarity: "uncommon", types: ["normal", "field", "sound"], additional: true, regional: false, stars: 2 },
  "CINDERACE": { rarity: "hatch", types: ["fire", "field", "human"], additional: false, regional: false, stars: 1 },
  "CLAMPERL": { rarity: "epic", types: ["fossil", "water"], additional: true, regional: false, stars: 1 },
  "CLAUNCHER": { rarity: "rare", types: ["water", "sound"], additional: true, regional: false, stars: 1 },
  "CLAWITZER": { rarity: "rare", types: ["water", "sound"], additional: true, regional: false, stars: 2 },
  "CLAYDOL": { rarity: "epic", types: ["ground", "psychic", "artificial"], additional: true, regional: false, stars: 2 },
  "CLEFABLE": { rarity: "uncommon", types: ["fairy", "normal", "light"], additional: false, regional: true, stars: 3 },
  "CLEFAIRY": { rarity: "uncommon", types: ["fairy", "normal", "light"], additional: false, regional: true, stars: 2 },
  "CLEFFA": { rarity: "uncommon", types: ["fairy", "normal", "baby"], additional: false, regional: true, stars: 1 },
  "CLOBBOPUS": { rarity: "uncommon", types: ["aquatic", "amorphous", "fighting"], additional: true, regional: false, stars: 1 },
  "CLODSIRE": { rarity: "rare", types: ["poison", "ground", "aquatic"], additional: true, regional: true, stars: 2 },
  "CLOYSTER": { rarity: "uncommon", types: ["water", "ice", "rock"], additional: true, regional: false, stars: 2 },
  "COBALION": { rarity: "legendary", types: ["steel", "fighting"], additional: false, regional: false, stars: 1 },
  "COFAGRIGUS": { rarity: "rare", types: ["ghost", "human"], additional: true, regional: false, stars: 1 },
  "COMBEE": { rarity: "epic", types: ["bug", "flora", "gourmet"], additional: true, regional: false, stars: 1 },
  "COMBUSKEN": { rarity: "rare", types: ["fire", "fighting", "flying"], additional: false, regional: false, stars: 2 },
  "COMFEY": { rarity: "unique", types: ["flora", "fairy"], additional: false, regional: false, stars: 1 },
  "CONKELDURR": { rarity: "ultra", types: ["fighting", "human"], additional: false, regional: false, stars: 3 },
  "CORPHISH": { rarity: "uncommon", types: ["aquatic", "dark"], additional: true, regional: false, stars: 1 },
  "CORSOLA": { rarity: "epic", types: ["rock", "aquatic"], additional: false, regional: true, stars: 1 },
  "CORVIKNIGHT": { rarity: "rare", types: ["steel", "flying"], additional: false, regional: true, stars: 3 },
  "CORVISQUIRE": { rarity: "rare", types: ["steel", "flying"], additional: false, regional: true, stars: 2 },
  "COSMOEM": { rarity: "unique", types: ["psychic", "light"], additional: false, regional: false, stars: 1 },
  "COSMOG": { rarity: "unique", types: ["psychic", "light"], additional: false, regional: false, stars: 1 },
  "COTTONEE": { rarity: "uncommon", types: ["grass", "fairy"], additional: true, regional: false, stars: 1 },
  "CRABOMINABLE": { rarity: "rare", types: ["ice", "fighting", "monster"], additional: true, regional: false, stars: 2 },
  "CRABRAWLER": { rarity: "rare", types: ["ice", "fighting", "monster"], additional: true, regional: false, stars: 1 },
  "CRADILY": { rarity: "rare", types: ["fossil", "grass", "flora"], additional: true, regional: false, stars: 2 },
  "CRAMORANT": { rarity: "unique", types: ["flying", "aquatic"], additional: false, regional: false, stars: 1 },
  "CRANIDOS": { rarity: "uncommon", types: ["fossil", "monster"], additional: true, regional: false, stars: 1 },
  "CRAWDAUNT": { rarity: "uncommon", types: ["aquatic", "dark"], additional: true, regional: false, stars: 2 },
  "CRESSELIA": { rarity: "legendary", types: ["psychic", "fairy", "light"], additional: false, regional: false, stars: 1 },
  "CROAGUNK": { rarity: "rare", types: ["poison", "fighting", "aquatic"], additional: true, regional: false, stars: 1 },
  "CROBAT": { rarity: "common", types: ["poison", "flying", "sound"], additional: false, regional: false, stars: 3 },
  "CROCALOR": { rarity: "epic", types: ["fire", "sound", "ghost"], additional: false, regional: false, stars: 2 },
  "CROCONAW": { rarity: "rare", types: ["water", "monster", "aquatic"], additional: false, regional: false, stars: 2 },
  "CRYOGONAL": { rarity: "unique", types: ["ice", "amorphous"], additional: false, regional: false, stars: 1 },
  "CUBCHOO": { rarity: "epic", types: ["ice", "field", "aquatic"], additional: true, regional: false, stars: 1 },
  "CUBONE": { rarity: "epic", types: ["ground", "ghost"], additional: true, regional: false, stars: 1 },
  "CURSOLA": { rarity: "epic", types: ["rock", "aquatic", "ghost"], additional: false, regional: true, stars: 2 },
  "CUTIEFLY": { rarity: "rare", types: ["bug", "fairy", "flora"], additional: false, regional: true, stars: 1 },
  "CYCLIZAR": { rarity: "unique", types: ["dragon", "normal"], additional: false, regional: false, stars: 1 },
  "CYNDAQUIL": { rarity: "uncommon", types: ["fire", "field"], additional: false, regional: false, stars: 1 },
  "DACHSBUN": { rarity: "rare", types: ["gourmet", "fairy", "field"], additional: true, regional: false, stars: 2 },
  "DARKRAI": { rarity: "legendary", types: ["dark", "ghost", "amorphous"], additional: false, regional: false, stars: 1 },
  "DARMANITAN": { rarity: "epic", types: ["wild", "fire", "psychic"], additional: false, regional: false, stars: 2 },
  "DARMANITANZEN": { rarity: "epic", types: ["wild", "fire", "psychic"], additional: false, regional: false, stars: 1 },
  "DARTIX": { rarity: "hatch", types: ["grass", "flying", "ghost"], additional: false, regional: false, stars: 1 },
  "DARUMAKA": { rarity: "epic", types: ["wild", "fire", "psychic"], additional: false, regional: false, stars: 1 },
  "DECIDUEYE": { rarity: "hatch", types: ["grass", "flying", "ghost"], additional: false, regional: false, stars: 1 },
  "DEDENNE": { rarity: "unique", types: ["electric", "fairy"], additional: false, regional: false, stars: 1 },
  "DEERLINGAUTUMN": { rarity: "rare", types: ["normal", "grass", "wild"], additional: true, regional: false, stars: 1 },
  "DEERLINGSPRING": { rarity: "rare", types: ["normal", "grass", "flora"], additional: true, regional: false, stars: 1 },
  "DEERLINGSUMMER": { rarity: "rare", types: ["normal", "grass", "gourmet"], additional: true, regional: false, stars: 1 },
  "DEERLINGWINTER": { rarity: "rare", types: ["normal", "grass", "ice"], additional: true, regional: false, stars: 1 },
  "DEINO": { rarity: "rare", types: ["dragon", "dark"], additional: false, regional: true, stars: 1 },
  "DELCATTY": { rarity: "uncommon", types: ["normal", "fairy", "field"], additional: true, regional: false, stars: 2 },
  "DELIBIRD": { rarity: "unique", types: ["ice", "flying", "field"], additional: false, regional: false, stars: 1 },
  "DELPHOX": { rarity: "common", types: ["fire", "psychic", "human"], additional: false, regional: false, stars: 3 },
  "DEOXYS": { rarity: "legendary", types: ["psychic", "amorphous", "human"], additional: false, regional: false, stars: 1 },
  "DEOXYSATTACK": { rarity: "legendary", types: ["psychic", "amorphous", "human"], additional: false, regional: false, stars: 1 },
  "DEOXYSDEFENSE": { rarity: "legendary", types: ["psychic", "amorphous", "human"], additional: false, regional: false, stars: 1 },
  "DEOXYSSPEED": { rarity: "legendary", types: ["psychic", "amorphous", "human"], additional: false, regional: false, stars: 1 },
  "DEWGONG": { rarity: "uncommon", types: ["ice", "aquatic"], additional: true, regional: false, stars: 2 },
  "DEWOTT": { rarity: "epic", types: ["water", "field", "fighting"], additional: false, regional: false, stars: 2 },
  "DEWPIDER": { rarity: "uncommon", types: ["water", "bug", "amorphous"], additional: true, regional: false, stars: 1 },
  "DHELMISE": { rarity: "unique", types: ["grass", "ghost", "steel"], additional: false, regional: false, stars: 1 },
  "DIALGA": { rarity: "legendary", types: ["dragon", "steel"], additional: false, regional: false, stars: 1 },
  "DIANCIE": { rarity: "epic", types: ["fossil", "rock", "fairy"], additional: true, regional: false, stars: 1 },
  "DIGLETT": { rarity: "uncommon", types: ["ground", "normal"], additional: true, regional: false, stars: 1 },
  "DIPPLIN": { rarity: "unique", types: ["dragon", "gourmet", "grass"], additional: false, regional: false, stars: 1 },
  "DITTO": { rarity: "special", types: ["amorphous"], additional: false, regional: false, stars: 1 },
  "DODRIO": { rarity: "epic", types: ["wild", "flying", "normal"], additional: false, regional: true, stars: 2 },
  "DODUO": { rarity: "epic", types: ["wild", "flying", "normal"], additional: false, regional: true, stars: 1 },
  "DOLLIV": { rarity: "common", types: ["grass", "normal", "gourmet"], additional: false, regional: false, stars: 2 },
  "DONPHAN": { rarity: "rare", types: ["wild", "ground"], additional: false, regional: false, stars: 2 },
  "DOTTLER": { rarity: "common", types: ["bug", "psychic"], additional: false, regional: true, stars: 2 },
  "DOUBLADE": { rarity: "rare", types: ["ghost", "steel", "artificial"], additional: false, regional: false, stars: 2 },
  "DRACOVISH": { rarity: "unique", types: ["dragon", "aquatic", "fossil"], additional: false, regional: false, stars: 1 },
  "DRACOZOLT": { rarity: "unique", types: ["dragon", "electric", "fossil"], additional: false, regional: false, stars: 1 },
  "DRAGALGE": { rarity: "uncommon", types: ["dragon", "poison", "aquatic"], additional: true, regional: false, stars: 2 },
  "DRAGAPULT": { rarity: "hatch", types: ["dragon", "ghost"], additional: false, regional: false, stars: 1 },
  "DRAGONAIR": { rarity: "rare", types: ["dragon", "flying", "aquatic"], additional: false, regional: false, stars: 2 },
  "DRAGONITE": { rarity: "rare", types: ["dragon", "flying", "aquatic"], additional: false, regional: false, stars: 3 },
  "DRAKLOAK": { rarity: "hatch", types: ["dragon", "ghost"], additional: false, regional: false, stars: 1 },
  "DRAMPA": { rarity: "unique", types: ["dragon", "normal"], additional: false, regional: false, stars: 1 },
  "DRAPION": { rarity: "epic", types: ["bug", "poison", "dark"], additional: true, regional: false, stars: 2 },
  "DRATINI": { rarity: "rare", types: ["dragon", "flying", "aquatic"], additional: false, regional: false, stars: 1 },
  "DREDNAW": { rarity: "rare", types: ["aquatic", "rock", "monster"], additional: true, regional: false, stars: 2 },
  "DREEPY": { rarity: "hatch", types: ["dragon", "ghost"], additional: false, regional: false, stars: 1 },
  "DRIFBLIM": { rarity: "rare", types: ["ghost", "flying", "amorphous"], additional: true, regional: false, stars: 2 },
  "DRIFLOON": { rarity: "rare", types: ["ghost", "flying", "amorphous"], additional: true, regional: false, stars: 1 },
  "DRILBUR": { rarity: "rare", types: ["ground", "steel"], additional: true, regional: false, stars: 1 },
  "DRIZZILE": { rarity: "ultra", types: ["water", "aquatic"], additional: false, regional: false, stars: 2 },
  "DROWZEE": { rarity: "epic", types: ["psychic", "human", "monster"], additional: false, regional: true, stars: 1 },
  "DRUDDIGON": { rarity: "unique", types: ["dragon", "wild", "monster"], additional: false, regional: false, stars: 1 },
  "DUDUNSPARCE": { rarity: "unique", types: [], additional: false, regional: false, stars: 1 },
  "DUDUNSPARSE": { rarity: "unknown", types: ["normal", "ground", "flying"], additional: false, regional: false, stars: 1 },
  "DUGTRIO": { rarity: "uncommon", types: ["ground", "normal"], additional: true, regional: false, stars: 2 },
  "DUNSPARCE": { rarity: "unique", types: ["normal", "ground", "flying"], additional: false, regional: false, stars: 1 },
  "DUOSION": { rarity: "ultra", types: ["psychic", "amorphous"], additional: false, regional: false, stars: 2 },
  "DURALUDON": { rarity: "unique", types: ["dragon", "steel"], additional: false, regional: false, stars: 1 },
  "DURANT": { rarity: "unique", types: ["steel", "bug"], additional: false, regional: false, stars: 1 },
  "DUSCLOPS": { rarity: "uncommon", types: ["dark", "ghost"], additional: false, regional: false, stars: 1 },
  "DUSKNOIR": { rarity: "uncommon", types: ["dark", "ghost"], additional: false, regional: false, stars: 1 },
  "DUSKULL": { rarity: "uncommon", types: ["dark", "ghost"], additional: false, regional: false, stars: 1 },
  "DUSTOX": { rarity: "epic", types: ["bug", "poison", "flying"], additional: false, regional: true, stars: 3 },
  "EELEKTRIK": { rarity: "common", types: ["electric", "aquatic", "amorphous"], additional: false, regional: true, stars: 2 },
  "EELEKTROSS": { rarity: "common", types: ["electric", "aquatic", "amorphous"], additional: false, regional: true, stars: 3 },
  "EEVEE": { rarity: "special", types: ["normal", "field"], additional: false, regional: false, stars: 1 },
  "EGG": { rarity: "special", types: ["none"], additional: false, regional: false, stars: 1 },
  "EKANS": { rarity: "uncommon", types: ["poison", "dark"], additional: true, regional: false, stars: 1 },
  "ELDEGOSS": { rarity: "uncommon", types: ["flora", "sound"], additional: false, regional: true, stars: 2 },
  "ELECTABUZZ": { rarity: "epic", types: ["electric", "artificial", "human"], additional: false, regional: false, stars: 2 },
  "ELECTIVIRE": { rarity: "epic", types: ["electric", "artificial", "human"], additional: false, regional: false, stars: 3 },
  "ELECTRIKE": { rarity: "rare", types: ["electric", "field"], additional: true, regional: false, stars: 1 },
  "ELECTRODE": { rarity: "uncommon", types: ["electric", "artificial"], additional: true, regional: false, stars: 2 },
  "ELEKID": { rarity: "epic", types: ["electric", "artificial", "baby"], additional: false, regional: false, stars: 1 },
  "ELGYEM": { rarity: "rare", types: ["psychic", "monster", "light"], additional: true, regional: false, stars: 1 },
  "EMBOAR": { rarity: "hatch", types: ["wild", "fire", "fighting"], additional: false, regional: false, stars: 1 },
  "EMOLGA": { rarity: "unique", types: ["electric", "flying"], additional: false, regional: false, stars: 1 },
  "EMPOLEON": { rarity: "uncommon", types: ["water", "ice", "steel"], additional: false, regional: false, stars: 3 },
  "ENAMORUS": { rarity: "legendary", types: ["flying", "fairy"], additional: false, regional: false, stars: 1 },
  "ENTEI": { rarity: "legendary", types: ["wild", "fire", "field"], additional: false, regional: false, stars: 1 },
  "ESPEON": { rarity: "special", types: ["psychic", "field"], additional: false, regional: false, stars: 1 },
  "ESPURR": { rarity: "uncommon", types: ["wild", "psychic", "field"], additional: false, regional: false, stars: 1 },
  "ETERNATUS": { rarity: "legendary", types: ["dragon", "poison", "fossil"], additional: false, regional: false, stars: 1 },
  "EXCADRILL": { rarity: "rare", types: ["ground", "steel"], additional: true, regional: false, stars: 2 },
  "EXEGGCUTE": { rarity: "epic", types: ["flora", "psychic"], additional: true, regional: false, stars: 1 },
  "EXEGGUTOR": { rarity: "epic", types: ["flora", "psychic"], additional: true, regional: false, stars: 2 },
  "EXPLOUD": { rarity: "rare", types: ["normal", "sound"], additional: false, regional: false, stars: 3 },
  "FALINKSBRASS": { rarity: "unique", types: ["fighting", "steel"], additional: false, regional: false, stars: 1 },
  "FALINKSTROOPER": { rarity: "special", types: ["fighting", "steel"], additional: false, regional: false, stars: 1 },
  "FARFETCHD": { rarity: "unique", types: ["flying", "gourmet", "normal"], additional: false, regional: false, stars: 1 },
  "FARIGIRAF": { rarity: "epic", types: ["normal", "psychic", "field"], additional: true, regional: false, stars: 2 },
  "FEAROW": { rarity: "common", types: ["wild", "flying"], additional: false, regional: false, stars: 2 },
  "FEEBAS": { rarity: "special", types: ["water"], additional: false, regional: false, stars: 1 },
  "FENNEKIN": { rarity: "common", types: ["fire", "psychic", "human"], additional: false, regional: false, stars: 1 },
  "FERALIGATR": { rarity: "rare", types: ["water", "monster", "aquatic"], additional: false, regional: false, stars: 3 },
  "FERROSEED": { rarity: "epic", types: ["grass", "steel"], additional: true, regional: false, stars: 1 },
  "FERROTHORN": { rarity: "epic", types: ["grass", "steel"], additional: true, regional: false, stars: 2 },
  "FEZANDIPITI": { rarity: "legendary", types: ["poison", "fairy", "sound"], additional: false, regional: false, stars: 1 },
  "FIDOUGH": { rarity: "rare", types: ["gourmet", "fairy", "field"], additional: true, regional: false, stars: 1 },
  "FINNEON": { rarity: "rare", types: ["water", "light"], additional: true, regional: false, stars: 1 },
  "FLABEBE": { rarity: "uncommon", types: ["fairy", "flora"], additional: false, regional: false, stars: 1 },
  "FLAFFY": { rarity: "common", types: ["electric", "field", "light"], additional: false, regional: false, stars: 2 },
  "FLAPPLE": { rarity: "unique", types: ["dragon", "gourmet", "grass"], additional: false, regional: false, stars: 1 },
  "FLAREON": { rarity: "special", types: ["fire", "field"], additional: false, regional: false, stars: 1 },
  "FLETCHINDER": { rarity: "ultra", types: ["flying", "fire"], additional: false, regional: false, stars: 2 },
  "FLETCHLING": { rarity: "ultra", types: ["flying", "fire"], additional: false, regional: false, stars: 1 },
  "FLOATZEL": { rarity: "epic", types: ["water", "aquatic", "field"], additional: true, regional: false, stars: 2 },
  "FLOETTE": { rarity: "uncommon", types: ["fairy", "flora"], additional: false, regional: false, stars: 2 },
  "FLORAGATO": { rarity: "common", types: ["grass", "flora", "dark"], additional: false, regional: false, stars: 2 },
  "FLORGES": { rarity: "uncommon", types: ["fairy", "flora"], additional: false, regional: false, stars: 3 },
  "FLUTTERMANE": { rarity: "unique", types: ["ghost", "fairy", "fossil"], additional: false, regional: false, stars: 1 },
  "FLYGON": { rarity: "rare", types: ["dragon", "bug", "ground"], additional: false, regional: false, stars: 3 },
  "FOMANTIS": { rarity: "rare", types: ["flora", "light", "fighting"], additional: true, regional: false, stars: 1 },
  "FORRETRESS": { rarity: "uncommon", types: ["bug", "steel"], additional: true, regional: false, stars: 2 },
  "FRAXURE": { rarity: "hatch", types: ["dragon"], additional: false, regional: false, stars: 1 },
  "FRIGIBAX": { rarity: "ultra", types: ["dragon", "ice"], additional: false, regional: false, stars: 1 },
  "FROAKIE": { rarity: "hatch", types: ["water", "aquatic", "dark"], additional: false, regional: false, stars: 1 },
  "FROGADIER": { rarity: "hatch", types: ["water", "aquatic", "dark"], additional: false, regional: false, stars: 1 },
  "FROSLASS": { rarity: "epic", types: ["ghost", "ice"], additional: false, regional: false, stars: 2 },
  "FROSMOTH": { rarity: "rare", types: ["bug", "ice"], additional: true, regional: false, stars: 2 },
  "FUECOCO": { rarity: "epic", types: ["fire", "sound", "ghost"], additional: false, regional: false, stars: 1 },
  "FURFROU": { rarity: "unique", types: ["normal", "field"], additional: false, regional: false, stars: 1 },
  "FURRET": { rarity: "rare", types: ["ground", "normal", "field"], additional: true, regional: false, stars: 2 },
  "GABITE": { rarity: "epic", types: ["dragon", "ground", "monster"], additional: false, regional: false, stars: 2 },
  "GALARCORSOLA": { rarity: "epic", types: ["rock", "aquatic", "ghost"], additional: false, regional: true, stars: 1 },
  "GALARIANARTICUNO": { rarity: "legendary", types: ["psychic", "flying"], additional: false, regional: true, stars: 1 },
  "GALARIANFARFETCHD": { rarity: "unique", types: ["flying", "gourmet", "fighting"], additional: false, regional: false, stars: 1 },
  "GALARIANLINOONE": { rarity: "rare", types: ["wild", "dark"], additional: false, regional: true, stars: 1 },
  "GALARIANMOLTRES": { rarity: "legendary", types: ["dark", "flying"], additional: false, regional: true, stars: 1 },
  "GALARIANPONYTA": { rarity: "epic", types: ["fairy", "psychic", "light"], additional: true, regional: true, stars: 1 },
  "GALARIANRAPIDASH": { rarity: "epic", types: ["fairy", "psychic", "light"], additional: true, regional: true, stars: 1 },
  "GALARIANSLOWBRO": { rarity: "uncommon", types: ["psychic", "poison"], additional: true, regional: true, stars: 1 },
  "GALARIANSLOWKING": { rarity: "uncommon", types: ["psychic", "poison"], additional: true, regional: true, stars: 1 },
  "GALARIANSLOWPOKE": { rarity: "uncommon", types: ["psychic", "poison"], additional: false, regional: true, stars: 1 },
  "GALARIANWEEZING": { rarity: "uncommon", types: ["poison", "artificial", "fairy"], additional: true, regional: true, stars: 1 },
  "GALARIANYAMASK": { rarity: "rare", types: ["ghost", "monster"], additional: true, regional: true, stars: 1 },
  "GALARIANZAPDOS": { rarity: "legendary", types: ["fighting", "flying"], additional: false, regional: true, stars: 1 },
  "GALARIANZIGZAGOON": { rarity: "rare", types: ["wild", "dark"], additional: false, regional: true, stars: 1 },
  "GALLADE": { rarity: "epic", types: ["psychic", "fighting", "human"], additional: false, regional: false, stars: 3 },
  "GALVANTULA": { rarity: "rare", types: ["bug", "electric"], additional: true, regional: false, stars: 2 },
  "GARBODOR": { rarity: "epic", types: ["poison", "artificial"], additional: true, regional: false, stars: 2 },
  "GARCHOMP": { rarity: "epic", types: ["dragon", "ground", "monster"], additional: false, regional: false, stars: 3 },
  "GARDEVOIR": { rarity: "epic", types: ["psychic", "fairy", "human"], additional: false, regional: false, stars: 3 },
  "GARGANACL": { rarity: "uncommon", types: ["rock", "gourmet"], additional: false, regional: false, stars: 3 },
  "GASTLY": { rarity: "ultra", types: ["ghost", "poison", "amorphous"], additional: false, regional: false, stars: 1 },
  "GASTRODONEASTSEA": { rarity: "epic", types: ["aquatic", "rock", "amorphous"], additional: false, regional: true, stars: 1 },
  "GASTRODONWESTSEA": { rarity: "epic", types: ["water", "ground", "amorphous"], additional: false, regional: true, stars: 1 },
  "GENESECT": { rarity: "legendary", types: ["bug", "steel", "artificial"], additional: false, regional: false, stars: 1 },
  "GENGAR": { rarity: "ultra", types: ["ghost", "poison", "amorphous"], additional: false, regional: false, stars: 3 },
  "GEODUDE": { rarity: "common", types: ["ground", "rock"], additional: false, regional: false, stars: 1 },
  "GHOLDENGO": { rarity: "unique", types: ["ghost", "steel"], additional: false, regional: false, stars: 1 },
  "GIBLE": { rarity: "epic", types: ["dragon", "ground", "monster"], additional: false, regional: false, stars: 1 },
  "GIGALITH": { rarity: "epic", types: ["rock", "light"], additional: false, regional: false, stars: 3 },
  "GIMMIGHOUL": { rarity: "unique", types: ["ghost", "steel"], additional: false, regional: false, stars: 1 },
  "GIRAFARIG": { rarity: "epic", types: ["normal", "psychic", "field"], additional: true, regional: false, stars: 1 },
  "GIRATINA": { rarity: "legendary", types: ["dragon", "ghost"], additional: false, regional: false, stars: 1 },
  "GLACEON": { rarity: "special", types: ["ice", "field"], additional: false, regional: false, stars: 1 },
  "GLALIE": { rarity: "epic", types: ["ghost", "ice"], additional: false, regional: false, stars: 2 },
  "GLAMEOW": { rarity: "uncommon", types: ["normal", "dark"], additional: true, regional: false, stars: 1 },
  "GLIGAR": { rarity: "epic", types: ["ground", "poison", "flying"], additional: true, regional: false, stars: 1 },
  "GLIMMET": { rarity: "rare", types: ["poison", "rock", "flora"], additional: true, regional: false, stars: 1 },
  "GLIMMORA": { rarity: "rare", types: ["poison", "rock", "flora"], additional: true, regional: false, stars: 2 },
  "GLISCOR": { rarity: "epic", types: ["ground", "poison", "flying"], additional: true, regional: false, stars: 2 },
  "GLOOM": { rarity: "special", types: ["flora", "poison", "grass"], additional: false, regional: false, stars: 1 },
  "GOLBAT": { rarity: "common", types: ["poison", "flying", "sound"], additional: false, regional: false, stars: 2 },
  "GOLDEEN": { rarity: "rare", types: ["water", "normal"], additional: true, regional: false, stars: 1 },
  "GOLDUCK": { rarity: "uncommon", types: ["water", "psychic"], additional: true, regional: false, stars: 2 },
  "GOLEM": { rarity: "common", types: ["ground", "rock"], additional: false, regional: false, stars: 3 },
  "GOLETT": { rarity: "rare", types: ["ground", "artificial", "ghost"], additional: true, regional: false, stars: 1 },
  "GOLISOPOD": { rarity: "epic", types: ["bug", "water", "monster"], additional: true, regional: false, stars: 2 },
  "GOLURK": { rarity: "rare", types: ["ground", "artificial", "ghost"], additional: true, regional: false, stars: 2 },
  "GOODRA": { rarity: "epic", types: ["dragon", "aquatic", "amorphous"], additional: false, regional: false, stars: 3 },
  "GOOMY": { rarity: "epic", types: ["dragon", "aquatic", "amorphous"], additional: false, regional: false, stars: 1 },
  "GOREBYSS": { rarity: "epic", types: ["fossil", "water", "psychic"], additional: true, regional: false, stars: 2 },
  "GOSSIFLEUR": { rarity: "uncommon", types: ["flora", "sound"], additional: false, regional: true, stars: 1 },
  "GOTHITA": { rarity: "hatch", types: ["psychic", "human"], additional: false, regional: false, stars: 1 },
  "GOTHITELLE": { rarity: "hatch", types: ["psychic", "human"], additional: false, regional: false, stars: 1 },
  "GOTHORITA": { rarity: "hatch", types: ["psychic", "human"], additional: false, regional: false, stars: 1 },
  "GOURGEIST": { rarity: "epic", types: ["ghost", "grass", "light"], additional: true, regional: false, stars: 2 },
  "GRANBULL": { rarity: "epic", types: ["fairy", "field"], additional: true, regional: false, stars: 2 },
  "GRAPPLOCT": { rarity: "uncommon", types: ["aquatic", "amorphous", "fighting"], additional: true, regional: false, stars: 2 },
  "GRAVELER": { rarity: "common", types: ["ground", "rock"], additional: false, regional: false, stars: 2 },
  "GREAVARD": { rarity: "uncommon", types: ["ghost", "rock", "field"], additional: true, regional: false, stars: 1 },
  "GRENINJA": { rarity: "hatch", types: ["water", "aquatic", "dark"], additional: false, regional: false, stars: 1 },
  "GRIMER": { rarity: "uncommon", types: ["poison", "monster", "amorphous"], additional: true, regional: false, stars: 1 },
  "GRIMMSNARL": { rarity: "uncommon", types: ["dark", "fairy", "human"], additional: false, regional: true, stars: 3 },
  "GROOKEY": { rarity: "ultra", types: ["sound", "grass"], additional: false, regional: false, stars: 1 },
  "GROTLE": { rarity: "rare", types: ["grass", "ground", "monster"], additional: false, regional: false, stars: 2 },
  "GROUDON": { rarity: "legendary", types: ["ground", "monster"], additional: false, regional: false, stars: 1 },
  "GROVYLE": { rarity: "uncommon", types: ["grass", "monster"], additional: false, regional: false, stars: 2 },
  "GROWLITHE": { rarity: "uncommon", types: ["fire", "field"], additional: true, regional: false, stars: 1 },
  "GRUBBIN": { rarity: "hatch", types: ["bug", "electric"], additional: false, regional: false, stars: 1 },
  "GRUMPIG": { rarity: "rare", types: ["psychic", "field"], additional: false, regional: true, stars: 2 },
  "GULPIN": { rarity: "epic", types: ["poison", "gourmet", "amorphous"], additional: true, regional: false, stars: 1 },
  "GURDURR": { rarity: "ultra", types: ["fighting", "human"], additional: false, regional: false, stars: 2 },
  "GUZZLORD": { rarity: "legendary", types: ["gourmet", "dark", "monster"], additional: false, regional: false, stars: 1 },
  "GYARADOS": { rarity: "special", types: ["dragon", "water", "flying"], additional: false, regional: false, stars: 1 },
  "HAKAMOO": { rarity: "epic", types: ["dragon", "fighting", "sound"], additional: false, regional: true, stars: 2 },
  "HAPPINY": { rarity: "ultra", types: ["normal", "fairy", "baby"], additional: false, regional: false, stars: 1 },
  "HARIYAMA": { rarity: "rare", types: ["fighting", "monster"], additional: true, regional: false, stars: 2 },
  "HATENNA": { rarity: "uncommon", types: ["fairy", "psychic"], additional: false, regional: false, stars: 1 },
  "HATTERENE": { rarity: "uncommon", types: ["fairy", "psychic"], additional: false, regional: false, stars: 3 },
  "HATTREM": { rarity: "uncommon", types: ["fairy", "psychic"], additional: false, regional: false, stars: 2 },
  "HAUNTER": { rarity: "ultra", types: ["ghost", "poison", "amorphous"], additional: false, regional: false, stars: 2 },
  "HAWLUCHA": { rarity: "unique", types: ["fighting", "flying", "human"], additional: false, regional: false, stars: 1 },
  "HAXORUS": { rarity: "hatch", types: ["dragon"], additional: false, regional: false, stars: 1 },
  "HEATMOR": { rarity: "unique", types: ["fire", "field"], additional: false, regional: false, stars: 1 },
  "HEATRAN": { rarity: "legendary", types: ["fire", "steel"], additional: false, regional: false, stars: 1 },
  "HELIOLISK": { rarity: "epic", types: ["normal", "electric", "light"], additional: true, regional: false, stars: 2 },
  "HELIOPTILE": { rarity: "epic", types: ["normal", "electric", "light"], additional: true, regional: false, stars: 1 },
  "HERACROSS": { rarity: "unique", types: ["bug", "fighting"], additional: false, regional: false, stars: 1 },
  "HERDIER": { rarity: "common", types: ["normal", "field"], additional: false, regional: false, stars: 2 },
  "HIPPODOWN": { rarity: "epic", types: ["ground", "normal"], additional: true, regional: false, stars: 2 },
  "HIPPOPOTAS": { rarity: "epic", types: ["ground", "normal"], additional: true, regional: false, stars: 1 },
  "HISUIANLILLIGANT": { rarity: "uncommon", types: ["grass", "fighting", "human"], additional: true, regional: true, stars: 1 },
  "HISUIANQWILFISH": { rarity: "unique", types: ["dark", "poison", "aquatic"], additional: false, regional: true, stars: 1 },
  "HISUIANTYPHLOSION": { rarity: "uncommon", types: ["fire", "field", "ghost"], additional: false, regional: true, stars: 1 },
  "HISUIARCANINE": { rarity: "uncommon", types: ["fire", "rock", "field"], additional: true, regional: true, stars: 1 },
  "HISUIELECTRODE": { rarity: "uncommon", types: ["electric", "grass", "fossil"], additional: true, regional: true, stars: 1 },
  "HISUIGOODRA": { rarity: "epic", types: ["dragon", "steel", "amorphous"], additional: false, regional: true, stars: 1 },
  "HISUIGROWLITHE": { rarity: "uncommon", types: ["fire", "rock", "field"], additional: true, regional: true, stars: 1 },
  "HISUISLIGGOO": { rarity: "epic", types: ["dragon", "steel", "amorphous"], additional: false, regional: true, stars: 1 },
  "HISUISNEASEL": { rarity: "epic", types: ["poison", "fighting", "monster"], additional: true, regional: true, stars: 1 },
  "HISUIVOLTORB": { rarity: "uncommon", types: ["electric", "grass", "fossil"], additional: true, regional: true, stars: 1 },
  "HISUIZOROARK": { rarity: "uncommon", types: ["normal", "ghost"], additional: true, regional: true, stars: 1 },
  "HISUIZORUA": { rarity: "uncommon", types: ["normal", "ghost"], additional: true, regional: true, stars: 1 },
  "HITMONCHAN": { rarity: "unique", types: ["fighting", "human"], additional: false, regional: false, stars: 1 },
  "HITMONLEE": { rarity: "unique", types: ["fighting", "human"], additional: false, regional: false, stars: 1 },
  "HITMONTOP": { rarity: "unique", types: ["fighting", "human"], additional: false, regional: false, stars: 1 },
  "HONCHKROW": { rarity: "epic", types: ["dark", "flying"], additional: true, regional: false, stars: 2 },
  "HONEDGE": { rarity: "rare", types: ["ghost", "steel", "artificial"], additional: false, regional: false, stars: 1 },
  "HOOH": { rarity: "legendary", types: ["fire", "flying", "light"], additional: false, regional: false, stars: 1 },
  "HOOPA": { rarity: "unique", types: ["psychic", "dark", "ghost"], additional: false, regional: false, stars: 1 },
  "HOOPAUNBOUND": { rarity: "unique", types: ["psychic", "dark", "ghost"], additional: false, regional: false, stars: 1 },
  "HOOTHOOT": { rarity: "uncommon", types: ["normal", "flying", "psychic"], additional: true, regional: false, stars: 1 },
  "HOPPIP": { rarity: "special", types: ["flying", "flora", "grass"], additional: false, regional: false, stars: 1 },
  "HORSEA": { rarity: "uncommon", types: ["dragon", "water"], additional: false, regional: false, stars: 1 },
  "HOUNDOOM": { rarity: "epic", types: ["fire", "dark"], additional: true, regional: false, stars: 2 },
  "HOUNDOUR": { rarity: "epic", types: ["fire", "dark"], additional: true, regional: false, stars: 1 },
  "HOUNDSTONE": { rarity: "uncommon", types: ["ghost", "rock", "field"], additional: true, regional: false, stars: 2 },
  "HUNTAIL": { rarity: "epic", types: ["fossil", "water", "dark"], additional: true, regional: false, stars: 2 },
  "HYDRAPPLE": { rarity: "unique", types: ["dragon", "gourmet", "grass"], additional: false, regional: false, stars: 1 },
  "HYDREIGON": { rarity: "rare", types: ["dragon", "dark"], additional: false, regional: true, stars: 3 },
  "HYPNO": { rarity: "epic", types: ["psychic", "human", "monster"], additional: false, regional: true, stars: 2 },
  "IGGLYBUFF": { rarity: "uncommon", types: ["normal", "fairy", "baby"], additional: false, regional: false, stars: 1 },
  "ILLUMISE": { rarity: "unique", types: ["flying", "bug", "light"], additional: false, regional: false, stars: 1 },
  "IMPIDIMP": { rarity: "uncommon", types: ["dark", "fairy", "human"], additional: false, regional: true, stars: 1 },
  "INCINEROAR": { rarity: "epic", types: ["fire", "dark", "field"], additional: false, regional: false, stars: 3 },
  "INDEEDEEFEMALE": { rarity: "unique", types: ["normal", "psychic", "human"], additional: false, regional: false, stars: 1 },
  "INDEEDEEMALE": { rarity: "unique", types: ["normal", "psychic", "human"], additional: false, regional: false, stars: 1 },
  "INFERNAPE": { rarity: "common", types: ["fire", "fighting", "human"], additional: false, regional: true, stars: 3 },
  "INKAY": { rarity: "epic", types: ["dark", "psychic", "aquatic"], additional: true, regional: false, stars: 1 },
  "INTELEON": { rarity: "ultra", types: ["water", "aquatic"], additional: false, regional: false, stars: 3 },
  "IRONBUNDLE": { rarity: "unique", types: ["ice", "water", "artificial"], additional: false, regional: false, stars: 1 },
  "IRONHANDS": { rarity: "unique", types: ["fighting", "artificial", "electric"], additional: false, regional: false, stars: 1 },
  "IRONTHORNS": { rarity: "unique", types: ["rock", "electric", "artificial"], additional: false, regional: false, stars: 1 },
  "IRONVALIANT": { rarity: "legendary", types: ["fighting", "fairy", "artificial"], additional: false, regional: false, stars: 1 },
  "IVYSAUR": { rarity: "rare", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 2 },
  "JANGMOO": { rarity: "epic", types: ["dragon", "fighting", "sound"], additional: false, regional: true, stars: 1 },
  "JIGGLYPUFF": { rarity: "uncommon", types: ["normal", "fairy", "sound"], additional: false, regional: false, stars: 2 },
  "JIRACHI": { rarity: "legendary", types: ["steel", "psychic", "sound"], additional: false, regional: false, stars: 1 },
  "JOLTEON": { rarity: "special", types: ["electric", "field"], additional: false, regional: false, stars: 1 },
  "JOLTIK": { rarity: "rare", types: ["bug", "electric"], additional: true, regional: false, stars: 1 },
  "JUMPLUFF": { rarity: "special", types: ["flying", "flora", "grass"], additional: false, regional: false, stars: 1 },
  "JYNX": { rarity: "uncommon", types: ["ice", "psychic", "human"], additional: true, regional: false, stars: 2 },
  "KABUTO": { rarity: "rare", types: ["fossil", "water"], additional: true, regional: false, stars: 1 },
  "KABUTOPS": { rarity: "rare", types: ["fossil", "water"], additional: true, regional: false, stars: 2 },
  "KADABRA": { rarity: "rare", types: ["psychic", "human"], additional: false, regional: false, stars: 2 },
  "KAKUNA": { rarity: "common", types: ["bug", "poison"], additional: false, regional: false, stars: 2 },
  "KANGASKHAN": { rarity: "unique", types: ["wild", "fighting", "normal"], additional: false, regional: false, stars: 1 },
  "KARTANA": { rarity: "legendary", types: ["steel", "grass"], additional: false, regional: false, stars: 1 },
  "KECLEON": { rarity: "unique", types: ["none"], additional: false, regional: false, stars: 1 },
  "KELDEO": { rarity: "legendary", types: ["aquatic", "fighting"], additional: false, regional: false, stars: 1 },
  "KILOWATTREL": { rarity: "epic", types: ["flying", "electric"], additional: true, regional: false, stars: 2 },
  "KINGAMBIT": { rarity: "ultra", types: ["dark", "steel"], additional: false, regional: false, stars: 3 },
  "KINGDRA": { rarity: "uncommon", types: ["dragon", "water"], additional: false, regional: false, stars: 3 },
  "KINGLER": { rarity: "uncommon", types: ["water", "normal"], additional: true, regional: false, stars: 2 },
  "KIRLIA": { rarity: "epic", types: ["psychic", "fairy", "human"], additional: false, regional: false, stars: 2 },
  "KLANG": { rarity: "common", types: ["steel", "artificial"], additional: false, regional: false, stars: 2 },
  "KLEAVOR": { rarity: "unique", types: ["bug", "rock"], additional: false, regional: true, stars: 1 },
  "KLEFKI": { rarity: "unique", types: ["steel", "fairy", "artificial"], additional: false, regional: false, stars: 1 },
  "KLINK": { rarity: "common", types: ["steel", "artificial"], additional: false, regional: false, stars: 1 },
  "KLINKLANG": { rarity: "common", types: ["steel", "artificial"], additional: false, regional: false, stars: 3 },
  "KOFFING": { rarity: "uncommon", types: ["poison", "artificial", "amorphous"], additional: false, regional: false, stars: 1 },
  "KOMMOO": { rarity: "epic", types: ["dragon", "fighting", "sound"], additional: false, regional: true, stars: 3 },
  "KRABBY": { rarity: "uncommon", types: ["water", "normal"], additional: true, regional: false, stars: 1 },
  "KRICKETOT": { rarity: "rare", types: ["bug", "sound"], additional: true, regional: false, stars: 1 },
  "KRICKETUNE": { rarity: "rare", types: ["bug", "sound"], additional: true, regional: false, stars: 2 },
  "KROKOROK": { rarity: "hatch", types: ["dark", "ground", "monster"], additional: false, regional: false, stars: 1 },
  "KROOKODILE": { rarity: "hatch", types: ["dark", "ground", "monster"], additional: false, regional: false, stars: 1 },
  "KUBFU": { rarity: "unique", types: ["fighting", "baby"], additional: false, regional: false, stars: 1 },
  "KYOGRE": { rarity: "legendary", types: ["water", "monster"], additional: false, regional: false, stars: 1 },
  "KYUREM": { rarity: "legendary", types: ["dragon", "ice"], additional: false, regional: false, stars: 1 },
  "LAIRON": { rarity: "common", types: ["steel", "monster", "rock"], additional: false, regional: false, stars: 2 },
  "LAMPENT": { rarity: "common", types: ["ghost", "fire", "light"], additional: false, regional: false, stars: 2 },
  "LANDORUS": { rarity: "legendary", types: ["flying", "ground"], additional: false, regional: false, stars: 1 },
  "LANTURN": { rarity: "uncommon", types: ["water", "electric", "light"], additional: true, regional: false, stars: 2 },
  "LAPRAS": { rarity: "unique", types: ["aquatic", "ice", "sound"], additional: false, regional: false, stars: 1 },
  "LARVESTA": { rarity: "epic", types: ["fire", "bug"], additional: true, regional: false, stars: 1 },
  "LARVITAR": { rarity: "rare", types: ["dark", "monster", "rock"], additional: false, regional: false, stars: 1 },
  "LATIAS": { rarity: "unique", types: ["dragon", "psychic"], additional: false, regional: false, stars: 1 },
  "LATIOS": { rarity: "unique", types: ["dragon", "psychic"], additional: false, regional: false, stars: 1 },
  "LEAFEON": { rarity: "special", types: ["grass", "field"], additional: false, regional: false, stars: 1 },
  "LEAVANNY": { rarity: "uncommon", types: ["grass", "bug"], additional: false, regional: false, stars: 3 },
  "LEDIAN": { rarity: "uncommon", types: ["bug", "fighting", "flying"], additional: true, regional: false, stars: 2 },
  "LEDYBA": { rarity: "uncommon", types: ["bug", "fighting", "flying"], additional: true, regional: false, stars: 1 },
  "LICKILICKY": { rarity: "uncommon", types: ["wild", "normal", "gourmet"], additional: false, regional: false, stars: 2 },
  "LICKITUNG": { rarity: "uncommon", types: ["wild", "normal", "gourmet"], additional: false, regional: false, stars: 1 },
  "LIEPARD": { rarity: "uncommon", types: ["dark", "field"], additional: true, regional: false, stars: 2 },
  "LILEEP": { rarity: "rare", types: ["fossil", "grass", "flora"], additional: true, regional: false, stars: 1 },
  "LILLIGANT": { rarity: "uncommon", types: ["grass", "flora", "human"], additional: true, regional: false, stars: 2 },
  "LILLIPUP": { rarity: "common", types: ["normal", "field"], additional: false, regional: false, stars: 1 },
  "LINOONE": { rarity: "rare", types: ["wild", "field"], additional: false, regional: false, stars: 2 },
  "LITTEN": { rarity: "epic", types: ["fire", "dark", "field"], additional: false, regional: false, stars: 1 },
  "LITWICK": { rarity: "common", types: ["ghost", "fire", "light"], additional: false, regional: false, stars: 1 },
  "LOKIX": { rarity: "rare", types: ["bug", "dark"], additional: true, regional: false, stars: 2 },
  "LOMBRE": { rarity: "rare", types: ["grass", "aquatic", "sound"], additional: false, regional: true, stars: 2 },
  "LOPUNNY": { rarity: "uncommon", types: ["normal", "fighting"], additional: false, regional: true, stars: 2 },
  "LOTAD": { rarity: "rare", types: ["grass", "aquatic", "sound"], additional: false, regional: true, stars: 1 },
  "LOUDRED": { rarity: "rare", types: ["normal", "sound"], additional: false, regional: false, stars: 2 },
  "LUCARIO": { rarity: "rare", types: ["fighting", "steel"], additional: true, regional: false, stars: 2 },
  "LUDICOLO": { rarity: "rare", types: ["grass", "aquatic", "sound"], additional: false, regional: true, stars: 3 },
  "LUGIA": { rarity: "legendary", types: ["aquatic", "flying", "psychic"], additional: false, regional: false, stars: 1 },
  "LUMINEON": { rarity: "rare", types: ["water", "light"], additional: true, regional: false, stars: 2 },
  "LUNALA": { rarity: "legendary", types: ["psychic", "light", "ghost"], additional: false, regional: false, stars: 1 },
  "LUNATONE": { rarity: "unique", types: ["rock", "psychic", "dark"], additional: false, regional: false, stars: 1 },
  "LURANTIS": { rarity: "rare", types: ["flora", "light", "fighting"], additional: true, regional: false, stars: 2 },
  "LUVDISC": { rarity: "unique", types: ["water", "aquatic"], additional: false, regional: false, stars: 1 },
  "LUXIO": { rarity: "ultra", types: ["electric", "field", "light"], additional: false, regional: false, stars: 2 },
  "LUXRAY": { rarity: "ultra", types: ["electric", "field", "light"], additional: false, regional: false, stars: 3 },
  "LYCANROCDAY": { rarity: "epic", types: ["wild", "rock", "light"], additional: false, regional: false, stars: 2 },
  "LYCANROCDUSK": { rarity: "epic", types: ["wild", "rock"], additional: false, regional: false, stars: 1 },
  "LYCANROCNIGHT": { rarity: "epic", types: ["wild", "rock", "dark"], additional: false, regional: false, stars: 1 },
  "MACHAMP": { rarity: "uncommon", types: ["fighting", "human"], additional: false, regional: false, stars: 3 },
  "MACHOKE": { rarity: "uncommon", types: ["fighting", "human"], additional: false, regional: false, stars: 2 },
  "MACHOP": { rarity: "uncommon", types: ["fighting", "human"], additional: false, regional: false, stars: 1 },
  "MAGBY": { rarity: "rare", types: ["fire", "human", "baby"], additional: false, regional: false, stars: 1 },
  "MAGCARGO": { rarity: "rare", types: ["fire", "rock", "amorphous"], additional: true, regional: false, stars: 2 },
  "MAGEARNA": { rarity: "legendary", types: ["steel", "fairy", "artificial"], additional: false, regional: false, stars: 1 },
  "MAGIKARP": { rarity: "special", types: ["water"], additional: false, regional: false, stars: 1 },
  "MAGMAR": { rarity: "rare", types: ["fire", "human"], additional: false, regional: false, stars: 2 },
  "MAGMORTAR": { rarity: "rare", types: ["fire", "human"], additional: false, regional: false, stars: 3 },
  "MAGNEMITE": { rarity: "uncommon", types: ["electric", "steel"], additional: false, regional: false, stars: 1 },
  "MAGNETON": { rarity: "uncommon", types: ["electric", "steel"], additional: false, regional: false, stars: 2 },
  "MAGNEZONE": { rarity: "uncommon", types: ["electric", "steel"], additional: false, regional: false, stars: 3 },
  "MAKUHITA": { rarity: "rare", types: ["fighting", "monster"], additional: true, regional: false, stars: 1 },
  "MALAMAR": { rarity: "epic", types: ["dark", "psychic", "aquatic"], additional: true, regional: false, stars: 2 },
  "MAMOSWINE": { rarity: "common", types: ["ground", "ice"], additional: false, regional: false, stars: 3 },
  "MANAPHY": { rarity: "legendary", types: ["water", "aquatic", "amorphous"], additional: false, regional: false, stars: 1 },
  "MANDIBUZZ": { rarity: "rare", types: ["dark", "flying"], additional: true, regional: false, stars: 2 },
  "MANECTRIC": { rarity: "rare", types: ["electric", "field"], additional: true, regional: false, stars: 2 },
  "MANKEY": { rarity: "epic", types: ["wild", "fighting"], additional: false, regional: false, stars: 1 },
  "MANTINE": { rarity: "unique", types: ["water", "flying"], additional: false, regional: false, stars: 1 },
  "MANTYKE": { rarity: "unique", types: ["baby", "water", "flying"], additional: false, regional: false, stars: 1 },
  "MARACTUS": { rarity: "unique", types: ["grass", "sound", "flora"], additional: false, regional: false, stars: 1 },
  "MAREEP": { rarity: "common", types: ["electric", "field", "light"], additional: false, regional: false, stars: 1 },
  "MARILL": { rarity: "common", types: ["water", "fairy"], additional: false, regional: false, stars: 2 },
  "MAROWAK": { rarity: "epic", types: ["ground", "ghost"], additional: true, regional: false, stars: 2 },
  "MARSHADOW": { rarity: "legendary", types: ["ghost", "fighting"], additional: false, regional: false, stars: 1 },
  "MARSHTOMP": { rarity: "common", types: ["water", "ground"], additional: false, regional: true, stars: 2 },
  "MASQUERAIN": { rarity: "rare", types: ["bug", "aquatic", "flying"], additional: true, regional: false, stars: 2 },
  "MAUSHOLDFOUR": { rarity: "unique", types: ["normal", "fairy"], additional: false, regional: false, stars: 1 },
  "MAUSHOLDTHREE": { rarity: "unique", types: ["normal", "fairy"], additional: false, regional: false, stars: 1 },
  "MAWILE": { rarity: "unique", types: ["steel", "fairy", "monster"], additional: false, regional: false, stars: 1 },
  "MEDICHAM": { rarity: "epic", types: ["psychic", "human", "fighting"], additional: true, regional: false, stars: 2 },
  "MEDITITE": { rarity: "epic", types: ["psychic", "human", "fighting"], additional: true, regional: false, stars: 1 },
  "MEGAABOMASNOW": { rarity: "epic", types: ["grass", "ice", "monster"], additional: false, regional: true, stars: 1 },
  "MEGAALTARIA": { rarity: "epic", types: ["dragon", "fairy", "sound"], additional: false, regional: false, stars: 1 },
  "MEGABANETTE": { rarity: "epic", types: ["ghost", "artificial"], additional: false, regional: false, stars: 1 },
  "MEGACAMERUPT": { rarity: "epic", types: ["fire", "field", "ground"], additional: false, regional: true, stars: 1 },
  "MEGAHOUNDOOM": { rarity: "epic", types: ["fire", "dark"], additional: true, regional: false, stars: 1 },
  "MEGALOPUNNY": { rarity: "uncommon", types: ["normal", "fighting"], additional: false, regional: true, stars: 1 },
  "MEGAMANECTRIC": { rarity: "rare", types: ["electric", "field"], additional: false, regional: false, stars: 1 },
  "MEGANIUM": { rarity: "special", types: ["grass", "flora"], additional: false, regional: false, stars: 1 },
  "MEGARAYQUAZA": { rarity: "legendary", types: ["dragon", "flying"], additional: false, regional: false, stars: 1 },
  "MEGASABLEYE": { rarity: "unique", types: ["dark", "ghost"], additional: false, regional: false, stars: 1 },
  "MEGASTEELIX": { rarity: "epic", types: ["rock", "ground", "steel"], additional: true, regional: false, stars: 1 },
  "MELMETAL": { rarity: "legendary", types: ["steel", "amorphous"], additional: false, regional: false, stars: 1 },
  "MELOETTA": { rarity: "legendary", types: ["normal", "sound"], additional: false, regional: false, stars: 1 },
  "MELTAN": { rarity: "special", types: ["steel", "amorphous"], additional: false, regional: false, stars: 1 },
  "MEOWSCARADA": { rarity: "common", types: ["grass", "flora", "dark"], additional: false, regional: false, stars: 3 },
  "MEOWSTICFEMALE": { rarity: "uncommon", types: ["wild", "field", "psychic"], additional: false, regional: false, stars: 1 },
  "MEOWSTICMALE": { rarity: "uncommon", types: ["wild", "psychic", "field"], additional: false, regional: false, stars: 2 },
  "MEOWTH": { rarity: "rare", types: ["normal", "field"], additional: true, regional: false, stars: 1 },
  "MESPRIT": { rarity: "unique", types: ["psychic", "fairy"], additional: false, regional: false, stars: 1 },
  "METAGROSS": { rarity: "epic", types: ["psychic", "steel", "artificial"], additional: false, regional: false, stars: 3 },
  "METANG": { rarity: "epic", types: ["psychic", "steel", "artificial"], additional: false, regional: false, stars: 2 },
  "METAPOD": { rarity: "common", types: ["bug", "amorphous"], additional: false, regional: false, stars: 2 },
  "MEW": { rarity: "legendary", types: ["psychic", "amorphous"], additional: false, regional: false, stars: 1 },
  "MEWTWO": { rarity: "legendary", types: ["psychic", "monster", "artificial"], additional: false, regional: false, stars: 1 },
  "MIENFOO": { rarity: "rare", types: ["fighting", "field"], additional: true, regional: false, stars: 1 },
  "MIENSHAO": { rarity: "rare", types: ["fighting", "field"], additional: true, regional: false, stars: 2 },
  "MIGHTYENA": { rarity: "rare", types: ["wild", "dark"], additional: false, regional: false, stars: 2 },
  "MILCERY": { rarity: "unique", types: ["fairy", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "MILOTIC": { rarity: "special", types: ["dragon", "fairy", "water"], additional: false, regional: false, stars: 1 },
  "MILTANK": { rarity: "unique", types: ["normal", "gourmet", "field"], additional: false, regional: false, stars: 1 },
  "MIMEJR": { rarity: "uncommon", types: ["fairy", "psychic", "baby"], additional: true, regional: false, stars: 1 },
  "MIMIKYU": { rarity: "unique", types: ["ghost", "fairy", "amorphous"], additional: false, regional: false, stars: 1 },
  "MIMIKYUBUSTED": { rarity: "unique", types: ["ghost", "fairy", "amorphous"], additional: false, regional: false, stars: 1 },
  "MINCCINO": { rarity: "uncommon", types: ["normal", "field", "sound"], additional: true, regional: false, stars: 1 },
  "MINIOR": { rarity: "unique", types: ["flying", "rock"], additional: false, regional: false, stars: 1 },
  "MINIORKERNELBLUE": { rarity: "unique", types: ["flying", "rock"], additional: false, regional: false, stars: 1 },
  "MINIORKERNELGREEN": { rarity: "unique", types: ["flying", "rock"], additional: false, regional: false, stars: 1 },
  "MINIORKERNELORANGE": { rarity: "unique", types: ["flying", "rock"], additional: false, regional: false, stars: 1 },
  "MINIORKERNELRED": { rarity: "unique", types: ["flying", "rock"], additional: false, regional: false, stars: 1 },
  "MINUN": { rarity: "unique", types: ["electric", "field"], additional: false, regional: false, stars: 1 },
  "MISDREAVUS": { rarity: "epic", types: ["ghost", "fairy", "amorphous"], additional: true, regional: false, stars: 1 },
  "MISMAGIUS": { rarity: "epic", types: ["ghost", "fairy", "amorphous"], additional: true, regional: false, stars: 2 },
  "MOLTRES": { rarity: "legendary", types: ["fire", "flying"], additional: false, regional: false, stars: 1 },
  "MONFERNO": { rarity: "common", types: ["fire", "fighting", "human"], additional: false, regional: true, stars: 2 },
  "MORGREM": { rarity: "uncommon", types: ["dark", "fairy", "human"], additional: false, regional: true, stars: 2 },
  "MORPEKO": { rarity: "unique", types: ["dark", "electric"], additional: false, regional: false, stars: 1 },
  "MORPEKOHANGRY": { rarity: "unique", types: ["dark", "electric"], additional: false, regional: false, stars: 1 },
  "MOTHIM": { rarity: "rare", types: ["bug", "flying"], additional: false, regional: true, stars: 1 },
  "MRMIME": { rarity: "uncommon", types: ["fairy", "psychic", "human"], additional: true, regional: false, stars: 2 },
  "MUDKIP": { rarity: "common", types: ["water", "ground"], additional: false, regional: true, stars: 1 },
  "MUK": { rarity: "uncommon", types: ["poison", "monster", "amorphous"], additional: true, regional: false, stars: 2 },
  "MUNCHLAX": { rarity: "epic", types: ["normal", "gourmet", "baby"], additional: true, regional: false, stars: 1 },
  "MUNKIDORI": { rarity: "legendary", types: ["poison", "psychic", "human"], additional: false, regional: false, stars: 1 },
  "MUNNA": { rarity: "rare", types: ["psychic", "field", "amorphous"], additional: true, regional: false, stars: 1 },
  "MURKROW": { rarity: "epic", types: ["dark", "flying"], additional: true, regional: false, stars: 1 },
  "MUSHARNA": { rarity: "rare", types: ["psychic", "field", "amorphous"], additional: true, regional: false, stars: 2 },
  "NACLI": { rarity: "uncommon", types: ["rock", "gourmet"], additional: false, regional: false, stars: 1 },
  "NACLSTACK": { rarity: "uncommon", types: ["rock", "gourmet"], additional: false, regional: false, stars: 2 },
  "NAGANADEL": { rarity: "legendary", types: ["dragon", "poison", "bug"], additional: false, regional: false, stars: 1 },
  "NATU": { rarity: "rare", types: ["psychic", "flying"], additional: true, regional: false, stars: 1 },
  "NECROZMA": { rarity: "legendary", types: ["light", "psychic"], additional: false, regional: false, stars: 1 },
  "NICKIT": { rarity: "rare", types: ["field", "dark"], additional: true, regional: false, stars: 1 },
  "NIDOKING": { rarity: "uncommon", types: ["poison", "field", "ground"], additional: false, regional: false, stars: 3 },
  "NIDOQUEEN": { rarity: "uncommon", types: ["poison", "field", "ground"], additional: false, regional: true, stars: 3 },
  "NIDORANF": { rarity: "uncommon", types: ["poison", "field", "ground"], additional: false, regional: true, stars: 1 },
  "NIDORANM": { rarity: "uncommon", types: ["poison", "field", "ground"], additional: false, regional: false, stars: 1 },
  "NIDORINA": { rarity: "uncommon", types: ["poison", "field", "ground"], additional: false, regional: true, stars: 2 },
  "NIDORINO": { rarity: "uncommon", types: ["poison", "field", "ground"], additional: false, regional: false, stars: 2 },
  "NIHILEGO": { rarity: "legendary", types: ["poison", "rock", "amorphous"], additional: false, regional: false, stars: 1 },
  "NINCADA": { rarity: "epic", types: ["bug"], additional: true, regional: false, stars: 1 },
  "NINETALES": { rarity: "rare", types: ["fire", "psychic"], additional: true, regional: false, stars: 2 },
  "NINJASK": { rarity: "epic", types: ["bug", "flying"], additional: true, regional: false, stars: 2 },
  "NOCTOWL": { rarity: "uncommon", types: ["normal", "flying", "psychic"], additional: true, regional: false, stars: 2 },
  "NOIBAT": { rarity: "uncommon", types: ["dragon", "sound", "flying"], additional: true, regional: false, stars: 1 },
  "NOIVERN": { rarity: "uncommon", types: ["dragon", "sound", "flying"], additional: true, regional: false, stars: 2 },
  "NOSEPASS": { rarity: "uncommon", types: ["rock", "steel"], additional: true, regional: false, stars: 1 },
  "NUMEL": { rarity: "epic", types: ["fire", "field", "ground"], additional: false, regional: true, stars: 1 },
  "NUZLEAF": { rarity: "common", types: ["grass", "dark"], additional: false, regional: true, stars: 2 },
  "NYMBLE": { rarity: "rare", types: ["bug", "dark"], additional: true, regional: false, stars: 1 },
  "OBSTAGOON": { rarity: "rare", types: ["wild", "dark", "sound"], additional: false, regional: true, stars: 3 },
  "OCTILLERY": { rarity: "special", types: ["wild", "water"], additional: false, regional: false, stars: 1 },
  "ODDISH": { rarity: "special", types: ["flora", "poison", "grass"], additional: false, regional: false, stars: 1 },
  "OGERPONCORNERSTONE": { rarity: "legendary", types: ["grass", "rock"], additional: false, regional: true, stars: 1 },
  "OGERPONCORNERSTONEMASK": { rarity: "legendary", types: ["grass", "rock"], additional: false, regional: true, stars: 1 },
  "OGERPONHEARTHFLAME": { rarity: "legendary", types: ["grass", "fire"], additional: false, regional: true, stars: 1 },
  "OGERPONHEARTHFLAMEMASK": { rarity: "legendary", types: ["grass", "fire"], additional: false, regional: true, stars: 1 },
  "OGERPONTEAL": { rarity: "legendary", types: ["grass", "flora"], additional: false, regional: true, stars: 1 },
  "OGERPONTEALMASK": { rarity: "legendary", types: ["grass", "flora"], additional: false, regional: true, stars: 1 },
  "OGERPONWELLSPRING": { rarity: "legendary", types: ["grass", "aquatic"], additional: false, regional: true, stars: 1 },
  "OGERPONWELLSPRINGMASK": { rarity: "legendary", types: ["grass", "aquatic"], additional: false, regional: true, stars: 1 },
  "OKIDOGI": { rarity: "legendary", types: ["wild", "fighting", "poison"], additional: false, regional: false, stars: 1 },
  "OMANYTE": { rarity: "uncommon", types: ["fossil", "water", "amorphous"], additional: true, regional: false, stars: 1 },
  "OMASTAR": { rarity: "uncommon", types: ["fossil", "water", "amorphous"], additional: true, regional: false, stars: 2 },
  "ONIX": { rarity: "epic", types: ["rock", "ground"], additional: true, regional: false, stars: 1 },
  "ORBEETLE": { rarity: "common", types: ["bug", "psychic", "flying"], additional: false, regional: true, stars: 3 },
  "ORIGINGIRATINA": { rarity: "legendary", types: ["dragon", "ghost", "flying"], additional: false, regional: false, stars: 1 },
  "ORTHWORM": { rarity: "unique", types: ["steel", "ground"], additional: false, regional: false, stars: 1 },
  "OSHAWOTT": { rarity: "epic", types: ["water", "field", "fighting"], additional: false, regional: false, stars: 1 },
  "OVERQWIL": { rarity: "unique", types: ["dark", "poison", "aquatic"], additional: false, regional: true, stars: 1 },
  "PACHIRISU": { rarity: "unique", types: ["electric", "normal"], additional: false, regional: false, stars: 1 },
  "PALDEAWOOPER": { rarity: "rare", types: ["poison", "ground", "aquatic"], additional: true, regional: true, stars: 1 },
  "PALKIA": { rarity: "legendary", types: ["dragon", "water"], additional: false, regional: false, stars: 1 },
  "PALOSSAND": { rarity: "uncommon", types: ["ghost", "ground", "amorphous"], additional: true, regional: false, stars: 1 },
  "PALPITOAD": { rarity: "hatch", types: ["aquatic", "ground", "sound"], additional: false, regional: false, stars: 1 },
  "PANCHAM": { rarity: "rare", types: ["fighting", "dark"], additional: true, regional: false, stars: 1 },
  "PANGORO": { rarity: "rare", types: ["fighting", "dark"], additional: true, regional: false, stars: 2 },
  "PARAS": { rarity: "rare", types: ["bug", "poison", "grass"], additional: true, regional: false, stars: 1 },
  "PARASECT": { rarity: "rare", types: ["bug", "poison", "grass"], additional: true, regional: false, stars: 2 },
  "PATRAT": { rarity: "rare", types: ["normal", "light"], additional: true, regional: false, stars: 1 },
  "PAWMI": { rarity: "rare", types: ["electric", "fighting"], additional: false, regional: false, stars: 1 },
  "PAWMO": { rarity: "rare", types: ["electric", "fighting"], additional: false, regional: false, stars: 2 },
  "PAWMOT": { rarity: "rare", types: ["electric", "fighting"], additional: false, regional: false, stars: 3 },
  "PAWNIARD": { rarity: "ultra", types: ["dark", "steel"], additional: false, regional: false, stars: 1 },
  "PECHARUNT": { rarity: "legendary", types: ["poison", "ghost", "gourmet"], additional: false, regional: false, stars: 1 },
  "PELIPPER": { rarity: "epic", types: ["water", "flying"], additional: true, regional: false, stars: 2 },
  "PERSIAN": { rarity: "rare", types: ["normal", "field"], additional: true, regional: false, stars: 2 },
  "PETILIL": { rarity: "uncommon", types: ["grass", "flora", "human"], additional: true, regional: false, stars: 1 },
  "PHANPY": { rarity: "rare", types: ["wild", "ground", "baby"], additional: false, regional: false, stars: 1 },
  "PHANTUMP": { rarity: "rare", types: ["ghost", "grass", "monster"], additional: true, regional: false, stars: 1 },
  "PHEROMOSA": { rarity: "legendary", types: ["bug", "fighting"], additional: false, regional: false, stars: 1 },
  "PHIONE": { rarity: "special", types: ["water", "aquatic", "amorphous"], additional: false, regional: false, stars: 1 },
  "PICHU": { rarity: "common", types: ["electric", "fairy", "baby"], additional: false, regional: false, stars: 1 },
  "PIDGEOT": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 3 },
  "PIDGEOTTO": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 2 },
  "PIDGEY": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 1 },
  "PIDOVE": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 1 },
  "PIGNITE": { rarity: "hatch", types: ["wild", "fire", "fighting"], additional: false, regional: false, stars: 1 },
  "PIKACHU": { rarity: "common", types: ["electric", "fairy"], additional: false, regional: false, stars: 2 },
  "PIKACHUSURFER": { rarity: "special", types: ["electric", "aquatic", "fairy"], additional: false, regional: false, stars: 1 },
  "PIKIPEK": { rarity: "unknown", types: ["normal", "flying", "sound"], additional: false, regional: false, stars: 1 },
  "PILLARCONCRETE": { rarity: "special", types: ["none"], additional: false, regional: false, stars: 1 },
  "PILLARIRON": { rarity: "special", types: ["none"], additional: false, regional: false, stars: 1 },
  "PILLARWOOD": { rarity: "special", types: ["none"], additional: false, regional: false, stars: 1 },
  "PILOSWINE": { rarity: "common", types: ["ground", "ice"], additional: false, regional: false, stars: 2 },
  "PINCURCHIN": { rarity: "unique", types: ["electric", "aquatic", "amorphous"], additional: false, regional: false, stars: 1 },
  "PINECO": { rarity: "uncommon", types: ["bug", "steel"], additional: true, regional: false, stars: 1 },
  "PINSIR": { rarity: "unique", types: ["wild", "bug"], additional: false, regional: false, stars: 1 },
  "PIPLUP": { rarity: "uncommon", types: ["water", "ice", "steel"], additional: false, regional: false, stars: 1 },
  "PIROUETTEMELOETTA": { rarity: "legendary", types: ["normal", "sound", "fighting"], additional: false, regional: false, stars: 1 },
  "PLUSLE": { rarity: "unique", types: ["electric", "field"], additional: false, regional: false, stars: 1 },
  "POIPOLE": { rarity: "unique", types: ["poison", "bug"], additional: false, regional: false, stars: 1 },
  "POLITOED": { rarity: "common", types: ["water", "aquatic", "sound"], additional: false, regional: false, stars: 3 },
  "POLIWAG": { rarity: "common", types: ["water", "aquatic", "fighting"], additional: false, regional: false, stars: 1 },
  "POLIWHIRL": { rarity: "common", types: ["water", "aquatic", "fighting"], additional: false, regional: false, stars: 2 },
  "POLIWRATH": { rarity: "common", types: ["water", "aquatic", "fighting"], additional: false, regional: false, stars: 3 },
  "POLTEAGEIST": { rarity: "uncommon", types: ["ghost", "artificial", "gourmet"], additional: true, regional: false, stars: 2 },
  "PONYTA": { rarity: "epic", types: ["fire", "field"], additional: true, regional: false, stars: 1 },
  "POOCHYENA": { rarity: "rare", types: ["wild", "dark"], additional: false, regional: false, stars: 1 },
  "POPPLIO": { rarity: "hatch", types: ["water", "fairy", "sound"], additional: false, regional: false, stars: 1 },
  "PORYGON": { rarity: "ultra", types: ["normal", "artificial"], additional: false, regional: false, stars: 1 },
  "PORYGON2": { rarity: "ultra", types: ["normal", "artificial"], additional: false, regional: false, stars: 2 },
  "PORYGONZ": { rarity: "ultra", types: ["normal", "artificial"], additional: false, regional: false, stars: 3 },
  "PRIMALGROUDON": { rarity: "legendary", types: ["ground", "monster", "fire"], additional: false, regional: false, stars: 1 },
  "PRIMALKYOGRE": { rarity: "legendary", types: ["water", "electric", "monster"], additional: false, regional: false, stars: 1 },
  "PRIMARINA": { rarity: "hatch", types: ["water", "fairy", "sound"], additional: false, regional: false, stars: 1 },
  "PRIMEAPE": { rarity: "epic", types: ["wild", "fighting"], additional: false, regional: false, stars: 2 },
  "PRINPLUP": { rarity: "uncommon", types: ["water", "ice", "steel"], additional: false, regional: false, stars: 2 },
  "PROBOPASS": { rarity: "uncommon", types: ["rock", "steel"], additional: true, regional: false, stars: 2 },
  "PSYDUCK": { rarity: "uncommon", types: ["water", "psychic"], additional: true, regional: false, stars: 1 },
  "PUMPKABOO": { rarity: "epic", types: ["ghost", "grass", "light"], additional: true, regional: false, stars: 1 },
  "PUPITAR": { rarity: "rare", types: ["dark", "monster", "rock"], additional: false, regional: false, stars: 2 },
  "PURRLOIN": { rarity: "uncommon", types: ["dark", "field"], additional: true, regional: false, stars: 1 },
  "PURUGLY": { rarity: "uncommon", types: ["normal", "dark"], additional: true, regional: false, stars: 2 },
  "PYUKUMUKU": { rarity: "unique", types: ["water", "poison", "amorphous"], additional: false, regional: false, stars: 1 },
  "QUAGSIRE": { rarity: "rare", types: ["aquatic", "ground"], additional: true, regional: false, stars: 2 },
  "QUILAVA": { rarity: "uncommon", types: ["fire", "field"], additional: false, regional: false, stars: 2 },
  "QUILLADIN": { rarity: "common", types: ["grass", "fighting"], additional: false, regional: false, stars: 2 },
  "QWILFISH": { rarity: "unique", types: ["water", "poison", "aquatic"], additional: false, regional: false, stars: 1 },
  "RABOOT": { rarity: "hatch", types: ["fire", "field", "human"], additional: false, regional: false, stars: 1 },
  "RAICHU": { rarity: "common", types: ["electric", "fairy"], additional: false, regional: false, stars: 3 },
  "RAIKOU": { rarity: "legendary", types: ["wild", "electric", "field"], additional: false, regional: false, stars: 1 },
  "RALTS": { rarity: "epic", types: ["psychic", "fairy", "human"], additional: false, regional: false, stars: 1 },
  "RAMPARDOS": { rarity: "uncommon", types: ["fossil", "monster"], additional: true, regional: false, stars: 2 },
  "RAPIDASH": { rarity: "epic", types: ["fire", "field"], additional: true, regional: false, stars: 2 },
  "RATICATE": { rarity: "common", types: ["wild", "normal"], additional: false, regional: false, stars: 2 },
  "RATTATA": { rarity: "common", types: ["wild", "normal"], additional: false, regional: false, stars: 1 },
  "RAYQUAZA": { rarity: "legendary", types: ["dragon", "flying"], additional: false, regional: false, stars: 1 },
  "REGICE": { rarity: "legendary", types: ["ice", "human", "fossil"], additional: false, regional: false, stars: 1 },
  "REGIDRAGO": { rarity: "legendary", types: ["dragon", "fossil", "monster"], additional: false, regional: false, stars: 1 },
  "REGIELEKI": { rarity: "legendary", types: ["electric", "human", "amorphous"], additional: false, regional: false, stars: 1 },
  "REGIGIGAS": { rarity: "legendary", types: ["normal", "human", "fossil"], additional: false, regional: false, stars: 1 },
  "REGIROCK": { rarity: "legendary", types: ["rock", "human", "fossil"], additional: false, regional: false, stars: 1 },
  "REGISTEEL": { rarity: "legendary", types: ["steel", "human", "fossil"], additional: false, regional: false, stars: 1 },
  "RELICANTH": { rarity: "unique", types: ["rock", "water", "fossil"], additional: false, regional: false, stars: 1 },
  "REMORAID": { rarity: "special", types: ["wild", "water"], additional: false, regional: false, stars: 1 },
  "RESHIRAM": { rarity: "legendary", types: ["dragon", "fire"], additional: false, regional: false, stars: 1 },
  "REUNICLUS": { rarity: "ultra", types: ["psychic", "amorphous"], additional: false, regional: false, stars: 3 },
  "REVAVROOM": { rarity: "uncommon", types: ["steel", "artificial", "poison"], additional: false, regional: true, stars: 2 },
  "RHYDON": { rarity: "ultra", types: ["ground", "monster", "rock"], additional: false, regional: false, stars: 2 },
  "RHYHORN": { rarity: "ultra", types: ["ground", "monster", "rock"], additional: false, regional: false, stars: 1 },
  "RHYPERIOR": { rarity: "ultra", types: ["ground", "monster", "rock"], additional: false, regional: false, stars: 3 },
  "RIBOMBEE": { rarity: "rare", types: ["bug", "fairy", "flora"], additional: false, regional: true, stars: 2 },
  "RILLABOOM": { rarity: "ultra", types: ["sound", "grass"], additional: false, regional: false, stars: 3 },
  "RIOLU": { rarity: "rare", types: ["fighting", "steel", "baby"], additional: true, regional: false, stars: 1 },
  "ROARINGMOON": { rarity: "legendary", types: ["dragon", "dark", "fossil"], additional: false, regional: false, stars: 1 },
  "ROCKRUFF": { rarity: "epic", types: ["wild", "rock"], additional: false, regional: false, stars: 1 },
  "ROGGENROLA": { rarity: "epic", types: ["rock", "light"], additional: false, regional: false, stars: 1 },
  "ROOKIDEE": { rarity: "rare", types: ["steel", "flying"], additional: false, regional: true, stars: 1 },
  "ROSELIA": { rarity: "epic", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 2 },
  "ROSERADE": { rarity: "epic", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 3 },
  "ROTOM": { rarity: "unique", types: ["electric", "artificial", "ghost"], additional: false, regional: false, stars: 1 },
  "ROTOMDRONE": { rarity: "unique", types: ["electric", "artificial", "light"], additional: false, regional: false, stars: 1 },
  "ROTOMFAN": { rarity: "unique", types: ["electric", "artificial", "flying"], additional: false, regional: false, stars: 1 },
  "ROTOMFROST": { rarity: "unique", types: ["electric", "artificial", "ice"], additional: false, regional: false, stars: 1 },
  "ROTOMHEAT": { rarity: "unique", types: ["electric", "artificial", "fire"], additional: false, regional: false, stars: 1 },
  "ROTOMMOW": { rarity: "unique", types: ["electric", "artificial", "grass"], additional: false, regional: false, stars: 1 },
  "ROTOMWASH": { rarity: "unique", types: ["electric", "artificial", "water"], additional: false, regional: false, stars: 1 },
  "ROWLET": { rarity: "hatch", types: ["grass", "flying", "ghost"], additional: false, regional: false, stars: 1 },
  "RUFFLET": { rarity: "uncommon", types: ["wild", "flying"], additional: false, regional: true, stars: 1 },
  "RUNERIGUS": { rarity: "rare", types: ["ghost", "monster"], additional: true, regional: true, stars: 1 },
  "SABLEYE": { rarity: "unique", types: ["dark", "ghost"], additional: false, regional: false, stars: 1 },
  "SALAMENCE": { rarity: "uncommon", types: ["dragon", "monster", "flying"], additional: false, regional: false, stars: 3 },
  "SALANDIT": { rarity: "rare", types: ["fire", "poison"], additional: true, regional: false, stars: 1 },
  "SALAZZLE": { rarity: "rare", types: ["fire", "poison"], additional: true, regional: false, stars: 2 },
  "SAMUROTT": { rarity: "epic", types: ["water", "field", "fighting"], additional: false, regional: false, stars: 3 },
  "SANDACONDA": { rarity: "rare", types: ["ground", "amorphous"], additional: true, regional: false, stars: 2 },
  "SANDILE": { rarity: "hatch", types: ["dark", "ground", "monster"], additional: false, regional: false, stars: 1 },
  "SANDSHREW": { rarity: "uncommon", types: ["ground", "normal"], additional: true, regional: false, stars: 1 },
  "SANDSLASH": { rarity: "uncommon", types: ["ground", "normal"], additional: true, regional: false, stars: 1 },
  "SANDYGAST": { rarity: "uncommon", types: ["ghost", "ground", "amorphous"], additional: true, regional: false, stars: 1 },
  "SAWSBUCKAUTUMN": { rarity: "rare", types: ["normal", "grass", "wild"], additional: true, regional: false, stars: 1 },
  "SAWSBUCKSPRING": { rarity: "rare", types: ["normal", "grass", "flora"], additional: true, regional: false, stars: 1 },
  "SAWSBUCKSUMMER": { rarity: "rare", types: ["normal", "grass", "gourmet"], additional: true, regional: false, stars: 1 },
  "SAWSBUCKWINTER": { rarity: "rare", types: ["normal", "grass", "ice"], additional: true, regional: false, stars: 1 },
  "SCEPTILE": { rarity: "uncommon", types: ["grass", "monster"], additional: false, regional: false, stars: 3 },
  "SCIZOR": { rarity: "unique", types: ["bug", "steel"], additional: false, regional: true, stars: 1 },
  "SCOLIPEDE": { rarity: "ultra", types: ["bug", "poison", "field"], additional: false, regional: false, stars: 3 },
  "SCORBUNNY": { rarity: "hatch", types: ["fire", "field", "human"], additional: false, regional: false, stars: 1 },
  "SCOVILLAIN": { rarity: "uncommon", types: ["grass", "fire", "gourmet"], additional: true, regional: false, stars: 2 },
  "SCRAFTY": { rarity: "uncommon", types: ["dark", "fighting"], additional: true, regional: false, stars: 2 },
  "SCRAGGY": { rarity: "uncommon", types: ["dark", "fighting"], additional: true, regional: false, stars: 1 },
  "SCREAMTAIL": { rarity: "unique", types: ["psychic", "fairy", "sound"], additional: false, regional: false, stars: 1 },
  "SCYTHER": { rarity: "unique", types: ["bug", "flying"], additional: false, regional: false, stars: 1 },
  "SEADRA": { rarity: "uncommon", types: ["dragon", "water"], additional: false, regional: false, stars: 2 },
  "SEAKING": { rarity: "rare", types: ["water", "normal"], additional: true, regional: false, stars: 2 },
  "SEALEO": { rarity: "uncommon", types: ["aquatic", "ice"], additional: false, regional: false, stars: 2 },
  "SEEDOT": { rarity: "common", types: ["grass", "dark"], additional: false, regional: true, stars: 1 },
  "SEEL": { rarity: "uncommon", types: ["ice", "aquatic"], additional: true, regional: false, stars: 1 },
  "SEISMITOAD": { rarity: "hatch", types: ["aquatic", "ground", "sound"], additional: false, regional: false, stars: 1 },
  "SENTRET": { rarity: "rare", types: ["ground", "normal", "field"], additional: true, regional: false, stars: 1 },
  "SERPERIOR": { rarity: "hatch", types: ["grass", "field"], additional: false, regional: false, stars: 1 },
  "SERVINE": { rarity: "hatch", types: ["grass", "field"], additional: false, regional: false, stars: 1 },
  "SEVIPER": { rarity: "unique", types: ["poison", "monster"], additional: false, regional: false, stars: 1 },
  "SEWADDLE": { rarity: "uncommon", types: ["grass", "bug"], additional: false, regional: false, stars: 1 },
  "SHADOWLUGIA": { rarity: "legendary", types: ["aquatic", "flying", "psychic", "dark"], additional: false, regional: false, stars: 1 },
  "SHARPEDO": { rarity: "rare", types: ["water", "dark"], additional: true, regional: false, stars: 2 },
  "SHAYMIN": { rarity: "legendary", types: ["grass", "flora"], additional: false, regional: false, stars: 1 },
  "SHAYMINSKY": { rarity: "legendary", types: ["grass", "flora", "flying"], additional: false, regional: false, stars: 1 },
  "SHEDINJA": { rarity: "epic", types: ["bug", "ghost"], additional: true, regional: false, stars: 2 },
  "SHELGON": { rarity: "uncommon", types: ["dragon", "monster"], additional: false, regional: false, stars: 2 },
  "SHELLDER": { rarity: "uncommon", types: ["water", "ice", "rock"], additional: true, regional: false, stars: 1 },
  "SHELLOSEASTSEA": { rarity: "epic", types: ["aquatic", "rock", "amorphous"], additional: false, regional: true, stars: 1 },
  "SHELLOSWESTSEA": { rarity: "epic", types: ["water", "ground", "amorphous"], additional: false, regional: true, stars: 1 },
  "SHIELDON": { rarity: "rare", types: ["fossil", "steel"], additional: true, regional: false, stars: 1 },
  "SHIFTRY": { rarity: "common", types: ["grass", "dark"], additional: false, regional: true, stars: 3 },
  "SHINX": { rarity: "ultra", types: ["electric", "field", "light"], additional: false, regional: false, stars: 1 },
  "SHROOMISH": { rarity: "uncommon", types: ["grass", "fighting"], additional: true, regional: false, stars: 1 },
  "SHUCKLE": { rarity: "unique", types: ["bug", "rock", "gourmet"], additional: false, regional: false, stars: 1 },
  "SHUPPET": { rarity: "epic", types: ["ghost", "artificial"], additional: true, regional: false, stars: 1 },
  "SIGILYPH": { rarity: "unique", types: ["psychic", "flying", "fossil"], additional: false, regional: false, stars: 1 },
  "SILCOON": { rarity: "epic", types: ["bug", "normal"], additional: false, regional: false, stars: 2 },
  "SILICOBRA": { rarity: "rare", types: ["ground", "amorphous"], additional: true, regional: false, stars: 1 },
  "SILVALLY": { rarity: "legendary", types: ["normal", "artificial"], additional: false, regional: false, stars: 1 },
  "SINISTEA": { rarity: "uncommon", types: ["ghost", "artificial", "gourmet"], additional: true, regional: false, stars: 1 },
  "SIZZLIPEDE": { rarity: "uncommon", types: ["fire", "bug"], additional: false, regional: true, stars: 1 },
  "SKARMORY": { rarity: "unique", types: ["steel", "flying"], additional: false, regional: false, stars: 1 },
  "SKELEDIRGE": { rarity: "epic", types: ["fire", "sound", "ghost"], additional: false, regional: false, stars: 3 },
  "SKIPLOOM": { rarity: "special", types: ["flying", "flora", "grass"], additional: false, regional: false, stars: 1 },
  "SKITTY": { rarity: "uncommon", types: ["normal", "fairy", "field"], additional: true, regional: false, stars: 1 },
  "SKORUPI": { rarity: "epic", types: ["dark", "bug", "poison"], additional: true, regional: false, stars: 1 },
  "SKRELP": { rarity: "uncommon", types: ["dragon", "poison", "aquatic"], additional: true, regional: false, stars: 1 },
  "SKUNTANK": { rarity: "epic", types: ["dark", "poison"], additional: true, regional: false, stars: 2 },
  "SLAKING": { rarity: "epic", types: ["normal", "field"], additional: false, regional: true, stars: 3 },
  "SLAKOTH": { rarity: "epic", types: ["normal", "field"], additional: false, regional: true, stars: 1 },
  "SLIGOO": { rarity: "epic", types: ["dragon", "aquatic", "amorphous"], additional: false, regional: false, stars: 2 },
  "SLOWBRO": { rarity: "uncommon", types: ["psychic", "water"], additional: true, regional: false, stars: 2 },
  "SLOWKING": { rarity: "uncommon", types: ["psychic", "water"], additional: true, regional: false, stars: 2 },
  "SLOWPOKE": { rarity: "uncommon", types: ["psychic", "water"], additional: true, regional: false, stars: 1 },
  "SLUGMA": { rarity: "rare", types: ["fire", "rock", "amorphous"], additional: true, regional: false, stars: 1 },
  "SLURPUFF": { rarity: "rare", types: ["fairy", "gourmet"], additional: true, regional: false, stars: 1 },
  "SMEARGLE": { rarity: "unique", types: ["normal", "human"], additional: false, regional: false, stars: 1 },
  "SMOLIV": { rarity: "common", types: ["grass", "normal", "gourmet"], additional: false, regional: false, stars: 1 },
  "SMOOCHUM": { rarity: "uncommon", types: ["ice", "psychic", "baby"], additional: true, regional: false, stars: 1 },
  "SNEASEL": { rarity: "epic", types: ["ice", "dark", "monster"], additional: true, regional: false, stars: 1 },
  "SNEASLER": { rarity: "epic", types: ["poison", "fighting", "monster"], additional: true, regional: true, stars: 1 },
  "SNIVY": { rarity: "hatch", types: ["grass", "field"], additional: false, regional: false, stars: 1 },
  "SNOM": { rarity: "rare", types: ["bug", "ice"], additional: true, regional: false, stars: 1 },
  "SNORLAX": { rarity: "epic", types: ["normal", "gourmet", "monster"], additional: true, regional: false, stars: 2 },
  "SNORUNT": { rarity: "epic", types: ["ghost", "ice"], additional: false, regional: false, stars: 1 },
  "SNOVER": { rarity: "epic", types: ["grass", "ice", "monster"], additional: false, regional: true, stars: 1 },
  "SNUBULL": { rarity: "epic", types: ["fairy", "field"], additional: true, regional: false, stars: 1 },
  "SOBBLE": { rarity: "ultra", types: ["water", "aquatic"], additional: false, regional: false, stars: 1 },
  "SOLGALEO": { rarity: "legendary", types: ["psychic", "light", "steel"], additional: false, regional: false, stars: 1 },
  "SOLOSIS": { rarity: "ultra", types: ["psychic", "amorphous"], additional: false, regional: false, stars: 1 },
  "SOLROCK": { rarity: "unique", types: ["rock", "fire", "light"], additional: false, regional: false, stars: 1 },
  "SPEAROW": { rarity: "common", types: ["wild", "flying"], additional: false, regional: false, stars: 1 },
  "SPECTRIER": { rarity: "legendary", types: ["ghost", "field"], additional: false, regional: false, stars: 1 },
  "SPHEAL": { rarity: "uncommon", types: ["aquatic", "ice"], additional: false, regional: false, stars: 1 },
  "SPINARAK": { rarity: "uncommon", types: ["wild", "bug", "poison"], additional: false, regional: false, stars: 1 },
  "SPINDA": { rarity: "unique", types: ["normal", "gourmet"], additional: false, regional: false, stars: 1 },
  "SPIRITOMB": { rarity: "unique", types: ["rock", "ghost", "amorphous"], additional: false, regional: false, stars: 1 },
  "SPOINK": { rarity: "rare", types: ["psychic", "field"], additional: false, regional: true, stars: 1 },
  "SPRIGATITO": { rarity: "common", types: ["grass", "flora", "dark"], additional: false, regional: false, stars: 1 },
  "SQUIRTLE": { rarity: "common", types: ["water", "field"], additional: false, regional: false, stars: 1 },
  "STAKATAKA": { rarity: "legendary", types: ["rock", "steel"], additional: false, regional: false, stars: 1 },
  "STANTLER": { rarity: "unique", types: ["wild", "psychic", "field"], additional: false, regional: false, stars: 1 },
  "STARAPTOR": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 3 },
  "STARAVIA": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 2 },
  "STARLY": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 1 },
  "STARMIE": { rarity: "rare", types: ["water", "psychic"], additional: true, regional: false, stars: 2 },
  "STARYU": { rarity: "rare", types: ["water", "psychic"], additional: true, regional: false, stars: 1 },
  "STEELIX": { rarity: "epic", types: ["rock", "ground", "steel"], additional: true, regional: false, stars: 2 },
  "STEENEE": { rarity: "epic", types: ["grass", "fighting", "gourmet"], additional: false, regional: false, stars: 2 },
  "STONJOURNER": { rarity: "unique", types: ["rock", "ground", "light"], additional: false, regional: false, stars: 1 },
  "STOUTLAND": { rarity: "common", types: ["normal", "field"], additional: false, regional: false, stars: 3 },
  "STUFFUL": { rarity: "epic", types: ["normal", "fighting"], additional: true, regional: false, stars: 1 },
  "STUNKY": { rarity: "epic", types: ["dark", "poison"], additional: true, regional: false, stars: 1 },
  "SUBSTITUTE": { rarity: "special", types: ["none"], additional: false, regional: false, stars: 1 },
  "SUDOWOODO": { rarity: "epic", types: ["rock", "flora", "monster"], additional: true, regional: false, stars: 2 },
  "SUICUNE": { rarity: "legendary", types: ["wild", "water", "field"], additional: false, regional: false, stars: 1 },
  "SUNFLORA": { rarity: "rare", types: ["grass", "light", "flora"], additional: true, regional: false, stars: 1 },
  "SUNKERN": { rarity: "rare", types: ["grass", "light", "flora"], additional: true, regional: false, stars: 1 },
  "SURSKIT": { rarity: "rare", types: ["bug", "aquatic"], additional: true, regional: false, stars: 1 },
  "SWABLU": { rarity: "epic", types: ["fairy", "sound"], additional: true, regional: false, stars: 1 },
  "SWADLOON": { rarity: "uncommon", types: ["grass", "bug"], additional: false, regional: false, stars: 2 },
  "SWALOT": { rarity: "epic", types: ["poison", "gourmet", "amorphous"], additional: true, regional: false, stars: 2 },
  "SWAMPERT": { rarity: "common", types: ["water", "ground"], additional: false, regional: true, stars: 3 },
  "SWELLOW": { rarity: "rare", types: ["wild", "flying"], additional: false, regional: false, stars: 2 },
  "SWINUB": { rarity: "common", types: ["ground", "ice"], additional: false, regional: false, stars: 1 },
  "SWIRLIX": { rarity: "rare", types: ["fairy", "gourmet"], additional: true, regional: false, stars: 1 },
  "SWOOBAT": { rarity: "uncommon", types: ["flying", "sound", "psychic"], additional: true, regional: false, stars: 2 },
  "SYLVEON": { rarity: "special", types: ["fairy", "field"], additional: false, regional: false, stars: 1 },
  "TADBULB": { rarity: "rare", types: ["electric", "light", "aquatic"], additional: true, regional: false, stars: 1 },
  "TAILLOW": { rarity: "rare", types: ["wild", "flying"], additional: false, regional: false, stars: 1 },
  "TALONFLAME": { rarity: "ultra", types: ["flying", "fire"], additional: false, regional: false, stars: 3 },
  "TANDEMAUS": { rarity: "unique", types: ["normal", "fairy"], additional: false, regional: false, stars: 1 },
  "TANGELA": { rarity: "uncommon", types: ["grass", "monster", "fossil"], additional: true, regional: false, stars: 1 },
  "TANGROWTH": { rarity: "uncommon", types: ["grass", "monster", "fossil"], additional: true, regional: false, stars: 2 },
  "TAPUBULU": { rarity: "unique", types: ["grass", "fairy"], additional: false, regional: true, stars: 1 },
  "TAPUFINI": { rarity: "unique", types: ["fairy", "water"], additional: false, regional: true, stars: 1 },
  "TAPUKOKO": { rarity: "unique", types: ["electric", "fairy"], additional: false, regional: true, stars: 1 },
  "TAPULELE": { rarity: "unique", types: ["psychic", "fairy"], additional: false, regional: true, stars: 1 },
  "TAUROS": { rarity: "unique", types: ["normal", "field"], additional: false, regional: false, stars: 1 },
  "TEDDIURSA": { rarity: "ultra", types: ["wild", "ground"], additional: false, regional: false, stars: 1 },
  "TENTACOOL": { rarity: "uncommon", types: ["water", "aquatic", "poison"], additional: true, regional: false, stars: 1 },
  "TENTACRUEL": { rarity: "uncommon", types: ["water", "aquatic", "poison"], additional: true, regional: false, stars: 2 },
  "TEPIG": { rarity: "hatch", types: ["wild", "fire", "fighting"], additional: false, regional: false, stars: 1 },
  "TERRAKION": { rarity: "legendary", types: ["rock", "fighting"], additional: false, regional: false, stars: 1 },
  "THIEVUL": { rarity: "rare", types: ["field", "dark"], additional: true, regional: false, stars: 2 },
  "THUNDURUS": { rarity: "legendary", types: ["flying", "electric"], additional: false, regional: false, stars: 1 },
  "THWACKEY": { rarity: "ultra", types: ["sound", "grass"], additional: false, regional: false, stars: 2 },
  "TIMBURR": { rarity: "ultra", types: ["fighting", "human"], additional: false, regional: false, stars: 1 },
  "TINKATINK": { rarity: "epic", types: ["steel", "fairy"], additional: false, regional: false, stars: 1 },
  "TINKATON": { rarity: "epic", types: ["steel", "fairy"], additional: false, regional: false, stars: 3 },
  "TINKATUFF": { rarity: "epic", types: ["steel", "fairy"], additional: false, regional: false, stars: 2 },
  "TIRTOUGA": { rarity: "unknown", types: ["fossil", "water"], additional: true, regional: false, stars: 1 },
  "TOGEDEMARU": { rarity: "unique", types: ["electric", "steel"], additional: false, regional: false, stars: 1 },
  "TOGEKISS": { rarity: "rare", types: ["fairy", "normal", "flying"], additional: false, regional: false, stars: 3 },
  "TOGEPI": { rarity: "rare", types: ["fairy", "normal", "baby"], additional: false, regional: false, stars: 1 },
  "TOGETIC": { rarity: "rare", types: ["fairy", "normal", "flying"], additional: false, regional: false, stars: 2 },
  "TORCHIC": { rarity: "rare", types: ["fire", "fighting", "flying"], additional: false, regional: false, stars: 1 },
  "TORKOAL": { rarity: "unique", types: ["fire", "ground"], additional: false, regional: false, stars: 1 },
  "TORNADUS": { rarity: "legendary", types: ["flying", "ice"], additional: false, regional: false, stars: 1 },
  "TORRACAT": { rarity: "epic", types: ["fire", "dark", "field"], additional: false, regional: false, stars: 2 },
  "TORTERRA": { rarity: "rare", types: ["grass", "ground", "monster"], additional: false, regional: false, stars: 3 },
  "TOTODILE": { rarity: "rare", types: ["water", "monster", "aquatic"], additional: false, regional: false, stars: 1 },
  "TOUCANNON": { rarity: "unknown", types: ["normal", "flying", "sound"], additional: false, regional: false, stars: 1 },
  "TOXEL": { rarity: "rare", types: ["electric", "poison", "baby"], additional: false, regional: true, stars: 1 },
  "TOXICROAK": { rarity: "rare", types: ["poison", "fighting", "aquatic"], additional: true, regional: false, stars: 2 },
  "TOXTRICITY": { rarity: "rare", types: ["electric", "poison", "sound"], additional: false, regional: true, stars: 2 },
  "TRANQUILL": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 2 },
  "TRAPINCH": { rarity: "rare", types: ["bug", "ground"], additional: false, regional: false, stars: 1 },
  "TREECKO": { rarity: "uncommon", types: ["grass", "monster"], additional: false, regional: false, stars: 1 },
  "TREVENANT": { rarity: "rare", types: ["ghost", "grass", "monster"], additional: true, regional: false, stars: 2 },
  "TROPIUS": { rarity: "unique", types: ["grass", "gourmet", "flying"], additional: false, regional: false, stars: 1 },
  "TRUBBISH": { rarity: "epic", types: ["poison", "artificial"], additional: true, regional: false, stars: 1 },
  "TRUMBEAK": { rarity: "unknown", types: ["normal", "flying", "sound"], additional: false, regional: false, stars: 1 },
  "TSAREENA": { rarity: "epic", types: ["grass", "fighting", "gourmet"], additional: false, regional: false, stars: 3 },
  "TURTONATOR": { rarity: "unique", types: ["dragon", "fire"], additional: false, regional: false, stars: 1 },
  "TURTWIG": { rarity: "rare", types: ["grass", "ground", "monster"], additional: false, regional: false, stars: 1 },
  "TYMPOLE": { rarity: "hatch", types: ["aquatic", "ground", "sound"], additional: false, regional: false, stars: 1 },
  "TYNAMO": { rarity: "common", types: ["electric", "aquatic", "amorphous"], additional: false, regional: true, stars: 1 },
  "TYPENULL": { rarity: "legendary", types: ["normal", "artificial"], additional: false, regional: false, stars: 1 },
  "TYPHLOSION": { rarity: "uncommon", types: ["fire", "field"], additional: false, regional: false, stars: 3 },
  "TYRANITAR": { rarity: "rare", types: ["dark", "monster", "rock"], additional: false, regional: false, stars: 3 },
  "TYRANTRUM": { rarity: "rare", types: ["dragon", "rock", "fossil"], additional: true, regional: false, stars: 2 },
  "TYROGUE": { rarity: "unique", types: ["fighting", "human", "baby"], additional: false, regional: false, stars: 1 },
  "TYRUNT": { rarity: "rare", types: ["dragon", "rock", "fossil"], additional: true, regional: false, stars: 1 },
  "ULTRANECROZMA": { rarity: "legendary", types: ["dragon", "light", "psychic"], additional: false, regional: false, stars: 1 },
  "UMBREON": { rarity: "special", types: ["dark", "field"], additional: false, regional: false, stars: 1 },
  "UNFEZANT": { rarity: "common", types: ["normal", "flying"], additional: false, regional: true, stars: 3 },
  "UNOWNA": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNB": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNC": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWND": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNE": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNEXCLAMATION": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNF": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNG": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNH": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNI": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNJ": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNK": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNL": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNM": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNN": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNO": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNP": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNQ": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNQUESTION": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNR": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNS": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNT": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNU": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNV": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNW": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNX": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNY": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "UNOWNZ": { rarity: "special", types: ["psychic"], additional: false, regional: false, stars: 1 },
  "URSALUNA": { rarity: "ultra", types: ["wild", "ground"], additional: false, regional: false, stars: 3 },
  "URSALUNABLOODMOON": { rarity: "ultra", types: ["wild", "ground"], additional: false, regional: false, stars: 1 },
  "URSARING": { rarity: "ultra", types: ["wild", "ground"], additional: false, regional: false, stars: 2 },
  "URSHIFURAPID": { rarity: "legendary", types: ["fighting", "water"], additional: false, regional: false, stars: 1 },
  "URSHIFUSINGLE": { rarity: "legendary", types: ["fighting", "dark"], additional: false, regional: false, stars: 1 },
  "UXIE": { rarity: "unique", types: ["psychic", "fairy"], additional: false, regional: false, stars: 1 },
  "VANILLISH": { rarity: "rare", types: ["ice", "amorphous", "gourmet"], additional: false, regional: false, stars: 2 },
  "VANILLITE": { rarity: "rare", types: ["ice", "amorphous", "gourmet"], additional: false, regional: false, stars: 1 },
  "VANILLUXE": { rarity: "rare", types: ["ice", "amorphous", "gourmet"], additional: false, regional: false, stars: 3 },
  "VAPOREON": { rarity: "special", types: ["water", "field"], additional: false, regional: false, stars: 1 },
  "VAROOM": { rarity: "uncommon", types: ["steel", "artificial", "poison"], additional: false, regional: true, stars: 1 },
  "VELUZA": { rarity: "unique", types: ["water", "psychic", "gourmet"], additional: false, regional: false, stars: 1 },
  "VENIPEDE": { rarity: "ultra", types: ["bug", "poison", "field"], additional: false, regional: false, stars: 1 },
  "VENOMOTH": { rarity: "uncommon", types: ["bug", "flying", "poison"], additional: true, regional: false, stars: 2 },
  "VENONAT": { rarity: "uncommon", types: ["bug", "flying", "poison"], additional: true, regional: false, stars: 1 },
  "VENUSAUR": { rarity: "rare", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 3 },
  "VESPIQUEEN": { rarity: "epic", types: ["bug", "flora", "gourmet"], additional: true, regional: false, stars: 2 },
  "VIBRAVA": { rarity: "rare", types: ["dragon", "bug", "ground"], additional: false, regional: false, stars: 2 },
  "VICTINI": { rarity: "legendary", types: ["fire", "psychic"], additional: false, regional: false, stars: 1 },
  "VICTREEBEL": { rarity: "special", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 1 },
  "VIGOROTH": { rarity: "epic", types: ["normal", "field"], additional: false, regional: true, stars: 2 },
  "VIKAVOLT": { rarity: "hatch", types: ["bug", "electric"], additional: false, regional: false, stars: 1 },
  "VILEPLUME": { rarity: "special", types: ["flora", "poison", "grass"], additional: false, regional: false, stars: 1 },
  "VIRIZION": { rarity: "legendary", types: ["grass", "fighting"], additional: false, regional: false, stars: 1 },
  "VOLBEAT": { rarity: "unique", types: ["flying", "bug", "light"], additional: false, regional: false, stars: 1 },
  "VOLCANION": { rarity: "legendary", types: ["fire", "water", "aquatic"], additional: false, regional: false, stars: 1 },
  "VOLCARONA": { rarity: "epic", types: ["fire", "bug"], additional: true, regional: false, stars: 2 },
  "VOLTORB": { rarity: "uncommon", types: ["electric", "artificial"], additional: true, regional: false, stars: 1 },
  "VULLABY": { rarity: "rare", types: ["dark", "flying"], additional: true, regional: false, stars: 1 },
  "VULPIX": { rarity: "rare", types: ["fire", "psychic"], additional: true, regional: false, stars: 1 },
  "WAILMER": { rarity: "epic", types: ["water", "sound"], additional: true, regional: false, stars: 1 },
  "WAILORD": { rarity: "epic", types: ["water", "sound"], additional: true, regional: false, stars: 2 },
  "WALKINGWAKE": { rarity: "legendary", types: ["dragon", "water", "fossil"], additional: false, regional: true, stars: 1 },
  "WALREIN": { rarity: "uncommon", types: ["aquatic", "ice"], additional: false, regional: false, stars: 3 },
  "WARTORTLE": { rarity: "common", types: ["water", "field"], additional: false, regional: false, stars: 2 },
  "WATCHOG": { rarity: "rare", types: ["normal", "light"], additional: true, regional: false, stars: 2 },
  "WATTREL": { rarity: "epic", types: ["flying", "electric"], additional: true, regional: false, stars: 1 },
  "WEAVILE": { rarity: "epic", types: ["ice", "dark", "monster"], additional: true, regional: false, stars: 2 },
  "WEEDLE": { rarity: "common", types: ["bug", "poison"], additional: false, regional: false, stars: 1 },
  "WEEPINBELL": { rarity: "special", types: ["grass", "poison", "flora"], additional: false, regional: false, stars: 1 },
  "WEEZING": { rarity: "uncommon", types: ["poison", "artificial", "amorphous"], additional: true, regional: false, stars: 2 },
  "WHIMSICOTT": { rarity: "uncommon", types: ["grass", "fairy"], additional: true, regional: false, stars: 2 },
  "WHIRLIPEDE": { rarity: "ultra", types: ["bug", "poison", "field"], additional: false, regional: false, stars: 2 },
  "WHISCASH": { rarity: "epic", types: ["water", "ground"], additional: true, regional: false, stars: 2 },
  "WHISMUR": { rarity: "rare", types: ["normal", "sound"], additional: false, regional: false, stars: 1 },
  "WIGGLYTUFF": { rarity: "uncommon", types: ["normal", "fairy", "sound"], additional: false, regional: false, stars: 3 },
  "WIGLETT": { rarity: "uncommon", types: ["ground", "water"], additional: true, regional: false, stars: 1 },
  "WIMPOD": { rarity: "epic", types: ["bug", "water", "monster"], additional: true, regional: false, stars: 1 },
  "WINGULL": { rarity: "epic", types: ["water", "flying"], additional: true, regional: false, stars: 1 },
  "WISHIWASHI": { rarity: "special", types: ["water"], additional: false, regional: false, stars: 1 },
  "WISHIWASHISCHOOL": { rarity: "special", types: ["water", "monster", "amorphous"], additional: false, regional: false, stars: 1 },
  "WOBBUFFET": { rarity: "rare", types: ["psychic", "amorphous"], additional: true, regional: false, stars: 2 },
  "WOOBAT": { rarity: "uncommon", types: ["flying", "sound", "psychic"], additional: true, regional: false, stars: 1 },
  "WOOPER": { rarity: "rare", types: ["aquatic", "ground"], additional: true, regional: false, stars: 1 },
  "WORMADAMPLANT": { rarity: "rare", types: ["bug", "grass"], additional: false, regional: true, stars: 1 },
  "WORMADAMSANDY": { rarity: "rare", types: ["bug", "ground"], additional: false, regional: true, stars: 1 },
  "WORMADAMTRASH": { rarity: "rare", types: ["bug", "artificial"], additional: false, regional: true, stars: 1 },
  "WUGTRIO": { rarity: "uncommon", types: ["ground", "water"], additional: true, regional: false, stars: 2 },
  "WURMPLE": { rarity: "epic", types: ["bug"], additional: false, regional: false, stars: 1 },
  "WYNAUT": { rarity: "rare", types: ["psychic", "baby", "amorphous"], additional: true, regional: false, stars: 1 },
  "WYRDEER": { rarity: "unique", types: ["wild", "psychic", "field"], additional: false, regional: false, stars: 1 },
  "XATU": { rarity: "rare", types: ["psychic", "flying"], additional: true, regional: false, stars: 2 },
  "XERNEAS": { rarity: "legendary", types: ["fairy", "light", "flora"], additional: false, regional: false, stars: 1 },
  "XURKITREE": { rarity: "legendary", types: ["electric", "artificial", "light"], additional: false, regional: false, stars: 1 },
  "YAMASK": { rarity: "rare", types: ["ghost", "human"], additional: true, regional: false, stars: 1 },
  "YANMA": { rarity: "rare", types: ["bug", "fossil", "flying"], additional: true, regional: false, stars: 1 },
  "YANMEGA": { rarity: "rare", types: ["bug", "fossil", "flying"], additional: true, regional: false, stars: 2 },
  "YVELTAL": { rarity: "legendary", types: ["dark", "flying"], additional: false, regional: false, stars: 1 },
  "ZACIAN": { rarity: "legendary", types: ["wild", "fairy"], additional: false, regional: false, stars: 1 },
  "ZACIANCROWNED": { rarity: "legendary", types: ["fairy", "wild", "steel"], additional: false, regional: false, stars: 1 },
  "ZANGOOSE": { rarity: "unique", types: ["wild", "normal"], additional: false, regional: false, stars: 1 },
  "ZAPDOS": { rarity: "legendary", types: ["electric", "flying"], additional: false, regional: false, stars: 1 },
  "ZEKROM": { rarity: "legendary", types: ["dragon", "electric"], additional: false, regional: false, stars: 1 },
  "ZERAORA": { rarity: "unique", types: ["wild", "electric"], additional: false, regional: false, stars: 1 },
  "ZIGZAGOON": { rarity: "rare", types: ["wild", "field"], additional: false, regional: false, stars: 1 },
  "ZOROARK": { rarity: "uncommon", types: ["dark", "field"], additional: true, regional: false, stars: 2 },
  "ZORUA": { rarity: "uncommon", types: ["dark", "field"], additional: true, regional: false, stars: 1 },
  "ZUBAT": { rarity: "common", types: ["poison", "flying", "sound"], additional: false, regional: false, stars: 1 },
  "ZWEILOUS": { rarity: "rare", types: ["dragon", "dark"], additional: false, regional: true, stars: 2 },
  "ZYGARDE10": { rarity: "legendary", types: ["dragon", "ground"], additional: false, regional: false, stars: 1 },
  "ZYGARDE100": { rarity: "legendary", types: ["dragon", "ground"], additional: false, regional: false, stars: 1 },
  "ZYGARDE50": { rarity: "legendary", types: ["dragon", "ground"], additional: false, regional: false, stars: 1 },
};
  // Rarity display names and colors
  const RARITY_INFO = {
    common: { label: 'Common', color: '#9e9e9e' },
    uncommon: { label: 'Uncommon', color: '#4caf50' },
    rare: { label: 'Rare', color: '#2196f3' },
    epic: { label: 'Epic', color: '#9c27b0' },
    ultra: { label: 'Ultra', color: '#ff9800' },
    legendary: { label: 'Legendary', color: '#ffd700' },
    unique: { label: 'Unique', color: '#00bcd4' },
    hatch: { label: 'Hatch', color: '#ff69b4' },
    special: { label: 'Special', color: '#607d8b' }
  };

  // Standard pool rarities (ones that appear in shops)
  const POOL_RARITIES = ['common', 'uncommon', 'rare', 'epic', 'ultra'];

  // Wild Pokemon that appear in PVE rounds (67 total)
  const WILD_POKEMON = new Set([
    'RATTATA', 'RATICATE', 'ALOLANRATTATA', 'ALOLANRATICATE',
    'SPEAROW', 'FEAROW', 'ZERAORA', 'STANTLER', 'WYRDEER',
    'PINSIR', 'SUICUNE', 'RAIKOU', 'ENTEI', 'ZANGOOSE', 'ABSOL',
    'MANKEY', 'PRIMEAPE', 'ANNIHILAPE', 'POOCHYENA', 'MIGHTYENA',
    'TEPIG', 'PIGNITE', 'EMBOAR', 'DODUO', 'DODRIO',
    'ZIGZAGOON', 'LINOONE', 'GALARIANZIGZAGOON', 'GALARIANLINOONE', 'OBSTAGOON',
    'LICKITUNG', 'LICKILICKY', 'KANGASKHAN',
    'TEDDIURSA', 'URSARING', 'URSALUNA', 'URSALUNABLOODMOON',
    'AIPOM', 'AMBIPOM', 'DEERLINGAUTUMN', 'SAWSBUCKAUTUMN',
    'TAILLOW', 'SWELLOW', 'SPINARAK', 'ARIADOS',
    'ROCKRUFF', 'LYCANROCDUSK', 'LYCANROCNIGHT', 'LYCANROCDAY',
    'DRUDDIGON', 'PHANPY', 'DONPHAN', 'RUFFLET', 'BRAVIARY',
    'REMORAID', 'OCTILLERY', 'DARUMAKA', 'DARMANITAN', 'DARMANITANZEN',
    'ZACIAN', 'ZACIANCROWNED', 'ESPURR', 'MEOWSTICMALE', 'MEOWSTICFEMALE',
    'OKIDOGI', 'BASCULINRED', 'BASCULINBLUE'
  ]);

  // PVE stages (rounds where you fight wild Pokemon, not players)
  const PVE_STAGES = new Set([1, 2, 3, 9, 14, 19, 24, 28, 32, 36, 40]);

  // ═══════════════════════════════════════════════════════════════════════════
  // EVOLUTION CHAINS MODULE (v2.5.0)
  // ═══════════════════════════════════════════════════════════════════════════

/**
 * Evolution Chains Data Module
 * Auto-generated from evolution_chains.csv
 * Provides evolution family tracking for PAC Calculator v2.5.0
 */

// Main data structure: base form -> array of evolution stages
const EVOLUTION_CHAINS = {
  "ABRA": [
    { maxStars: 3 },
    { stage: 0, name: "ABRA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KADABRA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "ALAKAZAM", rarity: "unknown", cost: 9 },
  ],
  "AIPOM": [
    { maxStars: 2 },
    { stage: 0, name: "AIPOM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "AMBIPOM", rarity: "unknown", cost: 3 },
  ],
  "AMAURA": [
    { maxStars: 2 },
    { stage: 0, name: "AMAURA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "AURORUS", rarity: "unknown", cost: 3 },
  ],
  "ANORITH": [
    { maxStars: 2 },
    { stage: 0, name: "ANORITH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ARMALDO", rarity: "unknown", cost: 3 },
  ],
  "ARCHEN": [
    { maxStars: 2 },
    { stage: 0, name: "ARCHEN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ARCHEOPS", rarity: "unknown", cost: 3 },
  ],
  "ARON": [
    { maxStars: 3 },
    { stage: 0, name: "ARON", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LAIRON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "AGGRON", rarity: "unknown", cost: 9 },
  ],
  "AZURILL": [
    { maxStars: 3 },
    { stage: 0, name: "AZURILL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MARILL", rarity: "unknown", cost: 3 },
    { stage: 2, name: "AZUMARILL", rarity: "unknown", cost: 9 },
  ],
  "BAGON": [
    { maxStars: 3 },
    { stage: 0, name: "BAGON", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SHELGON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SALAMENCE", rarity: "unknown", cost: 9 },
  ],
  "BALTOY": [
    { maxStars: 2 },
    { stage: 0, name: "BALTOY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CLAYDOL", rarity: "unknown", cost: 3 },
  ],
  "BARBOACH": [
    { maxStars: 2 },
    { stage: 0, name: "BARBOACH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WHISCASH", rarity: "unknown", cost: 3 },
  ],
  "BELDUM": [
    { maxStars: 3 },
    { stage: 0, name: "BELDUM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "METANG", rarity: "unknown", cost: 3 },
    { stage: 2, name: "METAGROSS", rarity: "unknown", cost: 9 },
  ],
  "BIDOOF": [
    { maxStars: 2 },
    { stage: 0, name: "BIDOOF", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BIBAREL", rarity: "unknown", cost: 3 },
  ],
  "BINACLE": [
    { maxStars: 2 },
    { stage: 0, name: "BINACLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BARBARACLE", rarity: "unknown", cost: 3 },
  ],
  "BLIPBUG": [
    { maxStars: 3 },
    { stage: 0, name: "BLIPBUG", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DOTTLER", rarity: "unknown", cost: 3 },
    { stage: 2, name: "ORBEETLE", rarity: "unknown", cost: 9 },
  ],
  "BONSLEY": [
    { maxStars: 2 },
    { stage: 0, name: "BONSLEY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SUDOWOODO", rarity: "unknown", cost: 3 },
  ],
  "BOUNSWEET": [
    { maxStars: 3 },
    { stage: 0, name: "BOUNSWEET", rarity: "unknown", cost: 1 },
    { stage: 1, name: "STEENEE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "TSAREENA", rarity: "unknown", cost: 9 },
  ],
  "BRONZOR": [
    { maxStars: 2 },
    { stage: 0, name: "BRONZOR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BRONZONG", rarity: "unknown", cost: 3 },
  ],
  "BUDEW": [
    { maxStars: 3 },
    { stage: 0, name: "BUDEW", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ROSELIA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "ROSERADE", rarity: "unknown", cost: 9 },
  ],
  "BUIZEL": [
    { maxStars: 2 },
    { stage: 0, name: "BUIZEL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FLOATZEL", rarity: "unknown", cost: 3 },
  ],
  "BULBASAUR": [
    { maxStars: 3 },
    { stage: 0, name: "BULBASAUR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "IVYSAUR", rarity: "unknown", cost: 3 },
    { stage: 2, name: "VENUSAUR", rarity: "unknown", cost: 9 },
  ],
  "BUNEARY": [
    { maxStars: 2 },
    { stage: 0, name: "BUNEARY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LOPUNNY", rarity: "unknown", cost: 3 },
  ],
  "CACNEA": [
    { maxStars: 2 },
    { stage: 0, name: "CACNEA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CACTURNE", rarity: "unknown", cost: 3 },
  ],
  "CAPSAKID": [
    { maxStars: 2 },
    { stage: 0, name: "CAPSAKID", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SCOVILLAIN", rarity: "unknown", cost: 3 },
  ],
  "CARBINK": [
    { maxStars: 1 },
    { stage: 0, name: "CARBINK", rarity: "unknown", cost: 1 },
  ],
  "CARVANHA": [
    { maxStars: 2 },
    { stage: 0, name: "CARVANHA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SHARPEDO", rarity: "unknown", cost: 3 },
  ],
  "CATERPIE": [
    { maxStars: 3 },
    { stage: 0, name: "CATERPIE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "METAPOD", rarity: "unknown", cost: 3 },
    { stage: 2, name: "BUTTERFREE", rarity: "unknown", cost: 9 },
  ],
  "CHARMANDER": [
    { maxStars: 3 },
    { stage: 0, name: "CHARMANDER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CHARMELEON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "CHARIZARD", rarity: "unknown", cost: 9 },
  ],
  "CHERUBI": [
    { maxStars: 2 },
    { stage: 0, name: "CHERUBI", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CHERRIM", rarity: "unknown", cost: 3 },
  ],
  "CHESPIN": [
    { maxStars: 3 },
    { stage: 0, name: "CHESPIN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "QUILLADIN", rarity: "unknown", cost: 3 },
    { stage: 2, name: "CHESNAUGHT", rarity: "unknown", cost: 9 },
  ],
  "CHEWTLE": [
    { maxStars: 2 },
    { stage: 0, name: "CHEWTLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DREDNAW", rarity: "unknown", cost: 3 },
  ],
  "CHIMCHAR": [
    { maxStars: 3 },
    { stage: 0, name: "CHIMCHAR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MONFERNO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "INFERNAPE", rarity: "unknown", cost: 9 },
  ],
  "CHINCHOU": [
    { maxStars: 2 },
    { stage: 0, name: "CHINCHOU", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LANTURN", rarity: "unknown", cost: 3 },
  ],
  "CLAMPERL": [
    { maxStars: 3 },
    { stage: 0, name: "CLAMPERL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HUNTAIL", rarity: "unknown", cost: 3 },
    { stage: 1, name: "GOREBYSS", rarity: "unknown", cost: 3 },
  ],
  "CLAUNCHER": [
    { maxStars: 2 },
    { stage: 0, name: "CLAUNCHER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CLAWITZER", rarity: "unknown", cost: 3 },
  ],
  "CLEFFA": [
    { maxStars: 3 },
    { stage: 0, name: "CLEFFA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CLEFAIRY", rarity: "unknown", cost: 3 },
    { stage: 2, name: "CLEFABLE", rarity: "unknown", cost: 9 },
  ],
  "CLOBBOPUS": [
    { maxStars: 2 },
    { stage: 0, name: "CLOBBOPUS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GRAPPLOCT", rarity: "unknown", cost: 3 },
  ],
  "COMBEE": [
    { maxStars: 2 },
    { stage: 0, name: "COMBEE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "VESPIQUEEN", rarity: "unknown", cost: 3 },
  ],
  "CONKELDURR": [
    { maxStars: 1 },
    { stage: 0, name: "CONKELDURR", rarity: "unknown", cost: 1 },
  ],
  "CORPHISH": [
    { maxStars: 2 },
    { stage: 0, name: "CORPHISH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CRAWDAUNT", rarity: "unknown", cost: 3 },
  ],
  "CORSOLA": [
    { maxStars: 1 },
    { stage: 0, name: "CORSOLA", rarity: "unknown", cost: 1 },
  ],
  "COTTONEE": [
    { maxStars: 2 },
    { stage: 0, name: "COTTONEE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WHIMSICOTT", rarity: "unknown", cost: 3 },
  ],
  "CRABRAWLER": [
    { maxStars: 2 },
    { stage: 0, name: "CRABRAWLER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CRABOMINABLE", rarity: "unknown", cost: 3 },
  ],
  "CRANIDOS": [
    { maxStars: 2 },
    { stage: 0, name: "CRANIDOS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "RAMPARDOS", rarity: "unknown", cost: 3 },
  ],
  "CROAGUNK": [
    { maxStars: 2 },
    { stage: 0, name: "CROAGUNK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TOXICROAK", rarity: "unknown", cost: 3 },
  ],
  "CUBCHOO": [
    { maxStars: 2 },
    { stage: 0, name: "CUBCHOO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BEARTIC", rarity: "unknown", cost: 3 },
  ],
  "CUBONE": [
    { maxStars: 2 },
    { stage: 0, name: "CUBONE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MAROWAK", rarity: "unknown", cost: 3 },
  ],
  "CURSOLA": [
    { maxStars: 1 },
    { stage: 0, name: "CURSOLA", rarity: "unknown", cost: 1 },
  ],
  "CUTIEFLY": [
    { maxStars: 2 },
    { stage: 0, name: "CUTIEFLY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "RIBOMBEE", rarity: "unknown", cost: 3 },
  ],
  "CYNDAQUIL": [
    { maxStars: 3 },
    { stage: 0, name: "CYNDAQUIL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "QUILAVA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "TYPHLOSION", rarity: "unknown", cost: 9 },
  ],
  "DARUMAKA": [
    { maxStars: 2 },
    { stage: 0, name: "DARUMAKA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DARMANITAN", rarity: "unknown", cost: 3 },
  ],
  "DEINO": [
    { maxStars: 3 },
    { stage: 0, name: "DEINO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ZWEILOUS", rarity: "unknown", cost: 3 },
    { stage: 2, name: "HYDREIGON", rarity: "unknown", cost: 9 },
  ],
  "DEWPIDER": [
    { maxStars: 2 },
    { stage: 0, name: "DEWPIDER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ARAQUANID", rarity: "unknown", cost: 3 },
  ],
  "DIANCIE": [
    { maxStars: 1 },
    { stage: 0, name: "DIANCIE", rarity: "unknown", cost: 1 },
  ],
  "DIGLETT": [
    { maxStars: 2 },
    { stage: 0, name: "DIGLETT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DUGTRIO", rarity: "unknown", cost: 3 },
  ],
  "DODUO": [
    { maxStars: 2 },
    { stage: 0, name: "DODUO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DODRIO", rarity: "unknown", cost: 3 },
  ],
  "DRATINI": [
    { maxStars: 3 },
    { stage: 0, name: "DRATINI", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DRAGONAIR", rarity: "unknown", cost: 3 },
    { stage: 2, name: "DRAGONITE", rarity: "unknown", cost: 9 },
  ],
  "DRIFLOON": [
    { maxStars: 2 },
    { stage: 0, name: "DRIFLOON", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DRIFBLIM", rarity: "unknown", cost: 3 },
  ],
  "DRILBUR": [
    { maxStars: 2 },
    { stage: 0, name: "DRILBUR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "EXCADRILL", rarity: "unknown", cost: 3 },
  ],
  "DROWZEE": [
    { maxStars: 2 },
    { stage: 0, name: "DROWZEE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HYPNO", rarity: "unknown", cost: 3 },
  ],
  "EKANS": [
    { maxStars: 2 },
    { stage: 0, name: "EKANS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ARBOK", rarity: "unknown", cost: 3 },
  ],
  "ELECTRIKE": [
    { maxStars: 2 },
    { stage: 0, name: "ELECTRIKE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MANECTRIC", rarity: "unknown", cost: 3 },
  ],
  "ELEKID": [
    { maxStars: 3 },
    { stage: 0, name: "ELEKID", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ELECTABUZZ", rarity: "unknown", cost: 3 },
    { stage: 2, name: "ELECTIVIRE", rarity: "unknown", cost: 9 },
  ],
  "ELGYEM": [
    { maxStars: 2 },
    { stage: 0, name: "ELGYEM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BEHEEYEM", rarity: "unknown", cost: 3 },
  ],
  "ESPURR": [
    { maxStars: 2 },
    { stage: 0, name: "ESPURR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MEOWSTICMALE", rarity: "unknown", cost: 3 },
  ],
  "EXEGGCUTE": [
    { maxStars: 2 },
    { stage: 0, name: "EXEGGCUTE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "EXEGGUTOR", rarity: "unknown", cost: 3 },
  ],
  "FENNEKIN": [
    { maxStars: 3 },
    { stage: 0, name: "FENNEKIN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BRAIXEN", rarity: "unknown", cost: 3 },
    { stage: 2, name: "DELPHOX", rarity: "unknown", cost: 9 },
  ],
  "FERROSEED": [
    { maxStars: 2 },
    { stage: 0, name: "FERROSEED", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FERROTHORN", rarity: "unknown", cost: 3 },
  ],
  "FIDOUGH": [
    { maxStars: 2 },
    { stage: 0, name: "FIDOUGH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DACHSBUN", rarity: "unknown", cost: 3 },
  ],
  "FINNEON": [
    { maxStars: 2 },
    { stage: 0, name: "FINNEON", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LUMINEON", rarity: "unknown", cost: 3 },
  ],
  "FLABEBE": [
    { maxStars: 3 },
    { stage: 0, name: "FLABEBE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FLOETTE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "FLORGES", rarity: "unknown", cost: 9 },
  ],
  "FLETCHLING": [
    { maxStars: 3 },
    { stage: 0, name: "FLETCHLING", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FLETCHINDER", rarity: "unknown", cost: 3 },
    { stage: 2, name: "TALONFLAME", rarity: "unknown", cost: 9 },
  ],
  "FOMANTIS": [
    { maxStars: 2 },
    { stage: 0, name: "FOMANTIS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LURANTIS", rarity: "unknown", cost: 3 },
  ],
  "FRIGIBAX": [
    { maxStars: 3 },
    { stage: 0, name: "FRIGIBAX", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ARCTIBAX", rarity: "unknown", cost: 3 },
    { stage: 2, name: "BAXCALIBUR", rarity: "unknown", cost: 9 },
  ],
  "FUECOCO": [
    { maxStars: 3 },
    { stage: 0, name: "FUECOCO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CROCALOR", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SKELEDIRGE", rarity: "unknown", cost: 9 },
  ],
  "GALARCORSOLA": [
    { maxStars: 2 },
    { stage: 0, name: "GALARCORSOLA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CURSOLA", rarity: "unknown", cost: 3 },
  ],
  "GASTLY": [
    { maxStars: 3 },
    { stage: 0, name: "GASTLY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HAUNTER", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GENGAR", rarity: "unknown", cost: 9 },
  ],
  "GEODUDE": [
    { maxStars: 3 },
    { stage: 0, name: "GEODUDE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GRAVELER", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GOLEM", rarity: "unknown", cost: 9 },
  ],
  "GIBLE": [
    { maxStars: 3 },
    { stage: 0, name: "GIBLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GABITE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GARCHOMP", rarity: "unknown", cost: 9 },
  ],
  "GIRAFARIG": [
    { maxStars: 2 },
    { stage: 0, name: "GIRAFARIG", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FARIGIRAF", rarity: "unknown", cost: 3 },
  ],
  "GLAMEOW": [
    { maxStars: 2 },
    { stage: 0, name: "GLAMEOW", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PURUGLY", rarity: "unknown", cost: 3 },
  ],
  "GLIGAR": [
    { maxStars: 2 },
    { stage: 0, name: "GLIGAR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GLISCOR", rarity: "unknown", cost: 3 },
  ],
  "GLIMMET": [
    { maxStars: 2 },
    { stage: 0, name: "GLIMMET", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GLIMMORA", rarity: "unknown", cost: 3 },
  ],
  "GOLDEEN": [
    { maxStars: 2 },
    { stage: 0, name: "GOLDEEN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SEAKING", rarity: "unknown", cost: 3 },
  ],
  "GOLETT": [
    { maxStars: 2 },
    { stage: 0, name: "GOLETT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GOLURK", rarity: "unknown", cost: 3 },
  ],
  "GOOMY": [
    { maxStars: 3 },
    { stage: 0, name: "GOOMY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SLIGOO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GOODRA", rarity: "unknown", cost: 9 },
  ],
  "GOSSIFLEUR": [
    { maxStars: 2 },
    { stage: 0, name: "GOSSIFLEUR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ELDEGOSS", rarity: "unknown", cost: 3 },
  ],
  "GREAVARD": [
    { maxStars: 2 },
    { stage: 0, name: "GREAVARD", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HOUNDSTONE", rarity: "unknown", cost: 3 },
  ],
  "GRIMER": [
    { maxStars: 2 },
    { stage: 0, name: "GRIMER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MUK", rarity: "unknown", cost: 3 },
  ],
  "GROOKEY": [
    { maxStars: 3 },
    { stage: 0, name: "GROOKEY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "THWACKEY", rarity: "unknown", cost: 3 },
    { stage: 2, name: "RILLABOOM", rarity: "unknown", cost: 9 },
  ],
  "GROWLITHE": [
    { maxStars: 2 },
    { stage: 0, name: "GROWLITHE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ARCANINE", rarity: "unknown", cost: 3 },
  ],
  "GULPIN": [
    { maxStars: 2 },
    { stage: 0, name: "GULPIN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SWALOT", rarity: "unknown", cost: 3 },
  ],
  "GURDURR": [
    { maxStars: 1 },
    { stage: 0, name: "GURDURR", rarity: "unknown", cost: 1 },
  ],
  "HAPPINY": [
    { maxStars: 3 },
    { stage: 0, name: "HAPPINY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CHANSEY", rarity: "unknown", cost: 3 },
    { stage: 2, name: "BLISSEY", rarity: "unknown", cost: 9 },
  ],
  "HATENNA": [
    { maxStars: 3 },
    { stage: 0, name: "HATENNA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HATTREM", rarity: "unknown", cost: 3 },
    { stage: 2, name: "HATTERENE", rarity: "unknown", cost: 9 },
  ],
  "HELIOPTILE": [
    { maxStars: 2 },
    { stage: 0, name: "HELIOPTILE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HELIOLISK", rarity: "unknown", cost: 3 },
  ],
  "HIPPOPOTAS": [
    { maxStars: 2 },
    { stage: 0, name: "HIPPOPOTAS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HIPPODOWN", rarity: "unknown", cost: 3 },
  ],
  "HONEDGE": [
    { maxStars: 3 },
    { stage: 0, name: "HONEDGE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DOUBLADE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "AEGISLASH", rarity: "unknown", cost: 9 },
  ],
  "HOOTHOOT": [
    { maxStars: 2 },
    { stage: 0, name: "HOOTHOOT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NOCTOWL", rarity: "unknown", cost: 3 },
  ],
  "HORSEA": [
    { maxStars: 3 },
    { stage: 0, name: "HORSEA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SEADRA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "KINGDRA", rarity: "unknown", cost: 9 },
  ],
  "HOUNDOUR": [
    { maxStars: 2 },
    { stage: 0, name: "HOUNDOUR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HOUNDOOM", rarity: "unknown", cost: 3 },
  ],
  "IGGLYBUFF": [
    { maxStars: 3 },
    { stage: 0, name: "IGGLYBUFF", rarity: "unknown", cost: 1 },
    { stage: 1, name: "JIGGLYPUFF", rarity: "unknown", cost: 3 },
    { stage: 2, name: "WIGGLYTUFF", rarity: "unknown", cost: 9 },
  ],
  "IMPIDIMP": [
    { maxStars: 3 },
    { stage: 0, name: "IMPIDIMP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MORGREM", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GRIMMSNARL", rarity: "unknown", cost: 9 },
  ],
  "INKAY": [
    { maxStars: 2 },
    { stage: 0, name: "INKAY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MALAMAR", rarity: "unknown", cost: 3 },
  ],
  "JANGMOO": [
    { maxStars: 3 },
    { stage: 0, name: "JANGMOO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HAKAMOO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "KOMMOO", rarity: "unknown", cost: 9 },
  ],
  "JOLTIK": [
    { maxStars: 2 },
    { stage: 0, name: "JOLTIK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GALVANTULA", rarity: "unknown", cost: 3 },
  ],
  "KABUTO": [
    { maxStars: 2 },
    { stage: 0, name: "KABUTO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KABUTOPS", rarity: "unknown", cost: 3 },
  ],
  "KLINK": [
    { maxStars: 3 },
    { stage: 0, name: "KLINK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KLANG", rarity: "unknown", cost: 3 },
    { stage: 2, name: "KLINKLANG", rarity: "unknown", cost: 9 },
  ],
  "KOFFING": [
    { maxStars: 2 },
    { stage: 0, name: "KOFFING", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WEEZING", rarity: "unknown", cost: 3 },
  ],
  "KRABBY": [
    { maxStars: 2 },
    { stage: 0, name: "KRABBY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KINGLER", rarity: "unknown", cost: 3 },
  ],
  "KRICKETOT": [
    { maxStars: 2 },
    { stage: 0, name: "KRICKETOT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KRICKETUNE", rarity: "unknown", cost: 3 },
  ],
  "LARVESTA": [
    { maxStars: 2 },
    { stage: 0, name: "LARVESTA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "VOLCARONA", rarity: "unknown", cost: 3 },
  ],
  "LARVITAR": [
    { maxStars: 3 },
    { stage: 0, name: "LARVITAR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PUPITAR", rarity: "unknown", cost: 3 },
    { stage: 2, name: "TYRANITAR", rarity: "unknown", cost: 9 },
  ],
  "LEDYBA": [
    { maxStars: 2 },
    { stage: 0, name: "LEDYBA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LEDIAN", rarity: "unknown", cost: 3 },
  ],
  "LICKITUNG": [
    { maxStars: 2 },
    { stage: 0, name: "LICKITUNG", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LICKILICKY", rarity: "unknown", cost: 3 },
  ],
  "LILEEP": [
    { maxStars: 2 },
    { stage: 0, name: "LILEEP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CRADILY", rarity: "unknown", cost: 3 },
  ],
  "LILLIPUP": [
    { maxStars: 3 },
    { stage: 0, name: "LILLIPUP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HERDIER", rarity: "unknown", cost: 3 },
    { stage: 2, name: "STOUTLAND", rarity: "unknown", cost: 9 },
  ],
  "LITTEN": [
    { maxStars: 3 },
    { stage: 0, name: "LITTEN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TORRACAT", rarity: "unknown", cost: 3 },
    { stage: 2, name: "INCINEROAR", rarity: "unknown", cost: 9 },
  ],
  "LITWICK": [
    { maxStars: 3 },
    { stage: 0, name: "LITWICK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LAMPENT", rarity: "unknown", cost: 3 },
    { stage: 2, name: "CHANDELURE", rarity: "unknown", cost: 9 },
  ],
  "LOTAD": [
    { maxStars: 3 },
    { stage: 0, name: "LOTAD", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LOMBRE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "LUDICOLO", rarity: "unknown", cost: 9 },
  ],
  "MACHOP": [
    { maxStars: 3 },
    { stage: 0, name: "MACHOP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MACHOKE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "MACHAMP", rarity: "unknown", cost: 9 },
  ],
  "MAGBY": [
    { maxStars: 3 },
    { stage: 0, name: "MAGBY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MAGMAR", rarity: "unknown", cost: 3 },
    { stage: 2, name: "MAGMORTAR", rarity: "unknown", cost: 9 },
  ],
  "MAGNEMITE": [
    { maxStars: 3 },
    { stage: 0, name: "MAGNEMITE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MAGNETON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "MAGNEZONE", rarity: "unknown", cost: 9 },
  ],
  "MAKUHITA": [
    { maxStars: 2 },
    { stage: 0, name: "MAKUHITA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HARIYAMA", rarity: "unknown", cost: 3 },
  ],
  "MANKEY": [
    { maxStars: 3 },
    { stage: 0, name: "MANKEY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PRIMEAPE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "ANNIHILAPE", rarity: "unknown", cost: 9 },
  ],
  "MAREEP": [
    { maxStars: 3 },
    { stage: 0, name: "MAREEP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FLAFFY", rarity: "unknown", cost: 3 },
    { stage: 2, name: "AMPHAROS", rarity: "unknown", cost: 9 },
  ],
  "MEDITITE": [
    { maxStars: 2 },
    { stage: 0, name: "MEDITITE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MEDICHAM", rarity: "unknown", cost: 3 },
  ],
  "MEOWTH": [
    { maxStars: 2 },
    { stage: 0, name: "MEOWTH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PERSIAN", rarity: "unknown", cost: 3 },
  ],
  "MIENFOO": [
    { maxStars: 2 },
    { stage: 0, name: "MIENFOO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MIENSHAO", rarity: "unknown", cost: 3 },
  ],
  "MIMEJR": [
    { maxStars: 2 },
    { stage: 0, name: "MIMEJR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MRMIME", rarity: "unknown", cost: 3 },
  ],
  "MINCCINO": [
    { maxStars: 2 },
    { stage: 0, name: "MINCCINO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CINCCINO", rarity: "unknown", cost: 3 },
  ],
  "MISDREAVUS": [
    { maxStars: 2 },
    { stage: 0, name: "MISDREAVUS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MISMAGIUS", rarity: "unknown", cost: 3 },
  ],
  "MUDKIP": [
    { maxStars: 3 },
    { stage: 0, name: "MUDKIP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MARSHTOMP", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SWAMPERT", rarity: "unknown", cost: 9 },
  ],
  "MUNCHLAX": [
    { maxStars: 2 },
    { stage: 0, name: "MUNCHLAX", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SNORLAX", rarity: "unknown", cost: 3 },
  ],
  "MUNNA": [
    { maxStars: 2 },
    { stage: 0, name: "MUNNA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MUSHARNA", rarity: "unknown", cost: 3 },
  ],
  "MURKROW": [
    { maxStars: 2 },
    { stage: 0, name: "MURKROW", rarity: "unknown", cost: 1 },
    { stage: 1, name: "HONCHKROW", rarity: "unknown", cost: 3 },
  ],
  "NACLI": [
    { maxStars: 3 },
    { stage: 0, name: "NACLI", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NACLSTACK", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GARGANACL", rarity: "unknown", cost: 9 },
  ],
  "NATU": [
    { maxStars: 2 },
    { stage: 0, name: "NATU", rarity: "unknown", cost: 1 },
    { stage: 1, name: "XATU", rarity: "unknown", cost: 3 },
  ],
  "NICKIT": [
    { maxStars: 2 },
    { stage: 0, name: "NICKIT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "THIEVUL", rarity: "unknown", cost: 3 },
  ],
  "NIDORANF": [
    { maxStars: 3 },
    { stage: 0, name: "NIDORANF", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NIDORINA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "NIDOQUEEN", rarity: "unknown", cost: 9 },
  ],
  "NIDORANM": [
    { maxStars: 3 },
    { stage: 0, name: "NIDORANM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NIDORINO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "NIDOKING", rarity: "unknown", cost: 9 },
  ],
  "NINCADA": [
    { maxStars: 3 },
    { stage: 0, name: "NINCADA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NINJASK", rarity: "unknown", cost: 3 },
    { stage: 1, name: "SHEDINJA", rarity: "unknown", cost: 3 },
  ],
  "NINETALES": [
    { maxStars: 1 },
    { stage: 0, name: "NINETALES", rarity: "unknown", cost: 1 },
  ],
  "NOIBAT": [
    { maxStars: 2 },
    { stage: 0, name: "NOIBAT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NOIVERN", rarity: "unknown", cost: 3 },
  ],
  "NOSEPASS": [
    { maxStars: 2 },
    { stage: 0, name: "NOSEPASS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PROBOPASS", rarity: "unknown", cost: 3 },
  ],
  "NUMEL": [
    { maxStars: 2 },
    { stage: 0, name: "NUMEL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CAMERUPT", rarity: "unknown", cost: 3 },
  ],
  "NYMBLE": [
    { maxStars: 2 },
    { stage: 0, name: "NYMBLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LOKIX", rarity: "unknown", cost: 3 },
  ],
  "OMANYTE": [
    { maxStars: 2 },
    { stage: 0, name: "OMANYTE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "OMASTAR", rarity: "unknown", cost: 3 },
  ],
  "ONIX": [
    { maxStars: 2 },
    { stage: 0, name: "ONIX", rarity: "unknown", cost: 1 },
    { stage: 1, name: "STEELIX", rarity: "unknown", cost: 3 },
  ],
  "OSHAWOTT": [
    { maxStars: 3 },
    { stage: 0, name: "OSHAWOTT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DEWOTT", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SAMUROTT", rarity: "unknown", cost: 9 },
  ],
  "PALDEAWOOPER": [
    { maxStars: 2 },
    { stage: 0, name: "PALDEAWOOPER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CLODSIRE", rarity: "unknown", cost: 3 },
  ],
  "PANCHAM": [
    { maxStars: 2 },
    { stage: 0, name: "PANCHAM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PANGORO", rarity: "unknown", cost: 3 },
  ],
  "PARAS": [
    { maxStars: 2 },
    { stage: 0, name: "PARAS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PARASECT", rarity: "unknown", cost: 3 },
  ],
  "PATRAT": [
    { maxStars: 2 },
    { stage: 0, name: "PATRAT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WATCHOG", rarity: "unknown", cost: 3 },
  ],
  "PAWMI": [
    { maxStars: 3 },
    { stage: 0, name: "PAWMI", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PAWMO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "PAWMOT", rarity: "unknown", cost: 9 },
  ],
  "PAWNIARD": [
    { maxStars: 3 },
    { stage: 0, name: "PAWNIARD", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BISHARP", rarity: "unknown", cost: 3 },
    { stage: 2, name: "KINGAMBIT", rarity: "unknown", cost: 9 },
  ],
  "PETILIL": [
    { maxStars: 2 },
    { stage: 0, name: "PETILIL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LILLIGANT", rarity: "unknown", cost: 3 },
  ],
  "PHANPY": [
    { maxStars: 2 },
    { stage: 0, name: "PHANPY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DONPHAN", rarity: "unknown", cost: 3 },
  ],
  "PHANTUMP": [
    { maxStars: 2 },
    { stage: 0, name: "PHANTUMP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TREVENANT", rarity: "unknown", cost: 3 },
  ],
  "PICHU": [
    { maxStars: 3 },
    { stage: 0, name: "PICHU", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PIKACHU", rarity: "unknown", cost: 3 },
    { stage: 2, name: "RAICHU", rarity: "unknown", cost: 9 },
  ],
  "PIDGEY": [
    { maxStars: 3 },
    { stage: 0, name: "PIDGEY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PIDGEOTTO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "PIDGEOT", rarity: "unknown", cost: 9 },
  ],
  "PIDOVE": [
    { maxStars: 3 },
    { stage: 0, name: "PIDOVE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TRANQUILL", rarity: "unknown", cost: 3 },
    { stage: 2, name: "UNFEZANT", rarity: "unknown", cost: 9 },
  ],
  "PINECO": [
    { maxStars: 2 },
    { stage: 0, name: "PINECO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FORRETRESS", rarity: "unknown", cost: 3 },
  ],
  "PIPLUP": [
    { maxStars: 3 },
    { stage: 0, name: "PIPLUP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PRINPLUP", rarity: "unknown", cost: 3 },
    { stage: 2, name: "EMPOLEON", rarity: "unknown", cost: 9 },
  ],
  "POLIWAG": [
    { maxStars: 3 },
    { stage: 0, name: "POLIWAG", rarity: "unknown", cost: 1 },
    { stage: 1, name: "POLIWHIRL", rarity: "unknown", cost: 3 },
    { stage: 2, name: "POLIWRATH", rarity: "unknown", cost: 9 },
    { stage: 2, name: "POLITOED", rarity: "unknown", cost: 9 },
  ],
  "PONYTA": [
    { maxStars: 2 },
    { stage: 0, name: "PONYTA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "RAPIDASH", rarity: "unknown", cost: 3 },
  ],
  "POOCHYENA": [
    { maxStars: 2 },
    { stage: 0, name: "POOCHYENA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MIGHTYENA", rarity: "unknown", cost: 3 },
  ],
  "PORYGON": [
    { maxStars: 3 },
    { stage: 0, name: "PORYGON", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PORYGON2", rarity: "unknown", cost: 3 },
    { stage: 2, name: "PORYGONZ", rarity: "unknown", cost: 9 },
  ],
  "PSYDUCK": [
    { maxStars: 2 },
    { stage: 0, name: "PSYDUCK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GOLDUCK", rarity: "unknown", cost: 3 },
  ],
  "PUMPKABOO": [
    { maxStars: 2 },
    { stage: 0, name: "PUMPKABOO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GOURGEIST", rarity: "unknown", cost: 3 },
  ],
  "PURRLOIN": [
    { maxStars: 2 },
    { stage: 0, name: "PURRLOIN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LIEPARD", rarity: "unknown", cost: 3 },
  ],
  "RALTS": [
    { maxStars: 3 },
    { stage: 0, name: "RALTS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KIRLIA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GARDEVOIR", rarity: "unknown", cost: 9 },
    { stage: 2, name: "GALLADE", rarity: "unknown", cost: 9 },
  ],
  "RATTATA": [
    { maxStars: 2 },
    { stage: 0, name: "RATTATA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "RATICATE", rarity: "unknown", cost: 3 },
  ],
  "RHYHORN": [
    { maxStars: 3 },
    { stage: 0, name: "RHYHORN", rarity: "unknown", cost: 1 },
    { stage: 1, name: "RHYDON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "RHYPERIOR", rarity: "unknown", cost: 9 },
  ],
  "RIOLU": [
    { maxStars: 2 },
    { stage: 0, name: "RIOLU", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LUCARIO", rarity: "unknown", cost: 3 },
  ],
  "ROCKRUFF": [
    { maxStars: 2 },
    { stage: 0, name: "ROCKRUFF", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LYCANROCDAY", rarity: "unknown", cost: 3 },
  ],
  "ROGGENROLA": [
    { maxStars: 3 },
    { stage: 0, name: "ROGGENROLA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BOLDORE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "GIGALITH", rarity: "unknown", cost: 9 },
  ],
  "ROOKIDEE": [
    { maxStars: 3 },
    { stage: 0, name: "ROOKIDEE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CORVISQUIRE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "CORVIKNIGHT", rarity: "unknown", cost: 9 },
  ],
  "RUFFLET": [
    { maxStars: 2 },
    { stage: 0, name: "RUFFLET", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BRAVIARY", rarity: "unknown", cost: 3 },
  ],
  "SALANDIT": [
    { maxStars: 2 },
    { stage: 0, name: "SALANDIT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SALAZZLE", rarity: "unknown", cost: 3 },
  ],
  "SANDSHREW": [
    { maxStars: 2 },
    { stage: 0, name: "SANDSHREW", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SANDSLASH", rarity: "unknown", cost: 3 },
  ],
  "SANDSLASH": [
    { maxStars: 1 },
    { stage: 0, name: "SANDSLASH", rarity: "unknown", cost: 1 },
  ],
  "SCRAGGY": [
    { maxStars: 2 },
    { stage: 0, name: "SCRAGGY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SCRAFTY", rarity: "unknown", cost: 3 },
  ],
  "SEEDOT": [
    { maxStars: 3 },
    { stage: 0, name: "SEEDOT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NUZLEAF", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SHIFTRY", rarity: "unknown", cost: 9 },
  ],
  "SEEL": [
    { maxStars: 2 },
    { stage: 0, name: "SEEL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DEWGONG", rarity: "unknown", cost: 3 },
  ],
  "SENTRET": [
    { maxStars: 2 },
    { stage: 0, name: "SENTRET", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FURRET", rarity: "unknown", cost: 3 },
  ],
  "SEWADDLE": [
    { maxStars: 3 },
    { stage: 0, name: "SEWADDLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SWADLOON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "LEAVANNY", rarity: "unknown", cost: 9 },
  ],
  "SHELLDER": [
    { maxStars: 2 },
    { stage: 0, name: "SHELLDER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CLOYSTER", rarity: "unknown", cost: 3 },
  ],
  "SHIELDON": [
    { maxStars: 2 },
    { stage: 0, name: "SHIELDON", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BASTIODON", rarity: "unknown", cost: 3 },
  ],
  "SHINX": [
    { maxStars: 3 },
    { stage: 0, name: "SHINX", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LUXIO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "LUXRAY", rarity: "unknown", cost: 9 },
  ],
  "SHROOMISH": [
    { maxStars: 2 },
    { stage: 0, name: "SHROOMISH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BRELOOM", rarity: "unknown", cost: 3 },
  ],
  "SHUPPET": [
    { maxStars: 2 },
    { stage: 0, name: "SHUPPET", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BANETTE", rarity: "unknown", cost: 3 },
  ],
  "SILICOBRA": [
    { maxStars: 2 },
    { stage: 0, name: "SILICOBRA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SANDACONDA", rarity: "unknown", cost: 3 },
  ],
  "SINISTEA": [
    { maxStars: 2 },
    { stage: 0, name: "SINISTEA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "POLTEAGEIST", rarity: "unknown", cost: 3 },
  ],
  "SIZZLIPEDE": [
    { maxStars: 2 },
    { stage: 0, name: "SIZZLIPEDE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CENTISKORCH", rarity: "unknown", cost: 3 },
  ],
  "SKITTY": [
    { maxStars: 2 },
    { stage: 0, name: "SKITTY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DELCATTY", rarity: "unknown", cost: 3 },
  ],
  "SKORUPI": [
    { maxStars: 2 },
    { stage: 0, name: "SKORUPI", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DRAPION", rarity: "unknown", cost: 3 },
  ],
  "SKRELP": [
    { maxStars: 2 },
    { stage: 0, name: "SKRELP", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DRAGALGE", rarity: "unknown", cost: 3 },
  ],
  "SLAKOTH": [
    { maxStars: 3 },
    { stage: 0, name: "SLAKOTH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "VIGOROTH", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SLAKING", rarity: "unknown", cost: 9 },
  ],
  "SLOWPOKE": [
    { maxStars: 3 },
    { stage: 0, name: "SLOWPOKE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SLOWBRO", rarity: "unknown", cost: 3 },
    { stage: 1, name: "SLOWKING", rarity: "unknown", cost: 3 },
  ],
  "SLUGMA": [
    { maxStars: 2 },
    { stage: 0, name: "SLUGMA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MAGCARGO", rarity: "unknown", cost: 3 },
  ],
  "SMOLIV": [
    { maxStars: 3 },
    { stage: 0, name: "SMOLIV", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DOLLIV", rarity: "unknown", cost: 3 },
    { stage: 2, name: "ARBOLIVA", rarity: "unknown", cost: 9 },
  ],
  "SMOOCHUM": [
    { maxStars: 2 },
    { stage: 0, name: "SMOOCHUM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "JYNX", rarity: "unknown", cost: 3 },
  ],
  "SNEASEL": [
    { maxStars: 2 },
    { stage: 0, name: "SNEASEL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WEAVILE", rarity: "unknown", cost: 3 },
  ],
  "SNOM": [
    { maxStars: 2 },
    { stage: 0, name: "SNOM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FROSMOTH", rarity: "unknown", cost: 3 },
  ],
  "SNORUNT": [
    { maxStars: 3 },
    { stage: 0, name: "SNORUNT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GLALIE", rarity: "unknown", cost: 3 },
    { stage: 1, name: "FROSLASS", rarity: "unknown", cost: 3 },
  ],
  "SNOVER": [
    { maxStars: 2 },
    { stage: 0, name: "SNOVER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ABOMASNOW", rarity: "unknown", cost: 3 },
  ],
  "SNUBULL": [
    { maxStars: 2 },
    { stage: 0, name: "SNUBULL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GRANBULL", rarity: "unknown", cost: 3 },
  ],
  "SOBBLE": [
    { maxStars: 3 },
    { stage: 0, name: "SOBBLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DRIZZILE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "INTELEON", rarity: "unknown", cost: 9 },
  ],
  "SOLOSIS": [
    { maxStars: 3 },
    { stage: 0, name: "SOLOSIS", rarity: "unknown", cost: 1 },
    { stage: 1, name: "DUOSION", rarity: "unknown", cost: 3 },
    { stage: 2, name: "REUNICLUS", rarity: "unknown", cost: 9 },
  ],
  "SPEAROW": [
    { maxStars: 2 },
    { stage: 0, name: "SPEAROW", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FEAROW", rarity: "unknown", cost: 3 },
  ],
  "SPHEAL": [
    { maxStars: 3 },
    { stage: 0, name: "SPHEAL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SEALEO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "WALREIN", rarity: "unknown", cost: 9 },
  ],
  "SPINARAK": [
    { maxStars: 2 },
    { stage: 0, name: "SPINARAK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ARIADOS", rarity: "unknown", cost: 3 },
  ],
  "SPOINK": [
    { maxStars: 2 },
    { stage: 0, name: "SPOINK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GRUMPIG", rarity: "unknown", cost: 3 },
  ],
  "SPRIGATITO": [
    { maxStars: 3 },
    { stage: 0, name: "SPRIGATITO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "FLORAGATO", rarity: "unknown", cost: 3 },
    { stage: 2, name: "MEOWSCARADA", rarity: "unknown", cost: 9 },
  ],
  "SQUIRTLE": [
    { maxStars: 3 },
    { stage: 0, name: "SQUIRTLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WARTORTLE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "BLASTOISE", rarity: "unknown", cost: 9 },
  ],
  "STARLY": [
    { maxStars: 3 },
    { stage: 0, name: "STARLY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "STARAVIA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "STARAPTOR", rarity: "unknown", cost: 9 },
  ],
  "STARYU": [
    { maxStars: 2 },
    { stage: 0, name: "STARYU", rarity: "unknown", cost: 1 },
    { stage: 1, name: "STARMIE", rarity: "unknown", cost: 3 },
  ],
  "STUFFUL": [
    { maxStars: 2 },
    { stage: 0, name: "STUFFUL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BEWEAR", rarity: "unknown", cost: 3 },
  ],
  "STUNKY": [
    { maxStars: 2 },
    { stage: 0, name: "STUNKY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SKUNTANK", rarity: "unknown", cost: 3 },
  ],
  "SURSKIT": [
    { maxStars: 2 },
    { stage: 0, name: "SURSKIT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MASQUERAIN", rarity: "unknown", cost: 3 },
  ],
  "SWABLU": [
    { maxStars: 2 },
    { stage: 0, name: "SWABLU", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ALTARIA", rarity: "unknown", cost: 3 },
  ],
  "SWINUB": [
    { maxStars: 3 },
    { stage: 0, name: "SWINUB", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PILOSWINE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "MAMOSWINE", rarity: "unknown", cost: 9 },
  ],
  "TADBULB": [
    { maxStars: 2 },
    { stage: 0, name: "TADBULB", rarity: "unknown", cost: 1 },
    { stage: 1, name: "BELLIBOLT", rarity: "unknown", cost: 3 },
  ],
  "TAILLOW": [
    { maxStars: 2 },
    { stage: 0, name: "TAILLOW", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SWELLOW", rarity: "unknown", cost: 3 },
  ],
  "TANGELA": [
    { maxStars: 2 },
    { stage: 0, name: "TANGELA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TANGROWTH", rarity: "unknown", cost: 3 },
  ],
  "TEDDIURSA": [
    { maxStars: 3 },
    { stage: 0, name: "TEDDIURSA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "URSARING", rarity: "unknown", cost: 3 },
    { stage: 2, name: "URSALUNA", rarity: "unknown", cost: 9 },
  ],
  "TENTACOOL": [
    { maxStars: 2 },
    { stage: 0, name: "TENTACOOL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TENTACRUEL", rarity: "unknown", cost: 3 },
  ],
  "TIMBURR": [
    { maxStars: 3 },
    { stage: 0, name: "TIMBURR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GURDURR", rarity: "unknown", cost: 3 },
    { stage: 2, name: "CONKELDURR", rarity: "unknown", cost: 9 },
  ],
  "TINKATINK": [
    { maxStars: 3 },
    { stage: 0, name: "TINKATINK", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TINKATUFF", rarity: "unknown", cost: 3 },
    { stage: 2, name: "TINKATON", rarity: "unknown", cost: 9 },
  ],
  "TOGEPI": [
    { maxStars: 3 },
    { stage: 0, name: "TOGEPI", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TOGETIC", rarity: "unknown", cost: 3 },
    { stage: 2, name: "TOGEKISS", rarity: "unknown", cost: 9 },
  ],
  "TORCHIC": [
    { maxStars: 3 },
    { stage: 0, name: "TORCHIC", rarity: "unknown", cost: 1 },
    { stage: 1, name: "COMBUSKEN", rarity: "unknown", cost: 3 },
    { stage: 2, name: "BLAZIKEN", rarity: "unknown", cost: 9 },
  ],
  "TOTODILE": [
    { maxStars: 3 },
    { stage: 0, name: "TOTODILE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "CROCONAW", rarity: "unknown", cost: 3 },
    { stage: 2, name: "FERALIGATR", rarity: "unknown", cost: 9 },
  ],
  "TOXEL": [
    { maxStars: 2 },
    { stage: 0, name: "TOXEL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TOXTRICITY", rarity: "unknown", cost: 3 },
  ],
  "TRAPINCH": [
    { maxStars: 3 },
    { stage: 0, name: "TRAPINCH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "VIBRAVA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "FLYGON", rarity: "unknown", cost: 9 },
  ],
  "TREECKO": [
    { maxStars: 3 },
    { stage: 0, name: "TREECKO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GROVYLE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SCEPTILE", rarity: "unknown", cost: 9 },
  ],
  "TRUBBISH": [
    { maxStars: 2 },
    { stage: 0, name: "TRUBBISH", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GARBODOR", rarity: "unknown", cost: 3 },
  ],
  "TURTWIG": [
    { maxStars: 3 },
    { stage: 0, name: "TURTWIG", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GROTLE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "TORTERRA", rarity: "unknown", cost: 9 },
  ],
  "TYNAMO": [
    { maxStars: 3 },
    { stage: 0, name: "TYNAMO", rarity: "unknown", cost: 1 },
    { stage: 1, name: "EELEKTRIK", rarity: "unknown", cost: 3 },
    { stage: 2, name: "EELEKTROSS", rarity: "unknown", cost: 9 },
  ],
  "TYRUNT": [
    { maxStars: 2 },
    { stage: 0, name: "TYRUNT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "TYRANTRUM", rarity: "unknown", cost: 3 },
  ],
  "VANILLITE": [
    { maxStars: 3 },
    { stage: 0, name: "VANILLITE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "VANILLISH", rarity: "unknown", cost: 3 },
    { stage: 2, name: "VANILLUXE", rarity: "unknown", cost: 9 },
  ],
  "VAROOM": [
    { maxStars: 2 },
    { stage: 0, name: "VAROOM", rarity: "unknown", cost: 1 },
    { stage: 1, name: "REVAVROOM", rarity: "unknown", cost: 3 },
  ],
  "VENIPEDE": [
    { maxStars: 3 },
    { stage: 0, name: "VENIPEDE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WHIRLIPEDE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "SCOLIPEDE", rarity: "unknown", cost: 9 },
  ],
  "VENONAT": [
    { maxStars: 2 },
    { stage: 0, name: "VENONAT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "VENOMOTH", rarity: "unknown", cost: 3 },
  ],
  "VOLTORB": [
    { maxStars: 2 },
    { stage: 0, name: "VOLTORB", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ELECTRODE", rarity: "unknown", cost: 3 },
  ],
  "VULLABY": [
    { maxStars: 2 },
    { stage: 0, name: "VULLABY", rarity: "unknown", cost: 1 },
    { stage: 1, name: "MANDIBUZZ", rarity: "unknown", cost: 3 },
  ],
  "VULPIX": [
    { maxStars: 2 },
    { stage: 0, name: "VULPIX", rarity: "unknown", cost: 1 },
    { stage: 1, name: "NINETALES", rarity: "unknown", cost: 3 },
  ],
  "WAILMER": [
    { maxStars: 2 },
    { stage: 0, name: "WAILMER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WAILORD", rarity: "unknown", cost: 3 },
  ],
  "WATTREL": [
    { maxStars: 2 },
    { stage: 0, name: "WATTREL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KILOWATTREL", rarity: "unknown", cost: 3 },
  ],
  "WEEDLE": [
    { maxStars: 3 },
    { stage: 0, name: "WEEDLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "KAKUNA", rarity: "unknown", cost: 3 },
    { stage: 2, name: "BEEDRILL", rarity: "unknown", cost: 9 },
  ],
  "WEEZING": [
    { maxStars: 2 },
    { stage: 0, name: "KOFFING", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WEEZING", rarity: "unknown", cost: 3 },
  ],
  "WHISMUR": [
    { maxStars: 3 },
    { stage: 0, name: "WHISMUR", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LOUDRED", rarity: "unknown", cost: 3 },
    { stage: 2, name: "EXPLOUD", rarity: "unknown", cost: 9 },
  ],
  "WIGLETT": [
    { maxStars: 2 },
    { stage: 0, name: "WIGLETT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WUGTRIO", rarity: "unknown", cost: 3 },
  ],
  "WIMPOD": [
    { maxStars: 2 },
    { stage: 0, name: "WIMPOD", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GOLISOPOD", rarity: "unknown", cost: 3 },
  ],
  "WINGULL": [
    { maxStars: 2 },
    { stage: 0, name: "WINGULL", rarity: "unknown", cost: 1 },
    { stage: 1, name: "PELIPPER", rarity: "unknown", cost: 3 },
  ],
  "WOOBAT": [
    { maxStars: 2 },
    { stage: 0, name: "WOOBAT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SWOOBAT", rarity: "unknown", cost: 3 },
  ],
  "WOOPER": [
    { maxStars: 2 },
    { stage: 0, name: "WOOPER", rarity: "unknown", cost: 1 },
    { stage: 1, name: "QUAGSIRE", rarity: "unknown", cost: 3 },
  ],
  "WURMPLE": [
    { maxStars: 3 },
    { stage: 0, name: "WURMPLE", rarity: "unknown", cost: 1 },
    { stage: 1, name: "SILCOON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "BEAUTIFLY", rarity: "unknown", cost: 9 },
    { stage: 1, name: "CASCOON", rarity: "unknown", cost: 3 },
    { stage: 2, name: "DUSTOX", rarity: "unknown", cost: 9 },
  ],
  "WYNAUT": [
    { maxStars: 2 },
    { stage: 0, name: "WYNAUT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "WOBBUFFET", rarity: "unknown", cost: 3 },
  ],
  "YANMA": [
    { maxStars: 2 },
    { stage: 0, name: "YANMA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "YANMEGA", rarity: "unknown", cost: 3 },
  ],
  "ZIGZAGOON": [
    { maxStars: 3 },
    { stage: 0, name: "ZIGZAGOON", rarity: "unknown", cost: 1 },
    { stage: 1, name: "LINOONE", rarity: "unknown", cost: 3 },
    { stage: 2, name: "OBSTAGOON", rarity: "unknown", cost: 9 },
  ],
  "ZORUA": [
    { maxStars: 2 },
    { stage: 0, name: "ZORUA", rarity: "unknown", cost: 1 },
    { stage: 1, name: "ZOROARK", rarity: "unknown", cost: 3 },
  ],
  "ZUBAT": [
    { maxStars: 3 },
    { stage: 0, name: "ZUBAT", rarity: "unknown", cost: 1 },
    { stage: 1, name: "GOLBAT", rarity: "unknown", cost: 3 },
    { stage: 2, name: "CROBAT", rarity: "unknown", cost: 9 },
  ],
};

// Map of all pokemon names to their base forms
const POKEMON_TO_BASE = {
  "ABOMASNOW": "SNOVER",
  "ABRA": "ABRA",
  "AEGISLASH": "HONEDGE",
  "AGGRON": "ARON",
  "AIPOM": "AIPOM",
  "ALAKAZAM": "ABRA",
  "ALTARIA": "SWABLU",
  "AMAURA": "AMAURA",
  "AMBIPOM": "AIPOM",
  "AMPHAROS": "MAREEP",
  "ANNIHILAPE": "MANKEY",
  "ANORITH": "ANORITH",
  "ARAQUANID": "DEWPIDER",
  "ARBOK": "EKANS",
  "ARBOLIVA": "SMOLIV",
  "ARCANINE": "GROWLITHE",
  "ARCHEN": "ARCHEN",
  "ARCHEOPS": "ARCHEN",
  "ARCTIBAX": "FRIGIBAX",
  "ARIADOS": "SPINARAK",
  "ARMALDO": "ANORITH",
  "ARON": "ARON",
  "AURORUS": "AMAURA",
  "AZUMARILL": "AZURILL",
  "AZURILL": "AZURILL",
  "BAGON": "BAGON",
  "BALTOY": "BALTOY",
  "BANETTE": "SHUPPET",
  "BARBARACLE": "BINACLE",
  "BARBOACH": "BARBOACH",
  "BASTIODON": "SHIELDON",
  "BAXCALIBUR": "FRIGIBAX",
  "BEARTIC": "CUBCHOO",
  "BEAUTIFLY": "WURMPLE",
  "BEEDRILL": "WEEDLE",
  "BEHEEYEM": "ELGYEM",
  "BELDUM": "BELDUM",
  "BELLIBOLT": "TADBULB",
  "BEWEAR": "STUFFUL",
  "BIBAREL": "BIDOOF",
  "BIDOOF": "BIDOOF",
  "BINACLE": "BINACLE",
  "BISHARP": "PAWNIARD",
  "BLASTOISE": "SQUIRTLE",
  "BLAZIKEN": "TORCHIC",
  "BLIPBUG": "BLIPBUG",
  "BLISSEY": "HAPPINY",
  "BOLDORE": "ROGGENROLA",
  "BONSLEY": "BONSLEY",
  "BOUNSWEET": "BOUNSWEET",
  "BRAIXEN": "FENNEKIN",
  "BRAVIARY": "RUFFLET",
  "BRELOOM": "SHROOMISH",
  "BRONZONG": "BRONZOR",
  "BRONZOR": "BRONZOR",
  "BUDEW": "BUDEW",
  "BUIZEL": "BUIZEL",
  "BULBASAUR": "BULBASAUR",
  "BUNEARY": "BUNEARY",
  "BUTTERFREE": "CATERPIE",
  "CACNEA": "CACNEA",
  "CACTURNE": "CACNEA",
  "CAMERUPT": "NUMEL",
  "CAPSAKID": "CAPSAKID",
  "CARBINK": "CARBINK",
  "CARVANHA": "CARVANHA",
  "CASCOON": "WURMPLE",
  "CATERPIE": "CATERPIE",
  "CENTISKORCH": "SIZZLIPEDE",
  "CHANDELURE": "LITWICK",
  "CHANSEY": "HAPPINY",
  "CHARIZARD": "CHARMANDER",
  "CHARMANDER": "CHARMANDER",
  "CHARMELEON": "CHARMANDER",
  "CHERRIM": "CHERUBI",
  "CHERUBI": "CHERUBI",
  "CHESNAUGHT": "CHESPIN",
  "CHESPIN": "CHESPIN",
  "CHEWTLE": "CHEWTLE",
  "CHIMCHAR": "CHIMCHAR",
  "CHINCHOU": "CHINCHOU",
  "CINCCINO": "MINCCINO",
  "CLAMPERL": "CLAMPERL",
  "CLAUNCHER": "CLAUNCHER",
  "CLAWITZER": "CLAUNCHER",
  "CLAYDOL": "BALTOY",
  "CLEFABLE": "CLEFFA",
  "CLEFAIRY": "CLEFFA",
  "CLEFFA": "CLEFFA",
  "CLOBBOPUS": "CLOBBOPUS",
  "CLODSIRE": "PALDEAWOOPER",
  "CLOYSTER": "SHELLDER",
  "COMBEE": "COMBEE",
  "COMBUSKEN": "TORCHIC",
  "CONKELDURR": "TIMBURR",
  "CORPHISH": "CORPHISH",
  "CORSOLA": "CORSOLA",
  "CORVIKNIGHT": "ROOKIDEE",
  "CORVISQUIRE": "ROOKIDEE",
  "COTTONEE": "COTTONEE",
  "CRABOMINABLE": "CRABRAWLER",
  "CRABRAWLER": "CRABRAWLER",
  "CRADILY": "LILEEP",
  "CRANIDOS": "CRANIDOS",
  "CRAWDAUNT": "CORPHISH",
  "CROAGUNK": "CROAGUNK",
  "CROBAT": "ZUBAT",
  "CROCALOR": "FUECOCO",
  "CROCONAW": "TOTODILE",
  "CUBCHOO": "CUBCHOO",
  "CUBONE": "CUBONE",
  "CURSOLA": "GALARCORSOLA",
  "CUTIEFLY": "CUTIEFLY",
  "CYNDAQUIL": "CYNDAQUIL",
  "DACHSBUN": "FIDOUGH",
  "DARMANITAN": "DARUMAKA",
  "DARUMAKA": "DARUMAKA",
  "DEINO": "DEINO",
  "DELCATTY": "SKITTY",
  "DELPHOX": "FENNEKIN",
  "DEWGONG": "SEEL",
  "DEWOTT": "OSHAWOTT",
  "DEWPIDER": "DEWPIDER",
  "DIANCIE": "DIANCIE",
  "DIGLETT": "DIGLETT",
  "DODRIO": "DODUO",
  "DODUO": "DODUO",
  "DOLLIV": "SMOLIV",
  "DONPHAN": "PHANPY",
  "DOTTLER": "BLIPBUG",
  "DOUBLADE": "HONEDGE",
  "DRAGALGE": "SKRELP",
  "DRAGONAIR": "DRATINI",
  "DRAGONITE": "DRATINI",
  "DRAPION": "SKORUPI",
  "DRATINI": "DRATINI",
  "DREDNAW": "CHEWTLE",
  "DRIFBLIM": "DRIFLOON",
  "DRIFLOON": "DRIFLOON",
  "DRILBUR": "DRILBUR",
  "DRIZZILE": "SOBBLE",
  "DROWZEE": "DROWZEE",
  "DUGTRIO": "DIGLETT",
  "DUOSION": "SOLOSIS",
  "DUSTOX": "WURMPLE",
  "EELEKTRIK": "TYNAMO",
  "EELEKTROSS": "TYNAMO",
  "EKANS": "EKANS",
  "ELDEGOSS": "GOSSIFLEUR",
  "ELECTABUZZ": "ELEKID",
  "ELECTIVIRE": "ELEKID",
  "ELECTRIKE": "ELECTRIKE",
  "ELECTRODE": "VOLTORB",
  "ELEKID": "ELEKID",
  "ELGYEM": "ELGYEM",
  "EMPOLEON": "PIPLUP",
  "ESPURR": "ESPURR",
  "EXCADRILL": "DRILBUR",
  "EXEGGCUTE": "EXEGGCUTE",
  "EXEGGUTOR": "EXEGGCUTE",
  "EXPLOUD": "WHISMUR",
  "FARIGIRAF": "GIRAFARIG",
  "FEAROW": "SPEAROW",
  "FENNEKIN": "FENNEKIN",
  "FERALIGATR": "TOTODILE",
  "FERROSEED": "FERROSEED",
  "FERROTHORN": "FERROSEED",
  "FIDOUGH": "FIDOUGH",
  "FINNEON": "FINNEON",
  "FLABEBE": "FLABEBE",
  "FLAFFY": "MAREEP",
  "FLETCHINDER": "FLETCHLING",
  "FLETCHLING": "FLETCHLING",
  "FLOATZEL": "BUIZEL",
  "FLOETTE": "FLABEBE",
  "FLORAGATO": "SPRIGATITO",
  "FLORGES": "FLABEBE",
  "FLYGON": "TRAPINCH",
  "FOMANTIS": "FOMANTIS",
  "FORRETRESS": "PINECO",
  "FRIGIBAX": "FRIGIBAX",
  "FROSLASS": "SNORUNT",
  "FROSMOTH": "SNOM",
  "FUECOCO": "FUECOCO",
  "FURRET": "SENTRET",
  "GABITE": "GIBLE",
  "GALARCORSOLA": "GALARCORSOLA",
  "GALLADE": "RALTS",
  "GALVANTULA": "JOLTIK",
  "GARBODOR": "TRUBBISH",
  "GARCHOMP": "GIBLE",
  "GARDEVOIR": "RALTS",
  "GARGANACL": "NACLI",
  "GASTLY": "GASTLY",
  "GENGAR": "GASTLY",
  "GEODUDE": "GEODUDE",
  "GIBLE": "GIBLE",
  "GIGALITH": "ROGGENROLA",
  "GIRAFARIG": "GIRAFARIG",
  "GLALIE": "SNORUNT",
  "GLAMEOW": "GLAMEOW",
  "GLIGAR": "GLIGAR",
  "GLIMMET": "GLIMMET",
  "GLIMMORA": "GLIMMET",
  "GLISCOR": "GLIGAR",
  "GOLBAT": "ZUBAT",
  "GOLDEEN": "GOLDEEN",
  "GOLDUCK": "PSYDUCK",
  "GOLEM": "GEODUDE",
  "GOLETT": "GOLETT",
  "GOLISOPOD": "WIMPOD",
  "GOLURK": "GOLETT",
  "GOODRA": "GOOMY",
  "GOOMY": "GOOMY",
  "GOREBYSS": "CLAMPERL",
  "GOSSIFLEUR": "GOSSIFLEUR",
  "GOURGEIST": "PUMPKABOO",
  "GRANBULL": "SNUBULL",
  "GRAPPLOCT": "CLOBBOPUS",
  "GRAVELER": "GEODUDE",
  "GREAVARD": "GREAVARD",
  "GRIMER": "GRIMER",
  "GRIMMSNARL": "IMPIDIMP",
  "GROOKEY": "GROOKEY",
  "GROTLE": "TURTWIG",
  "GROVYLE": "TREECKO",
  "GROWLITHE": "GROWLITHE",
  "GRUMPIG": "SPOINK",
  "GULPIN": "GULPIN",
  "GURDURR": "TIMBURR",
  "HAKAMOO": "JANGMOO",
  "HAPPINY": "HAPPINY",
  "HARIYAMA": "MAKUHITA",
  "HATENNA": "HATENNA",
  "HATTERENE": "HATENNA",
  "HATTREM": "HATENNA",
  "HAUNTER": "GASTLY",
  "HELIOLISK": "HELIOPTILE",
  "HELIOPTILE": "HELIOPTILE",
  "HERDIER": "LILLIPUP",
  "HIPPODOWN": "HIPPOPOTAS",
  "HIPPOPOTAS": "HIPPOPOTAS",
  "HONCHKROW": "MURKROW",
  "HONEDGE": "HONEDGE",
  "HOOTHOOT": "HOOTHOOT",
  "HORSEA": "HORSEA",
  "HOUNDOOM": "HOUNDOUR",
  "HOUNDOUR": "HOUNDOUR",
  "HOUNDSTONE": "GREAVARD",
  "HUNTAIL": "CLAMPERL",
  "HYDREIGON": "DEINO",
  "HYPNO": "DROWZEE",
  "IGGLYBUFF": "IGGLYBUFF",
  "IMPIDIMP": "IMPIDIMP",
  "INCINEROAR": "LITTEN",
  "INFERNAPE": "CHIMCHAR",
  "INKAY": "INKAY",
  "INTELEON": "SOBBLE",
  "IVYSAUR": "BULBASAUR",
  "JANGMOO": "JANGMOO",
  "JIGGLYPUFF": "IGGLYBUFF",
  "JOLTIK": "JOLTIK",
  "JYNX": "SMOOCHUM",
  "KABUTO": "KABUTO",
  "KABUTOPS": "KABUTO",
  "KADABRA": "ABRA",
  "KAKUNA": "WEEDLE",
  "KILOWATTREL": "WATTREL",
  "KINGAMBIT": "PAWNIARD",
  "KINGDRA": "HORSEA",
  "KINGLER": "KRABBY",
  "KIRLIA": "RALTS",
  "KLANG": "KLINK",
  "KLINK": "KLINK",
  "KLINKLANG": "KLINK",
  "KOFFING": "KOFFING",
  "KOMMOO": "JANGMOO",
  "KRABBY": "KRABBY",
  "KRICKETOT": "KRICKETOT",
  "KRICKETUNE": "KRICKETOT",
  "LAIRON": "ARON",
  "LAMPENT": "LITWICK",
  "LANTURN": "CHINCHOU",
  "LARVESTA": "LARVESTA",
  "LARVITAR": "LARVITAR",
  "LEAVANNY": "SEWADDLE",
  "LEDIAN": "LEDYBA",
  "LEDYBA": "LEDYBA",
  "LICKILICKY": "LICKITUNG",
  "LICKITUNG": "LICKITUNG",
  "LIEPARD": "PURRLOIN",
  "LILEEP": "LILEEP",
  "LILLIGANT": "PETILIL",
  "LILLIPUP": "LILLIPUP",
  "LINOONE": "ZIGZAGOON",
  "LITTEN": "LITTEN",
  "LITWICK": "LITWICK",
  "LOKIX": "NYMBLE",
  "LOMBRE": "LOTAD",
  "LOPUNNY": "BUNEARY",
  "LOTAD": "LOTAD",
  "LOUDRED": "WHISMUR",
  "LUCARIO": "RIOLU",
  "LUDICOLO": "LOTAD",
  "LUMINEON": "FINNEON",
  "LURANTIS": "FOMANTIS",
  "LUXIO": "SHINX",
  "LUXRAY": "SHINX",
  "LYCANROCDAY": "ROCKRUFF",
  "MACHAMP": "MACHOP",
  "MACHOKE": "MACHOP",
  "MACHOP": "MACHOP",
  "MAGBY": "MAGBY",
  "MAGCARGO": "SLUGMA",
  "MAGMAR": "MAGBY",
  "MAGMORTAR": "MAGBY",
  "MAGNEMITE": "MAGNEMITE",
  "MAGNETON": "MAGNEMITE",
  "MAGNEZONE": "MAGNEMITE",
  "MAKUHITA": "MAKUHITA",
  "MALAMAR": "INKAY",
  "MAMOSWINE": "SWINUB",
  "MANDIBUZZ": "VULLABY",
  "MANECTRIC": "ELECTRIKE",
  "MANKEY": "MANKEY",
  "MAREEP": "MAREEP",
  "MARILL": "AZURILL",
  "MAROWAK": "CUBONE",
  "MARSHTOMP": "MUDKIP",
  "MASQUERAIN": "SURSKIT",
  "MEDICHAM": "MEDITITE",
  "MEDITITE": "MEDITITE",
  "MEOWSCARADA": "SPRIGATITO",
  "MEOWSTICMALE": "ESPURR",
  "MEOWTH": "MEOWTH",
  "METAGROSS": "BELDUM",
  "METANG": "BELDUM",
  "METAPOD": "CATERPIE",
  "MIENFOO": "MIENFOO",
  "MIENSHAO": "MIENFOO",
  "MIGHTYENA": "POOCHYENA",
  "MIMEJR": "MIMEJR",
  "MINCCINO": "MINCCINO",
  "MISDREAVUS": "MISDREAVUS",
  "MISMAGIUS": "MISDREAVUS",
  "MONFERNO": "CHIMCHAR",
  "MORGREM": "IMPIDIMP",
  "MRMIME": "MIMEJR",
  "MUDKIP": "MUDKIP",
  "MUK": "GRIMER",
  "MUNCHLAX": "MUNCHLAX",
  "MUNNA": "MUNNA",
  "MURKROW": "MURKROW",
  "MUSHARNA": "MUNNA",
  "NACLI": "NACLI",
  "NACLSTACK": "NACLI",
  "NATU": "NATU",
  "NICKIT": "NICKIT",
  "NIDOKING": "NIDORANM",
  "NIDOQUEEN": "NIDORANF",
  "NIDORANF": "NIDORANF",
  "NIDORANM": "NIDORANM",
  "NIDORINA": "NIDORANF",
  "NIDORINO": "NIDORANM",
  "NINCADA": "NINCADA",
  "NINETALES": "VULPIX",
  "NINJASK": "NINCADA",
  "NOCTOWL": "HOOTHOOT",
  "NOIBAT": "NOIBAT",
  "NOIVERN": "NOIBAT",
  "NOSEPASS": "NOSEPASS",
  "NUMEL": "NUMEL",
  "NUZLEAF": "SEEDOT",
  "NYMBLE": "NYMBLE",
  "OBSTAGOON": "ZIGZAGOON",
  "OMANYTE": "OMANYTE",
  "OMASTAR": "OMANYTE",
  "ONIX": "ONIX",
  "ORBEETLE": "BLIPBUG",
  "OSHAWOTT": "OSHAWOTT",
  "PALDEAWOOPER": "PALDEAWOOPER",
  "PANCHAM": "PANCHAM",
  "PANGORO": "PANCHAM",
  "PARAS": "PARAS",
  "PARASECT": "PARAS",
  "PATRAT": "PATRAT",
  "PAWMI": "PAWMI",
  "PAWMO": "PAWMI",
  "PAWMOT": "PAWMI",
  "PAWNIARD": "PAWNIARD",
  "PELIPPER": "WINGULL",
  "PERSIAN": "MEOWTH",
  "PETILIL": "PETILIL",
  "PHANPY": "PHANPY",
  "PHANTUMP": "PHANTUMP",
  "PICHU": "PICHU",
  "PIDGEOT": "PIDGEY",
  "PIDGEOTTO": "PIDGEY",
  "PIDGEY": "PIDGEY",
  "PIDOVE": "PIDOVE",
  "PIKACHU": "PICHU",
  "PILOSWINE": "SWINUB",
  "PINECO": "PINECO",
  "PIPLUP": "PIPLUP",
  "POLITOED": "POLIWAG",
  "POLIWAG": "POLIWAG",
  "POLIWHIRL": "POLIWAG",
  "POLIWRATH": "POLIWAG",
  "POLTEAGEIST": "SINISTEA",
  "PONYTA": "PONYTA",
  "POOCHYENA": "POOCHYENA",
  "PORYGON": "PORYGON",
  "PORYGON2": "PORYGON",
  "PORYGONZ": "PORYGON",
  "PRIMEAPE": "MANKEY",
  "PRINPLUP": "PIPLUP",
  "PROBOPASS": "NOSEPASS",
  "PSYDUCK": "PSYDUCK",
  "PUMPKABOO": "PUMPKABOO",
  "PUPITAR": "LARVITAR",
  "PURRLOIN": "PURRLOIN",
  "PURUGLY": "GLAMEOW",
  "QUAGSIRE": "WOOPER",
  "QUILAVA": "CYNDAQUIL",
  "QUILLADIN": "CHESPIN",
  "RAICHU": "PICHU",
  "RALTS": "RALTS",
  "RAMPARDOS": "CRANIDOS",
  "RAPIDASH": "PONYTA",
  "RATICATE": "RATTATA",
  "RATTATA": "RATTATA",
  "REUNICLUS": "SOLOSIS",
  "REVAVROOM": "VAROOM",
  "RHYDON": "RHYHORN",
  "RHYHORN": "RHYHORN",
  "RHYPERIOR": "RHYHORN",
  "RIBOMBEE": "CUTIEFLY",
  "RILLABOOM": "GROOKEY",
  "RIOLU": "RIOLU",
  "ROCKRUFF": "ROCKRUFF",
  "ROGGENROLA": "ROGGENROLA",
  "ROOKIDEE": "ROOKIDEE",
  "ROSELIA": "BUDEW",
  "ROSERADE": "BUDEW",
  "RUFFLET": "RUFFLET",
  "SALAMENCE": "BAGON",
  "SALANDIT": "SALANDIT",
  "SALAZZLE": "SALANDIT",
  "SAMUROTT": "OSHAWOTT",
  "SANDACONDA": "SILICOBRA",
  "SANDSHREW": "SANDSHREW",
  "SANDSLASH": "SANDSLASH",
  "SCEPTILE": "TREECKO",
  "SCOLIPEDE": "VENIPEDE",
  "SCOVILLAIN": "CAPSAKID",
  "SCRAFTY": "SCRAGGY",
  "SCRAGGY": "SCRAGGY",
  "SEADRA": "HORSEA",
  "SEAKING": "GOLDEEN",
  "SEALEO": "SPHEAL",
  "SEEDOT": "SEEDOT",
  "SEEL": "SEEL",
  "SENTRET": "SENTRET",
  "SEWADDLE": "SEWADDLE",
  "SHARPEDO": "CARVANHA",
  "SHEDINJA": "NINCADA",
  "SHELGON": "BAGON",
  "SHELLDER": "SHELLDER",
  "SHIELDON": "SHIELDON",
  "SHIFTRY": "SEEDOT",
  "SHINX": "SHINX",
  "SHROOMISH": "SHROOMISH",
  "SHUPPET": "SHUPPET",
  "SILCOON": "WURMPLE",
  "SILICOBRA": "SILICOBRA",
  "SINISTEA": "SINISTEA",
  "SIZZLIPEDE": "SIZZLIPEDE",
  "SKELEDIRGE": "FUECOCO",
  "SKITTY": "SKITTY",
  "SKORUPI": "SKORUPI",
  "SKRELP": "SKRELP",
  "SKUNTANK": "STUNKY",
  "SLAKING": "SLAKOTH",
  "SLAKOTH": "SLAKOTH",
  "SLIGOO": "GOOMY",
  "SLOWBRO": "SLOWPOKE",
  "SLOWKING": "SLOWPOKE",
  "SLOWPOKE": "SLOWPOKE",
  "SLUGMA": "SLUGMA",
  "SMOLIV": "SMOLIV",
  "SMOOCHUM": "SMOOCHUM",
  "SNEASEL": "SNEASEL",
  "SNOM": "SNOM",
  "SNORLAX": "MUNCHLAX",
  "SNORUNT": "SNORUNT",
  "SNOVER": "SNOVER",
  "SNUBULL": "SNUBULL",
  "SOBBLE": "SOBBLE",
  "SOLOSIS": "SOLOSIS",
  "SPEAROW": "SPEAROW",
  "SPHEAL": "SPHEAL",
  "SPINARAK": "SPINARAK",
  "SPOINK": "SPOINK",
  "SPRIGATITO": "SPRIGATITO",
  "SQUIRTLE": "SQUIRTLE",
  "STARAPTOR": "STARLY",
  "STARAVIA": "STARLY",
  "STARLY": "STARLY",
  "STARMIE": "STARYU",
  "STARYU": "STARYU",
  "STEELIX": "ONIX",
  "STEENEE": "BOUNSWEET",
  "STOUTLAND": "LILLIPUP",
  "STUFFUL": "STUFFUL",
  "STUNKY": "STUNKY",
  "SUDOWOODO": "BONSLEY",
  "SURSKIT": "SURSKIT",
  "SWABLU": "SWABLU",
  "SWADLOON": "SEWADDLE",
  "SWALOT": "GULPIN",
  "SWAMPERT": "MUDKIP",
  "SWELLOW": "TAILLOW",
  "SWINUB": "SWINUB",
  "SWOOBAT": "WOOBAT",
  "TADBULB": "TADBULB",
  "TAILLOW": "TAILLOW",
  "TALONFLAME": "FLETCHLING",
  "TANGELA": "TANGELA",
  "TANGROWTH": "TANGELA",
  "TEDDIURSA": "TEDDIURSA",
  "TENTACOOL": "TENTACOOL",
  "TENTACRUEL": "TENTACOOL",
  "THIEVUL": "NICKIT",
  "THWACKEY": "GROOKEY",
  "TIMBURR": "TIMBURR",
  "TINKATINK": "TINKATINK",
  "TINKATON": "TINKATINK",
  "TINKATUFF": "TINKATINK",
  "TOGEKISS": "TOGEPI",
  "TOGEPI": "TOGEPI",
  "TOGETIC": "TOGEPI",
  "TORCHIC": "TORCHIC",
  "TORRACAT": "LITTEN",
  "TORTERRA": "TURTWIG",
  "TOTODILE": "TOTODILE",
  "TOXEL": "TOXEL",
  "TOXICROAK": "CROAGUNK",
  "TOXTRICITY": "TOXEL",
  "TRANQUILL": "PIDOVE",
  "TRAPINCH": "TRAPINCH",
  "TREECKO": "TREECKO",
  "TREVENANT": "PHANTUMP",
  "TRUBBISH": "TRUBBISH",
  "TSAREENA": "BOUNSWEET",
  "TURTWIG": "TURTWIG",
  "TYNAMO": "TYNAMO",
  "TYPHLOSION": "CYNDAQUIL",
  "TYRANITAR": "LARVITAR",
  "TYRANTRUM": "TYRUNT",
  "TYRUNT": "TYRUNT",
  "UNFEZANT": "PIDOVE",
  "URSALUNA": "TEDDIURSA",
  "URSARING": "TEDDIURSA",
  "VANILLISH": "VANILLITE",
  "VANILLITE": "VANILLITE",
  "VANILLUXE": "VANILLITE",
  "VAROOM": "VAROOM",
  "VENIPEDE": "VENIPEDE",
  "VENOMOTH": "VENONAT",
  "VENONAT": "VENONAT",
  "VENUSAUR": "BULBASAUR",
  "VESPIQUEEN": "COMBEE",
  "VIBRAVA": "TRAPINCH",
  "VIGOROTH": "SLAKOTH",
  "VOLCARONA": "LARVESTA",
  "VOLTORB": "VOLTORB",
  "VULLABY": "VULLABY",
  "VULPIX": "VULPIX",
  "WAILMER": "WAILMER",
  "WAILORD": "WAILMER",
  "WALREIN": "SPHEAL",
  "WARTORTLE": "SQUIRTLE",
  "WATCHOG": "PATRAT",
  "WATTREL": "WATTREL",
  "WEAVILE": "SNEASEL",
  "WEEDLE": "WEEDLE",
  "WEEZING": "WEEZING",
  "WHIMSICOTT": "COTTONEE",
  "WHIRLIPEDE": "VENIPEDE",
  "WHISCASH": "BARBOACH",
  "WHISMUR": "WHISMUR",
  "WIGGLYTUFF": "IGGLYBUFF",
  "WIGLETT": "WIGLETT",
  "WIMPOD": "WIMPOD",
  "WINGULL": "WINGULL",
  "WOBBUFFET": "WYNAUT",
  "WOOBAT": "WOOBAT",
  "WOOPER": "WOOPER",
  "WORMADAMPLANT": "BURMYPLANT",
  "WORMADAMSANDY": "BURMYSANDY",
  "WORMADAMTRASH": "BURMYTRASH",
  "WUGTRIO": "WIGLETT",
  "WURMPLE": "WURMPLE",
  "WYNAUT": "WYNAUT",
  "XATU": "NATU",
  "YAMASK": "YAMASK",
  "YANMA": "YANMA",
  "YANMEGA": "YANMA",
  "ZIGZAGOON": "ZIGZAGOON",
  "ZOROARK": "ZORUA",
  "ZORUA": "ZORUA",
  "ZUBAT": "ZUBAT",
  "ZWEILOUS": "DEINO",
  // Regional variants with separate evolution lines
  "BURMYPLANT": "BURMYPLANT",
  "BURMYSANDY": "BURMYSANDY",
  "BURMYTRASH": "BURMYTRASH",
  "SHELLOSEASTSEA": "SHELLOSEASTSEA",
  "SHELLOSWESTSEA": "SHELLOSWESTSEA",
  "GASTRODONEASTSEA": "SHELLOSEASTSEA",
  "GASTRODONWESTSEA": "SHELLOSWESTSEA",
  // Mega evolutions
  "MEGALOPUNNY": "BUNEARY",
  "MEGACAMERUPT": "NUMEL",
  "MEGABANETTE": "SHUPPET",
  "MEGAGENGAR": "GASTLY",
  "MEGAGARDEVOIR": "RALTS",
  "MEGAGALLADE": "RALTS",
  "MEGAALTARIA": "SWABLU",
  "MEGAABSOL": "ABSOL",
  "MEGAABOMASNOW": "SNOVER",
  "MEGAAGGRON": "ARON",
  "MEGAAMPHAROS": "MAREEP",
  "MEGABLASTOISE": "SQUIRTLE",
  "MEGACHARIZARDX": "CHARMANDER",
  "MEGACHARIZARDY": "CHARMANDER",
  "MEGAVENUSAUR": "BULBASAUR",
  "MEGAGYARADOS": "MAGIKARP",
  "MEGAHOUNDOOM": "HOUNDOUR",
  "MEGAKANGASKHAN": "KANGASKHAN",
  "MEGALUCARIO": "RIOLU",
  "MEGAMANECTRIC": "ELECTRIKE",
  "MEGAMAWILE": "MAWILE",
  "MEGAMETAGROSS": "BELDUM",
  "MEGAPINSIR": "PINSIR",
  "MEGARAYQUAZA": "RAYQUAZA",
  "MEGASABLEYE": "SABLEYE",
  "MEGASCIZOR": "SCYTHER",
  "MEGASLOWBRO": "SLOWPOKE",
  "MEGASTEELIX": "ONIX",
  "MEGATYRANITAR": "LARVITAR",
  // Additional missing evolutions
  "COFAGRIGUS": "YAMASK",
  "SLURPUFF": "SWIRLIX",
  "SWIRLIX": "SWIRLIX",
  // Alolan forms
  "ALOLANDIGLETT": "ALOLANDIGLETT",
  "ALOLANDUGTRIO": "ALOLANDIGLETT",
  "ALOLANGEODUDE": "ALOLANGEODUDE",
  "ALOLANGRAVELER": "ALOLANGEODUDE",
  "ALOLANGOLEM": "ALOLANGEODUDE",
  "ALOLANGRIMER": "ALOLANGRIMER",
  "ALOLANMUK": "ALOLANGRIMER",
  "ALOLANMEOWTH": "ALOLANMEOWTH",
  "ALOLANPERSIAN": "ALOLANMEOWTH",
  "ALOLANSANDSHREW": "ALOLANSANDSHREW",
  "ALOLANSANDSLASH": "ALOLANSANDSHREW",
  "ALOLANVULPIX": "ALOLANVULPIX",
  "ALOLANNINETALES": "ALOLANVULPIX",
  "ALOLANRATTATA": "ALOLANRATTATA",
  "ALOLANRATICATE": "ALOLANRATTATA",
  "ALOLANEXEGGUTOR": "EXEGGCUTE",
  "ALOLANMAROWAK": "CUBONE",
  "ALOLANRAICHU": "PICHU",
  // Galarian forms
  "GALARIANYAMASK": "GALARIANYAMASK",
  "RUNERIGUS": "GALARIANYAMASK",
  "GALARIANZIGZAGOON": "GALARIANZIGZAGOON",
  "GALARIANLINOONE": "GALARIANZIGZAGOON",
  "OBSTAGOON": "GALARIANZIGZAGOON",
  "GALARIANPONYTA": "GALARIANPONYTA",
  "GALARIANRAPIDASH": "GALARIANPONYTA",
  "GALARIANSLOWPOKE": "GALARIANSLOWPOKE",
  "GALARIANSLOWBRO": "GALARIANSLOWPOKE",
  "GALARIANSLOWKING": "GALARIANSLOWPOKE",
  "GALARCORSOLA": "GALARCORSOLA",
  "CURSOLA": "GALARCORSOLA",
  "GALARIANWEEZING": "KOFFING",
  // Hisuian forms
  "HISUIZORUA": "HISUIZORUA",
  "HISUIZOROARK": "HISUIZORUA",
  "HISUISLIGGOO": "HISUISLIGGOO",
  "HISUIGOODRA": "HISUISLIGGOO",
  "HISUIGROWLITHE": "HISUIGROWLITHE",
  "HISUIARCANINE": "HISUIGROWLITHE",
  "HISUIVOLTORB": "HISUIVOLTORB",
  "HISUIELECTRODE": "HISUIVOLTORB",
  "HISUISNEASEL": "HISUISNEASEL",
  "SNEASLER": "HISUISNEASEL",
  "HISUIANQWILFISH": "HISUIANQWILFISH",
  "OVERQWIL": "HISUIANQWILFISH",
  "HISUIANLILLIGANT": "PETILIL",
  "HISUIANTYPHLOSION": "CYNDAQUIL",
  // Paldean forms
  "PALDEAWOOPER": "PALDEAWOOPER",
  "CLODSIRE": "PALDEAWOOPER",
};

/**
 * Get the base form for any pokemon in an evolution family
 * @param {string} pokemonName - Any pokemon name (base or evolved)
 * @returns {string} - The base form name
 */
function getBaseForm(pokemonName) {
  const name = pokemonName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return POKEMON_TO_BASE[name] || name;
}

/**
 * Get all forms in an evolution family
 * @param {string} pokemonName - Any pokemon name (base or evolved)
 * @returns {Array<string>} - Array of all pokemon names in family
 */
function getEvolutionFamily(pokemonName) {
  const base = getBaseForm(pokemonName);
  const chain = EVOLUTION_CHAINS[base];
  if (!chain) return [pokemonName];
  return chain.filter(entry => entry.name).map(entry => entry.name);
}

/**
 * Check if a Pokemon (or any in its evolution family) is a wild Pokemon
 * @param {string} pokemonName - Pokemon name to check
 * @returns {boolean} - True if wild Pokemon
 */
function isWildPokemon(pokemonName) {
  if (!pokemonName) return false;
  // Normalize: uppercase and remove special chars (underscores, hyphens, etc)
  const normalizedName = pokemonName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  // Check direct match
  if (WILD_POKEMON.has(normalizedName)) return true;
  // Check evolution family (handles cases like "Meowstic" matching "MEOWSTICMALE")
  const baseForm = getBaseForm(normalizedName);
  const family = getEvolutionFamily(baseForm);
  return family.some(form => WILD_POKEMON.has(form));
}

/**
 * Get the evolution cost multiplier for a specific pokemon
 * @param {string} pokemonName - Pokemon name
 * @returns {number} - Cost multiplier (1, 3, 9, or 27)
 */
function getEvolutionCost(pokemonName) {
  const base = getBaseForm(pokemonName);
  const chain = EVOLUTION_CHAINS[base];
  if (!chain) return 1;
  
  const name = pokemonName.toUpperCase();
  const entry = chain.find(e => e.name === name);
  return entry ? entry.cost : 1;
}

/**
 * Get full evolution data for a specific pokemon
 * @param {string} pokemonName - Pokemon name
 * @returns {Object|null} - Evolution data object or null
 */
function getEvolutionData(pokemonName) {
  const base = getBaseForm(pokemonName);
  const chain = EVOLUTION_CHAINS[base];
  if (!chain) return null;
  
  const name = pokemonName.toUpperCase();
  return chain.find(e => e.name === name) || null;
}

/**
 * Get the complete evolution chain for a pokemon
 * @param {string} pokemonName - Pokemon name
 * @returns {Array<Object>} - Array of evolution data objects
 */
function getEvolutionChain(pokemonName) {
  const base = getBaseForm(pokemonName);
  return EVOLUTION_CHAINS[base] || [];
}

/**
 * Check if a pokemon is a base form
 * @param {string} pokemonName - Pokemon name
 * @returns {boolean} - True if base form
 */
function isBaseForm(pokemonName) {
  const name = pokemonName.toUpperCase();
  return POKEMON_TO_BASE[name] === name;
}

// ═══════════════════════════════════════════════════════════════════════════
// PORTAL/REGIONAL DETECTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Rarity colors used by the game
const RARITY_COLORS = {
  'rgb(160, 160, 160)': 'common',
  'rgb(59, 201, 94)': 'uncommon', 
  'rgb(65, 191, 204)': 'rare',
  'rgb(146, 127, 255)': 'epic',
  'rgb(239, 68, 68)': 'ultra',
  'rgb(255, 107, 107)': 'unique',
  'rgb(255, 215, 0)': 'legendary',
  'rgb(233, 30, 99)': 'special',
  'rgb(0, 188, 212)': 'hatch'
};

/**
 * Compare two type arrays (order-independent)
 * Excludes 'wild' synergy since it's not shown in game portrait tooltips
 */
function typesMatch(types1, types2) {
  // Filter out 'wild' from both arrays since it's a meta-synergy not shown in portraits
  const filtered1 = types1.filter(t => t !== 'wild');
  const filtered2 = types2.filter(t => t !== 'wild');
  if (filtered1.length !== filtered2.length) return false;
  const sorted1 = [...filtered1].sort().join(',');
  const sorted2 = [...filtered2].sort().join(',');
  return sorted1 === sorted2;
}

/**
 * Find Pokemon by rarity and types
 * @param {string} rarity - The rarity to match
 * @param {Array<string>} types - The types to match
 * @param {boolean} isRegional - Whether to filter by regional flag
 * @returns {Array<string>} - Matching Pokemon names
 */
function identifyPokemonByTypesAndRarity(rarity, types, isRegional) {
  const matches = [];
  
  for (const [name, data] of Object.entries(POKEMON_DATA)) {
    if (data.rarity !== rarity) continue;
    if (isRegional && !data.regional) continue;
    if (!isRegional && !data.additional) continue;
    
    if (typesMatch(types, data.types)) {
      // Only add base forms (filter out evolutions)
      const baseForm = getBaseForm(name);
      if (baseForm === name && !matches.includes(name)) {
        matches.push(name);
      }
    }
  }
  
  return matches;
}

/**
 * Extract Pokemon from a panel element
 * @param {Element} panelDiv - The panel element (.game-regional-pokemons or .game-additional-pokemons)
 * @param {boolean} isRegional - Whether this is regional or additional panel
 * @returns {Array<string>} - Array of Pokemon names
 */
function extractPokemonFromPanel(panelDiv, isRegional) {
  const portraits = panelDiv.querySelectorAll('.game-pokemon-portrait');
  const pokemonNames = [];
  
  portraits.forEach(p => {
    const bgColor = p.style.backgroundColor;
    const rarity = RARITY_COLORS[bgColor] || 'unknown';
    
    // Get types from synergy icons
    const typeIcons = p.querySelectorAll('.synergy-icon');
    const types = Array.from(typeIcons).map(icon => icon.alt.toLowerCase());
    
    // Find matching Pokemon
    const matches = identifyPokemonByTypesAndRarity(rarity, types, isRegional);
    pokemonNames.push(...matches);
  });
  
  return pokemonNames;
}

/**
 * Scan DOM for active regional and additional Pokemon
 * Must be called when tooltips are visible
 * @returns {Object} - { regional: [...], additional: [...] }
 */
function detectActivePortalPokemon() {
  const result = { regional: [], additional: [] };
  
  const reactTooltips = document.querySelectorAll('[class*="react-tooltip"]');
  
  reactTooltips.forEach(tooltip => {
    const regionalDiv = tooltip.querySelector('.game-regional-pokemons');
    if (regionalDiv) {
      result.regional = extractPokemonFromPanel(regionalDiv, true);
    }
    
    const additionalDiv = tooltip.querySelector('.game-additional-pokemons');
    if (additionalDiv) {
      result.additional = extractPokemonFromPanel(additionalDiv, false);
    }
  });
  
  return result;
}

/**
 * Check if a Pokemon is available in the current pool
 * @param {string} pokemonName - Pokemon name to check
 * @param {Array<string>} activeRegional - Currently active regional Pokemon
 * @param {Array<string>} activeAdditional - Currently active additional Pokemon
 * @returns {Object} - { available: boolean, reason: string|null }
 */
function checkPokemonAvailability(pokemonName, activeRegional, activeAdditional) {
  const name = pokemonName.toUpperCase();
  const data = POKEMON_DATA[name];
  
  if (!data) {
    return { available: false, reason: 'Unknown Pokemon' };
  }
  
  // Base pool Pokemon are always available
  if (!data.regional && !data.additional) {
    return { available: true, reason: null };
  }
  
  // Regional Pokemon need to be in active regional list
  if (data.regional && !data.additional) {
    const inPool = activeRegional.includes(name);
    return {
      available: inPool,
      reason: inPool ? null : 'Regional Pokemon not in current region'
    };
  }
  
  // Additional Pokemon need to be in active additional list
  if (data.additional && !data.regional) {
    const inPool = activeAdditional.includes(name);
    return {
      available: inPool,
      reason: inPool ? null : 'Add Pick not selected this game'
    };
  }
  
  // Both regional AND additional - need one or the other
  if (data.regional && data.additional) {
    const inRegional = activeRegional.includes(name);
    const inAdditional = activeAdditional.includes(name);
    const inPool = inRegional || inAdditional;
    return {
      available: inPool,
      reason: inPool ? null : 'Regional/Add Pick not available'
    };
  }
  
  return { available: true, reason: null };
}

// Export functions for use in extension
if (typeof module !== "undefined" && module.exports) {
  // Node.js export
  module.exports = {
    EVOLUTION_CHAINS,
    POKEMON_TO_BASE,
    getBaseForm,
    getEvolutionFamily,
    getEvolutionCost,
    getEvolutionData,
    getEvolutionChain,
    isBaseForm
  };
}


  // ═══════════════════════════════════════════════════════════════════════════
  // GAME DATA CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════

  const POOL_COPIES = {
    common:   { twoStar: 18, threeStar: 27 },
    uncommon: { twoStar: 13, threeStar: 22 },
    rare:     { twoStar: 9, threeStar: 18 },
    epic:     { twoStar: 7, threeStar: 14 },
    ultra:    { twoStar: 5, threeStar: 10 }
  };

  const BASE_GAME_POOLS = {
    common:   { twoStar: 0, threeStar: 17 },
    uncommon: { twoStar: 1, threeStar: 15 },
    rare:     { twoStar: 0, threeStar: 14 },
    epic:     { twoStar: 0, threeStar: 14 },
    ultra:    { twoStar: 0, threeStar: 12 }
  };

  const SHOP_ODDS = {
    1: { common: 100, uncommon: 0,  rare: 0,  epic: 0,  ultra: 0 },
    2: { common: 100, uncommon: 0,  rare: 0,  epic: 0,  ultra: 0 },
    3: { common: 70,  uncommon: 30, rare: 0,  epic: 0,  ultra: 0 },
    4: { common: 50,  uncommon: 40, rare: 10, epic: 0,  ultra: 0 },
    5: { common: 36,  uncommon: 42, rare: 20, epic: 2,  ultra: 0 },
    6: { common: 25,  uncommon: 40, rare: 30, epic: 5,  ultra: 0 },
    7: { common: 16,  uncommon: 33, rare: 35, epic: 15, ultra: 1 },
    8: { common: 11,  uncommon: 27, rare: 35, epic: 22, ultra: 5 },
    9: { common: 5,   uncommon: 20, rare: 35, epic: 30, ultra: 10 }
  };

  const BASE_WILD_COUNTS = {
    common:   { twoStar: 2, threeStar: 0 },
    uncommon: { twoStar: 4, threeStar: 0 },
    rare:     { twoStar: 4, threeStar: 0 },
    epic:     { twoStar: 2, threeStar: 1 },
    ultra:    { twoStar: 0, threeStar: 1 }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  let extractionInterval = null;
  let isMinimized = false;
  let lastPoolData = null;
  let currentPollSpeed = 500;
  let liveTrackingActive = false;

  // OPTIMIZATION: Dirty check variables for DOM rendering
  let lastCurrentHash = '';
  let lastTeamFingerprint = '';

  const state = {
    level: 7,
    targetRarity: 'rare',
    targetEvo: 'threeStar',
    refreshes: 10,
    copiesTaken: 0,
    evolutionGoal: 'firstEvo',
    copiesOwned: 0,
    dittoEnabled: false,  // Disabled until stage 6
    targetIsWild: false,
    pveRoundEnabled: false,
    currentStage: null, // Auto-tracked from game
    wildUnitsOwned: 0,
    wildUnitsTaken: { common: 0, uncommon: 0, rare: 0, epic: 0, ultra: 0 },
    // Evolution family tracking (v2.5.0)
    targetPokemon: '',           // Base form being tracked
    targetPokemonDisplayName: '', // What user searched (may be evolved form)
    evolutionFamily: [],          // Cached family array
    round5Enabled: false,
    round5AddPicks: 8,
    round8Enabled: false,
    round8AddPicks: 8,
    round11Enabled: false,
    round11AddPicks: 8,
    portalRegionals: {
      common: { twoStar: 0, threeStar: 0 },
      uncommon: { twoStar: 0, threeStar: 0 },
      rare: { twoStar: 0, threeStar: 0 },
      epic: { twoStar: 0, threeStar: 0 },
      ultra: { twoStar: 0, threeStar: 0 }
    },
    wildAddPicks: { uncommon: 0, rare: 0, epic: 0 },
    wildRegionals: {
      common: { twoStar: 0, threeStar: 0 },
      uncommon: { twoStar: 0, threeStar: 0 },
      rare: { twoStar: 0, threeStar: 0 },
      epic: { twoStar: 0, threeStar: 0 },
      ultra: { twoStar: 0, threeStar: 0 }
    },
    // Live extraction
    autoScout: true,
    targetPokemon: '', // Name to track
    targetPokemonRarity: null, // Store the rarity for validation
    confidencePercent: 75, // Adjustable confidence threshold
    playerName: '', // Player's in-game name for flash alerts
    // Team tracking (v2.8.0)
    teamTargets: [], // Array of {id, pokemon, rarity, evo, isWild, enabled, copiesTaken}
    teamPanelExpanded: false,
    currentPanelExpanded: false,
    // Portal/Regional detection (v3.0.2)
    activeRegionalPokemon: [],  // Resolved Pokemon names in current region
    activeAdditionalPokemon: [], // Resolved Pokemon from add picks
    regionalSlots: [],  // [{rarity, types, matches: [...], resolved: null|'NAME'}]
    additionalSlots: [], // Same structure
    portalDetectionDone: false,   // Whether we've scanned this game
    // Refresh blocker (v3.0.2 personal)
    refreshBlockerEnabled: false,  // Controlled by experimental mode
    refreshBlockerVisible: false, // Whether blocker is currently showing
    refreshBlockerTrigger: null,  // What Pokemon triggered the blocker
    refreshBlockerDismissed: null, // Pokemon that was dismissed (don't show again until new target)
    // Detection listener flags
    regionalListenerAttached: false,
    additionalListenerAttached: false,
    // Experimental features
    experimentalMode: false,      // Unlocked with ALT+SHIFT+Y
    experimentalPending: false,   // Waiting for key combo
    monoTypeEnabled: false,       // Mono-type mode active
    monoTypeSelected: null,       // Selected type for mono-type mode
    lastShopData: null,           // Last known shop data for mono-type blocking
    
    // Random Draft challenge state
    randomDraftEnabled: false,    // Random draft mode active
    randomDraftChosenSlot: null,  // Index of the chosen slot (0-5)
    randomDraftSpinning: false,   // Whether spin animation is running
    randomDraftLastShop: null,    // Track shop state for purchase detection
    
    // Copycat challenge state
    copycatEnabled: false,        // Copycat mode active
    
    // MLG mode state
    mlgModeEnabled: false,        // 420 MLG mode active
    mlgLastBoardSnapshot: null,   // Track board for evolution detection
    
    // Fishing state
    fishingRod: 'none',           // none, old, good, super
    fishingMantyke: false,        // Mantyke/Mantine on board (+33% Remoraid) - AUTO-DETECTED
    fishingOctilleryLocked: false, // Octillery on board = no more Remoraid fishing - AUTO-DETECTED
    fishingRemoraidsOwned: 0,     // Count of Remoraid on board/bench - AUTO-DETECTED
    // Shop History / Roll Luck Tracker (v3.2.0)
    shopHistoryPanelExpanded: false,
    shopHistoryByPlayer: {},      // { playerName: { rollsByLevel: { level: { rollCount, pokemonSeen } }, currentLevel, lastSnapshot } }
    shopTrackingEnabled: true,    // Whether to track shops
    analyticsTab: 'live',         // 'live' or 'analytics'
    // Shop slot mapping for highlighting (v3.2.1)
    previousPlayerShop: null,     // Previous shop array for diff
    shopSlotMapping: [],          // Maps DOM slot index to pokemon name (null if empty)
    // Customization & Accessibility (v3.1.2)
    settingsPanelExpanded: false,
    customSettings: {
      backgroundColor: '#dce8ec',
      textColor: '#000000',
      accentColor: '#00bcd4',
      targetFlashColor: '#2bff00',
      teamFlashColor: '#0033ff',
      flashSpeed: 250,
      fontSize: 12,
      disableFlash: false
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCALSTORAGE PERSISTENCE FOR ROLL HISTORY (v3.2.1)
  // ═══════════════════════════════════════════════════════════════════════════

  const ROLL_HISTORY_KEY = 'pac_roll_history';

  function saveRollHistory() {
    try {
      const data = {
        version: '3.2.1',
        timestamp: Date.now(),
        shopHistoryByPlayer: state.shopHistoryByPlayer
      };
      localStorage.setItem(ROLL_HISTORY_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('PAC: Failed to save roll history to localStorage', e);
    }
  }

  function loadRollHistory() {
    try {
      const raw = localStorage.getItem(ROLL_HISTORY_KEY);
      if (!raw) return;
      
      const data = JSON.parse(raw);
      if (data && data.shopHistoryByPlayer) {
        state.shopHistoryByPlayer = data.shopHistoryByPlayer;
        if (DEBUG_MODE) console.log('PAC: Loaded roll history from localStorage');
      }
    } catch (e) {
      console.warn('PAC: Failed to load roll history from localStorage', e);
    }
  }

  function clearRollHistory() {
    state.shopHistoryByPlayer = {};
    try {
      localStorage.removeItem(ROLL_HISTORY_KEY);
    } catch (e) {
      console.warn('PAC: Failed to clear roll history from localStorage', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ROOM EXTRACTION (via page context injection)
  // ═══════════════════════════════════════════════════════════════════════════

  function injectExtractor() {
    // Inject into page context to access game state
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('content/extractor.js');
    script.onload = function() {
      if (DEBUG_MODE) console.log('🎮 PAC Calculator: Extractor loaded');
      this.remove();
    };
    script.onerror = function() {
      console.error('🎮 PAC Calculator: Failed to load extractor');
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROBABILITY CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  function calculateWildCounts() {
    const counts = {};
    Object.keys(BASE_WILD_COUNTS).forEach(rarity => {
      let twoStarCount = BASE_WILD_COUNTS[rarity].twoStar;
      let threeStarCount = BASE_WILD_COUNTS[rarity].threeStar;
      if (rarity === 'uncommon' && state.round5Enabled) twoStarCount += state.wildAddPicks.uncommon;
      if (rarity === 'rare' && state.round8Enabled) twoStarCount += state.wildAddPicks.rare;
      if (rarity === 'epic' && state.round11Enabled) twoStarCount += state.wildAddPicks.epic;
      twoStarCount += state.wildRegionals[rarity].twoStar;
      threeStarCount += state.wildRegionals[rarity].threeStar;
      counts[rarity] = { twoStar: twoStarCount, threeStar: threeStarCount, total: twoStarCount + threeStarCount };
    });
    return counts;
  }

  function calculateTotalPool() {
    const pools = {};
    Object.keys(BASE_GAME_POOLS).forEach(rarity => {
      let twoStarSpecies = BASE_GAME_POOLS[rarity].twoStar;
      let threeStarSpecies = BASE_GAME_POOLS[rarity].threeStar;
      if (rarity === 'uncommon' && state.round5Enabled) twoStarSpecies += state.round5AddPicks;
      if (rarity === 'rare' && state.round8Enabled) twoStarSpecies += state.round8AddPicks;
      if (rarity === 'epic' && state.round11Enabled) twoStarSpecies += state.round11AddPicks;
      twoStarSpecies += state.portalRegionals[rarity].twoStar;
      threeStarSpecies += state.portalRegionals[rarity].threeStar;
      const twoStarCopies = twoStarSpecies * POOL_COPIES[rarity].twoStar;
      const threeStarCopies = threeStarSpecies * POOL_COPIES[rarity].threeStar;
      pools[rarity] = {
        twoStarTotal: twoStarCopies,
        threeStarTotal: threeStarCopies,
        total: twoStarCopies + threeStarCopies,
        twoStarSpecies,
        threeStarSpecies
      };
    });
    return pools;
  }

  function calculate() {
    // Check regional/additional availability first
    if (state.targetPokemon) {
      const availability = checkPokemonAvailability(
        state.targetPokemon,
        state.activeRegionalPokemon,
        state.activeAdditionalPokemon
      );
      if (!availability.available) {
        // Return zeros for unavailable Pokemon
        return {
          perSlotProbTarget: 0,
          perRefresh: 0,
          perRefreshWithDitto: 0,
          overNRefreshes: 0,
          expectedForConfidence: Infinity,
          goldForConfidence: Infinity,
          targetCopies: 0,
          maxTargetCopies: 0,
          rarityChance: 0,
          wildBoost: 0,
          wildTargetImpossible: false,
          copiesNeeded: 9,
          copiesOwned: 0,
          isImpossible: true,
          isDanger: false,
          isMaxed: false,
          notAvailable: true,
          availabilityReason: availability.reason
        };
      }
    }
    
    const totalPool = calculateTotalPool();
    const totalWildCounts = calculateWildCounts();
    const pool = totalPool[state.targetRarity];
    const rarityOdds = SHOP_ODDS[state.level];
    const rarityChance = rarityOdds[state.targetRarity] / 100;
    
    const wildCountsForRarity = totalWildCounts[state.targetRarity];
    const wildUnitsExist = state.targetEvo === 'twoStar' ? wildCountsForRarity.twoStar > 0 : wildCountsForRarity.threeStar > 0;
    
    let maxTargetCopies, targetCopies;
    if (state.targetIsWild) {
      const wildSpeciesCount = state.targetEvo === 'twoStar' ? wildCountsForRarity.twoStar : wildCountsForRarity.threeStar;
      if (wildSpeciesCount > 0) {
        maxTargetCopies = state.targetEvo === 'twoStar' ? POOL_COPIES[state.targetRarity].twoStar : POOL_COPIES[state.targetRarity].threeStar;
        targetCopies = Math.max(0, maxTargetCopies - state.copiesTaken);
      } else {
        maxTargetCopies = 0;
        targetCopies = 0;
      }
    } else {
      maxTargetCopies = state.targetEvo === 'twoStar' ? POOL_COPIES[state.targetRarity].twoStar : POOL_COPIES[state.targetRarity].threeStar;
      targetCopies = Math.max(0, maxTargetCopies - state.copiesTaken);
    }
    
    // Get pool reductions from extraction data
    let visibleTwoStar = 0;
    let visibleThreeStar = 0;
    
    if (lastPoolData && lastPoolData.poolReductions && lastPoolData.poolReductions[state.targetRarity]) {
      visibleTwoStar = lastPoolData.poolReductions[state.targetRarity].twoStar || 0;
      visibleThreeStar = lastPoolData.poolReductions[state.targetRarity].threeStar || 0;
    }
    
    const relevantPoolBeforeVisible = state.targetEvo === 'twoStar' ? pool.twoStarTotal : pool.threeStarTotal;
    const otherPoolPortion = state.targetEvo === 'twoStar' ? pool.threeStarTotal : pool.twoStarTotal;
    
    // Reduce pools by visible units
    const relevantPoolAfterVisible = Math.max(0, relevantPoolBeforeVisible - (state.targetEvo === 'twoStar' ? visibleTwoStar : visibleThreeStar));
    const otherPoolAfterVisible = Math.max(0, otherPoolPortion - (state.targetEvo === 'twoStar' ? visibleThreeStar : visibleTwoStar));
    
    const totalPoolSize = relevantPoolAfterVisible + otherPoolAfterVisible;
    
    const totalWildCopiesBeforeReduction = state.targetEvo === 'twoStar' ?
      wildCountsForRarity.twoStar * POOL_COPIES[state.targetRarity].twoStar :
      wildCountsForRarity.threeStar * POOL_COPIES[state.targetRarity].threeStar;
    const wildScoutedForRarity = state.wildUnitsTaken[state.targetRarity] || 0;
    const totalWildCopies = Math.max(0, totalWildCopiesBeforeReduction - wildScoutedForRarity);
    
    const wildBoost = state.pveRoundEnabled ? (0.05 + (state.wildUnitsOwned * 0.01)) : (state.wildUnitsOwned * 0.01);
    const safeWildBoost = isNaN(wildBoost) ? 0 : wildBoost;
    
    let perSlotProbTarget = 0;
    let wildTargetImpossible = false;
    
    if (state.targetIsWild) {
      // WILD TARGET: Only accessible through Wild boost
      if (!wildUnitsExist) {
        perSlotProbTarget = 0;
        wildTargetImpossible = true;
      } else if (totalWildCopies === 0) {
        perSlotProbTarget = 0;
      } else if (safeWildBoost === 0) {
        perSlotProbTarget = 0;
      } else {
        // Wild boost → Wild pool → specific Wild
        perSlotProbTarget = safeWildBoost * rarityChance * (targetCopies / totalWildCopies);
      }
    } else {
      // NON-WILD TARGET: Normal pool with Wild boost penalty
      if (targetCopies > 0 && totalPoolSize > 0) {
        const baseProb = rarityChance * (targetCopies / totalPoolSize);
        
        // Wild boost steals slots from normal pool
        perSlotProbTarget = (1 - safeWildBoost) * baseProb;
      }
    }
    
    const perRefresh = 1 - Math.pow(1 - perSlotProbTarget, 6);  // 6 shop slots
    const perRefreshWithDitto = 1 - Math.pow(1 - perSlotProbTarget, 6);  // Ditto replaces a slot, still 6
    const overNRefreshes = 1 - Math.pow(1 - perRefresh, state.refreshes);
    
    // Dynamic confidence calculation
    const confidenceDecimal = (100 - state.confidencePercent) / 100; // 75% -> 0.25
    const expectedForConfidence = perRefresh > 0 ? Math.log(confidenceDecimal) / Math.log(1 - perRefresh) : Infinity;
    const goldForConfidence = isFinite(expectedForConfidence) ? expectedForConfidence * 2 : Infinity;
    
    // Calculate impossible/danger for main target
    let copiesNeeded = 9; // Default 3★
    let copiesOwned = 0;
    let isImpossible = false;
    let isDanger = false;
    let isMaxed = false;
    
    // Determine copies needed based on evolution target
    if (state.targetPokemon) {
      const baseForm = getBaseForm(state.targetPokemon);
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      copiesNeeded = maxStars === 2 ? 3 : 9;
      
      // Simple check: does user own a max-star unit in this family?
      if (lastPoolData && state.playerName) {
        const playerBoard = lastPoolData.playerBoards?.[state.playerName] || [];
        const playerBench = lastPoolData.playerBenches?.[state.playerName] || [];
        const playerUnits = [...playerBoard, ...playerBench];
        const family = getEvolutionFamily(baseForm);
        
        // Check if any unit in family is at max stars
        const hasMaxedUnit = playerUnits.some(unit => {
          return family.includes(unit.name?.toUpperCase()) && unit.stars === maxStars;
        });
        
        if (hasMaxedUnit) {
          isMaxed = true;
          copiesOwned = copiesNeeded; // They have what they need
        }
      }
    }
    
    // If maxed, force 0 probability
    if (isMaxed) {
      return {
        perSlot: 0,
        perRefresh: 0,
        perRefreshWithDitto: 0,
        overNRefreshes: 0,
        expectedForConfidence: Infinity,
        goldForConfidence: Infinity,
        rarityChance: rarityChance * 100,
        targetCopies: 0,
        maxTargetCopies,
        wildTargetImpossible: false,
        wildBoost: safeWildBoost,
        isImpossible: false,
        isDanger: false,
        isMaxed: true,
        copiesOwned,
        copiesNeeded
      };
    }
    
    return {
      perSlot: perSlotProbTarget * 100,
      perRefresh: perRefresh * 100,
      perRefreshWithDitto: perRefreshWithDitto * 100,
      overNRefreshes: overNRefreshes * 100,
      expectedForConfidence,
      goldForConfidence,
      rarityChance: rarityChance * 100,
      targetCopies,
      maxTargetCopies,
      wildTargetImpossible,
      wildBoost: safeWildBoost,
      // Impossible/Danger status for main target
      isImpossible,
      isDanger,
      isMaxed,
      copiesOwned,
      copiesNeeded
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // POKEMON AUTOCOMPLETE COMPONENT
  // ═══════════════════════════════════════════════════════════════════════════

  function setupAutocomplete() {
    const input = document.getElementById('pacTargetPokemon');
    const dropdown = document.getElementById('pacAutocompleteDropdown');
    const errorMsg = document.getElementById('pacRarityError');
    
    let selectedPokemon = null;
    let debounceTimer; // OPTIMIZATION: Debounce timer
    
    // Filter on input WITH DEBOUNCE
    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      
      debounceTimer = setTimeout(() => {
        const query = e.target.value.toUpperCase().trim();
        
        if (query.length < 2) {
          dropdown.classList.add('hidden');
          errorMsg.classList.add('hidden');
          return;
        }
        
        // Filter matches
        const matches = Object.entries(POKEMON_DATA)
          .filter(([name]) => name.includes(query))
          .slice(0, 15); // Limit to 15 results
        
        if (matches.length === 0) {
          dropdown.classList.add('hidden');
          errorMsg.textContent = `No pokemon found matching "${query}"`;
          errorMsg.classList.remove('hidden');
          return;
        }
        
        // Build dropdown
        dropdown.innerHTML = matches
          .map(([name, data]) => {
            const rarity = data.rarity || 'common';
            const info = RARITY_INFO[rarity] || { label: rarity, color: '#666' };
            const baseForm = getBaseForm(name);
            const isEvolved = baseForm !== name;
            const evolutionText = isEvolved ? ` <span style="color: #64b5f6; font-size: 10px;">(← ${baseForm})</span>` : '';
            return `
              <div class="pac-dropdown-item" data-name="${name}" data-rarity="${rarity}" data-baseform="${baseForm}">
                <span class="pac-pokemon-name">${name}${evolutionText}</span>
              <span class="pac-pokemon-rarity" style="background: ${info.color}; color: ${rarity === 'legendary' || rarity === 'uncommon' ? '#000' : '#fff'}">${info.label}</span>
            </div>
          `;
        }).join('');
      
      dropdown.classList.remove('hidden');
      errorMsg.classList.add('hidden');
      
      // Position dropdown to the right of the selector container
      const selectorRect = input.closest('.pac-pokemon-selector').getBoundingClientRect();
      const panelRect = document.getElementById('pac-calc-overlay').getBoundingClientRect();
      dropdown.style.top = `${selectorRect.top}px`;
      dropdown.style.left = `${panelRect.right + 8}px`;
      dropdown.style.maxHeight = `${Math.min(400, window.innerHeight - selectorRect.top - 20)}px`;
      }, 100); // OPTIMIZATION: 100ms delay - imperceptible to user
    });
    
    // Use event delegation for dropdown clicks (outside input handler to avoid duplicates)
    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.pac-dropdown-item');
      if (item) {
        selectPokemon(item);
      }
    });
    
    // Selection handler
    function selectPokemon(item) {
      const name = item.dataset.name;
      const rarity = item.dataset.rarity;
      const baseForm = item.dataset.baseform || name;
      
      // Check if rarity is in pool
      if (!POOL_RARITIES.includes(rarity)) {
        errorMsg.textContent = `${name} is ${RARITY_INFO[rarity].label} - not available in shop pools`;
        errorMsg.classList.remove('hidden');
        input.value = '';
        state.targetPokemon = '';
        state.targetPokemonDisplayName = '';
        state.evolutionFamily = [];
        state.targetIsWild = false;
        const wildCheckbox = document.getElementById('pacTargetWild');
        if (wildCheckbox) wildCheckbox.checked = false;
        selectedPokemon = null;
        // Hide portal warning
        const portalWarning = document.getElementById('pacPortalWarning');
        if (portalWarning) portalWarning.style.display = 'none';
        dropdown.classList.add('hidden');
        return;
      }
      
      // Clear previous evolution family display
      const familySection = document.getElementById('pacEvolutionFamily');
      if (familySection) {
        familySection.classList.add('hidden');
      }
      
      // Auto-adjust rarity if different
      if (rarity !== state.targetRarity) {
        state.targetRarity = rarity;
        document.getElementById('pacRarity').value = rarity;
      }
      
      // Auto-adjust evolution stars based on maxStars from EVOLUTION_CHAINS
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      if (evolutionChain && evolutionChain[0] && evolutionChain[0].maxStars) {
        const targetEvoStars = evolutionChain[0].maxStars;
        // Set the dropdown value to "twoStar" or "threeStar"
        const evoValue = targetEvoStars === 3 ? 'threeStar' : 'twoStar';
        state.targetEvo = evoValue;
        document.getElementById('pacEvo').value = evoValue;
        if (DEBUG_MODE) console.log(`🌟 Auto-set evolution to ${targetEvoStars}★ (max for ${baseForm})`);
      }
      
      // Valid selection - store base form and evolution family
      input.value = name;
      state.targetPokemon = baseForm;  // Store BASE FORM for tracking
      state.targetPokemonDisplayName = name;  // What user searched
      state.targetPokemonRarity = rarity;
      state.evolutionFamily = getEvolutionFamily(baseForm);  // Cache family
      selectedPokemon = { name, rarity, baseForm };
      
      // Auto-detect wild Pokemon
      const isWild = isWildPokemon(baseForm);
      state.targetIsWild = isWild;
      const wildCheckbox = document.getElementById('pacTargetWild');
      if (wildCheckbox) {
        wildCheckbox.checked = isWild;
      }
      
      if (DEBUG_MODE) console.log('🎯 Selected:', { name, baseForm, family: state.evolutionFamily, isWild });
      
      // Check portal/regional availability
      updateAvailabilityWarnings();
      
      dropdown.classList.add('hidden');
      errorMsg.classList.add('hidden');
      updateDisplay();
    }
    
    // Clear selection if rarity changes
    document.getElementById('pacRarity').addEventListener('change', () => {
      if (selectedPokemon && selectedPokemon.rarity !== state.targetRarity) {
        input.value = '';
        state.targetPokemon = '';
        state.targetPokemonRarity = null;
        state.targetIsWild = false;
        const wildCheckbox = document.getElementById('pacTargetWild');
        if (wildCheckbox) wildCheckbox.checked = false;
        const rarityLabel = RARITY_INFO[state.targetRarity].label;
        errorMsg.textContent = selectedPokemon ? `${selectedPokemon.name} is not a ${rarityLabel} pokemon` : '';
        if (selectedPokemon) errorMsg.classList.remove('hidden');
        selectedPokemon = null;
      }
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.pac-pokemon-selector')) {
        dropdown.classList.add('hidden');
      }
    });
    
    // Allow clearing with backspace
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value.length === 0) {
        state.targetPokemon = '';
        state.targetPokemonRarity = null;
        state.targetIsWild = false;
        const wildCheckbox = document.getElementById('pacTargetWild');
        if (wildCheckbox) wildCheckbox.checked = false;
        selectedPokemon = null;
        errorMsg.classList.add('hidden');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI CREATION
  // ═══════════════════════════════════════════════════════════════════════════

  function createOverlay() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      #pac-calc-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 380px;
        max-height: calc(100vh - 40px);
        background: rgba(26, 26, 46, 0.96);
        border: 2px solid #0f3460;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #e9e9e9;
        z-index: 999999;
        user-select: none;
        overflow: visible;
        display: flex;
        flex-direction: column;
        min-height: 200px;
        min-width: 280px;
        max-width: 600px;
      }
      
      /* Hide side panels when width is not default */
      #pac-calc-overlay.width-resized .pac-team-panel,
      #pac-calc-overlay.width-resized .pac-team-toggle {
        display: none !important;
      }
      
      /* Hide scrollbar */
      #pac-calc-body {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      #pac-calc-body::-webkit-scrollbar {
        display: none;
      }
      
      /* ═══ RESIZE HANDLES ═══ */
      .pac-resize-handle {
        position: absolute;
        z-index: 1000001;
        background: transparent !important;
        pointer-events: auto;
      }
      
      /* Corner handles */
      .pac-resize-nw { top: -6px; left: -6px; width: 16px; height: 16px; cursor: nw-resize; }
      .pac-resize-ne { top: -6px; right: -6px; width: 16px; height: 16px; cursor: ne-resize; }
      .pac-resize-sw { bottom: -6px; left: -6px; width: 16px; height: 16px; cursor: sw-resize; }
      .pac-resize-se { bottom: -6px; right: -6px; width: 16px; height: 16px; cursor: se-resize; }
      
      /* Edge handles */
      .pac-resize-n { top: -6px; left: 20px; right: 20px; height: 12px; cursor: n-resize; }
      .pac-resize-s { bottom: -6px; left: 20px; right: 20px; height: 12px; cursor: s-resize; }
      .pac-resize-w { left: -6px; top: 20px; bottom: 20px; width: 12px; cursor: w-resize; }
      .pac-resize-e { right: -6px; top: 20px; bottom: 20px; width: 12px; cursor: e-resize; }
      
      /* Hide handles when minimized */
      #pac-calc-overlay.minimized .pac-resize-handle {
        display: none !important;
      }
      
      #pac-calc-header {
        background: linear-gradient(90deg, #0f3460 0%, #533483 100%);
        padding: 12px 16px;
        border-radius: 10px 10px 0 0;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        position: relative;
        z-index: 1;  /* Above side panels */
      }
      
      #pac-calc-title {
        font-weight: 600;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .pac-status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #666;
        box-shadow: 0 0 8px rgba(255,255,255,0.3);
        transition: all 0.3s ease;
      }
      
      .pac-status-dot.connected {
        background: #4caf50;
        box-shadow: 0 0 12px rgba(76,175,80,0.6);
      }
      
      #pac-calc-controls {
        display: flex;
        gap: 8px;
      }
      
      .pac-ctrl-btn {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        transition: all 0.2s;
      }
      
      .pac-ctrl-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      
      /* Experimental mode button */
      #pacExpBtn.pending {
        background: rgba(251, 191, 36, 0.3);
        color: #fbbf24;
        animation: expPulse 1s ease-in-out infinite;
      }
      
      #pacExpBtn.active {
        background: rgba(251, 191, 36, 0.8);
        color: #1e293b;
        font-weight: 700;
      }
      
      @keyframes expPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Synergy Bar */
      .pac-synergy-bar {
        display: none;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        padding: 8px;
        background: rgba(0,0,0,0.3);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        gap: 6px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .pac-synergy-bar.visible {
        display: flex;
      }
      
      .pac-synergy-bar::-webkit-scrollbar {
        display: none;
      }
      
      .pac-synergy-btn {
        flex-shrink: 0;
        padding: 4px 10px;
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        text-transform: capitalize;
      }
      
      .pac-synergy-btn:hover {
        filter: brightness(1.3);
        transform: scale(1.05);
      }
      
      .pac-synergy-btn:active {
        transform: scale(0.95);
      }
      
      /* Synergy type colors */
      .pac-synergy-btn[data-synergy="water"] { background: #6390F0; color: #fff; }
      .pac-synergy-btn[data-synergy="fire"] { background: #EE8130; color: #fff; }
      .pac-synergy-btn[data-synergy="grass"] { background: #7AC74C; color: #fff; }
      .pac-synergy-btn[data-synergy="electric"] { background: #F7D02C; color: #333; }
      .pac-synergy-btn[data-synergy="ice"] { background: #96D9D6; color: #333; }
      .pac-synergy-btn[data-synergy="fighting"] { background: #C22E28; color: #fff; }
      .pac-synergy-btn[data-synergy="poison"] { background: #A33EA1; color: #fff; }
      .pac-synergy-btn[data-synergy="ground"] { background: #E2BF65; color: #333; }
      .pac-synergy-btn[data-synergy="flying"] { background: #A98FF3; color: #fff; }
      .pac-synergy-btn[data-synergy="psychic"] { background: #F95587; color: #fff; }
      .pac-synergy-btn[data-synergy="bug"] { background: #A6B91A; color: #fff; }
      .pac-synergy-btn[data-synergy="rock"] { background: #B6A136; color: #fff; }
      .pac-synergy-btn[data-synergy="ghost"] { background: #735797; color: #fff; }
      .pac-synergy-btn[data-synergy="dragon"] { background: #6F35FC; color: #fff; }
      .pac-synergy-btn[data-synergy="dark"] { background: #705746; color: #fff; }
      .pac-synergy-btn[data-synergy="steel"] { background: #B7B7CE; color: #333; }
      .pac-synergy-btn[data-synergy="fairy"] { background: #D685AD; color: #fff; }
      .pac-synergy-btn[data-synergy="normal"] { background: #A8A77A; color: #fff; }
      /* PAC-specific synergies */
      .pac-synergy-btn[data-synergy="monster"] { background: #8B4513; color: #fff; }
      .pac-synergy-btn[data-synergy="human"] { background: #DEB887; color: #333; }
      .pac-synergy-btn[data-synergy="aquatic"] { background: #1E90FF; color: #fff; }
      .pac-synergy-btn[data-synergy="artificial"] { background: #708090; color: #fff; }
      .pac-synergy-btn[data-synergy="wild"] { background: #228B22; color: #fff; }
      .pac-synergy-btn[data-synergy="fossil"] { background: #8B7355; color: #fff; }
      .pac-synergy-btn[data-synergy="baby"] { background: #FFB6C1; color: #333; }
      .pac-synergy-btn[data-synergy="mega"] { background: #FF4500; color: #fff; }
      .pac-synergy-btn[data-synergy="beast"] { background: #4B0082; color: #fff; }
      .pac-synergy-btn[data-synergy="ethereal"] { background: #9370DB; color: #fff; }
      .pac-synergy-btn[data-synergy="sound"] { background: #FF69B4; color: #fff; }
      .pac-synergy-btn[data-synergy="amorphous"] { background: #9932CC; color: #fff; }
      
      /* Mono-Type Panel */
      .pac-mono-panel {
        display: none;
        margin: 8px 0;
        background: rgba(0,0,0,0.3);
        border-radius: 6px;
        overflow: hidden;
      }
      .pac-mono-panel.visible {
        display: block;
      }
      .pac-mono-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        cursor: pointer;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      .pac-mono-header:hover {
        background: rgba(255,255,255,0.1);
      }
      .pac-mono-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 12px;
      }
      .pac-mono-arrow {
        transition: transform 0.2s;
        font-size: 10px;
      }
      .pac-mono-panel.expanded .pac-mono-arrow {
        transform: rotate(90deg);
      }
      .pac-mono-content {
        display: none;
        padding: 8px;
      }
      .pac-mono-panel.expanded .pac-mono-content {
        display: block;
      }
      .pac-mono-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
      }
      .pac-mono-btn {
        padding: 6px 4px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 9px;
        font-weight: 600;
        text-transform: uppercase;
        transition: all 0.15s;
        opacity: 0.7;
      }
      .pac-mono-btn:hover {
        opacity: 1;
        transform: scale(1.05);
      }
      .pac-mono-btn.selected {
        opacity: 1;
        box-shadow: 0 0 0 2px #fff, 0 0 8px rgba(255,255,255,0.5);
      }
      .pac-mono-status {
        text-align: center;
        font-size: 10px;
        color: #888;
        padding: 4px;
        margin-top: 4px;
      }
      .pac-mono-status.active {
        color: #4caf50;
        font-weight: 600;
      }
      .pac-mono-clear {
        width: 100%;
        margin-top: 8px;
        padding: 6px;
        background: rgba(239, 68, 68, 0.3);
        border: 1px solid rgba(239, 68, 68, 0.5);
        border-radius: 4px;
        color: #fff;
        font-size: 10px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .pac-mono-clear:hover {
        background: rgba(239, 68, 68, 0.5);
      }
      
      /* Mono-type Spin Wheel */
      .pac-mono-wheel-section {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .pac-mono-spin-btn {
        padding: 8px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 6px;
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .pac-mono-spin-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      .pac-mono-spin-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      .pac-mono-wheel-display {
        flex: 1;
        height: 36px;
        background: rgba(0,0,0,0.4);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
      }
      .pac-mono-wheel-type {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 4px 12px;
        border-radius: 4px;
        transition: all 0.1s;
      }
      .pac-mono-wheel-type.spinning {
        animation: wheelPulse 0.15s ease-in-out infinite;
      }
      @keyframes wheelPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .pac-mono-wheel-label {
        font-size: 10px;
        color: #888;
        text-align: center;
      }
      
      /* Mono-type blocker overlay on shop slots */
      .pac-mono-blocker {
        position: fixed;
        background: rgba(220, 38, 38, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: not-allowed;
        font-size: 32px;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        pointer-events: all;
        border-radius: 8px;
      }
      
      /* Random Draft challenge styles */
      .pac-draft-blocker {
        position: fixed;
        background: rgba(220, 38, 38, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: not-allowed;
        font-size: 36px;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        pointer-events: all;
        border-radius: 8px;
      }
      
      .pac-draft-spin-highlight {
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        border-radius: 8px;
        border: 5px solid #fbbf24;
        background: rgba(251, 191, 36, 0.4);
        box-shadow: 
          0 0 30px #fbbf24,
          0 0 60px #fbbf24,
          inset 0 0 30px rgba(251, 191, 36, 0.3);
        transition: all 0.08s ease-out;
      }
      
      .pac-draft-chosen-highlight {
        position: fixed;
        pointer-events: none;
        z-index: 9997;
        border-radius: 8px;
        border: 5px solid #22c55e;
        background: rgba(34, 197, 94, 0.35);
        box-shadow: 
          0 0 25px #22c55e,
          0 0 50px #22c55e,
          inset 0 0 25px rgba(34, 197, 94, 0.25);
        animation: draftChosenPulse 1.5s ease-in-out infinite;
      }
      
      @keyframes draftChosenPulse {
        0%, 100% { 
          box-shadow: 0 0 25px #22c55e, 0 0 50px #22c55e, inset 0 0 25px rgba(34, 197, 94, 0.25);
          border-color: #22c55e;
        }
        50% { 
          box-shadow: 0 0 35px #4ade80, 0 0 70px #4ade80, inset 0 0 35px rgba(74, 222, 128, 0.35);
          border-color: #4ade80;
        }
      }
      
      /* Random Draft panel in experimental - always visible when mono panel is visible */
      .pac-draft-panel {
        display: none;
        margin: 0;
        padding: 0;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-mono-panel.visible .pac-draft-panel {
        display: block;
      }
      
      .pac-draft-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      
      .pac-draft-header:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .pac-draft-header-title {
        font-size: 13px;
        font-weight: 600;
        color: #fbbf24;
      }
      
      .pac-draft-toggle {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        border: none;
        color: #fff;
        padding: 6px 14px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-draft-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
      }
      
      .pac-draft-toggle.active {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      
      .pac-draft-toggle.active:hover {
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      }
      
      .pac-draft-status {
        margin-top: 8px;
        padding: 8px;
        background: rgba(34, 197, 94, 0.15);
        border-radius: 6px;
        font-size: 11px;
        color: #86efac;
        text-align: center;
        display: none;
      }
      
      .pac-draft-status.active {
        display: block;
      }
      
      /* Copycat challenge styles */
      .pac-copycat-blocker {
        position: fixed;
        background: rgba(168, 85, 247, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: not-allowed;
        font-size: 28px;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.8);
        pointer-events: all;
        border-radius: 8px;
        flex-direction: column;
        gap: 2px;
      }
      
      .pac-copycat-blocker-text {
        font-size: 9px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .pac-copycat-panel {
        display: none;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-mono-panel.visible .pac-copycat-panel {
        display: block;
      }
      
      .pac-copycat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      
      .pac-copycat-header:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .pac-copycat-header-title {
        font-size: 13px;
        font-weight: 600;
        color: #a855f7;
      }
      
      .pac-copycat-toggle {
        background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
        border: none;
        color: #fff;
        padding: 6px 14px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-copycat-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
      }
      
      .pac-copycat-toggle.active {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      
      .pac-copycat-toggle.active:hover {
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      }
      
      .pac-copycat-status {
        padding: 8px 12px;
        background: rgba(168, 85, 247, 0.15);
        font-size: 11px;
        color: #c4b5fd;
        text-align: center;
        display: none;
      }
      
      .pac-copycat-status.active {
        display: block;
      }
      
      /* MLG Mode styles */
      .pac-mlg-panel {
        display: none;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-mono-panel.visible .pac-mlg-panel {
        display: block;
      }
      
      .pac-mlg-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: rgba(255,255,255,0.05);
        transition: background 0.2s;
      }
      
      .pac-mlg-header:hover {
        background: rgba(255,255,255,0.1);
      }
      
      .pac-mlg-header-title {
        font-size: 13px;
        font-weight: 600;
        color: #00ff00;
        text-shadow: 0 0 10px #00ff00;
        animation: mlgGlow 0.5s ease-in-out infinite alternate;
      }
      
      @keyframes mlgGlow {
        from { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; }
        to { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff; }
      }
      
      .pac-mlg-toggle {
        background: linear-gradient(135deg, #00ff00 0%, #ff00ff 50%, #00ffff 100%);
        border: none;
        color: #000;
        padding: 6px 14px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
      }
      
      .pac-mlg-toggle:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 0 20px #00ff00;
      }
      
      .pac-mlg-toggle.active {
        background: linear-gradient(135deg, #ff0000 0%, #ff6600 100%);
        animation: mlgButtonPulse 0.3s ease-in-out infinite;
      }
      
      @keyframes mlgButtonPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      .pac-mlg-status {
        padding: 8px 12px;
        background: linear-gradient(90deg, rgba(0,255,0,0.2), rgba(255,0,255,0.2), rgba(0,255,255,0.2));
        font-size: 11px;
        color: #00ff00;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        display: none;
      }
      
      .pac-mlg-status.active {
        display: block;
        animation: mlgRainbow 2s linear infinite;
      }
      
      @keyframes mlgRainbow {
        0% { color: #ff0000; }
        16% { color: #ff8800; }
        33% { color: #ffff00; }
        50% { color: #00ff00; }
        66% { color: #0088ff; }
        83% { color: #ff00ff; }
        100% { color: #ff0000; }
      }
      
      /* MLG Hitmarker overlay */
      .pac-mlg-hitmarker {
        position: fixed;
        width: 60px;
        height: 60px;
        pointer-events: none;
        z-index: 99999;
        animation: hitmarkerPop 0.3s ease-out forwards;
      }
      
      .pac-mlg-hitmarker::before,
      .pac-mlg-hitmarker::after {
        content: '';
        position: absolute;
        background: white;
        box-shadow: 0 0 10px #fff, 0 0 20px #fff;
      }
      
      .pac-mlg-hitmarker::before {
        width: 4px;
        height: 20px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }
      
      .pac-mlg-hitmarker::after {
        width: 4px;
        height: 20px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      
      @keyframes hitmarkerPop {
        0% { opacity: 1; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(1); }
      }
      
      /* MLG Text popup */
      .pac-mlg-text {
        position: fixed;
        font-family: 'Impact', 'Arial Black', sans-serif;
        font-size: 48px;
        font-weight: bold;
        color: #fff;
        text-shadow: 
          -3px -3px 0 #000,
          3px -3px 0 #000,
          -3px 3px 0 #000,
          3px 3px 0 #000,
          0 0 20px #ff0000;
        pointer-events: none;
        z-index: 99999;
        animation: mlgTextPop 1s ease-out forwards;
        text-transform: uppercase;
        white-space: nowrap;
      }
      
      @keyframes mlgTextPop {
        0% { opacity: 0; transform: scale(0) rotate(-20deg); }
        20% { opacity: 1; transform: scale(1.3) rotate(10deg); }
        40% { transform: scale(1) rotate(-5deg); }
        100% { opacity: 0; transform: scale(1.5) translateY(-50px) rotate(5deg); }
      }
      
      /* MLG Screen shake */
      @keyframes mlgShake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-10px) rotate(-1deg); }
        20% { transform: translateX(10px) rotate(1deg); }
        30% { transform: translateX(-10px) rotate(-1deg); }
        40% { transform: translateX(10px) rotate(1deg); }
        50% { transform: translateX(-5px); }
        60% { transform: translateX(5px); }
        70% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
        90% { transform: translateX(-2px); }
      }
      
      .pac-mlg-shake {
        animation: mlgShake 0.5s ease-in-out;
      }
      
      /* MLG Lens flare */
      .pac-mlg-lensflare {
        position: fixed;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,0,0.5) 30%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99998;
        animation: lensFlare 0.8s ease-out forwards;
      }
      
      @keyframes lensFlare {
        0% { opacity: 0; transform: scale(0.3); }
        30% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.5) translateX(100px); }
      }
      
      /* MLG Illuminati triangle */
      .pac-mlg-illuminati {
        position: fixed;
        width: 0;
        height: 0;
        border-left: 80px solid transparent;
        border-right: 80px solid transparent;
        border-bottom: 140px solid #00ff00;
        pointer-events: none;
        z-index: 99999;
        animation: illuminatiFly 2s ease-out forwards;
        filter: drop-shadow(0 0 30px #00ff00);
      }
      
      .pac-mlg-illuminati::after {
        content: '👁';
        position: absolute;
        top: 45px;
        left: -20px;
        font-size: 40px;
      }
      
      @keyframes illuminatiFly {
        0% { opacity: 0; transform: scale(0) rotate(0deg) translate(0, 0); }
        20% { opacity: 1; transform: scale(1.5) rotate(180deg); }
        50% { transform: scale(1.2) rotate(360deg) translate(var(--fly-x, 100px), var(--fly-y, -100px)); }
        80% { opacity: 1; transform: scale(1) rotate(540deg) translate(calc(var(--fly-x, 100px) * 2), calc(var(--fly-y, -100px) * 2)); }
        100% { opacity: 0; transform: scale(0.5) rotate(720deg) translate(calc(var(--fly-x, 100px) * 3), calc(var(--fly-y, -100px) * 3)); }
      }
      
      /* MLG Doritos */
      .pac-mlg-dorito {
        position: fixed;
        font-size: 240px;
        pointer-events: none;
        z-index: 99997;
        animation: doritoFall 3s ease-in forwards;
      }
      
      @keyframes doritoFall {
        0% { opacity: 1; transform: translateY(-200px) rotate(0deg); }
        100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
      }
      
      /* MLG Sample Text */
      .pac-mlg-sample {
        position: fixed;
        font-family: 'Comic Sans MS', cursive;
        font-size: 24px;
        color: #ff00ff;
        text-shadow: 2px 2px 0 #000;
        pointer-events: none;
        z-index: 99996;
        animation: sampleTextBounce 2s ease-in-out forwards;
      }
      
      @keyframes sampleTextBounce {
        0%, 100% { opacity: 0; }
        20%, 80% { opacity: 1; }
        0% { transform: translateY(0); }
        25% { transform: translateY(-20px); }
        50% { transform: translateY(0); }
        75% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      
      /* MLG 360 spinning text */
      .pac-mlg-360 {
        position: fixed;
        font-family: 'Impact', 'Arial Black', sans-serif;
        font-size: 72px;
        font-weight: bold;
        color: #ff0000;
        text-shadow: 
          -4px -4px 0 #000,
          4px -4px 0 #000,
          -4px 4px 0 #000,
          4px 4px 0 #000,
          0 0 30px #ff0000;
        pointer-events: none;
        z-index: 99999;
        animation: spin360 0.5s linear infinite, mlg360Pop 2s ease-out forwards;
      }
      
      @keyframes spin360 {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes mlg360Pop {
        0% { opacity: 0; font-size: 20px; }
        20% { opacity: 1; font-size: 80px; }
        80% { opacity: 1; }
        100% { opacity: 0; font-size: 120px; }
      }
      
      /* MLG Airhorn visual */
      .pac-mlg-airhorn {
        position: fixed;
        font-size: 80px;
        pointer-events: none;
        z-index: 99999;
        animation: airhornBlast 0.8s ease-out forwards;
        filter: drop-shadow(0 0 20px #ffff00);
      }
      
      @keyframes airhornBlast {
        0% { opacity: 0; transform: scale(0) rotate(-30deg); }
        30% { opacity: 1; transform: scale(1.5) rotate(15deg); }
        50% { transform: scale(1.2) rotate(-10deg); }
        70% { transform: scale(1.3) rotate(5deg); }
        100% { opacity: 0; transform: scale(2) rotate(0deg); }
      }
      
      /* MLG Weed leaf */
      .pac-mlg-weed {
        position: fixed;
        font-size: 50px;
        pointer-events: none;
        z-index: 99997;
        animation: weedFloat 3s ease-out forwards;
        filter: drop-shadow(0 0 10px #00ff00);
      }
      
      @keyframes weedFloat {
        0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        50% { opacity: 1; transform: translateY(-100px) rotate(180deg) scale(1.2); }
        100% { opacity: 0; transform: translateY(-200px) rotate(360deg) scale(0.5); }
      }
      
      /* MLG Snoop overlay */
      .pac-mlg-snoop {
        position: fixed;
        font-size: 100px;
        pointer-events: none;
        z-index: 99996;
        animation: snoopDance 2s ease-in-out forwards;
      }
      
      @keyframes snoopDance {
        0%, 100% { opacity: 0; }
        20%, 80% { opacity: 1; }
        0%, 20%, 40%, 60%, 80%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(20px); }
      }

      /* Target highlighter overlays - click-through */
      .pac-target-highlighter {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        border-radius: 8px;
        border: 4px solid var(--pac-target-color, #fbbf24);
        background: var(--pac-target-color-bg, rgba(251, 191, 36, 0.45));
        box-shadow: 
          0 0 20px var(--pac-target-color, #fbbf24),
          inset 0 0 30px var(--pac-target-color-bg, rgba(251, 191, 36, 0.35));
        animation: targetHighlightPulse 1s ease-in-out infinite;
      }
      
      .pac-team-highlighter {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        border-radius: 8px;
        border: 4px solid var(--pac-team-color, #FF1493);
        background: var(--pac-team-color-bg, rgba(255, 20, 147, 0.45));
        box-shadow: 
          0 0 20px var(--pac-team-color, #FF1493),
          inset 0 0 30px var(--pac-team-color-bg, rgba(255, 20, 147, 0.35));
        animation: teamHighlightPulse 1s ease-in-out infinite;
      }
      
      /* Both target and team - show both colors */
      .pac-target-highlighter.also-team {
        border: 4px solid;
        border-image: linear-gradient(45deg, var(--pac-target-color, #fbbf24), var(--pac-team-color, #FF1493)) 1;
        box-shadow: 
          0 0 20px var(--pac-target-color, #fbbf24),
          0 0 20px var(--pac-team-color, #FF1493);
      }
      
      @keyframes targetHighlightPulse {
        0%, 100% { 
          opacity: 0.85;
          transform: scale(1);
        }
        50% { 
          opacity: 1;
          transform: scale(1.02);
        }
      }
      
      @keyframes teamHighlightPulse {
        0%, 100% { 
          opacity: 0.85;
          transform: scale(1);
        }
        50% { 
          opacity: 1;
          transform: scale(1.02);
        }
      }
      
      /* Epilepsy mode - no animation */
      .pac-target-highlighter.no-animate,
      .pac-team-highlighter.no-animate {
        animation: none !important;
        opacity: 0.95;
      }
      
      #pac-calc-body {
        padding: 16px;
        max-height: 70vh;
        overflow-y: auto;
      }
      
      #pac-calc-body.minimized {
        display: none;
      }
      
      /* Hide side panel arrows when minimized */
      #pac-calc-overlay.minimized .pac-team-toggle,
      #pac-calc-overlay.minimized .pac-current-toggle {
        display: none !important;
      }
      
      #pac-calc-overlay.minimized .pac-team-arrow {
        display: none !important;
      }
      
      .pac-section {
        margin-bottom: 16px;
        background: rgba(255,255,255,0.03);
        border-radius: 8px;
        padding: 12px;
        border: 1px solid rgba(255,255,255,0.05);
        position: relative;
        z-index: 1;  /* Above side panels */
      }
      
      .pac-section-title {
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #64b5f6;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .pac-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }
      
      .pac-row:last-child {
        margin-bottom: 0;
      }
      
      .pac-field {
        flex: 1;
      }
      
      .pac-field label {
        display: block;
        font-size: 11px;
        margin-bottom: 4px;
        color: #aaa;
        font-weight: 500;
      }
      
      .pac-field input,
      .pac-field select {
        width: 100%;
        padding: 8px;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #fff;
        font-size: 13px;
        transition: all 0.2s;
      }
      
      .pac-field input:focus,
      .pac-field select:focus {
        outline: none;
        border-color: #64b5f6;
        box-shadow: 0 0 8px rgba(100,181,246,0.3);
      }
      
      .pac-toggle-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      
      .pac-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 12px;
        padding: 6px 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 6px;
        transition: all 0.2s;
      }
      
      .pac-new-game-btn {
        width: 100%;
        background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
        border: 2px solid #2196f3;
        color: white;
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 8px;
      }
      
      .pac-new-game-btn:hover {
        background: linear-gradient(135deg, #42a5f5 0%, #2196f3 100%);
        border-color: #42a5f5;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
      }
      
      .pac-new-game-btn:active {
        transform: translateY(0);
      }
      
      .pac-toggle:hover {
        background: rgba(255,255,255,0.08);
      }
      
      /* HIGH VISIBILITY CHECKBOXES - Apply to ALL checkboxes */
      #pac-calc-overlay input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
        max-width: 24px !important;
        max-height: 24px !important;
        background: #111 !important;
        border: 3px solid #4caf50 !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        position: relative !important;
        margin: 0 8px 0 0 !important;
        padding: 0 !important;
        transition: all 0.2s !important;
        flex-shrink: 0 !important;
        display: inline-block !important;
        vertical-align: middle !important;
        background-image: none !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: 16px 16px !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:hover:not(:disabled) {
        border-color: #66bb6a !important;
        box-shadow: 0 0 12px rgba(76, 175, 80, 0.6) !important;
        background-color: rgba(76, 175, 80, 0.2) !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:checked {
        background-color: #4caf50 !important;
        border-color: #66bb6a !important;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
        /* White checkmark with blue glow - SVG encoded */
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
        background-size: 18px 18px !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        border-color: #666 !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled:checked {
        background-color: #666 !important;
        border-color: #888 !important;
      }
      
      /* Also style the toggle wrapper checkboxes */
      .pac-toggle input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        width: 26px !important;
        height: 26px !important;
        min-width: 26px !important;
        min-height: 26px !important;
        max-width: 26px !important;
        max-height: 26px !important;
        background: #111 !important;
        border: 3px solid #4caf50 !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        position: relative !important;
        margin: 0 !important;
        padding: 0 !important;
        transition: all 0.2s !important;
        flex-shrink: 0 !important;
        display: inline-block !important;
        background-image: none !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: 18px 18px !important;
      }
      
      .pac-toggle input[type="checkbox"]:hover:not(:disabled) {
        border-color: #66bb6a !important;
        box-shadow: 0 0 12px rgba(76, 175, 80, 0.6) !important;
        background-color: rgba(76, 175, 80, 0.2) !important;
      }
      
      .pac-toggle input[type="checkbox"]:checked {
        background-color: #4caf50 !important;
        border-color: #66bb6a !important;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.5) !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
        background-size: 20px 20px !important;
      }
      
      .pac-toggle input[type="checkbox"]:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        border-color: #666 !important;
      }
      
      .pac-toggle input[type="checkbox"]:disabled:checked {
        background-color: #666 !important;
        border-color: #888 !important;
      }
      
      .pac-warning-banner {
        padding: 12px;
        background: rgba(251, 191, 36, 0.15);
        border: 1px solid rgba(251, 191, 36, 0.4);
        border-radius: 8px;
        color: #fbbf24;
        font-size: 13px;
        line-height: 1.4;
      }
      
      .pac-results {
        background: linear-gradient(135deg, rgba(100,181,246,0.1) 0%, rgba(156,39,176,0.1) 100%);
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        border: 1px solid rgba(100,181,246,0.2);
      }
      
      .pac-result-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 13px;
      }
      
      .pac-result-row:last-child {
        margin-bottom: 0;
      }
      
      .pac-result-label {
        color: #bbb;
        font-weight: 500;
      }
      
      .pac-result-value {
        font-weight: 700;
        color: #fff;
        font-size: 14px;
      }
      
      .pac-confidence-control {
        margin: 12px 0;
        padding: 0;
      }
      
      .pac-confidence-control label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: #64b5f6;
        margin-bottom: 8px;
        font-weight: 600;
      }
      
      .pac-confidence-control input[type="range"] {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, 
          rgba(100,181,246,0.3) 0%, 
          rgba(156,39,176,0.3) 50%, 
          rgba(244,67,54,0.3) 100%);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
      }
      
      .pac-confidence-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #64b5f6 0%, #9c27b0 100%);
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(100,181,246,0.5);
        border: 2px solid #fff;
        transition: all 0.2s;
      }
      
      .pac-confidence-control input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 4px 12px rgba(100,181,246,0.7);
      }
      
      .pac-confidence-control input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(135deg, #64b5f6 0%, #9c27b0 100%);
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(100,181,246,0.5);
        transition: all 0.2s;
      }
      
      .pac-confidence-control input[type="range"]::-moz-range-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 4px 12px rgba(100,181,246,0.7);
      }
      
      /* Flash animation when target in shop */
      @keyframes targetInShopFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-color: #0f3460;
        }
        50% { 
          background: linear-gradient(135deg, #1e3a8a 0%, #fbbf24 100%);
          border-color: #fbbf24;
        }
      }
      
      #pac-calc-overlay.target-in-shop {
        animation: targetInShopFlash 0.25s ease-in-out infinite;
      }
      
      /* Full calculator gold flash overlay - always on top */
      #pac-calc-overlay.target-in-shop::before {
        content: '';
        position: absolute;
        inset: 0;  /* Cover entire calculator */
        background: transparent;
        border-radius: 12px;
        pointer-events: none;
        animation: targetInShopFullFlash 0.25s ease-in-out infinite;
        z-index: 999999999 !important;
      }
      
      @keyframes targetInShopFullFlash {
        0%, 100% { 
          background: transparent;
        }
        50% { 
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.5) 100%);
          box-shadow: inset 0 0 50px rgba(251, 191, 36, 0.6);
        }
      }
      
      /* Flash animation for team panel when any team target in shop */
      @keyframes teamTargetInShopFlash {
        0%, 100% { 
          border-color: rgba(255,255,255,0.1);
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        50% { 
          border-color: #FF1493;  /* Hot pink */
          background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);  /* Bright hot pink gradient */
          box-shadow: 0 0 30px rgba(255, 20, 147, 0.8);  /* Glow effect */
        }
      }
      
      .pac-team-panel.team-target-in-shop {
        animation: teamTargetInShopFlash 0.25s ease-in-out infinite;
      }
      
      /* Minimized flash animations - bright and visible */
      @keyframes minimizedTargetFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 0 30px rgba(251, 191, 36, 0.9), 0 0 60px rgba(251, 191, 36, 0.5);
        }
      }
      
      @keyframes minimizedTeamTargetFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
          box-shadow: 0 0 30px rgba(255, 20, 147, 0.9), 0 0 60px rgba(255, 20, 147, 0.5);
        }
      }
      
      /* When minimized AND target in shop - bright yellow flash */
      #pac-calc-overlay.minimized.target-in-shop {
        animation: minimizedTargetFlash 0.3s ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop #pac-calc-header {
        animation: minimizedTargetFlash 0.3s ease-in-out infinite;
      }
      
      /* When minimized AND team target in shop - bright pink flash */
      #pac-calc-overlay.minimized.team-target-in-shop {
        animation: minimizedTeamTargetFlash 0.3s ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.team-target-in-shop #pac-calc-header {
        animation: minimizedTeamTargetFlash 0.3s ease-in-out infinite;
      }
      
      /* Both at once - alternate between yellow and pink */
      @keyframes minimizedBothFlash {
        0%, 100% { 
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        25% { 
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 0 30px rgba(251, 191, 36, 0.9);
        }
        75% { 
          background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
          box-shadow: 0 0 30px rgba(255, 20, 147, 0.9);
        }
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop {
        animation: minimizedBothFlash 0.5s ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop #pac-calc-header {
        animation: minimizedBothFlash 0.5s ease-in-out infinite;
      }
      
      /* Refresh Blocker Overlay */
      #pac-refresh-blocker {
        position: fixed;
        z-index: 2147483647;
        background: rgba(239, 68, 68, 0.95);
        border: 3px solid #fbbf24;
        border-radius: 12px;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        box-shadow: 0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(239, 68, 68, 0.6);
        animation: blockerPulse 0.3s ease-in-out infinite alternate;
        cursor: default;
        user-select: none;
      }
      
      #pac-refresh-blocker.visible {
        display: flex;
      }
      
      @keyframes blockerPulse {
        from { 
          box-shadow: 0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(239, 68, 68, 0.6);
          transform: scale(1);
        }
        to { 
          box-shadow: 0 0 40px rgba(251, 191, 36, 1), 0 0 80px rgba(239, 68, 68, 0.8);
          transform: scale(1.02);
        }
      }
      
      #pac-refresh-blocker .blocker-title {
        font-size: 14px;
        font-weight: 700;
        color: #fbbf24;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 0 10px rgba(0,0,0,0.5);
      }
      
      #pac-refresh-blocker .blocker-pokemon {
        font-size: 18px;
        font-weight: 800;
        color: white;
        text-shadow: 0 0 10px rgba(0,0,0,0.5);
      }
      
      #pac-refresh-blocker .blocker-dismiss {
        position: absolute;
        top: -12px;
        right: -12px;
        width: 28px;
        height: 28px;
        background: #1e293b;
        border: 2px solid #fbbf24;
        border-radius: 50%;
        color: #fbbf24;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
      }
      
      #pac-refresh-blocker .blocker-dismiss:hover {
        background: #fbbf24;
        color: #1e293b;
        transform: scale(1.1);
      }
      
      .pac-footer {
        background: rgba(0,0,0,0.2);
        padding: 10px 16px;
        border-radius: 0 0 10px 10px;
        border-top: 1px solid rgba(255,255,255,0.05);
        font-size: 11px;
        color: #888;
        display: flex;
        justify-content: space-between;
        position: relative;
        z-index: 1;  /* Above side panels */
        cursor: move;
      }
      
      .pac-collapsible {
        margin-bottom: 16px;
      }
      
      .pac-collapse-btn {
        width: 100%;
        background: rgba(100,181,246,0.1);
        border: 1px solid rgba(100,181,246,0.2);
        color: #64b5f6;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
        text-align: left;
      }
      
      .pac-collapse-btn:hover {
        background: rgba(100,181,246,0.15);
      }
      
      .pac-collapse-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        background: rgba(255,255,255,0.02);
        border-radius: 0 0 6px 6px;
        padding: 0 12px;
      }
      
      .pac-collapse-content.expanded {
        max-height: 800px;
        padding: 12px;
        border: 1px solid rgba(255,255,255,0.05);
        border-top: none;
      }
      
      .pac-status-msg {
        font-size: 12px;
        padding: 8px;
        border-radius: 6px;
        margin-top: 8px;
        text-align: center;
      }
      
      .pac-status-msg.error {
        background: rgba(244,67,54,0.15);
        color: #ff5252;
        border: 1px solid rgba(244,67,54,0.3);
      }
      
      .pac-status-msg.warning {
        background: rgba(255,152,0,0.15);
        color: #ffab40;
        border: 1px solid rgba(255,152,0,0.3);
      }
      
      .pac-status-msg.success {
        background: rgba(76,175,80,0.15);
        color: #4caf50;
        border: 1px solid rgba(76,175,80,0.3);
      }
      
      .pac-live-indicator {
        display: none;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #4caf50;
        margin-top: 8px;
        padding: 6px 10px;
        background: rgba(76,175,80,0.1);
        border-radius: 6px;
        border: 1px solid rgba(76,175,80,0.2);
      }
      
      .pac-stage-display {
        font-weight: 600;
        color: #64b5f6;
      }
      
      .pac-stage-display.pve {
        color: #fbbf24;
      }
      
      .pac-live-divider {
        color: rgba(255,255,255,0.3);
        margin: 0 2px;
      }
      
      .pac-pokemon-chip {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        color: white;
      }
      .pac-pokemon-chip.common { background: rgb(160, 160, 160); }
      .pac-pokemon-chip.uncommon { background: rgb(59, 201, 94); }
      .pac-pokemon-chip.rare { background: rgb(65, 191, 204); }
      .pac-pokemon-chip.epic { background: rgb(146, 127, 255); }
      .pac-pokemon-chip.ultra { background: rgb(239, 68, 68); }
      .pac-pokemon-chip.unknown { background: #555; }
      
      .pac-live-controls {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      
      .pac-live-toggle {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-live-toggle:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.2);
      }
      
      .pac-live-toggle.active {
        background: rgba(76,175,80,0.2);
        border-color: rgba(76,175,80,0.4);
      }
      
      .pac-live-status {
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
      }
      
      .pac-live-toggle .pac-live-status {
        background: rgba(244,67,54,0.3);
        color: #ff5252;
      }
      
      .pac-live-toggle.active .pac-live-status {
        background: rgba(76,175,80,0.3);
        color: #4caf50;
      }
      
      .pac-speed-select {
        flex: 1;
        padding: 8px;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-speed-select:hover {
        border-color: #64b5f6;
      }
      
      .pac-speed-select:focus {
        outline: none;
        border-color: #64b5f6;
        box-shadow: 0 0 8px rgba(100,181,246,0.3);
      }
      
      /* Pokemon Autocomplete Styles */
      .pac-pokemon-selector {
        position: relative;
        width: 100%;
      }
      
      
      /* Evolution Family Styles (v2.5.0) */
      .pac-evolution-family {
        margin-top: 8px;
        padding: 8px;
        background: rgba(100, 181, 246, 0.1);
        border-radius: 6px;
        border: 1px solid rgba(100, 181, 246, 0.2);
      }
      
      .pac-family-title {
        font-size: 11px;
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .pac-family-breakdown {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 8px 0;
      }
      
      .pac-family-row {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding: 4px 6px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
      }
      
      .pac-family-name {
        font-weight: 600;
        color: #fff;
      }
      
      .pac-family-calc {
        color: #64b5f6;
        font-family: 'Courier New', monospace;
      }
      
      .pac-family-total {
        font-weight: 700;
        text-align: right;
        color: #fff;
        padding-top: 4px;
        border-top: 1px solid rgba(100, 181, 246, 0.3);
        font-size: 13px;
      }

      .pac-autocomplete-input {
        width: 100%;
        text-transform: uppercase;
      }
      
      #pacAutocompleteDropdown {
        position: fixed;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        background: #0a0e27;
        border: 1px solid rgba(100,181,246,0.3);
        border-radius: 6px;
        z-index: 1000000;
        box-shadow: 0 8px 16px rgba(0,0,0,0.4);
      }
      
      #pacAutocompleteDropdown.hidden {
        display: none;
      }
      
      .pac-dropdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        cursor: pointer;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        transition: all 0.2s;
      }
      
      .pac-dropdown-item:hover {
        background: rgba(100,181,246,0.15);
      }
      
      .pac-dropdown-item:last-child {
        border-bottom: none;
      }
      
      .pac-pokemon-name {
        font-weight: 600;
        color: #fff;
        font-size: 13px;
      }
      
      .pac-pokemon-rarity {
        font-size: 10px;
        padding: 3px 8px;
        border-radius: 4px;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      
      #pacRarityError {
        color: #ff5252;
        font-size: 11px;
        margin-top: 6px;
        padding: 6px 10px;
        background: rgba(244,67,54,0.15);
        border-radius: 6px;
        border: 1px solid rgba(244,67,54,0.3);
      }
      
      #pacRarityError.hidden {
        display: none;
      }
      
      /* Scrollbar styling */
      #pac-calc-body::-webkit-scrollbar,
      #pacAutocompleteDropdown::-webkit-scrollbar {
        width: 8px;
      }
      
      #pac-calc-body::-webkit-scrollbar-track,
      #pacAutocompleteDropdown::-webkit-scrollbar-track {
        background: rgba(0,0,0,0.2);
        border-radius: 10px;
      }
      
      #pac-calc-body::-webkit-scrollbar-thumb,
      #pacAutocompleteDropdown::-webkit-scrollbar-thumb {
        background: rgba(100,181,246,0.3);
        border-radius: 10px;
      }
      
      #pac-calc-body::-webkit-scrollbar-thumb:hover,
      #pacAutocompleteDropdown::-webkit-scrollbar-thumb:hover {
        background: rgba(100,181,246,0.5);
      }
      
      /* ═══════════════════════════════════════════════════════════════════════════
         TEAM TRACKER SIDE PANEL (v2.9.6)
         ═══════════════════════════════════════════════════════════════════════════ */
      
      .pac-team-panel {
        position: absolute;
        left: 0;
        top: 0;
        width: 380px;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: -2147483648 !important;  /* Absolute minimum - below everything for flash visibility */
        display: flex;
        flex-direction: column;
      }
      
      .pac-team-panel.expanded {
        left: 390px;
      }
      
      .pac-team-toggle {
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 80px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-left: none;
        border-radius: 0 8px 8px 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64b5f6;
        font-size: 20px;
        z-index: -1 !important;  /* Below main calculator so flash shows */
      }
      
      .pac-team-toggle:hover {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        border-color: #64b5f6;
        transition: background 0.2s, border-color 0.2s;
      }
      
      .pac-team-arrow {
        transition: transform 0.3s;
        display: inline-block;
      }
      
      .pac-team-panel.expanded .pac-team-arrow {
        transform: rotate(180deg);
      }
      
      .pac-team-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
        position: relative;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
      }
      
      .pac-team-panel.expanded .pac-team-content {
        opacity: 1;
        pointer-events: all;
        transition-delay: 0.3s;
      }
      
      .pac-team-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      
      .pac-team-header h3 {
        margin: 0;
        font-size: 16px;
        color: #64b5f6;
        font-weight: 600;
      }
      
      .pac-team-close {
        background: none;
        border: none;
        color: #888;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
      }
      
      .pac-team-close:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }
      
      .pac-team-list {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 16px;
        min-height: 200px;
      }
      
      .pac-team-item {
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
        transition: all 0.2s;
        cursor: pointer;
      }
      
      .pac-team-item:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(100,181,246,0.3);
      }
      
      .pac-team-item.active {
        border-color: #64b5f6;
        background: rgba(100,181,246,0.1);
      }
      
      .pac-team-item.not-in-pool {
        opacity: 0.6;
        border-style: dashed;
      }
      
      /* Impossible state - red flash */
      .pac-team-item.pac-impossible {
        border-color: #f44336;
        background: rgba(244, 67, 54, 0.15);
        animation: impossiblePulse 1.5s ease-in-out infinite;
      }
      
      @keyframes impossiblePulse {
        0%, 100% { background: rgba(244, 67, 54, 0.15); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        50% { background: rgba(244, 67, 54, 0.25); box-shadow: 0 0 8px 2px rgba(244, 67, 54, 0.3); }
      }
      
      /* Danger state - orange warning */
      .pac-team-item.pac-danger {
        border-color: #ff9800;
        background: rgba(255, 152, 0, 0.12);
        animation: dangerPulse 2s ease-in-out infinite;
      }
      
      @keyframes dangerPulse {
        0%, 100% { background: rgba(255, 152, 0, 0.12); box-shadow: 0 0 0 0 rgba(255, 152, 0, 0); }
        50% { background: rgba(255, 152, 0, 0.2); box-shadow: 0 0 6px 1px rgba(255, 152, 0, 0.25); }
      }
      
      /* Warning badges */
      .pac-warning-badge {
        font-size: 12px;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 4px;
      }
      
      .pac-impossible-badge {
        background: #f44336;
        color: #fff;
      }
      
      .pac-danger-badge {
        background: #ff9800;
        color: #000;
      }
      
      /* Text colors for pool display */
      .pac-impossible-text {
        color: #f44336 !important;
      }
      
      .pac-danger-text {
        color: #ff9800 !important;
      }
      
      /* Maxed state - green success */
      .pac-maxed-badge {
        background: #4caf50;
        color: #fff;
      }
      
      .pac-maxed-text {
        color: #4caf50 !important;
      }
      
      .pac-team-item.pac-maxed {
        border-color: #4caf50;
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
      }
      
      .pac-team-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      
      .pac-team-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
      
      .pac-team-name {
        flex: 1;
        font-weight: 600;
        font-size: 14px;
        color: #fff;
      }
      
      .pac-team-remove {
        background: none;
        border: none;
        color: #f44336;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
      }
      
      .pac-team-remove:hover {
        background: rgba(244,67,54,0.2);
      }
      
      .pac-team-meta {
        font-size: 11px;
        color: #888;
        margin-bottom: 6px;
      }
      
      .pac-team-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        font-size: 11px;
      }
      
      .pac-team-stat-mini {
        background: rgba(0,0,0,0.3);
        padding: 4px 8px;
        border-radius: 4px;
        text-align: center;
      }
      
      .pac-team-stat-mini-label {
        color: #888;
        font-size: 10px;
      }
      
      .pac-team-stat-mini-value {
        color: #64b5f6;
        font-weight: 600;
      }
      
      .pac-team-combined {
        background: rgba(100,181,246,0.1);
        border: 1px solid rgba(100,181,246,0.2);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
      }
      
      .pac-team-combined-title {
        font-size: 12px;
        color: #64b5f6;
        font-weight: 600;
        margin-bottom: 8px;
        text-align: center;
      }
      
      .pac-team-combined-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      
      .pac-team-stat {
        text-align: center;
      }
      
      .pac-team-stat-label {
        display: block;
        font-size: 10px;
        color: #888;
        margin-bottom: 4px;
      }
      
      .pac-team-stat-value {
        display: block;
        font-size: 16px;
        color: #fff;
        font-weight: 700;
      }
      
      .pac-team-add-section {
        display: flex;
        gap: 8px;
        align-items: stretch;
      }
      
      .pac-team-input {
        flex: 1;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        padding: 10px;
        border-radius: 6px;
        font-size: 13px;
        transition: all 0.2s;
      }
      
      .pac-team-input:focus {
        outline: none;
        border-color: #64b5f6;
        background: rgba(0,0,0,0.4);
      }
      
      .pac-team-add-btn {
        background: rgba(76,175,80,0.2);
        border: 1px solid rgba(76,175,80,0.4);
        color: #4caf50;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
        white-space: nowrap;
      }
      
      .pac-team-add-btn:hover {
        background: rgba(76,175,80,0.3);
        border-color: #4caf50;
      }
      
      .pac-team-dropdown {
        position: fixed;
        width: 320px;
        background: rgba(26, 26, 46, 0.98);
        border: 2px solid #64b5f6;
        border-radius: 8px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 999999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        padding: 8px 0;
      }
      
      .pac-team-dropdown.hidden {
        display: none;
      }
      
      .pac-team-dropdown-item {
        padding: 8px 12px;
        cursor: pointer;
        transition: background 0.1s;
        font-size: 13px;
      }
      
      .pac-team-dropdown-item:hover,
      .pac-team-dropdown-item.selected {
        background: rgba(100,181,246,0.2);
      }
      
      .pac-team-dropdown-name {
        font-weight: 600;
      }
      
      .pac-team-dropdown-meta {
        font-size: 11px;
        color: #888;
        margin-top: 2px;
      }
      
      .pac-team-add {
        width: 100%;
        background: rgba(76,175,80,0.2);
        border: 1px solid rgba(76,175,80,0.4);
        color: #4caf50;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .pac-team-add:hover {
        background: rgba(76,175,80,0.3);
        border-color: #4caf50;
      }
      
      .pac-team-empty {
        text-align: center;
        color: #888;
        font-size: 13px;
        padding: 40px 20px;
      }
      
      .pac-team-empty-icon {
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.3;
      }
      
      /* Counter Intelligence Panel Styles */
      .pac-current-toggle {
        top: calc(50% - 60px) !important;  /* Stacked above team tracker arrow */
      }
      
      .pac-intel-players {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
        overflow-y: auto;
        padding-right: 4px;
      }
      
      .pac-intel-empty {
        color: #666;
        font-size: 12px;
        font-style: italic;
        padding: 20px;
        text-align: center;
      }
      
      .pac-intel-player {
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.2s;
      }
      
      .pac-intel-player.is-you {
        border-color: rgba(100,181,246,0.4);
        background: rgba(100,181,246,0.08);
      }
      
      .pac-intel-player.contested {
        border-color: #ff9800;
        background: rgba(255,152,0,0.1);
      }
      
      .pac-intel-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        cursor: pointer;
        transition: background 0.2s;
        user-select: none;
      }
      
      .pac-intel-header:hover {
        background: rgba(255,255,255,0.05);
      }
      
      .pac-intel-arrow {
        font-size: 10px;
        color: #888;
        transition: transform 0.2s;
      }
      
      .pac-intel-player.expanded .pac-intel-arrow {
        transform: rotate(90deg);
      }
      
      .pac-intel-name {
        flex: 1;
        font-weight: 600;
        font-size: 13px;
        color: #fff;
      }
      
      .pac-intel-player.is-you .pac-intel-name {
        color: #64b5f6;
      }
      
      .pac-intel-count {
        font-size: 11px;
        color: #888;
      }
      
      .pac-intel-contested-badge {
        background: #ff9800;
        color: #000;
        font-size: 10px;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 4px;
      }
      
      .pac-intel-content {
        display: none;
        padding: 0 12px 12px 12px;
        border-top: 1px solid rgba(255,255,255,0.05);
      }
      
      .pac-intel-player.expanded .pac-intel-content {
        display: block;
      }
      
      .pac-intel-shop {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        margin-bottom: 10px;
      }
      
      .pac-intel-shop-label {
        font-size: 10px;
        color: #888;
        text-transform: uppercase;
        width: 100%;
        margin-bottom: 4px;
      }
      
      .pac-intel-shop-slot {
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 10px;
        color: #ccc;
      }
      
      .pac-intel-shop-slot.empty {
        color: #555;
        border-style: dashed;
      }
      
      .pac-intel-units {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      
      .pac-intel-unit {
        background: rgba(100,181,246,0.12);
        border: 1px solid rgba(100,181,246,0.25);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 11px;
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        transition: all 0.2s;
      }
      
      .pac-intel-unit.contested {
        border-color: #ff9800;
        background: rgba(255,152,0,0.2);
        box-shadow: 0 0 6px rgba(255,152,0,0.3);
      }
      
      .pac-intel-unit-name {
        font-weight: 600;
        color: #fff;
      }
      
      .pac-intel-unit-stars {
        color: #fbbf24;
        font-size: 10px;
      }
      
      .pac-intel-unit-pool {
        font-size: 10px;
        color: #888;
        margin-left: 2px;
      }
      
      .pac-intel-unit-pool.low {
        color: #ff9800;
      }
      
      .pac-intel-unit-pool.critical {
        color: #f44336;
      }
      
      /* Settings/Accessibility Panel */
      .pac-settings-toggle {
        top: calc(50% + 60px) !important;  /* Below team tracker arrow */
      }
      
      .pac-settings-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
        position: relative;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
        overflow-y: auto;
      }
      
      .pac-team-panel.expanded .pac-settings-content {
        opacity: 1;
        pointer-events: all;
        transition-delay: 0.3s;
      }
      
      .pac-settings-section {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      
      .pac-settings-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .pac-settings-section-title {
        font-size: 11px;
        font-weight: 600;
        color: #64b5f6;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }
      
      .pac-settings-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      
      .pac-settings-row:last-child {
        margin-bottom: 0;
      }
      
      .pac-settings-label {
        font-size: 12px;
        color: #ccc;
      }
      
      .pac-settings-color-input {
        width: 40px;
        height: 28px;
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
        padding: 0;
      }
      
      .pac-settings-color-input::-webkit-color-swatch-wrapper {
        padding: 2px;
      }
      
      .pac-settings-color-input::-webkit-color-swatch {
        border-radius: 2px;
        border: none;
      }
      
      .pac-settings-slider {
        width: 120px;
        height: 8px;
        -webkit-appearance: none;
        background: linear-gradient(90deg, rgba(100,181,246,0.3) 0%, rgba(100,181,246,0.6) 100%);
        border-radius: 4px;
        cursor: pointer;
        outline: none;
        position: relative;
      }
      
      .pac-settings-slider::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(100,181,246,0.2) 0%, rgba(100,181,246,0.4) 100%);
      }
      
      .pac-settings-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 2px rgba(100,181,246,0.3);
        margin-top: -6px;
      }
      
      .pac-settings-slider::-webkit-slider-thumb:hover {
        background: linear-gradient(135deg, #90caf9 0%, #64b5f6 100%);
        box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 3px rgba(100,181,246,0.4);
        transform: scale(1.1);
      }
      
      .pac-settings-slider::-webkit-slider-thumb:active {
        transform: scale(0.95);
      }
      
      /* Firefox slider */
      .pac-settings-slider::-moz-range-track {
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(100,181,246,0.2) 0%, rgba(100,181,246,0.4) 100%);
      }
      
      .pac-settings-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 2px rgba(100,181,246,0.3);
      }
      
      /* Toggle Switch */
      .pac-settings-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
      }
      
      .pac-settings-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .pac-settings-switch-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255,255,255,0.1);
        transition: 0.3s;
        border-radius: 26px;
        border: 2px solid rgba(255,255,255,0.2);
      }
      
      .pac-settings-switch-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background: #888;
        transition: 0.3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      
      .pac-settings-switch input:checked + .pac-settings-switch-slider {
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        border-color: #4caf50;
      }
      
      .pac-settings-switch input:checked + .pac-settings-switch-slider:before {
        transform: translateX(22px);
        background: #fff;
      }
      
      .pac-settings-switch-slider:hover {
        border-color: rgba(255,255,255,0.4);
      }
      
      .pac-settings-value {
        font-size: 11px;
        color: #888;
        min-width: 45px;
        text-align: right;
      }
      
      .pac-settings-slider-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .pac-settings-btn {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        border: 1px solid #3b82f6;
        border-radius: 6px;
        color: #fff;
        padding: 8px 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
        margin-top: 8px;
      }
      
      .pac-settings-btn:hover {
        background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
        box-shadow: 0 2px 8px rgba(59,130,246,0.3);
      }
      
      .pac-settings-btn.reset {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.2);
      }
      
      .pac-settings-btn.reset:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.3);
      }
      
      .pac-settings-preview {
        background: var(--pac-bg-color, #1a1a2e);
        border: 2px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        padding: 16px;
        margin-top: 12px;
        text-align: center;
        transition: background 0.2s;
      }
      
      .pac-settings-preview-text {
        color: var(--pac-text-color, #e0e0e0);
        font-size: var(--pac-font-size, 12px);
        margin-bottom: 12px;
        font-weight: 500;
      }
      
      .pac-settings-preview-flashes {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      .pac-settings-flash-preview {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s;
      }
      
      .pac-settings-flash-preview.target {
        background: var(--pac-target-flash, #fbbf24);
        color: #000;
        box-shadow: 0 2px 8px var(--pac-target-flash, #fbbf24)66;
      }
      
      .pac-settings-flash-preview.team {
        background: var(--pac-team-flash, #FF1493);
        color: #fff;
        box-shadow: 0 2px 8px var(--pac-team-flash, #FF1493)66;
      }
      
      .pac-settings-flash-preview.disabled {
        opacity: 0.4;
        box-shadow: none;
      }
      
      /* Shop History / Roll Luck Panel */
      .pac-history-toggle {
        top: calc(50% + 120px) !important;  /* Below settings arrow */
      }
      
      .pac-history-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        padding: 16px;
        position: relative;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        pointer-events: none;
        overflow: hidden;
      }
      
      .pac-history-content::-webkit-scrollbar {
        display: none;  /* Chrome/Safari/Opera */
      }
      
      .pac-team-panel.expanded .pac-history-content {
        opacity: 1;
        pointer-events: all;
        transition-delay: 0.3s;
        overflow: visible;
      }
      
      .pac-history-disclaimer {
        background: rgba(251, 191, 36, 0.15);
        border: 1px solid rgba(251, 191, 36, 0.3);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 10px;
        color: #fbbf24;
        margin-bottom: 12px;
        text-align: center;
        flex-shrink: 0;
      }
      }
      
      .pac-history-players {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .pac-history-players::-webkit-scrollbar {
        display: none;
      }
      
      /* Player accordion */
      .pac-history-player {
        margin-bottom: 8px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.03);
      }
      
      .pac-history-player.current-player {
        border-color: rgba(100, 181, 246, 0.4);
        background: rgba(100, 181, 246, 0.08);
      }
      
      .pac-history-player.expanded {
        border-color: rgba(255,255,255,0.2);
      }
      
      .pac-history-player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .pac-history-player-header:hover {
        background: rgba(255,255,255,0.05);
      }
      
      .pac-history-player-name {
        font-weight: 600;
        font-size: 12px;
        color: #e0e0e0;
      }
      
      .pac-history-player.current-player .pac-history-player-name {
        color: #64b5f6;
      }
      
      .pac-history-player-summary {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
      }
      
      .pac-history-rolls {
        color: #888;
      }
      
      .pac-history-level {
        color: #64b5f6;
        font-size: 10px;
      }
      
      .pac-history-lucky-count {
        color: #4caf50;
      }
      
      .pac-history-unlucky-count {
        color: #f44336;
      }
      
      .pac-history-expand-icon {
        font-size: 10px;
        color: #666;
        transition: transform 0.2s;
      }
      
      .pac-history-player.expanded .pac-history-expand-icon {
        transform: rotate(180deg);
      }
      
      .pac-history-player-content {
        padding: 0 12px 12px;
        border-top: 1px solid rgba(255,255,255,0.08);
      }
      
      .pac-history-level-breakdown {
        font-size: 9px;
        color: #666;
        padding: 6px 0;
        font-family: monospace;
      }
      
      .pac-history-section {
        margin-top: 10px;
      }
      
      .pac-history-section-title {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      
      .pac-history-section.lucky .pac-history-section-title {
        color: #4caf50;
      }
      
      .pac-history-section.unlucky .pac-history-section-title {
        color: #f44336;
      }
      
      .pac-history-list {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      
      .pac-history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
      }
      
      .pac-history-section.lucky .pac-history-item {
        background: rgba(76, 175, 80, 0.12);
      }
      
      .pac-history-section.unlucky .pac-history-item {
        background: rgba(244, 67, 54, 0.12);
      }
      
      .pac-history-pokemon {
        font-weight: 600;
        color: #e0e0e0;
        font-size: 10px;
      }
      
      .pac-history-stats-row {
        display: flex;
        gap: 6px;
        font-size: 9px;
      }
      
      .pac-history-seen {
        color: #64b5f6;
      }
      
      .pac-history-expected {
        color: #666;
      }
      
      .pac-history-diff {
        font-weight: 600;
      }
      
      .pac-history-diff.positive {
        color: #4caf50;
      }
      
      .pac-history-diff.negative {
        color: #f44336;
      }
      
      .pac-history-empty {
        color: #666;
        font-size: 11px;
        font-style: italic;
        padding: 12px 8px;
        text-align: center;
      }
      
      /* Analytics Tab System (v3.2.1) */
      .pac-analytics-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        flex-shrink: 0;
      }
      
      .pac-analytics-tab {
        flex: 1;
        padding: 8px 12px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #888;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
      }
      
      .pac-analytics-tab:hover {
        background: rgba(255,255,255,0.1);
        color: #e0e0e0;
      }
      
      .pac-analytics-tab.active {
        background: rgba(100, 181, 246, 0.2);
        border-color: rgba(100, 181, 246, 0.4);
        color: #64b5f6;
      }
      
      .pac-analytics-tab.analytics-btn {
        background: rgba(255,255,255,0.9);
        border-color: rgba(255,255,255,0.95);
        color: #333;
      }
      
      .pac-analytics-tab.analytics-btn:hover {
        background: #fff;
        color: #000;
      }
      
      .pac-analytics-tab.analytics-btn.active {
        background: #fff;
        border-color: #64b5f6;
        color: #000;
        box-shadow: 0 0 12px rgba(100, 181, 246, 0.4);
      }
      
      .pac-analytics-content {
        display: none;
        flex-direction: column;
        flex: 1;
        min-height: 0;
      }
      
      .pac-analytics-content.active {
        display: flex;
      }
      
      /* Analytics Panel - White Theme */
      .pac-analytics-panel {
        background: #ffffff;
        border-radius: 8px;
        padding: 16px;
        color: #1a1a2e;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .pac-analytics-panel::-webkit-scrollbar {
        display: none;
      }
      
      .pac-analytics-section {
        margin-bottom: 20px;
      }
      
      .pac-analytics-section:last-child {
        margin-bottom: 0;
      }
      
      .pac-analytics-title {
        font-size: 13px;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 12px;
        padding-bottom: 6px;
        border-bottom: 2px solid #64b5f6;
      }
      
      /* Luck Gauge */
      .pac-luck-gauge {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 8px;
      }
      
      .pac-luck-gauge-bar {
        flex: 1;
        height: 24px;
        background: linear-gradient(90deg, #f44336 0%, #ff9800 25%, #ffeb3b 50%, #8bc34a 75%, #4caf50 100%);
        border-radius: 12px;
        position: relative;
        overflow: hidden;
      }
      
      .pac-luck-gauge-marker {
        position: absolute;
        top: -4px;
        width: 4px;
        height: 32px;
        background: #1a1a2e;
        border-radius: 2px;
        transform: translateX(-50%);
        box-shadow: 0 0 8px rgba(0,0,0,0.3);
        transition: left 0.5s ease-out;
      }
      
      .pac-luck-gauge-labels {
        display: flex;
        justify-content: space-between;
        font-size: 9px;
        color: #666;
        margin-top: 4px;
      }
      
      .pac-luck-score {
        font-size: 28px;
        font-weight: 800;
        min-width: 70px;
        text-align: center;
        transition: color 0.3s ease;
      }
      
      .pac-luck-score.lucky {
        color: #4caf50;
      }
      
      .pac-luck-score.unlucky {
        color: #f44336;
      }
      
      .pac-luck-score.neutral {
        color: #666;
      }
      
      /* Rarity Charts - Horizontal Bars */
      .pac-rarity-charts {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .pac-rarity-chart {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 12px;
      }
      
      .pac-rarity-chart-title {
        font-size: 11px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .pac-rarity-chart-diff {
        font-size: 12px;
        font-weight: 700;
      }
      
      .pac-rarity-chart-diff.positive {
        color: #4caf50;
      }
      
      .pac-rarity-chart-diff.negative {
        color: #f44336;
      }
      
      .pac-chart-horizontal {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      
      .pac-chart-row {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 24px;
      }
      
      .pac-chart-row-label {
        width: 28px;
        font-size: 9px;
        color: #666;
        text-align: right;
        flex-shrink: 0;
      }
      
      .pac-chart-bar-h {
        height: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 6px;
        min-width: 30px;
        transition: width 0.3s ease;
      }
      
      .pac-chart-bar-h.expected {
        background: linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%);
        border: 1px solid #90caf9;
      }
      
      .pac-chart-bar-h.actual {
        background: linear-gradient(90deg, #64b5f6 0%, #42a5f5 100%);
      }
      
      .pac-chart-bar-h.actual.over {
        background: linear-gradient(90deg, #81c784 0%, #4caf50 100%);
      }
      
      .pac-chart-bar-h.actual.under {
        background: linear-gradient(90deg, #e57373 0%, #f44336 100%);
      }
      
      .pac-chart-bar-value {
        font-size: 10px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
      
      .pac-chart-bar-h.expected .pac-chart-bar-value {
        color: #1565c0;
        text-shadow: none;
      }
      
      /* Level Breakdown */
      .pac-level-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      
      .pac-level-card {
        background: #f5f5f5;
        border-radius: 6px;
        padding: 8px;
        text-align: center;
      }
      
      .pac-level-card-header {
        font-size: 11px;
        font-weight: 700;
        color: #64b5f6;
        margin-bottom: 4px;
      }
      
      .pac-level-card-rolls {
        font-size: 18px;
        font-weight: 800;
        color: #1a1a2e;
      }
      
      .pac-level-card-label {
        font-size: 9px;
        color: #888;
      }
      
      /* Narrative Summary */
      .pac-narrative {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 12px;
        font-size: 12px;
        line-height: 1.6;
        color: #333;
      }
      
      .pac-narrative-highlight {
        font-weight: 700;
      }
      
      .pac-narrative-highlight.lucky {
        color: #4caf50;
      }
      
      .pac-narrative-highlight.unlucky {
        color: #f44336;
      }
      
      .pac-narrative-highlight.neutral {
        color: #64b5f6;
      }
      
      .pac-narrative p {
        margin: 0 0 8px 0;
      }
      
      .pac-narrative p:last-child {
        margin-bottom: 0;
      }
      
      /* Analytics Disclaimer */
      .pac-analytics-disclaimer {
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid rgba(255, 152, 0, 0.3);
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 10px;
        color: #f57c00;
        margin-bottom: 12px;
        text-align: center;
        flex-shrink: 0;
      }
      
      /* Fishing Tab Styles */
      .pac-analytics-tab.fishing-btn {
        background: rgba(100, 181, 246, 0.15);
        border-color: rgba(100, 181, 246, 0.3);
        color: #64b5f6;
      }
      
      .pac-analytics-tab.fishing-btn:hover {
        background: rgba(100, 181, 246, 0.25);
        color: #90caf9;
      }
      
      .pac-analytics-tab.fishing-btn.active {
        background: rgba(100, 181, 246, 0.3);
        border-color: #64b5f6;
        color: #64b5f6;
        box-shadow: 0 0 12px rgba(100, 181, 246, 0.4);
      }
      
      .pac-fishing-disclaimer {
        background: rgba(255, 152, 0, 0.15);
        border: 1px solid rgba(255, 152, 0, 0.4);
        border-radius: 6px;
        padding: 10px 12px;
        font-size: 11px;
        color: #ffb74d;
        margin-bottom: 12px;
        text-align: center;
        flex-shrink: 0;
        font-weight: 600;
      }
      
      .pac-fishing-panel {
        background: #ffffff;
        border-radius: 8px;
        padding: 16px;
        color: #1a1a2e;
        flex: 1;
        overflow-y: auto;
      }
      
      .pac-fishing-section {
        margin-bottom: 16px;
      }
      
      .pac-fishing-section:last-child {
        margin-bottom: 0;
      }
      
      .pac-fishing-title {
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 10px;
        color: #1a1a2e;
      }
      
      .pac-fishing-rod-select {
        display: flex;
        gap: 6px;
        margin-bottom: 8px;
      }
      
      .pac-rod-btn {
        flex: 1;
        padding: 8px 6px;
        background: #f0f0f0;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        color: #666;
      }
      
      .pac-rod-btn:hover {
        background: #e0e0e0;
        border-color: #64b5f6;
      }
      
      .pac-rod-btn.active {
        background: linear-gradient(135deg, #64b5f6, #42a5f5);
        border-color: #1e88e5;
        color: white;
      }
      
      .pac-rod-btn[data-rod="old"].active {
        background: linear-gradient(135deg, #8d6e63, #6d4c41);
        border-color: #5d4037;
      }
      
      .pac-rod-btn[data-rod="good"].active {
        background: linear-gradient(135deg, #78909c, #546e7a);
        border-color: #455a64;
      }
      
      .pac-rod-btn[data-rod="super"].active {
        background: linear-gradient(135deg, #ffd54f, #ffb300);
        border-color: #ff8f00;
        color: #333;
      }
      
      .pac-fishing-rod-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: 9px;
        color: #888;
        padding: 6px 8px;
        background: #f5f5f5;
        border-radius: 4px;
      }
      
      .pac-rod-synergy {
        display: flex;
        align-items: center;
      }
      
      .pac-fishing-odds {
        background: #f5f5f5;
        border-radius: 6px;
        padding: 10px;
      }
      
      .pac-fishing-no-rod {
        text-align: center;
        color: #999;
        font-size: 11px;
        font-style: italic;
        padding: 8px 0;
      }
      
      .pac-fishing-odds-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }
      
      .pac-fishing-odds-table th {
        text-align: left;
        padding: 4px 6px;
        border-bottom: 1px solid #ddd;
        font-weight: 600;
        color: #666;
      }
      
      .pac-fishing-odds-table td {
        padding: 4px 6px;
        border-bottom: 1px solid #eee;
      }
      
      .pac-fishing-odds-table tr:last-child td {
        border-bottom: none;
      }
      
      .pac-fishing-odds-table .rarity-common { color: #9e9e9e; }
      .pac-fishing-odds-table .rarity-uncommon { color: #4caf50; }
      .pac-fishing-odds-table .rarity-rare { color: #2196f3; }
      .pac-fishing-odds-table .rarity-epic { color: #9c27b0; }
      .pac-fishing-odds-table .rarity-ultra { color: #f44336; }
      .pac-fishing-odds-table .rarity-special { color: #ff9800; font-weight: 600; }
      
      .pac-fishing-special-note {
        font-size: 10px;
        color: #ff9800;
        margin-top: 6px;
        text-align: center;
        font-style: italic;
      }
      
      .pac-fishing-toggle-row {
        margin-bottom: 10px;
      }
      
      .pac-fishing-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11px;
        color: #666;
        cursor: pointer;
      }
      
      .pac-fishing-checkbox input {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      
      .pac-fishing-pool {
        background: #f5f5f5;
        border-radius: 6px;
        padding: 10px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .pac-fishing-pool::-webkit-scrollbar {
        width: 6px;
      }
      
      .pac-fishing-pool::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
      }
      
      .pac-fishing-rarity-group {
        margin-bottom: 12px;
        padding-top: 4px;
      }
      
      .pac-fishing-rarity-group:first-child {
        padding-top: 24px;
      }
      
      .pac-fishing-rarity-group:last-child {
        margin-bottom: 0;
      }
      
      .pac-fishing-rarity-label {
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 4px;
        padding-bottom: 2px;
        border-bottom: 1px solid #ddd;
      }
      
      .pac-fishing-rarity-label.common { color: #9e9e9e; }
      .pac-fishing-rarity-label.uncommon { color: #4caf50; }
      .pac-fishing-rarity-label.rare { color: #2196f3; }
      .pac-fishing-rarity-label.epic { color: #9c27b0; }
      
      .pac-fishing-pokemon-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      
      .pac-fishing-pokemon {
        font-size: 10px;
        padding: 2px 6px;
        background: #fff;
        border-radius: 3px;
        border: 1px solid #ddd;
        color: #333;
        cursor: pointer;
        position: relative;
      }
      
      .pac-fishing-pokemon:hover {
        border-color: #64b5f6;
        background: #e3f2fd;
      }
      
      .pac-fishing-pokemon .pac-fish-tooltip {
        display: none;
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background: #ffffff;
        color: #000000;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        pointer-events: none;
      }
      
      .pac-fishing-pokemon .pac-fish-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: #ffffff;
      }
      
      .pac-fishing-pokemon:hover .pac-fish-tooltip {
        display: block;
      }
      
      .pac-fishing-pokemon.regional {
        border-color: #ff9800;
        background: rgba(255, 152, 0, 0.1);
      }
      
      .pac-fishing-pokemon.additional {
        border-color: #9c27b0;
        background: rgba(156, 39, 176, 0.1);
      }
      
      .pac-fishing-source-legend {
        display: flex;
        gap: 12px;
        margin-top: 8px;
        font-size: 9px;
        color: #888;
      }
      
      .pac-fishing-source-legend span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .pac-fishing-source-legend .dot {
        width: 8px;
        height: 8px;
        border-radius: 2px;
      }
      
      .pac-fishing-source-legend .dot.base {
        background: #ddd;
      }
      
      .pac-fishing-source-legend .dot.regional {
        background: #ff9800;
      }
      
      .pac-fishing-source-legend .dot.additional {
        background: #9c27b0;
      }
      
      .pac-fishing-note {
        margin-top: 12px;
        padding: 8px 10px;
        background: rgba(100, 181, 246, 0.15);
        border: 1px solid rgba(100, 181, 246, 0.3);
        border-radius: 4px;
        font-size: 10px;
        color: #1976d2;
        text-align: center;
      }

      /* Top Pokemon Grid */
      .pac-top-pokemon-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      
      .pac-top-pokemon-card {
        background: #f5f5f5;
        border-radius: 6px;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .pac-top-pokemon-name {
        font-size: 11px;
        font-weight: 600;
        color: #1a1a2e;
      }
      
      .pac-top-pokemon-stats {
        text-align: right;
        font-size: 10px;
      }
      
      .pac-top-pokemon-seen {
        color: #64b5f6;
        font-weight: 600;
      }
      
      .pac-top-pokemon-diff {
        font-weight: 700;
      }
      
      .pac-top-pokemon-diff.positive {
        color: #4caf50;
      }
      
      .pac-top-pokemon-diff.negative {
        color: #f44336;
      }
      
      /* Wild Pokemon Section */
      .pac-wild-section {
        padding: 8px 0;
      }
      
      .pac-wild-total {
        font-size: 12px;
        color: #666;
        margin-bottom: 10px;
        padding: 8px 12px;
        background: #f0f7f0;
        border-radius: 6px;
        border-left: 3px solid #4caf50;
      }
      
      .pac-wild-total strong {
        color: #2e7d32;
        font-size: 14px;
      }
      
      .pac-wild-pokemon-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
      
      .pac-wild-pokemon-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 10px;
        background: #f5f5f5;
        border-radius: 6px;
        border-left: 3px solid #9e9e9e;
      }
      
      .pac-wild-pokemon-card.common { border-left-color: #78909c; }
      .pac-wild-pokemon-card.uncommon { border-left-color: #66bb6a; }
      .pac-wild-pokemon-card.rare { border-left-color: #42a5f5; }
      .pac-wild-pokemon-card.epic { border-left-color: #ab47bc; }
      .pac-wild-pokemon-card.ultra { border-left-color: #ffa726; }
      
      .pac-wild-pokemon-name {
        font-size: 10px;
        font-weight: 600;
        color: #333;
        text-transform: capitalize;
      }
      
      .pac-wild-pokemon-count {
        font-size: 11px;
        font-weight: 700;
        color: #4caf50;
      }
      
      .pac-wild-more {
        font-size: 10px;
        color: #999;
        text-align: center;
        margin-top: 6px;
        font-style: italic;
      }
      
      /* Ditto Section */
      .pac-ditto-section {
        padding: 8px 0;
      }
      
      .pac-ditto-stats-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 16px;
        background: linear-gradient(135deg, #e8d5f2 0%, #d4b8e8 100%);
        border-radius: 8px;
        border-left: 4px solid #9c27b0;
      }
      
      .pac-ditto-count {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .pac-ditto-number {
        font-size: 28px;
        font-weight: 800;
        color: #7b1fa2;
        line-height: 1;
      }
      
      .pac-ditto-label {
        font-size: 10px;
        color: #9c27b0;
        font-weight: 600;
      }
      
      .pac-ditto-rate {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 16px;
        border-left: 1px solid rgba(156, 39, 176, 0.3);
      }
      
      .pac-ditto-rate-value {
        font-size: 18px;
        font-weight: 700;
        color: #7b1fa2;
      }
      
      .pac-ditto-rate-label {
        font-size: 9px;
        color: #9c27b0;
      }
      
      .pac-ditto-message {
        margin-left: auto;
        font-size: 12px;
        font-weight: 600;
        color: #7b1fa2;
      }
      
      /* EULA Modal */
      #pac-eula-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.95) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        backdrop-filter: blur(10px);
      }
      
      #pac-eula-modal {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-radius: 12px;
        max-width: 600px;
        max-height: 80vh;
        padding: 24px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        color: #e9e9e9;
        overflow-y: auto;
        position: relative;
        z-index: 2147483647 !important;
      }
      
      .pac-eula-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #64b5f6;
        text-align: center;
      }
      
      .pac-eula-content {
        font-size: 13px;
        line-height: 1.6;
        margin-bottom: 20px;
        color: #ccc;
      }
      
      .pac-eula-section {
        margin-bottom: 16px;
      }
      
      .pac-eula-section-title {
        font-size: 14px;
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 8px;
      }
      
      .pac-eula-highlight {
        background: rgba(76, 175, 80, 0.2);
        padding: 12px;
        border-left: 3px solid #4caf50;
        border-radius: 4px;
        margin: 12px 0;
      }
      
      .pac-eula-warning {
        background: rgba(255, 152, 0, 0.2);
        padding: 12px;
        border-left: 3px solid #ff9800;
        border-radius: 4px;
        margin: 12px 0;
      }
      
      .pac-eula-checkboxes {
        margin: 20px 0;
      }
      
      .pac-eula-checkbox-row {
        display: flex !important;
        align-items: flex-start !important;
        gap: 12px !important;
        margin-bottom: 12px !important;
        padding: 12px !important;
        background: rgba(255,255,255,0.03) !important;
        border-radius: 6px !important;
        cursor: pointer !important;
      }
      
      .pac-eula-custom-checkbox {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
        background: #000 !important;
        border: 2px solid #4caf50 !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        position: relative !important;
        transition: all 0.2s !important;
        flex-shrink: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .pac-eula-custom-checkbox:hover {
        border-color: #66bb6a !important;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.4) !important;
      }
      
      .pac-eula-custom-checkbox.checked {
        background: #4caf50 !important;
        border-color: #66bb6a !important;
      }
      
      .pac-eula-custom-checkbox.checked::after {
        content: '✓' !important;
        color: #fff !important;
        font-size: 24px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-shadow: 
          -1px -1px 0 #2196f3,
          1px -1px 0 #2196f3,
          -1px 1px 0 #2196f3,
          1px 1px 0 #2196f3,
          0 0 6px #2196f3 !important;
      }
      
      .pac-eula-checkbox-row label {
        flex: 1;
        cursor: pointer;
        font-size: 13px;
        line-height: 1.5;
      }
      
      .pac-eula-button {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        border: none;
        border-radius: 8px;
        color: white;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-eula-button:disabled {
        background: #444;
        cursor: not-allowed;
        opacity: 0.5;
      }
      
      .pac-eula-button:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
      }
      
      /* Help Modal */
      #pac-help-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.85) !important;
        z-index: 2147483646 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        backdrop-filter: blur(5px);
      }
      
      #pac-help-modal {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #0f3460;
        border-radius: 12px;
        width: 90%;
        max-width: 700px;
        max-height: 85vh;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        color: #e9e9e9;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .pac-help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        background: linear-gradient(90deg, #0f3460 0%, #533483 100%);
      }
      
      .pac-help-title {
        font-size: 18px;
        font-weight: 600;
        color: #fff;
      }
      
      .pac-help-close {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        font-size: 20px;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .pac-help-close:hover {
        background: rgba(255,255,255,0.2);
      }
      
      .pac-help-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        scrollbar-width: thin;
        scrollbar-color: #533483 transparent;
      }
      
      .pac-help-content::-webkit-scrollbar {
        width: 6px;
      }
      
      .pac-help-content::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .pac-help-content::-webkit-scrollbar-thumb {
        background: #533483;
        border-radius: 3px;
      }
      
      .pac-help-section {
        margin-bottom: 24px;
      }
      
      .pac-help-section:last-child {
        margin-bottom: 0;
      }
      
      .pac-help-section-title {
        font-size: 15px;
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .pac-help-section-title .emoji {
        font-size: 18px;
      }
      
      .pac-help-feature {
        background: rgba(255,255,255,0.05);
        border-radius: 8px;
        padding: 12px 14px;
        margin-bottom: 10px;
      }
      
      .pac-help-feature:last-child {
        margin-bottom: 0;
      }
      
      .pac-help-feature-title {
        font-size: 13px;
        font-weight: 600;
        color: #4caf50;
        margin-bottom: 6px;
      }
      
      .pac-help-feature-desc {
        font-size: 12px;
        color: #aaa;
        line-height: 1.5;
      }
      
      .pac-help-tip {
        background: rgba(100, 181, 246, 0.15);
        border-left: 3px solid #64b5f6;
        padding: 10px 12px;
        border-radius: 0 6px 6px 0;
        margin-bottom: 10px;
      }
      
      .pac-help-tip-title {
        font-size: 12px;
        font-weight: 600;
        color: #64b5f6;
        margin-bottom: 4px;
      }
      
      .pac-help-tip-text {
        font-size: 11px;
        color: #aaa;
        line-height: 1.4;
      }
      
      .pac-help-shortcut {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255,255,255,0.05);
        border-radius: 6px;
        margin-bottom: 6px;
      }
      
      .pac-help-shortcut-key {
        background: #333;
        padding: 4px 10px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        color: #64b5f6;
        border: 1px solid #555;
      }
      
      .pac-help-shortcut-desc {
        font-size: 12px;
        color: #ccc;
      }
      
      .pac-help-version {
        text-align: center;
        padding: 16px;
        border-top: 1px solid rgba(255,255,255,0.1);
        font-size: 11px;
        color: #666;
      }
      
      .pac-help-version a {
        color: #64b5f6;
        text-decoration: none;
      }
      
      .pac-help-version a:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);

    // Create overlay HTML
    const overlay = document.createElement('div');
    overlay.id = 'pac-calc-overlay';
    overlay.innerHTML = `
      <!-- Resize Handles -->
      <div class="pac-resize-handle pac-resize-nw" data-resize="nw"></div>
      <div class="pac-resize-handle pac-resize-ne" data-resize="ne"></div>
      <div class="pac-resize-handle pac-resize-sw" data-resize="sw"></div>
      <div class="pac-resize-handle pac-resize-se" data-resize="se"></div>
      <div class="pac-resize-handle pac-resize-n" data-resize="n"></div>
      <div class="pac-resize-handle pac-resize-s" data-resize="s"></div>
      <div class="pac-resize-handle pac-resize-w" data-resize="w"></div>
      <div class="pac-resize-handle pac-resize-e" data-resize="e"></div>
      
      <div id="pac-calc-header">
        <div id="pac-calc-title">
          <span class="pac-status-dot" id="pacStatusDot"></span>
          <span>PAC Live Data v3.2.2</span>
        </div>
        <div id="pac-calc-controls">
          <button class="pac-ctrl-btn" id="pacHelpBtn" title="Help & Features" style="font-size: 10px; padding: 2px 6px;">?</button>
          <button class="pac-ctrl-btn" id="pacExpBtn" title="Experimental Features" style="font-size: 10px; padding: 2px 6px;">EXP</button>
          <button class="pac-ctrl-btn" id="pacClearBtn" title="Clear All" style="font-size: 10px; padding: 2px 6px;">CLR</button>
          <button class="pac-ctrl-btn" id="pacMinBtn" title="Minimize">−</button>
          <button class="pac-ctrl-btn" id="pacCloseBtn" title="Close">×</button>
        </div>
      </div>
      
      <div id="pac-calc-body">
        <div class="pac-section">
          <div class="pac-section-title">🎯 Target</div>
          <div class="pac-row">
            <div class="pac-field">
              <label>Level</label>
              <select id="pacLevel">
                ${[1,2,3,4,5,6,7,8,9].map(l => `<option value="${l}" ${l===7?'selected':''}>Lv ${l}</option>`).join('')}
              </select>
            </div>
            <div class="pac-field">
              <label>Rarity</label>
              <select id="pacRarity">
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare" selected>Rare</option>
                <option value="epic">Epic</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>
            <div class="pac-field">
              <label>Evo</label>
              <select id="pacEvo">
                <option value="twoStar">2★</option>
                <option value="threeStar" selected>3★</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="pac-section">
          <div class="pac-section-title">📊 Pool State</div>
          <div class="pac-row">
            <div class="pac-field">
              <label>Owned</label>
              <input type="number" id="pacOwned" value="0" min="0">
            </div>
            <div class="pac-field">
              <label>Scouted</label>
              <input type="number" id="pacScouted" value="0" min="0">
            </div>
          </div>
          <div class="pac-row">
            <div class="pac-field">
              <label>Target Pokemon (Auto-Scout)</label>
              <div class="pac-pokemon-selector">
                <input 
                  type="text" 
                  id="pacTargetPokemon" 
                  class="pac-autocomplete-input" 
                  placeholder="Type to search..."
                  autocomplete="off"
                >
                <div id="pacRarityError" class="hidden"></div>
                <div id="pacPortalWarning" class="pac-portal-warning hidden" style="color: #ff9800; font-size: 11px; margin-top: 4px; padding: 4px 8px; background: rgba(255, 152, 0, 0.15); border-radius: 4px; display: none;"></div>
              
              <!-- Evolution Family Display (v2.5.0) -->
              <div id="pacEvolutionFamily" class="pac-evolution-family hidden">
                <div class="pac-family-title">Evolution Family</div>
                <div id="pacFamilyBreakdown" class="pac-family-breakdown">
                  <!-- Dynamically populated -->
                </div>
                <div class="pac-family-total">
                  Total: <span id="pacFamilyTotal">0</span> copies
                </div>
              </div>
</div>
            </div>
          </div>
          <div class="pac-toggle-row">
            <label class="pac-toggle">
              <input type="checkbox" id="pacDitto" disabled>
              <span>Ditto (Stage 6+)</span>
            </label>
            <label class="pac-toggle">
              <input type="checkbox" id="pacAutoScout" checked>
              <span>Auto-Scout</span>
            </label>
          </div>
          
          <!-- Live Tracking Controls -->
          <div class="pac-row">
            <div class="pac-field">
              <label>Your In-Game Name (for flash alerts)</label>
              <input type="text" id="pacPlayerName" placeholder="Enter your name..." autocomplete="off">
            </div>
          </div>
          
          <div class="pac-live-controls">
            <button class="pac-live-toggle" id="pacLiveToggle">
              <span class="pac-live-status" id="pacLiveStatus">OFF</span>
              <span>Live Tracking</span>
            </button>
            <select id="pacPollSpeed" class="pac-speed-select">
              <option value="10">Ultra Giga Computer God (10ms)</option>
              <option value="30">Very Fast (30ms)</option>
              <option value="100">Fast (100ms)</option>
              <option value="350" selected>Normal (350ms)</option>
              <option value="500">Slow (500ms)</option>
              <option value="1000">Slower (1s)</option>
            </select>
          </div>
          
          <div class="pac-row">
            <button id="pacNewGame" class="pac-new-game-btn">
              🔄 NEW GAME - Reinject Extractor
            </button>
          </div>
          
          <div class="pac-live-indicator" id="pacLiveIndicator" style="display: none;">
            <span id="pacStageDisplay" class="pac-stage-display">Stage —</span>
            <span class="pac-live-divider">|</span>
            <span>🟢 Live:</span>
            <span id="pacLiveCount">0</span>
            <span>units tracked</span>
          </div>
          
          <!-- Game Detection Display -->
          <div id="pacDetectionPanel" class="pac-detection-panel" style="margin-top: 12px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px; display: none;">
            <div style="margin-bottom: 8px;">
              <span style="font-weight: 600; color: #64b5f6;">🌍 Regional Pokemon</span>
              <span id="pacRegionalStatus" style="font-size: 11px; color: #888; margin-left: 8px;">(Hover icon to detect)</span>
            </div>
            <div id="pacRegionalList" style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px; min-height: 24px;">
              <span style="color: #666; font-size: 11px;">Not detected yet</span>
            </div>
            
            <div style="margin-bottom: 8px;">
              <span style="font-weight: 600; color: #64b5f6;">🎯 Add Picks</span>
              <span id="pacAddPicksStatus" style="font-size: 11px; color: #888; margin-left: 8px;">(Hover icon to detect)</span>
            </div>
            <div id="pacAddPicksList" style="display: flex; flex-wrap: wrap; gap: 4px; min-height: 24px;">
              <span style="color: #666; font-size: 11px;">Not detected yet</span>
            </div>
            
            <button id="pacResetDetection" style="margin-top: 8px; padding: 4px 12px; background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); border-radius: 6px; color: #ef4444; font-size: 11px; cursor: pointer;">🔄 Redetect</button>
            <div style="margin-top: 6px; font-size: 10px; color: #666;">Click a Pokemon to confirm if multiple matches shown</div>
          </div>
        </div>
        
        <div class="pac-collapsible" id="pacWildSection">
          <button class="pac-collapse-btn">🌿 Wild Mechanics</button>
          <div class="pac-collapse-content">
            <div class="pac-toggle-row" style="margin-top: 8px;">
              <label class="pac-toggle">
                <input type="checkbox" id="pacTargetWild">
                <span>Target is Wild</span>
              </label>
              <label class="pac-toggle">
                <input type="checkbox" id="pacPVE">
                <span>PvE Round</span>
              </label>
            </div>
            <div class="pac-row" style="margin-top: 8px;">
              <div class="pac-field">
                <label>Wild Stars <span style="font-size: 10px; opacity: 0.7;">(Auto)</span></label>
                <input type="number" id="pacWildOwned" value="0" min="0">
              </div>
              <div class="pac-field">
                <label>Scouted Copies <span style="font-size: 10px; opacity: 0.7;">(Auto)</span></label>
                <input type="number" id="pacWildScouted" value="0" min="0">
              </div>
            </div>
          </div>
        </div>
        
        <div class="pac-results">
          <div class="pac-result-row">
            <span class="pac-result-label">Per Refresh:</span>
            <span class="pac-result-value" id="pacPerRefresh">0.00%</span>
          </div>
          <div class="pac-confidence-control">
            <label for="pacConfidenceSlider">
              <span>Confidence</span>
              <span id="pacConfidenceValue">75</span>%
            </label>
            <input type="range" id="pacConfidenceSlider" min="50" max="99" value="75" step="1">
          </div>
          <div class="pac-result-row">
            <span class="pac-result-label" id="pacConfidenceLabel">75% Confidence:</span>
            <span class="pac-result-value" id="pacConfidence">0 rolls</span>
          </div>
          <div class="pac-result-row">
            <span class="pac-result-label" id="pacConfidenceGoldLabel">Gold (75%):</span>
            <span class="pac-result-value" id="pacGoldConfidence">0g</span>
          </div>
        </div>
        
        <div id="pacStatusWild" class="pac-status-msg"></div>
        <div id="pacStatusPool" class="pac-status-msg"></div>
      </div>
      
      <div id="pac-calc-footer" class="pac-footer">
        <span>Pool: <span id="pacPoolInfo">0/0</span></span>
        <span>Rate: <span id="pacRateInfo">0</span>%</span>
      </div>
      
      <!-- Team Tracker Side Panel -->
      <div id="pac-team-panel" class="pac-team-panel">
        <button id="pacTeamToggle" class="pac-team-toggle" title="Team Tracker">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-team-content">
          <div class="pac-team-header">
            <h3>🎯 Team Tracker</h3>
            <button id="pacTeamClose" class="pac-team-close">×</button>
          </div>
          <div id="pacSynergyBar" class="pac-synergy-bar">
            <!-- Synergy buttons will be populated dynamically -->
          </div>
          <div id="pacMonoPanel" class="pac-mono-panel">
            <div class="pac-mono-header" id="pacMonoHeader">
              <div class="pac-mono-header-title">
                <span>🎯 MONO TYPE</span>
              </div>
              <span class="pac-mono-arrow">▶</span>
            </div>
            <div class="pac-mono-content">
              <div class="pac-mono-grid" id="pacMonoGrid">
                <!-- Type buttons populated dynamically -->
              </div>
              <div id="pacMonoStatus" class="pac-mono-status">Select a type to block others</div>
              <button id="pacMonoClear" class="pac-mono-clear" style="display: none;">✕ Clear Mono-Type</button>
              <div class="pac-mono-wheel-section">
                <button id="pacMonoSpinBtn" class="pac-mono-spin-btn">🎰 Spin</button>
                <div class="pac-mono-wheel-display">
                  <span id="pacMonoWheelType" class="pac-mono-wheel-type" style="background: #666; color: #fff;">???</span>
                </div>
              </div>
              <div class="pac-mono-wheel-label">or spin the wheel for a random type!</div>
            </div>
            <div id="pacDraftPanel" class="pac-draft-panel">
              <div class="pac-draft-header">
                <span class="pac-draft-header-title">🎲 RANDOM DRAFT</span>
                <button id="pacDraftToggle" class="pac-draft-toggle">Start</button>
              </div>
              <div id="pacDraftStatus" class="pac-draft-status">
                Spinning...
              </div>
            </div>
            <div id="pacCopycatPanel" class="pac-copycat-panel">
              <div class="pac-copycat-header">
                <span class="pac-copycat-header-title">🐱 COPYCAT</span>
                <button id="pacCopycatToggle" class="pac-copycat-toggle">Start</button>
              </div>
              <div id="pacCopycatStatus" class="pac-copycat-status">
                Only contested Pokemon allowed!
              </div>
            </div>
            <div id="pacMlgPanel" class="pac-mlg-panel">
              <div class="pac-mlg-header">
                <span class="pac-mlg-header-title">🔥 MLG MODE</span>
                <button id="pacMlgToggle" class="pac-mlg-toggle">Start</button>
              </div>
              <div id="pacMlgStatus" class="pac-mlg-status">
                360 NO SCOPE 🎯
              </div>
            </div>
          </div>
          <div id="pacTeamList" class="pac-team-list">
            <!-- Team targets will be added here -->
          </div>
          <div class="pac-team-combined">
            <div class="pac-team-combined-title">Combined Probability</div>
            <div class="pac-team-combined-stats">
              <div class="pac-team-stat">
                <span class="pac-team-stat-label">Hit any:</span>
                <span id="pacTeamCombinedProb" class="pac-team-stat-value">0%</span>
              </div>
              <div class="pac-team-stat">
                <span class="pac-team-stat-label">Expected:</span>
                <span id="pacTeamCombinedRolls" class="pac-team-stat-value">0 rolls</span>
              </div>
            </div>
          </div>
          <div class="pac-team-add-section">
            <input type="text" id="pacTeamAddInput" placeholder="Type Pokemon name..." autocomplete="off" class="pac-team-input">
            <button id="pacTeamAddBtn" class="pac-team-add-btn">Add</button>
          </div>
        </div>
      </div>
      
      <!-- Counter Intelligence Side Panel -->
      <div id="pac-current-panel" class="pac-team-panel">
        <button id="pacCurrentToggle" class="pac-team-toggle pac-current-toggle" title="Counter Intelligence" style="top: calc(50% - 60px);">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-team-content">
          <div class="pac-team-header">
            <h3>🕵️ Counter Intelligence</h3>
            <button id="pacCurrentClose" class="pac-team-close">×</button>
          </div>
          <div id="pacIntelPlayers" class="pac-intel-players">
            <div class="pac-intel-empty">Waiting for game data...</div>
          </div>
        </div>
      </div>
      
      <!-- Settings & Accessibility Side Panel -->
      <div id="pac-settings-panel" class="pac-team-panel">
        <button id="pacSettingsToggle" class="pac-team-toggle pac-settings-toggle" title="Customization & Accessibility" style="top: calc(50% + 60px);">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-settings-content">
          <div class="pac-team-header">
            <h3>⚙️ Customization</h3>
            <button id="pacSettingsClose" class="pac-team-close">×</button>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">🎨 Colors</div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Background</span>
              <input type="color" id="pacSettingsBgColor" class="pac-settings-color-input" value="#1a1a2e">
            </div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Text</span>
              <input type="color" id="pacSettingsTextColor" class="pac-settings-color-input" value="#e0e0e0">
            </div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Buttons/Inputs</span>
              <input type="color" id="pacSettingsAccentColor" class="pac-settings-color-input" value="#4caf50">
            </div>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">✨ Flash Alert Colors</div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Target Flash</span>
              <input type="color" id="pacSettingsTargetFlash" class="pac-settings-color-input" value="#fbbf24">
            </div>
            <div class="pac-settings-row">
              <span class="pac-settings-label">Team Flash</span>
              <input type="color" id="pacSettingsTeamFlash" class="pac-settings-color-input" value="#FF1493">
            </div>
            <div class="pac-settings-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
              <span class="pac-settings-label">Flash Speed</span>
              <div class="pac-settings-slider-row">
                <input type="range" id="pacSettingsFlashSpeed" class="pac-settings-slider" min="100" max="1000" step="50" value="250">
                <span id="pacSettingsFlashSpeedValue" class="pac-settings-value">250ms</span>
              </div>
            </div>
            <div class="pac-settings-row" style="margin-top: 8px;">
              <span class="pac-settings-label">⚠️ Disable Flashing (Epilepsy)</span>
              <label class="pac-settings-switch">
                <input type="checkbox" id="pacSettingsDisableFlash">
                <span class="pac-settings-switch-slider"></span>
              </label>
            </div>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">📝 Accessibility</div>
            <div class="pac-settings-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
              <span class="pac-settings-label">Font Size</span>
              <div class="pac-settings-slider-row">
                <input type="range" id="pacSettingsFontSize" class="pac-settings-slider" min="10" max="32" step="1" value="12">
                <span id="pacSettingsFontSizeValue" class="pac-settings-value">12px</span>
              </div>
            </div>
          </div>
          
          <div class="pac-settings-section">
            <div class="pac-settings-section-title">👁️ Preview</div>
            <div class="pac-settings-preview" id="pacSettingsPreview">
              <div class="pac-settings-preview-text">Sample Text</div>
              <div class="pac-settings-preview-flashes">
                <span class="pac-settings-flash-preview target" id="pacPreviewTargetFlash">Target</span>
                <span class="pac-settings-flash-preview team" id="pacPreviewTeamFlash">Team</span>
              </div>
            </div>
          </div>
          
          <button id="pacSettingsReset" class="pac-settings-btn reset">↺ Reset to Defaults</button>
        </div>
      </div>
      
      <!-- Shop History / Roll Luck Tracker Side Panel -->
      <div id="pac-history-panel" class="pac-team-panel">
        <button id="pacHistoryToggle" class="pac-team-toggle pac-history-toggle" title="Shop History / Roll Luck" style="top: calc(50% + 120px);">
          <span class="pac-team-arrow">→</span>
        </button>
        <div class="pac-history-content">
          <div class="pac-team-header">
            <h3>🎰 Roll Luck</h3>
            <button id="pacHistoryClose" class="pac-team-close">×</button>
          </div>
          
          <!-- Tab Buttons -->
          <div class="pac-analytics-tabs">
            <button class="pac-analytics-tab active" data-tab="live">📊 Live</button>
            <button class="pac-analytics-tab analytics-btn" data-tab="analytics">📈 Analytics</button>
            <button class="pac-analytics-tab fishing-btn" data-tab="fishing">🎣 Fishing</button>
          </div>
          
          <!-- Live Tab Content -->
          <div class="pac-analytics-content active" id="pacLiveTab">
            <div class="pac-history-disclaimer">
              ⚠️ Best accuracy at 30ms polling
            </div>
            
            <div class="pac-history-players" id="pacHistoryPlayers">
              <div class="pac-history-empty">No rolls tracked yet.<br>Rolls are detected when Live Tracking is ON.</div>
            </div>
            
            <button id="pacHistoryClear" class="pac-settings-btn reset" style="margin-top: 12px; flex-shrink: 0;">🗑️ Clear Session</button>
          </div>
          
          <!-- Analytics Tab Content -->
          <div class="pac-analytics-content" id="pacAnalyticsTab">
            <div class="pac-analytics-disclaimer">
              ⚠️ Refreshing may miss some shop data. Data persists across sessions.
            </div>
            
            <div class="pac-analytics-panel" id="pacAnalyticsPanel">
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🎲 Overall Luck Score</div>
                <div class="pac-luck-gauge" id="pacLuckGauge">
                  <div class="pac-luck-score neutral" id="pacLuckScore">—</div>
                  <div style="flex: 1;">
                    <div class="pac-luck-gauge-bar">
                      <div class="pac-luck-gauge-marker" id="pacLuckMarker" style="left: 50%;"></div>
                    </div>
                    <div class="pac-luck-gauge-labels">
                      <span>Unlucky</span>
                      <span>Average</span>
                      <span>Lucky</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">📊 Rarity Hit Rates</div>
                <div class="pac-rarity-charts" id="pacRarityCharts">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">📈 Rolls by Level</div>
                <div class="pac-level-grid" id="pacLevelGrid">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🔥 Luckiest Pokemon</div>
                <div class="pac-top-pokemon-grid" id="pacLuckyPokemon">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">❄️ Unluckiest Pokemon</div>
                <div class="pac-top-pokemon-grid" id="pacUnluckyPokemon">
                  <!-- Filled by JS -->
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🟣 Ditto</div>
                <div class="pac-ditto-section" id="pacDittoStats">
                  <div class="pac-history-empty">No Ditto seen yet</div>
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">🌿 Wild Pokemon</div>
                <div class="pac-wild-section" id="pacWildPokemon">
                  <div class="pac-history-empty">No wild Pokemon seen yet</div>
                </div>
              </div>
              
              <div class="pac-analytics-section">
                <div class="pac-analytics-title">📝 Summary</div>
                <div class="pac-narrative" id="pacNarrativeSummary">
                  <p>No data to analyze yet. Start rolling to see your luck story!</p>
                </div>
              </div>
            </div>
            
            <button id="pacAnalyticsClear" class="pac-settings-btn reset" style="margin-top: 12px; flex-shrink: 0;">🗑️ Clear All History</button>
          </div>
          
          <!-- Fishing Tab Content -->
          <div class="pac-analytics-content" id="pacFishingTab">
            <div class="pac-fishing-disclaimer">
              ⚠️ Fishing requires a free bench slot or the catch is lost!
            </div>
            
            <div class="pac-fishing-panel">
              <div class="pac-fishing-section">
                <div class="pac-fishing-title">🎣 Rod Selection</div>
                <div class="pac-fishing-rod-select">
                  <button class="pac-rod-btn active" data-rod="none">None</button>
                  <button class="pac-rod-btn" data-rod="old">Old Rod</button>
                  <button class="pac-rod-btn" data-rod="good">Good Rod</button>
                  <button class="pac-rod-btn" data-rod="super">Super Rod</button>
                </div>
                <div class="pac-fishing-rod-info">
                  <span class="pac-rod-synergy">Water (3) → Old Rod</span>
                  <span class="pac-rod-synergy">Water (6) → Good Rod</span>
                  <span class="pac-rod-synergy">Water (9) → Super Rod</span>
                </div>
              </div>
              
              <div class="pac-fishing-section">
                <div class="pac-fishing-title">🎰 Catch Rates</div>
                <div class="pac-fishing-odds" id="pacFishingOdds">
                  <div class="pac-fishing-no-rod">Select a rod to see catch rates</div>
                </div>
              </div>
              
              <div class="pac-fishing-section">
                <div class="pac-fishing-title">🐟 Fishable Pokemon</div>
                <div class="pac-fishing-toggle-row">
                  <label class="pac-fishing-checkbox">
                    <input type="checkbox" id="pacMantykeToggle">
                    <span>Mantine/Mantyke on board <span style="color: #888; font-size: 10px;">(auto-detects)</span></span>
                  </label>
                </div>
                <div class="pac-fishing-pool" id="pacFishingPool">
                  <div class="pac-fishing-no-rod">Select a rod to see fishable Pokemon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Create autocomplete dropdown as separate floating element
    const dropdown = document.createElement('div');
    dropdown.id = 'pacAutocompleteDropdown';
    dropdown.className = 'hidden';
    document.body.appendChild(dropdown);
    
    // Create refresh blocker overlay
    const refreshBlocker = document.createElement('div');
    refreshBlocker.id = 'pac-refresh-blocker';
    refreshBlocker.innerHTML = `
      <div class="blocker-title">⚠️ TARGET FOUND ⚠️</div>
      <div class="blocker-pokemon" id="blockerPokemonName">—</div>
      <button class="blocker-dismiss" id="blockerDismiss" title="Dismiss">×</button>
    `;
    document.body.appendChild(refreshBlocker);
    
    return overlay;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DRAG FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════

  function setupDrag(overlay) {
    const header = document.getElementById('pac-calc-header');
    const footer = document.getElementById('pac-calc-footer');
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let activeHandle = null;

    function startDrag(e, handle) {
      isDragging = true;
      activeHandle = handle;
      startX = e.clientX;
      startY = e.clientY;
      const rect = overlay.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      handle.style.cursor = 'grabbing';
    }

    header.addEventListener('mousedown', (e) => startDrag(e, header));
    footer.addEventListener('mousedown', (e) => startDrag(e, footer));
    
    // Double-click header to reset size
    header.addEventListener('dblclick', (e) => {
      e.preventDefault();
      overlay.style.width = '380px';
      overlay.style.height = '';
      overlay.style.maxHeight = '';
      overlay.classList.remove('width-resized');
      savePosition();
      if (DEBUG_MODE) console.log('📐 Reset to default size');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      // Calculate new position
      let newLeft = initialX + dx;
      let newTop = initialY + dy;
      
      // Get overlay dimensions
      const rect = overlay.getBoundingClientRect();
      
      // Boundary constraints - keep at least 100px visible on screen
      const minVisible = 100;
      const maxLeft = window.innerWidth - minVisible;
      const maxTop = window.innerHeight - minVisible;
      const minLeft = minVisible - rect.width;
      const minTop = 0; // Don't allow dragging above viewport
      
      newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
      newTop = Math.max(minTop, Math.min(maxTop, newTop));
      
      overlay.style.left = newLeft + 'px';
      overlay.style.top = newTop + 'px';
      overlay.style.right = 'auto';
      
      // Update team dropdown position if it's open
      if (window.updateTeamDropdownPosition) {
        window.updateTeamDropdownPosition();
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        if (activeHandle) {
          activeHandle.style.cursor = 'move';
        }
        activeHandle = null;
        savePosition();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESIZE FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════

  function setupResize(overlay) {
    const handles = overlay.querySelectorAll('.pac-resize-handle');
    
    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    
    const MIN_WIDTH = 280;
    const MAX_WIDTH = 600;
    const MIN_HEIGHT = 200;
    const DEFAULT_WIDTH = 380;
    
    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        isResizing = true;
        currentHandle = handle.dataset.resize;
        
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = overlay.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;
        
        if (DEBUG_MODE) console.log(`📐 Resize start: ${currentHandle}`);
      });
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;
      
      // Calculate new dimensions based on handle
      switch (currentHandle) {
        case 'se':
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
          break;
        case 'sw':
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
          newLeft = startLeft + dx;
          break;
        case 'ne':
          newWidth = startWidth + dx;
          newHeight = startHeight - dy;
          newTop = startTop + dy;
          break;
        case 'nw':
          newWidth = startWidth - dx;
          newHeight = startHeight - dy;
          newLeft = startLeft + dx;
          newTop = startTop + dy;
          break;
        case 'n':
          newHeight = startHeight - dy;
          newTop = startTop + dy;
          break;
        case 's':
          newHeight = startHeight + dy;
          break;
        case 'e':
          newWidth = startWidth + dx;
          break;
        case 'w':
          newWidth = startWidth - dx;
          newLeft = startLeft + dx;
          break;
      }
      
      // Apply constraints
      newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      newHeight = Math.max(MIN_HEIGHT, newHeight);
      
      // Recalculate left/top if width was constrained
      if (currentHandle.includes('w')) {
        newLeft = startLeft + startWidth - newWidth;
      }
      if (currentHandle.includes('n')) {
        newTop = startTop + startHeight - newHeight;
      }
      
      // Viewport bounds
      if (newTop < 0) newTop = 0;
      if (newLeft < 10) newLeft = 10;
      
      // Apply
      overlay.style.width = newWidth + 'px';
      overlay.style.height = newHeight + 'px';
      overlay.style.maxHeight = 'none';
      overlay.style.left = newLeft + 'px';
      overlay.style.top = newTop + 'px';
      overlay.style.right = 'auto';
      
      // Toggle side panels based on width
      if (Math.abs(newWidth - DEFAULT_WIDTH) > 10) {
        overlay.classList.add('width-resized');
      } else {
        overlay.classList.remove('width-resized');
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        currentHandle = null;
        overlay.style.maxHeight = '';
        savePosition();
        if (DEBUG_MODE) console.log('📐 Resize complete');
      }
    });
    
    if (DEBUG_MODE) console.log('📐 Resize initialized');
  }

  function savePosition() {
    const overlay = document.getElementById('pac-calc-overlay');
    const rect = overlay.getBoundingClientRect();
    localStorage.setItem('pac-calc-position', JSON.stringify({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    }));
  }

  function loadPosition() {
    const saved = localStorage.getItem('pac-calc-position');
    if (saved) {
      const pos = JSON.parse(saved);
      const overlay = document.getElementById('pac-calc-overlay');
      overlay.style.left = pos.left + 'px';
      overlay.style.top = pos.top + 'px';
      overlay.style.right = 'auto';
      
      // Load saved dimensions
      if (pos.width && pos.width >= 280 && pos.width <= 600) {
        overlay.style.width = pos.width + 'px';
        // Hide side panels if not at default width
        if (Math.abs(pos.width - 380) > 10) {
          overlay.classList.add('width-resized');
        }
      }
      if (pos.height && pos.height >= 200) {
        overlay.style.height = pos.height + 'px';
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COLLAPSIBLE SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  function setupCollapsibles() {
    document.querySelectorAll('.pac-collapse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        content.classList.toggle('expanded');
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI BINDINGS
  // ═══════════════════════════════════════════════════════════════════════════

  function bindUI() {
    // Minimize/Close buttons
    document.getElementById('pacMinBtn').addEventListener('click', () => {
      const body = document.getElementById('pac-calc-body');
      const overlay = document.getElementById('pac-calc-overlay');
      isMinimized = !isMinimized;
      body.classList.toggle('minimized');
      overlay.classList.toggle('minimized');
      document.getElementById('pacMinBtn').textContent = isMinimized ? '+' : '−';
    });

    document.getElementById('pacCloseBtn').addEventListener('click', () => {
      document.getElementById('pac-calc-overlay').style.display = 'none';
    });

    // Clear ALL button - reset everything
    document.getElementById('pacClearBtn').addEventListener('click', () => {
      if (DEBUG_MODE) console.log('🧹 CLEAR ALL - Wiping all state...');
      
      // Clear main target
      state.targetPokemon = '';
      state.targetPokemonDisplayName = '';
      state.targetPokemonRarity = null;
      state.evolutionFamily = [];
      state.targetIsWild = false;
      state.copiesTaken = 0;
      state.copiesOwned = 0;
      document.getElementById('pacTargetPokemon').value = '';
      document.getElementById('pacScouted').value = 0;
      document.getElementById('pacTargetWild').checked = false;
      const portalWarning = document.getElementById('pacPortalWarning');
      if (portalWarning) portalWarning.style.display = 'none';
      
      // Clear evolution family display
      const familySection = document.getElementById('pacEvolutionFamily');
      if (familySection) familySection.classList.add('hidden');
      const familyBreakdown = document.getElementById('pacFamilyBreakdown');
      if (familyBreakdown) familyBreakdown.innerHTML = '';
      const familyTotal = document.getElementById('pacFamilyTotal');
      if (familyTotal) familyTotal.textContent = '0';
      
      // Clear team targets
      state.teamTargets = [];
      localStorage.removeItem('pac_teamTargets');
      updateTeamDisplay();
      
      // Clear detection
      resetGameDetection();
      
      // Clear wild tracking
      state.wildUnitsOwned = 0;
      state.wildUnitsTaken = { common: 0, uncommon: 0, rare: 0, epic: 0, ultra: 0 };
      document.getElementById('pacWildOwned').value = 0;
      document.getElementById('pacWildScouted').value = 0;
      
      // Reset Ditto (disabled until stage 6)
      state.dittoEnabled = false;
      const dittoCheckbox = document.getElementById('pacDitto');
      if (dittoCheckbox) dittoCheckbox.checked = false;
      
      // Reset mono-type mode
      if (state.monoTypeEnabled) {
        clearMonoType();
      }
      
      // Reset random draft mode
      if (state.randomDraftEnabled) {
        stopRandomDraft();
      }
      
      // Reset copycat mode
      if (state.copycatEnabled) {
        stopCopycat();
      }
      
      // Reset MLG mode
      if (state.mlgModeEnabled) {
        stopMlgMode();
      }
      
      // Update display
      updateDisplay();
      
      if (DEBUG_MODE) console.log('✅ All state cleared');
    });

    // Help button - open help modal
    document.getElementById('pacHelpBtn').addEventListener('click', () => {
      openHelpModal();
    });

    // New Game button - reinject extractor for next match
    document.getElementById('pacNewGame').addEventListener('click', () => {
      if (DEBUG_MODE) console.log('🔄 NEW GAME - Wiping state and reinjecting...');
      
      // Send reset to extractor to clear cached room
      window.postMessage({ type: 'PAC_RESET' }, '*');
      
      // Clear all cached data
      lastPoolData = null;
      lastCurrentHash = '';
      lastTeamFingerprint = '';
      expandedIntelPlayers.clear();
      isConnected = false;
      
      // Reset main calculator scouted values
      state.copiesTaken = 0;
      document.getElementById('pacScouted').value = 0;
      
      // Reset wild units owned (will be auto-recalculated)
      state.wildUnitsOwned = 0;
      const wildOwnedInput = document.getElementById('pacWildOwned');
      if (wildOwnedInput) wildOwnedInput.value = 0;
      
      // Reset team target copiesTaken (they'll recalculate from fresh data)
      state.teamTargets.forEach(target => {
        target.copiesTaken = 0;
      });
      
      // Clear Counter Intelligence panel
      const intelContainer = document.getElementById('pacIntelPlayers');
      if (intelContainer) {
        intelContainer.innerHTML = '<div class="pac-intel-empty">Waiting for game data...</div>';
      }
      
      // Clear evolution family display
      const familySection = document.getElementById('pacEvolutionFamily');
      if (familySection) {
        familySection.classList.add('hidden');
      }
      const familyBreakdown = document.getElementById('pacFamilyBreakdown');
      if (familyBreakdown) {
        familyBreakdown.innerHTML = '';
      }
      const familyTotal = document.getElementById('pacFamilyTotal');
      if (familyTotal) {
        familyTotal.textContent = '0';
      }
      
      // Reset connection indicator
      document.getElementById('pacStatusDot').classList.remove('connected');
      document.getElementById('pacLiveIndicator').style.display = 'none';
      
      // Reset stage tracking
      state.currentStage = null;
      state.pveRoundEnabled = false;
      const pveCheckbox = document.getElementById('pacPVE');
      if (pveCheckbox) pveCheckbox.checked = false;
      const stageDisplay = document.getElementById('pacStageDisplay');
      if (stageDisplay) {
        stageDisplay.textContent = 'Stage —';
        stageDisplay.classList.remove('pve');
      }
      
      // Reset Ditto (disabled until stage 6)
      state.dittoEnabled = false;
      const dittoCheckboxNew = document.getElementById('pacDitto');
      if (dittoCheckboxNew) dittoCheckboxNew.checked = false;
      
      // Reset mono-type mode
      if (state.monoTypeEnabled) {
        clearMonoType();
      }
      
      // Reset random draft mode
      if (state.randomDraftEnabled) {
        stopRandomDraft();
      }
      
      // Reset copycat mode
      if (state.copycatEnabled) {
        stopCopycat();
      }
      
      // Reset MLG mode
      if (state.mlgModeEnabled) {
        stopMlgMode();
      }
      
      // Clear flash states
      const overlay = document.getElementById('pac-calc-overlay');
      const teamPanel = document.getElementById('pac-team-panel');
      overlay.classList.remove('target-in-shop', 'team-target-in-shop');
      if (teamPanel) teamPanel.classList.remove('team-target-in-shop');
      
      // Clear target highlighters
      clearTargetHighlighters();
      
      // Reset shop slot mapping for highlighting
      state.previousPlayerShop = null;
      state.shopSlotMapping = [];
      
      // Reset portal/regional detection for new game
      resetGameDetection();
      
      // Hide refresh blocker if showing and clear dismissed tracker
      hideRefreshBlocker();
      state.refreshBlockerDismissed = null;
      
      // Update team display (will show 0 values)
      updateTeamDisplay();
      
      // Reinject extractor
      injectExtractor();
      
      showNotification('Game reset! Extractor reinjected.', 'success');
    });

    // Inputs
    const inputs = {
      'pacLevel': 'level',
      'pacRarity': 'targetRarity',
      'pacEvo': 'targetEvo',
      'pacOwned': 'copiesOwned',
      'pacScouted': 'copiesTaken',
      'pacWildOwned': 'wildUnitsOwned'
      // 'pacWildScouted' removed - now per-rarity auto-tracked
    };

    Object.entries(inputs).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        // Use both 'input' (real-time) and 'change' (on blur) for best responsiveness
        const handleInputChange = (e) => {
          const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
          state[key] = value;
          updateDisplay();
          // Re-render fishing tab if visible (wild stars affect Remoraid chance)
          if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
            renderFishingTab();
          }
        };
        el.addEventListener('input', handleInputChange);
        el.addEventListener('change', handleInputChange);
      }
    });

    // Checkboxes
    const checkboxes = {
      'pacDitto': 'dittoEnabled',
      'pacAutoScout': 'autoScout',
      'pacTargetWild': 'targetIsWild',
      'pacPVE': 'pveRoundEnabled'
    };

    Object.entries(checkboxes).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          state[key] = e.target.checked;
          updateDisplay();
          // Re-render fishing tab if visible (PVE affects wild boost)
          if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
            renderFishingTab();
          }
        });
      }
    });

    // Confidence slider
    const confidenceSlider = document.getElementById('pacConfidenceSlider');
    const confidenceValue = document.getElementById('pacConfidenceValue');
    const confidenceLabel = document.getElementById('pacConfidenceLabel');
    const confidenceGoldLabel = document.getElementById('pacConfidenceGoldLabel');
    
    if (confidenceSlider) {
      confidenceSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        state.confidencePercent = value;
        confidenceValue.textContent = value;
        confidenceLabel.textContent = `${value}% Confidence:`;
        confidenceGoldLabel.textContent = `Gold (${value}%):`;
        updateDisplay();
      });
    }

    // Round Add Picks
    const round5Check = document.getElementById('pacRound5');
    const round5Input = document.getElementById('pacRound5Input');
    const round5Picks = document.getElementById('pacRound5Picks');
    
    if (round5Check) {
      round5Check.addEventListener('change', (e) => {
        state.round5Enabled = e.target.checked;
        round5Input.classList.toggle('hidden', !e.target.checked);
        updateDisplay();
      });
    }
    
    if (round5Picks) {
      round5Picks.addEventListener('change', (e) => {
        state.round5AddPicks = Math.max(0, parseInt(e.target.value) || 0);
        updateDisplay();
      });
    }
    
    const round8Check = document.getElementById('pacRound8');
    const round8Input = document.getElementById('pacRound8Input');
    const round8Picks = document.getElementById('pacRound8Picks');
    
    if (round8Check) {
      round8Check.addEventListener('change', (e) => {
        state.round8Enabled = e.target.checked;
        round8Input.classList.toggle('hidden', !e.target.checked);
        updateDisplay();
      });
    }
    
    if (round8Picks) {
      round8Picks.addEventListener('change', (e) => {
        state.round8AddPicks = Math.max(0, parseInt(e.target.value) || 0);
        updateDisplay();
      });
    }
    
    const round11Check = document.getElementById('pacRound11');
    const round11Input = document.getElementById('pacRound11Input');
    const round11Picks = document.getElementById('pacRound11Picks');
    
    if (round11Check) {
      round11Check.addEventListener('change', (e) => {
        state.round11Enabled = e.target.checked;
        round11Input.classList.toggle('hidden', !e.target.checked);
        updateDisplay();
      });
    }
    
    if (round11Picks) {
      round11Picks.addEventListener('change', (e) => {
        state.round11AddPicks = Math.max(0, parseInt(e.target.value) || 0);
        updateDisplay();
      });
    }

    // Portal Regionals
    const portalInputs = {
      'pacPortalCommon2': ['common', 'twoStar'],
      'pacPortalCommon3': ['common', 'threeStar'],
      'pacPortalUncommon2': ['uncommon', 'twoStar'],
      'pacPortalUncommon3': ['uncommon', 'threeStar'],
      'pacPortalRare2': ['rare', 'twoStar'],
      'pacPortalRare3': ['rare', 'threeStar'],
      'pacPortalEpic2': ['epic', 'twoStar'],
      'pacPortalEpic3': ['epic', 'threeStar'],
      'pacPortalUltra2': ['ultra', 'twoStar'],
      'pacPortalUltra3': ['ultra', 'threeStar']
    };
    
    Object.entries(portalInputs).forEach(([id, [rarity, evo]]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          state.portalRegionals[rarity][evo] = Math.max(0, parseInt(e.target.value) || 0);
          updateDisplay();
        });
      }
    });

    // Player name input
    const playerNameInput = document.getElementById('pacPlayerName');
    if (playerNameInput) {
      playerNameInput.addEventListener('input', (e) => {
        state.playerName = e.target.value.trim();
        // Save to localStorage for persistence
        try {
          localStorage.setItem('pac_playerName', state.playerName);
        } catch (err) {
          if (DEBUG_MODE) console.warn('Failed to save playerName to localStorage:', err);
        }
      });
    }

    // Setup autocomplete
    setupAutocomplete();
    
    // Live tracking toggle
    document.getElementById('pacLiveToggle').addEventListener('click', () => {
      liveTrackingActive = !liveTrackingActive;
      const toggleBtn = document.getElementById('pacLiveToggle');
      const statusText = document.getElementById('pacLiveStatus');
      
      if (liveTrackingActive) {
        toggleBtn.classList.add('active');
        statusText.textContent = 'ON';
        startLiveExtraction();
      } else {
        toggleBtn.classList.remove('active');
        statusText.textContent = 'OFF';
        stopLiveExtraction();
      }
    });
    
    // Poll speed selector
    document.getElementById('pacPollSpeed').addEventListener('change', (e) => {
      currentPollSpeed = parseInt(e.target.value);
      // Restart extraction if already active
      if (liveTrackingActive && extractionInterval) {
        stopLiveExtraction();
        startLiveExtraction();
      }
    });
  }
  
  function stopLiveExtraction() {
    if (extractionInterval) {
      clearInterval(extractionInterval);
      extractionInterval = null;
    }
    isConnected = false;
    document.getElementById('pacStatusDot').classList.remove('connected');
    document.getElementById('pacLiveIndicator').style.display = 'none';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DISPLAY UPDATE
  // ═══════════════════════════════════════════════════════════════════════════

  function formatPercent(val, decimals = 2) {
    if (val === 0) return '0.' + '0'.repeat(decimals) + '%';
    if (val < Math.pow(10, -decimals)) return '<0.' + '0'.repeat(decimals - 1) + '1%';
    return val.toFixed(decimals) + '%';
  }

  function formatRolls(val) {
    if (!isFinite(val)) return '∞';
    return Math.ceil(val) + ' rolls';
  }

  function formatGold(val) {
    if (!isFinite(val)) return '∞g';
    return Math.ceil(val) + 'g';
  }

  function updateDisplay() {
    const r = calculate();
    
    // Main results - show MAXED or UNAVAILABLE if applicable
    const perRefreshEl = document.getElementById('pacPerRefresh');
    if (r.notAvailable) {
      perRefreshEl.textContent = '0%';
      perRefreshEl.style.color = '#ef4444';
    } else if (r.isMaxed) {
      perRefreshEl.textContent = 'MAXED ✓';
      perRefreshEl.style.color = '#4caf50';
    } else {
      perRefreshEl.textContent = formatPercent(
        state.dittoEnabled ? r.perRefreshWithDitto : r.perRefresh, 2
      );
      perRefreshEl.style.color = ''; // Reset to default
    }
    
    // Dynamic confidence
    document.getElementById('pacConfidence').textContent = (r.isMaxed || r.notAvailable) ? '—' : formatRolls(r.expectedForConfidence);
    document.getElementById('pacGoldConfidence').textContent = (r.isMaxed || r.notAvailable) ? '—' : formatGold(r.goldForConfidence);
    
    // Footer
    document.getElementById('pacPoolInfo').textContent = r.notAvailable ? 'N/A' : (r.isMaxed ? 'MAXED' : `${r.targetCopies}/${r.maxTargetCopies}`);
    document.getElementById('pacRateInfo').textContent = r.notAvailable ? '0' : r.rarityChance.toFixed(0);
    
    // Status messages
    const wildStatus = document.getElementById('pacStatusWild');
    const poolStatus = document.getElementById('pacStatusPool');
    wildStatus.className = 'pac-status-msg';
    poolStatus.className = 'pac-status-msg';
    wildStatus.textContent = '';
    poolStatus.textContent = '';
    
    if (r.wildTargetImpossible) {
      wildStatus.textContent = `❌ No Wild ${state.targetRarity} ${state.targetEvo === 'twoStar' ? '2★' : '3★'} exist`;
      wildStatus.className = 'pac-status-msg error';
    } else if (state.targetIsWild && r.wildBoost === 0) {
      wildStatus.textContent = '⚠️ Need PVE or Wild owned';
      wildStatus.className = 'pac-status-msg warning';
    }
    
    // Show impossible/danger/maxed status for main target
    if (r.isMaxed && state.targetPokemon) {
      poolStatus.textContent = `✓ MAXED (${r.copiesOwned}/${r.copiesNeeded})`;
      poolStatus.className = 'pac-status-msg success';
    } else if (r.isImpossible && state.targetPokemon) {
      const available = r.targetCopies + r.copiesOwned;
      poolStatus.textContent = `✗ IMPOSSIBLE - Only ${available}/${r.copiesNeeded} available`;
      poolStatus.className = 'pac-status-msg error';
    } else if (r.isDanger && state.targetPokemon) {
      const available = r.targetCopies + r.copiesOwned;
      poolStatus.textContent = `⚠ DANGER - Only ${available}/${r.copiesNeeded} available`;
      poolStatus.className = 'pac-status-msg warning';
    } else if (r.targetCopies === 0) {
      poolStatus.textContent = '❌ Pool depleted!';
      poolStatus.className = 'pac-status-msg error';
    } else if (r.targetCopies <= 3) {
      poolStatus.textContent = `⚠️ Only ${r.targetCopies} copies left`;
      poolStatus.className = 'pac-status-msg warning';
    }
    
    // Update team panel if it exists
    if (state.teamTargets.length > 0) {
      updateTeamDisplay();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REFRESH BLOCKER (v3.0.2 personal)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Show the refresh blocker overlay positioned over the game's refresh button
   */
  function showRefreshBlocker(pokemonName) {
    if (!state.refreshBlockerEnabled) return;
    
    const blocker = document.getElementById('pac-refresh-blocker');
    const refreshBtn = document.querySelector('button.bubbly.blue.refresh-button');
    
    if (!blocker || !refreshBtn) {
      if (DEBUG_MODE) console.log('❌ Blocker: Missing elements', { blocker: !!blocker, refreshBtn: !!refreshBtn });
      return;
    }
    
    // Get refresh button position and size
    const rect = refreshBtn.getBoundingClientRect();
    
    // Make blocker bigger than the button (extra padding)
    const padding = 20;
    const width = rect.width + (padding * 2);
    const height = rect.height + (padding * 2);
    
    // Position blocker over refresh button
    blocker.style.left = `${rect.left - padding}px`;
    blocker.style.top = `${rect.top - padding}px`;
    blocker.style.width = `${width}px`;
    blocker.style.height = `${height}px`;
    blocker.style.minWidth = '150px';
    blocker.style.minHeight = '80px';
    
    // Update pokemon name
    const nameEl = document.getElementById('blockerPokemonName');
    if (nameEl) nameEl.textContent = pokemonName;
    
    // Show blocker
    blocker.classList.add('visible');
    state.refreshBlockerVisible = true;
    state.refreshBlockerTrigger = pokemonName;
    
    if (DEBUG_MODE) console.log(`🛑 BLOCKER: Showing for ${pokemonName}`);
  }
  
  /**
   * Hide the refresh blocker overlay
   */
  function hideRefreshBlocker(userDismissed = false) {
    const blocker = document.getElementById('pac-refresh-blocker');
    if (blocker) {
      blocker.classList.remove('visible');
    }
    
    // If user dismissed, remember this Pokemon so we don't show again
    if (userDismissed && state.refreshBlockerTrigger) {
      state.refreshBlockerDismissed = state.refreshBlockerTrigger;
      if (DEBUG_MODE) console.log(`🟢 BLOCKER: User dismissed ${state.refreshBlockerDismissed}`);
    } else {
      // Target left shop naturally - clear dismissed tracker
      state.refreshBlockerDismissed = null;
      if (DEBUG_MODE) console.log('🟢 BLOCKER: Hidden (target left shop)');
    }
    
    state.refreshBlockerVisible = false;
    state.refreshBlockerTrigger = null;
  }
  
  /**
   * Setup blocker dismiss button
   */
  function setupRefreshBlocker() {
    const dismissBtn = document.getElementById('blockerDismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideRefreshBlocker(true); // User dismissed - don't show again for this Pokemon
      });
    }
    
    // Also hide on clicking the blocker itself (but not the dismiss button)
    const blocker = document.getElementById('pac-refresh-blocker');
    if (blocker) {
      blocker.addEventListener('click', (e) => {
        if (e.target === blocker || e.target.classList.contains('blocker-title') || e.target.classList.contains('blocker-pokemon')) {
          // Don't dismiss on body click - only X button
        }
      });
    }
    
    if (DEBUG_MODE) console.log('🛑 Refresh blocker initialized');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MONO-TYPE MODE (Experimental)
  // ═══════════════════════════════════════════════════════════════════════════

  const MONO_TYPE_LIST = [
    'water', 'fire', 'grass', 'electric', 'ice', 'fighting', 
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 
    'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'
  ];

  const MONO_TYPE_COLORS = {
    water: '#6390F0', fire: '#EE8130', grass: '#7AC74C', electric: '#F7D02C',
    ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65',
    flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136',
    ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE',
    fairy: '#D685AD', normal: '#A8A77A'
  };

  function setupMonoTypePanel() {
    const grid = document.getElementById('pacMonoGrid');
    const header = document.getElementById('pacMonoHeader');
    const panel = document.getElementById('pacMonoPanel');
    const clearBtn = document.getElementById('pacMonoClear');
    
    if (!grid || !header) return;
    
    // Populate grid with type buttons
    grid.innerHTML = MONO_TYPE_LIST.map(type => {
      const color = MONO_TYPE_COLORS[type] || '#888';
      const textColor = ['electric', 'ice', 'ground', 'steel', 'normal'].includes(type) ? '#333' : '#fff';
      return `<button class="pac-mono-btn" data-type="${type}" style="background: ${color}; color: ${textColor};">${type}</button>`;
    }).join('');
    
    // Header click to expand/collapse
    header.addEventListener('click', () => {
      panel.classList.toggle('expanded');
    });
    
    // Type button clicks
    grid.querySelectorAll('.pac-mono-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        selectMonoType(type);
      });
    });
    
    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearMonoType();
      });
    }
    
    // Spin wheel button
    const spinBtn = document.getElementById('pacMonoSpinBtn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        spinMonoTypeWheel();
      });
    }
    
    if (DEBUG_MODE) console.log('🎯 Mono-type panel initialized');
  }
  
  let monoWheelSpinning = false;
  
  function spinMonoTypeWheel() {
    if (monoWheelSpinning) return;
    monoWheelSpinning = true;
    
    const spinBtn = document.getElementById('pacMonoSpinBtn');
    const wheelType = document.getElementById('pacMonoWheelType');
    
    if (spinBtn) spinBtn.disabled = true;
    if (wheelType) wheelType.classList.add('spinning');
    
    // Randomly determine final type
    const finalType = MONO_TYPE_LIST[Math.floor(Math.random() * MONO_TYPE_LIST.length)];
    
    // Spin parameters
    const totalSpins = 25 + Math.floor(Math.random() * 15); // 25-40 type changes
    let currentSpin = 0;
    let currentIndex = Math.floor(Math.random() * MONO_TYPE_LIST.length);
    
    // Calculate delays - start fast, slow down
    function getDelay(spin, total) {
      const progress = spin / total;
      // Ease out - starts at 50ms, ends around 300ms
      return 50 + (progress * progress * 250);
    }
    
    function doSpin() {
      currentSpin++;
      
      // On last few spins, make sure we land on the final type
      let displayType;
      if (currentSpin >= totalSpins - 3) {
        // Final approach - step toward final type
        const remaining = totalSpins - currentSpin;
        const finalIndex = MONO_TYPE_LIST.indexOf(finalType);
        if (remaining === 0) {
          displayType = finalType;
        } else {
          // Get a type that's not the final one yet
          do {
            currentIndex = (currentIndex + 1) % MONO_TYPE_LIST.length;
          } while (currentIndex === finalIndex && remaining > 0);
          displayType = MONO_TYPE_LIST[currentIndex];
        }
      } else {
        // Normal spinning
        currentIndex = (currentIndex + 1) % MONO_TYPE_LIST.length;
        displayType = MONO_TYPE_LIST[currentIndex];
      }
      
      // Update wheel display
      if (wheelType) {
        const color = MONO_TYPE_COLORS[displayType] || '#888';
        const textColor = ['electric', 'ice', 'ground', 'steel', 'normal'].includes(displayType) ? '#333' : '#fff';
        wheelType.style.background = color;
        wheelType.style.color = textColor;
        wheelType.textContent = displayType.toUpperCase();
      }
      
      if (currentSpin < totalSpins) {
        setTimeout(doSpin, getDelay(currentSpin, totalSpins));
      } else {
        // Done spinning - select the type
        setTimeout(() => {
          if (wheelType) wheelType.classList.remove('spinning');
          if (spinBtn) spinBtn.disabled = false;
          monoWheelSpinning = false;
          
          // Select the final type
          selectMonoType(finalType);
          showNotification(`🎰 Wheel landed on ${finalType.toUpperCase()}!`, 'success');
        }, 500);
      }
    }
    
    // Start the spin
    doSpin();
  }

  function selectMonoType(type) {
    state.monoTypeEnabled = true;
    state.monoTypeSelected = type;
    
    // Update UI
    const grid = document.getElementById('pacMonoGrid');
    const status = document.getElementById('pacMonoStatus');
    const clearBtn = document.getElementById('pacMonoClear');
    
    if (grid) {
      grid.querySelectorAll('.pac-mono-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.type === type);
      });
    }
    
    if (status) {
      status.textContent = `Blocking non-${type.toUpperCase()} Pokemon`;
      status.classList.add('active');
    }
    
    if (clearBtn) {
      clearBtn.style.display = 'block';
    }
    
    showNotification(`🎯 Mono-type: ${type.toUpperCase()}`, 'success');
    if (DEBUG_MODE) console.log(`🎯 Mono-type selected: ${type}`);
    
    // Update blockers immediately
    updateMonoTypeBlockers();
  }

  function clearMonoType() {
    state.monoTypeEnabled = false;
    state.monoTypeSelected = null;
    
    // Update UI
    const grid = document.getElementById('pacMonoGrid');
    const status = document.getElementById('pacMonoStatus');
    const clearBtn = document.getElementById('pacMonoClear');
    
    if (grid) {
      grid.querySelectorAll('.pac-mono-btn').forEach(btn => {
        btn.classList.remove('selected');
      });
    }
    
    if (status) {
      status.textContent = 'Select a type to block others';
      status.classList.remove('active');
    }
    
    if (clearBtn) {
      clearBtn.style.display = 'none';
    }
    
    // Clear all blockers
    clearMonoTypeBlockers();
    
    showNotification('Mono-type cleared', 'info');
    if (DEBUG_MODE) console.log('🎯 Mono-type cleared');
  }

  function clearMonoTypeBlockers() {
    document.querySelectorAll('.pac-mono-blocker').forEach(blocker => {
      blocker.remove();
    });
  }

  function updateMonoTypeBlockers() {
    if (!state.monoTypeEnabled || !state.monoTypeSelected) {
      clearMonoTypeBlockers();
      return;
    }
    
    // Find shop slot elements
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) {
      return;
    }
    
    const shopSlots = shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait');
    if (!shopSlots.length) {
      return;
    }
    
    // Clear existing blockers
    clearMonoTypeBlockers();
    
    // Read types directly from each slot's synergy icons
    shopSlots.forEach((slot) => {
      // Get synergy icons - they're inside ul.game-pokemon-portrait-types > li > img.synergy-icon
      const synergyIcons = slot.querySelectorAll('img.synergy-icon');
      const types = Array.from(synergyIcons).map(icon => icon.alt?.toLowerCase()).filter(Boolean);
      
      if (types.length === 0) return;
      
      // Check if any type matches the selected mono-type
      const hasType = types.includes(state.monoTypeSelected);
      
      if (!hasType) {
        // Get slot position
        const rect = slot.getBoundingClientRect();
        
        // Create blocker as fixed element on body (not child of slot)
        // This prevents tooltip from triggering since we're not hovering the slot
        const blocker = document.createElement('div');
        blocker.className = 'pac-mono-blocker';
        blocker.innerHTML = '🚫';
        blocker.title = `Not ${state.monoTypeSelected.toUpperCase()} type`;
        
        // Position exactly over the slot
        blocker.style.top = (rect.top - 5) + 'px';
        blocker.style.left = (rect.left - 5) + 'px';
        blocker.style.width = (rect.width + 10) + 'px';
        blocker.style.height = (rect.height + 10) + 'px';
        
        document.body.appendChild(blocker);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RANDOM DRAFT CHALLENGE (Experimental)
  // ═══════════════════════════════════════════════════════════════════════════

  function setupRandomDraftPanel() {
    const toggleBtn = document.getElementById('pacDraftToggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      if (state.randomDraftEnabled) {
        stopRandomDraft();
      } else {
        startRandomDraft();
      }
    });
    
    if (DEBUG_MODE) console.log('🎲 Random Draft panel initialized');
  }

  function startRandomDraft() {
    state.randomDraftEnabled = true;
    state.randomDraftChosenSlot = null;
    state.randomDraftLastShop = null;
    
    const toggleBtn = document.getElementById('pacDraftToggle');
    const statusEl = document.getElementById('pacDraftStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Stop';
      toggleBtn.classList.add('active');
    }
    
    showNotification('🎲 Random Draft started!', 'success');
    if (DEBUG_MODE) console.log('🎲 Random Draft started');
    
    // Trigger first spin if shop is visible
    triggerRandomDraftSpin();
  }

  function stopRandomDraft() {
    state.randomDraftEnabled = false;
    state.randomDraftChosenSlot = null;
    state.randomDraftSpinning = false;
    state.randomDraftLastShop = null;
    
    const toggleBtn = document.getElementById('pacDraftToggle');
    const statusEl = document.getElementById('pacDraftStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Start';
      toggleBtn.classList.remove('active');
    }
    
    if (statusEl) {
      statusEl.classList.remove('active');
    }
    
    clearRandomDraftOverlays();
    showNotification('🎲 Random Draft stopped', 'info');
    if (DEBUG_MODE) console.log('🎲 Random Draft stopped');
  }

  function clearRandomDraftOverlays() {
    document.querySelectorAll('.pac-draft-blocker, .pac-draft-spin-highlight, .pac-draft-chosen-highlight').forEach(el => el.remove());
  }

  function getShopSlots() {
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) return [];
    return Array.from(shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait'));
  }

  function triggerRandomDraftSpin() {
    if (!state.randomDraftEnabled || state.randomDraftSpinning) return;
    
    const shopSlots = getShopSlots();
    if (shopSlots.length === 0) {
      if (DEBUG_MODE) console.log('🎲 No shop slots found, waiting...');
      return;
    }
    
    // Clear any existing overlays
    clearRandomDraftOverlays();
    
    state.randomDraftSpinning = true;
    state.randomDraftChosenSlot = null;
    
    const statusEl = document.getElementById('pacDraftStatus');
    if (statusEl) {
      statusEl.textContent = '🎰 Spinning...';
      statusEl.classList.add('active');
    }
    
    // Determine final slot
    const finalSlotIndex = Math.floor(Math.random() * shopSlots.length);
    
    // Spin parameters
    const totalSpins = 15 + Math.floor(Math.random() * 10); // 15-25 slot changes
    let currentSpin = 0;
    let currentIndex = Math.floor(Math.random() * shopSlots.length);
    
    // Create spin highlight element
    const spinHighlight = document.createElement('div');
    spinHighlight.className = 'pac-draft-spin-highlight';
    document.body.appendChild(spinHighlight);
    
    function getDelay(spin, total) {
      const progress = spin / total;
      // Ease out - starts at 60ms, ends around 250ms
      return 60 + (progress * progress * 190);
    }
    
    function doSpin() {
      currentSpin++;
      
      // Get current slots (may have changed)
      const currentShopSlots = getShopSlots();
      if (currentShopSlots.length === 0) {
        spinHighlight.remove();
        state.randomDraftSpinning = false;
        return;
      }
      
      // Determine which slot to highlight
      let displayIndex;
      if (currentSpin >= totalSpins) {
        // Final slot
        displayIndex = Math.min(finalSlotIndex, currentShopSlots.length - 1);
      } else if (currentSpin >= totalSpins - 3) {
        // Final approach - step toward final slot
        const remaining = totalSpins - currentSpin;
        if (remaining === 0) {
          displayIndex = Math.min(finalSlotIndex, currentShopSlots.length - 1);
        } else {
          do {
            currentIndex = (currentIndex + 1) % currentShopSlots.length;
          } while (currentIndex === finalSlotIndex && remaining > 0);
          displayIndex = currentIndex;
        }
      } else {
        // Normal spinning
        currentIndex = (currentIndex + 1) % currentShopSlots.length;
        displayIndex = currentIndex;
      }
      
      // Position highlight over current slot
      const slot = currentShopSlots[displayIndex];
      if (slot) {
        const rect = slot.getBoundingClientRect();
        spinHighlight.style.top = (rect.top - 8) + 'px';
        spinHighlight.style.left = (rect.left - 8) + 'px';
        spinHighlight.style.width = (rect.width + 16) + 'px';
        spinHighlight.style.height = (rect.height + 16) + 'px';
      }
      
      if (currentSpin < totalSpins) {
        setTimeout(doSpin, getDelay(currentSpin, totalSpins));
      } else {
        // Done spinning
        setTimeout(() => {
          spinHighlight.remove();
          state.randomDraftSpinning = false;
          state.randomDraftChosenSlot = displayIndex;
          
          // Store current shop state to detect purchases
          state.randomDraftLastShop = currentShopSlots.length;
          
          // Apply chosen highlight and blockers
          applyRandomDraftSelection(displayIndex);
          
          if (statusEl) {
            statusEl.textContent = `✅ Buy slot ${displayIndex + 1}!`;
          }
          
          showNotification(`🎲 Buy slot ${displayIndex + 1}!`, 'success');
          if (DEBUG_MODE) console.log(`🎲 Random Draft chose slot ${displayIndex + 1}`);
        }, 300);
      }
    }
    
    // Start the spin
    doSpin();
  }

  function applyRandomDraftSelection(chosenIndex) {
    const shopSlots = getShopSlots();
    if (shopSlots.length === 0) return;
    
    // Clear any existing overlays
    clearRandomDraftOverlays();
    
    shopSlots.forEach((slot, index) => {
      const rect = slot.getBoundingClientRect();
      
      if (index === chosenIndex) {
        // Chosen slot - green highlight
        const highlight = document.createElement('div');
        highlight.className = 'pac-draft-chosen-highlight';
        highlight.style.top = (rect.top - 8) + 'px';
        highlight.style.left = (rect.left - 8) + 'px';
        highlight.style.width = (rect.width + 16) + 'px';
        highlight.style.height = (rect.height + 16) + 'px';
        document.body.appendChild(highlight);
      } else {
        // Other slots - red blocker
        const blocker = document.createElement('div');
        blocker.className = 'pac-draft-blocker';
        blocker.innerHTML = '❌';
        blocker.title = 'Random Draft - not your pick!';
        blocker.style.top = (rect.top - 5) + 'px';
        blocker.style.left = (rect.left - 5) + 'px';
        blocker.style.width = (rect.width + 10) + 'px';
        blocker.style.height = (rect.height + 10) + 'px';
        document.body.appendChild(blocker);
      }
    });
  }

  function updateRandomDraftBlockers() {
    if (!state.randomDraftEnabled) return;
    
    const shopSlots = getShopSlots();
    
    // Check if shop changed (purchase made or refresh)
    if (state.randomDraftChosenSlot !== null) {
      // If fewer slots than before, player bought something
      if (state.randomDraftLastShop !== null && shopSlots.length < state.randomDraftLastShop) {
        if (DEBUG_MODE) console.log('🎲 Purchase detected, re-spinning...');
        // Clear and re-spin after brief delay
        clearRandomDraftOverlays();
        state.randomDraftChosenSlot = null;
        state.randomDraftLastShop = null;
        
        const statusEl = document.getElementById('pacDraftStatus');
        if (statusEl) {
          statusEl.textContent = '🎰 Spinning...';
        }
        
        setTimeout(() => {
          triggerRandomDraftSpin();
        }, 500);
        return;
      }
      
      // If more slots than before, shop refreshed
      if (state.randomDraftLastShop !== null && shopSlots.length > state.randomDraftLastShop) {
        if (DEBUG_MODE) console.log('🎲 Shop refresh detected, re-spinning...');
        clearRandomDraftOverlays();
        state.randomDraftChosenSlot = null;
        state.randomDraftLastShop = null;
        
        setTimeout(() => {
          triggerRandomDraftSpin();
        }, 300);
        return;
      }
      
      // Update positions of existing overlays (in case of scroll/resize)
      applyRandomDraftSelection(state.randomDraftChosenSlot);
      state.randomDraftLastShop = shopSlots.length;
    } else if (!state.randomDraftSpinning && shopSlots.length > 0) {
      // No chosen slot and not spinning - trigger new spin
      triggerRandomDraftSpin();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COPYCAT CHALLENGE (Experimental)
  // ═══════════════════════════════════════════════════════════════════════════

  function setupCopycatPanel() {
    const toggleBtn = document.getElementById('pacCopycatToggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      if (state.copycatEnabled) {
        stopCopycat();
      } else {
        startCopycat();
      }
    });
    
    if (DEBUG_MODE) console.log('🐱 Copycat panel initialized');
  }

  function startCopycat() {
    state.copycatEnabled = true;
    
    const toggleBtn = document.getElementById('pacCopycatToggle');
    const statusEl = document.getElementById('pacCopycatStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Stop';
      toggleBtn.classList.add('active');
    }
    
    if (statusEl) {
      statusEl.classList.add('active');
    }
    
    showNotification('🐱 Copycat started! Only buy what others have!', 'success');
    if (DEBUG_MODE) console.log('🐱 Copycat started');
    
    // Update blockers immediately
    updateCopycatBlockers();
  }

  function stopCopycat() {
    state.copycatEnabled = false;
    
    const toggleBtn = document.getElementById('pacCopycatToggle');
    const statusEl = document.getElementById('pacCopycatStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Start';
      toggleBtn.classList.remove('active');
    }
    
    if (statusEl) {
      statusEl.classList.remove('active');
    }
    
    clearCopycatBlockers();
    showNotification('🐱 Copycat stopped', 'info');
    if (DEBUG_MODE) console.log('🐱 Copycat stopped');
  }

  function clearCopycatBlockers() {
    document.querySelectorAll('.pac-copycat-blocker').forEach(el => el.remove());
  }

  function getOtherPlayersPokemon() {
    // Get all Pokemon that OTHER players have on their boards/benches
    const otherPlayersPokemon = new Set();
    
    if (!lastPoolData || !state.playerName) {
      return otherPlayersPokemon;
    }
    
    const allBoards = lastPoolData.playerBoards || {};
    const allBenches = lastPoolData.playerBenches || {};
    
    // Get all player names except self
    const otherPlayers = new Set([
      ...Object.keys(allBoards),
      ...Object.keys(allBenches)
    ]);
    otherPlayers.delete(state.playerName);
    
    // Collect all Pokemon from other players
    otherPlayers.forEach(playerName => {
      const board = allBoards[playerName] || [];
      const bench = allBenches[playerName] || [];
      
      [...board, ...bench].forEach(unit => {
        const unitName = typeof unit === 'string' ? unit : unit?.name;
        if (unitName) {
          const baseName = unitName.toUpperCase();
          
          // Get the base form and full evolution family
          const baseForm = getBaseForm(baseName);
          const family = getEvolutionFamily(baseForm);
          
          // Add all members of the evolution family
          family.forEach(name => otherPlayersPokemon.add(name));
        }
      });
    });
    
    return otherPlayersPokemon;
  }

  function updateCopycatBlockers() {
    if (!state.copycatEnabled) {
      clearCopycatBlockers();
      return;
    }
    
    // Find shop slot elements
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) return;
    
    const shopSlots = shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait');
    if (!shopSlots.length) return;
    
    // Get the player's shop data directly from lastPoolData
    const playerShop = lastPoolData?.playerShops?.[state.playerName] || [];
    const shopMapping = playerShop
      .filter(name => name && name !== 'DEFAULT')
      .map(name => name.toUpperCase());
    
    if (shopMapping.length === 0) return;
    
    // Get Pokemon that other players have
    const contestedPokemon = getOtherPlayersPokemon();
    
    // Clear existing blockers
    clearCopycatBlockers();
    
    // Get status element for count
    const statusEl = document.getElementById('pacCopycatStatus');
    let blockedCount = 0;
    
    // Check each shop slot using shopMapping
    shopSlots.forEach((slot, index) => {
      const pokemonName = shopMapping[index];
      
      // Skip empty slots
      if (!pokemonName) return;
      
      // Check if this Pokemon (or its evolution family) is contested
      const baseForm = getBaseForm(pokemonName);
      const family = getEvolutionFamily(baseForm);
      
      // Check if any evolution family member is in contested set
      const isContested = family.some(name => contestedPokemon.has(name));
      
      if (!isContested) {
        // Block this slot - nobody else has this Pokemon
        const rect = slot.getBoundingClientRect();
        
        const blocker = document.createElement('div');
        blocker.className = 'pac-copycat-blocker';
        blocker.innerHTML = `<span>🚫</span><span class="pac-copycat-blocker-text">Uncontested</span>`;
        blocker.title = `No other player has ${pokemonName}`;
        
        blocker.style.top = (rect.top - 5) + 'px';
        blocker.style.left = (rect.left - 5) + 'px';
        blocker.style.width = (rect.width + 10) + 'px';
        blocker.style.height = (rect.height + 10) + 'px';
        
        document.body.appendChild(blocker);
        blockedCount++;
      }
    });
    
    // Update status with count
    if (statusEl) {
      const availableCount = shopSlots.length - blockedCount;
      if (contestedPokemon.size === 0) {
        statusEl.textContent = '⚠️ No player data yet - open Counter Intel';
      } else if (availableCount === 0) {
        statusEl.textContent = '😿 No contested Pokemon in shop!';
      } else if (blockedCount === 0) {
        statusEl.textContent = '😺 All Pokemon are contested!';
      } else {
        statusEl.textContent = `🐱 ${availableCount} contested, ${blockedCount} blocked`;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MLG MODE (Experimental) - 420 NO SCOPE
  // ═══════════════════════════════════════════════════════════════════════════

  const MLG_TEXTS = [
    'MOM GET THE CAMERA',
    'GET REKT',
    '360 NO SCOPE',
    'SHREKT',
    'OH BABY A TRIPLE',
    'WOMBO COMBO',
    'DAMN SON',
    'WOW',
    'SMOKE WEED EVERYDAY',
    'BLAZEIT',
    'AIRHORN',
    'SNIPED',
    'GIT GUD',
    'REKT',
    'EZ',
    'OHHHHH',
    'ILLUMINATI CONFIRMED'
  ];

  function setupMlgPanel() {
    const toggleBtn = document.getElementById('pacMlgToggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
      if (state.mlgModeEnabled) {
        stopMlgMode();
      } else {
        startMlgMode();
      }
    });
    
    if (DEBUG_MODE) console.log('🔥 MLG panel initialized');
  }

  function startMlgMode() {
    state.mlgModeEnabled = true;
    state.mlgLastBoardSnapshot = null;  // Reset so we don't trigger immediately
    
    const toggleBtn = document.getElementById('pacMlgToggle');
    const statusEl = document.getElementById('pacMlgStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Stop';
      toggleBtn.classList.add('active');
    }
    
    if (statusEl) {
      statusEl.classList.add('active');
    }
    
    // Epic entrance effect
    triggerMlgText('BLAZEIT 420', window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgIlluminati(10);
    triggerMlgHitmarkers(15);
    triggerMlgDoritos(10);
    triggerMlgWeed(10);
    triggerMlgScreenShake();
    setTimeout(() => triggerMlgAirhorn(), 300);
    setTimeout(() => triggerMlg360Text(), 500);
    
    showNotification('🔥 MLG MODE ACTIVATED - 360 NO SCOPE', 'success');
    if (DEBUG_MODE) console.log('🔥 MLG Mode started');
  }

  function stopMlgMode() {
    state.mlgModeEnabled = false;
    
    const toggleBtn = document.getElementById('pacMlgToggle');
    const statusEl = document.getElementById('pacMlgStatus');
    
    if (toggleBtn) {
      toggleBtn.textContent = 'Start';
      toggleBtn.classList.remove('active');
    }
    
    if (statusEl) {
      statusEl.classList.remove('active');
    }
    
    // Clear any MLG overlays
    document.querySelectorAll('.pac-mlg-hitmarker, .pac-mlg-text, .pac-mlg-lensflare, .pac-mlg-illuminati, .pac-mlg-dorito, .pac-mlg-sample, .pac-mlg-360, .pac-mlg-airhorn, .pac-mlg-weed, .pac-mlg-snoop').forEach(el => el.remove());
    
    showNotification('MLG Mode deactivated', 'info');
    if (DEBUG_MODE) console.log('🔥 MLG Mode stopped');
  }

  function triggerMlgHitmarker(x, y) {
    if (!state.mlgModeEnabled) return;
    
    const hitmarker = document.createElement('div');
    hitmarker.className = 'pac-mlg-hitmarker';
    hitmarker.style.left = (x - 30) + 'px';
    hitmarker.style.top = (y - 30) + 'px';
    document.body.appendChild(hitmarker);
    
    setTimeout(() => hitmarker.remove(), 300);
  }

  function triggerMlgHitmarkers(count = 3) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        triggerMlgHitmarker(x, y);
      }, i * 100);
    }
  }

  function triggerMlgText(text, x, y) {
    if (!state.mlgModeEnabled) return;
    
    const textEl = document.createElement('div');
    textEl.className = 'pac-mlg-text';
    textEl.textContent = text || MLG_TEXTS[Math.floor(Math.random() * MLG_TEXTS.length)];
    textEl.style.left = (x - 150) + 'px';
    textEl.style.top = (y - 30) + 'px';
    document.body.appendChild(textEl);
    
    setTimeout(() => textEl.remove(), 1000);
  }

  function triggerMlgLensFlare(x, y) {
    if (!state.mlgModeEnabled) return;
    
    const flare = document.createElement('div');
    flare.className = 'pac-mlg-lensflare';
    flare.style.left = (x - 100) + 'px';
    flare.style.top = (y - 100) + 'px';
    document.body.appendChild(flare);
    
    setTimeout(() => flare.remove(), 800);
  }

  function triggerMlgIlluminati(count = 5) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const triangle = document.createElement('div');
        triangle.className = 'pac-mlg-illuminati';
        
        // Random start position
        triangle.style.left = (Math.random() * (window.innerWidth - 160)) + 'px';
        triangle.style.top = (Math.random() * (window.innerHeight - 140)) + 'px';
        
        // Random fly direction
        const flyX = (Math.random() - 0.5) * 400;
        const flyY = (Math.random() - 0.5) * 400;
        triangle.style.setProperty('--fly-x', flyX + 'px');
        triangle.style.setProperty('--fly-y', flyY + 'px');
        
        document.body.appendChild(triangle);
        
        setTimeout(() => triangle.remove(), 2000);
      }, i * 150);
    }
  }

  function triggerMlgDoritos(count = 5) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const dorito = document.createElement('div');
        dorito.className = 'pac-mlg-dorito';
        dorito.textContent = '🔺';
        dorito.style.left = (Math.random() * window.innerWidth) + 'px';
        dorito.style.top = '-100px';
        document.body.appendChild(dorito);
        
        setTimeout(() => dorito.remove(), 2000);
      }, i * 200);
    }
  }

  function triggerMlgSampleText() {
    if (!state.mlgModeEnabled) return;
    
    const sample = document.createElement('div');
    sample.className = 'pac-mlg-sample';
    sample.textContent = 'SAMPLE TEXT';
    sample.style.left = (Math.random() * (window.innerWidth - 200)) + 'px';
    sample.style.top = (Math.random() * (window.innerHeight - 50)) + 'px';
    document.body.appendChild(sample);
    
    setTimeout(() => sample.remove(), 2000);
  }

  function triggerMlg360Text() {
    if (!state.mlgModeEnabled) return;
    
    const text = document.createElement('div');
    text.className = 'pac-mlg-360';
    text.textContent = '360';
    text.style.left = (Math.random() * (window.innerWidth - 150)) + 'px';
    text.style.top = (Math.random() * (window.innerHeight - 100)) + 'px';
    document.body.appendChild(text);
    
    setTimeout(() => text.remove(), 2000);
  }

  function triggerMlgAirhorn() {
    if (!state.mlgModeEnabled) return;
    
    const horn = document.createElement('div');
    horn.className = 'pac-mlg-airhorn';
    horn.textContent = '📯';
    horn.style.left = (Math.random() * (window.innerWidth - 100)) + 'px';
    horn.style.top = (Math.random() * (window.innerHeight - 100)) + 'px';
    document.body.appendChild(horn);
    
    setTimeout(() => horn.remove(), 800);
  }

  function triggerMlgWeed(count = 5) {
    if (!state.mlgModeEnabled) return;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const leaf = document.createElement('div');
        leaf.className = 'pac-mlg-weed';
        leaf.textContent = '🍀';
        leaf.style.left = (Math.random() * window.innerWidth) + 'px';
        leaf.style.top = (window.innerHeight - 100) + 'px';
        document.body.appendChild(leaf);
        
        setTimeout(() => leaf.remove(), 3000);
      }, i * 150);
    }
  }

  function triggerMlgSnoop() {
    if (!state.mlgModeEnabled) return;
    
    const snoop = document.createElement('div');
    snoop.className = 'pac-mlg-snoop';
    snoop.textContent = '🐕';
    snoop.style.left = (Math.random() * (window.innerWidth - 150)) + 'px';
    snoop.style.top = (Math.random() * (window.innerHeight - 150)) + 'px';
    document.body.appendChild(snoop);
    
    setTimeout(() => snoop.remove(), 2000);
  }

  function triggerMlgScreenShake() {
    if (!state.mlgModeEnabled) return;
    
    document.body.classList.add('pac-mlg-shake');
    setTimeout(() => document.body.classList.remove('pac-mlg-shake'), 500);
  }

  function triggerMlgCombo() {
    if (!state.mlgModeEnabled) return;
    
    // Full chaos
    triggerMlgScreenShake();
    triggerMlgHitmarkers(15);
    triggerMlgText(null, window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgLensFlare(window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgIlluminati(8);
    triggerMlgDoritos(15);
    triggerMlg360Text();
    triggerMlgAirhorn();
    triggerMlgWeed(10);
    triggerMlgSnoop();
  }

  // Hook for target found in shop
  function triggerMlgTargetFound(slotElement) {
    if (!state.mlgModeEnabled || !slotElement) return;
    
    const rect = slotElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    triggerMlgHitmarker(x, y);
    triggerMlgText('SNIPED', x, y - 50);
    triggerMlgLensFlare(x, y);
    triggerMlgScreenShake();
  }

  // EVOLUTION DETECTED - 10 seconds of pure chaos
  function triggerMlgEvolutionChaos(starLevel) {
    if (!state.mlgModeEnabled) return;
    
    const is3Star = starLevel === 3;
    
    const texts = [
      'OH BABY A TRIPLE',
      'MOM GET THE CAMERA',
      'WOMBO COMBO',
      'SHREKT',
      '360 NO SCOPE',
      'DAMN SON',
      'SMOKE WEED EVERYDAY',
      'GET REKT',
      'EZ CLAP',
      'SNIPED',
      'OHHHHH',
      'REKT',
      'GIT GUD',
      'BLAZEIT',
      'ILLUMINATI CONFIRMED',
      'WOW',
      'AIRHORN'
    ];
    
    // Initial big hit - ALL THE EFFECTS
    triggerMlgScreenShake();
    triggerMlgText(is3Star ? 'OH BABY A TRIPLE!!!' : 'EVOLVED!!!', window.innerWidth / 2, window.innerHeight / 2);
    triggerMlgIlluminati(8);
    triggerMlgHitmarkers(20);
    triggerMlg360Text();
    triggerMlgAirhorn();
    triggerMlgWeed(15);
    triggerMlgDoritos(10);
    triggerMlgSnoop();
    triggerMlgLensFlare(window.innerWidth / 2, window.innerHeight / 2);
    
    // 10 seconds of chaos
    const duration = 10000;
    const interval = 100;  // Fast chaos
    let elapsed = 0;
    
    const chaosInterval = setInterval(() => {
      elapsed += interval;
      
      if (elapsed >= duration || !state.mlgModeEnabled) {
        clearInterval(chaosInterval);
        return;
      }
      
      // Multiple random effects each tick
      const effectCount = is3Star ? 3 : 2;
      for (let e = 0; e < effectCount; e++) {
        const effect = Math.floor(Math.random() * 11);
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        switch(effect) {
          case 0:
            triggerMlgHitmarker(x, y);
            break;
          case 1:
            triggerMlgText(texts[Math.floor(Math.random() * texts.length)], x, y);
            break;
          case 2:
            triggerMlgLensFlare(x, y);
            break;
          case 3:
            triggerMlgDoritos(2);
            break;
          case 4:
            if (Math.random() > 0.3) triggerMlgScreenShake();
            break;
          case 5:
            triggerMlgIlluminati(3);
            break;
          case 6:
            triggerMlg360Text();
            break;
          case 7:
            triggerMlgAirhorn();
            break;
          case 8:
            triggerMlgWeed(5);
            break;
          case 9:
            triggerMlgSnoop();
            break;
          case 10:
            triggerMlgHitmarkers(5);
            break;
        }
      }
    }, interval);
    
    // Scheduled bursts throughout the 10 seconds
    setTimeout(() => {
      triggerMlgDoritos(15);
      triggerMlgIlluminati(10);
      triggerMlgText('WOMBO COMBO', window.innerWidth / 2, window.innerHeight / 3);
    }, 1000);
    
    setTimeout(() => {
      triggerMlgHitmarkers(25);
      triggerMlgScreenShake();
      triggerMlgText('MOM GET THE CAMERA', window.innerWidth / 2, window.innerHeight / 2);
    }, 2500);
    
    setTimeout(() => {
      triggerMlg360Text();
      triggerMlgAirhorn();
      triggerMlgIlluminati(15);
      triggerMlgWeed(20);
    }, 4000);
    
    setTimeout(() => {
      triggerMlgText('SMOKE WEED EVERYDAY', window.innerWidth / 2, window.innerHeight / 2);
      triggerMlgDoritos(20);
      triggerMlgSnoop();
      triggerMlgScreenShake();
    }, 5500);
    
    setTimeout(() => {
      triggerMlgIlluminati(20);
      triggerMlgHitmarkers(30);
      triggerMlgText('ILLUMINATI CONFIRMED', window.innerWidth / 2, window.innerHeight / 2);
    }, 7000);
    
    setTimeout(() => {
      triggerMlgText(is3Star ? 'OH BABY A TRIPLE' : 'GET REKT', window.innerWidth / 2, window.innerHeight / 2);
      triggerMlgDoritos(25);
      triggerMlgWeed(25);
      triggerMlgAirhorn();
      triggerMlgScreenShake();
      triggerMlgIlluminati(10);
    }, 8500);
  }

  // Detect evolutions by comparing board snapshots
  function checkForEvolutions(currentBoard, currentBench) {
    if (!state.mlgModeEnabled) return;
    
    const currentUnits = [...currentBoard, ...currentBench];
    
    // Build snapshot: { "PIKACHU": maxStars }
    const currentSnapshot = {};
    currentUnits.forEach(unit => {
      if (unit.name) {
        const name = unit.name.toUpperCase();
        const stars = unit.stars || 1;
        if (!currentSnapshot[name] || currentSnapshot[name] < stars) {
          currentSnapshot[name] = stars;
        }
      }
    });
    
    // Compare with previous snapshot
    if (state.mlgLastBoardSnapshot) {
      Object.entries(currentSnapshot).forEach(([name, stars]) => {
        const prevStars = state.mlgLastBoardSnapshot[name] || 0;
        if (stars > prevStars && prevStars > 0) {
          // Evolution detected! Stars went up
          triggerMlgEvolutionChaos(stars);
        } else if (stars >= 2 && prevStars === 0) {
          // New 2★ or 3★ appeared (could be from combining)
          // Check if we had the base form before
          const baseForm = getBaseForm(name);
          if (state.mlgLastBoardSnapshot[baseForm] || state.mlgLastBoardSnapshot[name.replace(/[^A-Z]/g, '')]) {
            triggerMlgEvolutionChaos(stars);
          }
        }
      });
    }
    
    // Save current snapshot for next comparison
    state.mlgLastBoardSnapshot = currentSnapshot;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TARGET SHOP HIGHLIGHTERS (v3.1.2 - Accessibility)
  // ═══════════════════════════════════════════════════════════════════════════

  function clearTargetHighlighters() {
    document.querySelectorAll('.pac-target-highlighter, .pac-team-highlighter').forEach(el => el.remove());
  }

  // Updates the slot mapping - filters out DEFAULT (empty) slots
  // so indices match the DOM which also removes purchased slots
  function updateShopSlotMapping(currentShop) {
    state.shopSlotMapping = currentShop
      .filter(name => name && name !== 'DEFAULT')
      .map(name => name.toUpperCase());
  }

  function updateTargetHighlighters(playerShop) {
    // Clear existing highlighters
    clearTargetHighlighters();
    
    if (!playerShop || playerShop.length === 0) return;
    
    // Update the slot mapping (handles purchase shifts)
    updateShopSlotMapping(playerShop);
    
    // Find shop slot elements
    const shopContainer = document.querySelector('ul.game-pokemons-store');
    if (!shopContainer) return;
    
    const shopSlots = shopContainer.querySelectorAll('div.my-box.clickable.game-pokemon-portrait');
    if (!shopSlots.length) return;
    
    // Build list of target pokemon names (uppercase)
    const mainTargetFamily = [];
    if (state.targetPokemon && state.evolutionFamily) {
      mainTargetFamily.push(...state.evolutionFamily);
    } else if (state.targetPokemon) {
      mainTargetFamily.push(state.targetPokemon.toUpperCase());
    }
    
    // Build list of team target pokemon names
    const teamTargetFamilies = [];
    for (const target of state.teamTargets) {
      if (!target.enabled) continue;
      const baseForm = getBaseForm(target.pokemon);
      const family = getEvolutionFamily(baseForm);
      teamTargetFamilies.push(...family);
    }
    
    // No targets set - nothing to highlight
    if (mainTargetFamily.length === 0 && teamTargetFamilies.length === 0) return;
    
    // Check if Ditto is in shop (use mapping, not raw array)
    const dittoInShop = state.shopSlotMapping.includes('DITTO');
    
    // Get custom colors from settings
    const targetColor = state.customSettings.targetFlashColor || '#fbbf24';
    const teamColor = state.customSettings.teamFlashColor || '#FF1493';
    const disableFlash = state.customSettings.disableFlash || false;
    
    // Read pokemon name from each slot using the corrected mapping
    shopSlots.forEach((slot, index) => {
      // Use the slot mapping instead of raw playerShop array
      const pokemonName = state.shopSlotMapping[index];
      
      // Skip empty slots (null means purchased)
      if (!pokemonName) return;
      
      // Check if this pokemon is a main target or team target
      const isMainTarget = mainTargetFamily.includes(pokemonName) || (dittoInShop && pokemonName === 'DITTO' && mainTargetFamily.length > 0);
      const isTeamTarget = teamTargetFamilies.includes(pokemonName) || (dittoInShop && pokemonName === 'DITTO' && teamTargetFamilies.length > 0);
      
      if (!isMainTarget && !isTeamTarget) return;
      
      // Get slot position
      const rect = slot.getBoundingClientRect();
      
      // Create highlighter overlay
      const highlighter = document.createElement('div');
      
      if (isMainTarget) {
        highlighter.className = 'pac-target-highlighter';
        if (isTeamTarget) highlighter.classList.add('also-team');
        highlighter.style.setProperty('--pac-target-color', targetColor);
        highlighter.style.setProperty('--pac-target-color-bg', targetColor + '73'); // 45% opacity
      } else {
        highlighter.className = 'pac-team-highlighter';
        highlighter.style.setProperty('--pac-team-color', teamColor);
        highlighter.style.setProperty('--pac-team-color-bg', teamColor + '73'); // 45% opacity
      }
      
      // Add no-animate class if epilepsy mode is on
      if (disableFlash) {
        highlighter.classList.add('no-animate');
      }
      
      // Position over the slot
      highlighter.style.top = (rect.top - 4) + 'px';
      highlighter.style.left = (rect.left - 4) + 'px';
      highlighter.style.width = (rect.width + 8) + 'px';
      highlighter.style.height = (rect.height + 8) + 'px';
      
      document.body.appendChild(highlighter);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIVE EXTRACTION LOOP
  // ═══════════════════════════════════════════════════════════════════════════

  let isConnected = false;

  function startLiveExtraction() {
    // Inject the extractor script into page context
    injectExtractor();
    
      // ═══════════════════════════════════════════════════════════════════════════
  // EVOLUTION FAMILY UI UPDATE (v2.5.0)
  // ═══════════════════════════════════════════════════════════════════════════

  function updateFamilyBreakdown(breakdown, total) {
    const container = document.getElementById('pacFamilyBreakdown');
    const familySection = document.getElementById('pacEvolutionFamily');
    
    if (!container || !familySection) return;
    
    if (breakdown.length === 0) {
      familySection.classList.add('hidden');
      return;
    }
    
    familySection.classList.remove('hidden');
    
    container.innerHTML = breakdown.map(item => `
      <div class="pac-family-row">
        <span class="pac-family-name">${item.name}</span>
        <span class="pac-family-calc">${item.count} × ${item.cost} = ${item.weighted}</span>
      </div>
    `).join('');
    
    document.getElementById('pacFamilyTotal').textContent = total;
  }

  // Listen for extraction responses via postMessage
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PAC_EXTRACT_RESPONSE') {
        const data = event.data.data;
        
        if (data && data.totalUnits > 0) {
          if (!isConnected) {
            isConnected = true;
            document.getElementById('pacStatusDot').classList.add('connected');
            if (DEBUG_MODE) console.log('🎮 PAC Calculator: Connected to game!', data);
          }
          
          lastPoolData = data;
          
          // Update live indicator
          document.getElementById('pacLiveIndicator').style.display = 'flex';
          document.getElementById('pacLiveCount').textContent = data.totalUnits;
          
          // Auto-scout if enabled and target pokemon specified
          if (state.autoScout && state.targetPokemon) {
            const targetName = state.targetPokemon.toUpperCase();
            let count = 0;
            
            // Evolution family aggregation (v2.5.0)
            if (state.evolutionFamily && state.evolutionFamily.length > 0) {
              const breakdown = [];
              let totalWeighted = 0;
              
              state.evolutionFamily.forEach(formName => {
                const formCount = data.pokemonCounts[formName] || 0;
                if (formCount > 0) {
                  const cost = getEvolutionCost(formName);
                  const weighted = formCount * cost;
                  totalWeighted += weighted;
                  
                  breakdown.push({
                    name: formName,
                    count: formCount,
                    cost: cost,
                    weighted: weighted
                  });
                }
              });
              
              count = totalWeighted;
              
              // Update visual breakdown
              updateFamilyBreakdown(breakdown, totalWeighted);
            } else {
              // Fallback to old behavior
              Object.entries(data.pokemonCounts).forEach(([name, c]) => {
                if (name.toUpperCase() === targetName) {
                  count += c;
                }
              });
            }
            
            // Update scouted field if changed
            if (count !== state.copiesTaken) {
              state.copiesTaken = count;
              document.getElementById('pacScouted').value = count;
            }
          }
          
          // Check if target is in player's own shop (FLASH ALERT)
          const overlay = document.getElementById('pac-calc-overlay');
          const teamPanel = document.getElementById('pac-team-panel');
          
          // Track what triggered blocker
          let blockerTriggerPokemon = null;
          
          // Store shop data for mono-type blocking
          if (data.playerShops) {
            state.lastShopData = data.playerShops;
            
            // Track only YOUR shop for Roll Luck history
            if (state.playerName && data.playerShops[state.playerName]) {
              const shop = data.playerShops[state.playerName];
              if (shop && shop.length > 0) {
                const playerLevel = data.playerLevels ? data.playerLevels[state.playerName] : null;
                trackShopRoll(state.playerName, shop, playerLevel);
              }
            }
          }
          
          // Only check if player name is manually entered
          if (data.playerShops && state.playerName && state.targetPokemon) {
            const playerShop = data.playerShops[state.playerName];
            let targetInShop = false;
            
            if (playerShop && playerShop.length > 0) {
              // Check if Ditto is in shop (Ditto can be ANY Pokemon)
              const dittoInShop = playerShop.includes('DITTO');
              
              // Check if any evolution family member is in shop
              let foundPokemon = null;
              if (state.evolutionFamily && state.evolutionFamily.length > 0) {
                foundPokemon = state.evolutionFamily.find(formName => 
                  playerShop.includes(formName)
                );
                targetInShop = !!foundPokemon;
              } else if (state.targetPokemonDisplayName) {
                const upperName = state.targetPokemonDisplayName.toUpperCase();
                if (playerShop.includes(upperName)) {
                  foundPokemon = upperName;
                  targetInShop = true;
                }
              }
              
              // Flash if target OR Ditto in shop
              if (dittoInShop && !targetInShop) {
                foundPokemon = 'DITTO';
                targetInShop = true;
              }
              
              if (foundPokemon) blockerTriggerPokemon = foundPokemon;
            }
            
            if (targetInShop) {
              // Trigger MLG effects when target newly found (wasn't flashing before)
              if (!overlay.classList.contains('target-in-shop') && state.mlgModeEnabled) {
                triggerMlgText('SNIPED', window.innerWidth / 2, window.innerHeight / 3);
                triggerMlgHitmarkers(5);
                triggerMlgScreenShake();
                setTimeout(() => triggerMlgLensFlare(window.innerWidth / 2, window.innerHeight / 2), 150);
              }
              overlay.classList.add('target-in-shop');
            } else {
              overlay.classList.remove('target-in-shop');
            }
          } else {
            overlay.classList.remove('target-in-shop');
          }
          
          // Check if ANY team target is in player's shop (TEAM PANEL FLASH)
          if (teamPanel && data.playerShops && state.playerName && state.teamTargets.length > 0) {
            const playerShop = data.playerShops[state.playerName];
            let teamTargetInShop = false;
            
            if (playerShop && playerShop.length > 0) {
              // Check if Ditto is in shop (Ditto can be ANY Pokemon)
              const dittoInShop = playerShop.includes('DITTO');
              
              // Check if any team target or their evolutions are in shop
              let foundTeamPokemon = null;
              for (const target of state.teamTargets) {
                if (!target.enabled) continue;
                const baseForm = getBaseForm(target.pokemon);
                const family = getEvolutionFamily(baseForm);
                const found = family.find(formName => playerShop.includes(formName));
                if (found) {
                  foundTeamPokemon = found;
                  teamTargetInShop = true;
                  break;
                }
              }
              
              // Flash if any team target OR Ditto in shop
              if (dittoInShop && !teamTargetInShop) {
                foundTeamPokemon = 'DITTO';
                teamTargetInShop = true;
              }
              
              if (foundTeamPokemon && !blockerTriggerPokemon) {
                blockerTriggerPokemon = foundTeamPokemon;
              }
            }
            
            if (teamTargetInShop) {
              // Trigger MLG effects when team target newly found
              if (!teamPanel.classList.contains('team-target-in-shop') && state.mlgModeEnabled) {
                triggerMlgText('GET REKT', window.innerWidth / 2, window.innerHeight / 2);
                triggerMlgHitmarkers(3);
              }
              teamPanel.classList.add('team-target-in-shop');
              overlay.classList.add('team-target-in-shop');  // Also add to overlay for minimized flash
            } else {
              teamPanel.classList.remove('team-target-in-shop');
              overlay.classList.remove('team-target-in-shop');
            }
          } else if (teamPanel) {
            teamPanel.classList.remove('team-target-in-shop');
            overlay.classList.remove('team-target-in-shop');
          }
          
          // REFRESH BLOCKER - show if target found, not already showing, and not dismissed
          if (blockerTriggerPokemon && !state.refreshBlockerVisible) {
            // Only show if this isn't the Pokemon user already dismissed
            if (blockerTriggerPokemon !== state.refreshBlockerDismissed) {
              showRefreshBlocker(blockerTriggerPokemon);
            }
          } else if (!blockerTriggerPokemon && state.refreshBlockerVisible) {
            // Target left shop (purchased or rolled away) - hide blocker
            hideRefreshBlocker();
          } else if (!blockerTriggerPokemon && state.refreshBlockerDismissed) {
            // No target in shop anymore - clear dismissed tracker for next roll
            state.refreshBlockerDismissed = null;
          }
          
          // MONO-TYPE BLOCKERS - update when shop changes
          if (state.monoTypeEnabled && state.monoTypeSelected) {
            updateMonoTypeBlockers();
          }
          
          // RANDOM DRAFT - update when shop changes
          if (state.randomDraftEnabled) {
            updateRandomDraftBlockers();
          }
          
          // COPYCAT - update when shop or other players change
          if (state.copycatEnabled) {
            updateCopycatBlockers();
          }
          
          // TARGET HIGHLIGHTERS - show colored overlay on targets in shop
          if (data.playerShops && state.playerName) {
            const playerShop = data.playerShops[state.playerName];
            if (playerShop && (state.targetPokemon || state.teamTargets.length > 0)) {
              updateTargetHighlighters(playerShop);
            } else {
              clearTargetHighlighters();
            }
          } else {
            clearTargetHighlighters();
          }
          
          // Auto-set player level from DOM
          if (data.localPlayerLevel && data.localPlayerLevel !== state.level) {
            state.level = data.localPlayerLevel;
            document.getElementById('pacLevel').value = data.localPlayerLevel;
          }
          
          // Auto-set current stage and PVE round status
          if (data.currentStage && data.currentStage !== state.currentStage) {
            state.currentStage = data.currentStage;
            const isPveRound = PVE_STAGES.has(data.currentStage);
            
            // Always update PVE state and checkbox when stage changes
            state.pveRoundEnabled = isPveRound;
            const pveCheckbox = document.getElementById('pacPVE');
            if (pveCheckbox) {
              pveCheckbox.checked = isPveRound;
              // Force visual update by dispatching change event
              pveCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            // Re-render fishing tab if visible (PvE affects wild boost)
            if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
              renderFishingTab();
            }
            
            // Update stage display
            const stageDisplay = document.getElementById('pacStageDisplay');
            if (stageDisplay) {
              stageDisplay.textContent = `Stage ${data.currentStage}`;
              stageDisplay.classList.toggle('pve', isPveRound);
            }
            
            // Auto-enable Ditto at stage 6+
            if (data.currentStage >= 6 && !state.dittoEnabled) {
              state.dittoEnabled = true;
              const dittoCheckbox = document.getElementById('pacDitto');
              if (dittoCheckbox) {
                dittoCheckbox.checked = true;
              }
              if (DEBUG_MODE) console.log('🎭 Ditto enabled at stage', data.currentStage);
            }
          }
          
          // Auto-count wild units owned by player
          if (state.playerName && (data.playerBoards || data.playerBenches)) {
            const playerBoard = data.playerBoards?.[state.playerName] || [];
            const playerBench = data.playerBenches?.[state.playerName] || [];
            const playerUnits = [...playerBoard, ...playerBench];
            
            // Count total STARS on wild Pokemon (game counts stars for +1% per star boost)
            let wildStars = 0;
            playerUnits.forEach(unit => {
              if (unit.name && isWildPokemon(unit.name)) {
                wildStars += unit.stars || 1;
              }
            });
            
            // Update if changed
            if (wildStars !== state.wildUnitsOwned) {
              state.wildUnitsOwned = wildStars;
              const wildOwnedInput = document.getElementById('pacWildOwned');
              if (wildOwnedInput) {
                wildOwnedInput.value = wildStars;
              }
              // Re-render fishing tab if visible (wild affects Remoraid chance)
              if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
                renderFishingTab();
              }
            }
            
            // MLG Mode - Check for evolutions (3-of-a-kind upgrades)
            if (state.mlgModeEnabled) {
              checkForEvolutions(playerBoard, playerBench);
            }
            
            // ═══════════════════════════════════════════════════════════════════════════
            // FISHING AUTO-DETECT: Mantine/Mantyke, Remoraid, Octillery
            // ═══════════════════════════════════════════════════════════════════════════
            let hasMantineOrMantyke = false;
            let hasOctillery = false;
            let remoraidsOwned = 0;
            
            playerUnits.forEach(unit => {
              if (!unit.name) return;
              const upperName = unit.name.toUpperCase();
              
              // Check for Mantine or Mantyke
              if (upperName === 'MANTINE' || upperName === 'MANTYKE') {
                hasMantineOrMantyke = true;
              }
              
              // Check for Octillery (locks out Remoraid fishing)
              if (upperName === 'OCTILLERY') {
                hasOctillery = true;
              }
              
              // Count Remoraid
              if (upperName === 'REMORAID') {
                remoraidsOwned += 1;
              }
            });
            
            // Update fishing state
            if (state.fishingMantyke !== hasMantineOrMantyke) {
              state.fishingMantyke = hasMantineOrMantyke;
              const mantykeToggle = document.getElementById('pacMantykeToggle');
              if (mantykeToggle) {
                mantykeToggle.checked = hasMantineOrMantyke;
              }
            }
            
            if (state.fishingOctilleryLocked !== hasOctillery) {
              state.fishingOctilleryLocked = hasOctillery;
            }
            
            if (state.fishingRemoraidsOwned !== remoraidsOwned) {
              state.fishingRemoraidsOwned = remoraidsOwned;
            }
            
            // Always re-render fishing tab when visible (ensures live updates)
            if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
              renderFishingTab();
            }
            
            // Auto-count wild COPIES on OTHER players' boards (for pool depletion)
            // 1★ = 1 copy, 2★ = 3 copies, 3★ = 9 copies
            // Track per-rarity to avoid cross-contamination
            const wildCopiesScoutedByRarity = { common: 0, uncommon: 0, rare: 0, epic: 0, ultra: 0 };
            const allBoards = data.playerBoards || {};
            const allBenches = data.playerBenches || {};
            
            Object.keys(allBoards).forEach(playerName => {
              if (playerName !== state.playerName) {
                const board = allBoards[playerName] || [];
                board.forEach(unit => {
                  if (unit.name && isWildPokemon(unit.name)) {
                    const baseForm = getBaseForm(unit.name);
                    const pokemonData = POKEMON_DATA[baseForm];
                    const rarity = pokemonData?.rarity;
                    if (rarity && wildCopiesScoutedByRarity.hasOwnProperty(rarity)) {
                      const stars = unit.stars || 1;
                      const copies = stars === 3 ? 9 : stars === 2 ? 3 : 1;
                      wildCopiesScoutedByRarity[rarity] += copies;
                    }
                  }
                });
              }
            });
            
            Object.keys(allBenches).forEach(playerName => {
              if (playerName !== state.playerName) {
                const bench = allBenches[playerName] || [];
                bench.forEach(unit => {
                  if (unit.name && isWildPokemon(unit.name)) {
                    const baseForm = getBaseForm(unit.name);
                    const pokemonData = POKEMON_DATA[baseForm];
                    const rarity = pokemonData?.rarity;
                    if (rarity && wildCopiesScoutedByRarity.hasOwnProperty(rarity)) {
                      const stars = unit.stars || 1;
                      const copies = stars === 3 ? 9 : stars === 2 ? 3 : 1;
                      wildCopiesScoutedByRarity[rarity] += copies;
                    }
                  }
                });
              }
            });
            
            // Update if changed (compare total for simple change detection)
            const newTotal = Object.values(wildCopiesScoutedByRarity).reduce((a, b) => a + b, 0);
            const oldTotal = Object.values(state.wildUnitsTaken).reduce((a, b) => a + b, 0);
            if (newTotal !== oldTotal) {
              state.wildUnitsTaken = { ...wildCopiesScoutedByRarity };
              const wildScoutedInput = document.getElementById('pacWildScouted');
              if (wildScoutedInput) {
                wildScoutedInput.value = newTotal;
              }
            }
          }
          
          // Update Counter Intelligence panel with all player data
          if (data.playerBoards || data.playerBenches || data.playerShops) {
            updateCounterIntelDisplay();
          }
          
          // Always recalculate
          updateDisplay();
          
          // Always re-render fishing tab if visible (live updates)
          if (state.shopHistoryPanelExpanded && state.analyticsTab === 'fishing') {
            renderFishingTab();
          }
        } else {
          if (isConnected) {
            isConnected = false;
            document.getElementById('pacStatusDot').classList.remove('connected');
            document.getElementById('pacLiveIndicator').style.display = 'none';
            if (DEBUG_MODE) console.log('🎮 PAC Calculator: Disconnected');
          }
        }
      }
    });

    // Wait for extractor to load, then start polling
    setTimeout(() => {
      // Request extraction at selected speed
      extractionInterval = setInterval(() => {
        window.postMessage({ type: 'PAC_EXTRACT_REQUEST' }, '*');
      }, currentPollSpeed);
      
      // Initial request
      window.postMessage({ type: 'PAC_EXTRACT_REQUEST' }, '*');
    }, 1000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUT
  // ═══════════════════════════════════════════════════════════════════════════

  function setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      // Shift+Alt+P to toggle overlay
      if (e.shiftKey && e.altKey && e.key === 'P') {
        e.preventDefault();
        const overlay = document.getElementById('pac-calc-overlay');
        if (overlay) {
          overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
        }
      }
      
      // Shift+Alt+R to reset overlay position to center
      if (e.shiftKey && e.altKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        const overlay = document.getElementById('pac-calc-overlay');
        if (overlay) {
          overlay.style.left = '50%';
          overlay.style.top = '50%';
          overlay.style.right = 'auto';
          overlay.style.transform = 'translate(-50%, -50%)';
          // Clear saved position
          localStorage.removeItem('pac-calc-position');
          showNotification('Position reset to center', 'info');
        }
      }
      
      // Shift+Alt+Y to unlock experimental features (when pending)
      if (e.shiftKey && e.altKey && (e.key === 'Y' || e.key === 'y')) {
        e.preventDefault();
        if (state.experimentalPending) {
          activateExperimentalMode();
        }
      }
    });
  }
  
  /**
   * Activate experimental mode after ALT+SHIFT+Y confirmation
   */
  function activateExperimentalMode() {
    state.experimentalMode = true;
    state.experimentalPending = false;
    state.refreshBlockerEnabled = true;
    
    const expBtn = document.getElementById('pacExpBtn');
    if (expBtn) {
      expBtn.classList.remove('pending');
      expBtn.classList.add('active');
      expBtn.title = 'Experimental Features ACTIVE';
    }
    
    // Show synergy bar
    const synergyBar = document.getElementById('pacSynergyBar');
    if (synergyBar) {
      synergyBar.classList.add('visible');
    }
    
    // Show mono-type panel
    const monoPanel = document.getElementById('pacMonoPanel');
    if (monoPanel) {
      monoPanel.classList.add('visible');
    }
    
    showNotification('🧪 Experimental features activated!', 'success');
    if (DEBUG_MODE) console.log('🧪 Experimental mode activated');
  }
  
  /**
   * Deactivate experimental mode
   */
  function deactivateExperimentalMode() {
    state.experimentalMode = false;
    state.experimentalPending = false;
    state.refreshBlockerEnabled = false;
    state.monoTypeEnabled = false;
    state.monoTypeSelected = null;
    state.randomDraftEnabled = false;
    state.randomDraftChosenSlot = null;
    state.randomDraftSpinning = false;
    state.copycatEnabled = false;
    state.mlgModeEnabled = false;
    hideRefreshBlocker();
    clearMonoTypeBlockers();
    clearRandomDraftOverlays();
    clearCopycatBlockers();
    clearTargetHighlighters();
    // Clear MLG overlays
    document.querySelectorAll('.pac-mlg-hitmarker, .pac-mlg-text, .pac-mlg-lensflare, .pac-mlg-illuminati, .pac-mlg-dorito, .pac-mlg-sample, .pac-mlg-360, .pac-mlg-airhorn, .pac-mlg-weed, .pac-mlg-snoop').forEach(el => el.remove());
    
    const expBtn = document.getElementById('pacExpBtn');
    if (expBtn) {
      expBtn.classList.remove('pending', 'active');
      expBtn.title = 'Experimental Features';
    }
    
    // Hide synergy bar
    const synergyBar = document.getElementById('pacSynergyBar');
    if (synergyBar) {
      synergyBar.classList.remove('visible');
    }
    
    // Hide mono-type panel
    const monoPanel = document.getElementById('pacMonoPanel');
    if (monoPanel) {
      monoPanel.classList.remove('visible', 'expanded');
    }
    
    // Reset draft panel UI
    const draftToggle = document.getElementById('pacDraftToggle');
    const draftStatus = document.getElementById('pacDraftStatus');
    if (draftToggle) {
      draftToggle.textContent = 'Start';
      draftToggle.classList.remove('active');
    }
    if (draftStatus) {
      draftStatus.classList.remove('active');
    }
    
    // Reset copycat panel UI
    const copycatToggle = document.getElementById('pacCopycatToggle');
    const copycatStatus = document.getElementById('pacCopycatStatus');
    if (copycatToggle) {
      copycatToggle.textContent = 'Start';
      copycatToggle.classList.remove('active');
    }
    if (copycatStatus) {
      copycatStatus.classList.remove('active');
    }
    
    // Reset MLG panel UI
    const mlgToggle = document.getElementById('pacMlgToggle');
    const mlgStatus = document.getElementById('pacMlgStatus');
    if (mlgToggle) {
      mlgToggle.textContent = 'Start';
      mlgToggle.classList.remove('active');
    }
    if (mlgStatus) {
      mlgStatus.classList.remove('active');
    }
    
    showNotification('Experimental features deactivated', 'info');
    if (DEBUG_MODE) console.log('🧪 Experimental mode deactivated');
  }
  
  /**
   * Setup experimental button handler
   */
  function setupExperimentalButton() {
    const expBtn = document.getElementById('pacExpBtn');
    if (!expBtn) return;
    
    expBtn.addEventListener('click', () => {
      if (state.experimentalMode) {
        // Already active - deactivate
        deactivateExperimentalMode();
      } else if (state.experimentalPending) {
        // Cancel pending
        state.experimentalPending = false;
        expBtn.classList.remove('pending');
        showNotification('Experimental activation cancelled', 'info');
      } else {
        // Start pending - wait for ALT+SHIFT+Y
        state.experimentalPending = true;
        expBtn.classList.add('pending');
        showNotification('Enable with hotkeys', 'info');
      }
    });
  }

  // Prevent keyboard events from bubbling to game when typing in calculator
  function setupInputProtection() {
    const overlay = document.getElementById('pac-calc-overlay');
    const teamPanel = document.getElementById('pac-team-panel');
    const currentPanel = document.getElementById('pac-current-panel');
    
    const panels = [overlay, teamPanel, currentPanel].filter(Boolean);
    
    panels.forEach(panel => {
      // Stop all keyboard events from reaching the game
      ['keydown', 'keyup', 'keypress'].forEach(eventType => {
        panel.addEventListener(eventType, (e) => {
          // Only stop propagation if we're in an input field
          const target = e.target;
          const isInput = target.tagName === 'INPUT' || 
                         target.tagName === 'TEXTAREA' || 
                         target.tagName === 'SELECT' ||
                         target.isContentEditable;
          
          if (isInput) {
            e.stopPropagation();
          }
        }, true); // Use capture phase to catch events early
      });
    });
    
    if (DEBUG_MODE) console.log('🛡️ Input protection enabled - keyboard events won\'t reach game');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTAL/REGIONAL DETECTION (v3.0.2)
  // ═══════════════════════════════════════════════════════════════════════════
  

  let lastKnownStage = null;
  
  /**
   * Sync detected Pokemon to pool calculation counts
   * This bridges the detection system with the probability calculations
   */
  function syncDetectionToPools() {
    // Reset all detection-based counts first
    // (We'll recalculate from scratch based on resolved slots)
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    
    // Track counts from detection
    const detectedRegionals = { normal: {}, wild: {} };
    const detectedAdditional = { normal: {}, wild: {} };
    
    rarities.forEach(r => {
      detectedRegionals.normal[r] = { twoStar: 0, threeStar: 0 };
      detectedRegionals.wild[r] = { twoStar: 0, threeStar: 0 };
      detectedAdditional.normal[r] = { twoStar: 0, threeStar: 0 };
      detectedAdditional.wild[r] = { twoStar: 0, threeStar: 0 };
    });
    
    // Process regional slots
    state.regionalSlots.forEach(slot => {
      if (!slot.resolved) return;
      
      const pokemon = slot.resolved;
      const data = POKEMON_DATA[pokemon];
      if (!data) return;
      
      const rarity = data.rarity;
      if (!rarities.includes(rarity)) return;
      
      const isWild = data.types.includes('wild');
      const baseForm = getBaseForm(pokemon);
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const starType = maxStars === 2 ? 'twoStar' : 'threeStar';
      
      if (isWild) {
        detectedRegionals.wild[rarity][starType]++;
      } else {
        detectedRegionals.normal[rarity][starType]++;
      }
    });
    
    // Process additional slots
    state.additionalSlots.forEach(slot => {
      if (!slot.resolved) return;
      
      const pokemon = slot.resolved;
      const data = POKEMON_DATA[pokemon];
      if (!data) return;
      
      const rarity = data.rarity;
      if (!rarities.includes(rarity)) return;
      
      const isWild = data.types.includes('wild');
      const baseForm = getBaseForm(pokemon);
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const starType = maxStars === 2 ? 'twoStar' : 'threeStar';
      
      if (isWild) {
        detectedAdditional.wild[rarity][starType]++;
      } else {
        detectedAdditional.normal[rarity][starType]++;
      }
    });
    
    // Update state with detected counts
    // Regional Pokemon → portalRegionals (normal) and wildRegionals (wild)
    rarities.forEach(r => {
      state.portalRegionals[r].twoStar = detectedRegionals.normal[r].twoStar;
      state.portalRegionals[r].threeStar = detectedRegionals.normal[r].threeStar;
      state.wildRegionals[r].twoStar = detectedRegionals.wild[r].twoStar;
      state.wildRegionals[r].threeStar = detectedRegionals.wild[r].threeStar;
    });
    
    // Additional Pokemon → round checkboxes + add picks count (normal) and wildAddPicks (wild)
    // Count non-wild add picks by rarity
    const normalAddPickCounts = {
      uncommon: detectedAdditional.normal.uncommon.twoStar + detectedAdditional.normal.uncommon.threeStar,
      rare: detectedAdditional.normal.rare.twoStar + detectedAdditional.normal.rare.threeStar,
      epic: detectedAdditional.normal.epic.twoStar + detectedAdditional.normal.epic.threeStar
    };
    
    // Enable round checkboxes and set counts based on detected add picks
    if (normalAddPickCounts.uncommon > 0) {
      state.round5Enabled = true;
      state.round5AddPicks = normalAddPickCounts.uncommon;
      const checkbox = document.getElementById('pacRound5');
      if (checkbox) checkbox.checked = true;
      const inputDiv = document.getElementById('pacRound5Input');
      if (inputDiv) inputDiv.classList.remove('hidden');
      const input = document.getElementById('pacRound5Picks');
      if (input) input.value = normalAddPickCounts.uncommon;
    }
    
    if (normalAddPickCounts.rare > 0) {
      state.round8Enabled = true;
      state.round8AddPicks = normalAddPickCounts.rare;
      const checkbox = document.getElementById('pacRound8');
      if (checkbox) checkbox.checked = true;
      const inputDiv = document.getElementById('pacRound8Input');
      if (inputDiv) inputDiv.classList.remove('hidden');
      const input = document.getElementById('pacRound8Picks');
      if (input) input.value = normalAddPickCounts.rare;
    }
    
    if (normalAddPickCounts.epic > 0) {
      state.round11Enabled = true;
      state.round11AddPicks = normalAddPickCounts.epic;
      const checkbox = document.getElementById('pacRound11');
      if (checkbox) checkbox.checked = true;
      const inputDiv = document.getElementById('pacRound11Input');
      if (inputDiv) inputDiv.classList.remove('hidden');
      const input = document.getElementById('pacRound11Picks');
      if (input) input.value = normalAddPickCounts.epic;
    }
    
    // Wild add picks
    state.wildAddPicks.uncommon = detectedAdditional.wild.uncommon.twoStar + detectedAdditional.wild.uncommon.threeStar;
    state.wildAddPicks.rare = detectedAdditional.wild.rare.twoStar + detectedAdditional.wild.rare.threeStar;
    state.wildAddPicks.epic = detectedAdditional.wild.epic.twoStar + detectedAdditional.wild.epic.threeStar;
    
    if (DEBUG_MODE) {
      console.log('🔄 Synced detection to pools:', {
        portalRegionals: state.portalRegionals,
        wildRegionals: state.wildRegionals,
        round5: { enabled: state.round5Enabled, picks: state.round5AddPicks },
        round8: { enabled: state.round8Enabled, picks: state.round8AddPicks },
        round11: { enabled: state.round11Enabled, picks: state.round11AddPicks },
        wildAddPicks: state.wildAddPicks
      });
    }
    
    // Recalculate probabilities
    updateDisplay();
  }
  
  function setupPortalDetection() {
    
    // Show the detection panel
    function showDetectionPanel() {
      const panel = document.getElementById('pacDetectionPanel');
      if (panel) panel.style.display = 'block';
    }
    
    // Generate unique slot key from rarity + types
    function slotKey(rarity, types) {
      return `${rarity}:${[...types].sort().join(',')}`;
    }
    
    // Extract slots from panel (returns array of {rarity, types, matches})
    function extractSlotsFromPanel(panelDiv, isRegional) {
      const portraits = panelDiv.querySelectorAll('.game-pokemon-portrait');
      const slots = [];
      
      portraits.forEach(p => {
        const bgColor = p.style.backgroundColor;
        const rarity = RARITY_COLORS[bgColor] || 'unknown';
        const typeIcons = p.querySelectorAll('.synergy-icon');
        const types = Array.from(typeIcons).map(icon => icon.alt.toLowerCase());
        
        // Find matching Pokemon
        const matches = identifyPokemonByTypesAndRarity(rarity, types, isRegional);
        
        if (matches.length > 0) {
          let resolved = null;
          
          if (matches.length === 1) {
            // Single match - auto-resolve
            resolved = matches[0];
          } else {
            // Multiple matches - find which ones are TRUE base forms
            // A Pokemon is a base form if getBaseForm(name) === name
            const baseForms = matches.filter(name => {
              const base = getBaseForm(name);
              return base === name;
            });
            
            const evolvedForms = matches.filter(name => {
              const base = getBaseForm(name);
              return base !== name;
            });
            
            if (baseForms.length === 1 && evolvedForms.length > 0) {
              // Clear winner - only one base form, rest are evolutions
              resolved = baseForms[0];
              if (DEBUG_MODE) console.log(`🔄 Auto-resolved to base form: ${resolved}`, { baseForms, evolvedForms });
            } else if (baseForms.length > 1) {
              // Multiple base forms (e.g., Pidgey, Starly, Taillow) - user must choose
              if (DEBUG_MODE) console.log(`❓ Multiple base forms, user must choose:`, baseForms);
            } else if (baseForms.length === 0 && evolvedForms.length > 0) {
              // All are evolved forms - pick the one with lowest evolution stage
              // This shouldn't normally happen, but handle it gracefully
              if (DEBUG_MODE) console.log(`⚠️ No base forms found, showing all:`, matches);
            }
          }
          
          slots.push({
            rarity,
            types,
            matches,
            resolved
          });
        }
      });
      
      return slots;
    }
    
    // Get resolved Pokemon names from slots
    function getResolvedNames(slots) {
      return slots
        .filter(s => s.resolved)
        .map(s => s.resolved);
    }
    
    // Render slots as clickable chips
    function renderSlots(slots, containerId, slotType) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      if (slots.length === 0) {
        container.innerHTML = '<span style="color: #666; font-size: 11px;">Not detected yet</span>';
        return;
      }
      
      const html = slots.map((slot, slotIndex) => {
        if (slot.resolved) {
          // Resolved - show single confirmed chip
          const data = POKEMON_DATA[slot.resolved] || {};
          const rarity = data.rarity || 'unknown';
          return `<span class="pac-pokemon-chip ${rarity}" style="opacity: 1;">${slot.resolved}</span>`;
        } else {
          // Unresolved - show all matches as clickable
          return slot.matches.map(name => {
            const data = POKEMON_DATA[name] || {};
            const rarity = data.rarity || 'unknown';
            return `<span class="pac-pokemon-chip ${rarity}" style="opacity: 0.6; cursor: pointer; border: 1px dashed rgba(255,255,255,0.3);" data-slot-type="${slotType}" data-slot-index="${slotIndex}" data-pokemon="${name}">${name}?</span>`;
          }).join('');
        }
      }).join('');
      
      container.innerHTML = html;
      
      // Add click handlers for unresolved chips
      container.querySelectorAll('[data-pokemon]').forEach(chip => {
        chip.addEventListener('click', () => {
          const type = chip.dataset.slotType;
          const index = parseInt(chip.dataset.slotIndex);
          const pokemon = chip.dataset.pokemon;
          resolveSlot(type, index, pokemon);
        });
      });
    }
    
    // Resolve a slot to a specific Pokemon
    function resolveSlot(slotType, slotIndex, pokemonName) {
      const slots = slotType === 'regional' ? state.regionalSlots : state.additionalSlots;
      if (slots[slotIndex]) {
        slots[slotIndex].resolved = pokemonName;
        
        // Update the active arrays
        if (slotType === 'regional') {
          state.activeRegionalPokemon = getResolvedNames(state.regionalSlots);
          updateRegionalDisplay();
        } else {
          state.activeAdditionalPokemon = getResolvedNames(state.additionalSlots);
          updateAddPicksDisplay();
        }
        
        // Sync to pool calculations
        syncDetectionToPools();
        
        updateAvailabilityWarnings();
        if (DEBUG_MODE) console.log(`✅ Resolved ${slotType} slot ${slotIndex} to ${pokemonName}`);
      }
    }
    
    // Update regional display
    function updateRegionalDisplay() {
      const statusEl = document.getElementById('pacRegionalStatus');
      if (statusEl) {
        const resolved = state.regionalSlots.filter(s => s.resolved).length;
        const total = state.regionalSlots.length;
        statusEl.textContent = total > 0 ? `(${resolved}/${total} confirmed)` : '(Hover icon to detect)';
      }
      renderSlots(state.regionalSlots, 'pacRegionalList', 'regional');
    }
    
    // Update add picks display
    function updateAddPicksDisplay() {
      const statusEl = document.getElementById('pacAddPicksStatus');
      if (statusEl) {
        const resolved = state.additionalSlots.filter(s => s.resolved).length;
        const total = state.additionalSlots.length;
        statusEl.textContent = total > 0 ? `(${resolved}/${total} confirmed)` : '(Hover icon to detect)';
      }
      renderSlots(state.additionalSlots, 'pacAddPicksList', 'additional');
    }
    
    // Merge new slots into existing (avoid duplicates)
    function mergeSlots(existing, newSlots, isRegional = false) {
      // For regionals: if the count changed significantly, it's likely a new region - replace entirely
      if (isRegional && existing.length > 0 && newSlots.length > 0) {
        const existingKeys = new Set(existing.map(s => slotKey(s.rarity, s.types)));
        const newKeys = new Set(newSlots.map(s => slotKey(s.rarity, s.types)));
        
        // Count how many slots are completely new (not in existing)
        let newCount = 0;
        newKeys.forEach(key => {
          if (!existingKeys.has(key)) newCount++;
        });
        
        // If more than half are new, or counts are very different, replace entirely
        if (newCount > newSlots.length / 2 || Math.abs(existing.length - newSlots.length) > 2) {
          if (DEBUG_MODE) console.log('🔄 Region change detected - replacing slots entirely');
          return newSlots;
        }
      }
      
      // Otherwise merge (add new, keep existing)
      const existingKeys = new Set(existing.map(s => slotKey(s.rarity, s.types)));
      
      newSlots.forEach(slot => {
        const key = slotKey(slot.rarity, slot.types);
        if (!existingKeys.has(key)) {
          existing.push(slot);
          existingKeys.add(key);
        }
      });
      
      return existing;
    }
    
    // Attach icon listeners
    function attachListeners() {
      // Regional icon
      if (!state.regionalListenerAttached) {
        const regionalIcon = document.querySelector('img[data-tooltip-id="game-regional-pokemons"]');
        if (regionalIcon) {
          regionalIcon.addEventListener('mouseenter', () => {
            setTimeout(() => {
              const div = document.querySelector('.game-regional-pokemons');
              if (div) {
                const newSlots = extractSlotsFromPanel(div, true);
                if (newSlots.length > 0) {
                  state.regionalSlots = mergeSlots(state.regionalSlots, newSlots, true);
                  state.activeRegionalPokemon = getResolvedNames(state.regionalSlots);
                  if (DEBUG_MODE) console.log('🌍 Regional slots:', state.regionalSlots);
                  updateRegionalDisplay();
                  syncDetectionToPools();
                  updateAvailabilityWarnings();
                }
              }
            }, 150);
          });
          state.regionalListenerAttached = true;
          if (DEBUG_MODE) console.log('👁️ Regional icon listener attached');
        }
      }
      
      // Additional icon
      if (!state.additionalListenerAttached) {
        const additionalIcon = document.querySelector('img[data-tooltip-id="game-additional-pokemons"]');
        if (additionalIcon) {
          additionalIcon.addEventListener('mouseenter', () => {
            setTimeout(() => {
              const div = document.querySelector('.game-additional-pokemons');
              if (div) {
                const newSlots = extractSlotsFromPanel(div, false);
                if (newSlots.length > 0) {
                  state.additionalSlots = mergeSlots(state.additionalSlots, newSlots);
                  state.activeAdditionalPokemon = getResolvedNames(state.additionalSlots);
                  if (DEBUG_MODE) console.log('🎯 Additional slots:', state.additionalSlots);
                  updateAddPicksDisplay();
                  syncDetectionToPools();
                  updateAvailabilityWarnings();
                }
              }
            }, 150);
          });
          state.additionalListenerAttached = true;
          if (DEBUG_MODE) console.log('👁️ Additional icon listener attached');
        }
      }
      
      // Reset button
      const resetBtn = document.getElementById('pacResetDetection');
      if (resetBtn && !resetBtn.dataset.listenerAttached) {
        resetBtn.addEventListener('click', resetGameDetection);
        resetBtn.dataset.listenerAttached = 'true';
      }
    }
    
    // Check for new game (stage reset)
    function checkForNewGame() {
      const stage = state.currentStage;
      if (stage && lastKnownStage && lastKnownStage > 5 && stage <= 2) {
        // Stage dropped from mid-game to start - new game!
        if (DEBUG_MODE) console.log(`🆕 New game detected (stage ${lastKnownStage} → ${stage})`);
        resetGameDetection();
        
        // Reset Ditto (new game starts below stage 6)
        state.dittoEnabled = false;
        const dittoCheckbox = document.getElementById('pacDitto');
        if (dittoCheckbox) dittoCheckbox.checked = false;
      }
      lastKnownStage = stage;
    }
    
    // Poll loop
    function pollLoop() {
      attachListeners();
      checkForNewGame();
      
      // Show panel if we have data or live tracking is on
      const liveStatus = document.getElementById('pacLiveStatus');
      if (liveStatus?.textContent === 'ON' || state.regionalSlots.length > 0 || state.additionalSlots.length > 0) {
        showDetectionPanel();
      }
    }
    
    setInterval(pollLoop, 2000);
    pollLoop();
    
    if (DEBUG_MODE) console.log('👁️ Game detection system initialized');
  }
  
  /**
   * Update availability warnings for tracked Pokemon
   */
  function updateAvailabilityWarnings() {
    // Update main target warning
    if (state.targetPokemon) {
      const availability = checkPokemonAvailability(
        state.targetPokemon, 
        state.activeRegionalPokemon, 
        state.activeAdditionalPokemon
      );
      
      const warningEl = document.getElementById('pacPortalWarning');
      if (warningEl) {
        if (!availability.available) {
          warningEl.textContent = `⚠️ ${availability.reason}`;
          warningEl.style.display = 'block';
        } else {
          warningEl.style.display = 'none';
        }
      }
    }
    
    // Update team target warnings
    state.teamTargets.forEach(target => {
      const availability = checkPokemonAvailability(
        target.pokemon,
        state.activeRegionalPokemon,
        state.activeAdditionalPokemon
      );
      
      const row = document.querySelector(`[data-target-id="${target.id}"]`);
      if (row) {
        const warningIcon = row.querySelector('.availability-warning');
        if (!availability.available) {
          if (!warningIcon) {
            const icon = document.createElement('span');
            icon.className = 'availability-warning';
            icon.textContent = '⚠️';
            icon.title = availability.reason;
            icon.style.cssText = 'margin-left: 4px; cursor: help;';
            row.querySelector('.team-pokemon-name')?.appendChild(icon);
          }
        } else if (warningIcon) {
          warningIcon.remove();
        }
      }
    });
  }
  
  /**
   * Reset detection for new game
   */
  function resetGameDetection() {
    state.activeRegionalPokemon = [];
    state.activeAdditionalPokemon = [];
    state.regionalSlots = [];
    state.additionalSlots = [];
    
    // Reset listener flags so they re-attach to new DOM elements
    state.regionalListenerAttached = false;
    state.additionalListenerAttached = false;
    
    // Reset pool calculation state
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    rarities.forEach(r => {
      state.portalRegionals[r] = { twoStar: 0, threeStar: 0 };
      state.wildRegionals[r] = { twoStar: 0, threeStar: 0 };
    });
    state.wildAddPicks = { uncommon: 0, rare: 0, epic: 0 };
    
    // Reset round checkboxes and counts
    state.round5Enabled = false;
    state.round5AddPicks = 8;
    state.round8Enabled = false;
    state.round8AddPicks = 8;
    state.round11Enabled = false;
    state.round11AddPicks = 8;
    
    // Reset shop history / roll luck tracker
    clearShopHistory();
    
    // Reset UI elements
    const regionalList = document.getElementById('pacRegionalList');
    const addPicksList = document.getElementById('pacAddPicksList');
    const regionalStatus = document.getElementById('pacRegionalStatus');
    const addPicksStatus = document.getElementById('pacAddPicksStatus');
    
    if (regionalList) regionalList.innerHTML = '<span style="color: #666; font-size: 11px;">Not detected yet</span>';
    if (addPicksList) addPicksList.innerHTML = '<span style="color: #666; font-size: 11px;">Not detected yet</span>';
    if (regionalStatus) regionalStatus.textContent = '(Hover icon to detect)';
    if (addPicksStatus) addPicksStatus.textContent = '(Hover icon to detect)';
    
    // Recalculate
    updateDisplay();
    
    if (DEBUG_MODE) console.log('🔄 Game detection reset');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SYNERGY BAR (Experimental Feature)
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get all unique synergy types from POKEMON_DATA
   */
  function getAllSynergies() {
    const synergies = new Set();
    Object.values(POKEMON_DATA).forEach(data => {
      if (data.types) {
        data.types.forEach(type => synergies.add(type));
      }
    });
    // Sort alphabetically
    return Array.from(synergies).sort();
  }
  
  /**
   * Get all base pool Pokemon of a specific synergy type
   */
  function getPokemonBySynergy(synergyType) {
    const results = [];
    
    for (const [name, data] of Object.entries(POKEMON_DATA)) {
      // Must have the synergy type
      if (!data.types || !data.types.includes(synergyType)) continue;
      
      // Must be a base form
      const baseForm = getBaseForm(name);
      if (baseForm !== name) continue;
      
      // Must be in pool rarities (not legendary, unique, special, hatch)
      if (!POOL_RARITIES.includes(data.rarity)) continue;
      
      // Must be in base pool (not regional-only or additional-only)
      // regional-only means: regional=true AND additional=false AND not in base pool
      // We want Pokemon that are either:
      // 1. regional=false AND additional=false (pure base pool)
      // 2. regional=true AND additional=true (available via both)
      // We exclude:
      // - regional=true AND additional=false (regional-only)
      // - regional=false AND additional=true (add-pick-only)
      
      if (data.regional && !data.additional) continue; // Regional-only
      if (!data.regional && data.additional) continue; // Add-pick-only
      
      results.push({
        name,
        rarity: data.rarity,
        types: data.types,
        isWild: data.types.includes('wild')
      });
    }
    
    return results;
  }
  
  /**
   * Populate the synergy bar with buttons
   */
  function populateSynergyBar() {
    const bar = document.getElementById('pacSynergyBar');
    if (!bar) return;
    
    const synergies = getAllSynergies();
    
    bar.innerHTML = synergies.map(synergy => {
      const count = getPokemonBySynergy(synergy).length;
      return `<button class="pac-synergy-btn" data-synergy="${synergy}">${synergy} (${count})</button>`;
    }).join('');
    
    // Add click handlers
    bar.querySelectorAll('.pac-synergy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const synergy = btn.dataset.synergy;
        addSynergyToTeamTracker(synergy);
      });
    });
    
    // Mouse wheel horizontal scroll
    bar.addEventListener('wheel', (e) => {
      e.preventDefault();
      bar.scrollLeft += e.deltaY;
    }, { passive: false });
    
    if (DEBUG_MODE) console.log(`🎨 Synergy bar populated with ${synergies.length} synergies`);
  }
  
  /**
   * Add all Pokemon of a synergy type to team tracker
   */
  function addSynergyToTeamTracker(synergyType) {
    const pokemon = getPokemonBySynergy(synergyType);
    
    if (pokemon.length === 0) {
      showNotification(`No base pool Pokemon found for ${synergyType}`, 'warning');
      return;
    }
    
    let addedCount = 0;
    let skippedCount = 0;
    
    pokemon.forEach(pkmn => {
      // Check if already in team tracker
      const exists = state.teamTargets.some(t => 
        t.pokemon.toUpperCase() === pkmn.name.toUpperCase()
      );
      
      if (exists) {
        skippedCount++;
        return;
      }
      
      // Get evolution data
      const baseForm = pkmn.name;
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const evo = maxStars === 3 ? 'threeStar' : 'twoStar';
      
      // Add to team tracker
      state.teamTargets.push({
        id: Date.now() + Math.random(),
        pokemon: baseForm,
        displayName: baseForm.charAt(0) + baseForm.slice(1).toLowerCase(),
        rarity: pkmn.rarity,
        evo: evo,
        isWild: pkmn.isWild,
        enabled: true,
        copiesTaken: 0
      });
      
      addedCount++;
    });
    
    // Save to localStorage
    localStorage.setItem('pac_teamTargets', JSON.stringify(state.teamTargets));
    
    // Update display
    updateTeamDisplay();
    
    showNotification(`Added ${addedCount} ${synergyType} Pokemon (${skippedCount} already tracked)`, 'success');
    if (DEBUG_MODE) console.log(`🎨 Added ${addedCount} ${synergyType} Pokemon to team tracker`);
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // TEAM TRACKER PANEL (v2.8.0)
  // ═══════════════════════════════════════════════════════════════════════════
  
  function setupTeamPanel() {
    const panel = document.getElementById('pac-team-panel');
    const toggleBtn = document.getElementById('pacTeamToggle');
    const closeBtn = document.getElementById('pacTeamClose');
    const addInput = document.getElementById('pacTeamAddInput');
    const addBtn = document.getElementById('pacTeamAddBtn');
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close current panel if open
      if (state.currentPanelExpanded) {
        const currentPanel = document.getElementById('pac-current-panel');
        state.currentPanelExpanded = false;
        currentPanel.classList.remove('expanded');
      }
      // Close settings panel if open
      if (state.settingsPanelExpanded) {
        const settingsPanel = document.getElementById('pac-settings-panel');
        state.settingsPanelExpanded = false;
        settingsPanel.classList.remove('expanded');
      }
      // Close history panel if open
      if (state.shopHistoryPanelExpanded) {
        const historyPanel = document.getElementById('pac-history-panel');
        state.shopHistoryPanelExpanded = false;
        historyPanel.classList.remove('expanded');
      }
      
      state.teamPanelExpanded = !state.teamPanelExpanded;
      panel.classList.toggle('expanded', state.teamPanelExpanded);
    });
    
    closeBtn.addEventListener('click', () => {
      state.teamPanelExpanded = false;
      panel.classList.remove('expanded');
      // Hide dropdown if open
      const dropdown = document.getElementById('pacTeamDropdown');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
    
    // Setup autocomplete for team add input
    setupTeamAutocomplete(addInput);
    
    // Add Pokemon via button
    addBtn.addEventListener('click', () => {
      const pokemon = addInput.value.trim();
      if (pokemon) {
        addTeamTarget(pokemon);
        addInput.value = '';
      }
    });
    
    // Add Pokemon via Enter key
    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const pokemon = addInput.value.trim();
        if (pokemon) {
          addTeamTarget(pokemon);
          addInput.value = '';
        }
      }
    });
    
    // Initial render
    updateTeamDisplay();
  }
  
  function setupCurrentPanel() {
    const panel = document.getElementById('pac-current-panel');
    const toggleBtn = document.getElementById('pacCurrentToggle');
    const closeBtn = document.getElementById('pacCurrentClose');
    
    if (!panel || !toggleBtn || !closeBtn) {
      console.error('Current panel elements not found');
      return;
    }
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close team panel if open
      if (state.teamPanelExpanded) {
        const teamPanel = document.getElementById('pac-team-panel');
        state.teamPanelExpanded = false;
        teamPanel.classList.remove('expanded');
      }
      // Close settings panel if open
      if (state.settingsPanelExpanded) {
        const settingsPanel = document.getElementById('pac-settings-panel');
        state.settingsPanelExpanded = false;
        settingsPanel.classList.remove('expanded');
      }
      // Close history panel if open
      if (state.shopHistoryPanelExpanded) {
        const historyPanel = document.getElementById('pac-history-panel');
        state.shopHistoryPanelExpanded = false;
        historyPanel.classList.remove('expanded');
      }
      
      state.currentPanelExpanded = !state.currentPanelExpanded;
      panel.classList.toggle('expanded', state.currentPanelExpanded);
    });
    
    closeBtn.addEventListener('click', () => {
      state.currentPanelExpanded = false;
      panel.classList.remove('expanded');
    });
    
    // Initial render
    updateCounterIntelDisplay();
  }
  
  function setupSettingsPanel() {
    const panel = document.getElementById('pac-settings-panel');
    const toggleBtn = document.getElementById('pacSettingsToggle');
    const closeBtn = document.getElementById('pacSettingsClose');
    const resetBtn = document.getElementById('pacSettingsReset');
    
    if (!panel || !toggleBtn || !closeBtn) {
      console.error('Settings panel elements not found');
      return;
    }
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close other panels if open
      if (state.teamPanelExpanded) {
        const teamPanel = document.getElementById('pac-team-panel');
        state.teamPanelExpanded = false;
        teamPanel.classList.remove('expanded');
      }
      if (state.currentPanelExpanded) {
        const currentPanel = document.getElementById('pac-current-panel');
        state.currentPanelExpanded = false;
        currentPanel.classList.remove('expanded');
      }
      if (state.shopHistoryPanelExpanded) {
        const historyPanel = document.getElementById('pac-history-panel');
        state.shopHistoryPanelExpanded = false;
        historyPanel.classList.remove('expanded');
      }
      
      state.settingsPanelExpanded = !state.settingsPanelExpanded;
      panel.classList.toggle('expanded', state.settingsPanelExpanded);
    });
    
    closeBtn.addEventListener('click', () => {
      state.settingsPanelExpanded = false;
      panel.classList.remove('expanded');
    });
    
    // Color inputs
    const bgColorInput = document.getElementById('pacSettingsBgColor');
    const textColorInput = document.getElementById('pacSettingsTextColor');
    const accentColorInput = document.getElementById('pacSettingsAccentColor');
    const targetFlashInput = document.getElementById('pacSettingsTargetFlash');
    const teamFlashInput = document.getElementById('pacSettingsTeamFlash');
    const flashSpeedInput = document.getElementById('pacSettingsFlashSpeed');
    const flashSpeedValue = document.getElementById('pacSettingsFlashSpeedValue');
    const fontSizeInput = document.getElementById('pacSettingsFontSize');
    const fontSizeValue = document.getElementById('pacSettingsFontSizeValue');
    const disableFlashInput = document.getElementById('pacSettingsDisableFlash');
    
    // Apply saved settings on load
    loadCustomSettings();
    
    // Color change handlers
    bgColorInput.addEventListener('input', (e) => {
      state.customSettings.backgroundColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    textColorInput.addEventListener('input', (e) => {
      state.customSettings.textColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    accentColorInput.addEventListener('input', (e) => {
      state.customSettings.accentColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    targetFlashInput.addEventListener('input', (e) => {
      state.customSettings.targetFlashColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    teamFlashInput.addEventListener('input', (e) => {
      state.customSettings.teamFlashColor = e.target.value;
      applyCustomSettings();
      saveCustomSettings();
    });
    
    flashSpeedInput.addEventListener('input', (e) => {
      state.customSettings.flashSpeed = parseInt(e.target.value);
      flashSpeedValue.textContent = e.target.value + 'ms';
      applyCustomSettings();
      saveCustomSettings();
    });
    
    fontSizeInput.addEventListener('input', (e) => {
      state.customSettings.fontSize = parseInt(e.target.value);
      fontSizeValue.textContent = e.target.value + 'px';
      applyCustomSettings();
      saveCustomSettings();
    });
    
    // Epilepsy toggle handler
    disableFlashInput.addEventListener('change', (e) => {
      state.customSettings.disableFlash = e.target.checked;
      applyCustomSettings();
      saveCustomSettings();
      
      // Update preview flash buttons
      const targetPreview = document.getElementById('pacPreviewTargetFlash');
      const teamPreview = document.getElementById('pacPreviewTeamFlash');
      if (targetPreview) targetPreview.classList.toggle('disabled', e.target.checked);
      if (teamPreview) teamPreview.classList.toggle('disabled', e.target.checked);
    });
    
    // Reset button
    resetBtn.addEventListener('click', () => {
      state.customSettings = {
        backgroundColor: '#dce8ec',
        textColor: '#000000',
        accentColor: '#00bcd4',
        targetFlashColor: '#2bff00',
        teamFlashColor: '#0033ff',
        flashSpeed: 250,
        fontSize: 12,
        disableFlash: false
      };
      
      // Update inputs
      bgColorInput.value = state.customSettings.backgroundColor;
      textColorInput.value = state.customSettings.textColor;
      accentColorInput.value = state.customSettings.accentColor;
      targetFlashInput.value = state.customSettings.targetFlashColor;
      teamFlashInput.value = state.customSettings.teamFlashColor;
      flashSpeedInput.value = state.customSettings.flashSpeed;
      flashSpeedValue.textContent = state.customSettings.flashSpeed + 'ms';
      fontSizeInput.value = state.customSettings.fontSize;
      fontSizeValue.textContent = state.customSettings.fontSize + 'px';
      disableFlashInput.checked = state.customSettings.disableFlash;
      
      // Reset preview flash buttons
      const targetPreview = document.getElementById('pacPreviewTargetFlash');
      const teamPreview = document.getElementById('pacPreviewTeamFlash');
      if (targetPreview) targetPreview.classList.remove('disabled');
      if (teamPreview) teamPreview.classList.remove('disabled');
      
      applyCustomSettings();
      saveCustomSettings();
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SHOP HISTORY / ROLL LUCK TRACKER
  // ═══════════════════════════════════════════════════════════════════════════
  
  function setupHistoryPanel() {
    const panel = document.getElementById('pac-history-panel');
    const toggleBtn = document.getElementById('pacHistoryToggle');
    const closeBtn = document.getElementById('pacHistoryClose');
    const clearBtn = document.getElementById('pacHistoryClear');
    const analyticsClearBtn = document.getElementById('pacAnalyticsClear');
    const tabBtns = document.querySelectorAll('.pac-analytics-tab');
    
    if (!panel || !toggleBtn || !closeBtn) {
      console.error('History panel elements not found');
      return;
    }
    
    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        state.analyticsTab = targetTab;
        
        // Update tab button states
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update content visibility
        document.getElementById('pacLiveTab').classList.toggle('active', targetTab === 'live');
        document.getElementById('pacAnalyticsTab').classList.toggle('active', targetTab === 'analytics');
        document.getElementById('pacFishingTab').classList.toggle('active', targetTab === 'fishing');
        
        // Render analytics when switching to that tab
        if (targetTab === 'analytics') {
          renderAnalytics();
        }
        
        // Render fishing when switching to that tab
        if (targetTab === 'fishing') {
          renderFishingTab();
        }
      });
    });
    
    // Toggle panel
    toggleBtn.addEventListener('click', () => {
      // Close other panels if open
      if (state.teamPanelExpanded) {
        const teamPanel = document.getElementById('pac-team-panel');
        state.teamPanelExpanded = false;
        teamPanel.classList.remove('expanded');
      }
      if (state.currentPanelExpanded) {
        const currentPanel = document.getElementById('pac-current-panel');
        state.currentPanelExpanded = false;
        currentPanel.classList.remove('expanded');
      }
      if (state.settingsPanelExpanded) {
        const settingsPanel = document.getElementById('pac-settings-panel');
        state.settingsPanelExpanded = false;
        settingsPanel.classList.remove('expanded');
      }
      
      state.shopHistoryPanelExpanded = !state.shopHistoryPanelExpanded;
      panel.classList.toggle('expanded', state.shopHistoryPanelExpanded);
      
      // Render appropriate tab content when panel opens
      if (state.shopHistoryPanelExpanded) {
        if (state.analyticsTab === 'analytics') {
          renderAnalytics();
        } else if (state.analyticsTab === 'fishing') {
          renderFishingTab();
        }
      }
    });
    
    closeBtn.addEventListener('click', () => {
      state.shopHistoryPanelExpanded = false;
      panel.classList.remove('expanded');
    });
    
    // Clear session button (just current session display, keeps localStorage)
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        clearShopHistory();
      });
    }
    
    // Clear ALL history button (clears localStorage too)
    if (analyticsClearBtn) {
      analyticsClearBtn.addEventListener('click', () => {
        clearRollHistory();  // This clears localStorage
        updateHistoryDisplay();
        renderAnalytics();
        if (DEBUG_MODE) console.log('🗑️ All roll history cleared from localStorage');
      });
    }
  }
  
  function clearShopHistory() {
    state.shopHistoryByPlayer = {};
    clearRollHistory();  // Also clear localStorage
    updateHistoryDisplay();
    renderAnalytics();
    if (DEBUG_MODE) console.log('🗑️ Shop history cleared');
  }
  
  function trackShopRoll(playerName, shopArray, playerLevel) {
    if (!state.shopTrackingEnabled || !shopArray || shopArray.length === 0) return;
    
    const level = playerLevel || 7;  // Default to 7 if unknown
    
    // Initialize player data if needed
    if (!state.shopHistoryByPlayer[playerName]) {
      state.shopHistoryByPlayer[playerName] = {
        rollsByLevel: {},    // { level: { rollCount, pokemonSeen: {} } }
        currentLevel: level,
        lastSnapshot: []
      };
    }
    
    const playerData = state.shopHistoryByPlayer[playerName];
    
    // Update current level
    playerData.currentLevel = level;
    
    // Initialize level bucket if needed
    if (!playerData.rollsByLevel[level]) {
      playerData.rollsByLevel[level] = {
        rollCount: 0,
        pokemonSeen: {}
      };
    }
    
    const levelData = playerData.rollsByLevel[level];
    
    // Get current shop names (filter out empty/null slots and DEFAULT placeholders)
    const currentShop = shopArray.filter(n => n && n !== 'DEFAULT');
    
    // Skip if empty shop
    if (currentShop.length === 0) return;
    
    // If first shop for this player, track it as the initial shop (free shop at game start)
    if (!playerData.lastSnapshot || playerData.lastSnapshot.length === 0) {
      // Track initial shop as roll #1
      levelData.rollCount++;
      currentShop.forEach(name => {
        if (name) {
          const upperName = name.toUpperCase();
          levelData.pokemonSeen[upperName] = (levelData.pokemonSeen[upperName] || 0) + 1;
        }
      });
      playerData.lastSnapshot = currentShop;
      
      // Update display and save
      updateHistoryDisplay();
      saveRollHistory();
      
      if (state.analyticsTab === 'analytics' && state.shopHistoryPanelExpanded) {
        renderAnalytics();
      }
      
      if (DEBUG_MODE) console.log(`🎰 ${playerName} (Lv${level}) Initial shop:`, currentShop);
      return;
    }
    
    // Compare with previous shop - count how many are NEW (not in previous)
    const previousSet = new Set(playerData.lastSnapshot);
    const newPokemon = currentShop.filter(name => !previousSet.has(name));
    
    // A real roll typically changes 4-5 slots (all new Pokemon)
    // A purchase only removes 1 slot (0-1 new Pokemon)
    // Threshold: Need at least 3 new Pokemon to count as a roll
    const isRealRoll = newPokemon.length >= 3;
    
    if (isRealRoll) {
      levelData.rollCount++;
      
      // Count each Pokemon seen in the new shop AT THIS LEVEL
      currentShop.forEach(name => {
        if (name) {
          const upperName = name.toUpperCase();
          levelData.pokemonSeen[upperName] = (levelData.pokemonSeen[upperName] || 0) + 1;
        }
      });
      
      // Update display and save to localStorage
      updateHistoryDisplay();
      saveRollHistory();
      
      // Real-time analytics update if analytics tab is active
      if (state.analyticsTab === 'analytics' && state.shopHistoryPanelExpanded) {
        renderAnalytics();
      }
      
      if (DEBUG_MODE) console.log(`🎰 ${playerName} (Lv${level}) Roll #${levelData.rollCount}:`, currentShop);
    }
    
    // Always update snapshot
    playerData.lastSnapshot = currentShop;
  }
  
  // Calculate expected seen across all levels a player rolled at
  function calculateExpectedForPlayer(pokemonName, playerData) {
    const pokeData = POKEMON_DATA[pokemonName];
    if (!pokeData) return 0;
    
    const rarity = pokeData.rarity;
    
    // Only pool rarities can be calculated (unique/legendary don't appear in normal shops)
    if (!['common', 'uncommon', 'rare', 'epic', 'ultra'].includes(rarity)) return 0;
    
    // Get dynamic species counts from current pool state
    const totalPool = calculateTotalPool();
    const poolData = totalPool[rarity];
    if (!poolData) return 0;
    
    // Total species = 2★ species + 3★ species
    const species = poolData.twoStarSpecies + poolData.threeStarSpecies;
    if (species === 0) return 0;
    
    let totalExpected = 0;
    
    // Sum expected across all levels they rolled at
    Object.entries(playerData.rollsByLevel).forEach(([lvl, levelData]) => {
      const level = parseInt(lvl);
      // Use SHOP_ODDS directly (capped at level 9)
      const cappedLevel = Math.min(Math.max(level, 1), 9);
      const odds = SHOP_ODDS[cappedLevel];
      const rate = (odds[rarity] || 0) / 100;  // Convert from percentage to decimal
      
      // Expected for this level = rolls × 6 slots × (rarity_rate / species_count)
      totalExpected += levelData.rollCount * 6 * (rate / species);
    });
    
    return totalExpected;
  }
  
  // Get total seen for a Pokemon across all levels
  function getTotalSeenForPlayer(pokemonName, playerData) {
    let total = 0;
    Object.values(playerData.rollsByLevel).forEach(levelData => {
      total += levelData.pokemonSeen[pokemonName] || 0;
    });
    return total;
  }
  
  // Get total rolls for a player across all levels
  function getTotalRollsForPlayer(playerData) {
    let total = 0;
    Object.values(playerData.rollsByLevel).forEach(levelData => {
      total += levelData.rollCount;
    });
    return total;
  }
  
  function updateHistoryDisplay() {
    const container = document.getElementById('pacHistoryPlayers');
    if (!container) return;
    
    const players = Object.keys(state.shopHistoryByPlayer);
    
    if (players.length === 0) {
      container.innerHTML = '<div class="pac-history-empty">No rolls tracked yet.<br>Rolls are detected when Live Tracking is ON.</div>';
      return;
    }
    
    // Sort players - current player first, then alphabetically
    players.sort((a, b) => {
      if (a === state.playerName) return -1;
      if (b === state.playerName) return 1;
      return a.localeCompare(b);
    });
    
    // Build accordion HTML
    let html = '';
    players.forEach(playerName => {
      const playerData = state.shopHistoryByPlayer[playerName];
      const isCurrentPlayer = playerName === state.playerName;
      const rollCount = getTotalRollsForPlayer(playerData);
      const playerLevel = playerData.currentLevel || 7;
      
      // Get all unique Pokemon seen across all levels
      const allPokemonSeen = new Set();
      Object.values(playerData.rollsByLevel).forEach(levelData => {
        Object.keys(levelData.pokemonSeen).forEach(name => allPokemonSeen.add(name));
      });
      
      // Calculate luck data for this player using per-level expectations
      const luckData = [];
      allPokemonSeen.forEach(name => {
        const seen = getTotalSeenForPlayer(name, playerData);
        const expected = calculateExpectedForPlayer(name, playerData);
        if (expected > 0.1) {
          const diff = ((seen - expected) / expected) * 100;
          luckData.push({ name, seen, expected, diff });
        }
      });
      
      luckData.sort((a, b) => b.diff - a.diff);
      
      const lucky = luckData.filter(d => d.diff > 30);
      const unlucky = luckData.filter(d => d.diff < -30);
      
      // Summary icons
      const luckyCount = lucky.length;
      const unluckyCount = unlucky.length;
      
      // Build levels breakdown string
      const levelBreakdown = Object.entries(playerData.rollsByLevel)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([lvl, data]) => `L${lvl}:${data.rollCount}`)
        .join(' ');
      
      html += `
        <div class="pac-history-player ${isCurrentPlayer ? 'current-player' : ''}">
          <div class="pac-history-player-header" data-player="${playerName}">
            <span class="pac-history-player-name">${isCurrentPlayer ? '⭐ ' : ''}${playerName}</span>
            <span class="pac-history-player-summary">
              <span class="pac-history-level">Lv${playerLevel}</span>
              <span class="pac-history-rolls">${rollCount}🎰</span>
              ${luckyCount > 0 ? `<span class="pac-history-lucky-count">🍀${luckyCount}</span>` : ''}
              ${unluckyCount > 0 ? `<span class="pac-history-unlucky-count">😤${unluckyCount}</span>` : ''}
              <span class="pac-history-expand-icon">▼</span>
            </span>
          </div>
          <div class="pac-history-player-content" style="display: none;">
            <div class="pac-history-level-breakdown">${levelBreakdown}</div>
            ${rollCount === 0 ? '<div class="pac-history-empty">No rolls yet</div>' : `
              ${lucky.length > 0 ? `
                <div class="pac-history-section lucky">
                  <div class="pac-history-section-title">🍀 Lucky</div>
                  <div class="pac-history-list">
                    ${lucky.slice(0, 5).map(d => `
                      <div class="pac-history-item">
                        <span class="pac-history-pokemon">${d.name}</span>
                        <div class="pac-history-stats-row">
                          <span class="pac-history-seen">${d.seen}x</span>
                          <span class="pac-history-expected">(${d.expected.toFixed(1)})</span>
                          <span class="pac-history-diff positive">+${Math.round(d.diff)}%</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              ${unlucky.length > 0 ? `
                <div class="pac-history-section unlucky">
                  <div class="pac-history-section-title">😤 Unlucky</div>
                  <div class="pac-history-list">
                    ${unlucky.slice(-5).reverse().map(d => `
                      <div class="pac-history-item">
                        <span class="pac-history-pokemon">${d.name}</span>
                        <div class="pac-history-stats-row">
                          <span class="pac-history-seen">${d.seen}x</span>
                          <span class="pac-history-expected">(${d.expected.toFixed(1)})</span>
                          <span class="pac-history-diff negative">${Math.round(d.diff)}%</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              ${lucky.length === 0 && unlucky.length === 0 ? '<div class="pac-history-empty">All rolls within normal range</div>' : ''}
            `}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
    // Attach click handlers for accordion
    container.querySelectorAll('.pac-history-player-header').forEach(header => {
      header.addEventListener('click', () => {
        const player = header.closest('.pac-history-player');
        const content = player.querySelector('.pac-history-player-content');
        const icon = header.querySelector('.pac-history-expand-icon');
        
        const isExpanded = content.style.display !== 'none';
        content.style.display = isExpanded ? 'none' : 'block';
        icon.textContent = isExpanded ? '▼' : '▲';
        player.classList.toggle('expanded', !isExpanded);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FISHING TAB (v3.2.1)
  // ═══════════════════════════════════════════════════════════════════════════

  const FISHING_ODDS = {
    old:   { common: 35, uncommon: 10, rare: 0,  epic: 0,  special: 55, specialName: 'Magikarp' },
    good:  { common: 25, uncommon: 30, rare: 10, epic: 0,  special: 35, specialName: 'Feebas' },
    super: { common: 5,  uncommon: 25, rare: 25, epic: 10, special: 35, specialName: 'Wishiwashi' }
  };

  // Get all water-type Pokemon that can be fished based on current settings
  function getFishableWaterPokemon() {
    const fishable = {
      common: [],
      uncommon: [],
      rare: [],
      epic: []
    };
    
    // Track if user might have water regionals/add-picks
    let hasWaterRegionals = false;
    let hasWaterAddPicks = false;
    
    Object.entries(POKEMON_DATA).forEach(([name, data]) => {
      // Skip non-water types
      if (!data.types || !data.types.includes('water')) return;
      
      // Skip special pool (Magikarp, Feebas, etc. - they're special catches)
      if (data.rarity === 'special') return;
      
      // Skip hatch-only Pokemon
      if (data.rarity === 'hatch') return;
      
      // Skip unique Pokemon (can't be fished from normal pool)
      if (data.rarity === 'unique') return;
      
      // Skip unknown rarity
      if (data.rarity === 'unknown') return;
      
      // Skip ultra rarity (0% chance on all rods)
      if (data.rarity === 'ultra') return;
      
      // Only include if this IS the base form (skip evolutions)
      const baseForm = getBaseForm(name);
      if (baseForm !== name) return;
      
      const isRegional = data.regional === true;
      const isAdditional = data.additional === true;
      
      // Track that water regionals/add-picks exist
      if (isRegional) hasWaterRegionals = true;
      if (isAdditional) hasWaterAddPicks = true;
      
      // Only show BASE POOL Pokemon (not regional, not add-pick)
      // We can't know which specific regionals/add-picks the user has
      if (isRegional || isAdditional) return;
      
      // Get base form name for display
      const displayName = formatPokemonName(name);
      
      // Add to appropriate rarity group
      if (fishable[data.rarity]) {
        fishable[data.rarity].push({
          name: displayName,
          source: 'base'
        });
      }
    });
    
    // Sort each rarity group alphabetically
    Object.keys(fishable).forEach(rarity => {
      fishable[rarity].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    // Add flags for UI note
    fishable.hasWaterRegionals = hasWaterRegionals;
    fishable.hasWaterAddPicks = hasWaterAddPicks;
    
    return fishable;
  }

  function formatPokemonName(name) {
    // Convert UPPERCASE to Title Case
    return name.charAt(0) + name.slice(1).toLowerCase();
  }

  function setupFishingTab() {
    // Rod button click handlers
    const rodBtns = document.querySelectorAll('.pac-rod-btn');
    rodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rod = btn.dataset.rod;
        state.fishingRod = rod;
        
        // Update button states
        rodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Re-render fishing content
        renderFishingTab();
      });
    });
    
    // Mantyke toggle
    const mantykeToggle = document.getElementById('pacMantykeToggle');
    if (mantykeToggle) {
      mantykeToggle.addEventListener('change', () => {
        state.fishingMantyke = mantykeToggle.checked;
        renderFishingTab();
      });
    }
  }

  function renderFishingTab() {
    const oddsContainer = document.getElementById('pacFishingOdds');
    const poolContainer = document.getElementById('pacFishingPool');
    const mantykeToggle = document.getElementById('pacMantykeToggle');
    
    if (!oddsContainer || !poolContainer) return;
    
    // Sync checkbox with state (but don't auto-enable - let user control it)
    if (mantykeToggle) {
      mantykeToggle.checked = state.fishingMantyke;
    }
    
    const rod = state.fishingRod;
    
    // If no rod selected, show placeholder
    if (rod === 'none') {
      oddsContainer.innerHTML = '<div class="pac-fishing-no-rod">Select a rod to see catch rates</div>';
      poolContainer.innerHTML = '<div class="pac-fishing-no-rod">Select a rod to see fishable Pokemon</div>';
      return;
    }
    
    const odds = FISHING_ODDS[rod];
    
    // ═══════════════════════════════════════════════════════════════════════════
    // REMORAID PRE-ROLL CALCULATION
    // Remoraid = (33% if Mantine) OR (wildChance based on wild stars)
    // BUT if Octillery on board, Remoraid is LOCKED (0% effective)
    // ═══════════════════════════════════════════════════════════════════════════
    
    const MANTINE_REMORAID_RATE = 0.33;
    const isOctilleryLocked = state.fishingOctilleryLocked;
    
    // Get wild chance from state (same calc as main panel - based on stars)
    const wildBoost = state.pveRoundEnabled 
      ? (0.05 + (state.wildUnitsOwned * 0.01)) 
      : (state.wildUnitsOwned * 0.01);
    
    // Calculate Remoraid pre-roll chance (OR logic, not AND)
    // P(Remoraid) = 1 - P(miss Mantine) × P(miss Wild)
    let remoaidChance = 0;
    if (state.fishingMantyke && wildBoost > 0) {
      // Both active: OR logic
      remoaidChance = 1 - ((1 - MANTINE_REMORAID_RATE) * (1 - wildBoost));
    } else if (state.fishingMantyke) {
      // Mantine only
      remoaidChance = MANTINE_REMORAID_RATE;
    } else if (wildBoost > 0) {
      // Wild only
      remoaidChance = wildBoost;
    }
    // else: 0% (neither active)
    
    // Store the "potential" chance for display, but effective chance is 0 if Octillery locked
    const potentialRemoaidChance = remoaidChance;
    const effectiveRemoaidChance = isOctilleryLocked ? 0 : remoaidChance;
    
    // Factor for adjusting standard pool odds (use EFFECTIVE chance)
    const nonRemoaidFactor = 1 - effectiveRemoaidChance;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER ODDS TABLE WITH REMORAID SECTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Build Remoraid breakdown string
    let remoaidBreakdown = '';
    if (state.fishingMantyke && wildBoost > 0) {
      remoaidBreakdown = `Mantine 33% OR Wild ${(wildBoost * 100).toFixed(0)}%`;
    } else if (state.fishingMantyke) {
      remoaidBreakdown = 'Mantine 33%';
    } else if (wildBoost > 0) {
      remoaidBreakdown = `Wild ${(wildBoost * 100).toFixed(0)}%`;
    } else {
      remoaidBreakdown = 'Need Mantine or Wild synergy';
    }
    
    // Get Remoraid count
    const remoraidsOwned = state.fishingRemoraidsOwned || 0;
    
    // Calculate adjusted odds for standard pool
    const adjCommon = (odds.common * nonRemoaidFactor).toFixed(1);
    const adjUncommon = (odds.uncommon * nonRemoaidFactor).toFixed(1);
    const adjRare = (odds.rare * nonRemoaidFactor).toFixed(1);
    const adjEpic = (odds.epic * nonRemoaidFactor).toFixed(1);
    const adjSpecial = (odds.special * nonRemoaidFactor).toFixed(1);
    
    // Build Remoraid section based on state
    let remoaidSectionHtml = '';
    if (isOctilleryLocked) {
      // Octillery on board - fishing locked
      remoaidSectionHtml = `
        <div class="pac-fishing-remoraid-section" style="background: rgba(244, 67, 54, 0.15); border: 1px solid #f44336; border-radius: 6px; padding: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #f44336;">🔒 Remoraid Fishing LOCKED</span>
            <span style="font-weight: 700; font-size: 14px; color: #f44336;">0%</span>
          </div>
          <div style="font-size: 10px; color: #f44336; margin-top: 4px;">Octillery on board — no more Remoraid fishing</div>
          <div style="font-size: 9px; color: #888; margin-top: 4px;">💰 Sell Octillery to unlock again</div>
        </div>
      `;
    } else {
      // Normal Remoraid fishing
      const remoaidStatusText = remoraidsOwned > 0 
        ? `<span style="margin-left: 8px; font-size: 11px; color: #aaa;">(${remoraidsOwned}/3 owned)</span>`
        : '';
      
      remoaidSectionHtml = `
        <div class="pac-fishing-remoraid-section" style="background: ${remoaidChance > 0 ? 'rgba(255, 152, 0, 0.15)' : 'rgba(100,100,100,0.1)'}; border: 1px solid ${remoaidChance > 0 ? '#ff9800' : '#555'}; border-radius: 6px; padding: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: ${remoaidChance > 0 ? '#ff9800' : '#888'};">🐟 Remoraid Pre-Roll${remoaidStatusText}</span>
            <span style="font-weight: 700; font-size: 16px; color: ${remoaidChance > 0 ? '#ff9800' : '#666'};">${(remoaidChance * 100).toFixed(1)}%</span>
          </div>
          <div style="font-size: 10px; color: #aaa; margin-top: 4px;">${remoaidBreakdown}${state.fishingMantyke ? ' <span style="color: #4caf50;">✓ Auto-detected</span>' : ''}</div>
          ${remoaidChance > 0 ? '<div style="font-size: 9px; color: #888; margin-top: 4px;">💰 Sell for gold to keep fishing | Octillery on board = no more Remoraid</div>' : ''}
        </div>
      `;
    }
    
    // Build standard pool header text
    let standardPoolText = '';
    if (isOctilleryLocked) {
      standardPoolText = 'Standard pool (Remoraid locked):';
    } else if (effectiveRemoaidChance > 0) {
      standardPoolText = `If Remoraid misses → Standard pool (×${(nonRemoaidFactor * 100).toFixed(0)}%):`;
    } else {
      standardPoolText = 'Standard pool:';
    }
    
    let oddsHtml = `
      ${remoaidSectionHtml}
      
      <div style="font-size: 10px; color: #888; margin-bottom: 6px;">${standardPoolText}</div>
      
      <table class="pac-fishing-odds-table">
        <tr>
          <th>Rarity</th>
          <th>Base</th>
          <th>${effectiveRemoaidChance > 0 ? 'Adjusted' : 'Chance'}</th>
        </tr>
        <tr>
          <td class="rarity-common">Common</td>
          <td style="color: #666;">${odds.common}%</td>
          <td>${adjCommon}%</td>
        </tr>
        <tr>
          <td class="rarity-uncommon">Uncommon</td>
          <td style="color: #666;">${odds.uncommon}%</td>
          <td>${adjUncommon}%</td>
        </tr>
        <tr>
          <td class="rarity-rare">Rare</td>
          <td style="color: #666;">${odds.rare}%</td>
          <td>${adjRare}%</td>
        </tr>
        <tr>
          <td class="rarity-epic">Epic</td>
          <td style="color: #666;">${odds.epic}%</td>
          <td>${adjEpic}%</td>
        </tr>
        <tr>
          <td class="rarity-special">✨ Special</td>
          <td style="color: #666;">${odds.special}%</td>
          <td>${adjSpecial}%</td>
        </tr>
      </table>
      <div class="pac-fishing-special-note">
        ✨ Special: ${odds.specialName}
      </div>
    `;
    oddsContainer.innerHTML = oddsHtml;
    
    // ═══════════════════════════════════════════════════════════════════════════
    // RENDER FISHABLE POKEMON WITH ADJUSTED TOOLTIPS
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Get fishable Pokemon
    const fishable = getFishableWaterPokemon();
    
    // Filter by rod tier (can only catch rarities with >0% chance)
    const availableRarities = [];
    if (odds.common > 0) availableRarities.push('common');
    if (odds.uncommon > 0) availableRarities.push('uncommon');
    if (odds.rare > 0) availableRarities.push('rare');
    if (odds.epic > 0) availableRarities.push('epic');
    
    // Render fishable Pokemon grouped by rarity
    let poolHtml = '';
    
    // Add Remoraid at top if there's any chance (and not locked by Octillery)
    if (remoaidChance > 0 && !isOctilleryLocked) {
      const remoaidCountText = remoraidsOwned > 0 ? ` (${remoraidsOwned}/3 held)` : '';
      poolHtml += `
        <div class="pac-fishing-rarity-group">
          <div class="pac-fishing-rarity-label" style="color: #ff9800;">🐟 Remoraid (${(remoaidChance * 100).toFixed(1)}%)${remoaidCountText}</div>
          <div class="pac-fishing-pokemon-list">
            <span class="pac-fishing-pokemon" style="border-color: #ff9800; background: rgba(255,152,0,0.1);">Remoraid<span class="pac-fish-tooltip">🐟 Remoraid: ${(remoaidChance * 100).toFixed(1)}%<br><span style="font-size:10px;color:#666;">${remoaidBreakdown}<br>Sell for gold or evolve to Octillery</span></span></span>
          </div>
        </div>
      `;
    }
    
    availableRarities.forEach(rarity => {
      const pokemon = fishable[rarity];
      if (pokemon.length === 0) return;
      
      const baseRarityChance = FISHING_ODDS[rod][rarity];
      const adjustedRarityChance = baseRarityChance * nonRemoaidFactor;
      const perPokemonChance = pokemon.length > 0 ? (adjustedRarityChance / pokemon.length) : 0;
      const basePerPokemon = pokemon.length > 0 ? (baseRarityChance / pokemon.length) : 0;
      
      poolHtml += `
        <div class="pac-fishing-rarity-group">
          <div class="pac-fishing-rarity-label ${rarity}">${rarity.charAt(0).toUpperCase() + rarity.slice(1)} (${adjustedRarityChance.toFixed(1)}%)</div>
          <div class="pac-fishing-pokemon-list">
            ${pokemon.map(p => `<span class="pac-fishing-pokemon">${p.name}<span class="pac-fish-tooltip">🎣 ${p.name}: ${perPokemonChance.toFixed(2)}%${effectiveRemoaidChance > 0 ? '<br><span style="font-size:10px;color:#666;">Base: ' + basePerPokemon.toFixed(2) + '% × ' + (nonRemoaidFactor * 100).toFixed(0) + '% non-Remoraid</span>' : ''}</span></span>`).join('')}
          </div>
        </div>
      `;
    });
    
    if (poolHtml === '') {
      poolHtml = '<div class="pac-fishing-no-rod">No fishable Pokemon at this rod tier</div>';
    } else {
      // Add note about regionals/add-picks
      poolHtml += `
        <div class="pac-fishing-note">
          💡 Water-type regionals and add-picks in your pool are also fishable!
        </div>
      `;
    }
    
    poolContainer.innerHTML = poolHtml;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ANALYTICS RENDERING (v3.2.1)
  // ═══════════════════════════════════════════════════════════════════════════

  function renderAnalytics() {
    const players = Object.keys(state.shopHistoryByPlayer);
    if (players.length === 0) {
      renderEmptyAnalytics();
      return;
    }
    
    // Aggregate all data across all players
    const aggregated = aggregateAllPlayerData();
    
    // Render each section
    renderLuckGauge(aggregated);
    renderRarityCharts(aggregated);
    renderLevelGrid(aggregated);
    renderTopPokemon(aggregated);
    renderDittoSection(aggregated);
    renderWildSection(aggregated);
    renderNarrativeSummary(aggregated);
  }
  
  function renderEmptyAnalytics() {
    document.getElementById('pacLuckScore').textContent = '—';
    document.getElementById('pacLuckScore').className = 'pac-luck-score neutral';
    document.getElementById('pacLuckMarker').style.left = '50%';
    document.getElementById('pacRarityCharts').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacLevelGrid').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacLuckyPokemon').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacUnluckyPokemon').innerHTML = '<div class="pac-history-empty">No data yet</div>';
    document.getElementById('pacDittoStats').innerHTML = '<div class="pac-history-empty">No Ditto seen yet</div>';
    document.getElementById('pacWildPokemon').innerHTML = '<div class="pac-history-empty">No wild Pokemon seen yet</div>';
    document.getElementById('pacNarrativeSummary').innerHTML = '<p>No data to analyze yet. Start rolling to see your luck story!</p>';
  }
  
  function aggregateAllPlayerData() {
    const result = {
      totalRolls: 0,
      rollsByLevel: {},       // { level: count }
      rarityStats: {},        // { rarity: { seen, expected } } - NON-WILD ONLY
      pokemonStats: {},       // { name: { seen, expected, rarity, isWild } }
      wildStats: {            // Wild Pokemon separate
        seen: 0,
        pokemon: {}           // { name: { seen, rarity } }
      },
      dittoStats: {           // Ditto tracking
        seen: 0,
        expected: 0
      },
      luckScore: 0
    };
    
    // Initialize rarities (for non-wild only)
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    rarities.forEach(r => {
      result.rarityStats[r] = { seen: 0, expected: 0 };
    });
    
    Object.values(state.shopHistoryByPlayer).forEach(playerData => {
      Object.entries(playerData.rollsByLevel).forEach(([level, levelData]) => {
        const lvl = parseInt(level);
        result.rollsByLevel[lvl] = (result.rollsByLevel[lvl] || 0) + levelData.rollCount;
        result.totalRolls += levelData.rollCount;
        
        // Calculate expected for each rarity at this level DIRECTLY (non-wild)
        // Expected = rolls × 6 slots × (rarity_rate / 100)
        const cappedLevel = Math.min(Math.max(lvl, 1), 9);
        const odds = SHOP_ODDS[cappedLevel];
        rarities.forEach(rarity => {
          const rate = (odds[rarity] || 0) / 100;
          result.rarityStats[rarity].expected += levelData.rollCount * 6 * rate;
        });
        
        // Aggregate Pokemon seen
        Object.entries(levelData.pokemonSeen).forEach(([name, count]) => {
          const pokeData = POKEMON_DATA[name];
          const rarity = pokeData ? pokeData.rarity : 'unknown';
          const isWild = isWildPokemon(name);
          const isDitto = name === 'DITTO';
          
          // Track Ditto separately (always lucky!)
          if (isDitto) {
            result.dittoStats.seen += count;
          } else if (isWild) {
            // Track wild Pokemon separately
            result.wildStats.seen += count;
            if (!result.wildStats.pokemon[name]) {
              result.wildStats.pokemon[name] = { seen: 0, rarity };
            }
            result.wildStats.pokemon[name].seen += count;
          } else {
            // Track non-wild Pokemon
            if (!result.pokemonStats[name]) {
              result.pokemonStats[name] = {
                seen: 0,
                expected: 0,
                rarity,
                isWild: false
              };
            }
            result.pokemonStats[name].seen += count;
            
            // Track by rarity (seen count) - non-wild only
            if (result.rarityStats[rarity]) {
              result.rarityStats[rarity].seen += count;
            }
          }
        });
      });
    });
    
    // Calculate expected values for each individual non-wild Pokemon
    Object.entries(result.pokemonStats).forEach(([name, stats]) => {
      let totalExpected = 0;
      Object.values(state.shopHistoryByPlayer).forEach(playerData => {
        totalExpected += calculateExpectedForPlayer(name, playerData);
      });
      stats.expected = totalExpected;
    });
    
    // Calculate overall luck score based on RARITY TOTALS (more accurate)
    // This accounts for Pokemon that were expected but never seen
    let totalExpected = 0;
    let totalSeen = 0;
    
    rarities.forEach(rarity => {
      const stats = result.rarityStats[rarity];
      if (stats.expected > 0) {
        totalExpected += stats.expected;
        totalSeen += stats.seen;
      }
    });
    
    // Luck score = overall deviation from expected
    result.luckScore = totalExpected > 0 ? ((totalSeen - totalExpected) / totalExpected) * 100 : 0;
    
    return result;
  }
  
  function renderLuckGauge(data) {
    const score = data.luckScore;
    const scoreEl = document.getElementById('pacLuckScore');
    const markerEl = document.getElementById('pacLuckMarker');
    
    // Format score
    const displayScore = score >= 0 ? `+${score.toFixed(0)}%` : `${score.toFixed(0)}%`;
    scoreEl.textContent = displayScore;
    
    // Set color class
    scoreEl.className = 'pac-luck-score';
    if (score > 10) scoreEl.classList.add('lucky');
    else if (score < -10) scoreEl.classList.add('unlucky');
    else scoreEl.classList.add('neutral');
    
    // Position marker - map score to 0-100% position
    // Score of -50 = 0%, score of 0 = 50%, score of +50 = 100%
    // Clamp between 5% and 95% for visual clarity
    const markerPos = Math.max(5, Math.min(95, 50 + (score * 0.8)));
    markerEl.style.left = markerPos + '%';
  }
  
  function renderRarityCharts(data) {
    const container = document.getElementById('pacRarityCharts');
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'ultra'];
    
    let html = '';
    rarities.forEach(rarity => {
      const stats = data.rarityStats[rarity];
      if (!stats || stats.expected < 0.5) return;
      
      const diff = ((stats.seen - stats.expected) / stats.expected) * 100;
      const diffClass = diff > 5 ? 'positive' : diff < -5 ? 'negative' : '';
      const diffStr = diff >= 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
      
      // Percentage-based bars - expected is always 100%, actual scales relative
      const ratio = stats.seen / stats.expected;
      const maxRatio = Math.max(ratio, 1.5); // Cap at 150% for visual balance
      const expectedWidth = (1 / maxRatio) * 100;
      const actualWidth = Math.min(ratio / maxRatio, 1) * 100;
      const actualClass = diff > 5 ? 'over' : diff < -5 ? 'under' : '';
      
      html += `
        <div class="pac-rarity-chart">
          <div class="pac-rarity-chart-title">
            <span>${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
            <span class="pac-rarity-chart-diff ${diffClass}">${diffStr}</span>
          </div>
          <div class="pac-chart-horizontal">
            <div class="pac-chart-row">
              <span class="pac-chart-row-label">Exp</span>
              <div class="pac-chart-bar-h expected" style="width: ${expectedWidth}%;">
                <span class="pac-chart-bar-value">${stats.expected.toFixed(0)}</span>
              </div>
            </div>
            <div class="pac-chart-row">
              <span class="pac-chart-row-label">Act</span>
              <div class="pac-chart-bar-h actual ${actualClass}" style="width: ${actualWidth}%;">
                <span class="pac-chart-bar-value">${stats.seen}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    if (html === '') {
      html = '<div class="pac-history-empty">Not enough data yet</div>';
    }
    
    container.innerHTML = html;
  }
  
  function renderLevelGrid(data) {
    const container = document.getElementById('pacLevelGrid');
    const levels = Object.entries(data.rollsByLevel)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    
    if (levels.length === 0) {
      container.innerHTML = '<div class="pac-history-empty">No rolls tracked</div>';
      return;
    }
    
    let html = '';
    levels.forEach(([level, count]) => {
      html += `
        <div class="pac-level-card">
          <div class="pac-level-card-header">Level ${level}</div>
          <div class="pac-level-card-rolls">${count}</div>
          <div class="pac-level-card-label">rolls</div>
        </div>
      `;
    });
    
    // Add total
    html += `
      <div class="pac-level-card" style="background: #e3f2fd;">
        <div class="pac-level-card-header">Total</div>
        <div class="pac-level-card-rolls">${data.totalRolls}</div>
        <div class="pac-level-card-label">rolls</div>
      </div>
    `;
    
    container.innerHTML = html;
  }
  
  function renderTopPokemon(data) {
    const luckyContainer = document.getElementById('pacLuckyPokemon');
    const unluckyContainer = document.getElementById('pacUnluckyPokemon');
    
    // Build sorted list
    const pokemonList = Object.entries(data.pokemonStats)
      .filter(([name, stats]) => stats.expected > 0.5)
      .map(([name, stats]) => ({
        name,
        seen: stats.seen,
        expected: stats.expected,
        diff: ((stats.seen - stats.expected) / stats.expected) * 100
      }))
      .sort((a, b) => b.diff - a.diff);
    
    // Top 4 lucky
    const lucky = pokemonList.filter(p => p.diff > 10).slice(0, 4);
    if (lucky.length > 0) {
      luckyContainer.innerHTML = lucky.map(p => `
        <div class="pac-top-pokemon-card">
          <span class="pac-top-pokemon-name">${p.name}</span>
          <div class="pac-top-pokemon-stats">
            <div class="pac-top-pokemon-seen">${p.seen}× seen</div>
            <div class="pac-top-pokemon-diff positive">+${p.diff.toFixed(0)}%</div>
          </div>
        </div>
      `).join('');
    } else {
      luckyContainer.innerHTML = '<div class="pac-history-empty">No notably lucky Pokemon yet</div>';
    }
    
    // Top 4 unlucky
    const unlucky = pokemonList.filter(p => p.diff < -10).slice(-4).reverse();
    if (unlucky.length > 0) {
      unluckyContainer.innerHTML = unlucky.map(p => `
        <div class="pac-top-pokemon-card">
          <span class="pac-top-pokemon-name">${p.name}</span>
          <div class="pac-top-pokemon-stats">
            <div class="pac-top-pokemon-seen">${p.seen}× seen</div>
            <div class="pac-top-pokemon-diff negative">${p.diff.toFixed(0)}%</div>
          </div>
        </div>
      `).join('');
    } else {
      unluckyContainer.innerHTML = '<div class="pac-history-empty">No notably unlucky Pokemon yet</div>';
    }
  }
  
  function renderDittoSection(data) {
    const container = document.getElementById('pacDittoStats');
    if (!container) return;
    
    const dittoSeen = data.dittoStats.seen;
    const totalRolls = data.totalRolls;
    
    if (dittoSeen === 0) {
      container.innerHTML = '<div class="pac-history-empty">No Ditto seen yet</div>';
      return;
    }
    
    // Calculate hit rate (Ditto per roll)
    const hitRate = totalRolls > 0 ? (dittoSeen / totalRolls * 100).toFixed(1) : 0;
    
    // Fun message based on Ditto count
    let message = '';
    if (dittoSeen >= 5) {
      message = '🎉 Ditto loves you!';
    } else if (dittoSeen >= 3) {
      message = '✨ Nice Ditto luck!';
    } else if (dittoSeen >= 1) {
      message = '👀 Spotted!';
    }
    
    const html = `
      <div class="pac-ditto-stats-card">
        <div class="pac-ditto-count">
          <span class="pac-ditto-number">${dittoSeen}</span>
          <span class="pac-ditto-label">Ditto${dittoSeen !== 1 ? 's' : ''} found</span>
        </div>
        <div class="pac-ditto-rate">
          <span class="pac-ditto-rate-value">${hitRate}%</span>
          <span class="pac-ditto-rate-label">of rolls</span>
        </div>
        ${message ? `<div class="pac-ditto-message">${message}</div>` : ''}
      </div>
    `;
    
    container.innerHTML = html;
  }
  
  function renderWildSection(data) {
    const container = document.getElementById('pacWildPokemon');
    if (!container) return;
    
    const wildData = data.wildStats;
    const wildPokemon = Object.entries(wildData.pokemon)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.seen - a.seen);
    
    if (wildPokemon.length === 0) {
      container.innerHTML = '<div class="pac-history-empty">No wild Pokemon seen yet</div>';
      return;
    }
    
    // Group by rarity
    const byRarity = {};
    wildPokemon.forEach(p => {
      if (!byRarity[p.rarity]) byRarity[p.rarity] = [];
      byRarity[p.rarity].push(p);
    });
    
    let html = `<div class="pac-wild-total">Total wild hits: <strong>${wildData.seen}</strong></div>`;
    
    html += '<div class="pac-wild-pokemon-grid">';
    wildPokemon.slice(0, 8).forEach(p => {
      const rarityClass = p.rarity || 'common';
      html += `
        <div class="pac-wild-pokemon-card ${rarityClass}">
          <span class="pac-wild-pokemon-name">${p.name}</span>
          <span class="pac-wild-pokemon-count">${p.seen}×</span>
        </div>
      `;
    });
    html += '</div>';
    
    if (wildPokemon.length > 8) {
      html += `<div class="pac-wild-more">+${wildPokemon.length - 8} more</div>`;
    }
    
    container.innerHTML = html;
  }
  
  function renderNarrativeSummary(data) {
    const container = document.getElementById('pacNarrativeSummary');
    
    if (data.totalRolls < 5) {
      container.innerHTML = '<p>Not enough data yet. Keep rolling to see your luck story!</p>';
      return;
    }
    
    const score = data.luckScore;
    let narrative = '';
    
    // Opening statement
    if (score > 20) {
      narrative += `<p>🍀 <span class="pac-narrative-highlight lucky">Running hot!</span> Your targets are hitting ${score.toFixed(0)}% above expected rates.</p>`;
    } else if (score > 5) {
      narrative += `<p>📈 <span class="pac-narrative-highlight lucky">Slightly lucky</span> — your hit rates are ${score.toFixed(0)}% above average.</p>`;
    } else if (score < -20) {
      narrative += `<p>😤 <span class="pac-narrative-highlight unlucky">Rough session!</span> Your hit rates are ${Math.abs(score).toFixed(0)}% below expected.</p>`;
    } else if (score < -5) {
      narrative += `<p>📉 <span class="pac-narrative-highlight unlucky">Slightly unlucky</span> — your hit rates are ${Math.abs(score).toFixed(0)}% below average.</p>`;
    } else {
      narrative += `<p>⚖️ <span class="pac-narrative-highlight neutral">Running about average</span> — the RNG is treating you fairly.</p>`;
    }
    
    // Roll distribution
    const levels = Object.entries(data.rollsByLevel).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    if (levels.length > 0) {
      const topLevel = levels[0];
      narrative += `<p>You've rolled <span class="pac-narrative-highlight neutral">${data.totalRolls} times</span> total, mostly at <span class="pac-narrative-highlight neutral">Level ${topLevel[0]}</span> (${topLevel[1]} rolls).</p>`;
    }
    
    // Rarity highlights
    const rarityHighlights = [];
    Object.entries(data.rarityStats).forEach(([rarity, stats]) => {
      if (stats.expected > 5) {
        const diff = ((stats.seen - stats.expected) / stats.expected) * 100;
        if (Math.abs(diff) > 15) {
          const adjective = diff > 0 ? 'lucky' : 'unlucky';
          rarityHighlights.push({ rarity, diff, adjective });
        }
      }
    });
    
    if (rarityHighlights.length > 0) {
      const highlight = rarityHighlights.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))[0];
      const rarityName = highlight.rarity.charAt(0).toUpperCase() + highlight.rarity.slice(1);
      narrative += `<p>Your ${rarityName} drops are <span class="pac-narrative-highlight ${highlight.adjective}">${Math.abs(highlight.diff).toFixed(0)}% ${highlight.diff > 0 ? 'above' : 'below'}</span> expected rates.</p>`;
    }
    
    // Pokemon highlights
    const pokemonList = Object.entries(data.pokemonStats)
      .filter(([name, stats]) => stats.expected > 1)
      .map(([name, stats]) => ({
        name,
        seen: stats.seen,
        expected: stats.expected,
        diff: ((stats.seen - stats.expected) / stats.expected) * 100
      }))
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    
    if (pokemonList.length > 0) {
      const top = pokemonList[0];
      if (Math.abs(top.diff) > 30) {
        const adjective = top.diff > 0 ? 'lucky' : 'unlucky';
        const verb = top.diff > 0 ? 'appeared' : 'is avoiding you';
        narrative += `<p><span class="pac-narrative-highlight ${adjective}">${top.name}</span> ${verb} — ${top.seen}× seen vs ${top.expected.toFixed(1)} expected (${top.diff > 0 ? '+' : ''}${top.diff.toFixed(0)}%).</p>`;
      }
    }
    
    // Ditto mention
    if (data.dittoStats && data.dittoStats.seen > 0) {
      const dittoRate = (data.dittoStats.seen / data.totalRolls * 100).toFixed(1);
      narrative += `<p>🟣 <span class="pac-narrative-highlight lucky">Ditto appeared ${data.dittoStats.seen}×</span> (${dittoRate}% of rolls)!</p>`;
    }
    
    // Wild Pokemon mention
    if (data.wildStats && data.wildStats.seen > 0) {
      const wildCount = Object.keys(data.wildStats.pokemon).length;
      narrative += `<p>🌿 You've hit <span class="pac-narrative-highlight neutral">${data.wildStats.seen} wild Pokemon</span> (${wildCount} unique species).</p>`;
    }
    
    container.innerHTML = narrative;
  }

  function loadCustomSettings() {
    try {
      const saved = localStorage.getItem('pac_customSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        state.customSettings = { ...state.customSettings, ...parsed };
        
        // Update input values
        document.getElementById('pacSettingsBgColor').value = state.customSettings.backgroundColor;
        document.getElementById('pacSettingsTextColor').value = state.customSettings.textColor;
        document.getElementById('pacSettingsAccentColor').value = state.customSettings.accentColor || '#4caf50';
        document.getElementById('pacSettingsTargetFlash').value = state.customSettings.targetFlashColor;
        document.getElementById('pacSettingsTeamFlash').value = state.customSettings.teamFlashColor;
        document.getElementById('pacSettingsFlashSpeed').value = state.customSettings.flashSpeed;
        document.getElementById('pacSettingsFlashSpeedValue').textContent = state.customSettings.flashSpeed + 'ms';
        document.getElementById('pacSettingsFontSize').value = state.customSettings.fontSize;
        document.getElementById('pacSettingsFontSizeValue').textContent = state.customSettings.fontSize + 'px';
        document.getElementById('pacSettingsDisableFlash').checked = state.customSettings.disableFlash;
        
        // Update preview flash buttons if disabled
        if (state.customSettings.disableFlash) {
          const targetPreview = document.getElementById('pacPreviewTargetFlash');
          const teamPreview = document.getElementById('pacPreviewTeamFlash');
          if (targetPreview) targetPreview.classList.add('disabled');
          if (teamPreview) teamPreview.classList.add('disabled');
        }
        
        if (DEBUG_MODE) console.log('✅ Loaded custom settings from localStorage');
      }
      applyCustomSettings();
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to load custom settings:', err);
    }
  }
  
  function saveCustomSettings() {
    try {
      localStorage.setItem('pac_customSettings', JSON.stringify(state.customSettings));
      if (DEBUG_MODE) console.log('✅ Saved custom settings to localStorage');
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to save custom settings:', err);
    }
  }
  
  function applyCustomSettings() {
    const overlay = document.getElementById('pac-calc-overlay');
    if (!overlay) return;
    
    const settings = state.customSettings;
    
    // Apply CSS variables
    overlay.style.setProperty('--pac-bg-color', settings.backgroundColor);
    overlay.style.setProperty('--pac-text-color', settings.textColor);
    overlay.style.setProperty('--pac-target-flash', settings.targetFlashColor);
    overlay.style.setProperty('--pac-team-flash', settings.teamFlashColor);
    overlay.style.setProperty('--pac-flash-speed', settings.flashSpeed + 'ms');
    overlay.style.setProperty('--pac-font-size', settings.fontSize + 'px');
    
    // Apply to preview
    const preview = document.getElementById('pacSettingsPreview');
    if (preview) {
      preview.style.setProperty('--pac-bg-color', settings.backgroundColor);
      preview.style.setProperty('--pac-text-color', settings.textColor);
      preview.style.setProperty('--pac-target-flash', settings.targetFlashColor);
      preview.style.setProperty('--pac-team-flash', settings.teamFlashColor);
      preview.style.setProperty('--pac-font-size', settings.fontSize + 'px');
    }
    
    // Update dynamic style for animations
    updateDynamicFlashStyles();
  }
  
  function updateDynamicFlashStyles() {
    const settings = state.customSettings;
    let dynamicStyle = document.getElementById('pac-dynamic-styles');
    
    if (!dynamicStyle) {
      dynamicStyle = document.createElement('style');
      dynamicStyle.id = 'pac-dynamic-styles';
      document.head.appendChild(dynamicStyle);
    }
    
    // If flashing is disabled (epilepsy mode), use static styles instead
    if (settings.disableFlash) {
      dynamicStyle.textContent = `
        /* Epilepsy mode - disable all flashing animations */
        #pac-calc-overlay.target-in-shop,
        #pac-calc-overlay.target-in-shop::before,
        .pac-team-panel.team-target-in-shop,
        #pac-calc-overlay.minimized.target-in-shop,
        #pac-calc-overlay.minimized.target-in-shop #pac-calc-header,
        #pac-calc-overlay.minimized.team-target-in-shop,
        #pac-calc-overlay.minimized.team-target-in-shop #pac-calc-header,
        #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop,
        #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop #pac-calc-header {
          animation: none !important;
        }
        
        /* Static highlight for target in shop */
        #pac-calc-overlay.target-in-shop {
          border-color: ${settings.targetFlashColor} !important;
          box-shadow: 0 0 20px ${settings.targetFlashColor}66 !important;
        }
        
        /* Static highlight for team target in shop */
        .pac-team-panel.team-target-in-shop {
          border-color: ${settings.teamFlashColor} !important;
          box-shadow: 0 0 20px ${settings.teamFlashColor}66 !important;
        }
        
        /* Apply custom background and text color to main overlay */
        #pac-calc-overlay {
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        #pac-calc-overlay .pac-body {
          font-size: ${settings.fontSize}px !important;
          color: ${settings.textColor} !important;
        }
        
        /* COMPREHENSIVE FONT SIZE - Apply to everything */
        #pac-calc-overlay,
        #pac-calc-overlay *,
        #pac-calc-overlay .pac-section,
        #pac-calc-overlay .pac-section-title,
        #pac-calc-overlay .pac-label,
        #pac-calc-overlay .pac-input,
        #pac-calc-overlay .pac-result-value,
        #pac-calc-overlay .pac-result-label,
        #pac-calc-overlay .pac-header-title,
        #pac-calc-overlay .pac-toggle,
        #pac-calc-overlay .pac-collapse-btn,
        #pac-calc-overlay .pac-team-header h3,
        #pac-calc-overlay .pac-team-stat-label,
        #pac-calc-overlay .pac-team-stat-value,
        #pac-calc-overlay .pac-team-combined-title,
        #pac-calc-overlay .pac-mono-status,
        #pac-calc-overlay .pac-mono-wheel-label,
        #pac-calc-overlay label,
        #pac-calc-overlay span,
        #pac-calc-overlay div,
        #pac-calc-overlay input,
        #pac-calc-overlay select,
        #pac-calc-overlay button,
        #pac-calc-overlay p {
          font-size: ${settings.fontSize}px !important;
        }
        
        /* Override ALL text colors throughout the extension */
        #pac-calc-overlay,
        #pac-calc-overlay .pac-section,
        #pac-calc-overlay .pac-section-title,
        #pac-calc-overlay .pac-label,
        #pac-calc-overlay .pac-input,
        #pac-calc-overlay .pac-result-value,
        #pac-calc-overlay .pac-result-label,
        #pac-calc-overlay .pac-header-title,
        #pac-calc-overlay .pac-toggle,
        #pac-calc-overlay .pac-collapse-btn,
        #pac-calc-overlay .pac-team-header h3,
        #pac-calc-overlay .pac-team-stat-label,
        #pac-calc-overlay .pac-team-stat-value,
        #pac-calc-overlay .pac-team-combined-title,
        #pac-calc-overlay .pac-mono-status,
        #pac-calc-overlay .pac-mono-wheel-label,
        #pac-calc-overlay label,
        #pac-calc-overlay span,
        #pac-calc-overlay div {
          color: ${settings.textColor} !important;
        }
        
        /* Keep some semantic colors but adjust others */
        #pac-calc-overlay .pac-section-title {
          color: ${adjustColor(settings.textColor, 30)} !important;
        }
        
        /* Input fields - use accent color for borders */
        #pac-calc-overlay input[type="text"],
        #pac-calc-overlay input[type="number"],
        #pac-calc-overlay select {
          background: ${adjustColor(settings.backgroundColor, -15)} !important;
          color: ${settings.textColor} !important;
          border: 2px solid ${settings.accentColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        /* BUTTONS - use accent color (excluding status indicators) */
        #pac-calc-overlay button:not(#pacExpBtn):not(#pacClrBtn):not(.pac-live-toggle):not(.pac-ctrl-btn),
        #pac-calc-overlay .pac-collapse-btn,
        #pac-calc-overlay .pac-reinject-btn,
        #pac-calc-overlay .pac-team-add-btn,
        #pac-calc-overlay .pac-mono-spin-btn,
        #pac-calc-overlay .pac-mono-clear {
          background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
          color: ${getContrastColor(settings.accentColor)} !important;
          border: 1px solid ${adjustColor(settings.accentColor, 20)} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        /* STATUS INDICATOR BUTTONS - preserve functional colors */
        /* Live Toggle - red when off, green when on */
        #pac-calc-overlay .pac-live-toggle {
          background: rgba(244, 67, 54, 0.15) !important;
          border: 2px solid rgba(244, 67, 54, 0.4) !important;
          color: ${settings.textColor} !important;
        }
        #pac-calc-overlay .pac-live-toggle.active {
          background: rgba(76, 175, 80, 0.25) !important;
          border: 2px solid rgba(76, 175, 80, 0.5) !important;
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.3) !important;
        }
        #pac-calc-overlay .pac-live-toggle .pac-live-status {
          background: rgba(244, 67, 54, 0.3) !important;
          color: #ff5252 !important;
        }
        #pac-calc-overlay .pac-live-toggle.active .pac-live-status {
          background: rgba(76, 175, 80, 0.3) !important;
          color: #4caf50 !important;
        }
        
        /* EXP Button - neutral, gold pending, gold active */
        #pac-calc-overlay #pacExpBtn {
          background: ${adjustColor(settings.backgroundColor, 15)} !important;
          color: ${settings.textColor} !important;
          border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
        }
        #pac-calc-overlay #pacExpBtn.pending {
          background: rgba(251, 191, 36, 0.3) !important;
          color: #fbbf24 !important;
          border-color: rgba(251, 191, 36, 0.5) !important;
        }
        #pac-calc-overlay #pacExpBtn.active {
          background: rgba(251, 191, 36, 0.8) !important;
          color: #1e293b !important;
          border-color: #fbbf24 !important;
          font-weight: 700 !important;
        }
        
        /* CLR Button - neutral, red-ish to indicate destructive */
        #pac-calc-overlay #pacClrBtn {
          background: ${adjustColor(settings.backgroundColor, 15)} !important;
          color: ${settings.textColor} !important;
          border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
        }
        #pac-calc-overlay #pacClrBtn:hover {
          background: rgba(239, 68, 68, 0.3) !important;
          color: #ff6b6b !important;
          border-color: rgba(239, 68, 68, 0.5) !important;
        }
        
        /* Help Button - blue accent */
        #pac-calc-overlay #pacHelpBtn {
          background: ${adjustColor(settings.backgroundColor, 15)} !important;
          color: ${settings.textColor} !important;
          border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
        }
        #pac-calc-overlay #pacHelpBtn:hover {
          background: rgba(100, 181, 246, 0.3) !important;
          color: #64b5f6 !important;
          border-color: rgba(100, 181, 246, 0.5) !important;
        }
        
        /* Close button */
        #pac-calc-overlay .pac-team-close {
          background: transparent !important;
          color: ${settings.textColor} !important;
        }
        
        /* HIGH VISIBILITY CHECKBOXES - Custom styled with SVG checkmark */
        #pac-calc-overlay input[type="checkbox"] {
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          width: 24px !important;
          height: 24px !important;
          min-width: 24px !important;
          min-height: 24px !important;
          max-width: 24px !important;
          max-height: 24px !important;
          background-color: ${adjustColor(settings.backgroundColor, -30)} !important;
          border: 3px solid ${settings.accentColor} !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          position: relative !important;
          margin: 0 8px 0 0 !important;
          padding: 0 !important;
          transition: all 0.2s !important;
          flex-shrink: 0 !important;
          display: inline-block !important;
          vertical-align: middle !important;
          background-image: none !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-size: 16px 16px !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:hover:not(:disabled) {
          border-color: ${adjustColor(settings.accentColor, 30)} !important;
          box-shadow: 0 0 12px ${settings.accentColor}66 !important;
          background-color: ${settings.accentColor}33 !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:checked {
          background-color: ${settings.accentColor} !important;
          border-color: ${adjustColor(settings.accentColor, 30)} !important;
          box-shadow: 0 0 10px ${settings.accentColor}66 !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
          background-size: 18px 18px !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          border-color: ${adjustColor(settings.backgroundColor, 50)} !important;
        }
        
        #pac-calc-overlay input[type="checkbox"]:disabled:checked {
          background-color: ${adjustColor(settings.backgroundColor, 50)} !important;
          border-color: ${adjustColor(settings.backgroundColor, 70)} !important;
        }
        
        /* Also handle .pac-toggle checkboxes */
        #pac-calc-overlay .pac-toggle input[type="checkbox"] {
          width: 26px !important;
          height: 26px !important;
          min-width: 26px !important;
          min-height: 26px !important;
          max-width: 26px !important;
          max-height: 26px !important;
        }
        
        #pac-calc-overlay .pac-toggle input[type="checkbox"]:checked {
          background-size: 20px 20px !important;
        }
        
        /* Regional Pokemon & Add Picks sections */
        #pac-calc-overlay .pac-collapsible,
        #pac-calc-overlay .pac-regional-section,
        #pac-calc-overlay .pac-portal-section {
          background: ${adjustColor(settings.backgroundColor, -10)} !important;
          border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
        }
        
        /* Side panels */
        .pac-team-panel,
        #pac-team-panel,
        #pac-current-panel,
        #pac-settings-panel,
        #pac-history-panel {
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
        }
        
        .pac-team-panel .pac-team-content,
        .pac-team-panel .pac-settings-content,
        .pac-team-panel .pac-history-content {
          color: ${settings.textColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        .pac-team-toggle {
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
          border-color: ${settings.accentColor} !important;
        }
        
        /* Team panel items */
        #pac-calc-overlay .pac-team-item,
        #pac-calc-overlay .pac-intel-player {
          background: ${adjustColor(settings.backgroundColor, -20)} !important;
          border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
        }
        
        /* Header */
        #pac-calc-overlay #pac-calc-header {
          background: linear-gradient(90deg, ${adjustColor(settings.backgroundColor, -30)} 0%, ${settings.accentColor}44 100%) !important;
        }
        
        /* Settings panel specific */
        #pac-settings-panel .pac-settings-label,
        #pac-settings-panel .pac-settings-section-title,
        #pac-settings-panel .pac-settings-value {
          color: ${settings.textColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        #pac-settings-panel .pac-settings-preview {
          background: ${settings.backgroundColor} !important;
        }
        
        #pac-settings-panel .pac-settings-preview-text {
          color: ${settings.textColor} !important;
          font-size: ${settings.fontSize}px !important;
        }
        
        /* Slider accent color */
        #pac-settings-panel .pac-settings-slider::-webkit-slider-thumb {
          background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
        }
        
        /* Toggle switch accent */
        #pac-settings-panel .pac-settings-switch input:checked + .pac-settings-switch-slider {
          background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
          border-color: ${settings.accentColor} !important;
        }
        
        /* Dropdown selects */
        #pac-calc-overlay select option {
          background: ${settings.backgroundColor} !important;
          color: ${settings.textColor} !important;
        }
      `;
      return;
    }
    
    // Generate dynamic CSS with user colors
    dynamicStyle.textContent = `
      /* Dynamic flash animations with user colors */
      @keyframes targetInShopFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
          border-color: #0f3460;
        }
        50% { 
          background: linear-gradient(135deg, #1e3a8a 0%, ${settings.targetFlashColor} 100%);
          border-color: ${settings.targetFlashColor};
        }
      }
      
      @keyframes targetInShopFullFlashCustom {
        0%, 100% { 
          background: transparent;
        }
        50% { 
          background: linear-gradient(135deg, ${settings.targetFlashColor}4D 0%, ${settings.targetFlashColor}80 100%);
          box-shadow: inset 0 0 50px ${settings.targetFlashColor}99;
        }
      }
      
      @keyframes teamTargetInShopFlashCustom {
        0%, 100% { 
          border-color: rgba(255,255,255,0.1);
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        50% { 
          border-color: ${settings.teamFlashColor};
          background: linear-gradient(135deg, ${settings.teamFlashColor} 0%, ${settings.teamFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.teamFlashColor}CC;
        }
      }
      
      @keyframes minimizedTargetFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, ${settings.targetFlashColor} 0%, ${settings.targetFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.targetFlashColor}E6, 0 0 60px ${settings.targetFlashColor}80;
        }
      }
      
      @keyframes minimizedTeamTargetFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        50% { 
          background: linear-gradient(135deg, ${settings.teamFlashColor} 0%, ${settings.teamFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.teamFlashColor}E6, 0 0 60px ${settings.teamFlashColor}80;
        }
      }
      
      @keyframes minimizedBothFlashCustom {
        0%, 100% { 
          background: linear-gradient(135deg, ${settings.backgroundColor} 0%, #16213e 100%);
        }
        25% { 
          background: linear-gradient(135deg, ${settings.targetFlashColor} 0%, ${settings.targetFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.targetFlashColor}E6;
        }
        75% { 
          background: linear-gradient(135deg, ${settings.teamFlashColor} 0%, ${settings.teamFlashColor}CC 100%);
          box-shadow: 0 0 30px ${settings.teamFlashColor}E6;
        }
      }
      
      /* Override default animations with custom ones */
      #pac-calc-overlay.target-in-shop {
        animation: targetInShopFlashCustom ${settings.flashSpeed}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.target-in-shop::before {
        animation: targetInShopFullFlashCustom ${settings.flashSpeed}ms ease-in-out infinite !important;
      }
      
      .pac-team-panel.team-target-in-shop {
        animation: teamTargetInShopFlashCustom ${settings.flashSpeed}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop {
        animation: minimizedTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop #pac-calc-header {
        animation: minimizedTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.team-target-in-shop {
        animation: minimizedTeamTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.team-target-in-shop #pac-calc-header {
        animation: minimizedTeamTargetFlashCustom ${settings.flashSpeed + 50}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop {
        animation: minimizedBothFlashCustom ${settings.flashSpeed * 2}ms ease-in-out infinite !important;
      }
      
      #pac-calc-overlay.minimized.target-in-shop.team-target-in-shop #pac-calc-header {
        animation: minimizedBothFlashCustom ${settings.flashSpeed * 2}ms ease-in-out infinite !important;
      }
      
      /* Apply custom background and text color to main overlay */
      #pac-calc-overlay {
        background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-calc-overlay .pac-body {
        font-size: ${settings.fontSize}px !important;
        color: ${settings.textColor} !important;
      }
      
      /* COMPREHENSIVE FONT SIZE - Apply to everything */
      #pac-calc-overlay,
      #pac-calc-overlay *,
      #pac-calc-overlay .pac-section,
      #pac-calc-overlay .pac-section-title,
      #pac-calc-overlay .pac-label,
      #pac-calc-overlay .pac-input,
      #pac-calc-overlay .pac-result-value,
      #pac-calc-overlay .pac-result-label,
      #pac-calc-overlay .pac-header-title,
      #pac-calc-overlay .pac-toggle,
      #pac-calc-overlay .pac-collapse-btn,
      #pac-calc-overlay .pac-team-header h3,
      #pac-calc-overlay .pac-team-stat-label,
      #pac-calc-overlay .pac-team-stat-value,
      #pac-calc-overlay .pac-team-combined-title,
      #pac-calc-overlay .pac-mono-status,
      #pac-calc-overlay .pac-mono-wheel-label,
      #pac-calc-overlay label,
      #pac-calc-overlay span,
      #pac-calc-overlay div,
      #pac-calc-overlay input,
      #pac-calc-overlay select,
      #pac-calc-overlay button,
      #pac-calc-overlay p {
        font-size: ${settings.fontSize}px !important;
      }
      
      /* Override ALL text colors throughout the extension */
      #pac-calc-overlay,
      #pac-calc-overlay .pac-section,
      #pac-calc-overlay .pac-section-title,
      #pac-calc-overlay .pac-label,
      #pac-calc-overlay .pac-input,
      #pac-calc-overlay .pac-result-value,
      #pac-calc-overlay .pac-result-label,
      #pac-calc-overlay .pac-header-title,
      #pac-calc-overlay .pac-toggle,
      #pac-calc-overlay .pac-collapse-btn,
      #pac-calc-overlay .pac-team-header h3,
      #pac-calc-overlay .pac-team-stat-label,
      #pac-calc-overlay .pac-team-stat-value,
      #pac-calc-overlay .pac-team-combined-title,
      #pac-calc-overlay .pac-mono-status,
      #pac-calc-overlay .pac-mono-wheel-label,
      #pac-calc-overlay label,
      #pac-calc-overlay span,
      #pac-calc-overlay div {
        color: ${settings.textColor} !important;
      }
      
      /* Keep some semantic colors but adjust others */
      #pac-calc-overlay .pac-section-title {
        color: ${adjustColor(settings.textColor, 30)} !important;
      }
      
      /* Input fields - use accent color for borders */
      #pac-calc-overlay input[type="text"],
      #pac-calc-overlay input[type="number"],
      #pac-calc-overlay select {
        background: ${adjustColor(settings.backgroundColor, -15)} !important;
        color: ${settings.textColor} !important;
        border: 2px solid ${settings.accentColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-calc-overlay input[type="text"]:focus,
      #pac-calc-overlay input[type="number"]:focus,
      #pac-calc-overlay select:focus {
        border-color: ${adjustColor(settings.accentColor, 30)} !important;
        box-shadow: 0 0 8px ${settings.accentColor}66 !important;
      }
      
      /* BUTTONS - use accent color (excluding status indicators) */
      #pac-calc-overlay button:not(#pacExpBtn):not(#pacClrBtn):not(.pac-live-toggle):not(.pac-ctrl-btn),
      #pac-calc-overlay .pac-collapse-btn,
      #pac-calc-overlay .pac-reinject-btn,
      #pac-calc-overlay .pac-team-add-btn,
      #pac-calc-overlay .pac-mono-spin-btn,
      #pac-calc-overlay .pac-mono-clear {
        background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
        color: ${getContrastColor(settings.accentColor)} !important;
        border: 1px solid ${adjustColor(settings.accentColor, 20)} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-calc-overlay button:not(#pacExpBtn):not(#pacClrBtn):not(.pac-live-toggle):not(.pac-ctrl-btn):hover,
      #pac-calc-overlay .pac-collapse-btn:hover,
      #pac-calc-overlay .pac-reinject-btn:hover {
        background: linear-gradient(135deg, ${adjustColor(settings.accentColor, 20)} 0%, ${settings.accentColor} 100%) !important;
        box-shadow: 0 2px 8px ${settings.accentColor}66 !important;
      }
      
      /* STATUS INDICATOR BUTTONS - preserve functional colors */
      /* Live Toggle - red when off, green when on */
      #pac-calc-overlay .pac-live-toggle {
        background: rgba(244, 67, 54, 0.15) !important;
        border: 2px solid rgba(244, 67, 54, 0.4) !important;
        color: ${settings.textColor} !important;
      }
      #pac-calc-overlay .pac-live-toggle:hover {
        background: rgba(244, 67, 54, 0.25) !important;
        border-color: rgba(244, 67, 54, 0.6) !important;
      }
      #pac-calc-overlay .pac-live-toggle.active {
        background: rgba(76, 175, 80, 0.25) !important;
        border: 2px solid rgba(76, 175, 80, 0.5) !important;
        box-shadow: 0 0 10px rgba(76, 175, 80, 0.3) !important;
      }
      #pac-calc-overlay .pac-live-toggle.active:hover {
        background: rgba(76, 175, 80, 0.35) !important;
        border-color: rgba(76, 175, 80, 0.7) !important;
      }
      #pac-calc-overlay .pac-live-toggle .pac-live-status {
        background: rgba(244, 67, 54, 0.3) !important;
        color: #ff5252 !important;
      }
      #pac-calc-overlay .pac-live-toggle.active .pac-live-status {
        background: rgba(76, 175, 80, 0.3) !important;
        color: #4caf50 !important;
      }
      
      /* EXP Button - neutral, gold pending, gold active */
      #pac-calc-overlay #pacExpBtn {
        background: ${adjustColor(settings.backgroundColor, 15)} !important;
        color: ${settings.textColor} !important;
        border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
      }
      #pac-calc-overlay #pacExpBtn:hover {
        background: ${adjustColor(settings.backgroundColor, 30)} !important;
      }
      #pac-calc-overlay #pacExpBtn.pending {
        background: rgba(251, 191, 36, 0.3) !important;
        color: #fbbf24 !important;
        border-color: rgba(251, 191, 36, 0.5) !important;
        animation: expPulse 1s ease-in-out infinite !important;
      }
      #pac-calc-overlay #pacExpBtn.active {
        background: rgba(251, 191, 36, 0.8) !important;
        color: #1e293b !important;
        border-color: #fbbf24 !important;
        font-weight: 700 !important;
      }
      
      /* CLR Button - neutral, red-ish to indicate destructive */
      #pac-calc-overlay #pacClrBtn {
        background: ${adjustColor(settings.backgroundColor, 15)} !important;
        color: ${settings.textColor} !important;
        border: 1px solid ${adjustColor(settings.backgroundColor, 40)} !important;
      }
      #pac-calc-overlay #pacClrBtn:hover {
        background: rgba(239, 68, 68, 0.3) !important;
        color: #ff6b6b !important;
        border-color: rgba(239, 68, 68, 0.5) !important;
      }
      
      /* Header buttons (minimize, close) - keep smaller */
      #pac-calc-overlay .pac-header-btn:not(#pacExpBtn):not(#pacClrBtn) {
        background: ${adjustColor(settings.backgroundColor, 20)} !important;
        color: ${settings.textColor} !important;
        border-color: ${adjustColor(settings.backgroundColor, 40)} !important;
      }
      
      #pac-calc-overlay .pac-header-btn:not(#pacExpBtn):not(#pacClrBtn):hover {
        background: ${settings.accentColor} !important;
        color: ${getContrastColor(settings.accentColor)} !important;
      }
      
      /* Close button */
      #pac-calc-overlay .pac-team-close {
        background: transparent !important;
        color: ${settings.textColor} !important;
      }
      
      /* HIGH VISIBILITY CHECKBOXES - Custom styled with SVG checkmark */
      #pac-calc-overlay input[type="checkbox"] {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        min-height: 24px !important;
        max-width: 24px !important;
        max-height: 24px !important;
        background-color: ${adjustColor(settings.backgroundColor, -30)} !important;
        border: 3px solid ${settings.accentColor} !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        position: relative !important;
        margin: 0 8px 0 0 !important;
        padding: 0 !important;
        transition: all 0.2s !important;
        flex-shrink: 0 !important;
        display: inline-block !important;
        vertical-align: middle !important;
        background-image: none !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: 16px 16px !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:hover:not(:disabled) {
        border-color: ${adjustColor(settings.accentColor, 30)} !important;
        box-shadow: 0 0 12px ${settings.accentColor}66 !important;
        background-color: ${settings.accentColor}33 !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:checked {
        background-color: ${settings.accentColor} !important;
        border-color: ${adjustColor(settings.accentColor, 30)} !important;
        box-shadow: 0 0 10px ${settings.accentColor}66 !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12l5 5L20 6'/%3E%3C/svg%3E") !important;
        background-size: 18px 18px !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        border-color: ${adjustColor(settings.backgroundColor, 50)} !important;
      }
      
      #pac-calc-overlay input[type="checkbox"]:disabled:checked {
        background-color: ${adjustColor(settings.backgroundColor, 50)} !important;
        border-color: ${adjustColor(settings.backgroundColor, 70)} !important;
      }
      
      /* Also handle .pac-toggle checkboxes */
      #pac-calc-overlay .pac-toggle input[type="checkbox"] {
        width: 26px !important;
        height: 26px !important;
        min-width: 26px !important;
        min-height: 26px !important;
        max-width: 26px !important;
        max-height: 26px !important;
      }
      
      #pac-calc-overlay .pac-toggle input[type="checkbox"]:checked {
        background-size: 20px 20px !important;
      }
      
      /* Regional Pokemon & Add Picks sections */
      #pac-calc-overlay .pac-collapsible,
      #pac-calc-overlay .pac-regional-section,
      #pac-calc-overlay .pac-portal-section {
        background: ${adjustColor(settings.backgroundColor, -10)} !important;
        border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
      }
      
      /* Pokemon tags/badges */
      #pac-calc-overlay .pac-pokemon-tag,
      #pac-calc-overlay .pac-regional-pokemon,
      #pac-calc-overlay .pac-additional-pokemon {
        font-size: ${Math.max(10, settings.fontSize - 2)}px !important;
      }
      
      /* Side panels */
      .pac-team-panel,
      #pac-team-panel,
      #pac-current-panel,
      #pac-settings-panel,
      #pac-history-panel {
        background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
      }
      
      .pac-team-panel .pac-team-content,
      .pac-team-panel .pac-settings-content,
      .pac-team-panel .pac-history-content {
        color: ${settings.textColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      .pac-team-toggle {
        background: linear-gradient(135deg, ${settings.backgroundColor} 0%, ${adjustColor(settings.backgroundColor, -20)} 100%) !important;
        border-color: ${settings.accentColor} !important;
      }
      
      .pac-team-toggle:hover {
        background: linear-gradient(135deg, ${settings.accentColor}33 0%, ${settings.accentColor}22 100%) !important;
      }
      
      /* Team panel items */
      #pac-calc-overlay .pac-team-item,
      #pac-calc-overlay .pac-intel-player {
        background: ${adjustColor(settings.backgroundColor, -20)} !important;
        border-color: ${adjustColor(settings.backgroundColor, 20)} !important;
      }
      
      /* Header */
      #pac-calc-overlay #pac-calc-header {
        background: linear-gradient(90deg, ${adjustColor(settings.backgroundColor, -30)} 0%, ${settings.accentColor}44 100%) !important;
      }
      
      /* Settings panel specific */
      #pac-settings-panel .pac-settings-label,
      #pac-settings-panel .pac-settings-section-title,
      #pac-settings-panel .pac-settings-value {
        color: ${settings.textColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      #pac-settings-panel .pac-settings-preview {
        background: ${settings.backgroundColor} !important;
      }
      
      #pac-settings-panel .pac-settings-preview-text {
        color: ${settings.textColor} !important;
        font-size: ${settings.fontSize}px !important;
      }
      
      /* Slider accent color */
      #pac-settings-panel .pac-settings-slider::-webkit-slider-thumb {
        background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
      }
      
      /* Toggle switch accent */
      #pac-settings-panel .pac-settings-switch input:checked + .pac-settings-switch-slider {
        background: linear-gradient(135deg, ${settings.accentColor} 0%, ${adjustColor(settings.accentColor, -20)} 100%) !important;
        border-color: ${settings.accentColor} !important;
      }
      
      /* Dropdown selects */
      #pac-calc-overlay select option {
        background: ${settings.backgroundColor} !important;
        color: ${settings.textColor} !important;
      }
    `;
  }
  
  // Helper function to lighten/darken colors
  function adjustColor(hex, amount) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  
  // Helper function to get contrasting text color (black or white)
  function getContrastColor(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }
  
  // Track expanded players in Counter Intelligence panel
  const expandedIntelPlayers = new Set();
  
  function updateCounterIntelDisplay() {
    const container = document.getElementById('pacIntelPlayers');
    
    if (!container) {
      if (DEBUG_MODE) console.warn('⚠️ Intel panel container not found');
      return;
    }
    
    // Check if we have player data
    if (!lastPoolData || !lastPoolData.playerBoards) {
      container.innerHTML = '<div class="pac-intel-empty">Waiting for game data...</div>';
      return;
    }
    
    // Get all player names from boards, benches, and shops
    const allPlayerNames = new Set([
      ...Object.keys(lastPoolData.playerBoards || {}),
      ...Object.keys(lastPoolData.playerBenches || {}),
      ...Object.keys(lastPoolData.playerShops || {})
    ]);
    
    if (allPlayerNames.size === 0) {
      container.innerHTML = '<div class="pac-intel-empty">No players detected</div>';
      return;
    }
    
    // Sort alphabetically
    const sortedPlayers = Array.from(allPlayerNames).sort((a, b) => 
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
    
    // Get team target families for contested checking
    const targetFamilies = state.teamTargets
      .filter(t => t.enabled)
      .map(t => ({
        family: getEvolutionFamily(getBaseForm(t.pokemon)),
        pokemon: t.pokemon
      }));
    
    // Also include main calculator target if set
    if (state.targetPokemon) {
      const mainTargetFamily = getEvolutionFamily(getBaseForm(state.targetPokemon));
      // Only add if not already in team targets
      if (!targetFamilies.some(t => t.pokemon === state.targetPokemon)) {
        targetFamilies.push({
          family: mainTargetFamily,
          pokemon: state.targetPokemon
        });
      }
    }
    
    // Build fingerprint for dirty check
    const intelFingerprint = JSON.stringify({
      players: sortedPlayers,
      boards: lastPoolData.playerBoards,
      benches: lastPoolData.playerBenches,
      shops: lastPoolData.playerShops,
      targets: targetFamilies.map(t => t.pokemon),
      mainTarget: state.targetPokemon, // Include main target in fingerprint
      pokemonCounts: lastPoolData.pokemonCounts
    });
    
    if (intelFingerprint === lastCurrentHash) {
      if (DEBUG_MODE) console.log('⚡ SKIP: Intel panel unchanged');
      return;
    }
    lastCurrentHash = intelFingerprint;
    
    // Render each player
    container.innerHTML = sortedPlayers.map(playerName => {
      const board = lastPoolData.playerBoards?.[playerName] || [];
      const bench = lastPoolData.playerBenches?.[playerName] || [];
      const shop = lastPoolData.playerShops?.[playerName] || [];
      const allUnits = [...board, ...bench];
      const unitCount = allUnits.length;
      const isYou = playerName === state.playerName;
      const isExpanded = expandedIntelPlayers.has(playerName);
      
      // Check if this player is contesting any of your targets (skip yourself)
      let isContested = false;
      const contestedFamilies = new Set();
      
      if (!isYou && targetFamilies.length > 0) {
        allUnits.forEach(unit => {
          const unitName = unit.name?.toUpperCase();
          targetFamilies.forEach(target => {
            if (target.family.includes(unitName)) {
              isContested = true;
              target.family.forEach(f => contestedFamilies.add(f));
            }
          });
        });
      }
      
      // Build shop slots HTML (5 slots)
      const shopHtml = Array.from({length: 5}, (_, i) => {
        const pokemon = shop[i];
        if (pokemon) {
          const name = typeof pokemon === 'string' ? pokemon : pokemon.name;
          // Filter out DEFAULT placeholder
          if (name && name.toUpperCase() !== 'DEFAULT') {
            return `<span class="pac-intel-shop-slot">${name}</span>`;
          }
        }
        return `<span class="pac-intel-shop-slot empty">─</span>`;
      }).join('');
      
      // Build units HTML with pool remaining
      const unitsHtml = allUnits.map(unit => {
        const unitName = unit.name?.toUpperCase() || unit.name;
        const stars = '★'.repeat(unit.stars || 1);
        const baseForm = getBaseForm(unitName);
        const rarity = POKEMON_DATA[baseForm]?.rarity;
        const family = getEvolutionFamily(baseForm);
        
        // Check if this unit is contested
        const isUnitContested = contestedFamilies.has(unitName);
        
        // Calculate pool remaining for this family
        let poolRemaining = '?';
        let poolMax = '?';
        let poolClass = '';
        
        if (rarity && POOL_COPIES[rarity]) {
          const chain = EVOLUTION_CHAINS[baseForm];
          const maxStars = chain?.[0]?.maxStars || 3;
          poolMax = maxStars === 2 ? POOL_COPIES[rarity].twoStar : POOL_COPIES[rarity].threeStar;
          
          // Count all copies taken from this family
          let copiesTaken = 0;
          if (lastPoolData.pokemonCounts) {
            family.forEach(formName => {
              const formCount = lastPoolData.pokemonCounts[formName] || 0;
              if (formCount > 0) {
                copiesTaken += formCount * getEvolutionCost(formName);
              }
            });
          }
          
          poolRemaining = Math.max(0, poolMax - copiesTaken);
          
          // Color code based on remaining percentage
          const pct = poolRemaining / poolMax;
          if (pct < 0.3) poolClass = 'critical';
          else if (pct < 0.7) poolClass = 'low';
        }
        
        return `
          <div class="pac-intel-unit ${isUnitContested ? 'contested' : ''}">
            <span class="pac-intel-unit-name">${unitName}</span>
            <span class="pac-intel-unit-stars">${stars}</span>
            <span class="pac-intel-unit-pool ${poolClass}">(${poolRemaining}/${poolMax})</span>
          </div>
        `;
      }).join('');
      
      // Player classes
      const playerClasses = [
        'pac-intel-player',
        isYou ? 'is-you' : '',
        isContested ? 'contested' : '',
        isExpanded ? 'expanded' : ''
      ].filter(Boolean).join(' ');
      
      return `
        <div class="${playerClasses}" data-player="${playerName}">
          <div class="pac-intel-header" data-player="${playerName}">
            <span class="pac-intel-arrow">▶</span>
            <span class="pac-intel-name">${playerName}${isYou ? ' (You)' : ''}</span>
            <span class="pac-intel-count">(${unitCount} units)</span>
            ${isContested ? '<span class="pac-intel-contested-badge">⚔️</span>' : ''}
          </div>
          <div class="pac-intel-content">
            <div class="pac-intel-shop">
              <div class="pac-intel-shop-label">Shop</div>
              ${shopHtml}
            </div>
            <div class="pac-intel-units">
              ${unitsHtml || '<span style="color: #666; font-style: italic;">No units</span>'}
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Attach click handlers for accordion
    container.querySelectorAll('.pac-intel-header').forEach(header => {
      header.addEventListener('click', () => {
        const playerName = header.dataset.player;
        const playerEl = header.closest('.pac-intel-player');
        
        if (expandedIntelPlayers.has(playerName)) {
          expandedIntelPlayers.delete(playerName);
          playerEl.classList.remove('expanded');
        } else {
          expandedIntelPlayers.add(playerName);
          playerEl.classList.add('expanded');
        }
      });
    });
    
    if (DEBUG_MODE) console.log(`🕵️ Counter Intel: Rendered ${sortedPlayers.length} players`);
  }
  
  // Legacy wrapper for compatibility
  function updateCurrentDisplay(data) {
    updateCounterIntelDisplay();
  }
  
  function setupTeamAutocomplete(input) {
    // Create dropdown - append to body so it can float outside
    const dropdown = document.createElement('div');
    dropdown.className = 'pac-team-dropdown hidden';
    dropdown.id = 'pacTeamDropdown';
    document.body.appendChild(dropdown);
    
    let selectedIndex = -1;
    let filteredPokemon = [];
    
    // Update dropdown position based on panel position
    function updateDropdownPosition() {
      const panel = document.getElementById('pac-team-panel');
      const inputRect = input.getBoundingClientRect();
      
      if (panel && state.teamPanelExpanded && !dropdown.classList.contains('hidden')) {
        const panelRect = panel.getBoundingClientRect();
        // Position to the right of the panel
        const leftPos = panelRect.right + 20;
        const topPos = inputRect.top;
        
        dropdown.style.left = leftPos + 'px';
        dropdown.style.top = topPos + 'px';
      }
    }
    
    // Store globally so drag handler can access
    window.updateTeamDropdownPosition = updateDropdownPosition;
    
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      selectedIndex = -1;
      
      // Only show dropdown if panel is expanded
      if (!state.teamPanelExpanded || query.length === 0) {
        dropdown.classList.add('hidden');
        return;
      }
      
      // Filter Pokemon
      filteredPokemon = Object.entries(POKEMON_DATA)
        .filter(([name, data]) => name.toLowerCase().includes(query))
        .slice(0, 8);
      
      if (filteredPokemon.length === 0) {
        dropdown.classList.add('hidden');
        return;
      }
      
      // Update position before showing
      updateDropdownPosition();
      
      // Render dropdown
      dropdown.innerHTML = filteredPokemon.map(([name, data], idx) => {
        const rarityColors = {
          common: '#9ca3af',
          uncommon: '#10b981',
          rare: '#00d9ff',
          epic: '#a855f7',
          ultra: '#ef4444',
          unique: '#ff6b6b',
          legendary: '#ffd700',
          special: '#e91e63',
          hatch: '#00bcd4'
        };
        
        // data is now an object with rarity, types, additional, regional, stars
        const rarity = data.rarity || 'common';
        const color = rarityColors[rarity] || rarityColors['common'];
        const displayRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1);
        
        return `
          <div class="pac-team-dropdown-item" data-index="${idx}" data-pokemon="${name}">
            <div class="pac-team-dropdown-name" style="color: ${color}">${name}</div>
            <div class="pac-team-dropdown-meta">
              ${displayRarity}
            </div>
          </div>
        `;
      }).join('');
      
      dropdown.classList.remove('hidden');
    });
    
    // Use event delegation for clicks instead of adding handlers every input
    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.pac-team-dropdown-item');
      if (!item) return;
      
      const pokemonName = item.dataset.pokemon;
      if (pokemonName) {
        // Hide dropdown immediately
        dropdown.classList.add('hidden');
        addTeamTarget(pokemonName);
        // Clear input after a tick to prevent input event from re-showing dropdown
        setTimeout(() => {
          input.value = '';
        }, 0);
      }
    });
    
    dropdown.addEventListener('mouseenter', (e) => {
      const item = e.target.closest('.pac-team-dropdown-item');
      if (!item) return;
      
      const idx = parseInt(item.dataset.index);
      if (idx >= 0 && idx < filteredPokemon.length) {
        selectedIndex = idx;
        updateDropdownSelection();
      }
    }, true);
    
    input.addEventListener('keydown', (e) => {
      if (dropdown.classList.contains('hidden') || filteredPokemon.length === 0) {
        return;
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredPokemon.length - 1);
        updateDropdownSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateDropdownSelection();
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        input.value = filteredPokemon[selectedIndex][0];
        dropdown.classList.add('hidden');
        addTeamTarget(filteredPokemon[selectedIndex][0]);
        input.value = '';
      } else if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
      }
    });
    
    input.addEventListener('blur', () => {
      setTimeout(() => dropdown.classList.add('hidden'), 200);
    });
    
    function updateDropdownSelection() {
      dropdown.querySelectorAll('.pac-team-dropdown-item').forEach((item, idx) => {
        item.classList.toggle('selected', idx === selectedIndex);
      });
    }
  }
  
  
  function showNotification(message, type = 'info') {
    // Create notification element
    const notif = document.createElement('div');
    notif.className = `pac-notification pac-notification-${type}`;
    notif.textContent = message;
    
    // Add to body
    document.body.appendChild(notif);
    
    // Position in top-right
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : type === 'warning' ? 'rgba(245, 158, 11, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
      color: white;
      border-radius: 8px;
      font-family: 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999999;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add CSS animation if not already present
    if (!document.getElementById('pac-notif-styles')) {
      const style = document.createElement('style');
      style.id = 'pac-notif-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
      notif.style.transition = 'all 0.3s ease-out';
      notif.style.transform = 'translateX(400px)';
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }
  
  function addTeamTarget(pokemonName) {
    const normalizedName = pokemonName.toUpperCase();
    
    // Check if already in team
    if (state.teamTargets.some(t => t.pokemon === normalizedName)) {
      // Show non-blocking notification
      showNotification('This Pokemon is already in your team!', 'warning');
      return;
    }
    
    // Get rarity - POKEMON_DATA is now just strings
    const rarity = POKEMON_DATA[normalizedName]?.rarity;
    if (!rarity) {
      showNotification('Pokemon not found!', 'error');
      return;
    }
    
    // Get evolution cap from EVOLUTION_CHAINS
    const baseForm = getBaseForm(normalizedName);
    const evolutionChain = EVOLUTION_CHAINS[baseForm];
    
    let evo = 'twoStar'; // Default
    
    if (evolutionChain && evolutionChain[0] && evolutionChain[0].maxStars !== undefined) {
      // maxStars: 3 → threeStar, maxStars: 1 or 2 → twoStar
      evo = evolutionChain[0].maxStars === 3 ? 'threeStar' : 'twoStar';
    }
    
    // Add to team
    const target = {
      id: Date.now() + Math.random(),
      pokemon: normalizedName,
      displayName: pokemonName,
      rarity: rarity,
      evo: evo,
      isWild: isWildPokemon(normalizedName), // Auto-detect wild Pokemon
      enabled: true,
      copiesTaken: 0
    };
    
    state.teamTargets.push(target);
    saveTeamTargets();
    if (DEBUG_MODE) console.log('Added to team:', target, 'Total targets:', state.teamTargets.length);
    updateTeamDisplay();
    showNotification(`${pokemonName} added to team!`, 'success');
  }
  
  function removeTeamTarget(id) {
    state.teamTargets = state.teamTargets.filter(t => t.id !== id);
    saveTeamTargets();
    updateTeamDisplay();
  }
  
  function toggleTeamTarget(id) {
    const target = state.teamTargets.find(t => t.id === id);
    if (target) {
      target.enabled = !target.enabled;
      saveTeamTargets();
      updateTeamDisplay();
    }
  }
  
  function toggleTeamTargetWild(id) {
    const target = state.teamTargets.find(t => t.id === id);
    if (target) {
      target.isWild = !target.isWild;
      saveTeamTargets();
      // Force fingerprint update by clearing it
      lastTeamFingerprint = '';
      updateTeamDisplay();
    }
  }
  
  function saveTeamTargets() {
    try {
      localStorage.setItem('pac_teamTargets', JSON.stringify(state.teamTargets));
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to save teamTargets to localStorage:', err);
    }
  }
  
  function setActiveTeamTarget(id) {
    const target = state.teamTargets.find(t => t.id === id);
    if (!target) return;
    
    // Set as main target
    state.targetPokemon = target.pokemon;
    state.targetPokemonDisplayName = target.displayName;
    state.targetRarity = target.rarity;
    state.targetEvo = target.evo;
    state.targetIsWild = target.isWild;
    state.copiesTaken = target.copiesTaken;
    
    // Update main panel
    document.getElementById('pacTarget').value = target.displayName;
    document.getElementById('pacRarity').value = target.rarity;
    document.getElementById('pacEvo').value = target.evo;
    document.getElementById('pacTargetWild').checked = target.isWild;
    document.getElementById('pacScouted').value = target.copiesTaken;
    
    // Recalculate
    updateDisplay();
    updateTeamDisplay();
  }
  
  function calculateTeamStats() {
    const results = [];
    let combinedMissProb = 1.0;
    
    // Get player's board and bench for copiesOwned calculation
    const playerBoard = lastPoolData?.playerBoards?.[state.playerName] || [];
    const playerBench = lastPoolData?.playerBenches?.[state.playerName] || [];
    const playerUnits = [...playerBoard, ...playerBench];
    
    state.teamTargets.forEach(target => {
      if (!target.enabled) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          notInPool: false,
          disabled: true
        });
        return;
      }
      
      // Skip non-pool rarities (legendary, unique, hatch, special)
      if (!POOL_RARITIES.includes(target.rarity)) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          notInPool: true
        });
        return;
      }
      
      // Check regional/additional availability
      const availability = checkPokemonAvailability(
        target.pokemon,
        state.activeRegionalPokemon,
        state.activeAdditionalPokemon
      );
      
      if (!availability.available) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          notInPool: true,
          availabilityReason: availability.reason
        });
        return;
      }
      
      // Get evolution family and max stars for this target
      const baseForm = getBaseForm(target.pokemon);
      const family = getEvolutionFamily(baseForm);
      const evolutionChain = EVOLUTION_CHAINS[baseForm];
      const maxStars = evolutionChain?.[0]?.maxStars || 3;
      const copiesNeeded = maxStars === 2 ? 3 : 9;  // 2★ max = 3, 3★ max = 9
      
      // Calculate copiesTaken from live data using family aggregation
      let copiesTaken = 0;
      if (lastPoolData && lastPoolData.pokemonCounts) {
        family.forEach(formName => {
          const formCount = lastPoolData.pokemonCounts[formName] || 0;
          if (formCount > 0) {
            const cost = getEvolutionCost(formName);
            copiesTaken += formCount * cost;
          }
        });
      }
      
      // Calculate copiesOwned from player's board+bench (star-weighted)
      let copiesOwned = 0;
      if (state.playerName && playerUnits.length > 0) {
        playerUnits.forEach(unit => {
          if (family.includes(unit.name?.toUpperCase())) {
            const starMultiplier = unit.stars === 3 ? 9 : unit.stars === 2 ? 3 : 1;
            copiesOwned += starMultiplier;
          }
        });
      }
      
      // Check if already maxed - can't find more in shop
      const isMaxed = copiesOwned >= copiesNeeded;
      
      // If maxed, skip probability calculations
      if (isMaxed) {
        results.push({
          target: target,
          perRefresh: 0,
          expected: Infinity,
          maxCopies: target.evo === 'twoStar' ? POOL_COPIES[target.rarity].twoStar : POOL_COPIES[target.rarity].threeStar,
          copiesTaken: 0,
          poolRemaining: 0,
          copiesOwned: copiesOwned,
          copiesNeeded: copiesNeeded,
          isMaxed: true,
          isImpossible: false,
          isDanger: false
        });
        return; // Don't include in combined probability
      }
      
      // Calculate for this target
      const totalPool = calculateTotalPool();
      const totalWildCounts = calculateWildCounts();
      const pool = totalPool[target.rarity];
      const rarityOdds = SHOP_ODDS[state.level];
      const rarityChance = rarityOdds[target.rarity] / 100;
      
      const wildCountsForRarity = totalWildCounts[target.rarity];
      const maxTargetCopies = target.evo === 'twoStar' ? POOL_COPIES[target.rarity].twoStar : POOL_COPIES[target.rarity].threeStar;
      
      // Pool remaining = max - taken globally
      const poolRemaining = Math.max(0, maxTargetCopies - copiesTaken);
      const targetCopies = poolRemaining;  // For probability calc, use remaining
      
      // Impossible/Danger checks
      const availableToPlayer = poolRemaining + copiesOwned;
      const isImpossible = availableToPlayer < copiesNeeded;
      const isDanger = !isImpossible && availableToPlayer < copiesNeeded + 2;
      
      // Get pool reductions from extraction data
      let visibleTwoStar = 0;
      let visibleThreeStar = 0;
      
      if (lastPoolData && lastPoolData.poolReductions && lastPoolData.poolReductions[target.rarity]) {
        visibleTwoStar = lastPoolData.poolReductions[target.rarity].twoStar || 0;
        visibleThreeStar = lastPoolData.poolReductions[target.rarity].threeStar || 0;
      }
      
      const relevantPoolBeforeVisible = target.evo === 'twoStar' ? pool.twoStarTotal : pool.threeStarTotal;
      const otherPoolPortion = target.evo === 'twoStar' ? pool.threeStarTotal : pool.twoStarTotal;
      
      // Reduce pools by visible units
      const relevantPoolAfterVisible = Math.max(0, relevantPoolBeforeVisible - (target.evo === 'twoStar' ? visibleTwoStar : visibleThreeStar));
      const otherPoolAfterVisible = Math.max(0, otherPoolPortion - (target.evo === 'twoStar' ? visibleThreeStar : visibleTwoStar));
      
      const totalPoolSize = relevantPoolAfterVisible + otherPoolAfterVisible;
      
      const totalWildCopiesBeforeReduction = target.evo === 'twoStar' ?
        wildCountsForRarity.twoStar * POOL_COPIES[target.rarity].twoStar :
        wildCountsForRarity.threeStar * POOL_COPIES[target.rarity].threeStar;
      const wildScoutedForRarity = state.wildUnitsTaken[target.rarity] || 0;
      const totalWildCopies = Math.max(0, totalWildCopiesBeforeReduction - wildScoutedForRarity);
      
      const wildBoost = state.pveRoundEnabled ? (0.05 + (state.wildUnitsOwned * 0.01)) : (state.wildUnitsOwned * 0.01);
      const safeWildBoost = isNaN(wildBoost) ? 0 : wildBoost;
      
      let perSlotProbTarget = 0;
      
      if (target.isWild) {
        const wildUnitsExist = target.evo === 'twoStar' ? wildCountsForRarity.twoStar > 0 : wildCountsForRarity.threeStar > 0;
        if (wildUnitsExist && totalWildCopies > 0 && safeWildBoost > 0) {
          perSlotProbTarget = safeWildBoost * rarityChance * (targetCopies / totalWildCopies);
        }
      } else {
        if (targetCopies > 0 && totalPoolSize > 0) {
          const baseProb = rarityChance * (targetCopies / totalPoolSize);
          perSlotProbTarget = (1 - safeWildBoost) * baseProb;
        }
      }
      
      const perRefresh = 1 - Math.pow(1 - perSlotProbTarget, 6);  // 6 shop slots
      const confidenceDecimal = (100 - state.confidencePercent) / 100;
      const expectedForConfidence = perRefresh > 0 ? Math.log(confidenceDecimal) / Math.log(1 - perRefresh) : Infinity;
      
      results.push({
        target: target,
        perRefresh: perRefresh,
        expected: expectedForConfidence,
        // New pool tracking fields
        maxCopies: maxTargetCopies,
        copiesTaken: copiesTaken,
        poolRemaining: poolRemaining,
        copiesOwned: copiesOwned,
        copiesNeeded: copiesNeeded,
        isMaxed: false,
        isImpossible: isImpossible,
        isDanger: isDanger
      });
      
      // For combined calculation
      if (perRefresh > 0) {
        combinedMissProb *= (1 - perRefresh);
      }
    });
    
    const combinedHitProb = 1 - combinedMissProb;
    const combinedExpected = combinedHitProb > 0 ? 1 / combinedHitProb : Infinity;
    
    return {
      individual: results,
      combined: {
        prob: combinedHitProb,
        expected: combinedExpected
      }
    };
  }
  
  // OPTIMIZATION: Create fingerprint of team state for dirty checking
  function createTeamFingerprint() {
    // Get player's board/bench for copiesOwned fingerprinting
    const playerBoard = lastPoolData?.playerBoards?.[state.playerName] || [];
    const playerBench = lastPoolData?.playerBenches?.[state.playerName] || [];
    
    // Capture exact pool state for each target
    const targetStates = state.teamTargets.map(target => {
      const baseForm = getBaseForm(target.pokemon);
      const rarity = POKEMON_DATA[baseForm]?.rarity;
      const family = getEvolutionFamily(baseForm);
      
      // Get exact pool reductions - no rounding
      const poolRed = lastPoolData?.poolReductions?.[rarity] || { twoStar: 0, threeStar: 0 };
      
      // Calculate copiesTaken from pokemonCounts
      let copiesTaken = 0;
      if (lastPoolData?.pokemonCounts) {
        family.forEach(formName => {
          const formCount = lastPoolData.pokemonCounts[formName] || 0;
          if (formCount > 0) {
            copiesTaken += formCount * getEvolutionCost(formName);
          }
        });
      }
      
      // Calculate copiesOwned from player's board/bench
      let copiesOwned = 0;
      [...playerBoard, ...playerBench].forEach(unit => {
        if (family.includes(unit.name?.toUpperCase())) {
          copiesOwned += unit.stars === 3 ? 9 : unit.stars === 2 ? 3 : 1;
        }
      });
      
      return [
        target.pokemon,
        copiesTaken,
        copiesOwned,
        target.isWild ? '1' : '0',
        target.enabled ? '1' : '0',
        state.level,
        poolRed.twoStar,
        poolRed.threeStar
      ].join(':');
    }).join('|');
    
    // Global state that affects all calculations
    const globalState = [
      state.round5Enabled ? '1' : '0',
      state.round8Enabled ? '1' : '0',
      state.round11Enabled ? '1' : '0',
      state.targetEvo,
      lastPoolData?.playerCount || 0,
      state.pveRoundEnabled ? '1' : '0',
      state.wildUnitsOwned || 0,
      JSON.stringify(state.wildUnitsTaken),
      state.playerName || '',
      state.activeRegionalPokemon.join(','),
      state.activeAdditionalPokemon.join(',')
    ].join(':');
    
    return `${targetStates}||${globalState}`;
  }

  function updateTeamDisplay() {
    const list = document.getElementById('pacTeamList');
    const combinedProbEl = document.getElementById('pacTeamCombinedProb');
    const combinedRollsEl = document.getElementById('pacTeamCombinedRolls');
    
    // OPTIMIZATION: Dirty check - only render if pool state changed
    const fingerprint = createTeamFingerprint();
    if (fingerprint === lastTeamFingerprint) {
      if (DEBUG_MODE) console.log('⚡ SKIP: Team panel unchanged');
      return;
    }
    lastTeamFingerprint = fingerprint;
    
    if (DEBUG_MODE) {
      if (DEBUG_MODE) console.log('updateTeamDisplay called', {
        listExists: !!list,
        targetsCount: state.teamTargets.length,
        targets: state.teamTargets
      });
    }
    
    if (!list) {
      if (DEBUG_MODE) console.error('Team list element not found!');
      return;
    }
    
    if (state.teamTargets.length === 0) {
      list.innerHTML = `
        <div class="pac-team-empty">
          <div class="pac-team-empty-icon">🎯</div>
          <div>No Pokemon in team tracker</div>
          <div style="font-size: 11px; margin-top: 8px;">Click + Add Pokemon to start</div>
        </div>
      `;
      combinedProbEl.textContent = '0%';
      combinedRollsEl.textContent = '0 rolls';
      return;
    }
    
    const stats = calculateTeamStats();
    
    // Render team list
    list.innerHTML = state.teamTargets.map(target => {
      const result = stats.individual.find(r => r.target.id === target.id);
      const isActive = state.targetPokemon === target.pokemon;
      const notInPool = result && result.notInPool;
      const availabilityReason = result && result.availabilityReason;
      const isDisabled = result && result.disabled;
      const isImpossible = result && result.isImpossible;
      const isDanger = result && result.isDanger;
      const isMaxed = result && result.isMaxed;
      
      let probText = '0%';
      let rollsText = '∞';
      let poolText = '';
      let ownedText = '';
      
      if (result && !notInPool && !isDisabled) {
        if (isMaxed) {
          probText = '—';
          rollsText = '—';
          poolText = 'MAXED';
          ownedText = `${result.copiesOwned}/${result.copiesNeeded} ✓`;
        } else {
          probText = (result.perRefresh * 100).toFixed(1) + '%';
          rollsText = isFinite(result.expected) ? Math.ceil(result.expected).toString() : '∞';
          poolText = `${result.poolRemaining}/${result.maxCopies}`;
          ownedText = result.copiesOwned > 0 ? `You: ${result.copiesOwned}/${result.copiesNeeded}` : `Need: ${result.copiesNeeded}`;
        }
      }
      
      const rarityColors = {
        common: '#9ca3af',
        uncommon: '#10b981',
        rare: '#00d9ff',
        epic: '#a855f7',
        ultra: '#ef4444',
        unique: '#ff6b6b',
        legendary: '#ffd700',
        special: '#e91e63',
        hatch: '#00bcd4'
      };
      
      // Build CSS classes
      const itemClasses = [
        'pac-team-item',
        isActive ? 'active' : '',
        notInPool ? 'not-in-pool' : '',
        isMaxed ? 'pac-maxed' : '',
        isImpossible ? 'pac-impossible' : '',
        isDanger ? 'pac-danger' : ''
      ].filter(Boolean).join(' ');
      
      return `
        <div class="${itemClasses}" data-id="${target.id}">
          <div class="pac-team-item-header">
            <input type="checkbox" class="pac-team-checkbox" ${target.enabled ? 'checked' : ''} data-id="${target.id}" title="Enable/Disable">
            <span class="pac-team-name" style="color: ${rarityColors[target.rarity]}" data-id="${target.id}">${target.displayName}</span>
            ${isMaxed ? '<span class="pac-warning-badge pac-maxed-badge" title="Fully evolved!">✓</span>' : ''}
            ${isImpossible ? '<span class="pac-warning-badge pac-impossible-badge" title="Cannot max - not enough copies in pool">✗</span>' : ''}
            ${isDanger ? '<span class="pac-warning-badge pac-danger-badge" title="Low copies remaining">⚠</span>' : ''}
            <button class="pac-team-remove" data-id="${target.id}">×</button>
          </div>
          <div class="pac-team-meta">
            <span style="color: ${rarityColors[target.rarity]}">${target.rarity.charAt(0).toUpperCase() + target.rarity.slice(1)}</span>
            <span style="margin: 0 8px;">•</span>
            <span>${target.evo === 'twoStar' ? '2★' : '3★'}</span>
            <span style="margin: 0 8px;">•</span>
            <label style="display: inline-flex; align-items: center; gap: 4px; cursor: pointer; color: ${target.isWild ? '#fbbf24' : '#888'};">
              <input type="checkbox" class="pac-team-wild-checkbox" ${target.isWild ? 'checked' : ''} data-id="${target.id}" style="cursor: pointer;">
              <span>Wild</span>
            </label>
            ${notInPool ? `<span style="margin: 0 8px;">•</span><span style="color: #fbbf24; font-size: 10px;">${availabilityReason || 'Not in pool'}</span>` : ''}
          </div>
          ${target.enabled ? `
            <div class="pac-team-stats">
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">Pool</div>
                <div class="pac-team-stat-mini-value ${notInPool ? '' : isMaxed ? 'pac-maxed-text' : ''} ${!notInPool && isImpossible ? 'pac-impossible-text' : ''} ${!notInPool && isDanger ? 'pac-danger-text' : ''}">${notInPool ? 'N/A' : poolText}</div>
              </div>
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">${!notInPool && result && result.copiesOwned > 0 ? 'Owned' : 'Goal'}</div>
                <div class="pac-team-stat-mini-value ${!notInPool && isMaxed ? 'pac-maxed-text' : ''}">${notInPool ? 'N/A' : ownedText}</div>
              </div>
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">Per Roll</div>
                <div class="pac-team-stat-mini-value" style="${notInPool ? 'color: #ef4444;' : ''}">${notInPool ? '0%' : probText}</div>
              </div>
              <div class="pac-team-stat-mini">
                <div class="pac-team-stat-mini-label">Expected</div>
                <div class="pac-team-stat-mini-value">${notInPool ? '—' : rollsText}${!notInPool && !isMaxed ? ' rolls' : ''}</div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    // Combined stats
    const enabledCount = state.teamTargets.filter(t => t.enabled).length;
    if (enabledCount > 0) {
      combinedProbEl.textContent = (stats.combined.prob * 100).toFixed(1) + '%';
      combinedRollsEl.textContent = isFinite(stats.combined.expected) ? Math.ceil(stats.combined.expected) + ' rolls' : '∞';
    } else {
      combinedProbEl.textContent = '0%';
      combinedRollsEl.textContent = '0 rolls';
    }
    
    // Attach event listeners
    list.querySelectorAll('.pac-team-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleTeamTarget(parseFloat(e.target.dataset.id));
      });
    });
    
    list.querySelectorAll('.pac-team-wild-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleTeamTargetWild(parseFloat(e.target.dataset.id));
      });
    });
    
    list.querySelectorAll('.pac-team-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeTeamTarget(parseFloat(e.target.dataset.id));
      });
    });
    
    list.querySelectorAll('.pac-team-name').forEach(name => {
      name.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveTeamTarget(parseFloat(e.target.dataset.id));
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════════════
  // EULA / PRIVACY NOTICE
  // ═══════════════════════════════════════════════════════════════════════════
  
  function showEULA() {
    return new Promise((resolve) => {
      const eulaOverlay = document.createElement('div');
      eulaOverlay.id = 'pac-eula-overlay';
      eulaOverlay.innerHTML = `
        <div id="pac-eula-modal">
          <div class="pac-eula-title">🎮 Pokemon Auto Chess Live Data Calculator - Terms & Privacy Notice</div>
          
          <div class="pac-eula-content">
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">Welcome!</div>
              <p>Thank you for using Pokemon Auto Chess Live Data Calculator. Before you begin, please review and accept the following terms:</p>
            </div>
            
            <div class="pac-eula-highlight">
              <strong>✅ 100% Safe & TOS Compliant</strong>
              <p style="margin: 8px 0 0 0;">This extension is a <strong>read-only calculator tool</strong>. It does NOT:</p>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li>Modify game files or memory</li>
                <li>Automate gameplay or provide unfair advantages</li>
                <li>Violate Pokemon Auto Chess Terms of Service</li>
                <li>Interact with game servers in any way</li>
              </ul>
              <p style="margin: 8px 0 0 0;"><strong>This is purely a probability calculator</strong> - similar to using a calculator app while playing poker.</p>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">🔒 Your Privacy & Data</div>
              <p><strong>Zero data collection. Zero tracking. Zero transmission.</strong></p>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li><strong>All data stays on YOUR device</strong> - nothing is sent to any server</li>
                <li><strong>No personal information collected</strong> - no emails, no IPs, no tracking</li>
                <li><strong>No analytics, no telemetry, no third parties</strong></li>
                <li><strong>Local storage only</strong> - your settings (player name, team targets) are saved in your browser's localStorage for convenience</li>
              </ul>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">📊 What This Tool Does</div>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li>Reads public game state (Pokemon counts in the current match)</li>
                <li>Calculates probability of finding specific Pokemon</li>
                <li>Tracks your board/bench when you provide your in-game name</li>
                <li>Saves your preferences locally for convenience</li>
              </ul>
            </div>
            
            <div class="pac-eula-warning">
              <strong>⚠️ Use Responsibly</strong>
              <p style="margin: 8px 0 0 0;">While this tool is safe and compliant, I recommend:</p>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                <li>Don't rely solely on calculations - use game knowledge too</li>
                <li>Be respectful to other players</li>
                <li><strong>Calculator bug/issue?</strong> Contact me: <strong>@Deuce222X</strong> in the official Discord (DMs/pings welcome!)</li>
                <li><strong>Game issue?</strong> Contact moderators in the official Pokemon Auto Chess Discord</li>
              </ul>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">⚖️ Disclaimer</div>
              <p style="font-size: 12px; color: #999;">
                This is an independent, open-source tool created by a solo developer (@Deuce222X) for educational and strategic purposes. 
                Not affiliated with or endorsed by Pokemon Auto Chess developers. 
                Use at your own discretion. The developer of this tool is not responsible for any consequences of its use.
              </p>
            </div>
            
            <div class="pac-eula-section">
              <div class="pac-eula-section-title">📞 Contact</div>
              <p style="font-size: 12px; color: #64b5f6;">
                Find me in the official Pokemon Auto Chess Discord: <strong>@Deuce222X</strong><br>
                Open to DMs and pings for calculator-related questions, bugs, or suggestions!
              </p>
            </div>
          </div>
          
          <div class="pac-eula-checkboxes">
            <div class="pac-eula-checkbox-row" data-checkbox="1">
              <div class="pac-eula-custom-checkbox" id="pac-eula-understand"></div>
              <label>I understand this tool is safe, read-only, and does not violate Terms of Service</label>
            </div>
            <div class="pac-eula-checkbox-row" data-checkbox="2">
              <div class="pac-eula-custom-checkbox" id="pac-eula-privacy"></div>
              <label>I understand no personal data is collected or transmitted - all data stays on my device</label>
            </div>
            <div class="pac-eula-checkbox-row" data-checkbox="3">
              <div class="pac-eula-custom-checkbox" id="pac-eula-agree"></div>
              <label>I agree to use this tool responsibly and at my own discretion</label>
            </div>
          </div>
          
          <button id="pac-eula-accept" class="pac-eula-button" disabled>I Understand and Agree - Start Using PAC Live Data Calculator</button>
        </div>
      `;
      
      document.body.appendChild(eulaOverlay);
      if (DEBUG_MODE) console.log('✅ EULA overlay appended to body');
      if (DEBUG_MODE) console.log('📋 EULA overlay element:', eulaOverlay);
      if (DEBUG_MODE) console.log('📐 EULA overlay computed style:', window.getComputedStyle(eulaOverlay).display);
      
      const checkbox1 = document.getElementById('pac-eula-understand');
      const checkbox2 = document.getElementById('pac-eula-privacy');
      const checkbox3 = document.getElementById('pac-eula-agree');
      const acceptBtn = document.getElementById('pac-eula-accept');
      
      if (DEBUG_MODE) console.log('✅ Found checkboxes and button:', {
        checkbox1: !!checkbox1,
        checkbox2: !!checkbox2,
        checkbox3: !!checkbox3,
        acceptBtn: !!acceptBtn
      });
      
      function checkAll() {
        if (checkbox1.classList.contains('checked') && 
            checkbox2.classList.contains('checked') && 
            checkbox3.classList.contains('checked')) {
          acceptBtn.disabled = false;
        } else {
          acceptBtn.disabled = true;
        }
      }
      
      checkbox1.addEventListener('click', () => {
        checkbox1.classList.toggle('checked');
        checkAll();
      });
      checkbox2.addEventListener('click', () => {
        checkbox2.classList.toggle('checked');
        checkAll();
      });
      checkbox3.addEventListener('click', () => {
        checkbox3.classList.toggle('checked');
        checkAll();
      });
      
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('pac_eulaAccepted', 'true');
        eulaOverlay.remove();
        resolve();
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELP MODAL
  // ═══════════════════════════════════════════════════════════════════════════

  function openHelpModal() {
    // Remove existing modal if any
    const existing = document.getElementById('pac-help-overlay');
    if (existing) existing.remove();
    
    const helpOverlay = document.createElement('div');
    helpOverlay.id = 'pac-help-overlay';
    helpOverlay.innerHTML = `
      <div id="pac-help-modal">
        <div class="pac-help-header">
          <span class="pac-help-title">📖 PAC Live Data Calculator - Help</span>
          <button class="pac-help-close" id="pac-help-close">×</button>
        </div>
        
        <div class="pac-help-content">
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">⌨️</span> Keyboard Shortcuts</div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Toggle Calculator</span>
              <span class="pac-help-shortcut-key">ALT + Shift + P</span>
            </div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Toggle Reroll Blocking</span>
              <span class="pac-help-shortcut-key">ALT + Shift + Y</span>
            </div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Reset Position to Center</span>
              <span class="pac-help-shortcut-key">ALT + Shift + R</span>
            </div>
            <div class="pac-help-shortcut">
              <span class="pac-help-shortcut-desc">Dismiss Flash Alert</span>
              <span class="pac-help-shortcut-key">Click × or ESC</span>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎯</span> Main Calculator</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Per-Refresh Probability</div>
              <div class="pac-help-feature-desc">Shows the chance of finding your target Pokemon in any given shop refresh, based on current pool state and your level.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Expected Rolls & Gold Cost</div>
              <div class="pac-help-feature-desc">Estimates how many rolls (and gold) needed to reach your desired confidence level. Updates live as the pool changes.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Pool Tracking</div>
              <div class="pac-help-feature-desc">Shows copies remaining vs total for your target. Accounts for copies on all boards, benches, and shops.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🌍</span> Smart Detection</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Regional & Add Pick Detection</div>
              <div class="pac-help-feature-desc">Hover over the regional/add pick icons in-game to auto-detect which Pokemon are available this match. Click to confirm when multiple Pokemon share the same types.</div>
            </div>
            <div class="pac-help-tip">
              <div class="pac-help-tip-title">💡 Tip</div>
              <div class="pac-help-tip-text">Entering a new regional portal? Just re-hover the regional icons to update detection automatically.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">📊</span> Counter Intelligence Panel</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">8-Player Overview</div>
              <div class="pac-help-feature-desc">See all players' boards, benches, and shops at a glance. Know who's contesting your targets.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Contested Detection</div>
              <div class="pac-help-feature-desc">Warns when opponents are building the same Pokemon you're targeting. Helps you pivot early.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Flash Alerts</div>
              <div class="pac-help-feature-desc">Screen flashes when your target appears in YOUR shop. Never miss a key unit!</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎯</span> Team Tracker</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Multi-Target Tracking</div>
              <div class="pac-help-feature-desc">Track multiple Pokemon simultaneously. Each shows its own probability, pool count, and warnings.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Smart Warnings</div>
              <div class="pac-help-feature-desc">MAXED = all copies accounted for. IMPOSSIBLE = none left in pool. DANGER = very few remaining.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎰</span> Roll Luck Tracker</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Live Tab</div>
              <div class="pac-help-feature-desc">Per-player roll history showing exactly what Pokemon appeared in each shop.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Analytics Tab</div>
              <div class="pac-help-feature-desc">Overall luck score, rarity hit rates, luckiest/unluckiest Pokemon, Ditto tracking, and a narrative summary of your session.</div>
            </div>
            <div class="pac-help-tip">
              <div class="pac-help-tip-title">💡 Tip</div>
              <div class="pac-help-tip-text">Data persists across sessions via localStorage. Wild Pokemon and Ditto are tracked separately and don't affect your luck score.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🌿</span> Wild Pokemon Support</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Auto-Detection</div>
              <div class="pac-help-feature-desc">All 67 wild Pokemon families are automatically detected. Wild checkbox auto-enables when targeting a wild Pokemon.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Wild Stars Counting</div>
              <div class="pac-help-feature-desc">Each wild star on your board adds +1% to wild odds. PVE rounds add +5% automatically.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🎣</span> Fishing Tab</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Rod-Based Catch Rates</div>
              <div class="pac-help-feature-desc">Shows catch percentages by rarity for each rod tier. Old Rod from Water(3), Good Rod from Water(6), Super Rod from Water(9).</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Special Catches</div>
              <div class="pac-help-feature-desc">Old Rod: Magikarp (55%), Good Rod: Feebas (35%), Super Rod: Wishiwashi (35%). Toggle Mantyke for +33% Remoraid chance.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Fishable Pool</div>
              <div class="pac-help-feature-desc">Shows all Water-type Pokemon you can catch, including your regionals and add-picks. Does NOT deplete the main shop pool.</div>
            </div>
            <div class="pac-help-tip">
              <div class="pac-help-tip-title">⚠️ Important</div>
              <div class="pac-help-tip-text">Fishing requires a free bench slot or the catch is lost!</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">🧪</span> Experimental Features</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">How to Access</div>
              <div class="pac-help-feature-desc">Click the EXP button in the header, then press ALT + Shift + Y to unlock experimental features. Button turns gold when active.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Mono-Type Challenge</div>
              <div class="pac-help-feature-desc">Restrict yourself to one Pokemon type! Spin the wheel for random selection. Shop blockers prevent purchasing non-matching types. 18 types available with color-coded UI.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Reroll Blocking</div>
              <div class="pac-help-feature-desc">Places a blocker overlay over the refresh button to prevent accidental clicks. Works best with polling set to 30ms for instant coverage.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Random Draft</div>
              <div class="pac-help-feature-desc">Spins a roulette across your shop slots and randomly picks one - all other slots get blocked! Forces you to buy the chosen slot. Re-spins after each purchase.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Copycat</div>
              <div class="pac-help-feature-desc">Only allows buying Pokemon that other players already have on their boards. Forces you to play contested units and follow the lobby meta!</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">MLG Mode</div>
              <div class="pac-help-feature-desc">420 NO SCOPE! Triggers hitmarkers, lens flares, screen shake, and epic text popups when you find targets in shop. Pure visual chaos for the memes.</div>
            </div>
          </div>
          
          <div class="pac-help-section">
            <div class="pac-help-section-title"><span class="emoji">⚡</span> Live Data & Privacy</div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">Real-Time Extraction</div>
              <div class="pac-help-feature-desc">Game state is read every 30ms at max speed. Stage tracking with PVE/PVP detection updates automatically.</div>
            </div>
            <div class="pac-help-feature">
              <div class="pac-help-feature-title">100% Private</div>
              <div class="pac-help-feature-desc">Zero network requests. Zero data collection. Everything runs locally in your browser. Settings saved to localStorage only.</div>
            </div>
          </div>
        </div>
        
        <div class="pac-help-version">
          v3.2.1 • Made by <a href="https://github.com/DonaldGallianoIII" target="_blank">Galliano Games</a> • Discord: @Deuce222X
        </div>
      </div>
    `;
    
    document.body.appendChild(helpOverlay);
    
    // Close button handler
    document.getElementById('pac-help-close').addEventListener('click', () => {
      helpOverlay.remove();
    });
    
    // Click outside to close
    helpOverlay.addEventListener('click', (e) => {
      if (e.target === helpOverlay) {
        helpOverlay.remove();
      }
    });
    
    // ESC to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        helpOverlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  function init() {
    const overlay = createOverlay();
    setupDrag(overlay);
    setupResize(overlay);
    loadPosition();
    setupCollapsibles();
    setupTeamPanel();
    setupCurrentPanel();
    setupSettingsPanel();
    setupHistoryPanel();
    loadRollHistory();  // Load roll history from localStorage
    bindUI();
    setupKeyboardShortcut();
    setupInputProtection();
    setupRefreshBlocker();
    setupExperimentalButton();
    populateSynergyBar();
    setupMonoTypePanel();
    setupRandomDraftPanel();
    setupCopycatPanel();
    setupMlgPanel();
    setupFishingTab();
    
    // Load saved data from localStorage
    try {
      const savedPlayerName = localStorage.getItem('pac_playerName');
      if (savedPlayerName) {
        state.playerName = savedPlayerName;
        const playerNameInput = document.getElementById('pacPlayerName');
        if (playerNameInput) {
          playerNameInput.value = savedPlayerName;
        }
        if (DEBUG_MODE) console.log('✅ Loaded playerName from localStorage:', savedPlayerName);
      }
      
      const savedTeamTargets = localStorage.getItem('pac_teamTargets');
      if (savedTeamTargets) {
        state.teamTargets = JSON.parse(savedTeamTargets);
        
        // Migration: Fix any targets with incorrect evo values or missing wild status
        let needsSave = false;
        state.teamTargets.forEach(target => {
          // Fix evo values
          const baseForm = getBaseForm(target.pokemon);
          const evolutionChain = EVOLUTION_CHAINS[baseForm];
          if (evolutionChain && evolutionChain[0] && evolutionChain[0].maxStars !== undefined) {
            const correctEvo = evolutionChain[0].maxStars === 3 ? 'threeStar' : 'twoStar';
            if (target.evo !== correctEvo) {
              if (DEBUG_MODE) console.log(`🔧 Migrating ${target.pokemon}: ${target.evo} → ${correctEvo}`);
              target.evo = correctEvo;
              needsSave = true;
            }
          }
          
          // Fix wild status
          const shouldBeWild = isWildPokemon(target.pokemon);
          if (target.isWild !== shouldBeWild) {
            if (DEBUG_MODE) console.log(`🔧 Migrating ${target.pokemon}: isWild ${target.isWild} → ${shouldBeWild}`);
            target.isWild = shouldBeWild;
            needsSave = true;
          }
        });
        
        // Save if any migrations were applied
        if (needsSave) {
          localStorage.setItem('pac_teamTargets', JSON.stringify(state.teamTargets));
          if (DEBUG_MODE) console.log('✅ Saved migrated team targets');
        }
        
        updateTeamDisplay();
        if (DEBUG_MODE) console.log('✅ Loaded', state.teamTargets.length, 'team targets from localStorage');
      }
    } catch (err) {
      if (DEBUG_MODE) console.warn('Failed to load from localStorage:', err);
    }
    
    updateDisplay();
    
    // Setup portal/regional detection observer (v3.0.2)
    setupPortalDetection();
    
    if (DEBUG_MODE) console.log('🎮 PAC Calculator v3.2.1: Overlay ready');
    if (DEBUG_MODE) console.log('   • 1060 pokemon database loaded');
    if (DEBUG_MODE) console.log('   • Autocomplete selector active');
    if (DEBUG_MODE) console.log('   • Drag header to move');
    if (DEBUG_MODE) console.log('   • Shift+Alt+P to toggle');
    if (DEBUG_MODE) console.log('   • Click "Live Tracking" to start polling');
  }

  // Wait for page to be ready
  async function start() {
    if (DEBUG_MODE) console.log('🚀 PAC Calculator starting...');
    
    // Inject CSS FIRST (before EULA so it's styled properly)
    if (!document.getElementById('pac-calc-styles')) {
      const style = document.createElement('style');
      style.id = 'pac-calc-styles';
      style.textContent = `
        /* Copy all CSS from createOverlay here - just the EULA part for now */
        #pac-eula-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(0, 0, 0, 0.95) !important;
          z-index: 2147483647 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          backdrop-filter: blur(10px);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        #pac-eula-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #0f3460;
          border-radius: 12px;
          max-width: 600px;
          max-height: 80vh;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          color: #e9e9e9;
          overflow-y: auto;
          position: relative;
          z-index: 2147483647 !important;
        }
        
        .pac-eula-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #64b5f6;
          text-align: center;
        }
        
        .pac-eula-content {
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 20px;
          color: #ccc;
        }
        
        .pac-eula-section {
          margin-bottom: 16px;
        }
        
        .pac-eula-section-title {
          font-size: 14px;
          font-weight: 600;
          color: #64b5f6;
          margin-bottom: 8px;
        }
        
        .pac-eula-highlight {
          background: rgba(76, 175, 80, 0.2);
          padding: 12px;
          border-left: 3px solid #4caf50;
          border-radius: 4px;
          margin: 12px 0;
        }
        
        .pac-eula-warning {
          background: rgba(255, 152, 0, 0.2);
          padding: 12px;
          border-left: 3px solid #ff9800;
          border-radius: 4px;
          margin: 12px 0;
        }
        
        .pac-eula-checkboxes {
          margin: 20px 0;
        }
        
        .pac-eula-checkbox-row {
          display: flex !important;
          align-items: flex-start !important;
          gap: 12px !important;
          margin-bottom: 12px !important;
          padding: 12px !important;
          background: rgba(255,255,255,0.03) !important;
          border-radius: 6px !important;
          cursor: pointer !important;
        }
        
        .pac-eula-custom-checkbox {
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          min-height: 32px !important;
          background: #000 !important;
          border: 2px solid #4caf50 !important;
          border-radius: 6px !important;
          cursor: pointer !important;
          position: relative !important;
          transition: all 0.2s !important;
          flex-shrink: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .pac-eula-custom-checkbox:hover {
          border-color: #66bb6a !important;
          box-shadow: 0 0 8px rgba(76, 175, 80, 0.4) !important;
        }
        
        .pac-eula-custom-checkbox.checked {
          background: #4caf50 !important;
          border-color: #66bb6a !important;
        }
        
        .pac-eula-custom-checkbox.checked::after {
          content: '✓' !important;
          color: #fff !important;
          font-size: 24px !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          text-shadow: 
            -1px -1px 0 #2196f3,
            1px -1px 0 #2196f3,
            -1px 1px 0 #2196f3,
            1px 1px 0 #2196f3,
            0 0 6px #2196f3 !important;
        }
        
        .pac-eula-checkbox-row label {
          flex: 1;
          cursor: pointer;
          font-size: 13px;
          line-height: 1.5;
        }
        
        .pac-eula-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .pac-eula-button:disabled {
          background: #444;
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .pac-eula-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        }
      `;
      document.head.appendChild(style);
      if (DEBUG_MODE) console.log('✅ Injected EULA styles');
    }
    
    // Check if EULA has been accepted
    const eulaAccepted = localStorage.getItem('pac_eulaAccepted');
    if (DEBUG_MODE) console.log('📜 EULA acceptance status:', eulaAccepted);
    
    if (!eulaAccepted) {
      if (DEBUG_MODE) console.log('⏳ Showing EULA modal...');
      await showEULA();
      if (DEBUG_MODE) console.log('✅ EULA accepted!');
    } else {
      if (DEBUG_MODE) console.log('✅ EULA already accepted, skipping');
    }
    
    // Now initialize the calculator
    if (DEBUG_MODE) console.log('🎮 Initializing calculator...');
    init();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    setTimeout(start, 500);
  }

  // Expose for debugging
  window.__PACCalc = {
    isConnected: () => isConnected,
    getState: () => state,
    getPoolData: () => lastPoolData,
    getPokemonData: () => POKEMON_DATA,
    recalculate: updateDisplay,
    requestExtraction: () => window.postMessage({ type: 'PAC_EXTRACT_REQUEST' }, '*'),
    reinject: injectExtractor,
    resetEULA: () => {
      localStorage.removeItem('pac_eulaAccepted');
      if (DEBUG_MODE) console.log('✅ EULA reset! Refresh the page to see it again.');
    }
  };
})();
