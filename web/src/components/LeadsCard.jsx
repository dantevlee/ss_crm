import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import LeadsForm from "./LeadsForm";

const LeadsCard = ({ lead, onDelete }) => {
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
    onDelete(lead.id);
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
                Lead Name
              </Heading>
              <Text pt="2" fontSize="sm"></Text>
              {lead.firstName} {lead.lastName}
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Last Contacted
              </Heading>
              <Text pt="2" fontSize="sm">
                {formatDate(lead.last_contacted_at)}
              </Text>
            </Box>
            {lead.client_email && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Email
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.client_email}
                </Text>
              </Box>
            )}
            {lead.phone_number && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Phone Number
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.phone_number}
                </Text>
              </Box>
            )}
            {lead.social_media_source && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.social_media_source}
                </Text>
              </Box>
            )}
            {lead.social_media && (
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Social Media Handle
                </Heading>
                <Text pt="2" fontSize="sm">
                  {lead.social_media}
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
              Delete Lead: {lead.firstName} {lead.lastName}?
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
             <LeadsForm onCancel={closeEditModal} leadsFormData={lead}/>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
 
    </>
  );
};

export default LeadsCard;
