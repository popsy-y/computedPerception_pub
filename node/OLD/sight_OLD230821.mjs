import fetch from 'node-fetch';
import fs from 'fs';
import getTxt from './txtGen_OLD230821.mjs';

const actDir = "../observed/active/";// active directory
const arcDir = "../observed/archive/";// archive directory (save images every 5 minutes)

let lastArchived = new Date();

const templates = JSON.parse(fs.readFileSync("./templates.json"));

let invalidFormat = true;

sequencer();

async function sequencer(){
    let caption = await interrogate();
    caption = caption.caption;

    let imgEmotion
    while (invalidFormat) {
        imgEmotion = await getTxt(templates.cap2caEmo, caption);
        imgEmotion = imgEmotion.results[0].history.visible[0][1];

        console.log("\nimgEmotion: " + imgEmotion + "\n");

        // If imgEmotion contains line break and character ":"
        if (imgEmotion.indexOf("\n") > 0) {
            imgEmotion = imgEmotion.substring(imgEmotion.indexOf("\n")+1);
            invalidFormat = false;
        }else if(imgEmotion.indexOf(":") > 0){
            imgEmotion = imgEmotion.substring(imgEmotion.indexOf(":")+1);
            invalidFormat = false;
        }

        console.log("emoLoop");
    }

    invalidFormat = true;


    let imgPrmp, imgPrmpStart;
    while (invalidFormat) {
        imgPrmp = await getTxt(templates.caEmo2ImgPrmp, imgEmotion);
        imgPrmp = imgPrmp.results[0].history.visible[0][1];

        console.log("\nimgPrmp: " + imgPrmp + "\n");

        // colab
        imgPrmp.replace("&quot;", '"');

        imgPrmpStart = imgPrmp.search(/&quot;/);
        // imgPrmpStart = imgPrmp.search(/\".{20,}/);

        if (imgPrmpStart > 0) {
            invalidFormat = false;
        }

        console.log("prmLoop");
    }

    invalidFormat = true;

    imgPrmp = imgPrmp.substring(imgPrmpStart);
    imgPrmp = imgPrmp.replace("&quot;", "");

    console.log("emotion: " + (imgEmotion) + "\nimgPrompt: " + imgPrmp);

    await getImage(imgPrmp);

    setTimeout(sequencer, 1000);
}

async function interrogate(){
    const b64str = fs.readFileSync(actDir + fs.readdirSync(actDir)[0], "base64");

    const url = "http://192.168.50.252:7860/sdapi/v1/interrogate"

    const params = {
        "method": "POST",
        "headers": {
            "accept": "application/json",
            "Content-type": "application/json",
        },
        "body": JSON.stringify({
            "image": b64str,
            "model": "clip"
        })
    };

    console.log('interrogate start');
    const captionReq = await fetch(url, params)
        .then(response => response.json());

    return captionReq;
}

async function getImage(prompt){
    const url = "http://192.168.50.252:7860/sdapi/v1/txt2img"
    // const url = "http://126.220.69.211:7860/sdapi/v1/txt2img"


    const params = {
        "method": "POST",
        "headers": {
            "accept": "application/json",
            "Content-type": "application/json"
        },
        "body": JSON.stringify({
            "prompt" : "highly detailed background" + prompt,
            "negative_prompt": "abstract photo",
            "steps" :20,
            "width": 512,
            "height": 512,
            "tiling": false,
            "send_images": true,
            "save_images": false
        })
    }

    console.log("request start, " + prompt);
    console.log(Date.now() - lastArchived.getTime());

    //  REQUEST NEW IMAGE
    // ----------------------------
    await fetch(url, params)
        .then(response => response.json())
        .then(data => {
            // convert base64 png
            const img64 = data.images[0];
            const img = new Buffer.from(img64, 'base64');

            // get active directory
            const curActDir = fs.readdirSync(actDir);

            // 1. copy oldest image in active directory to archive directory,
            // if theres more than 10 images and 5 minutes elapsed since last copy
            // 2. delete oldest image
            if(curActDir.length > 10){
                if(Date.now() - lastArchived.getTime() > 300000){
                    fs.copyFileSync(actDir + curActDir[0], arcDir + curActDir[0]);
                    lastArchived.setTime(Date.now());
                }
                fs.unlinkSync(actDir + curActDir[0]);
            }

            // save new image
            fs.writeFile(actDir + Date.now() + '.png', img, (err) => {
                if(err){
                    console.log(err);
                }else{
                    console.log('saved');
                }
            })
        });
}