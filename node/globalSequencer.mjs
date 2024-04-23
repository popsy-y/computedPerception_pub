//  SETUP
// ----------------
import fs from 'fs';
import awtimer from 'await-timeout';

import { interrogateSight, observeSight } from './mSight.mjs';
import { interrogateAuditory, tidalEvald1, setupTidalIo, initiateTidal } from './mAuditory.mjs';
import { interrogateImgEmotion, observeSightCaption, observeAuditChords } from './mLanguage.mjs';
import { send } from './mNotifier.mjs';

const langBrain = process.env.LANG;
const imgBrain = process.env.IMG;

const actDir = "../observed/active/";// active directory
const arcDir = "../observed/archive/";// archive directory (save images every 5 minutes)

const templates = JSON.parse(fs.readFileSync("./templates.json"));

let sightCaption, sightEmotion, observedSightCaption, auditEmotion, chordString, observedAuditChords;

export let chordStrings = [];
chordStrings.push("a'major e'maj7 b'dom7 f'minor");

//  MAIN
// ---------------
// arguments: (addr, template, other)

async function init(){
    await setupTidalIo();
    setTimeout(() => {
        initiateTidal();
        // console.log(chordStrings)
        tidalEvald1(chordStrings);
        main();
    }, 5000);
}

async function main(){
    console.log("start");

    try {
        //  OK
        // -------------
        const sightEmotion = "(sadness),(meranchory),(tranquility),(depression)"

        const process = new Promise((resolve, reject) => {
            resolve(observeAuditChords(langBrain, templates.imgEmo2chord, sightEmotion));
        });

        const timeout = new Promise((resolve, reject) => {
            setTimeout(reject, 500, 'timeout');
        });

        await Promise.race([process,timeout])
            .then((chordString) => {chordStrings.push(chordString);})
            .catch((value) => {console.log(`catched, err: \n${value}`);})

        console.log(chordStrings);
    } catch (e) {
        console.log('catch');
        await send("Selfish system: ERROR at observedAuditCaption", `An error occured in function "observeAuditChords".\nDetail:\n\n${e}`);
    }
}

main();