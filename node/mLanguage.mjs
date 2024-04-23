import fetch from 'node-fetch';
import fs from 'fs';
import { chordStrings } from './globalSequencer.mjs';
import { send } from './mNotifier.mjs';

const templates = JSON.parse(fs.readFileSync("./templates.json"));

export async function interrogateImgEmotion(addr, template, caption){
    let invalidFormat = true;
    let emotions;

    while(invalidFormat){
        emotions = await request(addr, template, caption);
        emotions = emotions.results[0].history.visible[0][1];
        console.log("imgEmotions:\n" + emotions);

        // If imgEmotion contains line break and character ":"
        if (emotions.indexOf("\n") > 0) {
            emotions = emotions.substring(emotions.indexOf("\n")+1);
            invalidFormat = false;
        }else if(emotions.indexOf(":") > 0){
            emotions = emotions.substring(emotions.indexOf(":")+1);
            invalidFormat = false;
        }

        console.log("sightEmoLoop\n");
    }

    return emotions;
}

export async function observeSightCaption(addr, template, emotions){
    let invalidFormat = true;
    let observedPrompt, prmpStart;

    while (invalidFormat) {
        observedPrompt = await request(addr, template, emotions);
        observedPrompt = observedPrompt.results[0].history.visible[0][1];

        console.log("\nimgPrmp: " + observedPrompt);

        prmpStart = observedPrompt.search(/\".{20,}/);

        if (prmpStart > -1) {
            invalidFormat = false;
        }

        console.log("sightPrmLoop\n");
    }

    observedPrompt = observedPrompt.substring(prmpStart);
    observedPrompt = observedPrompt.replace("&quot;", " ");

    return observedPrompt;
}

export async function observeAuditChords(addr, template, emotions){
    let invalidFormat = true;
    let chords;
    let loop = 0;

    while(invalidFormat){
        chords = await request(addr, template, emotions);
        chords = chords.results[0].history.visible[0][1];
        console.log("chordString:\n" + chords);

        chords = chords.substring(chords.lastIndexOf("\n")+1);

        chords = chords.replaceAll(" ", "");
        chords = chords.replaceAll("-", " ");
        chords = chords.replaceAll("dominant7", "dom7");
        chords = chords.replaceAll("dominant", "dom7");
        chords = chords.replaceAll("domin", "dom7");
        chords = chords.replaceAll("dom ", "dom7");
        
        console.log("sanitized chordString:\n" + chords);
        console.log((chords.match(/major|minor|dom7|maj7|m7/g) || []).length, (chords.match( /'/g ) || []).length)
        
        const chordSymbols = (chords.match(/major|minor|dom7|maj7|m7/g) || []).length;
        const apostrophes = (chords.match( /'/g ) || []).length;
        const spaces = (chords.match( / /g ) || []).length;
        
        //if all symbols are valid
        if(chordSymbols == apostrophes && chordSymbols != 0 && chordSymbols-1 == spaces){
            if (chords.search(/\n/) > 0) {
                let tmp = chords.search("\n");
                chords = chords.substring(0, tmp);
            }
            chords = chords.toLowerCase();
            invalidFormat = false;
        }

        if(loop > 15){
            chords = chordStrings[0];
            await send("Chord generation skipped", "Musical chord generation skipped due to too many attempts.");
            invalidFormat = false;
        }

        loop++;
        console.log("makingChordLoop");
    }


    console.log("return: " + chords + "\n");
    return chords;
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
                "mode": "instruct",
                "instruction_template": "Llama-v2",
                "regenerate": false,
                "_continue": false,
                "preset": "selfish_v1",
            }
        )
    };

    const req = await fetch(addr, params);
    return req.json();
}