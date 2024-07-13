import { SA_ID } from "./constants";

const getFileURL = (key: string, relpath: string | null) => {
    return `https://p2p.thetre.live/file?key=${key}${relpath !== null && `&relpath=${relpath}`}`
}

const uploadVideo = async (movieUrl: string, ticket: string, movieName: string, coverUrl: string) => {
    const url = 'https://api.thetavideoapi.com/video';
    const headers = {
        'x-tva-sa-id': SA_ID,
        'x-tva-sa-secret': process.env.NEXT_PUBLIC_THETA_SA as string,
        'Content-Type': 'application/json'
    };

    const data = {
        source_uri: movieUrl,
        playback_policy: "public",
        resolutions: [2160, 1080, 720, 360],
        use_drm: true,
        use_studio_drm: false,
        video_type: 1,
        drm_rules: [{
            nft_collection: ticket,
            chain_id: 365,
            title: movieName,
            image: coverUrl,
            link: "No link"
        }],
        file_name: movieName,
        metadata: {
            filename: movieName
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

const uploadToEdgeStore = async (data: any) => {
    const url = 'https://p2p.thetre.live/rpc';
    const body = {
        jsonrpc: "2.0",
        method: "edgestore.PutData",
        params: [
          {
            val: JSON.stringify(data)
          }
        ],
        id: 1
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result
    } catch (error) {
        console.error('Error:', error);
      }
}


const getFromEdgeStore = async (key: any) => {
    const url = 'https://p2p.thetre.live/rpc';
    const body = {
        jsonrpc: "2.0",
        method: "edgestore.GetData",
        params: [
          {
            key
          }
        ],
        id: 1
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.result.val
    } catch (error) {
        console.error('Error:', error);
      }
}

export {
    getFileURL,
    uploadVideo,
    uploadToEdgeStore,
    getFromEdgeStore
}