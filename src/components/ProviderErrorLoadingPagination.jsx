import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { BiErrorCircle } from "react-icons/bi";
import PaginationComponent from "../components/PaginationComponent";
import PaginateLoaderComponent from "../components/PaginateLoaderComponent";

function ProviderErrorLoadingPagination({
  reducer,
  action,
  Parent = ({ children }) => <>{children}</>, // Default fallback for Parent
  LoaderParent = ({ children }) => <>{children}</>, // Default fallback for Parent
  dataKey,
  Component,
  asyncThunk,
  emptyMessage = "No Data Found!",
  emptyComponent,
  noDataComponent,
  componentProps,
  pagination,
  itemKey = "item",
  paginationLimit,
  setPaginationLimit
}) {
  const dispatch = useDispatch();

  // Memoize selectors to prevent re-renders
  const { loading, response, error, serverParams, errorMessages } = useSelector(
    (state) => ({
      loading: state[reducer]?.loadings[action],
      response: state[reducer]?.[dataKey],
      error: state[reducer]?.errors[action],
      serverParams: state[reducer]?.paramsForThunk[action],
      errorMessages: state[reducer]?.errorMessages[action],
    })
  );

  // Handle page change for pagination
  const goToPage = useCallback(
    (page) => {
      let reqParams = { ...(serverParams ?? {}), page };
      
      if (serverParams?.params) {
        reqParams = { ...reqParams, params: { ...serverParams?.params, page } };
      }
      dispatch(asyncThunk(reqParams));
    },
    [dispatch, asyncThunk, serverParams]
  );

   const handlePerPageChange = useCallback(
    (limit) => {
      let reqParams = { ...(serverParams ?? {}), limit, page: 1 };
  
      if (serverParams?.params) {
        reqParams = {
          ...reqParams,
          params: { ...serverParams?.params, limit, page: 1 }, // Ensure nested params also reset page
        };
      }  
      dispatch(asyncThunk(reqParams));
      paginationLimit && setPaginationLimit(limit);
    },
    [dispatch, asyncThunk, serverParams]
  );

  const renderError = useCallback(
    () => (
      <div className="data-error">
        <Row>
          <Col md={12}>
            <div className="img-box">
              <BiErrorCircle size={100} color="#d3d3d3" />
            </div>
          </Col>
          <Col md={12}>
            <div className="text-box">
              <h1>{errorMessages || "Something went wrong"}</h1>
              <p>Something went wrong, click to reload.</p>
              <button
                onClick={() => dispatch(asyncThunk(serverParams || {}))}
                className="btn btn-primary"
              >
                Reload
              </button>
            </div>
          </Col>
        </Row>
      </div>
    ),
    [dispatch, asyncThunk, serverParams, errorMessages]
  );

  if (error) return renderError();

  if (loading) {
    return (
      <LoaderParent>
        <PaginateLoaderComponent />
      </LoaderParent>
    );
  }

  if (!response?.results?.length) {
    const isSearchActive =
      serverParams &&
      (serverParams.jobTitle ||
        serverParams?.params?.userName ||
        serverParams?.name);

    const Content = isSearchActive ? (
      noDataComponent || (
        <Container className="text-center">No results found for your search.</Container>
      )
    ) : (
      emptyComponent || <Container className="text-center">{emptyMessage}</Container>
    );

    return <LoaderParent>{Content}</LoaderParent>;
  }

  return (
    <>
      <Parent>
        {response?.results?.map((item, index) => (
          <Component {...componentProps} key={index} {...{ [itemKey]: item }} />
        ))}
      </Parent>      
      {pagination && (
        <PaginationComponent
          onItemsPerPageChange={handlePerPageChange}
          onPageChange={goToPage}
          initialItemsPerPage={response?.limit}
          initialPage={response?.page}
          totalItems={response?.totalResults}
          paginationLimit={paginationLimit}
        />
      )}
    </>
  );
}

export default React.memo(ProviderErrorLoadingPagination);
