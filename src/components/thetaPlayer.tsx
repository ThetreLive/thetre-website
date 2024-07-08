"use client"
import { useTurnkeyContext } from "@/context/turnkeyContext";
import { LegacyRef, useEffect, useRef } from "react";

let TVA_JS_VERSION_NUMBER = '1.0.12';

function getSignTypedDataJson(timestamp: number) {
    return {
        domain: {
            name: 'Theta DRM',
            version: '1',
            chainId: 365 
        },
        message: {
            contents: "Theta DRM Sign In",
            timestamp: timestamp
        },
        primaryType: "SignIn",
        types: {
            SignIn: [{
                name: "timestamp",
                type: "uint256"
            }, {
                name: "contents",
                type: "string"
            }]
        }
    };
  };

const ThetaPlayer: React.FC = () => {
    const playerRef = useRef<HTMLVideoElement>(null)
    const {signer} = useTurnkeyContext()
    const renderVideo = () => {
        if (signer) {
            console.log(signer.getAddress().then(alert))
            const timestamp = Date.now();
            const data = getSignTypedDataJson(timestamp);
            (async () => {
                const signature = await signer._signTypedData(data.domain, data.types, data.message)
                alert(signature)
                let script = document.createElement('script');
                script.src = "https://assets.thetatoken.org/tva-js/" + TVA_JS_VERSION_NUMBER + "/tva.js";
                script.async = true;
                const address = await signer.getAddress();
                const a = { address, timestamp, sig: signature }
                script.onload = function () {
                    // setTvaLibLoaded(true);
                    alert("here")
                    new window.TVA.Video({
                    videoId: "video_5ywtntfnhffd7ndvj1auw8ij2t",
                    server: 'tva',
                    videoEl: playerRef.current,
                    networkId: 365,
                    onError: function (error: any) {console.log(error)},
                    signin: a
                    });
                };
                document.body.appendChild(script);
                
            })()
        } else {
            let script = document.createElement('script');
                script.src = "https://assets.thetatoken.org/tva-js/" + TVA_JS_VERSION_NUMBER + "/tva.js";
                script.async = true;
                script.onload = function () {
                    // setTvaLibLoaded(true);
                    alert("here")
                    new window.TVA.Video({
                    videoId: "video_mg3tvfr4hzutanrfrru714kw0u",
                    server: 'tva',
                    videoEl: playerRef.current,
                    networkId: 365,
                    onError: function (error: any) {console.log(error)},
                    });
                };
                document.body.appendChild(script);
                
        }
    }
    useEffect(() => {
        renderVideo()
    }, [signer])
    return (
        <div>
            <video ref={playerRef} controls className="w-full lg:w-5/6 lg:h-screen"/>
        </div>
    )
}

export default ThetaPlayer