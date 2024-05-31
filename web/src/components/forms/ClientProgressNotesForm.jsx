import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const ClientProgressNotesForm = ({onCancel, onSave}) => {
  const [noteInput, setNoteInput] = useState("")
  const [charCount, setCharCount] = useState(0)

  const token = Cookies.get("SessionID");

  const handleNoteInputChange = (e) => {
    const value = e.target.value
    setNoteInput(value)
    setCharCount(value.length)
  }

  const handleCancel = () => {
    onCancel()
  }

 const handleNotesSubmission = () => {
  const formData = {
    noteText: noteInput
  }
  onSave(formData)
 }

  return (
    <>
     <Text mb='8px'>Note:</Text>
      <Textarea
        onChange={handleNoteInputChange}
        placeholder='Add Note..'
        size="lg"
        height="200px" 
      />
      <Text mt={2} align="right">{charCount}/500</Text>
      <Flex mt={6} justifyContent="flex-start">
      <Button onClick={handleNotesSubmission} colorScheme="blue">Save</Button>
      <Button ml={3} colorScheme="gray" onClick={handleCancel}>Cancel</Button>
      </Flex>
    </>
  )
}

export default ClientProgressNotesForm;