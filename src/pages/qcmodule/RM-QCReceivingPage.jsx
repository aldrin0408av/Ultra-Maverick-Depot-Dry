// RM QC Receiving

import React, { useState, useEffect, useContext } from "react";
import {
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  Button,
  Stack,
  useDisclosure,
  Skeleton,
  Badge,
} from "@chakra-ui/react";
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  usePagination,
} from "@ajna/pagination";
import { FaSearch } from "react-icons/fa";
import {
  ViewModalComponent,
  CancelModalComponent,
} from "./qc-checklist-depot.jsx/View_Cancel-Modal";
import apiClient from "../../services/apiClient";
import PageScrollReusable from "../../components/PageScroll-Reusable";
import { EditModalComponent } from "./qc-checklist-depot.jsx/Edit-Modal-Parent";

// Old Checklist
// import PageScroll from '../../components/PageScroll'
// import PageScrollModal from '../../components/PageScrollModal'
// import { EditModalComponent } from './qc-receiving-page/Edit-Modal'
// import { CancelModalComponent } from './qc-receiving-page/Cancel-Modal'
// import { NotificationContext } from '../../context/NotificationContext'

const fetchPoApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(
    `Receiving/GetAllAvailablePoWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`
  );
  return res.data;
};

const QCReceivingPage = ({ fetchNotification }) => {
  const [poData, setPoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [search, setSearch] = useState("");
  const [viewingData, setViewingData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [poId, setPoId] = useState(null);
  const {
    isOpen: isViewModalOpen,
    onOpen: openViewModal,
    onClose: closeViewModal,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const {
    isOpen: isCancelModalOpen,
    onOpen: openCancelModal,
    onClose: closeCancelModal,
  } = useDisclosure();

  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  const fetchPo = () => {
    fetchPoApi(currentPage, pageSize, search).then((res) => {
      setIsLoading(false);
      setPoData(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    fetchPo();

    return () => {
      setPoData([]);
    };
  }, [pageSize, currentPage, search]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setKeyword(inputValue);
    setSearch(inputValue);
  };

  const viewModalHandler = (id, pO_Number, pO_Date, pR_Number, pR_Date) => {
    setViewingData({ id, pO_Number, pO_Date, pR_Number, pR_Date });
    openViewModal();
  };

  const editModalHandler = (data) => {
    setEditData(data);
    openEditModal();
  };

  const cancelModalHandler = (data) => {
    setPoId(data);
    openCancelModal();
  };

  const [keyword, setKeyword] = useState("");

  return (
    <Flex p={5} w="full" flexDirection="column">
      <Flex justifyContent="center">
        <Heading color="secondary" fontSize="xl" justifyContent="c">
          PO Summary Checklist
        </Heading>
      </Flex>

      <Flex mb={2} justifyContent="space-between">
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="Search: Item Description"
              focusBorderColor="accent"
              onChange={(e) => searchHandler(e.target.value)}
            />
          </InputGroup>
        </HStack>

        <HStack>
          <Badge colorScheme="green">
            <Text color="secondary">
              Number of Records: {poData.posummary?.length}
            </Text>
          </Badge>
        </HStack>
      </Flex>

      <PageScrollReusable maxHeight="700px">
        {isLoading ? (
          <Stack width="full">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        ) : (
          <Table variant="striped" size="sm">
            <Thead>
              <Tr bgColor="secondary">
                {/* <Th color='white'>PO Summary Id</Th> */}
                <Th color="white">PO No.</Th>
                <Th color="white">Item Code</Th>
                <Th color="white">Description</Th>
                <Th color="white">Supplier</Th>
                <Th color="white">UOM</Th>
                <Th color="white">Qty. Ordered</Th>
                <Th color="white">Actual Good</Th>
                <Th color="white">Actual Remaining</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {poData?.posummary
                // ?.filter((val) => {
                //   const newKeyword = new RegExp(`${keyword.toLowerCase()}`)
                //   return val.posummary.pO_Number?.toLowerCase().match(newKeyword, '*')
                // }
                // )
                ?.map((po) => (
                  <Tr key={po.id}>
                    {/* <Td>{po.id}</Td> */}
                    <Td>{po.pO_Number}</Td>
                    <Td>{po.itemCode}</Td>
                    <Td>{po.itemDescription}</Td>
                    <Td>{po.supplier}</Td>
                    <Td>{po.uom}</Td>
                    <Td>
                      {po.quantityOrdered.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {po.actualGood.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      {po.actualRemaining.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}
                    </Td>
                    <Td>
                      <HStack spacing={4}>
                        <Button
                          onClick={() =>
                            viewModalHandler(
                              po.id,
                              po.pO_Number,
                              po.pO_Date,
                              po.pR_Number,
                              po.pr_Date
                            )
                          }
                          color="white"
                          bgColor="#5CB85C"
                          _hover={{ bgColor: "secondary", color: "white" }}
                          size="xs"
                        >
                          View
                        </Button>

                        <Button
                          onClick={() => editModalHandler(po)}
                          color="white"
                          bgColor="#3C8DBC"
                          _hover={{ bgColor: "secondary", color: "white" }}
                          size="xs"
                        >
                          Checklist
                        </Button>

                        <Button
                          onClick={() => cancelModalHandler(po.id)}
                          color="white"
                          bgColor="danger"
                          _hover={{ bgColor: "secondary", color: "white" }}
                          size="xs"
                        >
                          Cancel
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        )}
      </PageScrollReusable>

      <Flex justifyContent="end">
        <Stack mt={2}>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                bg="secondary"
                color="white"
                p={1}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "accent", color: "white" }}
                    p={3}
                    bg="secondary"
                    color="white"
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext
                  bg="secondary"
                  color="white"
                  p={1}
                  _hover={{ bg: "accent", color: "white" }}
                >
                  {">>"}
                </PaginationNext>
                <Select onChange={handlePageSizeChange} variant="filled">
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>
      </Flex>

      {isViewModalOpen && (
        <ViewModalComponent
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          viewingData={viewingData}
        />
      )}

      {isCancelModalOpen && (
        <CancelModalComponent
          isOpen={isCancelModalOpen}
          onClose={closeCancelModal}
          fetchPo={fetchPo}
          fetchNotification={fetchNotification}
          poId={poId}
        />
      )}

      {isEditModalOpen && (
        <EditModalComponent
          editData={editData}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          fetchPo={fetchPo}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};

export default QCReceivingPage;

// { editData, isOpen, onClose, fetchPo, fetchNotification }  
