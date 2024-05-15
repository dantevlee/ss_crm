import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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

const ClientCard = ({ client, onDelete, onEdit}) => {
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

  const closeDeleteModal = () => {
    onClose();
    setIsDeleting(false);
  };

  const closeEditModal = () => {
    onClose();
    setIsEditing(false);
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

  const handleDelete = () => {
    onDelete(client.id);
    onClose();
  };

   const handleEdit = (formData) => { 
    onEdit(formData, client.id);
    closeEditModal();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <IconButton
            onClick={openEditModal}
            variant="outline"
            colorScheme="teal"
            icon={<EditIcon />}
          ></IconButton>
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
              <ClientForm clientFormValue={client} onCancel={closeEditModal} onEdit={handleEdit} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ClientCard;
