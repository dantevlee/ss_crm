import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ClientProgressNotesForm from "../forms/ClientProgressNotesForm";

const ClientProgressNotes = ({ notes, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDeleteModal = () => {
    onOpen();
    setIsDeleting(true);
  }

  const closeDeleteModal = () => {
    onClose()
    setIsDeleting(false)
  }

  const handleDelete = () => {
    onDelete(notes.id);
    onClose();
  };

  const openEditModal = () => {
    onOpen()
    setIsEditing(true)
  }

  const closeEditModal = () => {
    onClose()
    setIsEditing(false)
  }

  const handleEdit = (formData) => {
    onEdit(formData, notes.id)
    closeEditModal()
  }

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
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box>
                {notes.title}:{" "}
                {notes.version === "0"
                  ? formatDate(notes.created_at)
                  : formatDate(notes.updated_at)}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            {notes.text}
            <Tooltip label="Edit Note">
              <IconButton
                onClick={openEditModal}
                ml={2}
                size="xs"
                variant="outline"
                colorScheme="teal"
                icon={<EditIcon/>}
              >

              </IconButton>
            </Tooltip>
            <Tooltip label="Delete Note">
              <IconButton
                onClick={openDeleteModal}
                ml={2}
                size="xs"
                variant="outline"
                colorScheme="teal"
                icon={<DeleteIcon />}
              ></IconButton>
            </Tooltip>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Delete Note Entitled: {notes.title} ?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleDelete}>
                Confirm
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
              <ClientProgressNotesForm
              formValues={notes}
              onCancel={closeEditModal}
              onEdit={handleEdit}
              />
            </ModalBody>
           </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ClientProgressNotes;
