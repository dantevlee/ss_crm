import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import ProgressNotesForm from "../forms/ProgressNotesForm";

const ProgressNotes = ({ notes, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDeleteModal = () => {
    onOpen();
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    onClose();
    setIsDeleting(false);
  };

  const handleDelete = () => {
    onDelete(notes.id);
    onClose();
  };

  const openEditModal = () => {
    onOpen();
    setIsEditing(true);
  };

  const closeEditModal = () => {
    onClose();
    setIsEditing(false);
  };

  const handleEdit = (formData) => {
    onEdit(formData, notes.id);
    closeEditModal();
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
            <ModalBody>Permanently Delete Note: {notes.title}?</ModalBody>
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
              <ProgressNotesForm
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

export default ProgressNotes;
