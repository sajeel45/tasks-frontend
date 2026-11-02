import { Dropdown, Spinner } from "react-bootstrap";
import doctorIimg from "../../assets/images/doctor-profile-img.jpg";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  dateFormat,
  getFullName,
  getId,
  parseImagePath,
  toTitleCase,
} from "../../utils/gloabalFunctions";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
// import {
//   getContractsAsyncThunk,
//   markAsCompleteAsyncThunk,
//   terminateContractAsyncThunk,
// } from "../../redux/pagesSlices/applicationSlice";
import { toast } from "react-toastify";
import { handleModel } from "../../redux/layoutSlices/modelSlice";
import { useState } from "react";

export default function ContractComponent({ item }) {
  console.log("ContractComponent item", item);
  const doctorDetails = item?.doctorId || {};
  const jobDetails = item?.jobId || {};
  const dispatch = useDispatch();

  const { loadings } = useSelector((state) => state?.application);
  // const handleMarkAsComplete = () => {
  //   dispatch(
  //     markAsCompleteAsyncThunk({
  //       id: getId(item),
  //       callBack: () => {
  //         toast.success("Contract marked as complete successfully!");
  //         dispatch(getContractsAsyncThunk());
  //       },
  //     })
  //   );
  // };

  // const handleShowTerminateModal = () => {
  //   dispatch(
  //     handleModel({
  //       state: true,
  //       model: "terminateContractModal",
  //       args: {
  //         item,
  //       },
  //     })
  //   );
  // };
  const handleOpenContractModal = () => {
    dispatch(
      handleModel({
        model: "myContractModal",
        state: true,
        args: {
          //    jobDetail: item,
        },
      })
    );
  };
  return (
    <tr>
      <td onClick={handleOpenContractModal}>
        <div className="image-wrapper square-wrapper">
          <img
            src={
              item?.patientId?.image
                ? parseImagePath(item?.patientId?.image)
                : doctorIimg
            }
            alt="doctor" />
          <span>{getFullName(item?.patientId)}</span>
        </div>
      </td>
      <td>
        {item?.jobId?.title}
      </td>
      <td>
        <span className="status">{toTitleCase(item?.status)}</span>
      </td>
      <td>
        ${item?.budget}
      </td>
      <td>
        <div className="ratings-wrapper">
          <FaStar />
          <span>
            4.8
          </span>
        </div>
      </td>
      <td>95%</td>
      <td>{dateFormat(item?.hiredAt)}</td>
      {/* <td style={{ textAlign: 'end' }}>
        
        <Dropdown className="table-dropdown">
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            <BsThreeDotsVertical />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Mark as complete</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Terminate contract</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Delete contract</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td> */}
    </tr>
  );
}
