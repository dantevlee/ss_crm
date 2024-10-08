import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaFolderOpen } from "react-icons/fa";
import UserFileForm from "../components/forms/UserFileForm";
import axios from "axios";
import Cookies from "js-cookie";
import { DeleteIcon } from "@chakra-ui/icons";

const UserFilesPage = ({ onCurrentUser }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [pageError, setPageError] = useState("")
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("")
  const [downloadError, setDownloadError] = useState("")
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [files, setFiles] = useState([]);
  const toast = useToast();
  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    try {
      axios
        .get(`http://localhost:3000/api/users/files`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          setFiles(res.data.files);
        }).catch((err) => {
          setPageError(err.response.data.message);
        })
    } catch (error) {
     console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const uploadUserFile = async (formData) => {
    try {
      axios
        .post(`http://localhost:3000/api/upload/user-file`, formData, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            closeUploadFileModal();
            toast({
              title: "File Successfully Uploaded!",
              description: "New file has been added for you.",
              status: "success",
              duration: 5000,
              position: "top 100px"
            });
            setFiles((prevFiles) => [...prevFiles, res.data]);
          }
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message)
        });
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const downloadFile = async (fileName) => {
    try {
      const response = await axios
        .get(`http://localhost:3000/api/users/files/${fileName}`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if(res.status === 200){
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            toast({
              title: "Download Successful!",
              description: `Please check your document files for ${fileName}.`,
              status: "success",
              duration: 5000,
              position: "top"
            });
          }
        })
        .catch((error) => {
          setDownloadError(error.response.data.message)
          toast({
            title: downloadError,
            status: "error",
            duration: 5000,
            position: "top"
          });
        });
     
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const deleteFile = async () => {
    if (fileToDelete) {
      setLoading(true);
      try {
        await axios
          .delete(`http://localhost:3000/api/delete/file/${fileToDelete.id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              closeDeleteModal();
              toast({
                title: "Delete Successful!",
                description: `Succesfully deleted ${fileToDelete.file_name}.`,
                status: "success",
                duration: 5000,
                position: "top"
              });
              setFiles((prevFiles) =>
                prevFiles.filter((file) => file.id !== fileToDelete.id)
              );
            }
          }).catch((error) => {
            setDeleteErrorMessage(error.response.data.message)
          })
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const {
    isOpen: isUploadFileOpen,
    onOpen: onUploadFileOpen,
    onClose: onUploadFileClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteFileOpen,
    onOpen: onDeleteFileOpen,
    onClose: onDeleteFileClose,
  } = useDisclosure();

  const closeUploadFileModal = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
    if (formLoading) {
      setFormLoading(false);
    }
    onUploadFileClose();
  };

  const openDeleteModal = (file) => {
    setFileToDelete(file);
    onDeleteFileOpen();
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    if (fileToDelete) {
      setFileToDelete(null);
    }
    if(deleteErrorMessage){
      setDeleteErrorMessage("")
    }
    onDeleteFileClose();
    setIsDeleting(false);
  };

  return (
    <>
      <Flex>
        <Button
          marginTop="100px"
          size="lg"
          colorScheme="blue"
          position="absolute"
          right="1rem"
          onClick={onUploadFileOpen}
        >
          <FaFolderOpen size="25px" style={{ marginRight: "8px" }} /> Upload
          File
        </Button>
      </Flex>
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Box marginTop="250px" minW={{ base: "100%", md: "500px" }}>
          <Stack
            spacing={6}
            p="3rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
            flexDir="column"
            mb="4"
            justifyContent="center"
            alignItems="center"
          >
            <Heading>{onCurrentUser.firstName}'s Files</Heading>
            {loading ? (
              <Spinner marginStart="85px" />
            ) : files.length && !pageError > 0 ? (
              files.map((file) => (
                <Flex key={file.id} alignItems="center" mt={2}>
                  <Link
                    onClick={() => downloadFile(file.file_name)}
                    color="blue.500"
                    fontWeight="bold"
                    cursor="pointer"
                  >
                    {file.file_name}
                  </Link>
                  <Tooltip label="Delete File">
                    <IconButton
                      onClick={() => openDeleteModal(file)}
                      ml={2}
                      size="xs"
                      colorScheme="red"
                      icon={<DeleteIcon />}
                    ></IconButton>
                  </Tooltip>
                </Flex>
              ))
            ) : (
              <Box>No files available</Box>
            )}
            {pageError && (
              <Alert mt={pageError ? 4 : 0} status="error">
                <AlertIcon />
                <AlertDescription>{pageError}</AlertDescription>
              </Alert>
            )}
          </Stack>
        </Box>
      </Flex>
      <Modal isOpen={isUploadFileOpen} onClose={closeUploadFileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload User File</ModalHeader>
          <ModalBody pb={6}>
            <UserFileForm
              onCancel={closeUploadFileModal}
              onUpload={uploadUserFile}
              onError={errorMessage}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      {isDeleting && (
        <Modal isOpen={isDeleteFileOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent minWidth="500px">
            <ModalHeader>
              {" "}
              Permanently Delete: {fileToDelete?.file_name}?
            </ModalHeader>
            {deleteErrorMessage && (
              <ModalBody>
                <Alert status="error" mt={deleteErrorMessage ? 4 : 0}>
                  <AlertIcon />
                  <AlertDescription>{deleteErrorMessage}</AlertDescription>
                </Alert>
                </ModalBody>
              )}
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={deleteFile}>
                {loading ? <Spinner size="md" thickness="4px" /> : "Confirm"}
              </Button>
              <Button colorScheme="red" mr={3} onClick={closeDeleteModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default UserFilesPage;
