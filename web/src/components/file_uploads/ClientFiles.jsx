import { Button, Flex, Input } from "@chakra-ui/react";

const ClientFiles = ({ onCancel }) => {
  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Input mt={8} type="file" />
      <Flex mt={6} justifyContent="flex-start">
        <Button colorScheme="blue">Save</Button>
        <Button ml={3} colorScheme="gray" onClick={handleCancel}>
          Cancel
        </Button>
      </Flex>
    </>
  );
};

export default ClientFiles;
