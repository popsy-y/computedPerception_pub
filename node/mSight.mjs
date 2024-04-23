import fetch from 'node-fetch';
import fs from 'fs';
const templates = JSON.parse(fs.readFileSync("./templates.json"));

const actDir = "../observed/active/";// active directory
const arcDir = "../observed/archive/";// archive directory (save images every 5 minutes)

export async function interrogateSight(addr, readDir){
    const b64str = fs.readFileSync(readDir + fs.readdirSync(actDir)[0], "base64");

    const url = addr + "/interrogate";

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

    const req = await fetch(url, params);
    return req.json();
}

export async function observeSight(addr, prompt){
    const url = addr + "/txt2img";

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
            "tiling": true,
            "send_images": true,
            "save_images": false
        })
    }

    console.log('request start,\n"' + prompt + '"');

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
            const curArcDir = fs.readdirSync(arcDir);
            const sinceLastSave = Math.round(Date.now() - (fs.statSync(arcDir + curArcDir[curArcDir.length-1])).birthtimeMs);
            console.log(sinceLastSave);

            // 1. copy oldest image in active directory to archive directory,
            // if theres more than 10 images and 5 minutes elapsed since last copy
            // 2. delete oldest image
            if(curActDir.length > 10){
                if(sinceLastSave > 600000){
                    fs.copyFileSync(actDir + curActDir[0], arcDir + curActDir[0]);
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
            });
        });
}