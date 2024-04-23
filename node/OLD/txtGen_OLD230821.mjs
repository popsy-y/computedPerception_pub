import fetch from 'node-fetch';
import fs from 'fs';

// getTxt();

export default async function getTxt(template, prompt){
    const instruction = "You are a helpful assistant. You do not respond as 'User' or pretend to be 'User'. You only respond once as 'Assistant'\n\n";

    // const url = 'http://192.168.50.252:4338/api/v1/chat';
    const url = 'https://recipients-assumed-farming-extending.trycloudflare.com/api/v1/chat'

    const params = {
        "method": "POST",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(
            {
                // "chat_instruct_command": "Write a single reply.",
                "user_input": template + prompt,
                // "max_new_tokens": 24,
                "auto_max_new_tokens": false,
                // "history": [[],[]],
                "mode": "instruct",
                // "temperature": 0.5,
                // "top_p": 0.9,
                // "top_k": 20,
                // "tfs": 1,
                // "repetition_penalty": 1.18,
                // "character": "Example",
                // "your_name": "you",
                "regenerate": false,
                "_continue": false,
                "preset": "selfish_v1",
            }
        )
    };

    // console.log('txtGen: request start,\nprompt:' + template+prompt + "\n");
    const txtReq = await fetch(url, params);

    return txtReq.json();
    // await fetch(url, params)
    //     .then(response => response.json())
    //     .then(data => console.log(JSON.stringify(data)));
}