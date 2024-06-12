import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";

const ArchiveFiles = ({archive, onCancel}) => {
  const [files, setFiles] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleFileChange = () => {

  }

  const openDeleteModal = () =>{

  }

  const closeDeleteModal = () => {
    
  }

  const handleCancel = () => {
    onCancel()
  }

  const uploadFile = () => {

  }

  const downloadFile = () => {

  }

  const deleteFile = () => {

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