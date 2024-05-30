import { Button, Flex, Text, Textarea } from "@chakra-ui/react";

const ClientProgressNotesForm = ({onCancel}) => {

  const handleCancel = () => {
    onCancel()
  }

  return (
    <>
     <Text mb='8px'>Note:</Text>
      <Textarea
        placeholder='Add Note..'
        size="lg" // Adjusts the size of the Textarea
        height="200px" // Adjusts the height of the Textarea
      />
      <Flex mt={6} justifyContent="flex-start">
      <Button colorScheme="blue">Save</Button>
      <Button ml={3} colorScheme="gray" onClick={handleCancel}>Cancel</Button>
      </Flex>
    </>
  )
}

export default ClientProgressNotesForm;