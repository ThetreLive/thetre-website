import Chat from '@/components/chat';
import ThetaPlayer from '@/components/thetaPlayer';
import { useRouter } from 'next/router';

const WatchPage: React.FC = () => {
    const router = useRouter()
    return (
        <div className='h-screen'>
            <ThetaPlayer videoId={router.query.id as string} type='FREE' styles="w-full lg:w-4/6 lg:h-screen"/>
            <Chat/>
        </div>
    );
};

export default WatchPage;