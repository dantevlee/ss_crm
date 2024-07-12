import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ProgressNotesForm from "../forms/ProgressNotesForm";
import Cookies from "js-cookie";
import axios from "axios";

const ProgressNotes = ({ notes, onDelete, onNoteEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("SessionID");

  const editNote = async (formData) => {
    try {
    setLoading(true)
     await axios
        .put(`http://localhost:3000/api/update/note/${notes.id}`, formData, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res.status === 200) { console.log(res.data)
            onNoteEdit(res.data)
            closeEditModal()
          }
        });
    } catch (error) {
      setErrorMessage(error.response.data.message)
      setShowAlert(true)
      console.error(error);
    } finally{
      setLoading(false)
    }
  };

  const deleteNote = async () => {
    try {
      setLoading(true)
      await axios
        .delete(`http://localhost:3000/api/delete/note/${notes.id}`,  {
          headers: {
            Authorization: `${token}`,
          },
        } )
        .then((res) => {
          if (res.status === 200) {
            onDelete(notes.id)
            onClose();
            setDeleteErrorMessage("")
          }
        });
    } catch (error) {
      setDeleteErrorMessage(error.response.data.message)
      console.error(error);
    } finally{
      setLoading(false)
    }
  };

  const openDeleteModal = () => {
    onOpen();
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    if(deleteErrorMessage){
      setDeleteErrorMessage("")
    }
    onClose();
    setIsDeleting(false);
  };

  const openEditModal = () => {
    onOpen();
    setIsEditing(true);
  };

  const closeEditModal = () => {
    onClose();
    if(showAlert){
      setShowAlert(false)
    }
    setIsEditing(false);
  };

  const handleEdit = (formData) => {
    editNote(formData);
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
  };

  return (
    <>
      <Accordion marginStart='25px' allowToggle>
        <AccordionItem backgroundColor='#feff9c' borderWidth="2px" borderColor="white.600"  >
          <h2>
            <AccordionButton>
              <Box
                display="flex"
                alignItems="center"
              >
                <Box alignItems='center'  flex="1">
                  <Text maxWidth="150px" fontWeight='bold' fontFamily="monospace" fontSize='md' textTransform="uppercase">
                {notes.version === "0"
                    ? formatDate(notes.created_at)
                    : formatDate(notes.updated_at)}:{" "}
                  {notes.title}
                  </Text>
                </Box>
                <Box>
                  <Tooltip label="Edit Note">
                    <IconButton
                      onClick={openEditModal}
                      ml={2}
                      size="xs"
                      colorScheme="green"
                      icon={<EditIcon />}
                    />
                  </Tooltip>
                  <Tooltip label="Delete Note">
                    <IconButton
                      onClick={openDeleteModal}
                      ml={2}
                      size="xs"
                      colorScheme="red"
                      icon={<DeleteIcon />}
                    />
                  </Tooltip>
                </Box>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel maxWidth="275px" pb={4}><Text marginLeft="20px" fontFamily="initial">{notes.text}</Text></AccordionPanel>
        </AccordionItem>
      </Accordion>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Permanently Delete Note: {notes.title}?</ModalHeader>
            {deleteErrorMessage && (
              <ModalBody>
                <Alert status="error" mt={showAlert ? 4 : 0}>
                  <AlertIcon />
                  <AlertDescription>{deleteErrorMessage}</AlertDescription>
                </Alert>
                </ModalBody>
              )}
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={deleteNote}>
              {loading ? <Spinner size="md" thickness="4px" /> : "Confirm"}
              </Button>
              <Button colorScheme="red" mr={3} onClick={closeDeleteModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {isEditing && (
        <Modal isOpen={isOpen} onClose={closeEditModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ProgressNotesForm
                formValues={notes}
                onCancel={closeEditModal}
                onEdit={handleEdit}
                onLoading={loading} 
                onAlert={showAlert} 
                onErrorMessage={errorMessage}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProgressNotes;
