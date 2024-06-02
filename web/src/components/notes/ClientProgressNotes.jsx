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
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

const ClientProgressNotes = ({ notes, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
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
    </>
  );
};

export default ClientProgressNotes;
