import { Button, Flex, FormControl, FormLabel, Input, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ClientProgressNotesForm = ({onCancel, onSave, onEdit, formValues}) => {
  const [noteInput, setNoteInput] = useState("")
  const [titleInput, setTitleInput] = useState("")
  const [isEditingEntry, setIsEditingEntry] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(()=> {
    if (formValues){
       setTitleInput(formValues.title)
       setNoteInput(formValues.text)
       setCharCount(formValues.text.length)
       setIsEditingEntry(true)
    }
  }, [])

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
    noteTitle: titleInput,
    noteText: noteInput
  }

  if(isEditingEntry){
    onEdit(formData, formValues.id)
  } else {
    onSave(formData)
  }
 
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
        value={noteInput}
      />
      <Text mt={2} align="right">{charCount}/500</Text>
      <Flex mt={6} justifyContent="flex-start">
      <Button 
      onClick={handleNotesSubmission} 
      colorScheme="blue"> 
      {isEditingEntry ? "Update" : "Save"}
      </Button>
      <Button ml={3} colorScheme="gray" onClick={handleCancel}>Cancel</Button>
      </Flex>
    </>
  )
}

export default ClientProgressNotesForm;