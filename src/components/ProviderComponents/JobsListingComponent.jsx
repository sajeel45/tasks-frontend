import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import doctorIimg from "../../assets/images/doctor-profile-img.jpg";
import { useDispatch } from "react-redux";
import { handleModel } from "../../redux/layoutSlices/modelSlice";
import { dateFormat, parseImagePath } from "../../utils/gloabalFunctions";

export default function JobsListingComponent({ item }) {
  const dispatch = useDispatch();

  const handleOpenJobDetailModal = () => {
    dispatch(
      handleModel({
        model: "jobDetailModal",
        state: true,
        args: {
          jobDetail: item,
        },
      })
    );
  };
  return (
    <tr onClick={handleOpenJobDetailModal} style={{cursor:"pointer"}}>
      <td>
        <div className="profile-section">
          <div>
            <p className="large semibold">
              {item.title}
            </p>
            <div className="content-box">
              <strong className="">
                <IoLocationOutline />{" "}
                {item?.location}
              </strong>
              <strong className="">
                ${item.budget}
              </strong>
              <strong className="">
                <FaClock />{" "}
                {dateFormat(item?.from, true, item?.time)}
              </strong>
              <strong className="">
                <FaClock />{" "}
                {dateFormat(item?.to, true, item?.time)}
              </strong>
            </div>
          </div>
        </div>
      </td>
      <td>
        <span>
          {item?.description}
        </span>
        {/* <span>hello</span> */}
      </td>

      {/* <td>
        <div className="apply-now-btn">
          <button className="btn-style full" onClick={handleOpenJobDetailModal}>
            View details <FaArrowRight />
          </button>
        </div>
      </td> */}
    </tr>
  );
}
