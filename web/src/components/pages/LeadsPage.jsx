import { AddIcon } from "@chakra-ui/icons"
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { useState } from "react";
import LeadsForm from "../components/LeadsForm";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return(
    <>
    <Button
        size="lg"
        colorScheme="teal"
        mt={6}
        position="relative"
        left="88rem"
        onClick={onOpen}
      >
        <AddIcon mr={2} /> Add Lead
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Lead</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <LeadsForm/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LeadsPage