import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormErrorMessage,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

const LeadFiles = ({ lead, onCancel }) => {
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);

  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchFiles();
  }, [lead.id]);

  const fetchFiles = () => {
    try {
      axios
        .get(`http://localhost:3000/api/leads/${lead.id}/files`, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          setFiles(res.data.files);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      axios
        .post(
          `http://localhost:3000/api/upload/lead-file?lead_id=${lead.id}`,
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
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/leads/${lead.id}/files/${fileName}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

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

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const deleteFile = async () => {
    if (fileToDelete) {
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
          });
      } catch (error) {
        console.error("Error deleting the file", error);
      }
    }
  };

  return (
    <>
      <Box mt={8}>
        <Input
          mt={8}
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
        <FormErrorMessage>Please select a file to upload.</FormErrorMessage>
      </Box>
      <Flex mt={6} justifyContent="flex-start">
        <div>
          <Button colorScheme="blue" onClick={uploadFile}>
            Upload
          </Button>
        </div>
        <div>
          <Button ml={3} colorScheme="gray" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Flex>
      <Box mt={6}>
        {files.length > 0 ? (
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
      </Box>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>Delete File: {fileToDelete?.file_name}? ?</ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={deleteFile}>
                Confirm
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

export default LeadFiles;
