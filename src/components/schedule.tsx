import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  livestreamData: {
    selectedDates: Date[];
    screeningTimes: string[];
  };
  onClose: () => void;
};

const LivestreamSchedule: React.FC<Props> = ({ livestreamData, onClose }) => {
  const [startDate, endDate] = livestreamData.selectedDates.map(
    (date) => new Date(date)
  );
  const { screeningTimes } = livestreamData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <div
        className={`bg-bg-blue rounded-lg max-w-5xl text-white transition-transform transform duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="backdrop-blur-[100px] p-6 rounded-lg">
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-center">Livestream Schedule</h2>
              <div className="flex justify-center">
                <DatePicker
                  inline
                  selected={null}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  dateFormat="yyyy-MM-dd"
                  className="border border-gray-300 p-2 rounded-md"
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold">Screening Times(in UTC)</h2>
              <div className="flex gap-2">
                {screeningTimes.map((time, index) => (
                  <div key={index} className="text-lg">
                    {time}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestreamSchedule;
