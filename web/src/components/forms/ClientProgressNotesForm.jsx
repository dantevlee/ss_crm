import { Button, Flex, FormControl, FormLabel, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const ClientProgressNotesForm = ({onCancel, onSave}) => {
  const [noteInput, setNoteInput] = useState("")
  const [titleInput, setTitleInput] = useState("")
  const [charCount, setCharCount] = useState(0)

  const handleNoteInputChange = (e) => {
    const value = e.target.value
    setNoteInput(value)
    setCharCount(value.length)
  }

  const handleTitleInputChange = (e) => {
    setTitleInput(e.target.value)
  }

  const handleCancel = () => {
    onCancel()
  }

 const handleNotesSubmission = () => {
  const formData = {
    noteText: noteInput,
    noteTitle: titleInput
  }
  onSave(formData)
 }

  return (
    <>
      <FormControl mt={4}>
        <FormLabel>Title:</FormLabel>
        <Input
          onChange={handleTitleInputChange}
          placeholder="Title"
          value={titleInput}
        />
      </FormControl>
      <FormLabel mt={4}>Note:</FormLabel>
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