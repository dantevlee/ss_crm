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
import LeadsForm from "./LeadsForm";
import ArchiveForm from "./ArchiveForm";

const ArchiveCard = ({ archives, onRestore, onDelete, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isRestoringAsLead, setIsRestoringAsLead] = useState(false);
  const [isRestoringAsClient, setIsRestoringAsClient] = useState(false);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  
  const {
    isOpen: isRestoreOpen,
    onOpen: onRestoreOpen,
    onClose: onRestoreClose,
  } = useDisclosure();
  
  const {
    isOpen: isRestoreClientOpen,
    onOpen: onRestoreClientOpen,
    onClose: onRestoreClientClose,
  } = useDisclosure();
  
  const {
    isOpen: isRestoreLeadOpen,
    onOpen: onRestoreLeadOpen,
    onClose: onRestoreLeadClose,
  } = useDisclosure();

  const openDeleteModal = () => {
    onDeleteOpen();
    setIsDeleting(true);
  };

  const openEditModal = () => {
    onEditOpen();
    setIsEditing(true);
    setIsRestoring(false)
  };

  const openArchiveModal = () => {
    onRestoreOpen();
    setIsRestoring(true);
  };

  const closeDeleteModal = () => {
    onDeleteClose();
    setIsDeleting(false);
  };

  const closeEditModal = () => {
    onEditClose();
    setIsEditing(false);
  };

  const closeArchiveModal = () => {
    onRestoreClose();
    setIsRestoring(false);
  };

  const handleDelete = () => {
    onDelete(archives.id);
    closeDeleteModal();
  };

  const handleEdit = (formData) => {
    onEdit(formData, archives.id);
    closeEditModal();
  };

  const handleArchiveToClient = () => {
    onRestoreClientOpen();
    setIsRestoringAsClient(true);
    closeArchiveModal()
  };

  const handleArchiveToLead = () => {
    onRestoreLeadOpen();
    setIsRestoringAsLead(true);
    closeArchiveModal()
  };

  const closeClientForm = () => {
    onRestoreClientClose();
    onRestoreClose()
    setIsRestoringAsClient(false);
  };

  const closeLeadForm = () => {
    onRestoreLeadClose();
    onRestoreClose()
    setIsRestoringAsLead(false);
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
      <Card>
        <CardHeader>
          <Tooltip label="Restore">
            <IconButton
              onClick={openArchiveModal}
              variant="outline"
              colorScheme="teal"
              icon={<UnlockIcon />}
            />
          </Tooltip>
          <Tooltip label="Edit">
            <IconButton
              onClick={openEditModal}
              variant="outline"
              colorScheme="teal"
              icon={<EditIcon />}
            />
          </Tooltip>
          <Tooltip label="Delete">
            <IconButton
              onClick={openDeleteModal}
              variant="outline"
              colorScheme="teal"
              icon={<DeleteIcon />}
            />
          </Tooltip>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Name
              </Heading>
              <Text pt="2" fontSize="sm">
                {archives.firstName} {archives.lastName}
              </Text>
            </Box>
            {archives.email && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Email
                </Heading>
                <Text pt="2" fontSize="sm">
                  {archives.email}
                </Text>
              </Box>
            )}
            {archives.last_active_date && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Last Active Date
                </Heading>
                <Text pt="2" fontSize="sm">
                  {formatDate(archives.last_active_date)}
                </Text>
              </Box>
            )}
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
            {archives.soical_media && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media Handle
                </Heading>
                <Text pt="2" fontSize="sm">
                  {archives.soical_media}
                </Text>
              </Box>
            )}
          </Stack>
        </CardBody>
      </Card>

      {isDeleting && (
        <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal}>
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
        <Modal isOpen={isEditOpen} onClose={closeEditModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ArchiveForm
                archiveFormValue={archives}
                onCancel={closeEditModal}
                onEdit={handleEdit}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {isRestoring && (
        <Modal isOpen={isRestoreOpen} onClose={closeArchiveModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              Restore {archives.firstName} {archives.lastName} As..?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleArchiveToClient}>
                Client
              </Button>
              <Button colorScheme="green" mr={3} onClick={handleArchiveToLead}>
                Lead
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isRestoringAsLead && (
        <Modal isOpen={isRestoreLeadOpen} onClose={closeLeadForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <LeadsForm
                onRestore={isRestoringAsLead}
                onCancel={closeLeadForm}
                leadsFormData={archives}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {isRestoringAsClient && (
        <Modal isOpen={isRestoreClientOpen} onClose={closeClientForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <ClientForm
                onRestore={isRestoringAsClient}
                clientFormValue={archives}
                onCancel={closeClientForm}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ArchiveCard;
