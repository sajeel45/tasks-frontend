import { useSelector } from "react-redux";
import DetailSidebar from "../Modals/Detailmodel";
import MyContractModal from "../Modals/MyContractModal";
import StripePackage from "./StripePackage";

const GlobalModals = () => {
  const { modelState, modelArgs } = useSelector((state) => state.model);
  console.log("🚀 ~ GlobalModals ~ modelState:", modelState);

  return (
    <>
      {/* { */}
        {/* modelState?.jobDetailModal && ( */}
          <DetailSidebar 
            show={modelState.jobDetailModal}
            {...modelArgs.jobDetailModal}
            modelKey="jobDetailModal"
          />
        {/* ) */}
      {/* } */}

      {
        modelState?.myContractModal && (
          <MyContractModal 
            show={modelState.myContractModal}
            {...modelArgs.myContractModal}
            modelKey="myContractModal"
          />
        )
      }

      {
        modelState?.packageModal && (
          <StripePackage 
            show={modelState.packageModal}
            {...modelArgs.packageModal}
            modelKey="packageModal"
          />
        )
      }

      {/* Add more modals here in the same way */}
    </>
  );
};
export default GlobalModals;
