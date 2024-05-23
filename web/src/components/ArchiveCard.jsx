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
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import ClientForm from "./ClientForm";

const ArchiveCard = ({ archives, onRestore }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
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
    setIsRestoring(true);
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
    onClose();
    setIsRestoring(false);
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
    onEdit(formData, archives.id);
    closeEditModal();
  };

  const handleArchiveToActive = () => {
    onRestore(archives.id);
    closeEditModal();
  };
  return (
    <>
      <Card>
        <CardHeader>
          <Tooltip label="Convert To Client">
            <IconButton
              onClick={openArchiveModal}
              variant="outline"
              colorScheme="teal"
              icon={<UnlockIcon />}
            ></IconButton>
          </Tooltip>
          <Tooltip label="Edit">
            <IconButton
              onClick={openEditModal}
              variant="outline"
              colorScheme="teal"
              icon={<EditIcon />}
            ></IconButton>
          </Tooltip>
          <Tooltip label="Delete">
            <IconButton
              onClick={openDeleteModal}
              variant="outline"
              colorScheme="teal"
              icon={<DeleteIcon />}
            ></IconButton>
          </Tooltip>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Client Name
              </Heading>
              <Text pt="2" fontSize="sm">
                {archives.firstName} {archives.lastName}
              </Text>
            </Box>
            (
            {archives.client_email && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Email
                </Heading>
                <Text pt="2" fontSize="sm">
                  {archives.client_email}
                </Text>
              </Box>
            )}
            ) (
            {archives.start_date && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Start Date
                </Heading>
                <Text pt="2" fontSize="sm">
                  {formatDate(archives.start_date)}
                </Text>
              </Box>
            )}
            ) (
            {archives.end_date && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  End Date
                </Heading>
                <Text pt="2" fontSize="sm">
                  {formatDate(archives.end_date)}
                </Text>
              </Box>
            )}
            )
            {archives.phone_number && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Phone Number
                </Heading>
                <Text pt="2" fontSize="sm">
                {archives.phone_number}
              </Text>
              </Box>
            )}
            {archives.last_contacted_at && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Last Contacted
                </Heading>
                <Text pt="2" fontSize="sm">
                {formatDate(archives.last_contacted_at)}
              </Text>
              </Box>
            )}
            {archives.social_media_source && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media
                </Heading>
                <Text pt="2" fontSize="sm">
                {archives.social_media_source}
              </Text>
              </Box>
            )}
             {archives.social_media && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media Handle
                </Heading>
                <Text pt="2" fontSize="sm">
                {archives.social_media}
              </Text>
              </Box>
            )}
          </Stack>
        </CardBody>
      </Card>
      {isDeleting && (
        <Modal isOpen={isOpen} onClose={closeDeleteModal}>
          <ModalOverlay />

          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Delete Archive: {archives.firstName} {archives.lastName}?
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
                clientFormValue={archives}
                onCancel={closeEditModal}
                onEdit={handleEdit}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isRestoring && (
        <Modal isOpen={isOpen} onClose={closeArchiveModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Convert {archives.firstName} {archives.lastName} To Active Client?
            </ModalBody>
            <ModalFooter>
              <Button
                value="N"
                colorScheme="blue"
                mr={3}
                onClick={handleArchiveToActive}
              >
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

export default ArchiveCard;
