import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Tooltip, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

const ArchiveFiles = ({archive, onCancel}) => {
  const [files, setFiles] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const token = Cookies.get("SessionID");

  useEffect(() => {
    fetchFiles();
  }, [archive.id]);


  const fetchFiles = () => {
    try {
      axios
        .get(`http://localhost:3000/api/archives/${archive.id}/files`, {
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

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  }

  const openDeleteModal = (file) =>{
    setFileToDelete(file);
    onOpen()
    setIsDeleting(true)
  }

  const closeDeleteModal = () => {
    setFileToDelete(null);
    onClose()
    setIsDeleting(false)
  }

  const handleCancel = () => {
    onCancel()
  }

  const uploadFile = () => {
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      axios
        .post(
          `http://localhost:3000/api/upload/archive-file?archive_id=${archive.id}`,
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
  }

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/archives/${archive.id}/files/${fileName}`,
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
  }

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
  }



  return (
    <>
      <Input
        mt={8}
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue" onClick={uploadFile}>
          Upload
        </Button>
        <Button ml={3} colorScheme="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>
      <Box mt={6}>
        {files.length > 0 ? (
          files.map((file) => (
            <Flex key={file.id} alignItems="center" mt={2}>
              <Link
                onClick={() => downloadFile(file.file_name)}
                color="teal.500"
                cursor="pointer"
              >
                {file.file_name}
              </Link>
              <Tooltip label="Delete File">
                <IconButton
                  onClick={() => openDeleteModal(file)}
                  ml={2}
                  size="xs"
                  variant="outline"
                  colorScheme="teal"
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
}

export default ArchiveFiles