import Chat from '@/components/chat';
import ThetaPlayer from '@/components/thetaPlayer';

const WatchPage: React.FC = () => {
    return (
        <div className='h-screen'>
            <ThetaPlayer/>
            <Chat/>
        </div>
    );
};

export default WatchPage;