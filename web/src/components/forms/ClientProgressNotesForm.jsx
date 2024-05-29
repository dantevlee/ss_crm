import { Text, Textarea } from "@chakra-ui/react";

const ClientProgressNotesForm = () => {

  return (
    <>
     <Text mb='8px'>Progress Note:</Text>
      <Textarea
        placeholder='Here is a sample placeholder'
        size='lg'
      />
    </>
  )
}

export default ClientProgressNotesForm;