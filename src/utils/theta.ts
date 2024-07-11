import { SA_ID } from "./constants";

const getFileURL = (key: string, relpath: string) => {
    return `https://p2p.thetre.live/file?key=${key}&relpath=${relpath}`
}

const uploadVideo = async (key: string, relpath: string, ticket: string, movieName: string, imageKey: string, imagePath: string, fileName: string) => {
    const url = 'https://api.thetavideoapi.com/video';
    const headers = {
        'x-tva-sa-id': SA_ID,
        'x-tva-sa-secret': process.env.THETA_SA as string,
        'Content-Type': 'application/json'
    };

    const data = {
        source_uri: getFileURL(key, relpath),
        playback_policy: "public",
        resolutions: [2160, 1080, 720, 360],
        use_drm: true,
        use_studio_drm: false,
        video_type: 1,
        drm_rules: [{
            nft_collection: ticket,
            chain_id: 365,
            title: movieName,
            image: getFileURL(imageKey, imagePath),
            link: "No link"
        }],
        file_name: fileName,
        metadata: {
            filename: fileName
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}