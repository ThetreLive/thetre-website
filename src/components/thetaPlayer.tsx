"use client"
import { useWalletContext } from "@/context/walletContext";
import { RefObject, useEffect, useState } from "react";
import { Signer } from "ethers";
import { TurnkeySigner } from "@turnkey/ethers";
import { useRouter } from "next/router";


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

interface Props {
    videoId: string;
    type: "FREE" | "DRM",
    styles: string;
    playerRef: RefObject<HTMLVideoElement>;
    poster: string;
}

const ThetaPlayer: React.FC<Props> = (props: Props) => {
    const {signer, access} = useWalletContext()
    const router = useRouter()
    const renderVideo = () => {
        console.log("here")
        console.log(props)
        if (signer && props.type === "DRM") {
            const timestamp = Date.now();
            const data = getSignTypedDataJson(timestamp);
            (async () => {
                let signature;
                if ((signer as TurnkeySigner)._signTypedData) {
                    signature = await (signer as TurnkeySigner)._signTypedData(data.domain, data.types, data.message)
                } else {
                    signature = await (signer as Signer).signTypedData(data.domain, data.types, data.message)

                }
                let script = document.createElement('script');
                script.src = "https://assets.thetatoken.org/tva-js/" + TVA_JS_VERSION_NUMBER + "/tva.js";
                script.async = true;
                const address = await signer.getAddress();
                console.log(address)
                const a = { address, timestamp, sig: signature }
                script.onload = function () {
                    new window.TVA.Video({
                        videoId: props.videoId,
                        server: 'tva',
                        videoEl: props.playerRef.current,
                        networkId: 365,
                        onError: function (error: any) {console.log(error)},
                        signin: a
                    });
                };
                document.body.appendChild(script);
                
            })()
        } else if (props.type === "FREE") {
            let script = document.createElement('script');
                script.src = "https://assets.thetatoken.org/tva-js/" + TVA_JS_VERSION_NUMBER + "/tva.js";
                script.async = true;
                script.onload = function () {
                    // setTvaLibLoaded(true);
                    new window.TVA.Video({
                        videoId: props.videoId,
                        server: 'tva',
                        videoEl: props.playerRef.current,
                        networkId: 365,
                        onError: function (error: any) {console.log(error)},
                    });
                };
                document.body.appendChild(script);
                
        }
    }
    useEffect(() => {
        renderVideo()
    }, [signer, access, props.videoId])
    return (
        <div className="w-full">
            <video ref={props.playerRef} controls className={props.styles} poster={props.poster}/>
        </div>
    )
}

export default ThetaPlayer