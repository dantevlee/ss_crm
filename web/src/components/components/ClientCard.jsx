import { DeleteIcon, EditIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  StackDivider,
  Text,
  IconButton,
  CardHeader,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import ClientForm from "./ClientForm";

const ClientCard = ({ client, onDelete, onEdit, onArchive }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openDeleteModal = () => {
    onOpen();
    setIsDeleting(true);
  };

  const openEditModal = () => {
    onOpen();
    setIsEditing(true);
  };

  const openArchiveModal = () => {
    onOpen();
  };

  const closeDeleteModal = () => {
    onClose();
    setIsDeleting(false);
  };

  const closeEditModal = () => {
    onClose();
    setIsEditing(false);
  };

  const closeArchiveModal = () => {
    onClose()
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

  const handleDelete = () => {
    onDelete(client.id);
    onClose();
  };

  const handleEdit = (formData) => {
    onEdit(formData, client.id);
    closeEditModal();
  };

  const handleArchive = (archiveIndicator) => {
    onArchive(archiveIndicator, client.id);
    closeEditModal();
  };

  const handleArchiveToActive = (archiveIndicator) => {
    onArchive(archiveIndicator, client.id)
    closeEditModal();
  }

  return (
    <>
      <Card>
        <CardHeader>
          {client.is_archived === "Y" ? (
            <IconButton
              onClick={openArchiveModal}
              variant="outline"
              colorScheme="teal"
              icon={<UnlockIcon />}
            ></IconButton>
          ) : (
            <IconButton
              onClick={openEditModal}
              variant="outline"
              colorScheme="teal"
              icon={<EditIcon />}
            ></IconButton>
          )}

          <IconButton
            onClick={openDeleteModal}
            variant="outline"
            colorScheme="teal"
            icon={<DeleteIcon />}
          ></IconButton>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Client Name
              </Heading>
              <Text pt="2" fontSize="sm">
                {client.firstName} {client.lastName}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Email
              </Heading>
              <Text pt="2" fontSize="sm">
                {client.client_email}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Start Date
              </Heading>
              <Text pt="2" fontSize="sm">
                {formatDate(client.start_date)}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                End Date
              </Heading>
              <Text pt="2" fontSize="sm">
                {formatDate(client.end_date)}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />

          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Delete Client: {client.firstName} {client.lastName}?
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
              <ClientForm
                clientFormValue={client}
                onCancel={closeEditModal}
                onEdit={handleEdit}
                onArchive={handleArchive}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {client.is_archived === "Y" && (
        <Modal isOpen={isOpen} onClose={closeArchiveModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Convert {client.firstName} {client.lastName} To Active Client?
            </ModalBody>
            <ModalFooter>
              <Button value='N' colorScheme="blue" mr={3} onClick={handleArchiveToActive}>
                Confirm
              </Button>
              <Button colorScheme="red" mr={3} onClick={closeArchiveModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ClientCard;
