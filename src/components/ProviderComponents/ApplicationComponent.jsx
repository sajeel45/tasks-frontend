import { dateFormat, getId, toTitleCase } from "../../utils/gloabalFunctions";
import { Dropdown, Spinner } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptApplicationAsyncThunk,
  getApplicationsAsyncThunk,
  getContractsAsyncThunk,
  rejectApplicationAsyncThunk,
  withdrawApplicationAsyncThunk,
} from "../../redux/pagesSlices/applicationSlice";
import { toast } from "react-toastify";
import {
  acceptInvitationAsyncThunk,
  cancelInvitationAsyncThunk,
  deleteInvitationAsyncThunk,
  rejectInvitationAsyncThunk,
} from "../../redux/pagesSlices/invitationSlice";
import withdrawbox from "../../assets/images/icons/withdraw .png";

export default function ApplicationComponent({ item }) {
  console.log("ApplicationComponent item:", item?.invitationData);

  const jobDetails = item?.jobId || {};
  const params = {
    type: "invitation",
  };
  const applicationParams = {
    type: "application",
  };
  const dispatch = useDispatch();
  const { loadings } = useSelector((state) => state?.invitations);
  const { loadings: applicationLoadings } = useSelector(
    (state) => state?.application
  );
  const handleRejectInvitation = () => {
    dispatch(
      rejectInvitationAsyncThunk({
        id: getId(item?.invitationData),
        callBack: () => {
          toast.success("Invitation deleted successfully");
          dispatch(getApplicationsAsyncThunk(params));
        },
      })
    );
  };
  const handleAcceptInvitation = () => {
    dispatch(
      acceptInvitationAsyncThunk({
        id: getId(item?.invitationData),
        callBack: () => {
          toast.success("Invitation accepted successfully");
          dispatch(getApplicationsAsyncThunk(params));
        },
      })
    );
  };
  const handleWithdrawApplication = () => {
    dispatch(
      withdrawApplicationAsyncThunk({
        id: getId(item),
        callBack: () => {
          toast.success("Application withdrawn successfully");
          dispatch(getApplicationsAsyncThunk(applicationParams));
        },
      })
    );
  };
  return (
    <tr>
      <td>{jobDetails?.title || "Job Title Not Available"}</td>
      <td>
        <span className="status">
          {item?.type === "invitation"
            ? item?.invitationData?.status
            : item?.status}
        </span>
      </td>
      <td>{jobDetails?.experienceRequired} Years</td>
      <td>${item?.budget || "0"}</td>
      <td>{toTitleCase(item?.type)}</td>
      <td>{dateFormat(item?.createdAt)}</td>
      {item?.invitationData && (
        <td>{dateFormat(item?.invitationData?.expiryDate)}</td>
      )}

      <td style={{ textAlign: "end" }}>
        {item?.status === "applied" && (
          <Dropdown className="table-dropdown">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              <BsThreeDotsVertical />
            </Dropdown.Toggle>

            {item?.type === "invitation" ? (
              <Dropdown.Menu>
                {item?.invitationData?.status === "pending" && (
                  <Dropdown.Item onClick={handleAcceptInvitation}>
                    {loadings?.acceptInvitationAsyncThunk ? (
                      <Spinner size="sm" />
                    ) : (
                      "Accept"
                    )}
                  </Dropdown.Item>
                )}

                {item?.invitationData?.status === "pending" && (
                  <Dropdown.Item onClick={handleRejectInvitation}>
                    {loadings?.rejectInvitationAsyncThunk ? (
                      <Spinner size="sm" />
                    ) : (
                      "Reject"
                    )}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            ) : (
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleWithdrawApplication}>
                  {applicationLoadings?.rejectApplicationAsyncThunk ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                    <img src={withdrawbox} />
                    Withdraw
                    </>
                  )}
                </Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>
        )}
      </td>
    </tr>
  );
}
