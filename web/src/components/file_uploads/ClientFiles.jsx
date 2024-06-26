import { DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Link,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

const ClientFiles = ({ onCancel, client }) => {
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [fileInputTouched, setFileInputTouched] = useState(false)
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchFiles();
  }, [client.id]);

  const fetchFiles = () => {
    try {
      axios
        .get(`http://localhost:3000/api/clients/${client.id}/files`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          setFiles(res.data.files);
          if(showAlert){
            setShowAlert(false)
          }
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          setShowAlert(true);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    setLoading(true);
    try {
      axios
        .post(
          `http://localhost:3000/api/upload/client-file?client_id=${client.id}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            fetchFiles();
            setFileToUpload(null);
            if(showAlert){
              setShowAlert(false)
            }
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          setShowAlert(true);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileName) => {
    try {
      const response = await axios
        .get(
          `http://localhost:3000/api/clients/${client.id}/files/${fileName}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          setShowAlert(true);
        });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const deleteFile = async () => {
    if (fileToDelete) {
      setLoading(true)
      try {
        await axios
          .delete(`http://localhost:3000/api/delete/file/${fileToDelete.id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              fetchFiles();
              closeDeleteModal();
            }
          })
          .catch((error) => {
            setErrorMessage(error.response.data.message);
            setShowAlert(true);
          });
      } catch (error) {
        console.error("Error deleting the file", error);
      } finally{
        setLoading(false)
      }
    }
  };

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
    if (!fileInputTouched){
      setFileInputTouched(true)
    }
    
  };

  const handleCancel = () => {
    onCancel();
  };

  const openDeleteModal = (file) => {
    setFileToDelete(file);
    onOpen();
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    setFileToDelete(null);
    onClose();
    setIsDeleting(false);
  };

  return (
    <>
        <Box mt={8}>
          <Input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            borderWidth="2px"
            _hover={{
              borderColor: "blue.500",
              borderWidth: "3px",
            }}
            color="black.700"
            sx={{
              "::file-selector-button": {
                bg: "teal.600",
                border: "none",
                color: "white",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                mr: 2,
                _hover: {
                  bg: "blue.300",
                },
              },
            }}
          />
          <FormErrorMessage>
            Please select a file to upload.
          </FormErrorMessage>
        </Box>
      {showAlert && (
         <Alert status="error" mt={showAlert ? 4 : 0} >
         <AlertIcon/>
         <AlertDescription>
           {errorMessage}
         </AlertDescription>
       </Alert>
      )}
     
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue" onClick={uploadFile}>
        {loading ? <Spinner size="md" thickness="4px" /> : "Upload"}
        </Button>
        <Button ml={3} colorScheme="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>

      <Box mt={6}>
        {loading ? (
          <Spinner marginStart="85px" />
        ) : files.length > 0 ? (
          files.map((file) => (
            <Flex key={file.id} alignItems="center" mt={5}>
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
      </Box>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent minWidth="500px">
            <ModalHeader>
              {" "}
              Permanently Delete: {fileToDelete?.file_name} ?
            </ModalHeader>
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

export default ClientFiles;
