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

const ArchiveCard = () => {

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false)
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
    setIsRestoring(true)
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
    setIsRestoring(false)
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

  const handleArchiveToActive = () => {
    onRestore(client.id)
    closeEditModal();
  }
  return (
    <>
    </>
  )
}

export default ArchiveCard