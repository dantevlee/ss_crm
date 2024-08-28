import { Button, Flex, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useState } from "react"
import { FaFolderOpen } from "react-icons/fa"
import UserFileForm from "../components/forms/UserFileForm"
import axios from "axios"
import Cookies from "js-cookie";

const UserFilesPage = () => {

  const [showAlert, setShowAlert] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const token = Cookies.get("SessionID");

  const uploadUserFile = async (formData) => {

    try {
      axios
        .post(
          `http://localhost:3000/api/upload/user-file`,
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
            closeUploadFileModal()
          }
        })
        .catch((error) => {
       
        });
    } catch (error) {
      console.error(error);
    } finally {
     
    }
  }

  const {
    isOpen: isUploadFileOpen,
    onOpen: onUploadFileOpen,
    onClose: onUploadFileClose,
  } = useDisclosure()

  const closeUploadFileModal = () => {
    if(showAlert){
      setShowAlert(false)
    } 
    if(formLoading){
      setFormLoading(false)
    }
    onUploadFileClose()
  }

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
          <FaFolderOpen size="25px" style={{ marginRight: "8px" }} /> Upload File
        </Button>
      </Flex>
      <Modal isOpen={isUploadFileOpen} onClose={closeUploadFileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload User File</ModalHeader>
          <ModalBody pb={6}>
            <UserFileForm
            onCancel={closeUploadFileModal}
            onUpload={uploadUserFile}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UserFilesPage