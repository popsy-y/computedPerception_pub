import fs from 'fs';
const templates = JSON.parse(fs.readFileSync("./templates.json"));

export async function interrogateAuditory(addr, template, chord){
    let invalidFormat = true;
    let emotions;

    while(invalidFormat){
        emotions = await request(addr, template, chord);
        emotions = emotions.results[0].history.visible[0][1];
        console.log("auditEmotions:\n" + emotions);

        // If imgEmotion contains line break and character ":"
        if (emotions.indexOf("\n") > 0) {
            emotions = emotions.substring(emotions.indexOf("\n")+1);
            invalidFormat = false;
        }else if(emotions.indexOf(":") > 0){
            emotions = emotions.substring(emotions.indexOf(":")+1);
            invalidFormat = false;
        }else if(emotions.indexOf("(") == 0){
            invalidFormat = false;
        }

        console.log("auditEmoLoop\n");
    }

    return emotions;
}

async function request(addr, template, option){
    const params = {
        "method": "POST",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(
            {
                "user_input": template + option,
                "auto_max_new_tokens": false,
                "instruction_template": "Llama-v2",
                "mode": "instruct",
                "regenerate": false,
                "_continue": false,
                "preset": "selfish_v1",
            }
        )
    };

    const req = await fetch(addr, params);
    return req.json();
}

//  observe auditory / Tidal setup
// -----------------------------------------
//  SETUP
// ----------------
const stdin = process.stdin;
const stderr = process.stderr;
const stdout = process.stdout;

import { spawn } from 'child_process';

// spawn
console.log('trying to boot tidal');
const tidal = spawn('ghci', ['-XOverloadedStrings']);

// setup tidal i/o
const output = tidal.stdin;

export async function setupTidalIo(){
    tidal.stderr.addListener("data", function(m) {
        console.error(m.toString());
    });
    tidal.stdout.addListener("data", function(m) {
        console.log(m.toString());
    });
    
    fs.readFile('.ghciNoVisuals', 'utf8', (err, data) => {
        if(err){console.error(err);return;}
        output.write(data);
        console.log('tidal/ghci initialized.');
    });
}

//  INITIATE
// -------------------
export function initiateTidal(){
    const sfmDefs = `
    -- modulators
    let mod11 = pF "mod11"
        mod12 = pF "mod12"
        mod13 = pF "mod13"
        mod14 = pF "mod14"
        mod15 = pF "mod15"
        mod16 = pF "mod16"
        mod21 = pF "mod21"
        mod22 = pF "mod22"
        mod23 = pF "mod23"
        mod24 = pF "mod24"
        mod25 = pF "mod25"
        mod26 = pF "mod26"
        mod31 = pF "mod31"
        mod32 = pF "mod32"
        mod33 = pF "mod33"
        mod34 = pF "mod34"
        mod35 = pF "mod35"
        mod36 = pF "mod36"
        mod41 = pF "mod41"
        mod42 = pF "mod42"
        mod43 = pF "mod43"
        mod44 = pF "mod44"
        mod45 = pF "mod45"
        mod46 = pF "mod46"
        mod51 = pF "mod51"
        mod52 = pF "mod52"
        mod53 = pF "mod53"
        mod54 = pF "mod54"
        mod55 = pF "mod55"
        mod56 = pF "mod56"
        mod61 = pF "mod61"
        mod62 = pF "mod62"
        mod63 = pF "mod63"
        mod64 = pF "mod64"
        mod65 = pF "mod65"
        mod66 = pF "mod66"
        -- operator envelope generator levels
        eglevel11 = pF "eglevel11"
        eglevel12 = pF "eglevel12"
        eglevel13 = pF "eglevel13"
        eglevel14 = pF "eglevel14"
        eglevel21 = pF "eglevel21"
        eglevel22 = pF "eglevel22"
        eglevel23 = pF "eglevel23"
        eglevel24 = pF "eglevel24"
        eglevel31 = pF "eglevel31"
        eglevel32 = pF "eglevel32"
        eglevel33 = pF "eglevel33"
        eglevel34 = pF "eglevel34"
        eglevel41 = pF "eglevel41"
        eglevel42 = pF "eglevel42"
        eglevel43 = pF "eglevel43"
        eglevel44 = pF "eglevel44"
        eglevel51 = pF "eglevel51"
        eglevel52 = pF "eglevel52"
        eglevel53 = pF "eglevel53"
        eglevel54 = pF "eglevel54"
        eglevel61 = pF "eglevel61"
        eglevel62 = pF "eglevel62"
        eglevel63 = pF "eglevel63"
        eglevel64 = pF "eglevel64"
        -- operator envelope generator rates
        egrate11 = pF "egrate11"
        egrate12 = pF "egrate12"
        egrate13 = pF "egrate13"
        egrate14 = pF "egrate14"
        egrate21 = pF "egrate21"
        egrate22 = pF "egrate22"
        egrate23 = pF "egrate23"
        egrate24 = pF "egrate24"
        egrate31 = pF "egrate31"
        egrate32 = pF "egrate32"
        egrate33 = pF "egrate33"
        egrate34 = pF "egrate34"
        egrate41 = pF "egrate41"
        egrate42 = pF "egrate42"
        egrate43 = pF "egrate43"
        egrate44 = pF "egrate44"
        egrate51 = pF "egrate51"
        egrate52 = pF "egrate52"
        egrate53 = pF "egrate53"
        egrate54 = pF "egrate54"
        egrate61 = pF "egrate61"
        egrate62 = pF "egrate62"
        egrate63 = pF "egrate63"
        egrate64 = pF "egrate64"
        -- operator output levels
        amp1 = pF "amp1"
        amp2 = pF "amp2"
        amp3 = pF "amp3"
        amp4 = pF "amp4"
        amp5 = pF "amp5"
        amp6 = pF "amp6"
        -- operator frequency ratios
        ratio1 = pF "ratio1"
        ratio2 = pF "ratio2"
        ratio3 = pF "ratio3"
        ratio4 = pF "ratio4"
        ratio5 = pF "ratio5"
        ratio6 = pF "ratio6"
        -- operator frequency detuners
        detune1 = pF "detune1"
        detune2 = pF "detune2"
        detune3 = pF "detune3"
        detune4 = pF "detune4"
        detune5 = pF "detune5"
        detune6 = pF "detune6"
        -- lfo
        lfofreq = pF "lfofreq"
        lfodepth = pF "lfodepth"
        feedback = pF "feedback"
    `;
    
    const d1 = `d1 $ slow 2 $ sound "superfm" # n "<[a'major c'major g'dom7 f'maj7] [a'major c'major g'minor f'minor] [a'major e'dom7 g'dom7 c'major]>/4" # amp1 1 # amp2 0.8 # amp3 0 # amp4 0.7 # amp5 0 # amp6 0 # egrate11 1 # eglevel12 0 # eglevel13 0 # egrate22 0.15 # eglevel22 0 # eglevel23 0 # ratio2 0.5 # mod13 1 # mod22 0.5 # mod23 2 # ratio3 1.01 # ratio4 1.5 # mod45 1 # egrate41 0 # egrate42 1 # egrate43 1 # eglevel41 1 # eglevel42 1 # eglevel43 0.1 # eglevel44 0.1 # egrate51 0 # egrate52 1 # egrate53 1 # eglevel51 1 # eglevel52 1 # eglevel53 0.25 # eglevel54 0.25 # room 1 # dry 0.9 # feedback 1`;

    const d2 = `d2 $ sound "superfm!4" # n "<[g d e a b g d a] [g b d a g d a e] [d g a e d a g b]>" # octave 4 # amp1 0.3 # amp2 0 # amp3 0 # amp4 0.5 # amp5 0 # amp6 0 # mod11 1 # mod66 1 # ratio6 1.5 # mod12 (irand 2) # mod62 (irand 2) # ratio2 0.25 # egrate21 0.5 # egrate23 "1 10 0.1" # eglevel22 "0.1 0.5 1" # eglevel23 1.5 # ratio5 "4 5 6" # mod45 1 # egrate41 0 # eglevel41 1 # eglevel42 1 # egrate43 0 # eglevel43 0 # feedback 1 # room 1 # dry 0.4`;

    const ptn4d3 = `let pats = [ ("a", s "[casio*4 ~!3]" # octave (irand 6)), ("b", gain 0)]`;

    const d3 = `d3 $ stack[ur 4 "b a b b" pats [] # gain 0.7, s "bottle!3" # n (irand 12) # gain 0.6 # room 1 # dry 0.9]`;

    const d4 = `d4 $ s "bd [bd ~ bd]" # gain 1.1 # room 1 # dry 0.9`

    tidalEval(sfmDefs);
    tidalEval(d1);
    tidalEval(d2);
    tidalEval(ptn4d3);
    tidalEval(d3);
    tidalEval(d4);
}

//  EVAL
// ---------------
function tidalEval(raw){
    const sanitized = sanitizeStringForTidal(raw);
    output.write(sanitized+"\n");
    stderr.write(sanitized+"\n");
}

export function tidalEvald1(rawList){
    let joinedChords = "";

    for (let i = 0; i < rawList.length; i++) {
        if (i == rawList.length-1) {
            joinedChords += "[" + rawList[i] + "]";
        }else{
            joinedChords += "[" + rawList[i] + "] ";
        }
    }

    if (rawList.length == 1) {
        joinedChords = joinedChords + "/4";
    }else{
        joinedChords = "<" + joinedChords + ">/" + rawList.length;
    }

    console.log("joinedChords:\n" + joinedChords);

    const joinedRaw = `
        d1 $ slow 2 $ sound "superfm" # n "${joinedChords}" # amp1 1 # amp2 0.8 # amp3 0 # amp4 0.7 # amp5 0 # amp6 0 # egrate11 1 # eglevel12 0 # eglevel13 0 # egrate22 0.15 # eglevel22 0 # eglevel23 0 # ratio2 0.5 # mod13 1 # mod22 0.5 # mod23 2 # ratio3 1.01 # ratio4 1.5 # mod45 1 # egrate41 0 # egrate42 1 # egrate43 1 # eglevel41 1 # eglevel42 1 # eglevel43 0.1 # eglevel44 0.1 # egrate51 0 # egrate52 1 # egrate53 1 # eglevel51 1 # eglevel52 1 # eglevel53 0.25 # eglevel54 0.25 # room 1 # dry 0.9 # feedback 1
    `;

    const sanitized = sanitizeStringForTidal(joinedRaw);
    output.write(sanitized+"\n");
    stderr.write(sanitized+"\n");
}



//  FUNCTIONS
// --------------------
function sanitizeStringForTidal(x) {
    let lines = x.split("\n");
    let result = "";
    let blockOpen = false;
    for(let n in lines) {
      let line = lines[n];
      let startsWithSpace = false;
      if(line[0] == " " || line[0] == "\t") startsWithSpace = true;
      if(blockOpen == false) {
        blockOpen = true;
        result = result + ":{\n" + line + "\n";
      }
      else if(startsWithSpace == false) {
        result = result + ":}\n:{\n" + line + "\n";
      }
      else if(startsWithSpace == true) {
        result = result + line + "\n";
      }
    }
    if(blockOpen == true) {
      result = result + ":}\n";
      blockOpen = false;
    }
    return result;
}